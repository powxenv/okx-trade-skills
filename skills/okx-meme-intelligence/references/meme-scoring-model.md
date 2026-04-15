# Meme Token Scoring Model

A 0-100 scoring system specifically designed for meme tokens. Weights are adjusted to reflect the unique risk profile of meme trading — developer reputation and bundler detection carry more weight than in the general token scoring model.

## Scoring Factors

| Factor | Weight | Primary Commands |
|---|---|---|
| Developer Reputation | 20 pts | `memepump token-dev-info`, `memepump similar-tokens` |
| Holder Distribution | 20 pts | `token holders`, `token cluster-overview` |
| Security Scan | 20 pts | `security token-scan` |
| Liquidity Depth | 15 pts | `token liquidity`, `token price-info` |
| Social Signals | 15 pts | `signal list`, `tracker activities`, `token hot-tokens` |
| Bundler/Sniper Check | 10 pts | `memepump token-bundle-info` |

## Developer Reputation Score (0-20)

Evaluate using `memepump token-dev-info --address <addr>` and `memepump similar-tokens --address <addr>`:

```
20  → Known dev with successful track record, multiple legitimate launches, no rug pulls
15  → New dev, no negative history, 1-2 previous tokens that performed normally
10  → New dev, no track record at all (neutral)
5   → Dev has 1-2 failed/abandoned tokens, or suspicious timing patterns
0   → Dev has rug pull history (rugPullTokenCount > 0) — BLOCK TRADE
```

**Red flags that reduce score:**
- `rugPullTokenCount > 0` → automatic 0, block trade
- Multiple token launches within hours of each other → -5
- Previous tokens all share similar holder patterns → -5
- Dev wallet holds > 5% of current token supply → -5

## Holder Distribution Score (0-20)

Evaluate using `token holders --address <addr> --chain <c>` and `token cluster-overview --address <addr> --chain <c>`:

```
20  → Top 10 holders < 15%, no whale clusters, healthy distribution
15  → Top 10 holders < 25%, low cluster concentration
10  → Top 10 holders < 40%, moderate concentration
5   → Top 10 holders < 55%, some whale dominance
0   → Top 10 holders ≥ 55% — extreme concentration, likely manipulated
```

**Additional checks:**
- If top holder is a known DEX pool contract → exclude from concentration calculation
- If multiple top wallets have similar buy patterns → likely same entity, treat as one holder
- If dev wallet is in top 10 → subtract 5 pts

## Security Scan Score (0-20)

Evaluate using `security token-scan --address <addr> --chain <c>`:

```
20  → isHoneyPot: false, action: "pass", communityRecognized: true
15  → isHoneyPot: false, action: "pass", communityRecognized: false
10  → isHoneyPot: false, action: "warning"
0   → isHoneyPot: true OR action: "block" — BLOCK TRADE
```

**Security scan is mandatory.** If scan fails (infrastructure error), set score to N/A and refuse to trade until resolved.

## Liquidity Depth Score (0-15)

Evaluate using `token liquidity --address <addr> --chain <c>` and `token price-info --address <addr> --chain <c>`:

```
15  → Liquidity > $500K, multiple active pools, healthy volume/liquidity ratio
12  → Liquidity > $100K, at least one active pool
8   → Liquidity > $20K, limited but functional
4   → Liquidity > $5K, very thin — high slippage risk
0   → Liquidity < $5K — dangerous, easy to manipulate
```

**Meme-specific liquidity warnings:**
- Liquidity recently added (< 1 hour) → liquidity may be temporary/locked briefly
- Single liquidity pool → concentration risk
- LP tokens not locked → liquidity can be removed (rug pull vector)

## Social Signals Score (0-15)

Evaluate using `signal list --chain <c>`, `tracker activities --tracker-type smartMoney`, and `token hot-tokens --chain <c>`:

```
15  → Strong smart money buys in last 6h, trending on social, KOLs accumulating
12  → Moderate smart money activity, appearing in hot tokens list
8   → Some buy signals, no clear smart money direction
4   → Negative signals (smart money selling, no social traction)
0   → Active sell signals from smart money, KOL warnings, or no signals at all for a "hyped" token (suggests fake hype)
```

**Key disqualification check:** If a token claims massive social hype but shows zero smart money activity and no buy signals, this is a red flag for artificial promotion. Set social signals to 0 and add warning.

## Bundler/Sniper Check Score (0-10)

Evaluate using `memepump token-bundle-info --address <addr>`:

```
10  → No bundler detected, no sniper activity in first trades
7   → Minor bundler presence (< 5% of initial buys)
4   → Moderate bundler activity (5-15% of initial buys)
0   → Heavy bundler/sniper activity (> 15% of initial buys) — coordinated launch
```

## Total Score Calculation

```
Total = Dev Reputation + Holder Distribution + Security + Liquidity + Social Signals + Bundler Check
```

| Score Range | Rating | Recommended Action |
|---|---|---|
| 80-100 | **Safe** | Standard meme risk rules apply (0.5% max position) |
| 60-79 | **Caution** | Reduce to 0.3% max position, tight 15% stop-loss |
| 40-59 | **Dangerous** | Only with explicit user override, 0.2% max, 10% stop-loss |
| 0-39 | **Avoid** | Do not trade. Show detailed risk breakdown. |

## Override Rules

The following conditions **always** block trading regardless of total score:

- `isHoneyPot: true` → BLOCK
- `action: "block"` → BLOCK
- Dev `rugPullTokenCount > 0` → BLOCK
- Top 10 holders control > 70% → BLOCK
- Security scan unavailable → BLOCK (can't verify safety)

## Score Display Format

```
Meme Token: FROG (0x1234...abcd) on Solana
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dev Reputation:    15/20 ⚠️  (new dev, no negative history)
Holders:           10/20 ⚠️  (top 10 hold 35%, moderate concentration)
Security:          20/20 ✅ (pass, not honeypot, community recognized)
Liquidity:         12/15 ✅ ($250K depth, 2 active pools)
Social Signals:    12/15 ✅ (smart money buying, trending on social)
Bundler Check:     10/10 ✅ (no bundler/sniper activity detected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL SCORE:      79/100 — CAUTION
Position: max 0.3%, stop-loss 15%, take-profit 100%
```

## Integration with Trading Workflow

1. Run all scoring commands (can be parallelized)
2. Calculate individual factor scores
3. Sum to total
4. Apply override rules (any BLOCK → stop)
5. Determine position sizing from score range
6. Present score card to user before trade execution
7. Log score with trade for post-analysis
