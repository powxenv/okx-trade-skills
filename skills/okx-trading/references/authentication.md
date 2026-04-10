# Authentication & Wallet Reference

> Load this file when the user needs wallet authentication or address management.

## Authentication Flow

### Check Login Status

```bash
onchainos wallet status
```

### Email Login

1. Ask user for email
2. Run login:
   ```bash
   onchainos wallet login <email> --locale <locale>
   ```
   Locale: `zh-CN` for Chinese, `ja-JP` for Japanese, `en-US` for English (default)

3. Ask for verification code, then verify:
   ```bash
   onchainos wallet verify <code>
   ```

4. If `isNew: true`, display new user guidance (see below)

### API Key Login (Alternative)

1. If user prefers API key, direct to: https://web3.okx.com/onchainos/dev-docs/home/api-access-and-usage
2. After setup, run:
   ```bash
   onchainos wallet login
   ```
   The CLI reads `OKX_API_KEY` from environment.

### Address Resolution

After authentication, resolve the correct address for a target chain:

```bash
onchainos wallet addresses
```

Then match:
- EVM chains (Ethereum, BSC, Polygon, etc.) → use EVM address
- Solana → use Solana address
- X Layer → use XLayer address

## Address Display Format

- EVM: `0x1234...abcd (Supports X Layer, Ethereum, Polygon and N EVM chains)`
- Solana: `5xYZ...`
- Never enumerate every EVM chain individually

## Wallet Commands

| # | Command | Description | Auth |
|---|---|---|---|
| A1 | `onchainos wallet login <email> --locale <locale>` | Login with email | No |
| A2 | `onchainos wallet verify <code>` | Verify OTP/email code | No |
| A3 | `onchainos wallet add` | Add a new wallet account | Yes |
| A4 | `onchainos wallet switch <account_id>` | Switch active account | No |
| A5 | `onchainos wallet status` | Show login status and policy | No |
| A6 | `onchainos wallet logout` | Logout and clear credentials | No |
| A7 | `onchainos wallet addresses [--chain <chainId>]` | Show addresses by chain | No |

## Balance Commands

| # | Command | Description | Auth |
|---|---|---|---|
| B1 | `onchainos wallet balance` | Current account overview | Yes |
| B2 | `onchainos wallet balance --chain <chainId>` | Balance on specific chain | Yes |
| B3 | `onchainos wallet balance --chain <chainId> --token-address <addr>` | Specific token balance | Yes |
| B4 | `onchainos wallet balance --all` | All accounts batch | Yes |
| B5 | `onchainos wallet balance --force` | Force refresh (bypass cache) | Yes |

## Transaction Commands

| # | Command | Description | Auth |
|---|---|---|---|
| D1 | `onchainos wallet send --readable-amount <amt> --receipt <addr> --chain <id>` | Send tokens | Yes |
| D2 | `onchainos wallet contract-call --to <addr> --chain <id> --input-data <hex>` | Smart contract call | Yes |

**IMPORTANT**: `wallet send` uses `--readable-amount` (human-readable like "1.5"). `wallet contract-call` uses `--amt` in minimal units (default "0").

## Confirming Response

Some commands return exit code 2 with `confirming: true`. Display the `message` to the user, ask for confirmation, and re-run with `--force` if confirmed. **NEVER pass `--force` on the first invocation.**

## New User Guidance

When `wallet verify` or `wallet login` returns `"isNew": true`:

> Welcome! You can configure spending limits and transfer whitelist in Policy Settings → https://web3.okx.com/portfolio/agentic-wallet-policy

## Wallet Export

Users can export wallets only via the Web portal. Never display mnemonic phrases or private keys in conversation. Direct to: https://web3.okx.com

## Security

- TEE signing: private key never leaves the secure enclave
- Sensitive fields never to expose: `accessToken`, `refreshToken`, `apiKey`, `secretKey`, `passphrase`, `sessionKey`, `sessionCert`, `teeId`, `encryptedSessionSk`, `signingKey`
- Chain parameter for wallet commands requires **numeric chain ID** (e.g., `1`, `501`, `196`)