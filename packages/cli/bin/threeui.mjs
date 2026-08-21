#!/usr/bin/env node

import { run } from "../src/index.mjs";

run(process.argv.slice(2)).catch((error) => {
  console.error(`ThreeUI: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
