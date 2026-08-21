import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { downloadComponent, installBundle, safeRelativePath } from "../src/install.mjs";
import { createPkce, readAuth, writeAuth } from "../src/oauth.mjs";

test("PKCE generates an S256 verifier and challenge", () => {
  const value = createPkce();
  assert.match(value.verifier, /^[A-Za-z0-9_-]{43,128}$/);
  assert.match(value.challenge, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(value.verifier, value.challenge);
});

test("source paths must remain relative and traversal-free", () => {
  assert.equal(safeRelativePath("src/shaders/cross-beam/index.tsx"), "src/shaders/cross-beam/index.tsx");
  for (const path of ["../secret", "src/../secret", "/absolute", "src\\windows", "src//file"]) assert.equal(safeRelativePath(path), null);
});

test("OAuth state is stored with reusable refresh information", async () => {
  const directory = await mkdtemp(join(tmpdir(), "threeui-cli-auth-"));
  const path = join(directory, "auth.json");
  const session = { client_id: "client", access_token: "access", refresh_token: "refresh", expires_at: 123 };
  await writeAuth(session, path);
  assert.deepEqual(await readAuth(path), session);
});

test("an entitled source bundle and binary assets install without losing bytes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "threeui-cli-install-"));
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), authorization: init.headers.Authorization });
    const parsed = new URL(url);
    if (parsed.searchParams.has("path")) return new Response(Uint8Array.from([0, 1, 2, 255]));
    return Response.json({
      item: { id: "cross-beam", label: "Cross Beam", assets: [{ path: "src/shaders/cross-beam/noise.png" }] },
      source: { files: [{ path: "src/shaders/cross-beam/CrossBeam.tsx", code: "export function CrossBeam() {}\n" }] },
    });
  };

  const bundle = await downloadComponent({ id: "cross-beam", accessToken: "access", apiUrl: "https://example.test/api/pro-components", fetchImpl });
  const files = await installBundle(bundle, { directory });
  assert.deepEqual(files, ["src/shaders/cross-beam/CrossBeam.tsx", "src/shaders/cross-beam/noise.png"]);
  assert.equal(await readFile(join(directory, files[0]), "utf8"), "export function CrossBeam() {}\n");
  assert.deepEqual([...await readFile(join(directory, files[1]))], [0, 1, 2, 255]);
  assert.equal(calls.length, 2);
  assert.ok(calls.every((call) => call.authorization === "Bearer access"));
});

test("installation refuses changed files unless force is explicit", async () => {
  const directory = await mkdtemp(join(tmpdir(), "threeui-cli-collision-"));
  const path = join(directory, "src/Component.tsx");
  await import("node:fs/promises").then(({ mkdir }) => mkdir(join(directory, "src")));
  await writeFile(path, "existing");
  const bundle = { files: [{ path: "src/Component.tsx", bytes: Buffer.from("new") }] };
  await assert.rejects(installBundle(bundle, { directory }), /Refusing to overwrite/);
  await installBundle(bundle, { directory, force: true });
  assert.equal(await readFile(path, "utf8"), "new");
});
