const skillModules = import.meta.glob("../../skills/**/*.{md,yaml}", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface FileEntry {
  id: string;
  filename: string;
  content: string;
  isHeader?: boolean;
  isCode?: boolean;
}

function buildSkillFiles(skillName: string): FileEntry[] {
  const skillPrefix = `../../skills/${skillName}/`;
  const skillFiles: FileEntry[] = [];

  const sortedPaths = Object.keys(skillModules)
    .filter((path) => path.startsWith(skillPrefix))
    .sort();

  let lastCategory: string | null = null;

  for (const filePath of sortedPaths) {
    const filename = filePath.replace(skillPrefix, "");
    const content = skillModules[filePath] as string;

    if (filename.endsWith("/")) continue;

    const relativePath = filename.replace(/\.(md|yaml)$/, "");
    const prefix = skillName.replace(/^okx-/, "").replace(/-/g, "");
    const id = `${prefix}-${relativePath.replace(/\//g, "-")}`;

    const isCode = filePath.endsWith(".yaml");

    let category: string | null = null;
    if (filename.startsWith("references/")) {
      category = "references";
    } else if (filename.startsWith("_shared/")) {
      category = "_shared";
    } else if (filename.startsWith("agents/")) {
      category = "agents";
    }

    if (category && category !== lastCategory) {
      const categoryId = `${prefix}-${category.replace(/^_/, "")}-header`;
      skillFiles.push({
        id: categoryId,
        filename: `${category}/`,
        isHeader: true,
        content: "",
      });
      lastCategory = category;
    }

    skillFiles.push({
      id,
      filename,
      content,
      isCode,
    });
  }

  return skillFiles;
}

export const tradingFiles = buildSkillFiles("okx-trading");
export const uniswapFiles = buildSkillFiles("okx-uniswap");
export const xlayerFiles = buildSkillFiles("okx-xlayer-agent");
export const portfolioGuardianFiles = buildSkillFiles("okx-portfolio-guardian");
export const memeIntelligenceFiles = buildSkillFiles("okx-meme-intelligence");
export const uniswapDevFiles = buildSkillFiles("okx-uniswap-dev");
export const ecosystemFiles = buildSkillFiles("okx-ecosystem-discovery");
