import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import skill from "../../skills/okx-meme-intelligence/SKILL.md?raw";
import bondingCurveMath from "../../skills/okx-meme-intelligence/references/bonding-curve-math.md?raw";
import devReputation from "../../skills/okx-meme-intelligence/references/dev-reputation-analysis.md?raw";
import entryExit from "../../skills/okx-meme-intelligence/references/entry-exit-strategies.md?raw";
import memeScoring from "../../skills/okx-meme-intelligence/references/meme-scoring-model.md?raw";
import sniperBundler from "../../skills/okx-meme-intelligence/references/sniper-bundler-detection.md?raw";
import socialCorrelation from "../../skills/okx-meme-intelligence/references/social-correlation.md?raw";
import chainSupport from "../../skills/okx-meme-intelligence/_shared/chain-support.md?raw";
import nativeTokens from "../../skills/okx-meme-intelligence/_shared/native-tokens.md?raw";
import preflight from "../../skills/okx-meme-intelligence/_shared/preflight.md?raw";
import openai from "../../skills/okx-meme-intelligence/agents/openai.yaml?raw";

const files: FileEntry[] = [
  { id: "meme-skill", filename: "SKILL.md", content: skill },
  { id: "meme-ref-header", filename: "references/", isHeader: true, content: "" },
  { id: "meme-bonding", filename: "references/bonding-curve-math.md", content: bondingCurveMath },
  { id: "meme-dev", filename: "references/dev-reputation-analysis.md", content: devReputation },
  { id: "meme-entry", filename: "references/entry-exit-strategies.md", content: entryExit },
  { id: "meme-scoring", filename: "references/meme-scoring-model.md", content: memeScoring },
  { id: "meme-sniper", filename: "references/sniper-bundler-detection.md", content: sniperBundler },
  { id: "meme-social", filename: "references/social-correlation.md", content: socialCorrelation },
  { id: "meme-shared-header", filename: "_shared/", isHeader: true, content: "" },
  { id: "meme-chain", filename: "_shared/chain-support.md", content: chainSupport },
  { id: "meme-native", filename: "_shared/native-tokens.md", content: nativeTokens },
  { id: "meme-preflight", filename: "_shared/preflight.md", content: preflight },
  { id: "meme-agents-header", filename: "agents/", isHeader: true, content: "" },
  { id: "meme-openai", filename: "agents/openai.yaml", content: openai, isCode: true },
];

export default function MemeIntelligencePanel() {
  return <FileListPanel files={files} ariaLabel="Meme Intelligence skill files" />;
}
