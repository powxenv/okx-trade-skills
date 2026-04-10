# DeFi Yield Workflow

> Load this file when the user wants to earn yield, stake, provide liquidity, deposit, withdraw, or claim DeFi rewards.

## Step-by-Step Deposit Flow

### Step 1: Address Resolution

If the user doesn't provide an address, resolve from Agentic Wallet:
```bash
onchainos wallet status
onchainos wallet addresses
# Match EVM/Solana/XLayer address to target chain
```

### Step 2: Find a DeFi Product

```bash
# List top products by APY on a chain
onchainos defi list --chain <chain>

# Search for specific tokens/platforms
onchainos defi search --token USDC --chain ethereum
# Filter by type: SINGLE_EARN, DEX_POOL, LENDING
onchainos defi search --token ETH --chain ethereum --product-group SINGLE_EARN

# Get full product details
onchainos defi detail --investment-id <id>
```

**CRITICAL — High APY Warning**: If any product has APY > 50% (`rate > 0.5`), you MUST warn:
> "WARNING: This product shows APY above 50%, which indicates elevated risk (potential impermanent loss, smart contract risk, or unsustainable rewards). Proceed with caution."

### Step 3: Analyze Before Depositing

```bash
# Check APY history (yield trend)
onchainos defi rate-chart --investment-id <id> --time-range MONTH
# Time ranges: WEEK, MONTH, SEASON, YEAR

# Check TVL history (pool stability)
onchainos defi tvl-chart --investment-id <id> --time-range SEASON

# V3 Pool: check liquidity depth to pick tick range
onchainos defi depth-price-chart --investment-id <id>
# V3 Pool: check price history
onchainos defi depth-price-chart --investment-id <id> --chart-type PRICE --time-range WEEK
```

### Step 4: Check Wallet Balance (MANDATORY)

```bash
# Verify sufficient balance BEFORE depositing
onchainos wallet balance --chain <chainId>
# Or for external address:
onchainos portfolio token-balances --address <addr> --tokens "<chain>:<token_addr>"
```

If balance is insufficient, STOP and warn the user. Do NOT proceed to `defi invest`.

### Step 5: Get Token Decimals

From `defi detail` output, find `underlyingToken[].tokenAddress`, then:
```bash
onchainos token search --query <tokenAddress> --chains <chain>
```
Use the `decimal` field for amount conversion.

### Step 6: Execute Deposit

```bash
# Amount must be in minimal units: userAmount × 10^decimal
# e.g., 100 USDC (decimal=6) → --amount 100000000
onchainos defi invest \
  --investment-id <id> \
  --address <addr> \
  --token <symbol_or_addr> \
  --amount <minimal_units> \
  --chain <chain>
```

For V3 Pool deposits, also specify:
```bash
onchainos defi invest \
  --investment-id <id> \
  --address <addr> \
  --token <symbol> \
  --amount <minimal_units> \
  --chain <chain> \
  --range <range> \
  --tick-lower <lower> \
  --tick-upper <upper>
```

This returns `dataList` with unsigned calldata steps.

### Step 7: Sign & Broadcast

**Path A (Agentic Wallet)**:
```bash
# EVM:
onchainos wallet contract-call \
  --to <dataList[N].to> \
  --chain <chainIndex> \
  --input-data <dataList[N].serializedData> \
  --value <value_in_UI_units>

# Solana:
onchainos wallet contract-call \
  --to <program_id> \
  --chain 501 \
  --unsigned-tx <dataList[N].serializedData>
```

**Path B (Manual signing)**:
```bash
# Sign each dataList step externally, then broadcast:
onchainos gateway broadcast --signed-tx <signed_hex> --address <addr> --chain <chain>
# Wait for confirmation (txStatus=2) before next step
onchainos gateway orders --address <addr> --chain <chain> --order-id <orderId>
```

Execute `dataList[0]` first, wait for confirmation, then `dataList[1]`, etc. Never in parallel.

### Step 8: Verify Position

```bash
onchainos defi positions --address <addr> --chains <chain>
onchainos defi position-detail --address <addr> --chain <chain> --platform-id <pid>
```

## Withdraw Flow

**CRITICAL — Fresh position-detail is MANDATORY before every withdraw.** Do NOT reuse stale data.

```bash
# 1. Get positions
onchainos defi positions --address <addr> --chains <chain>

# 2. Get FRESH position detail (MANDATORY)
onchainos defi position-detail --address <addr> --chain <chain> --platform-id <pid>

# 3. Withdraw (full exit)
onchainos defi withdraw \
  --investment-id <id> \
  --address <addr> \
  --chain <chain> \
  --ratio 1 \
  --platform-id <pid>

# 3. Withdraw (partial exit)
# Convert coinAmount to minimal units: floor(amount × 10^tokenPrecision)
onchainos defi withdraw \
  --investment-id <id> \
  --address <addr> \
  --chain <chain> \
  --amount <minimal_units> \
  --platform-id <pid>
```

Then sign and broadcast the `dataList` as in Step 7.

## Claim Rewards Flow

**CRITICAL — Fresh position-detail is MANDATORY before every collect.**

```bash
# 1. Get FRESH position detail (MANDATORY)
onchainos defi position-detail --address <addr> --chain <chain> --platform-id <pid>

# 2. Claim rewards
onchainos defi collect \
  --address <addr> \
  --chain <chain> \
  --reward-type <type> \
  --investment-id <id> \
  --platform-id <pid>
```

rewardType values: `REWARD_PLATFORM`, `REWARD_INVESTMENT`, `V3_FEE`, `REWARD_OKX_BONUS`, `REWARD_MERKLE_BONUS`, `UNLOCKED_PRINCIPAL`

## Error Codes

| Code | Scenario | Handling |
|---|---|---|
| 84400 | Parameter null | Check required params |
| 84021 | Asset syncing | "Position data is syncing, please retry shortly" |
| 84023 | Invalid expectOutputList | Retry or pass `--platform-id` |
| 84014 | Balance check failed | Check balance first |
| 84018 | V3 balancing failed | Adjust price range or increase slippage |
| 84010 | Token not supported | Check supported tokens via `defi detail` |
| 84001 | Platform not supported | Check supported platforms |
| 84016 | Contract execution failed | Check parameters and retry |

## Special Notes

- **Solana transaction expiry**: Solana DeFi transactions expire in ~60 seconds. Warn user to sign immediately.
- **Address-chain compatibility**: EVM addresses only for EVM chains, Solana addresses only for `solana`. Never mix.
- **Amount conversion**: `--amount` must be in minimal units (`userAmount × 10^decimal`). Use `--token` with symbol when possible.
- **Slippage default**: `0.01` (1%). Suggest `0.03–0.05` for volatile V3 pools.
- **User confirmation required** before every invest/withdraw/collect execution.