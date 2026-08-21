import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export const DEFAULT_PRO_API = "https://threeui.com/api/pro-components";

export function safeRelativePath(value) {
  if (typeof value !== "string" || !value || value.includes("\0") || isAbsolute(value) || value.includes("\\")) return null;
  const segments = value.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) return null;
  return segments.join("/");
}

function destinationPath(root, path) {
  const safe = safeRelativePath(path);
  if (!safe) throw new Error(`Refusing unsafe source path: ${path}`);
  const destination = resolve(root, safe);
  const rootPrefix = `${resolve(root)}${sep}`;
  if (!destination.startsWith(rootPrefix)) throw new Error(`Refusing source path outside the destination: ${path}`);
  return destination;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function apiRequest(fetchImpl, url, accessToken) {
  const response = await fetchImpl(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const reason = body.error ?? response.statusText;
    if (response.status === 403) throw new Error(`Your ThreeUI account cannot access this component (${reason})`);
    if (response.status === 401) throw new Error("ThreeUI authentication expired; run `threeui login` and try again");
    throw new Error(`ThreeUI download failed (${response.status}): ${reason}`);
  }
  return response;
}

export async function downloadComponent({ id, accessToken, apiUrl = DEFAULT_PRO_API, fetchImpl = fetch }) {
  const requestUrl = new URL(apiUrl);
  requestUrl.searchParams.set("id", id);
  const response = await apiRequest(fetchImpl, requestUrl, accessToken);
  const payload = await response.json();
  if (!payload.item || !Array.isArray(payload.source?.files)) throw new Error("ThreeUI returned an invalid component bundle");

  const files = payload.source.files.map((file) => {
    if (typeof file.code !== "string") throw new Error(`ThreeUI source file has no content: ${file.path}`);
    return { path: file.path, bytes: Buffer.from(file.code, "utf8") };
  });

  for (const asset of payload.item.assets ?? []) {
    const assetUrl = new URL(apiUrl);
    assetUrl.searchParams.set("id", id);
    assetUrl.searchParams.set("path", asset.path);
    const assetResponse = await apiRequest(fetchImpl, assetUrl, accessToken);
    files.push({ path: asset.path, bytes: Buffer.from(await assetResponse.arrayBuffer()) });
  }

  return { item: payload.item, files };
}

export async function installBundle(bundle, { directory = process.cwd(), force = false } = {}) {
  const root = resolve(directory);
  const targets = bundle.files.map((file) => ({ ...file, destination: destinationPath(root, file.path) }));
  const duplicate = targets.find((target, index) => targets.findIndex((other) => other.destination === target.destination) !== index);
  if (duplicate) throw new Error(`Bundle contains a duplicate path: ${relative(root, duplicate.destination)}`);

  if (!force) {
    const collisions = [];
    for (const target of targets) {
      if (!(await exists(target.destination))) continue;
      const current = await readFile(target.destination);
      if (!current.equals(target.bytes)) collisions.push(relative(root, target.destination));
    }
    if (collisions.length) throw new Error(`Refusing to overwrite existing files:\n- ${collisions.join("\n- ")}\nRun again with --force to replace them.`);
  }

  for (const target of targets) {
    await mkdir(dirname(target.destination), { recursive: true });
    await writeFile(target.destination, target.bytes);
  }
  return targets.map((target) => relative(root, target.destination));
}
