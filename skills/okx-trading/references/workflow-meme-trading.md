# Meme Token Trading Workflow

> Load this file when the user wants to trade meme/pump.fun tokens, scan for new launches, or do trenches-style research.

## Discovery Phase

### Browse New Meme Tokens

```bash
# Check which chains/protocols are supported
onchainos memepump chains

# Browse new launches (default stage: NEW)
onchainos memepump tokens --chain solana
# Filter by stage: NEW, MIGRATING, MIGRATED
onchainos memepump tokens --chain solana --stage MIGRATING
# Filter by protocol
onchainos memepump tokens --chain solana --protocol-id-list 120596
```

Protocol ID reference (from `memepump chains`):
- PumpFun (Solana): `120596`
- FourMeme (BSC): `135086`
- Other protocols vary — always check `memepump chains` for current list

### Spot Hot Tokens

```bash
# Trending tokens
onchainos token hot-tokens --chain solana --ranking-type 4
# X-mentioned tokens
onchainos token hot-tokens --chain solana --ranking-type 5
```

### Follow Smart Money

```bash
# Smart money buy signals
onchainos signal list --chain solana --wallet-type 1
# Whale signals
onchainos signal list --chain solana --wallet-type 3
# KOL signals
onchainos signal list --chain solana --wallet-type 2
```

## Deep Research Phase

Before buying any meme token, run these checks:

### 1. Token Details

```bash
onchainos memepump token-details --address <addr>
```
Check: market cap, volume, bonding curve progress, creation time.

### 2. Developer Reputation (CRITICAL)

```bash
onchainos memepump token-dev-info --address <addr>
```
Red flags:
- `rugPullTokenCount > 0` → developer has rug-pulled before
- High dev holding percentage → developer controls too much supply

### 3. Bundle/Sniper Detection (CRITICAL)

```bash
onchainos memepump token-bundle-info --address <addr>
```
Red flags:
- High bundle count → coordinated buying
- Sniper activity → bots bought before public launch

### 4. Security Scan

```bash
onchainos security token-scan --address <addr> --chain <chain>
```
This is MANDATORY — never skip for meme tokens.

### 5. Holder Distribution

```bash
onchainos token holders --address <addr> --chain <chain>
onchainos token cluster-overview --address <addr> --chain <chain>
```
Red flags:
- Top 10 holders > 50% → high centralization risk
- High new wallet percentage → likely Sybil attack

### 6. Co-investor Analysis

```bash
onchainos memepump aped-wallet --address <addr>
```
Check who else bought — are they known wallets or new/empty wallets?

## Execution Phase

### Buy Decision Checklist

Before executing, verify ALL of the following:

| Check | Source | Pass/Fail Criteria |
|---|---|---|
| Honeypot scan | `security token-scan` | `isHoneyPot = false` |
| Dev reputation | `memepump token-dev-info` | `rugPullTokenCount = 0`, low dev holding % |
| Bundle/sniper | `memepump token-bundle-info` | Low bundle count, minimal sniper activity |
| Holder concentration | `token cluster-overview` | Top 10 holding < 30% ideal, < 50% acceptable |
| Liquidity | `token liquidity` | > $10K minimum, > $100K preferred |
| Security risk level | `security token-scan` | No `block` action |

If ANY check fails with a `block`-level risk → **DO NOT BUY**.

### Buy Execution

For meme tokens, use the **Meme/Low-cap** preset:
- Slippage: autoSlippage (5–20% expected)
- Gas level: `fast`

```bash
onchainos swap execute \
  --from <native_token_address> \
  --to <meme_token_address> \
  --readable-amount <amount> \
  --chain <chain> \
  --wallet <wallet_addr> \
  --gas-level fast
```

**Always enable MEV protection** for meme token trades (they are volatile and front-running is common):
- EVM: add `--mev-protection`
- Solana: add `--tips 0.001`

### Post-Buy Monitoring

After buying a meme token:

```bash
# Watch for price changes
onchainos market kline --address <addr> --chain <chain>

# Monitor holder changes
onchainos token holders --address <addr> --chain <chain>

# Check bundle activity (watch for new bundles indicating dumps)
onchainos memepump token-bundle-info --address <addr>
```

For real-time monitoring, use WebSocket:
```bash
onchainos ws start --channel price --token-pair <chainIndex>:<address>
onchainos ws start --channel trades --token-pair <chainIndex>:<address>
```

### Sell / Exit Strategy

When deciding to sell:
```bash
# Current price check
onchainos token price-info --address <addr> --chain <chain>

# Check for sell restrictions (tax, honeypot)
onchainos security token-scan --address <addr> --chain <chain>

# Get swap quote
onchainos swap quote --from <meme_addr> --to <native_addr> --readable-amount <amount> --chain <chain>
```

⚠️ If `isHoneyPot = true` on sell side: this means the token is likely a honeypot and selling may fail or result in significant tax loss. Warn user clearly.

## Quick Triage for Meme Tokens

For a rapid go/no-go decision:

```bash
# 3-command quick check:
onchainos security token-scan --address <addr> --chain <chain>
onchainos token liquidity --address <addr> --chain <chain>
onchainos memepump token-dev-info --address <addr>
```

- PASS all 3 → proceed to detailed research
- FAIL any → explain risk to user, recommend caution