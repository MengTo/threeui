import { cp, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "lib-dist/assets");
const report = JSON.parse(await readFile(resolve(root, "public/community-sync-report.json"), "utf8"));
const communityIds = new Set(report.components.map((component) => component.id));

await mkdir(output, { recursive: true });
const runtimeFiles = [
  "japanese-tower.html",
  "landscape.html",
  "spark-badge.html",
  "synthralos-halftone.html",
  "landing-pages",
  "sketchbook",
];
if (communityIds.has("hypnotic-loops")) runtimeFiles.push("hypnotic-loops.html");

for (const name of runtimeFiles) {
  await cp(resolve(root, "public", name), resolve(output, name), { recursive: true });
}

console.log("Copied Community runtime documents and assets to lib-dist/assets.");
