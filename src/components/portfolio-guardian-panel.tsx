import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import skill from "../../skills/okx-portfolio-guardian/SKILL.md?raw";
import alertConfig from "../../skills/okx-portfolio-guardian/references/alert-configuration.md?raw";
import approvalMonitoring from "../../skills/okx-portfolio-guardian/references/approval-monitoring.md?raw";
import autoResponseRules from "../../skills/okx-portfolio-guardian/references/auto-response-rules.md?raw";
import ilTracking from "../../skills/okx-portfolio-guardian/references/il-tracking.md?raw";
import riskFramework from "../../skills/okx-portfolio-guardian/references/risk-monitoring-framework.md?raw";
import stopLossPlaybook from "../../skills/okx-portfolio-guardian/references/stop-loss-playbook.md?raw";
import tradeLogSchema from "../../skills/okx-portfolio-guardian/references/trade-log-schema.md?raw";
import chainSupport from "../../skills/okx-portfolio-guardian/_shared/chain-support.md?raw";
import nativeTokens from "../../skills/okx-portfolio-guardian/_shared/native-tokens.md?raw";
import preflight from "../../skills/okx-portfolio-guardian/_shared/preflight.md?raw";
import openai from "../../skills/okx-portfolio-guardian/agents/openai.yaml?raw";

const files: FileEntry[] = [
  { id: "pg-skill", filename: "SKILL.md", content: skill },
  { id: "pg-ref-header", filename: "references/", isHeader: true, content: "" },
  { id: "pg-alerts", filename: "references/alert-configuration.md", content: alertConfig },
  { id: "pg-approvals", filename: "references/approval-monitoring.md", content: approvalMonitoring },
  { id: "pg-auto", filename: "references/auto-response-rules.md", content: autoResponseRules },
  { id: "pg-il", filename: "references/il-tracking.md", content: ilTracking },
  { id: "pg-risk", filename: "references/risk-monitoring-framework.md", content: riskFramework },
  { id: "pg-stoploss", filename: "references/stop-loss-playbook.md", content: stopLossPlaybook },
  { id: "pg-tradelog", filename: "references/trade-log-schema.md", content: tradeLogSchema },
  { id: "pg-shared-header", filename: "_shared/", isHeader: true, content: "" },
  { id: "pg-chain", filename: "_shared/chain-support.md", content: chainSupport },
  { id: "pg-native", filename: "_shared/native-tokens.md", content: nativeTokens },
  { id: "pg-preflight", filename: "_shared/preflight.md", content: preflight },
  { id: "pg-agents-header", filename: "agents/", isHeader: true, content: "" },
  { id: "pg-openai", filename: "agents/openai.yaml", content: openai, isCode: true },
];

export { files };

export default function PortfolioGuardianPanel() {
  return <FileListPanel files={files} ariaLabel="Portfolio Guardian skill files" />;
}
