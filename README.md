# OKX X Layer Skills

Three independent agent skills for on-chain trading, automation, and Uniswap integration on X Layer. Each one works on its own — install whichever you need.

## Install

### For Humans

Paste this into your AI agent session:

```
Install the OKX X Layer trading skills by following the guide here:
https://raw.githubusercontent.com/powxenv/okx-trade-skills/main/INSTALL.md
```

Your agent will handle the rest.

### For LLM Agents

Fetch and follow the installation guide:

```bash
curl -fsSL https://raw.githubusercontent.com/powxenv/okx-trade-skills/main/INSTALL.md
```

The guide walks you through asking the user which skills they want, installing via flins/skills.sh or manual clone, setting up OnchainOS, authenticating the wallet, and configuring the Uniswap API key if needed.

### Manual Install

If you prefer to do it yourself:

```bash
# Using skills.sh (https://skills.sh)
npx skills add powxenv/okx-trade-skills

# Using flins (https://flins.tech)
npx flins add powxenv/okx-trade-skills

# Or clone directly
git clone https://github.com/powxenv/okx-trade-skills.git
# Copy skill folders into your agent's skills directory
# e.g. .agents/skills/, .claude/skills/, .cursor/skills/
```

Each skill is self-contained — no cross-skill dependencies. Install one, two, or all three.

## Skills

### okx-trading

Full-lifecycle on-chain trading. 30+ CLI commands covering token analysis, security scanning, market data, smart money tracking, DEX swaps, DeFi yield, meme trenches, portfolio management, and wallet operations.

- Research tokens, check security, pull prices, track smart money
- Execute swaps with MEV protection across 500+ DEX sources
- Deposit, withdraw, and claim rewards in DeFi products
- Scan meme tokens, check developer reputation, detect bundle/sniper activity
- Step-by-step workflows for buy, sell, research, DeFi yield, and meme trading
- Built-in risk framework, trading strategies, and decision checklists

### okx-xlayer-agent

Automation framework for autonomous agents on X Layer. Leverages X Layer's near-zero gas ($0.0005/tx) and 1-second finality so agents can run continuously without burning through capital.

- Sense → Decide → Act loop with mandatory security gates on every trade
- Four ready-made agent patterns: DCA, smart money follower, DeFi auto-compounder, x402 self-funding
- Configurable risk limits: per-trade caps, portfolio heat, daily trade/loss limits, stop-losses
- WebSocket monitoring for real-time price and signal data
- Silent mode for production agents — heartbeat logging, action-only output
- x402 payment integration so agents can pay for services and receive payments
- All 30+ onchainos commands, trading workflows, risk framework, and decision checklists included

### okx-uniswap

Direct Uniswap protocol integration for agents — V3 concentrated liquidity, Trading API swaps, x402 payments, and LP rebalancing on X Layer and EVM chains.

- Swap via OKX aggregator (best price across 500+ DEXes) or Uniswap Trading API (direct protocol)
- Full V3 LP lifecycle: mint, monitor, rebalance, collect fees using `cast` (Foundry)
- X Layer makes active LP profitable — rebalancing every 5 minutes costs ~$4.32/day
- Compare routes: quote both OKX aggregator and Uniswap, pick the better price
- Pay for API access via x402 or Tempo CLI with auto-swap funding
- Five agent patterns: auto-rebalancing LP, fee harvesting, yield farming, cross-chain arbitrage, smart money + Uniswap
- Complete Trading API reference with Permit2, routing types, and error handling
- V3 position lifecycle with tick math and impermanent loss calculator

**Prerequisites**: OnchainOS CLI for all operations. Foundry (`cast`) for V3 LP management. Uniswap API key ([developers.uniswap.org/dashboard](https://developers.uniswap.org/dashboard)) for Trading API.

## Autonomous Trading

These skills support always-on trading agents, but **automated trading must never be enabled without explicit user consent.** Each skill enforces hard limits that cannot be overridden:

- Security scan returns `isHoneyPot=true` or `action="block"` → **stop, no trade, no override**
- Daily loss exceeds 5% of portfolio → **halt for 24 hours, notify user**
- Price impact > 10% → **block the trade**
- 3 consecutive failed trades → **halt and notify**

Three operating modes: **Manual** (every trade needs approval, default), **Semi-auto** (low-risk trades auto-execute), **Full-auto** (all trades execute within limits). Always start in manual mode and upgrade gradually.

See `INSTALL.md` for the full setup guide.

## Why X Layer

X Layer makes agent strategies viable that would be impractical on Ethereum:

| | X Layer | Ethereum |
|---|---|---|
| Gas per tx | ~$0.0005 | ~$2–50 |
| Block time | ~1 second | ~12 seconds |
| Rebalancing daily | $0.015/day | $300/day |
| Rebalancing hourly | $0.36/day | $7,200/day |
| Rebalancing every 5 min | $4.32/day | Impractical |
| Auto-compounding | Profitable | Gas > rewards |

## File Structure

```
skills/
├── okx-trading/          # 27 files — full trading lifecycle
├── okx-xlayer-agent/     # 18 files — autonomous agent framework
└── okx-uniswap/          # 13 files — Uniswap protocol integration
```

Each skill has its own `SKILL.md`, `agents/openai.yaml`, `_shared/`, and `references/`.

## License

MIT