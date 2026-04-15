# Native Token Addresses

> Use these addresses when swapping to/from native tokens. Do NOT use `token search` for native tokens.

| Chain | Native Token | Address |
|---|---|---|
| EVM (Ethereum, BSC, Polygon, Arbitrum, Base, etc.) | ETH/BNB/MATIC/etc. | `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` |
| Solana | SOL | `11111111111111111111111111111111` |
| Sui | SUI | `0x2::sui::SUI` |
| Tron | TRX | `T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb` |
| Ton | TON | `EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c` |

## CLI Token Map Shortcuts

The `onchainos swap` CLI accepts these shortcuts as `--from`/`--to` values:

- **Native**: `sol`, `eth`, `bnb`, `okb`, `matic`, `pol`, `avax`, `ftm`, `trx`, `sui`
- **Stablecoins**: `usdc`, `usdt`, `dai`
- **Wrapped**: `weth`, `wbtc`, `wbnb`, `wmatic`

## wSOL for Market/Token Commands

For `market price`, `market kline`, `token price-info`, and similar read-only commands on Solana, use the **wSOL** SPL token address instead of the native address:

```
So11111111111111111111111111111111111111112
```

Note: For **swap** operations, always use the native SOL address (`11111111111111111111111111111111`).