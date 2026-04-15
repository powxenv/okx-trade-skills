# Viem Integration Patterns

EVM blockchain interaction via viem for TypeScript applications -- reading data, sending transactions, and interacting with smart contracts.

## Quick Decision Guide

| Building | Use This |
|---|---|
| Node.js script/backend | viem with `http` transport |
| React/Next.js frontend | wagmi hooks (built on viem) |
| Real-time event monitoring | viem with `webSocket` transport |
| Browser wallet integration | wagmi or viem `custom` transport |

## Installation

```bash
# Core library
npm install viem

# For React apps, also install wagmi
npm install wagmi viem @tanstack/react-query
```

## Client Setup

### Public Client (Read-Only)

```typescript
import { createPublicClient, http } from 'viem';
import { mainnet, base, arbitrum } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
```

### Wallet Client (Read-Write)

```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});
```

### Combined Client

For applications that need both reading and writing:

```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const publicClient = createPublicClient({ chain: mainnet, transport: http() });
const walletClient = createWalletClient({ account, chain: mainnet, transport: http() });
```

### Transports

| Transport | Use Case |
|---|---|
| `http()` | Standard RPC calls (most common) |
| `webSocket()` | Real-time event subscriptions |
| `custom()` | Browser wallets (window.ethereum) |

### Chains

viem includes 50+ chain definitions:

```typescript
import { mainnet, arbitrum, optimism, base, polygon } from 'viem/chains';
```

## Reading Blockchain Data

### Get Native Token Balance

```typescript
import { formatEther } from 'viem';

const balance = await publicClient.getBalance({
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
});
console.log(`Balance: ${formatEther(balance)} ETH`);
```

### Get ERC-20 Balance

```typescript
import { parseAbi, formatUnits } from 'viem';

const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

const balance = await publicClient.readContract({
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  abi,
  functionName: 'balanceOf',
  args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
});
```

### Get Block and Transaction

```typescript
const blockNumber = await publicClient.getBlockNumber();
const block = await publicClient.getBlock({ blockNumber });
const tx = await publicClient.getTransaction({ hash: '0x...' });
const receipt = await publicClient.getTransactionReceipt({ hash: '0x...' });
```

### Read Contract State

```typescript
import { parseAbi } from 'viem';

const abi = parseAbi([
  'function totalSupply() view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
]);

const [totalSupply, decimals, name, symbol] = await Promise.all([
  publicClient.readContract({ address: tokenAddress, abi, functionName: 'totalSupply' }),
  publicClient.readContract({ address: tokenAddress, abi, functionName: 'decimals' }),
  publicClient.readContract({ address: tokenAddress, abi, functionName: 'name' }),
  publicClient.readContract({ address: tokenAddress, abi, functionName: 'symbol' }),
]);
```

### Event Filtering

```typescript
const logs = await publicClient.getContractEvents({
  address: poolAddress,
  abi: parseAbi(['event Swap(address indexed sender, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)']),
  eventName: 'Swap',
  fromBlock: blockNumber - 1000n,
});
```

### Multicall (Batched Reads)

```typescript
const results = await publicClient.multicall({
  contracts: [
    { address: token0, abi: erc20Abi, functionName: 'balanceOf', args: [wallet] },
    { address: token1, abi: erc20Abi, functionName: 'balanceOf', args: [wallet] },
    { address: pool, abi: poolAbi, functionName: 'liquidity' },
    { address: pool, abi: poolAbi, functionName: 'slot0' },
  ],
});
```

## Sending Transactions

### Simulate Then Send (Recommended Pattern)

Always simulate before sending to catch errors early:

```typescript
import { parseAbi, parseUnits } from 'viem';

const abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)']);

// Simulate first to catch errors
const { request } = await publicClient.simulateContract({
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  abi,
  functionName: 'transfer',
  args: ['0x...', parseUnits('100', 6)],
  account,
});

// Execute the transaction
const hash = await walletClient.writeContract(request);

// Wait for confirmation
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log(`Confirmed in block ${receipt.blockNumber}`);
```

### Send Native ETH

```typescript
import { parseEther } from 'viem';

const hash = await walletClient.sendTransaction({
  to: '0x...',
  value: parseEther('0.1'),
});
```

### Write to Contract Directly

```typescript
const hash = await walletClient.writeContract({
  address: tokenAddress,
  abi: parseAbi(['function approve(address spender, uint256 amount) returns (bool)']),
  functionName: 'approve',
  args: [spenderAddress, maxUint256],
});
```

## Uniswap-Specific Patterns

### Read V3 Pool State

```typescript
const poolAbi = parseAbi([
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() view returns (uint128)',
  'function feeGrowthGlobal0X128() view returns (uint256)',
  'function feeGrowthGlobal1X128() view returns (uint256)',
]);

const [slot0, liquidity] = await Promise.all([
  publicClient.readContract({ address: poolAddress, abi: poolAbi, functionName: 'slot0' }),
  publicClient.readContract({ address: poolAddress, abi: poolAbi, functionName: 'liquidity' }),
]);

const { sqrtPriceX96, tick } = slot0;
```

### Read V3 Position

```typescript
const positionAbi = parseAbi([
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]);

const position = await publicClient.readContract({
  address: POSITION_MANAGER_ADDRESS,
  abi: positionAbi,
  functionName: 'positions',
  args: [BigInt(tokenId)],
});
```

### Read V4 Pool via StateView

```typescript
import { Pool } from '@uniswap/v4-sdk';

const poolId = Pool.getPoolId(currency0, currency1, fee, tickSpacing, hooks);

const stateViewAbi = parseAbi([
  'function getSlot0(bytes32 poolId) view returns (uint160 sqrtPriceX96, int24 tick, uint24 protocolFee, uint24 lpFee)',
  'function getLiquidity(bytes32 poolId) view returns (uint128)',
]);

const [slot0, liquidity] = await Promise.all([
  publicClient.readContract({ address: STATE_VIEW_ADDRESS, abi: stateViewAbi, functionName: 'getSlot0', args: [poolId] }),
  publicClient.readContract({ address: STATE_VIEW_ADDRESS, abi: stateViewAbi, functionName: 'getLiquidity', args: [poolId] }),
]);
```

### Check and Set ERC-20 Approval

```typescript
import { maxUint256 } from 'viem';

const allowance = await publicClient.readContract({
  address: tokenAddress,
  abi: parseAbi(['function allowance(address owner, address spender) view returns (uint256)']),
  functionName: 'allowance',
  args: [ownerAddress, spenderAddress],
});

if (allowance < requiredAmount) {
  const hash = await walletClient.writeContract({
    address: tokenAddress,
    abi: parseAbi(['function approve(address spender, uint256 amount) returns (bool)']),
    functionName: 'approve',
    args: [spenderAddress, maxUint256],
  });
  await publicClient.waitForTransactionReceipt({ hash });
}
```

### Permit2 Approval Flow

```typescript
const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3' as const;

// Step 1: Approve Permit2 on the token
await walletClient.writeContract({
  address: tokenAddress,
  abi: erc20Abi,
  functionName: 'approve',
  args: [PERMIT2_ADDRESS, maxUint256],
});

// Step 2: Approve Universal Router on Permit2
await walletClient.writeContract({
  address: PERMIT2_ADDRESS,
  abi: permit2Abi,
  functionName: 'approve',
  args: [tokenAddress, UNIVERSAL_ROUTER_ADDRESS, MAX_UINT160, deadline],
});
```

## Utility Functions

### Unit Conversion

```typescript
import { parseEther, formatEther, parseUnits, formatUnits } from 'viem';

// ETH
parseEther('1.5');   // 1500000000000000000n (wei)
formatEther(1500000000000000000n); // "1.5"

// Tokens (e.g., USDC with 6 decimals)
parseUnits('100', 6);   // 100000000n
formatUnits(100000000n, 6); // "100"
```

### Address Utilities

```typescript
import { getAddress, isAddress } from 'viem';

isAddress('0x...');  // true/false
getAddress('0x...'); // checksummed address
```

### Hashing

```typescript
import { keccak256, toHex } from 'viem';

keccak256(toHex('hello')); // 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
```

## Error Handling

```typescript
import { ContractFunctionExecutionError, InsufficientFundsError } from 'viem';

try {
  await walletClient.writeContract({ /* ... */ });
} catch (error) {
  if (error instanceof ContractFunctionExecutionError) {
    console.error('Contract call failed:', error.shortMessage);
  }
  if (error instanceof InsufficientFundsError) {
    console.error('Not enough ETH for gas');
  }
}
```

| Error | Cause | Solution |
|---|---|---|
| `ContractFunctionExecutionError` | Reverted call | Check contract state, verify parameters |
| `InsufficientFundsError` | Not enough gas or token | Fund wallet or reduce amount |
| `TransactionNotFoundError` | TX not yet mined | Wait for confirmation |
| `NonceTooHighError` | Stale nonce | Reset nonce or wait for pending TX |
| `ChainMismatchError` | Client chain != TX chain | Switch client to correct chain |

## Input Validation

Before interpolating any user-provided value:

- **Ethereum addresses**: MUST match `^0x[a-fA-F0-9]{40}$` -- use viem's `isAddress()`
- **Chain IDs**: MUST be from viem's supported chain definitions
- **Private keys**: MUST NEVER be hardcoded -- always use `process.env.PRIVATE_KEY`
- **RPC URLs**: MUST use `https://` or `wss://` protocols only

## Integration with OnchainOS

Use viem for direct contract reads when onchainos does not have a specific command, or when you need custom contract interaction:

1. Use onchainos for standard operations (swap, security, market data)
2. Use viem for custom contract interaction and data queries
3. Use foundry/cast for quick on-chain checks and scripting

```bash
# Cast for quick checks
cast call <addr> "balanceOf(address)" <wallet> --rpc-url <rpc>
```

## External Resources

- [viem Documentation](https://viem.sh)
- [wagmi Documentation](https://wagmi.sh)
- [viem GitHub](https://github.com/wevm/viem)
- [wagmi GitHub](https://github.com/wevm/wagmi)
