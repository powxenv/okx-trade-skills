# V3 Concentrated Liquidity Management

> Load this file when managing Uniswap V3 LP positions — mint, rebalance, collect fees, or withdraw.

## Core Concepts

### Tick Math

V3 uses ticks to represent price ranges. Each tick = 0.01% price change.

- Tick = `floor(log_1.0001(price))`
- Price = `1.0001^tick`
- Tight range (1-2%): maximum fee efficiency, high IL risk
- Medium range (5-10%): balanced, rebalance weekly
- Wide range (20-50%): low fees, low IL, rebalance monthly

### Key Addresses (Verify per Chain)

> **Always verify** these addresses on the target chain's block explorer before use. Addresses differ across chains.

| Contract | Purpose | Ethereum | Base |
|---|---|---|---|
| UniswapV3Factory | Pool creation | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | `0x33128a8fC17869897dcE68Ed026d69489E954c59` |
| SwapRouter02 | Swap execution | `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45` | `0x2626664c260226f5a7bb48765bdf3259a9b6bcf1` |
| NonfungiblePositionManager | LP positions | `0xC36442b4a4522E871399CD717aB8DD59d1372785` Verify | Verify on block explorer |
| QuoterV2 | Off-chain quotes | `0x61fFE014bA17989E743c5F6cB332C65d2cFCBF8C` Verify | Verify on block explorer |

**X Layer**: Check block explorer for Uniswap V3 deployment addresses. If not deployed, use `onchainos defi` commands for LP management.

## LP Position Workflow

### 1. Find or Create a Pool

```bash
# Find existing pool
cast call <FACTORY> "getPool(address,address,uint24)" \
  <TOKEN0> <TOKEN1> <FEE_TIER> \
  --rpc-url <RPC_URL>

# If pool doesn't exist, create it (requires pool creator role)
cast send <FACTORY> "createAndInitializePoolIfNecessary(address,address,uint24,int24)" \
  <TOKEN0> <TOKEN1> <FEE_TIER> <INITIAL_TICK> \
  --rpc-url <RPC_URL> --private-key <KEY>
```

### 2. Check Pool State

```bash
# Get current price and tick
cast call <POOL> "slot0()(uint160,int24,uint16,uint16,uint16,uint8,bool)" \
  --rpc-url <RPC_URL>

# Get total liquidity
cast call <POOL> "liquidity()(uint128)" \
  --rpc-url <RPC_URL>

# Get fee growth (for fee estimation)
cast call <POOL> "feeGrowthGlobal0X128()(uint256)" \
  --rpc-url <RPC_URL>
cast call <POOL> "feeGrowthGlobal1X128()(uint256)" \
  --rpc-url <RPC_URL>
```

### 3. Open a Position (Mint)

```bash
# Approve tokens to NonfungiblePositionManager
cast send <TOKEN0> "approve(address,uint256)" <POSITION_MANAGER> <AMOUNT0> \
  --rpc-url <RPC_URL> --private-key <KEY>
cast send <TOKEN1> "approve(address,uint256)" <POSITION_MANAGER> <AMOUNT1> \
  --rpc-url <RPC_URL> --private-key <KEY>

# Mint position (simplified — use viem/SDK for production)
cast send <POSITION_MANAGER> "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))" \
  <TOKEN0> <TOKEN1> <FEE_TIER> <TICK_LOWER> <TICK_UPPER> <AMOUNT0> <AMOUNT1> 0 0 <RECIPIENT> <DEADLINE> \
  --rpc-url <RPC_URL> --private-key <KEY>
```

**Tick range calculation**:
- For ±10% range from current tick: `tickLower = floor(currentTick / 60) * 60 - 600`, `tickUpper = floor(currentTick / 60) * 60 + 600`
- Ticks must be multiples of `tickSpacing` (1 for 0.01%, 10 for 0.05%, 60 for 0.30%, 200 for 1.00%)

### 4. Monitor Position

```bash
# Get position info by token ID
cast call <POSITION_MANAGER> "positions(uint256)" <TOKEN_ID> \
  --rpc-url <RPC_URL>

# Check if position is in range
# Compare current tick (from slot0) with tickLower and tickUpper of the position
```

### 5. Collect Fees

```bash
# Collect fees (and optionally principal)
cast send <POSITION_MANAGER> "collect((uint256,address,uint128,uint128))" \
  <TOKEN_ID> <RECIPIENT> <MAX_UINT128> <MAX_UINT128> \
  --rpc-url <RPC_URL> --private-key <KEY>
```

### 6. Increase Liquidity

```bash
cast send <POSITION_MANAGER> "increaseLiquidity((uint256,uint256,uint256,uint256,uint256,uint256))" \
  <TOKEN_ID> <AMOUNT0> <AMOUNT1> 0 0 <DEADLINE> \
  --rpc-url <RPC_URL> --private-key <KEY>
```

### 7. Decrease Liquidity

```bash
cast send <POSITION_MANAGER> "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))" \
  <TOKEN_ID> <LIQUIDITY> 0 0 <DEADLINE> \
  --rpc-url <RPC_URL> --private-key <KEY>
```

### 8. Close Position (Full Withdrawal)

```bash
# Step 1: Decrease liquidity to 0
cast send <POSITION_MANAGER> "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))" \
  <TOKEN_ID> <FULL_LIQUIDITY> 0 0 <DEADLINE> \
  --rpc-url <RPC_URL> --private-key <KEY>

# Step 2: Collect all remaining tokens and fees
cast send <POSITION_MANAGER> "collect((uint256,address,uint128,uint128))" \
  <TOKEN_ID> <RECIPIENT> <MAX_UINT128> <MAX_UINT128> \
  --rpc-url <RPC_URL> --private-key <KEY>
```

## Rebalancing Strategy

### When to Rebalance

Rebalance when:
1. **Price exits your tick range** — position stops earning fees, 100% in one asset
2. **Fee earnings drop below threshold** — fees accumulate slower as range becomes asymmetric
3. **Range width is no longer appropriate** — volatility has changed

### Rebalancing Steps (X Layer)

On X Layer, gas is ~$0.0005 per transaction, so frequent rebalancing is profitable:

1. Decrease liquidity (remove from current position)
2. Collect all tokens and fees
3. Check new price (via `slot0`)
4. Calculate new tick range centered around current price
5. Increase liquidity in the new range (or mint a new position)
6. Total gas cost: ~$0.002-0.005 per rebalance cycle

### Fee Estimation

```bash
# Approximate daily fees for a position:
# fee_earned = position_liquidity / pool_liquidity * 24h_volume * fee_tier
#
# Example: 0.1 ETH in a 0.3% fee pool with $1M 24h volume and 10 ETH total liquidity
# fee_earned = (0.1/10) * $1M * 0.003 = $30/day

# Check 24h volume via OnchainOS
onchainos token info --address <addr> --chain xlayer
```

## Impermanent Loss Calculator

```
IL_formula:
  price_ratio = current_price / entry_price
  IL = 2 * sqrt(price_ratio) / (1 + price_ratio) - 1

Examples:
  1.25x price move  → 0.6% IL
  1.50x price move  → 2.0% IL
  2.00x price move  → 5.7% IL
  3.00x price move  → 13.4% IL
  5.00x price move  → 25.0% IL
```

For concentrated positions, IL is amplified by the leverage factor:
```
concentrated_IL ≈ IL * (1 / range_width_fraction)
Example: 10% range with 3x price move → 13.4% IL * 10 ≈ 134% effective IL
```

**Always compare fee earnings against potential IL before opening a position.**