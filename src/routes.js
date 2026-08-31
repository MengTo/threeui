import { catalogSlug } from "./catalogPresentation.js";

export const STATIC_ROUTE_PATHS = {
  browse: "/browse",
  designcodeClaim: "/claim/designcode",
  installation: "/installation",
  mcp: "/mcp",
  pricing: "/pricing",
  purchaseSuccess: "/purchase/success",
  sponsorship: "/sponsorship",
};

export const LEGAL_ROUTE_PATHS = {
  privacy: "/privacy",
  terms: "/terms",
};

export const OAUTH_CONSENT_PATH = "/oauth/consent";
export const AFFILIATES_ROUTE_PATH = "/affiliates";
export const TAG_ROUTE_PREFIX = "/browse/tag";

export function categoryRouteSegment(category) {
  return category
    .toLowerCase()
    .replace(/\.js\b/g, "-js")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tagRouteSegment(tag) {
  return tag
    .toLowerCase()
    .replace(/\.js\b/g, "-js")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function browseCategoryRoutePath(category) {
  return `/${categoryRouteSegment(category)}`;
}

export function browseTagRoutePath(tag) {
  return `${TAG_ROUTE_PREFIX}/${tagRouteSegment(tag)}`;
}

export function shaderRoutePath(shader, variantId) {
  const category = categoryRouteSegment(shader.category);
  const slug = catalogSlug(shader);
  return variantId
    ? `/${category}/${encodeURIComponent(slug)}/${encodeURIComponent(variantId)}`
    : `/${category}/${encodeURIComponent(slug)}`;
}

function decodePathSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return "";
  }
}

function normalizedPathname(pathname) {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;
}

/* ids that shipped publicly before a rename: the old URL still resolves, and the
   canonical path the app replaces it with carries the current id */
export const RENAMED_SHADER_IDS = {
  "uploading-button": "thinking-button",
  "isometric-charging-dock": "isometric-illustration",
  "gradient-collection": "gallery-heading",
};

export const RENAMED_SHADER_VARIANTS = {
  "isometric-illustration": {
    dock: "search",
  },
};

/* Catalog records can move without making their previously published detail URLs
   disappear. The current category always remains canonical. */
export const LEGACY_SHADER_CATEGORY_SEGMENTS = {
  "volta-atelier-hero": "sections",
  "ascii-page-transition-hero": "hero",
  "orrery-hero": "hero",
  "trochil-hero": "hero",
  "cortexa-hero": "hero",
  "cathode-hero": "backgrounds",
  "cadence-hero": "landing-pages",
  "betawise-landing-page": "hero",
  "betawise-hero": "hero",
  "axonis-landing-page": "hero",
  "mira-solvang-landing-page": "landing-pages",
  "tidecrest-hero": "hero",
  "nocturne-hero": "hero",
  "meridian-landing-page": "landing-pages",
  "tideform-hero": "hero",
  "emberline-hero": "hero",
};

function findShader(catalog, id) {
  const currentId = RENAMED_SHADER_IDS[id] ?? id;
  return catalog.find((shader) => shader.id === currentId)
    ?? catalog.find((shader) => catalogSlug(shader) === currentId);
}

function resolveShaderSelection(catalog, requestedShader, requestedVariantId) {
  const shader = requestedShader.variantOf
    ? findShader(catalog, requestedShader.variantOf)
    : requestedShader;
  if (!shader || shader.variantOf) return null;

  const requestedVariant = RENAMED_SHADER_VARIANTS[shader.id]?.[requestedVariantId]
    ?? RENAMED_SHADER_IDS[requestedVariantId]
    ?? requestedVariantId;
  const variantId = requestedShader.variantOf
    ? requestedShader.variantAliases?.[requestedVariant] ?? requestedShader.id
    : requestedVariant;
  if (variantId && !shader.variants?.some((variant) => variant.id === variantId)) return null;

  return {
    page: "shader",
    shader,
    variantId,
    canonicalPath: shaderRoutePath(shader, variantId),
  };
}

function staticRoute(page) {
  return { page, canonicalPath: STATIC_ROUTE_PATHS[page] ?? LEGAL_ROUTE_PATHS[page] };
}

function resolveLegacyRoute(searchParams, catalog) {
  const page = searchParams.get("page");
  if (page === "browse" || page === "installation" || page === "mcp" || page === "pricing" || page === "sponsorship") {
    return staticRoute(page);
  }

  const requestedId = searchParams.get("shader");
  if (!requestedId) return staticRoute("browse");
  const requestedShader = findShader(catalog, requestedId);
  if (!requestedShader) return null;
  return resolveShaderSelection(catalog, requestedShader, searchParams.get("variant") ?? undefined);
}

export function resolveAppRoute(locationLike, catalog) {
  const pathname = normalizedPathname(locationLike.pathname || "/");
  const searchParams = new URLSearchParams(locationLike.search || "");
  const hasLegacyRoute = searchParams.has("page") || searchParams.has("shader") || searchParams.has("variant");

  if (hasLegacyRoute && (pathname === "/" || pathname === STATIC_ROUTE_PATHS.browse)) {
    const legacyRoute = resolveLegacyRoute(searchParams, catalog);
    if (legacyRoute) return { ...legacyRoute, legacy: true };
  }

  if (pathname === "/" || pathname === STATIC_ROUTE_PATHS.browse) {
    return { ...staticRoute("browse"), legacy: pathname === "/" };
  }
  if (pathname === STATIC_ROUTE_PATHS.installation) return staticRoute("installation");
  if (pathname === STATIC_ROUTE_PATHS.mcp) return staticRoute("mcp");
  if (pathname === STATIC_ROUTE_PATHS.pricing) return staticRoute("pricing");
  if (pathname === STATIC_ROUTE_PATHS.purchaseSuccess) return staticRoute("purchaseSuccess");
  if (pathname === STATIC_ROUTE_PATHS.designcodeClaim) {
    return { page: "designcode-claim", canonicalPath: STATIC_ROUTE_PATHS.designcodeClaim };
  }
  if (pathname === STATIC_ROUTE_PATHS.sponsorship) return staticRoute("sponsorship");
  if (pathname === LEGAL_ROUTE_PATHS.privacy) return staticRoute("privacy");
  if (pathname === LEGAL_ROUTE_PATHS.terms) return staticRoute("terms");
  if (pathname === AFFILIATES_ROUTE_PATH) return { page: "affiliates", canonicalPath: AFFILIATES_ROUTE_PATH };
  if (pathname === OAUTH_CONSENT_PATH) return { page: "oauth-consent", canonicalPath: OAUTH_CONSENT_PATH };

  const segments = pathname.slice(1).split("/").map(decodePathSegment);
  if (segments.length === 1) {
    const browseCategory = catalog.find((shader) => categoryRouteSegment(shader.category) === segments[0])?.category;
    if (browseCategory) {
      return {
        page: "browse",
        browseCategory,
        canonicalPath: browseCategoryRoutePath(browseCategory),
      };
    }
  }
  if (segments.length === 3 && `/${segments[0]}/${segments[1]}` === TAG_ROUTE_PREFIX) {
    const browseTag = catalog
      .flatMap((shader) => shader.tags ?? [])
      .find((tag) => tagRouteSegment(tag) === segments[2]);
    if (browseTag) {
      return {
        page: "browse",
        browseTag,
        canonicalPath: browseTagRoutePath(browseTag),
      };
    }
    return { page: "not-found", canonicalPath: pathname };
  }
  if (segments.length !== 2 && segments.length !== 3) {
    return { page: "not-found", canonicalPath: pathname };
  }

  const requestedShader = findShader(catalog, segments[1]);
  const usesGroupedVariantAlias = segments.length === 3
    && requestedShader?.variantOf
    && requestedShader.variantAliases?.[segments[2]];
  const usesLegacyVariantOrder = segments.length === 3
    && !usesGroupedVariantAlias
    && (!requestedShader || requestedShader.variantOf);
  const legacyRequestedShader = usesLegacyVariantOrder ? findShader(catalog, segments[2]) : undefined;
  const resolvedRequestedShader = usesLegacyVariantOrder ? legacyRequestedShader : requestedShader;
  if (!resolvedRequestedShader) return { page: "not-found", canonicalPath: pathname };

  const selection = resolveShaderSelection(
    catalog,
    resolvedRequestedShader,
    segments.length === 3 ? (usesLegacyVariantOrder ? segments[1] : segments[2]) : undefined,
  );
  if (!selection) return { page: "not-found", canonicalPath: pathname };

  const expectedCategory = categoryRouteSegment(selection.shader.category);
  const usesLegacyCategory = LEGACY_SHADER_CATEGORY_SEGMENTS[selection.shader.id] === segments[0];
  if (segments[0] !== expectedCategory && !usesLegacyCategory) {
    return { page: "not-found", canonicalPath: pathname };
  }

  const usesLegacyShaderSlug = segments[1] !== catalogSlug(selection.shader);
  const usesRenamedVariant = segments.length === 3
    && !usesLegacyVariantOrder
    && segments[2] !== selection.variantId;
  return usesLegacyCategory || usesLegacyVariantOrder || usesGroupedVariantAlias || usesLegacyShaderSlug || usesRenamedVariant
    ? { ...selection, legacy: true }
    : selection;
}

export function navigationUrl(path, locationLike = window.location) {
  const url = new URL(locationLike.href);
  url.pathname = path;
  url.searchParams.delete("page");
  url.searchParams.delete("shader");
  url.searchParams.delete("variant");
  url.hash = "";
  return url;
}
