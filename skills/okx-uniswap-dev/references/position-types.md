# Position Types Reference

Comprehensive reference for Uniswap v2, v3, and v4 liquidity positions, tick math, and deep link URL parameters.

## Version Comparison

| Feature | V2 | V3 | V4 |
|---|---|---|---|
| Liquidity Type | Full Range | Concentrated | Concentrated |
| Price Ranges | No | Yes | Yes |
| Position Representation | ERC-20 LP Token | NFT | NFT |
| Fee Tiers | 0.3% fixed | 0.01%, 0.05%, 0.3%, 1% | Dynamic (with hooks) |
| Hooks Support | No | No | Yes |
| Capital Efficiency | 1x | Up to 4000x | Up to 4000x+ |

## V2 Positions

V2 uses constant product formula (x * y = k) across the entire price range.

**When to use V2:**
- Very long-term, passive positions
- Pairs with extreme volatility
- When gas costs for V3 management exceed benefits

**URL:** `https://app.uniswap.org/add/v2/{tokenA}/{tokenB}`

## V3 Positions

### Fee Tiers

| Fee | Tick Spacing | Best For | Typical Pairs |
|---|---|---|---|
| 0.01% (100) | 1 | Stablecoins | USDC/USDT, DAI/USDC |
| 0.05% (500) | 10 | Correlated assets | ETH/stETH, WBTC/renBTC |
| 0.30% (3000) | 60 | Most pairs | ETH/USDC, WBTC/ETH |
| 1.00% (10000) | 200 | Exotic pairs | Long-tail tokens |

### Tick Math

- **Tick**: Integer representing a price point
- **Tick Spacing**: Minimum distance between usable ticks (varies by fee tier)
- **Price to Tick**: `tick = log(price) / log(1.0001)`

| Fee | Tick Spacing | Min Tick | Max Tick |
|---|---|---|---|
| 100 | 1 | -887272 | 887272 |
| 500 | 10 | -887270 | 887270 |
| 3000 | 60 | -887220 | 887220 |
| 10000 | 200 | -887200 | 887200 |

## V4 Positions

**Key differences from V3:**
- Hooks: Custom logic for swaps, liquidity changes
- Dynamic Fees: Fees change based on conditions
- Singleton Contract: All pools in one contract
- Flash Accounting: More efficient multi-hop swaps

**When to use V4:**
- When specific hook functionality is needed
- For advanced use cases (TWAMM, limit orders)
- When V4 pool has better liquidity than V3

## Chain Availability

| Chain | V2 | V3 | V4 |
|---|---|---|---|
| Ethereum | Yes | Yes | Yes |
| Base | No | Yes | Yes |
| Arbitrum | Yes | Yes | Yes |
| Optimism | No | Yes | Yes |
| Polygon | Yes | Yes | Coming |
| BNB Chain | Yes | Yes | Coming |
| Avalanche | No | Yes | Coming |
| Celo | Yes | Yes | No |
| Blast | No | Yes | Yes |
| Zora | No | Yes | Yes |
| World Chain | No | Yes | Yes |
| Unichain | No | Yes | Yes |

## Impermanent Loss by Range

| Price Move | Full Range IL | +/-50% Range IL | +/-20% Range IL | +/-10% Range IL |
|---|---|---|---|---|
| +/-10% | 0.11% | 0.22% | 0.55% | 1.10% |
| +/-25% | 0.64% | 1.28% | 3.20% | 100%* |
| +/-50% | 2.02% | 4.04% | 100%* | 100%* |

*100% means position is entirely in one asset (out of range)

## Deep Link Parameter Reference

**URL encoding rules:** Only encode double quotes (`"` to `%22`). Do NOT encode braces `{}`, colons `:`, or commas `,`.

### priceRangeState Object

```typescript
interface PriceRangeState {
  priceInverted: boolean;  // false for normal price direction
  fullRange: boolean;      // true for full range, false for custom
  minPrice: string;        // Min price as string (empty for full range)
  maxPrice: string;        // Max price as string (empty for full range)
  initialPrice: string;    // Empty string for existing pools
  inputMode: string;       // Always "price"
}
```

### depositState Object

```typescript
interface DepositState {
  exactField: 'TOKEN0' | 'TOKEN1';  // TOKEN0 = currencyA, TOKEN1 = currencyB
  exactAmounts: {
    TOKEN0?: string;
    TOKEN1?: string;
  };
}
```

### fee Object

```typescript
interface FeeData {
  feeAmount: number;    // Fee in hundredths of a bip (3000 = 0.3%)
  tickSpacing: number;  // Tick spacing for the fee tier
  isDynamic: boolean;   // false for V3, can be true for V4
}
```

## URL Encoding Examples

### Full Range V3 Position (ETH/USDC, 0.3% fee)

```text
https://app.uniswap.org/positions/create
  ?currencyA=NATIVE
  &currencyB=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
  &chain=ethereum
  &fee={%22feeAmount%22:3000,%22tickSpacing%22:60,%22isDynamic%22:false}
  &priceRangeState={%22priceInverted%22:false,%22fullRange%22:true,%22minPrice%22:%22%22,%22maxPrice%22:%22%22,%22initialPrice%22:%22%22,%22inputMode%22:%22price%22}
  &step=1
```

### Custom Range V3 Position (ETH/USDC on Base, +/-10% range)

```text
https://app.uniswap.org/positions/create
  ?currencyA=NATIVE
  &currencyB=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
  &chain=base
  &fee={%22feeAmount%22:3000,%22tickSpacing%22:60,%22isDynamic%22:false}
  &priceRangeState={%22priceInverted%22:false,%22fullRange%22:false,%22minPrice%22:%222800%22,%22maxPrice%22:%223600%22,%22initialPrice%22:%22%22,%22inputMode%22:%22price%22}
  &depositState={%22exactField%22:%22TOKEN0%22,%22exactAmounts%22:{%22TOKEN0%22:%221%22}}
  &step=1
```

### Stablecoin Position (USDC/USDT, 0.01% fee, tight range)

```text
https://app.uniswap.org/positions/create
  ?currencyA=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
  &currencyB=0xdAC17F958D2ee523a2206206994597C13D831ec7
  &chain=ethereum
  &fee={%22feeAmount%22:100,%22tickSpacing%22:1,%22isDynamic%22:false}
  &priceRangeState={%22priceInverted%22:false,%22fullRange%22:false,%22minPrice%22:%220.99%22,%22maxPrice%22:%221.01%22,%22initialPrice%22:%22%22,%22inputMode%22:%22price%22}
  &step=1
```
