# Bonding Curve Mathematics

> Load this file when analyzing pump.fun or similar bonding curve tokens to understand price mechanics, entry timing, and market cap calculations.

## Overview

Pump.fun and similar launchpads use bonding curves to determine token prices. Understanding the mathematics behind these curves is essential for timing entries and calculating potential returns. Unlike traditional DEX pricing (constant product AMM like Uniswap), bonding curves have specific properties that create both opportunities and traps for traders.

## How Bonding Curves Work on Pump.fun

### Basic Mechanics

A bonding curve defines the relationship between the token supply and its price. On pump.fun:

1. **Tokens are minted on demand** -- There is no fixed supply at launch. Tokens are created as people buy.
2. **Price increases with each buy** -- Every purchase pushes the price higher along the curve.
3. **Price decreases with each sell** -- Selling pushes the price lower along the curve.
4. **No traditional liquidity pool initially** -- Price is determined purely by the bonding curve formula, not by a constant-product AMM.
5. **Migration threshold** -- When enough SOL has been raised (typically ~$69K worth of SOL on pump.fun), the token "graduates" and migrates to a DEX (like Raydium on Solana) where traditional AMM pricing takes over.

### Virtual vs. Real Reserves

The bonding curve can be modeled as a virtual constant-product AMM:

```
k = virtual_sol_reserve * virtual_token_reserve

Where:
- virtual_sol_reserve = real_sol_deposited + initial_virtual_sol
- virtual_token_reserve = total_tokens_minted + initial_virtual_tokens
- k is constant for the curve
- initial_virtual_sol and initial_virtual_tokens are set at launch to
  establish the starting price
```

**Price at any point:**
```
price_in_sol = virtual_sol_reserve / virtual_token_reserve
```

**Market cap in SOL:**
```
market_cap_sol = price_in_sol * total_supply
```

**Market cap in USD:**
```
market_cap_usd = market_cap_sol * sol_price_usd
```

### Key Parameters (Pump.fun Defaults)

| Parameter | Typical Value | Purpose |
|---|---|---|
| `initial_virtual_sol` | ~30 SOL | Sets the starting price floor |
| `initial_virtual_tokens` | ~1,073,000,000 tokens | Sets the starting price |
| `migration_threshold` | ~85 SOL (~$12K-15K depending on SOL price) | When token migrates to DEX |
| `curve_progress` | 0-100% | How close to migration threshold |
| `total_supply` | ~1,000,000,000 tokens | Standard pump.fun supply |

Note: Exact parameters may change over time. Always verify with current `memepump token-details` output.

## Price Impact Calculations

### Buying: How Much Price Moves Up

When a buyer spends `delta_sol` SOL on the bonding curve:

```
New virtual_sol_reserve = old_virtual_sol_reserve + delta_sol
New virtual_token_reserve = old_virtual_token_reserve - tokens_received

Where:
tokens_received = old_virtual_token_reserve - (k / new_virtual_sol_reserve)

Price increase = (new_price - old_price) / old_price * 100%
```

**Practical implications:**
- Early buys have lower price impact (more tokens per SOL)
- Late buys on the curve have higher price impact (fewer tokens per SOL)
- A 1 SOL buy early might get 10M tokens; the same 1 SOL near migration might get 1M tokens
- This is why early entry is mechanically advantageous

### Selling: How Much Price Moves Down

When a seller sells `delta_tokens` tokens:

```
New virtual_token_reserve = old_virtual_token_reserve + delta_tokens
sol_received = old_virtual_sol_reserve - (k / new_virtual_token_reserve)

Price decrease = (old_price - new_price) / old_price * 100%
```

**Practical implications:**
- Large sells cause proportionally larger price drops
- Selling 10% of your tokens does NOT reduce the price by 10% -- the impact is amplified by the curve shape
- This is why large holders ("whales") can crash bonding curve tokens with a single sell

### Effective Slippage on Bonding Curves

Unlike DEX swaps where slippage comes from the pool size, bonding curve slippage comes from the curve shape:

```
effective_slippage = (average_price - starting_price) / starting_price * 100%

Where:
average_price = total_sol_spent / total_tokens_received
starting_price = price before the buy
```

For a buy of `X` SOL on a curve with virtual reserves `V_sol` and `V_tok`:

```
slippage_approx = X / (2 * V_sol) * 100%
```

This means:
- A 1 SOL buy on a 30 SOL virtual reserve ≈ 1.7% slippage
- A 5 SOL buy on a 30 SOL virtual reserve ≈ 8.3% slippage
- A 10 SOL buy on a 30 SOL virtual reserve ≈ 16.7% slippage

**Rule of thumb**: On a fresh pump.fun token, buying more than 2-3 SOL at once incurs significant slippage.

## Market Cap Progression

### Estimating Market Cap at Each Stage

```
Stage 1: Launch (0% curve progress)
  - Market cap: ~$4,000-8,000
  - Price per token: Very low
  - Risk: Highest (no history, dev may rug)

Stage 2: Early momentum (10-30% curve progress)
  - Market cap: $6,000-15,000
  - Initial buyers showing profit
  - Risk: High (still unproven, snipers may dump)

Stage 3: Growing interest (30-60% curve progress)
  - Market cap: $12,000-25,000
  - Community forming, social signals appearing
  - Risk: Moderate (more data available, but late entry)

Stage 4: Near migration (60-85% curve progress)
  - Market cap: $20,000-35,000
  - Momentum traders entering
  - Risk: Lower (migration creates DEX liquidity) but price already high

Stage 5: Migration (100% curve progress)
  - Market cap: $30,000-50,000+
  - Token moves to Raydium or similar DEX
  - New price discovery phase begins on open market
```

### Post-Migration Price Dynamics

When a token migrates from the bonding curve to a DEX:

1. **Liquidity pool is created** -- The SOL raised during the bonding curve phase is paired with tokens in a new DEX pool.
2. **Price may gap up or down** -- The migration itself can cause a price discontinuity as DEX pricing takes over.
3. **New trading dynamics** -- Standard AMM pricing (constant product) replaces the bonding curve.
4. **LP tokens may be burned** -- If the developer burns LP tokens, the liquidity is permanently locked. If not, they can withdraw liquidity (rug pull risk).

## Entry Timing Analysis

### Optimal Entry Windows

```
Window 1: First 1-5 minutes (Highest Risk / Highest Reward)
  - Curve progress: 0-5%
  - Requires: Rapid analysis (security scan + dev check in < 2 min)
  - Advantage: Lowest price, maximum upside
  - Danger: Most likely window for sniper activity, dev may rug immediately

Window 2: 5-30 minutes (High Risk / High Reward)
  - Curve progress: 5-20%
  - Requires: Complete analysis pipeline
  - Advantage: Early data available (can see bundler patterns)
  - Danger: Sniper sell-off may be starting

Window 3: 30 minutes - 2 hours (Moderate Risk / Moderate Reward)
  - Curve progress: 15-50%
  - Requires: Full safety score analysis
  - Advantage: Pattern clarity, snipers have sold
  - Danger: Entry price is higher, less upside remaining

Window 4: Pre-migration momentum (Moderate Risk / Lower Reward)
  - Curve progress: 50-85%
  - Requires: Confirmation of strong community and organic demand
  - Advantage: Migration creates new demand from DEX traders
  - Danger: Already expensive, migration may fail or underwhelm

Window 5: Post-migration (Standard Trading Risk)
  - Token is on DEX with standard AMM pricing
  - Use standard trading analysis (not bonding curve-specific)
  - Check new liquidity pool depth and LP burn status
```

### Calculating Potential Returns

For a buy at `curve_progress_current`%, the potential return at migration:

```
price_at_entry = current_market_cap / total_supply
price_at_migration ≈ migration_threshold_market_cap / total_supply

potential_return = (price_at_migration - price_at_entry) / price_at_entry * 100%

Simplified:
potential_return = (migration_market_cap / current_market_cap - 1) * 100%
```

Example:
```
Current market cap: $10,000
Migration threshold market cap: ~$40,000
Potential return to migration: (40000/10000 - 1) * 100% = 300%
```

Note: This is the theoretical return if the token successfully migrates. Many tokens never reach migration.

### Calculating Risk/Reward

```
risk_score = 1 - (safety_score / 100)
reward_potential = potential_return / 100

risk_reward_ratio = risk_score / reward_potential

Interpretation:
- Ratio < 0.3: Excellent risk/reward
- Ratio 0.3-0.6: Good risk/reward
- Ratio 0.6-1.0: Marginal risk/reward
- Ratio > 1.0: Poor risk/reward (risk exceeds potential reward)
```

## Practical Commands

```bash
# Get current bonding curve status
onchainos memepump token-details --address <addr>
# Look for: curveProgress, marketCap, volume, creationTime

# Get current price for market cap calculation
onchainos token price-info --address <addr> --chain <chain>
# Look for: price, marketCap, volume24h, priceChange24h

# Check if token has migrated (look for DEX liquidity)
onchainos token liquidity --address <addr> --chain <chain>
# If liquidity pools exist on DEX, token has migrated

# Monitor price action for entry timing
onchainos market kline --address <addr> --chain <chain>
# Use candlestick data to identify momentum patterns
```

## Common Bonding Curve Traps

### Trap 1: The Curve Ceiling

The bonding curve price accelerates as it approaches migration. Buying at 80%+ curve progress means:
- You are buying at a near-peak bonding curve price
- Post-migration, the token may actually trade LOWER than the bonding curve price
- The natural "migration pump" may not materialize

**Avoid**: Buying tokens at > 75% curve progress unless there is exceptional social/organic demand.

### Trap 2: The Sniper Dump Window

Snipers who bought at launch will sell during the 5-30 minute window. This creates a price dip that can look like a "buying opportunity" but is actually the token settling to its natural price after artificial inflation.

**Strategy**: If sniper activity was detected, wait at least 30-60 minutes for the sniper dump window to pass before entering.

### Trap 3: The Migration Failure

Not all tokens that reach high curve progress actually migrate. Some fail at the migration step due to technical issues or developer action. Buying near migration carries the risk that migration never happens and the bonding curve liquidity is all that exists.

**Mitigation**: Check `token-dev-info` for migration success history. Developers who have successfully migrated previous tokens are more likely to do so again.

### Trap 4: The False Momentum

Rapid curve progress driven by a small number of large buys (whales or bundles) is not the same as organic momentum. A token at 50% curve progress driven by 3 wallets is much riskier than one at 50% driven by 300 wallets.

**Check**: Use `token holders` and `cluster-overview` to distinguish between concentrated and distributed buying.

## Key Formulas Quick Reference

```
Token price (in SOL)       = virtual_sol_reserve / virtual_token_reserve
Market cap (in SOL)        = price_sol * total_supply
Market cap (in USD)        = market_cap_sol * sol_price_usd
Curve progress             = real_sol_deposited / migration_threshold * 100%
Slippage approximation     = buy_amount_sol / (2 * virtual_sol_reserve) * 100%
Tokens received from buy   = v_tok - (k / (v_sol + delta_sol))
SOL received from sell     = v_sol - (k / (v_tok + delta_tok))
Potential return to migration = (migration_mcap / current_mcap - 1) * 100%
```

## Important Notes

- Bonding curve parameters are platform-specific. Pump.fun on Solana uses different defaults than FourMeme on BSC. Always check the specific platform's parameters.
- The bonding curve model described here is the standard constant-product variant used by pump.fun. Other platforms may use linear, exponential, or other curve shapes.
- Market cap calculations on bonding curves can be misleading because the price is not determined by open market forces. The "market cap" is a theoretical value based on the current curve price.
- Post-migration tokens enter standard price discovery. Do not apply bonding curve analysis to migrated tokens.
- Always use `memepump token-details` to confirm current curve progress before making entry timing decisions.
