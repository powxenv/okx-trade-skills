# OKX Trade Skills

A collection of 7 agent skills for on-chain trading on OKX X Layer, served via a static Astro site with a well-known discovery endpoint. Built for the X Layer Build X Hackathon (Skills Arena).

## Skills

| Skill | Purpose |
|---|---|
| `okx-trading` | Research, security, swaps, DeFi yield, portfolio, wallets |
| `okx-xlayer-agent` | Autonomous agent loops on X Layer: DCA, auto-compound, risk gates |
| `okx-uniswap` | Uniswap V3 LP management, Trading API swaps, x402 payments |
| `okx-uniswap-dev` | Unified Uniswap dev: v4 hooks & security audit, CCA auctions, swap/liquidity planning, Trading API, V4 SDK, x402 payments, viem/wagmi |
| `okx-portfolio-guardian` | Risk monitoring, stop-loss automation, approval tracking, alerts |
| `okx-meme-intelligence` | Meme token analysis, dev reputation, sniper detection, safety scoring |
| `okx-ecosystem-discovery` | Browse, search, and install skills from the ecosystem |

## Quick Setup

**Option 1 — Copy to your AI agent (works with any agent):**

```
Read https://okxskills.noval.me/AGENTS.md and install OKX Trade Skills on your system.
```

**Option 2 — Use Flins (terminal):**

```bash
npx flins@latest add okxskills.noval.me
```

**Option 3 — Use skills.sh (terminal):**

```bash
npx skills@latest add https://okxskills.noval.me
```

## Project Structure

```
/
├── public/
│   ├── .well-known/agent-skills/   # Skill archives + index.json
│   ├── AGENTS.md                   # Agent-facing readme
│   └── okx.svg
├── skills/                         # Source for each skill
│   ├── okx-trading/
│   │   ├── SKILL.md
│   │   ├── agents/openai.yaml
│   │   ├── _shared/                # Shared preflight, chain support, native tokens
│   │   └── references/             # Domain-specific reference docs
│   ├── okx-xlayer-agent/
│   ├── okx-uniswap/
│   ├── okx-uniswap-dev/
│   ├── okx-portfolio-guardian/
│   ├── okx-meme-intelligence/
│   └── okx-ecosystem-discovery/
├── src/
│   ├── components/                 # React UI components (HeroUI + Tailwind)
│   ├── data/ecosystem-skills.ts
│   ├── styles/global.css
│   ├── assets/fonts/satoshi/
│   └── pages/index.astro
├── scripts/
│   └── build-discovery.ts          # Generates skill archives + index.json
├── astro.config.mjs
├── wrangler.jsonc                  # Cloudflare Pages deployment
└── package.json
```

## Tech Stack

- **Astro** with React integration
- **Tailwind CSS v4** + **HeroUI v3**
- **Cloudflare Pages** (via `@astrojs/cloudflare`)
- **unplugin-icons** for icon imports

## Commands

| Command | Action |
|:--|:--|
| `bun install` | Install dependencies |
| `bun dev` | Start dev server at `localhost:4321` |
| `bun run build` | Generate skill archives + build site to `./dist/` |
| `bun preview` | Preview production build locally |

## Deployment

The prebuild script (`scripts/build-discovery.ts`) packages each `skills/` directory into a `.tar.gz` archive under `public/.well-known/agent-skills/` and generates `index.json`. Deploy to Cloudflare Pages via `bun run build`.

## License

MIT
