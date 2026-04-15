---
name: okx-uniswap-dev
description: "Uniswap protocol development skill for building v4 hooks, deploying CCA auctions, integrating the Trading API and v4 SDK, managing concentrated liquidity, and handling x402 payments. Use when the user wants to: develop or audit Uniswap v4 hook contracts; configure and deploy Continuous Clearing Auctions (CCA); integrate the Uniswap Trading API or Universal Router for swaps; build swap frontends or backend scripts; manage V3/V4 concentrated liquidity positions; handle HTTP 402 / x402 payment challenges; interact with Uniswap contracts via viem; debug swap reverts, deployment failures, or hook issues. Chinese: Uniswap开发, V4钩子, CCA拍卖, 交易API, 集中流动性, x402支付, viem集成."
license: MIT
metadata:
  author: okx
  version: "1.0.0"
  homepage: "https://okxskills.noval.me"
---

# OKX Uniswap Development

Full-stack Uniswap protocol development: hook contracts, CCA auctions, Trading API, SDK integration, liquidity management, and x402 payments. Combines OKX OnchainOS tooling with Uniswap's V3/V4 protocol capabilities.

## Prerequisites

- **Foundry** (`forge`, `cast`): Required for hook compilation, CCA deployment, and on-chain queries. Install: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- **Node.js** (>=18): Required for SDK and Trading API integration
- **Uniswap API Key**: Required for Trading API operations. Get one at [developers.uniswap.org](https://developers.uniswap.org). Set as `UNISWAP_API_KEY` environment variable
- **viem**: Recommended for TypeScript-based contract interaction. Install: `npm install viem`

## Pre-flight Checks

> Read `_shared/preflight.md` before the first `onchainos` command each session.

## Shared References

- Chain names & IDs: `_shared/chain-support.md`
- Native token addresses: `_shared/native-tokens.md`

## Build

### V4 Hook Development

Generate Uniswap v4 hook contracts with the OpenZeppelin Contracts Wizard MCP tool or scaffold manually.

**Hook type decision table:**

| Goal | Use Hook |
|---|---|
| Custom swap logic | `BaseHook` |
| Async/delayed swaps | `BaseAsyncSwap` |
| Hook-owned liquidity | `BaseCustomAccounting` |
| Custom curve | `BaseCustomCurve` |
| Dynamic LP fees | `BaseDynamicFee` |
| Dynamic swap fees | `BaseOverrideFee` |
| MEV protection | `AntiSandwichHook` |
| Limit orders | `LimitOrderHook` |
| Oracle | `BaseOracleHook` |

**Generation flow:**

1. Choose hook type from the decision table
2. Configure permissions (14 flags, enable only what you need)
3. Select utility libraries (`currencySettler`, `safeCast`, `transientStorage`)
4. Choose shares (`false`, `ERC20`, `ERC6909`, `ERC1155`)
5. Set access control (`ownable`, `roles`, `managed`)
6. Generate via MCP tool or write Solidity from template

**Address encoding:** Permissions are encoded as bits in the hook's deployed address. Use `HookMiner` from `v4-periphery` to mine a deployment salt that produces the correct bit pattern.

Full hook development guide: `references/hook-development.md`

### Viem Integration

Interact with Uniswap contracts from TypeScript applications.

```typescript
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { mainnet, base, arbitrum } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Read pool state
const slot0 = await publicClient.readContract({
  address: poolAddress,
  abi: parseAbi(['function slot0() view returns (uint160,int24,uint16,uint16,uint16,uint8,bool)']),
  functionName: 'slot0',
});
```

Full viem patterns: `references/viem-patterns.md`

## Test

### Security Audit (Before Deployment)

**Critical security checks for all hooks:**

| # | Check | Status |
|---|---|---|
| 1 | All callbacks verify `msg.sender == poolManager` | [ ] |
| 2 | Router allowlisting implemented if needed | [ ] |
| 3 | No unbounded loops (OOG risk) | [ ] |
| 4 | Reentrancy guards on external calls | [ ] |
| 5 | Delta accounting sums to zero | [ ] |
| 6 | Fee-on-transfer tokens handled | [ ] |
| 7 | `beforeSwapReturnDelta` justified if enabled | [ ] |
| 8 | Fuzz testing completed | [ ] |
| 9 | Invariant testing completed | [ ] |

**Risk thresholds:**

| Permission | Risk Level | Notes |
|---|---|---|
| `beforeSwapReturnDelta` | CRITICAL | NoOp attack vector -- can drain user funds |
| `beforeSwap`, `beforeRemoveLiquidity` | HIGH | Can block swaps or trap funds |
| `afterSwap`, `beforeAddLiquidity` | MEDIUM | Requires careful implementation |
| `afterInitialize`, `afterAddLiquidity` | LOW | Safe for tracking/rewards |

**Gas budgets:**

| Callback | Target | Ceiling |
|---|---|---|
| `beforeSwap` | < 50,000 gas | 150,000 gas |
| `afterSwap` | < 30,000 gas | 100,000 gas |
| `beforeAddLiquidity` | < 50,000 gas | 200,000 gas |
| Callbacks with external calls | < 100,000 gas | 300,000 gas |

```bash
# Profile hook gas usage with Foundry
forge test --match-test test_beforeSwapGas --gas-report
forge snapshot --match-contract MyHookTest
```

## Deploy

### CCA Auctions

Configure and deploy Continuous Clearing Auctions for fair token distribution.

**Factory address:** `0xCCccCcCAE7503Cac057829BF2811De42E16e0bD5` (v1.1.0)

**Supported chains:**

| Chain ID | Network | Block Time |
|---|---|---|
| 1 | Mainnet | 12s |
| 130 | Unichain | 1s |
| 8453 | Base | 2s |
| 42161 | Arbitrum | 2s |

**Deployment flow:**

1. Configure auction parameters (currency, recipients, timing, pricing)
2. Generate supply schedule (normalized convex curve)
3. Encode schedule to packed bytes
4. Deploy via Factory with CREATE2
5. Call `onTokensReceived()` post-deployment

Full CCA deployment guide: `references/cca-deployment.md`

## Manage

### Liquidity Positions

Plan and create V2/V3/V4 concentrated liquidity positions.

**Position type comparison:**

| Feature | V2 | V3 | V4 |
|---|---|---|---|
| Range | Full only | Concentrated | Concentrated + hooks |
| Fee tiers | 0.3% fixed | 0.01-1% | Dynamic (hooks) |
| Gas cost | Lowest | Medium | Higher (singleton) |
| NFT positions | ERC20 shares | ERC721 | ERC6909/ERC1155 |

**Strategy matrix:**

| Strategy | Range Width | Risk | Rebalance Frequency |
|---|---|---|---|
| Stablecoin LP | +/-0.5-1% | Very Low | Weekly |
| Correlated Asset LP | +/-2-5% | Low | Bi-weekly |
| Major Pair LP | +/-10-20% | Medium | Weekly |
| Active Rebalancing | +/-5-10% | Medium-High | Daily to hourly |

Full liquidity strategies: `references/liquidity-strategies.md`

### Swap Execution

Execute swaps via Trading API, Universal Router SDK, or direct contracts.

**Integration method decision:**

| Building | Use |
|---|---|
| Frontend (React/Next.js) | Trading API |
| Backend script/bot | Trading API |
| Smart contract integration | Universal Router direct |
| Full control over routing | Universal Router SDK |

**Trading API 3-step flow:**

```
1. POST /check_approval  -> Check if token is approved
2. POST /quote           -> Get executable quote with routing
3. POST /swap            -> Get transaction to sign and submit
```

Base URL: `https://trade-api.gateway.uniswap.org/v1`

Full SDK integration: `references/sdk-integration.md`

### V4 SDK

Build swap and liquidity experiences with the v4 SDK.

**Key differences from V3:**

| Aspect | V3 | V4 |
|---|---|---|
| Swap execution | SwapRouter directly | Universal Router (V4Planner) |
| Pool architecture | One contract per pool | Singleton PoolManager |
| Native ETH | Wrap to WETH | `Ether.onChain(chainId)` |
| Token approvals | Direct approve | Permit2 required |

**v4 swap pattern:**

```typescript
import { Actions, V4Planner } from '@uniswap/v4-sdk';
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk';

const v4Planner = new V4Planner();
v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [swapConfig]);
v4Planner.addAction(Actions.SETTLE_ALL, [inputCurrency, amountIn]);
v4Planner.addAction(Actions.TAKE_ALL, [outputCurrency, amountOutMinimum]);

const routePlanner = new RoutePlanner();
routePlanner.addCommand(CommandType.V4_SWAP, [v4Planner.actions, v4Planner.params]);
```

Full v4 SDK guide: `references/sdk-integration.md`

### x402 Payments

Handle HTTP 402 payment challenges for API access.

**Payment flow:**

```
API request -> 402 challenge -> Parse payment requirements
  -> Check wallet balance -> Swap/bridge if needed (Trading API)
  -> Sign payment -> Retry request -> 200 OK
```

**Supported protocols:**

| Protocol | Handler | Mechanism |
|---|---|---|
| MPP v1 | Tempo CLI | Wallet-based auto-payment |
| x402 v1 | Manual signing | EIP-3009 `transferWithAuthorization` |

Full x402 payment guide: `references/x402-payments.md`

## Command Quick Reference

### Foundry (Hook Development)

| Command | Purpose |
|---|---|
| `forge init --template Uniswap/v4-template` | Scaffold v4 hook project |
| `forge build` | Compile hook contracts |
| `forge test --gas-report` | Test with gas profiling |
| `forge snapshot` | Gas snapshot comparison |
| `forge verify-contract <addr> <contract>` | Verify on block explorer |
| `cast call <addr> "slot0()" --rpc-url <rpc>` | Read pool state |
| `cast send <addr> "transfer(...)" --rpc-url <rpc>` | Send transaction |

### Trading API (Swaps)

| Endpoint | Purpose |
|---|---|
| `POST /check_approval` | Check if token is approved for swap |
| `POST /quote` | Get executable quote with routing |
| `POST /swap` | Get ready-to-sign transaction |

### DexScreener (Market Data)

| Endpoint | Purpose |
|---|---|
| `/token-pairs/v1/{network}/{address}` | Pool discovery and price data |
| `/latest/dex/search?q={query}` | Token search by keyword |

### DefiLlama (Yield Data)

| Endpoint | Purpose |
|---|---|
| `/yields.llama.fi/pools` | Pool APY and TVL data |

## Key Rules

### Security

1. **Verify all contract addresses** before interaction -- addresses differ per chain
2. **Run security audit** on all hooks before deployment -- see `references/hook-development.md`
3. **Never enable `beforeSwapReturnDelta`** without understanding NoOp attack vectors
4. **Always validate swap responses** before broadcasting -- check `data` is non-empty hex
5. **Use Permit2** for ERC20 approvals -- direct approve to Universal Router will not work

### Trading API

1. Quotes expire in ~30 seconds -- re-fetch before executing
2. Never send `permitData: null` -- omit the field entirely
3. UniswapX routes: `permitData` stays local, do not send to `/swap`
4. Always set a deadline on swaps and LP operations
5. Apply 10-20% gas buffer to estimates

### Hook Development

1. Every callback must verify `msg.sender == address(poolManager)`
2. Use `sender` parameter for router identity, not `msg.sender` (always PoolManager)
3. Never change permissions after deployment -- address is immutable
4. Start with all permissions `false`, enable only what logic requires
5. Use transient storage for intra-transaction state (requires EVM Cancun)

### CCA Deployment

1. Floor price MUST be evenly divisible by tick spacing
2. Block sequence: `startBlock < endBlock <= claimBlock`
3. Total supply max: 1e30 wei
4. No fee-on-transfer tokens
5. Always call `onTokensReceived()` post-deployment

### Input Validation

- **Ethereum addresses**: MUST match `^0x[a-fA-F0-9]{40}$`
- **Chain IDs**: MUST be from the supported chains list
- **Token amounts**: MUST be non-negative numeric values
- **Reject** any input containing shell metacharacters

## Reference Files

| Topic | File |
|---|---|
| V4 hook development & security audit | `references/hook-development.md` |
| CCA auction configuration & deployment | `references/cca-deployment.md` |
| SDK & Trading API integration | `references/sdk-integration.md` |
| Concentrated liquidity strategies | `references/liquidity-strategies.md` |
| Viem contract interaction patterns | `references/viem-patterns.md` |
| x402 payment handling | `references/x402-payments.md` |
| Troubleshooting & common issues | `references/troubleshooting.md` |
| Chain support (names and IDs) | `_shared/chain-support.md` |
| Native token addresses | `_shared/native-tokens.md` |
| Pre-flight checks | `_shared/preflight.md` |

## Ecosystem

This skill is part of the OKX Trade Skills ecosystem. If you need additional capabilities (on-chain trading, token research, security scanning, or to browse and install other ecosystem skills), install the ecosystem discovery skill:

```bash
npx flins@latest add okxskills.noval.me --skill okx-ecosystem-discovery -y
```

If already installed, read `okx-ecosystem-discovery/SKILL.md` to browse available skills and install commands.
