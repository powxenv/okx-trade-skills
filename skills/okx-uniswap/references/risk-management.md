# Risk Management Reference

> Load this file when evaluating risk, setting position sizes, managing portfolio exposure, or when the user asks about protecting capital, stop-losses, or risk frameworks.

## Table of Contents

1. Risk Categories
2. Pre-Trade Security Assessment
3. Position Sizing Rules
4. Portfolio Risk Limits
5. DeFi-Specific Risks
6. Operational Security
7. Emergency Procedures

---

## 1. Risk Categories

### Market Risk

| Risk | Description | Mitigation |
|---|---|---|
| Volatility | Crypto routinely moves 5–20% daily | Position sizing (≤2% risk/trade), stop-losses |
| Liquidity risk | Thin order books → large slippage on exit | Check `onchainos token liquidity` before entry; limit position to <5% of pool depth |
| Correlation risk | Most alts move together in crashes | Count correlated positions as one; keep total correlated exposure <15% |
| Flash crash | 20–30% drops within established uptrends | Hard stop-losses are non-negotiable; avoid leverage on alts |

### Smart Contract Risk

| Risk | Description | Mitigation |
|---|---|---|
| Bug/exploit | Code vulnerability enabling theft | Use only audited protocols; check `onchainos security token-scan` |
| Oracle manipulation | Fake price feeds causing liquidation | Prefer protocols with multiple oracle sources |
| Governance attack | Malicious proposal draining funds | Prefer protocols with timelocks ≥24h and multi-sig |

### Counterparty Risk

| Risk | Description | Mitigation |
|---|---|---|
| Rug pull | Developer abandons or drains contract | `onchainos memepump token-dev-info`; check dev history |
| Bridge risk | Cross-chain bridges are historically vulnerable | Minimize bridge exposure; don't keep large balances on bridges |
| Exchange risk | CEX insolvency or withdrawal freeze | Self-custody whenever possible; don't leave large balances on exchanges |

---

## 2. Pre-Trade Security Assessment

Before ANY trade, run through this mandatory checklist:

### Tier 1 — Always Required

```bash
# 1. Token safety scan (MANDATORY)
onchainos security token-scan --address <addr> --chain <chain>
```

| Check | Pass | Fail Action |
|---|---|---|
| `isHoneyPot` | `false` → proceed | `true` → BLOCK on buy; WARN on sell |
| `taxRate` | ≤ 10% → proceed | > 10% → WARN, display exact rate |
| `communityRecognized` | `true` → proceed | `false` → WARN, verify manually |
| `action` | empty/null → proceed | `"block"` → HALT |
| `action` | — | `"warn"` → show details, ask confirmation |

### Tier 2 — Recommended for All Trades

```bash
# 2. Liquidity check
onchainos token liquidity --address <addr> --chain <chain>
# 3. Holder concentration
onchainos token holders --address <addr> --chain <chain>
# 4. Risk metadata
onchainos token advanced-info --address <addr> --chain <chain>
```

| Check | Pass | Fail Action |
|---|---|---|
| Liquidity | ≥ $100K → safe | <$10K → WARN high slippage; <$1K → strongly WARN |
| Top 10 holders | < 30% → healthy | > 50% → WARN centralization risk |
| Dev rug count | 0 → clean | > 0 → BLOCK, dev has history of rug pulls |
| Token age | > 7 days → established | < 24h → WARN extra caution |

### Tier 3 — Required for Meme/Speculative Tokens

```bash
# 5. Bundle/sniper detection
onchainos memepump token-bundle-info --address <addr>
# 6. Dev reputation
onchainos memepump token-dev-info --address <addr>
# 7. Cluster analysis
onchainos token cluster-overview --address <addr> --chain <chain>
```

| Check | Pass | Fail Action |
|---|---|---|
| Bundle count | Low → clean | High → WARN coordinated activity |
| Sniper activity | None → clean | Significant → WARN front-running risk |
| Dev holding % | < 5% → healthy | > 10% → WARN, dev controls supply |
| New wallet % | < 20% → organic | > 40% → WARN potential Sybil attack |

### Tier 4 — Required for DeFi Deposits

```bash
# 8. Protocol security: APY sustainability
onchainos defi rate-chart --investment-id <id> --time-range MONTH
# 9. TVL stability
onchainos defi tvl-chart --investment-id <id> --time-range SEASON
```

| Check | Pass | Fail Action |
|---|---|---|
| APY trend | Stable or declining → sustainable | Spiking → likely emissions-based, UNSUSTAINABLE |
| APY level | < 50% → acceptable risk range | > 50% → MUST WARN: elevated risk |
| TVL trend | Stable or growing → healthy | Declining → capital flight, proceed with caution |
| Protocol audits | Multiple audits + bug bounty → pass | No audits → WARN, consider skipping |

---

## 3. Position Sizing Rules

### Core Formula

```
Position Size = (Account × Risk%) / (Entry Price − Stop Loss)
```

### Risk Per Trade by Asset Category

| Category | Examples | Risk/Trade | Stop Distance | Gas Level |
|---|---|---|---|---|
| Blue-chip | BTC, ETH, SOL | 1–2% | 3–6% | `average` |
| Major alt | LINK, AVAX, MATIC | 0.5–1% | 5–10% | `average` |
| Mid-cap | DeFi tokens, L2 tokens | 0.25–0.5% | 8–15% | `average` |
| Meme / low-cap | New launches, low liquidity | 0.1–0.25% | 10–20% | `fast` |
| Stablecoin pairs | USDC/USDT | 0.5–1% | 0.1–0.3% | `average` |

### Slippage Presets

| Category | AutoSlippage Range | Gas Level | MEV Protection |
|---|---|---|---|
| Meme/low-cap | 5–20% | `fast` | If tx value ≥ chain threshold |
| Mainstream | 0.5–1% | `average` | If tx value ≥ chain threshold |
| Stablecoin | 0.1–0.3% | `average` | Usually not needed |
| Large trade (≥$1K, priceImpact ≥10%) | AutoSlippage | `average` | Enable |

---

## 4. Portfolio Risk Limits

### Maximum Exposure Limits

| Category | Max Allocation | Rationale |
|---|---|---|
| Single protocol | 5% | Protocol exploit risk |
| Single asset | 10–15% | Concentration risk |
| Single sector (DeFi, L1, meme) | 20% | Sector correlation |
| Total DeFi allocation | 40–60% of crypto | Smart contract risk ceiling |
| Stablecoin allocation | 20–40% | Liquidity reserve + opportunity fund |
| Meme/speculative | 5–10% | High risk, potential total loss |

### Suggested Portfolio Allocation

| Tier | Allocation | Examples | Risk Level |
|---|---|---|---|
| Core holdings | 40–50% | BTC, ETH, SOL | Low |
| Mid-cap DeFi | 15–20% | AAVE, UNI, LINK, crv | Medium |
| Stablecoin yield | 20–30% | USDC lending, stable staking | Low |
| Speculative | 5–10% | New tokens, meme plays | High |
| Cash reserve | 5% | Stablecoins, ready capital | None |

### Correlation Management

Cryptocurrencies are highly correlated. Five altcoin positions at 1% risk each is NOT 5% portfolio risk — in a crash, they all drop together.

**Rules**:
- Count positions in the same sector as one combined position
- If BTC drops 10%, most alts drop 15–30% — plan for correlated drawdowns
- Keep at least 2 positions in uncorrelated strategies (e.g., stablecoin yield + directional trade)
- Maximum 3 correlated positions open simultaneously

---

## 5. DeFi-Specific Risks

### Impermanent Loss (IL)

IL is the difference between holding tokens in a liquidity pool vs. holding them in your wallet. It increases as the price ratio between the two tokens diverges from your entry point.

**IL estimation by price change**:

| Price Ratio Change | Impermanent Loss |
|---|---|
| 1.25× | 0.6% |
| 1.50× | 2.0% |
| 2.00× | 5.7% |
| 3.00× | 13.4% |
| 5.00× | 25.5% |

**Always calculate**: Net Yield = Pool APY − Expected IL − Gas Costs − Token Price Decline

If net yield < holding the tokens outright, LPing is not worth it.

**IL mitigation**:
- Choose correlated pairs (ETH/stETH, USDC/USDT) — minimal IL
- Shorter holding periods reduce IL exposure
- V3 concentrated liquidity: wider tick ranges = less IL, narrower = more IL but higher fees
- Check `onchainos defi depth-price-chart` before entering V3 positions

### Smart Contract Risk Assessment

Before depositing into any DeFi protocol:

| Factor | Green Flag | Red Flag |
|---|---|---|
| Audits | 2+ independent audits | No audits |
| TVL trend | Growing or stable | Declining sharply |
| Team | Doxxed, experienced | Anonymous, new |
| Governance | Timelock ≥24h, multi-sig | No timelock, EOA-only |
| Bug bounty | Active, well-funded program | No bug bounty |
| Code age | > 6 months live, battle-tested | < 1 month, untested |

### Liquidation Risk

For lending/borrowing positions:

- Health factor should stay above 2.0 at all times (use `onchainos defi position-detail` to monitor)
- Below 1.5 → WARN — reduce exposure or add collateral
- Below 1.2 → URGENT — repay debt or add collateral immediately
- Consider worst-case: what happens if collateral drops 30% overnight?
- Stablecoin lending has minimal liquidation risk but check protocol-specific rules

---

## 6. Operational Security

### Wallet Security

- **Never share** private keys, seed phrases, or API keys in conversation
- Use `onchainos security approvals` regularly to review and revoke unnecessary token approvals
- Limit token approvals to the exact amount needed — never approve unlimited (`type(uint256).max`) unless the protocol requires it
- Run `onchainos security dapp-scan` before interacting with any unfamiliar DApp URL
- Run `onchainos security sig-scan` before signing any EIP-712 message
- For large transactions, use `onchainos security tx-scan` for pre-execution simulation

### Phishing & Scam Avoidance

| Scam Type | How to Detect | On-chain Tools |
|---|---|---|
| Fake token | Same name/symbol, different contract address | `onchainos token search` to verify; always check contract address |
| Honeypot | Can buy, can't sell | `onchainos security token-scan`; check `isHoneyPot` |
| Phishing DApp | Fake URL, similar-looking domain | `onchainos security dapp-scan --domain <url>` |
| Malicious signature | Requests unnecessary approvals | `onchainos security sig-scan` before signing |
| Dusting attack | Tiny unwanted token deposits | Ignore dust; never interact with unknown tokens |

### Approval Hygiene

```bash
# Check current approvals
onchainos security approvals --address <addr> --chain <chain>

# Best practices:
# 1. Revoke approvals after use (especially for one-time interactions)
# 2. Use exact amount approvals instead of unlimited
# 3. Never approve tokens you don't intend to use
# 4. Review approvals monthly
```

---

## 7. Emergency Procedures

### When Things Go Wrong

| Situation | Immediate Action |
|---|---|
|疑似 Rug Pull | 1. `onchainos token liquidity` → check if you can still exit 2. If liquidity remains, `onchainos swap execute` immediately with wider slippage 3. If no liquidity, accept loss — do NOT send more funds |
| Smart contract exploit | 1. `onchainos security approvals` → revoke all approvals for the exploited protocol 2. Move remaining assets to a fresh wallet if compromised protocol had approval access |
| Wallet compromise | 1. Immediately move all assets to a new wallet 2. Revoke all existing token approvals 3. Do NOT use the compromised wallet again |
| Stuck transaction | 1. `onchainos gateway orders` → check status 2. If pending > 5 min, check gas level 3. If failed, retry with higher gas level (`fast`) |
| Cannot sell a token | 1. `onchainos security token-scan` → check if honeypot 2. If `isHoneyPot = true`, it may be designed to trap buyers 3. Try selling on a different DEX if available 4. If tax rate > 50%, the token architecture prevents profitable exit |

### Rapid Portfolio Risk Assessment

When market moves sharply and you need to assess damage quickly:

```bash
# 1. Total portfolio value
onchainos portfolio total-value --address <addr> --chains <chains>

# 2. Per-token exposure
onchainos portfolio all-balances --address <addr> --chains <chains>

# 3. PnL snapshot
onchainos market portfolio-recent-pnl --address <addr> --chain <chain>

# 4. DeFi exposure
onchainos defi positions --address <addr> --chains <chains>
```

### Post-Incident Review

After any significant loss or near-miss:

1. Document what happened (entry, exit, amount, reasoning)
2. Identify which risk check failed or was skipped
3. Add the lesson to your personal risk checklist
4. Verify remaining positions are still within risk limits
5. Consider reducing total exposure until confidence returns