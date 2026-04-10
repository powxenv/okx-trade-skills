# Uniswap Integration Guide

> **For full Uniswap protocol integration, load the dedicated `okx-uniswap` skill.** This reference provides a brief overview of how OKX OnchainOS and Uniswap complement each other.

## OnchainOS vs Uniswap: Complementary Roles

| Capability | OnchainOS (`onchainos`) | Uniswap Direct |
|---|---|---|
| Token swap execution | OKX DEX aggregator (500+ sources, includes Uniswap) | Uniswap Trading API or direct contracts |
| Best price routing | Aggregates across all DEXes | Uniswap pools + UniswapX auction |
| V3 LP management | Basic invest/withdraw via `onchainos defi` | Advanced: mint, rebalance, collect via contracts |
| x402 payments | `onchainos payment x402-pay` | Tempo CLI + Trading API |
| Market data | `onchainos market price/kline/portfolio-*` | DexScreener, pool state queries |
| Security | `onchainos security token-scan` | On-chain contract verification |
| X Layer support | Full support | Direct contracts (if deployed) |

**Use OnchainOS for**: research, security, best-price swaps, portfolio management, and DeFi yield.

**Use Uniswap direct for**: V3 concentrated liquidity management, Trading API swaps on supported chains, and x402 payment flows.

**Best results**: Combine both — use OnchainOS for research and security, then execute via the optimal path.

## Quick Comparison for Swaps

```bash
# OKX aggregator (best price, includes Uniswap routing)
onchainos swap quote --from <addr> --to <addr> --readable-amount 1 --chain xlayer
onchainos swap execute --from <addr> --to <addr> --readable-amount 1 --chain xlayer --wallet <addr>

# Uniswap Trading API (Uniswap-only, supported chains)
# See okx-uniswap skill for full Trading API documentation
curl -s -X POST https://trade-api.gateway.uniswap.org/v1/quote -d '{...}'
```

## X Layer + Uniswap

X Layer's near-zero gas ($0.0005/tx) and 1-second finality make V3 LP management viable at agent speeds:

- **Rebalance every 5 minutes**: ~$4.32/day in gas
- **Collect fees hourly**: ~$0.36/day in gas
- **Open/close positions daily**: ~$0.45/day in gas

These costs make active V3 strategies profitable on X Layer — see the `okx-uniswap` skill for complete agent patterns.

## Next Steps

- **Load the `okx-uniswap` skill** for: V3 LP management, Trading API reference, x402 payments, agent automation patterns
- **Use this skill (`okx-trading`)** for: security scanning, market data, portfolio PnL, and OKX DEX aggregator swaps