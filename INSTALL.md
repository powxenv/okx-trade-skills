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
npx flins add powxenv/okx-agent-skills
```

This installs all three skills to the agent's skills directory.

### Option B: Using skills.sh

```bash
npx skills add powxenv/okx-agent-skills
```

### Option C: Manual clone

```bash
git clone https://github.com/powxenv/okx-agent-skills.git /tmp/okx-agent-skills
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

## Done

The skills are installed and ready. The agent will automatically load them based on the user's requests. No further configuration needed.