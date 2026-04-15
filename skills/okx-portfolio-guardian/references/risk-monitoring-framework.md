# Risk Monitoring Framework

A 4-level risk monitoring system for continuous portfolio protection.

## Risk Levels

| Level | Name | Trigger | Response Time | Action |
|---|---|---|---|---|
| 1 | **Info** | Normal market movement, routine approval | Log only | No action needed |
| 2 | **Warning** | Moderate risk signal, price approaching threshold | Within 5 minutes | Alert user, prepare response |
| 3 | **Critical** | High risk detected, stop-loss triggered, suspicious approval | Immediate | Execute protective action |
| 4 | **Emergency** | Confirmed exploit, wallet compromise, massive rug pull | Immediate + halt | Emergency shutdown, secure funds |

## Level 1: Info

**Triggers:**
- Price moves < 3% in 1 hour
- New token approval for known contract (e.g., Uniswap Router)
- Normal trading volume
- Portfolio value change < 2% daily

**Commands to run:**
```bash
onchainos market price --address <addr> --chain <c>
onchainos portfolio total-value --address <addr> --chains <c>
```

**Cadence:** Every 1-2 hours in manual mode, every 15 minutes in auto mode.

**Action:** Log data point. No alert needed.

## Level 2: Warning

**Triggers:**
- Price moves 3-10% in 1 hour
- New token approval for unknown/unverified contract
- Single position exceeds 8% of portfolio
- Daily loss reaches 3%
- Smart money selling detected
- Liquidity dropping in held token's pool

**Commands to run:**
```bash
onchainos security approvals --address <addr> --chain <c>
onchainos tracker activities --tracker-type smartMoney
onchainos signal list --chain <c>
onchainos token liquidity --address <addr> --chain <c>
```

**Cadence:** Every 10-15 minutes.

**Action:** Alert user with details. Recommend review. Prepare stop-loss parameters.

## Level 3: Critical

**Triggers:**
- Price drops > 10% in 1 hour
- Stop-loss threshold reached
- Suspicious new approval detected (unknown contract with transfer function)
- Daily loss reaches 5%
- Portfolio heat exceeds 6%
- Honeypot flag appears on held token
- Whale dump detected (> 5% of supply sold)

**Commands to run immediately:**
```bash
onchainos security token-scan --address <addr> --chain <c>
onchainos security approvals --address <addr> --chain <c>
onchainos market price --address <addr> --chain <c>
onchainos portfolio total-value --address <addr> --chains <c>
```

**Action (immediate):**
1. Alert user with urgency
2. If auto-mode enabled: execute stop-loss or revoke suspicious approval
3. Log all actions taken
4. Switch to enhanced monitoring (every 1-2 minutes)

## Level 4: Emergency

**Triggers:**
- Confirmed wallet compromise (unauthorized transfer)
- Token confirmed as honeypot (cannot sell)
- Dev rug pull in progress (liquidity removed)
- Multiple critical alerts simultaneously
- Portfolio value drops > 20% in 1 hour

**Action (immediate):**
1. Halt all trading immediately
2. Attempt to secure remaining funds:
   ```bash
   # Revoke all suspicious approvals
   onchainos security approvals --address <addr> --chain <c>
   # Check remaining balances
   onchainos wallet balance --chain <c>
   # Attempt to move funds to safe wallet if compromise suspected
   onchainos wallet send --readable-amount <max> --receipt <safe_addr> --chain <c>
   ```
3. Notify user with full details
4. Disable auto-trading for 48 hours
5. Generate incident report

## Monitoring Loop

### Standard Loop (Manual Mode)
```
Every 30 minutes:
  1. Check portfolio value
  2. Check prices of held tokens
  3. Check for new approvals
  4. Log data
  5. Assess risk level
```

### Enhanced Loop (Auto Mode)
```
Every 5 minutes:
  1. All standard checks
  2. Smart money activity
  3. Signal changes
  4. Holder changes for held tokens
  5. Security re-scan for held tokens
  6. Execute auto-response if critical
```

### Emergency Loop
```
Every 1 minute:
  1. Price check on affected token
  2. Approval status
  3. Liquidity status
  4. Execute protective actions without delay
```

## Risk Level Transitions

```
Info → Warning: Any Level 2 trigger
Warning → Critical: Any Level 3 trigger, or 3+ Level 2 triggers within 30 minutes
Critical → Emergency: Any Level 4 trigger, or sustained critical state > 15 minutes

Warning → Info: Risk factor resolved (price stabilized, approval confirmed safe)
Critical → Warning: Immediate threat passed, monitoring continues
Emergency → Critical: Funds secured, threat contained
```

## Logging Format

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "risk_level": 2,
  "triggers": ["price_drop_5pct", "smart_money_selling"],
  "tokens_affected": ["0x1234...abcd"],
  "actions_taken": ["alerted_user"],
  "portfolio_value_usd": 450.00,
  "daily_pnl_pct": -3.2,
  "next_check": "2025-01-15T10:40:00Z"
}
```
