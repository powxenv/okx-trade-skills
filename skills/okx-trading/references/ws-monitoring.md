# WebSocket Real-time Monitoring

> Load this file when the user wants real-time streaming data for prices, trades, signals, or meme tokens.

## CLI Approach (Recommended for Quick Monitoring)

The `onchainos ws` CLI provides simple real-time monitoring:

### Start a WebSocket Session

```bash
onchainos ws start --channel <channel> [--token-pair <pair>] [--chain-index <idx>] [--wallet-addresses <addrs>] [--idle-timeout <seconds>]
```

### Poll Events

```bash
onchainos ws poll --id <session_id>
```

### Stop a Session

```bash
onchainos ws stop --id <session_id>
```

### List Sessions

```bash
onchainos ws list
```

### List Available Channels

```bash
onchainos ws channels
```

### Get Channel Info

```bash
onchainos ws channel-info --channel <channel>
```

## Channel Quick Reference

| Channel | Purpose | Required Params |
|---|---|---|
| `price` | Real-time token price | `--token-pair <chainIdx>:<addr>` |
| `dex-token-candle1m` | 1-min candlestick | `--token-pair <chainIdx>:<addr>` |
| `dex-token-candle5m` | 5-min candlestick | `--token-pair <chainIdx>:<addr>` |
| `dex-token-candle15m` | 15-min candlestick | `--token-pair <chainIdx>:<addr>` |
| `dex-token-candle30m` | 30-min candlestick | `--token-pair <chainIdx>:<addr>` |
| `dex-token-candle1H` | 1-hour candlestick | `--token-pair <chainIdx>:<addr>` |
| `price-info` | Detailed price + mcap + volume + holders | `--token-pair <chainIdx>:<addr>` |
| `trades` | Real-time buy/sell feed | `--token-pair <chainIdx>:<addr>` |
| `dex-market-new-signal-openapi` | Buy signal alerts | `--chain-index <idx>[,<idx>]` |
| `kol_smartmoney-tracker-activity` | KOL + smart money trades | (none) |
| `address-tracker-activity` | Custom wallet tracking | `--wallet-addresses <addr1,addr2>` |
| `dex-market-memepump-new-token-openapi` | New meme token launches | `--chain-index <idx>` |
| `dex-market-memepump-update-metrics-openapi` | Meme token metric updates | `--chain-index <idx>` |

## Common Monitoring Workflows

### Watch Token Price

```bash
# Start price monitoring
onchainos ws start --channel price --token-pair 1:0xdac17f958d2ee523a2206206994597c13d831ec7

# Poll for updates
onchainos ws poll --id <ID>
```

### Monitor Smart Money Activity

```bash
# KOL + smart money trade feed
onchainos ws start --channel kol_smartmoney-tracker-activity

# Track specific wallets
onchainos ws start --channel address-tracker-activity --wallet-addresses 0xAAA,0xBBB
```

### Meme Token Discovery (Real-time)

```bash
# New meme token launches on Solana
onchainos ws start --channel dex-market-memepump-new-token-openapi --chain-index 501

# Meme token metric updates
onchainos ws start --channel dex-market-memepump-update-metrics-openapi --chain-index 501
```

### Buy Signal Alerts

```bash
# Smart money + whale buy signals on Ethereum + Solana
onchainos ws start --channel dex-market-new-signal-openapi --chain-index 1,501
```

## Token Pair Format

`--token-pair` uses `<chainIndex>:<contractAddress>` format:
- Ethereum USDC: `1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`
- Solana wSOL: `501:So11111111111111111111111111111111112`

## Idle Timeout

Default idle timeout is 300 seconds. Use `--idle-timeout <seconds>` to customize.