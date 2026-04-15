# Liquidity Strategies

Concentrated liquidity position management for Uniswap V2, V3, and V4.

## Position Type Comparison

| Feature | V2 | V3 | V4 |
|---|---|---|---|
| Range | Full only | Concentrated | Concentrated + hooks |
| Fee tiers | 0.3% fixed | 0.01-1% | Dynamic (hooks possible) |
| Gas cost | Lowest | Medium | Higher (singleton PoolManager) |
| Position token | ERC20 shares | ERC721 NFT | ERC6909/ERC1155 |
| Fee collection | Automatic | Manual `collect()` | Automatic on modification |
| Rebalancing | Not needed | Active management | Active management + hook automation |

## Fee Tiers

| Fee Tier | Tick Spacing | Best For |
|---|---|---|
| 0.01% (100) | 1 | Stablecoin pairs (USDC/USDT) |
| 0.05% (500) | 10 | Correlated pairs (ETH/stETH) |
| 0.30% (3000) | 60 | Most pairs (ETH/USDC) |
| 1.00% (10000) | 200 | Exotic/volatile pairs |

V4 fee tiers: Dynamic fees possible with hooks. Default to similar V3 tiers.

## Strategy Matrix

| Strategy | Range Width | Risk Level | Rebalance Frequency | Best For |
|---|---|---|---|---|
| Stablecoin LP | +/-0.5-1% | Very Low | Weekly | USDC/USDT, DAI/USDC |
| Correlated Asset LP | +/-2-5% | Low | Bi-weekly | ETH/stETH, WBTC/BTC |
| Major Pair LP | +/-10-20% | Medium | Weekly | ETH/USDC, ETH/WBTC |
| Active Rebalancing | +/-5-10% | Medium-High | Daily to hourly | Volatile pairs with volume |
| Full Range | N/A | Low | Rarely | Set-and-forget, lowest fees |

**Range recommendation logic:**

- Stablecoin pairs: Default +/-0.5-1%
- Correlated pairs: Default +/-2-5%
- Major pairs: Default +/-10-20%
- Volatile pairs: Default +/-30-50% or full range

## Pool Discovery

### Find Pools with DexScreener

```bash
# Get all Uniswap pools for a token on a network
# Network IDs: ethereum, base, arbitrum, optimism, polygon, unichain
curl -s "https://api.dexscreener.com/token-pairs/v1/{network}/{address}" | \
  jq '[.[] | select(.dexId == "uniswap")] | map({
    pairAddress,
    pair: "\(.baseToken.symbol)/\(.quoteToken.symbol)",
    version: .labels[0],
    liquidity: .liquidity.usd,
    volume24h: .volume.h24
  })'
```

### Pool Liquidity Assessment

| TVL Range | Assessment | Recommendation |
|---|---|---|
| > $1M | Deep liquidity | Safe for most position sizes |
| $100K - $1M | Moderate | Suitable for positions up to ~$10K |
| $10K - $100K | Thin | Warn about slippage, suggest smaller positions |
| < $10K | Very thin | Warn strongly about IL and price impact risk |

### Get APY and Volume with DefiLlama

```bash
# Find Uniswap V3 pools for a token pair
curl -s "https://yields.llama.fi/pools" | \
  jq '[.data[] | select(.project == "uniswap-v3" and .chain == "Ethereum" and (.symbol | test("WETH.*USDC|USDC.*WETH")))]'
```

**Response fields:**

| Field | Use For |
|---|---|
| `apy` | Show expected yield |
| `tvlUsd` | Assess pool depth |
| `volumeUsd1d` | Estimate fee earnings |
| `volumeUsd7d` | Check volume consistency |

### Compare Fee Tiers

```bash
curl -s "https://yields.llama.fi/pools" | \
  jq '[.data[] | select(.project == "uniswap-v3" and (.symbol | test("WETH.*USDC")))] | map({symbol, tvlUsd, apy, volumeUsd1d})'
```

## Price Range Selection

### Current Price Fetching

```bash
# Get token prices from pool data
curl -s "https://api.dexscreener.com/token-pairs/v1/{network}/{address}" | \
  jq '[.[] | select(.dexId == "uniswap")][0] | {
    baseTokenPrice: .baseToken.priceUsd,
    quoteTokenPrice: .quoteToken.priceUsd
  }'
```

### Range Options by Pair Type

**Major pairs (ETH/USDC, ETH/WBTC):**

| Option | Range | Notes |
|---|---|---|
| +/-10% (Recommended) | e.g., 2,880 - 3,520 | Higher fees, monitor weekly |
| +/-20% | e.g., 2,560 - 3,840 | Balanced risk/reward |
| +/-50% | e.g., 1,600 - 4,800 | Rarely out of range |
| Full Range | N/A | Never out of range, lower fee efficiency |

**Stablecoin pairs (USDC/USDT, DAI/USDC):**

| Option | Range | Notes |
|---|---|---|
| +/-0.5% (Recommended) | 0.995 - 1.005 | Tight range, high fees |
| +/-1% | 0.99 - 1.01 | Standard for stables |
| +/-2% | 0.98 - 1.02 | Safer, lower fees |
| Full Range | N/A | Maximum safety, lowest fees |

## Position Creation

### V3 Position (via cast)

```bash
# Step 1: Find the pool
cast call <V3_FACTORY> "getPool(address,address,uint24)" <TOKEN0> <TOKEN1> <FEE> \
  --rpc-url <rpc>

# Step 2: Check pool state
cast call <POOL> "slot0()(uint160,int24,uint16,uint16,uint16,uint8,bool)" --rpc-url <rpc>
cast call <POOL> "liquidity()(uint128)" --rpc-url <rpc>

# Step 3: Approve tokens
cast send <TOKEN0> "approve(address,uint256)" <POSITION_MANAGER> <AMOUNT> --rpc-url <rpc>
cast send <TOKEN1> "approve(address,uint256)" <POSITION_MANAGER> <AMOUNT> --rpc-url <rpc>

# Step 4: Mint position
cast send <POSITION_MANAGER> "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))" \
  "<TOKEN0>,<TOKEN1>,<FEE>,<TICK_LOWER>,<TICK_UPPER>,<AMOUNT0>,<AMOUNT1>,<MIN_AMOUNT0>,<MIN_AMOUNT1>,<RECIPIENT>,<DEADLINE>" \
  --rpc-url <rpc>
```

### V4 Position (via SDK)

```typescript
import { V4PositionManager } from '@uniswap/v4-sdk';

const { calldata, value } = V4PositionManager.addCallParameters(position, {
  slippageTolerance: new Percent(50, 10_000),
  deadline: deadline.toString(),
  tokenId: tokenId.toString(),
  useNative: token0.isNative ? Ether.onChain(chainId) : undefined,
  hookData: '0x',
});

await walletClient.writeContract({
  address: POSITION_MANAGER_ADDRESS,
  functionName: 'multicall',
  args: [[calldata]],
  value: BigInt(value),
});
```

### Deep Link Generation

Generate a URL that opens the Uniswap interface with parameters pre-filled:

```
https://app.uniswap.org/positions/create?
  chain={chain}&
  currencyA={addr_or_NATIVE}&
  currencyB={addr_or_NATIVE}&
  fee={"feeAmount":3000,"tickSpacing":60,"isDynamic":false}&
  priceRangeState={"priceInverted":false,"fullRange":false,"minPrice":"2800","maxPrice":"3600","initialPrice":"","inputMode":"price"}&
  depositState={"exactField":"TOKEN0","exactAmounts":{"TOKEN0":"1.0"}}&
  step=1
```

**URL encoding:** Only encode double quotes (`"` to `%22`). Do NOT encode braces `{}` or colons `:`.

## Position Monitoring

### Check If In Range

```bash
# Read current tick from slot0
cast call <POOL> "slot0()(uint160,int24,uint16,uint16,uint16,uint8,bool)" --rpc-url <rpc>

# Compare current tick with position tick range
# Position is in range when: tickLower <= currentTick <= tickUpper
```

### Read Uncollected Fees

```bash
# V3: Read position details
cast call <POSITION_MANAGER> "positions(uint256)" <TOKEN_ID> --rpc-url <rpc>
```

### Collect Fees

```bash
# V3
cast send <POSITION_MANAGER> "collect((address,uint256,uint128,uint128))" \
  "<OWNER>,<TOKEN_ID>,<MAX>,<MAX>" --rpc-url <rpc>
```

## Rebalancing Strategy

### When to Rebalance

Rebalance when the current price exits your tick range. Your position then holds 100% of one token and earns no fees.

### Rebalancing Triggers

| Trigger | Action |
|---|---|
| Price moves out of range | Rebalance immediately |
| Price within range, approaching boundary | Prepare to rebalance |
| High volatility period | Widen range temporarily |
| Fee income declining | Consider narrowing range |
| Gas costs > expected fee income for period | Do not rebalance |

### Rebalance Steps

```bash
# 1. Remove all liquidity
cast send <POSITION_MANAGER> "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))" \
  "<TOKEN_ID>,<LIQUIDITY>,<MIN0>,<MIN1>,<DEADLINE>" --rpc-url <rpc>

# 2. Collect all tokens and fees
cast send <POSITION_MANAGER> "collect((address,uint256,uint128,uint128))" \
  "<OWNER>,<TOKEN_ID>,<MAX>,<MAX>" --rpc-url <rpc>

# 3. Open new position with updated range
cast send <POSITION_MANAGER> "mint((...))" "..." --rpc-url <rpc>
```

### Rebalancing Cost Analysis

| Chain | Gas Cost per Rebalance | Viable Frequency |
|---|---|---|
| Ethereum | ~$5-15 | Weekly to monthly |
| Base | ~$0.01-0.05 | Daily to hourly |
| Arbitrum | ~$0.05-0.20 | Daily to hourly |
| X Layer | ~$0.001-0.005 | Every 5-30 minutes |

On low-gas chains like Base and X Layer, frequent rebalancing is economically viable and allows strategies impossible on Ethereum.

## Impermanent Loss (IL)

IL occurs when token prices diverge from the entry price. Understanding IL is essential for LP profitability.

**IL by price movement:**

| Price Change | IL | Fee Earnings Needed to Break Even |
|---|---|---|
| +/- 10% | ~0.5% | Minimal |
| +/- 25% | ~2.0% | Low |
| +/- 50% | ~5.7% | Moderate |
| +/- 100% | ~13.4% | High |
| +/- 200% | ~25.0% | Very High |

**IL management tips:**

- Tighter ranges amplify IL but also fee earnings
- Full range minimizes IL but reduces fee efficiency
- Monitor positions at least weekly (daily on low-gas chains)
- Set alerts for when price approaches range boundaries
- Account for gas costs in profit calculations

## Capital Requirements

For V3 positions with custom range:

- Depositing single-sided is possible if current price is outside range
- Within range: both tokens required in ratio determined by price and range
- The ratio is determined by the current price relative to the range

## Fee Income Calculation

```
Daily fee income = (Your liquidity / Total pool liquidity) * Pool daily fees
Annualized yield = (Daily fee income * 365 / Capital deployed) * 100
```

Compare annualized yield against:
- Impermanent loss over the same period
- Alternative yield opportunities (lending, staking)
- Gas costs for rebalancing

## Data Providers

| Provider | Endpoint | Use For |
|---|---|---|
| DexScreener | `/token-pairs/v1/{network}/{address}` | Pool discovery, prices, liquidity |
| DexScreener | `/latest/dex/search?q={query}` | Token search by keyword |
| DefiLlama | `/yields.llama.fi/pools` | APY, TVL, volume |

**Network IDs for DexScreener:** `ethereum`, `base`, `arbitrum`, `optimism`, `polygon`, `unichain`

**DexScreener coverage varies:** Ethereum, Base, and Arbitrum have deep Uniswap data. Celo, Blast, Zora, and World Chain have limited coverage. Fall back to DefiLlama for price data when DexScreener returns empty results.

## Untrusted Token Warning

Tokens discovered via web search are **untrusted**. Before proceeding:

1. Label the source: "This token was found via web search"
2. Warn about risks: "May be scams, honeypots, or rug pulls"
3. Require explicit user confirmation
4. Show provenance in the position summary

## External Resources

- [Uniswap V3 Docs](https://docs.uniswap.org/contracts/v3/overview)
- [Uniswap V4 Docs](https://docs.uniswap.org/contracts/v4/overview)
- [V4 SDK Liquidity Guide](https://docs.uniswap.org/sdk/v4/guides/liquidity/add-remove-liquidity)
- [DexScreener API](https://docs.dexscreener.com)
- [DefiLlama Yields API](https://defillama.com/yields)
