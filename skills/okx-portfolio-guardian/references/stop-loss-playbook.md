# Stop-Loss Playbook

Strategies for automated stop-loss and take-profit execution.

## Stop-Loss Types

### Fixed Percentage

Most common and simplest. Set a percentage below entry price.

```
Entry price: $100
Stop-loss: -10% → sell at $90
```

| Portfolio Size | Recommended Stop | Max Loss |
|---|---|---|
| < $1K | -15% | $150 |
| $1K - $10K | -10% | $1,000 |
| > $10K | -5% | $500+ |

### Trailing Stop

Moves up with price, locks in gains.

```
Entry: $100, trailing distance: 10%
Peak price $150 → stop triggers at $135 (150 × 0.90)
Peak price $200 → stop triggers at $180 (200 × 0.90)
```

### ATR-Based Stop

Uses Average True Range for volatility-adjusted stops.

```
ATR(14) = $5
Stop = Entry - (2 × ATR) = $100 - $10 = $90
```

Adapts to token volatility — wider for volatile tokens, tighter for stable ones.

### Time-Based Exit

Exit if token hasn't performed within a time window.

```
If position is > 48 hours old and unrealized PnL is between -5% and +5%:
  → Exit (capital is idle, opportunity cost)
```

## Take-Profit Strategies

### Fixed Target

```
Entry: $100, target: +20% → sell at $120
```

### Scaled Exit

```
At +10%: sell 25% of position
At +20%: sell 25% of position
At +40%: sell 25% of position
Remaining 25%: let run with trailing stop
```

### Risk-Reward Ratio

```
If stop-loss is -10%, set take-profit at +20% (2:1 reward/risk)
If stop-loss is -5%, set take-profit at +15% (3:1 reward/risk)
```

## Execution Workflow

### Check Price Against Stops

```bash
# Get current price
onchainos market price --address <addr> --chain <c>

# Compare against stored stop-loss and take-profit levels
# If stop-loss hit: execute sell
# If take-profit hit: execute sell (or partial)
```

### Execute Stop-Loss

```bash
# Get the fastest execution with MEV protection
onchainos swap execute \
  --from <token_addr> \
  --to <stablecoin_addr> \
  --readable-amount <full_amount> \
  --chain <c> \
  --wallet <addr> \
  --slippage 3 \
  --gas-level fast \
  --mev-protection
```

### Execute Take-Profit (Partial)

```bash
# Sell only the take-profit portion
onchainos swap execute \
  --from <token_addr> \
  --to <stablecoin_addr> \
  --readable-amount <partial_amount> \
  --chain <c> \
  --wallet <addr> \
  --slippage 2 \
  --mev-protection
```

## Meme Token Adjustments

Meme tokens require wider stops due to extreme volatility:

| Scenario | Stop-Loss | Take-Profit |
|---|---|---|
| Fresh meme launch (< 1h old) | -30% | +100% (2x) |
| Day-old meme | -25% | +75% |
| Week-old meme | -20% | +50% |
| Established meme (> 1 week) | -15% | +30% |

## Monitoring Checklist

Every monitoring cycle:

1. Get current price of each held token
2. Compare against stop-loss level
3. Compare against take-profit level
4. Check if trailing stop needs to move up
5. Calculate unrealized PnL
6. If triggered: execute immediately, do not wait for user confirmation (in auto mode)
7. Log the trade with timestamp, trigger reason, and execution details
