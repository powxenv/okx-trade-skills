# Agent Installation Guide

> This file is for AI agents. If you're a human, just paste the command from the README into your agent session.

You are installing one or more OKX X Layer trading skills into this project. Follow the steps below.

## What You're Installing

These are three independent skills for on-chain trading on X Layer and beyond:

| Skill | What It Does |
|---|---|
| `okx-trading` | Full trading lifecycle: research, security, swaps, DeFi yield, portfolio, wallets |
| `okx-xlayer-agent` | Autonomous agent framework for X Layer: loops, risk gates, DCA, auto-compound |
| `okx-uniswap` | Uniswap integration: V3 LP management, Trading API swaps, x402 payments |

Each skill is self-contained. The user can install one, two, or all three.

## Step 1: Ask Which Skills to Install

Ask the user:

> Which skills do you want to install?
> 1. `okx-trading` — research, security, swaps, DeFi, portfolios
> 2. `okx-xlayer-agent` — autonomous agent loops on X Layer
> 3. `okx-uniswap` — Uniswap V3 LP, Trading API, x402 payments
> 4. All three

If the user says "all" or doesn't specify, install all three.

## Step 2: Determine Install Method

Check if `flins` or `npx` is available, or install manually.

```bash
# Check for flins
command -v flins && echo "flins available"

# Check for npx
command -v npx && echo "npx available"
```

### Option A: Using flins (recommended)

```bash
npx flins add powxenv/okx-trade-skills
```

This installs all three skills to the agent's skills directory.

### Option B: Using skills.sh

```bash
npx skills add powxenv/okx-trade-skills
```

### Option C: Manual clone

```bash
git clone https://github.com/powxenv/okx-trade-skills.git /tmp/okx-agent-skills
```

Then copy the selected skill folders into the agent's skills directory:

```bash
# Determine the agent's skills directory
# Common locations:
#   .agents/skills/     (universal)
#   .claude/skills/      (Claude Code)
#   .cursor/skills/      (Cursor)

SKILLS_DIR=".agents/skills"
mkdir -p "$SKILLS_DIR"

# Copy selected skills
cp -r /tmp/okx-agent-skills/skills/okx-trading "$SKILLS_DIR/"
cp -r /tmp/okx-agent-skills/skills/okx-xlayer-agent "$SKILLS_DIR/"
cp -r /tmp/okx-agent-skills/skills/okx-uniswap "$SKILLS_DIR/"

# Cleanup
rm -rf /tmp/okx-agent-skills
```

If the user only wants specific skills, only copy those folders.

## Step 3: Verify Installation

```bash
ls -la .agents/skills/
# Should show: okx-trading  okx-xlayer-agent  okx-uniswap
```

Or check a specific skill:

```bash
ls .agents/skills/okx-trading/SKILL.md
ls .agents/skills/okx-xlayer-agent/SKILL.md
ls .agents/skills/okx-uniswap/SKILL.md
```

## Step 4: OnchainOS Setup

All three skills require the OnchainOS CLI (`onchainos`). Check if it's installed:

```bash
command -v onchainos && onchainos --version
```

If not installed, follow the instructions in each skill's `_shared/preflight.md` to install it.

For `okx-uniswap`, also check for Foundry (needed for V3 LP management):

```bash
command -v cast && cast --version
```

If not installed:

```bash
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

## Step 5: Wallet Authentication

The user needs an authenticated wallet for trading. Walk them through it:

1. Check current status:

```bash
onchainos wallet status
```

2. If not logged in, ask for their email:

```bash
onchainos wallet login <email> --locale <locale>
# locale: en-US (default), zh-CN, ja-JP
```

3. An OTP will be sent to their email. Ask them for the code and verify:

```bash
onchainos wallet verify <code>
```

4. Confirm authentication:

```bash
onchainos wallet status
# Should show "Ready: true"
```

5. Get wallet addresses:

```bash
onchainos wallet addresses
# Use the XLayer address for X Layer operations
# Use the EVM address for other EVM chains
```

If `wallet verify` returns `"isNew": true`, point them to policy settings:
https://web3.okx.com/portfolio/agentic-wallet-policy

## Step 6: For Uniswap Trading API (okx-uniswap only)

If the user installed `okx-uniswap` and wants to use the Trading API, they need an API key:

1. Go to [developers.uniswap.org/dashboard](https://developers.uniswap.org/dashboard)
2. Create an API key
3. Set it as an environment variable:

```bash
export UNISWAP_API_KEY=your_api_key_here
```

4. Add to shell profile for persistence:

```bash
echo 'export UNISWAP_API_KEY=your_api_key_here' >> ~/.bashrc  # or ~/.zshrc
```

## Step 7: Autonomous Trading Setup (Optional)

**You MUST explicitly ask the user before enabling any automated trading.** Never enable auto-trading, loops, or silent mode without clear user consent.

Ask the user:

> Do you want to enable automated/always-on trading?
>
> This allows the agent to execute trades, manage positions, and rebalance autonomously without asking for confirmation each time. You can choose:
>
> - **Manual mode** — every trade requires your approval (default, safest)
> - **Semi-auto mode** — low-risk trades execute automatically, high-risk trades need your approval
> - **Full-auto mode** — all trades execute within your defined risk limits (riskiest)
>
> Regardless of mode, the agent will always stop on security flags (honeypot, blocked tokens) and daily loss limits.

If the user declines or says "manual only", skip this section entirely. The agent will still work — it just asks before every trade.

If the user opts in, walk them through these safeguards:

### Risk Limits (Required for Any Auto Mode)

Before enabling auto-trading, confirm these parameters with the user:

```yaml
# The agent MUST respect these limits at all times
# Store these in whatever way your agent platform supports:
#   - OpenClaw: ~/.openclaw/config.yaml or project .env
#   - Hermes Agent: agent config file or environment variables
#   - Claude Code: project CLAUDE.md or .claude/settings.json
#   - Custom scripts: YAML/JSON config file, env vars, or database
# Each agent stores and reads these from its own memory/storage. The skills
# themselves do not persist state — the agent must manage its own config.
risk_per_trade_pct: 1.0        # Max % of portfolio risked per trade (0.5% for meme tokens)
max_portfolio_heat_pct: 6.0    # Max total open risk across all positions
max_single_position_pct: 10.0  # Max % of portfolio in one asset
max_daily_trades: 10           # Max trades per day
max_daily_loss_pct: 5.0        # If daily loss exceeds this, PAUSE for 24 hours
allowed_chains: []             # Empty = all; or whitelist like [xlayer]
allowed_tokens: []             # Empty = all; or whitelist like [OKB, USDC, ETH]
blocked_tokens: []             # Never trade these tokens
stop_loss_pct: 5.0             # Auto stop-loss at this % loss
take_profit_pct: 10.0          # Auto take-profit at this % gain
auto_mode: manual              # manual | semi-auto | full-auto
```

### Hard Limits (Cannot Be Overridden)

Even in full-auto mode, these rules are absolute:

| Rule | Enforcement |
|---|---|
| Security scan returns `isHoneyPot=true` or `action="block"` | **STOP. No trade. No override.** |
| Daily loss > 5% of portfolio | **Halt for 24 hours. Notify user.** |
| Price impact > 10% on quote | **Block the trade.** |
| Position would exceed 6% portfolio heat | **Skip. Wait for next opportunity.** |

### Operating an Always-On Agent

For continuously running agents (OpenClaw, Hermes Agent, Claude Code in loop mode, etc.):

1. **Start in manual mode.** Run the agent for a few sessions in manual mode first. Observe its decisions before enabling auto.

2. **Upgrade gradually.** Move from manual → semi-auto → full-auto only after confirming the agent behaves correctly in manual and semi-auto.

3. **Set up monitoring.** Always have the agent log every action with: timestamp, pair, amount, slippage, txHash, status, reasoning, portfolio heat after trade. Review logs daily.

4. **Use circuit breakers.** Configure emergency shutdown conditions:
   - Daily loss > 5% of portfolio → halt 24 hours
   - Single trade loss > 3% → halt and notify
   - 3 consecutive failed trades → halt and notify
   - Any system error → halt and notify

5. **Keep kill switch accessible.** The user should be able to stop the agent at any time. In OpenClaw/Hermes, this means having a clear `stop` command or SIGTERM handler.

6. **Check wallet session validity.** OnchainOS sessions expire. Before each loop iteration, run `onchainos wallet status`. If not authenticated, re-authenticate or pause and notify the user.

### Recommended Agent Platforms

| Platform | Best For | Loop Mode |
|---|---|---|
| OpenClaw | Complex multi-step agents with tool use | Continuous loop with `/ulw` or Ralph Loop |
| Claude Code | Development + trading with manual approval | Interactive, manual-by-default |
| Hermes Agent | Always-on autonomous agents | Background daemon, always running |
| Custom scripts | Dedicated trading bots with cron/PM2 | Scheduled or WebSocket-triggered |

### Sample Loop (Pseudocode)

```python
# ALWAYS start in manual mode until user explicitly opts in
if config.auto_mode == "manual":
    ask_user_before_every_trade = True
elif config.auto_mode == "semi-auto":
    ask_user_before_every_trade = False  # but still ask for high-risk
elif config.auto_mode == "full-auto":
    ask_user_before_every_trade = False  # but still stop on hard limits

while agent_running:
    # 1. Check auth
    status = run("onchainos wallet status")
    if not status.ready:
        notify_user("Wallet session expired. Please re-authenticate.")
        pause()

    # 2. Sense
    signals = run("onchainos signal list --chain xlayer")
    prices = run("onchainos market price --address <addr> --chain xlayer")

    # 3. Decide
    for signal in signals:
        # HARD LIMIT: security scan is mandatory
        scan = run(f"onchainos security token-scan --address {signal.token} --chain xlayer")
        if scan.isHoneyPot or scan.action == "block":
            log(f"BLOCKED: {signal.token} failed security scan")
            continue

        # HARD LIMIT: daily loss check
        if daily_loss_pct() > config.max_daily_loss_pct:
            log("DAILY LOSS LIMIT HIT. Halting for 24 hours.")
            pause(hours=24)
            break

        # Position sizing
        trade_size = calculate_position_size(signal, config)

        # 4. Act (with approval if needed)
        if ask_user_before_every_trade or is_high_risk(signal):
            approved = ask_user(f"Trade {trade_size} of {signal.token}?")
            if not approved:
                continue

        result = run(f"onchainos swap execute --from USDC --to {signal.token} ...")

        # 5. Log
        log_trade(result)

    # 6. Sleep
    sleep(config.poll_interval)
```

## Done

The skills are installed and ready. The agent will automatically load them based on the user's requests. No further configuration needed.