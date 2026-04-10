# Buy Workflow

> Load this file when the user wants to buy, purchase, or acquire a token.

## Prerequisites

1. Run pre-flight checks (see `_shared/preflight.md`)
2. Ensure wallet is authenticated: `onchainos wallet status`
3. If not logged in, follow the authentication flow (see `references/authentication.md`)

## Step-by-Step Flow

### Step 1: Resolve Token Address

Never guess or hardcode token CAs — same symbol has different addresses per chain.

Acceptable sources (in priority order):
1. User provides full contract address directly
2. CLI token map shortcuts: `sol`, `eth`, `bnb`, `usdc`, `usdt`, etc.
3. User provides a token name/symbol → search:
   ```bash
   onchainos token search --query <symbol> --chains <chain>
   ```
4. Multiple results → show name/symbol/CA/chain, ask user to confirm

For native tokens, use addresses from `_shared/native-tokens.md`.

### Step 2: Security Scan (MANDATORY)

Before spending any funds, run a security scan:
```bash
onchainos security token-scan --address <token_address> --chain <chain>
```

Also run for DApp URLs if the token is from an unfamiliar source:
```bash
onchainos security dapp-scan --domain <domain>
```

**Risk Actions**:
- `action: "block"` → Do NOT proceed. Inform user the token is unsafe.
- `action: "warn"` → Show risk details, ask for explicit user confirmation.
- Empty/null → Safe to proceed.

### Step 3: Research & Due Diligence (Optional but Recommended)

```bash
# Current price and market data
onchainos token price-info --address <token_address> --chain <chain>

# Holder distribution and concentration
onchainos token holders --address <token_address> --chain <chain>

# Advanced risk info (dev stats, bundle detection, rug pull data)
onchainos token advanced-info --address <token_address> --chain <chain>

# Liquidity pool depth
onchainos token liquidity --address <token_address> --chain <chain>

# Smart money signals (is smart money buying?)
onchainos signal list --chain <chain> --token-address <token_address>
```

For meme tokens specifically, also run:
```bash
onchainos memepump token-details --address <token_address>
onchainos memepump token-dev-info --address <token_address>
onchainos memepump token-bundle-info --address <token_address>
```

### Step 4: Check Wallet Balance

```bash
onchainos wallet balance --chain <chainId>
# Or for a specific address:
onchainos portfolio all-balances --address <addr> --chains <chain>
```

Verify sufficient balance of the source token. If insufficient, warn user and stop.

### Step 5: Get Swap Quote

```bash
onchainos swap quote \
  --from <source_token_address> \
  --to <target_token_address> \
  --readable-amount <human_amount> \
  --chain <chain>
```

Display to user:
- Expected output amount
- Gas fee estimate
- Price impact percentage
- Routing path (DEXes used)
- `isHoneyPot` and `taxRate` flags
- MEV protection recommendation (see `references/risk-framework.md`)

### Step 6: User Confirmation

- If price impact > 5% → warn prominently
- If `isHoneyPot` on buy side → **BLOCK**, do not proceed
- If > 10 seconds since quote → re-fetch quote before proceeding

### Step 7: Execute Swap

```bash
onchainos swap execute \
  --from <source_token_address> \
  --to <target_token_address> \
  --readable-amount <human_amount> \
  --chain <chain> \
  --wallet <wallet_address> \
  [--slippage <pct>] \
  [--gas-level <level>] \
  [--mev-protection] \
  [--tips <sol_amount>]
```

MEVProtection:
- EVM (ETH/BSC/Base): add `--mev-protection`
- Solana: add `--tips 0.001` (adjust based on priority)

### Step 8: Post-Trade Verification

1. Display the `swapTxHash` to the user
2. Suggest checking explorer link for confirmation
3. Optionally check new token balance via `onchainos wallet balance`

## Error Recovery

| Error | Action |
|---|---|
| Insufficient balance | Show current balance, suggest adjusting amount |
| Network error | Retry once, then show diagnostic |
| Region restriction (50125/80001) | Show friendly region message |
| Approval pending retry | Wait based on chain block time (ETH: 15s, BSC: 5s, Arb/Base/XLayer: 3s), then retry |
| Non-recoverable (82000, 51006) | Token may be dead/rugged — do not retry after 5 consecutive failures |
| Confirmation timeout | Re-fetch quote, compare price, ask user |