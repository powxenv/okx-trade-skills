# X Layer Trading Strategies

> Load this file when trading, deploying, or building on X Layer. X Layer offers near-zero gas, 1-second finality, and EVM equivalence — making it the optimal chain for high-frequency trading, DeFi yield, and autonomous agent operations.

## Table of Contents

1. X Layer Advantages for Traders
2. Gas-Free DeFi Strategies
3. OKB-Native Position Strategies
4. Fast Finality Trading Patterns
5. Bridging & Cross-Chain Arbitrage
6. X Layer DeFi Ecosystem

---

## 1. X Layer Advantages for Traders

| Feature | X Layer | Ethereum | BSC | Base |
|---|---|---|---|---|
| Gas cost | ~$0.0005 | $1–50+ | $0.05–1 | $0.01–0.50 |
| Block time | ~1s | ~12s | ~3s | ~2s |
| TPS | 5,000+ | ~15 | ~100 | ~2,000 |
| Gas token | OKB | ETH | BNB | ETH |
| MEV risk | Minimal | High | Medium | Medium |
| Slippage for small trades | Near zero | Significant | Low | Low |

**Key implications**:
- **Micro-trading becomes viable**: Trades under $1 are economically possible (not true on ETH/Base)
- **Frequent rebalancing costs nothing**: Auto-compound, DCA, and arbitrage strategies are gas-free
- **No MEV concerns for most trades**: MEV protection not needed on X Layer for trades under $2,000
- **Autonomous agents can operate cheaply**: An agent executing 100 txns/day costs ~$0.05/day in gas
- **1s finality enables real-time strategies**: No 12-second wait for confirmation

## 2. Gas-Free DeFi Strategies

These strategies are uniquely viable on X Layer because gas is essentially free.

### Auto-Compounding

On expensive chains, auto-compounding fees eat into yields. On X Layer, you can compound every block:

```
Harvest rewards → Swap to deposit token → Re-deposit
Gas cost: ~$0.001 per cycle
```

**Implementation** (agent loop):
1. Monitor `onchainos defi positions` for claimable rewards
2. When rewards > threshold (even $0.01 threshold is viable), execute:
   ```bash
   onchainos defi collect --address <addr> --chain xlayer --reward-type <type> --investment-id <id> --platform-id <pid>
   onchainos swap execute --from <reward_token> --to <deposit_token> --chain xlayer --wallet <addr> --readable-amount <amt>
   onchainos defi invest --investment-id <id> --address <addr> --token <token> --amount <minimal_units> --chain xlayer
   ```

### Micro-DCA

Deposit tiny amounts at high frequency — something that loses money on gas-heavy chains:

```
DCA $10/day in 10 $1 deposits throughout the day
Gas cost on X Layer: ~$0.005 total
Gas cost on Ethereum: ~$5–50 total (makes this strategy unprofitable)
```

### Frequent Rebalancing

Rebalance portfolio allocations daily or even hourly without gas concern:

1. Check `onchainos portfolio all-balances --address <addr> --chains xlayer`
2. Compare allocations to target weights
3. Swap overweight to underweight tokens
4. Gas cost for 5 swaps: ~$0.002

### Limit Order Simulation

While DEX limit orders aren't natively supported, an agent can simulate them:

1. Monitor `onchainos market price --address <addr> --chain xlayer` via WebSocket
2. When price hits target, execute `onchainos swap execute`
3. 1-second finality means your "limit order" fills almost instantly
4. Gas cost per attempt (if price doesn't hit): $0

## 3. OKB-Native Position Strategies

OKB is X Layer's native gas token. This creates unique opportunities.

### OKB as Base Asset

- OKB has a fixed supply (21M post-burns) — deflationary over time
- As X Layer TVL grows, OKB demand increases
- OKB staking/yield products available via `onchainos defi search --token OKB --chain xlayer`
- Gas fees are so low that OKB requirements are minimal — most of your OKB can be deployed in yield positions

### OKB-Linked Strategies

```bash
# Search for OKB yield products
onchainos defi search --token OKB --chain xlayer --product-group SINGLE_EARN

# Search for OKB liquidity pools
onchainos defi search --token OKB --chain xlayer --product-group DEX_POOL

# Check OKB price
onchainos market price --address 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee --chain xlayer
# Note: On X Layer, native OKB address is 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
```

### X Layer Gas-Free Transfers

All native token transfers (OKB, XLayer ETH-wrapped) are gas-free:
- `onchainos wallet send --readable-amount "0.5" --receipt <addr> --chain 196`
- No need to worry about gas costs for portfolio transfers

## 4. Fast Finality Trading Patterns

### Rapid Quote-Execute Loop

X Layer's 1-second finality enables strategies impossible on slower chains:

```
1. Get quote: onchainos swap quote --from <token_a> --to <token_b> --chain xlayer --readable-amount <amt>
2. Evaluate: check price impact, slippage, profitability
3. Execute: onchainos swap execute (if profitable)
4. Total cycle time: ~3-5 seconds (quote + execute + confirm)
```

Compare to Ethereum: same cycle takes 30-60 seconds, during which price may have moved significantly.

### Arbitrage Detection & Execution

On X Layer, you can detect and execute cross-DEX arbitrage in seconds:

1. Monitor prices on X Layer DEXes via `onchainos ws start --channel price`
2. Detect price discrepancy between pools
3. Execute arbitrage via `onchainos swap execute`
4. No MEV risk for sub-$2,000 trades

### Snapshot Trading

Use WebSocket monitoring for instant reaction to market events:

```bash
# Monitor smart money signals on X Layer
onchainos ws start --channel dex-market-new-signal-openapi --chain-index 196

# Monitor specific token price on X Layer
onchainos ws start --channel price --token-pair 196:<token_address>

# Poll for events
onchainos ws poll --id <session_id>
```

## 5. Bridging & Cross-Chain Arbitrage

### Bridge Assets to X Layer

X Layer Bridge enables moving assets between Ethereum L1 and X Layer:

1. Bridge ETH/USDC from Ethereum to X Layer via the official bridge
2. Gas cost to bridge: depends on L1 gas (one-time cost)
3. Once on X Layer: near-zero gas for all subsequent operations

### Cross-Chain Yield Comparison

```bash
# Compare yields across chains for the same token
onchainos defi search --token USDC --chain xlayer --product-group SINGLE_EARN
onchainos defi search --token USDC --chain ethereum --product-group SINGLE_EARN
onchainos defi search --token USDC --chain base --product-group SINGLE_EARN

# Compare by APY, factoring in gas:
# X Layer: APY - ~$0.001 gas per tx = nearly full APY realized
# Ethereum: APY - ~$5–50 gas per tx = significantly reduced real yield for small positions
```

### Cross-Chain Arbitrage Workflow

1. Monitor prices on multiple chains:
   ```bash
   onchainos market price --address <addr_eth> --chain ethereum   # ETH price
   onchainos market price --address <addr_xlayer> --chain xlayer  # X Layer price
   ```

2. Detect price difference > bridge fee + gas
3. Execute arbitrage:
   - Buy on cheaper chain
   - Bridge to more expensive chain
   - Sell on more expensive chain

4. On X Layer, gas is negligible — bridge fee is the main cost

## 6. X Layer DeFi Ecosystem

### Finding X Layer Products

```bash
# List supported DeFi chains
onchainos defi support-chains

# Search for products on X Layer
onchainos defi list --chain xlayer

# Search by token
onchainos defi search --token USDC --chain xlayer
onchainos defi search --token OKB --chain xlayer
onchainos defi search --token ETH --chain xlayer

# Search by product group
onchainos defi search --chain xlayer --product-group SINGLE_EARN   # Savings/staking
onchainos defi search --chain xlayer --product-group DEX_POOL       # Liquidity pools
onchainos defi search --chain xlayer --product-group LENDING        # Lending/borrowing
```

### X Layer-Specific Considerations

- **Chain ID**: Use `xlayer` or `196` as the chain parameter
- **Native token**: OKB, address `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`
- **Address format**: EVM (`0x...`) addresses, same as other EVM chains
- **MEV Protection**: Generally not needed on X Layer (gas is ~$0.0005, MEV extraction unprofitable for most trades)
- **Finality**: ~1 second for most transactions
- **DeFi positions**: View with `onchainos defi positions --address <addr> --chains xlayer`

### Deploying Smart Contracts on X Layer

For hackathon participants building X Layer Arena projects:

- X Layer is EVM-equivalent — deploy existing Solidity contracts without modification
- Gas-free development makes testing and iteration significantly faster
- Use `onchainos wallet contract-call` for contract interactions
- Use `onchainos gateway` for broadcasting signed transactions
- OKB is the gas token — fund your contract with a small amount for gas

### X Layer Chain Reference

| Parameter | Value |
|---|---|
| Chain name | `xlayer` |
| Chain index | `196` |
| RPC URL | https://rpc.xlayer.tech |
| Block explorer | https://www.oklink.com/xlayer |
| Bridge | https://www.okx.com/web3/build/xlayer-bridge |
| Native token | OKB |
| Gas token address | `0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` |
| Block time | ~1 second |
| Average gas cost | ~$0.0005 USD |