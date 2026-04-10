# CLI Reference: DeFi & Wallet

> Load this file when you need detailed command parameters for DeFi or wallet commands.

## Table of Contents

1. onchainos defi support-chains
2. onchainos defi support-platforms
3. onchainos defi list
4. onchainos defi search
5. onchainos defi detail
6. onchainos defi invest
7. onchainos defi withdraw
8. onchainos defi collect
9. onchainos defi positions
10. onchainos defi position-detail
11. onchainos defi rate-chart
12. onchainos defi tvl-chart
13. onchainos defi depth-price-chart
14. Wallet Commands Summary

---

## 1. onchainos defi support-chains

Get supported chains for DeFi. No parameters.

## 2. onchainos defi support-platforms

Get supported DeFi platforms. No parameters.

## 3. onchainos defi list

List top DeFi products by APY.

```bash
onchainos defi list --chain <chain> [--product-group <group>]
```

| Param | Required | Description |
|---|---|---|
| `--chain` | No | Filter by chain |
| `--product-group` | No | `SINGLE_EARN`, `DEX_POOL`, `LENDING` |

## 4. onchainos defi search

Search DeFi products.

```bash
onchainos defi search --token <tokens> [--platform <names>] [--chain <chain>] [--product-group <group>]
```

| Param | Required | Description |
|---|---|---|
| `--token` | Yes | Comma-separated token symbols/addresses |
| `--platform` | No | Comma-separated platform names |
| `--chain` | No | Chain filter |
| `--product-group` | No | `SINGLE_EARN`, `DEX_POOL`, `LENDING` |

## 5. onchainos defi detail

Get full product details.

```bash
onchainos defi detail --investment-id <id>
```

Returns: APY, TVL, underlying tokens, platform info, investmentId (MANDATORY for all rows).

## 6. onchainos defi invest

One-step deposit (CLI handles prepare + precision + calldata).

```bash
onchainos defi invest --investment-id <id> --address <addr> --token <symbol> --amount <minimal_units> [--chain <chain>] [--slippage <pct>] [--tick-lower <n>] [--tick-upper <n>] [--token-id <nft>]
```

| Param | Required | Description |
|---|---|---|
| `--investment-id` | Yes | From `defi detail` |
| `--address` | Yes | User wallet address |
| `--token` | Yes | Deposit token symbol or address |
| `--amount` | Yes | Amount in minimal units (userAmount × 10^decimal) |
| `--chain` | Yes | Chain name |
| `--slippage` | No | Default 0.01 (1%). Suggest 0.03–0.05 for V3 pools |
| `--tick-lower` | For V3 | Lower tick bound |
| `--tick-upper` | For V3 | Upper tick bound |
| `--token-id` | For V3 exit | NFT token ID |

**CRITICAL**: Check wallet balance BEFORE calling `defi invest`. Balance insufficient → STOP.

## 7. onchainos defi withdraw

One-step withdrawal.

```bash
onchainos defi withdraw --investment-id <id> --address <addr> --chain <chain> [--ratio <0-1>] [--amount <minimal_units>] [--token-id <nft>] [--platform-id <pid>] [--slippage <pct>]
```

Use `--ratio 1` for full exit, `--amount` for partial exit. **Fresh `position-detail` is MANDATORY before every withdraw.**

## 8. onchainos defi collect

One-step reward claim.

```bash
onchainos defi collect --address <addr> --chain <chain> --reward-type <type> [--investment-id <id>] [--platform-id <pid>] [--token-id <nft>] [--principal-index <idx>]
```

rewardType: `REWARD_PLATFORM`, `REWARD_INVESTMENT`, `V3_FEE`, `REWARD_OKX_BONUS`, `REWARD_MERKLE_BONUS`, `UNLOCKED_PRINCIPAL`

**Fresh `position-detail` is MANDATORY before every collect.**

## 9. onchainos defi positions

List DeFi positions.

```bash
onchainos defi positions --address <addr> --chains <chains>
```

**Note**: Uses `--chains` (plural, comma-separated). EVM addresses only for EVM chains; Solana addresses only for `solana`.

## 10. onchainos defi position-detail

Detailed position for a specific protocol.

```bash
onchainos defi position-detail --address <addr> --chain <chain> --platform-id <pid>
```

**Note**: Uses `--chain` (singular). `--platform-id` comes from `positions` output `analysisPlatformId`.

## 11. onchainos defi rate-chart

APY history.

```bash
onchainos defi rate-chart --investment-id <id> [--time-range <range>]
```

Time ranges: `WEEK` (default), `MONTH`, `SEASON`, `YEAR`. `DAY` for V3 Pool only.

## 12. onchainos defi tvl-chart

TVL history.

```bash
onchainos defi tvl-chart --investment-id <id> [--time-range <range>]
```

## 13. onchainos defi depth-price-chart

V3 Pool depth or price history.

```bash
onchainos defi depth-price-chart --investment-id <id> [--chart-type <type>] [--time-range <range>]
```

| Param | Description |
|---|---|
| `--chart-type` | `DEPTH` (default) or `PRICE` |
| `--time-range` | Only for PRICE: `DAY` (default), `WEEK` |

---

## 14. Wallet Commands Summary

| Category | Command | Description |
|---|---|---|
| Auth | `onchainos wallet login <email> --locale <locale>` | Login with email |
| Auth | `onchainos wallet verify <code>` | Verify email code |
| Auth | `onchainos wallet add` | Add new account |
| Auth | `onchainos wallet switch <id>` | Switch account |
| Auth | `onchainos wallet status` | Check login status |
| Auth | `onchainos wallet logout` | Logout |
| Auth | `onchainos wallet addresses [--chain <id>]` | Show addresses |
| Balance | `onchainos wallet balance [--chain <id>] [--token-address <addr>] [--all] [--force]` | View balance |
| Send | `onchainos wallet send --readable-amount <amt> --receipt <addr> --chain <id>` | Send tokens |
| Contract | `onchainos wallet contract-call --to <addr> --chain <id> --input-data <hex>` | Call contract |
| History | `onchainos wallet history [--tx-hash <hash> --chain <id> --address <addr>]` | Transaction history |
| Sign | `onchainos wallet sign-message --chain <id> --from <addr> --message <msg>` | Sign message |

**Key**: `--chain` uses numeric IDs for wallet commands. `wallet send` uses `--readable-amount`.