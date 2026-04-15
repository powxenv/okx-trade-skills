# Sniper & Bundler Detection

> Load this file when checking a meme token for sniper bot activity and bundled launches, which indicate coordinated manipulation.

## Overview

Sniper bots and bundled wallets are the most common form of meme token manipulation. A "sniper" is an automated bot that buys tokens within milliseconds of launch, gaining an unfair price advantage. A "bundle" is a group of wallets that buy tokens simultaneously in a coordinated fashion, often controlled by a single entity. Both patterns indicate that the token launch is not organic and that retail buyers will be at a disadvantage.

## Commands

```bash
# Primary: Get bundle/sniper data for a specific token
onchainos memepump token-bundle-info --address <token_address>

# Supplementary: Check co-investor wallets for coordinated patterns
onchainos memepump aped-wallet --address <token_address>

# Supplementary: Holder analysis for concentration patterns
onchainos token holders --address <token_address> --chain <chain>
onchainos token cluster-overview --address <token_address> --chain <chain>
```

## Data Points to Extract

### From `memepump token-bundle-info`

| Field | What It Means | Risk Implication |
|---|---|---|
| `bundleCount` | Number of detected bundle groups | Higher = more coordinated manipulation |
| `sniperCount` | Number of wallets that bought within seconds of launch | High count = launch was targeted by bots |
| `sniperHoldingPercentage` | % of total supply held by identified snipers | > 20% = snipers control significant supply |
| `bundleDetails` | Individual bundle group details | Shows coordination patterns |
| `bundleHoldingPercentage` | % of total supply held by bundled wallets | > 30% = severe manipulation risk |
| `timeToFirstSnipe` | Milliseconds between launch and first bot buy | < 1000ms = pre-configured sniper |
| `uniqueBundleCreators` | Number of distinct entities behind bundles | 1 creator, many wallets = single manipulator |

### From `memepump aped-wallet`

| Field | What It Means | Risk Implication |
|---|---|---|
| Wallet list | Other wallets that bought the same token | Check for patterns among co-investors |
| Buy timing | When co-investors bought | Clustered timing = coordinated |
| Wallet age | How old each co-investor wallet is | New wallets = likely created for this launch |

### From `token holders` and `cluster-overview`

| Field | What It Means | Risk Implication |
|---|---|---|
| Holder concentration | How supply is distributed | High concentration in few wallets = manipulation |
| Cluster groups | Wallets that behave similarly | Large clusters = coordinated buying |
| New wallet percentage | % of holders that are recently created | > 50% new wallets = Sybil attack pattern |

## What Bundler Patterns Look Like

### Pattern 1: The Developer Bundle

```
Characteristics:
- 5-20 wallets buy within the same block or consecutive blocks
- All wallets received SOL/ETH from the same source wallet
- All wallets buy similar amounts (within 2x of each other)
- Wallets have no prior transaction history (newly created)
- Total bundle holds 20-50% of supply

Meaning:
The developer created multiple wallets to buy their own token at launch,
creating artificial demand and holding a large portion of supply for later dumping.

Severity: CRITICAL — Avoid this token entirely.
```

### Pattern 2: The Sniper Pack

```
Characteristics:
- 3-10 wallets buy within 1-5 seconds of launch
- These are likely professional sniper bots (not dev-controlled)
- They typically buy 1-5 SOL worth each
- They will sell within minutes to hours for quick profit
- `timeToFirstSnipe` < 500ms (pre-configured bot)

Meaning:
Professional bot operators detected the launch and auto-bought. Their selling
pressure will push the price down quickly. Retail buyers who buy after the
snipers are buying at an inflated price.

Severity: HIGH — Wait for snipers to sell before considering entry.
If sniperHoldingPercentage > 30%, avoid entirely.
```

### Pattern 3: The Jito Bundle (Solana-specific)

```
Characteristics:
- All bundle wallets bought in the exact same block
- Transactions were submitted through Jito (Solana MEV infrastructure)
- One tip transaction paid to Jito validators
- All buy transactions are atomic (all succeed or all fail)

Meaning:
The bundle was submitted as a single atomic transaction bundle through
Jito's infrastructure. This is the most sophisticated form of bundling
and is almost always malicious.

Severity: CRITICAL — This is definitive proof of coordinated manipulation.
```

### Pattern 4: The Insider Bundle

```
Characteristics:
- Bundle wallets bought in the FIRST block (block 0 or 1)
- Some wallets received funding BEFORE the token launch transaction
- Token launch and bundle buys may be in the same transaction
- These wallets have disproportionately large holdings

Meaning:
The developer or insiders had pre-arranged access to buy before the
token was publicly visible. This is essentially a pre-mine disguised
as a fair launch.

Severity: CRITICAL — The launch was not fair. Avoid.
```

### Pattern 5: The Wash Trading Bundle

```
Characteristics:
- Multiple wallets buying and selling between each other
- Circular trading patterns (A→B→C→A)
- Volume is artificially inflated
- No real external buying pressure

Meaning:
The bundle exists to create fake volume and attract real buyers
through the appearance of organic demand.

Severity: HIGH — Artificial volume. Real price discovery is impossible.
```

## Assessing Severity

### Severity Levels

| Severity | Criteria | Action |
|---|---|---|
| **CLEAN** | Bundle count = 0, sniper count = 0 or minimal (< 3), sniper holding < 5% | Proceed with standard analysis |
| **LOW** | Bundle count 1-2, sniper count < 5, sniper holding < 10% | Proceed with caution, monitor for dumps |
| **MEDIUM** | Bundle count 3-5, sniper holding 10-20%, some new wallets | Reduced position size, tight stop-loss |
| **HIGH** | Bundle count > 5, sniper holding 20-30%, clear coordination | Minimal position only, expect dumps |
| **CRITICAL** | Dev bundle confirmed, insider bundle, sniper holding > 30% | **DO NOT BUY** |

### Decision Matrix

```
┌─────────────────────┬──────────┬──────────┬──────────┬──────────┐
│                     │ Sniper   │ Sniper   │ Sniper   │ Sniper   │
│ Bundle Count        │ < 5%     │ 5-15%    │ 15-30%   │ > 30%    │
├─────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ 0 bundles           │ CLEAN    │ LOW      │ MEDIUM   │ HIGH     │
│ 1-2 bundles         │ LOW      │ MEDIUM   │ HIGH     │ CRITICAL │
│ 3-5 bundles         │ MEDIUM   │ HIGH     │ HIGH     │ CRITICAL │
│ > 5 bundles         │ HIGH     │ CRITICAL │ CRITICAL │ CRITICAL │
│ Dev bundle detected │ CRITICAL │ CRITICAL │ CRITICAL │ CRITICAL │
└─────────────────────┴──────────┴──────────┴──────────┴──────────┘
```

## When to Avoid

**Always avoid** (no exceptions) when:

1. **Developer bundle detected** -- The creator is buying their own token through proxies. The token WILL be dumped.
2. **Insider bundle detected** -- The launch was not fair. Insiders hold cheap tokens they will dump on retail.
3. **Sniper holding > 30%** -- Bots control too much supply. Selling pressure will be overwhelming.
4. **Bundle wallets hold > 40% of supply** -- Coordinated entities can crash the price at any time.

**Strongly recommend avoiding** when:

1. **Jito bundle detected on Solana** -- Professional-level manipulation. Retail is at a severe disadvantage.
2. **Wash trading pattern visible** -- The volume is fake. You cannot determine real demand.
3. **> 50% of holders are new wallets** -- Likely a Sybil attack where one entity controls many wallets.
4. **Bundle wallets are also in top holders** -- The manipulators are also the largest holders, maximizing dump impact.

## Scoring Guide

For the meme scoring model, bundler/sniper check is worth **10 points**:

| Condition | Points |
|---|---|
| No bundles, < 3 snipers, sniper holding < 5% | 10 |
| 1-2 bundles OR sniper holding 5-10% | 7 |
| 3-5 bundles OR sniper holding 10-20% | 4 |
| > 5 bundles OR sniper holding 20-30% | 2 |
| Dev bundle, insider bundle, OR sniper holding > 30% | 0 |

## Analysis Workflow

```
1. Run: onchainos memepump token-bundle-info --address <addr>
   → Extract: bundleCount, sniperCount, sniperHoldingPercentage,
     bundleHoldingPercentage, timeToFirstSnipe

2. Assess severity using the decision matrix above.

3. Run: onchainos memepump aped-wallet --address <addr>
   → Check co-investor wallet patterns
   → Look for new wallets buying in clusters

4. Run: onchainos token holders --address <addr> --chain <chain>
   → Cross-reference top holders with known bundle wallets
   → Check if bundle wallets are also major holders

5. Synthesize findings:
   → CRITICAL severity → BLOCK (scoring model gives 0 points)
   → HIGH severity → WARN strongly, recommend avoiding
   → MEDIUM severity → Reduced position, tight monitoring
   → LOW/CLEAN → Proceed with standard analysis

6. Document specific evidence:
   → Number of bundles and their characteristics
   → Sniper count and holding percentage
   → Any dev wallet connections to bundle wallets
   → Timing analysis (first buy vs. launch time)
```

## Anti-Evasion Awareness

Sophisticated manipulators try to hide their activity:

1. **Delayed bundling** -- Instead of buying at launch, bundles buy over the first 10-30 minutes to appear organic. Check `aped-wallet` for wallets that bought within a narrow time window.

2. **Funding through mixers** -- Bundle wallets may receive funds through tornado cash or similar mixers. If wallets have no clear funding source but bought simultaneously, treat as suspicious.

3. **Gradual accumulation** -- Instead of buying 10% in one transaction, the manipulator buys 1% per hour through 10 wallets. Check `cluster-overview` for wallets with correlated buying patterns.

4. **Cross-chain funding** -- Funds may come from a different chain to obscure the trail. If wallet history shows only bridging + buying, treat as suspicious.

5. **Wallet aging** -- Some manipulators create wallets months in advance and give them fake transaction history. Check if the "aged" wallet's transaction history is genuine (varied activity) or manufactured (repetitive, low-value transactions).

## Important Notes

- Bundle detection is most effective on Solana where transaction timing is precise to the slot level.
- On EVM chains, block times (12 seconds on Ethereum) make precise timing analysis harder. Look for same-block buys instead.
- A clean bundle report does NOT mean the token is safe -- manipulators may use techniques that evade detection.
- Always combine bundle analysis with developer reputation, security scanning, and holder analysis for a complete picture.
- The absence of detected bundles may simply mean the manipulator used more sophisticated techniques, not that the launch was clean.
