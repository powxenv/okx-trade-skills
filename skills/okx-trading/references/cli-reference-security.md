# CLI Reference: Token Analysis & Security

> Load this file when you need detailed command parameters for token analysis or security scanning.

## Table of Contents

1. onchainos token search
2. onchainos token info
3. onchainos token price-info
4. onchainos token holders
5. onchainos token liquidity
6. onchainos token hot-tokens
7. onchainos token advanced-info
8. onchainos token top-trader
9. onchainos token trades
10. onchainos token cluster-overview
11. onchainos token cluster-top-holders
12. onchainos token cluster-list
13. onchainos token cluster-supported-chains
14. onchainos security token-scan
15. onchainos security dapp-scan
16. onchainos security tx-scan
17. onchainos security sig-scan
18. onchainos security approvals

---

## 1. onchainos token search

```bash
onchainos token search --query <query> [--chains <chains>]
```

| Param | Required | Default | Description |
|---|---|---|---|
| `--query` | Yes | - | Token name, symbol, or address |
| `--chains` | No | `"1,501"` | Comma-separated chain indexes |

## 2. onchainos token info

```bash
onchainos token info --address <address> --chain <chain>
```

Returns: name, symbol, decimals, logo, contract address.

## 3. onchainos token price-info

```bash
onchainos token price-info --address <address> --chain <chain>
```

Returns: price, market cap, liquidity, volume, 24h change, holder count.

## 4. onchainos token holders

```bash
onchainos token holders --address <address> --chain <chain>
```

Top 100 holders with optional tag filter (KOL/whale/smart money).

## 5. onchainos token liquidity

```bash
onchainos token liquidity --address <address> --chain <chain>
```

Top 5 liquidity pools for a token.

## 6. onchainos token hot-tokens

```bash
onchainos token hot-tokens --chain <chain> [--ranking-type <type>]
```

| Param | Required | Default | Description |
|---|---|---|---|
| `--chain` | No | All chains | Filter by chain |
| `--ranking-type` | No | `4` | `4`=Trending, `5`=X-mentioned |

## 7. onchainos token advanced-info

```bash
onchainos token advanced-info --address <address> --chain <chain>
```

Returns: risk level, creator, dev stats, holder concentration, bundle/sniper data.

**Redirect to `security token-scan` for safety questions.**

## 8. onchainos token top-trader

```bash
onchainos token top-trader --address <address> --chain <chain>
```

Top traders / profit addresses for a token.

## 9. onchainos token trades

```bash
onchainos token trades --address <address> --chain <chain> [--trade-type <type>] [--tag <tag>]
```

| Param | Required | Description |
|---|---|---|
| `--address` | Yes | Token contract address |
| `--chain` | Yes | Chain name |
| `--trade-type` | No | Filter: `1`=buy, `2`=sell |
| `--tag` | No | Filter by trader tag |

## 10. onchainos token cluster-overview

```bash
onchainos token cluster-overview --address <address> --chain <chain>
```

Holder cluster concentration, rug pull %, new address %.

## 11. onchainos token cluster-top-holders

```bash
onchainos token cluster-top-holders --address <address> --chain <chain> --range-filter <1|2|3>
```

| `--range-filter` | Scope |
|---|---|
| `1` | Top 10 |
| `2` | Top 50 |
| `3` | Top 100 |

## 12. onchainos token cluster-list

```bash
onchainos token cluster-list --address <address> --chain <chain>
```

Clusters of top 300 holders with address details.

## 13. onchainos token cluster-supported-chains

No parameters. Lists chains that support cluster analysis.

---

## 14. onchainos security token-scan

Token risk and honeypot detection.

```bash
# Own wallet address
onchainos security token-scan --chain <chain> [--tokens]

# Different address
onchainos security token-scan --address <addr> --chain <chain> [--tokens]

# Specific token
onchainos security token-scan --chain <chain> --chain-index <idx> --token-contract-address <addr>
```

Returns: `action` (block/warn/empty), `riskItemDetail[]`, honeypot status, tax rate, community recognition.

## 15. onchainos security dapp-scan

DApp/URL phishing detection.

```bash
onchainos security dapp-scan --domain <domain>
```

Returns: `isMalicious` (boolean).

## 16. onchainos security tx-scan

Transaction pre-execution security check.

```bash
# EVM
onchainos security tx-scan --chain <chain> --from <addr> --to <addr> [--value <wei>] [--data <hex>]

# Solana
onchainos security tx-scan --chain solana --from <addr> --instructions <json>
```

## 17. onchainos security sig-scan

Message signature security (EVM only).

```bash
onchainos security sig-scan --chain <chain> --from <addr> --message <hex_or_json>
```

## 18. onchainos security approvals

Token approval / Permit2 query (EVM only).

```bash
onchainos security approvals --address <addr> --chain <chain>
```

Returns: approved spenders, allowance amounts, risk levels.