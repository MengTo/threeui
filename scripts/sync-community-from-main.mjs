import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(process.env.THREEUI_SOURCE_ROOT ?? process.argv[2] ?? "");

if (!process.env.THREEUI_SOURCE_ROOT && !process.argv[2]) {
  throw new Error("Pass the private ThreeUI source snapshot path or set THREEUI_SOURCE_ROOT.");
}

const sourceInventoryPath = join(sourceRoot, "inventory", "source-code.json");
await stat(sourceInventoryPath);

const shellFiles = [
  "src/catalogPresentation.js",
  "src/detailPreviews.ts",
  "src/routes.js",
  "src/seo.js",
  "src/shaderMetrics.ts",
  "src/styles.css",
  "src/theme.ts",
  "src/components/BrandMark.tsx",
  "src/components/CheckpointSliderControl.tsx",
  "src/components/GitHubStars.tsx",
  "src/components/InstallationDocumentation.tsx",
  "src/components/InstallationSteps.tsx",
  "src/components/PreviewFpsMeter.tsx",
  "src/components/ShaderTags.tsx",
  "src/components/SyntaxHighlightedCode.tsx",
  "src/components/ThemeButtons.tsx",
  "src/components/buildCopyBundles.js",
  "src/components/icons.tsx",
  "src/data/catalogResults.ts",
  "src/data/publicShaders.ts",
  "index.html",
];

// These retain the main project's layout and interaction contracts while applying
// the public-only boundary (no auth, Pro catalog, Beta catalog, or protected APIs).
// Preserve them across syncs instead of replacing them with private-app adapters.
const publicAdapterFiles = [
  "src/App.tsx",
  "src/main.tsx",
  "src/vite-env.d.ts",
  "src/components/BrowsePage.tsx",
  "src/components/McpDocumentation.tsx",
  "src/components/RightRailPromos.tsx",
  "src/components/SearchDialog.tsx",
  "src/components/ShaderDocumentation.tsx",
  "src/components/Sidebar.tsx",
  "src/components/UpgradeLink.tsx",
];

const publicRuntimeFiles = [
  "public/hypnotic-loops.html",
  "public/japanese-tower.html",
  "public/threeui-mark.svg",
  "public/robots.txt",
];

const generatedRendererPaths = new Set([
  "src/shaders/threeui.css",
  "src/shaders/globe/GlobeCollection.tsx",
  "src/shaders/landing-pages/LandingPages.tsx",
  "src/shaders/landing-pages/pageRecipes.ts",
  "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
  "src/shaders/sketchbook/sketchbookDocument.js",
  "src/shaders/spark-badge/SparkBadge.tsx",
  "src/shaders/sylva-living-world/SylvaLivingWorldScene.tsx",
  "src/shaders/temple-night/TempleNightScene.tsx",
]);

const excludedAssetPaths = new Set();

const textExtensions = new Set([".css", ".glsl", ".html", ".js", ".jsx", ".json", ".mjs", ".ts", ".tsx", ".txt"]);
const mediaOrigin = "https://threeui.com";
const mixedAccessParentIds = new Set(["energy-orb", "spark-badge", "sylva-hero", "sylva-living-world", "temple-night"]);

function posixPath(value) {
  return value.split(sep).join("/");
}

async function copyFromSource(path) {
  const from = join(sourceRoot, path);
  const to = join(projectRoot, path);
  await mkdir(dirname(to), { recursive: true });
  await copyFile(from, to);
}

async function writeGenerated(path, contents) {
  const target = join(projectRoot, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

function publicMediaUrl(value) {
  if (typeof value !== "string" || !value) return value;
  if (/^https:\/\//.test(value)) return value;
  return new URL(value.startsWith("/") ? value : `/${value}`, mediaOrigin).toString();
}

function rendererDescriptor(shader, componentEntry) {
  const component = shader.component;
  if (!component) throw new Error(`${shader.id} has no renderer component.`);
  if (typeof component === "function") {
    const path = componentEntry?.files?.find((file) => file.path.endsWith(".tsx"))?.path;
    if (!path) throw new Error(`Cannot resolve the eager renderer path for ${shader.id}.`);
    return { exportName: shader.importName, path: `/${path}`, eager: true };
  }

  const loader = String(component?._payload?._result ?? "");
  const match = loader.match(/__vite_ssr_dynamic_import__\("([^"]+)"\).*default: module\.([A-Za-z0-9_$]+)/s);
  if (!match) throw new Error(`Cannot resolve the lazy renderer for ${shader.id}.`);
  return { exportName: match[2], path: match[1], eager: false };
}

function sanitizeMetadata(shader, freeIds, getShaderAccess) {
  const value = { ...shader };
  delete value.component;
  delete value.access;
  delete value.status;
  if (value.variantAliases) {
    value.variantAliases = Object.fromEntries(
      Object.entries(value.variantAliases).filter(([alias, id]) => freeIds.has(alias) && freeIds.has(String(id))),
    );
    if (!Object.keys(value.variantAliases).length) delete value.variantAliases;
  }
  if (value.variants) {
    value.variants = value.variants
      .filter((variant) => getShaderAccess(shader, variant) !== "pro")
      .map((variant) => {
        const next = { ...variant };
        delete next.access;
        next.thumbnail = publicMediaUrl(next.thumbnail);
        next.preview = publicMediaUrl(next.preview);
        return next;
      });
  }
  value.thumbnail = publicMediaUrl(value.thumbnail);
  if (value.preview) value.preview = publicMediaUrl(value.preview);
  const onlyVariant = value.variants?.[0];
  if (value.id === "energy-orb") {
    value.description = onlyVariant.description;
    value.sourceFiles = value.sourceFiles.filter((file) => !/constellation|network-globe/i.test(file));
    value.contract = [
      { name: "renderer", type: "fixed", value: "Raw WebGL" },
      { name: "variant", type: "fixed", value: "Energy Orb" },
      { name: "interaction", type: "adaptive", value: "Pointer + visibility" },
      { name: "assets", type: "fixed", value: "None" },
    ];
    value.interaction = "Pointer-responsive energy sphere with visibility-aware animation and customizable motion, scale, palette, and opacity";
    value.asset = "No runtime assets";
  } else if (value.id === "spark-badge") {
    value.asset = "One self-contained authored HTML badge scene; no external assets";
  } else if (value.id === "sylva-hero") {
    value.description = `The complete Sylva Living Green page, preserved with its Three.js scene, local typography, card imagery, and embedded liquid-metal buttons. ${onlyVariant.description}`;
    value.contract = value.contract
      .filter((row) => row.name !== "derived")
      .map((row) => row.name === "variant" ? { ...row, type: "fixed", value: "Living Green" } : row);
  } else if (value.id === "sylva-living-world") {
    value.description = onlyVariant.description;
    value.contract = value.contract.map((row) => {
      if (row.name === "variant") return { ...row, type: "fixed", value: "Living Green" };
      if (row.name === "scene") return { ...row, type: "fixed", value: "Moss roots" };
      return row;
    });
  } else if (value.id === "temple-night") {
    value.description = onlyVariant.description;
    value.contract = value.contract.map((row) => {
      if (row.name === "variant") return { ...row, type: "fixed", value: "temple-night" };
      if (row.name === "scene") return { ...row, type: "fixed", value: "Procedural Kyoto mountain temple world" };
      return row;
    });
  }
  return value;
}

function generateShadersModule(shaders, registryById, getShaderAccess) {
  const freeIds = new Set(shaders.map((shader) => String(shader.id)));
  const descriptors = new Map();
  const rendererNameByShader = new Map();

  for (const shader of shaders) {
    const descriptor = rendererDescriptor(shader, registryById.get(String(shader.id)) ?? registryById.get(String(shader.variantOf)));
    const key = `${descriptor.eager ? "eager" : "lazy"}:${descriptor.path}:${descriptor.exportName}`;
    if (!descriptors.has(key)) descriptors.set(key, { ...descriptor, localName: `CommunityRenderer${descriptors.size + 1}` });
    rendererNameByShader.set(String(shader.id), descriptors.get(key).localName);
  }

  const imports = [...descriptors.values()].map(({ eager, exportName, path, localName }) => {
    const relativePath = posixPath(relative(join(projectRoot, "src", "data"), join(projectRoot, path.replace(/^\//, ""))));
    const specifier = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
    return eager
      ? `import { ${exportName} as ${localName} } from ${JSON.stringify(specifier.replace(/\.(?:tsx?|jsx?)$/, ""))};`
      : `const ${localName} = lazy(() => import(${JSON.stringify(specifier.replace(/\.(?:tsx?|jsx?)$/, ""))}).then((module) => ({ default: module.${exportName} })));`;
  }).join("\n");

  const entries = shaders.map((shader) => {
    const metadata = sanitizeMetadata(shader, freeIds, getShaderAccess);
    return `  { ...${JSON.stringify(metadata, null, 2).replaceAll("\n", "\n  ")}, component: ${rendererNameByShader.get(String(shader.id))} }`;
  }).join(",\n");

  return `import { lazy, type ComponentType } from "react";
${imports}

export type ContractRow = { name: string; type: string; value: string };
export type RangeControl = { kind?: "range"; key: string; label: string; min: number; max: number; step: number; digits: number; default: number };
export type ChoiceControl = { kind: "choice"; key: string; label: string; options: readonly { value: string; label: string }[]; default: string };
export type CheckpointControl = { kind: "checkpoint"; key: string; label: string; options: readonly { value: string; label: string }[]; default: string };
export type ColorControl = { kind: "color"; key: string; label: string; default: \`#\${string}\` };
export type TextControl = { kind: "text"; key: string; label: string; default: string; maxLength?: number; placeholder?: string };
export type ShaderControl = RangeControl | ChoiceControl | CheckpointControl | ColorControl | TextControl;
export type ShaderVariant = { id: string; label: string; description: string; thumbnail: string; preview: string; props: Readonly<Record<string, boolean | number | string>>; controls?: readonly ShaderControl[] };
export const READY_SHADER_CATEGORIES = ["Landing Pages", "Hero", "Three.js", "Motion Design", "Sections", "Backgrounds", "Buttons", "Text Animation", "UI Elements", "CSS"] as const;
export type ReadyShaderCategory = (typeof READY_SHADER_CATEGORIES)[number];
export type ReadyShader = {
  id: string;
  variantOf?: string;
  variantAliases?: Readonly<Record<string, string>>;
  category: ReadyShaderCategory;
  label: string;
  thumbnail: string;
  preview?: string;
  tags: readonly string[];
  description: string;
  runtime: string;
  component?: ComponentType<any>;
  origin: string;
  sourceCommit: string;
  sourceFiles: string[];
  passes: string;
  interaction: string;
  asset: string;
  assetCount: number;
  importName: string;
  contract: readonly ContractRow[];
  controls?: readonly ShaderControl[];
  variants?: readonly ShaderVariant[];
};
export function getShaderAccess() { return undefined; }
export const READY_SHADERS: readonly ReadyShader[] = [
${entries}
];
export const VISIBLE_READY_SHADERS = READY_SHADERS.filter((shader) => !shader.variantOf);
export const READY_SHADER_COLLECTION_COUNT = VISIBLE_READY_SHADERS.reduce((total, shader) => total + (shader.variants?.length || 1), 0);
export function getReadyShader(id: string): ReadyShader { return READY_SHADERS.find((shader) => shader.id === id) ?? READY_SHADERS[0]; }
`;
}

function generatePageRecipes(recipeModule) {
  const names = ["KAGE_TYPOGRAPHY", "SYLVA_TYPOGRAPHY", "COMPLETE_SHELF_TYPOGRAPHY", "BESTSELLERS_TYPOGRAPHY"];
  const recipes = names.map((name) => {
    const recipe = recipeModule[name];
    if (!recipe) throw new Error(`Missing ${name}.`);
    return `export const ${name}: PageTypographyRecipe = ${JSON.stringify({ ...recipe, css: undefined }, null, 2).replace(/,?\n  "css": undefined/, "").replace(/\n}$/, `,\n  css: ${String(recipe.css)}\n}`)};`;
  });
  return `import type { PageTypographyRecipe } from "./pageTypography";

const n = (value: number) => Number(value.toFixed(3));
const px = (value: number) => \`\${n(value)}px\`;
const unit = (value: number) => \`calc(\${n(value)} * var(--u))\`;
function withAlpha(hex: string, alpha: number) {
  const [red, green, blue] = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
  return \`rgba(\${red}, \${green}, \${blue}, \${alpha})\`;
}

${recipes.join("\n\n")}
`;
}

function generateLandingPagesModule() {
  return `import { useEffect, useRef, useState, type CSSProperties } from "react";
import { applyPageCustomization, splitTypographyProps, usePageTypography, type LandingPageCustomization, type PageTypographyProps } from "./pageTypography";
import { BESTSELLERS_TYPOGRAPHY, COMPLETE_SHELF_TYPOGRAPHY, KAGE_TYPOGRAPHY, SYLVA_TYPOGRAPHY } from "./pageRecipes";

export type LandingPageFrameProps = { className?: string; sourceUrl: string; srcDoc?: string; style?: CSSProperties; title: string; customization?: LandingPageCustomization };
export type LandingPageProps = Omit<LandingPageFrameProps, "sourceUrl" | "title" | "customization">;
const FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts";

export function LandingPageFrame({ className = "", customization, sourceUrl, srcDoc, style, title }: LandingPageFrameProps) {
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { applyPageCustomization(frameRef.current, customization); }, [customization]);
  return <div className={\`threeui-background landing-page-frame\${className ? \` \${className}\` : ""}\`} data-state={ready ? "ready" : "loading"} style={{ position: "relative", overflow: "hidden", background: "#080808", pointerEvents: "auto", ...style }}>
    <iframe ref={frameRef} title={title} {...(srcDoc ? { srcDoc } : { src: sourceUrl })} sandbox={FRAME_SANDBOX} loading="eager" onLoad={(event) => { applyPageCustomization(event.currentTarget, customization); setReady(true); }} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", border: 0, background: "#080808" }} />
  </div>;
}

function TypographyPage({ recipe, title, sourceUrl, ...props }: LandingPageProps & PageTypographyProps & { recipe: typeof KAGE_TYPOGRAPHY; title: string; sourceUrl: string }) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(recipe, type);
  return <LandingPageFrame {...frame} customization={customization} title={title} sourceUrl={sourceUrl} />;
}

export function KageLandingPage(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={KAGE_TYPOGRAPHY} title="Kage — Where stillness reveals the unseen" sourceUrl="/landing-pages/kage.html" />; }
export function CompleteShelfLandingPage(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={COMPLETE_SHELF_TYPOGRAPHY} title="Working Volumes — Seven Tools for Making" sourceUrl="/landing-pages/complete-shelf-v2.html" />; }
export function BestsellersBookShowcase(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={BESTSELLERS_TYPOGRAPHY} title="Field Manuals — Tools for Thought" sourceUrl="/landing-pages/bestsellers-book-showcase.html" />; }
export function MengToSketchbookLandingPage(props: LandingPageProps) { return <LandingPageFrame {...props} title="Meng To — Singapore Sketchbook" sourceUrl="/landing-pages/meng-to-sketchbook.html" />; }
export function SylvaHero(props: LandingPageProps & PageTypographyProps) { return <TypographyPage {...props} recipe={SYLVA_TYPOGRAPHY} title="Sylva — Into the living world" sourceUrl="/landing-pages/inner-green-3d.html" />; }
`;
}

function generateGlobeCollectionModule() {
  return `import { lazy, Suspense } from "react";
import type { EnergyOrbProps } from "../energy-orb/EnergyOrb";
export type GlobeVariant = "energy-orb";
export type GlobeCollectionProps = EnergyOrbProps & { variant?: "energy-orb" };
const EnergyOrbVariant = lazy(() => import("../energy-orb/EnergyOrb").then((module) => ({ default: module.EnergyOrb })));
export function GlobeCollection({ variant: _variant, ...props }: GlobeCollectionProps) {
  return <Suspense fallback={<div className="threeui-background energy-orb" style={{ background: "#05030e" }} />}><EnergyOrbVariant {...props} /></Suspense>;
}
`;
}

function generateSparkBadgeModule() {
  return `import { useEffect, useRef, useState } from "react";
export type SparkBadgeVariant = "badge";
export type SparkBadgeProps = { className?: string; sourceUrl?: string; variant?: SparkBadgeVariant };
export function SparkBadge({ className = "", sourceUrl = "/spark-badge.html" }: SparkBadgeProps) {
  const hostRef = useRef<HTMLDivElement>(null); const intersectsRef = useRef(true); const [mounted, setMounted] = useState(true); const [ready, setReady] = useState(false);
  useEffect(() => { const host = hostRef.current; if (!host) return; const sync = () => setMounted(intersectsRef.current && document.visibilityState !== "hidden"); const observer = new IntersectionObserver(([entry]) => { intersectsRef.current = entry.isIntersecting; sync(); }, { rootMargin: "80px" }); observer.observe(host); document.addEventListener("visibilitychange", sync); return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); }; }, []);
  useEffect(() => { if (!mounted) setReady(false); }, [mounted]);
  return <div ref={hostRef} className={\`spark-badge\${className ? \` \${className}\` : ""}\`} data-state={!mounted ? "paused" : ready ? "ready" : "loading"} data-variant="badge">{mounted ? <iframe className={\`spark-badge__frame\${ready ? " is-ready" : ""}\`} title="Animated credential badge in rain" src={sourceUrl} sandbox="allow-scripts" loading="eager" onLoad={() => setReady(true)} /> : null}</div>;
}
`;
}

function generateTempleNightModule() {
  return `import { useEffect, useRef, useState } from "react";
import { createTempleNightRenderer } from "./templeNightRenderer.js";
export type TempleNightVariant = "temple-night";
export type TempleNightSceneProps = { className?: string; variant?: TempleNightVariant };
export function TempleNightScene({ className = "" }: TempleNightSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null); const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading"); const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => { const host = hostRef.current; const canvas = canvasRef.current; if (!host || !canvas) return; let renderer; try { renderer = createTempleNightRenderer(canvas); } catch (error) { setErrorMessage(error instanceof Error ? error.message : "Unknown renderer error"); setState("unavailable"); return; } if (!renderer) { setState("unavailable"); return; } let frame = 0; let visible = true; let disposed = false; let rendered = false; const schedule = () => { if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render); }; const render = (time: number) => { frame = 0; renderer.render(time); if (!rendered) { rendered = true; setState("ready"); } if (!renderer.reducedMotion) schedule(); }; const resize = () => { renderer.resize(); schedule(); }; const setPointer = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); renderer.setPointer(((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1, 1 - ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2, true); schedule(); }; const clearPointer = () => { renderer.setPointer(0, 0, false); schedule(); }; const onVisibility = () => { if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; } else schedule(); }; const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; } else schedule(); }); intersectionObserver.observe(host); canvas.addEventListener("pointermove", setPointer, { passive: true }); canvas.addEventListener("pointerenter", setPointer, { passive: true }); canvas.addEventListener("pointerleave", clearPointer, { passive: true }); window.addEventListener("blur", clearPointer); document.addEventListener("visibilitychange", onVisibility); resize(); return () => { disposed = true; if (frame) cancelAnimationFrame(frame); resizeObserver.disconnect(); intersectionObserver.disconnect(); canvas.removeEventListener("pointermove", setPointer); canvas.removeEventListener("pointerenter", setPointer); canvas.removeEventListener("pointerleave", clearPointer); window.removeEventListener("blur", clearPointer); document.removeEventListener("visibilitychange", onVisibility); renderer.dispose(); }; }, []);
  return <div className={\`temple-night-scene\${className ? \` \${className}\` : ""}\`} ref={hostRef} data-state={state}><canvas ref={canvasRef} className={\`temple-night-canvas\${state === "ready" ? " is-ready" : ""}\`} aria-label="Interactive Kage mountain temple world after dark" />{state === "unavailable" ? <p className="temple-night-unavailable" role="status">WebGL is unavailable: {errorMessage || "unsupported context"}.</p> : null}</div>;
}
`;
}

function generateSylvaLivingWorldModule() {
  return `import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import innerGreenSource from "./sources/inner-green-3d.html?raw";
import threeRuntime from "./sources/inner-green-assets/three.min.js?raw";
export const SYLVA_LIVING_WORLD_VARIANTS = ["living-green"] as const;
export type SylvaLivingWorldVariant = "living-green";
export type SylvaLivingWorldSceneProps = { variant?: SylvaLivingWorldVariant; className?: string; style?: CSSProperties };
const SCENE_ONLY_MARKUP = \`<main class="hero" id="hero"><canvas id="scene" role="img" aria-label="Sylva Living Green"></canvas><div class="stage" id="stage" aria-hidden="true"></div></main>\`;
const SCENE_ONLY_STYLE = \`<style data-threeui-sylva-scene>html,body{width:100%!important;height:100%!important;min-height:0!important;margin:0!important;overflow:hidden!important}body{position:relative!important;background:#4a4d44!important}.hero{height:100%!important;min-height:0!important}#scene{pointer-events:auto!important}</style>\`;
function buildSceneDocument(reducedMotion: boolean) { const presentationStart = innerGreenSource.indexOf('<main class="hero" id="hero">'); const runtimeStart = innerGreenSource.indexOf('<script src="inner-green-assets/three.min.js"></script>'); if (presentationStart < 0 || runtimeStart < 0 || runtimeStart <= presentationStart) throw new Error("Sylva scene adapter could not isolate the authored Three.js scene."); let source = \`\${innerGreenSource.slice(0, presentationStart)}\${SCENE_ONLY_MARKUP}\n\n\${innerGreenSource.slice(runtimeStart)}\`.replace("</head>", \`\${SCENE_ONLY_STYLE}</head>\`).replace('<script src="inner-green-assets/three.min.js"></script>', \`<script data-threeui-three-runtime>\${threeRuntime}</script>\`); if (reducedMotion) source = source.replace("(function loop() { requestAnimationFrame(loop); tick(); })();", "(function loop() { if (!REDUCED) requestAnimationFrame(loop); tick(); })();"); return source; }
export function SylvaLivingWorldScene({ className = "", style }: SylvaLivingWorldSceneProps) { const hostRef = useRef<HTMLDivElement>(null); const [hostVisible, setHostVisible] = useState(true); const [documentVisible, setDocumentVisible] = useState(() => typeof document === "undefined" || !document.hidden); const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches); const [ready, setReady] = useState(false); useEffect(() => { const host = hostRef.current; if (!host || typeof IntersectionObserver === "undefined") return; const observer = new IntersectionObserver(([entry]) => setHostVisible(entry?.isIntersecting ?? true)); observer.observe(host); return () => observer.disconnect(); }, []); useEffect(() => { if (typeof document === "undefined") return; const update = () => setDocumentVisible(!document.hidden); document.addEventListener("visibilitychange", update); return () => document.removeEventListener("visibilitychange", update); }, []); useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(media.matches); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []); const source = useMemo(() => buildSceneDocument(reducedMotion), [reducedMotion]); const mounted = hostVisible && documentVisible; useEffect(() => setReady(false), [mounted, reducedMotion]); return <div ref={hostRef} className={\`threeui-background sylva-living-world-scene\${className ? \` \${className}\` : ""}\`} role="img" aria-label="Sylva Living Green with ferns, flowers, pollen, and a butterfly" data-variant="living-green" data-state={ready ? "ready" : "loading"} style={{ background: "#4a4d44", pointerEvents: "auto", ...style }}>{mounted ? <iframe key={reducedMotion ? "reduced" : "motion"} title="Sylva Living Green" srcDoc={source} sandbox="allow-scripts" loading="eager" onLoad={() => setReady(true)} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", border: 0, background: "#4a4d44" }} /> : null}</div>; }
`;
}

function sanitizeSparkBadgeHtml(source) {
  const lines = source.split("\n");
  const keep = [
    ...lines.slice(0, 19),
    "const sceneVariant = 'badge';",
    ...lines.slice(22, 147),
    ...lines.slice(167, 177),
    ...lines.slice(178, 211),
    ...lines.slice(337),
  ];
  const result = keep.join("\n");
  for (const forbidden of ["requestedVariant", "sceneVariant ===", "studio-display", "iPhone", "browser chrome"]) {
    if (result.includes(forbidden)) throw new Error(`Spark Badge sanitization retained ${forbidden}.`);
  }
  return result;
}

function generateCommunityStyles(source) {
  const sliceBetween = (start, end) => {
    const from = source.indexOf(start);
    const to = source.indexOf(end, from + start.length);
    if (from < 0 || to < 0) throw new Error(`Could not isolate Community styles between ${start} and ${end}.`);
    return source.slice(from, to).trim();
  };
  const firstOpen = source.indexOf("{");
  const firstClose = source.indexOf("}", firstOpen + 1);
  if (firstOpen < 0 || firstClose < 0) throw new Error("Could not read the shared renderer sizing rule.");
  const sharedSizing = source.slice(firstOpen, firstClose + 1);
  const communityRoots = [
    ".threeui-mount",
    ".text-path-study",
    ".article-headings-component",
    ".animated-top-dock-component",
    ".typography-vortex-component",
    ".landscape-scene",
    ".japanese-tower-landscape",
    ".liquid-metal-button",
    ".spark-badge",
    ".hypnotic-loops",
    ".at-the-horizon",
    ".threeui-background",
  ];
  const communityOnly = [
    `${communityRoots.join(",\n")} ${sharedSizing}`,
    sliceBetween(".japanese-tower-landscape {", ".sakura-branch-scene {"),
    sliceBetween(".liquid-metal-button {", ".iso-mail-lightshafts {"),
    sliceBetween(".spark-badge {", ".scalability-bricks {"),
    sliceBetween(".text-path-study {", ".cross-beam-canvas,"),
    sliceBetween(".temple-night-scene,", ".yosemite-sunset-scene,"),
    sliceBetween(".bookshelf,", "@font-face {"),
    source.slice(source.indexOf("@font-face {")).trim(),
  ].join("\n\n");
  const forbidden = [
    "mechanical-keyboard",
    "sakura-branch-scene",
    "isometric-motion-grid",
    "isometric-charging-dock",
    "tetrahedron-365",
    "iso-mail-lightshafts",
    "scalability-bricks",
    "terrain-plume",
    "sunset-valley",
    "yosemite-sunset",
    "presidio-sunset",
    "lake-louise",
  ];
  for (const selector of forbidden) {
    if (communityOnly.includes(selector)) throw new Error(`Community renderer CSS retained ${selector}.`);
  }
  return `/* Generated from the main renderer stylesheet; Community selectors only. */\n${communityOnly}\n`;
}

function sanitizeNeuformIsolatedEffects(source) {
  const result = source
    .replace(/^import particleOrbSource from "\.\/sources\/synthesis-orb\.html\?raw";\n/m, "")
    .replace(/\n  particleOrb: \{[\s\S]*?\n  \},\n  performanceGaugesTachometer:/, "\n  performanceGaugesTachometer:")
    .replace(/^export const ParticleOrbField = createEffectComponent\(EFFECTS\.particleOrb\);\n/m, "");
  if (/particleOrb|synthesis-orb/.test(result)) {
    throw new Error("Neuform isolation retained the excluded Particle Orb Beta renderer.");
  }
  return result;
}

function generateSkillMarkdownModule(skillById) {
  return `const SKILLS = ${JSON.stringify(Object.fromEntries(skillById), null, 2)};\nexport function buildSkillMarkdown(shader) { const skill = SKILLS[shader.id]; if (!skill) throw new Error(\`No standalone implementation guide exists for \${shader.id}.\`); return skill; }\n`;
}

function fallbackSkillMarkdown(shader) {
  const sourceFiles = shader.sourceFiles.map((file) => `- \`${file}\``).join("\n");
  return `---\nname: add-${shader.id}\ndescription: ${JSON.stringify(`Build ${shader.label} from its verified Community source with the complete renderer, interactions, controls, and required assets.`)}\n---\n\n# Build ${shader.label}\n\n${shader.description}\n\n## Verified source material\n\n${sourceFiles}\n\nSource revision: \`${shader.sourceCommit}\`\n\n## Requirements\n\n- Preserve the complete ${shader.runtime} renderer and every published Community option.\n- Preserve its interaction contract: ${shader.interaction}.\n- Preserve its assets: ${shader.asset}.\n- Verify resize, mobile, reduced motion, visibility, teardown, and console health.\n`;
}

async function fileRecord(path, original) {
  const absolute = join(projectRoot, path);
  const code = await readFile(absolute, "utf8");
  return {
    path,
    language: original?.language ?? (extname(path).slice(1) || "text"),
    role: original?.role ?? "source",
    bytes: Buffer.byteLength(code),
    lines: code.split("\n").length,
    sha256: createHash("sha256").update(code).digest("hex"),
    code,
  };
}

async function readJsonIfPresent(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
}

function sourceRevision() {
  try {
    return execFileSync("git", ["-C", sourceRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "working-tree";
  }
}

function withoutGeneratedAt(value) {
  if (!value) return value;
  const clone = structuredClone(value);
  delete clone.generatedAt;
  return clone;
}

function withoutSyncMetadata(value) {
  const clone = withoutGeneratedAt(value);
  if (clone) delete clone.sourceCommit;
  return clone;
}

function hasProjectChangesOutsideSyncReport() {
  const status = execFileSync(
    "git",
    ["-C", projectRoot, "status", "--porcelain=v1", "--untracked-files=all", "--", ".", ":(exclude)public/community-sync-report.json"],
    { encoding: "utf8" },
  );
  return status.trim().length > 0;
}

const inventory = JSON.parse(await readFile(sourceInventoryPath, "utf8"));
const registryById = new Map(inventory.components.map((component) => [String(component.id), component]));
const previousSourceRegistry = await readJsonIfPresent(join(projectRoot, "public", "source-code.json"));
const previousSyncReport = await readJsonIfPresent(join(projectRoot, "public", "community-sync-report.json"));

const vite = await createServer({ root: sourceRoot, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
let shaderModule;
let recipeModule;
let skillModule;
try {
  shaderModule = await vite.ssrLoadModule("/src/data/shaders.tsx");
  recipeModule = await vite.ssrLoadModule("/src/shaders/landing-pages/pageRecipes.ts");
  skillModule = await vite.ssrLoadModule("/src/components/buildSkillMarkdown.js");
} finally {
  await vite.close();
}

const freeShaders = shaderModule.READY_SHADERS.filter((shader) => shader.status !== "beta" && shaderModule.getShaderAccess(shader) !== "pro");
const visibleFreeShaders = freeShaders.filter((shader) => !shader.variantOf);
const freeIds = new Set(freeShaders.map((shader) => String(shader.id)));

const publicAdapters = new Map();
for (const path of publicAdapterFiles) {
  publicAdapters.set(path, await readFile(join(projectRoot, path), "utf8"));
}

await rm(join(projectRoot, "src"), { recursive: true, force: true });
await rm(join(projectRoot, "public"), { recursive: true, force: true });
await mkdir(join(projectRoot, "src", "data"), { recursive: true });
await mkdir(join(projectRoot, "public"), { recursive: true });

for (const path of shellFiles) await copyFromSource(path);
for (const [path, contents] of publicAdapters) await writeGenerated(path, contents);
for (const path of publicRuntimeFiles) await copyFromSource(path);

const componentPaths = new Set();
const assetPaths = new Set();
for (const shader of freeShaders) {
  const component = registryById.get(String(shader.id)) ?? registryById.get(String(shader.variantOf));
  if (!component) throw new Error(`Missing source inventory for ${shader.id}.`);
  for (const file of component.files ?? []) componentPaths.add(file.path);
  for (const asset of component.assets ?? []) assetPaths.add(asset.path);
}

for (const path of componentPaths) {
  if (generatedRendererPaths.has(path)) continue;
  if (path === "src/shaders/globe/sources/network-globe.html" || path === "src/shaders/globe/sources/tangled-constellations.html") continue;
  await copyFromSource(path);
}
for (const path of assetPaths) {
  if (!excludedAssetPaths.has(path)) await copyFromSource(path);
}

await writeGenerated("src/data/shaders.tsx", generateShadersModule(freeShaders, registryById, shaderModule.getShaderAccess));
const mainSidebarSource = await readFile(join(sourceRoot, "src/components/Sidebar.tsx"), "utf8");
const newestBlock = mainSidebarSource.match(/const NEWEST_SHADER_IDS = \[([\s\S]*?)\] as const/)?.[1];
if (!newestBlock) throw new Error("Could not read the main sidebar ordering.");
const publicParentIds = new Set(visibleFreeShaders.map((shader) => String(shader.id)));
const communityNewestIds = [...newestBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]).filter((id) => publicParentIds.has(id));
await writeGenerated(
  "src/data/communityOrder.ts",
  `// Updated by scripts/sync-community-from-main.mjs.\nexport const COMMUNITY_NEWEST_SHADER_IDS = ${JSON.stringify(communityNewestIds, null, 2)} as const;\n`,
);
await writeGenerated(
  "src/data/mainCatalogSummary.ts",
  `// Updated by scripts/sync-community-from-main.mjs.\nexport const FULL_THREEUI_COLLECTION_COUNT = ${shaderModule.VISIBLE_READY_SHADERS.filter((shader) => shader.status !== "beta").reduce((total, shader) => total + (shader.variants?.length || 1), 0)};\n`,
);
await writeGenerated("src/shaders/landing-pages/pageRecipes.ts", generatePageRecipes(recipeModule));
await writeGenerated("src/shaders/landing-pages/LandingPages.tsx", generateLandingPagesModule());
await writeGenerated("src/shaders/globe/GlobeCollection.tsx", generateGlobeCollectionModule());
await writeGenerated(
  "src/shaders/community.css",
  generateCommunityStyles(await readFile(join(sourceRoot, "src/shaders/threeui.css"), "utf8")),
);
await writeGenerated(
  "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
  sanitizeNeuformIsolatedEffects(await readFile(join(sourceRoot, "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"), "utf8")),
);
await writeGenerated(
  "src/shaders/sketchbook/sketchbookDocument.js",
  (await readFile(join(sourceRoot, "src/shaders/sketchbook/sketchbookDocument.js"), "utf8"))
    .replace(/\/\* Canonical source: .* \*\//, "/* Canonical source: public/landing-pages/meng-to-sketchbook.html */"),
);
await writeGenerated("src/shaders/spark-badge/SparkBadge.tsx", generateSparkBadgeModule());
await writeGenerated("src/shaders/temple-night/TempleNightScene.tsx", generateTempleNightModule());
await writeGenerated("src/shaders/sylva-living-world/SylvaLivingWorldScene.tsx", generateSylvaLivingWorldModule());

const sparkHtml = sanitizeSparkBadgeHtml(await readFile(join(sourceRoot, "public", "spark-badge.html"), "utf8"));
await writeFile(join(projectRoot, "public", "spark-badge.html"), sparkHtml);

const skillById = new Map(visibleFreeShaders.map((shader) => {
  const publicShader = sanitizeMetadata(shader, freeIds, shaderModule.getShaderAccess);
  if (mixedAccessParentIds.has(String(shader.id))) return [String(shader.id), fallbackSkillMarkdown(publicShader)];
  try {
    return [String(shader.id), skillModule.buildSkillMarkdown(shader)];
  } catch {
    return [String(shader.id), fallbackSkillMarkdown(publicShader)];
  }
}));
await writeFile(join(projectRoot, "src", "components", "buildSkillMarkdown.js"), generateSkillMarkdownModule(skillById));

const pathUseCount = new Map();
const componentPathsById = new Map();
const publicSourcePath = (path) => path === "src/shaders/threeui.css" ? "src/shaders/community.css" : path;
for (const shader of visibleFreeShaders) {
  const component = registryById.get(String(shader.id));
  const paths = [
    ...(component?.files ?? []).map((file) => file.path),
    ...(component?.sharedFilePaths ?? []),
  ].map(publicSourcePath).filter((path) => {
    if (path === "src/shaders/globe/sources/network-globe.html" || path === "src/shaders/globe/sources/tangled-constellations.html") return false;
    return textExtensions.has(extname(path));
  });
  componentPathsById.set(String(shader.id), paths);
  for (const path of new Set(paths)) pathUseCount.set(path, (pathUseCount.get(path) ?? 0) + 1);
}

const sharedPaths = new Set([...pathUseCount].filter(([, count]) => count > 1).map(([path]) => path));
const originalFileByPath = new Map([
  ...(inventory.sharedFiles ?? []),
  ...inventory.components.flatMap((component) => component.files ?? []),
].map((file) => [publicSourcePath(file.path), file]));
const sharedFiles = await Promise.all([...sharedPaths].sort().map((path) => fileRecord(path, originalFileByPath.get(path))));
const sourceComponents = [];
for (const shader of visibleFreeShaders) {
  const original = registryById.get(String(shader.id));
  const paths = componentPathsById.get(String(shader.id));
  const files = await Promise.all(paths.filter((path) => !sharedPaths.has(path)).map((path) => fileRecord(path, originalFileByPath.get(path))));
  sourceComponents.push({
    id: String(shader.id),
    exportName: shader.importName,
    sourceCommit: shader.sourceCommit,
    runtime: shader.runtime,
    sharedFilePaths: paths.filter((path) => sharedPaths.has(path)),
    files,
    assets: (original?.assets ?? []).filter((asset) => !excludedAssetPaths.has(asset.path)).map((asset) => ({ ...asset })),
  });
}

const sourceRegistry = { schemaVersion: 1, generatedAt: new Date().toISOString(), readyIds: visibleFreeShaders.map((shader) => String(shader.id)), sharedFiles, components: sourceComponents };
if (previousSourceRegistry && JSON.stringify(withoutGeneratedAt(previousSourceRegistry)) === JSON.stringify(withoutGeneratedAt(sourceRegistry))) {
  sourceRegistry.generatedAt = previousSourceRegistry.generatedAt;
}
await writeFile(join(projectRoot, "public", "source-code.json"), `${JSON.stringify(sourceRegistry, null, 2)}\n`);

const syncReport = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceCommit: sourceRevision(),
  communityParents: visibleFreeShaders.length,
  communityRoutes: freeShaders.length,
  communityVariants: visibleFreeShaders.reduce((total, shader) => total + (shader.variants?.filter((variant) => shaderModule.getShaderAccess(shader, variant) !== "pro").length || 0), 0),
  excludedProParents: shaderModule.VISIBLE_READY_SHADERS.filter((shader) => shaderModule.getShaderAccess(shader) === "pro").length,
  excludedBetaParents: shaderModule.VISIBLE_READY_SHADERS.filter((shader) => shader.status === "beta").length,
  layoutStylesSha256: createHash("sha256").update(await readFile(join(projectRoot, "src", "styles.css"))).digest("hex"),
  rendererStylesSha256: createHash("sha256").update(await readFile(join(projectRoot, "src", "shaders", "community.css"))).digest("hex"),
  components: visibleFreeShaders.map((shader) => {
    const variants = (shader.variants ?? []).filter((variant) => shaderModule.getShaderAccess(shader, variant) !== "pro");
    return {
      id: String(shader.id),
      variantIds: variants.map((variant) => String(variant.id)),
      controlKeys: (shader.controls ?? []).map((control) => String(control.key)),
      variantControlKeys: Object.fromEntries(
        variants.map((variant) => [String(variant.id), (variant.controls ?? []).map((control) => String(control.key))]),
      ),
    };
  }),
};
if (
  previousSyncReport
  && !hasProjectChangesOutsideSyncReport()
  && JSON.stringify(withoutSyncMetadata(previousSyncReport)) === JSON.stringify(withoutSyncMetadata(syncReport))
) {
  syncReport.generatedAt = previousSyncReport.generatedAt;
  syncReport.sourceCommit = previousSyncReport.sourceCommit;
}
await writeFile(join(projectRoot, "public", "community-sync-report.json"), `${JSON.stringify(syncReport, null, 2)}\n`);

console.log(`Synced ${syncReport.communityParents} Community parents, ${syncReport.communityRoutes} routes, and ${syncReport.communityVariants} free variants from the main project.`);
