# Trading Strategies Reference

> Load this file when the user asks about trading strategy, position sizing, entry/exit methods, or how to approach a trade.

## Table of Contents

1. Position Sizing
2. Entry Strategies
3. Exit Strategies
4. Strategy Types
5. DeFi Yield Strategies
6. Strategy Selection Guide

---

## 1. Position Sizing

### The 1-2% Rule

Never risk more than 1-2% of total portfolio on a single trade.

- **Large-cap crypto (BTC/ETH)**: Risk 0.5–1% per trade
- **Mid-cap altcoins**: Risk 0.25–0.5% per trade
- **Meme / speculative tokens**: Risk 0.1–0.25% per trade

**Formula**:
```
Position Size = (Account Balance × Risk %) / (Entry Price - Stop Loss Price)
```

**Example**: $10,000 account, 1% risk, BTC entry at $45,000, stop at $43,500:
- Risk amount = $10,000 × 0.01 = $100
- Position = $100 / $1,500 = 0.0667 BTC ($3,000 position value, $100 risked)

### The 3-5-7 Rule

A practical framework for crypto:

| Rule | What It Controls | Example ($10,000 Account) |
|---|---|---|
| 3% max risk per trade | Max loss if stopped out | $300 max loss per position |
| 5% total portfolio exposure | Total open risk across all positions | $500 max total open risk |
| 7% profit target minimum | Min risk/reward ratio | $700 min profit target |

**Why these numbers**: 3% cap means 10 consecutive losses still leaves ~74% of capital. 5% total exposure prevents correlated positions from blowing up together. 7% target gives >2:1 risk/reward when paired with 3% risk.

### Volatility-Adjusted Sizing

Position size should scale inversely with volatility. Higher volatility = smaller position.

**Steps**:
1. Start with base risk fraction (1% for accounts under $50K, 0.5% for $50K–$500K)
2. Calculate 20-day ATR (Average True Range) as % of price
3. If current ATR > 1.5× its 90-day average → cut base risk in half
4. Check order book depth at stop level; if thin (below 20th percentile) → reduce position by 25%
5. Check total portfolio heat; never exceed 6% across all open positions
6. Execute at final calculated size — no rounding up

### Drawdown Tiers

Reduce position size as drawdowns deepen:

| Drawdown | Action |
|---|---|
| 0–5% | Normal sizing (1–2% risk/trade) |
| 5–10% | Reduce to 0.5–1% risk/trade |
| 10–15% | Reduce to 0.25–0.5% risk/trade |
| >15% | Stop trading. Review system. Paper trade only. |

### Portfolio Heat

Portfolio heat = sum of all potential losses across open positions if every stop fires simultaneously.

- Keep total portfolio heat below **5–6%** at all times
- 5 correlated altcoin positions at 1% risk each = effectively 5% portfolio heat, but due to correlation, the real risk is closer to 10% in a flash crash
- **Correlation adjustment**: Count correlated positions as a single larger position. Five altcoins moving together = one 5% bet on market sentiment.

### Account Size Adjustments

| Account Size | Risk/Trade | Notes |
|---|---|---|
| Under $5,000 | 1–2% ($50–$100) | Fewer, higher-quality setups; focus on deep-liquidity assets |
| $5,000–$50,000 | 1% ($50–$500) | Sweet spot for proper sizing on most assets |
| $50,000–$500,000 | 0.5% ($250–$2,500) | Reduce risk %; DCA into positions |
| Over $500,000 | 0.25–0.5% | Consider OTC desks for large fills to minimize market impact |

---

## 2. Entry Strategies

### Dollar-Cost Averaging (DCA)

Invest a fixed amount at regular intervals regardless of price.

- **Best for**: Long-term accumulation of BTC, ETH, and blue-chip tokens
- **Entry**: Divide total capital by number of planned purchases ($10K over 10 months = $1K/month)
- **DCA-out**: also works for exits — sell 10% weekly or 20% at predefined price targets
- **Advantage**: Removes emotion, smooths volatility, lowers average cost basis
- **On-chain**: `onchainos swap execute` with `--gas-level average` for scheduled buys

### Limit Orders & Manual Entry

For precise entry at a desired price level.

- Set limit buy at a support level or key Fibonacci retracement
- If price doesn't reach, no trade happens — capital is preserved
- Use `onchainos swap quote` first to check expected slippage at that size
- If slippage > 2%, consider splitting the order into smaller pieces

### Scale-In Entry

Instead of entering a full position at once, split into 2–3 entries.

1. Initial entry: 30–40% of target position at 0.5% risk
2. If price drops to next support: add 30–40% at 0.5% risk
3. Final entry: 20–40% on confirmation of trend reversal
4. Average cost basis ends up more favorable; total risk stays controlled

**On-chain**: Execute each scale-in as a separate `onchainos swap execute` call, giving time for price confirmation between entries.

### Smart Money Confirmation Entry

Use signal/tracker data to time entries around whale activity:

1. Monitor `onchainos signal list` for smart money accumulation signals
2. Cross-reference with `onchainos tracker activities --tracker-type smart_money` for transaction-level data
3. Wait for price stabilization after smart money entry (don't FOMO in immediately)
4. Enter on pullback to smart money's average entry or nearest support
5. Set stop below smart money's entry level

---

## 3. Exit Strategies

### Stop-Loss Placement

| Method | Description | Best For |
|---|---|---|
| Percentage-based | Fixed % below entry (2–6% crypto, tighter for BTC, wider for alts) | Beginners, systematic traders |
| ATR-based | 1.5× ATR below entry for longs; adjusts with volatility | Trend-following, all levels |
| Structural | Below support/resistance levels | Technical traders |
| Time-based | Exit if no meaningful move in 48–72 hours | Momentum traders |

**ATR trailing method**:
- Initial stop: 1.5× ATR below entry
- After price moves 1× ATR in your favor → tighten to 1× ATR
- After price moves 2× ATR in your favor → trail at 0.75× ATR
- This gives room early and tightens as the trade matures

### DCA-Out (Scaled Exit)

Mirror of DCA entry — sell fixed portions at intervals or price targets.

- **Time-based**: Sell 10% every week for 10 weeks
- **Target-based**: Sell 20% at target 1, 30% at target 2, 50% at target 3
- Combine with: `onchainos market portfolio-token-pnl` to monitor realized/unrealized profit

### Take-Profit Targets

Minimum risk/reward ratio of 1:2 before entering any trade.

| Target | Action | R-Multiple |
|---|---|---|
| Target 1 | Sell 30–50% of position, move stop to breakeven | 1R |
| Target 2 | Sell 30% of remaining, trail stop tighter | 2R |
| Target 3 | Let remaining 20–40% run with trailing stop | 3R+ |

**On-chain**: After hitting each target, use `onchainos swap execute` with the scaled amount. For partial exits, use `--readable-amount` to sell the exact portion.

### Stop-Loss on Meme/Speculative Tokens

For meme tokens, wider stops are essential:

- Minimum 10–15% stop distance (these tokens routinely move 5–10% in minutes)
- Consider the `--slippage` parameter: for meme tokens, autoSlippage (5–20%) is recommended
- After exit, do NOT immediately re-enter — reassess with `onchainos security token-scan` and `onchainos token liquidity` first

---

## 4. Strategy Types

### Momentum Trading

Buy tokens showing strong upward price movement and increasing volume.

**On-chain workflow**:
1. `onchainos token hot-tokens --chain <chain>` → find trending tokens
2. `onchainos market kline --address <addr> --chain <chain>` → confirm trend
3. `onchainos token liquidity --address <addr> --chain <chain>` → verify liquidity depth
4. `onchainos signal list --chain <chain>` → check if smart money is buying
5. Enter with tight stop, ride momentum, exit on volume exhaustion

### Mean Reversion

Buy tokens that have dropped significantly below their average, expecting a bounce.

- Identify oversold tokens via `onchainos market portfolio-recent-pnl`
- Confirm with `onchainos market kline` showing extended decline
- Check `onchainos token liquidity` — thin liquidity = dangerous for mean reversion
- DCA into position as price continues down; set total position limit

### Smart Money Following

Track and mirror successful wallets.

**On-chain workflow**:
1. `onchainos leaderboard list --chain <chain> --sort-by 1 --time-frame 3` → find top PnL traders
2. `onchainos tracker activities --tracker-type smart_money` → see what they're buying
3. `onchainos signal list --chain <chain>` → aggregated buy signals
4. For each signal token: `onchainos security token-scan` → verify safety
5. Enter only after confirming: token is safe, liquid, and smart money accumulation pattern is clear
6. Set stop below smart money's apparent entry level

**Key rules**:
- Never blindly copy — treat smart money signals as a starting point, not a guarantee
- Validate every signal with independent research (security, liquidity, fundamentals)
- Smart money often enters in sizes that retail can't replicate; scale your position accordingly
- Smart money may exit before you — always have your own stop-loss

### Range Trading

Buy at support, sell at resistance in a ranging market.

1. Use `onchainos market kline` to identify range boundaries
2. `onchainos swap quote` to check slippage at both entry and exit sizes
3. Buy near support with stop below
4. Sell near resistance with take-profit
5. If range breaks — exit immediately, don't average into a breakout against your position

### Yield Farming Strategy

Earn returns by providing liquidity or lending assets.

1. `onchainos defi search --token <token> --chain <chain>` → find products
2. `onchainos defi detail --investment-id <id>` → check APY, TVL, risks
3. `onchainos defi rate-chart --investment-id <id> --time-range MONTH` → check APY sustainability
4. `onchainos defi tvl-chart --investment-id <id> --time-range SEASON` → check TVL stability
5. Manage position per `references/workflow-defi-yield.md`

**APY reality check**:
- APY > 50% → elevated risk (likely relies on emissions, may be unsustainable)
- APY > 100% → very high risk (often new protocol with incentive farming that will crash)
- Always calculate **real yield** = advertised APY − impermanent loss − gas fees − token price decline

---

## 5. DeFi Yield Strategies

### Stablecoin Lending (Low Risk)

- Lend USDC/USDT on established protocols (Aave, Compound)
- Expected return: 2–8% APY
- Minimal smart contract risk, no impermanent loss
- Use `onchainos defi search --token USDC --product-group SINGLE_EARN`

### Single-Sided Staking (Low–Medium Risk)

- Stake tokens directly (ETH on Lido, SOL on native staking)
- Expected return: 3–7% APY
- Risk: token price depreciation can exceed yield
- Use `onchainos defi search --token ETH --product-group SINGLE_EARN`

### Concentrated Liquidity V3 (Medium–High Risk)

- Provide concentrated liquidity in Uniswap V3 / Sushi V3 style pools
- Higher potential returns but significant impermanent loss risk
- Always check `onchainos defi depth-price-chart` before entering V3 positions
- Select tick ranges where liquidity is concentrated for best fee capture
- Use `onchainos defi search --token <token> --product-group DEX_POOL` with V3 filter

### Impermanent Loss Management

Impermanent loss (IL) is the value difference between holding tokens vs. providing them as liquidity.

**IL mitigation strategies**:
- Prefer correlated pairs (ETH/stETH, USDC/USDT) — minimal IL
- Prefer single-sided staking over LP pairs when possible
- Shorter holding periods reduce IL risk
- Check `onchainos defi tvl-chart` — declining TVL often signals IL is increasing
- Always calculate net yield = APY − expected IL − gas costs

**IL estimation**:
| Price Change | IL (vs HODL) |
|---|---|
| 1.25× | ~0.6% |
| 1.50× | ~2.0% |
| 2.00× | ~5.7% |
| 3.00× | ~13.4% |
| 5.00× | ~25.5% |

If a pool's fee APY doesn't exceed the expected IL from price movement, passive holding outperforms LPing.

---

## 6. Strategy Selection Guide

Match strategy to market condition and experience level:

| Condition | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Bull market | DCA BTC/ETH | Momentum + DCA | Concentrated LP + Momentum |
| Bear market | Stablecoin lending | DCA-out from alts | Short positions + Yield rotation |
| Sideways/range | Stablecoin lending + DCA | Range trading | V3 concentrated LP |
| High volatility | Reduce position size, stay in stablecoins | Scale-in entry + wider stops | Volatility trading + hedging |
| New token launch | Avoid (too risky) | Meme research workflow | Smart money confirmation + tight risk |
| DeFi yield | Single-earn stablecoin staking | Multi-protocol yield comparison | Yield rotation + IL hedging |

### Pre-Trade Checklist

Before entering any trade, confirm ALL of the following:

- [ ] Risk per trade ≤ 2% of portfolio (≤ 0.5% for meme/speculative)
- [ ] Total portfolio heat ≤ 6% across all positions
- [ ] Stop-loss level defined BEFORE entry
- [ ] Risk/reward ratio ≥ 1:2
- [ ] Security scan passed (`onchainos security token-scan`)
- [ ] Liquidity sufficient for position size (`onchainos token liquidity`)
- [ ] No honeypot flag (`isHoneyPot = false`)
- [ ] MEV protection considered for trades ≥ chain threshold
- [ ] Strategy matches current market condition
- [ ] Position size calculated per sizing rules above