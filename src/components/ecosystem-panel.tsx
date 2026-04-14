import type { FileEntry } from "./file-list-panel";
import FileListPanel from "./file-list-panel";

import ecosystemSkill from "../../skills/okx-ecosystem-discovery/SKILL.md?raw";

const files: FileEntry[] = [
  {
    id: "ecosystem-skill",
    filename: "SKILL.md",
    content: ecosystemSkill,
  },
];

export default function EcosystemPanel() {
  return <FileListPanel files={files} ariaLabel="Ecosystem discovery skill files" />;
}
