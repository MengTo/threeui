import { shaderRoutePath, STATIC_ROUTE_PATHS } from "./routes.js";
import { browseRouteContent, browseRouteFaqs, isIndexableBrowseTag } from "./browseTaxonomy.js";
import { resolvePublicMediaUrl } from "./mediaUrls.js";

export const SITE_TITLE = "Three.js Components & Interactive Shaders";
export const SITE_DESCRIPTION = "Browse high-quality Three.js hero components, 3D shaders, prompts, and templates with customizable variants. Framework-agnostic. Copy, paste, and ship.";

const CATEGORY_DESCRIPTORS = {
  "Landing Pages": "Landing Page",
  Hero: "Three.js Template",
  "Three.js": "Three.js Component",
  "Motion Design": "Motion Design",
  Sections: "Web Section",
  Backgrounds: "WebGL Background",
  Buttons: "Animated Button",
  "Text Animation": "Text Animation",
  "UI Elements": "UI Component",
  CSS: "CSS Effect",
};

function compactText(value, maxLength) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const end = lastSpace > maxLength * 0.7 ? lastSpace : clipped.length;
  return `${clipped.slice(0, end).trim()}…`;
}

function brandedTitle(primary) {
  const suffix = " | ThreeUI";
  return `${compactText(primary, 62 - suffix.length)}${suffix}`;
}

function absoluteUrl(origin, path) {
  return new URL(path, `${origin}/`).href;
}

function absoluteMediaUrl(origin, path, mediaOptions) {
  return absoluteUrl(origin, resolvePublicMediaUrl(path, mediaOptions));
}

function catalogItems(catalog, origin) {
  return catalog.flatMap((shader) => {
    const variants = shader.variants?.length ? shader.variants : [undefined];
    return variants.map((variant) => ({
      "@type": "ListItem",
      position: 0,
      name: variant ? `${shader.label} — ${variant.label}` : shader.label,
      url: absoluteUrl(origin, shaderRoutePath(shader, variant?.id)),
    }));
  }).map((item, index) => ({ ...item, position: index + 1 }));
}

function faqPage(faqs, name, url) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    name,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildRouteSeo(route, origin, catalog = [], mediaOptions) {
  const defaultImage = absoluteMediaUrl(origin, "/thumbnails/threeui-intro.jpg", mediaOptions);
  const nonIndexableBrowseTag = route.page === "browse"
    && Boolean(route.browseTag)
    && !isIndexableBrowseTag(route.browseTag);
  const indexable = route.page !== "not-found"
    && route.page !== "capture"
    && route.page !== "designcode-claim"
    && route.page !== "oauth-consent"
    && route.page !== "purchaseSuccess"
    && !nonIndexableBrowseTag;
  let title = brandedTitle(SITE_TITLE);
  let description = SITE_DESCRIPTION;
  let canonicalPath = route.canonicalPath ?? STATIC_ROUTE_PATHS.browse;
  let image = defaultImage;
  let structuredData;

  if (route.page === "installation") {
    title = brandedTitle("Install ThreeUI for React");
    description = "Install @designcodeio/threeui, add the shared styles, check peer requirements, and verify your first interactive Three.js component.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Install ThreeUI for React",
      description,
      url: absoluteUrl(origin, canonicalPath),
      about: { "@type": "SoftwareApplication", name: "ThreeUI for React", applicationCategory: "DeveloperApplication" },
    };
  } else if (route.page === "mcp") {
    title = brandedTitle("ThreeUI MCP for Pro");
    description = "Connect the authenticated ThreeUI MCP to access every template, component, prompt, and source file with a verified Pro membership.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "ThreeUI MCP for Pro",
      description,
      url: absoluteUrl(origin, canonicalPath),
      about: { "@type": "SoftwareApplication", name: "ThreeUI MCP", applicationCategory: "DeveloperApplication" },
    };
  } else if (route.page === "pricing") {
    title = brandedTitle("ThreeUI Pro Pricing");
    description = "Compare ThreeUI Community, yearly Pro, and lifetime access for production-ready Three.js and WebGL components.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "ThreeUI Pro Pricing",
      description,
      url: absoluteUrl(origin, canonicalPath),
    };
  } else if (route.page === "purchaseSuccess") {
    title = brandedTitle("ThreeUI purchase status");
    description = "Verify a recent ThreeUI Pro purchase and activate access for the signed-in account.";
  } else if (route.page === "designcode-claim") {
    title = brandedTitle("Activate DesignCode Product Pass");
    description = "Activate a verified complimentary year of ThreeUI Pro from DesignCode Product Pass.";
  } else if (route.page === "sponsorship") {
    title = brandedTitle("Sponsor ThreeUI Community");
    description = "Support open-source ThreeUI with a linked GitHub README banner, website documentation placement, or a scoped integration partnership.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Sponsor ThreeUI Community",
      description,
      url: absoluteUrl(origin, canonicalPath),
    };
  } else if (route.page === "affiliates") {
    title = brandedTitle("Affiliate Program — Earn 50%");
    description = "Join the ThreeUI affiliate program and earn 50% of eligible referred revenue for up to 12 months with a 60-day attribution window.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "ThreeUI Affiliate Program",
      description,
      url: absoluteUrl(origin, canonicalPath),
      about: {
        "@type": "Organization",
        name: "ThreeUI",
        url: absoluteUrl(origin, "/"),
      },
    };
  } else if (route.page === "privacy") {
    title = brandedTitle("Privacy Policy");
    description = "Learn how ThreeUI handles account, checkout, analytics, and component usage data.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "ThreeUI Privacy Policy",
      description,
      url: absoluteUrl(origin, canonicalPath),
    };
  } else if (route.page === "terms") {
    title = brandedTitle("Terms of Use");
    description = "Review the ThreeUI terms for Community and Pro access, purchases, commercial use, and source distribution.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "ThreeUI Terms of Use",
      description,
      url: absoluteUrl(origin, canonicalPath),
    };
  } else if (route.page === "oauth-consent") {
    title = brandedTitle("Authorize MCP access");
    description = "Review and approve an MCP client's request to access your ThreeUI Pro catalog.";
  } else if ((route.page === "shader" || route.page === "capture") && route.shader) {
    const { shader, variant } = route;
    const descriptor = CATEGORY_DESCRIPTORS[shader.category] ?? "Interactive Component";
    const primary = variant
      ? `${variant.label} ${descriptor} — ${shader.label}`
      : `${shader.label} ${descriptor}`;
    title = brandedTitle(primary);
    description = compactText(variant?.description ?? shader.description, 160);
    canonicalPath = shaderRoutePath(shader, variant?.id);
    image = absoluteMediaUrl(origin, variant?.thumbnail ?? shader.thumbnail, mediaOptions);
    structuredData = route.page === "capture" ? undefined : {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: variant ? `${shader.label} — ${variant.label}` : shader.label,
      description,
      url: absoluteUrl(origin, canonicalPath),
      image,
      codeRepository: "https://github.com/MengTo/threeui",
      programmingLanguage: ["TypeScript", "JavaScript", "GLSL"],
      runtimePlatform: shader.runtime,
      isPartOf: {
        "@type": "CollectionPage",
        name: "ThreeUI",
        url: absoluteUrl(origin, STATIC_ROUTE_PATHS.browse),
      },
      ...(variant ? { isBasedOn: absoluteUrl(origin, shaderRoutePath(shader)) } : {}),
    };
  } else if (route.page === "not-found") {
    title = brandedTitle("Page Not Found");
    description = "The requested ThreeUI page could not be found. Browse the complete component collection instead.";
  } else {
    const browseCatalog = route.browseCategory
      ? catalog.filter((shader) => shader.category === route.browseCategory)
      : route.browseTag
        ? catalog.filter((shader) => shader.tags?.includes(route.browseTag))
        : catalog;
    const items = catalogItems(browseCatalog, origin);
    const browseContent = browseRouteContent(route, items.length);
    const browseFaqs = browseRouteFaqs(route);
    const browseUrl = absoluteUrl(origin, canonicalPath);
    title = brandedTitle(browseContent.title);
    description = browseContent.description;
    structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: browseContent.heading,
      description,
      url: browseUrl,
      hasPart: [
        { "@type": "TechArticle", name: "Installation", url: absoluteUrl(origin, STATIC_ROUTE_PATHS.installation) },
        { "@type": "TechArticle", name: "MCP", url: absoluteUrl(origin, STATIC_ROUTE_PATHS.mcp) },
        { "@type": "WebPage", name: "Pricing", url: absoluteUrl(origin, STATIC_ROUTE_PATHS.pricing) },
        { "@type": "WebPage", name: "Sponsorship", url: absoluteUrl(origin, STATIC_ROUTE_PATHS.sponsorship) },
        ...(browseFaqs.length > 0
          ? [faqPage(browseFaqs, `Frequently asked questions about ${browseContent.heading}`, browseUrl)]
          : []),
      ],
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items,
      },
    };
  }

  return {
    title,
    description,
    canonical: absoluteUrl(origin, canonicalPath),
    image,
    robots: indexable
      ? "index, follow, max-image-preview:large"
      : nonIndexableBrowseTag
        ? "noindex, follow"
        : "noindex, nofollow",
    structuredData,
  };
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
}

export function applyRouteSeo(route, catalog = []) {
  const seo = buildRouteSeo(route, window.location.origin, catalog);
  document.title = seo.title;
  upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: seo.robots });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "ThreeUI" });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: seo.canonical });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: seo.image });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: seo.image });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.append(canonical);
  }
  canonical.setAttribute("href", seo.canonical);

  let structuredData = document.head.querySelector("#threeui-structured-data");
  if (seo.structuredData) {
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "threeui-structured-data";
      structuredData.setAttribute("type", "application/ld+json");
      document.head.append(structuredData);
    }
    structuredData.textContent = JSON.stringify(seo.structuredData);
  } else {
    structuredData?.remove();
  }
}
