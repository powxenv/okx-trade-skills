# Shared Chain Name Support

> This file is shared across all onchainos skills.

The CLI accepts human-readable chain names and resolves them automatically.

## Primary Chains

| Chain | Name | chainIndex |
|---|---|---|
| XLayer | `xlayer` | `196` |
| Solana | `solana` or `sol` | `501` |
| Ethereum | `ethereum` or `eth` | `1` |
| Base | `base` | `8453` |
| BSC | `bsc` or `bnb` | `56` |
| Arbitrum | `arbitrum` or `arb` | `42161` |

## Extended Chains

| Chain | Name | chainIndex |
|---|---|---|
| Polygon | `polygon` or `matic` | `137` |
| Avalanche | `avalanche` or `avax` | `43114` |
| Optimism | `optimism` or `op` | `10` |
| zkSync Era | `zksync` | `324` |
| Linea | `linea` | `59144` |
| Scroll | `scroll` | `534352` |
| Sui | `sui` | `784` |
| Tron | `tron` or `trx` | `195` |
| TON | `ton` | `607` |
| Fantom | `fantom` or `ftm` | `250` |

## address format Rules

- EVM addresses (`0x...`) work across Ethereum/BSC/Polygon/Arbitrum/Base/etc. — 42 chars, `0x`-prefixed, lowercase for contract addresses
- Solana addresses are **Base58**, 32-44 chars
- Sui addresses use `0x...` format but are NOT EVM-compatible
- Tron addresses start with `T`
- NEVER mix address formats across chain types
- XKO prefix (`XKO...`) is not supported — convert to `0x` first