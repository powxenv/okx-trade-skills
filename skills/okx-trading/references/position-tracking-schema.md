# Position Tracking Schema

Standard state format for tracking open positions, risk limits, and trade history. Use this schema to persist state across sessions — the skills themselves do not track this data.

## Position Schema

Track each open position:

```json
{
  "id": "pos-001",
  "token": {
    "symbol": "PEPE",
    "address": "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    "chain": "ethereum",
    "name": "Pepe"
  },
  "entry": {
    "price_usd": 0.00001234,
    "amount": 1000000,
    "cost_usd": 12.34,
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "risk": {
    "stop_loss_pct": 5.0,
    "stop_loss_price": 0.00001172,
    "take_profit_pct": 10.0,
    "take_profit_price": 0.00001357,
    "trailing_stop": false,
    "trailing_distance_pct": null
  },
  "meta": {
    "score": 79,
    "strategy": "momentum",
    "notes": "Smart money accumulating, moderate concentration"
  },
  "status": "open"
}
```

## Risk State Schema

Track daily and session risk limits:

```json
{
  "date": "2025-01-15",
  "risk_parameters": {
    "risk_per_trade_pct": 1.0,
    "max_portfolio_heat_pct": 6.0,
    "max_single_position_pct": 10.0,
    "max_daily_trades": 10,
    "max_daily_loss_pct": 5.0,
    "stop_loss_pct": 5.0,
    "take_profit_pct": 10.0,
    "auto_mode": "manual"
  },
  "daily_state": {
    "trades_executed": 3,
    "daily_pnl_usd": -2.45,
    "daily_pnl_pct": -0.8,
    "portfolio_heat_pct": 3.2,
    "is_halted": false,
    "halt_reason": null,
    "halt_until": null
  },
  "portfolio_snapshot": {
    "total_value_usd": 500.00,
    "open_positions": 2,
    "available_capital_usd": 350.00,
    "timestamp": "2025-01-15T14:00:00Z"
  }
}
```

## Trade Log Schema

Log every trade for audit and analysis:

```json
{
  "id": "trade-001",
  "timestamp": "2025-01-15T10:30:00Z",
  "type": "buy",
  "token": {
    "symbol": "PEPE",
    "address": "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    "chain": "ethereum"
  },
  "execution": {
    "amount": 1000000,
    "price_usd": 0.00001234,
    "total_usd": 12.34,
    "slippage_pct": 0.3,
    "gas_usd": 1.20,
    "mev_protection": true,
    "tx_hash": "0xabc123..."
  },
  "reasoning": {
    "trigger": "signal",
    "score": 79,
    "factors": ["smart_money_accumulating", "liquidity_adequate", "security_pass"],
    "strategy": "momentum"
  },
  "risk_check": {
    "portfolio_heat_before": 2.1,
    "portfolio_heat_after": 3.2,
    "daily_trades_before": 2,
    "daily_trades_after": 3,
    "approved": true
  },
  "position_id": "pos-001"
}
```

## State File Structure

Recommended file layout:

```
~/.onchainos-state/
├── positions.json        # Array of position objects
├── risk-state.json       # Current risk state
├── trade-log.jsonl       # Append-only trade log (one JSON per line)
└── config.json           # Risk parameters (persisted)
```

### config.json — Risk Parameters

```json
{
  "risk_per_trade_pct": 1.0,
  "max_portfolio_heat_pct": 6.0,
  "max_single_position_pct": 10.0,
  "max_daily_trades": 10,
  "max_daily_loss_pct": 5.0,
  "default_stop_loss_pct": 5.0,
  "default_take_profit_pct": 10.0,
  "auto_mode": "manual",
  "meme_token_risk_multiplier": 0.5
}
```

## Pre-Trade Checklist

Before every trade, verify:

1. Load `risk-state.json` → check `is_halted` is false
2. Check `daily_state.trades_executed` < `risk_parameters.max_daily_trades`
3. Check `daily_state.daily_pnl_pct` > `-risk_parameters.max_daily_loss_pct`
4. Calculate new `portfolio_heat_pct` after trade → must be < `max_portfolio_heat_pct`
5. Position size must not exceed `max_single_position_pct` of portfolio
6. Run security scan → `action` must not be `"block"`
7. Log the trade to `trade-log.jsonl`
8. Update `positions.json` or `risk-state.json`

## State Recovery

If state is lost or corrupted:

1. Rebuild positions from `trade-log.jsonl` (authoritative source)
2. Verify positions against on-chain state:
   ```bash
   onchainos wallet balance --chain <chain>
   onchainos portfolio all-balances --address <addr> --chains <chains>
   ```
3. Recalculate portfolio heat and daily PnL from trade log
4. Reset daily counters at midnight UTC

## Integration with onchainos Commands

| Action | Command | State Update |
|---|---|---|
| Check portfolio value | `portfolio total-value` | Update `portfolio_snapshot.total_value_usd` |
| Check token balance | `wallet balance --chain <c>` | Verify position amounts |
| Execute swap | `swap execute` | Create trade log entry, update position |
| Check price | `market price` | Update position current value |
| Security scan | `security token-scan` | Store score in position meta |
| Get PnL | `market portfolio-recent-pnl` | Cross-check against trade log |
