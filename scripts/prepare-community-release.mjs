import { appendFile, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RELEASE_RANK = { patch: 0, minor: 1, major: 2 };

function surfaceTokens(report) {
  const tokens = new Set();
  for (const component of report.components ?? []) {
    const componentId = String(component.id);
    tokens.add(`component:${componentId}`);
    for (const variantId of component.variantIds ?? []) tokens.add(`variant:${componentId}:${variantId}`);
    for (const controlKey of component.controlKeys ?? []) tokens.add(`control:${componentId}:${controlKey}`);
    for (const [variantId, controlKeys] of Object.entries(component.variantControlKeys ?? {})) {
      for (const controlKey of controlKeys ?? []) tokens.add(`variant-control:${componentId}:${variantId}:${controlKey}`);
    }
  }
  return tokens;
}

export function classifyRelease(beforeReport, afterReport) {
  const before = surfaceTokens(beforeReport);
  const after = surfaceTokens(afterReport);
  const removed = [...before].filter((token) => !after.has(token)).sort();
  const added = [...after].filter((token) => !before.has(token)).sort();
  return {
    inferredType: removed.length ? "major" : added.length ? "minor" : "patch",
    added,
    removed,
  };
}

export function incrementVersion(version, releaseType) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Expected a stable semantic version, received ${version}.`);
  const [, majorText, minorText, patchText] = match;
  const major = Number(majorText);
  const minor = Number(minorText);
  const patch = Number(patchText);
  if (releaseType === "major") return `${major + 1}.0.0`;
  if (releaseType === "minor") return `${major}.${minor + 1}.0`;
  if (releaseType === "patch") return `${major}.${minor}.${patch + 1}`;
  throw new Error(`Unknown release type ${releaseType}.`);
}

function parseArguments(argv) {
  const values = { root: resolve(dirname(fileURLToPath(import.meta.url)), ".."), type: "auto" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--before") values.before = resolve(argv[++index]);
    else if (argument === "--root") values.root = resolve(argv[++index]);
    else if (argument === "--type") values.type = argv[++index];
    else throw new Error(`Unknown argument ${argument}.`);
  }
  if (!values.before) throw new Error("Pass the previous sync report with --before <path>.");
  if (!["auto", "patch", "minor", "major"].includes(values.type)) throw new Error(`Unknown release type ${values.type}.`);
  return values;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const beforeReport = JSON.parse(await readFile(options.before, "utf8"));
  const afterReport = JSON.parse(await readFile(resolve(options.root, "public/community-sync-report.json"), "utf8"));
  const packagePath = resolve(options.root, "package.json");
  const lockPath = resolve(options.root, "package-lock.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  const packageLock = JSON.parse(await readFile(lockPath, "utf8"));
  const classification = classifyRelease(beforeReport, afterReport);
  const releaseType = options.type === "auto" ? classification.inferredType : options.type;

  if (RELEASE_RANK[releaseType] < RELEASE_RANK[classification.inferredType]) {
    throw new Error(`The requested ${releaseType} release is lower than the inferred ${classification.inferredType} release.`);
  }

  const previousVersion = packageJson.version;
  const nextVersion = incrementVersion(previousVersion, releaseType);
  packageJson.version = nextVersion;
  packageLock.version = nextVersion;
  if (!packageLock.packages?.[""]) throw new Error("package-lock.json is missing its root package record.");
  packageLock.packages[""].version = nextVersion;

  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  await writeFile(lockPath, `${JSON.stringify(packageLock, null, 2)}\n`);

  const result = {
    releaseType,
    previousVersion,
    nextVersion,
    addedSurfaces: classification.added,
    removedSurfaces: classification.removed,
  };
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `release_type=${releaseType}\nprevious_version=${previousVersion}\nnext_version=${nextVersion}\n`);
  }
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
