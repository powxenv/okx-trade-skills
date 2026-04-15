# Troubleshooting

Common issues and solutions when building, deploying, and managing Uniswap integrations.

## Hook Compilation Errors

| Error | Cause | Solution |
|---|---|---|
| `Stack too deep` | Too many local variables in hook | Refactor into helper functions; use structs to group parameters |
| `Type conversion error` | Mismatch between int/uint sizes | Use explicit casts: `uint256(uint128(value))` |
| `Undeclared identifier` | Missing import or variable | Check imports, verify variable scope |
| `Contract size too large` | Hook exceeds 24KB limit | Split into library + hook; minimize storage |
| `Math overflow` | Arithmetic exceeds type bounds | Use SafeCast library; check bounds before operations |
| `Immutable variables error` | Trying to modify immutable state | Use `transientStorage` for intra-tx state instead |

### Dependency Issues

```bash
# Reinstall dependencies
forge install
forge clean && forge build

# Update to latest Uniswap v4
forge install Uniswap/v4-core@latest --no-commit
forge install Uniswap/v4-periphery@latest --no-commit

# Clear cache and rebuild
forge clean && forge build --force
```

## Hook Deployment Failures

### Address Mining Issues

| Problem | Cause | Solution |
|---|---|---|
| `HookAddressMismatch` | Deployed address does not match required permission bits | Use `HookMiner` from v4-periphery to mine correct salt |
| `CREATE2 collision` | Salt already used | Use a different salt value |
| `PoolManager revert on pool creation` | Hook address flags don't match actual permissions | Verify `getHookPermissions()` returns correct flags for the address |

```bash
# Verify hook permissions match address
cast call <HOOK_ADDRESS> "getHookPermissions()(tuple)" --rpc-url <rpc>

# Mine a valid address with HookMiner
forge script script/MineHookAddress.s.sol --rpc-url <rpc>
```

### Gas Estimation Failures

```bash
# Check current gas price
cast gas-price --rpc-url <rpc>

# Estimate gas for deployment
forge script script/DeployHook.s.sol --rpc-url <rpc> --gas-estimate

# If gas estimation fails, try with explicit gas limit
forge script script/DeployHook.s.sol --rpc-url <rpc> --broadcast --with-gas-price <price>
```

### Transaction Reverts

| Revert Reason | Cause | Solution |
|---|---|---|
| `INSUFFICIENT_FUNDS` | Deployer lacks ETH for gas | Fund deployer wallet |
| `CREATE2_FAILED` | Salt collision or invalid params | Use different salt, verify factory args |
| `INITIALIZATION_FAILED` | Pool parameters invalid | Check token order, fee tier, hook address |
| `UNAUTHORIZED` | Wrong signer or missing role | Verify deployer has required permissions |
| `HookCallbackFailed` | Hook callback reverted during pool init | Debug hook callback logic separately |
| `InvalidHookResponse` | Hook returned unexpected selector | Verify callback return values match expected selectors |

## CCA Deployment Issues

| Issue | Solution |
|---|---|
| "Invalid block sequence" | Ensure `startBlock < endBlock <= claimBlock` |
| "Floor price not aligned" | Round floor price to multiple of tick spacing: `(floorPrice // tickSpacing) * tickSpacing` |
| "Tick spacing too small" | Use at least 1% of floor price |
| "Total supply too large" | Max 1e30 wei (1 trillion 18-decimal tokens) |
| "Gas inefficiency" | Increase tick spacing |
| "Invalid address" | Verify 42 chars starting with 0x |
| `onTokensReceived` not called | Call `onTokensReceived()` post-deployment -- required before auction accepts bids |
| Token approval failed | Approve token transfer to factory before calling `initializeDistribution` |

## Swap Issues

### Swap Reverts

| Error | Cause | Solution |
|---|---|---|
| `STF()` (SafeTransferFrom) | Token not approved | Approve router to spend your tokens; use Permit2 |
| `Price impact too high` | Large trade relative to pool | Reduce amount or split into smaller trades |
| `Slippage exceeded` | Price moved during execution | Increase `slippageTolerance` (e.g., 0.5 -> 1.0) |
| `Insufficient liquidity` | Pool too shallow | Find alternative pool, route, or reduce amount |
| `Too little received` | Output below `amountOutMinimum` | Increase slippage tolerance or reduce trade size |
| `Expired deadline` | Transaction submitted after deadline | Re-fetch quote and execute faster; increase deadline |
| `Invalid swap data` | Empty `data` field in swap response | Quote expired -- re-fetch and try again |

### Trading API Errors

| Error Message | Cause | Fix |
|---|---|---|
| `"permitData" must be of type object` | Sending `permitData: null` | Omit the field entirely when null |
| `"quote" does not match allowed types` | Wrapping quote in `{quote: response}` | Spread quote response: `{...quoteResponse}` |
| Same error, different cause | Including `permitData` in UniswapX `/swap` body | Omit `permitData` for DUTCH_V2/V3/PRIORITY routes |
| `signature and permitData must both be present` | Only one Permit2 field (CLASSIC) | Include both or neither for CLASSIC routes |
| `No route found` (404) | No liquidity path for token pair | Try different chain, smaller amount, or different token |
| `Rate limit exceeded` (429) | Too many requests | Implement exponential backoff, add delays between requests |
| `Internal error` (500) | API-side issue | Retry with backoff after a few seconds |

### Approval Issues

```bash
# Check current approvals for a token
cast call <TOKEN> "allowance(address,address)(uint256)" <OWNER> <SPENDER> --rpc-url <rpc>

# If swap fails due to pending approval:
# 1. Wait for block confirmation (based on chain block time)
# 2. Verify allowance is sufficient
# 3. Retry swap

# Common approval targets:
# - Permit2: 0x000000000022D473030F116dDEE9F6B43aC78BA3
# - Universal Router: varies by chain (check deployments page)
```

### WETH Handling on L2s

On L2 chains (Base, Optimism, Arbitrum), swap outputs may deliver WETH instead of native ETH. Always check and unwrap:

```typescript
import { parseAbi } from 'viem';

const WETH_ADDRESSES: Record<number, Address> = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  10: '0x4200000000000000000000000000000000000006',
  8453: '0x4200000000000000000000000000000000000006',
  42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
};

const wethAddress = WETH_ADDRESSES[chainId];
if (wethAddress) {
  const wethBalance = await publicClient.readContract({
    address: wethAddress,
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [accountAddress],
  });
  if (wethBalance > 0n) {
    await walletClient.writeContract({
      address: wethAddress,
      abi: parseAbi(['function withdraw(uint256)']),
      functionName: 'withdraw',
      args: [wethBalance],
    });
  }
}
```

## Gas Estimation Problems

| Problem | Cause | Solution |
|---|---|---|
| Gas estimate too low | Complex hook logic | Add 20-30% buffer to gas estimates |
| Gas estimate too high | Over-estimation | Check actual gas used via receipt; adjust |
| Gas price spike | Network congestion | Wait for lower gas period or increase priority fee |
| `OutOfGas` revert | Hook callback exceeds gas limit | Optimize hook gas usage; see gas budget guidelines |

```bash
# Check current gas price
cast gas-price --rpc-url <rpc>

# Estimate gas for a transaction
cast estimate --rpc-url <rpc> --from <addr> --value <val> <to> <data>

# Check actual gas used in a transaction
cast receipt <tx_hash> --rpc-url <rpc> | grep gasUsed
```

## Hook Runtime Issues

### Hook Not Being Called

**Cause:** Hook address does not have the correct permission flags set.

**Solution:**

1. Verify `getHookPermissions()` returns expected flags
2. Check pool creation used the correct hook address
3. Confirm the permission bits match in the deployed address
4. Use `PoolManager.hookPermissions(hookAddress)` to verify on-chain

### Unexpected Delta Values

```
Error: Hook returned unexpected delta
```

**Cause:** Hook's `beforeSwapReturnDelta` or `afterSwapReturnDelta` returns incorrect values.

**Solution:** Verify delta accounting sums to zero for every execution path. The core invariant: `sum(deltas) == 0`.

### MEV Extraction from Hooks

**Cause:** Hook state is readable mid-transaction, enabling sandwich attacks.

**Solution:**

1. Minimize external calls from hooks
2. Use reentrancy guards on all external calls
3. Verify `msg.sender == address(poolManager)` in all callbacks
4. Never store sensitive mid-transaction state on-chain
5. Use transient storage for intra-transaction state

### Gas Exceeded in Callback

**Cause:** Hook callback exceeds gas budget.

**Solution:** See gas budget guidelines:

| Callback | Target | Ceiling |
|---|---|---|
| `beforeSwap` | < 50,000 | 150,000 |
| `afterSwap` | < 30,000 | 100,000 |
| `beforeAddLiquidity` | < 50,000 | 200,000 |
| With external calls | < 100,000 | 300,000 |

Common gas pitfalls:

- **Unbounded loops:** Cap array sizes or use pagination
- **SSTORE in hot paths:** Use transient storage (`tstore`/`tload`) for data that does not persist
- **External calls:** Batch calls where possible
- **String operations:** Use `bytes32` for identifiers
- **Redundant reads:** Cache repeated `poolManager` calls

## wagmi / Browser Issues

| Issue | Solution |
|---|---|
| `Buffer is not defined` | Install `buffer` polyfill and set `globalThis.Buffer` |
| CORS error / 415 on OPTIONS | Set up CORS proxy (Vite, Next.js, Vercel, Cloudflare) |
| `walletClient is undefined` when connected | Use `getWalletClient(config, { chainId })` from `@wagmi/core` instead of `useWalletClient()` hook |
| "Please provide a chain" error | Pass `chainId` to `getWalletClient(config, { chainId })` |
| Chain mismatch on swap | Call `switchChain()` before `getWalletClient()` |

## Foundry Issues

### Cast Commands Fail

```bash
# Verify cast is installed
cast --version

# Reinstall if needed
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

### RPC Issues

```bash
# Test RPC connection
cast block-number --rpc-url <rpc_url>

# If rate limited, try alternative RPC or add API key
# Common public RPCs:
# - Ethereum: https://ethereum-rpc.publicnode.com
# - Base: https://mainnet.base.org
# - Arbitrum: https://arb1.arbitrum.io/rpc
```

## Pre-Broadcast Checklist

Before sending any transaction to the blockchain:

1. **Verify `data` is non-empty hex** -- not `''`, not `'0x'`
2. **Verify addresses** -- `to` and `from` are valid checksummed addresses
3. **Check quote freshness** -- re-fetch if older than 30 seconds
4. **Validate gas** -- apply 10-20% buffer to estimates
5. **Confirm balance** -- user has sufficient token balance for the operation
6. **Check nonce** -- ensure no pending transactions from the same address

## Getting Help

- Uniswap docs: [docs.uniswap.org](https://docs.uniswap.org)
- Foundry book: [book.getfoundry.sh](https://book.getfoundry.sh)
- viem docs: [viem.sh](https://viem.sh)
- Uniswap v4 deployments: [docs.uniswap.org/contracts/v4/deployments](https://docs.uniswap.org/contracts/v4/deployments)
- CCA repository: [github.com/Uniswap/continuous-clearing-auction](https://github.com/Uniswap/continuous-clearing-auction)
