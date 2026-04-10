---
name: okx-xlayer-agent
description: "Autonomous agent skill for X Layer — build, trade, earn, and compete on X Layer's zero-gas L2. Use when creating or running an AI agent that autonomously trades, earns yield, pays for services, or interacts with other agents on X Layer (chain 196). Covers automated trading loops, DeFi auto-compounding, self-funding agents via x402, portfolio rebalancing, arbitrage scanning, and agent-to-agent interaction patterns. Designed for the X Layer Build X Hackathon's Skills Arena. Chinese: 自主代理, X Layer交易, 自动交易, 自动复投, 代理赚取, 代理交互."
license: MIT
metadata:
  author: okx
  version: "2.2.7"
  homepage: "https://web3.okx.com"
---

# X Layer Agent Skill

Autonomous agent operations on X Layer — build, trade, earn, and compete. X Layer offers near-zero gas (~$0.0005/tx), 1-second finality, and EVM equivalence, making it the ideal chain for autonomous agents.

## Pre-flight Checks

> Read `_shared/preflight.md` before the first `onchainos` command each session.

## X Layer Quick Reference

| Parameter | Value |
|---|---|
| Chain name | `xlayer` |
| Chain index | `196` |
| Gas token | OKB |
| Native token address | `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` |
| Avg gas cost | ~$0.0005 USD |
| Block time | ~1 second |
| MEV risk | Minimal for trades under ~$2,000 |

> Full chain list: `_shared/chain-support.md`

## Agent Architecture

An autonomous agent operates in a continuous **Sense → Decide → Act** loop. All trading operations use the `okx-trading` skill for execution; this skill provides the automation framework.

```
SENSE (onchainos ws / onchainos market / onchainos signal)
  ↓
DECIDE (risk gates from okx-trading/references/risk-management.md)
  ↓
ACT (onchainos swap / onchainos defi / onchainos wallet / onchainos gateway)
  ↓
LOG (audit trail of every action)
  ↓
LOOP
```

## Core Agent Commands

### Market Monitoring

| Command | Purpose | Poll Interval |
|---|---|---|
| `onchainos ws start --channel price --token-pair 196:<addr>` | Real-time token price | Continuous |
| `onchainos ws start --channel dex-market-new-signal-openapi --chain-index 196` | Smart money buy signals | Continuous |
| `onchainos ws start --channel address-tracker-activity --wallet-addresses <addr>` | Watch specific wallets | Continuous |
| `onchainos market price --address <addr> --chain xlayer` | Single price check | On-demand |
| `onchainos market kline --address <addr> --chain xlayer` | Price history | Hourly |
| `onchainos token hot-tokens --chain xlayer` | Trending tokens on X Layer | 5 min |
| `onchainos signal list --chain xlayer` | Aggregated buy signals | 30–60s |

### Trading Execution

| Command | Purpose |
|---|---|
| `onchainos swap execute --chain xlayer --wallet <addr> ...` | One-shot swap on X Layer |
| `onchainos swap quote --chain xlayer ...` | Price check before execution |
| `onchainos security token-scan --address <addr> --chain xlayer` | Security gate before every buy |

### DeFi Yield

| Command | Purpose |
|---|---|
| `onchainos defi search --token <token> --chain xlayer` | Find yield products |
| `onchainos defi invest --chain xlayer ...` | Deposit into DeFi |
| `onchainos defi collect --chain xlayer ...` | Claim rewards |
| `onchainos defi withdraw --chain xlayer ...` | Withdraw from DeFi |

### Portfolio & Balance

| Command | Purpose |
|---|---|
| `onchainos wallet status` | Check login and policy |
| `onchainos wallet balance --chain 196` | X Layer balance |
| `onchainos portfolio all-balances --address <addr> --chains xlayer` | Portfolio overview |
| `onchainos market portfolio-recent-pnl --address <addr> --chain xlayer` | PnL snapshot |

### Payments & Agent-to-Agent

| Command | Purpose |
|---|---|
| `onchainos payment x402-pay --chain xlayer ...` | Pay for API access (HTTP 402) |
| `onchainos payment eip3009-sign --chain xlayer ...` | Local payment signing |
| `onchainos wallet send --readable-amount <amt> --receipt <addr> --chain 196` | Direct transfer to another agent |

## Automation Rules

### Mandatory Risk Gates

Every autonomous trade MUST pass through these gates in order:

1. **Security gate**: `onchainos security token-scan` → if `isHoneyPot=true` or `action="block"`, HALT
2. **Liquidity gate**: `onchainos token liquidity` → if < $1K, HALT; if < $10K, WARN
3. **Position sizing**: max 2% risk per trade, 6% total portfolio heat
4. **Strategy gate**: does this match the agent's configured strategy?

Complete risk rules: see `references/agent-automation.md`

### X Layer-Specific Optimizations

- **No MEV protection needed** for trades under ~$2,000 on X Layer (gas is ~$0.0005)
- **Gas-free transfers**: OKB transfers cost nothing — use for micro-DCA and frequent rebalancing
- **1-second finality**: real-time strategies become viable — no 12-second wait
- **Auto-compounding is profitable**: even $0.01 rewards are worth claiming when gas is ~$0.001
- **Frequent rebalancing**: portfolio rebalancing costs ~$0.002 per cycle — viable to rebalance hourly

### Agent Configuration

Before running in autonomous mode, define these parameters:

```yaml
# Required configuration
risk_per_trade_pct: 1.0
max_portfolio_heat_pct: 6.0
max_single_position_pct: 10.0
max_daily_trades: 10
max_daily_loss_pct: 5.0
allowed_chains: [xlayer]
allowed_tokens: []  # empty = all; or whitelist: [OKB, USDC, ETH]
blocked_tokens: []
stop_loss_pct: 5.0
auto_mode: manual  # manual | semi-auto | full-auto
```

## Example Agent Patterns

### Pattern 1: DCA Agent

```bash
# Every N hours, buy a fixed amount of a target token
onchainos swap execute \
  --from 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee \
  --to <target_token> \
  --readable-amount "10" \
  --chain xlayer \
  --wallet <addr>
```

See `references/agent-automation.md` for the full DCA loop with security gates and logging.

### Pattern 2: Smart Money Follower

```bash
# Monitor signals, validate, and execute
onchainos signal list --chain xlayer --wallet-type 1  # smart money only
# → filter by min-address-count and min-amount-usd
# → security scan qualifying tokens
# → execute with position sizing
```

### Pattern 3: DeFi Auto-Compounder

```bash
# Daily: check for claimable rewards, claim, swap, redeposit
onchainos defi positions --address <addr> --chains xlayer
onchainos defi position-detail --address <addr> --chain xlayer --platform-id <pid>
onchainos defi collect --address <addr> --chain xlayer --reward-type <type>
onchainos swap execute --from <reward_token> --to <deposit_token> --chain xlayer --wallet <addr>
onchainos defi invest --investment-id <id> --address <addr> --token <token> --amount <amt> --chain xlayer
```

### Pattern 4: X402 Self-Funding Agent

```bash
# Agent pays for premium data via x402
onchainos payment x402-pay --chain xlayer --wallet <addr> --url <api_url>
# Agent receives payment from other agents
onchainos wallet balance --chain 196  # check incoming payments
```

## Additional Resources

| Topic | File |
|---|---|
| Agent automation playbook | `references/agent-automation.md` |
| X Layer trading strategies | `references/xlayer-strategies.md` (in okx-trading skill) |
| Uniswap integration guide | `references/uniswap-integration.md` (in okx-trading skill) |
| Risk management framework | `references/risk-management.md` (in okx-trading skill) |
| Decision framework & checklists | `references/decision-framework.md` (in okx-trading skill) |
| Trading strategies & position sizing | `references/trading-strategies.md` (in okx-trading skill) |
| Pre-flight checks | `_shared/preflight.md` |
| Chain support | `_shared/chain-support.md` |

For the full trading skill with all 30+ CLI commands, security scanning, market analysis, and wallet operations, load the `okx-trading` skill.