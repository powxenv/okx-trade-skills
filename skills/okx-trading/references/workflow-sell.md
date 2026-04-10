# Sell Workflow

> Load this file when the user wants to sell, offload, or convert a token to another token (typically a stablecoin or native token).

## Prerequisites

1. Run pre-flight checks (see `_shared/preflight.md`)
2. Ensure wallet is authenticated: `onchainos wallet status`

## Step-by-Step Flow

### Step 1: Identify Holdings

```bash
# Check all token balances
onchainos wallet balance
# Or for a specific address:
onchainos portfolio all-balances --address <addr> --chains <chains>
```

Identify which token(s) the user wants to sell. If the user says "sell my underperforming tokens", use PnL data:

```bash
onchainos market portfolio-recent-pnl --address <addr> --chain <chain>
```

### Step 2: Resolve Token Addresses

For the token to sell (from-token), resolve the contract address:
```bash
onchainos token search --query <symbol> --chains <chain>
```

For the token to receive (to-token), typically a stablecoin or native token. Use addresses from `_shared/native-tokens.md`.

### Step 3: Security Check (Recommended)

Even for selling, check token safety:
```bash
onchainos security token-scan --address <token_address> --chain <chain>
```

- `isHoneyPot = true` → **WARN** user but allow sell (stop-loss scenario)
- High tax rate → warn about sell tax impact

### Step 4: Check Sell Liquidity

```bash
onchainos token liquidity --address <token_address> --chain <chain>
onchainos token price-info --address <token_address> --chain <chain>
```

Low liquidity tokens may have severe price impact on sell. Warn user if:
- Liquidity < $10K: high slippage expected
- Liquidity < $1K: may not be possible to sell meaningfully

### Step 5: Get Swap Quote

```bash
onchainos swap quote \
  --from <sell_token_address> \
  --to <receive_token_address> \
  --readable-amount <human_amount> \
  --chain <chain>
```

Review quote output:
- `toTokenAmount`: expected receive amount
- `priceImpactPercent`: how much the price moves against the trade
- `fromToken.isHoneyPot`: must be `false` for smooth sell
- `fromToken.taxRate`: sell tax impact
- `estimateGasFee`: gas cost

### Step 6: User Confirmation

- Display quote clearly: "Selling X tokens for Y, price impact Z%, gas fee $G"
- If price impact > 5% → warn about slippage
- If price impact > 10% → strongly warn, suggest smaller sell amount or DCA
- For honeypot tokens (can buy but can't sell) → warn but allow attempt (for exit recovery)

### Step 7: Execute Sell

```bash
onchainos swap execute \
  --from <sell_token_address> \
  --to <receive_token_address> \
  --readable-amount <human_amount> \
  --chain <chain> \
  --wallet <wallet_address> \
  [--slippage <pct>] \
  [--gas-level <level>] \
  [--mev-protection]
```

### Step 8: Portfolio Rebalance (Optional)

After selling, suggest:
- Check updated portfolio: `onchainos wallet balance`
- Buy tokens with proceeds (Buy Workflow)
- Deposit into DeFi: `onchainos defi invest` (see `references/workflow-defi-yield.md`)

## Sell Underperforming Tokens (Batch Workflow)

1. Get all holdings: `onchainos portfolio all-balances --address <addr> --chains <chains>`
2. Get PnL data: `onchainos market portfolio-recent-pnl --address <addr> --chain <chain>`
3. Filter tokens with negative PnL
4. For each, get price change: `onchainos token price-info --address <addr> --chain <chain>`
5. Present options to user, let them choose which to sell
6. Execute sells one at a time with user confirmation

## Amount Conversion

The CLI `--readable-amount` parameter accepts human-readable amounts (e.g., `"1.5"`, `"100"`). The CLI converts to minimal units automatically.

For portfolio commands that return `balance` in UI units, pass directly to `--readable-amount`.

**NEVER** compute minimal units manually unless using the raw `--amount` flag.