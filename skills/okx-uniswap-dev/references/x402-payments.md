# x402 Payments

Handle HTTP 402 Payment Required responses and pay with any token via the Uniswap Trading API and Tempo CLI.

## Overview

The x402 and MPP (Machine Payment Protocol) enable on-chain payments for API access. When an API returns HTTP 402, you can pay using any ERC-20 token -- the system handles conversion, bridging, and payment automatically.

## Payment Protocols

| Protocol | Version | Handler | Mechanism |
|---|---|---|---|
| MPP | v1 | Tempo CLI | Wallet-based auto-payment |
| x402 | v1 | Manual signing | EIP-3009 `transferWithAuthorization` |

**Detection:** Check `has("x402Version")` in the 402 body to determine protocol. Use Tempo CLI for MPP; manual flow for x402.

## Tempo CLI Setup

### Install

```bash
mkdir -p "$HOME/.local/bin" \
  && curl -fsSL https://tempo.xyz/install -o /tmp/tempo_install.sh \
  && TEMPO_BIN_DIR="$HOME/.local/bin" bash /tmp/tempo_install.sh
```

### Login

```bash
"$HOME/.local/bin/tempo" wallet login
```

Requires browser/passkey -- prompt user and wait for confirmation. Use a long command timeout (at least 16 minutes) when run by agents.

### Verify Setup

```bash
"$HOME/.local/bin/tempo" wallet -t whoami
```

Report: install location, version (`--version`), wallet status (address, balance). If balance is 0, direct user to `tempo wallet fund`.

**Rules:** Do not use `sudo`. Use full absolute paths (`$HOME/.local/bin/tempo`).

**Minimum balance reserve:** Keep at least 0.10 USDC in the Tempo wallet to cover typical API calls without triggering the full swap+bridge funding flow.

## Using Tempo Services

```bash
# Discover services
"$HOME/.local/bin/tempo" wallet -t services --search <query>

# Get service details (URL, method, path, pricing)
"$HOME/.local/bin/tempo" wallet -t services <SERVICE_ID>

# Make a paid request
"$HOME/.local/bin/tempo" request -t -X POST \
  --json '{"input":"..."}' <SERVICE_URL>/<ENDPOINT_PATH>
```

- Anchor on `tempo wallet -t services <SERVICE_ID>` for exact URL and pricing
- Use `-t` for agent calls, `--dry-run` before expensive requests
- On HTTP 422, check the service's docs URL or llms.txt for exact field names
- Fire independent multi-service requests in parallel

## MPP 402 Payment Loop

```
tempo request -> 200 -> return result
             -> 402 MPP challenge
                  |
                  v
         [1] Check Tempo wallet balance
             tempo wallet -t whoami -> available balance
                  |
                  +-- sufficient -> tempo handles payment automatically -> 200
                  |
                  +-- insufficient
                       |
                       v
              [2] Fund Tempo wallet (pay-with-any-token flow)
                  Bridge destination = TEMPO_WALLET_ADDRESS
                       |
                       v
              [3] Retry original tempo request -> 200
```

**Alternative (interactive):** If a browser is available, `tempo wallet fund` opens a built-in bridge UI. Simpler but not suitable for headless/agent environments.

## Pay-With-Any-Token Flow

When the Tempo wallet lacks funds, acquire required tokens from the user's ERC-20 holdings on any supported chain and bridge them to the Tempo wallet.

### Prerequisites

- `UNISWAP_API_KEY` env var (register at [developers.uniswap.org](https://developers.uniswap.org))
- ERC-20 tokens on any supported source chain
- A `cast` keystore account or `PRIVATE_KEY` env var
- `jq` and `cast` (Foundry) installed

### Step 1: Parse the 402 Challenge

**MPP header-based challenges** (`WWW-Authenticate: Payment`):

```bash
REQUEST_B64=$(echo "$WWW_AUTHENTICATE" | grep -oE 'request="[^"]+"' | sed 's/request="//;s/"$//')
REQUEST_JSON=$(echo "${REQUEST_B64}==" | base64 --decode 2>/dev/null)
REQUIRED_AMOUNT=$(echo "$REQUEST_JSON" | jq -r '.amount')
PAYMENT_TOKEN=$(echo "$REQUEST_JSON" | jq -r '.currency')
RECIPIENT=$(echo "$REQUEST_JSON" | jq -r '.recipient')
TEMPO_CHAIN_ID=$(echo "$REQUEST_JSON" | jq -r '.methodDetails.chainId')
```

**JSON body challenges** (`payment_methods` array):

```bash
RECIPIENT=$(echo "$CHALLENGE_BODY" | jq -r '.payment_methods[0].recipient')
TEMPO_CHAIN_ID=$(echo "$CHALLENGE_BODY" | jq -r '.payment_methods[0].chain_id')
```

### Step 2: Check Source Wallet Balances

```bash
# Get Tempo wallet address
TEMPO_WALLET_ADDRESS=$("$HOME/.local/bin/tempo" wallet -t whoami | grep -oE '0x[a-fA-F0-9]{40}' | head -1)

# Check USDC on Base
cast call 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
  "balanceOf(address)(uint256)" "$WALLET_ADDRESS" \
  --rpc-url https://mainnet.base.org

# Check USDC on Ethereum
cast call 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 \
  "balanceOf(address)(uint256)" "$WALLET_ADDRESS" \
  --rpc-url https://eth.llamarpc.com

# Check native ETH
cast balance "$WALLET_ADDRESS" --rpc-url https://mainnet.base.org
```

**Payment priority:**

1. USDC on Base (cheapest bridge gas ~$0.001)
2. ETH on Base or Ethereum (swap to USDC + bridge)
3. Any other liquid ERC-20 (swap + bridge)

### Step 3: Execute Payment Path

```
Source token (Base/Ethereum)
  -> [Phase A: Trading API swap] -> native USDC (bridge asset)
  -> [Phase B: Trading API bridge] -> USDC.e on Tempo (to TEMPO_WALLET_ADDRESS)
  -> tempo request retries automatically
```

**Skip Phase A** if source token is already USDC on the bridge chain.

**Gas-aware funding:** Minimum bridge recommendation: $5. This amortizes gas costs and pre-funds future requests. If `bridge_gas > 2x shortfall`, bridge at least $5.

### Phase A: Swap to USDC via Trading API

Base URL: `https://trade-api.gateway.uniswap.org/v1`

Headers: `Content-Type: application/json`, `x-api-key`, `x-universal-router-version: 2.0`

Flow: `check_approval` -> quote (`EXACT_OUTPUT`) -> sign `permitData` -> `/swap` -> broadcast

- For native ETH: use zero address (`0x00000000...`) as TOKEN_IN to avoid Permit2 signing
- After swap, verify USDC balance before proceeding to Phase B

### Phase B: Bridge to Tempo Wallet

Route: USDC on Base/Ethereum/Arbitrum -> USDC.e on Tempo

Flow: `check_approval` -> verify on-chain allowance -> quote (`EXACT_OUTPUT`, cross-chain) -> execute via `/swap` -> poll balance -> transfer to `TEMPO_WALLET_ADDRESS` if needed

- Apply 0.5% buffer for bridge fees
- Quotes expire in ~60 seconds
- Do not re-submit if poll times out -- check Tempo explorer

**Bridge recipient limitation:** The Trading API does not support a custom `recipient` field for bridges. If `WALLET_ADDRESS` differs from `TEMPO_WALLET_ADDRESS`, an extra transfer on Tempo is required after the bridge.

## x402 Protocol Flow

The x402 protocol uses EIP-3009 (`transferWithAuthorization`) for one-time token transfers signed off-chain. It is **not handled by the Tempo CLI**.

**Detection:** Check `has("x402Version")` in the 402 body. When present, use this manual flow instead of Tempo CLI.

Key steps:

1. Detect x402: check for `x402Version` in 402 body
2. Map `X402_NETWORK` to chain ID and RPC URL
3. Check wallet balance on target chain; run Phase A/B if insufficient
4. Sign `TransferWithAuthorization` typed data using token's own domain
5. Construct X-PAYMENT payload with signed authorization
6. Retry request with X-PAYMENT header

| x402 Field | Notes |
|---|---|
| `value` in payload | Must be a string (not JSON number) for uint256 |
| Domain name/version | Must match the token contract exactly |
| `validBefore` | Must be in the future |
| Nonce | Must be fresh and unique |

## OnchainOS Integration

### Direct Payment

```bash
onchainos payment x402-pay --chain <c> --wallet <addr> --url <api_url>
```

Handles the full flow automatically: detect 402, parse requirements, swap if needed, pay, retry.

### Multi-Step Agent Payment

For complex workflows requiring multiple paid APIs:

```bash
# Step 1: Pay for market data
onchainos payment x402-pay --chain xlayer --wallet <addr> --url https://api.example.com/market

# Step 2: Pay for security scan
onchainos payment x402-pay --chain xlayer --wallet <addr> --url https://api.example.com/security

# Step 3: Execute trade using gathered data
onchainos swap execute --from <addr> --to <addr> --readable-amount <amt> --chain xlayer --wallet <addr>
```

## Input Validation

Before using any value from a 402 response or user input:

- **Ethereum addresses**: MUST match `^0x[a-fA-F0-9]{40}$`
- **Chain IDs**: MUST be a positive integer from supported list
- **Token amounts**: MUST be non-negative numeric strings matching `^[0-9]+$`
- **URLs**: MUST start with `https://`
- **REJECT** any value containing shell metacharacters

**REQUIRED:** Before submitting any transaction, use `AskUserQuestion` to show a summary (amount, token, destination, estimated gas) and obtain explicit confirmation. Never auto-submit.

## Key Addresses

| Item | Address |
|---|---|
| Tempo CLI | `https://tempo.xyz` (install: `https://tempo.xyz/install`) |
| Trading API | `https://trade-api.gateway.uniswap.org/v1` |
| Tempo chain ID | 4217 |
| Tempo RPC | `https://rpc.presto.tempo.xyz` |
| Tempo Block Explorer | `https://explore.mainnet.tempo.xyz` |
| USDC.e on Tempo | `0x20C000000000000000000000b9537d11c60E8b50` |
| USDC on Base (8453) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC on Ethereum (1) | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| WETH on Ethereum (1) | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| WETH on Base (8453) | `0x4200000000000000000000000000000000000006` |
| Native ETH (all chains) | `0x0000000000000000000000000000000000000000` |
| Permit2 (all chains) | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| Supported Trading API chains | 1, 8453, 42161, 10, 137, 130 |

## Error Handling

| Situation | Action |
|---|---|
| `tempo: command not found` | Reinstall via install script; use full path |
| `access key does not exist` | `tempo wallet logout --yes && tempo wallet login` |
| `ready=false` / no wallet | `tempo wallet login`, then `whoami` |
| HTTP 422 from service | Check service details + llms.txt for exact field names |
| Balance 0 / insufficient | Trigger pay-with-any-token funding flow |
| Service not found | Broaden search query |
| Timeout | Retry with `-m <seconds>` |
| Challenge body is malformed | Report raw body to user; do not proceed |
| Approval transaction fails | Surface error; check gas and allowances |
| Quote API returns 400 | Log request/response; check amount formatting |
| Quote API returns 429 | Wait and retry with exponential backoff |
| Swap data is empty after /swap | Quote expired; re-fetch quote |
| Bridge times out | Check bridge explorer; do not re-submit |
| x402 payment rejected (402) | Check domain name/version, validBefore, nonce freshness |
| `balanceOf` sufficient but payment fails | Apply 2x buffer; top up before retrying |

## External Resources

- [MPP Documentation](https://mpp.dev)
- [MPP Services Catalog](https://mpp.dev/api/services)
- [Tempo Documentation](https://mainnet.docs.tempo.xyz)
- [x402 Specification](https://github.com/coinbase/x402)
- [Tempo Payment SDK](https://www.npmjs.com/package/mppx) (`npm install mppx viem`)
