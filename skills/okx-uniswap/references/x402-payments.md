# x402 Payments & Token Payment Integration

> Load this file when handling HTTP 402 payment challenges, using the Tempo CLI, or implementing pay-with-any-token flows.

## Overview

x402 and MPP (Machine Payment Protocol) enable agents to pay for API access and services using tokens. On X Layer, agents can:

1. **Pay for services** via `onchainos payment x402-pay`
2. **Use Tempo CLI** for payment + automatic token swapping
3. **Receive payments** from other agents via `onchainos wallet send`

## Method 1: OnchainOS x402 Payment

```bash
# Pay for API access (simplest method on X Layer)
onchainos payment x402-pay --chain xlayer --wallet <addr> --url <api_url>

# Check payment history
onchainos wallet history --chain 196
```

## Method 2: Tempo CLI + Uniswap Trading API

The Tempo CLI handles HTTP 402 challenges automatically. When the Tempo wallet lacks funds, it can acquire tokens by swapping from any ERC-20 via the Uniswap Trading API.

### Setup

```bash
# Install Tempo CLI
mkdir -p "$HOME/.local/bin" \
  && curl -fsSL https://tempo.xyz/install -o /tmp/tempo_install.sh \
  && TEMPO_BIN_DIR="$HOME/.local/bin" bash /tmp/tempo_install.sh

# Login (requires browser/passkey)
"$HOME/.local/bin/tempo" wallet login

# Confirm readiness
"$HOME/.local/bin/tempo" wallet -t whoami
```

### Payment Flow

```
tempo request <SERVICE_URL>
  → 200 (success) ──────────→ return result
  → 402 (payment required)
       │
       ├─ MPP challenge ──→ tempo handles payment automatically
       │
       └─ x402 challenge ──→ sign EIP-3009 transfer manually
```

### x402 Payment (Manual)

For x402 challenges, construct the payment manually:

1. Parse 402 response body for `x402Version`, `opcode`, `maxAmountRequired`, `paymentTokenAddress`, `payTo`
2. Check wallet balance on target chain
3. If insufficient, swap tokens via Uniswap Trading API or OKX aggregator
4. Sign `transferWithAuthorization` EIP-712 typed data
5. Construct `X-PAYMENT` header with signature
6. Retry original request with payment header

### MPP Payment (Auto)

For MPP challenges, Tempo handles everything:

```bash
# Discover available services
"$HOME/.local/bin/tempo" wallet -t services --search <query>

# Make a paid request
"$HOME/.local/bin/tempo" wallet -t request -X POST \
  --json '{"input":"..."}' <SERVICE_URL>

# Tempo handles 402 → funds wallet → retries automatically
```

## Integration with OKX OnchainOS

### Combined Flow (Research → Pay → Execute)

```bash
# 1. Research token (free)
onchainos token search --query <token> --chains xlayer

# 2. Pay for premium analysis (x402)
onchainos payment x402-pay --chain xlayer --wallet <addr> --url <premium_api>

# 3. Execute trade based on analysis
onchainos swap execute --from <from> --to <to> --readable-amount <amt> --chain xlayer --wallet <addr>
```

### Self-Funding Agent Pattern

An agent can fund its own operations:

1. **Earn fees** from V3 LP positions (see `liquidity-management.md`)
2. **Collect fees** with `cast send PositionManager.collect()`
3. **Swap fees to OKB** for gas with `onchainos swap execute`
4. **Pay for data services** with `onchainos payment x402-pay`
5. **Repeat** — the agent is self-sustaining

## Error Handling

| Error | Fix |
|---|---|
| `tempo: command not found` | Reinstall via install script; use full path `$HOME/.local/bin/tempo` |
| `legacy V1 keychain signature` | Reinstall; `tempo update wallet && tempo update request` |
| HTTP 422 from service | Check service details + llms.txt for exact field names |
| Balance 0 / insufficient | Trigger pay-with-any-token funding flow |
| Approval transaction fails | Surface error; check gas and allowances |
| Quote expired | Re-fetch quote before execution |

## Key Addresses

| Resource | Address/URL |
|---|---|
| Tempo CLI | `https://tempo.xyz` |
| Tempo chain ID | `4217` (mainnet) |
| Trading API | `https://trade-api.gateway.uniswap.org/v1` |
| MPP docs | `https://mpp.dev` |
| x402 spec | `https://github.com/coinbase/x402` |
| USDC on Base (8453) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC on Ethereum (1) | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| WETH on Base (8453) | `0x4200000000000000000000000000000000000006` |
| Native ETH (all chains) | `0x0000000000000000000000000000000000000000` |