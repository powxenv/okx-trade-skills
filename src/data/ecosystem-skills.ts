export interface EcosystemSkill {
  name: string;
  source: string;
  repo: string;
  description: string;
  url: string;
}

export const ecosystemSkills: EcosystemSkill[] = [
  // ── OKX OnchainOS ──────────────────────────────────────
  {
    name: "agentic-wallet",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Manages wallet lifecycle: authentication, balance queries, token transfers, transaction history, smart contract calls, and message signing across EVM and Solana.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-agentic-wallet/SKILL.md",
  },
  {
    name: "audit-log",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Export audit logs, view command history, and track all API call records.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-audit-log/SKILL.md",
  },
  {
    name: "defi-invest",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Invest in DeFi protocols: deposit, stake, lend, borrow, add liquidity, claim rewards, and track APY/TVL trends.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-defi-invest/SKILL.md",
  },
  {
    name: "defi-portfolio",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "View DeFi holdings, staking positions, lending positions, and portfolio across protocols.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-defi-portfolio/SKILL.md",
  },
  {
    name: "dex-market",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "On-chain market data: token prices, K-line/OHLC charts, index prices, and wallet PnL analysis.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-dex-market/SKILL.md",
  },
  {
    name: "dex-signal",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Smart-money and whale tracking, aggregated buy signal alerts, and top trader leaderboards.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-dex-signal/SKILL.md",
  },
  {
    name: "dex-swap",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Swap tokens across 500+ DEX sources with optimal routing, slippage control, and MEV protection.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-dex-swap/SKILL.md",
  },
  {
    name: "dex-token",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Token-level data: search, trending tokens, liquidity pools, holder distribution, and risk metadata.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-dex-token/SKILL.md",
  },
  {
    name: "dex-trenches",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Meme and alpha token research: pump.fun scanning, dev reputation, bundler detection, and bonding curve tracking.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-dex-trenches/SKILL.md",
  },
  {
    name: "dex-ws",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "WebSocket sessions for real-time on-chain data: price, trades, signals, and meme scanning channels.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-dex-ws/SKILL.md",
  },
  {
    name: "onchain-gateway",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Broadcast transactions, estimate gas, simulate transactions, and track order status across 20+ chains.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-onchain-gateway/SKILL.md",
  },
  {
    name: "security",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Security scanning: honeypot detection, phishing checks, transaction safety, signature verification, and approval management.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-security/SKILL.md",
  },
  {
    name: "wallet-portfolio",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Check wallet balance, token holdings, and portfolio value for any address across 20+ chains.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-wallet-portfolio/SKILL.md",
  },
  {
    name: "x402-payment",
    source: "onchainos-skills",
    repo: "okx/onchainos-skills",
    description:
      "Handle HTTP 402 Payment Required responses and sign x402 payment proofs for gated APIs.",
    url: "https://github.com/okx/onchainos-skills/blob/main/skills/okx-x402-payment/SKILL.md",
  },

  // ── Uniswap AI ─────────────────────────────────────────
  {
    name: "configurator",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Configure CCA (Continuous Clearing Auction) smart contract parameters through an interactive bulk form flow.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-cca/skills/configurator/SKILL.md",
  },
  {
    name: "deployer",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Deploy CCA (Continuous Clearing Auction) smart contracts using the Factory pattern.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-cca/skills/deployer/SKILL.md",
  },
  {
    name: "liquidity-planner",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Provide liquidity and create LP positions with concentrated liquidity on Uniswap.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-driver/skills/liquidity-planner/SKILL.md",
  },
  {
    name: "swap-planner",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Swap tokens and discover new tokens on Uniswap with deep links to the interface.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-driver/skills/swap-planner/SKILL.md",
  },
  {
    name: "v4-hook-generator",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Generate Uniswap v4 hook contracts for custom swap logic, dynamic fees, and MEV protection.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-hooks/skills/v4-hook-generator/SKILL.md",
  },
  {
    name: "v4-security-foundations",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Security-first Uniswap v4 hook development with best practices and audit guidance.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-hooks/skills/v4-security-foundations/SKILL.md",
  },
  {
    name: "pay-with-any-token",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Pay HTTP 402 payment challenges using tokens via the Tempo CLI and Uniswap Trading API.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-trading/skills/pay-with-any-token/SKILL.md",
  },
  {
    name: "swap-integration",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Integrate Uniswap swaps into applications using the Universal Router and Trading API.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-trading/skills/swap-integration/SKILL.md",
  },
  {
    name: "v4-sdk-integration",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Build swap and liquidity experiences directly with the Uniswap v4 SDK.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-trading/skills/v4-sdk-integration/SKILL.md",
  },
  {
    name: "viem-integration",
    source: "uniswap-ai",
    repo: "Uniswap/uniswap-ai",
    description:
      "Integrate EVM blockchains using viem for reading data, sending transactions, and contract interaction.",
    url: "https://github.com/Uniswap/uniswap-ai/blob/main/packages/plugins/uniswap-viem/skills/viem-integration/SKILL.md",
  },
];
