# Meme Token Entry & Exit Strategies

Trading strategies specifically designed for the high-volatility, high-risk nature of meme tokens. These strategies differ significantly from standard token trading due to unique mechanics like bonding curves, pump.fun stages, and extreme volatility.

## Position Sizing Rules

| Portfolio Size | Max Meme Position | Max Total Meme Exposure |
|---|---|---|
| < $500 | 0.5% ($2.50) | 3% ($15) |
| $500 - $5K | 0.5% ($2.50-$25) | 3% ($15-$150) |
| $5K - $50K | 0.5% ($25-$250) | 3% ($150-$1,500) |
| > $50K | 0.5% ($250+) | 2% ($1,000+) |

## Entry Strategies

### Strategy 1: Bonding Curve Early Entry

**When:** Token is on pump.fun bonding curve, < 50% progress.

```
1. Discover token: memepump tokens --chain <c> --stage trading
2. Check dev reputation: memepump token-dev-info --address <addr>
3. Check bundlers: memepump token-bundle-info --address <addr>
4. Calculate bonding curve price: see references/bonding-curve-math.md
5. Calculate safety score: see references/meme-scoring-model.md
6. If score ≥ 70: enter with 0.3% position
7. Set stop-loss at -25%, take-profit at +100% (2x)
```

**Risk:** Early bonding curve tokens can go to zero. Only enter with high safety scores and clean dev history.

### Strategy 2: Post-Migration Momentum

**When:** Token has just migrated from bonding curve to DEX.

```
1. Monitor migration events via dex-ws
2. Check new DEX liquidity: token liquidity --address <addr> --chain <c>
3. Verify LP tokens are locked (check security scan)
4. Assess holder distribution post-migration
5. If liquidity > $100K and distribution is healthy: enter
6. Set stop-loss at -20%, take-profit at +50%
```

**Risk:** Post-migration often sees a pump then dump. Use tight stop-losses.

### Strategy 3: Smart Money Follow

**When:** Smart money wallets are accumulating a meme token.

```
1. Track smart money: tracker activities --tracker-type smartMoney
2. Identify target token from smart money buys
3. Run full analysis pipeline on the token
4. If safety score ≥ 65: enter with 0.3% position
5. Set stop-loss at -20%, take-profit at +75%
6. Monitor smart money activity — if they sell, consider exiting
```

**Risk:** Smart money can be wrong, or the signal may be delayed. Always verify independently.

### Strategy 4: Social Trend Breakout

**When:** A meme token is gaining rapid social traction confirmed by on-chain data.

```
1. Monitor trending tokens: token hot-tokens --chain <c>
2. Cross-reference with social signals: signal list --chain <c>
3. Verify volume is organic (not wash trading) via holder analysis
4. If on-chain metrics confirm social narrative: enter with 0.3%
5. Set stop-loss at -15%, take-profit at +50%
```

**Risk:** Social hype can be manufactured. Always require on-chain confirmation.

## Exit Strategies

### Stop-Loss Rules

| Token Age | Stop-Loss | Rationale |
|---|---|---|
| < 1 hour | -30% | Extreme volatility in first hour |
| 1-24 hours | -25% | Still volatile but stabilizing |
| 1-7 days | -20% | Normal meme volatility |
| > 7 days | -15% | More established, tighter stop |

### Take-Profit Strategies

**Scaling Out (Recommended):**
```
Entry: 100% position
At +50%:  Sell 30% (recover some capital)
At +100%: Sell 30% (lock in profits)
At +200%: Sell 30% (ride the rest with house money)
Remaining 10%: Let it run with trailing stop
```

**All-or-Nothing:**
```
Set single take-profit at +100% (2x)
If reached, sell entire position immediately
```

**Trailing Stop:**
```
After +30% profit, activate trailing stop at -15% from peak
Example: Token peaks at +80%, trailing triggers sell at +65% (80% - 15%)
```

### Time-Based Exit Rules

| Scenario | Action |
|---|---|
| Token hasn't moved ±10% in 48 hours | Consider exiting — capital is idle |
| Token volume drops > 80% from peak | Exit — interest is fading |
| Token loses key support levels | Exit immediately |
| New competing meme token takes attention | Consider rotating |

## Monitoring During Position

```bash
# Check current price
onchainos market price --address <addr> --chain <c>

# Check if smart money is still holding
onchainos tracker activities --tracker-type smartMoney

# Check holder distribution changes
onchainos token cluster-overview --address <addr> --chain <c>

# Check for new security risks
onchainos security token-scan --address <addr> --chain <c>
```

Monitor every 15-30 minutes for active meme positions. Meme tokens can move 50%+ in minutes.

## Common Mistakes to Avoid

1. **FOMO entry** — Buying because of social hype without running analysis
2. **No stop-loss** — Meme tokens can go to -90% in hours
3. **Over-sizing** — Even "sure thing" memes can rug; never exceed 0.5%
4. **Holding too long** — Take profits when you have them; memes are transient
5. **Ignoring dev red flags** — A clean dev is the strongest signal for meme tokens
6. **Averaging down** — Never add to a losing meme position
7. **Ignoring liquidity** — You may not be able to sell when you want to
