# CLI Reference: Market & Portfolio

> Load this file when you need detailed command parameters for market or portfolio commands.

## Table of Contents

1. onchainos market price
2. onchainos market prices
3. onchainos market kline
4. onchainos market index
5. onchainos market portfolio-supported-chains
6. onchainos market portfolio-overview
7. onchainos market portfolio-dex-history
8. onchainos market portfolio-recent-pnl
9. onchainos market portfolio-token-pnl
10. onchainos portfolio chains
11. onchainos portfolio total-value
12. onchainos portfolio all-balances
13. onchainos portfolio token-balances

---

## 1. onchainos market price

Single token price.

```bash
onchainos market price --address <address> --chain <chain>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Token contract address |
| `--chain` | Yes | Chain name |

**Note**: For Solana SOL price, use wSOL address `So11111111111111111111111111111112`, NOT native address.

## 2. onchainos market prices

Batch price query for multiple tokens.

```bash
onchainos market prices --tokens <chain:address,...>
```

| Param | Required | Description |
|---|---|---|
| `--tokens` | Yes | Comma-separated `chain:address` pairs |

## 3. onchainos market kline

K-line / candlestick chart data.

```bash
onchainos market kline --address <address> --chain <chain> [--bar <bar>] [--limit <n>]
```

| Param | Required | Default | Description |
|---|---|---|---|
| `--address` | Yes | - | Token contract address |
| `--chain` | Yes | - | Chain name |
| `--bar` | No | `1H` | Bar size: `1m`, `5m`, `15m`, `30m`, `1H`, `4H`, `1D`, `1W` |
| `--limit` | No | 100 | Number of candles (max 200) |

**Kline field mapping**: `ts` → Time, `o` → Open, `h` → High, `l` → Low, `c` → Close, `vol` → Volume, `volUsd` → Volume (USD), `confirm` → Status (0=incomplete, 1=completed).

## 4. onchainos market index

Index / aggregate price (only when explicitly requested).

```bash
onchainos market index --address <address> --chain <chain>
```

## 5. onchainos market portfolio-supported-chains

Check which chains support PnL analysis. No parameters.

```bash
onchainos market portfolio-supported-chains
```

## 6. onchainos market portfolio-overview

Wallet PnL overview (win rate, realized PnL, top 3 tokens).

```bash
onchainos market portfolio-overview --address <address> --chain <chain>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--chain` | Yes | Chain name |

## 7. onchainos market portfolio-dex-history

Wallet DEX transaction history.

```bash
onchainos market portfolio-dex-history --address <address> --chain <chain> --begin <ms> --end <ms>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--chain` | Yes | Chain name |
| `--begin` | Yes | Start timestamp (Unix ms) |
| `--end` | Yes | End timestamp (Unix ms) |

## 8. onchainos market portfolio-recent-pnl

Recent PnL by token.

```bash
onchainos market portfolio-recent-pnl --address <address> --chain <chain>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--chain` | Yes | Chain name |

**Note**: `unrealizedPnlUsd` returns `SELL_ALL` when the address has sold all holdings of that token.

## 9. onchainos market portfolio-token-pnl

Per-token PnL snapshot.

```bash
onchainos market portfolio-token-pnl --address <address> --chain <chain>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--chain` | Yes | Chain name |

**Note**: `isPnlSupported = false` means PnL calculation is not supported for this token/chain.

---

## 10. onchainos portfolio chains

Supported chains for balance queries. No parameters.

## 11. onchainos portfolio total-value

Total asset value for a wallet.

```bash
onchainos portfolio total-value --address <address> --chains <chains>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--chains` | Yes | Comma-separated chain names (max 50) |
| `--asset-type` | No | `0`=all, `1`=tokens, `2`=DeFi |

## 12. onchainos portfolio all-balances

All token balances for a wallet.

```bash
onchainos portfolio all-balances --address <address> --chains <chains>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--chains` | Yes | Comma-separated chain names (max 50) |
| `--exclude-risk` | No | Exclude risky tokens (`0`=include, `1`=exclude). Only ETH/BSC/SOL/BASE |

## 13. onchainos portfolio token-balances

Specific token balances.

```bash
onchainos portfolio token-balances --address <address> --tokens <tokens>
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Wallet address |
| `--tokens` | Yes | Comma-separated `chain:address` pairs (max 20) |