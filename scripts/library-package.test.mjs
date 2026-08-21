import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const catalog = await readFile(resolve(root, "src/data/shaders.tsx"), "utf8");
const generator = await readFile(resolve(root, "scripts/generate-library-entry.mjs"), "utf8");

test("the npm package is public, scoped, and exports ESM, types, CSS, and assets", () => {
  assert.equal(packageJson.name, "@threeui/react");
  assert.equal(packageJson.private, undefined);
  assert.equal(packageJson.publishConfig.access, "public");
  assert.equal(packageJson.exports["."].import, "./lib-dist/index.js");
  assert.equal(packageJson.exports["."].types, "./lib-dist/index.d.ts");
  assert.equal(packageJson.exports["./style.css"], "./lib-dist/style.css");
  assert.equal(packageJson.exports["./components/*"].import, "./lib-dist/package-components/*.js");
  assert.equal(packageJson.exports["./assets/*"], "./lib-dist/assets/*");
});

test("the generated library surface is derived only from the Community catalog imports", () => {
  assert.match(generator, /Community renderer exports/);
  assert.doesNotMatch(catalog, /\bProRenderer\b|access:\s*["']pro["']/i);
  assert.match(catalog, /CommunityRenderer109/);
});
