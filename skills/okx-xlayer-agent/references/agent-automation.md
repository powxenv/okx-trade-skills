# Agent Automation Playbook

> Load this file when building autonomous trading agents, configuring automated workflows, or enabling silent/automated execution modes. This reference covers decision logic, monitoring patterns, and the rules for safe autonomous agent operation.

## Table of Contents

1. Agent Architecture Overview
2. Autonomous Decision Logic
3. Monitoring Loops & Triggers
4. Silent Mode Rules
5. Agent Risk Limits
6. Common Agent Workflows
7. X402 & Inter-Agent Communication

---

## 1. Agent Architecture Overview

An autonomous trading agent operates in a continuous sense-decide-act loop:

```
┌─────────────────────────────────────────────────┐
│                  SENSE                           │
│  Market data, portfolio state, signals,         │
│  smart money activity, price changes             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                 DECIDE                           │
│  Security scan → Risk assessment → Sizing         │
│  → Strategy selection → Approval check            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                  ACT                             │
│  Execute swap, deposit, withdraw, bridge         │
│  → Monitor result → Log outcome                   │
└──────────────────┬──────────────────────────────┘
                   │
                   └─── Loop ────────────────────┘
```

### Minimum Agent Components

1. **Market Monitor** — watches prices, signals, on-chain events
2. **Decision Engine** — applies rules from risk-framework, decision-framework, trading-strategies
3. **Execution Engine** — uses Onchain OS CLI to execute trades
4. **State Tracker** — maintains portfolio state, PnL, open positions
5. **Logger** — records every action for audit trail

---

## 2. Autonomous Decision Logic

### Decision Hierarchy (Mandatory)

Every autonomous decision MUST pass through these gates in order:

```
Gate 1: SECURITY → onchainos security token-scan
   FAIL (isHoneyPot=true, action="block") → STOP. Do not trade.
   PASS → Gate 2

Gate 2: LIQUIDITY → onchainos token liquidity
   FAIL (<$1K) → STOP. Cannot exit safely.
   PASS → Gate 3

Gate 3: POSITION SIZING → calculate from risk-management.md
   FAIL (would exceed 2% risk/trade or 6% portfolio heat) → SKIP. Wait for next opportunity.
   PASS → Gate 4

Gate 4: STRATEGY FIT → does this match the agent's configured strategy?
   FAIL → SKIP.
   PASS → Gate 5

Gate 5: USER APPROVAL (if required) → see Silent Mode Rules below
   BLOCK-level risk → MUST halt and notify user even in auto mode
   WARN-level risk → proceed if auto-approve-warn is enabled
   No risk flag → proceed automatically
```

### Approval Matrix

| Risk Level | Auto Mode | Semi-Auto Mode | Manual Mode |
|---|---|---|---|
| No risk flag | Auto-execute | Auto-execute | Wait for approval |
| `warn` | Auto-execute with logging | Notify + wait 5 min, then auto | Wait for approval |
| `block` | STOP + notify | STOP + notify | STOP + notify |

**The `block` flag is absolute.** No agent should ever bypass a block-level risk, regardless of mode.

---

## 3. Monitoring Loops & Triggers

### Price Monitoring Loop

```bash
# Start WebSocket price monitoring
onchainos ws start --channel price --token-pair <chainIndex>:<tokenAddress>

# Poll for updates (run in loop)
onchainos ws poll --id <session_id>
```

**Trigger conditions**:
- Price drops below stop-loss → execute sell
- Price reaches take-profit target → execute partial or full sell
- Price spike > 10% in 1 hour → evaluate for entry/exit

### Signal Monitoring Loop

```bash
# Monitor smart money signals
onchainos ws start --channel dex-market-new-signal-openapi --chain-index 196,1,501

# Monitor specific wallet activity
onchainos ws start --channel address-tracker-activity --wallet-addresses <watched_wallets>
```

**Trigger conditions**:
- New smart money buy signal for tracked token → evaluate for entry
- Watched wallet sells → evaluate for exit
- Multiple signals on same token → increase conviction level

### Portfolio Monitoring Loop

```bash
# Schedule every 30 minutes (in agent code)
onchainos portfolio all-balances --address <addr> --chains xlayer,ethereum,solana
onchainos market portfolio-recent-pnl --address <addr> --chain xlayer
```

**Trigger conditions**:
- Any position down > 5% from entry → evaluate stop-loss
- DeFi health ratio < 1.5 → add collateral or reduce
- Portfolio heat > 6% → reduce positions

### DeFi Position Monitoring Loop

```bash
# Schedule daily
onchainos defi positions --address <addr> --chains xlayer,ethereum
onchainos defi position-detail --address <addr> --chain xlayer --platform-id <pid>

# Check APY sustainability (weekly)
onchainos defi rate-chart --investment-id <id> --time-range MONTH
```

**Trigger conditions**:
- APY drops > 50% from entry APY → evaluate migration
- TVL drops > 30% → evaluate exit
- Reward token price drops > 40% → evaluate claim and exit
- Health ratio < 2.0 → add collateral

### Polling Intervals

| Monitor | Interval | Rationale |
|---|---|---|
| Price (WebSocket) | Real-time or 10s poll | Price-sensitive strategies |
| Smart money signals | 30s–60s poll | Signal freshness matters |
| Portfolio balances | 5–15 min | Not time-critical |
| DeFi positions | Hourly | DeFi changes slowly |
| Security scan | Once before trade | Only needed on new tokens |
| APY charts | Daily | Yield changes slowly |

---

## 4. Silent Mode Rules

Silent mode (automated execution) enables the agent to trade without human confirmation. It MUST be explicitly authorized.

### Enabling Silent Mode

The user must explicitly opt into silent mode. There are three levels:

| Level | Description | Configuration |
|---|---|---|
| **Manual** | Every trade requires user approval | Default; no auto-execution |
| **Semi-Auto** | Low-risk trades auto-execute; high-risk trades need approval | Set risk thresholds for auto-approval |
| **Full Auto** | All trades auto-execute within defined risk limits | WARNING: requires strict risk limits |

### Required Configuration for Any Auto Mode

Before enabling any silent mode, the following MUST be defined:

```yaml
# Agent configuration (must be set by user)
risk_per_trade_pct: 1.0        # Max % of portfolio risked per trade
max_portfolio_heat_pct: 6.0    # Max total open risk across all positions
max_single_position_pct: 10.0  # Max % of portfolio in one asset
max_daily_trades: 10           # Max number of trades per day
max_daily_loss_pct: 3.0        # Max daily loss as % of portfolio
allowed_chains: [xlayer]       # Chains the agent can trade on
allowed_tokens: [OKB, USDC, ETH]  # Tokens the agent can trade (whitelist)
blocked_tokens: []             # Tokens the agent must NOT trade (blacklist)
stop_loss_pct: 5.0             # Default stop-loss percentage
take_profit_pct: 10.0          # Default take-profit percentage
```

### Auto-Execution Rules (Mandatory)

1. **Block-level risks always halt** — even in full auto mode, `isHoneyPot=true` or `action="block"` stops execution
2. **Daily trade limit** — agent must not exceed `max_daily_trades`
3. **Daily loss limit** — if daily PnL exceeds `max_daily_loss_pct`, agent pauses for 24 hours
4. **Position limit** — agent must not exceed `max_single_position_pct` in any one asset
5. **Execution log** — every silent transaction must be logged with: timestamp, pair, amount, slippage, txHash, status, reasoning
6. **No revenge trading** — after a loss, agent must wait a cooldown period (minimum 5 minutes) before opening a new position
7. **Quote freshness** — re-fetch quote if > 10 seconds elapsed before execution

---

## 5. Agent Risk Limits

### Hard Limits (Cannot Be Overridden)

| Limit | Value | Enforcement |
|---|---|---|
| Max risk per trade | ≤ 2% of portfolio | Check before every trade |
| Max portfolio heat | ≤ 6% | Check total across all positions |
| Honeypot block | isHoneyPot = true → STOP | Security scan before every trade |
| Block action | action = "block" → STOP | Security scan before every trade |
| Daily loss limit | ≤ 5% of portfolio | Pause for 24h if exceeded |
| Token blacklist | Never trade blacklisted tokens | Skip if token in blocked_tokens |
| Maximum slippage | ≤ 20% | Reject quotes with higher impact |

### Soft Limits (Configurable by User)

| Limit | Default | Description |
|---|---|---|
| Risk per trade | 1% | Can be lowered for conservative agents |
| Max daily trades | 10 | Limits over-trading |
| Trade cooldown | 60 seconds | Minimum time between trades |
| Loss cooldown | 5 minutes | Wait after a loss before re-entering |
| Auto-approve warn | false | Whether to auto-execute on warn-level risks |
| MEV protection threshold | $50 | Auto-enable MEV protection above this value |

### Emergency Shutdown Conditions

The agent MUST immediately halt all activity and notify the user if:

1. Daily loss exceeds 5% of portfolio value
2. Any single trade loses more than 3% of portfolio value
3. Portfolio health ratio drops below 1.2 (DeFi positions)
4. Security scan returns `action="block"` on any token in portfolio
5. Failed to get a valid quote for > 3 consecutive attempts
6. Any unexpected error in execution loop (not just a failed trade, but a system error)

---

## 6. Common Agent Workflows

### Workflow A: DCA Agent (Low Risk)

Automated dollar-cost averaging into a target asset.

```
CONFIG:
  target_token: OKB
  target_chain: xlayer
  dca_amount_usd: 10
  frequency: daily
  max_price_deviation: 5%  # skip if price moved >5% since last buy

LOOP:
  1. Check portfolio balance (onchainos portfolio all-balances)
  2. Get current price (onchainos market price)
  3. If price changed > max_price_deviation from last buy, skip
  4. Security scan (skip if same token as last scan, within 24h cache)
  5. Check if portfolio heat allows new position
  6. Execute buy: onchainos swap execute --from USDC --to OKB --readable-amount "10" --chain xlayer --wallet <addr>
  7. Log: timestamp, amount, price, txHash
  8. Wait for next interval
```

### Workflow B: Smart Money Following Agent (Medium Risk)

Monitors smart money signals and executes validated trades.

```
CONFIG:
  follow_types: [smart_money]  # or [smart_money, whale]
  chains: [xlayer, ethereum, solana]
  min_signal_count: 3           # minimum wallets signaling buy
  max_position_per_signal: 0.5% # risk per signal trade
  holding_period: 24h          # minimum hold time

LOOP:
  1. Poll signals: onchainos signal list --chain <chain>
  2. Filter by min_signal_count and wallet-type
  3. For each qualifying token:
     a. Security scan (onchainos security token-scan)
     b. Liquidity check (onchainos token liquidity)
     c. Position sizing (risk/trade per config)
     d. Execute entry (onchainos swap execute)
     e. Set stop-loss and take-profit prices
  4. Monitor open positions:
     - Check price vs. stop/Loss and take-profit
     - If stop-loss hit, execute exit
     - If take-profit hit, execute partial or full exit
  5. Clean up expired signals
  6. Wait 30 seconds, then loop
```

### Workflow C: DeFi Yield Harvester (Low–Medium Risk)

Auto-compounds DeFi rewards and rotates to highest-yield positions.

```
CONFIG:
  chains: [xlayer]
  min_claim_value_usd: 0.50  # X Layer gas is near-zero, can claim tiny amounts
  max_apY_deviation: 25%      # migrate if APY drops 25% from entry
  target_tokens: [USDC, OKB, ETH]

DAILY LOOP:
  1. Check all DeFi positions: onchainos defi positions
  2. For each position:
     a. Check claimable rewards: onchainos defi position-detail
     b. If claimable > min_claim_value_usd:
        - Claim rewards: onchainos defi collect
        - Swap rewards to deposit token: onchainos swap execute
        - Re-deposit: onchainos defi invest
  3. Compare current APY vs. entry APY (defi rate-chart)
     - If APY dropped > max_apY_deviation:
       - Search for better yield: onchainos defi search
       - If better option found (higher APY, similar risk):
         - Withdraw from current: onchainos defi withdraw
         - Deposit in new: onchainos defi invest
  4. Log all actions
```

### Workflow D: Arbitrage Agent (Medium–High Risk)

Monitors price discrepancies across chains/DEXes and executes when profitable.

```
CONFIG:
  chains: [xlayer, ethereum, base, bsc]
  min_profit_usd: 1.00
  min_profit_pct: 0.5%
  max_position_per_trade: 1%

LOOP:
  1. For each tracked token:
     a. Get prices across chains: onchainos market prices
     b. Calculate price difference after gas + bridge fees
     c. If profitable (> min_profit_usd AND > min_profit_pct):
        - Buy on cheaper chain
        - Bridge to more expensive chain (if cross-chain)
        - Sell on more expensive chain
        - Log: pairs, chains, amounts, profit
  2. On X Layer: gas is near-zero, so even tiny spreads are profitable
  3. Wait 5 seconds, then loop
```

---

## 7. X402 & Inter-Agent Communication

### X402 Payment Protocol

When your agent needs to pay for API access or other on-chain services, use the x402 payment protocol:

```bash
# Pay for an API request that returns HTTP 402
onchainos payment x402-pay --url <api_url> --chain <chain> --wallet <addr>

# Or sign locally with EIP-3009
onchainos payment eip3009-sign --url <api_url> --chain <chain>
```

### Use Cases for Agent Payment

1. **Premium data feeds**: Pay for real-time market data APIs
2. **Agent-to-agent services**: Pay other agents for analysis, signals, or execution
3. **DeFi automation services**: Pay for auto-compounding, rebalancing, or portfolio management
4. **AI inference**: Pay for AI-powered market analysis or risk scoring

### Agent Interaction Patterns

Agents on X Layer can interact with each other through:

1. **Direct payment** — `onchainos wallet send` for direct value transfer
2. **Smart contract calls** — `onchainos wallet contract-call` for protocol interaction
3. **X402 payment** — `onchainos payment x402-pay` for API/service payment
4. **Signal broadcasting** — other agents can monitor the same WebSocket channels and react to each other's on-chain activity

### Audit Trail Requirements

Every autonomous action must be logged:

```json
{
  "timestamp": "2026-04-10T14:30:00Z",
  "action": "swap_execute",
  "token_pair": "USDC → OKB",
  "chain": "xlayer",
  "amount_usd": 10.00,
  "reason": "DCA scheduled entry",
  "tx_hash": "0x...",
  "status": "success",
  "pnl_impact": "+0.05%",
  "portfolio_heat_after": "3.2%",
  "slippage": "0.12%",
  "mev_protection": false
}
```

This log should be presented to the user upon request or at session end.