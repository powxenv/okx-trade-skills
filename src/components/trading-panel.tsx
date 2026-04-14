import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import tradingSkill from "../../skills/okx-trading/SKILL.md?raw";
import tradingAgentAutomation from "../../skills/okx-trading/references/agent-automation.md?raw";
import tradingAuthentication from "../../skills/okx-trading/references/authentication.md?raw";
import tradingCliDefi from "../../skills/okx-trading/references/cli-reference-defi.md?raw";
import tradingCliMarket from "../../skills/okx-trading/references/cli-reference-market.md?raw";
import tradingCliSecurity from "../../skills/okx-trading/references/cli-reference-security.md?raw";
import tradingCliSignal from "../../skills/okx-trading/references/cli-reference-signal.md?raw";
import tradingCliSwap from "../../skills/okx-trading/references/cli-reference-swap.md?raw";
import tradingDecisionFramework from "../../skills/okx-trading/references/decision-framework.md?raw";
import tradingKeywordGlossary from "../../skills/okx-trading/references/keyword-glossary.md?raw";
import tradingMarketAnalysis from "../../skills/okx-trading/references/market-analysis.md?raw";
import tradingRiskFramework from "../../skills/okx-trading/references/risk-framework.md?raw";
import tradingRiskManagement from "../../skills/okx-trading/references/risk-management.md?raw";
import tradingStrategies from "../../skills/okx-trading/references/trading-strategies.md?raw";
import tradingTroubleshooting from "../../skills/okx-trading/references/troubleshooting.md?raw";
import tradingUniswapIntegration from "../../skills/okx-trading/references/uniswap-integration.md?raw";
import tradingWorkflowBuy from "../../skills/okx-trading/references/workflow-buy.md?raw";
import tradingWorkflowDefiYield from "../../skills/okx-trading/references/workflow-defi-yield.md?raw";
import tradingWorkflowMeme from "../../skills/okx-trading/references/workflow-meme-trading.md?raw";
import tradingWorkflowResearch from "../../skills/okx-trading/references/workflow-research.md?raw";
import tradingWorkflowSell from "../../skills/okx-trading/references/workflow-sell.md?raw";
import tradingWsMonitoring from "../../skills/okx-trading/references/ws-monitoring.md?raw";
import tradingXlayerStrategies from "../../skills/okx-trading/references/xlayer-strategies.md?raw";
import tradingChainSupport from "../../skills/okx-trading/_shared/chain-support.md?raw";
import tradingNativeTokens from "../../skills/okx-trading/_shared/native-tokens.md?raw";
import tradingPreflight from "../../skills/okx-trading/_shared/preflight.md?raw";
import tradingOpenai from "../../skills/okx-trading/agents/openai.yaml?raw";

const files: FileEntry[] = [
  { id: "trading-skill", filename: "SKILL.md", content: tradingSkill },
  { id: "trading-ref-header", filename: "references/", isHeader: true, content: "" },
  { id: "trading-agent-auto", filename: "references/agent-automation.md", content: tradingAgentAutomation },
  { id: "trading-authentication", filename: "references/authentication.md", content: tradingAuthentication },
  { id: "trading-cli-defi", filename: "references/cli-reference-defi.md", content: tradingCliDefi },
  { id: "trading-cli-market", filename: "references/cli-reference-market.md", content: tradingCliMarket },
  { id: "trading-cli-security", filename: "references/cli-reference-security.md", content: tradingCliSecurity },
  { id: "trading-cli-signal", filename: "references/cli-reference-signal.md", content: tradingCliSignal },
  { id: "trading-cli-swap", filename: "references/cli-reference-swap.md", content: tradingCliSwap },
  { id: "trading-decision-framework", filename: "references/decision-framework.md", content: tradingDecisionFramework },
  { id: "trading-keyword-glossary", filename: "references/keyword-glossary.md", content: tradingKeywordGlossary },
  { id: "trading-market-analysis", filename: "references/market-analysis.md", content: tradingMarketAnalysis },
  { id: "trading-risk-framework", filename: "references/risk-framework.md", content: tradingRiskFramework },
  { id: "trading-risk-management", filename: "references/risk-management.md", content: tradingRiskManagement },
  { id: "trading-strategies", filename: "references/trading-strategies.md", content: tradingStrategies },
  { id: "trading-troubleshooting", filename: "references/troubleshooting.md", content: tradingTroubleshooting },
  { id: "trading-uniswap-integration", filename: "references/uniswap-integration.md", content: tradingUniswapIntegration },
  { id: "trading-workflow-buy", filename: "references/workflow-buy.md", content: tradingWorkflowBuy },
  { id: "trading-workflow-defi", filename: "references/workflow-defi-yield.md", content: tradingWorkflowDefiYield },
  { id: "trading-workflow-meme", filename: "references/workflow-meme-trading.md", content: tradingWorkflowMeme },
  { id: "trading-workflow-research", filename: "references/workflow-research.md", content: tradingWorkflowResearch },
  { id: "trading-workflow-sell", filename: "references/workflow-sell.md", content: tradingWorkflowSell },
  { id: "trading-ws", filename: "references/ws-monitoring.md", content: tradingWsMonitoring },
  { id: "trading-xlayer", filename: "references/xlayer-strategies.md", content: tradingXlayerStrategies },
  { id: "trading-shared-header", filename: "_shared/", isHeader: true, content: "" },
  { id: "trading-chain-support", filename: "_shared/chain-support.md", content: tradingChainSupport },
  { id: "trading-native-tokens", filename: "_shared/native-tokens.md", content: tradingNativeTokens },
  { id: "trading-preflight", filename: "_shared/preflight.md", content: tradingPreflight },
  { id: "trading-agents-header", filename: "agents/", isHeader: true, content: "" },
  { id: "trading-openai", filename: "agents/openai.yaml", content: tradingOpenai, isCode: true },
];

export default function TradingPanel() {
  return <FileListPanel files={files} ariaLabel="Trading skill files" />;
}
