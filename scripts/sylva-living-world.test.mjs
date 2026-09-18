import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = join(root, "src", "shaders", "sylva-living-world", "SylvaLivingWorldScene.tsx");
const source = await readFile(componentPath, "utf8");
const syncSource = await readFile(join(root, "scripts", "sync-community-from-main.mjs"), "utf8");

test("Sylva keeps its sandboxed scene font self-contained", async () => {
  assert.match(source, /lexend-latin\.woff2\?inline/);
  assert.match(source, /assetBaseUrl\?: string/);
  assert.match(source, /<base href=/);
  assert.match(source, /sandbox="allow-scripts"/);
  assert.doesNotMatch(source, /sandbox="allow-scripts allow-same-origin"/);
  await stat(join(root, "src", "shaders", "sylva-living-world", "sources", "inner-green-assets", "lexend-latin.woff2"));
});

test("Sylva preserves the scene-only adapter and reduced-motion path", () => {
  assert.match(source, /SCENE_ONLY_MARKUP/);
  assert.match(source, /data-threeui-three-runtime/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /requestAnimationFrame\(loop\)/);
});

test("community sync preserves the self-contained Sylva font", () => {
  assert.match(syncSource, /copySylvaLivingWorldFont/);
  assert.match(syncSource, /lexend-latin\.woff2/);
  assert.match(syncSource, /generatePatchedSylvaLivingWorldModule/);
});
