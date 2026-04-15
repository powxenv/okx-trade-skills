# Developer Reputation Analysis

> Load this file when analyzing a meme token developer's reputation, track record, and trustworthiness.

## Overview

Developer reputation is the single most important factor in meme token safety. A token created by a developer with a history of rug pulls or abandoned projects is overwhelmingly likely to repeat that behavior. Conversely, a developer with a track record of successful, community-driven projects significantly increases confidence.

## Commands

```bash
# Primary: Get developer info for a specific token
onchainos memepump token-dev-info --address <token_address>

# Secondary: Find other tokens created by the same developer
onchainos memepump similar-tokens --address <token_address>

# Supplementary: Check if the developer holds excessive supply
onchainos token holders --address <token_address> --chain <chain>
```

## Data Points to Extract

### From `memepump token-dev-info`

| Field | What It Means | Risk Implication |
|---|---|---|
| `rugPullTokenCount` | Number of previous tokens that were rug-pulled by this dev | **> 0 = HARD BLOCK** |
| `abandonedTokenCount` | Tokens created and then abandoned (no further dev activity) | High count = serial launcher |
| `totalTokensCreated` | Total number of tokens this dev has launched | > 5 in short period = likely scammer |
| `devHoldingPercentage` | Percentage of total supply held by dev wallet | > 5% = rug risk; > 10% = HIGH rug risk |
| `devWalletAddress` | The developer's wallet address | Cross-reference with known scam databases |
| `averageTokenLifespan` | How long the dev's previous tokens survived | < 24h average = instant dump pattern |
| `successfulTokens` | Tokens that reached meaningful market cap | 0 out of many = no successful track record |

### From `memepump similar-tokens`

| Field | What It Means | Risk Implication |
|---|---|---|
| Token list with addresses | Other tokens from the same dev | Check each for rug patterns |
| Market cap trajectory | Did previous tokens pump then crash? | Classic pump-dump pattern |
| Holder counts | Did previous tokens attract real holders? | Low holders = no organic interest |
| Creation timestamps | How frequently does the dev launch? | Multiple per day = factory scammer |

### From `token holders`

| Field | What It Means | Risk Implication |
|---|---|---|
| Dev wallet in top holders | Is the creator holding massive supply? | Top 3 holder = dangerous concentration |
| Related wallets | Multiple top holders with similar patterns | Likely dev-controlled Sybil wallets |

## Red Flags (BLOCK or WARN)

### Critical Red Flags (BLOCK -- Do Not Trade)

1. **`rugPullTokenCount > 0`** -- The developer has rug-pulled before. This is an absolute deal-breaker. Regardless of any other positive signals, a developer who has stolen from their community once will do it again.

2. **Dev wallet holds > 10% of supply** -- The developer controls enough tokens to crash the price at will. Even if they claim they are "locked," the risk of a sudden dump is too high.

3. **Multiple tokens launched within hours of each other** -- This indicates a factory-style operation where the developer mass-produces tokens hoping one catches on, abandoning the rest. Each abandoned token represents lost funds for real buyers.

4. **Average token lifespan < 1 hour** -- The developer creates tokens that are designed for quick extraction, not long-term community building.

5. **Dev wallet is the largest holder AND has been actively selling** -- Active selling by the largest holder (the creator) is the clearest possible signal of an ongoing or imminent rug pull.

### Warning Flags (WARN -- Proceed with Extreme Caution)

1. **`abandonedTokenCount > 2`** -- The developer has a pattern of abandoning projects. While not as definitive as a rug pull, abandonment shows the developer does not commit to their projects.

2. **`devHoldingPercentage` between 3-10%** -- Moderate developer holdings are not automatically disqualifying but warrant careful monitoring. Check if the dev's wallet is actively trading.

3. **`totalTokensCreated > 5` with `successfulTokens = 0`** -- A developer who has launched many tokens without a single success is either incompetent or a scammer. Neither is a good sign.

4. **Previous tokens show pump-then-crash pattern** -- If `similar-tokens` shows that the developer's previous tokens all experienced a rapid rise followed by an equally rapid crash, this is a "pump and dump" factory.

5. **Dev wallet created very recently** -- A wallet that was created days or even hours before launching a token suggests a burner wallet created specifically to avoid reputation tracking.

## Green Flags (Positive Signals)

1. **`rugPullTokenCount = 0` AND `abandonedTokenCount = 0`** -- Clean track record. No history of rugs or abandonment.

2. **Previous tokens reached significant market caps ($1M+)** -- The developer has demonstrated the ability to build real, valuable projects.

3. **Active community engagement from dev wallet** -- If the developer's wallet shows ongoing interaction (not just selling), this suggests genuine project commitment.

4. **Dev holding 1-3% of supply** -- A small developer allocation is normal and shows the dev has skin in the game without the ability to single-handedly crash the token.

5. **Consistent, spaced-out token launches** -- If the developer launches tokens with weeks or months between them, this suggests thoughtful project development rather than mass production.

6. **Previous tokens migrated to DEX successfully** -- Tokens that completed the bonding curve phase and established DEX liquidity show the developer can guide a project through its lifecycle.

## Scoring Guide

For the meme scoring model, developer reputation is worth **20 points**:

| Condition | Points |
|---|---|
| `rugPullTokenCount = 0`, no abandoned tokens, successful previous launches | 20 |
| `rugPullTokenCount = 0`, no abandoned tokens, no previous success | 15 |
| `rugPullTokenCount = 0`, 1-2 abandoned tokens | 10 |
| `rugPullTokenCount = 0`, many abandoned tokens (> 3) | 5 |
| `rugPullTokenCount > 0` OR dev holds > 10% supply | 0 |

## Analysis Workflow

```
1. Run: onchainos memepump token-dev-info --address <addr>
   → Extract: rugPullTokenCount, abandonedTokenCount, devHoldingPercentage,
     totalTokensCreated, averageTokenLifespan

2. Run: onchainos memepump similar-tokens --address <addr>
   → For each similar token, note: market cap trajectory, holder count, creation time
   → Identify patterns: factory launches, pump-dump cycles, abandoned projects

3. Run: onchainos token holders --address <addr> --chain <chain>
   → Check if dev wallet appears in top holders
   → Look for related wallets (similar buying patterns, same timing)

4. Synthesize findings:
   → Any critical red flag → BLOCK (score = 0)
   → Warning flags present → reduce score, warn user
   → Green flags present → full points
   → Present clear summary to user with specific data points

5. Cross-reference with bundler detection:
   → If dev has red flags AND bundler activity is high → SCAM CONFIRMED
   → If dev has red flags but bundler activity is low → Still dangerous, likely manual rug
```

## Common Scammer Patterns

### The Serial Launcher
- Creates 5-20 tokens per day
- All tokens follow same naming pattern (e.g., "InuXXX", "PepeXXX")
- None survive more than a few hours
- Total supply always concentrated in first few wallets

### The Rug Puller
- Has 1-3 confirmed rug pulls in history
- Typically waits until market cap reaches a threshold, then pulls all liquidity
- May use multiple wallets to hide identity, but `similar-tokens` reveals the pattern

### The Honeypot Creator
- Creates tokens with hidden sell restrictions
- `security token-scan` will catch this, but the dev reputation confirms intent
- Pattern: multiple tokens, all flagged as honeypots by security scanners

### The Social Engineer
- Creates seemingly legitimate tokens with good branding
- Builds community, then launches a second token and dumps the first
- Harder to detect -- look for "previous successful token followed by abandonment"

## Important Notes

- Developer reputation analysis is necessary but not sufficient. Always combine with security scanning, holder analysis, and bundler detection.
- A clean developer reputation does NOT guarantee safety -- first-time scammers exist.
- The `similar-tokens` data may not capture ALL previous tokens if the developer uses different wallets. Cross-reference with holder analysis.
- Dev wallet analysis is most reliable on Solana where wallet history is fully transparent. On EVM chains, developers may use multiple addresses more easily.
