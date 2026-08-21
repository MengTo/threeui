import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const external = (id) => /^(?:react|react-dom|three|three128|three165)(?:\/|$)/.test(id);
const componentEntries = Object.fromEntries(
  readdirSync(resolve("src/package-components"))
    .filter((name) => name.endsWith(".ts"))
    .map((name) => [`package-components/${name.slice(0, -3)}`, resolve("src/package-components", name)]),
);

export default defineConfig({
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: "lib-dist",
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: { index: resolve("src/index.ts"), ...componentEntries },
      formats: ["es"],
      cssFileName: "style",
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
