import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { clearAuth, DEFAULT_PROTECTED_RESOURCE_METADATA, getAccessToken } from "./oauth.mjs";
import { DEFAULT_PRO_API, downloadComponent, installBundle } from "./install.mjs";

const packageJson = JSON.parse(await readFile(resolve(dirname(fileURLToPath(import.meta.url)), "../package.json"), "utf8"));

const HELP = `ThreeUI CLI ${packageJson.version}

Usage:
  threeui add <component-id> [--dir <path>] [--force]
  threeui login
  threeui logout

Commands:
  add      Authenticate and install an entitled component source bundle
  login    Replace the saved OAuth session through browser sign in
  logout   Remove the saved OAuth session from this computer

Options:
  --dir <path>       Destination project directory (default: current directory)
  --force            Replace changed files that already exist
  --no-open          Print the sign-in URL without opening a browser
  --endpoint <url>   Override the component API (development only)
  --metadata <url>   Override OAuth resource metadata (development only)
  -h, --help         Show help
  -v, --version      Show version`;

function parseArgs(args) {
  const options = { directory: process.cwd(), force: false, open: true, endpoint: DEFAULT_PRO_API, metadata: DEFAULT_PROTECTED_RESOURCE_METADATA };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--force") options.force = true;
    else if (value === "--no-open") options.open = false;
    else if (["--dir", "--endpoint", "--metadata"].includes(value)) {
      const next = args[index + 1];
      if (!next) throw new Error(`${value} requires a value`);
      index += 1;
      if (value === "--dir") options.directory = resolve(next);
      else if (value === "--endpoint") options.endpoint = next;
      else options.metadata = next;
    } else if (value.startsWith("-")) throw new Error(`Unknown option: ${value}`);
    else positional.push(value);
  }
  return { positional, options };
}

export async function run(args, dependencies = {}) {
  if (!args.length || args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return;
  }
  if (args.includes("--version") || args.includes("-v")) {
    console.log(packageJson.version);
    return;
  }

  const { positional, options } = parseArgs(args);
  const [command, id] = positional;
  const log = dependencies.log ?? console.log;
  const authOptions = {
    fetchImpl: dependencies.fetchImpl,
    authPath: dependencies.authPath,
    metadataUrl: options.metadata,
    log,
    openBrowser: options.open
      ? dependencies.openBrowser
      : async (url) => log(`Open this URL to sign in:\n${url}`),
  };

  if (command === "logout") {
    await clearAuth(dependencies.authPath);
    log("Signed out of ThreeUI on this computer.");
    return;
  }
  if (command === "login") {
    await getAccessToken({ ...authOptions, forceLogin: true });
    log("Signed in to ThreeUI.");
    return;
  }
  if (command !== "add" || !id) throw new Error("Use `threeui add <component-id>` or run `threeui --help`");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Invalid component ID: ${id}`);

  const accessToken = await getAccessToken(authOptions);
  const bundle = await downloadComponent({ id, accessToken, apiUrl: options.endpoint, fetchImpl: dependencies.fetchImpl });
  const installed = await installBundle(bundle, { directory: options.directory, force: options.force });
  log(`Installed ${bundle.item.label} (${installed.length} files):\n${installed.map((path) => `  ${path}`).join("\n")}`);
}
