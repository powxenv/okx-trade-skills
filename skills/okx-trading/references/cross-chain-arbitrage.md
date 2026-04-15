# Cross-Chain Arbitrage Detection

Identify and evaluate price differences for the same token across multiple chains and DEX aggregators. This guide covers detection, cost analysis, and execution strategies.

## Detection Workflow

### Step 1: Identify Target Tokens

Focus on tokens available on multiple chains:
- Bridged tokens (USDC, USDT, WETH, WBTC)
- Native ecosystem tokens with multi-chain presence
- Tokens with significant volume on 2+ chains

```bash
# Check token info on each chain
onchainos token info --address <addr> --chain ethereum
onchainos token info --address <addr> --chain base
onchainos token info --address <addr> --chain arbitrum
```

### Step 2: Price Comparison

```bash
# Get prices on each chain
onchainos market price --address <addr> --chain ethereum
onchainos market price --address <addr> --chain base
onchainos market price --address <addr> --chain arbitrum
onchainos market price --address <addr> --chain polygon
```

### Step 3: Quote Comparison

```bash
# Get quotes for the same swap size on each chain
onchainos swap quote --from <tokenA> --to <tokenB> --readable-amount 1000 --chain ethereum
onchainos swap quote --from <tokenA> --to <tokenB> --readable-amount 1000 --chain base
```

### Step 4: Gas Cost Analysis

```bash
# Check gas on each chain
onchainos gateway gas --chain ethereum
onchainos gateway gas --chain base
onchainos gateway gas --chain arbitrum
```

## Profitability Calculation

```
Gross Profit = (Price_B - Price_A) × Amount
Gas Cost     = Gas_Source + Gas_Dest + Bridge_Fee
Net Profit   = Gross Profit - Gas Cost
Profit %     = (Net Profit / Capital) × 100

Arbitrage is viable when Profit % > 0.5% (accounting for slippage)
```

### Cost Factors

| Cost | Source | Typical Range |
|---|---|---|
| Source chain gas | `gateway gas --chain <src>` | $0.01 (L2) - $5 (Ethereum) |
| Destination chain gas | `gateway gas --chain <dst>` | $0.01 (L2) - $5 (Ethereum) |
| Bridge fee | Bridge provider | 0.01% - 0.1% of amount |
| Slippage | `swap quote` diff | 0.1% - 2% depending on liquidity |
| MEV risk | Time delay | Variable |

## Chain Pair Analysis

### Low-Cost Pairs (Preferred)

| Pair | Source Gas | Dest Gas | Bridge Time | Notes |
|---|---|---|---|---|
| Base → Ethereum | ~$0.01 | ~$2-5 | 20 min | Good for large amounts |
| Arbitrum → Ethereum | ~$0.10 | ~$2-5 | 10 min | Standard L2→L1 |
| Base → Arbitrum | ~$0.01 | ~$0.10 | 5 min | Fast, cheap |
| X Layer → Ethereum | ~$0.001 | ~$2-5 | 15 min | Cheapest source |
| Solana → Ethereum | ~$0.01 | ~$2-5 | 10 min | Cross-VM, verify bridge |

### High-Cost Pairs (Avoid unless large spread)

| Pair | Combined Gas | Min Spread Needed |
|---|---|---|
| Ethereum → Ethereum (same chain) | $4-10 | >1% |
| Ethereum → Polygon | $3-8 | >0.8% |
| Ethereum → BSC | $3-8 | >0.8% |

## Execution Strategy

### Manual Mode

1. Detect spread > 1% via price monitoring
2. Calculate net profit after gas + bridge + slippage
3. Quote both legs simultaneously
4. Execute source chain swap first
5. Bridge tokens to destination chain
6. Execute destination chain swap
7. Bridge profits back (or keep on destination)

### Semi-Auto Mode

Agent monitors prices via WebSocket (`onchainos dex-ws`) and alerts when spread exceeds threshold. User approves each trade.

### Full-Auto Mode

Agent continuously monitors, calculates profitability, and executes when:
- Net profit > configured minimum (e.g., 0.5%)
- Both legs have sufficient liquidity
- Gas costs are within expected range
- No security flags on either chain

```yaml
arbitrage_config:
  min_profit_pct: 0.5
  max_position_pct: 5.0
  chains: [base, arbitrum, optimism, xlayer]
  bridge_timeout_minutes: 30
  auto_mode: manual  # manual | semi-auto | full-auto
```

## Risk Management

### Hard Limits
- **Never risk > 5% of portfolio** on a single arbitrage
- **Bridge timeout**: if bridge takes > 30 min, stop executing new arb trades
- **Price staleness**: if quote > 10 seconds old, re-fetch before executing
- **Liquidity check**: verify both legs have > 2x trade size in liquidity

### Common Pitfalls
- **Gas volatility**: Gas can spike between detection and execution
- **Bridge delay**: Price may converge during bridge transit
- **Slippage**: Large trades move price, reducing or eliminating the spread
- **Smart contract risk**: Bridge exploits can lock funds
- **MEV front-running**: On Ethereum, arb transactions can be front-run

## Monitoring Setup

```bash
# Start WebSocket monitoring for price changes
onchainos dex-ws connect --channel price --chain base
onchainos dex-ws connect --channel price --chain arbitrum
```

Track spread history to identify:
- Best times of day for each pair
- Typical spread sizes and duration
- Chains with consistent opportunities
