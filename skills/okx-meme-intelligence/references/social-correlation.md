# Social Signal Correlation

How to correlate social activity with on-chain metrics to distinguish organic interest from artificial hype. This is critical for meme tokens where social narratives drive price action.

## Signal Sources

### On-Chain Signals (Reliable)

| Signal | Command | What It Shows |
|---|---|---|
| Smart money buys | `tracker activities --tracker-type smartMoney` | What experienced wallets are buying |
| KOL activity | `tracker activities --tracker-type kol` | What influencers are actually buying (vs. shilling) |
| Whale movements | `tracker activities --tracker-type whale` | Large holder accumulation or distribution |
| Buy signals | `signal list --chain <c> --wallet-type 1` | Aggregated smart money buy alerts |
| Trending tokens | `token hot-tokens --chain <c> --ranking-type <t>` | Tokens gaining traction |
| Holder count change | `token holders --address <addr> --chain <c>` | Growing or shrinking holder base |

### Social Indicators (Require On-Chain Verification)

| Indicator | What to Look For | On-Chain Verification |
|---|---|---|
| Twitter/X mentions spike | Sudden increase in token mentions | Check `token hot-tokens --ranking-type xmentioned` |
| Telegram/Discord activity | Growing community size | Check `token holders` for new wallet growth |
| Influencer mentions | KOLs mentioning the token | Check `tracker activities --tracker-type kol` for actual buys |
| Meme coin forums | Discussion on pump.fun etc. | Check `memepump token-details` for launch data |

## Correlation Framework

### Step 1: Baseline On-Chain Data

```bash
# Get current token metrics
onchainos token price-info --address <addr> --chain <c>
onchainos token holders --address <addr> --chain <c>
onchainos token liquidity --address <addr> --chain <c>
```

Record: price, holder count, liquidity depth, 24h volume.

### Step 2: Check Smart Money Alignment

```bash
# Are experienced wallets buying this token?
onchainos tracker activities --tracker-type smartMoney
onchainos signal list --chain <c> --wallet-type 1
```

**Strong positive signal:** Smart money is buying the same token that's getting social attention.
**Negative signal:** Social hype but zero smart money interest — likely manufactured.

### Step 3: Check KOL Authenticity

```bash
# Are KOLs actually buying, or just shilling?
onchainos tracker activities --tracker-type kol
```

**Authentic:** KOL wallets show actual buys of the token they're promoting.
**Suspicious:** KOL is promoting but their wallet shows no buys (or is selling).

### Step 4: Verify Holder Growth

```bash
# Is the holder count growing organically?
onchainos token cluster-overview --address <addr> --chain <c>
onchainos token holders --address <addr> --chain <c>
```

**Organic growth:** New unique wallets with varied buy sizes and timing.
**Artificial growth:** Many wallets buying identical amounts at the same time (sybil pattern).

## Correlation Patterns

### Pattern 1: Genuine Organic Interest

```
Social:     Growing mentions, positive sentiment
Smart Money: Buying or accumulating
KOLs:        Actually holding (verified on-chain)
Holders:     Growing with diverse distribution
Volume:      Steady increase, not a single spike
→ CONFIRMED: Real interest, consider entry
```

### Pattern 2: Artificial Hype

```
Social:     Sudden spike in mentions (often coordinated)
Smart Money: NOT buying — may even be selling
KOLs:        Promoting but not holding (or selling)
Holders:     Concentrated, many similar-size wallets
Volume:      Single large spike then decline
→ WARNING: Likely pump-and-dump, avoid
```

### Pattern 3: Smart Money Only (No Social)

```
Social:     Minimal mentions, no hype
Smart Money: Quietly accumulating
KOLs:        Not involved yet
Holders:     Slowly growing
Volume:      Low but steady
→ OPPORTUNITY: Smart money early entry — investigate further
```

### Pattern 4: Exhausted Trend

```
Social:     Still getting mentions but declining
Smart Money: Sold or stopped buying
KOLs:        Moved on to new tokens
Holders:     Flat or declining
Volume:      Dropping significantly
→ EXIT: Trend is fading, take profits or cut losses
```

## Red Flags for Fake Social Signals

1. **High social mentions but zero smart money buys** — Almost certainly manufactured
2. **Holder count growing but all new wallets have similar balances** — Sybil attack
3. **KOL promoting but their tracked wallet shows no position** — Paid promotion
4. **Volume spike without corresponding holder growth** — Wash trading
5. **Social sentiment extremely positive but price declining** — Bag holders recruiting

## Quantitative Checks

### Social-to-Volume Ratio

```
If social_mentions_24h > 1000 AND volume_24h < $10K:
  → FAKE HYPE (all talk, no money)
  
If social_mentions_24h > 1000 AND volume_24h > $100K:
  → GENUINE INTEREST (money follows mouth)
```

### Holder Growth Rate

```
If holder_count_growth_24h > 50% AND new_holders_have_diverse_sizes:
  → ORGANIC GROWTH

If holder_count_growth_24h > 50% AND new_holders_have_similar_sizes:
  → ARTIFICIAL INFLATION (sybil wallets)
```

### Smart Money Confirmation Score

```
smart_money_buying AND kol_actually_holding AND whale_accumulating = 3/3 → STRONG BUY signal
smart_money_buying AND (kol_actually_holding XOR whale_accumulating) = 2/3 → MODERATE signal
smart_money_buying ONLY = 1/3 → WEAK signal, investigate further
none buying = 0/3 → NO SIGNAL, regardless of social hype
```

## Monitoring Workflow

For active meme positions, check social correlation every 30 minutes:

```bash
# Quick health check
onchainos market price --address <addr> --chain <c>
onchainos tracker activities --tracker-type smartMoney
onchainos signal list --chain <c>
```

If smart money starts selling while social hype continues — this is a classic exit signal. The "smart" money is exiting while retail is being recruited to provide liquidity.
