# v4 Hook Vulnerabilities Catalog

Common vulnerability patterns in Uniswap v4 hooks with detection methods and mitigations.

## Table of Contents

- [Critical Vulnerabilities](#critical-vulnerabilities)
- [High Severity Vulnerabilities](#high-severity-vulnerabilities)
- [Medium Severity Vulnerabilities](#medium-severity-vulnerabilities)
- [Low Severity Vulnerabilities](#low-severity-vulnerabilities)
- [Vulnerability Detection Tools](#vulnerability-detection-tools)

## Critical Vulnerabilities

### 1. NoOp Rug Pull (CRITICAL)

**Description**: Hook with `beforeSwapReturnDelta` enabled returns a delta claiming to handle the swap but steals input tokens.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Do not use
function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    // Claims to handle swap but provides nothing
    BeforeSwapDelta delta = toBeforeSwapDelta(params.amountSpecified, 0);
    return (BaseHook.beforeSwap.selector, delta, 0);
}
```

**Detection**: Check if `beforeSwapReturnDelta: true` in permissions. Verify hook actually provides liquidity for claimed delta. Audit all code paths that return non-zero deltas.

**Mitigation**: Don't enable `beforeSwapReturnDelta` unless absolutely necessary. If enabled, ensure delta is backed by actual liquidity provision. Require multiple audits for hooks with this permission.

### 2. Missing PoolManager Verification (CRITICAL)

**Description**: Hook callbacks don't verify caller is the PoolManager, allowing direct manipulation.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - No caller check
function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    // Anyone can call this directly!
    _updateState(params);
    return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
}
```

**Detection**: Search for hook callbacks without `onlyPoolManager` or equivalent. Check first line of each callback for msg.sender verification.

**Mitigation**:

```solidity
modifier onlyPoolManager() {
    require(msg.sender == address(poolManager), "Not PoolManager");
    _;
}

function beforeSwap(...) external onlyPoolManager returns (...) {
    // Safe
}
```

### 3. Delta Accounting Mismatch (CRITICAL)

**Description**: Hook returns deltas that don't balance, causing transaction revert or fund loss.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Deltas don't balance
function afterSwap(...) external returns (bytes4, int128) {
    poolManager.take(currency, address(this), amount);
    return (BaseHook.afterSwap.selector, 0); // Wrong delta!
}
```

**Detection**: Trace all `take()`, `settle()`, and delta returns. Verify sum equals zero for all code paths. Fuzz test with random amounts.

**Mitigation**:

```solidity
function afterSwap(...) external returns (bytes4, int128) {
    uint256 amount = calculateAmount();
    require(amount <= uint256(type(int128).max), "Amount exceeds int128 max");
    poolManager.take(currency, address(this), amount);
    // Cast sequence: uint256 -> uint128 -> int128 prevents misinterpreting large values as negative
    return (BaseHook.afterSwap.selector, int128(uint128(amount)));
}
```

## High Severity Vulnerabilities

### 4. Reentrancy via External Calls (HIGH)

**Description**: Hook makes external call that reenters PoolManager before state is finalized.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Reentrancy possible
function afterSwap(...) external returns (bytes4, int128) {
    state = newState;
    externalContract.callback(); // Can reenter!
    return (BaseHook.afterSwap.selector, 0);
}
```

**Detection**: Identify all external calls in hook callbacks. Check if state changes happen before external calls. Look for ERC-777 tokens or contracts with callbacks.

**Mitigation**:

```solidity
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureHook is BaseHook, ReentrancyGuard {
    function afterSwap(...) external nonReentrant returns (bytes4, int128) {
        // BEST PRACTICE: Follow CEI pattern - state changes BEFORE external calls
        state = newState;
        externalContract.callback();
        return (BaseHook.afterSwap.selector, 0);
    }
}
```

### 5. Unbounded Loop DoS (HIGH)

**Description**: Hook iterates over unbounded array, causing out-of-gas.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Unbounded loop
function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    for (uint i = 0; i < participants.length; i++) { // Can grow forever
        _processParticipant(participants[i]);
    }
    return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
}
```

**Detection**: Find all loops in hook callbacks. Check if loop bounds are user-controllable. Test with large arrays.

**Mitigation**:

```solidity
uint256 constant MAX_PARTICIPANTS = 100;

function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    uint256 len = participants.length > MAX_PARTICIPANTS ? MAX_PARTICIPANTS : participants.length;
    for (uint i = 0; i < len; i++) {
        _processParticipant(participants[i]);
    }
    return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
}
```

### 6. Liquidity Lock (HIGH)

**Description**: `beforeRemoveLiquidity` can permanently trap LP funds.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Can lock funds forever
function beforeRemoveLiquidity(...) external returns (bytes4) {
    require(block.timestamp > unlockTime, "Locked"); // What if unlockTime is set to max?
    return BaseHook.beforeRemoveLiquidity.selector;
}
```

**Detection**: Check all conditions in `beforeRemoveLiquidity`. Verify unlock conditions are achievable. Look for admin-controlled lock parameters.

**Mitigation**:

```solidity
uint256 constant MAX_LOCK_DURATION = 365 days;

function setLockDuration(uint256 duration) external onlyAdmin {
    require(duration <= MAX_LOCK_DURATION, "Too long");
    lockDuration = duration;
}
```

## Medium Severity Vulnerabilities

### 7. Price Manipulation via Single Block (MEDIUM)

**Description**: Hook uses single-block price for decisions, enabling manipulation.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Single block price
function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    uint256 currentPrice = oracle.latestPrice(); // Flashloan manipulable
    if (currentPrice < threshold) revert("Price too low");
    return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
}
```

**Detection**: Find price/rate fetching in hooks. Check if TWAP or multiple sources used. Test with flash loan scenarios.

**Mitigation**: Use TWAP prices instead of spot prices: `oracle.getTWAP(30 minutes)`.

### 8. Missing Slippage Protection (MEDIUM)

**Description**: Hook doesn't enforce user-specified slippage limits.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Ignores slippage
function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    int256 modifiedAmount = params.amountSpecified * 99 / 100;
    return (BaseHook.beforeSwap.selector, toBeforeSwapDelta(modifiedAmount, 0), 0);
}
```

**Detection**: Check if hookData contains slippage parameters. Verify slippage is enforced when amounts modified.

**Mitigation**:

```solidity
function beforeSwap(...) external returns (bytes4, BeforeSwapDelta, uint24) {
    (uint256 minOutput) = abi.decode(hookData, (uint256));
    require(calculatedOutput >= minOutput, "Slippage exceeded");
    return (BaseHook.beforeSwap.selector, delta, 0);
}
```

### 9. Fee-on-Transfer Token Mismatch (MEDIUM)

**Description**: Hook assumes transferred amount equals requested amount.

**Vulnerable Pattern**:

```solidity
// VULNERABLE - Doesn't account for transfer fees
function _handleTransfer(IERC20 token, uint256 amount) internal {
    token.transferFrom(msg.sender, address(this), amount);
    balances[msg.sender] += amount; // Wrong if fee-on-transfer!
}
```

**Mitigation**: Measure actual balance changes:

```solidity
function _handleTransfer(IERC20 token, uint256 amount) internal returns (uint256 received) {
    uint256 balanceBefore = token.balanceOf(address(this));
    token.transferFrom(msg.sender, address(this), amount);
    received = token.balanceOf(address(this)) - balanceBefore;
    balances[msg.sender] += received;
}
```

## Low Severity Vulnerabilities

### 10. Hardcoded Addresses (LOW)

Use constructor parameters instead of hardcoded addresses.

### 11. Missing Event Emissions (LOW)

Always emit events for state changes (router additions/removals, admin transfers).

### 12. Unchecked Return Values (LOW)

Use `SafeERC20.safeTransfer()` instead of raw `transfer()`.

## Vulnerability Detection Tools

### Static Analysis

- **Slither**: `slither . --detect all`
- **Mythril**: `myth analyze contracts/Hook.sol`
- **Solhint**: `solhint 'contracts/**/*.sol'`

### Dynamic Analysis

- **Foundry Fuzz**: `forge test --fuzz-runs 10000`
- **Echidna**: Property-based fuzzing
- **Medusa**: Parallel fuzzing

### Manual Review Checklist

1. Trace all external calls
2. Verify all delta accounting
3. Check all access control
4. Review all state changes
5. Analyze all loops
6. Test all edge cases
