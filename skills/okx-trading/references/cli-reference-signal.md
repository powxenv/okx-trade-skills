# CLI Reference: Signal, Leaderboard & Trenches

> Load this file when you need detailed command parameters for signals, leaderboard, or meme/trench commands.

## Table of Contents

1. onchainos tracker activities
2. onchainos signal chains
3. onchainos signal list
4. onchainos leaderboard supported-chains
5. onchainos leaderboard list
6. onchainos memepump chains
7. onchainos memepump tokens
8. onchainos memepump token-details
9. onchainos memepump token-dev-info
10. onchainos memepump similar-tokens
11. onchainos memepump token-bundle-info
12. onchainos memepump aped-wallet

---

## 1. onchainos tracker activities

Smart money / KOL / custom wallet transaction feed.

```bash
onchainos tracker activities --tracker-type <type> [--wallet-address <addrs>] [--chain <chain>] [--trade-type <type>] [--min-volume <n>] [--max-volume <n>] [--min-market-cap <n>] [--max-market-cap <n>] [--min-liquidity <n>] [--max-liquidity <n>] [--min-holders <n>]
```

| Param | Required | Description |
|---|---|---|
| `--tracker-type` | Yes | `smart_money`, `kol`, or `multi_address` |
| `--wallet-address` | If `multi_address` | Comma-separated addresses |
| `--chain` | No | Filter by chain |
| `--trade-type` | No | `0`=all, `1`=buy only, `2`=sell only |
| `--min-volume` / `--max-volume` | No | Trade volume range (USD) |
| `--min-market-cap` / `--max-market-cap` | No | Market cap range (USD) |
| `--min-liquidity` / `--max-liquidity` | No | Liquidity range (USD) |
| `--min-holders` | No | Minimum holder count |

## 2. onchainos signal chains

Check which chains support signals. No parameters.

## 3. onchainos signal list

Aggregated buy-only signal alerts.

```bash
onchainos signal list --chain <chain> [--token-address <addr>] [--wallet-type <types>] [--min-amount-usd <n>] [--min-address-count <n>]
```

| Param | Required | Description |
|---|---|---|
| `--chain` | Yes | Chain name |
| `--token-address` | No | Filter by specific token |
| `--wallet-type` | No | Multi-select: `1`=Smart Money, `2`=KOL, `3`=Whale. Comma-separated (e.g., `1,3`) |
| `--min-amount-usd` | No | Minimum buy amount in USD |
| `--min-address-count` | No | Minimum number of wallets |

## 4. onchainos leaderboard supported-chains

Check which chains support leaderboard. No parameters.

## 5. onchainos leaderboard list

Top trader leaderboard ranking.

```bash
onchainos leaderboard list --chain <chain> --time-frame <tf> --sort-by <sort> [--wallet-type <type>]
```

| Param | Required | Description |
|---|---|---|
| `--chain` | Yes | Chain name |
| `--time-frame` | Yes | `1`=today, `2`=3D, `3`=7D, `4`=30D, `5`=3M |
| `--sort-by` | Yes | `1`=PnL, `2`=win rate, `3`=tx count, `4`=volume, `5`=ROI |
| `--wallet-type` | No | Single: `sniper`, `dev`, `fresh`, `pump`, `smartMoney`, `influencer` |

**Returns max 20 entries per request.**

---

## 6. onchainos memepump chains

Discover supported chains and protocols. No parameters.

## 7. onchainos memepump tokens

Browse/filter meme tokens by stage.

```bash
onchainos memepump tokens --chain <chain> [--stage <stage>] [--protocol-id-list <ids>]
```

| Param | Required | Default | Description |
|---|---|---|---|
| `--chain` | Yes | - | Chain name (default: solana) |
| `--stage` | No | `NEW` | `NEW`, `MIGRATING`, `MIGRATED` |
| `--protocol-id-list` | No | - | Comma-separated protocol IDs from `memepump chains` |

## 8. onchainos memepump token-details

Deep dive into a specific meme token.

```bash
onchainos memepump token-details --address <address>
```

## 9. onchainos memepump token-dev-info

Developer reputation and holding info.

```bash
onchainos memepump token-dev-info --address <address>
```

## 10. onchainos memepump similar-tokens

Find similar tokens by same creator.

```bash
onchainos memepump similar-tokens --address <address>
```

## 11. onchainos memepump token-bundle-info

Bundle/sniper analysis.

```bash
onchainos memepump token-bundle-info --address <address>
```

## 12. onchainos memepump aped-wallet

Co-investor (aped/same-car) wallet list.

```bash
onchainos memepump aped-wallet --address <address>
```