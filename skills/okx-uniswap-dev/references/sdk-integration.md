# SDK & Trading API Integration

Integrate Uniswap swaps into frontends, backends, and smart contracts using the Trading API, Universal Router SDK, and V4 SDK.

## Quick Decision Guide

| Building | Use This Method |
|---|---|
| Frontend with React/Next.js | Trading API |
| Backend script or bot | Trading API |
| Smart contract integration | Universal Router direct calls |
| Need full control over routing | Universal Router SDK |
| V4-specific features | V4 SDK (`@uniswap/v4-sdk`) |

## Trading API

### Setup

**Base URL:** `https://trade-api.gateway.uniswap.org/v1`

**Required headers for ALL requests:**

```
Content-Type: application/json
x-api-key: <your-api-key>
x-universal-router-version: 2.0
```

Get an API key at [developers.uniswap.org](https://developers.uniswap.org).

### 3-Step Swap Flow

**Step 1: Check Token Approval**

```bash
POST /check_approval

{
  "walletAddress": "0x...",
  "token": "0x...",
  "amount": "1000000000",
  "chainId": 1
}
```

Response: `{ "approval": { "to", "from", "data", "value", "chainId" } }` or `{ "approval": null }` if already approved.

**Step 2: Get Quote**

```bash
POST /quote

{
  "swapper": "0x...",
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "tokenInChainId": "1",
  "tokenOutChainId": "1",
  "amount": "1000000000000000000",
  "type": "EXACT_INPUT",
  "slippageTolerance": 0.5,
  "routingPreference": "BEST_PRICE"
}
```

Key parameters:

| Parameter | Description |
|---|---|
| `type` | `EXACT_INPUT` or `EXACT_OUTPUT` |
| `slippageTolerance` | 0-100 percentage |
| `protocols` | Optional: `["V2", "V3", "V4"]` |
| `routingPreference` | `BEST_PRICE`, `FASTEST`, `CLASSIC` |
| `autoSlippage` | `true` to auto-calculate slippage |

**Important:** `tokenInChainId` and `tokenOutChainId` must be strings (e.g., `"1"`), not numbers.

**Step 3: Execute Swap**

```bash
POST /swap
```

Spread the quote response into the body. Do NOT wrap in `{quote: quoteResponse}`.

### Routing Types

| Type | Description | Chains |
|---|---|---|
| CLASSIC | Standard AMM swap | All supported chains |
| DUTCH_V2 | UniswapX Dutch auction V2 | Ethereum, Arbitrum, Base, Unichain |
| DUTCH_V3 | UniswapX Dutch auction V3 | Ethereum, Arbitrum, Base, Unichain |
| PRIORITY | MEV-protected priority order | Base, Unichain |
| DUTCH_LIMIT | Dutch limit order | Supported chains |
| LIMIT_ORDER | Limit order | Supported chains |
| WRAP | ETH to WETH conversion | All |
| UNWRAP | WETH to ETH conversion | All |
| BRIDGE | Cross-chain bridge | Supported chains |
| QUICKROUTE | Fast approximation quote | All |

### Quote Response Types

**CLASSIC response:**

```json
{
  "routing": "CLASSIC",
  "quote": {
    "input": { "token": "0x...", "amount": "1000000000000000000" },
    "output": { "token": "0x...", "amount": "999000000" },
    "slippage": 0.5,
    "gasFee": "5000000000000000",
    "gasFeeUSD": "0.01",
    "gasUseEstimate": "150000"
  },
  "permitData": null
}
```

**UniswapX (DUTCH_V2/V3/PRIORITY) response:**

```json
{
  "routing": "DUTCH_V2",
  "quote": {
    "orderInfo": {
      "outputs": [{ "token": "0x...", "startAmount": "999000000", "endAmount": "994000000" }],
      "input": { "token": "0x...", "startAmount": "1000000000000000000" },
      "deadline": 1772031054
    },
    "encodedOrder": "0x...",
    "orderHash": "0x..."
  },
  "permitData": { "domain": {}, "types": {}, "values": {} }
}
```

**UniswapX output amount:** Use `quote.orderInfo.outputs[0].startAmount` for best-case fill. The `endAmount` is the floor after full auction decay. There is no `quote.output.amount` on UniswapX responses.

### Permit2 Field Rules

**CLASSIC routes:**

| Scenario | `signature` | `permitData` |
|---|---|---|
| Standard swap (no Permit2) | Omit | Omit |
| Permit2 swap | Required | Required |
| **Invalid** | Present | Missing |
| **Invalid** | Missing | Present |
| **Invalid (API error)** | Any | `null` |

**UniswapX routes (DUTCH_V2/V3/PRIORITY):**

| Scenario | `signature` | `permitData` |
|---|---|---|
| UniswapX order | Required | **Omit** (do not send) |
| **Invalid** | Any | Present (schema rejects) |

### Swap Request Body Preparation

```typescript
function prepareSwapRequest(quoteResponse: Record<string, unknown>, signature?: string): object {
  const { permitData, permitTransaction, ...cleanQuote } = quoteResponse;
  const request: Record<string, unknown> = { ...cleanQuote };

  const isUniswapX =
    quoteResponse.routing === 'DUTCH_V2' ||
    quoteResponse.routing === 'DUTCH_V3' ||
    quoteResponse.routing === 'PRIORITY';

  if (isUniswapX) {
    if (signature) request.signature = signature;
  } else {
    if (signature && permitData && typeof permitData === 'object') {
      request.signature = signature;
      request.permitData = permitData;
    }
  }

  return request;
}
```

### Pre-Broadcast Validation

Always validate the swap response before sending to blockchain:

```typescript
function validateSwapBeforeBroadcast(swap: SwapTransaction): void {
  if (!swap.data || swap.data === '' || swap.data === '0x') {
    throw new Error('swap.data is empty - quote may have expired. Re-fetch.');
  }
  if (!isHex(swap.data)) {
    throw new Error('swap.data is not valid hex');
  }
  if (!isAddress(swap.to) || !isAddress(swap.from)) {
    throw new Error('Invalid address in swap response');
  }
}
```

## Universal Router SDK

### Installation

```bash
npm install @uniswap/universal-router-sdk @uniswap/sdk-core @uniswap/v3-sdk viem
```

### High-Level Swap

```typescript
import { SwapRouter } from '@uniswap/universal-router-sdk';
import { Trade as RouterTrade } from '@uniswap/router-sdk';
import { TradeType, Percent } from '@uniswap/sdk-core';
import { Route as V3Route, Pool } from '@uniswap/v3-sdk';

// Build pool and route
const pool = new Pool(tokenIn, tokenOut, fee, sqrtPriceX96, liquidity, tick);
const route = new V3Route([pool], tokenIn, tokenOut);
const trade = RouterTrade.createUncheckedTrade({
  route, inputAmount, outputAmount, tradeType: TradeType.EXACT_INPUT,
});

// Get calldata
const { calldata, value } = SwapRouter.swapCallParameters(trade, {
  slippageTolerance: new Percent(50, 10000),
  recipient: walletAddress,
  deadline: Math.floor(Date.now() / 1000) + 1800,
});

// Execute with viem
const hash = await walletClient.sendTransaction({
  to: UNIVERSAL_ROUTER_ADDRESS,
  data: calldata,
  value: BigInt(value),
});
```

### Command Reference

| Command | Code | Parameters |
|---|---|---|
| V3_SWAP_EXACT_IN | 0x00 | (recipient, amountIn, amountOutMin, path, payerIsUser) |
| V3_SWAP_EXACT_OUT | 0x01 | (recipient, amountOut, amountInMax, path, payerIsUser) |
| V2_SWAP_EXACT_IN | 0x08 | (recipient, amountIn, amountOutMin, path[], payerIsUser) |
| V2_SWAP_EXACT_OUT | 0x09 | (recipient, amountOut, amountInMax, path[], payerIsUser) |
| V4_SWAP | 0x10 | V4Planner actions |
| WRAP_ETH | 0x0b | (recipient, amount) |
| UNWRAP_WETH | 0x0c | (recipient, amountMin) |
| SWEEP | 0x04 | (token, recipient, amountMin) |
| PERMIT2_TRANSFER_FROM | 0x02 | Single token transfer |

### ETH to Token (Wrap + Swap)

```typescript
const planner = new RoutePlanner();
planner.addCommand(CommandType.WRAP_ETH, [ADDRESS_THIS, amountIn]);
planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [MSG_SENDER, amountIn, amountOutMin, path, false]);
// Execute with value: amountIn
```

### Token to ETH (Swap + Unwrap)

```typescript
const planner = new RoutePlanner();
planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [ADDRESS_THIS, amountIn, amountOutMin, path, true]);
planner.addCommand(CommandType.UNWRAP_WETH, [MSG_SENDER, amountOutMin]);
```

### Swap with Fee Collection

```typescript
const planner = new RoutePlanner();
planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [ADDRESS_THIS, amountIn, 0n, path, true]);
planner.addCommand(CommandType.PAY_PORTION, [outputToken, feeRecipient, feeBips]);
planner.addCommand(CommandType.SWEEP, [outputToken, MSG_SENDER, 0n]);
```

## V4 SDK Integration

### Installation

```bash
npm i @uniswap/v4-sdk @uniswap/sdk-core @uniswap/universal-router-sdk
```

### V4 vs V3 Differences

| Aspect | V3 | V4 |
|---|---|---|
| Swap execution | SwapRouter directly | Universal Router + V4Planner |
| Pool architecture | One contract per pool | Singleton PoolManager |
| Pool state reads | Direct pool contract | StateView contract |
| Native ETH | Wrap to WETH | `Ether.onChain(chainId)` |
| Position NFTs | NonfungiblePositionManager | PositionManager + multicall |
| Fee collection | Explicit `collect()` | Automatic on position modification |
| Token approvals | Direct approve | Permit2 required |

### V4 Single-Hop Swap

```typescript
import { Actions, V4Planner } from '@uniswap/v4-sdk';
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk';

const v4Planner = new V4Planner();
v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [{
  poolKey: { currency0, currency1, fee, tickSpacing, hooks },
  zeroForOne,
  amountIn,
  amountOutMinimum,
  hookData: '0x00',
}]);
v4Planner.addAction(Actions.SETTLE_ALL, [inputCurrency, amountIn]);
v4Planner.addAction(Actions.TAKE_ALL, [outputCurrency, amountOutMinimum]);

const routePlanner = new RoutePlanner();
routePlanner.addCommand(CommandType.V4_SWAP, [v4Planner.actions, v4Planner.params]);

const deadline = Math.floor(Date.now() / 1000) + 3600;
// Execute via Universal Router
```

### V4 Multi-Hop Swap

```typescript
import { Actions, V4Planner, encodeMultihopExactInPath } from '@uniswap/v4-sdk';

const path = encodeMultihopExactInPath([poolKeyAB, poolKeyBC], tokenA);
const v4Planner = new V4Planner();
v4Planner.addAction(Actions.SWAP_EXACT_IN, [{ path, amountIn, amountOutMinimum }]);
v4Planner.addAction(Actions.SETTLE_ALL, [tokenA, amountIn]);
v4Planner.addAction(Actions.TAKE_ALL, [tokenC, amountOutMinimum]);
```

### Quoting (Off-Chain Simulation)

```typescript
const quote = await quoterContract.callStatic.quoteExactInputSingle({
  poolKey, zeroForOne, exactAmount: amountIn, hookData: '0x00',
});
```

Four available methods: `quoteExactInputSingle`, `quoteExactInput`, `quoteExactOutputSingle`, `quoteExactOutput`.

### Pool State Reads (StateView)

```typescript
import { Pool } from '@uniswap/v4-sdk';

const poolId = Pool.getPoolId(currency0, currency1, fee, tickSpacing, hooks);
const [slot0, liquidity] = await Promise.all([
  stateViewContract.getSlot0(poolId),
  stateViewContract.getLiquidity(poolId),
]);
```

### V4 Position Management

All operations use `PositionManager.multicall()`:

| Operation | SDK Method |
|---|---|
| Add liquidity | `V4PositionManager.addCallParameters(position, options)` |
| Remove liquidity | `V4PositionManager.removeCallParameters(position, options)` |
| Collect fees | `V4PositionManager.collectCallParameters(options)` |
| Create position | `V4PositionManager.createCallParameters(position, options)` |

### ERC20 Approval Flow (Permit2)

ERC20 swaps require two approvals:

```typescript
// Step 1: Approve Permit2 on the token
await erc20Contract.approve(PERMIT2_ADDRESS, MaxUint256);
// Step 2: Approve Universal Router on Permit2
await permit2Contract.approve(tokenAddress, UNIVERSAL_ROUTER_ADDRESS, MAX_UINT160, deadline);
```

Native ETH swaps bypass both approvals.

## Strict V4 SDK Rules

1. NEVER call PoolManager directly for swaps -- ALWAYS route through Universal Router
2. NEVER assume contract addresses are the same across chains -- look up from deployments page
3. NEVER call Quoter on-chain (gas expensive) -- ALWAYS use `callStatic` for off-chain simulation
4. NEVER skip Permit2 for ERC20 swaps -- direct `approve` to Universal Router will not work
5. ALWAYS set a deadline on swaps and LP operations
6. ALWAYS handle native ETH with `Ether.onChain(chainId)`, not WETH
7. ALWAYS use `Pool.getPoolId()` to compute pool identifiers

## Browser Environment Setup

### Buffer Polyfill

```bash
npm install buffer
```

```typescript
// src/main.tsx
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
```

### CORS Proxy (Required)

The Trading API does not support browser CORS preflight requests. You must proxy API requests.

**Vite:**

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api/uniswap': {
        target: 'https://trade-api.gateway.uniswap.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uniswap/, ''),
      },
    },
  },
});
```

**Next.js:**

```javascript
module.exports = {
  async rewrites() {
    return [{ source: '/api/uniswap/:path*', destination: 'https://trade-api.gateway.uniswap.org/v1/:path*' }];
  },
};
```

## Key Contract Addresses

### Universal Router

| Chain | ID | Address |
|---|---|---|
| Ethereum | 1 | `0x66a9893cc07d91d95644aedd05d03f95e1dba8af` |
| Base | 8453 | `0x6ff5693b99212da76ad316178a184ab56d299b43` |
| Arbitrum | 42161 | `0xa51afafe0263b40edaef0df8781ea9aa03e381a3` |
| Unichain | 130 | `0xef740bf23acae26f6492b10de645d6b98dc8eaf3` |
| Optimism | 10 | `0x851116d9223fabed8e56c0e6b8ad0c31d98b3507` |
| Polygon | 137 | `0x1095692a6237d83c6a72f3f5efedb9a670c49223` |

### Permit2

| Chain | Address |
|---|---|
| All chains | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

For testnet addresses, see [Uniswap v4 Deployments](https://docs.uniswap.org/contracts/v4/deployments).

## Rate Limiting

The Trading API enforces ~10 requests/second per endpoint.

```typescript
async function fetchWithRetry(url: string, init: RequestInit, maxRetries = 5): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, init);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === maxRetries) throw new Error(`Failed after ${maxRetries} retries`);
    const delay = Math.min(200 * Math.pow(2, attempt) + Math.random() * 100, 10000);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Unreachable');
}
```

## External Resources

- [Uniswap SDK Overview](https://docs.uniswap.org/sdk/v4/overview)
- [V4 Swap Guides](https://docs.uniswap.org/sdk/v4/guides/swaps/quoting)
- [V4 Liquidity Guide](https://docs.uniswap.org/sdk/v4/guides/liquidity/add-remove-liquidity)
- [Universal Router GitHub](https://github.com/Uniswap/universal-router)
- [SDK Monorepo](https://github.com/Uniswap/sdks)
