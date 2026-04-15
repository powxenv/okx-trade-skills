# Token Scoring Model

A standardized 0-100 scoring system for evaluating tokens before trading. Combines data from multiple `onchainos` commands into a single actionable score.

## Score Components

| Factor | Weight | Source Commands | Data Points |
|---|---|---|---|
| Security | 30 pts | `security token-scan` | Honeypot status, rug pull risk, action verdict |
| Holder Distribution | 25 pts | `token cluster-overview`, `token holders` | Top holder %, cluster concentration, Gini coefficient |
| Liquidity | 20 pts | `token liquidity`, `swap quote` | Pool depth, price impact at various sizes, LP lock status |
| Market Signals | 15 pts | `signal list`, `tracker activities`, `token top-trader` | Smart money activity, buy/sell ratio, KOL involvement |
| Developer Reputation | 10 pts | `token advanced-info` | Dev history, community recognition, team transparency |

## Scoring Algorithm

### Security Score (0-30)

```
30  → isHoneyPot: false, action: "pass", communityRecognized: true
25  → isHoneyPot: false, action: "pass", communityRecognized: false
20  → isHoneyPot: false, action: "warning"
0   → isHoneyPot: true OR action: "block" (overrides everything)
```

If security scan fails (infrastructure error), set security score to N/A and refuse to trade.

### Holder Distribution Score (0-25)

```
25  → Top 10 holders < 10%, no whale clusters
20  → Top 10 holders < 20%, low cluster concentration
15  → Top 10 holders < 30%, moderate concentration
10  → Top 10 holders < 50%, some whale presence
5   → Top 10 holders < 70%, high concentration
0   → Top 10 holders ≥ 70% (extreme concentration)
```

Use `token cluster-overview --address <addr> --chain <c>` to get concentration ranges and `token cluster-top-holders` for top 10/50/100 breakdowns.

### Liquidity Score (0-20)

```
20  → Liquidity > $1M, price impact < 0.5% at $10K
15  → Liquidity > $100K, price impact < 2% at $10K
10  → Liquidity > $10K, price impact < 5% at $10K
5   → Liquidity > $1K, price impact < 10% at $10K
0   → Liquidity < $1K (dangerous)
```

Use `token liquidity --address <addr> --chain <c>` for pool data and `swap quote` to test price impact at $10K.

### Market Signals Score (0-15)

```
15  → Strong smart money buys in last 24h, positive KOL signals, top traders accumulating
12  → Moderate smart money activity, mixed KOL signals
8   → Weak signals, no clear direction
4   → Negative signals (smart money selling, KOL warnings)
0   → Active sell signals, top traders exiting
```

Use `signal list --chain <c>` for aggregated buy signals and `tracker activities --tracker-type smartmoney` for smart money flow.

### Developer Reputation Score (0-10)

```
10  → Known team, audited contracts, transparent, active GitHub
7   → Community recognized, verified contracts
4   → New team, unverified contracts, no track record
0   → Anonymous, previous failed/rugged tokens, suspicious patterns
```

Use `token advanced-info --address <addr> --chain <c>` for community recognition status and developer statistics.

## Score Thresholds

| Range | Risk Level | Action |
|---|---|---|
| 85-100 | **Safe** | Proceed with standard risk management |
| 70-84 | **Moderate** | Reduce position size by 50%, tighten stop-loss to 3% |
| 50-69 | **Risky** | Maximum 0.5% portfolio allocation, 2% stop-loss, manual mode only |
| 0-49 | **Dangerous** | Do not trade. Show risk details to user. |

Any score of 0 on the Security component overrides the total — **do not trade regardless of other scores**.

## Usage in Trading Workflow

1. User identifies a token to buy
2. Run all scoring commands in parallel:
   ```bash
   onchainos security token-scan --address <addr> --chain <c>
   onchainos token cluster-overview --address <addr> --chain <c>
   onchainos token liquidity --address <addr> --chain <c>
   onchainos signal list --chain <c>
   onchainos token advanced-info --address <addr> --chain <c>
   ```
3. Calculate score and display breakdown
4. Apply position sizing rules based on score range
5. Log score with trade for post-analysis

## Score Display Format

```
Token: PEPE (0x1234...abcd) on Ethereum
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security:         25/30 ✅ (pass, not honeypot, community recognized)
Holders:          15/25 ⚠️  (top 10 hold 28%, moderate concentration)
Liquidity:        20/20 ✅ ($2.3M depth, 0.3% impact at $10K)
Signals:          12/15 ✅ (smart money accumulating, positive KOL)
Dev Reputation:    7/10 ✅ (community recognized, verified contract)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL SCORE:      79/100 — MODERATE
Recommended: 50% position reduction, 3% stop-loss
```
