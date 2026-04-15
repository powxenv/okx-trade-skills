# Trade Log Schema

Standard format for logging protective actions, monitoring events, and risk state changes.

## Protective Action Log

Log every automated or manual protective action:

```json
{
  "id": "action-001",
  "timestamp": "2025-01-15T10:30:00Z",
  "type": "stop_loss",
  "trigger": {
    "rule": "execute_stop_loss",
    "risk_level": 3,
    "token": "0x1234...abcd",
    "chain": "ethereum",
    "trigger_price": 2680.00,
    "threshold_price": 2700.00
  },
  "action": {
    "type": "sell_all",
    "token": "0x1234...abcd",
    "amount": 0.5,
    "executed_price": 2678.50,
    "received_usd": 1339.25,
    "slippage_pct": 0.06,
    "gas_usd": 1.20,
    "tx_hash": "0xdef456..."
  },
  "result": {
    "success": true,
    "portfolio_value_after": 4539.25,
    "loss_prevented_usd": null,
    "notes": "Stop-loss executed at -10% from entry $3000"
  }
}
```

## Monitoring Event Log

Log routine monitoring checks and their results:

```json
{
  "id": "monitor-001",
  "timestamp": "2025-01-15T10:00:00Z",
  "type": "routine_check",
  "checks_performed": [
    {
      "check": "portfolio_value",
      "result": 4540.50,
      "status": "normal"
    },
    {
      "check": "approvals",
      "new_approvals": 0,
      "status": "clean"
    },
    {
      "check": "price_alerts",
      "tokens_checked": 3,
      "alerts_triggered": 0,
      "status": "normal"
    }
  ],
  "overall_risk_level": 1,
  "next_check": "2025-01-15T10:30:00Z"
}
```

## Risk State Change Log

Track changes to risk state over time:

```json
{
  "id": "risk-change-001",
  "timestamp": "2025-01-15T10:25:00Z",
  "previous_level": 1,
  "new_level": 2,
  "trigger": "price_drop_5pct",
  "affected_tokens": ["0x1234...abcd"],
  "actions_taken": ["alert_user"],
  "auto_mode_at_time": "semi-auto"
}
```

## File Storage

```
~/.onchainos-state/guardian/
├── protective-actions.jsonl   # Append-only log of protective actions
├── monitoring-events.jsonl    # Append-only log of monitoring checks
├── risk-state-changes.jsonl   # Append-only log of risk level changes
└── config.yaml                # Current guardian configuration
```

## Config Schema

```yaml
guardian:
  enabled: true
  auto_mode: manual  # manual | semi-auto | full-auto

  monitoring:
    standard_interval_minutes: 30
    enhanced_interval_minutes: 5
    emergency_interval_minutes: 1

  alerts:
    price_thresholds: true
    whale_movement_usd: 10000
    portfolio_daily_loss_pct: 3.0

  auto_response:
    revoke_unverified: false
    execute_stop_loss: false
    halt_on_daily_loss: false

  risk_parameters:
    max_daily_loss_pct: 5.0
    max_portfolio_heat_pct: 6.0
    max_single_position_pct: 10.0
    default_stop_loss_pct: 10.0
    default_take_profit_pct: 20.0
```

## Querying Logs

Find past events:

```bash
# Find all protective actions today
cat protective-actions.jsonl | grep '"2025-01-15"'

# Find all emergency events
cat risk-state-changes.jsonl | grep '"new_level": 4'

# Count monitoring checks
wc -l monitoring-events.jsonl
```
