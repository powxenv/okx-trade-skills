import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import skill from "../../skills/okx-uniswap-dev/SKILL.md?raw";
import ccaDeployment from "../../skills/okx-uniswap-dev/references/cca-deployment.md?raw";
import hookDevelopment from "../../skills/okx-uniswap-dev/references/hook-development.md?raw";
import liquidityStrategies from "../../skills/okx-uniswap-dev/references/liquidity-strategies.md?raw";
import sdkIntegration from "../../skills/okx-uniswap-dev/references/sdk-integration.md?raw";
import troubleshooting from "../../skills/okx-uniswap-dev/references/troubleshooting.md?raw";
import viemPatterns from "../../skills/okx-uniswap-dev/references/viem-patterns.md?raw";
import x402Payments from "../../skills/okx-uniswap-dev/references/x402-payments.md?raw";
import chainSupport from "../../skills/okx-uniswap-dev/_shared/chain-support.md?raw";
import nativeTokens from "../../skills/okx-uniswap-dev/_shared/native-tokens.md?raw";
import preflight from "../../skills/okx-uniswap-dev/_shared/preflight.md?raw";
import openai from "../../skills/okx-uniswap-dev/agents/openai.yaml?raw";

const files: FileEntry[] = [
  { id: "udev-skill", filename: "SKILL.md", content: skill },
  { id: "udev-ref-header", filename: "references/", isHeader: true, content: "" },
  { id: "udev-cca", filename: "references/cca-deployment.md", content: ccaDeployment },
  { id: "udev-hooks", filename: "references/hook-development.md", content: hookDevelopment },
  { id: "udev-liquidity", filename: "references/liquidity-strategies.md", content: liquidityStrategies },
  { id: "udev-sdk", filename: "references/sdk-integration.md", content: sdkIntegration },
  { id: "udev-troubleshooting", filename: "references/troubleshooting.md", content: troubleshooting },
  { id: "udev-viem", filename: "references/viem-patterns.md", content: viemPatterns },
  { id: "udev-x402", filename: "references/x402-payments.md", content: x402Payments },
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
