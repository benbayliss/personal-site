import { execFileSync } from "node:child_process";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ledgerPath = path.join(root, "data", "build-health.json");
const sourceRoots = ["app", "build", "db", "scripts", "tests", "worker"];
const sourceExtensions = new Set([".css", ".js", ".mjs", ".ts", ".tsx"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    if (entry.isFile()) files.push(entryPath);
  }

  return files;
}

function currentCommit() {
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "uncommitted";
  }
}

const sourceFiles = (
  await Promise.all(sourceRoots.map((directory) => walk(path.join(root, directory))))
)
  .flat()
  .filter((file) => sourceExtensions.has(path.extname(file)));
const buildFiles = await walk(path.join(root, "dist"));
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

const sourceLineCounts = await Promise.all(
  sourceFiles.map(async (file) => {
    const contents = await readFile(file, "utf8");
    return contents === "" ? 0 : contents.split("\n").length;
  }),
);
const buildSizes = await Promise.all(
  buildFiles.map(async (file) => (await stat(file)).size),
);

const record = {
  recordedAt: new Date().toISOString(),
  commit: currentCommit(),
  status: "passing",
  node: process.version,
  sourceFiles: sourceFiles.length,
  sourceLines: sourceLineCounts.reduce((total, lines) => total + lines, 0),
  buildFiles: buildFiles.length,
  buildBytes: buildSizes.reduce((total, bytes) => total + bytes, 0),
  dependencies:
    Object.keys(packageJson.dependencies ?? {}).length +
    Object.keys(packageJson.devDependencies ?? {}).length,
};

let history = [];
try {
  const existing = JSON.parse(await readFile(ledgerPath, "utf8"));
  history = Array.isArray(existing.history) ? existing.history : [];
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

history.push(record);
history = history.slice(-90);

await writeFile(
  ledgerPath,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      description:
        "Automated site-health records created only after lint and tests pass.",
      latest: record,
      history,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Recorded passing build: ${record.sourceLines} source lines, ${record.buildBytes} build bytes.`,
);
