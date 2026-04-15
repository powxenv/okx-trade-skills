import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import skill from "../../skills/okx-uniswap-dev/SKILL.md?raw";
import advancedPatterns from "../../skills/okx-uniswap-dev/references/advanced-patterns.md?raw";
import auditChecklist from "../../skills/okx-uniswap-dev/references/audit-checklist.md?raw";
import baseHookTemplate from "../../skills/okx-uniswap-dev/references/base-hook-template.md?raw";
import ccaDeployment from "../../skills/okx-uniswap-dev/references/cca-deployment.md?raw";
import credentialConstruction from "../../skills/okx-uniswap-dev/references/credential-construction.md?raw";
import dataProviders from "../../skills/okx-uniswap-dev/references/data-providers.md?raw";
import hookDevelopment from "../../skills/okx-uniswap-dev/references/hook-development.md?raw";
import liquidityStrategies from "../../skills/okx-uniswap-dev/references/liquidity-strategies.md?raw";
import positionTypes from "../../skills/okx-uniswap-dev/references/position-types.md?raw";
import sdkIntegration from "../../skills/okx-uniswap-dev/references/sdk-integration.md?raw";
import swapIntegrationExpert from "../../skills/okx-uniswap-dev/references/swap-integration-expert.md?raw";
import tradingApiFlows from "../../skills/okx-uniswap-dev/references/trading-api-flows.md?raw";
import troubleshooting from "../../skills/okx-uniswap-dev/references/troubleshooting.md?raw";
import viemPatterns from "../../skills/okx-uniswap-dev/references/viem-patterns.md?raw";
import viemIntegrationExpert from "../../skills/okx-uniswap-dev/references/viem-integration-expert.md?raw";
import vulnerabilitiesCatalog from "../../skills/okx-uniswap-dev/references/vulnerabilities-catalog.md?raw";
import x402Payments from "../../skills/okx-uniswap-dev/references/x402-payments.md?raw";
import chains from "../../skills/okx-uniswap-dev/references/chains.md?raw";
import chainSupport from "../../skills/okx-uniswap-dev/_shared/chain-support.md?raw";
import nativeTokens from "../../skills/okx-uniswap-dev/_shared/native-tokens.md?raw";
import preflight from "../../skills/okx-uniswap-dev/_shared/preflight.md?raw";
import openai from "../../skills/okx-uniswap-dev/agents/openai.yaml?raw";

const files: FileEntry[] = [
  { id: "udev-skill", filename: "SKILL.md", content: skill },
  { id: "udev-ref-header", filename: "references/", isHeader: true, content: "" },
  { id: "udev-advanced", filename: "references/advanced-patterns.md", content: advancedPatterns },
  { id: "udev-audit", filename: "references/audit-checklist.md", content: auditChecklist },
  { id: "udev-base-hook", filename: "references/base-hook-template.md", content: baseHookTemplate },
  { id: "udev-cca", filename: "references/cca-deployment.md", content: ccaDeployment },
  { id: "udev-credential", filename: "references/credential-construction.md", content: credentialConstruction },
  { id: "udev-dataproviders", filename: "references/data-providers.md", content: dataProviders },
  { id: "udev-hooks", filename: "references/hook-development.md", content: hookDevelopment },
  { id: "udev-liquidity", filename: "references/liquidity-strategies.md", content: liquidityStrategies },
  { id: "udev-positions", filename: "references/position-types.md", content: positionTypes },
  { id: "udev-sdk", filename: "references/sdk-integration.md", content: sdkIntegration },
  { id: "udev-swap-expert", filename: "references/swap-integration-expert.md", content: swapIntegrationExpert },
  { id: "udev-trading-flows", filename: "references/trading-api-flows.md", content: tradingApiFlows },
  { id: "udev-troubleshooting", filename: "references/troubleshooting.md", content: troubleshooting },
  { id: "udev-viem", filename: "references/viem-patterns.md", content: viemPatterns },
  { id: "udev-viem-expert", filename: "references/viem-integration-expert.md", content: viemIntegrationExpert },
  { id: "udev-vulns", filename: "references/vulnerabilities-catalog.md", content: vulnerabilitiesCatalog },
  { id: "udev-x402", filename: "references/x402-payments.md", content: x402Payments },
  { id: "udev-chains", filename: "references/chains.md", content: chains },
  { id: "udev-shared-header", filename: "_shared/", isHeader: true, content: "" },
  { id: "udev-chain", filename: "_shared/chain-support.md", content: chainSupport },
  { id: "udev-native", filename: "_shared/native-tokens.md", content: nativeTokens },
  { id: "udev-preflight", filename: "_shared/preflight.md", content: preflight },
  { id: "udev-agents-header", filename: "agents/", isHeader: true, content: "" },
  { id: "udev-openai", filename: "agents/openai.yaml", content: openai, isCode: true },
];

export default function UniswapDevPanel() {
  return <FileListPanel files={files} ariaLabel="Uniswap Dev skill files" />;
}
