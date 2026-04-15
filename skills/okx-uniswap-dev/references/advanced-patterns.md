# Advanced Trading API Patterns

Supplementary patterns for the swap-integration skill covering smart account integration, L2 WETH handling, and rate limiting.

## Smart Account Integration (ERC-4337)

Execute Trading API swaps through ERC-4337 smart accounts using delegation and bundlers.

### Architecture

```text
Trading API (get calldata) -> Create Execution -> Delegation Redemption -> Bundler (UserOperation)
```

### Full Pattern

```typescript
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
  encodeFunctionData,
} from 'viem';
import { base } from 'viem/chains';

interface SwapCalldata {
  to: Address;
  data: Hex;
  value: string;
}

interface Execution {
  target: Address;
  callData: Hex;
  value: bigint;
}

// 1. Get swap calldata from Trading API (standard 3-step flow)
async function getSwapCalldata(
  quoteResponse: Record<string, unknown>,
  apiKey: string
): Promise<SwapCalldata> {
  const { permitData, permitTransaction, ...cleanQuote } = quoteResponse;

  const swapRes = await fetch('https://trade-api.gateway.uniswap.org/v1/swap', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...cleanQuote,
      ...(permitData && { permitData }),
    }),
  });

  const swapData = await swapRes.json();
  if (!swapRes.ok) throw new Error(swapData.detail || 'Swap request failed');

  return swapData.swap;
}

// 2. Create execution for delegation redemption
function createExecution(swap: SwapCalldata): Execution {
  return {
    target: swap.to, // Universal Router address
    callData: swap.data,
    value: BigInt(swap.value),
  };
}

// 3. Submit via bundler as a UserOperation
async function executeViaSmartAccount(
  bundlerClient: {
    sendUserOperation: (params: {
      account: unknown;
      calls: readonly { to: Address; data: Hex; value?: bigint }[];
    }) => Promise<Hex>;
  },
  delegateSmartAccount: unknown,
  delegationManagerAddress: Address,
  signedDelegation: unknown,
  execution: Execution
): Promise<Hex> {
  const redeemData = encodeFunctionData({
    abi: [{
      name: 'redeemDelegations',
      type: 'function',
      inputs: [
        { name: 'delegations', type: 'tuple[][]', components: [] },
        { name: 'modes', type: 'uint8[]' },
        { name: 'executions', type: 'tuple[][]', components: [] },
      ],
      outputs: [],
    }] as const,
    functionName: 'redeemDelegations',
    args: [[[signedDelegation]], [0], [[execution]]],
  });

  return bundlerClient.sendUserOperation({
    account: delegateSmartAccount,
    calls: [{ to: delegationManagerAddress, data: redeemData, value: execution.value }],
  });
}
```

### Key Considerations

- **Approval target**: For smart accounts, approve tokens directly to the Universal Router (legacy mode) rather than using Permit2
- **Gas estimation**: Add 20-30% buffer to `callGasLimit` for swap operations
- **Nonce management**: Handle UserOperation nonces carefully for sequential swaps
- **Error handling**: Check both UserOperation receipt and inner execution status

## WETH Handling on L2s

On L2 chains (Base, Optimism, Arbitrum), swaps that output ETH often deliver WETH instead of native ETH.

### WETH Addresses by Chain

| Chain | Chain ID | WETH Address |
|---|---|---|
| Ethereum | 1 | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| Base | 8453 | `0x4200000000000000000000000000000000000006` |
| Optimism | 10 | `0x4200000000000000000000000000000000000006` |
| Arbitrum | 42161 | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` |

### Detection and Unwrap Pattern

```typescript
import { createPublicClient, createWalletClient, http, parseAbi, type Address } from 'viem';
import { base } from 'viem/chains';

const WETH_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function withdraw(uint256)',
]);

const WETH_ADDRESSES: Record<number, Address> = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  10: '0x4200000000000000000000000000000000000006',
  8453: '0x4200000000000000000000000000000000000006',
  42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
};

async function unwrapWethIfNeeded(
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: ReturnType<typeof createWalletClient>,
  accountAddress: Address,
  chainId: number
): Promise<void> {
  const wethAddress = WETH_ADDRESSES[chainId];
  if (!wethAddress) return;

  const wethBalance = await publicClient.readContract({
    address: wethAddress,
    abi: WETH_ABI,
    functionName: 'balanceOf',
    args: [accountAddress],
  });

  if (wethBalance > 0n) {
    const hash = await walletClient.writeContract({
      address: wethAddress,
      abi: WETH_ABI,
      functionName: 'withdraw',
      args: [wethBalance],
    });
    await publicClient.waitForTransactionReceipt({ hash });
  }
}
```

## Rate Limiting Best Practices

### Known Limits

| Endpoint | Rate Limit |
|---|---|
| `/check_approval` | ~10 requests/second |
| `/quote` | ~10 requests/second |
| `/swap` | ~10 requests/second |

### Exponential Backoff with Jitter

```typescript
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  maxRetries = 5,
  baseDelayMs = 200,
  maxDelayMs = 10000
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, init);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === maxRetries) throw new Error(`Failed after ${maxRetries} retries`);
    const delay = Math.min(baseDelayMs * Math.pow(2, attempt) + Math.random() * 100, maxDelayMs);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Unreachable');
}
```

### Best Practices

- Add 100-200ms delays between sequential API calls
- Cache approval check results (approvals rarely change)
- Monitor for 429 responses and adjust delay dynamically
