#!/usr/bin/env node
/**
 * One-shot porter for the five newest Aura featured landing pages into
 * public/landing-pages/, with compression aimed at <10 MB transfer each.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require("/tmp/port/node_modules/sharp");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = join(root, "public", "landing-pages");
const work = "/tmp/port";

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

function dirSize(dir) {
  return walk(dir).reduce((n, f) => n + statSync(f).st_size, 0);
}

function stripAuraPreview(html) {
  return html
    .replace(/<script id="aura-preview-performance-controller">[\s\S]*?<\/script>/g, "")
    .replace(/<style id="aura-preview-performance-style">[\s\S]*?<\/style>/g, "")
    .replace(/\s*data-aura-preview-paused="[^"]*"/g, "");
}

async function toWebp(input, output, quality = 78, maxEdge = 1600) {
  let img = sharp(input, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (Math.max(w, h) > maxEdge) {
    img = img.resize({
      width: w >= h ? maxEdge : undefined,
      height: h > w ? maxEdge : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await img.webp({ quality, effort: 6 }).toFile(output);
}

function ffmpeg(args) {
  const r = spawnSync("ffmpeg", ["-y", ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr?.slice(-400)}`);
}

async function compressImagesInTree(dir, { quality = 76, maxEdge = 1400 } = {}) {
  const map = new Map(); // oldRel -> newRel
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    if (file.includes("/vendor/")) continue;
    const rel = relative(dir, file);
    const outRel = rel.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    const out = join(dir, outRel);
    try {
      await toWebp(file, out, quality, maxEdge);
      if (out !== file) rmSync(file);
      map.set(rel.replace(/\\/g, "/"), outRel.replace(/\\/g, "/"));
      map.set(rel.split("/").pop(), outRel.split("/").pop());
    } catch (err) {
      console.warn("webp skip", rel, err.message);
    }
  }
  // rewrite references in text files
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (![".html", ".js", ".css", ".json", ".mjs"].includes(ext)) continue;
    let text = readFileSync(file, "utf8");
    let next = text;
    for (const [from, to] of map) {
      if (from === to) continue;
      next = next.split(from).join(to);
    }
    if (next !== text) writeFileSync(file, next);
  }
  return map;
}

async function portAzura() {
  const dest = join(outRoot, "azura-yacht.html");
  let html = stripAuraPreview(readFileSync(join(work, "azura.html"), "utf8"));
  // Prefer local three if we vendor a copy; keep CDN for GSAP/Tailwind as existing Community pages do.
  writeFileSync(dest, html);
  console.log("azura", (statSync(dest).st_size / 1e6).toFixed(2), "MB html");
}

async function portVanta() {
  const dest = join(outRoot, "vanta-designed.html");
  let html = stripAuraPreview(readFileSync(join(work, "vanta.html"), "utf8"));
  writeFileSync(dest, html);
  console.log("vanta", (statSync(dest).st_size / 1e6).toFixed(2), "MB html");
}

async function portMosey() {
  const src = join(work, "mosey");
  const dest = join(outRoot, "mosey");
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  rmSync(join(dest, "README.md"), { force: true });
  rmSync(join(dest, ".nojekyll"), { force: true });

  // Compress photos and logos
  await compressImagesInTree(dest, { quality: 74, maxEdge: 1280 });

  // Compress video
  const mp4 = join(dest, "media", "mosey-at-home.mp4");
  if (existsSync(mp4)) {
    const tmp = join(dest, "media", "mosey-at-home.tmp.mp4");
    ffmpeg([
      "-i", mp4,
      "-vf", "scale='min(960,iw)':-2",
      "-c:v", "libx264", "-preset", "slow", "-crf", "28",
      "-an", "-movflags", "+faststart",
      tmp,
    ]);
    rmSync(mp4);
    copyFileSync(tmp, mp4);
    rmSync(tmp);
  }

  // Compress GLB with gltf-transform meshopt if available
  const glb = join(dest, "models", "mosey-clean.glb");
  if (existsSync(glb)) {
    try {
      const { NodeIO } = await import("/tmp/port/node_modules/@gltf-transform/core/dist/index.mjs");
      const { ALL_EXTENSIONS } = await import("/tmp/port/node_modules/@gltf-transform/extensions/dist/index.mjs");
      const { dedup, prune, textureCompress, resample } = await import(
        "/tmp/port/node_modules/@gltf-transform/functions/dist/index.mjs"
      );
      const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
      const doc = await io.read(glb);
      await doc.transform(dedup(), prune(), resample());
      try {
        await doc.transform(
          textureCompress({
            targetFormat: "webp",
            resize: [1024, 1024],
            encoder: sharp,
          }),
        );
      } catch (e) {
        console.warn("mosey textureCompress", e.message);
      }
      const out = join(dest, "models", "mosey-clean.opt.glb");
      await io.write(out, doc);
      if (statSync(out).st_size < statSync(glb).st_size) {
        rmSync(glb);
        copyFileSync(out, glb);
      }
      rmSync(out, { force: true });
    } catch (e) {
      console.warn("mosey glb optimize failed", e.message);
    }
  }

  // Strip cache-busting query strings in index to local files
  let index = readFileSync(join(dest, "index.html"), "utf8");
  index = stripAuraPreview(index).replace(/\?v=[^\"']+/g, "");
  writeFileSync(join(dest, "index.html"), index);

  // Also publish a wrapper html at landing-pages/mosey.html for iframe sourceUrl consistency
  writeFileSync(
    join(outRoot, "mosey.html"),
    `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/landing-pages/mosey/"><title>Mosey</title></head><body><a href="/landing-pages/mosey/">Open Mosey</a></body></html>\n`,
  );

  console.log("mosey total", (dirSize(dest) / 1e6).toFixed(2), "MB");
}

async function portRedwing() {
  const src = join(work, "redwing");
  const dest = join(outRoot, "redwing");
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });

  // Copy landing-critical tree; keep book/explore/globe as lightweight stubs pointing to note
  const keepDirs = ["assets", "img", "vendor"];
  for (const d of keepDirs) cpSync(join(src, d), join(dest, d), { recursive: true });
  for (const f of [
    "index.html",
    "landing.html",
    "redwing-oneshot-v3-poster.jpg",
    "poster-43.jpg",
    "poster-hero.jpg",
    "og.jpg",
  ]) {
    if (existsSync(join(src, f))) copyFileSync(join(src, f), join(dest, f));
  }

  // One compressed scrub video for all viewports
  const scrubOut = join(dest, "redwing-hero-scrub.mp4");
  const scrubSrc = existsSync(join(src, "redwing-hero-scrub-m.mp4"))
    ? join(src, "redwing-hero-scrub-m.mp4")
    : join(src, "redwing-hero-scrub.mp4");
  ffmpeg([
    "-i", scrubSrc,
    "-vf", "scale='min(1280,iw)':-2",
    "-c:v", "libx264", "-preset", "slow", "-crf", "30",
    "-an", "-movflags", "+faststart",
    scrubOut,
  ]);
  // Alias mobile name to same file via copy for code paths that branch
  copyFileSync(scrubOut, join(dest, "redwing-hero-scrub-m.mp4"));

  await compressImagesInTree(dest, { quality: 72, maxEdge: 1400 });

  let index = stripAuraPreview(readFileSync(join(dest, "index.html"), "utf8"));
  // Point explore/book/globe to in-repo stubs if originals are too heavy
  writeFileSync(
    join(dest, "explore.html"),
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Explore · Red Wing</title><body style="margin:0;background:#0b1c33;color:#fff;font:16px/1.5 system-ui;display:grid;place-items:center;min-height:100vh;padding:2rem"><div><p>The interactive cabin walkthrough ships as a separate Aura experience and was omitted here to keep this ThreeUI page under the 10&nbsp;MB budget.</p><p><a href="./" style="color:#9cf">← Back to Red Wing</a></p></div></body>`,
  );
  writeFileSync(
    join(dest, "book.html"),
    `<!doctype html><meta charset="utf-8"><title>Book · Red Wing</title><body style="margin:0;background:#163a6b;color:#fff;font:16px/1.5 system-ui;display:grid;place-items:center;min-height:100vh;padding:2rem"><div><p>Booking UI preserved as a CTA target. <a href="./" style="color:#9cf">← Back</a></p></div></body>`,
  );
  writeFileSync(
    join(dest, "globe-redwing.html"),
    `<!doctype html><meta charset="utf-8"><title>Globe · Red Wing</title><body style="margin:0;background:#163a6b;color:#fff;font:16px/1.5 system-ui;display:grid;place-items:center;min-height:100vh;padding:2rem"><div><p>Route globe omitted under the transfer budget. <a href="./" style="color:#9cf">← Back</a></p></div></body>`,
  );
  writeFileSync(join(dest, "index.html"), index);
  writeFileSync(
    join(outRoot, "redwing.html"),
    `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/landing-pages/redwing/"><title>Red Wing</title></head><body><a href="/landing-pages/redwing/">Open Red Wing</a></body></html>\n`,
  );
  console.log("redwing total", (dirSize(dest) / 1e6).toFixed(2), "MB");
}

async function portEmberfall() {
  const dest = join(outRoot, "emberfall");
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(join(dest, "assets"), { recursive: true });

  let html = stripAuraPreview(readFileSync(join(work, "emberfall.html"), "utf8"));
  // Collect unique tar URLs
  const tarUrls = [...html.matchAll(/https:\/\/d2ol7oe51mr4n9\.cloudfront\.net\/[^\"'\s]+?\.tar/g)].map((m) => m[0]);
  const unique = [...new Set(tarUrls)];
  const tarDir = join(work, "emberfall-tars");
  mkdirSync(tarDir, { recursive: true });
  console.log("emberfall tars", unique.length);

  for (const url of unique) {
    const name = url.split("/").pop();
    const file = join(tarDir, name);
    if (!existsSync(file) || statSync(file).st_size < 100) {
      console.log("download", name);
      const r = spawnSync("curl", ["-sL", "-o", file, url], { encoding: "utf8" });
      if (r.status !== 0) throw new Error(`download failed ${name}`);
    }
    spawnSync("tar", ["-xf", file, "-C", dest], { stdio: "inherit" });
  }

  // Rewrite cloudfront tar URLs to local asset root; the page loads by archive URL + path.
  // Replace the pack URL list with a local packer that serves from /landing-pages/emberfall/
  html = html.replaceAll(
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3J67H3vgQ355aUFRZ9ODVdI77wt/",
    "/landing-pages/emberfall/packs/",
  );

  // Build local packs directory as the extracted tree already under assets/
  // The original loader fetches .tar then reads members. Provide a thin pack server:
  // create one tar per original archive from the already-extracted (and compressed) files.
  mkdirSync(join(dest, "packs"), { recursive: true });

  // Compress textures + glbs in extracted assets
  await compressImagesInTree(join(dest, "assets"), { quality: 70, maxEdge: 1024 });

  // Optimize glbs
  const { NodeIO } = await import("/tmp/port/node_modules/@gltf-transform/core/dist/index.mjs");
  const { ALL_EXTENSIONS } = await import("/tmp/port/node_modules/@gltf-transform/extensions/dist/index.mjs");
  const { dedup, prune, textureCompress, resample } = await import(
    "/tmp/port/node_modules/@gltf-transform/functions/dist/index.mjs"
  );
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  for (const file of walk(join(dest, "assets"))) {
    if (!file.endsWith(".glb")) continue;
    try {
      const doc = await io.read(file);
      await doc.transform(dedup(), prune(), resample());
      try {
        await doc.transform(
          textureCompress({ targetFormat: "webp", resize: [512, 512], encoder: sharp }),
        );
      } catch {}
      const tmp = file + ".opt";
      await io.write(tmp, doc);
      if (statSync(tmp).st_size < statSync(file).st_size) {
        rmSync(file);
        copyFileSync(tmp, file);
      }
      rmSync(tmp, { force: true });
    } catch (e) {
      console.warn("glb", relative(dest, file), e.message);
    }
  }

  // Re-pack each original tar name from current assets using the file lists from downloaded tars
  for (const url of unique) {
    const name = url.split("/").pop();
    const listing = spawnSync("tar", ["-tf", join(tarDir, name)], { encoding: "utf8" });
    const members = listing.stdout.split("\n").filter(Boolean);
    // update member extensions that became webp
    const mapped = members.map((m) => {
      const local = join(dest, m);
      if (existsSync(local)) return m;
      const webp = m.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      if (existsSync(join(dest, webp))) return webp;
      return m;
    }).filter((m) => existsSync(join(dest, m)));
    if (!mapped.length) {
      console.warn("empty pack", name);
      continue;
    }
    const listFile = join(tarDir, name + ".list");
    writeFileSync(listFile, mapped.join("\n"));
    const outTar = join(dest, "packs", name);
    spawnSync("tar", ["-cf", outTar, "-C", dest, "-T", listFile], { stdio: "inherit" });
  }

  writeFileSync(join(dest, "index.html"), html);
  writeFileSync(
    join(outRoot, "emberfall.html"),
    `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/landing-pages/emberfall/"><title>Emberfall</title></head><body><a href="/landing-pages/emberfall/">Open Emberfall</a></body></html>\n`,
  );

  const total = dirSize(dest);
  console.log("emberfall total", (total / 1e6).toFixed(2), "MB");
  if (total > 10 * 1024 * 1024) {
    console.warn("WARNING: emberfall exceeds 10MB after compression");
  }
}

const targets = process.argv.slice(2);
const all = !targets.length;
if (all || targets.includes("azura")) await portAzura();
if (all || targets.includes("vanta")) await portVanta();
if (all || targets.includes("mosey")) await portMosey();
if (all || targets.includes("redwing")) await portRedwing();
if (all || targets.includes("emberfall")) await portEmberfall();
console.log("done");
