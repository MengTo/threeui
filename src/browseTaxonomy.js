const DEFAULT_BROWSE_CONTENT = Object.freeze({
  title: "Three.js Components, Templates & Interactive Shaders",
  heading: "Three.js components, templates and interactive shaders",
  description: "Browse copy-ready Three.js components, complete website templates, WebGL backgrounds, hero sections, UI effects, and source-backed variants.",
});

const CATEGORY_CONTENT = Object.freeze({
  "Landing Pages": Object.freeze({
    title: "Three.js Landing Page Templates",
    heading: "Three.js landing page templates",
    description: "Explore complete interactive Three.js website and landing page templates with responsive layouts, editable source, and production-ready motion.",
  }),
  Hero: Object.freeze({
    title: "Three.js Hero Sections & Templates",
    heading: "Three.js hero sections and templates",
    description: "Explore interactive Three.js hero sections with WebGL scenes, responsive layouts, editable source, and production-ready website templates.",
  }),
  "Three.js": Object.freeze({
    title: "Three.js Components",
    heading: "Three.js components",
    description: "Browse reusable Three.js components with interactive 3D scenes, customizable variants, responsive behavior, and copy-ready source code.",
  }),
  Backgrounds: Object.freeze({
    title: "Animated Three.js & WebGL Backgrounds",
    heading: "Animated Three.js and WebGL backgrounds",
    description: "Browse interactive Three.js and WebGL backgrounds, GLSL shader fields, particle systems, procedural scenes, and responsive visual effects.",
  }),
  Buttons: Object.freeze({
    title: "Animated Button Components",
    heading: "Animated button components",
    description: "Browse interactive button components with WebGL, Canvas, CSS, hover, loading, glow, liquid-metal, and tactile animation effects.",
  }),
  "Text Animation": Object.freeze({
    title: "Text Animation Components",
    heading: "Text animation components",
    description: "Browse reusable text animation components for headings, reveals, marquees, kinetic typography, shader type, and interactive website copy.",
  }),
  "UI Elements": Object.freeze({
    title: "Interactive UI Components",
    heading: "Interactive UI components",
    description: "Browse interactive UI components with polished motion, 3D details, Canvas and WebGL effects, responsive states, and copy-ready source.",
  }),
  CSS: Object.freeze({
    title: "CSS Effects & Components",
    heading: "CSS effects and components",
    description: "Browse customizable CSS effects and interface components with responsive layouts, hover states, animation, and production-ready source.",
  }),
  "Motion Design": Object.freeze({
    title: "Web Motion Design Components",
    heading: "Web motion design components",
    description: "Browse motion design components for interactive websites, including cinematic transitions, responsive animation, and production-ready source.",
  }),
});

const CATEGORY_FAQS = Object.freeze({
  "Landing Pages": Object.freeze([
    Object.freeze({
      question: "What is included in a Three.js landing page template?",
      answer: "Each template combines a complete page layout with its interactive Three.js or WebGL presentation, preview, and editable implementation source.",
    }),
    Object.freeze({
      question: "How is a landing page template different from a hero section?",
      answer: "A landing page template includes the wider page structure and content flow. A hero section focuses on the opening screen and can be added to an existing site.",
    }),
    Object.freeze({
      question: "Can I customize the template with a coding agent?",
      answer: "Yes. Use the source or copyable prompt as the starting point, then ask your coding agent to change the layout, colors, content, motion, and Three.js scene.",
    }),
    Object.freeze({
      question: "Are the Three.js templates responsive?",
      answer: "The templates are designed for responsive website layouts, but you should still test the final content, controls, and 3D performance on your target devices.",
    }),
  ]),
  Hero: Object.freeze([
    Object.freeze({
      question: "What is a Three.js hero section?",
      answer: "It is the opening section of a website with an interactive Three.js, WebGL, or shader-driven visual combined with real interface content and calls to action.",
    }),
    Object.freeze({
      question: "Can I use only the 3D background from a hero?",
      answer: "Many heroes separate the visual scene from the surrounding interface. Check the component source and variants to see whether the background can be reused on its own.",
    }),
    Object.freeze({
      question: "How do I keep a Three.js hero fast?",
      answer: "Control pixel ratio, geometry and particle counts, pause work when the scene is off-screen, and provide a reduced-motion or static fallback for constrained devices.",
    }),
    Object.freeze({
      question: "Can the hero match an existing brand system?",
      answer: "Yes. The source can be adapted to your typography, colors, spacing, copy, assets, lighting, camera, and motion while preserving the core interaction.",
    }),
  ]),
  "Three.js": Object.freeze([
    Object.freeze({
      question: "What is a Three.js component?",
      answer: "A Three.js component is a reusable 3D scene, interaction, or visual effect packaged so it can be adapted and added to a website without rebuilding the idea from scratch.",
    }),
    Object.freeze({
      question: "Do ThreeUI components require React?",
      answer: "Each item identifies its runtime and implementation source. Many can be adapted for React, Next.js, or vanilla JavaScript rather than locking the visual idea to one stack.",
    }),
    Object.freeze({
      question: "Can I customize the Three.js source code?",
      answer: "Yes. You can change scene parameters, materials, lighting, camera behavior, motion, responsive rules, and the surrounding interface to suit your project.",
    }),
    Object.freeze({
      question: "Which Three.js components are free?",
      answer: "Community components can be explored without Pro access. Premium items are marked Pro in the gallery so the access level is clear before you open one.",
    }),
  ]),
  Backgrounds: Object.freeze([
    Object.freeze({
      question: "What is a Three.js background?",
      answer: "It is a WebGL or Three.js scene designed to sit behind website content as an atmospheric, animated, or interactive visual layer.",
    }),
    Object.freeze({
      question: "How is a Three.js background different from a hero section?",
      answer: "A background is primarily the visual layer. A hero section combines that visual with a composed layout, navigation, copy, and calls to action.",
    }),
    Object.freeze({
      question: "Can these WebGL backgrounds sit behind normal HTML?",
      answer: "Yes. Keep the canvas in a background layer, preserve contrast for readable HTML, and prevent the visual from blocking links, buttons, or scrolling.",
    }),
    Object.freeze({
      question: "How should a Three.js background behave on mobile?",
      answer: "Use responsive camera and canvas sizing, lower expensive detail when needed, respect reduced-motion preferences, and provide a reliable static fallback.",
    }),
  ]),
  "UI Elements": Object.freeze([
    Object.freeze({
      question: "What are Three.js UI components for websites?",
      answer: "They are interface elements enhanced with Three.js, Canvas, or WebGL effects, such as interactive controls, visual feedback, navigation details, and animated product surfaces.",
    }),
    Object.freeze({
      question: "Are these components a WebXR or in-scene UI framework?",
      answer: "No. This collection focuses on website interfaces enhanced by 3D and GPU effects rather than a complete spatial interface system rendered inside a Three.js scene.",
    }),
    Object.freeze({
      question: "Can a Three.js UI effect remain accessible?",
      answer: "Yes. Keep real HTML semantics, keyboard focus, readable labels, and reduced-motion behavior, then use Three.js or WebGL as a progressive visual enhancement.",
    }),
    Object.freeze({
      question: "Can I use these UI components in React or Next.js?",
      answer: "Check each item’s runtime and source. The interaction and visual treatment can usually be integrated into a React or Next.js interface with project-specific adaptation.",
    }),
  ]),
});

// Keep tag URLs useful as browse filters without automatically asking search
// engines to index every internal catalog descriptor. This list is deliberately
// limited to distinct technologies and visual techniques with substantive
// collections; category synonyms belong to their dedicated category routes.
export const INDEXABLE_BROWSE_TAGS = Object.freeze([
  "3d",
  "canvas",
  "canvas2d",
  "crt",
  "flow field",
  "fluid",
  "glsl",
  "gsap",
  "halftone",
  "hover",
  "isometric",
  "noise",
  "parallax",
  "particles",
  "physics",
  "point cloud",
  "postprocessing",
  "procedural",
  "refraction",
  "scroll",
  "scrolltrigger",
  "shader",
  "shadermaterial",
  "tailwind",
  "typography",
  "webgl",
  "webgl2",
]);

const INDEXABLE_BROWSE_TAG_SET = new Set(INDEXABLE_BROWSE_TAGS);

const TOKEN_LABELS = Object.freeze({
  "2d": "2D",
  "3d": "3D",
  ai: "AI",
  api: "API",
  css: "CSS",
  glsl: "GLSL",
  gpu: "GPU",
  gsap: "GSAP",
  html: "HTML",
  js: "JS",
  mcp: "MCP",
  saas: "SaaS",
  svg: "SVG",
  "three.js": "Three.js",
  threejs: "Three.js",
  ui: "UI",
  ux: "UX",
  vr: "VR",
  webgl: "WebGL",
  webgl2: "WebGL2",
  xr: "XR",
});

export const BROWSE_CATEGORIES = Object.freeze(Object.keys(CATEGORY_CONTENT));

export function browseCategoryContent(category) {
  return CATEGORY_CONTENT[category] ?? DEFAULT_BROWSE_CONTENT;
}

export function browseRouteFaqs(route) {
  if (!route.browseCategory || route.browseTag) return [];
  return CATEGORY_FAQS[route.browseCategory] ?? [];
}

export function browseTagLabel(tag) {
  return tag
    .trim()
    .split(/\s+/)
    .map((token) => TOKEN_LABELS[token.toLowerCase()] ?? `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
    .join(" ");
}

export function isIndexableBrowseTag(tag) {
  return typeof tag === "string" && INDEXABLE_BROWSE_TAG_SET.has(tag.trim().toLowerCase());
}

export function browseTagContent(tag, resultCount = 0) {
  const label = browseTagLabel(tag);
  const countText = resultCount > 0 ? `${resultCount} ` : "";
  return {
    title: `${label} Components & Templates`,
    heading: `${label} components and templates`,
    description: `Explore ${countText}ThreeUI components, templates, backgrounds, and interactive effects tagged ${label}, with previews and editable implementation source.`,
  };
}

export function browseRouteContent(route, resultCount = 0) {
  if (route.browseTag) return browseTagContent(route.browseTag, resultCount);
  if (route.browseCategory) return browseCategoryContent(route.browseCategory);
  return DEFAULT_BROWSE_CONTENT;
}
