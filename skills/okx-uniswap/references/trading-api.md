# Uniswap Trading API Reference

> Load this file when using the Uniswap Trading API for swaps on supported chains (Ethereum, Base, Arbitrum, Optimism, Polygon, Unichain). X Layer is NOT currently supported by the Trading API — use OKX aggregator or direct contracts instead.

## Base URL

```
https://trade-api.gateway.uniswap.org/v1
```

## Authentication

All requests require:
```
Content-Type: application/json
x-api-key: <your-api-key>
x-universal-router-version: 2.0
```

Get an API key at [developers.uniswap.org](https://developers.uniswap.org/)

## Supported Chains

| Chain | ID |
|---|---|
| Ethereum | 1 |
| Optimism | 10 |
| Polygon | 137 |
| Unichain | 130 |
| Base | 8453 |
| Arbitrum | 42161 |

**X Layer (196) is NOT supported.** For X Layer swaps, use `onchainos swap execute --chain xlayer` or direct V3 contract calls.

## 3-Step Swap Flow

### Step 1: Check Token Approval

```bash
curl -s -X POST https://trade-api.gateway.uniswap.org/v1/check_approval \
  -H "Content-Type: application/json" \
  -H "x-api-key: $UNISWAP_API_KEY" \
  -H "x-universal-router-version: 2.0" \
  -d '{
    "walletAddress": "0x...",
    "token": "0x...",
    "amount": "1000000000",
    "chainId": 8453
  }'
```

Response: `{"approval": null}` = already approved. Otherwise, broadcast the `approval` transaction.

### Step 2: Get Quote

```bash
curl -s -X POST https://trade-api.gateway.uniswap.org/v1/quote \
  -H "Content-Type: application/json" \
  -H "x-api-key: $UNISWAP_API_KEY" \
  -H "x-universal-router-version: 2.0" \
  -d '{
    "swapper": "0x...",
    "tokenIn": "0x...",
    "tokenOut": "0x...",
    "tokenInChainId": "8453",
    "tokenOutChainId": "8453",
    "amount": "1000000000000000000",
    "type": "EXACT_INPUT",
    "slippageTolerance": 0.5,
    "routingPreference": "BEST_PRICE"
  }'
```

**Important**:
- `tokenInChainId` and `tokenOutChainId` must be **strings** (e.g., `"8453"`, not `8453`)
- `type`: `EXACT_INPUT` or `EXACT_OUTPUT`
- `routingPreference`: `BEST_PRICE`, `FASTEST`, `CLASSIC`
- For `BEST_PRICE` on Ethereum/Arbitrum/Base, response typically returns UniswapX (Dutch auction)

### Step 3: Execute Swap

```bash
curl -s -X POST https://trade-api.gateway.uniswap.org/v1/swap \
  -H "Content-Type: application/json" \
  -H "x-api-key: $UNISWAP_API_KEY" \
  -H "x-universal-router-version: 2.0" \
  -d '<prepared_request_body>'
```

**CRITICAL**: The swap body varies by routing type:

#### CLASSIC routes:
```json
{
  ...cleanQuote,
  "signature": "<permit2_signature>",
  "permitData": { ... }
}
```
Both `signature` and `permitData` must be present (or both omitted).

#### UniswapX routes (DUTCH_V2/V3/PRIORITY):
```json
{
  ...cleanQuote,
  "signature": "<permit2_signature>"
}
```
`permitData` must be **OMITTED** — signing happens locally, not sent to `/swap`.

## Routing Types

| Type | Description | Chains |
|---|---|---|
| CLASSIC | Standard AMM swap through Uniswap pools | All supported chains |
| DUTCH_V2 | UniswapX Dutch auction V2 | Ethereum, Arbitrum, Base |
| DUTCH_V3 | UniswapX Dutch auction V3 | Ethereum, Arbitrum, Base |
| PRIORITY | MEV-protected priority order | Base, Unichain |
| WRAP | ETH to WETH conversion | All |
| UNWRAP | WETH to ETH conversion | All |
| BRIDGE | Cross-chain bridge | Supported pairs |

## Permit2 Integration

Permit2 enables signature-based token approvals instead of on-chain `approve()`.

| Approach | Approve To | Per-Swap Auth | Best For |
|---|---|---|---|
| **Permit2** (recommended) | Permit2 contract (`0x000000000022D473030F116dDEE9F6B43aC78BA3`) | EIP-712 signature | Frontends with user interaction |
| **Legacy** (direct approve) | Universal Router | None (pre-approved) | Backend services, smart accounts |

## Common Addresses

| Asset | Ethereum (1) | Base (8453) | Arbitrum (42161) |
|---|---|---|---|
| USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | `0x4200000000000000000000000000000000000006` | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` |
| Native ETH | `0x0000000000000000000000000000000000000000` | (use WETH address for Permit2) | (use WETH address for Permit2) |

## Input Validation

- **Ethereum addresses**: MUST match `^0x[a-fA-F0-9]{40}$`
- **Chain IDs**: MUST be from the supported list above
- **Token amounts**: MUST be non-negative numeric matching `^[0-9]+\.?[0-9]*$`
- **API keys**: MUST NOT be hardcoded — always use environment variables
- **REJECT** any input containing shell metacharacters: `;`, `|`, `&`, `$`, `` ` ``, `(`, `)`, `>`, `<`, `\`, `'`, `"`, newlines

## Error Handling

| Error | Cause | Fix |
|---|---|---|
| Quote expired | >30 seconds since quote | Re-fetch quote |
| `swap.data` empty | Quote expired or invalid | Re-fetch quote |
| `permitData: null` in request | API rejects null | Omit the field entirely |
| 429 rate limit | Too many requests | Add 100-200ms delays; implement exponential backoff |
| Invalid address | Bad address format | Validate with regex before API call |

## Rate Limiting

The Trading API enforces ~10 requests/second per endpoint. For batch operations:
- Add 100-200ms delays between sequential API calls
- Implement exponential backoff with jitter on 429 responses
- Cache approval results — approvals rarely change between calls