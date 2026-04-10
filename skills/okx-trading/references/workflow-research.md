# Research & Analysis Workflow

> Load this file when the user wants to research, analyze, or evaluate a token, wallet, or market trend before trading.

## Token Research Workflow

### Comprehensive Research (Full Analysis)

```bash
# 1. Search and identify the token
onchainos token search --query <symbol_or_name> --chains <chain>

# 2. Security scan (MANDATORY first step)
onchainos security token-scan --address <token_address> --chain <chain>

# 3. Price and market data
onchainos market price --address <token_address> --chain <chain>
# OR for more detail:
onchainos token price-info --address <token_address> --chain <chain>

# 4. Holder distribution
onchainos token holders --address <token_address> --chain <chain>

# 5. Advanced risk and dev metrics
onchainos token advanced-info --address <token_address> --chain <chain>

# 6. Liquidity assessment
onchainos token liquidity --address <token_address> --chain <chain>

# 7. Top traders / profit addresses
onchainos token top-trader --address <token_address> --chain <chain>

# 8. Recent trade history
onchainos token trades --address <token_address> --chain <chain>

# 9. Holder cluster analysis (concentration risk)
onchainos token cluster-overview --address <token_address> --chain <chain>

# 10. Price chart (technical analysis)
onchainos market kline --address <token_address> --chain <chain>
```

### Quick Research (Lightweight)

For a fast check before a trade:

```bash
# 1. Token search → 2. Security scan → 3. Price → 4. Liquidity
onchainos token search --query <symbol> --chains <chain>
onchainos security token-scan --address <addr> --chain <chain>
onchainos token price-info --address <addr> --chain <chain>
onchainos token liquidity --address <addr> --chain <chain>
```

## Wallet / Portfolio Analysis

### Portfolio Overview

```bash
# Total portfolio value
onchainos portfolio total-value --address <addr> --chains <chains>

# All token balances
onchainos portfolio all-balances --address <addr> --chains <chains>

# PnL overview (win rate, realized/unrealized PnL)
onchainos market portfolio-overview --address <addr> --chain <chain>

# Recent PnL by token
onchainos market portfolio-recent-pnl --address <addr> --chain <chain>

# Per-token PnL snapshot
onchainos market portfolio-token-pnl --address <addr> --chain <chain>

# DEX transaction history
onchainos market portfolio-dex-history --address <addr> --chain <chain> \
  --begin <start_ms> --end <end_ms>
```

### DeFi Positions

```bash
# View all DeFi positions
onchainos defi positions --address <addr> --chains <chains>

# View detailed position for a specific protocol
onchainos defi position-detail --address <addr> --chain <chain> --platform-id <pid>
```

## Smart Money / Signal Tracking

### Track Smart Money Activity

```bash
# Smart money, KOL, or whale trades
onchainos tracker activities --tracker-type smart_money
# Filter by chain:
onchainos tracker activities --tracker-type smart_money --chain solana
# Custom wallet tracking:
onchainos tracker activities --tracker-type multi_address --wallet-address <addr1,addr2>
```

### Buy Signals (Aggregated)

```bash
# Check supported chains
onchainos signal chains

# Get aggregated buy signals
onchainos signal list --chain <chain>
# Filter by wallet type: 1=Smart Money, 2=KOL, 3=Whale
onchainos signal list --chain <chain> --wallet-type 1,3
# Filter by token
onchainos signal list --chain <chain> --token-address <addr>
```

### Leaderboard (Top Traders)

```bash
# Check supported chains
onchainos leaderboard supported-chains

# Top traders by PnL
onchainos leaderboard list --chain <chain> --time-frame 1 --sort-by 1
# Time frames: 1=today, 2=3D, 3=7D, 4=30D, 5=3M
# Sort by: 1=PnL, 2=win rate, 3=tx count, 4=volume, 5=ROI
```

## Meme Token Research (Trenches)

```bash
# 1. Discover supported chains/protocols
onchainos memepump chains

# 2. Browse new meme tokens
onchainos memepump tokens --chain solana --stage NEW

# 3. Deep dive into a specific meme token
onchainos memepump token-details --address <addr>

# 4. Developer reputation check
onchainos memepump token-dev-info --address <addr>

# 5. Bundle/sniper detection
onchainos memepump token-bundle-info --address <addr>

# 6. Similar tokens from same dev
onchainos memepump similar-tokens --address <addr>

# 7. Co-investor (aped) wallet tracking
onchainos memepump aped-wallet --address <addr>
```

## Hot Token Discovery

```bash
# Trending tokens
onchainos token hot-tokens --chain <chain> --ranking-type 4
# X-mentioned tokens
onchainos token hot-tokens --chain <chain> --ranking-type 5
```

## Cross-Referencing Signals

After finding a signal from smart money or leaderboard:

```bash
# 1. Get the token address from the signal
# 2. Security scan
onchainos security token-scan --address <addr> --chain <chain>
# 3. Price analysis
onchainos market kline --address <addr> --chain <chain>
# 4. Holder analysis
onchainos token holders --address <addr> --chain <chain>
# 5. Decide whether to trade (see Buy Workflow)
```