# Data Providers Reference

API reference for DexScreener and DefiLlama used in swap and liquidity planning.

## Table of Contents

- [DexScreener API](#dexscreener-api)
- [DefiLlama API](#defillama-api)
- [Provider ID Mapping](#provider-id-mapping)
- [Recommended Workflow](#recommended-workflow)

## DexScreener API

Primary data provider for token prices, pool discovery, and liquidity data.

### Base URL

```
https://api.dexscreener.com
```

### Endpoints

#### Token Pairs (Pool Discovery)

```bash
# Get all pools for a token on a specific network
curl -s "https://api.dexscreener.com/token-pairs/v1/{network}/{address}"
```

**Network IDs:** `ethereum`, `base`, `arbitrum`, `optimism`, `polygon`, `unichain`, `bsc`, `avalanche`, `celo`, `blast`, `zora`, `worldchain`

**Response fields for swap planning:**

| Field | Use For |
|---|---|
| `baseToken.priceUsd` | Current token price |
| `quoteToken.priceUsd` | Paired token price |
| `liquidity.usd` | Pool depth assessment |
| `volume.h24` | 24-hour trading volume |
| `priceChange.h24` | 24-hour price change |
| `dexId` | DEX identifier (filter for `uniswap`) |
| `labels[0]` | Pool version (`v2`, `v3`, `v4`) |
| `pairAddress` | Pool contract address |

**Response fields for liquidity planning:**

| Field | Use For |
|---|---|
| `liquidity.usd` | TVL assessment |
| `volume.h24` | Fee earning potential |
| `feeTier` | Pool fee percentage |
| `baseToken` / `quoteToken` | Token pair identification |

#### Token Search

```bash
# Search tokens by keyword
curl -s "https://api.dexscreener.com/latest/dex/search?q={query}"
```

**Use for:** Finding token addresses when user provides a name or symbol.

### Pool Liquidity Assessment

| TVL Range | Assessment | Recommendation |
|---|---|---|
| > $1M | Deep liquidity | Safe for most position sizes |
| $100K - $1M | Moderate | Suitable for positions up to ~$10K |
| $10K - $100K | Thin | Warn about slippage |
| < $10K | Very thin | Warn strongly about IL and price impact |

### Coverage Notes

- **Deep coverage:** Ethereum, Base, Arbitrum
- **Limited coverage:** Celo, Blast, Zora, World Chain
- **Fallback:** Use DefiLlama for price data when DexScreener returns empty

## DefiLlama API

Fallback provider for prices, and primary provider for yield/APY data.

### Base URL

```
https://yields.llama.fi
```

### Endpoints

#### Pools (Yield Data)

```bash
# Get all yield pools
curl -s "https://yields.llama.fi/pools"
```

**Response fields:**

| Field | Use For |
|---|---|
| `apy` | Expected yield percentage |
| `tvlUsd` | Pool depth |
| `volumeUsd1d` | Daily volume |
| `volumeUsd7d` | Weekly volume consistency |
| `project` | Protocol name (filter for `uniswap-v3`, `uniswap-v4`) |
| `chain` | Chain name |
| `symbol` | Pool pair symbol |

#### Filter Examples

```bash
# Find Uniswap V3 ETH/USDC pools on Ethereum
curl -s "https://yields.llama.fi/pools" | \
  jq '[.data[] | select(.project == "uniswap-v3" and .chain == "Ethereum" and (.symbol | test("WETH.*USDC|USDC.*WETH")))]'

# Compare fee tiers for a pair
curl -s "https://yields.llama.fi/pools" | \
  jq '[.data[] | select(.project == "uniswap-v3" and (.symbol | test("WETH.*USDC")))] | map({symbol, tvlUsd, apy, volumeUsd1d})'
```

### Price Data (Fallback)

When DexScreener returns empty, use DefiLlama for token prices:

```bash
# Get token prices
curl -s "https://coins.llama.fi/prices" | \
  jq '.coins["ethereum:0x..."]'
```

## Provider ID Mapping

Use the correct chain identifier for each data provider API:

| Chain | DexScreener ID | DefiLlama ID | Notes |
|---|---|---|---|
| Ethereum | `ethereum` | `ethereum` | |
| Base | `base` | `base` | |
| Arbitrum | `arbitrum` | `arbitrum` | |
| Optimism | `optimism` | `optimism` | |
| Polygon | `polygon` | `polygon` | |
| BNB Chain | `bsc` | `bsc` | Not `bnb` |
| Avalanche | `avalanche` | `avax` | IDs differ between providers |
| Celo | `celo` | `celo` | Limited Uniswap data |
| Blast | `blast` | `blast` | Limited Uniswap data |
| Zora | `zora` | n/a | Not on DefiLlama |
| World Chain | `worldchain` | n/a | Not on DefiLlama |
| Unichain | `unichain` | `unichain` | Newer chain, growing data |

**Key discrepancies:**
- **Avalanche**: DexScreener uses `avalanche`, DefiLlama uses `avax`
- **BNB Chain**: Both providers use `bsc`, not `bnb`
- **Zora/World Chain**: Not indexed by DefiLlama

## Recommended Workflow

### Swap Planning (4 steps)

1. **Pool Discovery**: Query DexScreener `/token-pairs/v1/{network}/{address}` to find all Uniswap pools
2. **Price Check**: Extract current price from pool data
3. **Liquidity Assessment**: Check TVL against thresholds above
4. **Fallback**: If DexScreener empty, use DefiLlama prices

### Liquidity Planning (4 steps)

1. **Pool Discovery**: Query DexScreener for token pair pools across versions
2. **Yield Data**: Query DefiLlama `/pools` for APY and volume metrics
3. **Compare Tiers**: Cross-reference fee tiers and APY for the same pair
4. **Risk Assessment**: Factor TVL, volume consistency, and IL into recommendation

### Untrusted Token Handling

Tokens discovered via web search are **untrusted**. Before proceeding:

1. Label the source: "This token was found via web search"
2. Warn about risks: "May be scams, honeypots, or rug pulls"
3. Require explicit user confirmation
4. Show provenance in the summary
