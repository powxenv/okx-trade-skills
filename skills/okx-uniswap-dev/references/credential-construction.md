# Credential Construction

MPP and x402 credential building, signing, and submission flows.

## MPP Credential

### Automatic Mode (mppx SDK)

```bash
npm install mppx viem
```

Polyfills `fetch` to intercept 402 responses automatically:

```typescript
import { Mppx, tempo } from 'mppx/client';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

Mppx.create({ methods: [tempo.charge({ account })] });
const response = await fetch(process.env.RESOURCE_URL!);
// response is the 200 -- credential was built and submitted automatically
```

Pass `autoSwap: true` to let mppx swap from available stablecoins automatically:

```typescript
Mppx.create({ methods: [tempo.charge({ account, autoSwap: true })] });
```

### Manual Mode

**REQUIRED:** Use `AskUserQuestion` before calling `createCredential`. Show the payment details (amount, token, recipient, resource URL) and wait for explicit confirmation.

```typescript
import { Mppx, tempo } from 'mppx/client';
import { Receipt } from 'mppx';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const mppx = Mppx.create({ polyfill: false, methods: [tempo.charge({ account })] });

// Step 1: probe for 402 challenge
const initial = await fetch(process.env.RESOURCE_URL!);
if (initial.status !== 402) throw new Error(`Expected 402, got ${initial.status}`);

// Step 2: REQUIRED -- show payment summary to user and wait for confirmation

// Step 3: build and submit the credential
const credential = await mppx.createCredential(initial, { account });
const paidResponse = await fetch(process.env.RESOURCE_URL!, {
  headers: { Authorization: credential },
});

if (paidResponse.status !== 200) {
  const body = await paidResponse.text();
  throw new Error(`Payment rejected (${paidResponse.status}): ${body}`);
}

// Step 4: parse the receipt
const receipt = Receipt.fromResponse(paidResponse);
console.log('Payment confirmed. Reference:', receipt.reference);
```

### Session Intent

```typescript
// maxDeposit: '10' locks up to 10 pathUSD into channel escrow
const mppx = Mppx.create({ methods: [tempo({ account, maxDeposit: '10' })] });
const response = await mppx.fetch(process.env.RESOURCE_URL!);
```

## x402 Payment

The x402 `"exact"` scheme uses EIP-3009 (`transferWithAuthorization`) for one-time token transfers signed off-chain.

### Prerequisite Checks

```bash
# 1. Confirm scheme is "exact"
[ "$X402_SCHEME" = "exact" ] || { echo "ERROR: Only 'exact' scheme supported"; exit 1; }

# 2. Map network to chain ID
case "$X402_NETWORK" in
  base|"eip155:8453")    X402_CHAIN_ID=8453; SOURCE_RPC_URL="https://mainnet.base.org" ;;
  ethereum|"eip155:1")   X402_CHAIN_ID=1;    SOURCE_RPC_URL="https://eth.llamarpc.com" ;;
  tempo|"eip155:4217")   X402_CHAIN_ID=4217; SOURCE_RPC_URL="https://rpc.presto.tempo.xyz" ;;
  *) echo "ERROR: Unsupported network: $X402_NETWORK"; exit 1 ;;
esac

# 3. Check wallet balance >= X402_AMOUNT
ASSET_BALANCE=$(cast call "$X402_ASSET" "balanceOf(address)(uint256)" "$WALLET_ADDRESS" --rpc-url "$SOURCE_RPC_URL")
```

**REQUIRED:** Use `AskUserQuestion` to show payment summary (token, amount, recipient, resource) before signing.

### Generate Nonce and Deadline

```bash
X402_NONCE="0x$(openssl rand -hex 32)"
X402_VALID_AFTER=0
X402_VALID_BEFORE=$(( $(date +%s) + X402_TIMEOUT ))
```

### Sign EIP-3009 TransferWithAuthorization

```typescript
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const domain = {
  name: process.env.X402_TOKEN_NAME!,       // from extra.name, e.g. "USDC"
  version: process.env.X402_TOKEN_VERSION!, // from extra.version, e.g. "2"
  chainId: Number(process.env.X402_CHAIN_ID),
  verifyingContract: process.env.X402_ASSET as `0x${string}`,  // The TOKEN contract, not a verifier
};

const signature = await account.signTypedData({
  domain,
  types: {
    TransferWithAuthorization: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
    ],
  },
  primaryType: 'TransferWithAuthorization',
  message: {
    from: process.env.WALLET_ADDRESS as `0x${string}`,
    to: process.env.X402_PAY_TO as `0x${string}`,
    value: BigInt(process.env.X402_AMOUNT!),
    validAfter: BigInt(process.env.X402_VALID_AFTER!),
    validBefore: BigInt(process.env.X402_VALID_BEFORE!),
    nonce: process.env.X402_NONCE as `0x${string}`,
  },
});
```

**Domain warning:** The `verifyingContract` is the **token contract** (`X402_ASSET`), not a separate verifier. Use `name` and `version` from `extra` -- do not assume USDC defaults.

### Construct X-PAYMENT Payload

```bash
X402_PAYMENT_JSON=$(jq -n \
  --arg scheme "$X402_SCHEME" \
  --arg network "$X402_NETWORK" \
  --argjson chainId "$X402_CHAIN_ID" \
  --arg from "$WALLET_ADDRESS" \
  --arg to "$X402_PAY_TO" \
  --arg value "$X402_AMOUNT" \
  --argjson validAfter "$X402_VALID_AFTER" \
  --argjson validBefore "$X402_VALID_BEFORE" \
  --arg nonce "$X402_NONCE" \
  --arg sig "$X402_SIGNATURE" \
  --arg asset "$X402_ASSET" \
  '{
    scheme, network, chainId, asset,
    payload: {
      authorization: { from, to, value, validAfter, validBefore, nonce },
      signature: $sig
    }
  }')

X402_PAYMENT=$(echo "$X402_PAYMENT_JSON" | base64 | tr -d '[:space:]')
```

### Retry with X-PAYMENT Header

```bash
RETRY_RESPONSE=$(curl -si "$X402_RESOURCE" \
  -H "X-PAYMENT: $X402_PAYMENT" \
  -H "Content-Type: application/json")
```

| Status | Meaning | Action |
|---|---|---|
| 200 | Payment accepted | Decode receipt with `echo "$X402_PAYMENT_RESPONSE" \| base64 --decode \| jq .` |
| 402 | Payment rejected | Check domain name/version, validBefore, nonce freshness |
| 400 | Malformed payload | Verify JSON structure and base64 encoding |
| Other | Server error | Report raw body; do not resubmit |

### x402 Field Notes

| Field | Notes |
|---|---|
| `value` in payload | Must be a string (not JSON number) for uint256 |
| Domain name/version | Must match the token contract exactly |
| `validBefore` | Must be in the future |
| Nonce | Must be fresh and unique (32-byte random) |
