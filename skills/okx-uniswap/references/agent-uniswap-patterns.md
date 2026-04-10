# Agent Uniswap Patterns for X Layer

> Load this file when building autonomous agent strategies that interact with Uniswap on X Layer.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Agent Loop                        │
│                                                     │
│  SENSE ──→ DECIDE ──→ ACT ──→ LOG ──→ SLEEP ──→ ↻ │
│                                                     │
│  SENSE: onchainos market/signal/ws                  │
│         + cast call (pool state)                    │
│                                                     │
│  DECIDE: Risk gates + strategy logic                │
│          (see risk-management.md)                    │
│                                                     │
│  ACT:   onchainos swap/defi/gateway                 │
│         + cast send (LP operations)                  │
│                                                     │
│  LOG:   Append action, outcome, PnL                │
└─────────────────────────────────────────────────────┘
```

## Pattern 1: Auto-Rebalancing V3 LP Agent

The most profitable agent pattern on X Layer — V3 positions that rebalance when price exits range.

### Configuration

```yaml
strategy: v3_auto_rebalance
chain: xlayer
pool: "<TOKEN0>/<TOKEN1> <FEE_TIER>%"
range_width_pct: 10          # ±10% around current price
min_apy_pct: 5               # Don't open if APY < 5%
rebalance_cooldown_min: 5    # Wait 5 min between rebalances
max_rebalances_per_day: 48    # ~every 30 min at most
position_size_usd: 100       # USD per position
gas_budget_usd: 0.50         # Daily gas budget
```

### Loop

```bash
#!/bin/bash
# Auto-rebalancing V3 LP agent on X Layer
# Gas cost per rebalance: ~$0.001-0.005

while true; do
  # SENSE: Get current price
  CURRENT_PRICE=$(onchainos market price --address <TOKEN_ADDR> --chain xlayer)

  # SENSE: Get pool state
  SLOT0=$(cast call <POOL> "slot0()(uint160,int24,uint16,uint16,uint16,uint8,bool)" --rpc-url https://rpc.xlayer.tech)
  CURRENT_TICK=$(echo "$SLOT0" | awk '{print $2}')

  # SENSE: Check position status
  POSITION=$(cast call <POSITION_MANAGER> "positions(uint256)" <TOKEN_ID> --rpc-url https://rpc.xlayer.tech)
  TICK_LOWER=$(echo "$POSITION" | awk '{print $4}')
  TICK_UPPER=$(echo "$POSITION" | awk '{print $5}')

  # DECIDE: Is position still in range?
  if [ "$CURRENT_TICK" -lt "$TICK_LOWER" ] || [ "$CURRENT_TICK" -gt "$TICK_UPPER" ]; then
    echo "Position out of range! Current tick: $CURRENT_TICK, Range: [$TICK_LOWER, $TICK_UPPER]"

    # ACT: Rebalance
    # 1. Remove liquidity
    cast send <POSITION_MANAGER> "decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))" \
      <TOKEN_ID> <LIQUIDITY> 0 0 <DEADLINE> \
      --rpc-url https://rpc.xlayer.tech --private-key <KEY>

    # 2. Collect tokens
    cast send <POSITION_MANAGER> "collect((uint256,address,uint128,uint128))" \
      <TOKEN_ID> <RECIPIENT> <MAX_UINT128> <MAX_UINT128> \
      --rpc-url https://rpc.xlayer.tech --private-key <KEY>

    # 3. Calculate new tick range (±10% around current tick)
    NEW_TICK_LOWER=$(( (CURRENT_TICK / 60) * 60 - 600 ))
    NEW_TICK_UPPER=$(( (CURRENT_TICK / 60) * 60 + 600 ))

    # 4. Open new position
    cast send <POSITION_MANAGER> "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))" \
      <TOKEN0> <TOKEN1> <FEE_TIER> <NEW_TICK_LOWER> <NEW_TICK_UPPER> <AMOUNT0> <AMOUNT1> 0 0 <RECIPIENT> <DEADLINE> \
      --rpc-url https://rpc.xlayer.tech --private-key <KEY>

    echo "Rebalanced to new range: [$NEW_TICK_LOWER, $NEW_TICK_UPPER]"
  fi

  # SLEEP: Check every 5 minutes
  sleep 300
done
```

### Enhanced Version with Security Gates

```bash
# Before every position change:
# 1. Security scan
onchainos security token-scan --address <addr> --chain xlayer

# 2. Liquidity check
onchainos token liquidity --address <addr> --chain xlayer

# 3. PnL check
onchainos market portfolio-recent-pnl --address <addr> --chain xlayer

# Only rebalance if:
# - Security scan passes (action != "block")
# - Pool liquidity > $10K
# - Daily loss < 5% of portfolio
```

## Pattern 2: Fee Harvesting Agent

Periodically collects trading fees from LP positions. On X Layer, even tiny fees are worth collecting due to near-zero gas.

```bash
#!/bin/bash
while true; do
  # Check uncollected fees
  FEES=$(cast call <POSITION_MANAGER> "positions(uint256)" <TOKEN_ID> --rpc-url https://rpc.xlayer.tech)

  # If fees > threshold (configurable, e.g., $0.10 worth)
  if [ "$(is_fee_above_threshold "$FEES")" = true ]; then
    # Collect fees
    cast send <POSITION_MANAGER> "collect((uint256,address,uint128,uint128))" \
      <TOKEN_ID> <RECIPIENT> 0xfff...fff 0xfff...fff \
      --rpc-url https://rpc.xlayer.tech --private-key <KEY>

    echo "Fees collected at $(date)"
  fi

  # Check every hour (gas cost: ~$0.001 per check)
  sleep 3600
done
```

## Pattern 3: Yield Farming Agent

Searches for high-APY DeFi products and automatically deposits.

```bash
#!/bin/bash
# Find best yield on X Layer
BEST_APY=$(onchainos defi list --chain xlayer | sort -t'|' -k3 -rn | head -1)

# Security check on underlying tokens
onchainos security token-scan --address <underlying_addr> --chain xlayer

# Deposit if APY > threshold and security checks pass
onchainos defi invest --investment-id <id> --address <addr> --token <token> --amount <amt> --chain xlayer
```

## Pattern 4: Cross-Chain Arbitrage Agent

Monitors price differences between chains and executes profitable arbitrage.

```bash
#!/bin/bash
while true; do
  # Get price on X Layer via OKX aggregator
  XLAYER_PRICE=$(onchainos swap quote --from <addr> --to <addr> --readable-amount 1 --chain xlayer)

  # Get price on Base via Uniswap Trading API
  BASE_PRICE=$(curl -s -X POST https://trade-api.gateway.uniswap.org/v1/quote \
    -H "Content-Type: application/json" -H "x-api-key: $UNISWAP_API_KEY" \
    -H "x-universal-router-version: 2.0" \
    -d '{"swapper":"0x...","tokenIn":"0x...","tokenOut":"0x...","tokenInChainId":"8453","tokenOutChainId":"8453","amount":"1000000000000000000","type":"EXACT_INPUT"}' \
    | jq -r '.quote.output.amount')

  # Calculate spread
  SPREAD=$(calculate_spread "$XLAYER_PRICE" "$BASE_PRICE")

  # Execute if spread > min_profit (gas + slippage)
  if [ "$(is_profitable "$SPREAD")" = true ]; then
    # Buy on cheaper chain, sell on more expensive
    execute_arbitrage "$XLAYER_PRICE" "$BASE_PRICE"
  fi

  sleep 60
done
```

## Pattern 5: Smart Money + Uniswap Agent

Follows smart money signals and executes on Uniswap.

```bash
#!/bin/bash
# Monitor smart money signals on X Layer
onchainos ws start --channel dex-market-new-signal-openapi --chain-index 196

# When signal arrives:
# 1. Validate: security scan, liquidity check
# 2. Size position based on risk framework (max 2% portfolio)
# 3. Execute via OKX aggregator (best price routing)
# 4. Set exit targets (take-profit, stop-loss)
# 5. Monitor and exit when targets hit
```

## Risk Management for Autonomous Agents

### Mandatory Guards

Every autonomous action must pass through:

1. **Security gate**: `onchainos security token-scan` → block if `action=block` or `isHoneyPot=true`
2. **Liquidity gate**: pool liquidity > $10K (checked via `onchainos token liquidity`)
3. **Position sizing**: max 2% risk per trade, 6% total portfolio heat
4. **Strategy alignment**: action matches configured strategy parameters
5. **Gas budget**: daily gas spend < configured threshold

### Emergency Stops

```yaml
emergency_rules:
  max_daily_loss_pct: 5          # Stop trading if daily loss exceeds 5%
  max_position_loss_pct: 10       # Close position if it drops 10%
  max_gas_spend_usd: 1.00        # Stop if daily gas > $1
  circuit_breaker_losses: 3       # Stop after 3 consecutive losing trades
  cooldown_after_stop_min: 60     # Wait 60 min before resuming
```

### Silent Mode

```yaml
# When to suppress output (reduce noise):
silent_mode:
  price_check_no_action: true     # Don't log if no action needed
  position_in_range: true         # Don't log if position is in range
  fee_collection_zero: true       # Don't log if no fees to collect
  heartbeat_interval_min: 30      # Log health check every 30 min
```

## Monitoring Dashboard

Key metrics to track for each agent:

| Metric | Target | Alert Threshold |
|---|---|---|
| Position count | 1-3 | > 5 |
| Total value locked | Varies | < 50% of start |
| Daily PnL | Positive | < -3% |
| Rebalances/day | 2-12 | > 48 |
| Gas spend/day | < $0.50 | > $1.00 |
| Fees earned/day | > gas cost | < gas cost |
| In-range time % | > 80% | < 50% |