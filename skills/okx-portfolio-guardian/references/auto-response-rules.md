# Auto-Response Rules

Configurable rules engine for automated protective actions. These rules only activate when auto-mode is enabled (semi-auto or full-auto).

## Rule Categories

### 1. Approval Rules

```yaml
approval_rules:
  # Auto-revoke approvals for unverified contracts
  auto_revoke_unverified:
    enabled: true
    trigger: "new_approval AND contract_verified == false"
    action: "revoke_approval"
    cooldown_minutes: 5

  # Alert on new unlimited approvals
  alert_unlimited_approval:
    enabled: true
    trigger: "new_approval AND allowance == 'unlimited' AND token == 'stablecoin'"
    action: "alert_user"
    cooldown_minutes: 15

  # Auto-revoke approvals for known malicious contracts
  auto_revoke_malicious:
    enabled: true
    trigger: "new_approval AND contract_in_malicious_database"
    action: "revoke_approval AND halt_trading AND alert_user"
    cooldown_minutes: 0
```

### 2. Stop-Loss Rules

```yaml
stop_loss_rules:
  # Execute stop-loss when threshold reached
  execute_stop_loss:
    enabled: true
    trigger: "current_price <= stop_loss_price"
    action: "execute_sell_all"
    priority: "critical"
    cooldown_minutes: 0

  # Trailing stop adjustment
  trailing_stop:
    enabled: true
    trigger: "current_price > highest_since_entry AND price_change > +10%"
    action: "update_stop_loss(new_price × (1 - trailing_distance))"
    cooldown_minutes: 30

  # Take-profit execution
  execute_take_profit:
    enabled: true
    trigger: "current_price >= take_profit_price"
    action: "execute_sell_partial(percentage: 50%)"
    priority: "high"
    cooldown_minutes: 60
```

### 3. Portfolio Rules

```yaml
portfolio_rules:
  # Daily loss halt
  daily_loss_halt:
    enabled: true
    trigger: "daily_pnl_pct <= -max_daily_loss_pct"
    action: "halt_trading(duration: 24h) AND alert_user"
    priority: "critical"

  # Portfolio heat limit
  portfolio_heat_limit:
    enabled: true
    trigger: "portfolio_heat_pct >= max_portfolio_heat_pct"
    action: "block_new_trades AND alert_user"
    priority: "high"

  # Single position size limit
  position_size_limit:
    enabled: true
    trigger: "single_position_pct >= max_single_position_pct"
    action: "block_position_increase AND alert_user"
    priority: "medium"
```

### 4. Security Rules

```yaml
security_rules:
  # Honeypot detected on held token
  honeypot_detected:
    enabled: true
    trigger: "security_scan.isHoneyPot == true AND token_in_portfolio"
    action: "execute_sell_all AND alert_user"
    priority: "emergency"

  # Action block on held token
  action_block:
    enabled: true
    trigger: "security_scan.action == 'block' AND token_in_portfolio"
    action: "execute_sell_all AND alert_user"
    priority: "emergency"

  # Dev rug pull on held token
  rug_pull_detected:
    enabled: true
    trigger: "dev_rug_pull_count > 0 AND token_in_portfolio"
    action: "execute_sell_all AND halt_trading(24h) AND alert_user"
    priority: "emergency"
```

## Rule Priority

Rules execute in priority order when multiple trigger simultaneously:

```
emergency > critical > high > medium > low > info
```

## Cooldown System

Prevents rule spam:
- Same rule won't fire again within its cooldown period
- Emergency rules have 0-minute cooldown (always fire)
- User can manually override cooldown

## Rule State Persistence

```json
{
  "last_fired": {
    "auto_revoke_unverified": "2025-01-15T10:30:00Z",
    "execute_stop_loss": null,
    "daily_loss_halt": null
  },
  "active_halts": [],
  "auto_mode": "semi-auto",
  "rules_enabled": true
}
```
