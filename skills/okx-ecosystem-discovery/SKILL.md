---
name: okx-ecosystem-discovery
description: "Browse, search, and install skills from the OKX Trade Skills ecosystem. Use when the user wants to: discover available skills; find skills for a specific use case like DeFi, swapping, security, or LP management; see what skills are available from OKX OnchainOS or Uniswap AI; install an individual skill or an entire skill pack; list installed skills; or get help choosing the right skill for their needs. Chinese: 技能发现, 技能安装, 技能搜索, 生态系统, OnchainOS技能, Uniswap技能."
license: MIT
metadata:
  author: okx
  version: "1.0.0"
  homepage: "https://okxskills.noval.me"
---

# OKX Ecosystem Discovery

Browse, search, and install skills from the OKX Trade Skills ecosystem. This skill helps you discover and add individual skills from OKX OnchainOS, Uniswap AI, and other onchain skill packs.

## Quick Start

Install a skill by name:

```bash
# Install a specific skill from a repo
npx flins@latest add <owner>/<repo> --skill <skill-name> -y

# Example: install the agentic-wallet skill from OnchainOS
npx flins@latest add okx/onchainos-skills --skill agentic-wallet -y
```

## Available Skill Packs

### OKX OnchainOS (`okx/onchainos-skills`)

OnchainOS provides 14 skills covering the full onchain trading lifecycle. All skills use the `onchainos` CLI.

| Skill | Install Command | Purpose |
|---|---|---|
| agentic-wallet | `npx flins@latest add okx/onchainos-skills --skill agentic-wallet -y` | Wallet lifecycle: auth, balances, transfers, history, contract calls, signing |
| audit-log | `npx flins@latest add okx/onchainos-skills --skill audit-log -y` | Export audit logs, view command history, track API call records |
| defi-invest | `npx flins@latest add okx/onchainos-skills --skill defi-invest -y` | DeFi protocols: deposit, stake, lend, borrow, add liquidity, claim rewards |
| defi-portfolio | `npx flins@latest add okx/onchainos-skills --skill defi-portfolio -y` | View DeFi holdings, staking positions, lending positions across protocols |
| dex-market | `npx flins@latest add okx/onchainos-skills --skill dex-market -y` | Token prices, K-line charts, index prices, wallet PnL analysis |
| dex-signal | `npx flins@latest add okx/onchainos-skills --skill dex-signal -y` | Smart-money tracking, whale alerts, top trader leaderboards |
| dex-swap | `npx flins@latest add okx/onchainos-skills --skill dex-swap -y` | Swap across 500+ DEX sources with slippage control and MEV protection |
| dex-token | `npx flins@latest add okx/onchainos-skills --skill dex-token -y` | Token search, trending tokens, liquidity pools, holder distribution |
| dex-trenches | `npx flins@latest add okx/onchainos-skills --skill dex-trenches -y` | Meme/alpha token research, pump.fun scanning, dev reputation |
| dex-ws | `npx flins@latest add okx/onchainos-skills --skill dex-ws -y` | Real-time WebSocket data: price, trades, signals, meme scanning |
| onchain-gateway | `npx flins@latest add okx/onchainos-skills --skill onchain-gateway -y` | Broadcast transactions, estimate gas, simulate, track orders across chains |
| security | `npx flins@latest add okx/onchainos-skills --skill security -y` | Honeypot detection, phishing checks, transaction safety, approval management |
| wallet-portfolio | `npx flins@latest add okx/onchainos-skills --skill wallet-portfolio -y` | Wallet balance, token holdings, portfolio value across 20+ chains |
| x402-payment | `npx flins@latest add okx/onchainos-skills --skill x402-payment -y` | HTTP 402 payment handling and x402 payment proof signing |

### Uniswap AI (`Uniswap/uniswap-ai`)

Uniswap AI provides 10 skills for Uniswap V3/V4 integration, LP management, and trading.

| Skill | Install Command | Purpose |
|---|---|---|
| configurator | `npx flins@latest add Uniswap/uniswap-ai --skill configurator -y` | Configure CCA smart contract parameters |
| deployer | `npx flins@latest add Uniswap/uniswap-ai --skill deployer -y` | Deploy CCA smart contracts using the Factory pattern |
| liquidity-planner | `npx flins@latest add Uniswap/uniswap-ai --skill liquidity-planner -y` | Provide liquidity with concentrated liquidity on Uniswap |
| swap-planner | `npx flins@latest add Uniswap/uniswap-ai --skill swap-planner -y` | Swap tokens and discover new tokens on Uniswap |
| v4-hook-generator | `npx flins@latest add Uniswap/uniswap-ai --skill v4-hook-generator -y` | Generate Uniswap v4 hook contracts for custom swap logic |
| v4-security-foundations | `npx flins@latest add Uniswap/uniswap-ai --skill v4-security-foundations -y` | Security-first v4 hook development with audit guidance |
| pay-with-any-token | `npx flins@latest add Uniswap/uniswap-ai --skill pay-with-any-token -y` | Pay HTTP 402 challenges using tokens via Uniswap Trading API |
| swap-integration | `npx flins@latest add Uniswap/uniswap-ai --skill swap-integration -y` | Integrate Uniswap swaps via Universal Router and Trading API |
| v4-sdk-integration | `npx flins@latest add Uniswap/uniswap-ai --skill v4-sdk-integration -y` | Build swap and liquidity experiences with Uniswap v4 SDK |
| viem-integration | `npx flins@latest add Uniswap/uniswap-ai --skill viem-integration -y` | Integrate EVM blockchains using viem for data and transactions |

## Use Case Guide

Not sure which skill to install? Match your goal to the right skill:

| Goal | Recommended Skills |
|---|---|
| Buy or sell a token | `dex-swap` + `security` + `dex-market` |
| Research a token before trading | `dex-token` + `dex-market` + `security` |
| Track smart money / whale wallets | `dex-signal` + `dex-trenches` |
| Earn yield in DeFi | `defi-invest` + `defi-portfolio` + `dex-market` |
| Manage a wallet | `agentic-wallet` + `wallet-portfolio` |
| Trade meme / pump.fun tokens | `dex-trenches` + `security` + `dex-swap` |
| Monitor markets in real-time | `dex-ws` + `dex-signal` + `dex-market` |
| Provide liquidity on Uniswap | `liquidity-planner` + `v4-sdk-integration` |
| Build custom Uniswap hooks | `v4-hook-generator` + `v4-security-foundations` |
| Pay for API services on-chain | `x402-payment` + `onchain-gateway` |
| Full autonomous trading agent | `okx-trading` + `okx-xlayer-agent` (install via `npx flins@latest add okxskills.noval.me -y`) |

## Post-Install

After installing a skill:

1. Open the installed skill folder and read the `SKILL.md` file
2. For OnchainOS skills, ensure the `onchainos` CLI is installed — check the skill's `_shared/preflight.md` for setup instructions
3. For Uniswap skills, you may need Foundry (`cast`) and a `UNISWAP_API_KEY` — see individual skill docs

## Troubleshooting

| Issue | Solution |
|---|---|
| `flins` command not found | Run `npx flins@latest` to use without installing, or `npm i -g flins` to install globally |
| Skill not found in repo | Check the repo's skill directory — the `--skill` name must match the folder name |
| OnchainOS CLI missing | Follow `_shared/preflight.md` in any OnchainOS skill to install it |
| Permission denied | Ensure you have write access to your skills directory (`.agents/`, `.claude/skills/`, etc.) |
