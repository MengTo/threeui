function markdownCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

function markdownFence(code) {
  const longestRun = Math.max(0, ...(code.match(/`+/g) ?? []).map((run) => run.length));
  return "`".repeat(Math.max(3, longestRun + 1));
}

function assetSection(assets) {
  if (assets.length === 0) return ["No binary assets are required.", ""];
  return [
    "Binary assets cannot be represented as executable text. Copy each asset byte-for-byte from the ThreeUI package and verify its hash:",
    "",
    "| Path | MIME type | Bytes | SHA-256 |",
    "| --- | --- | ---: | --- |",
    ...assets.map((asset) => `| \`${markdownCell(asset.path)}\` | ${markdownCell(asset.mimeType)} | ${asset.bytes} | \`${asset.sha256}\` |`),
    "",
  ];
}

function sourceFileSection(file) {
  const fence = markdownFence(file.code);
  const code = file.code.endsWith("\n") ? file.code : `${file.code}\n`;
  return [
    `### \`${file.path}\``,
    "",
    `Role: ${file.role} · ${file.lines} lines · ${file.bytes} bytes · SHA-256 \`${file.sha256}\``,
    "",
    `${fence}${file.language}`,
    `${code}${fence}`,
    "",
  ];
}

function fullSourceSection(files) {
  return [
    `This bundle contains all ${files.length} required text source files. Preserve their paths and contents; none are excerpts.`,
    "",
    ...files.flatMap(sourceFileSection),
  ];
}

function sourceManifestSection(files) {
  if (files.length === 0) return ["No source file is registered for this component.", ""];
  return [
    ...files.map((file) => `- \`${file.path}\` — ${file.role} · SHA-256 \`${file.sha256}\``),
    "",
  ];
}

function directHtmlSource(files, sourceBaseUrl) {
  const file = files.find((candidate) => {
    if (!["canonical-source", "scene-source"].includes(candidate.role) || !candidate.sourceUrl) return false;
    try {
      return new URL(candidate.sourceUrl, sourceBaseUrl).pathname.toLowerCase().endsWith(".html");
    } catch {
      return false;
    }
  });
  if (!file) return null;
  return {
    filename: file.path.split("/").at(-1) ?? file.path,
    url: new URL(file.sourceUrl, sourceBaseUrl).href,
  };
}

export function sourceBundleCandidateIds({ shaderId, activeVariantId, directVariantId }) {
  return [...new Set([
    directVariantId,
    activeVariantId ? `${shaderId}--${activeVariantId}` : undefined,
    shaderId,
  ].filter(Boolean))];
}

export function buildPromptSourceFallback(shader) {
  const files = (shader.sourceFiles ?? []).flatMap((sourceFile, index) => {
    const path = String(sourceFile).split(" — ", 1)[0].trim();
    if (!path || !/\.[a-z0-9]+$/i.test(path)) return [];
    const publicPath = path.startsWith("public/") ? `/${path.slice("public/".length)}` : undefined;
    return [{
      path,
      language: "text",
      role: publicPath ? "canonical-source" : index === 0 ? "component" : "reference-source",
      bytes: 0,
      lines: 0,
      sha256: "local-beta-reference",
      ...(publicPath ? { sourceUrl: publicPath } : {}),
    }];
  });

  if (files.length > 0) return files;
  return [{
    path: `${shader.id}.tsx`,
    language: "tsx",
    role: "component",
    bytes: 0,
    lines: 0,
    sha256: "local-beta-reference",
  }];
}

/**
 * @param {{
 *   shader: any;
 *   files: any[];
 *   assets: any[];
 *   usage?: string;
 *   activeVariant?: any;
 * }} options
 */
export function buildCodeBundle(options) {
  const { shader, files, assets, usage, activeVariant } = options;
  const normalizedUsage = usage ?? `<${shader.importName} />`;
  const usageFence = markdownFence(normalizedUsage);
  const variantLabel = activeVariant ? ` — ${activeVariant.label}` : "";
  return [
    `# ${shader.label}${variantLabel} — Complete source`,
    "",
    `Component: \`${shader.importName}\``,
    ...(activeVariant ? [`Variant: **${activeVariant.label}** (\`${activeVariant.id}\`)`] : []),
    `Runtime: ${shader.runtime}`,
    `Source revision: \`${shader.sourceCommit}\``,
    "",
    "## Current configured usage",
    "",
    `${usageFence}tsx`,
    normalizedUsage,
    usageFence,
    "",
    "## Required assets",
    "",
    ...assetSection(assets),
    "## Full implementation source",
    "",
    ...fullSourceSection(files),
  ].join("\n");
}

/**
 * @param {{
 *   shader: any;
 *   files: any[];
 *   assets?: any[];
 *   usage?: string;
 *   activeVariant?: any;
 *   sourceBaseUrl?: string;
 *   sourcePageUrl?: string;
 *   sourceBundleUrl?: string;
 *   includeInlineSource?: boolean;
 * }} options
 */
export function buildCopyPrompt(options) {
  const {
    shader,
    files,
    assets,
    usage,
    activeVariant,
    sourceBaseUrl,
    sourcePageUrl,
    sourceBundleUrl,
    includeInlineSource = false,
  } = options;
  const normalizedAssets = assets ?? [];
  const normalizedUsage = usage ?? `<${shader.importName} />`;
  const variantLines = activeVariant
    ? [
        `Variant: **${activeVariant.label}** (\`${activeVariant.id}\`)`,
      ]
    : [];
  const referenceBrief = activeVariant?.description ?? shader.description;
  const canonicalHtml = directHtmlSource(files, sourceBaseUrl ?? sourcePageUrl);
  const sourceLinks = [
    ...(canonicalHtml ? [`Canonical HTML: [${canonicalHtml.filename}](${canonicalHtml.url})`] : []),
    ...(sourceBundleUrl ? [`Complete registered source bundle: [${sourceBundleUrl}](${sourceBundleUrl})`] : []),
  ];
  const usageFence = markdownFence(normalizedUsage);
  const inlineFiles = includeInlineSource ? files.filter((file) => typeof file.code === "string") : [];
  const unavailableSourceMessage = inlineFiles.length > 0
    ? "This is protected source supplied by the authenticated ThreeUI page in the inline bundle below."
    : "The exact source is available only at the registered local paths below. Read those files from the current repository; if they are unavailable, stop instead of recreating them.";

  return [
    `# Integrate <${shader.importName} /> from ThreeUI using its exact source`,
    "",
    "You are working in an existing application. Implement this component from the exact source linked or included below. Do not recreate it from the preview, screenshot, description, or filename.",
    "",
    `Component: \`${shader.importName}\``,
    ...variantLines,
    `Runtime: ${shader.runtime}`,
    ...(shader.sourceCommit ? [`Source revision: \`${shader.sourceCommit}\``] : []),
    ...(referenceBrief ? ["", "Reference brief:", referenceBrief] : []),
    "",
    "## Current configured usage",
    "",
    `${usageFence}tsx`,
    normalizedUsage,
    usageFence,
    "",
    "## Exact implementation source",
    "",
    ...(sourceLinks.length > 0 ? [...sourceLinks, ""] : [unavailableSourceMessage, ""]),
    "Required registered files:",
    "",
    ...sourceManifestSection(files),
    ...(normalizedAssets.length > 0 ? ["Required binary assets:", "", ...assetSection(normalizedAssets)] : []),
    "## Implementation requirements",
    "",
    `- Preserve the authored structure, styling, shaders, motion, interactions, responsive behavior, dependencies, and asset paths described by the source.`,
    `- Use the configured \`<${shader.importName} />\` usage above, including the selected variant and props.`,
    "- Build directly in the destination project. Do not embed the ThreeUI documentation page and do not approximate the result from its rendered appearance.",
    "- Fetch and read the complete source before editing. If the source cannot be retrieved, stop and report that instead of recreating it.",
    "- After implementation, verify the rendered result and its interactions in the browser.",
    "",
    ...(inlineFiles.length > 0 ? [
      "## Authenticated full implementation source",
      "",
      ...fullSourceSection(inlineFiles),
    ] : []),
    "",
  ].join("\n");
}
