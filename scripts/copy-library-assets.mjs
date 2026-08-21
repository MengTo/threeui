import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "lib-dist/assets");

await mkdir(output, { recursive: true });
for (const name of [
  "hypnotic-loops.html",
  "japanese-tower.html",
  "landscape.html",
  "spark-badge.html",
  "synthralos-halftone.html",
  "landing-pages",
  "sketchbook",
]) {
  await cp(resolve(root, "public", name), resolve(output, name), { recursive: true });
}

console.log("Copied Community runtime documents and assets to lib-dist/assets.");
