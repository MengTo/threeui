import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, SetStateAction } from "react";
import type { ChoiceControl, RangeControl, ReadyShader, ShaderControl } from "../data/shaders";
import { READY_SHADERS, VISIBLE_READY_SHADERS } from "../data/publicShaders";
import { readShaderMetrics, recordShaderCopy, recordShaderView } from "../shaderMetrics";
import { CheckIcon, ChevronIcon, CopyIcon, EyeIcon, RestartIcon, TocIcon } from "./icons";
import { InstallationSteps } from "./InstallationSteps";
import { PreviewFpsMeter } from "./PreviewFpsMeter";
import { RightRailPromos } from "./RightRailPromos";
import { ShaderTags } from "./ShaderTags";
import { SyntaxHighlightedCode } from "./SyntaxHighlightedCode";
import { buildCodeBundle, buildCopyPrompt } from "./buildCopyBundles.js";
import { buildSkillMarkdown } from "./buildSkillMarkdown.js";
import { CheckpointSliderControl } from "./CheckpointSliderControl";

type SourceTab = "usage" | "renderer" | "skill";
type VariantEdgeMask = "none" | "left" | "right" | "both";
type PreviewSettings = Record<string, number | string>;

type StoredSourceFile = {
  path: string;
  language: string;
  role: string;
  bytes: number;
  lines: number;
  sha256: string;
  code?: string;
  sourceUrl?: string;
};

type StoredAsset = {
  path: string;
  mimeType: string;
  bytes: number;
  sha256: string;
};

type DocumentationSourceBundle = {
  files: StoredSourceFile[];
  assets: StoredAsset[];
};

type StoredSourceComponent = {
  id: string;
  exportName: string;
  sourceCommit: string;
  runtime: string;
  sharedFilePaths: string[];
  files: StoredSourceFile[];
  assets: StoredAsset[];
};

type SourceCodeRegistry = {
  readyIds: string[];
  sharedFiles: StoredSourceFile[];
  components: StoredSourceComponent[];
};

type ShaderBundleSize = {
  codeBytes: number;
  assetBytes: number;
};

const SOURCE_TAB_LABELS: Record<SourceTab, string> = {
  usage: "Usage",
  renderer: "Code",
  skill: "Skill.md",
};

const COMPLETE_SOURCE_ROLES = new Set(["canonical-source", "scene-source"]);
const EMPTY_CONTROLS: readonly ShaderControl[] = [];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${Math.round(kilobytes)} KB`;
  const megabytes = kilobytes / 1024;
  return `${megabytes < 10 ? megabytes.toFixed(1) : Math.round(megabytes)} MB`;
}

function assetsFact(shader: ReadyShader, bundleSize: ShaderBundleSize | null) {
  const imageLabel = shader.assetCount > 1 ? "images" : "image";
  const assetSize = bundleSize?.assetBytes ? ` (${formatBytes(bundleSize.assetBytes)})` : "";
  const codeSize = bundleSize ? ` · code (${formatBytes(bundleSize.codeBytes)})` : "";
  return `${shader.assetCount} ${imageLabel}${assetSize}${codeSize}`;
}

function sourceRoleLabel(role: string) {
  if (COMPLETE_SOURCE_ROLES.has(role)) return "Complete source";
  if (role === "component") return "React host";
  return role.replaceAll("-", " ");
}

const TOC_ITEMS = [
  { id: "usage", label: "Usage" },
  { id: "contract", label: "Renderer contract" },
  { id: "installation", label: "Installation" },
  { id: "integrity", label: "Source integrity" },
] as const;

type TocSectionId = (typeof TOC_ITEMS)[number]["id"];

let sourceRegistryPromise: Promise<SourceCodeRegistry> | undefined;
const externalSourcePromises = new Map<string, Promise<string>>();

function loadSourceRegistry() {
  sourceRegistryPromise ??= fetch("/source-code.json").then(async (response) => {
    if (!response.ok) throw new Error(`Source registry request failed with ${response.status}.`);
    return response.json() as Promise<SourceCodeRegistry>;
  });
  return sourceRegistryPromise;
}

function sourceBundleForShader(registry: SourceCodeRegistry, shaderId: string) {
  const component = registry.components.find((entry) => entry.id === shaderId);
  if (!component) throw new Error(`No stored source exists for ${shaderId}.`);
  const sharedFiles = component.sharedFilePaths.map((path) => {
    const sharedFile = registry.sharedFiles.find((file) => file.path === path);
    if (!sharedFile) throw new Error(`Shared source ${path} is missing.`);
    return sharedFile;
  });
  return { files: [...component.files, ...sharedFiles], assets: component.assets };
}

function bundleSizeForSource(bundle: DocumentationSourceBundle): ShaderBundleSize {
  return {
    codeBytes: bundle.files.reduce((total, file) => total + file.bytes, 0),
    assetBytes: bundle.assets.reduce((total, asset) => total + asset.bytes, 0),
  };
}

function preferredSourceFile(files: StoredSourceFile[]) {
  return files.find((file) => COMPLETE_SOURCE_ROLES.has(file.role)) ?? files[0];
}

async function resolveStoredSourceFile(file: StoredSourceFile) {
  if (file.code !== undefined) return file;
  if (!file.sourceUrl) throw new Error(`Stored source ${file.path} has no code or source URL.`);
  let sourcePromise = externalSourcePromises.get(file.sourceUrl);
  if (!sourcePromise) {
    sourcePromise = fetch(file.sourceUrl).then(async (response) => {
      if (!response.ok) throw new Error(`Stored source request failed with ${response.status} for ${file.path}.`);
      return response.text();
    });
    externalSourcePromises.set(file.sourceUrl, sourcePromise);
  }
  return { ...file, code: await sourcePromise };
}

async function resolveSourceBundle(bundle: ReturnType<typeof sourceBundleForShader>) {
  return { ...bundle, files: await Promise.all(bundle.files.map(resolveStoredSourceFile)) };
}

function defaultSettings(controls: readonly ShaderControl[]): PreviewSettings {
  return Object.fromEntries(controls.map((control) => [control.key, control.default]));
}

function isChoiceControl(control: ShaderControl): control is ChoiceControl {
  return control.kind === "choice";
}

function isRangeControl(control: ShaderControl): control is RangeControl {
  return control.kind === undefined || control.kind === "range";
}

function formatControlProp(control: ShaderControl, value: number | string) {
  if (!isRangeControl(control)) {
    return `        ${control.key}=${JSON.stringify(String(value))}`;
  }
  const numeric = typeof value === "number" ? value : Number(value);
  return `        ${control.key}={${numeric.toFixed(control.digits)}}`;
}

function formatVariantProp(key: string, value: boolean | number | string) {
  if (typeof value === "string") return `        ${key}=${JSON.stringify(value)}`;
  return `        ${key}={${String(value)}}`;
}

type ShaderDocumentationProps = {
  shader: ReadyShader;
  activeVariantId?: string;
  onPricing: () => void;
  onSearchTag: (tag: string) => void;
  onSelect: (id: ReadyShader["id"]) => void;
  onVariantSelect: (id: string) => void;
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function ShaderDocumentation(props: ShaderDocumentationProps) {
  return <OpenShaderDocumentation {...props} />;
}

function OpenShaderDocumentation({ shader, activeVariantId, onPricing, onSearchTag, onSelect, onVariantSelect }: ShaderDocumentationProps) {
  const activeVariant = shader.variants?.find((variant) => variant.id === activeVariantId) ?? shader.variants?.[0];
  const activeVariantShader = activeVariant ? READY_SHADERS.find((candidate) => candidate.id === activeVariant.id) : undefined;
  const activeControls = activeVariant?.controls ?? activeVariantShader?.controls ?? shader.controls ?? EMPTY_CONTROLS;
  const [sourceTab, setSourceTab] = useState<SourceTab>("usage");
  const [restartKey, setRestartKey] = useState(0);
  const [toast, setToast] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [storedSourceFiles, setStoredSourceFiles] = useState<StoredSourceFile[]>([]);
  const [selectedSourcePath, setSelectedSourcePath] = useState("");
  const [sourceRegistryError, setSourceRegistryError] = useState("");
  const [bundleSize, setBundleSize] = useState<ShaderBundleSize | null>(null);
  const previewSettingsKey = `${shader.id}:${activeVariant?.id ?? "default"}`;
  const defaultPreviewSettings = useMemo(() => defaultSettings(activeControls), [activeControls]);
  const [previewSettingsByComponent, setPreviewSettingsByComponent] = useState<Record<string, PreviewSettings>>({});
  const previewSettings = previewSettingsByComponent[previewSettingsKey] ?? defaultPreviewSettings;
  const [activeTocSection, setActiveTocSection] = useState<TocSectionId>("usage");
  const [metrics, setMetrics] = useState(() => readShaderMetrics(shader.id));
  const [variantPreviewId, setVariantPreviewId] = useState<string | null>(null);
  const [variantEdgeMask, setVariantEdgeMask] = useState<VariantEdgeMask>("none");
  const docRef = useRef<HTMLElement>(null);
  const exportControlRef = useRef<HTMLDivElement>(null);
  const exportTriggerRef = useRef<HTMLButtonElement>(null);
  const promptFeedbackTimerRef = useRef<number | undefined>(undefined);
  const variantOptionsRef = useRef<HTMLDivElement>(null);
  const Preview = shader.component!;
  const previewProps = { ...activeVariant?.props, ...previewSettings };
  const index = VISIBLE_READY_SHADERS.findIndex((item) => item.id === shader.id);
  const previous = index > 0 ? VISIBLE_READY_SHADERS[index - 1] : undefined;
  const next = index < VISIBLE_READY_SHADERS.length - 1 ? VISIBLE_READY_SHADERS[index + 1] : undefined;
  const activeTocIndex = Math.max(0, TOC_ITEMS.findIndex((item) => item.id === activeTocSection));
  const selectedSourceFile = storedSourceFiles.find((file) => file.path === selectedSourcePath);
  const sourceLanguage = sourceTab === "usage"
    ? "tsx"
    : sourceTab === "skill" ? "markdown"
      : selectedSourceFile?.role === "shader-source" ? "shader-javascript" : selectedSourceFile?.language ?? "text";
  const loadDocumentationSourceBundle = useCallback(async (resolveFiles = false) => {
    const bundle = sourceBundleForShader(await loadSourceRegistry(), shader.id);
    return resolveFiles ? resolveSourceBundle(bundle) : bundle;
  }, [shader.id]);

  const setPreviewSettings = (nextSettings: SetStateAction<PreviewSettings>) => {
    setPreviewSettingsByComponent((currentSettingsByComponent) => {
      const currentSettings = currentSettingsByComponent[previewSettingsKey] ?? defaultPreviewSettings;
      const resolvedSettings = typeof nextSettings === "function" ? nextSettings(currentSettings) : nextSettings;
      return { ...currentSettingsByComponent, [previewSettingsKey]: resolvedSettings };
    });
  };

  const beginVariantPreview = (id: string, video: HTMLVideoElement | null) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVariantPreviewId(id);
    if (!video) return;
    video.dataset.active = "true";
    delete video.dataset.playbackError;
    video.currentTime = 0;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      video.dataset.ready = "true";
      void video.play().catch((error: unknown) => {
        video.dataset.playbackError = error instanceof DOMException ? error.name : "unknown";
      });
      return;
    }
    video.dataset.ready = "false";
    video.preload = "auto";
    video.load();
  };

  const endVariantPreview = (id: string, video: HTMLVideoElement | null) => {
    if (video) {
      video.dataset.active = "false";
      video.pause();
      video.currentTime = 0;
    }
    setVariantPreviewId((current) => current === id ? null : current);
  };

  const exampleText = useMemo(() => {
    const variantProps = Object.entries(activeVariant?.props ?? {}).map(([key, value]) => formatVariantProp(key, value));
    const controlProps = activeControls.map(
      (control) => formatControlProp(control, previewSettings[control.key] ?? control.default),
    );
    const props = [...variantProps, ...controlProps].join("\n");
    if (props) {
      return `import { ${shader.importName} } from "@designcodeio/threeui";\nimport "@designcodeio/threeui/style.css";\n\nexport function Scene() {\n  return (\n    <div className="shader-frame">\n      <${shader.importName}\n${props}\n      />\n    </div>\n  );\n}`;
    }
    if (shader.id === "sketchbook") {
      return `import { Sketchbook } from "@designcodeio/threeui";\nimport "@designcodeio/threeui/style.css";\n\nexport function Scene() {\n  return (\n    <div className="shader-frame">\n      <Sketchbook assetBaseUrl="/sketchbook/" />\n    </div>\n  );\n}`;
    }
    return `import { ${shader.importName} } from "@designcodeio/threeui";\nimport "@designcodeio/threeui/style.css";\n\nexport function Scene() {\n  return (\n    <div className="shader-frame">\n      <${shader.importName} />\n    </div>\n  );\n}`;
  }, [activeControls, activeVariant, previewSettings, shader]);

  useEffect(() => {
    setMetrics(readShaderMetrics(shader.id));
    const viewTimer = window.setTimeout(() => setMetrics(recordShaderView(shader.id)), 0);
    return () => window.clearTimeout(viewTimer);
  }, [shader.id]);

  useEffect(() => {
    const rail = variantOptionsRef.current;
    if (!rail) {
      setVariantEdgeMask("none");
      return undefined;
    }

    let animationFrame = 0;
    const updateEdgeMask = () => {
      animationFrame = 0;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const hasLeftOverflow = rail.scrollLeft > 1;
      const hasRightOverflow = rail.scrollLeft < maxScroll - 1;
      const nextMask: VariantEdgeMask = hasLeftOverflow
        ? hasRightOverflow ? "both" : "left"
        : hasRightOverflow ? "right" : "none";
      setVariantEdgeMask((current) => current === nextMask ? current : nextMask);
    };
    const scheduleEdgeMaskUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateEdgeMask);
    };
    const resizeObserver = new ResizeObserver(scheduleEdgeMaskUpdate);

    rail.addEventListener("scroll", scheduleEdgeMaskUpdate, { passive: true });
    resizeObserver.observe(rail);
    scheduleEdgeMaskUpdate();

    return () => {
      rail.removeEventListener("scroll", scheduleEdgeMaskUpdate);
      resizeObserver.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [shader.id, shader.variants?.length]);

  useEffect(() => {
    const doc = docRef.current;
    const scroller = doc?.closest<HTMLElement>(".pane-scroll");
    if (!doc || !scroller) return undefined;

    let animationFrame = 0;
    const updateActiveSection = () => {
      animationFrame = 0;
      if (scroller.scrollTop <= 1) {
        setActiveTocSection("usage");
        return;
      }

      const activationLine = scroller.getBoundingClientRect().top + 40;
      let nextSection: TocSectionId = "usage";
      for (const item of TOC_ITEMS) {
        const section = doc.querySelector<HTMLElement>(`#${item.id}`);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          nextSection = item.id;
        }
      }
      setActiveTocSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
    };
    const scheduleActiveSection = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    scroller.addEventListener("scroll", scheduleActiveSection, { passive: true });
    window.addEventListener("hashchange", scheduleActiveSection);
    scheduleActiveSection();

    return () => {
      scroller.removeEventListener("scroll", scheduleActiveSection);
      window.removeEventListener("hashchange", scheduleActiveSection);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [shader.id]);

  const skillMarkdown = useMemo(() => {
    try {
      return buildSkillMarkdown(shader);
    } catch (error) {
      return `Skill markdown unavailable for ${shader.id}.\n\n${error instanceof Error ? error.message : String(error)}`;
    }
  }, [shader]);

  const sourceText = useMemo(() => {
    if (sourceTab === "usage") return exampleText;
    if (sourceTab === "renderer") {
      if (sourceRegistryError) return `The local source registry could not be loaded.\n\n${sourceRegistryError}`;
      return selectedSourceFile?.code ?? "Loading stored source…";
    }
    return skillMarkdown;
  }, [exampleText, selectedSourceFile, skillMarkdown, sourceRegistryError, sourceTab]);

  const viewLabel = `${metrics.views.toLocaleString()} ${metrics.views === 1 ? "view" : "views"}`;
  const copyLabel = `${metrics.copies.toLocaleString()} ${metrics.copies === 1 ? "prompt copy" : "prompt copies"}`;

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1600);
  };

  const recordCopy = () => setMetrics(recordShaderCopy(shader.id));

  const copyExport = (text: string, message: string) => {
    setExportMenuOpen(false);
    copyText(text).then(() => notify(message));
  };

  const copyPromptBundle = async () => {
    if (exportBusy) return;
    if (promptFeedbackTimerRef.current !== undefined) {
      window.clearTimeout(promptFeedbackTimerRef.current);
      promptFeedbackTimerRef.current = undefined;
    }
    setPromptCopied(false);
    setExportMenuOpen(false);
    setExportBusy(true);
    try {
      const { files } = await loadDocumentationSourceBundle();
      const prompt = buildCopyPrompt({
        shader,
        files,
        activeVariant,
        sourceBaseUrl: window.location.origin,
        sourcePageUrl: window.location.href,
      });
      await copyText(prompt);
      recordCopy();
      setPromptCopied(true);
      promptFeedbackTimerRef.current = window.setTimeout(() => {
        setPromptCopied(false);
        promptFeedbackTimerRef.current = undefined;
      }, 1600);
      notify("Reference prompt + source URL copied");
    } catch (error) {
      console.error(error);
      notify("Copy prompt unavailable");
    } finally {
      setExportBusy(false);
    }
  };

  useEffect(() => () => {
    if (promptFeedbackTimerRef.current !== undefined) {
      window.clearTimeout(promptFeedbackTimerRef.current);
    }
  }, []);

  const copyCompleteSource = async () => {
    if (exportBusy) return;
    setExportMenuOpen(false);
    setExportBusy(true);
    try {
      const { files, assets } = await loadDocumentationSourceBundle(true);
      await copyText(buildCodeBundle({ shader, files, assets }));
      notify("Code copied");
    } catch (error) {
      console.error(error);
      notify("Code unavailable");
    } finally {
      setExportBusy(false);
    }
  };

  useEffect(() => {
    if (!exportMenuOpen) return undefined;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!exportControlRef.current?.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExportMenuOpen(false);
        exportTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [exportMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    setBundleSize(null);
    loadDocumentationSourceBundle()
      .then((bundle) => {
        if (!cancelled) setBundleSize(bundleSizeForSource(bundle));
      })
      .catch(() => {
        if (!cancelled) setBundleSize(null);
      });

    return () => {
      cancelled = true;
    };
  }, [loadDocumentationSourceBundle]);

  useEffect(() => {
    if (sourceTab !== "renderer") return undefined;
    let cancelled = false;

    setStoredSourceFiles([]);
    setSelectedSourcePath("");
    setSourceRegistryError("");

    loadDocumentationSourceBundle()
      .then((bundle) => {
        if (cancelled) return;
        const files = bundle.files;
        const sourceFile = preferredSourceFile(files);
        setStoredSourceFiles(files);
        setSelectedSourcePath(sourceFile?.path ?? "");
      })
      .catch((error: unknown) => {
        if (!cancelled) setSourceRegistryError(error instanceof Error ? error.message : "Unknown source registry error.");
      });

    return () => {
      cancelled = true;
    };
  }, [loadDocumentationSourceBundle, sourceTab]);

  useEffect(() => {
    if (sourceTab !== "renderer" || !selectedSourcePath) return undefined;
    const selected = storedSourceFiles.find((file) => file.path === selectedSourcePath);
    if (!selected?.sourceUrl || selected.code !== undefined) return undefined;
    let cancelled = false;

    resolveStoredSourceFile(selected)
      .then((resolved) => {
        if (cancelled) return;
        setStoredSourceFiles((files) => files.map((file) => file.path === resolved.path ? resolved : file));
      })
      .catch((error: unknown) => {
        if (!cancelled) setSourceRegistryError(error instanceof Error ? error.message : "Unknown source request error.");
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSourcePath, sourceTab, storedSourceFiles]);

  return (
    <>
      <div className="pane-inner">
        <main className="doc" id="doc" ref={docRef}>
          <div className="doc-intro">
            <div className="doc-topline">
              <h1>{shader.label}</h1>
              <div className="doc-actions">
                <div className="export-control" ref={exportControlRef}>
                  <button className="export-primary" disabled={exportBusy} onClick={copyPromptBundle}>
                    {promptCopied ? <><CheckIcon />Copied</> : <><CopyIcon />Copy Prompt</>}
                  </button>
                  <button
                    className="export-trigger"
                    ref={exportTriggerRef}
                    aria-label="More export options"
                    aria-haspopup="menu"
                    aria-expanded={exportMenuOpen}
                    aria-controls="shader-export-menu"
                    onClick={() => setExportMenuOpen((open) => !open)}
                  >
                    <ChevronIcon />
                  </button>
                  {exportMenuOpen ? (
                    <div className="export-menu card" id="shader-export-menu" role="menu">
                      <button role="menuitem" disabled={exportBusy} onClick={copyPromptBundle}>Copy Prompt</button>
                      <button role="menuitem" disabled={exportBusy} onClick={copyCompleteSource}>Copy Code</button>
                      <button role="menuitem" onClick={() => copyExport(skillMarkdown, "SKILL.md copied")}>Copy SKILL.md</button>
                    </div>
                  ) : null}
                </div>
                <div className="doc-promos-compact" aria-label="ThreeUI promotions">
                  <RightRailPromos onPricing={onPricing} />
                </div>
              </div>
            </div>
            <p className="lede">
              <span>{shader.category}</span>
              <span aria-hidden="true"> • </span>
              {shader.description}
            </p>
            <div className="tagrow">
              <ShaderTags key={shader.id} tags={shader.tags} onSearch={onSearchTag} />
              <span className="metric-tag" title={viewLabel} aria-label={viewLabel}>
                <EyeIcon />{metrics.views.toLocaleString()}
              </span>
              <span className="metric-tag" title={copyLabel} aria-label={copyLabel}>
                <CopyIcon />{metrics.copies.toLocaleString()}
              </span>
            </div>
          </div>

          <section className="demo inset-shadow" id="usage" aria-label="Usage">
            <div
              className={`preview shader-preview ${shader.id}${shader.category === "Landing Pages" || shader.category === "Hero" ? " tall-page-preview" : ""}`}
              data-variant={activeVariant?.id}
            >
              <Suspense fallback={<div className="preview-loading" role="status">Loading renderer…</div>}>
                <Preview key={`${shader.id}-${activeVariant?.id ?? "default"}-${restartKey}`} {...previewProps} />
              </Suspense>
              <PreviewFpsMeter sampleKey={`${shader.id}-${activeVariant?.id ?? "default"}-${restartKey}`} />
              <div className="tools">
                <button
                  className="icon-btn inset-shadow"
                  onClick={() => setRestartKey((key) => key + 1)}
                  aria-label="Restart animation"
                >
                  <RestartIcon />
                </button>
              </div>
            </div>

            {shader.variants && shader.variants.length > 1 ? (
              <div className="variant-picker card" aria-label={`${shader.label} variants`}>
                <div className="variant-picker-head">{shader.variants.length} variants</div>
                <div
                  ref={variantOptionsRef}
                  className="variant-options"
                  role="radiogroup"
                  aria-label="Choose a variant"
                  data-edge-mask={variantEdgeMask}
                >
                  {shader.variants.map((variant) => {
                    const selected = variant.id === activeVariant?.id;
                    return (
                      <button
                        type="button"
                        className={`variant-option inset-shadow${selected ? " active" : ""}`}
                        role="radio"
                        aria-checked={selected}
                        aria-label={`${variant.label}. ${variant.description}`}
                        key={variant.id}
                        onMouseEnter={(event) => beginVariantPreview(variant.id, event.currentTarget.querySelector("video"))}
                        onMouseLeave={(event) => endVariantPreview(variant.id, event.currentTarget.querySelector("video"))}
                        onFocus={(event) => beginVariantPreview(variant.id, event.currentTarget.querySelector("video"))}
                        onBlur={(event) => endVariantPreview(variant.id, event.currentTarget.querySelector("video"))}
                        onClick={(event) => {
                          onVariantSelect(variant.id);
                          event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                        }}
                      >
                        <span className="variant-option-thumbnail">
                          <img src={variant.thumbnail} alt="" loading="lazy" />
                          {variant.preview ? (
                            <video
                              className="variant-option-preview-video"
                              src={variant.preview}
                              poster={variant.thumbnail}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              data-active={variantPreviewId === variant.id}
                              tabIndex={-1}
                              aria-hidden="true"
                              onLoadedData={(event) => {
                                const video = event.currentTarget;
                                video.dataset.ready = "true";
                                if (video.dataset.active === "true") {
                                  void video.play().catch((error: unknown) => {
                                    video.dataset.playbackError = error instanceof DOMException ? error.name : "unknown";
                                  });
                                }
                              }}
                              onError={(event) => {
                                event.currentTarget.dataset.ready = "false";
                                event.currentTarget.dataset.playbackError = "MediaError";
                              }}
                            />
                          ) : null}
                        </span>
                        <span className="variant-option-label">
                          <span>{variant.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="panel card">
              <div className="panel-head">
                <h2>{activeControls.length ? "Props" : "Renderer"}</h2>
                {activeControls.length ? (
                  <button
                    className="icon-btn inset-shadow"
                    aria-label={`Reset ${shader.label} props`}
                    onClick={() => setPreviewSettings(defaultSettings(activeControls))}
                  >
                    <RestartIcon />
                  </button>
                ) : (
                  <span className="panel-ready"><span className="status-dot" />READY</span>
                )}
              </div>
              {activeControls.length ? (
                <div className="controls shader-controls">
                  {activeControls.map((control) => {
                    if (control.kind === "checkpoint") {
                      const value = String(previewSettings[control.key] ?? control.default);
                      const id = `${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`;
                      return (
                        <CheckpointSliderControl
                          id={id}
                          key={control.key}
                          label={control.label}
                          options={control.options}
                          value={value}
                          onChange={(nextValue) => {
                            setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                          }}
                        />
                      );
                    }
                    if (control.kind === "color") {
                      const value = String(previewSettings[control.key] ?? control.default);
                      const swatchValue = /^#[\da-f]{6}$/i.test(value) ? value : control.default;
                      const id = `${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`;
                      return (
                        <div className="control color-control inset-shadow" key={control.key}>
                          <label htmlFor={id}>{control.label}</label>
                          <div className="color-control-value">
                            <input
                              id={id}
                              className="color-swatch-input"
                              type="color"
                              value={swatchValue}
                              onChange={(event) => {
                                const nextValue = event.currentTarget.value;
                                setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                              }}
                            />
                            <input
                              className="color-hex-input"
                              type="text"
                              value={value.toUpperCase()}
                              maxLength={7}
                              aria-label={`${control.label} hex value`}
                              autoComplete="off"
                              spellCheck={false}
                              onChange={(event) => {
                                const nextValue = event.currentTarget.value;
                                setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                    if (isChoiceControl(control)) {
                      const value = String(previewSettings[control.key] ?? control.default);
                      return (
                        <div className="control choice-control inset-shadow" key={control.key}>
                          <span className="choice-label">{control.label}</span>
                          <div className="choice-options" role="group" aria-label={control.label}>
                            {control.options.map((option) => {
                              const selected = value === option.value;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  className={`choice-option${selected ? " active" : ""}`}
                                  aria-pressed={selected}
                                  onClick={() => setPreviewSettings((current) => ({ ...current, [control.key]: option.value }))}
                                >
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (control.kind === "text") {
                      const value = String(previewSettings[control.key] ?? control.default);
                      return (
                        <div className="control text-control inset-shadow" key={control.key}>
                          <label htmlFor={`${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`}>{control.label}</label>
                          <input
                            id={`${shader.id}-${activeVariant?.id ?? "default"}-${control.key}`}
                            type="text"
                            value={value}
                            maxLength={control.maxLength}
                            placeholder={control.placeholder}
                            autoComplete="off"
                            spellCheck={false}
                            onChange={(event) => {
                              const nextValue = event.currentTarget.value;
                              setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                            }}
                          />
                        </div>
                      );
                    }
                    if (!isRangeControl(control)) return null;
                    const value = Number(previewSettings[control.key] ?? control.default);
                    const progress = (value - control.min) / (control.max - control.min);
                    const sliderStyle = { "--slider-progress": progress } as CSSProperties;
                    const setFromPointer = (clientX: number, element: HTMLDivElement) => {
                      const bounds = element.getBoundingClientRect();
                      const nextProgress = Math.min(1, Math.max(0, (clientX - bounds.left - 6) / (bounds.width - 12)));
                      const nextValue = control.min + nextProgress * (control.max - control.min);
                      const steppedValue = Math.round(nextValue / control.step) * control.step;
                      setPreviewSettings((current) => ({ ...current, [control.key]: steppedValue }));
                    };
                    return (
                      <div
                        className="control slider-control inset-shadow"
                        style={sliderStyle}
                        key={control.key}
                        onPointerDown={(event) => {
                          event.currentTarget.setPointerCapture(event.pointerId);
                          setFromPointer(event.clientX, event.currentTarget);
                        }}
                        onPointerMove={(event) => {
                          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                            setFromPointer(event.clientX, event.currentTarget);
                          }
                        }}
                        onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
                      >
                        <span className="slider-fill card"><span className="slider-knob" /></span>
                        <label htmlFor={`${shader.id}-${control.key}`}>{control.label}</label>
                        <span className="slider-value">{value.toFixed(control.digits)}</span>
                        <input
                          id={`${shader.id}-${control.key}`}
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={value}
                          aria-valuetext={value.toFixed(control.digits)}
                          onInput={(event) => {
                            const nextValue = Number(event.currentTarget.value);
                            setPreviewSettings((current) => ({ ...current, [control.key]: nextValue }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="controls renderer-facts" aria-label="Renderer facts">
                <div className="control inset-shadow">
                  <span>Passes</span><strong title={shader.passes.split(" — ")[0]}>{shader.passes.split(" — ")[0]}</strong>
                </div>
                <div className="control inset-shadow">
                  <span>Runtime</span><strong title={shader.runtime}>{shader.runtime}</strong>
                </div>
                <div className="control inset-shadow">
                  <span>Assets</span><strong title={assetsFact(shader, bundleSize)}>{assetsFact(shader, bundleSize)}</strong>
                </div>
              </div>
            </div>

            <div className="code-card card source-card">
              <div className="tabbar">
                <div className="tabs" role="tablist" aria-label="Source details">
                  {(["usage", "renderer", "skill"] as SourceTab[]).map((tab) => (
                    <button
                      className="tab"
                      role="tab"
                      aria-selected={sourceTab === tab}
                      key={tab}
                      onClick={() => setSourceTab(tab)}
                    >
                      {SOURCE_TAB_LABELS[tab]}
                    </button>
                  ))}
                </div>
                <button
                  className="icon-btn inset-shadow"
                  aria-label="Copy source"
                  disabled={sourceTab === "renderer" && !selectedSourceFile}
                  onClick={() => {
                    if (sourceTab === "usage") recordCopy();
                    copyText(sourceText).then(() => notify("Copied"));
                  }}
                >
                  <CopyIcon />
                </button>
              </div>
              {sourceTab === "renderer" && storedSourceFiles.length > 0 ? (
                <div className="source-filebar">
                  <select
                    className="source-file-select"
                    aria-label="Source file"
                    value={selectedSourcePath}
                    onChange={(event) => setSelectedSourcePath(event.currentTarget.value)}
                  >
                    {storedSourceFiles.map((file) => (
                      <option value={file.path} key={file.path}>{file.path}</option>
                    ))}
                  </select>
                  {selectedSourceFile ? (
                    <span className="source-file-meta">
                      <strong>{sourceRoleLabel(selectedSourceFile.role)}</strong>
                      <span>{selectedSourceFile.language} · {selectedSourceFile.lines} lines · {selectedSourceFile.sha256.slice(0, 10)}</span>
                    </span>
                  ) : null}
                </div>
              ) : null}
              {sourceTab === "skill" ? (
                <div className="source-filebar skill-filebar">
                  <span className="source-file-name">SKILL.md</span>
                  <span className="source-file-meta">
                    <strong>Codex skill</strong>
                    <span>markdown · {skillMarkdown.split("\n").length} lines</span>
                  </span>
                </div>
              ) : null}
              <pre className={`code source-code${sourceTab === "renderer" ? " stored-source" : sourceTab === "skill" ? " skill-source" : ""}`}>
                <SyntaxHighlightedCode code={sourceText} language={sourceLanguage} />
              </pre>
            </div>
          </section>

          <h2 id="contract">Renderer contract</h2>
          <div className="table-wrap card">
            <table>
              <thead><tr><th>Field</th><th>Type</th><th className="col-default">Value</th></tr></thead>
              <tbody>
                {shader.contract.map((row) => (
                  <tr key={row.name}>
                    <td><span className="mono-chip">{row.name}</span></td>
                    <td><span className="mono-chip">{row.type}</span></td>
                    <td className="col-default">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="installation">Installation</h2>
          <InstallationSteps importName={shader.importName} onNotify={notify} />

          <h2 id="integrity">Source integrity</h2>
          <div className="integrity card">
            <span className="integrity-icon"><span className="status-dot" /></span>
            <div>
              <strong>Exact source is included</strong>
              <p>Every Community renderer is tied to its first-party source revision. Tests fail if owned GLSL, renderer bytes, export boundaries, or required assets drift.</p>
            </div>
          </div>

          <nav className="pager" aria-label="Verified shader pagination">
            {previous ? (
              <button className="card" onClick={() => onSelect(previous.id)}>
                <span className="k">Previous</span><span className="v">{previous.label}</span>
              </button>
            ) : <span />}
            {next ? (
              <button className="card next" onClick={() => onSelect(next.id)}>
                <span className="k">Next</span><span className="v">{next.label}</span>
              </button>
            ) : <span />}
          </nav>
        </main>

        <aside className="rail">
          <RightRailPromos onPricing={onPricing} />
          <div className="toc-head"><TocIcon />On this page</div>
          <nav
            className="toc is-animated"
            aria-label="On this page"
            style={{ "--toc-active-index": activeTocIndex } as CSSProperties}
          >
            <span className="toc-active-line" aria-hidden="true" />
            <span className="toc-active-dot" aria-hidden="true" />
            {TOC_ITEMS.map(({ id, label }) => (
              <div className={`toc-item${activeTocSection === id ? " on" : ""}`} key={id}>
                <span className="rl" /><span className="dot" />
                <a
                  href={`#${id}`}
                  aria-current={activeTocSection === id ? "location" : undefined}
                  onClick={() => setActiveTocSection(id)}
                >
                  {label}
                </a>
              </div>
            ))}
          </nav>
        </aside>
      </div>
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
