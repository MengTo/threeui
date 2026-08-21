import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { homedir, platform } from "node:os";
import { dirname, join } from "node:path";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";

export const DEFAULT_PROTECTED_RESOURCE_METADATA = "https://threeui.com/.well-known/oauth-protected-resource/api/mcp";
const CALLBACK_HOST = "127.0.0.1";
const CALLBACK_PORT = 45987;
const CALLBACK_PATH = "/callback";
const TOKEN_SKEW_MS = 60_000;

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

export function createPkce() {
  const verifier = base64url(randomBytes(48));
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function defaultAuthPath(environment = process.env) {
  if (environment.THREEUI_CONFIG_DIR) return join(environment.THREEUI_CONFIG_DIR, "auth.json");
  if (environment.XDG_CONFIG_HOME) return join(environment.XDG_CONFIG_HOME, "threeui", "auth.json");
  if (platform() === "darwin") return join(homedir(), "Library", "Application Support", "threeui", "auth.json");
  return join(homedir(), ".config", "threeui", "auth.json");
}

export async function readAuth(path = defaultAuthPath()) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) return {};
    throw error;
  }
}

export async function writeAuth(value, path = defaultAuthPath()) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, path);
}

export async function clearAuth(path = defaultAuthPath()) {
  await rm(path, { force: true });
}

async function jsonRequest(fetchImpl, url, init, label) {
  const response = await fetchImpl(url, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${label} failed (${response.status}): ${body.error_description ?? body.error ?? response.statusText}`);
  return body;
}

export async function discoverOAuth(fetchImpl = fetch, metadataUrl = DEFAULT_PROTECTED_RESOURCE_METADATA) {
  const resource = await jsonRequest(fetchImpl, metadataUrl, undefined, "OAuth resource discovery");
  const issuer = resource.authorization_servers?.[0];
  if (!issuer) throw new Error("OAuth resource metadata has no authorization server");
  const authorization = await jsonRequest(
    fetchImpl,
    `${issuer.replace(/\/$/, "")}/.well-known/oauth-authorization-server`,
    undefined,
    "OAuth server discovery",
  );
  for (const field of ["authorization_endpoint", "token_endpoint", "registration_endpoint"]) {
    if (!authorization[field]) throw new Error(`OAuth server metadata is missing ${field}`);
  }
  return { resource: resource.resource ?? "https://threeui.com/api/mcp", authorization };
}

async function registerClient(fetchImpl, endpoint, redirectUri) {
  return jsonRequest(fetchImpl, endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "ThreeUI CLI",
      redirect_uris: [redirectUri],
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
    }),
  }, "OAuth client registration");
}

export function openSystemBrowser(url) {
  const command = platform() === "darwin" ? "open" : platform() === "win32" ? "cmd" : "xdg-open";
  const args = platform() === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, args, { detached: true, stdio: "ignore" });
  child.unref();
}

function listenForAuthorization({ host = CALLBACK_HOST, port = CALLBACK_PORT, path = CALLBACK_PATH, timeoutMs = 180_000 } = {}) {
  let settle;
  const result = new Promise((resolve, reject) => { settle = { resolve, reject }; });
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    if (url.pathname !== path) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end("<!doctype html><title>ThreeUI connected</title><p>ThreeUI is connected. You can close this tab and return to the terminal.</p>");
    settle.resolve({ code: url.searchParams.get("code"), state: url.searchParams.get("state"), error: url.searchParams.get("error") });
  });
  const timer = setTimeout(() => settle.reject(new Error("Timed out waiting for browser authorization")), timeoutMs);
  server.on("error", settle.reject);

  return new Promise((resolve, reject) => {
    server.listen(port, host, () => resolve({
      redirectUri: `http://${host}:${port}${path}`,
      result,
      close: async () => {
        clearTimeout(timer);
        await new Promise((done) => server.close(done));
      },
    }));
    server.once("error", reject);
  });
}

async function exchangeToken(fetchImpl, endpoint, parameters) {
  return jsonRequest(fetchImpl, endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(parameters),
  }, "OAuth token exchange");
}

function sessionFromToken(token, clientId, redirectUri, discovery) {
  return {
    client_id: clientId,
    redirect_uri: redirectUri,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: Date.now() + Number(token.expires_in ?? 3600) * 1000,
    metadata: discovery,
  };
}

async function authorize({ fetchImpl, openBrowser, authPath, metadataUrl, log }) {
  const discovery = await discoverOAuth(fetchImpl, metadataUrl);
  const callback = await listenForAuthorization();
  try {
    const previous = await readAuth(authPath);
    let clientId = previous.client_id;
    if (!clientId || previous.redirect_uri !== callback.redirectUri) {
      const registered = await registerClient(fetchImpl, discovery.authorization.registration_endpoint, callback.redirectUri);
      clientId = registered.client_id;
      if (!clientId) throw new Error("OAuth client registration returned no client_id");
    }

    const state = base64url(randomBytes(24));
    const { verifier, challenge } = createPkce();
    const authorizationUrl = new URL(discovery.authorization.authorization_endpoint);
    authorizationUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callback.redirectUri,
      response_type: "code",
      scope: "openid profile email offline_access",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
      resource: discovery.resource,
    });
    log(`Opening ThreeUI sign in:\n${authorizationUrl}`);
    await openBrowser(String(authorizationUrl));

    const response = await callback.result;
    if (response.error) throw new Error(`Authorization was denied: ${response.error}`);
    if (!response.code || response.state !== state) throw new Error("OAuth callback was missing a valid code or state");
    const token = await exchangeToken(fetchImpl, discovery.authorization.token_endpoint, {
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: callback.redirectUri,
      code: response.code,
      code_verifier: verifier,
      resource: discovery.resource,
    });
    const session = sessionFromToken(token, clientId, callback.redirectUri, discovery);
    await writeAuth(session, authPath);
    return session.access_token;
  } finally {
    await callback.close();
  }
}

export async function getAccessToken({
  fetchImpl = fetch,
  openBrowser = openSystemBrowser,
  authPath = defaultAuthPath(),
  metadataUrl = DEFAULT_PROTECTED_RESOURCE_METADATA,
  forceLogin = false,
  log = console.log,
} = {}) {
  const session = await readAuth(authPath);
  if (!forceLogin && session.access_token && Number(session.expires_at) > Date.now() + TOKEN_SKEW_MS) return session.access_token;

  if (!forceLogin && session.refresh_token && session.client_id && session.metadata?.authorization?.token_endpoint) {
    try {
      const token = await exchangeToken(fetchImpl, session.metadata.authorization.token_endpoint, {
        grant_type: "refresh_token",
        refresh_token: session.refresh_token,
        client_id: session.client_id,
        resource: session.metadata.resource,
      });
      const refreshed = sessionFromToken(token, session.client_id, session.redirect_uri, session.metadata);
      if (!refreshed.refresh_token) refreshed.refresh_token = session.refresh_token;
      await writeAuth(refreshed, authPath);
      return refreshed.access_token;
    } catch {
      // An expired or revoked refresh token falls through to a new browser login.
    }
  }

  return authorize({ fetchImpl, openBrowser, authPath, metadataUrl, log });
}
