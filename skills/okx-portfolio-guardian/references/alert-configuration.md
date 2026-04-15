# Alert Configuration

Setting up real-time alerts via WebSocket for price, whale, and portfolio monitoring.

## Alert Types

### Price Alerts

Trigger when a token crosses a price threshold.

**Setup:**
```bash
# Connect to price channel
onchainos dex-ws connect --channel price --chain <c>
```

**Configuration:**
```json
{
  "type": "price",
  "token": "0x1234...abcd",
  "chain": "ethereum",
  "conditions": [
    { "direction": "below", "price": 2800, "action": "stop_loss_check" },
    { "direction": "above", "price": 3500, "action": "take_profit_check" }
  ]
}
```

### Whale Alerts

Trigger when large wallet movements are detected.

**Setup:**
```bash
# Track whale activity
onchainos tracker activities --tracker-type whale
```

**Configuration:**
```json
{
  "type": "whale",
  "tokens": ["0x1234...abcd"],
  "chains": ["ethereum", "base"],
  "min_transfer_usd": 10000,
  "action": "alert_user"
}
```

### Portfolio Alerts

Trigger when portfolio value changes significantly.

**Setup:**
```bash
# Monitor portfolio value
onchainos portfolio total-value --address <addr> --chains <c>
```

**Configuration:**
```json
{
  "type": "portfolio",
  "address": "0x...",
  "conditions": [
    { "metric": "daily_loss_pct", "threshold": 3.0, "action": "warning_alert" },
    { "metric": "daily_loss_pct", "threshold": 5.0, "action": "halt_trading" },
    { "metric": "value_change_pct_1h", "threshold": -10.0, "action": "emergency_check" }
  ]
}
```

## Alert Delivery

Alerts are delivered through the agent's conversation:

| Level | Format | Action Required |
|---|---|---|
| Info | Brief notification | None |
| Warning | Detailed alert with data | Review recommended |
| Critical | Urgent alert with action plan | Immediate response |
| Emergency | Full alert with auto-actions taken | Acknowledge and review |

## WebSocket Channels

| Channel | Data | Update Frequency |
|---|---|---|
| `price` | Real-time token prices | Every trade |
| `signal` | Buy/sell signals | New signal |
| `trades` | DEX trade data | Every trade |
| `meme` | Meme token launches | New launch |

```bash
# Connect to multiple channels
onchainos dex-ws connect --channel price --chain ethereum
onchainos dex-ws connect --channel signal --chain ethereum
onchainos dex-ws connect --channel trades --chain base
```

## Alert Processing Rules

1. Deduplicate alerts within 60 seconds (same token, same condition)
2. Escalate if same alert fires 3+ times within 15 minutes
3. Suppress non-critical alerts during emergency state
4. Log all alerts with timestamp, type, and action taken
5. Rate-limit user notifications to max 1 per minute for non-critical
