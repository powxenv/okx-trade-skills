# CLI Reference: Swap & Gateway

> Load this file when you need detailed command parameters for swap or gateway commands.

## Table of Contents

1. onchainos swap chains
2. onchainos swap liquidity
3. onchainos swap approve
4. onchainos swap quote
5. onchainos swap execute
6. onchainos swap swap (calldata-only)
7. onchainos gateway chains
8. onchainos gateway gas
9. onchainos gateway gas-limit
10. onchainos gateway simulate
11. onchainos gateway broadcast
12. onchainos gateway orders

---

## 1. onchainos swap chains

Get supported DEX chains. No parameters.

## 2. onchainos swap liquidity

Get liquidity sources on a chain.

```bash
onchainos swap liquidity --chain <chain>
```

## 3. onchainos swap approve

Get ERC-20 approval transaction data.

```bash
onchainos swap approve --token <address> --amount <amount> --chain <chain>
```

| Param | Required | Description |
|---|---|---|
| `--token` | Yes | Token contract address to approve |
| `--amount` | Yes | Amount in minimal units |
| `--chain` | Yes | Chain name |

## 4. onchainos swap quote

Get swap quote (read-only, no execution).

```bash
onchainos swap quote --from <addr> --to <addr> --readable-amount <amt> --chain <chain> [--swap-mode <mode>]
```

| Param | Required | Default | Description |
|---|---|---|---|
| `--from` | Yes | - | Source token address |
| `--to` | Yes | - | Destination token address |
| `--readable-amount` | One of | - | Human-readable sell amount (e.g. "1.5") |
| `--amount` | One of | - | Amount in minimal units (mutually exclusive with `--readable-amount`) |
| `--chain` | Yes | - | Chain name |
| `--swap-mode` | No | `exactIn` | `exactIn` or `exactOut` |

**No `--slippage` param on quote.**

## 5. onchainos swap execute

One-shot swap: quote → approve (if needed) → sign → broadcast → txHash.

```bash
onchainos swap execute --from <addr> --to <addr> --readable-amount <amt> --chain <chain> --wallet <addr> [--slippage <pct>] [--gas-level <level>] [--swap-mode <mode>] [--mev-protection] [--tips <sol>]
```

| Param | Required | Default | Description |
|---|---|---|---|
| `--from` | Yes | - | Source token address |
| `--to` | Yes | - | Destination token address |
| `--readable-amount` | One of | - | Human-readable sell amount |
| `--amount` | One of | - | Amount in minimal units |
| `--chain` | Yes | - | Chain name |
| `--wallet` | Yes | - | User's wallet address |
| `--slippage` | No | autoSlippage | Slippage tolerance % (e.g. "1") |
| `--gas-level` | No | `average` | `slow`, `average`, `fast` |
| `--swap-mode` | No | `exactIn` | `exactIn` or `exactOut` |
| `--mev-protection` | No | - | Enable MEV protection (EVM: ETH/BSC/Base) |
| `--tips` | No | - | Jito tips in SOL (Solana only, mutually exclusive with computeUnitPrice) |

**Returns**: `{ approveTxHash?, swapTxHash, fromAmount, toAmount, priceImpact, gasUsed }`

## 6. onchainos swap swap

Calldata only — returns unsigned transaction data. Does NOT sign or broadcast.

```bash
onchainos swap swap --from <addr> --to <addr> --readable-amount <amt> --chain <chain> --wallet <addr> [--slippage <pct>] [--swap-mode <mode>] [--tips <sol>]
```

Returns: `{ routerResult, tx: { to, data, gas, gasPrice, value, minReceiveAmount } }`

Do NOT call `gateway broadcast` — user handles signing and broadcasting.

---

## 7. onchainos gateway chains

Get supported chains for gateway. No parameters.

## 8. onchainos gateway gas

Current gas prices for a chain.

```bash
onchainos gateway gas --chain <chain>
```

## 9. onchainos gateway gas-limit

Estimate gas limit for a transaction.

```bash
onchainos gateway gas-limit --from <addr> --to <addr> --chain <chain> [--data <hex>] [--value <wei>]
```

## 10. onchainos gateway simulate

Simulate a transaction (dry-run).

```bash
onchainos gateway simulate --from <addr> --to <addr> --chain <chain> [--data <hex>] [--value <wei>]
```

## 11. onchainos gateway broadcast

Broadcast a signed transaction.

```bash
onchainos gateway broadcast --signed-tx <hex_or_base58> --address <addr> --chain <chain>
```

| Param | Required | Description |
|---|---|---|
| `--signed-tx` | Yes | Signed transaction (hex for EVM, base58 for Solana) |
| `--address` | Yes | Sender address |
| `--chain` | Yes | Chain name |

**Solana**: signed tx uses base58 encoding. **This skill does NOT sign transactions.**

## 12. onchainos gateway orders

Track broadcast order status.

```bash
onchainos gateway orders --address <addr> --chain <chain> [--order-id <id>]
```