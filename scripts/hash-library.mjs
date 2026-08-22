import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "lib-dist");
const hash = createHash("sha256");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile()) {
      hash.update(relative(root, path));
      hash.update("\0");
      hash.update(await readFile(path));
      hash.update("\0");
    }
  }
}

await walk(root);
console.log(hash.digest("hex"));
