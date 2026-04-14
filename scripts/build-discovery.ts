import { createHash } from "node:crypto";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  createReadStream,
} from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const SCHEMA_URI = "https://schemas.agentskills.io/discovery/0.2.0/schema.json";

const publicDir = join(import.meta.dirname, "..", "public");
const wellKnownDir = join(publicDir, ".well-known", "agent-skills");
const skillsDir = join(import.meta.dirname, "..", "skills");

function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(`sha256:${hash.digest("hex")}`));
    stream.on("error", reject);
  });
}

function hashDirectory(dir: string): string {
  const hash = createHash("sha256");

  function walk(current: string) {
    const entries = readdirSync(current).sort();
    for (const entry of entries) {
      const fullPath = join(current, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        hash.update(`dir:${entry}\n`);
        walk(fullPath);
      } else {
        hash.update(`file:${entry}\n`);
        hash.update(readFileSync(fullPath));
      }
    }
  }

  walk(dir);
  return hash.digest("hex");
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (line.startsWith("  ")) continue;
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return data;
}

async function main(): Promise<void> {
  if (!existsSync(skillsDir)) {
    console.error("Skills directory not found at", skillsDir);
    process.exit(1);
  }

  const skillNames = readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort();

  if (skillNames.length === 0) {
    console.error("No skills found in", skillsDir);
    process.exit(1);
  }

  const contentHashes: Record<string, string> = {};
  for (const name of skillNames) {
    contentHashes[name] = hashDirectory(join(skillsDir, name));
  }

  const indexPath = join(wellKnownDir, "index.json");
  if (existsSync(indexPath)) {
    const existing = JSON.parse(readFileSync(indexPath, "utf-8"));
    const allMatch = existing.skills.every(
      (s: { name: string; _contentHash: string }) =>
        s._contentHash === contentHashes[s.name]
    );
    if (allMatch && skillNames.length === existing.skills.length) {
      console.log("No changes detected, skipping build.");
      return;
    }
  }

  const skills: object[] = [];

  for (const name of skillNames) {
    const skillSrc = join(skillsDir, name);
    const archivePath = join(wellKnownDir, `${name}.tar.gz`);

    execSync(`tar -czf "${archivePath}" -C "${skillSrc}" .`, { stdio: "inherit" });
    console.log("Created archive:", archivePath);

    const archiveDigest = await sha256File(archivePath);
    console.log(`${name} digest:`, archiveDigest);

    const frontmatter = parseFrontmatter(readFileSync(join(skillSrc, "SKILL.md"), "utf-8"));

    skills.push({
      name: frontmatter.name || name,
      type: "archive",
      description: frontmatter.description || "",
      url: `/.well-known/agent-skills/${name}.tar.gz`,
      digest: archiveDigest,
      _contentHash: contentHashes[name],
    });
  }

  const index = { $schema: SCHEMA_URI, skills };
  writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
  console.log("Updated index:", indexPath);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
