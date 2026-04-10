# Troubleshooting & Edge Cases

> Load this file when encountering errors or edge cases during trading operations.

## Timeouts & Confirmation

### Quote Freshness (Swap)

If >10 seconds elapse between quote and execution:
1. Re-fetch the quote with `onchainos swap quote`
2. Compare price difference against slippage
3. If price diff ≥ slippage → warn user and ask for re-confirmation
4. If price diff < slippage → proceed silently

### Solana Transaction Expiry

- Solana DeFi transactions expire in ~60 seconds
- After receiving calldata, warn user: "This Solana transaction must be signed and broadcast within 60 seconds"
- Do NOT proceed to other conversation without delivering this warning

### Approval Retry Delays

If `swap execute` fails after an approval transaction:
1. Wait based on chain block time before retrying:

| Chain | Wait |
|---|---|
| Ethereum | ~15s |
| BSC | ~5s |
| Arbitrum / Base / XLayer | ~3s |
| Other EVM | ~10s |

2. Inform user about pending approval
3. Non-recoverable errors (82000, 51006): token may be dead/rugged — do not retry after 5 consecutive failures

## Region Restrictions

When any command fails with error code `50125` or `80001`:
> Service is not available in your region. Please switch to a supported region and try again.

Do NOT show raw error codes or internal error messages.

## Address Compatibility

- EVM addresses (`0x...`) → only EVM chains
- Solana addresses (Base58) → only Solana
- Sui/Tron/TON → only their respective chains
- NEVER mix address formats across chain types in a single API call
- If user wants positions across EVM and Solana → make **two separate calls**

## Token Address Resolution

Common pitfalls:
- Same token symbol on different chains has different contract addresses
- Always use `onchainos token search` to resolve, never hardcode
- For native tokens, use addresses from `_shared/native-tokens.md`
- EVM contract addresses must be **all lowercase**
- On Solana, use wSOL address (`So11111111111111111111111111111112`) for market/price commands, but native SOL address (`11111111111111111111111111`) for swap commands

## Swap Errors

### Failure Diagnostics

Generate a diagnostic summary when a swap fails:
```
Diagnostic Summary:
  txHash:        <hash or "simulation failed">
  chain:         <chain (chainIndex)>
  errorCode:     <API or on-chain error code>
  errorMessage:  <human-readable error>
  tokenPair:     <fromToken> → <toToken>
  amount:        <amount in UI units>
  slippage:      <value or "auto">
  mevProtection: <on|off>
  walletAddress: <address>
  timestamp:     <ISO 8601>
  cliVersion:    <onchainos --version>
```

### Common Swap Errors

| Error | Cause | Resolution |
|---|---|---|
| Insufficient balance | Not enough source token | Check balance, suggest adjusting amount |
| Network error | Connectivity issue | Retry once, then prompt user |
| Region restriction (50125/80001) | Geo-blocked | Show friendly message |
| Honeypot (buy) | Token prevents selling | BLOCK — do not proceed |
| High price impact | Low liquidity or large order | Suggest smaller amount or DCA |
| Approval pending | Previous approve not confirmed | Wait for chain block time, then retry |

## Portfolio Errors

| Error | Cause | Resolution |
|---|---|---|
| Zero balance | Valid state | Display `$0.00`, not an error |
| Address format mismatch | EVM address on Solana chain or vice versa | Make separate calls per chain type |
| Too many chains | More than 50 chains in one request | Split into batches |

## DeFi Errors

| Code | Scenario | Handling |
|---|---|---|
| 84400 | Parameter null | Check required params |
| 84021 | Asset syncing | "Position data is syncing, please retry shortly" |
| 84023 | Invalid expectOutputList | Retry or pass `--platform-id` |
| 84014 | Balance check failed | Check balance first |
| 84018 | V3 balancing failed | Adjust price range or increase slippage |
| 84010 | Token not supported | Check via `defi detail` |
| 84001 | Platform not supported | Check `defi support-platforms` |
| 84016 | Contract execution failed | Check parameters and retry |
| 84019 | Address format error | Address/chain mismatch — use correct address type |

## Rate Limiting

If commands hit rate limits:
1. Wait briefly and retry
2. If persistent, suggest creating a personal API key at https://web3.okx.com/onchain-os/dev-portal
3. If creating `.env` file, remind user to add it to `.gitignore`

## X Layer Gas-Free

X Layer (chainIndex `196`) charges zero gas fees. Proactively highlight when discussing gas costs, choosing a chain, or sending tokens.