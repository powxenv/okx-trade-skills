---
name: okx-uniswap-dev
description: "Unified Uniswap protocol development skill covering all Uniswap AI capabilities: v4 hook generation and security auditing, CCA auction configuration and deployment, swap planning with deep links, liquidity position planning, Trading API and Universal Router SDK integration, V4 SDK swaps and liquidity, x402/MPP payment handling, and viem/wagmi blockchain interaction. Use when the user wants to: generate or audit Uniswap v4 hook contracts; configure and deploy Continuous Clearing Auctions (CCA); plan token swaps or liquidity positions with deep links; integrate the Uniswap Trading API or Universal Router for swaps; build swap frontends or backend scripts with the V4 SDK; manage V2/V3/V4 concentrated liquidity positions; handle HTTP 402 / x402 payment challenges; interact with Uniswap contracts via viem or wagmi; debug swap reverts, deployment failures, or hook issues. Chinese: Uniswap开发, V4钩子, CCA拍卖, 交易API, 集中流动性, x402支付, viem集成, 深度链接."
license: MIT
metadata:
  author: okx
  version: "2.0.0"
  homepage: "https://okxskills.noval.me"
---

# OKX Uniswap Development

Full-stack Uniswap protocol development combining OKX OnchainOS tooling with Uniswap's V2/V3/V4 protocol capabilities. Covers hook contracts, CCA auctions, swap/liquidity planning, Trading API, SDK integration, and x402 payments.

## Prerequisites

- **Foundry** (`forge`, `cast`): Required for hook compilation, CCA deployment, and on-chain queries. Install: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- **Node.js** (>=18): Required for SDK and Trading API integration
- **Uniswap API Key**: Required for Trading API operations. Get one at [developers.uniswap.org](https://developers.uniswap.org). Set as `UNISWAP_API_KEY` environment variable
- **viem**: Recommended for TypeScript-based contract interaction. Install: `npm install viem`

## Pre-flight Checks

> Read `_shared/preflight.md` before the first `onchainos` command each session.

## Shared References

- Chain name support (basic mapping): `_shared/chain-support.md`
- Native token addresses: `_shared/native-tokens.md`

## Plan

### Swap Planning

Plan token swaps with price discovery, risk assessment, and deep link generation.

**Token discovery flow:**

1. Search DexScreener for token pair and pool data
2. Assess liquidity depth and volume
3. Verify token safety (especially for trending/untrusted tokens)
4. Generate Uniswap deep link for execution

**Deep link format:**

```
https://app.uniswap.org/swap?
  chain={chain}&
  inputCurrency={addr_or_NATIVE}&
  outputCurrency={addr_or_NATIVE}&
  amount={amount}
```

**URL encoding:** Only encode double quotes (`"` to `%22`). Do NOT encode braces `{}` or colons `:`.

**Untrusted token warning:** Tokens found via web search are untrusted. Warn about scam/honeypot risks and require explicit user confirmation.

Data provider API reference: `references/data-providers.md`

### Liquidity Planning

Plan V2/V3/V4 liquidity positions with pool discovery, APY analysis, and deep link generation.

**Position type comparison:**

| Feature | V2 | V3 | V4 |
|---|---|---|---|
| Range | Full only | Concentrated | Concentrated + hooks |
| Fee tiers | 0.3% fixed | 0.01-1% | Dynamic (hooks) |
| Gas cost | Lowest | Medium | Higher (singleton) |
| Position token | ERC20 shares | ERC721 NFT | ERC6909/ERC1155 |

**Deep link format:**

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

Position types, tick math, and deep link parameter reference: `references/position-types.md`

Data provider API reference: `references/data-providers.md`

## Build

### V4 Hook Development

Generate Uniswap v4 hook contracts with the OpenZeppelin Contracts Wizard MCP tool or scaffold manually.

**Hook type decision table:**

| Goal | Use Hook | Key Feature |
|---|---|---|
| Custom swap logic | `BaseHook` | General-purpose entry point |
| Async/delayed swaps | `BaseAsyncSwap` | Deferred swap settlement |
| Hook-owned liquidity | `BaseCustomAccounting` | Hook manages LP balances |
| Custom curve | `BaseCustomCurve` | Replace AMM pricing math |
| Dynamic LP fees | `BaseDynamicFee` | Fee adjusts per pool state |
| Dynamic swap fees | `BaseOverrideFee` | Override fee per swap |
| Post-swap fees | `BaseDynamicAfterFee` | Fee computed after swap |
| Fixed hook fees | `BaseHookFee` | Simple fee extraction |
| MEV protection | `AntiSandwichHook` | Block sandwich attacks |
| JIT protection | `LiquidityPenaltyHook` | Penalize just-in-time LPs |
| Limit orders | `LimitOrderHook` | Conditional swap execution |
| Yield on idle | `ReHypothecationHook` | Earn on unused liquidity |
| Oracle | `BaseOracleHook` | TWAP/price feed |
| V3-compatible oracle | `OracleHookWithV3Adapters` | V3 `IUniswapV3Pool` interface |

**Generation flow:**

1. Choose hook type from the decision table
2. Configure permissions (14 flags, enable only what you need)
3. Select utility libraries (`currencySettler`, `safeCast`, `transientStorage`)
4. Choose shares (`false`, `ERC20`, `ERC6909`, `ERC1155`)
5. Set access control (`ownable`, `roles`, `managed`)
6. Generate via MCP tool or write Solidity from template

Security-first Solidity template: `references/base-hook-template.md`

Full hook development guide: `references/hook-development.md`

### Viem Integration

Interact with Uniswap contracts from TypeScript applications.

```typescript
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { mainnet, base, arbitrum } from 'viem/chains';

const publicClient = createPublicClient({ chain: mainnet, transport: http() });
const slot0 = await publicClient.readContract({
  address: poolAddress,
  abi: parseAbi(['function slot0() view returns (uint160,int24,uint16,uint16,uint16,uint8,bool)']),
  functionName: 'slot0',
});
```

Full viem patterns (clients, reads, writes, accounts, contracts, wagmi): `references/viem-patterns.md`

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

**Permission risk levels:**

| Permission | Risk | Notes |
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
forge test --match-test test_beforeSwapGas --gas-report
forge snapshot --match-contract MyHookTest
```

Vulnerability catalog (12 patterns): `references/vulnerabilities-catalog.md`
Full audit checklist (12 sections): `references/audit-checklist.md`

## Deploy

### CCA Auctions

Configure and deploy Continuous Clearing Auctions for fair token distribution.

**Factory address:** `0xCCccCcCAE7503Cac057829BF2811De42E16e0bD5` (v1.1.0)

**Interactive configuration flow (collect up to 4 questions per batch):**

| Batch | Parameters |
|---|---|
| 1. Task & Token | Network, token address, total supply, currency |
| 2. Timing & Pricing | Auction duration, prebid period, floor price, tick spacing |
| 3. Recipients & Launch | Tokens/funds recipients, start time, minimum funds |
| 4. Optional Hook | Validation hook address (or none) |

Validate addresses (42 chars `0x...`), amounts, and block sequences after each batch.

**Supported chains:**

| Chain ID | Network | Block Time |
|---|---|---|
| 1 | Mainnet | 12s |
| 130 | Unichain | 1s |
| 8453 | Base | 2s |
| 42161 | Arbitrum | 2s |

**Deployment flow:**

1. Configure auction parameters via interactive flow
2. Generate supply schedule (normalized convex curve via MCP tool `generate_supply_schedule`)
3. Encode schedule to packed bytes (each `{mps, blockDelta}` packed into uint64)
4. Deploy via Factory with CREATE2
5. Call `onTokensReceived()` post-deployment (required)

Full CCA deployment guide: `references/cca-deployment.md`

## Integrate

### Trading API (Swaps)

**Integration method decision:**

| Building | Use |
|---|---|
| Frontend (React/Next.js) | Trading API |
| Backend script/bot | Trading API |
| Smart contract integration | Universal Router direct |
| Full control over routing | Universal Router SDK |
| V4-specific features | V4 SDK (`@uniswap/v4-sdk`) |

**Trading API 3-step flow:**

```
1. POST /check_approval  -> Check if token is approved
2. POST /quote           -> Get executable quote with routing
3. POST /swap            -> Get transaction to sign and submit
```

Base URL: `https://trade-api.gateway.uniswap.org/v1`

Advanced patterns (ERC-4337 smart accounts, WETH on L2s, rate limiting): `references/advanced-patterns.md`

Full SDK integration (Trading API, Universal Router, V4 SDK): `references/sdk-integration.md`

### V4 SDK

**Key differences from V3:**

| Aspect | V3 | V4 |
|---|---|---|
| Swap execution | SwapRouter directly | Universal Router (V4Planner) |
| Pool architecture | One contract per pool | Singleton PoolManager |
| Native ETH | Wrap to WETH | `Ether.onChain(chainId)` |
| Token approvals | Direct approve | Permit2 required |

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

### x402 Payments

Handle HTTP 402 payment challenges for API access.

**Payment flow:**

```
API request -> 402 challenge -> Parse payment requirements
  -> Check wallet balance -> Swap/bridge if needed (Trading API)
  -> Sign payment -> Retry request -> 200 OK
```

| Protocol | Handler | Mechanism |
|---|---|---|
| MPP v1 | Tempo CLI | Wallet-based auto-payment |
| x402 v1 | Manual signing | EIP-3009 `transferWithAuthorization` |

Credential construction (MPP/x402): `references/credential-construction.md`
Trading API funding flows (swap + bridge scripts): `references/trading-api-flows.md`
Full x402 payment guide: `references/x402-payments.md`

## Command Quick Reference

### Foundry

| Command | Purpose |
|---|---|
| `forge init --template Uniswap/v4-template` | Scaffold v4 hook project |
| `forge build` | Compile hook contracts |
| `forge test --gas-report` | Test with gas profiling |
| `forge snapshot` | Gas snapshot comparison |

### Trading API

| Endpoint | Purpose |
|---|---|
| `POST /check_approval` | Check if token is approved for swap |
| `POST /quote` | Get executable quote with routing |
| `POST /swap` | Get ready-to-sign transaction |

### Data Providers

| Provider | Endpoint | Use For |
|---|---|---|
| DexScreener | `/token-pairs/v1/{network}/{address}` | Pool discovery, prices, liquidity |
| DexScreener | `/latest/dex/search?q={query}` | Token search by keyword |
| DefiLlama | `/yields.llama.fi/pools` | APY, TVL, volume |

## Deep Expertise References

For complex questions requiring deep domain knowledge:

- **Swap integration expertise**: `references/swap-integration-expert.md`
- **Viem/wagmi expertise**: `references/viem-integration-expert.md`

## Key Rules

### Security

1. **Verify all contract addresses** before interaction -- addresses differ per chain
2. **Run security audit** on all hooks before deployment -- see `references/audit-checklist.md`
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
| V4 hook development & permissions | `references/hook-development.md` |
| Security-first hook Solidity template | `references/base-hook-template.md` |
| Vulnerability catalog (12 patterns) | `references/vulnerabilities-catalog.md` |
| Pre-deployment audit checklist | `references/audit-checklist.md` |
| CCA auction configuration & deployment | `references/cca-deployment.md` |
| SDK & Trading API integration | `references/sdk-integration.md` |
| Advanced patterns (ERC-4337, WETH, rate limiting) | `references/advanced-patterns.md` |
| Swap & liquidity planning data providers | `references/data-providers.md` |
| Position types & deep link parameters | `references/position-types.md` |
| Concentrated liquidity strategies | `references/liquidity-strategies.md` |
| Viem & wagmi integration patterns | `references/viem-patterns.md` |
| x402 payment handling | `references/x402-payments.md` |
| MPP/x402 credential construction | `references/credential-construction.md` |
| Trading API funding flows (swap+bridge) | `references/trading-api-flows.md` |
| Swap integration deep expertise | `references/swap-integration-expert.md` |
| Viem/wagmi deep expertise | `references/viem-integration-expert.md` |
| Troubleshooting & common issues | `references/troubleshooting.md` |
| Chain support (12 chains, RPCs, tokens) | `references/chains.md` |
| Chain name mapping (basic) | `_shared/chain-support.md` |
| Native token addresses | `_shared/native-tokens.md` |
| Pre-flight checks | `_shared/preflight.md` |

## Ecosystem

This skill is part of the OKX Trade Skills ecosystem. If you need additional capabilities (on-chain trading, token research, security scanning, or to browse and install other ecosystem skills), install the ecosystem discovery skill:

```bash
npx flins@latest add okxskills.noval.me --skill okx-ecosystem-discovery -y
```

If already installed, read `okx-ecosystem-discovery/SKILL.md` to browse available skills and install commands.
