import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = await mkdtemp(join(tmpdir(), "threeui-package-smoke-"));
const packDirectory = join(temporaryRoot, "pack");
const consumerDirectory = join(temporaryRoot, "consumer");
const emptyUserConfig = join(temporaryRoot, "user.npmrc");
const emptyGlobalConfig = join(temporaryRoot, "global.npmrc");
const environment = { ...process.env };

for (const name of Object.keys(environment)) {
  if (/^(?:NODE_AUTH_TOKEN|NPM_TOKEN|NPM_CONFIG_.*AUTH.*)$/i.test(name)) delete environment[name];
}
environment.NPM_CONFIG_USERCONFIG = emptyUserConfig;
environment.NPM_CONFIG_GLOBALCONFIG = emptyGlobalConfig;
environment.NPM_CONFIG_AUDIT = "false";
environment.NPM_CONFIG_FUND = "false";

try {
  await Promise.all([
    mkdir(packDirectory, { recursive: true }),
    mkdir(consumerDirectory, { recursive: true }),
    writeFile(emptyUserConfig, ""),
    writeFile(emptyGlobalConfig, ""),
  ]);
  const packResult = JSON.parse(execFileSync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", packDirectory],
    { cwd: root, encoding: "utf8", env: environment },
  ));
  const tarball = join(packDirectory, packResult[0].filename);
  await writeFile(join(consumerDirectory, "package.json"), `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`);
  execFileSync(
    "npm",
    ["install", "--ignore-scripts", tarball, "react@19", "react-dom@19", "three@0.149.0"],
    { cwd: consumerDirectory, stdio: "inherit", env: environment },
  );
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      "const root = await import('@designcodeio/threeui'); const cloud = await import('@designcodeio/threeui/components/CloudField'); const legacyToggle = await import('@designcodeio/threeui/components/SkeuomorphicToggle'); const toggleCollection = await import('@designcodeio/threeui/components/SkeuomorphicToggleCollection'); if (typeof root.SkeuomorphicToggle !== 'function' || typeof root.SkeuomorphicToggleCollection !== 'function' || typeof cloud.CloudField !== 'function' || typeof legacyToggle.SkeuomorphicToggle !== 'function' || typeof toggleCollection.SkeuomorphicToggleCollection !== 'function') process.exit(1);",
    ],
    { cwd: consumerDirectory, stdio: "inherit", env: environment },
  );
  console.log(`Anonymous install smoke test passed for ${packResult[0].filename}.`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
