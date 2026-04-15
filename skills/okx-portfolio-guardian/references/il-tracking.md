# Impermanent Loss Tracking

Monitor and calculate impermanent loss for Uniswap V3 concentrated liquidity positions.

## What is Impermanent Loss?

Impermanent loss (IL) is the difference between holding tokens in a liquidity pool versus holding them in your wallet. It occurs because the pool automatically rebalances as prices change.

## IL Formula

```
IL = (2 × √(price_ratio)) / (1 + price_ratio) - 1
```

Where `price_ratio = current_price / entry_price`

### IL Reference Table

| Price Change | IL | Example |
|---|---|---|
| 1.25x (+25%) | -0.6% | $100 → $99.40 |
| 1.50x (+50%) | -2.0% | $100 → $98.00 |
| 2.00x (+100%) | -5.7% | $100 → $94.30 |
| 3.00x (+200%) | -13.4% | $100 → $86.60 |
| 0.75x (-25%) | -0.6% | $100 → $99.40 |
| 0.50x (-50%) | -5.7% | $100 → $94.30 |
| 0.33x (-67%) | -13.4% | $100 → $86.60 |

## V3 Concentrated Liquidity IL

Concentrated positions amplify IL. The narrower your range, the more IL you experience for a given price movement.

### Amplification Factor

```
Effective IL = Base IL × (1 / range_width_fraction)
```

Example: If your range covers ±5% of current price (10% total width):
```
Amplification = 1 / 0.10 = 10x
A 2x price move that causes 5.7% base IL → 57% effective IL in ±5% range
```

## Monitoring Workflow

### Step 1: Record Entry State

When opening a position, record:

```json
{
  "position_id": "v3-001",
  "token0": "ETH",
  "token1": "USDC",
  "entry_price": 3000,
  "entry_value_usd": 1000,
  "tick_lower": -100,
  "tick_upper": 100,
  "entry_date": "2025-01-15"
}
```

### Step 2: Calculate Current IL

```bash
# Get current price
onchainos market price --address <token0_addr> --chain <c>

# Calculate:
# price_ratio = current_price / entry_price
# base_il = (2 × √price_ratio) / (1 + price_ratio) - 1
# If position is in range: effective_il = base_il × amplification
# If position is out of range: IL is locked in (now permanent)
```

### Step 3: Compare IL vs Fees Earned

```bash
# Get position details including fees
onchainos defi position-detail --address <addr> --chain <c> --platform-id <pid>
```

```
Net PnL = Fees earned - Impermanent loss
If net PnL > 0: Position is profitable
If net PnL < 0: Position is losing money vs holding
```

## Rebalancing Triggers

| IL Level | Fee Compensation | Action |
|---|---|---|
| < 2% | Fees > IL | Hold — profitable |
| 2-5% | Fees ≈ IL | Monitor closely |
| 5-10% | Fees < IL | Consider closing or widening range |
| > 10% | Fees << IL | Close position, reassess strategy |

## IL on X Layer

Near-zero gas on X Layer makes frequent IL monitoring and rebalancing practical:
- Check IL every 1-2 hours
- Rebalance when IL exceeds fee income
- Multiple narrow-range positions to diversify IL risk
- Auto-compound fees to offset IL

```bash
# X Layer gas cost for rebalancing
onchainos gateway gas --chain xlayer
# ~$0.0005 per rebalance — can rebalance hourly profitably
```
