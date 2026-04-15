# Trading API Flows

Step-by-step bash scripts for swap and bridge operations using the Uniswap Trading API.

## Phase 4A -- Swap on Source Chain

Use the Trading API to swap the source token to USDC (the bridge asset). This is an EXACT_OUTPUT swap.

### Variable Setup

```bash
SOURCE_CHAIN_ID=8453              # Chain where you hold the source token
TOKEN_IN_ADDRESS="0x..."          # Source token address (or zero address for native ETH)
USDC_ADDRESS="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"  # USDC on Base
CAST_ACCOUNT="uniswap-demo"      # Cast keystore account name
CAST_PASSWORD=""                  # Keystore password (empty if none)
SOURCE_RPC_URL="https://mainnet.base.org"
USDC_E_AMOUNT_NEEDED="$REQUIRED_AMOUNT"
```

For native ETH, use the zero address as TOKEN_IN: `0x0000000000000000000000000000000000000000`

### Hex-to-Decimal Conversion

```bash
hex_to_dec() { python3 -c "print(int('$1', 16))"; }
```

### Step 4A-1: Check Approval

```bash
APPROVAL_BODY=$(jq -n \
  --arg wallet "$WALLET_ADDRESS" \
  --arg token "$TOKEN_IN_ADDRESS" \
  --arg amount "$REQUIRED_AMOUNT_IN" \
  --argjson chainId "$SOURCE_CHAIN_ID" \
  '{walletAddress: $wallet, token: $token, amount: $amount, chainId: $chainId}')

curl -s -X POST https://trade-api.gateway.uniswap.org/v1/check_approval \
  -H "Content-Type: application/json" \
  -H "x-api-key: $UNISWAP_API_KEY" \
  -H "x-universal-router-version: 2.0" \
  -d "$APPROVAL_BODY"
```

> **REQUIRED:** If `approval` field is non-null, use `AskUserQuestion` to show approval details and obtain explicit confirmation.

### Step 4A-2: Get Exact-Output Quote

```bash
QUOTE_BODY=$(jq -n \
  --arg swapper "$WALLET_ADDRESS" \
  --arg tokenIn "$TOKEN_IN_ADDRESS" \
  --arg tokenOut "$USDC_ADDRESS" \
  --argjson tokenInChainId "$SOURCE_CHAIN_ID" \
  --argjson tokenOutChainId "$SOURCE_CHAIN_ID" \
  --arg amount "$USDC_E_AMOUNT_NEEDED" \
  --argjson slippage 0.5 \
  '{
    swapper: $swapper, tokenIn: $tokenIn, tokenOut: $tokenOut,
    tokenInChainId: $tokenInChainId, tokenOutChainId: $tokenOutChainId,
    amount: $amount, type: "EXACT_OUTPUT",
    slippageTolerance: $slippage, routingPreference: "BEST_PRICE"
  }')

curl -s -X POST https://trade-api.gateway.uniswap.org/v1/quote \
  -H "Content-Type: application/json" \
  -H "x-api-key: $UNISWAP_API_KEY" \
  -H "x-universal-router-version: 2.0" \
  -d "$QUOTE_BODY"
```

Store as `QUOTE_RESPONSE`. Extract actual input amount and re-run approval check.

> **Quote expiration:** Quotes expire in ~60 seconds. Re-fetch if delayed.

### Step 4A-2.5: Sign PermitData

If quote response contains non-null `permitData`, sign it using EIP-712 typed data via Permit2. For native ETH, `permitData` is typically `null` -- skip this step.

### Step 4A-3: Execute the Swap

```bash
ROUTING=$(echo "$QUOTE_RESPONSE" | jq -r '.routing')
CLEAN_QUOTE=$(echo "$QUOTE_RESPONSE" | jq 'del(.permitData, .permitTransaction)')

if [ "$ROUTING" = "CLASSIC" ]; then
  PERMIT_DATA=$(echo "$QUOTE_RESPONSE" | jq '.permitData')
  if [ "$PERMIT_DATA" != "null" ]; then
    SWAP_BODY=$(echo "$CLEAN_QUOTE" | jq \
      --arg sig "$PERMIT2_SIGNATURE" --argjson pd "$PERMIT_DATA" \
      '. + {signature: $sig, permitData: $pd}')
  else
    SWAP_BODY="$CLEAN_QUOTE"
  fi
else
  # UniswapX: signature only (no permitData in swap body)
  SWAP_BODY=$(echo "$CLEAN_QUOTE" | jq --arg sig "$PERMIT2_SIGNATURE" '. + {signature: $sig}')
fi

curl -s -X POST https://trade-api.gateway.uniswap.org/v1/swap \
  -H "Content-Type: application/json" \
  -H "x-api-key: $UNISWAP_API_KEY" \
  -H "x-universal-router-version: 2.0" \
  -d "$SWAP_BODY"
```

Validate `swap.data` is non-empty, then broadcast:

```bash
SWAP_TO=$(echo "$SWAP_RESPONSE" | jq -r '.swap.to')
SWAP_DATA=$(echo "$SWAP_RESPONSE" | jq -r '.swap.data')
SWAP_VALUE=$(echo "$SWAP_RESPONSE" | jq -r '.swap.value // "0x0"')

# Validate
[ -z "$SWAP_DATA" ] || [ "$SWAP_DATA" = "null" ] && echo "ERROR: empty swap.data" && exit 1

# Broadcast
SWAP_VALUE_DEC=$(hex_to_dec "$SWAP_VALUE")
SWAP_TX=$(cast send "$SWAP_TO" "$SWAP_DATA" \
  --value "$SWAP_VALUE_DEC" \
  --account "$CAST_ACCOUNT" --password "$CAST_PASSWORD" \
  --rpc-url "$SOURCE_RPC_URL" --json | jq -r '.transactionHash')

# Wait for confirmation
SWAP_STATUS=$(cast receipt "$SWAP_TX" --rpc-url "$SOURCE_RPC_URL" --json | jq -r '.status')
[ "$SWAP_STATUS" = "0x1" ] || { echo "ERROR: Swap reverted"; exit 1; }

# Verify USDC balance
USDC_AFTER=$(cast call "$USDC_ADDRESS" "balanceOf(address)(uint256)" "$WALLET_ADDRESS" --rpc-url "$SOURCE_RPC_URL")
[ "$USDC_AFTER" -lt "$USDC_E_AMOUNT_NEEDED" ] && echo "ERROR: Insufficient USDC after swap" && exit 1
```

## Phase 4B -- Bridge to Tempo

Bridge USDC from source chain to USDC.e on Tempo via Across Protocol.

### Bridge Asset Addresses

| Chain | Asset | Address |
|---|---|---|
| Base (8453) -- in | Native USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Ethereum (1) -- in | USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| Arbitrum (42161) -- in | USDC.e | `0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8` |
| Tempo (4217) -- out | USDC.e | `0x20C000000000000000000000b9537d11c60E8b50` |

### Step 4B-1: Check Approval

```bash
BRIDGE_TOKEN_IN="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"   # USDC on Base
BRIDGE_TOKEN_OUT="0x20C000000000000000000000b9537d11c60E8b50"   # USDC.e on Tempo

APPROVAL=$(curl -s "https://trade-api.gateway.uniswap.org/v1/check_approval" \
  -H "Content-Type: application/json" -H "x-api-key: $UNISWAP_API_KEY" \
  --data "$(jq -n --arg token "$BRIDGE_TOKEN_IN" --arg amount "$BRIDGE_AMOUNT" \
    --arg walletAddress "$WALLET_ADDRESS" --argjson chainId "$SOURCE_CHAIN_ID" \
    '{token: $token, amount: $amount, walletAddress: $walletAddress, chainId: $chainId}')")
```

> **IMPORTANT:** Also check on-chain allowance for the bridge spender (the `to` address from `/swap` response) after getting the bridge quote.

### Step 4B-2: Get Bridge Quote

```bash
BRIDGE_QUOTE=$(curl -s "https://trade-api.gateway.uniswap.org/v1/quote" \
  -H "Content-Type: application/json" -H "x-api-key: $UNISWAP_API_KEY" \
  --data "$(jq -n --arg tokenIn "$BRIDGE_TOKEN_IN" --argjson tokenInChainId "$SOURCE_CHAIN_ID" \
    --arg tokenOut "$BRIDGE_TOKEN_OUT" --arg tokenOutChainId "4217" \
    --arg amount "$BRIDGE_AMOUNT" --arg swapper "$WALLET_ADDRESS" \
    '{tokenIn: $tokenIn, tokenInChainId: $tokenInChainId, tokenOut: $tokenOut,
      tokenOutChainId: $tokenOutChainId, amount: $amount, swapper: $swapper, type: "EXACT_OUTPUT"}')")
```

> **REQUIRED:** Show bridge details (amount, destination, fee, ETA) and get user confirmation.

### Step 4B-3: Execute Bridge

```bash
BRIDGE_RESPONSE=$(curl -s "https://trade-api.gateway.uniswap.org/v1/swap" \
  -H "Content-Type: application/json" -H "x-api-key: $UNISWAP_API_KEY" \
  --data "$(jq -n --argjson quote "$BRIDGE_QUOTE" --arg walletAddress "$WALLET_ADDRESS" \
    '{quote: $quote.quote, walletAddress: $walletAddress}')")

BRIDGE_TO=$(echo "$BRIDGE_RESPONSE" | jq -r '.swap.to')
BRIDGE_DATA=$(echo "$BRIDGE_RESPONSE" | jq -r '.swap.data')
BRIDGE_VALUE_DEC=$(hex_to_dec "$(echo "$BRIDGE_RESPONSE" | jq -r '.swap.value // "0"')")

BRIDGE_TX=$(cast send "$BRIDGE_TO" "$BRIDGE_DATA" \
  --value "$BRIDGE_VALUE_DEC" --account "$CAST_ACCOUNT" --password "$CAST_PASSWORD" \
  --rpc-url "$SOURCE_RPC_URL" --json | jq -r '.transactionHash')
```

### Step 4B-4: Poll for Arrival

```bash
TEMPO_RPC_URL="https://rpc.presto.tempo.xyz"
for i in $(seq 1 20); do
  RAW_BALANCE=$(cast call "$BRIDGE_TOKEN_OUT" "balanceOf(address)(uint256)" "$WALLET_ADDRESS" \
    --rpc-url "$TEMPO_RPC_URL" 2>/dev/null || echo "0")
  USDC_E_ON_TEMPO=$(echo "$RAW_BALANCE" | awk '{print $1}')
  [ "$USDC_E_ON_TEMPO" -ge "$BRIDGE_AMOUNT" ] && echo "Bridge confirmed" && break
  echo "Waiting... attempt $i/20"
  sleep 30
done
```

> **Do not re-submit** if poll times out. Check the Tempo explorer instead.

### Step 4B-5: Transfer to Tempo Wallet (if needed)

If `WALLET_ADDRESS` differs from `TEMPO_WALLET_ADDRESS`:

```bash
if [ "$WALLET_ADDRESS" != "$TEMPO_WALLET_ADDRESS" ]; then
  TRANSFER_DATA=$(cast calldata "transfer(address,uint256)" "$TEMPO_WALLET_ADDRESS" "$BRIDGE_AMOUNT")
  cast send "$BRIDGE_TOKEN_OUT" "$TRANSFER_DATA" \
    --account "$CAST_ACCOUNT" --password "$CAST_PASSWORD" \
    --rpc-url "$TEMPO_RPC_URL" --gas-limit 100000
fi
```
