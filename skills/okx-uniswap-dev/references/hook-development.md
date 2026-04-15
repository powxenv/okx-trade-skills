# Hook Development Guide

Uniswap v4 hook development: from type selection through security audit to deployment.

## Hook Type Decision Table

Choose the base hook type that matches your primary goal. If your hook has multiple goals, choose the type that covers the most critical concern and layer additional logic on top.

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

**Selection tips:**

- `BaseHook` is the general-purpose starting point. Choose a specialized type only when its built-in logic provides concrete value.
- `BaseCustomCurve` replaces the entire AMM math. Only use it for novel pricing algorithms.
- `AntiSandwichHook` targets sandwich attacks on traders; `LiquidityPenaltyHook` targets JIT LPs. Clarify which attack vector you are mitigating.

## Permission Flags Risk Matrix

All 14 permission flags with associated risk levels. Start with all flags `false` and enable only what your hook logic requires. Every enabled permission increases the attack surface and requires a specific bit in the deployed address.

| Permission Flag | Risk Level | Description | Security Notes |
|---|---|---|---|
| `beforeInitialize` | LOW | Before pool creation | Validate pool parameters |
| `afterInitialize` | LOW | After pool creation | Safe for state initialization |
| `beforeAddLiquidity` | MEDIUM | Before LP deposits | Can block legitimate LPs |
| `afterAddLiquidity` | LOW | After LP deposits | Safe for tracking/rewards |
| `beforeRemoveLiquidity` | HIGH | Before LP withdrawals | Can trap user funds |
| `afterRemoveLiquidity` | LOW | After LP withdrawals | Safe for tracking |
| `beforeSwap` | HIGH | Before swap execution | Can manipulate prices |
| `afterSwap` | MEDIUM | After swap execution | Can observe final state |
| `beforeDonate` | LOW | Before donations | Access control only |
| `afterDonate` | LOW | After donations | Safe for tracking |
| `beforeSwapReturnDelta` | CRITICAL | Returns custom swap amounts | **NoOp attack vector** |
| `afterSwapReturnDelta` | HIGH | Modifies post-swap amounts | Can extract value |
| `afterAddLiquidityReturnDelta` | HIGH | Modifies LP token amounts | Can shortchange LPs |
| `afterRemoveLiquidityReturnDelta` | HIGH | Modifies withdrawal amounts | Can steal funds |

### CRITICAL: NoOp Rug Pull Attack

The `beforeSwapReturnDelta` permission (bit 10) is the most dangerous hook permission. A malicious hook can:

1. Return a delta claiming it handled the entire swap
2. PoolManager accepts this and settles the trade
3. Hook keeps all input tokens without providing output
4. User loses entire swap amount

**Malicious pattern (DO NOT USE):**

```solidity
function beforeSwap(
    address, PoolKey calldata, IPoolManager.SwapParams calldata params, bytes calldata
) external override returns (bytes4, BeforeSwapDelta, uint24) {
    // Claims to handle swap but steals tokens
    int128 amountSpecified = int128(params.amountSpecified);
    BeforeSwapDelta delta = toBeforeSwapDelta(amountSpecified, 0);
    return (BaseHook.beforeSwap.selector, delta, 0);
}
```

**Detection checklist before interacting with any hook that has `beforeSwapReturnDelta: true`:**

1. Audit the hook code -- verify legitimate use case
2. Check ownership -- is it upgradeable? By whom?
3. Verify track record -- audited by reputable firms?
4. Start small -- test with minimal amounts first

**Legitimate uses:** JIT liquidity, custom AMM curves, intent-based trading, RFQ/PMM integrations. Each requires careful implementation and audit.

## Utility Libraries

| Library | Include When |
|---|---|
| `currencySettler` | Hook moves tokens between itself and PoolManager (needed for all `*ReturnDelta` permissions) |
| `safeCast` | Hook performs arithmetic that could overflow when casting between integer types |
| `transientStorage` | Hook passes data between callbacks within a single transaction (requires EVM Cancun, Solidity >= 0.8.24) |

## Shares Configuration

| Option | Description | Use When |
|---|---|---|
| `false` | No share token | Simple hooks that do not hold user funds |
| `ERC20` | Fungible share token | Hook-managed pools with interchangeable shares |
| `ERC6909` | Multi-token (minimal) | Multiple distinct asset classes, gas-efficient |
| `ERC1155` | Multi-token (standard) | Broad wallet/marketplace compatibility needed |

## Access Control

| Option | Constructor | Use When |
|---|---|---|
| `ownable` | `(IPoolManager, address initialOwner)` | Single owner controls all admin functions |
| `roles` | `(IPoolManager, address admin)` | Granular permissions for team members |
| `managed` | `(IPoolManager, address authority)` | External governance contract governs permissions |

## Step-by-Step Hook Generation Flow

### Step 1: Gather Requirements

1. What is the hook's primary goal? (Map to decision table)
2. Which lifecycle events does the hook intercept? (Map to permissions)
3. Does the hook hold or move user funds? (Determines `currencySettler` and `shares`)
4. Who administers the hook? (Single owner, roles, or external governance)
5. Does the hook pass state between callbacks? (Determines `transientStorage`)
6. Target chain has EVM Cancun support? (Required for `transientStorage`)

### Step 2: Configure the MCP Tool JSON

```json
{
  "hook": "BaseHook",
  "name": "MyHook",
  "pausable": false,
  "currencySettler": true,
  "safeCast": true,
  "transientStorage": false,
  "shares": { "options": false },
  "permissions": {
    "beforeInitialize": false,
    "afterInitialize": false,
    "beforeAddLiquidity": false,
    "beforeRemoveLiquidity": false,
    "afterAddLiquidity": false,
    "afterRemoveLiquidity": false,
    "beforeSwap": true,
    "afterSwap": false,
    "beforeDonate": false,
    "afterDonate": false,
    "beforeSwapReturnDelta": false,
    "afterSwapReturnDelta": false,
    "afterAddLiquidityReturnDelta": false,
    "afterRemoveLiquidityReturnDelta": false
  },
  "inputs": {},
  "access": "ownable",
  "info": { "license": "MIT" }
}
```

### Step 3: Generate via MCP Tool

Call the OpenZeppelin Contracts Wizard MCP tool with the assembled JSON. The tool returns Solidity source code. It does not write files automatically.

After receiving the generated code:

1. Display the code to the user
2. Explain key sections (constructor, `getHookPermissions`, enabled callbacks)
3. Note manual steps: HookMiner for address mining, deployment script updates

### Step 4: Mine the Deployment Address

Permissions are encoded as bits in the hook's deployed address. The PoolManager validates these bits on every callback.

```bash
# Use HookMiner from v4-periphery to find a valid salt
forge script script/DeployHook.s.sol --rpc-url $RPC_URL
```

### Step 5: Compile and Test

```bash
forge build
forge test --gas-report
forge snapshot --match-contract MyHookTest
```

### Step 6: Apply Security Foundations

Run the full security checklist before any deployment.

## Security Checklist Before Deployment

### Access Control

- [ ] All hook callbacks verify `msg.sender == address(poolManager)`
- [ ] Router allowlisting implemented if hook needs user identity
- [ ] `sender` parameter used for router identity (never `msg.sender` -- it is always PoolManager)
- [ ] Upgrade mechanisms secured with timelock if applicable

### Fund Safety

- [ ] Delta accounting sums to zero for every execution path
- [ ] Fee-on-transfer tokens handled with balance-diff measurement
- [ ] No hardcoded addresses
- [ ] Slippage parameters respected
- [ ] `beforeSwapReturnDelta` justified and audited if enabled

### Gas Safety

- [ ] No unbounded loops that can cause OOG
- [ ] Callback gas within budget (see gas budget table below)
- [ ] Transient storage used for intra-transaction state where possible

### Testing

- [ ] Unit tests for all enabled callbacks
- [ ] Fuzz testing with Foundry (`forge test`)
- [ ] Invariant testing for hooks with delta returns
- [ ] Fork testing on mainnet
- [ ] Gas profiling completed
- [ ] Slither/Mythril analysis completed

### Gas Budget Guidelines

| Callback | Target Budget | Hard Ceiling |
|---|---|---|
| `beforeSwap` | < 50,000 gas | 150,000 gas |
| `afterSwap` | < 30,000 gas | 100,000 gas |
| `beforeAddLiquidity` | < 50,000 gas | 200,000 gas |
| `afterAddLiquidity` | < 30,000 gas | 100,000 gas |
| `beforeRemoveLiquidity` | < 50,000 gas | 200,000 gas |
| Callbacks with external calls | < 100,000 gas | 300,000 gas |

### Risk Scoring

Calculate your hook's risk score (0-33):

| Category | Points | Criteria |
|---|---|---|
| Permissions | 0-14 | Sum of enabled permission risk levels |
| External Calls | 0-5 | Number and type of external interactions |
| State Complexity | 0-5 | Amount of mutable state |
| Upgrade Mechanism | 0-5 | Proxy, admin functions, etc. |
| Token Handling | 0-4 | Non-standard token support |

| Score | Risk Level | Recommendation |
|---|---|---|
| 0-5 | Low | Self-audit + peer review |
| 6-12 | Medium | Professional audit recommended |
| 13-20 | High | Professional audit required |
| 21-33 | Critical | Multiple audits required |

## Absolute Prohibitions

**Never do these things in a hook:**

1. Never trust `msg.sender` for user identity -- it is always PoolManager
2. Never enable `beforeSwapReturnDelta` without understanding NoOp attacks
3. Never store passwords, keys, or PII on-chain
4. Never use `transfer()` for ETH -- use `call{value:}("")`
5. Never assume token decimals -- always query the token
6. Never use `block.timestamp` for randomness
7. Never hardcode gas limits in calls
8. Never ignore return values from external calls
9. Never use `tx.origin` for authorization

## Delta Accounting

v4 uses a credit/debit system through the PoolManager. The core invariant: `sum(deltas) == 0` for every transaction.

| Function | Purpose | Direction |
|---|---|---|
| `take(currency, to, amount)` | Withdraw tokens from PoolManager | You receive tokens |
| `settle(currency)` | Pay tokens to PoolManager | You send tokens |
| `sync(currency)` | Update PoolManager balance tracking | Preparation for settle |

**Correct settlement pattern:**

```solidity
poolManager.sync(currency);
currency.transfer(address(poolManager), amount);
poolManager.settle(currency);
```

**Common mistakes:**

1. Forgetting `sync` -- settlement fails without it
2. Wrong order -- must be sync, transfer, settle
3. Partial settlement -- leaves transaction in invalid state
4. Double settlement -- causes accounting errors

## Token Handling Hazards

| Token Type | Hazard | Mitigation |
|---|---|---|
| Fee-on-transfer | Received < sent | Measure actual balance changes |
| Rebasing | Balance changes without transfers | Avoid storing raw balances |
| ERC-777 | Transfer callbacks enable reentrancy | Use reentrancy guards |
| Pausable | Transfers can be blocked | Handle transfer failures gracefully |
| Blocklist | Specific addresses blocked | Test with production addresses |
| Low decimals | Precision loss in calculations | Use appropriate scaling |

## External Resources

- [v4-core Repository](https://github.com/Uniswap/v4-core)
- [v4-periphery Repository](https://github.com/Uniswap/v4-periphery)
- [Uniswap v4 Docs](https://docs.uniswap.org/contracts/v4/overview)
- [Hook Permissions Guide](https://docs.uniswap.org/contracts/v4/concepts/hooks)
- [v4hooks.dev](https://www.v4hooks.dev) -- Community hook resources
