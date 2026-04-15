# Base Hook Template

A security-first Solidity template for Uniswap v4 hooks with all permissions disabled by default.

## Complete Template

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @title SecureHook
/// @notice Security-first v4 hook template
/// @dev All permissions disabled by default - enable only what you need
contract SecureHook is BaseHook {
    using PoolIdLibrary for PoolKey;

    // ═══════════════════════════════════════════════════════════════════════
    // ERRORS
    // ═══════════════════════════════════════════════════════════════════════

    error NotPoolManager();
    error RouterNotAllowed();
    error ZeroAddress();
    error NotAdmin();
    error Unauthorized();
    error AdminTransferToSelf();
    error NoPendingAdmin();

    // ═══════════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════════

    event RouterAdded(address indexed router);
    event RouterRemoved(address indexed router);
    event AdminTransferProposed(address indexed currentAdmin, address indexed proposedAdmin);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Allowlisted routers that can interact with this hook
    mapping(address => bool) public allowedRouters;

    /// @notice Hook administrator
    address public admin;

    /// @notice Pending administrator for two-step transfer
    address public pendingAdmin;

    // ═══════════════════════════════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════════════════════════════

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    modifier onlyAllowedRouter(address sender) {
        if (!allowedRouters[sender]) revert RouterNotAllowed();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════════

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {
        admin = msg.sender;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HOOK PERMISSIONS - ALL DISABLED BY DEFAULT
    // ═══════════════════════════════════════════════════════════════════════

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            // DANGER ZONE - These enable delta manipulation
            beforeSwapReturnDelta: false,      // CRITICAL: NoOp attack vector
            afterSwapReturnDelta: false,       // HIGH: Can extract value
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HOOK CALLBACKS - Implement only what you enable
    // ═══════════════════════════════════════════════════════════════════════

    /*
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override onlyPoolManager onlyAllowedRouter(sender)
      returns (bytes4, BeforeSwapDelta, uint24) {
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external override onlyPoolManager returns (bytes4, int128) {
        return (BaseHook.afterSwap.selector, 0);
    }
    */

    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function addAllowedRouter(address router) external onlyAdmin {
        if (router == address(0)) revert ZeroAddress();
        allowedRouters[router] = true;
        emit RouterAdded(router);
    }

    function removeAllowedRouter(address router) external onlyAdmin {
        allowedRouters[router] = false;
        emit RouterRemoved(router);
    }

    function proposeAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert ZeroAddress();
        if (newAdmin == admin) revert AdminTransferToSelf();
        pendingAdmin = newAdmin;
        emit AdminTransferProposed(admin, newAdmin);
    }

    function acceptAdmin() external {
        if (pendingAdmin == address(0)) revert NoPendingAdmin();
        if (msg.sender != pendingAdmin) revert Unauthorized();
        address previousAdmin = admin;
        admin = pendingAdmin;
        pendingAdmin = address(0);
        emit AdminTransferred(previousAdmin, admin);
    }
}
```

## Usage Guide

### 1. Copy and rename

Copy this template to your project and rename appropriately.

### 2. Enable only needed permissions

In `getHookPermissions()`, set `true` only for callbacks you implement:

```solidity
function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
    return Hooks.Permissions({
        // ... other permissions false ...
        beforeSwap: true,  // Enable this
        afterSwap: true,   // And this
        // ... rest false ...
    });
}
```

### 3. Implement enabled callbacks

Uncomment and implement only the callbacks you enabled. Always use the `onlyPoolManager` modifier and `onlyAllowedRouter(sender)` where needed.

### 4. Deploy with correct address

v4 hooks require specific address patterns. Use the hook miner:

```bash
forge script script/DeployHook.s.sol --rpc-url $RPC_URL
```

## Security Checklist for This Template

- [x] PoolManager verification via `onlyPoolManager` modifier
- [x] Router allowlisting via `onlyAllowedRouter` modifier
- [x] All dangerous permissions disabled by default
- [x] Admin functions protected
- [x] Zero address checks
- [x] Two-step admin transfer prevents accidental privilege loss
- [ ] Add reentrancy guard if making external calls
- [ ] Add your specific business logic tests
