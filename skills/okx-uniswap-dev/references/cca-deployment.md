# CCA Auction Configuration & Deployment

Configure and deploy Continuous Clearing Auction (CCA) smart contracts for fair token distribution.

## Overview

CCA generalizes the uniform-price auction into continuous time, providing fair price discovery for bootstrapping initial liquidity while eliminating timing games and encouraging early participation.

**Key features:**

- Fair price discovery with continuous clearing and no timing games
- Transparent distribution with predetermined supply schedule
- Flexible configuration with customizable parameters
- Multi-chain support with canonical factory deployment
- Deterministic addresses via CREATE2

## Auction Parameters

The `AuctionParameters` struct controls every aspect of the auction:

```solidity
struct AuctionParameters {
    address currency;               // Token to raise funds in (address(0) for ETH)
    address tokensRecipient;        // Address to receive leftover tokens
    address fundsRecipient;         // Address to receive all raised funds
    uint64 startBlock;              // Block when auction starts
    uint64 endBlock;                // Block when auction ends
    uint64 claimBlock;              // Block when tokens can be claimed
    uint256 tickSpacing;            // Fixed granularity for prices (Q96)
    address validationHook;         // Optional hook (use 0x0 if none)
    uint256 floorPrice;             // Starting floor price (Q96)
    uint128 requiredCurrencyRaised; // Minimum funds to graduate
    bytes auctionStepsData;         // Packed supply issuance schedule
}
```

### Basic Configuration

| Parameter | Type | Description |
|---|---|---|
| `token` | address | Token being auctioned |
| `totalSupply` | number | Total tokens to auction (wei/smallest unit) |
| `currency` | address | Purchase token (USDC, etc.) or `address(0)` for ETH |
| `tokensRecipient` | address | Where unsold tokens go |
| `fundsRecipient` | address | Where raised funds go |

### Block Configuration

| Parameter | Type | Constraint |
|---|---|---|
| `startBlock` | uint64 | Must be less than `endBlock` |
| `endBlock` | uint64 | Must be less than or equal to `claimBlock` |
| `claimBlock` | uint64 | Must be greater than or equal to `endBlock` |

**Block times by network:**

| Network | Block Time |
|---|---|
| Mainnet, Sepolia | 12s per block |
| Unichain | 1s per block |
| Base, Arbitrum | 2s per block |

### Pricing Parameters

| Parameter | Type | Description |
|---|---|---|
| `floorPrice` | uint256 | Minimum price in Q96 format |
| `tickSpacing` | uint256 | Price tick increment in Q96 format |
| `validationHook` | address | Optional validation contract (use `0x0` if none) |
| `requiredCurrencyRaised` | uint128 | Minimum funds for graduation (0 if no minimum) |

### Supply Schedule

| Parameter | Type | Description |
|---|---|---|
| `supplySchedule` | array | Array of `{mps, blockDelta}` objects |

## Configuration File Format

```json
{
  "1": {
    "token": "0x...",
    "totalSupply": 1e29,
    "currency": "0x0000000000000000000000000000000000000000",
    "tokensRecipient": "0x...",
    "fundsRecipient": "0x...",
    "startBlock": 24321000,
    "endBlock": 24327001,
    "claimBlock": 24327001,
    "tickSpacing": 79228162514264337593543950,
    "validationHook": "0x0000000000000000000000000000000000000000",
    "floorPrice": 7922816251426433759354395000,
    "requiredCurrencyRaised": 0,
    "supplySchedule": [
      { "mps": 1000, "blockDelta": 6000 },
      { "mps": 4000000, "blockDelta": 1 }
    ]
  }
}
```

## Price Calculations (Q96 Format)

CCA uses Q96 fixed-point format. The base value `2^96` (79228162514264337593543950336) represents a 1:1 price ratio.

### Floor Price Calculation

**CRITICAL: Account for decimal differences between token and currency.**

```python
Q96 = 79228162514264337593543950336

# Formula: Q96 * (human price ratio) / 10^(token_decimals - currency_decimals)

# Example 1: USDC (6 decimals) per 18-decimal token at $0.10 ratio
token_decimals = 18
currency_decimals = 6  # USDC has 6 decimals
decimal_adjustment = 10 ** (token_decimals - currency_decimals)  # 10^12

floorPrice = Q96 * 0.1 / decimal_adjustment
# Result: 7922816251426433759354395

# Example 2: Native ETH (18 decimals) per 18-decimal token at 0.1 ratio
floorPrice = Q96 * 0.1 / 1
# Result: 7922816251426433759354395034
```

### Tick Spacing Calculation

Choose at least 1 basis point of the floor price. 1% or 10% is recommended.

```python
# 1% of floor price
tickSpacing = int(floorPrice * 0.01)
```

### Rounding Floor Price (CRITICAL)

Floor price MUST be evenly divisible by tick spacing. Round DOWN:

```python
tickSpacing = int(floorPrice * 0.01)
roundedFloorPrice = (floorPrice // tickSpacing) * tickSpacing
assert roundedFloorPrice % tickSpacing == 0, "Floor price must be divisible by tick spacing!"
```

## Supply Schedule Configuration

### Understanding MPS

Supply schedules use **MPS = 1e7** (10 million), where each unit represents one thousandth of a basis point. The schedule defines token issuance rate over time.

### Standard Schedule (Normalized Convex Curve)

The standard generator produces a 12-step convex distribution with these properties:

- Equal token amounts per step (~5.8333% for 70% gradual release)
- Decreasing block durations (convex curve property)
- Large final block receives remaining tokens (~30%)
- Total: always exactly 10,000,000 MPS

### Example: 2-Day Auction on Base

Base uses 2s blocks, so 2 days = 86,400 blocks.

```json
{
  "schedule": [
    { "mps": 54, "blockDelta": 10894 },
    { "mps": 68, "blockDelta": 8517 },
    { "mps": 75, "blockDelta": 7803 },
    { "mps": 79, "blockDelta": 7373 },
    { "mps": 83, "blockDelta": 7068 },
    { "mps": 85, "blockDelta": 6835 },
    { "mps": 88, "blockDelta": 6647 },
    { "mps": 90, "blockDelta": 6490 },
    { "mps": 92, "blockDelta": 6356 },
    { "mps": 94, "blockDelta": 6238 },
    { "mps": 95, "blockDelta": 6136 },
    { "mps": 97, "blockDelta": 6043 },
    { "mps": 2988006, "blockDelta": 1 }
  ],
  "summary": {
    "total_mps": 10000000,
    "final_block_percentage": 29.88,
    "num_steps": 12
  }
}
```

Notice: block durations decrease (10894 to 6043), token amounts per step are approximately equal, and the final block contains 29.88% of all tokens.

### With Prebid Period

Add a prebid phase where no tokens are released (mps=0):

```json
{
  "schedule": [
    { "mps": 0, "blockDelta": 43200 },
    { "mps": 54, "blockDelta": 10894 },
    { "mps": 68, "blockDelta": 8517 },
    { "mps": 2988006, "blockDelta": 1 }
  ]
}
```

### Encoding for On-Chain Deployment

Pack each `{mps, blockDelta}` element into a uint64:

```python
def encode_supply_schedule(schedule):
    encoded_bytes = b''
    for item in schedule:
        mps = item['mps']
        block_delta = item['blockDelta']
        assert mps < 2**24, f"mps {mps} exceeds 24-bit max"
        assert block_delta < 2**40, f"blockDelta {block_delta} exceeds 40-bit max"
        packed = (mps << 40) | block_delta
        encoded_bytes += packed.to_bytes(8, byteorder='big')
    return '0x' + encoded_bytes.hex()
```

Value constraints: `mps` fits in 24 bits (max 16,777,215), `blockDelta` fits in 40 bits (max 1,099,511,627,775).

## Interactive Configuration Flow

Collect parameters in batches to minimize user interaction:

### Batch 1: Basic Configuration

| Parameter | Options |
|---|---|
| Network | Ethereum, Unichain, Base, Arbitrum, Sepolia |
| Token address | Custom address (validate 42 chars starting with 0x) |
| Total supply | 100M / 1B / 10B tokens (18 decimals) or custom |
| Currency | ETH (native), USDC, USDT, or custom ERC20 |

### Batch 2: Timing & Pricing

| Parameter | Options |
|---|---|
| Auction duration | 1 day, 2 days, 3 days, 7 days, custom blocks |
| Prebid period | None, 12 hours, 1 day, custom blocks |
| Floor price | 0.10x, 0.01x, 0.001x, or custom ratio |
| Tick spacing | 1% (recommended), 10%, 0.1%, custom |

### Batch 3: Recipients & Launch

| Parameter | Options |
|---|---|
| Tokens recipient | Same as funds recipient, or custom address |
| Funds recipient | Same as tokens recipient, or custom address |
| Start time | In 1 hour, 6 hours, 24 hours, custom block |
| Minimum funds | None, 100 ETH, 1000 ETH, custom |

### Batch 4: Optional Hook

| Parameter | Options |
|---|---|
| Validation hook | None, or custom hook address |

## Factory Deployment

### Factory Address

| Version | Address | Status |
|---|---|---|
| v1.1.0 | `0xCCccCcCAE7503Cac057829BF2811De42E16e0bD5` | Recommended |

### Deployment Steps

**Step 1: Clone CCA Repository**

```bash
git clone https://github.com/Uniswap/continuous-clearing-auction.git
cd continuous-clearing-auction
forge install
```

**Step 2: Prepare Configuration**

Create `script/auction-config.json` with your parameters.

**Step 3: Encode Configuration**

```bash
cast abi-encode "initializeDistribution(address,uint256,bytes,bytes32)" \
  "$TOKEN_ADDRESS" \
  "$TOTAL_SUPPLY" \
  "$(cast abi-encode "(address,address,address,uint64,uint64,uint64,uint256,address,uint256,uint128,bytes)" \
    "$CURRENCY" "$TOKENS_RECIPIENT" "$FUNDS_RECIPIENT" \
    "$START_BLOCK" "$END_BLOCK" "$CLAIM_BLOCK" \
    "$TICK_SPACING" "$VALIDATION_HOOK" "$FLOOR_PRICE" \
    "$REQUIRED_CURRENCY_RAISED" "$ENCODED_SUPPLY_SCHEDULE")" \
  "0x0000000000000000000000000000000000000000000000000000000000000000"
```

**Step 4: Deploy via Foundry Script**

```solidity
// script/DeployAuction.s.sol
pragma solidity ^0.8.24;
import "forge-std/Script.sol";

contract DeployAuction is Script {
    function run() external {
        address token = vm.envAddress("TOKEN");
        uint256 amount = vm.envUint("TOTAL_SUPPLY");
        bytes memory configData = abi.encode(
            vm.envAddress("CURRENCY"),
            vm.envAddress("TOKENS_RECIPIENT"),
            vm.envAddress("FUNDS_RECIPIENT"),
            uint64(vm.envUint("START_BLOCK")),
            uint64(vm.envUint("END_BLOCK")),
            uint64(vm.envUint("CLAIM_BLOCK")),
            vm.envUint("TICK_SPACING"),
            vm.envAddress("VALIDATION_HOOK"),
            vm.envUint("FLOOR_PRICE"),
            uint128(vm.envUint("REQUIRED_CURRENCY_RAISED")),
            vm.envBytes("ENCODED_SUPPLY_SCHEDULE")
        );
        vm.startBroadcast();
        IERC20(token).approve(0xCCccCcCAE7503Cac057829BF2811De42E16e0bD5, amount);
        address auction = ICCAFactory(0xCCccCcCAE7503Cac057829BF2811De42E16e0bD5)
            .initializeDistribution(token, amount, configData, bytes32(0));
        vm.stopBroadcast();
    }
}
```

```bash
forge script script/DeployAuction.s.sol:DeployAuction \
  --rpc-url $RPC_URL \
  --broadcast \
  --account deployer --sender $DEPLOYER_ADDRESS
```

**Step 5: Post-Deployment (Required)**

```bash
cast send $AUCTION_ADDRESS "onTokensReceived()" \
  --rpc-url $RPC_URL \
  --account deployer --sender $DEPLOYER_ADDRESS
```

This is a required prerequisite before the auction can accept bids.

## Key Contract Functions

| Function | Purpose |
|---|---|
| `submitBid(maxPrice, amount, owner, prevTickPrice, hookData)` | Submit a bid |
| `checkpoint()` | Checkpoint auction state (once per block with a new bid) |
| `exitBid()` / `exitPartiallyFilledBid()` | Exit bids when outbid or auction ends |
| `isGraduated()` | Returns true if `currencyRaised >= requiredCurrencyRaised` |
| `claimTokens()` | Claim purchased tokens after `claimBlock` |
| `sweepCurrency()` | Withdraw raised currency (graduated only, after auction) |
| `sweepUnsoldTokens()` | Withdraw unsold tokens |

## Validation Rules

Before deployment, ensure:

| # | Rule | Check |
|---|---|---|
| 1 | Block sequence valid | `startBlock < endBlock <= claimBlock` |
| 2 | Floor price divisible by tick spacing | `floorPrice % tickSpacing == 0` |
| 3 | Tick spacing adequate | >= 1% of floor price recommended |
| 4 | All addresses valid | 42 chars starting with 0x |
| 5 | Total supply bounded | <= 1e30 wei |
| 6 | Supply schedule ends strong | Last block sells ~30%+ |
| 7 | No fee-on-transfer tokens | FoT tokens not supported |
| 8 | Token decimals adequate | >= 6 decimals |
| 9 | `onTokensReceived()` called | Required post-deployment step |
| 10 | Currency address correct for network | Verify on target chain |

## Supported Chains

| Chain ID | Network | Block Time |
|---|---|---|
| 1 | Mainnet | 12s |
| 130 | Unichain | 1s |
| 1301 | Unichain Sepolia (Testnet) | 2s |
| 8453 | Base | 2s |
| 42161 | Arbitrum | 2s |
| 11155111 | Sepolia | 12s |

## Private Key Security

**Never** use `--private-key` flag. Recommended options:

1. **Hardware wallet** (most secure): `forge script ... --broadcast --ledger`
2. **Encrypted keystore**: `cast wallet import deployer --interactive` then `forge script ... --account deployer --sender $DEPLOYER_ADDRESS`
3. **Environment variable** (testing only): Store in `.env`, add to `.gitignore`

Always test on testnets before mainnet.

## Troubleshooting

| Issue | Solution |
|---|---|
| "Invalid block sequence" | Ensure `startBlock < endBlock <= claimBlock` |
| "Floor price not aligned" | Round floor price to multiple of tick spacing |
| "Tick spacing too small" | Use at least 1% of floor price |
| "Total supply too large" | Max 1e30 wei |
| "Gas inefficiency" | Increase tick spacing |
| "Invalid address" | Verify 42 chars starting with 0x |

## Additional Resources

- [CCA Repository](https://github.com/Uniswap/continuous-clearing-auction)
- [Uniswap CCA Docs](https://docs.uniswap.org/contracts/liquidity-launchpad/CCA)
- [Bug Bounty](https://cantina.xyz/code/f9df94db-c7b1-434b-bb06-d1360abdd1be/overview)
