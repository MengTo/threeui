import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import innerGreenSource from "./sources/inner-green-3d.html?raw";
import lexendFont from "./sources/inner-green-assets/lexend-latin.woff2?inline";
import threeRuntime from "./sources/inner-green-assets/three.min.js?raw";

export const SYLVA_LIVING_WORLD_VARIANTS = ["living-green"] as const;
export type SylvaLivingWorldVariant = "living-green";

export type SylvaLivingWorldSceneProps = {
  variant?: SylvaLivingWorldVariant;
  assetBaseUrl?: string;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ASSET_BASE_URL = "/landing-pages/";
const SCENE_ONLY_MARKUP = `<main class="hero" id="hero"><canvas id="scene" role="img" aria-label="Sylva Living Green"></canvas><div class="stage" id="stage" aria-hidden="true"></div></main>`;
const SCENE_ONLY_STYLE = `<style data-threeui-sylva-scene>html,body{width:100%!important;height:100%!important;min-height:0!important;margin:0!important;overflow:hidden!important}body{position:relative!important;background:#4a4d44!important}.hero{height:100%!important;min-height:0!important}#scene{pointer-events:auto!important}</style>`;

function normalizeAssetBaseUrl(assetBaseUrl: string) {
  const value = assetBaseUrl.trim();
  if (!value) return DEFAULT_ASSET_BASE_URL;
  return value.endsWith("/") ? value : `${value}/`;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&#39;");
}

function buildSceneDocument(reducedMotion: boolean, assetBaseUrl: string) {
  const presentationStart = innerGreenSource.indexOf('<main class="hero" id="hero">');
  const runtimeStart = innerGreenSource.indexOf('<script src="inner-green-assets/three.min.js"></script>');
  if (presentationStart < 0 || runtimeStart < 0 || runtimeStart <= presentationStart) {
    throw new Error("Sylva scene adapter could not isolate the authored Three.js scene.");
  }

  let source = `${innerGreenSource.slice(0, presentationStart)}${SCENE_ONLY_MARKUP}

${innerGreenSource.slice(runtimeStart)}`
    .replace("</head>", `${SCENE_ONLY_STYLE}</head>`)
    .replace(
      '<script src="inner-green-assets/three.min.js"></script>',
      `<script data-threeui-three-runtime>${threeRuntime}</script>`,
    )
    .replace(
      "url('inner-green-assets/lexend-latin.woff2')",
      `url("${lexendFont}")`,
    );

  source = source.replace(
    "<head>",
    `<head><base href="${escapeHtmlAttribute(normalizeAssetBaseUrl(assetBaseUrl))}">`,
  );

  if (reducedMotion) {
    source = source.replace(
      "(function loop() { requestAnimationFrame(loop); tick(); })();",
      "(function loop() { if (!REDUCED) requestAnimationFrame(loop); tick(); })();",
    );
  }

  return source;
}

export function SylvaLivingWorldScene({
  assetBaseUrl = DEFAULT_ASSET_BASE_URL,
  className = "",
  style,
}: SylvaLivingWorldSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostVisible, setHostVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setHostVisible(entry?.isIntersecting ?? true));
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const source = useMemo(
    () => buildSceneDocument(reducedMotion, assetBaseUrl),
    [assetBaseUrl, reducedMotion],
  );
  const mounted = hostVisible && documentVisible;

  useEffect(() => setReady(false), [mounted, reducedMotion, assetBaseUrl]);

  return (
    <div
      ref={hostRef}
      className={`threeui-background sylva-living-world-scene${className ? ` ${className}` : ""}`}
      role="img"
      aria-label="Sylva Living Green with ferns, flowers, pollen, and a butterfly"
      data-variant="living-green"
      data-state={ready ? "ready" : "loading"}
      style={{ background: "#4a4d44", pointerEvents: "auto", ...style }}
    >
      {mounted ? (
        <iframe
          key={`${assetBaseUrl}-${reducedMotion ? "reduced" : "motion"}`}
          title="Sylva Living Green"
          srcDoc={source}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background: "#4a4d44",
          }}
        />
      ) : null}
    </div>
  );
}
