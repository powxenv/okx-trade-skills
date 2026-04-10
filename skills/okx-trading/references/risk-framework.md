# Trading Risk Framework

> Load this file when evaluating token risk, swap risk, or making buy/sell decisions.

## Pre-Trade Risk Assessment Checklist

Before executing any trade, assess these risk factors in order:

### 1. Token Safety (MANDATORY — run before every swap)

```bash
onchainos security token-scan --address <token_address> --chain <chain>
```

| Risk Factor | Check | Action |
|---|---|---|
| Honeypot | `isHoneyPot = true` | **BLOCK** on buy. Allow sell (stop-loss exit) |
| High tax rate | `taxRate > 10%` | WARN — display exact rate |
| Unverified token | `communityRecognized = false` | WARN — suggest manual verification |
| Low liquidity | `< $10K` | WARN — high slippage risk |
| Very low liquidity | `< $1K` | **strongly WARN** — may result in significant loss |
| New token | `< 24h` | WARN — extra caution |

### 2. Swap Risk Controls

From quote results (`onchainos swap quote`):

| Risk Item | Buy | Sell | Notes |
|---|---|---|---|
| Honeypot (`isHoneyPot=true`) | BLOCK | WARN (allow exit) | Selling allowed for stop-loss |
| High tax rate (>10%) | WARN | WARN | Display exact tax rate |
| No quote available | CANNOT | CANNOT | Token may be unlisted or zero liquidity |
| Black/flagged address | BLOCK | BLOCK | Address flagged by security services |
| New token (<24h) | WARN | PROCEED | Extra caution on buy side |
| Insufficient liquidity | CANNOT | CANNOT | Cannot execute trade |
| Price impact > 5% | WARN | WARN | Prompt user confirmation |
| Price impact > 10% | **BLOCK** | WARN | Blocked by swap execute internally |

**Legend**: BLOCK = halt, require explicit override · WARN = display warning, ask confirmation · CANNOT = operation impossible · PROCEED = allow with info

### 3. MEV Protection Decision Tree

Enable MEV protection when EITHER condition is met:
- **Potential Loss** = `toTokenAmount × toTokenPrice × slippage` ≥ $50
- **Transaction Amount** = `fromTokenAmount × fromTokenPrice` ≥ chain threshold

If `toTokenPrice` or `fromTokenPrice` unavailable/0 → enable by default.

| Chain | MEV Protection | Threshold | How to enable |
|---|---|---|---|
| Ethereum | Yes | $2,000 | `--mev-protection` on `swap execute` |
| Solana | Yes | $1,000 | `--tips <sol_amount>` (0.0000000001–2 SOL) |
| BSC | Yes | $200 | `--mev-protection` |
| Base | Yes | $200 | `--mev-protection` |
| Others | No | — | — |

### 4. Trading Parameter Presets

| Preset | Scenario | Slippage | Gas Level |
|---|---|---|---|
| Meme/Low-cap | Meme coins, new tokens, low liquidity | autoSlippage (5–20%) | `fast` |
| Mainstream | BTC/ETH/SOL/major tokens | autoSlippage (0.5–1%) | `average` |
| Stablecoin | USDC/USDT/DAI pairs | autoSlippage (0.1–0.3%) | `average` |
| Large Trade | priceImpact ≥ 10% AND value ≥ $1,000 AND liquidity ≥ $10,000 | autoSlippage | `average` |

### 5. Security Scan Fail-Safe Principle

- **Scan completed, risk detected**: Follow the Risk Action Priority Rule above
- **Scan failed (infrastructure error)**: Ask user whether to retry or proceed without scan. Never treat a failed scan as a "pass"

## Post-Trade Verification

After a swap executes successfully:

1. Verify the transaction on-chain with `onchainos wallet history --tx-hash <txHash> --chain <chainId>`
2. Check the new token balance with `onchainos wallet balance --chain <chainId> --token-address <addr>`
3. Verify the received amount matches the quote's `toTokenAmount` (within slippage tolerance)

## Regional Restrictions

When a command fails with error code `50125` or `80001`:
> Service is not available in your region. Please switch to a supported region and try again.

Do NOT expose raw error codes or internal error messages.

## Confirmation Freshness

In interactive mode, if >10 seconds elapse between quote and execution:
1. Re-fetch the quote with `onchainos swap quote`
2. Compare price difference against slippage (or autoSlippage value)
3. If price diff ≥ slippage → warn user and ask for re-confirmation
4. If price diff < slippage → proceed silently