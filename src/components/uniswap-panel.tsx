import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import uniswapSkill from "../../skills/okx-uniswap/SKILL.md?raw";
import uniswapAgentPatterns from "../../skills/okx-uniswap/references/agent-uniswap-patterns.md?raw";
import uniswapKeywordGlossary from "../../skills/okx-uniswap/references/keyword-glossary.md?raw";
import uniswapLiquidityMgmt from "../../skills/okx-uniswap/references/liquidity-management.md?raw";
import uniswapRiskManagement from "../../skills/okx-uniswap/references/risk-management.md?raw";
import uniswapStrategies from "../../skills/okx-uniswap/references/trading-strategies.md?raw";
import uniswapTradingApi from "../../skills/okx-uniswap/references/trading-api.md?raw";
import uniswapX402Payments from "../../skills/okx-uniswap/references/x402-payments.md?raw";
import uniswapXlayerStrategies from "../../skills/okx-uniswap/references/xlayer-strategies.md?raw";
import uniswapChainSupport from "../../skills/okx-uniswap/_shared/chain-support.md?raw";
import uniswapNativeTokens from "../../skills/okx-uniswap/_shared/native-tokens.md?raw";
import uniswapPreflight from "../../skills/okx-uniswap/_shared/preflight.md?raw";
import uniswapOpenai from "../../skills/okx-uniswap/agents/openai.yaml?raw";

const files: FileEntry[] = [
  { id: "uniswap-skill", filename: "SKILL.md", content: uniswapSkill },
  { id: "uniswap-ref-header", filename: "references/", isHeader: true, content: "" },
  { id: "uniswap-patterns", filename: "references/agent-uniswap-patterns.md", content: uniswapAgentPatterns },
  { id: "uniswap-keyword-glossary", filename: "references/keyword-glossary.md", content: uniswapKeywordGlossary },
  { id: "uniswap-liquidity", filename: "references/liquidity-management.md", content: uniswapLiquidityMgmt },
  { id: "uniswap-risk-mgmt", filename: "references/risk-management.md", content: uniswapRiskManagement },
  { id: "uniswap-strategies", filename: "references/trading-strategies.md", content: uniswapStrategies },
  { id: "uniswap-trading-api", filename: "references/trading-api.md", content: uniswapTradingApi },
  { id: "uniswap-xlayer", filename: "references/xlayer-strategies.md", content: uniswapXlayerStrategies },
  { id: "uniswap-payments", filename: "references/x402-payments.md", content: uniswapX402Payments },
  { id: "uniswap-shared-header", filename: "_shared/", isHeader: true, content: "" },
  { id: "uniswap-chain-support", filename: "_shared/chain-support.md", content: uniswapChainSupport },
  { id: "uniswap-native-tokens", filename: "_shared/native-tokens.md", content: uniswapNativeTokens },
  { id: "uniswap-preflight", filename: "_shared/preflight.md", content: uniswapPreflight },
  { id: "uniswap-agents-header", filename: "agents/", isHeader: true, content: "" },
  { id: "uniswap-openai", filename: "agents/openai.yaml", content: uniswapOpenai, isCode: true },
];

export { files };

export default function UniswapPanel() {
  return <FileListPanel files={files} ariaLabel="Uniswap skill files" />;
}
