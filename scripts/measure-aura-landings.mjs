#!/usr/bin/env node
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets", "aura-port-evidence");
mkdirSync(outDir, { recursive: true });

const pages = [
  { id: "redwing-landing-page", route: "/landing-pages/redwing/", label: "Red Wing", dir: "public/landing-pages/redwing" },
  { id: "mosey-landing-page", route: "/landing-pages/mosey/", label: "Mosey", dir: "public/landing-pages/mosey" },
  { id: "azura-yacht-landing-page", route: "/landing-pages/azura-yacht.html", label: "Azura Yacht", file: "public/landing-pages/azura-yacht.html" },
  { id: "vanta-landing-page", route: "/landing-pages/vanta-designed.html", label: "VANTA", file: "public/landing-pages/vanta-designed.html" },
  { id: "emberfall-landing-page", route: "/landing-pages/emberfall/", label: "Emberfall", dir: "public/landing-pages/emberfall" },
];

async function packagedBytes(page) {
  const { execSync } = await import("node:child_process");
  if (page.dir) return Number(execSync(`du -sb "${join(root, page.dir)}"`).toString().split(/\s+/)[0]);
  return statSync(join(root, page.file)).size;
}

function startPreview() {
  const child = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", "4173"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return new Promise((resolvePromise, reject) => {
    const timer = setTimeout(() => reject(new Error("preview timeout")), 30000);
    const onData = (buf) => {
      const s = buf.toString();
      if (s.includes("Local:") || s.includes("4173")) {
        clearTimeout(timer);
        child.stdout.off("data", onData);
        child.stderr.off("data", onData);
        resolvePromise(child);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => reject(new Error(`preview exited ${code}`)));
  });
}

async function measure(page, viewport, name) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--disable-web-security",
    ],
  });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  });
  const pg = await context.newPage();
  const transfer = { bytes: 0, requests: 0, failed: [] };
  const consoles = [];
  pg.on("console", (msg) => consoles.push({ type: msg.type(), text: msg.text() }));
  pg.on("pageerror", (err) => consoles.push({ type: "pageerror", text: String(err) }));
  pg.on("response", async (res) => {
    try {
      const headers = res.headers();
      const len = Number(headers["content-length"] || 0);
      if (len) transfer.bytes += len;
      else {
        const buf = await res.body().catch(() => null);
        if (buf) transfer.bytes += buf.length;
      }
      transfer.requests += 1;
      if (res.status() >= 400) transfer.failed.push({ url: res.url(), status: res.status() });
    } catch {}
  });

  const url = `http://127.0.0.1:4173${page.route}`;
  await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await pg.waitForTimeout(3000);
  await pg.evaluate(() => document.fonts?.ready?.catch?.(() => {}) || null).catch(() => {});
  await pg.screenshot({ path: join(outDir, `${page.id}-${name}.png`), fullPage: false, timeout: 60000 });

  const fps = await pg.evaluate(async () => {
    const samples = [];
    let frames = 0;
    let last = performance.now();
    let raf;
    const start = performance.now();
    await new Promise((resolvePromise) => {
      const tick = (now) => {
        frames += 1;
        if (now - last >= 1000) {
          samples.push(frames);
          frames = 0;
          last = now;
        }
        // scroll a bit each second window
        const t = (now - start) / 10000;
        window.scrollTo(0, Math.max(0, (document.body.scrollHeight - innerHeight) * Math.min(1, t)));
        if (now - start < 10000) raf = requestAnimationFrame(tick);
        else resolvePromise();
      };
      raf = requestAnimationFrame(tick);
    });
    cancelAnimationFrame(raf);
    const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const min = samples.length ? Math.min(...samples) : 0;
    return { avg: +avg.toFixed(1), min, samples };
  });

  // overflow check
  const overflow = await pg.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowX: doc.scrollWidth > doc.clientWidth + 1,
    };
  });

  await browser.close();
  return { fps, transfer, consoles, overflow };
}

const preview = await startPreview();
const results = [];
try {
  for (const page of pages) {
    const packaged = await packagedBytes(page);
    const desktop = await measure(page, { width: 1440, height: 900 }, "desktop");
    const mobile = await measure(page, { width: 390, height: 844 }, "mobile");
    const row = {
      id: page.id,
      label: page.label,
      route: page.route,
      packagedMB: +(packaged / 1e6).toFixed(2),
      transferDesktopMB: +(desktop.transfer.bytes / 1e6).toFixed(2),
      transferMobileMB: +(mobile.transfer.bytes / 1e6).toFixed(2),
      fpsDesktop: desktop.fps.avg,
      fpsDesktopMin: desktop.fps.min,
      fpsMobile: mobile.fps.avg,
      fpsMobileMin: mobile.fps.min,
      overflowDesktop: desktop.overflow.overflowX,
      overflowMobile: mobile.overflow.overflowX,
      failedDesktop: desktop.transfer.failed,
      failedMobile: mobile.transfer.failed,
      consoleDesktop: desktop.consoles.filter((c) => c.type === "error" || c.type === "pageerror").slice(0, 8),
      consoleMobile: mobile.consoles.filter((c) => c.type === "error" || c.type === "pageerror").slice(0, 8),
    };
    results.push(row);
    console.log(JSON.stringify(row, null, 2));
  }
} finally {
  preview.kill("SIGTERM");
}

writeFileSync(join(outDir, "metrics.json"), JSON.stringify(results, null, 2));
console.log("wrote", join(outDir, "metrics.json"));
