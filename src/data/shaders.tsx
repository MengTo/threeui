import { lazy, type ComponentType } from "react";
const CommunityRenderer1 = lazy(() => import("../shaders/landing-pages/LandingPages").then((module) => ({ default: module.KageLandingPage })));
const CommunityRenderer2 = lazy(() => import("../shaders/landing-pages/LandingPages").then((module) => ({ default: module.CompleteShelfLandingPage })));
const CommunityRenderer3 = lazy(() => import("../shaders/landing-pages/LandingPages").then((module) => ({ default: module.BestsellersBookShowcase })));
const CommunityRenderer4 = lazy(() => import("../shaders/landing-pages/LandingPages").then((module) => ({ default: module.SylvaHero })));
const CommunityRenderer5 = lazy(() => import("../shaders/landing-pages/LandingPages").then((module) => ({ default: module.MengToSketchbookLandingPage })));
import { PredictiveArcCanvas as CommunityRenderer6 } from "../shaders/predictive-arc/PredictiveArcCollection";
import { LiquidFormBackground as CommunityRenderer7 } from "../shaders/liquid-form/LiquidFormBackground";
const CommunityRenderer8 = lazy(() => import("../shaders/crt/CrtBackground").then((module) => ({ default: module.CrtBackground })));
const CommunityRenderer9 = lazy(() => import("../shaders/globe/GlobeCollection").then((module) => ({ default: module.GlobeCollection })));
const CommunityRenderer10 = lazy(() => import("../shaders/spark-badge/SparkBadge").then((module) => ({ default: module.SparkBadge })));
const CommunityRenderer11 = lazy(() => import("../shaders/stream-convergence/StreamConvergenceBackground").then((module) => ({ default: module.StreamConvergenceBackground })));
const CommunityRenderer12 = lazy(() => import("../shaders/bell-field/BellFieldBackground").then((module) => ({ default: module.BellFieldBackground })));
const CommunityRenderer13 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.FlowField })));
const CommunityRenderer14 = lazy(() => import("../shaders/elements/ElementsCollection").then((module) => ({ default: module.ElementsCollection })));
const CommunityRenderer15 = lazy(() => import("../shaders/elements/ElementsBackground").then((module) => ({ default: module.ElementsBackground })));
const CommunityRenderer16 = lazy(() => import("../shaders/condensation/CondensationBackground").then((module) => ({ default: module.CondensationBackground })));
const CommunityRenderer17 = lazy(() => import("../shaders/elements/GenerativeTree").then((module) => ({ default: module.GenerativeTree })));
const CommunityRenderer18 = lazy(() => import("../shaders/ribbon-field/RibbonFieldBackground").then((module) => ({ default: module.RibbonFieldBackground })));
const CommunityRenderer19 = lazy(() => import("../shaders/typography-vortex/TypographyVortexCanvas").then((module) => ({ default: module.TypographyVortexCanvas })));
const CommunityRenderer20 = lazy(() => import("../shaders/semantic-bloom/SemanticBloom").then((module) => ({ default: module.SemanticBloom })));
const CommunityRenderer21 = lazy(() => import("../shaders/text-path-studies/TextPathStudies").then((module) => ({ default: module.TextPathStudies })));
const CommunityRenderer22 = lazy(() => import("../shaders/text-path-studies/TextPathStudies").then((module) => ({ default: module.OutlineTypeflow })));
const CommunityRenderer23 = lazy(() => import("../shaders/text-path-studies/TextPathStudies").then((module) => ({ default: module.MorphingGlyphCloud })));
const CommunityRenderer24 = lazy(() => import("../shaders/text-path-studies/TextPathStudies").then((module) => ({ default: module.ClothStudy })));
const CommunityRenderer25 = lazy(() => import("../shaders/text-path-studies/TextPathStudies").then((module) => ({ default: module.RippleStudy })));
const CommunityRenderer26 = lazy(() => import("../shaders/text-path-studies/TextPathStudies").then((module) => ({ default: module.BallStudy })));
const CommunityRenderer27 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.ThreeUIIntro })));
const CommunityRenderer28 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.ParticleWordmark })));
const CommunityRenderer29 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.AudioWordmark })));
const CommunityRenderer30 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GalleryHeading })));
const CommunityRenderer31 = lazy(() => import("../shaders/shader-buttons/ShaderButtons").then((module) => ({ default: module.ShaderButtons })));
const CommunityRenderer32 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.IgnitionButton })));
const CommunityRenderer33 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.InductionButton })));
const CommunityRenderer34 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.PlasmaButton })));
const CommunityRenderer35 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.TactileButton })));
const CommunityRenderer36 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.ThinkingButton })));
const CommunityRenderer37 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.SlidingTextCta })));
const CommunityRenderer38 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.FloatingDotsCta })));
const CommunityRenderer39 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.LaunchButton })));
const CommunityRenderer40 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.DotBorderButton })));
const CommunityRenderer41 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GradientCta })));
const CommunityRenderer42 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.SpinningBorderButton })));
const CommunityRenderer43 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GlassmorphismCta })));
const CommunityRenderer44 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GenerateButton })));
const CommunityRenderer45 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GradientPillButton })));
const CommunityRenderer46 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GradientBeamCta })));
const CommunityRenderer47 = lazy(() => import("../shaders/rectangle-buttons/RectangleButtons").then((module) => ({ default: module.RectangleButtons })));
const CommunityRenderer48 = lazy(() => import("../shaders/circle-buttons/CircleButtons").then((module) => ({ default: module.CircleButtons })));
const CommunityRenderer49 = lazy(() => import("../shaders/liquid-metal-button/LiquidMetalButton").then((module) => ({ default: module.LiquidMetalButton })));
const CommunityRenderer50 = lazy(() => import("../shaders/lumen-cta/LumenCta").then((module) => ({ default: module.LumenCta })));
const CommunityRenderer51 = lazy(() => import("../shaders/section-elements/SectionElements").then((module) => ({ default: module.EditorialIntroSection })));
const CommunityRenderer52 = lazy(() => import("../shaders/section-elements/SectionElements").then((module) => ({ default: module.NewsletterFooterSection })));
const CommunityRenderer53 = lazy(() => import("../shaders/character-carousel/CharacterCarousel").then((module) => ({ default: module.CharacterCarousel })));
const CommunityRenderer54 = lazy(() => import("../shaders/character-carousel/CharacterCarousel").then((module) => ({ default: module.CharacterFilmstrip })));
const CommunityRenderer55 = lazy(() => import("../shaders/character-carousel/CharacterCarousel").then((module) => ({ default: module.CharacterWave })));
const CommunityRenderer56 = lazy(() => import("../shaders/gallery/Gallery").then((module) => ({ default: module.Gallery })));
const CommunityRenderer57 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.CloudField })));
const CommunityRenderer58 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.VoidField })));
const CommunityRenderer59 = lazy(() => import("../shaders/sylva-living-world/SylvaLivingWorldScene").then((module) => ({ default: module.SylvaLivingWorldScene })));
const CommunityRenderer60 = lazy(() => import("../shaders/temple-night/TempleNightScene").then((module) => ({ default: module.TempleNightScene })));
const CommunityRenderer61 = lazy(() => import("../shaders/landscape/LandscapeScene").then((module) => ({ default: module.LandscapeScene })));
const CommunityRenderer62 = lazy(() => import("../shaders/japanese-tower/JapaneseTowerLandscape").then((module) => ({ default: module.JapaneseTowerLandscape })));
const CommunityRenderer63 = lazy(() => import("../shaders/bookshelf/BookshelfScene").then((module) => ({ default: module.BookshelfScene })));
const CommunityRenderer64 = lazy(() => import("../shaders/structure-flow/StructureFlowCollection").then((module) => ({ default: module.StructureFlowCollection })));
const CommunityRenderer65 = lazy(() => import("../shaders/emerald-horizon/EmeraldHorizonBackground").then((module) => ({ default: module.EmeraldHorizonBackground })));
const CommunityRenderer66 = lazy(() => import("../shaders/orbital-sphere/OrbitalSphereBackground").then((module) => ({ default: module.OrbitalSphereBackground })));
const CommunityRenderer67 = lazy(() => import("../shaders/dot-matrix/DotMatrixBackground").then((module) => ({ default: module.DotMatrixBackground })));
const CommunityRenderer68 = lazy(() => import("../shaders/warp-field/WarpFieldBackground").then((module) => ({ default: module.WarpFieldBackground })));
const CommunityRenderer69 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.ExpanseField })));
const CommunityRenderer70 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.LogicCoreField })));
const CommunityRenderer71 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.DimensionalField })));
const CommunityRenderer72 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.DataField })));
const CommunityRenderer73 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.TopologyField })));
const CommunityRenderer74 = lazy(() => import("../shaders/neuform-isolated/NeuformCraftEffects").then((module) => ({ default: module.HalftoneFlow })));
const CommunityRenderer75 = lazy(() => import("../shaders/neuform-isolated/NeuformCraftEffects").then((module) => ({ default: module.NeonTypography })));
const CommunityRenderer76 = lazy(() => import("../shaders/neuform-isolated/NeuformCraftEffects").then((module) => ({ default: module.EngravedCertificate })));
const CommunityRenderer77 = lazy(() => import("../shaders/woven-cloth/WovenCloth").then((module) => ({ default: module.WovenCloth })));
const CommunityRenderer78 = lazy(() => import("../shaders/neuform-isolated/NeuformCraftEffects").then((module) => ({ default: module.NebulaBackground })));
const CommunityRenderer79 = lazy(() => import("../shaders/neuform-isolated/NeuformCraftEffects").then((module) => ({ default: module.FluidFieldBackground })));
const CommunityRenderer80 = lazy(() => import("../shaders/neuform-isolated/NeuformCraftEffects").then((module) => ({ default: module.EmberStorm })));
const CommunityRenderer81 = lazy(() => import("../shaders/neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.PerformanceGauges })));
const CommunityRenderer82 = lazy(() => import("../shaders/uplink-loader/UplinkLoader").then((module) => ({ default: module.UplinkLoader })));
const CommunityRenderer83 = lazy(() => import("../shaders/koi-studies/KoiStudies").then((module) => ({ default: module.KoiStudies })));
const CommunityRenderer84 = lazy(() => import("../shaders/article-headings/TextAnimationCollection").then((module) => ({ default: module.TextAnimationCollection })));
const CommunityRenderer85 = lazy(() => import("../shaders/animated-top-dock/AnimatedTopDock").then((module) => ({ default: module.AnimatedTopDock })));
const CommunityRenderer86 = lazy(() => import("../shaders/sketchbook/Sketchbook").then((module) => ({ default: module.Sketchbook })));
const CommunityRenderer87 = lazy(() => import("../shaders/constellation-field/ConstellationField").then((module) => ({ default: module.ConstellationField })));
const CommunityRenderer88 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.ParticleDrift })));
const CommunityRenderer89 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.ParticleNetwork })));
const CommunityRenderer90 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.FluxVortex })));
const CommunityRenderer91 = lazy(() => import("../shaders/portal-field/PortalFieldCollection").then((module) => ({ default: module.PortalFieldCollection })));
const CommunityRenderer92 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.AmberHalftone })));
const CommunityRenderer93 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.DiagnosticsPanel })));
const CommunityRenderer94 = lazy(() => import("../shaders/skeuomorphic-toggle/SkeuomorphicToggleCollection").then((module) => ({ default: module.SkeuomorphicToggleCollection })));
const CommunityRenderer95 = lazy(() => import("../shaders/laser/LaserCollection").then((module) => ({ default: module.LaserCollection })));
const CommunityRenderer96 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.GatewayFlow })));
const CommunityRenderer97 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.ConnectivityGraph })));
const CommunityRenderer98 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.InterfaceLines })));
const CommunityRenderer99 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.WireframeForms })));
const CommunityRenderer100 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.DefenseLines })));
const CommunityRenderer101 = lazy(() => import("../shaders/neuform-isolated/NeuformBatchEffects").then((module) => ({ default: module.TopoField })));
const CommunityRenderer102 = lazy(() => import("../shaders/brand-orbs/BrandOrbs").then((module) => ({ default: module.BrandOrbs })));

export type ContractRow = { name: string; type: string; value: string };
export type RangeControl = { kind?: "range"; key: string; label: string; min: number; max: number; step: number; digits: number; default: number };
export type ChoiceControl = { kind: "choice"; key: string; label: string; options: readonly { value: string; label: string }[]; default: string };
export type CheckpointControl = { kind: "checkpoint"; key: string; label: string; options: readonly { value: string; label: string }[]; default: string };
export type ColorControl = { kind: "color"; key: string; label: string; default: `#${string}` };
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
  { ...{
    "id": "kage-landing-page",
    "tags": [
      "landing page",
      "full html",
      "website",
      "kage",
      "japanese",
      "temple",
      "garden",
      "cinematic",
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "scroll",
      "night",
      "lanterns",
      "sakura",
      "interactive",
      "responsive",
      "dark mode"
    ],
    "category": "Landing Pages",
    "label": "Kage",
    "thumbnail": "https://threeui.com/thumbnails/kage-landing-page.jpg",
    "description": "The complete authored Kage temple experience, preserved as an interactive full-page document with its original navigation, scroll scenes, and local Three.js world.",
    "runtime": "Full HTML + DOM/CSS + Three.js",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 c8e06b90397a",
    "sourceFiles": [
      "src/shaders/landing-pages/LandingPages.tsx",
      "public/landing-pages/kage.html — complete page with audio removed",
      "public/landing-pages/secret-pathways-assets/fonts.css",
      "public/landing-pages/secret-pathways-assets/three.min.js"
    ],
    "passes": "1 sandboxed full-document renderer",
    "interaction": "Original pointer, keyboard, scroll, and navigation interactions",
    "asset": "Fourteen local WebP scene layers",
    "assetCount": 14,
    "importName": "KageLandingPage",
    "controls": [
      {
        "kind": "checkpoint",
        "key": "headingFont",
        "label": "Heading font",
        "default": "onest",
        "options": [
          {
            "value": "onest",
            "label": "Onest"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "geist",
            "label": "Geist"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyFont",
        "label": "Body font",
        "default": "onest",
        "options": [
          {
            "value": "onest",
            "label": "Onest"
          },
          {
            "value": "geist",
            "label": "Geist"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "headingWeight",
        "label": "Heading weight",
        "default": "400",
        "options": [
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          },
          {
            "value": "700",
            "label": "Bold · 700"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyWeight",
        "label": "Body weight",
        "default": "300",
        "options": [
          {
            "value": "300",
            "label": "Light · 300"
          },
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          }
        ]
      },
      {
        "kind": "color",
        "key": "primaryColor",
        "label": "Primary color",
        "default": "#e0231c"
      },
      {
        "key": "headingSize",
        "label": "Heading size",
        "min": 30,
        "max": 72,
        "step": 1,
        "digits": 0,
        "default": 46
      },
      {
        "key": "bodySize",
        "label": "Body size",
        "min": 13,
        "max": 24,
        "step": 1,
        "digits": 0,
        "default": 17
      },
      {
        "key": "headingLetterSpacing",
        "label": "Heading tracking",
        "min": -0.06,
        "max": 0.12,
        "step": 0.001,
        "digits": 3,
        "default": -0.012
      }
    ],
    "contract": [
      {
        "name": "document",
        "type": "fixed",
        "value": "Complete packaged kage.html with audio removed"
      },
      {
        "name": "sourceUrl",
        "type": "fixed",
        "value": "/landing-pages/kage.html"
      },
      {
        "name": "headingFont",
        "type": "optional",
        "value": "Onest | Instrument Serif | Newsreader | Geist"
      },
      {
        "name": "bodyFont",
        "type": "optional",
        "value": "Onest | Geist | Newsreader | Instrument Serif"
      },
      {
        "name": "headingWeight",
        "type": "optional",
        "value": "400 | 500 | 600 | 700"
      },
      {
        "name": "bodyWeight",
        "type": "optional",
        "value": "300 | 400 | 500 | 600"
      },
      {
        "name": "primaryColor",
        "type": "optional",
        "value": "Hex color — the vermilion accent and the ember tint it drives"
      },
      {
        "name": "typography",
        "type": "optional",
        "value": "Heading size 30–72px ceiling + body size + heading tracking"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Original full landing page inside the preview frame"
      },
      {
        "name": "interaction",
        "type": "original",
        "value": "Scroll + pointer + keyboard"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "14 local binary assets + local fonts and Three.js runtime"
      }
    ]
  }, component: CommunityRenderer1 },
  { ...{
    "id": "complete-shelf-landing-page",
    "tags": [
      "landing page",
      "full html",
      "website",
      "hero",
      "bookshelf",
      "books",
      "working volumes",
      "editorial",
      "portfolio",
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "tools",
      "carousel",
      "interactive",
      "responsive"
    ],
    "category": "Hero",
    "label": "Complete Shelf",
    "thumbnail": "https://threeui.com/thumbnails/complete-shelf-landing-page.jpg",
    "description": "The complete Working Volumes bookshelf page with all seven tools, its responsive editorial interface, and authored Three.js presentation.",
    "runtime": "Full HTML + DOM/CSS + Three.js r165",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 606f200fed86",
    "sourceFiles": [
      "src/shaders/landing-pages/LandingPages.tsx",
      "public/landing-pages/complete-shelf-v2.html — byte-exact complete page"
    ],
    "passes": "1 sandboxed full-document renderer",
    "interaction": "Original pointer, keyboard, scroll, navigation, and book interactions",
    "asset": "All visual and media data remains embedded in the original HTML",
    "assetCount": 0,
    "importName": "CompleteShelfLandingPage",
    "controls": [
      {
        "kind": "checkpoint",
        "key": "headingFont",
        "label": "Heading font",
        "default": "iowan-old-style",
        "options": [
          {
            "value": "iowan-old-style",
            "label": "Iowan Old Style"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "geist",
            "label": "Geist"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyFont",
        "label": "Body font",
        "default": "inter",
        "options": [
          {
            "value": "inter",
            "label": "Inter"
          },
          {
            "value": "geist",
            "label": "Geist"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "headingWeight",
        "label": "Heading weight",
        "default": "400",
        "options": [
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyWeight",
        "label": "Body weight",
        "default": "400",
        "options": [
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          }
        ]
      },
      {
        "kind": "color",
        "key": "primaryColor",
        "label": "Primary color",
        "default": "#c87046"
      },
      {
        "key": "headingSize",
        "label": "Heading size",
        "min": 32,
        "max": 88,
        "step": 1,
        "digits": 0,
        "default": 60
      },
      {
        "key": "bodySize",
        "label": "Body size",
        "min": 10,
        "max": 18,
        "step": 1,
        "digits": 0,
        "default": 12
      },
      {
        "key": "headingLetterSpacing",
        "label": "Heading tracking",
        "min": -0.1,
        "max": 0.08,
        "step": 0.001,
        "digits": 3,
        "default": -0.055
      }
    ],
    "contract": [
      {
        "name": "document",
        "type": "fixed",
        "value": "Complete original complete-shelf-v2.html, byte-for-byte"
      },
      {
        "name": "sourceUrl",
        "type": "fixed",
        "value": "/landing-pages/complete-shelf-v2.html"
      },
      {
        "name": "headingFont",
        "type": "optional",
        "value": "Iowan Old Style | Instrument Serif | Newsreader | Geist"
      },
      {
        "name": "bodyFont",
        "type": "optional",
        "value": "Inter | Geist | Newsreader | Instrument Serif"
      },
      {
        "name": "headingWeight",
        "type": "optional",
        "value": "400 | 500 | 600"
      },
      {
        "name": "bodyWeight",
        "type": "optional",
        "value": "400 | 500 | 600"
      },
      {
        "name": "primaryColor",
        "type": "optional",
        "value": "Hex color"
      },
      {
        "name": "typography",
        "type": "optional",
        "value": "Heading size + body size + heading letter spacing"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Original full landing page inside the preview frame"
      },
      {
        "name": "interaction",
        "type": "original",
        "value": "Scroll + pointer + keyboard + book controls"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Original embedded media"
      }
    ]
  }, component: CommunityRenderer2 },
  { ...{
    "id": "bestsellers-book-showcase",
    "tags": [
      "landing page",
      "full html",
      "website",
      "hero",
      "books",
      "bestsellers",
      "field manuals",
      "editorial",
      "showcase",
      "typography",
      "video",
      "media",
      "scroll",
      "interactive",
      "responsive"
    ],
    "category": "Hero",
    "label": "Bestsellers Book Showcase",
    "thumbnail": "https://threeui.com/thumbnails/bestsellers-book-showcase.jpg",
    "description": "The complete Field Manuals book showcase, preserved unchanged with its editorial layout, authored motion, interactions, and embedded media.",
    "runtime": "Full HTML + DOM/CSS + embedded media",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 7c1ed1ca4a4c",
    "sourceFiles": [
      "src/shaders/landing-pages/LandingPages.tsx",
      "public/landing-pages/bestsellers-book-showcase.html — byte-exact complete page"
    ],
    "passes": "1 sandboxed full-document renderer",
    "interaction": "Original pointer, keyboard, scroll, navigation, and showcase interactions",
    "asset": "All visual and video data remains embedded in the original HTML",
    "assetCount": 0,
    "importName": "BestsellersBookShowcase",
    "controls": [
      {
        "kind": "checkpoint",
        "key": "headingFont",
        "label": "Heading font",
        "default": "iowan-old-style",
        "options": [
          {
            "value": "iowan-old-style",
            "label": "Iowan Old Style"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "geist",
            "label": "Geist"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyFont",
        "label": "Body font",
        "default": "iowan-old-style",
        "options": [
          {
            "value": "iowan-old-style",
            "label": "Iowan Old Style"
          },
          {
            "value": "geist",
            "label": "Geist"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "headingWeight",
        "label": "Heading weight",
        "default": "500",
        "options": [
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          },
          {
            "value": "700",
            "label": "Bold · 700"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyWeight",
        "label": "Body weight",
        "default": "400",
        "options": [
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          },
          {
            "value": "700",
            "label": "Bold · 700"
          }
        ]
      },
      {
        "kind": "color",
        "key": "primaryColor",
        "label": "Primary color",
        "default": "#c3a47b"
      },
      {
        "key": "headingSize",
        "label": "Heading size",
        "min": 184,
        "max": 420,
        "step": 1,
        "digits": 0,
        "default": 325
      },
      {
        "key": "bodySize",
        "label": "Body size",
        "min": 12,
        "max": 24,
        "step": 1,
        "digits": 0,
        "default": 17
      },
      {
        "key": "headingLetterSpacing",
        "label": "Heading tracking",
        "min": -0.12,
        "max": 0.08,
        "step": 0.001,
        "digits": 3,
        "default": -0.085
      }
    ],
    "contract": [
      {
        "name": "document",
        "type": "fixed",
        "value": "Complete original bestsellers-book-showcase.html, byte-for-byte"
      },
      {
        "name": "sourceUrl",
        "type": "fixed",
        "value": "/landing-pages/bestsellers-book-showcase.html"
      },
      {
        "name": "headingFont",
        "type": "optional",
        "value": "Iowan Old Style | Instrument Serif | Newsreader | Geist"
      },
      {
        "name": "bodyFont",
        "type": "optional",
        "value": "Iowan Old Style | Geist | Newsreader | Instrument Serif"
      },
      {
        "name": "headingWeight",
        "type": "optional",
        "value": "400 | 500 | 600 | 700"
      },
      {
        "name": "bodyWeight",
        "type": "optional",
        "value": "400 | 500 | 600 | 700"
      },
      {
        "name": "primaryColor",
        "type": "optional",
        "value": "Hex color"
      },
      {
        "name": "typography",
        "type": "optional",
        "value": "Heading size + body size + heading letter spacing"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Original full landing page inside the preview frame"
      },
      {
        "name": "interaction",
        "type": "original",
        "value": "Scroll + pointer + keyboard + media controls"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Original embedded media"
      }
    ]
  }, component: CommunityRenderer3 },
  { ...{
    "id": "sylva-hero",
    "tags": [
      "landing page",
      "full html",
      "website",
      "hero",
      "sylva",
      "living world",
      "nature",
      "moss",
      "forest",
      "roots",
      "green",
      "organic",
      "growth",
      "liquid metal",
      "button",
      "cta",
      "cards",
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "procedural",
      "dusk",
      "dark mode",
      "pointer",
      "interactive",
      "responsive"
    ],
    "category": "Hero",
    "label": "Sylva",
    "thumbnail": "https://threeui.com/thumbnails/sylva-hero.jpg",
    "description": "The complete Sylva Living Green page, preserved with its Three.js scene, local typography, card imagery, and embedded liquid-metal buttons. The moss-root world with pale flowers, ferns, drifting pollen, the landing butterfly, and native liquid-metal controls behind the full hero layout.",
    "runtime": "Full HTML + DOM/CSS + local Three.js",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 05f359ce157a",
    "sourceFiles": [
      "src/shaders/landing-pages/LandingPages.tsx",
      "public/landing-pages/inner-green-3d.html — complete page with native controls"
    ],
    "passes": "1 sandboxed full-document renderer",
    "interaction": "Original pointer, hover, scroll, and responsive scaling",
    "asset": "Four local assets are packaged at their authored relative paths; the page makes no external request",
    "assetCount": 4,
    "importName": "SylvaHero",
    "controls": [
      {
        "kind": "checkpoint",
        "key": "headingFont",
        "label": "Heading font",
        "default": "lexend",
        "options": [
          {
            "value": "lexend",
            "label": "Lexend"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "geist",
            "label": "Geist"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyFont",
        "label": "Body font",
        "default": "lexend",
        "options": [
          {
            "value": "lexend",
            "label": "Lexend"
          },
          {
            "value": "geist",
            "label": "Geist"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "headingWeight",
        "label": "Heading weight",
        "default": "300",
        "options": [
          {
            "value": "200",
            "label": "ExtraLight · 200"
          },
          {
            "value": "300",
            "label": "Light · 300"
          },
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyWeight",
        "label": "Body weight",
        "default": "300",
        "options": [
          {
            "value": "200",
            "label": "ExtraLight · 200"
          },
          {
            "value": "300",
            "label": "Light · 300"
          },
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          }
        ]
      },
      {
        "kind": "color",
        "key": "primaryColor",
        "label": "Primary color",
        "default": "#ffffff"
      },
      {
        "key": "headingSize",
        "label": "Heading size",
        "min": 40,
        "max": 92,
        "step": 1,
        "digits": 0,
        "default": 63
      },
      {
        "key": "bodySize",
        "label": "Body size",
        "min": 12,
        "max": 24,
        "step": 0.1,
        "digits": 1,
        "default": 16.5
      },
      {
        "key": "headingLetterSpacing",
        "label": "Heading tracking",
        "min": -0.06,
        "max": 0.12,
        "step": 0.001,
        "digits": 3,
        "default": -0.006
      }
    ],
    "contract": [
      {
        "name": "document",
        "type": "fixed",
        "value": "Complete inner-green-3d.html with native in-document controls"
      },
      {
        "name": "sourceUrl",
        "type": "fixed",
        "value": "/landing-pages/inner-green-3d.html"
      },
      {
        "name": "variant",
        "type": "fixed",
        "value": "Living Green"
      },
      {
        "name": "headingFont",
        "type": "optional",
        "value": "Lexend | Instrument Serif | Newsreader | Geist"
      },
      {
        "name": "bodyFont",
        "type": "optional",
        "value": "Lexend | Geist | Newsreader | Instrument Serif"
      },
      {
        "name": "headingWeight",
        "type": "optional",
        "value": "200 | 300 | 400 | 500 | 600"
      },
      {
        "name": "bodyWeight",
        "type": "optional",
        "value": "200 | 300 | 400 | 500"
      },
      {
        "name": "primaryColor",
        "type": "optional",
        "value": "Hex color — the hero ink and the two tints derived from it"
      },
      {
        "name": "typography",
        "type": "optional",
        "value": "Heading size 40–92u + body size + heading tracking, on the page's own design unit"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Original full landing page inside the preview frame"
      },
      {
        "name": "interaction",
        "type": "original",
        "value": "Scroll + pointer + hover"
      },
      {
        "name": "assets",
        "type": "local",
        "value": "inner-green-assets kept at its authored relative path; no external request"
      }
    ],
    "variants": [
      {
        "id": "living-green",
        "label": "Living Green",
        "description": "The moss-root world with pale flowers, ferns, drifting pollen, the landing butterfly, and native liquid-metal controls behind the full hero layout.",
        "thumbnail": "https://threeui.com/thumbnails/sylva-hero.jpg",
        "preview": "https://threeui.com/previews/sylva-hero.webm",
        "props": {
          "variant": "living-green"
        }
      }
    ]
  }, component: CommunityRenderer4 },
  { ...{
    "id": "meng-to-sketchbook-landing-page",
    "tags": [
      "landing page",
      "full html",
      "website",
      "meng to",
      "portfolio",
      "personal",
      "sketchbook",
      "singapore",
      "illustration",
      "editorial",
      "paper",
      "botanical",
      "page turn",
      "page curl",
      "magnifier",
      "zoom",
      "drag",
      "pointer tilt",
      "typography",
      "instrument serif",
      "newsreader",
      "local assets",
      "light mode",
      "pointer",
      "scroll",
      "keyboard",
      "interactive",
      "responsive"
    ],
    "category": "Landing Pages",
    "label": "Sketchbook",
    "thumbnail": "https://threeui.com/thumbnails/meng-to-sketchbook-landing-page.jpg",
    "description": "A tactile personal portfolio built as a Singapore sketchbook, with nine illustrated plates, curled page turns, a draggable magnifying glass, zoom controls, a botanical paper atmosphere, and an editorial index.",
    "runtime": "Full HTML + DOM/CSS + JavaScript",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 e0330548b1ac",
    "sourceFiles": [
      "src/shaders/landing-pages/LandingPages.tsx",
      "src/shaders/landing-pages/pageTypography.ts",
      "src/shaders/landing-pages/pageRecipes.ts",
      "public/landing-pages/meng-to-sketchbook.html — byte-exact complete page",
      "public/landing-pages/meng-to-sketchbook/ — 17 local image and font assets"
    ],
    "passes": "1 sandboxed full-document renderer",
    "interaction": "Original page turns, pointer tilt, draggable magnifier, zoom controls, navigation, scroll, keyboard, and responsive layout",
    "asset": "Fourteen local paper, botanical, and Singapore illustration images plus three local variable and display fonts",
    "assetCount": 17,
    "importName": "MengToSketchbookLandingPage",
    "controls": [
      {
        "kind": "checkpoint",
        "key": "headingFont",
        "label": "Heading font",
        "default": "instrument-serif",
        "options": [
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          },
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "geist",
            "label": "Geist"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyFont",
        "label": "Body font",
        "default": "newsreader",
        "options": [
          {
            "value": "newsreader",
            "label": "Newsreader"
          },
          {
            "value": "geist",
            "label": "Geist"
          },
          {
            "value": "instrument-serif",
            "label": "Instrument Serif"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "headingWeight",
        "label": "Heading weight",
        "default": "400",
        "options": [
          {
            "value": "300",
            "label": "Light · 300"
          },
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          }
        ]
      },
      {
        "kind": "checkpoint",
        "key": "bodyWeight",
        "label": "Body weight",
        "default": "400",
        "options": [
          {
            "value": "200",
            "label": "ExtraLight · 200"
          },
          {
            "value": "300",
            "label": "Light · 300"
          },
          {
            "value": "400",
            "label": "Regular · 400"
          },
          {
            "value": "500",
            "label": "Medium · 500"
          },
          {
            "value": "600",
            "label": "Semibold · 600"
          }
        ]
      },
      {
        "kind": "color",
        "key": "primaryColor",
        "label": "Primary color",
        "default": "#2b2721"
      },
      {
        "key": "headingSize",
        "label": "Heading size",
        "min": 20,
        "max": 48,
        "step": 1,
        "digits": 0,
        "default": 30
      },
      {
        "key": "bodySize",
        "label": "Body size",
        "min": 14,
        "max": 30,
        "step": 1,
        "digits": 0,
        "default": 20
      },
      {
        "key": "headingLetterSpacing",
        "label": "Heading tracking",
        "min": -0.06,
        "max": 0.12,
        "step": 0.001,
        "digits": 3,
        "default": 0.01
      }
    ],
    "contract": [
      {
        "name": "document",
        "type": "fixed",
        "value": "Complete original meng-to-sketchbook.html, byte-for-byte"
      },
      {
        "name": "sourceUrl",
        "type": "fixed",
        "value": "/landing-pages/meng-to-sketchbook.html"
      },
      {
        "name": "headingFont",
        "type": "optional",
        "value": "Instrument Serif | Newsreader | Geist"
      },
      {
        "name": "bodyFont",
        "type": "optional",
        "value": "Newsreader | Geist | Instrument Serif"
      },
      {
        "name": "headingWeight",
        "type": "optional",
        "value": "300 | 400 | 500 | 600"
      },
      {
        "name": "bodyWeight",
        "type": "optional",
        "value": "200 | 300 | 400 | 500 | 600"
      },
      {
        "name": "primaryColor",
        "type": "optional",
        "value": "Hex color — page ink and its opacity tints; the warm earth accent remains authored"
      },
      {
        "name": "typography",
        "type": "optional",
        "value": "Nameplate and plate-title scale + body scale + heading tracking"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Original full landing page inside the preview frame"
      },
      {
        "name": "interaction",
        "type": "original",
        "value": "Page turns + magnifier drag + zoom + pointer tilt + scroll + keyboard"
      },
      {
        "name": "assets",
        "type": "local",
        "value": "17 packaged files in public/landing-pages/meng-to-sketchbook/; no network request"
      }
    ]
  }, component: CommunityRenderer5 },
  { ...{
    "id": "predictive-arc",
    "tags": [
      "canvas",
      "canvas2d",
      "webgl",
      "threejs",
      "three.js",
      "glsl",
      "shader",
      "background",
      "pixels",
      "pixel art",
      "pixel grid",
      "arch",
      "horizon",
      "violet",
      "emerald",
      "glow",
      "signals",
      "particles",
      "network",
      "pulses",
      "override grid",
      "telemetry",
      "orange",
      "ribbon",
      "waves",
      "dot matrix",
      "cyan",
      "indigo",
      "purple",
      "void",
      "transparent",
      "halftone",
      "amber",
      "dots",
      "flow field",
      "red",
      "variants",
      "light mode",
      "dark mode",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Predictive Arc",
    "thumbnail": "https://threeui.com/thumbnails/predictive-arc.jpg",
    "description": "Eight animated arc, signal, ribbon, void, and halftone scenes collected in one Canvas 2D, raw-WebGL, and Three.js family.",
    "runtime": "Canvas 2D + Raw WebGL + Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 fa86582fc870",
    "sourceFiles": [
      "Axiom---Predictive-Search-Engine (3).html — predictive arc source",
      "Axiom-Dynamic-Data-Orchestration.html — data pixel arc source",
      "src/shaders/predictive-arc/predictiveArcRenderer.ts",
      "src/shaders/data-pixel-arc/dataPixelArcRenderer.ts",
      "src/shaders/neuform-isolated/sources/signal-particles.html",
      "src/shaders/neuform-isolated/sources/override-grid.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx",
      "src/shaders/ribbon-field/RibbonFieldBackground.tsx",
      "src/shaders/ribbon-field/ribbonFieldShaders.ts",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
      "src/shaders/neuform-isolated/sources/void-protocol.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx",
      "src/shaders/neuform-isolated/sources/nexus-unified-flow.html",
      "src/shaders/neuform-isolated/sources/amber-halftone.html",
      "src/shaders/predictive-arc/PredictiveArcCollection.tsx",
      "src/shaders/predictive-arc/PredictiveArcCanvas.tsx"
    ],
    "passes": "1 selected Canvas 2D, raw-WebGL, or Three.js field pass",
    "interaction": "Variant selection plus customizable mode, speed, color, and brightness",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "PredictiveArcCanvas",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Canvas 2D + Raw WebGL + Three.js"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Predictive + Data Pixel + Signal + Override + Ribbon + Void + Halftone Flow + Amber Halftone"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.6,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "predictive",
        "label": "Predictive Arc",
        "description": "The violet predictive pixel arch with a luminous animated core.",
        "thumbnail": "https://threeui.com/thumbnails/predictive-arc.jpg",
        "preview": "https://threeui.com/previews/predictive-arc.webm",
        "props": {}
      },
      {
        "id": "data-pixel",
        "label": "Data Pixel Arc",
        "description": "An emerald pixel horizon with an organic breathing band.",
        "thumbnail": "https://threeui.com/thumbnails/data-pixel-arc.jpg",
        "preview": "https://threeui.com/previews/data-pixel-arc.webm",
        "props": {
          "variant": "data-pixel"
        }
      },
      {
        "id": "signal-particles",
        "label": "Signal Particles",
        "description": "A dark signal-particle field with soft connective pulses.",
        "thumbnail": "https://threeui.com/thumbnails/signal-particles.jpg",
        "preview": "https://threeui.com/previews/signal-particles.webm",
        "props": {
          "variant": "signal-particles"
        }
      },
      {
        "id": "override-grid",
        "label": "Override Grid",
        "description": "A block-by-block override grid with telemetry-orange accents.",
        "thumbnail": "https://threeui.com/thumbnails/override-grid.jpg",
        "preview": "https://threeui.com/previews/override-grid.webm",
        "props": {
          "variant": "override-grid",
          "size": 48,
          "gap": 2
        }
      },
      {
        "id": "ribbon-field",
        "label": "Ribbon Field",
        "description": "A cyan, indigo, and purple WebGL ribbon field resolved through an animated dot matrix.",
        "thumbnail": "https://threeui.com/thumbnails/ribbon-field.jpg",
        "preview": "https://threeui.com/previews/ribbon-field.webm",
        "props": {
          "variant": "ribbon-field"
        }
      },
      {
        "id": "void-field",
        "label": "Void Field",
        "description": "A transparent raw-WebGL void field detached from its original article composition.",
        "thumbnail": "https://threeui.com/thumbnails/void-field.jpg",
        "preview": "https://threeui.com/previews/void-field.webm",
        "props": {
          "variant": "void-field"
        }
      },
      {
        "id": "halftone-flow",
        "label": "Halftone Flow",
        "description": "A red-orange raw-WebGL flow field resolved through its authored six-pixel halftone matrix.",
        "thumbnail": "https://threeui.com/thumbnails/halftone-flow.jpg",
        "preview": "https://threeui.com/previews/halftone-flow.webm",
        "props": {
          "variant": "halftone-flow"
        }
      },
      {
        "id": "amber-halftone",
        "label": "Amber Halftone",
        "description": "An animated amber-to-white Three.js point field on a dark plane.",
        "thumbnail": "https://threeui.com/thumbnails/amber-halftone.jpg",
        "preview": "https://threeui.com/previews/amber-halftone.webm",
        "props": {
          "variant": "amber-halftone"
        }
      }
    ]
  }, component: CommunityRenderer6 },
  { ...{
    "id": "liquid-form",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "ray marching",
      "raymarching",
      "3d",
      "liquid",
      "metallic",
      "reflections",
      "pointer",
      "interactive"
    ],
    "category": "Backgrounds",
    "label": "Liquid Form",
    "thumbnail": "https://threeui.com/thumbnails/liquid-form.jpg",
    "description": "A centered silver ray-marched liquid form with authored studio reflections and pointer-responsive camera drift.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 acc0cbacb914",
    "sourceFiles": [
      "V-E-L-O-X-Quantum-Engineered.html — WebGL background",
      "src/shaders/liquid-form/liquidFormShaders.ts",
      "src/shaders/liquid-form/LiquidFormBackground.tsx"
    ],
    "passes": "1 raw WebGL ray-march pass",
    "interaction": "Smoothed pointer look-at plus customizable material, morph, and tint",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "LiquidFormBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Raw WebGL"
      },
      {
        "name": "steps",
        "type": "fixed",
        "value": "70"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 1.5"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "morph",
        "label": "Morph",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "noiseScale",
        "label": "Noise scale",
        "min": 0.4,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "mouseAmount",
        "label": "Pointer",
        "min": 0,
        "max": 0.4,
        "step": 0.01,
        "digits": 2,
        "default": 0.15
      },
      {
        "key": "metal",
        "label": "Metal",
        "min": 0.3,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "camera",
        "label": "Camera",
        "min": 4,
        "max": 7,
        "step": 0.1,
        "digits": 1,
        "default": 5.5
      },
      {
        "key": "tintHue",
        "label": "Tint hue",
        "min": 0,
        "max": 360,
        "step": 1,
        "digits": 0,
        "default": 220
      },
      {
        "key": "tintAmount",
        "label": "Tint",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0
      }
    ]
  }, component: CommunityRenderer7 },
  { ...{
    "id": "crt",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "crt",
      "terminal",
      "matrix",
      "scanlines",
      "aperture grille",
      "phosphor",
      "curvature",
      "text texture",
      "retro",
      "screen",
      "monitor",
      "variants",
      "cinematic",
      "monotone",
      "monochrome",
      "film leader",
      "academy leader",
      "countdown",
      "letterbox",
      "timecode",
      "blue screen",
      "signal fault",
      "vhs",
      "static",
      "glitch",
      "tracking noise",
      "dropout",
      "nintendo",
      "8-bit",
      "nes",
      "pixel art",
      "pixel font",
      "sprite",
      "title screen",
      "attract mode",
      "arcade",
      "game"
    ],
    "category": "Backgrounds",
    "label": "CRT",
    "thumbnail": "https://threeui.com/thumbnails/crt.jpg",
    "description": "One sharpened curved-glass CRT tube driving four screens: the Matrix-era boot terminal, a monochrome film leader, a noise-torn blue signal fault, and an 8-bit console title.",
    "runtime": "Raw WebGL + Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 860a1eb1d4c9",
    "sourceFiles": [
      "ZION-Construct-Initialization (1).html — complete CRT background",
      "src/shaders/crt/crtRenderer.ts",
      "src/shaders/crt/crtShaders.ts",
      "src/shaders/crt/crtScreens.ts",
      "src/shaders/crt/CrtBackground.tsx"
    ],
    "passes": "2 — Canvas 2D screen texture + raw WebGL CRT composite",
    "interaction": "Selectable screen style plus customizable boot speed, CRT motion, hue, brightness, and opacity",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "CrtBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Raw WebGL + Canvas 2D"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Terminal | Cinematic | Blue Screen | Nintendo"
      },
      {
        "name": "backing",
        "type": "adaptive",
        "value": "≤ 1920 px, ≤ 2 DPR"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "CRT speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "typeSpeed",
        "label": "Type speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "motion",
        "label": "Motion",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "terminal",
        "label": "Terminal",
        "description": "The authored 19-row Zion boot log typing itself onto green phosphor, now resolved at the full backing resolution so the glyph cores stay crisp behind the grille.",
        "thumbnail": "https://threeui.com/thumbnails/crt.jpg",
        "preview": "https://threeui.com/previews/crt.webm",
        "props": {
          "variant": "terminal"
        },
        "controls": [
          {
            "key": "speed",
            "label": "CRT speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "typeSpeed",
            "label": "Type speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "motion",
            "label": "Motion",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.4,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "cinematic",
        "label": "Cinematic",
        "description": "A monotone academy leader: letterboxed frame, sweeping countdown dial, scrolling film perforations, registration marks, and a running 24 fps timecode graded to pure luminance.",
        "thumbnail": "https://threeui.com/thumbnails/crt-cinematic.jpg",
        "preview": "https://threeui.com/previews/crt-cinematic.webm",
        "props": {
          "variant": "cinematic"
        },
        "controls": [
          {
            "key": "speed",
            "label": "CRT speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "motion",
            "label": "Motion",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.4,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "blue-screen",
        "label": "Blue Screen",
        "description": "A retro signal-fault panel on saturated broadcast blue, torn by shader-side transport noise: per-row jitter, a rolling dropout band, head-switching scramble, and heavy static.",
        "thumbnail": "https://threeui.com/thumbnails/crt-blue-screen.jpg",
        "preview": "https://threeui.com/previews/crt-blue-screen.webm",
        "props": {
          "variant": "blue-screen"
        },
        "controls": [
          {
            "key": "speed",
            "label": "CRT speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "motion",
            "label": "Motion",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.4,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "nintendo",
        "label": "Nintendo",
        "description": "An 8-bit console title screen drawn on a 320×180 grid with a hand-authored 5×7 pixel font and nearest-neighbour upscale, so every sprite, brick, and letter lands on a hard pixel edge.",
        "thumbnail": "https://threeui.com/thumbnails/crt-nintendo.jpg",
        "preview": "https://threeui.com/previews/crt-nintendo.webm",
        "props": {
          "variant": "nintendo"
        },
        "controls": [
          {
            "key": "speed",
            "label": "CRT speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "motion",
            "label": "Motion",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.4,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer8 },
  { ...{
    "id": "energy-orb",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "3d",
      "sphere",
      "orb",
      "globe",
      "world",
      "earth",
      "constellation",
      "network",
      "nodes",
      "arcs",
      "flight paths",
      "fbm",
      "noise",
      "smoke",
      "glow",
      "stars",
      "dusk",
      "monochrome",
      "pointer",
      "drag",
      "inertia",
      "interactive",
      "animated",
      "variants"
    ],
    "category": "Backgrounds",
    "label": "Globe",
    "thumbnail": "https://threeui.com/thumbnails/energy-orb.jpg",
    "description": "The original layered FBM energy sphere with translucent rim glow and depth-aware star field.",
    "runtime": "Raw WebGL + Canvas 2D",
    "origin": "HTML Pages + Neuform export",
    "sourceCommit": "SHA-256 03b1b8e2c440 / 3de7fdcb6239 / 7a88f26e4d8",
    "sourceFiles": [
      "NXA-Decentralized-AI-Compute-Protocol (2).html — WebGL energy orb",
      "src/shaders/globe/GlobeCollection.tsx"
    ],
    "passes": "1–2 — Canvas 2D globe or Canvas 2D stars + raw WebGL energy sphere",
    "interaction": "Pointer-responsive energy sphere with visibility-aware animation and customizable motion, scale, palette, and opacity",
    "asset": "No runtime assets",
    "assetCount": 0,
    "importName": "GlobeCollection",
    "contract": [
      {
        "name": "renderer",
        "type": "fixed",
        "value": "Raw WebGL"
      },
      {
        "name": "variant",
        "type": "fixed",
        "value": "Energy Orb"
      },
      {
        "name": "interaction",
        "type": "adaptive",
        "value": "Pointer + visibility"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Orb speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Orb scale",
        "min": 0.5,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "smokeScale",
        "label": "Smoke scale",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "smokeStrength",
        "label": "Smoke strength",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "smokeSpeed",
        "label": "Smoke speed",
        "min": 0,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Orb hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "glow",
        "label": "Glow",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "starDensity",
        "label": "Star density",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "starSpeed",
        "label": "Star speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "starSize",
        "label": "Star size",
        "min": 0.25,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "energy-orb",
        "label": "Energy Orb",
        "description": "The original layered FBM energy sphere with translucent rim glow and depth-aware star field.",
        "thumbnail": "https://threeui.com/thumbnails/energy-orb.jpg",
        "preview": "https://threeui.com/previews/energy-orb.webm",
        "props": {
          "variant": "energy-orb"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Orb speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "scale",
            "label": "Orb scale",
            "min": 0.5,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "smokeScale",
            "label": "Smoke scale",
            "min": 0.35,
            "max": 2.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "smokeStrength",
            "label": "Smoke strength",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "smokeSpeed",
            "label": "Smoke speed",
            "min": 0,
            "max": 2.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Orb hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "glow",
            "label": "Glow",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "starDensity",
            "label": "Star density",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "starSpeed",
            "label": "Star speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "starSize",
            "label": "Star size",
            "min": 0.25,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.4,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer9 },
  { ...{
    "id": "spark-badge",
    "tags": [
      "canvas",
      "canvas2d",
      "particles",
      "badge",
      "typography",
      "rain",
      "sparks",
      "embers",
      "curl noise",
      "interactive"
    ],
    "category": "Backgrounds",
    "label": "Spark Badge",
    "thumbnail": "https://threeui.com/thumbnails/spark-badge.jpg",
    "description": "A luminous credential badge held together by curl-noise embers, carved typography, rain occlusion, waterline sparks, and an adaptive particle field.",
    "runtime": "Canvas 2D",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 a8eefdee0d87",
    "sourceFiles": [
      "spark-badge.html — complete self-contained Canvas 2D particle scene",
      "src/shaders/spark-badge/spark-badge.html",
      "src/shaders/spark-badge/SparkBadge.tsx"
    ],
    "passes": "3 — rear rain, figure embers + waterline, foreground rain",
    "interaction": "Live speed, spark, rain, turbulence, and spread controls over the ambient 17-second dissolve/reform cycle",
    "asset": "One self-contained authored HTML badge scene; no external assets",
    "assetCount": 1,
    "importName": "SparkBadge",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Canvas 2D"
      },
      {
        "name": "particles",
        "type": "adaptive",
        "value": "17,600 + rain + water"
      },
      {
        "name": "passes",
        "type": "fixed",
        "value": "3"
      },
      {
        "name": "controls",
        "type": "live",
        "value": "Speed + sparks + rain + turbulence + spread"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Visibility + reduced motion"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Sparks",
        "min": 0.35,
        "max": 1.4,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "rainAmount",
        "label": "Rain",
        "min": 0,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "turbulence",
        "label": "Turbulence",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "spread",
        "label": "Spread",
        "min": 0.5,
        "max": 1.75,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "badge",
        "label": "Badge",
        "description": "The original Codex credential assembled from luminous rain and curl-noise embers.",
        "thumbnail": "https://threeui.com/thumbnails/spark-badge.jpg",
        "preview": "https://threeui.com/previews/spark-badge.webm",
        "props": {}
      }
    ]
  }, component: CommunityRenderer10 },
  { ...{
    "id": "stream-convergence",
    "variantOf": "portal-field",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "background",
      "waves",
      "wavefront",
      "fluid",
      "chromatic",
      "violet",
      "vignette"
    ],
    "category": "Backgrounds",
    "label": "Stream Convergence",
    "thumbnail": "https://threeui.com/thumbnails/stream-convergence.jpg",
    "description": "Three chromatically separated violet wavefronts crossing a rotated fluid field with the exact authored vignette.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 f56c9d3d680d",
    "sourceFiles": [
      "Asynchronous-Stream-Convergence (1).html — shader background",
      "src/shaders/stream-convergence/streamConvergenceShaders.ts",
      "src/shaders/stream-convergence/StreamConvergenceBackground.tsx"
    ],
    "passes": "1 raw WebGL fullscreen shader pass",
    "interaction": "Customizable motion, fidelity, palette, scale, brightness, and opacity",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "StreamConvergenceBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Raw WebGL adapter"
      },
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact authored GLSL"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "fidelity",
        "label": "Fidelity",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.5
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.7,
        "max": 1.4,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer11 },
  { ...{
    "id": "bell-field",
    "variantOf": "portal-field",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "chladni",
      "cymatics",
      "metal",
      "nodal",
      "rings",
      "particles",
      "embers",
      "pointer"
    ],
    "category": "Backgrounds",
    "label": "Bell Field",
    "thumbnail": "https://threeui.com/thumbnails/bell-field.jpg",
    "description": "A Chladni-inspired bell-mode field with authored nodal metal patterns, automatic strike rings, pointer drift, and rising foundry embers.",
    "runtime": "Raw WebGL + Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 b56d6a6a51f2",
    "sourceFiles": [
      "AURA-The-Frequency-of-Light.html — bell-mode and ember backgrounds",
      "src/shaders/bell-field/bellFieldShaders.ts",
      "src/shaders/bell-field/BellFieldBackground.tsx"
    ],
    "passes": "2 — raw WebGL bell field + Canvas 2D ember composite",
    "interaction": "Pointer modes, click or timed strikes, and customizable hue and ember field",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "BellFieldBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Raw WebGL + Canvas 2D"
      },
      {
        "name": "embers",
        "type": "fixed",
        "value": "58 authored seeds"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "pointerAmount",
        "label": "Pointer",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "strikeDuration",
        "label": "Strike",
        "min": 600,
        "max": 5000,
        "step": 50,
        "digits": 0,
        "default": 2400
      },
      {
        "key": "emberAmount",
        "label": "Embers",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer12 },
  { ...{
    "id": "flow-field",
    "variantOf": "portal-field",
    "tags": [
      "canvas",
      "canvas2d",
      "flow field",
      "simplex noise",
      "particles",
      "particle trails",
      "amber",
      "coral",
      "gold",
      "pointer",
      "interactive",
      "dark",
      "background",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Flow Field",
    "thumbnail": "https://threeui.com/thumbnails/flow-field.jpg",
    "description": "A warm Canvas 2D flow field with 2,500 simplex-driven amber, gold, and coral particle trails plus pointer repulsion.",
    "runtime": "Canvas 2D",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 78eaf8ce3431",
    "sourceFiles": [
      "flow-field.html — complete authored Canvas 2D renderer",
      "src/shaders/neuform-isolated/sources/flow-field.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 Canvas 2D particle-trail pass",
    "interaction": "Pointer repulsion plus customizable motion, scale, density, opacity, and palette",
    "asset": "Embedded deterministic simplex-noise implementation; no external assets",
    "assetCount": 0,
    "importName": "FlowField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer13 },
  { ...{
    "id": "elements",
    "tags": [
      "webgl2",
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "background",
      "elements",
      "elemental",
      "water",
      "lightning",
      "fire",
      "flame",
      "condensation",
      "tree",
      "generative",
      "branches",
      "ripples",
      "refraction",
      "electric",
      "embers",
      "particles",
      "logo",
      "mark",
      "pointer",
      "interactive",
      "variants"
    ],
    "category": "Backgrounds",
    "label": "Elements",
    "thumbnail": "https://threeui.com/thumbnails/elements.jpg",
    "description": "Water, lightning, fire, condensation, and a painterly generative tree collected as one elemental family across WebGL2 and Canvas 2D.",
    "runtime": "Raw WebGL2 + Canvas 2D",
    "origin": "Elemental Marks + HTML Pages + Neuform export",
    "sourceCommit": "SHA-256 7a6871fe99fa",
    "sourceFiles": [
      "elemental-marks.html — complete water, lightning, and fire source",
      "src/shaders/elements/sources/elemental-marks.html",
      "src/shaders/elements/ElementsBackground.tsx",
      "src/shaders/elements/ElementsCollection.tsx",
      "generative-tree.html — complete authored Canvas 2D renderer",
      "src/shaders/elements/sources/generative-tree.html",
      "src/shaders/elements/GenerativeTree.tsx",
      "src/shaders/condensation/condensationRenderer.ts",
      "src/shaders/condensation/CondensationBackground.tsx"
    ],
    "passes": "1 selected composition — up to 3 WebGL2 passes or 1 Canvas 2D pass",
    "interaction": "Variant selection, pointer-reactive marks and tree wind, speed, scale, particles, palette, and opacity",
    "asset": "Three embedded vector brand paths; no external binary assets",
    "assetCount": 0,
    "importName": "ElementsCollection",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed WebGL2 or Canvas 2D"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Water + Lightning + Fire + Condensation + Generative Tree"
      },
      {
        "name": "source",
        "type": "fixed",
        "value": "Complete authored Elemental Marks + Generative Tree documents"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Three vector mark paths; no external tree assets"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Mark size",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Particles",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "elemental-water",
        "label": "Water",
        "description": "A refracted OpenAI mark beneath pointer-driven circular ripples, cyan depth, and soft suspended particles.",
        "thumbnail": "https://threeui.com/thumbnails/elemental-water.jpg",
        "preview": "https://threeui.com/previews/elemental-water.webm",
        "props": {
          "variant": "water"
        }
      },
      {
        "id": "elemental-lightning",
        "label": "Lightning",
        "description": "Violet fBm arcs crawl around the Anthropic contour while pointer proximity pulls the storm closer.",
        "thumbnail": "https://threeui.com/thumbnails/elemental-lightning.jpg",
        "preview": "https://threeui.com/previews/elemental-lightning.webm",
        "props": {
          "variant": "lightning"
        }
      },
      {
        "id": "elemental-flame",
        "label": "Fire",
        "description": "Noise-driven flame ribbons and rising embers lick upward from the Claude mark edge.",
        "thumbnail": "https://threeui.com/thumbnails/elemental-flame.jpg",
        "preview": "https://threeui.com/previews/elemental-flame.webm",
        "props": {
          "variant": "fire"
        }
      },
      {
        "id": "condensation",
        "label": "Condensation",
        "description": "Transparent droplets grow, merge, fall, and resolve into soft water splash rings.",
        "thumbnail": "https://threeui.com/thumbnails/condensation.jpg",
        "preview": "https://threeui.com/previews/condensation.webm",
        "props": {
          "variant": "condensation"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "dropAmount",
            "label": "Drops",
            "min": 0.25,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "generative-tree",
        "label": "Generative Tree",
        "description": "A painterly branching tree grows from warm sienna to golden tips, sways with pointer wind, and sheds soft ambient motes.",
        "thumbnail": "https://threeui.com/thumbnails/generative-tree.jpg",
        "preview": "https://threeui.com/previews/generative-tree.webm",
        "props": {
          "variant": "generative-tree"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "size",
            "label": "Tree size",
            "min": 0.65,
            "max": 1.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "particleAmount",
            "label": "Particles",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer14 },
  { ...{
    "id": "elemental-water",
    "variantOf": "elements",
    "tags": [
      "webgl2",
      "webgl",
      "glsl",
      "shader",
      "background",
      "elements",
      "water",
      "liquid",
      "ripples",
      "refraction",
      "caustic",
      "blue",
      "cyan",
      "logo",
      "openai",
      "pointer",
      "interactive"
    ],
    "category": "Backgrounds",
    "label": "Water Element",
    "thumbnail": "https://threeui.com/thumbnails/elemental-water.jpg",
    "description": "A refracted OpenAI mark beneath pointer-driven circular ripples, cyan depth, and soft suspended particles.",
    "runtime": "Raw WebGL2",
    "origin": "Elemental Marks",
    "sourceCommit": "SHA-256 7a6871fe99fa",
    "sourceFiles": [
      "elemental-marks.html — water panel",
      "src/shaders/elements/sources/elemental-marks.html",
      "src/shaders/elements/ElementsBackground.tsx"
    ],
    "passes": "3 — ping-pong wave simulation, refracted mark, and contour particles",
    "interaction": "Pointer ripples plus customizable speed, mark size, particles, palette, and opacity",
    "asset": "Embedded OpenAI vector path",
    "assetCount": 0,
    "importName": "ElementsBackground",
    "contract": [
      {
        "name": "variant",
        "type": "fixed",
        "value": "water"
      },
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed raw WebGL2"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "OpenAI vector path"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Mark size",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Particles",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer15 },
  { ...{
    "id": "elemental-lightning",
    "variantOf": "elements",
    "tags": [
      "webgl2",
      "webgl",
      "glsl",
      "shader",
      "background",
      "elements",
      "lightning",
      "electric",
      "storm",
      "arcs",
      "contour",
      "violet",
      "logo",
      "anthropic",
      "pointer",
      "interactive"
    ],
    "category": "Backgrounds",
    "label": "Lightning Element",
    "thumbnail": "https://threeui.com/thumbnails/elemental-lightning.jpg",
    "description": "Violet fBm arcs crawl around the Anthropic contour while pointer proximity pulls the storm closer.",
    "runtime": "Raw WebGL2",
    "origin": "Elemental Marks",
    "sourceCommit": "SHA-256 7a6871fe99fa",
    "sourceFiles": [
      "elemental-marks.html — lightning panel",
      "src/shaders/elements/sources/elemental-marks.html",
      "src/shaders/elements/ElementsBackground.tsx"
    ],
    "passes": "2 — contour lightning shader and additive sparks",
    "interaction": "Pointer storm proximity plus customizable speed, mark size, particles, palette, and opacity",
    "asset": "Embedded Anthropic vector path",
    "assetCount": 0,
    "importName": "ElementsBackground",
    "contract": [
      {
        "name": "variant",
        "type": "fixed",
        "value": "lightning"
      },
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed raw WebGL2"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Anthropic vector path"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Mark size",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Particles",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer15 },
  { ...{
    "id": "elemental-flame",
    "variantOf": "elements",
    "tags": [
      "webgl2",
      "webgl",
      "glsl",
      "shader",
      "background",
      "elements",
      "fire",
      "flame",
      "embers",
      "heat",
      "orange",
      "logo",
      "claude",
      "pointer",
      "interactive"
    ],
    "category": "Backgrounds",
    "label": "Fire Element",
    "thumbnail": "https://threeui.com/thumbnails/elemental-flame.jpg",
    "description": "Noise-driven flame ribbons and rising embers lick upward from the Claude mark edge.",
    "runtime": "Raw WebGL2",
    "origin": "Elemental Marks",
    "sourceCommit": "SHA-256 7a6871fe99fa",
    "sourceFiles": [
      "elemental-marks.html — fire panel",
      "src/shaders/elements/sources/elemental-marks.html",
      "src/shaders/elements/ElementsBackground.tsx"
    ],
    "passes": "2 — edge-flame shader and additive ember field",
    "interaction": "Pointer stoke and wind plus customizable speed, mark size, particles, palette, and opacity",
    "asset": "Embedded Claude vector path",
    "assetCount": 0,
    "importName": "ElementsBackground",
    "contract": [
      {
        "name": "variant",
        "type": "fixed",
        "value": "fire"
      },
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed raw WebGL2"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Claude vector path"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Mark size",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Particles",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer15 },
  { ...{
    "id": "condensation",
    "variantOf": "elements",
    "tags": [
      "canvas",
      "canvas2d",
      "background",
      "elements",
      "elemental",
      "condensation",
      "droplets",
      "bubbles",
      "water",
      "splash",
      "rain",
      "transparent",
      "particles",
      "physics",
      "variants"
    ],
    "category": "Backgrounds",
    "label": "Condensation",
    "thumbnail": "https://threeui.com/thumbnails/condensation.jpg",
    "description": "A transparent field of growing condensation bubbles that merge, fall, and resolve into soft water splash rings.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 9c831fa0203c",
    "sourceFiles": [
      "AetherGrid-Atmospheric-Vapor-Harvest-Array.html — condensation canvas",
      "src/shaders/condensation/condensationRenderer.ts",
      "src/shaders/condensation/CondensationBackground.tsx"
    ],
    "passes": "1 transparent Canvas 2D water pass",
    "interaction": "Customizable speed, bubble density, and opacity",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "CondensationBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Canvas 2D"
      },
      {
        "name": "drops",
        "type": "adaptive",
        "value": "80–240 authored density"
      },
      {
        "name": "background",
        "type": "fixed",
        "value": "Transparent"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "dropAmount",
        "label": "Drops",
        "min": 0.25,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer16 },
  { ...{
    "id": "generative-tree",
    "variantOf": "elements",
    "tags": [
      "canvas",
      "canvas2d",
      "background",
      "elements",
      "elemental",
      "generative",
      "tree",
      "branches",
      "recursive",
      "growth",
      "sienna",
      "amber",
      "gold",
      "particles",
      "pointer",
      "wind",
      "shake",
      "interactive",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Generative Tree",
    "thumbnail": "https://threeui.com/thumbnails/generative-tree.jpg",
    "description": "A painterly branching tree grows from warm sienna to golden tips, sways with pointer wind, and sheds soft ambient motes.",
    "runtime": "Canvas 2D",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 8ea51733bddf",
    "sourceFiles": [
      "generative-tree.html — complete authored Canvas 2D renderer",
      "src/shaders/elements/sources/generative-tree.html",
      "src/shaders/elements/GenerativeTree.tsx"
    ],
    "passes": "1 Canvas 2D painterly tree and particle pass",
    "interaction": "Pointer wind, click or touch shake, automatic regrowth, and customizable motion, scale, particles, palette, and opacity",
    "asset": "Procedural pre-rendered particle sprite; no external assets",
    "assetCount": 0,
    "importName": "GenerativeTree",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed Canvas 2D"
      },
      {
        "name": "depth",
        "type": "fixed",
        "value": "10 recursive levels"
      },
      {
        "name": "cycle",
        "type": "fixed",
        "value": "Grow + hold + fade + regrow"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Tree size",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Particles",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer17 },
  { ...{
    "id": "ribbon-field",
    "variantOf": "predictive-arc",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "background",
      "ribbons",
      "waves",
      "dot matrix",
      "cyan",
      "indigo",
      "purple",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Ribbon Field",
    "thumbnail": "https://threeui.com/thumbnails/ribbon-field.jpg",
    "description": "An exact cyan, indigo, and purple WebGL ribbon field resolved through an animated seven-pixel dot matrix.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 1367c970ac4a",
    "sourceFiles": [
      "Axiom-Technology-That-Powers.html — WebGL light field",
      "src/shaders/ribbon-field/ribbonFieldShaders.ts",
      "src/shaders/ribbon-field/RibbonFieldBackground.tsx"
    ],
    "passes": "1 raw WebGL ribbon and dot-field pass",
    "interaction": "Smoothed pointer drift plus customizable motion, palette, and contrast",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "RibbonFieldBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Raw WebGL"
      },
      {
        "name": "grid",
        "type": "fixed",
        "value": "7 px authored dot matrix"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "pointerAmount",
        "label": "Pointer",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "smoothing",
        "label": "Smoothing",
        "min": 0.005,
        "max": 0.15,
        "step": 0.005,
        "digits": 3,
        "default": 0.035
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer18 },
  { ...{
    "id": "typography-vortex",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "text",
      "vortex",
      "glyphs",
      "rings",
      "particles",
      "pointer",
      "click",
      "interactive",
      "light mode",
      "dark mode"
    ],
    "category": "Text Animation",
    "label": "Typography Vortex",
    "thumbnail": "https://threeui.com/thumbnails/typography-vortex.jpg",
    "description": "Sable’s complete rotating typography vortex with crisp prerendered rings, drifting glyphs, pointer dissolution, particle dust, and click suction — with dark and light surfaces.",
    "runtime": "Canvas 2D",
    "origin": "Sable V1",
    "sourceCommit": "5a736cd3c1f6f19802f61ebb10e1701b9f7aa26e",
    "sourceFiles": [
      "ascii-page-transition-v1.html — exact right-side typography vortex",
      "src/shaders/typography-vortex/typographyVortexRenderer.ts",
      "src/shaders/typography-vortex/TypographyVortexCanvas.tsx",
      "src/shaders/fonts/fragment-mono.woff2"
    ],
    "passes": "2 Canvas 2D passes — text layer + particle composite",
    "interaction": "Mode, pointer dissolve, ambient dust, click suction, responsive rings, and reduced motion",
    "asset": "Exact embedded Fragment Mono font extracted from the authored source",
    "assetCount": 1,
    "importName": "TypographyVortexCanvas",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Canvas 2D"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "rings",
        "type": "seeded",
        "value": "1.21 growth"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Dissolve + suction"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "asset",
        "type": "owned",
        "value": "Fragment Mono"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "ringGrowth",
        "label": "Ring growth",
        "min": 1.1,
        "max": 1.4,
        "step": 0.01,
        "digits": 2,
        "default": 1.21
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.2,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "dissolveRadius",
        "label": "Dissolve radius",
        "min": 0.5,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleAmount",
        "label": "Particles",
        "min": 0.1,
        "max": 2,
        "step": 0.05,
        "digits": 2,
        "default": 1
      },
      {
        "key": "suctionDuration",
        "label": "Suction",
        "min": 300,
        "max": 1600,
        "step": 20,
        "digits": 0,
        "default": 920
      }
    ]
  }, component: CommunityRenderer19 },
  { ...{
    "id": "semantic-bloom",
    "tags": [
      "canvas",
      "canvas2d",
      "css",
      "dom",
      "typography",
      "text animation",
      "wordmark",
      "codex",
      "organic",
      "semantic",
      "liquid",
      "gooey",
      "particles",
      "network",
      "pointer",
      "interactive",
      "light mode",
      "dark mode",
      "custom text"
    ],
    "category": "Text Animation",
    "label": "Semantic Bloom",
    "thumbnail": "https://threeui.com/thumbnails/semantic-bloom.jpg",
    "description": "A customizable Codex wordmark that draws a viscous particle organism toward its letters, illuminating the text as the network searches and reconnects.",
    "runtime": "Canvas 2D + DOM/CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 0e48ec9ed2c3",
    "sourceFiles": [
      "design-f0ebbe02-7d8a-41fd-9041-a1124185c27b.html — complete Organic Semantic Explorer source",
      "src/shaders/semantic-bloom/sources/design-f0ebbe02-7d8a-41fd-9041-a1124185c27b.html",
      "src/shaders/semantic-bloom/SemanticBloom.tsx"
    ],
    "passes": "1 filtered Canvas 2D particle network over a DOM wordmark",
    "interaction": "Pointer attraction, live text and size controls, synchronized light/dark mode, visibility pausing, and reduced-motion still frame",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "SemanticBloom",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Centered semantic wordmark"
      },
      {
        "name": "text",
        "type": "optional",
        "value": "Codex"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "size",
        "type": "optional",
        "value": "0.55–1.6"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Pointer + reduced-motion still"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "kind": "text",
        "key": "text",
        "label": "Text",
        "default": "Codex",
        "maxLength": 72,
        "placeholder": "Codex"
      },
      {
        "key": "size",
        "label": "Text size",
        "min": 0.55,
        "max": 1.6,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer20 },
  { ...{
    "id": "globe-study",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "text path",
      "text path studies",
      "3d",
      "globe",
      "world map",
      "sphere",
      "halftone",
      "outline",
      "morphing",
      "glyphs",
      "cloth",
      "ripple",
      "ball",
      "drag",
      "zoom",
      "markers",
      "interactive",
      "variants"
    ],
    "category": "Text Animation",
    "label": "Text Path Studies",
    "thumbnail": "https://threeui.com/thumbnails/globe-study.jpg",
    "description": "Six interactive Canvas 2D typography studies spanning a globe, flowing outlines, morphing glyphs, cloth physics, ripples, and a particle sphere.",
    "runtime": "Canvas 2D",
    "origin": "Text on a Path collection",
    "sourceCommit": "SHA-256 2e21ae3b77c3 + e5d01ff0fc47",
    "sourceFiles": [
      "text-on-a-path-ii.html — FIG 06 Globe, FIG 07 Outline Typeflow, FIG 08 Morphing Glyph Cloud, and FIG 11 Cloth",
      "text-on-a-path.html — FIG 04 Ripple and FIG 05 Ball",
      "src/shaders/text-path-studies/TextPathStudies.tsx"
    ],
    "passes": "1 selected sandboxed Canvas 2D study",
    "interaction": "Variant-specific drag, zoom, hover, click, morph, cloth, ripple, and particle interactions",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "TextPathStudies",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Six exact authored figures across two documents"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Canvas 2D"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "variant",
        "type": "optional",
        "value": "Six text-path studies"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2.5"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "globe-study",
        "label": "Globe Type Study",
        "description": "A typographic world sphere with drag rotation, wheel zoom, pointer lighting, and click-to-pin markers.",
        "thumbnail": "https://threeui.com/thumbnails/globe-study.jpg",
        "preview": "https://threeui.com/previews/globe-study.webm",
        "props": {}
      },
      {
        "id": "outline-typeflow",
        "label": "Outline Typeflow",
        "description": "Letters trace a multi-loop outline with hover acceleration, illumination, and click-burst particles.",
        "thumbnail": "https://threeui.com/thumbnails/outline-typeflow.jpg",
        "preview": "https://threeui.com/previews/outline-typeflow.webm",
        "props": {
          "variant": "outline-typeflow"
        }
      },
      {
        "id": "morphing-glyph-cloud",
        "label": "Morphing Glyph Cloud",
        "description": "A paired glyph field morphs between radial silhouettes with breathing motion, scatter, and pointer repulsion.",
        "thumbnail": "https://threeui.com/thumbnails/morphing-glyph-cloud.jpg",
        "preview": "https://threeui.com/previews/morphing-glyph-cloud.webm",
        "props": {
          "variant": "morphing-glyph-cloud"
        }
      },
      {
        "id": "cloth-study",
        "label": "Cloth",
        "description": "A Verlet sheet of letters responds to pointer wind and direct grabbing while its live weave deforms every glyph.",
        "thumbnail": "https://threeui.com/thumbnails/cloth-study.jpg",
        "preview": "https://threeui.com/previews/cloth-study.webm",
        "props": {
          "variant": "cloth-study"
        }
      },
      {
        "id": "ripple-study",
        "label": "Ripple",
        "description": "Clicks send overlapping weighted wavefronts through a seeded 24 × 24 typographic grid.",
        "thumbnail": "https://threeui.com/thumbnails/ripple-study.jpg",
        "preview": "https://threeui.com/previews/ripple-study.webm",
        "props": {
          "variant": "ripple-study"
        }
      },
      {
        "id": "ball-study",
        "label": "Ball",
        "description": "A depth-sorted glyph sphere accelerates on hover and sheds click-hit letters before regrowing its surface.",
        "thumbnail": "https://threeui.com/thumbnails/ball-study.jpg",
        "preview": "https://threeui.com/previews/ball-study.webm",
        "props": {
          "variant": "ball-study"
        }
      }
    ]
  }, component: CommunityRenderer21 },
  { ...{
    "id": "outline-typeflow",
    "variantOf": "globe-study",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "text path",
      "outline",
      "loop",
      "symbol",
      "pointer",
      "click",
      "particles",
      "interactive"
    ],
    "category": "Text Animation",
    "label": "Outline Typeflow",
    "thumbnail": "https://threeui.com/thumbnails/outline-typeflow.jpg",
    "description": "A continuous ring of letters traces a multi-loop symbol outline, accelerating under the pointer and bursting outward on click.",
    "runtime": "Canvas 2D",
    "origin": "Text on a Path II",
    "sourceCommit": "SHA-256 2e21ae3b77c3",
    "sourceFiles": [
      "text-on-a-path-ii.html — FIG 07 outline typeflow",
      "src/shaders/text-path-studies/TextPathStudies.tsx"
    ],
    "passes": "1 sandboxed Canvas 2D study",
    "interaction": "Hover acceleration and illumination, click burst, and optional outer-frame scale and palette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "OutlineTypeflow",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact FIG 07 document"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Canvas 2D"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "path",
        "type": "fixed",
        "value": "Multi-loop symbol outline"
      },
      {
        "name": "pixelRatio",
        "type": "high density",
        "value": "2×–2.5×"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer22 },
  { ...{
    "id": "morphing-glyph-cloud",
    "variantOf": "globe-study",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "glyphs",
      "morphing",
      "radial",
      "particles",
      "scatter",
      "pointer",
      "interactive"
    ],
    "category": "Text Animation",
    "label": "Morphing Glyph Cloud",
    "thumbnail": "https://threeui.com/thumbnails/morphing-glyph-cloud.jpg",
    "description": "A paired field of alphanumeric glyphs morphs between two radial symbol silhouettes with a lifted mid-turn scatter and pointer repulsion.",
    "runtime": "Canvas 2D",
    "origin": "Text on a Path II",
    "sourceCommit": "SHA-256 2e21ae3b77c3",
    "sourceFiles": [
      "text-on-a-path-ii.html — FIG 08 morphing glyph cloud",
      "src/shaders/text-path-studies/TextPathStudies.tsx"
    ],
    "passes": "1 sandboxed Canvas 2D study",
    "interaction": "Click to morph, pointer repulsion, autonomous glyph breathing, and optional outer-frame scale and palette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "MorphingGlyphCloud",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact FIG 08 document"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Canvas 2D"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "marks",
        "type": "fixed",
        "value": "Paired radial symbol silhouettes"
      },
      {
        "name": "pixelRatio",
        "type": "high density",
        "value": "2×–2.5×"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer23 },
  { ...{
    "id": "cloth-study",
    "variantOf": "globe-study",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "cloth",
      "fabric",
      "textile",
      "physics",
      "verlet",
      "simulation",
      "drag",
      "wind",
      "interactive"
    ],
    "category": "Text Animation",
    "label": "Cloth",
    "thumbnail": "https://threeui.com/thumbnails/cloth-study.jpg",
    "description": "A Verlet sheet of letters hangs from six pegs, shearing every glyph with the live weave while pointer wind and direct grabbing deform the cloth.",
    "runtime": "Canvas 2D",
    "origin": "Text on a Path II",
    "sourceCommit": "SHA-256 2e21ae3b77c3",
    "sourceFiles": [
      "text-on-a-path-ii.html — FIG 11 Cloth",
      "src/shaders/text-path-studies/TextPathStudies.tsx"
    ],
    "passes": "1 sandboxed Canvas 2D study",
    "interaction": "Pointer wind, direct cloth grabbing, fixed-step constraints, and optional outer-frame scale and palette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "ClothStudy",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact FIG 11 document"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Canvas 2D Verlet cloth"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "grid",
        "type": "fixed",
        "value": "19 × 21 glyph points"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 1.5"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer24 },
  { ...{
    "id": "ripple-study",
    "variantOf": "globe-study",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "glyphs",
      "grid",
      "ripple",
      "wave",
      "click",
      "interactive",
      "light mode",
      "dark mode"
    ],
    "category": "Text Animation",
    "label": "Ripple",
    "thumbnail": "https://threeui.com/thumbnails/ripple-study.jpg",
    "description": "A full-frame 24 × 24 glyph field where clicks send weighted typographic wavefronts through the seeded character grid on synchronized light and dark surfaces.",
    "runtime": "Canvas 2D",
    "origin": "Text on a Path",
    "sourceCommit": "SHA-256 e5d01ff0fc47",
    "sourceFiles": [
      "text-on-a-path.html — FIG 04 Ripple",
      "src/shaders/text-path-studies/TextPathStudies.tsx"
    ],
    "passes": "1 frameless sandboxed Canvas 2D study",
    "interaction": "Click-triggered overlapping ripples with optional scale and palette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "RippleStudy",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact FIG 04 document"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Canvas 2D"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "surface",
        "type": "presentation",
        "value": "Theme-aware, frameless, crop-safe"
      },
      {
        "name": "grid",
        "type": "fixed",
        "value": "24 × 24 seeded glyphs"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer25 },
  { ...{
    "id": "ball-study",
    "variantOf": "globe-study",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "glyphs",
      "sphere",
      "3d",
      "particles",
      "hover",
      "click",
      "physics",
      "interactive",
      "light mode",
      "dark mode"
    ],
    "category": "Text Animation",
    "label": "Ball",
    "thumbnail": "https://threeui.com/thumbnails/ball-study.jpg",
    "description": "A full-frame sphere of 1,900 depth-sorted glyphs with hover acceleration and click-hit letters that break loose, fall, and regrow on synchronized light and dark surfaces.",
    "runtime": "Canvas 2D",
    "origin": "Text on a Path",
    "sourceCommit": "SHA-256 e5d01ff0fc47",
    "sourceFiles": [
      "text-on-a-path.html — FIG 05 Ball",
      "src/shaders/text-path-studies/TextPathStudies.tsx"
    ],
    "passes": "1 frameless sandboxed Canvas 2D study",
    "interaction": "Hover acceleration, click-hit glyph particles, sphere regrowth, and optional scale and palette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "BallStudy",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact FIG 05 document"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Canvas 2D"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "surface",
        "type": "presentation",
        "value": "Theme-aware, frameless, crop-safe"
      },
      {
        "name": "glyphs",
        "type": "seeded",
        "value": "1,900"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.65,
        "max": 1.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer26 },
  { ...{
    "id": "threeui-intro",
    "variantOf": "article-headings",
    "tags": [
      "css",
      "dom",
      "typography",
      "wordmark",
      "logo",
      "chromatic",
      "intro",
      "brand",
      "text animation"
    ],
    "category": "Text Animation",
    "label": "Intro Text",
    "thumbnail": "https://threeui.com/thumbnails/threeui-intro.jpg",
    "description": "The opening chromatic wordmark assembly, reduced to its first beat and rebranded with the ThreeUI wave mark and name.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 e14795f24ea8",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/creator-studio-intro.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 DOM/CSS chromatic wordmark assembly",
    "interaction": "The authored opening beat loops with a short final hold + synchronized light/dark mode and optional final-frame palette",
    "asset": "ThreeUI wave mark is supplied by the package host",
    "assetCount": 0,
    "importName": "ThreeUIIntro",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer27 },
  { ...{
    "id": "particle-wordmark",
    "variantOf": "article-headings",
    "tags": [
      "canvas",
      "canvas2d",
      "particles",
      "wordmark",
      "logo",
      "typography",
      "dots",
      "squares",
      "light mode",
      "dark mode"
    ],
    "category": "Text Animation",
    "label": "Particle Wordmark",
    "thumbnail": "https://threeui.com/thumbnails/particle-wordmark.jpg",
    "description": "The Shaders wordmark materializes through a seeded field of drifting dots and squares, isolated from the source footer and synchronized across light and dark surfaces.",
    "runtime": "Canvas 2D",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 8d2cfccf1140",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/epilude-footer.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Canvas 2D particle-mask wordmark pass",
    "interaction": "Seeded eight-second particle cycle with reduced-motion support, responsive sizing, and synchronized light/dark mode",
    "asset": "No external assets; the Shaders mask is supplied inline by the package host",
    "assetCount": 0,
    "importName": "ParticleWordmark",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer28 },
  { ...{
    "id": "audio-wordmark",
    "variantOf": "article-headings",
    "tags": [
      "canvas",
      "canvas2d",
      "css",
      "dom",
      "audio",
      "visualizer",
      "circular bars",
      "wordmark",
      "logo",
      "portrait",
      "light mode",
      "dark mode"
    ],
    "category": "Text Animation",
    "label": "Audio Wordmark",
    "thumbnail": "https://threeui.com/thumbnails/audio-wordmark.jpg",
    "description": "A portrait audio identity scene pairing two animated circular bar fields with a compact ThreeUI wordmark and icon lockup in synchronized light and dark modes.",
    "runtime": "Canvas 2D + DOM/CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 26f0d8d04494",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/audio-wordmark.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Canvas 2D audio-bar pass + 1 DOM wordmark overlay",
    "interaction": "The first authored identity scene loops every 4.7 seconds with responsive portrait scaling and synchronized light/dark mode",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "AudioWordmark",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer29 },
  { ...{
    "id": "gallery-heading",
    "tags": [
      "canvas",
      "canvas2d",
      "gallery",
      "flat color",
      "noise",
      "grain",
      "dither",
      "halftone",
      "glitch",
      "carousel",
      "tiles",
      "3d",
      "perspective",
      "typography",
      "light mode",
      "dark mode"
    ],
    "category": "Text Animation",
    "label": "Gallery Heading",
    "thumbnail": "https://threeui.com/thumbnails/gallery-heading.jpg",
    "description": "An oversized headline ringed by twelve 4:3 plates — one flat colour each, shaded by a procedural noise field rather than a gradient — that hold still until the pointer arrives, then orbit. Four galleries, each with its own field, typography, and direction.",
    "runtime": "Canvas 2D",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 8e42d2d5b497",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/gallery-heading.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Canvas 2D typographic carousel",
    "interaction": "The ring rests until a pointer is over it, then comes up to one orbit every 15 seconds — eased in three galleries, sprung in the matte one — and settles back to a stop on leave",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "GalleryHeading",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "font",
        "type": "optional",
        "value": "serif | didone | oldstyle | sans"
      },
      {
        "name": "weight",
        "type": "optional",
        "value": "400 | 700"
      },
      {
        "name": "headlineSize",
        "type": "optional",
        "value": "0.6–1.8 x"
      },
      {
        "name": "tiles",
        "type": "fixed",
        "value": "Twelve flat 4:3 plates"
      },
      {
        "name": "field",
        "type": "variant",
        "value": "matte | glitch | riso | halftone"
      },
      {
        "name": "motion",
        "type": "pointer",
        "value": "Orbits while hovered"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "kind": "choice",
        "key": "font",
        "label": "Font",
        "default": "sans",
        "options": [
          {
            "value": "serif",
            "label": "Serif"
          },
          {
            "value": "didone",
            "label": "Didone"
          },
          {
            "value": "oldstyle",
            "label": "Old style"
          },
          {
            "value": "sans",
            "label": "Sans"
          }
        ]
      },
      {
        "kind": "choice",
        "key": "weight",
        "label": "Weight",
        "default": "400",
        "options": [
          {
            "value": "400",
            "label": "Regular"
          },
          {
            "value": "700",
            "label": "Bold"
          }
        ]
      },
      {
        "key": "headlineSize",
        "label": "Headline size",
        "min": 0.6,
        "max": 1.8,
        "step": 0.01,
        "digits": 2,
        "default": 1.15
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "rising-diagonal",
        "label": "Matte Rise",
        "description": "Muted museum plates under one slow rise of noise, a light sans on wide tracking, and an ascending ring that springs up to speed instead of easing.",
        "thumbnail": "https://threeui.com/thumbnails/gallery-heading.jpg",
        "preview": "https://threeui.com/previews/gallery-heading.webm",
        "props": {
          "variant": "rising-diagonal"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "font",
            "label": "Font",
            "default": "sans",
            "options": [
              {
                "value": "serif",
                "label": "Serif"
              },
              {
                "value": "didone",
                "label": "Didone"
              },
              {
                "value": "oldstyle",
                "label": "Old style"
              },
              {
                "value": "sans",
                "label": "Sans"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "weight",
            "label": "Weight",
            "default": "400",
            "options": [
              {
                "value": "400",
                "label": "Regular"
              },
              {
                "value": "700",
                "label": "Bold"
              }
            ]
          },
          {
            "key": "headlineSize",
            "label": "Headline size",
            "min": 0.6,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1.15
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "falling-diagonal",
        "label": "Glitch Fall",
        "description": "Broadcast colour torn into flat blocks and slipped rows, with the headline breaking up into two channels over a descending counter-orbit.",
        "thumbnail": "https://threeui.com/thumbnails/gallery-heading-falling-diagonal.jpg",
        "preview": "https://threeui.com/previews/gallery-heading-falling-diagonal.webm",
        "props": {
          "variant": "falling-diagonal"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "font",
            "label": "Font",
            "default": "sans",
            "options": [
              {
                "value": "serif",
                "label": "Serif"
              },
              {
                "value": "didone",
                "label": "Didone"
              },
              {
                "value": "oldstyle",
                "label": "Old style"
              },
              {
                "value": "sans",
                "label": "Sans"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "weight",
            "label": "Weight",
            "default": "700",
            "options": [
              {
                "value": "400",
                "label": "Regular"
              },
              {
                "value": "700",
                "label": "Bold"
              }
            ]
          },
          {
            "key": "headlineSize",
            "label": "Headline size",
            "min": 0.6,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1.2
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "horizontal-sweep",
        "label": "Riso Sweep",
        "description": "Print colour dithered to three tones over a lit corner, scanlines and heavy grain, under an old-style serif standing on a hard offset plate.",
        "thumbnail": "https://threeui.com/thumbnails/gallery-heading-horizontal-sweep.jpg",
        "preview": "https://threeui.com/previews/gallery-heading-horizontal-sweep.webm",
        "props": {
          "variant": "horizontal-sweep"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "font",
            "label": "Font",
            "default": "oldstyle",
            "options": [
              {
                "value": "serif",
                "label": "Serif"
              },
              {
                "value": "didone",
                "label": "Didone"
              },
              {
                "value": "oldstyle",
                "label": "Old style"
              },
              {
                "value": "sans",
                "label": "Sans"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "weight",
            "label": "Weight",
            "default": "700",
            "options": [
              {
                "value": "400",
                "label": "Regular"
              },
              {
                "value": "700",
                "label": "Bold"
              }
            ]
          },
          {
            "key": "headlineSize",
            "label": "Headline size",
            "min": 0.6,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1.2
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "vertical-loop",
        "label": "Halftone Loop",
        "description": "One ink on one stock, shaded only by the size of the dots on a rotated screen, under a high-contrast didone on a tall reverse loop.",
        "thumbnail": "https://threeui.com/thumbnails/gallery-heading-vertical-loop.jpg",
        "preview": "https://threeui.com/previews/gallery-heading-vertical-loop.webm",
        "props": {
          "variant": "vertical-loop"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "font",
            "label": "Font",
            "default": "didone",
            "options": [
              {
                "value": "serif",
                "label": "Serif"
              },
              {
                "value": "didone",
                "label": "Didone"
              },
              {
                "value": "oldstyle",
                "label": "Old style"
              },
              {
                "value": "sans",
                "label": "Sans"
              }
            ]
          },
          {
            "kind": "choice",
            "key": "weight",
            "label": "Weight",
            "default": "400",
            "options": [
              {
                "value": "400",
                "label": "Regular"
              },
              {
                "value": "700",
                "label": "Bold"
              }
            ]
          },
          {
            "key": "headlineSize",
            "label": "Headline size",
            "min": 0.6,
            "max": 1.8,
            "step": 0.01,
            "digits": 2,
            "default": 1.25
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer30 },
  { ...{
    "id": "star-portal",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "css",
      "button",
      "shader buttons",
      "cta",
      "particles",
      "stars",
      "pill",
      "holographic",
      "ignition",
      "induction",
      "plasma",
      "tactile",
      "thinking",
      "uploading",
      "interactive",
      "animated",
      "variants"
    ],
    "category": "Buttons",
    "label": "Shader Buttons",
    "thumbnail": "https://threeui.com/thumbnails/star-portal.jpg",
    "description": "Six authored shader and canvas button treatments collected into one interactive family.",
    "runtime": "Raw WebGL + Canvas 2D + CSS",
    "origin": "Neuform + owner-selected HTML",
    "sourceCommit": "SHA-256 002199215e12",
    "sourceFiles": [
      "src/shaders/shader-buttons/ShaderButtons.tsx",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
      "src/shaders/neuform-isolated/sources/imaginie-starfield.html",
      "src/shaders/neuform-isolated/sources/ignition-terminal.html",
      "src/shaders/neuform-isolated/sources/valence-core.html",
      "src/shaders/neuform-isolated/sources/aetheris-labs.html",
      "src/shaders/neuform-isolated/sources/nexus-tactile.html",
      "src/shaders/neuform-isolated/sources/thinking-button.html"
    ],
    "passes": "1 selected shader, canvas, and CSS button composition",
    "interaction": "Variant selection with authored pointer, hover, motion, and palette behavior",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ShaderButtons",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Star Portal + Ignition + Induction + Plasma + Tactile + Thinking"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "star-portal",
        "label": "Star Portal",
        "description": "Two drifting Canvas 2D star fields with an authored holographic pill button.",
        "thumbnail": "https://threeui.com/thumbnails/star-portal.jpg",
        "preview": "https://threeui.com/previews/star-portal.webm",
        "props": {}
      },
      {
        "id": "ignition-button",
        "label": "Ignition",
        "description": "A raw-WebGL ambient field with a tactile ignition control.",
        "thumbnail": "https://threeui.com/thumbnails/ignition-button.jpg",
        "preview": "https://threeui.com/previews/ignition-button.webm",
        "props": {
          "variant": "ignition-button"
        }
      },
      {
        "id": "induction-button",
        "label": "Induction",
        "description": "A kinetic ambient field paired with a raw-WebGL induction button.",
        "thumbnail": "https://threeui.com/thumbnails/induction-button.jpg",
        "preview": "https://threeui.com/previews/induction-button.webm",
        "props": {
          "variant": "induction-button"
        }
      },
      {
        "id": "plasma-button",
        "label": "Plasma",
        "description": "A deep-blue laboratory field with a luminous plasma control.",
        "thumbnail": "https://threeui.com/thumbnails/plasma-button.jpg",
        "preview": "https://threeui.com/previews/plasma-button.webm",
        "props": {
          "variant": "plasma-button"
        }
      },
      {
        "id": "tactile-button",
        "label": "Tactile",
        "description": "A fluid ambient background with a tactile raw-WebGL button.",
        "thumbnail": "https://threeui.com/thumbnails/tactile-button.jpg",
        "preview": "https://threeui.com/previews/tactile-button.webm",
        "props": {
          "variant": "tactile-button"
        }
      },
      {
        "id": "thinking-button",
        "label": "Thinking",
        "description": "A luminous Canvas 2D trace orbiting a softly raised blue button.",
        "thumbnail": "https://threeui.com/thumbnails/thinking-button.jpg",
        "preview": "https://threeui.com/previews/thinking-button.webm",
        "props": {
          "variant": "thinking-button"
        }
      }
    ]
  }, component: CommunityRenderer31 },
  { ...{
    "id": "ignition-button",
    "variantOf": "star-portal",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "css",
      "button",
      "cta",
      "tactile",
      "glow",
      "ambient",
      "interactive"
    ],
    "category": "Buttons",
    "label": "Ignition Button",
    "thumbnail": "https://threeui.com/thumbnails/ignition-button.jpg",
    "description": "The exact raw-WebGL ambient field and tactile ignition button, without the surrounding terminal page.",
    "runtime": "Raw WebGL + CSS",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 dd2a59a9f93f",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/ignition-terminal.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "2 raw-WebGL passes",
    "interaction": "Pointer-responsive shader button + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "IgnitionButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer32 },
  { ...{
    "id": "induction-button",
    "variantOf": "star-portal",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "button",
      "cta",
      "kinetic",
      "glow",
      "interactive"
    ],
    "category": "Buttons",
    "label": "Induction Button",
    "thumbnail": "https://threeui.com/thumbnails/induction-button.jpg",
    "description": "The exact kinetic induction background and raw-WebGL button isolated as one interactive effect.",
    "runtime": "Raw WebGL + Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 26b21d497280",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/valence-core.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 ambient pass + 1 button shader pass",
    "interaction": "Pointer-driven kinetic button + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "InductionButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer33 },
  { ...{
    "id": "plasma-button",
    "variantOf": "star-portal",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "button",
      "cta",
      "plasma",
      "glow",
      "blue",
      "luminous",
      "interactive"
    ],
    "category": "Buttons",
    "label": "Plasma Button",
    "thumbnail": "https://threeui.com/thumbnails/plasma-button.jpg",
    "description": "The exact deep-blue laboratory field and luminous plasma button with its complete authored shader pair.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 eea617fe0e37",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/aetheris-labs.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "2 raw-WebGL passes",
    "interaction": "Pointer-responsive plasma button + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "PlasmaButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer34 },
  { ...{
    "id": "tactile-button",
    "variantOf": "star-portal",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "canvas",
      "canvas2d",
      "button",
      "cta",
      "fluid",
      "tactile",
      "interactive"
    ],
    "category": "Buttons",
    "label": "Tactile Button",
    "thumbnail": "https://threeui.com/thumbnails/tactile-button.jpg",
    "description": "The exact fluidic ambient background and tactile raw-WebGL button, isolated from page content.",
    "runtime": "Raw WebGL + Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 1811a6408fb0",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/nexus-tactile.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 ambient pass + 1 button shader pass",
    "interaction": "Pointer-responsive fluid button + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "TactileButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer35 },
  { ...{
    "id": "thinking-button",
    "variantOf": "star-portal",
    "tags": [
      "canvas",
      "canvas2d",
      "button",
      "loading",
      "uploading",
      "thinking",
      "progress",
      "orbit",
      "trace",
      "blue",
      "animated"
    ],
    "category": "Buttons",
    "label": "Thinking Button",
    "thumbnail": "https://threeui.com/thumbnails/thinking-button.jpg",
    "description": "A Canvas 2D thinking state with a luminous blue trace orbiting a softly raised blue button.",
    "runtime": "Canvas 2D",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 194da3529f2f",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/thinking-button.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Canvas 2D plate, label, trace, and bloom composition",
    "interaction": "Continuous thinking trace, synchronized light/dark surfaces, and optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ThinkingButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer36 },
  { ...{
    "id": "sliding-text-cta",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "hover",
      "typography",
      "sliding text",
      "blur",
      "pill",
      "animated"
    ],
    "category": "Buttons",
    "label": "Sliding Text CTA",
    "thumbnail": "https://threeui.com/thumbnails/sliding-text-cta.jpg",
    "description": "A dark pill CTA whose label slides, blurs, and resolves into a crisp duplicate on hover.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 c637d46a7ff2",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/sliding-text-cta.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 layered CSS button composition",
    "interaction": "Hover lift, sliding text swap, blur, and bottom-light reveal",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "SlidingTextCta",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer37 },
  { ...{
    "id": "floating-dots-cta",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "particles",
      "floating dots",
      "glass",
      "blue",
      "highlight",
      "animated"
    ],
    "category": "Buttons",
    "label": "Floating Dots CTA",
    "thumbnail": "https://threeui.com/thumbnails/floating-dots-cta.jpg",
    "description": "A saturated blue CTA with a glass highlight and a continuous stream of floating light points.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 19c3fff99d67",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/floating-dots-cta.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 CSS button + 10 animated point layers",
    "interaction": "Floating particles, press scale, and arrow CTA",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "FloatingDotsCta",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer38 },
  { ...{
    "id": "launch-button",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "lightning",
      "amber",
      "tactile",
      "glow",
      "launch"
    ],
    "category": "Buttons",
    "label": "Launch Button",
    "thumbnail": "https://threeui.com/thumbnails/launch-button.jpg",
    "description": "A warm amber launch control with tactile depth, a soft aura, and a compact lightning icon.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 cf5af6894c44",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/launch-button.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 layered CSS button composition",
    "interaction": "Hover aura and pressed-depth response",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "LaunchButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer39 },
  { ...{
    "id": "dot-border-button",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "border",
      "dashed",
      "corner dots",
      "outline",
      "animated"
    ],
    "category": "Buttons",
    "label": "Dot Border Button",
    "thumbnail": "https://threeui.com/thumbnails/dot-border-button.jpg",
    "description": "A bright creation CTA framed by four corner dots and sequentially drawn dashed border segments.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 102432f7d612",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/dot-border-button.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 CSS button + 8 border detail layers",
    "interaction": "Sequenced corner-dot and border-line hover animation",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "DotBorderButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer40 },
  { ...{
    "id": "gradient-cta",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "gradient",
      "amber",
      "sheen",
      "pill",
      "elevation",
      "hover"
    ],
    "category": "Buttons",
    "label": "Gradient CTA",
    "thumbnail": "https://threeui.com/thumbnails/gradient-cta.jpg",
    "description": "A sunlit amber pill CTA with inset highlights, deep elevation, and a rising hover sheen.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 ccd6aec8c419",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/gradient-cta.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 layered CSS button composition",
    "interaction": "Rising highlight overlay and responsive shadow",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "GradientCta",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer41 },
  { ...{
    "id": "spinning-border-button",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "border",
      "beam",
      "hover",
      "graphite",
      "rotating",
      "animated"
    ],
    "category": "Buttons",
    "label": "Spinning Border Button",
    "thumbnail": "https://threeui.com/thumbnails/spinning-border-button.jpg",
    "description": "A compact graphite CTA that replaces its static edge with a rotating white border beam on hover.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 560e2dea081c",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/spinning-border-button.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 CSS button + rotating conic border",
    "interaction": "Hover lift, border spin, text brightening, and arrow shift",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "SpinningBorderButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer42 },
  { ...{
    "id": "glassmorphism-cta",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "glassmorphism",
      "glass",
      "portrait",
      "glow",
      "generative",
      "animated"
    ],
    "category": "Buttons",
    "label": "Glassmorphism CTA",
    "thumbnail": "https://threeui.com/thumbnails/glassmorphism-cta.jpg",
    "description": "A glass pill CTA with a revolving highlight, advisor portrait, and a glowing generative-action icon.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 badf81beed19",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/glassmorphism-cta.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 glass CSS button + 2 rotating highlight layers",
    "interaction": "Continuous border shimmer, hover scale, and glow",
    "asset": "1 authored remote 320w portrait reference",
    "assetCount": 1,
    "importName": "GlassmorphismCta",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer43 },
  { ...{
    "id": "generate-button",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "gradient",
      "prismatic",
      "typography",
      "sparkle",
      "glossy",
      "animated"
    ],
    "category": "Buttons",
    "label": "Generate Button",
    "thumbnail": "https://threeui.com/thumbnails/generate-button.jpg",
    "description": "A glossy generate control with prismatic borders, animated lettering, and an illuminated sparkle icon.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 58e0c07308a7",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/generate-button.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 CSS button + animated label and icon layers",
    "interaction": "Generate-to-generating text transition and hover illumination",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "GenerateButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer44 },
  { ...{
    "id": "gradient-pill-button",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "gradient",
      "metallic",
      "pill",
      "arrow",
      "elevation"
    ],
    "category": "Buttons",
    "label": "Gradient Pill Button",
    "thumbnail": "https://threeui.com/thumbnails/gradient-pill-button.jpg",
    "description": "A restrained metallic lesson pill with a masked gradient edge, soft elevation, and arrow icon.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 997b9491f3f3",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/gradient-pill-button.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 CSS button + masked gradient border",
    "interaction": "Subtle surface and text hover response",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "GradientPillButton",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer45 },
  { ...{
    "id": "gradient-beam-cta",
    "variantOf": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "gradient",
      "beam",
      "glow",
      "orange",
      "particles",
      "animated"
    ],
    "category": "Buttons",
    "label": "Gradient Beam CTA",
    "thumbnail": "https://threeui.com/thumbnails/gradient-beam-cta.jpg",
    "description": "A dark builder CTA with a rotating orange edge beam, drifting dot texture, and responsive glow.",
    "runtime": "DOM + CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 b546bd6201b9",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/gradient-beam-cta.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 CSS button + animated border and dot layers",
    "interaction": "Continuous beam and dot motion with hover scale, glow, and arrow shift",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "GradientBeamCta",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer46 },
  { ...{
    "id": "rectangle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "cta",
      "rectangle",
      "rectangular",
      "glass",
      "glassmorphism",
      "dark glass",
      "gradient border",
      "inset arrow chip",
      "halftone bloom",
      "aster",
      "dot border",
      "technical outline",
      "launch",
      "amber",
      "tactile",
      "keycap",
      "arrow pill",
      "trochil",
      "attune",
      "tideform",
      "understory",
      "meridian",
      "halvorsen",
      "hover",
      "focus",
      "press",
      "light mode",
      "dark mode",
      "animated",
      "variants",
      "dark pill legacy"
    ],
    "category": "Buttons",
    "label": "Rectangle Buttons",
    "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons.jpg",
    "description": "Twenty-two authored rectangle-button and animated CTA treatments collected into one family.",
    "runtime": "DOM + CSS",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 f4f3dd8422cd",
    "sourceFiles": [
      "src/shaders/rectangle-buttons/RectangleButtons.tsx",
      "remote-control.html — shared button treatment",
      "src/shaders/section-elements/SectionElements.tsx",
      "src/shaders/section-elements/section-elements.css",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
      "src/shaders/neuform-isolated/sources/launch-button.html",
      "src/shaders/neuform-isolated/sources/dot-border-button.html",
      "src/shaders/neuform-isolated/sources/floating-dots-cta.html",
      "src/shaders/neuform-isolated/sources/sliding-text-cta.html",
      "src/shaders/neuform-isolated/sources/gradient-beam-cta.html",
      "src/shaders/neuform-isolated/sources/gradient-pill-button.html",
      "src/shaders/neuform-isolated/sources/generate-button.html",
      "src/shaders/neuform-isolated/sources/glassmorphism-cta.html",
      "src/shaders/neuform-isolated/sources/spinning-border-button.html",
      "src/shaders/neuform-isolated/sources/gradient-cta.html",
      "src/shaders/lumen-cta/LumenCta.tsx",
      "src/shaders/lumen-cta/lumen-cta.css",
      "src/shaders/lumen-cta/sources/lumen.html",
      "halftone-bloom.html — Aster glass access and arrow CTA treatments"
    ],
    "passes": "1 selected DOM/CSS button composition",
    "interaction": "Variant selection with authored hover, focus, motion, and palette behavior",
    "asset": "5 local SF Pro font subsets + 1 authored remote portrait reference",
    "assetCount": 6,
    "importName": "RectangleButtons",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "React DOM + scoped CSS"
      },
      {
        "name": "source",
        "type": "fixed",
        "value": "Owner-selected reference HTML"
      },
      {
        "name": "theme",
        "type": "fixed",
        "value": "Dark"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Container-relative 16:9 composition"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced-motion safe"
      },
      {
        "name": "assets",
        "type": "owned",
        "value": "Local fonts and illustrations"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Dark Glass + Launch + Dot Border + Floating Dots + Sliding Text + Gradient Beam + Gradient Pill + Generate + Glassmorphism + Spinning Border + Gradient + Lumen CTA + Lumen CTA Ghost + Trochil Signal + Attune Thermal + Tideform Outline + Understory Arrow Pill + Meridian Keycap Primary + Meridian Keycap Secondary + Halvorsen Arrow Pill + Aster Glass Access + Aster Glass Arrow"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "dark-pill",
        "label": "Dark Glass",
        "description": "A deep charcoal glass rectangle with a softly revolving inner highlight and restrained metallic type.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons.webm",
        "props": {}
      },
      {
        "id": "launch-button",
        "label": "Launch Button",
        "description": "A warm amber launch control with tactile depth, a soft aura, and a compact lightning icon.",
        "thumbnail": "https://threeui.com/thumbnails/launch-button.jpg",
        "preview": "https://threeui.com/previews/launch-button.webm",
        "props": {
          "variant": "launch-button"
        }
      },
      {
        "id": "dot-border-button",
        "label": "Dot Border Button",
        "description": "A bright creation CTA framed by four corner dots and sequentially drawn dashed border segments.",
        "thumbnail": "https://threeui.com/thumbnails/dot-border-button.jpg",
        "preview": "https://threeui.com/previews/dot-border-button.webm",
        "props": {
          "variant": "dot-border-button"
        }
      },
      {
        "id": "floating-dots-cta",
        "label": "Floating Dots CTA",
        "description": "A saturated blue CTA with a glass highlight and a continuous stream of floating light points.",
        "thumbnail": "https://threeui.com/thumbnails/floating-dots-cta.jpg",
        "preview": "https://threeui.com/previews/floating-dots-cta.webm",
        "props": {
          "variant": "floating-dots-cta"
        }
      },
      {
        "id": "sliding-text-cta",
        "label": "Sliding Text CTA",
        "description": "A dark rectangle CTA whose label slides, blurs, and resolves into a crisp duplicate on hover.",
        "thumbnail": "https://threeui.com/thumbnails/sliding-text-cta.jpg",
        "preview": "https://threeui.com/previews/sliding-text-cta.webm",
        "props": {
          "variant": "sliding-text-cta"
        }
      },
      {
        "id": "gradient-beam-cta",
        "label": "Gradient Beam CTA",
        "description": "A dark builder CTA with a rotating orange edge beam, drifting dot texture, and responsive glow.",
        "thumbnail": "https://threeui.com/thumbnails/gradient-beam-cta.jpg",
        "preview": "https://threeui.com/previews/gradient-beam-cta.webm",
        "props": {
          "variant": "gradient-beam-cta"
        }
      },
      {
        "id": "gradient-pill-button",
        "label": "Gradient Pill Button",
        "description": "A restrained metallic lesson control with a masked gradient edge, soft elevation, and arrow icon.",
        "thumbnail": "https://threeui.com/thumbnails/gradient-pill-button.jpg",
        "preview": "https://threeui.com/previews/gradient-pill-button.webm",
        "props": {
          "variant": "gradient-pill-button"
        }
      },
      {
        "id": "generate-button",
        "label": "Generate Button",
        "description": "A glossy generate control with prismatic borders, animated lettering, and an illuminated sparkle icon.",
        "thumbnail": "https://threeui.com/thumbnails/generate-button.jpg",
        "preview": "https://threeui.com/previews/generate-button.webm",
        "props": {
          "variant": "generate-button"
        }
      },
      {
        "id": "glassmorphism-cta",
        "label": "Glassmorphism CTA",
        "description": "A glass CTA with a revolving highlight, advisor portrait, and a glowing generative-action icon.",
        "thumbnail": "https://threeui.com/thumbnails/glassmorphism-cta.jpg",
        "preview": "https://threeui.com/previews/glassmorphism-cta.webm",
        "props": {
          "variant": "glassmorphism-cta"
        }
      },
      {
        "id": "spinning-border-button",
        "label": "Spinning Border Button",
        "description": "A compact graphite CTA that replaces its static edge with a rotating white border beam on hover.",
        "thumbnail": "https://threeui.com/thumbnails/spinning-border-button.jpg",
        "preview": "https://threeui.com/previews/spinning-border-button.webm",
        "props": {
          "variant": "spinning-border-button"
        }
      },
      {
        "id": "gradient-cta",
        "label": "Gradient CTA",
        "description": "A sunlit amber CTA with inset highlights, deep elevation, and a rising hover sheen.",
        "thumbnail": "https://threeui.com/thumbnails/gradient-cta.jpg",
        "preview": "https://threeui.com/previews/gradient-cta.webm",
        "props": {
          "variant": "gradient-cta"
        }
      },
      {
        "id": "lumen-cta",
        "label": "Lumen CTA",
        "description": "The authored six-stop violet gradient pill with its inner highlight, cast glow, and trailing open ring.",
        "thumbnail": "https://threeui.com/thumbnails/lumen-cta.jpg",
        "preview": "https://threeui.com/previews/lumen-cta.webm",
        "props": {
          "variant": "lumen-cta"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "lumen-cta-ghost",
        "label": "Lumen CTA Ghost",
        "description": "The authored sibling pill with the same geometry, a blurred glass fill, and a hairline outline.",
        "thumbnail": "https://threeui.com/thumbnails/lumen-cta-ghost.jpg",
        "preview": "https://threeui.com/previews/lumen-cta-ghost.webm",
        "props": {
          "variant": "lumen-cta-ghost"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "trochil-signal",
        "label": "Trochil Signal",
        "description": "The selected Trochil request-access treatment: a restrained black technical rectangle with a fine lit edge and passing warm signal sheen.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-trochil-signal.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-trochil-signal.webm",
        "props": {
          "variant": "trochil-signal"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "attune-thermal",
        "label": "Attune Thermal",
        "description": "The selected Attune primary action with a compact orange thermal gradient, inset highlight, grounded glow, and chevron.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-attune-thermal.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-attune-thermal.webm",
        "props": {
          "variant": "attune-thermal"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "tideform-outline",
        "label": "Tideform Outline",
        "description": "The selected Tideform action: a square technical outline with tracked mono type, warm hover state, and a long directional arrow.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-tideform-outline.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-tideform-outline.webm",
        "props": {
          "variant": "tideform-outline"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "understory-arrow-pill",
        "label": "Understory Arrow Pill",
        "description": "The selected Understory action with a violet capsule surface and an inset paper-toned circular arrow endcap.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-understory-arrow-pill.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-understory-arrow-pill.webm",
        "props": {
          "variant": "understory-arrow-pill"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "meridian-keycap-primary",
        "label": "Meridian Keycap Primary",
        "description": "The selected Meridian primary action rebuilt as a blue illuminated keycap with a physical base, LED, and pressed hover travel.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-meridian-keycap-primary.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-meridian-keycap-primary.webm",
        "props": {
          "variant": "meridian-keycap-primary"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "meridian-keycap-secondary",
        "label": "Meridian Keycap Secondary",
        "description": "The selected Meridian secondary action using the same tactile keycap geometry in its graphite night-side treatment.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-meridian-keycap-secondary.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-meridian-keycap-secondary.webm",
        "props": {
          "variant": "meridian-keycap-secondary"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "halvorsen-arrow-pill",
        "label": "Halvorsen Arrow Pill",
        "description": "The selected Halvorsen action: the shared editorial arrow-pill structure recut as a bone-white capsule with a black inset arrow disc.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-halvorsen-arrow-pill.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-halvorsen-arrow-pill.webm",
        "props": {
          "variant": "halvorsen-arrow-pill"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "aster-glass-access",
        "label": "Aster Glass Access",
        "description": "The compact Aster navigation action with a translucent smoke surface, masked crystalline edge, top sheen, and restrained hover lift.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-aster-glass-access.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-aster-glass-access.webm",
        "props": {
          "variant": "aster-glass-access"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "aster-glass-arrow",
        "label": "Aster Glass Arrow",
        "description": "The Aster primary CTA using the same glass material with a bordered inset chip and a directional arrow that advances on hover.",
        "thumbnail": "https://threeui.com/thumbnails/rectangle-buttons-aster-glass-arrow.jpg",
        "preview": "https://threeui.com/previews/rectangle-buttons-aster-glass-arrow.webm",
        "props": {
          "variant": "aster-glass-arrow"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer47 },
  { ...{
    "id": "circle-buttons",
    "tags": [
      "css",
      "dom",
      "button",
      "icon button",
      "circle",
      "circular",
      "round",
      "play",
      "video",
      "media control",
      "plus",
      "add",
      "create",
      "mail",
      "email",
      "send",
      "glass",
      "glassmorphism",
      "amber",
      "gold",
      "dot border",
      "dashed border",
      "tactile",
      "hover",
      "focus",
      "press",
      "disabled",
      "reduced motion",
      "light mode",
      "dark mode",
      "responsive",
      "animated",
      "variants"
    ],
    "category": "Buttons",
    "label": "Circle Buttons",
    "thumbnail": "https://threeui.com/thumbnails/circle-buttons.jpg",
    "description": "Three compact circular icon controls using the exact Dark Glass, Launch, and Dot Border material systems.",
    "runtime": "DOM + CSS",
    "origin": "ThreeUI",
    "sourceCommit": "SHA-256 2e85693f7ada",
    "sourceFiles": [
      "src/shaders/circle-buttons/CircleButtons.tsx",
      "src/shaders/circle-buttons/circle-buttons.css"
    ],
    "passes": "1 layered DOM/CSS circle composition",
    "interaction": "Source-faithful hover and press behavior, focus-visible ring, reduced-motion fallback, and adaptive light/dark palette",
    "asset": "Inline SVG icons; no external runtime assets",
    "assetCount": 0,
    "importName": "CircleButtons",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Semantic button + scoped layered CSS"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Play + Plus + Mail"
      },
      {
        "name": "materials",
        "type": "fixed",
        "value": "Dark Glass + Launch + Dot Border"
      },
      {
        "name": "size",
        "type": "responsive",
        "value": "56–72px diameter"
      },
      {
        "name": "theme",
        "type": "adaptive",
        "value": "Dark (default) | Light"
      },
      {
        "name": "interaction",
        "type": "adaptive",
        "value": "Hover | Focus | Press | Disabled | Reduced motion"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Three inline SVG icons"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "play",
        "label": "Play",
        "description": "The Dark Glass rectangle reduced to a compact circle with its original charcoal surface, masked edge, and moving conic light.",
        "thumbnail": "https://threeui.com/thumbnails/circle-buttons.jpg",
        "preview": "https://threeui.com/previews/circle-buttons.webm",
        "props": {}
      },
      {
        "id": "plus",
        "label": "Plus",
        "description": "The Launch rectangle's exact amber gradient, 4px base, soft aura, and 2px pressed state around a centered plus glyph.",
        "thumbnail": "https://threeui.com/thumbnails/circle-buttons-plus.jpg",
        "preview": "https://threeui.com/previews/circle-buttons-plus.webm",
        "props": {
          "variant": "plus"
        }
      },
      {
        "id": "mail",
        "label": "Mail",
        "description": "The Dot Border rectangle's transparent face, blue hover fill, four moving corner dots, and sequential dashed frame around a mail glyph.",
        "thumbnail": "https://threeui.com/thumbnails/circle-buttons-mail.jpg",
        "preview": "https://threeui.com/previews/circle-buttons-mail.webm",
        "props": {
          "variant": "mail"
        }
      }
    ]
  }, component: CommunityRenderer48 },
  { ...{
    "id": "liquid-metal-button",
    "tags": [
      "webgl2",
      "webgl",
      "glsl",
      "shader",
      "button",
      "cta",
      "liquid metal",
      "metallic",
      "chromatic",
      "iridescent",
      "dispersion",
      "bloom",
      "glow",
      "ripple",
      "hover",
      "focus",
      "keyboard",
      "interactive",
      "pointer",
      "pill",
      "circle",
      "circular",
      "orb",
      "icon button",
      "plus",
      "play",
      "play button",
      "monotone",
      "colored",
      "diameter",
      "stroke",
      "custom text",
      "dark",
      "sign up",
      "reduced motion",
      "responsive",
      "variants"
    ],
    "category": "Buttons",
    "label": "Liquid Metal Button",
    "thumbnail": "https://threeui.com/thumbnails/liquid-metal-button.jpg",
    "description": "A prismatic liquid-metal control in Sign up pill, Liquid Orb, and configurable Play Circle variants, with pointer-following bloom and press ripples.",
    "runtime": "Raw WebGL 2 + DOM/CSS",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 76624e881a3a",
    "sourceFiles": [
      "src/shaders/liquid-metal-button/liquid-metal-button.html",
      "src/shaders/liquid-metal-button/LiquidMetalButton.tsx"
    ],
    "passes": "Up to 20 — metal, crisp rim, adaptive softening, multi-radius bloom, and composite",
    "interaction": "Hover, focus, pointer-dragged metal, faceted press ripples, and Enter/Space activation",
    "asset": "1 exact authored HTML scene with remote Inter stylesheet and system-font fallback",
    "assetCount": 1,
    "importName": "LiquidMetalButton",
    "contract": [
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Raw WebGL 2 + DOM/CSS"
      },
      {
        "name": "control",
        "type": "semantic",
        "value": "Native button"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Sign up Pill + Liquid Orb + configurable Play Circle"
      },
      {
        "name": "geometry",
        "type": "optional",
        "value": "72–160 px circle + 1–8 px stroke"
      },
      {
        "name": "appearance",
        "type": "optional",
        "value": "Colored | monotone"
      },
      {
        "name": "content",
        "type": "optional",
        "value": "Custom accessible name"
      },
      {
        "name": "metal",
        "type": "fixed",
        "value": "Spectral dispersion field"
      },
      {
        "name": "post",
        "type": "adaptive",
        "value": "Softening + bloom"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Hover + drag + ripple"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced-motion freeze"
      },
      {
        "name": "assets",
        "type": "external",
        "value": "Inter stylesheet + fallback"
      }
    ],
    "variants": [
      {
        "id": "play-circle",
        "label": "Play Circle",
        "description": "A compact icon-only play control with configurable finish, diameter, outline, and accessible label.",
        "thumbnail": "https://threeui.com/thumbnails/liquid-metal-play-button.jpg",
        "preview": "",
        "props": {
          "variant": "play"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "rendering",
            "label": "Rendering",
            "default": "colored",
            "options": [
              {
                "value": "colored",
                "label": "Colored"
              },
              {
                "value": "monotone",
                "label": "Monotone"
              }
            ]
          },
          {
            "key": "diameter",
            "label": "Diameter",
            "min": 72,
            "max": 160,
            "step": 1,
            "digits": 0,
            "default": 88
          },
          {
            "key": "strokeWidth",
            "label": "Stroke width",
            "min": 1,
            "max": 8,
            "step": 0.5,
            "digits": 1,
            "default": 3
          },
          {
            "kind": "text",
            "key": "text",
            "label": "Accessible label",
            "default": "Play",
            "maxLength": 24,
            "placeholder": "Play"
          }
        ]
      },
      {
        "id": "pill",
        "label": "Sign up Pill",
        "description": "The original authored liquid-metal Sign up pill with its complete spectral field, bloom, pointer well, and faceted press ripple.",
        "thumbnail": "https://threeui.com/thumbnails/liquid-metal-button.jpg",
        "preview": "https://threeui.com/previews/liquid-metal-button.webm",
        "props": {
          "variant": "pill"
        }
      },
      {
        "id": "circle",
        "label": "Liquid Orb",
        "description": "The exact liquid-metal WebGL field measured through a compact 56–72px circular plus control, preserving every original interaction and post-process pass.",
        "thumbnail": "https://threeui.com/thumbnails/liquid-metal-button-circle.jpg",
        "preview": "https://threeui.com/previews/liquid-metal-button-circle.webm",
        "props": {
          "variant": "circle"
        }
      }
    ]
  }, component: CommunityRenderer49 },
  { ...{
    "id": "lumen-cta",
    "variantOf": "rectangle-buttons",
    "tags": [
      "button",
      "cta",
      "pill",
      "gradient",
      "purple",
      "violet",
      "indigo",
      "dark",
      "glow",
      "ring",
      "dot",
      "glass",
      "glassmorphism",
      "ghost",
      "outline",
      "fintech",
      "banking",
      "card",
      "lumen",
      "dom",
      "css",
      "hover",
      "light mode",
      "dark mode",
      "variants",
      "accessible",
      "responsive"
    ],
    "category": "Buttons",
    "label": "Lumen CTA",
    "thumbnail": "https://threeui.com/thumbnails/lumen-cta.jpg",
    "description": "The Lumen call-to-action pill: a six-stop violet gradient running black to lilac, a hairline inner highlight, a soft cast glow, and the small open ring that trails the label.",
    "runtime": "DOM + CSS",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 8992e7c0ceb4",
    "sourceFiles": [
      "src/shaders/lumen-cta/LumenCta.tsx",
      "src/shaders/lumen-cta/lumen-cta.css",
      "src/shaders/lumen-cta/sources/lumen.html"
    ],
    "passes": "1 DOM element with a gradient fill, inset highlight, and cast shadow",
    "interaction": "Hover brightness lift, focus-visible ring, and disabled state",
    "asset": "No binary assets — the pill is entirely CSS",
    "assetCount": 0,
    "importName": "LumenCta",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "DOM + CSS"
      },
      {
        "name": "variant",
        "type": "choice",
        "value": "Primary | Ghost"
      },
      {
        "name": "geometry",
        "type": "fixed",
        "value": "45px tall, 999px radius, 30px side padding, 10px gap"
      },
      {
        "name": "gradient",
        "type": "fixed",
        "value": "90deg, six authored stops from #050014 to #9470d9"
      },
      {
        "name": "ring",
        "type": "toggle",
        "value": "7px open circle at 1.3px, trailing the label"
      },
      {
        "name": "mode",
        "type": "choice",
        "value": "Dark | Light backdrop"
      },
      {
        "name": "palette",
        "type": "adjustable",
        "value": "Hue, saturation, and brightness at the boundary"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced motion removes the hover transition"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer50 },
  { ...{
    "id": "editorial-intro",
    "variantOf": "saas-dark",
    "tags": [
      "css",
      "dom",
      "section",
      "editorial",
      "intro",
      "computer",
      "circuits",
      "typography",
      "hero",
      "gradient",
      "unbranded"
    ],
    "category": "Sections",
    "label": "Editorial Intro",
    "thumbnail": "https://threeui.com/thumbnails/editorial-intro.jpg",
    "description": "A centered editorial intro built around a dimly lit device illustration, circuit traces, and oversized gradient typography.",
    "runtime": "DOM + CSS",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 df1b4f032d7e",
    "sourceFiles": [
      "Original HTML — editorial heading and illustration",
      "src/shaders/section-elements/SectionElements.tsx",
      "src/shaders/section-elements/section-elements.css"
    ],
    "passes": "1 layered DOM/SVG composition",
    "interaction": "Subtle device float and circuit drift with reduced-motion fallback",
    "asset": "5 local font subsets + 3 authored SVG illustration layers",
    "assetCount": 8,
    "importName": "EditorialIntroSection",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "React DOM + scoped CSS"
      },
      {
        "name": "source",
        "type": "fixed",
        "value": "Owner-selected reference HTML"
      },
      {
        "name": "theme",
        "type": "fixed",
        "value": "Dark"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Container-relative 16:9 composition"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced-motion safe"
      },
      {
        "name": "assets",
        "type": "owned",
        "value": "Local fonts and illustrations"
      }
    ]
  }, component: CommunityRenderer51 },
  { ...{
    "id": "newsletter-footer",
    "variantOf": "saas-dark",
    "tags": [
      "css",
      "dom",
      "section",
      "footer",
      "form",
      "newsletter",
      "navigation",
      "closing phrase",
      "product",
      "dark",
      "unbranded"
    ],
    "category": "Sections",
    "label": "Newsletter Footer",
    "thumbnail": "https://threeui.com/thumbnails/newsletter-footer.jpg",
    "description": "A dark unbranded product footer with an inline newsletter form, oversized closing phrase, and compact legal navigation.",
    "runtime": "DOM + CSS",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 df1b4f032d7e",
    "sourceFiles": [
      "Original HTML — newsletter footer",
      "src/shaders/section-elements/SectionElements.tsx",
      "src/shaders/section-elements/section-elements.css"
    ],
    "passes": "1 responsive DOM/CSS composition",
    "interaction": "Email validation and animated inline success state",
    "asset": "5 local font subsets + DOM-rendered marker and closing phrase",
    "assetCount": 5,
    "importName": "NewsletterFooterSection",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "React DOM + scoped CSS"
      },
      {
        "name": "source",
        "type": "fixed",
        "value": "Owner-selected reference HTML"
      },
      {
        "name": "theme",
        "type": "fixed",
        "value": "Dark"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "Container-relative 16:9 composition"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced-motion safe"
      },
      {
        "name": "assets",
        "type": "owned",
        "value": "Local fonts and illustrations"
      }
    ]
  }, component: CommunityRenderer52 },
  { ...{
    "id": "character-carousel",
    "tags": [
      "css",
      "dom",
      "ui",
      "carousel",
      "filmstrip",
      "wave",
      "cards",
      "portraits",
      "characters",
      "profiles",
      "editorial",
      "perspective",
      "3d",
      "light mode",
      "dark mode",
      "pointer",
      "wheel",
      "keyboard",
      "responsive",
      "interactive",
      "animated",
      "variants"
    ],
    "category": "UI Elements",
    "label": "Character Carousel",
    "thumbnail": "https://threeui.com/thumbnails/character-carousel.jpg",
    "description": "Two authored editorial character-card carousels collected as a light filmstrip and a dark responsive wave.",
    "runtime": "DOM + CSS",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 4c98939e0e2b",
    "sourceFiles": [
      "character-filmstrip.html — complete authored light filmstrip",
      "character-wave.html — complete authored dark wave",
      "src/shaders/character-carousel/sources/character-filmstrip.html",
      "src/shaders/character-carousel/sources/character-wave.html",
      "src/shaders/character-carousel/CharacterCarousel.tsx"
    ],
    "passes": "1 selected responsive DOM/CSS card composition",
    "interaction": "Pointer focus, wheel and arrow navigation, card selection, idle drift, responsive orientation, scale, speed, opacity, and palette",
    "asset": "4 embedded authored portrait JPEGs shared by both exact source documents",
    "assetCount": 4,
    "importName": "CharacterCarousel",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed authored DOM/CSS documents"
      },
      {
        "name": "variant",
        "type": "prop",
        "value": "\"filmstrip\" | \"wave\""
      },
      {
        "name": "interaction",
        "type": "input",
        "value": "pointer + wheel + keyboard + card focus"
      },
      {
        "name": "lifecycle",
        "type": "host",
        "value": "responsive + visibility-aware + reduced motion"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.7,
        "max": 1.3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "character-filmstrip",
        "label": "Filmstrip",
        "description": "A warm editorial card deck with framed portraits, numbered identity footers, paper grain, and a deep looping perspective rail.",
        "thumbnail": "https://threeui.com/thumbnails/character-filmstrip.jpg",
        "preview": "https://threeui.com/previews/character-filmstrip.webm",
        "props": {
          "variant": "filmstrip"
        }
      },
      {
        "id": "character-wave",
        "label": "Wave",
        "description": "A dark dimensional card wave with colored profile tiles, responsive horizontal-to-vertical motion, and orientation toggling.",
        "thumbnail": "https://threeui.com/thumbnails/character-wave.jpg",
        "preview": "https://threeui.com/previews/character-wave.webm",
        "props": {
          "variant": "wave"
        }
      }
    ]
  }, component: CommunityRenderer53 },
  { ...{
    "id": "character-filmstrip",
    "variantOf": "character-carousel",
    "tags": [
      "css",
      "dom",
      "ui",
      "carousel",
      "filmstrip",
      "cards",
      "portraits",
      "characters",
      "profiles",
      "editorial",
      "paper",
      "grain",
      "beige",
      "perspective",
      "3d",
      "light mode",
      "pointer",
      "wheel",
      "keyboard",
      "responsive",
      "interactive",
      "animated"
    ],
    "category": "UI Elements",
    "label": "Character Filmstrip",
    "thumbnail": "https://threeui.com/thumbnails/character-filmstrip.jpg",
    "description": "A warm editorial character filmstrip with framed portraits, numbered identity footers, paper grain, and a looping perspective rail.",
    "runtime": "DOM + CSS",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 4c98939e0e2b",
    "sourceFiles": [
      "character-filmstrip.html — complete authored source",
      "src/shaders/character-carousel/sources/character-filmstrip.html",
      "src/shaders/character-carousel/CharacterCarousel.tsx"
    ],
    "passes": "1 responsive DOM/CSS card composition",
    "interaction": "Pointer focus, wheel and arrow navigation, card selection, idle drift, scale, speed, opacity, and palette",
    "asset": "4 embedded authored portrait JPEGs",
    "assetCount": 4,
    "importName": "CharacterFilmstrip",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed authored light filmstrip"
      },
      {
        "name": "interaction",
        "type": "input",
        "value": "pointer + wheel + keyboard + card focus"
      },
      {
        "name": "lifecycle",
        "type": "host",
        "value": "responsive + visibility-aware + reduced motion"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.7,
        "max": 1.3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer54 },
  { ...{
    "id": "character-wave",
    "variantOf": "character-carousel",
    "tags": [
      "css",
      "dom",
      "ui",
      "carousel",
      "wave",
      "cards",
      "portraits",
      "characters",
      "profiles",
      "editorial",
      "perspective",
      "3d",
      "dark mode",
      "orientation",
      "pointer",
      "wheel",
      "keyboard",
      "responsive",
      "interactive",
      "animated"
    ],
    "category": "UI Elements",
    "label": "Character Wave",
    "thumbnail": "https://threeui.com/thumbnails/character-wave.jpg",
    "description": "A dark dimensional character-card wave with colored tiles, responsive horizontal-to-vertical motion, and orientation toggling.",
    "runtime": "DOM + CSS",
    "origin": "HTML Pages",
    "sourceCommit": "SHA-256 6726cf0db527",
    "sourceFiles": [
      "character-wave.html — complete authored source",
      "src/shaders/character-carousel/sources/character-wave.html",
      "src/shaders/character-carousel/CharacterCarousel.tsx"
    ],
    "passes": "1 responsive DOM/CSS card composition",
    "interaction": "Pointer focus, wheel and arrow navigation, card selection, double-click/Space orientation, idle drift, scale, speed, opacity, and palette",
    "asset": "4 embedded authored portrait JPEGs",
    "assetCount": 4,
    "importName": "CharacterWave",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed authored dark wave"
      },
      {
        "name": "interaction",
        "type": "input",
        "value": "pointer + wheel + keyboard + card focus + orientation toggle"
      },
      {
        "name": "lifecycle",
        "type": "host",
        "value": "responsive + visibility-aware + reduced motion"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.7,
        "max": 1.3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer55 },
  { ...{
    "id": "gallery",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "ui",
      "gallery",
      "carousel",
      "image ribbon",
      "cylindrical",
      "spiral",
      "editorial",
      "portraits",
      "light mode",
      "paper",
      "grid",
      "responsive",
      "reduced motion",
      "animated"
    ],
    "category": "UI Elements",
    "label": "Gallery",
    "thumbnail": "https://threeui.com/thumbnails/gallery.jpg",
    "description": "The isolated Vantrix hero image ribbon: sixteen curved editorial panels orbiting a vertical cylindrical rail on a quiet paper grid.",
    "runtime": "Three.js r149",
    "origin": "Aura local HTML",
    "sourceCommit": "SHA-256 f7a576d4db08",
    "sourceFiles": [
      "Vantrix Studio Landing Page Template.html — hero carousel only",
      "src/shaders/gallery/Gallery.tsx",
      "src/shaders/gallery/gallery.css",
      "src/shaders/gallery/assets/gallery-1.webp",
      "src/shaders/gallery/assets/gallery-2.webp",
      "src/shaders/gallery/assets/gallery-3.webp",
      "src/shaders/gallery/assets/gallery-4.webp",
      "src/shaders/gallery/assets/gallery-5.webp"
    ],
    "passes": "1 live Three.js scene with 16 textured cylindrical panels",
    "interaction": "Automatic rotation and vertical drift, responsive DPR-capped resize, reduced-motion still frame, and visibility-aware lifecycle",
    "asset": "5 locally optimized authored gallery images",
    "assetCount": 5,
    "importName": "Gallery",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Extracted hero carousel only"
      },
      {
        "name": "geometry",
        "type": "fixed",
        "value": "16 curved cylindrical image panels"
      },
      {
        "name": "motion",
        "type": "prop",
        "value": "speed + scale"
      },
      {
        "name": "lifecycle",
        "type": "host",
        "value": "responsive + visibility-aware + reduced motion"
      },
      {
        "name": "assets",
        "type": "local",
        "value": "5 authored WebP textures"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.7,
        "max": 1.35,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer56 },
  { ...{
    "id": "cloud-field",
    "variantOf": "portal-field",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "background",
      "clouds",
      "fluid",
      "migration",
      "atmosphere",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Cloud Field",
    "thumbnail": "https://threeui.com/thumbnails/cloud-field.jpg",
    "description": "The complete raw-WebGL cloud migration background isolated at its exact source renderer boundary.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 c5a8085b413d",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/strata-cloud.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 raw-WebGL cloud-field pass",
    "interaction": "Authored continuous simulation + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "CloudField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer57 },
  { ...{
    "id": "void-field",
    "variantOf": "predictive-arc",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "background",
      "transparent",
      "abstract",
      "void",
      "field",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Void Field",
    "thumbnail": "https://threeui.com/thumbnails/void-field.jpg",
    "description": "The exact transparent raw-WebGL void field, detached from the article and typography around it.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 5238d91eda85",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/void-protocol.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 raw-WebGL field pass",
    "interaction": "Authored continuous simulation + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "VoidField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer58 },
  { ...{
    "id": "sylva-living-world",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "procedural",
      "moss",
      "roots",
      "arch",
      "ridge",
      "forest",
      "nature",
      "green",
      "ferns",
      "flowers",
      "sakura",
      "cherry blossom",
      "cherry tree",
      "tree",
      "branches",
      "bark",
      "grove",
      "silhouette",
      "backlit",
      "petals",
      "falling petals",
      "maple",
      "autumn",
      "fall",
      "leaves",
      "red",
      "amber",
      "sequoia",
      "redwood",
      "conifer",
      "needles",
      "fog",
      "mist",
      "sunset",
      "sky",
      "pink",
      "peach",
      "pollen",
      "butterfly",
      "instancing",
      "canvas texture",
      "pointer",
      "parallax",
      "interactive",
      "scan light",
      "scene only",
      "responsive",
      "reduced motion",
      "variants"
    ],
    "category": "Three.js",
    "label": "Sylva Living World",
    "thumbnail": "https://threeui.com/thumbnails/sylva-living-world.jpg",
    "description": "The original procedural moss-root world with pale flowers, ferns, drifting pollen, scan light, and a landing butterfly.",
    "runtime": "Three.js r149",
    "origin": "Owner-selected HTML Pages scene",
    "sourceCommit": "SHA-256 fd922291297d",
    "sourceFiles": [
      "src/shaders/sylva-living-world/SylvaLivingWorldScene.tsx",
      "src/shaders/sylva-living-world/sources/inner-green-3d.html",
      "src/shaders/sylva-living-world/sources/inner-green-assets/three.min.js"
    ],
    "passes": "1 live Three.js scene render with procedural ShaderMaterials, CanvasTextures, and instancing",
    "interaction": "Pointer-driven moss parting, camera parallax, pollen trails, scan-light entrance, and butterfly flight",
    "asset": "No binary assets — the canonical HTML and local MIT Three.js runtime are carried as source",
    "assetCount": 0,
    "importName": "SylvaLivingWorldScene",
    "contract": [
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Three.js r149"
      },
      {
        "name": "variant",
        "type": "fixed",
        "value": "Living Green"
      },
      {
        "name": "scene",
        "type": "fixed",
        "value": "Moss roots"
      },
      {
        "name": "presentation",
        "type": "fixed",
        "value": "Scene only; source page UI removed"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Moss response + pollen + parallax"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Visibility + reduced motion"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No binary scene assets"
      }
    ],
    "variants": [
      {
        "id": "living-green",
        "label": "Living Green",
        "description": "The original procedural moss-root world with pale flowers, ferns, drifting pollen, scan light, and a landing butterfly.",
        "thumbnail": "https://threeui.com/thumbnails/sylva-living-world.jpg",
        "preview": "https://threeui.com/previews/sylva-living-world.webm",
        "props": {
          "variant": "living-green"
        }
      }
    ]
  }, component: CommunityRenderer59 },
  { ...{
    "id": "temple-night",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "shader",
      "architecture",
      "japanese",
      "temple",
      "rain",
      "mist",
      "bloom",
      "landscape",
      "procedural"
    ],
    "category": "Three.js",
    "label": "Temple Night",
    "thumbnail": "https://threeui.com/thumbnails/temple-night.jpg",
    "description": "Kage’s procedural Kyoto mountain temple after dark, with the exact authored architecture, rain, mist, leaves, pointer wisps, camera composition, and bloom pipeline.",
    "runtime": "Three.js r149",
    "origin": "HTML Pages",
    "sourceCommit": "4399487d2fb42bce39c7b032fbbb50d230bf4f0b",
    "sourceFiles": [
      "kage-github/index.html — procedural Three.js world",
      "src/shaders/temple-night/templeNightRenderer.js",
      "src/shaders/temple-night/TempleNightScene.tsx"
    ],
    "passes": "17 — scene + 16-pass bloom/composite pipeline",
    "interaction": "Pointer parallax and world-space cursor wisps",
    "asset": "No external scene assets",
    "assetCount": 0,
    "importName": "TempleNightScene",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Three.js r149"
      },
      {
        "name": "variant",
        "type": "fixed",
        "value": "temple-night"
      },
      {
        "name": "scene",
        "type": "fixed",
        "value": "Procedural Kyoto mountain temple world"
      },
      {
        "name": "post",
        "type": "fixed",
        "value": "16 authored passes"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Parallax + motes"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 1.8"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "variants": [
      {
        "id": "temple-night",
        "label": "Temple Night",
        "description": "Kage’s procedural Kyoto mountain temple after dark, with the exact authored architecture, rain, mist, leaves, pointer wisps, camera composition, and bloom pipeline.",
        "thumbnail": "https://threeui.com/thumbnails/temple-night.jpg",
        "preview": "https://threeui.com/previews/temple-night.webm",
        "props": {
          "variant": "temple-night"
        }
      }
    ]
  }, component: CommunityRenderer60 },
  { ...{
    "id": "landscape",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "shader",
      "landscape",
      "terrain",
      "heightfield",
      "polar grid",
      "grass",
      "stones",
      "sky",
      "stars",
      "time of day",
      "sunrise",
      "noon",
      "sunset",
      "night",
      "weather",
      "clear",
      "rain",
      "storm",
      "lightning",
      "snow",
      "blizzard",
      "fog",
      "procedural",
      "pointer",
      "orbit",
      "interactive",
      "variants"
    ],
    "category": "Three.js",
    "label": "Landscape",
    "thumbnail": "https://threeui.com/thumbnails/landscape-sunrise.jpg",
    "description": "A tower-free procedural terrain whose light, sky, fog, stars, rain, lightning, snow, grass, and stones move through seven authored environment states.",
    "runtime": "Three.js r149",
    "origin": "MengTo/towers",
    "sourceCommit": "e8aab488464bcd44471c390cf309597c6f3adb05",
    "sourceFiles": [
      "src/shaders/japanese-tower/Towers.html — exact upstream self-contained source",
      "scripts/generate-landscape.mjs — deterministic tower-free presentation adapter",
      "src/shaders/landscape/LandscapeScene.tsx",
      "public/landscape.html — generated scene-only package asset"
    ],
    "passes": "1 live Three.js render with a polar heightfield, instanced grass and stones, gradient sky, stars, and layered weather",
    "interaction": "Pointer parallax, drag-to-orbit, wheel and pinch zoom, with cross-fading time and weather systems",
    "asset": "No external scene assets — the exact self-contained source carries its runtime and procedural systems",
    "assetCount": 0,
    "importName": "LandscapeScene",
    "contract": [
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Three.js r149"
      },
      {
        "name": "variant",
        "type": "choice",
        "value": "Sunrise / Noon / Sunset / Night / Rain / Storm / Snow"
      },
      {
        "name": "structure",
        "type": "fixed",
        "value": "Tower-free terrain, grass, stones, sky, stars, and weather"
      },
      {
        "name": "time",
        "type": "choice",
        "value": "Morning / Noon / Sunset / Night"
      },
      {
        "name": "weather",
        "type": "choice",
        "value": "Clear / Rain / Storm / Snow"
      },
      {
        "name": "camera",
        "type": "pointer",
        "value": "Orbit + parallax + zoom"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No external scene assets"
      }
    ],
    "variants": [
      {
        "id": "sunrise",
        "label": "Sunrise",
        "description": "Low amber light crossing the grass and distant ridges under the source's warm morning sky.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-sunrise.jpg",
        "preview": "https://threeui.com/previews/landscape-sunrise.webm",
        "props": {
          "variant": "sunrise"
        }
      },
      {
        "id": "noon",
        "label": "Noon",
        "description": "Clear cool daylight with the terrain, moisture colours, stones, and grass at their most legible.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-noon.jpg",
        "preview": "https://threeui.com/previews/landscape-noon.webm",
        "props": {
          "variant": "noon"
        }
      },
      {
        "id": "sunset",
        "label": "Sunset",
        "description": "The ridges and grass settle into long warm light beneath a deepening six-stop sky.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-sunset.jpg",
        "preview": "https://threeui.com/previews/landscape-sunset.webm",
        "props": {
          "variant": "sunset"
        }
      },
      {
        "id": "night",
        "label": "Night",
        "description": "Moonlit terrain beneath 39,200 stars constrained to the landscape camera's visible band.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-night.jpg",
        "preview": "https://threeui.com/previews/landscape-night.webm",
        "props": {
          "variant": "night"
        }
      },
      {
        "id": "rain",
        "label": "Rain",
        "description": "Rain draws in the fog, darkens the ground into puddles, and throws small splashes across the field.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-rain.jpg",
        "preview": "https://threeui.com/previews/landscape-rain.webm",
        "props": {
          "variant": "rain"
        }
      },
      {
        "id": "storm",
        "label": "Storm",
        "description": "A dense sideways downpour over sunset light, with close fog and multi-stroke lightning flashes.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-storm.jpg",
        "preview": "https://threeui.com/previews/landscape-storm.webm",
        "props": {
          "variant": "storm"
        }
      },
      {
        "id": "snow",
        "label": "Snow",
        "description": "Wind-driven snow settles across the terrain, stones, and grass while a blizzard tightens the horizon.",
        "thumbnail": "https://threeui.com/thumbnails/landscape-snow.jpg",
        "preview": "https://threeui.com/previews/landscape-snow.webm",
        "props": {
          "variant": "snow"
        }
      }
    ]
  }, component: CommunityRenderer61 },
  { ...{
    "id": "japanese-tower",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "shader",
      "canvas",
      "canvas2d",
      "landscape",
      "architecture",
      "tower",
      "procedural",
      "japanese",
      "chinese",
      "vietnamese",
      "thai",
      "khmer",
      "ottoman",
      "japan",
      "china",
      "vietnam",
      "thailand",
      "cambodia",
      "turkey",
      "pagoda",
      "tenshu",
      "prang",
      "prasat",
      "mosque"
    ],
    "category": "Three.js",
    "label": "Country Towers",
    "thumbnail": "https://threeui.com/thumbnails/japanese-tower.jpg",
    "description": "Six country-specific towers assembling above a procedural landscape: Japanese, Chinese, Vietnamese, Thai, Khmer, and Ottoman.",
    "runtime": "Three.js r149 + Canvas 2D",
    "origin": "MengTo/towers",
    "sourceCommit": "SHA-256 7810e7163c02",
    "sourceFiles": [
      "Towers.html — complete self-contained Three.js tower and landscape scene",
      "src/shaders/japanese-tower/Towers.html",
      "src/shaders/japanese-tower/JapaneseTowerLandscape.tsx",
      "public/japanese-tower.html — generated scene-only package asset"
    ],
    "passes": "1 live Three.js scene render with six authored architecture builders and procedural CanvasTexture generation",
    "interaction": "Country selection, automatic 4.4-second construction, pointer orbit, hover parallax, pinch and wheel zoom, and camera reset",
    "asset": "1 exact self-contained authored HTML scene with six country architectures, embedded Three.js runtime, procedural landscape, and texture set",
    "assetCount": 1,
    "importName": "JapaneseTowerLandscape",
    "contract": [
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "Three.js r149"
      },
      {
        "name": "country",
        "type": "variant",
        "value": "Japan / China / Vietnam / Thailand / Cambodia / Turkey"
      },
      {
        "name": "structure",
        "type": "fixed",
        "value": "Six authored procedural architectures"
      },
      {
        "name": "landscape",
        "type": "fixed",
        "value": "Terrain + mountains + grass + stones"
      },
      {
        "name": "camera",
        "type": "pointer",
        "value": "Orbit + parallax + zoom"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Runtime + texture set"
      }
    ],
    "variants": [
      {
        "id": "japan",
        "label": "Japan",
        "description": "A Japanese tenshu with an ishigaki stone base, plastered storeys, and flying tiled eaves.",
        "thumbnail": "https://threeui.com/thumbnails/japanese-tower.jpg",
        "preview": "https://threeui.com/previews/japanese-tower.webm",
        "props": {
          "country": "japan"
        }
      },
      {
        "id": "china",
        "label": "China",
        "description": "A Chinese pagoda in vermilion lacquer and green glaze beneath a gilt finial.",
        "thumbnail": "https://threeui.com/thumbnails/tower-china.jpg",
        "preview": "https://threeui.com/previews/tower-china.webm",
        "props": {
          "country": "china"
        }
      },
      {
        "id": "vietnam",
        "label": "Vietnam",
        "description": "A Vietnamese tháp with seven octagonal Huế lime-wash storeys and lifted tiled eaves.",
        "thumbnail": "https://threeui.com/thumbnails/tower-vietnam.jpg",
        "preview": "https://threeui.com/previews/tower-vietnam.webm",
        "props": {
          "country": "vietnam"
        }
      },
      {
        "id": "thailand",
        "label": "Thailand",
        "description": "A Thai prang rising from a stepped plinth into a richly detailed gold spire.",
        "thumbnail": "https://threeui.com/thumbnails/tower-thailand.jpg",
        "preview": "https://threeui.com/previews/tower-thailand.webm",
        "props": {
          "country": "thailand"
        }
      },
      {
        "id": "cambodia",
        "label": "Cambodia",
        "description": "A Khmer prasat on laterite terraces with a redented sanctuary and diminishing sandstone tiers.",
        "thumbnail": "https://threeui.com/thumbnails/tower-cambodia.jpg",
        "preview": "https://threeui.com/previews/tower-cambodia.webm",
        "props": {
          "country": "cambodia"
        }
      },
      {
        "id": "turkey",
        "label": "Turkey",
        "description": "An Ottoman mosque with limestone ashlar, İznik tile, a lead dome, and twin pencil minarets.",
        "thumbnail": "https://threeui.com/thumbnails/tower-turkey.jpg",
        "preview": "https://threeui.com/previews/tower-turkey.webm",
        "props": {
          "country": "turkey"
        }
      }
    ]
  }, component: CommunityRenderer62 },
  { ...{
    "id": "bookshelf",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "books",
      "bookshelf",
      "carousel",
      "room",
      "interaction",
      "page turn",
      "covers",
      "product showcase"
    ],
    "category": "Three.js",
    "label": "Bookshelf",
    "thumbnail": "https://threeui.com/thumbnails/bookshelf.jpg",
    "description": "The exact seven-volume Bookshelf collection with its authored room, carousel shelf, individual cover artwork, foil, pages, inspection, opening, and page-turn system.",
    "runtime": "Three.js r165",
    "origin": "The Bookshelf",
    "sourceCommit": "6ef16625e670b0285bb689bdebffc1d728c6deb1",
    "sourceFiles": [
      "complete-shelf/index.html — exact seven volumes, seven cover crops, and complete renderer",
      "src/shaders/bookshelf/bookshelfRenderer.js",
      "src/shaders/bookshelf/BookshelfScene.tsx"
    ],
    "passes": "1 live scene render + PMREM environment bake",
    "interaction": "Shelf navigation, volume selection, click-to-inspect, cover drag, paginated leaf drag, orbit, pan, and reset",
    "asset": "2 exact embedded owned atlases — cover artwork and walnut texture",
    "assetCount": 2,
    "importName": "BookshelfScene",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Three.js r165"
      },
      {
        "name": "collection",
        "type": "fixed",
        "value": "7 authored volumes"
      },
      {
        "name": "environment",
        "type": "precompute",
        "value": "PMREM room"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Inspect + cover + pages"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "≤ 2"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "2 exact owned atlases"
      }
    ]
  }, component: CommunityRenderer63 },
  { ...{
    "id": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "shader",
      "particles",
      "dome",
      "monochrome",
      "background",
      "drift",
      "horizon",
      "orbital",
      "matrix",
      "expanse",
      "logic core",
      "dimensional",
      "data",
      "topology",
      "nebula",
      "fluid",
      "embers",
      "vortex",
      "collection",
      "variants"
    ],
    "category": "Three.js",
    "label": "Structure Flow",
    "thumbnail": "https://threeui.com/thumbnails/structure-flow.jpg",
    "description": "Thirteen authored Three.js field studies collected as one family, spanning particle domes, horizons, orbital systems, matrices, topology, fluid fields, embers, and vortexes.",
    "runtime": "Three.js r128–r160",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 40eb5bac81e3",
    "sourceFiles": [
      "src/shaders/structure-flow/StructureFlowCollection.tsx",
      "Axiom-Structure-Flow (2).html — Three.js background",
      "src/shaders/structure-flow/structureFlowRenderer.ts",
      "src/shaders/structure-flow/StructureFlowBackground.tsx",
      "src/shaders/emerald-horizon/EmeraldHorizonBackground.tsx",
      "src/shaders/orbital-sphere/OrbitalSphereBackground.tsx",
      "src/shaders/dot-matrix/DotMatrixBackground.tsx",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1–2 Three.js scene, point-cloud, or ShaderMaterial passes",
    "interaction": "Variant-specific pointer, motion, geometry, opacity, mask, and palette controls",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "StructureFlowCollection",
    "contract": [
      {
        "name": "renderer",
        "type": "variant",
        "value": "Three.js r128–r160"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "13 field studies"
      },
      {
        "name": "controls",
        "type": "adaptive",
        "value": "Renderer-specific"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "pointSize",
        "label": "Point size",
        "min": 0.02,
        "max": 0.2,
        "step": 0.005,
        "digits": 3,
        "default": 0.08
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.4
      },
      {
        "key": "maskStart",
        "label": "Mask start",
        "min": 0,
        "max": 0.45,
        "step": 0.01,
        "digits": 2,
        "default": 0.2
      },
      {
        "key": "maskSolid",
        "label": "Mask solid",
        "min": 0.3,
        "max": 0.8,
        "step": 0.01,
        "digits": 2,
        "default": 0.5
      }
    ],
    "variants": [
      {
        "id": "structure-flow",
        "label": "Structure Flow",
        "description": "A masked white particle dome drifting across a dark field.",
        "thumbnail": "https://threeui.com/thumbnails/structure-flow.jpg",
        "preview": "https://threeui.com/previews/structure-flow.webm",
        "props": {
          "variant": "structure-flow"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "pointSize",
            "label": "Point size",
            "min": 0.02,
            "max": 0.2,
            "step": 0.005,
            "digits": 3,
            "default": 0.08
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.05,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 0.4
          },
          {
            "key": "maskStart",
            "label": "Mask start",
            "min": 0,
            "max": 0.45,
            "step": 0.01,
            "digits": 2,
            "default": 0.2
          },
          {
            "key": "maskSolid",
            "label": "Mask solid",
            "min": 0.3,
            "max": 0.8,
            "step": 0.01,
            "digits": 2,
            "default": 0.5
          }
        ]
      },
      {
        "id": "emerald-horizon",
        "label": "Emerald Horizon",
        "description": "A deep emerald shader glow rising from an organic moving horizon.",
        "thumbnail": "https://threeui.com/thumbnails/emerald-horizon.jpg",
        "preview": "https://threeui.com/previews/emerald-horizon.webm",
        "props": {
          "variant": "emerald-horizon"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "waveScale",
            "label": "Wave scale",
            "min": 0,
            "max": 2.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "variation",
            "label": "Variation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "glow",
            "label": "Glow",
            "min": 0.2,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "vignette",
            "label": "Vignette",
            "min": 0,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "orbital-sphere",
        "label": "Orbital Sphere",
        "description": "A violet particle synthesis sphere with encrypted orbital rings and luminous data nodes.",
        "thumbnail": "https://threeui.com/thumbnails/orbital-sphere.jpg",
        "preview": "https://threeui.com/previews/orbital-sphere.webm",
        "props": {
          "variant": "orbital-sphere"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "particleSize",
            "label": "Particle size",
            "min": 0.005,
            "max": 0.04,
            "step": 0.001,
            "digits": 3,
            "default": 0.015
          },
          {
            "key": "particleOpacity",
            "label": "Particles",
            "min": 0.1,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 0.8
          },
          {
            "key": "orbitOpacity",
            "label": "Orbits",
            "min": 0,
            "max": 0.8,
            "step": 0.01,
            "digits": 2,
            "default": 0.25
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "scale",
            "label": "Scale",
            "min": 0.6,
            "max": 1.6,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "haloOpacity",
            "label": "Halos",
            "min": 0,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 0.2
          }
        ]
      },
      {
        "id": "dot-matrix",
        "label": "Dot Matrix",
        "description": "A cyan breathing dot matrix with radial depth fade and smoothed pointer drift.",
        "thumbnail": "https://threeui.com/thumbnails/dot-matrix.jpg",
        "preview": "https://threeui.com/previews/dot-matrix.webm",
        "props": {
          "variant": "dot-matrix"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "gridScale",
            "label": "Grid scale",
            "min": 20,
            "max": 100,
            "step": 1,
            "digits": 0,
            "default": 60
          },
          {
            "key": "mouseAmount",
            "label": "Pointer",
            "min": 0,
            "max": 0.12,
            "step": 0.005,
            "digits": 3,
            "default": 0.04
          },
          {
            "key": "pulseSpeed",
            "label": "Pulse",
            "min": 0,
            "max": 1.2,
            "step": 0.01,
            "digits": 2,
            "default": 0.4
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "radius",
            "label": "Radius",
            "min": 0.03,
            "max": 0.3,
            "step": 0.005,
            "digits": 3,
            "default": 0.15
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.05,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 0.35
          }
        ]
      },
      {
        "id": "expanse-field",
        "label": "Expanse Field",
        "description": "A full-screen ShaderMaterial expanse isolated from its original editorial layout.",
        "thumbnail": "https://threeui.com/thumbnails/expanse-field.jpg",
        "preview": "https://threeui.com/previews/expanse-field.webm",
        "props": {
          "variant": "expanse-field"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "logic-core",
        "label": "Logic Core",
        "description": "An isometric platform, illuminated logic core, and orbiting nodes.",
        "thumbnail": "https://threeui.com/thumbnails/logic-core.jpg",
        "preview": "https://threeui.com/previews/logic-core.webm",
        "props": {
          "variant": "logic-core"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "dimensional-field",
        "label": "Dimensional Field",
        "description": "Dimensional architecture composed from two authored ShaderMaterials.",
        "thumbnail": "https://threeui.com/thumbnails/dimensional-field.jpg",
        "preview": "https://threeui.com/previews/dimensional-field.webm",
        "props": {
          "variant": "dimensional-field"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "data-field",
        "label": "Data Field",
        "description": "A global-data Three.js network visual isolated from its dashboard frame.",
        "thumbnail": "https://threeui.com/thumbnails/data-field.jpg",
        "preview": "https://threeui.com/previews/data-field.webm",
        "props": {
          "variant": "data-field"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "topology-field",
        "label": "Topology Field",
        "description": "A rotating topology graph with connected nodes and rhythmic point pulses.",
        "thumbnail": "https://threeui.com/thumbnails/topology-field.jpg",
        "preview": "https://threeui.com/previews/topology-field.webm",
        "props": {
          "variant": "topology-field"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "nebula",
        "label": "Nebula",
        "description": "An indigo FBM nebula with pointer drift, breathing light, and vignette.",
        "thumbnail": "https://threeui.com/thumbnails/nebula.jpg",
        "preview": "https://threeui.com/previews/nebula.webm",
        "props": {
          "variant": "nebula"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "fluid-field",
        "label": "Fluid Field",
        "description": "A blue-violet animated fluid ShaderMaterial.",
        "thumbnail": "https://threeui.com/thumbnails/fluid-field.jpg",
        "preview": "https://threeui.com/previews/fluid-field.webm",
        "props": {
          "variant": "fluid-field"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "ember-storm",
        "label": "Ember Storm",
        "description": "A 12,000-particle ember vortex with additive heat grading and flicker.",
        "thumbnail": "https://threeui.com/thumbnails/ember-storm.jpg",
        "preview": "https://threeui.com/previews/ember-storm.webm",
        "props": {
          "variant": "ember-storm"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "flux-vortex",
        "label": "Flux Vortex",
        "description": "A blooming particle vortex with spiral filaments and post-process glow.",
        "thumbnail": "https://threeui.com/thumbnails/flux-vortex.jpg",
        "preview": "https://threeui.com/previews/flux-vortex.webm",
        "props": {
          "variant": "flux-vortex"
        },
        "controls": [
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "size",
            "label": "Size",
            "min": 0.35,
            "max": 2.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "length",
            "label": "Length",
            "min": 0.35,
            "max": 2.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "density",
            "label": "Density",
            "min": 0.25,
            "max": 2.5,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "opacity",
            "label": "Opacity",
            "min": 0.05,
            "max": 1,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer64 },
  { ...{
    "id": "emerald-horizon",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "shader",
      "glow",
      "horizon",
      "emerald",
      "green",
      "organic",
      "background"
    ],
    "category": "Three.js",
    "label": "Emerald Horizon",
    "thumbnail": "https://threeui.com/thumbnails/emerald-horizon.jpg",
    "description": "A deep emerald shader glow rising from an organic moving horizon.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 66211b279456",
    "sourceFiles": [
      "Lumina---Platform-Intelligence.html — Three.js shader background",
      "src/shaders/emerald-horizon/emeraldHorizonShaders.ts",
      "src/shaders/emerald-horizon/EmeraldHorizonBackground.tsx"
    ],
    "passes": "1 Three.js shader pass",
    "interaction": "Customizable motion, waves, variation, hue, glow, and vignette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "EmeraldHorizonBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Three.js r128"
      },
      {
        "name": "geometry",
        "type": "fixed",
        "value": "Fullscreen plane"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "waveScale",
        "label": "Wave scale",
        "min": 0,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "variation",
        "label": "Variation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "glow",
        "label": "Glow",
        "min": 0.2,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "vignette",
        "label": "Vignette",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer65 },
  { ...{
    "id": "orbital-sphere",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "particles",
      "sphere",
      "rings",
      "data",
      "nodes",
      "orbit",
      "violet"
    ],
    "category": "Three.js",
    "label": "Orbital Sphere",
    "thumbnail": "https://threeui.com/thumbnails/orbital-sphere.jpg",
    "description": "A violet particle synthesis sphere with six encrypted orbital rings and luminous data nodes.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 2fde5ec9da60",
    "sourceFiles": [
      "Nexis-Dynamics-Global-Synthesis (1).html — Three.js background",
      "src/shaders/orbital-sphere/orbitalSphereRenderer.ts",
      "src/shaders/orbital-sphere/OrbitalSphereBackground.tsx"
    ],
    "passes": "1 Three.js particle-network pass",
    "interaction": "Customizable particles, rings, hue, scale, halos, and motion",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "OrbitalSphereBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Three.js r128"
      },
      {
        "name": "particles",
        "type": "fixed",
        "value": "15,000 seeds"
      },
      {
        "name": "orbits",
        "type": "fixed",
        "value": "6"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "particleSize",
        "label": "Particle size",
        "min": 0.005,
        "max": 0.04,
        "step": 0.001,
        "digits": 3,
        "default": 0.015
      },
      {
        "key": "particleOpacity",
        "label": "Particles",
        "min": 0.1,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.8
      },
      {
        "key": "orbitOpacity",
        "label": "Orbits",
        "min": 0,
        "max": 0.8,
        "step": 0.01,
        "digits": 2,
        "default": 0.25
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "scale",
        "label": "Scale",
        "min": 0.6,
        "max": 1.6,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "haloOpacity",
        "label": "Halos",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.2
      }
    ]
  }, component: CommunityRenderer66 },
  { ...{
    "id": "dot-matrix",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "particles",
      "dots",
      "dot matrix",
      "grid",
      "cyan",
      "pointer",
      "depth"
    ],
    "category": "Three.js",
    "label": "Dot Matrix",
    "thumbnail": "https://threeui.com/thumbnails/dot-matrix.jpg",
    "description": "A cyan breathing dot matrix with radial depth fade and smoothed pointer drift, extracted from the exact Neuform uplink background.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 de2d7aded998",
    "sourceFiles": [
      "Nexus-Core-Uplink (1).html — Three.js shader background",
      "src/shaders/dot-matrix/dotMatrixShaders.ts",
      "src/shaders/dot-matrix/DotMatrixBackground.tsx"
    ],
    "passes": "1 Three.js shader pass",
    "interaction": "Smoothed pointer drift plus customizable color and grid pulse",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "DotMatrixBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Three.js r128"
      },
      {
        "name": "geometry",
        "type": "fixed",
        "value": "Fullscreen plane"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "gridScale",
        "label": "Grid scale",
        "min": 20,
        "max": 100,
        "step": 1,
        "digits": 0,
        "default": 60
      },
      {
        "key": "mouseAmount",
        "label": "Pointer",
        "min": 0,
        "max": 0.12,
        "step": 0.005,
        "digits": 3,
        "default": 0.04
      },
      {
        "key": "pulseSpeed",
        "label": "Pulse",
        "min": 0,
        "max": 1.2,
        "step": 0.01,
        "digits": 2,
        "default": 0.4
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "radius",
        "label": "Radius",
        "min": 0.03,
        "max": 0.3,
        "step": 0.005,
        "digits": 3,
        "default": 0.15
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.35
      }
    ]
  }, component: CommunityRenderer67 },
  { ...{
    "id": "warp-field",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "particles",
      "streaks",
      "tiles",
      "space",
      "fog",
      "emerald",
      "warp",
      "letters",
      "glyphs",
      "typography",
      "keycaps",
      "keyboard",
      "hyperspace",
      "tunnel",
      "background"
    ],
    "category": "Three.js",
    "label": "Warp Field",
    "thumbnail": "https://threeui.com/thumbnails/warp-field.jpg",
    "description": "Nexus’s focused hero warp: 400 emerald additive streaks and 40 luminous tiles streaming through an authored deep-space fog field.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 bd7c486164d8",
    "sourceFiles": [
      "Nexus-Edge-Compute.html — hero warp scene",
      "src/shaders/warp-field/warpFieldRenderer.ts",
      "src/shaders/warp-field/WarpFieldBackground.tsx"
    ],
    "passes": "1 Three.js scene render",
    "interaction": "Customizable speed, streaks, tiles, color, camera, and brightness",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "WarpFieldBackground",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Three.js r128"
      },
      {
        "name": "variant",
        "type": "optional",
        "value": "streaks | letters | keycaps | hyperspace"
      },
      {
        "name": "streaks",
        "type": "fixed",
        "value": "400"
      },
      {
        "name": "tiles",
        "type": "fixed",
        "value": "40"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "None"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 40,
        "step": 0.5,
        "digits": 1,
        "default": 15
      },
      {
        "key": "streakOpacity",
        "label": "Streaks",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.6
      },
      {
        "key": "tileOpacity",
        "label": "Payload",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.9
      },
      {
        "key": "fov",
        "label": "Camera",
        "min": 45,
        "max": 110,
        "step": 1,
        "digits": 0,
        "default": 75
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.4,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "streaks",
        "label": "Warp Field",
        "description": "The original hero warp: 400 emerald streaks and 40 luminous tiles through deep-space fog.",
        "thumbnail": "https://threeui.com/thumbnails/warp-field.jpg",
        "preview": "https://threeui.com/previews/warp-field.webm",
        "props": {}
      },
      {
        "id": "letters",
        "label": "Letter Storm",
        "description": "160 tumbling glyphs wandering off the rails while the streak field keeps the corridor moving.",
        "thumbnail": "https://threeui.com/thumbnails/warp-field-letters.jpg",
        "preview": "https://threeui.com/previews/warp-field-letters.webm",
        "props": {
          "variant": "letters"
        }
      },
      {
        "id": "keycaps",
        "label": "Keycap Drift",
        "description": "72 lit mechanical keycaps tumbling through a 900-spark particle wake.",
        "thumbnail": "https://threeui.com/thumbnails/warp-field-keycaps.jpg",
        "preview": "https://threeui.com/previews/warp-field-keycaps.webm",
        "props": {
          "variant": "keycaps"
        }
      },
      {
        "id": "hyperspace",
        "label": "Hyperspace",
        "description": "1,200 ice-blue streaks stretched down a scrolling tunnel toward a pulsing jump core.",
        "thumbnail": "https://threeui.com/thumbnails/warp-field-hyperspace.jpg",
        "preview": "https://threeui.com/previews/warp-field-hyperspace.webm",
        "props": {
          "variant": "hyperspace"
        }
      }
    ]
  }, component: CommunityRenderer68 },
  { ...{
    "id": "expanse-field",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "shadermaterial",
      "background",
      "fullscreen",
      "abstract"
    ],
    "category": "Three.js",
    "label": "Expanse Field",
    "thumbnail": "https://threeui.com/thumbnails/expanse-field.jpg",
    "description": "The exact full-screen Three.js ShaderMaterial expanse isolated without editorial text or navigation.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 ab59bc2faa9d",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/digital-expanse.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Three.js ShaderMaterial pass",
    "interaction": "Authored animation + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ExpanseField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer69 },
  { ...{
    "id": "logic-core",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "isometric",
      "platform",
      "nodes",
      "lighting",
      "core",
      "technology"
    ],
    "category": "Three.js",
    "label": "Logic Core",
    "thumbnail": "https://threeui.com/thumbnails/logic-core.jpg",
    "description": "The exact isometric platform, logic core, orbiting nodes, and source lighting without its card copy.",
    "runtime": "Three.js r136",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 d10a151ba858",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/platform-core.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Three.js scene pass",
    "interaction": "Authored orbital motion + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "LogicCoreField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer70 },
  { ...{
    "id": "dimensional-field",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "shadermaterial",
      "architecture",
      "background",
      "abstract"
    ],
    "category": "Three.js",
    "label": "Dimensional Field",
    "thumbnail": "https://threeui.com/thumbnails/dimensional-field.jpg",
    "description": "The exact dimensional architecture background with both authored ShaderMaterials and complete Three.js scene.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 04043ca75f25",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/vanguard-dimensional.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "2 ShaderMaterials in 1 scene pass",
    "interaction": "Pointer-responsive scene + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "DimensionalField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer71 },
  { ...{
    "id": "data-field",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "data",
      "visualization",
      "global",
      "dashboard",
      "network",
      "background"
    ],
    "category": "Three.js",
    "label": "Data Field",
    "thumbnail": "https://threeui.com/thumbnails/data-field.jpg",
    "description": "The exact global-data Three.js visual isolated from its dashboard frame and text content.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 c03bd8acda07",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/vertex-9.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Three.js scene pass",
    "interaction": "Authored scene motion + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "DataField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer72 },
  { ...{
    "id": "topology-field",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "graph",
      "network",
      "nodes",
      "connections",
      "topology",
      "pulse",
      "data visualization"
    ],
    "category": "Three.js",
    "label": "Topology Field",
    "thumbnail": "https://threeui.com/thumbnails/topology-field.jpg",
    "description": "The exact rotating topology graph, connections, and point pulse system from the selected source.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 2cf632d75ed5",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/nexus-topology.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "1 Three.js topology pass",
    "interaction": "Authored rotation and node pulse + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "TopologyField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer73 },
  { ...{
    "id": "halftone-flow",
    "variantOf": "predictive-arc",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "background",
      "halftone",
      "dots",
      "flow field",
      "orange",
      "red",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Halftone Flow",
    "thumbnail": "https://threeui.com/thumbnails/halftone-flow.jpg",
    "description": "The exact red-orange raw-WebGL flow field resolved through its authored six-pixel halftone matrix.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 fa1a015ae407",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/nexus-unified-flow.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx"
    ],
    "passes": "1 raw-WebGL halftone flow pass",
    "interaction": "Authored flow animation + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "HalftoneFlow",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer74 },
  { ...{
    "id": "neon-sign",
    "variantOf": "article-headings",
    "tags": [
      "canvas",
      "canvas2d",
      "typography",
      "neon",
      "sign",
      "lettering",
      "bloom",
      "flicker",
      "glow",
      "tubing",
      "animated"
    ],
    "category": "Text Animation",
    "label": "Neon Typography",
    "thumbnail": "https://threeui.com/thumbnails/neon-sign.jpg",
    "description": "Hand-shaped neon lettering animated with a slow typographic breath and recurring electrical flicker — tubing geometry, electrodes, and bloom on a neutral field.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 1545c354af8d",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/glassblown-neon.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx"
    ],
    "passes": "1 layered Canvas 2D neon composition",
    "interaction": "Continuous typographic breath + recurring electrical flicker + synchronized monochrome dark/light mode",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "NeonTypography",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Centered typography sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "appearance",
        "type": "fixed",
        "value": "Monochrome"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.7,
        "max": 1.3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer75 },
  { ...{
    "id": "engraved-certificate",
    "tags": [
      "canvas",
      "canvas2d",
      "css",
      "dom",
      "ui",
      "certificate",
      "guilloche",
      "engraving",
      "rosette",
      "vintage",
      "responsive"
    ],
    "category": "UI Elements",
    "label": "Engraved Certificate",
    "thumbnail": "https://threeui.com/thumbnails/engraved-certificate.jpg",
    "description": "A responsive engraved certificate: plate field, dual guilloche rosettes, and a drifting harmonic pass that auto-cycles through four cam states.",
    "runtime": "Canvas 2D + DOM/CSS",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 dc48266f23df",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/kinetic-lathe-certificate.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx"
    ],
    "passes": "3 Canvas 2D engraving passes + DOM certificate",
    "interaction": "Auto-cycled cam configurations + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "EngravedCertificate",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer76 },
  { ...{
    "id": "woven-cloth",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "cloth",
      "fabric",
      "textile",
      "typography",
      "deformation",
      "simulation",
      "procedural",
      "animated"
    ],
    "category": "Three.js",
    "label": "Woven Cloth",
    "thumbnail": "https://threeui.com/thumbnails/woven-cloth.jpg",
    "description": "A Three.js woven-cloth simulation with Woven Cloth typography printed into its procedural textile so every letter deforms with the fabric, and three companion cloths woven around the same Verlet sheet.",
    "runtime": "Three.js r160",
    "origin": "Neuform export with first-party companion cloths",
    "sourceCommit": "SHA-256 9bfd56ef7579",
    "sourceFiles": [
      "src/shaders/woven-cloth/WovenCloth.tsx",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx",
      "src/shaders/neuform-isolated/sources/lumina-weavers-cloth.html",
      "src/shaders/woven-cloth/woven-cloth-iridescent.html",
      "src/shaders/woven-cloth/woven-cloth-atelier.html",
      "src/shaders/woven-cloth/woven-cloth-washi.html"
    ],
    "passes": "1 Three.js cloth scene pass per variant, plus a bright-pass bloom on the iridescent silk",
    "interaction": "Variant selection; typography deforms with the authored textile motion + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "WovenCloth",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML for the base cloth"
      },
      {
        "name": "variant",
        "type": "optional",
        "value": "Woven Cloth | Iridescent Silk | Atelier Flag | Washi Noren"
      },
      {
        "name": "companions",
        "type": "original",
        "value": "Three first-party documents; the packaged export is untouched"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "woven-cloth",
        "label": "Woven Cloth",
        "description": "The packaged Neuform export, untouched: an ivory banner with a crimson hem and the Woven Cloth wordmark printed into the weave, pinned along its top edge.",
        "thumbnail": "https://threeui.com/thumbnails/woven-cloth.jpg",
        "preview": "https://threeui.com/previews/woven-cloth.webm",
        "props": {}
      },
      {
        "id": "iridescent",
        "label": "Iridescent Silk",
        "description": "A five-harness satin under a painted studio environment: a thin-film interference layer whose thickness sweeps one full order across the width, so the colour travels over the folds while the wordmark stays a tone-on-tone jacquard.",
        "thumbnail": "https://threeui.com/thumbnails/woven-cloth-iridescent.jpg",
        "preview": "https://threeui.com/previews/woven-cloth-iridescent.webm",
        "props": {
          "variant": "iridescent"
        }
      },
      {
        "id": "atelier",
        "label": "Atelier Flag",
        "description": "The same sheet cut and sewn: three linen panels joined by flat-felled seams and topstitching, an indigo heading tape on the hoist with brass grommets and a mast, hemmed at the fly, and a woven label tacked on at the corner.",
        "thumbnail": "https://threeui.com/thumbnails/woven-cloth-atelier.jpg",
        "preview": "https://threeui.com/previews/woven-cloth-atelier.webm",
        "props": {
          "variant": "atelier"
        }
      },
      {
        "id": "washi",
        "label": "Washi Noren",
        "description": "An indigo-dyed kozo noren on a wooden rod, backlit through a shoji: laid and chain lines from the papermaking screen, a torn deckle edge cut by an alpha mask, and slits that free three panels to sway on their own.",
        "thumbnail": "https://threeui.com/thumbnails/woven-cloth-washi.jpg",
        "preview": "https://threeui.com/previews/woven-cloth-washi.webm",
        "props": {
          "variant": "washi"
        }
      }
    ]
  }, component: CommunityRenderer77 },
  { ...{
    "id": "nebula",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "shadermaterial",
      "nebula",
      "space",
      "fbm",
      "noise",
      "pointer",
      "indigo"
    ],
    "category": "Three.js",
    "label": "Nebula",
    "thumbnail": "https://threeui.com/thumbnails/nebula.jpg",
    "description": "The exact indigo Three.js ShaderMaterial nebula with four-octave FBM, pointer drift, breathing light, and vignette.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 e4f3bda31a5c",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/julian-vance-nebula.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx"
    ],
    "passes": "1 Three.js ShaderMaterial pass",
    "interaction": "Smoothed pointer drift + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "NebulaBackground",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer78 },
  { ...{
    "id": "fluid-field",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "glsl",
      "shader",
      "shadermaterial",
      "fluid",
      "blue",
      "violet",
      "background"
    ],
    "category": "Three.js",
    "label": "Fluid Field",
    "thumbnail": "https://threeui.com/thumbnails/fluid-field.jpg",
    "description": "A blue-violet fluid ShaderMaterial, isolated from the surrounding editor interface.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 ee863f4e0155",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/aura-ui-fluid.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx"
    ],
    "passes": "1 Three.js ShaderMaterial pass",
    "interaction": "Authored fluid animation + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "FluidFieldBackground",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer79 },
  { ...{
    "id": "ember-storm",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "particles",
      "vortex",
      "fire",
      "heat",
      "embers",
      "orange",
      "additive",
      "animated"
    ],
    "category": "Three.js",
    "label": "Ember Storm",
    "thumbnail": "https://threeui.com/thumbnails/ember-storm.jpg",
    "description": "The exact 12,000-particle Three.js ember vortex with additive heat grading, flicker, and visibility-aware lifecycle.",
    "runtime": "Three.js r160",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 e3badd0308b5",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/aeonix-ember-storm.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx"
    ],
    "passes": "1 Three.js particle ShaderMaterial pass",
    "interaction": "Authored vortex motion + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "EmberStorm",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer80 },
  { ...{
    "id": "performance-gauges",
    "tags": [
      "css",
      "dom",
      "ui",
      "gauges",
      "dashboard",
      "diagnostics",
      "needles",
      "instruments",
      "telemetry",
      "animated",
      "variants",
      "tachometer",
      "speedometer",
      "boost",
      "ev",
      "skeuomorphic"
    ],
    "category": "CSS",
    "label": "Performance Gauges",
    "thumbnail": "https://threeui.com/thumbnails/performance-gauges.jpg",
    "description": "Four layered CSS instruments — tachometer, speedometer, turbo boost, and EV power — each isolated to one full-bleed dial with polar tick geometry, scale bands, and a self-testing needle sweep.",
    "runtime": "DOM + CSS",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 2dc25058fc85",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/performance-gauges.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx"
    ],
    "passes": "4 layered CSS gauge compositions, one per variant",
    "interaction": "Self-test needle sweep, settle, and idle flutter with a counting readout + optional final-frame palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "PerformanceGauges",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "tachometer",
        "label": "Tachometer",
        "description": "Orange sunburst dial reading 0–7000 r/min with a redline band, a machined oil-temperature sub-dial, and a counterweighted red needle.",
        "thumbnail": "https://threeui.com/thumbnails/performance-gauges.jpg",
        "preview": "https://threeui.com/previews/performance-gauges.webm",
        "props": {
          "variant": "tachometer"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "speedometer",
        "label": "Speedometer",
        "description": "0–160 km/h scale whose travelled arc fills behind the needle, with a peak-hold marker, counting digital readout, and rolling odometer.",
        "thumbnail": "https://threeui.com/thumbnails/performance-gauges-speedometer.jpg",
        "preview": "https://threeui.com/previews/performance-gauges-speedometer.webm",
        "props": {
          "variant": "speedometer"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "boost",
        "label": "Turbo Boost",
        "description": "Navy −1.0 to 1.5 bar dial that separates the vacuum half from the pressure half and flags the wastegate threshold with a pulsing overboost lamp.",
        "thumbnail": "https://threeui.com/thumbnails/performance-gauges-boost.jpg",
        "preview": "https://threeui.com/previews/performance-gauges-boost.webm",
        "props": {
          "variant": "boost"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "power",
        "label": "EV Power",
        "description": "Regeneration-to-power scale that fills its track from zero, with a green charge segment, kilowatt readout, and battery state-of-charge bar.",
        "thumbnail": "https://threeui.com/thumbnails/performance-gauges-power.jpg",
        "preview": "https://threeui.com/previews/performance-gauges-power.webm",
        "props": {
          "variant": "power"
        },
        "controls": [
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer81 },
  { ...{
    "id": "uplink-loader",
    "tags": [
      "css",
      "dom",
      "javascript",
      "ui",
      "loading",
      "loader",
      "progress",
      "uplink",
      "telemetry",
      "technical",
      "sci-fi",
      "terminal",
      "green",
      "neon",
      "scanlines",
      "grain",
      "animated",
      "dark mode",
      "responsive"
    ],
    "category": "CSS",
    "label": "Uplink Loader",
    "thumbnail": "https://threeui.com/thumbnails/uplink-loader.jpg",
    "description": "A cinematic secure-uplink loader with stepped progress, illuminated telemetry ticks, neon readouts, technical corner markers, mirrored side rails, scanlines, and procedural grain.",
    "runtime": "DOM + CSS + JavaScript",
    "origin": "Owner-selected HTML",
    "sourceCommit": "SHA-256 f73bb2963501",
    "sourceFiles": [
      "src/shaders/uplink-loader/uplink-loader.html",
      "src/shaders/uplink-loader/UplinkLoader.tsx"
    ],
    "passes": "1 DOM/CSS loader composition",
    "interaction": "Autonomous stepped progress sequence with phase labels, completion hold, and reset glitch",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "UplinkLoader",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact owner-selected HTML"
      },
      {
        "name": "renderer",
        "type": "sandbox",
        "value": "DOM + CSS + JavaScript"
      },
      {
        "name": "layout",
        "type": "responsive",
        "value": "1200 × 800 stage scaled to fit"
      },
      {
        "name": "motion",
        "type": "autonomous",
        "value": "Stepped progress + completion hold + reset"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ]
  }, component: CommunityRenderer82 },
  { ...{
    "id": "koi-studies",
    "tags": [
      "css",
      "css3d",
      "dom",
      "canvas",
      "canvas2d",
      "webgl",
      "ui",
      "cards",
      "card stack",
      "koi",
      "japanese",
      "halftone",
      "pixel mask",
      "drag",
      "tap",
      "keyboard",
      "pointer",
      "interactive",
      "responsive",
      "dark mode",
      "animated"
    ],
    "category": "CSS",
    "label": "Koi Studies",
    "thumbnail": "https://threeui.com/thumbnails/koi-studies.jpg",
    "description": "A tactile stack of three Japanese koi studies with CSS 3D depth, pointer tilt, drag and keyboard navigation, pixel-mask reveals, and animated halftone imagery.",
    "runtime": "DOM + CSS 3D + Canvas 2D + WebGL",
    "origin": "Owner-supplied HTML Pages source",
    "sourceCommit": "SHA-256 32cf6493414a",
    "sourceFiles": [
      "public/synthralos-halftone.html — byte-exact complete source",
      "src/shaders/koi-studies/KoiStudies.tsx"
    ],
    "passes": "3 Canvas 2D halftone card faces + 1 CSS 3D stack + 1 ambient shader canvas",
    "interaction": "Drag, tap, or use the arrow keys to cycle cards, with pointer tilt, reveal trails, responsive layout, and reduced-motion behavior",
    "asset": "3 embedded JPEGs + 3 embedded MP4 clips + 1 inline halftone mask; the optional authored CDN shader has a CSS fallback",
    "assetCount": 7,
    "importName": "KoiStudies",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed authored DOM/CSS/Canvas document"
      },
      {
        "name": "cards",
        "type": "fixed",
        "value": "Kōhaku + Shūsui + Utsuri"
      },
      {
        "name": "interaction",
        "type": "input",
        "value": "pointer drag + tap + keyboard + hover tilt"
      },
      {
        "name": "halftone",
        "type": "fixed",
        "value": "300-frame inline pixel mask at 30 fps"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "3 JPEGs + 3 MP4 clips + inline mask"
      },
      {
        "name": "fallback",
        "type": "adaptive",
        "value": "CSS field when the optional remote shader is unavailable"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced motion, reduced transparency, visibility, and focus aware"
      }
    ]
  }, component: CommunityRenderer83 },
  { ...{
    "id": "article-headings",
    "tags": [
      "css",
      "dom",
      "canvas",
      "canvas2d",
      "typography",
      "text animation",
      "scramble",
      "decode",
      "heading",
      "noise",
      "editorial",
      "neon",
      "intro",
      "particles",
      "wordmark",
      "audio",
      "visualizer",
      "light mode",
      "dark mode",
      "animated",
      "variants"
    ],
    "category": "Text Animation",
    "label": "Article Headings",
    "thumbnail": "https://threeui.com/thumbnails/article-headings.jpg",
    "description": "Three expressive text treatments collected in one family: a chromatic intro, a particle wordmark, and an audio-reactive identity lockup.",
    "runtime": "DOM/CSS + Canvas 2D",
    "origin": "Sable V1 + owner-selected HTML + Neuform export",
    "sourceCommit": "5a736cd3c1f6f19802f61ebb10e1701b9f7aa26e / SHA-256 e14795f24ea8 / 8d2cfccf1140 / 26f0d8d04494 / 1545c354af8d",
    "sourceFiles": [
      "ascii-page-transition-v1.html — article headings and decode lifecycle",
      "src/shaders/article-headings/TextAnimationCollection.tsx",
      "src/shaders/article-headings/articleHeadingDecode.ts",
      "src/shaders/article-headings/ArticleHeadings.tsx",
      "src/shaders/neuform-isolated/sources/glassblown-neon.html",
      "src/shaders/neuform-isolated/sources/creator-studio-intro.html",
      "src/shaders/neuform-isolated/sources/epilude-footer.html",
      "src/shaders/neuform-isolated/sources/audio-wordmark.html",
      "src/shaders/neuform-isolated/NeuformCraftEffects.tsx",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
      "src/shaders/fonts/fragment-mono.woff2"
    ],
    "passes": "Variant-dependent DOM/CSS or one to two Canvas 2D passes",
    "interaction": "Authored text motion with responsive presentation, reduced-motion handling, and synchronized light/dark mode",
    "asset": "Exact embedded Fragment Mono font; all other sources and marks are bundled inline",
    "assetCount": 1,
    "importName": "TextAnimationCollection",
    "contract": [
      {
        "name": "renderer",
        "type": "variant",
        "value": "DOM/CSS or Canvas 2D"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Intro | Particle | Audio"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced-motion aware"
      },
      {
        "name": "assets",
        "type": "bundled",
        "value": "Fragment Mono + inline source documents"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "duration",
        "label": "Duration",
        "min": 150,
        "max": 1600,
        "step": 10,
        "digits": 0,
        "default": 560
      },
      {
        "key": "stagger",
        "label": "Stagger",
        "min": 0,
        "max": 500,
        "step": 10,
        "digits": 0,
        "default": 140
      },
      {
        "key": "scrambleLength",
        "label": "Scramble length",
        "min": 1,
        "max": 20,
        "step": 1,
        "digits": 0,
        "default": 10
      },
      {
        "key": "preserveChance",
        "label": "Preserve",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.3
      },
      {
        "key": "tailChance",
        "label": "Tail noise",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.18
      }
    ],
    "variants": [
      {
        "id": "threeui-intro",
        "label": "Intro Text",
        "description": "The opening chromatic ThreeUI wordmark assembly, isolated to its first authored beat.",
        "thumbnail": "https://threeui.com/thumbnails/threeui-intro.jpg",
        "preview": "https://threeui.com/previews/threeui-intro.webm",
        "props": {
          "variant": "threeui-intro"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "particle-wordmark",
        "label": "Particle Wordmark",
        "description": "The Shaders wordmark materializes through a seeded field of drifting dots and squares.",
        "thumbnail": "https://threeui.com/thumbnails/particle-wordmark.jpg",
        "preview": "https://threeui.com/previews/particle-wordmark.webm",
        "props": {
          "variant": "particle-wordmark"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      },
      {
        "id": "audio-wordmark",
        "label": "Audio Wordmark",
        "description": "Animated circular audio-bar fields paired with a compact ThreeUI wordmark and icon lockup.",
        "thumbnail": "https://threeui.com/thumbnails/audio-wordmark.jpg",
        "preview": "https://threeui.com/previews/audio-wordmark.webm",
        "props": {
          "variant": "audio-wordmark"
        },
        "controls": [
          {
            "kind": "choice",
            "key": "mode",
            "label": "Mode",
            "default": "dark",
            "options": [
              {
                "value": "dark",
                "label": "Dark"
              },
              {
                "value": "light",
                "label": "Light"
              }
            ]
          },
          {
            "key": "hue",
            "label": "Hue",
            "min": -180,
            "max": 180,
            "step": 1,
            "digits": 0,
            "default": 0
          },
          {
            "key": "saturation",
            "label": "Saturation",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "brightness",
            "label": "Brightness",
            "min": 0.35,
            "max": 1.65,
            "step": 0.01,
            "digits": 2,
            "default": 1
          }
        ]
      }
    ]
  }, component: CommunityRenderer84 },
  { ...{
    "id": "animated-top-dock",
    "tags": [
      "css",
      "dom",
      "ui",
      "navigation",
      "dock",
      "spring",
      "glass",
      "liquid glass",
      "proximity",
      "responsive",
      "menu",
      "top menu",
      "header",
      "navbar",
      "command bar",
      "logo",
      "cta",
      "animated",
      "modern",
      "retro",
      "pixel",
      "pixel art",
      "dither",
      "shader",
      "glsl",
      "webgl",
      "noise",
      "threejs",
      "three.js",
      "3d",
      "refraction",
      "dispersion",
      "particles",
      "variants",
      "hover",
      "pointer",
      "interactive",
      "dark mode"
    ],
    "category": "CSS",
    "label": "Animated Top Dock",
    "thumbnail": "https://threeui.com/thumbnails/animated-top-dock.jpg",
    "description": "Sable’s proximity-spring menu in four fits: the authored centred dock, a modern command bar, a fitted pixel-terminal strip, and a vertical refracting Three.js glass rail.",
    "runtime": "DOM + CSS + WebGL + Three.js r128",
    "origin": "Sable V1 + ThreeUI original",
    "sourceCommit": "5a736cd3c1f6f19802f61ebb10e1701b9f7aa26e",
    "sourceFiles": [
      "ascii-page-transition-v1.html — exact top menu dock",
      "src/shaders/animated-top-dock/topDockController.ts",
      "src/shaders/animated-top-dock/AnimatedTopDock.tsx",
      "src/shaders/animated-top-dock/retroPixelField.ts",
      "src/shaders/animated-top-dock/glassParticleField.ts",
      "src/shaders/fonts/fragment-mono.woff2"
    ],
    "passes": "1 spring layout pass across every dock item, plus 1 shader pass on the pixel and glass variants",
    "interaction": "Pointer proximity, keyboard focus, active selection, pointer parallax, reduced motion, and mobile static mode",
    "asset": "Exact embedded Fragment Mono font extracted from the authored source",
    "assetCount": 1,
    "importName": "AnimatedTopDock",
    "contract": [
      {
        "name": "renderer",
        "type": "variant",
        "value": "DOM + CSS, raw WebGL, or Three.js r128"
      },
      {
        "name": "variant",
        "type": "optional",
        "value": "sable | modern | retro | glass"
      },
      {
        "name": "fit",
        "type": "variant",
        "value": "centred | horizontal | vertical"
      },
      {
        "name": "items",
        "type": "fixed",
        "value": "1 brand + 5 menu items"
      },
      {
        "name": "proximity",
        "type": "default",
        "value": "122 px"
      },
      {
        "name": "spring",
        "type": "default",
        "value": "0.19 / 0.70"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Pointer + focus + reduced motion"
      }
    ],
    "controls": [
      {
        "key": "proximity",
        "label": "Proximity",
        "min": 60,
        "max": 220,
        "step": 1,
        "digits": 0,
        "default": 122
      },
      {
        "key": "spring",
        "label": "Spring",
        "min": 0.05,
        "max": 0.35,
        "step": 0.01,
        "digits": 2,
        "default": 0.19
      },
      {
        "key": "damping",
        "label": "Damping",
        "min": 0.4,
        "max": 0.9,
        "step": 0.01,
        "digits": 2,
        "default": 0.7
      },
      {
        "key": "widthGrowth",
        "label": "Width growth",
        "min": 4,
        "max": 32,
        "step": 1,
        "digits": 0,
        "default": 17
      },
      {
        "key": "heightGrowth",
        "label": "Height growth",
        "min": 4,
        "max": 28,
        "step": 1,
        "digits": 0,
        "default": 16
      },
      {
        "key": "drop",
        "label": "Drop",
        "min": 0,
        "max": 12,
        "step": 0.5,
        "digits": 1,
        "default": 3.5
      }
    ],
    "variants": [
      {
        "id": "sable",
        "label": "Sable Dock",
        "description": "The authored Sable dock: a centred glass capsule whose items spring downward and widen as the pointer crosses them.",
        "thumbnail": "https://threeui.com/thumbnails/animated-top-dock.jpg",
        "preview": "https://threeui.com/previews/animated-top-dock.webm",
        "props": {
          "variant": "sable"
        },
        "controls": [
          {
            "key": "proximity",
            "label": "Proximity",
            "min": 60,
            "max": 220,
            "step": 1,
            "digits": 0,
            "default": 122
          },
          {
            "key": "spring",
            "label": "Spring",
            "min": 0.05,
            "max": 0.35,
            "step": 0.01,
            "digits": 2,
            "default": 0.19
          },
          {
            "key": "damping",
            "label": "Damping",
            "min": 0.4,
            "max": 0.9,
            "step": 0.01,
            "digits": 2,
            "default": 0.7
          },
          {
            "key": "widthGrowth",
            "label": "Width growth",
            "min": 4,
            "max": 32,
            "step": 1,
            "digits": 0,
            "default": 17
          },
          {
            "key": "heightGrowth",
            "label": "Height growth",
            "min": 4,
            "max": 28,
            "step": 1,
            "digits": 0,
            "default": 16
          },
          {
            "key": "drop",
            "label": "Drop",
            "min": 0,
            "max": 12,
            "step": 0.5,
            "digits": 1,
            "default": 3.5
          }
        ]
      },
      {
        "id": "modern",
        "label": "Command Bar",
        "description": "An inset modern header: wordmark on the left, the proximity dock centred on the bar’s midline, and a paired sign-in and gradient call to action on the right.",
        "thumbnail": "https://threeui.com/thumbnails/animated-top-dock-modern.jpg",
        "preview": "https://threeui.com/previews/animated-top-dock-modern.webm",
        "props": {
          "variant": "modern"
        },
        "controls": [
          {
            "key": "proximity",
            "label": "Proximity",
            "min": 60,
            "max": 220,
            "step": 1,
            "digits": 0,
            "default": 122
          },
          {
            "key": "spring",
            "label": "Spring",
            "min": 0.05,
            "max": 0.35,
            "step": 0.01,
            "digits": 2,
            "default": 0.19
          },
          {
            "key": "damping",
            "label": "Damping",
            "min": 0.4,
            "max": 0.9,
            "step": 0.01,
            "digits": 2,
            "default": 0.7
          },
          {
            "key": "widthGrowth",
            "label": "Width growth",
            "min": 4,
            "max": 32,
            "step": 1,
            "digits": 0,
            "default": 17
          },
          {
            "key": "heightGrowth",
            "label": "Height growth",
            "min": 4,
            "max": 28,
            "step": 1,
            "digits": 0,
            "default": 16
          },
          {
            "key": "drop",
            "label": "Drop",
            "min": 0,
            "max": 12,
            "step": 0.5,
            "digits": 1,
            "default": 3.5
          }
        ]
      },
      {
        "id": "retro",
        "label": "Pixel Terminal",
        "description": "A fitted terminal strip: the menu cells own the whole bar and trade width with each other, over a WebGL noise field quantised through an 8×8 ordered dither into an eight-stop dusk palette.",
        "thumbnail": "https://threeui.com/thumbnails/animated-top-dock-retro.jpg",
        "preview": "https://threeui.com/previews/animated-top-dock-retro.webm",
        "props": {
          "variant": "retro"
        },
        "controls": [
          {
            "key": "pixelSize",
            "label": "Pixel size",
            "min": 1,
            "max": 10,
            "step": 1,
            "digits": 0,
            "default": 4
          },
          {
            "key": "levels",
            "label": "Palette steps",
            "min": 2,
            "max": 8,
            "step": 1,
            "digits": 0,
            "default": 7
          },
          {
            "key": "noise",
            "label": "Noise",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "scanlines",
            "label": "Scanlines",
            "min": 0,
            "max": 0.8,
            "step": 0.01,
            "digits": 2,
            "default": 0.32
          },
          {
            "key": "speed",
            "label": "Speed",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "proximity",
            "label": "Proximity",
            "min": 60,
            "max": 220,
            "step": 1,
            "digits": 0,
            "default": 132
          },
          {
            "key": "widthGrowth",
            "label": "Cell expand",
            "min": 0,
            "max": 160,
            "step": 1,
            "digits": 0,
            "default": 54
          }
        ]
      },
      {
        "id": "glass",
        "label": "Liquid Glass",
        "description": "A vertical glass rail whose proximity field runs down the y axis, over a Three.js bead field that refracts the backdrop in screen space with per-channel dispersion and a specular rim.",
        "thumbnail": "https://threeui.com/thumbnails/animated-top-dock-glass.jpg",
        "preview": "https://threeui.com/previews/animated-top-dock-glass.webm",
        "props": {
          "variant": "glass"
        },
        "controls": [
          {
            "key": "particles",
            "label": "Beads",
            "min": 4,
            "max": 34,
            "step": 1,
            "digits": 0,
            "default": 22
          },
          {
            "key": "thickness",
            "label": "Thickness",
            "min": 0.02,
            "max": 0.3,
            "step": 0.005,
            "digits": 3,
            "default": 0.115
          },
          {
            "key": "dispersion",
            "label": "Dispersion",
            "min": 0,
            "max": 0.18,
            "step": 0.005,
            "digits": 3,
            "default": 0.05
          },
          {
            "key": "specular",
            "label": "Specular",
            "min": 0,
            "max": 2,
            "step": 0.01,
            "digits": 2,
            "default": 0.85
          },
          {
            "key": "rim",
            "label": "Rim",
            "min": 0,
            "max": 1.4,
            "step": 0.01,
            "digits": 2,
            "default": 0.5
          },
          {
            "key": "drift",
            "label": "Drift",
            "min": 0,
            "max": 3,
            "step": 0.01,
            "digits": 2,
            "default": 1
          },
          {
            "key": "proximity",
            "label": "Proximity",
            "min": 16,
            "max": 160,
            "step": 1,
            "digits": 0,
            "default": 44
          },
          {
            "key": "heightGrowth",
            "label": "Row growth",
            "min": 0,
            "max": 40,
            "step": 1,
            "digits": 0,
            "default": 20
          },
          {
            "key": "drop",
            "label": "Lean",
            "min": 0,
            "max": 26,
            "step": 0.5,
            "digits": 1,
            "default": 11
          }
        ]
      }
    ]
  }, component: CommunityRenderer85 },
  { ...{
    "id": "sketchbook",
    "tags": [
      "css",
      "dom",
      "css3d",
      "3d",
      "book",
      "paper",
      "page curl",
      "drag",
      "zoom",
      "illustration",
      "magnifying glass",
      "interactive"
    ],
    "category": "CSS",
    "label": "Sketchbook",
    "thumbnail": "https://threeui.com/thumbnails/sketchbook.jpg",
    "description": "The exact Singapore paper sketchbook with nested-strip page curls, direct dragging, tilt, zoom, a movable magnifying glass, and its complete authored plate set.",
    "runtime": "DOM + CSS 3D",
    "origin": "Sketchbook",
    "sourceCommit": "3938bc8def563f89ed587e52ac35ddc056c0a5f0",
    "sourceFiles": [
      "sketchbook/index.html — complete interaction source",
      "sketchbook/* — 14 artworks and 3 owned font files",
      "src/shaders/sketchbook/sketchbookDocument.js",
      "src/shaders/sketchbook/Sketchbook.tsx"
    ],
    "passes": "18 nested CSS 3D strips per turning leaf",
    "interaction": "Drag or tap pages, arrows, keyboard, cursor tilt, zoom, and draggable loupe",
    "asset": "14 exact artworks + 3 exact local font files",
    "assetCount": 17,
    "importName": "Sketchbook",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "DOM + CSS 3D"
      },
      {
        "name": "pageCurl",
        "type": "fixed",
        "value": "18 nested strips"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Drag + zoom + loupe"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Reduced-motion aware"
      },
      {
        "name": "assetBaseUrl",
        "type": "string",
        "value": "/sketchbook/"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "17 exact local files"
      }
    ]
  }, component: CommunityRenderer86 },
  { ...{
    "id": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "particles",
      "network",
      "nodes",
      "lines",
      "stars",
      "constellation",
      "background",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Constellation Field",
    "thumbnail": "https://threeui.com/thumbnails/constellation-field.jpg",
    "description": "A family of particle networks, gateways, interface lines, defense traces, and topographic fields gathered into one configurable collection.",
    "runtime": "Canvas 2D + Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 1920ad4fe34f",
    "sourceFiles": [
      "src/shaders/constellation-field/ConstellationField.tsx",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx",
      "src/shaders/neuform-isolated/sources/constellation-field.html",
      "src/shaders/neuform-isolated/sources/particle-drift.html",
      "src/shaders/neuform-isolated/sources/particle-network.html",
      "src/shaders/neuform-isolated/sources/gateway-flow.html",
      "src/shaders/neuform-isolated/sources/connectivity-graph.html",
      "src/shaders/neuform-isolated/sources/interface-lines.html",
      "src/shaders/neuform-isolated/sources/defense-lines.html",
      "src/shaders/neuform-isolated/sources/topo-field.html"
    ],
    "passes": "1 active isolated source pass",
    "interaction": "Variant selection plus customizable mode, speed, size, stroke width, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ConstellationField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Constellation + Drift + Network + Gateway + Connectivity + Interface + Defense + Topo"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "strokeWidth",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "strokeWidth",
        "label": "Stroke Width",
        "min": 0.25,
        "max": 4,
        "step": 0.05,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "constellation-field",
        "label": "Constellation Field",
        "description": "A drifting particle constellation network with tunable link stroke width over a deep night field.",
        "thumbnail": "https://threeui.com/thumbnails/constellation-field.jpg",
        "preview": "https://threeui.com/previews/constellation-field.webm",
        "props": {}
      },
      {
        "id": "particle-drift",
        "label": "Particle Drift",
        "description": "A soft particle drift field lifted from a compute-network hero stage.",
        "thumbnail": "https://threeui.com/thumbnails/particle-drift.jpg",
        "preview": "https://threeui.com/previews/particle-drift.webm",
        "props": {
          "variant": "particle-drift"
        }
      },
      {
        "id": "particle-network",
        "label": "Particle Network",
        "description": "A sharp, thin-stroke particle network field with crisp retina trails.",
        "thumbnail": "https://threeui.com/thumbnails/particle-network.jpg",
        "preview": "https://threeui.com/previews/particle-network.webm",
        "props": {
          "variant": "particle-network"
        }
      },
      {
        "id": "gateway-flow",
        "label": "Gateway Flow",
        "description": "A black-stage flow canvas with streaming gateway trajectories.",
        "thumbnail": "https://threeui.com/thumbnails/gateway-flow.jpg",
        "preview": "https://threeui.com/previews/gateway-flow.webm",
        "props": {
          "variant": "gateway-flow"
        }
      },
      {
        "id": "connectivity-graph",
        "label": "Connectivity Graph",
        "description": "A light-mode connectivity graph canvas with animated node links.",
        "thumbnail": "https://threeui.com/thumbnails/connectivity-graph.jpg",
        "preview": "https://threeui.com/previews/connectivity-graph.webm",
        "props": {
          "variant": "connectivity-graph"
        }
      },
      {
        "id": "interface-lines",
        "label": "Interface Lines",
        "description": "A faint interface line-field background for dense system UI stages.",
        "thumbnail": "https://threeui.com/thumbnails/interface-lines.jpg",
        "preview": "https://threeui.com/previews/interface-lines.webm",
        "props": {
          "variant": "interface-lines"
        }
      },
      {
        "id": "defense-lines",
        "label": "Defense Lines",
        "description": "A crimson defense-line canvas field behind a high-contrast hero stage.",
        "thumbnail": "https://threeui.com/thumbnails/defense-lines.jpg",
        "preview": "https://threeui.com/previews/defense-lines.webm",
        "props": {
          "variant": "defense-lines"
        }
      },
      {
        "id": "topo-field",
        "label": "Topo Field",
        "description": "A raw-WebGL topography field with flowing elevation bands.",
        "thumbnail": "https://threeui.com/thumbnails/topo-field.jpg",
        "preview": "https://threeui.com/previews/topo-field.webm",
        "props": {
          "variant": "topo-field"
        }
      }
    ]
  }, component: CommunityRenderer87 },
  { ...{
    "id": "particle-drift",
    "variantOf": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "particles",
      "soft",
      "ambient",
      "drift",
      "background",
      "compute",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Particle Drift",
    "thumbnail": "https://threeui.com/thumbnails/particle-drift.jpg",
    "description": "A soft particle drift field lifted from a compute-network hero stage.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 7fad6cc8c54c",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/particle-drift.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ParticleDrift",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer88 },
  { ...{
    "id": "particle-network",
    "variantOf": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "particles",
      "network",
      "lines",
      "trails",
      "retina",
      "sharp",
      "background",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Particle Network",
    "thumbnail": "https://threeui.com/thumbnails/particle-network.jpg",
    "description": "A sharp, thin-stroke particle network field with crisp retina trails.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 bc7bffdc48a9",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/particle-network.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ParticleNetwork",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer89 },
  { ...{
    "id": "flux-vortex",
    "variantOf": "structure-flow",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "particles",
      "vortex",
      "bloom",
      "post processing",
      "spiral",
      "filaments",
      "glow"
    ],
    "category": "Three.js",
    "label": "Flux Vortex",
    "thumbnail": "https://threeui.com/thumbnails/flux-vortex.jpg",
    "description": "A blooming Three.js particle vortex with spiral filaments and post-process glow.",
    "runtime": "Three.js r160",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 ec02a0cfd079",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/flux-vortex.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "FluxVortex",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer90 },
  { ...{
    "id": "portal-field",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "canvas",
      "canvas2d",
      "glsl",
      "shader",
      "shadermaterial",
      "portal",
      "cloud",
      "bell",
      "chladni",
      "stream convergence",
      "flow field",
      "simplex noise",
      "particle trails",
      "wavefront",
      "pointer",
      "fringe",
      "light",
      "ambient",
      "background",
      "variants"
    ],
    "category": "Backgrounds",
    "label": "Portal Field",
    "thumbnail": "https://threeui.com/thumbnails/portal-field.jpg",
    "description": "Five ambient field backgrounds collected across Three.js, raw WebGL, and Canvas 2D renderers.",
    "runtime": "Three.js r134 + Raw WebGL + Canvas 2D",
    "origin": "Neuform export + HTML Pages",
    "sourceCommit": "SHA-256 f90e34f83d51",
    "sourceFiles": [
      "src/shaders/portal-field/PortalFieldCollection.tsx",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx",
      "src/shaders/neuform-isolated/sources/portal-field.html",
      "src/shaders/neuform-isolated/sources/flow-field.html",
      "src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx",
      "src/shaders/neuform-isolated/sources/strata-cloud.html",
      "src/shaders/stream-convergence/StreamConvergenceBackground.tsx",
      "src/shaders/stream-convergence/streamConvergenceShaders.ts",
      "src/shaders/bell-field/BellFieldBackground.tsx",
      "src/shaders/bell-field/bellFieldShaders.ts"
    ],
    "passes": "1 selected ambient field composition",
    "interaction": "Variant selection plus customizable motion, geometry, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "PortalFieldCollection",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Portal + Flow + Cloud + Bell + Stream Convergence"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "portal-field",
        "label": "Portal Field",
        "description": "A Three.js ShaderMaterial portal with pointer-reactive fringe light.",
        "thumbnail": "https://threeui.com/thumbnails/portal-field.jpg",
        "preview": "https://threeui.com/previews/portal-field.webm",
        "props": {}
      },
      {
        "id": "cloud-field",
        "label": "Cloud Field",
        "description": "A raw-WebGL cloud migration background isolated at its source renderer boundary.",
        "thumbnail": "https://threeui.com/thumbnails/cloud-field.jpg",
        "preview": "https://threeui.com/previews/cloud-field.webm",
        "props": {
          "variant": "cloud-field"
        }
      },
      {
        "id": "flow-field",
        "label": "Flow Field",
        "description": "Warm amber, gold, and coral particles trace a deterministic simplex-noise field.",
        "thumbnail": "https://threeui.com/thumbnails/flow-field.jpg",
        "preview": "https://threeui.com/previews/flow-field.webm",
        "props": {
          "variant": "flow-field"
        }
      },
      {
        "id": "bell-field",
        "label": "Bell Field",
        "description": "A Chladni-inspired bell field with nodal metal patterns and rising foundry embers.",
        "thumbnail": "https://threeui.com/thumbnails/bell-field.jpg",
        "preview": "https://threeui.com/previews/bell-field.webm",
        "props": {
          "variant": "bell-field"
        }
      },
      {
        "id": "stream-convergence",
        "label": "Stream Convergence",
        "description": "Three chromatically separated violet wavefronts crossing a rotated fluid field.",
        "thumbnail": "https://threeui.com/thumbnails/stream-convergence.jpg",
        "preview": "https://threeui.com/previews/stream-convergence.webm",
        "props": {
          "variant": "stream-convergence"
        }
      }
    ]
  }, component: CommunityRenderer91 },
  { ...{
    "id": "amber-halftone",
    "variantOf": "predictive-arc",
    "tags": [
      "threejs",
      "three.js",
      "3d",
      "webgl",
      "particles",
      "halftone",
      "points",
      "amber",
      "gradient",
      "plane",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Amber Halftone",
    "thumbnail": "https://threeui.com/thumbnails/amber-halftone.jpg",
    "description": "An animated amber-to-white halftone point field on a dark plane.",
    "runtime": "Three.js r128",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 3d9ebb64a15a",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/amber-halftone.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "AmberHalftone",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer92 },
  { ...{
    "id": "diagnostics-panel",
    "tags": [
      "canvas",
      "canvas2d",
      "ui",
      "dashboard",
      "diagnostics",
      "diagrams",
      "layers",
      "nodes",
      "cube",
      "mesh",
      "illustration"
    ],
    "category": "UI Elements",
    "label": "Diagnostics Panel",
    "thumbnail": "https://threeui.com/thumbnails/diagnostics-panel.jpg",
    "description": "Three diagnostic illustration variants — layered planes, node cubes, and a flowing mesh — each isolated without page chrome or copy.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 6d05694bf006",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/diagnostics-panel.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 active isolated Canvas 2D illustration",
    "interaction": "Variant selection plus customizable speed, size, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "DiagnosticsPanel",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "layers",
        "label": "Layered Planes",
        "description": "Five floating isometric planes with a highlighted top layer and a cropped scan-line core.",
        "thumbnail": "https://threeui.com/thumbnails/diagnostics-panel.jpg",
        "preview": "https://threeui.com/previews/diagnostics-panel.webm",
        "props": {
          "variant": "layers"
        }
      },
      {
        "id": "nodes",
        "label": "Node Cubes",
        "description": "Five synchronized wireframe cubes forming a softly animated diagnostic node cluster.",
        "thumbnail": "https://threeui.com/thumbnails/diagnostics-panel-nodes.jpg",
        "preview": "https://threeui.com/previews/diagnostics-panel-nodes.webm",
        "props": {
          "variant": "nodes"
        }
      },
      {
        "id": "flow",
        "label": "Flowing Mesh",
        "description": "An isometric wire mesh that continuously ripples around a focused central peak.",
        "thumbnail": "https://threeui.com/thumbnails/diagnostics-panel-flow.jpg",
        "preview": "https://threeui.com/previews/diagnostics-panel-flow.webm",
        "props": {
          "variant": "flow"
        }
      }
    ]
  }, component: CommunityRenderer93 },
  { ...{
    "id": "skeuomorphic-toggle",
    "tags": [
      "css",
      "dom",
      "ui",
      "toggle",
      "switch",
      "skeuomorphic",
      "light mode",
      "dark mode",
      "interactive",
      "control"
    ],
    "category": "UI Elements",
    "label": "Skeuomorphic Toggle",
    "thumbnail": "https://threeui.com/thumbnails/skeuomorphic-toggle.jpg",
    "description": "Four takes on one switch: the preserved tactile skeuomorphic export plus flat modern, Three.js glass, and shader-lit treatments, each matching light and dark appearances automatically.",
    "runtime": "DOM/CSS + Three.js + Raw WebGL",
    "origin": "Preserved Neuform export + ThreeUI original variants",
    "sourceCommit": "SHA-256 3e19e7fec9ac",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/skeuomorphic-toggle.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx",
      "src/shaders/skeuomorphic-toggle/SkeuomorphicToggleCollection.tsx",
      "src/shaders/skeuomorphic-toggle/ModernToggle.tsx",
      "src/shaders/skeuomorphic-toggle/GlassToggle.tsx",
      "src/shaders/skeuomorphic-toggle/glassToggleScene.ts",
      "src/shaders/skeuomorphic-toggle/ShaderToggle.tsx",
      "src/shaders/skeuomorphic-toggle/shaderToggleScene.ts",
      "src/shaders/skeuomorphic-toggle/shaderToggleGlsl.ts",
      "src/shaders/skeuomorphic-toggle/toggleMode.ts"
    ],
    "passes": "1 selected toggle pass",
    "interaction": "Click or keyboard switching, pointer-lit 3D variants, automatic site/system appearance with explicit light and dark overrides, plus customizable speed, size, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "SkeuomorphicToggleCollection",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "auto | dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "auto",
        "options": [
          {
            "value": "auto",
            "label": "Auto"
          },
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "skeuomorphic-toggle",
        "label": "Skeuomorphic",
        "description": "The preserved packaged export: a tactile pill with an inset track and a raised sliding thumb.",
        "thumbnail": "https://threeui.com/thumbnails/skeuomorphic-toggle.jpg",
        "preview": "https://threeui.com/previews/skeuomorphic-toggle.webm",
        "props": {}
      },
      {
        "id": "modern",
        "label": "Modern",
        "description": "A flat, hairline-edged switch with a stretching knob, a check-to-dash mark, and one soft accent pool.",
        "thumbnail": "https://threeui.com/thumbnails/skeuomorphic-toggle-modern.jpg",
        "preview": "https://threeui.com/previews/skeuomorphic-toggle-modern.webm",
        "props": {
          "variant": "modern"
        }
      },
      {
        "id": "glass",
        "label": "Glass",
        "description": "An Apple-style Three.js capsule in transmissive glass, refracting a drifting colour field around a lit core.",
        "thumbnail": "https://threeui.com/thumbnails/skeuomorphic-toggle-glass.jpg",
        "preview": "https://threeui.com/previews/skeuomorphic-toggle-glass.webm",
        "props": {
          "variant": "glass"
        }
      },
      {
        "id": "shader",
        "label": "Shader",
        "description": "A raw-WebGL switch drawn entirely in one fragment pass: plasma interior, streaming sparks, chromatic bloom, and a pointer-lit thumb.",
        "thumbnail": "https://threeui.com/thumbnails/skeuomorphic-toggle-shader.jpg",
        "preview": "https://threeui.com/previews/skeuomorphic-toggle-shader.webm",
        "props": {
          "variant": "shader"
        }
      }
    ]
  }, component: CommunityRenderer94 },
  { ...{
    "id": "matrix-field",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "laser",
      "beam",
      "matrix",
      "pointer",
      "reactive",
      "background",
      "grid",
      "fog",
      "halftone",
      "prism",
      "vanishing point",
      "reduced motion",
      "animated",
      "variants"
    ],
    "category": "Backgrounds",
    "label": "Laser",
    "thumbnail": "https://threeui.com/thumbnails/matrix-field.jpg",
    "description": "Four pointer-reactive laser scenes spanning a preserved matrix junction, atmospheric blade, vanishing array, and halftone relay.",
    "runtime": "Raw WebGL",
    "origin": "ThreeUI original variants + preserved Neuform export",
    "sourceCommit": "SHA-256 70cc015d5175",
    "sourceFiles": [
      "src/shaders/laser/LaserCollection.tsx",
      "src/shaders/laser/LaserVariants.tsx",
      "src/shaders/laser/laserShaders.ts",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx",
      "src/shaders/neuform-isolated/sources/matrix-field.html"
    ],
    "passes": "1 selected raw-WebGL laser pass",
    "interaction": "Variant selection, smoothed pointer response, reduced-motion stills, and customizable motion, geometry, opacity, and palette",
    "asset": "No external assets",
    "assetCount": 0,
    "importName": "LaserCollection",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Raw WebGL + preserved sandboxed WebGL"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "Matrix Junction + Atmospheric Blade + Vanishing Array + Halftone Relay"
      },
      {
        "name": "interaction",
        "type": "pointer",
        "value": "Smoothed horizontal and vertical response"
      },
      {
        "name": "pixelRatio",
        "type": "adaptive",
        "value": "Capped at 1.5"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Visibility-aware + reduced-motion still"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No external assets"
      }
    ],
    "controls": [
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "matrix-field",
        "label": "Matrix Junction",
        "description": "The preserved pointer-reactive three-way matrix junction.",
        "thumbnail": "https://threeui.com/thumbnails/matrix-field.jpg",
        "preview": "https://threeui.com/previews/matrix-field.webm",
        "props": {}
      },
      {
        "id": "atmospheric-blade",
        "label": "Atmospheric Blade",
        "description": "A white-hot emerald blade cutting through layered procedural vapor and faint mirage rails.",
        "thumbnail": "https://threeui.com/thumbnails/laser-atmospheric-blade.jpg",
        "preview": "https://threeui.com/previews/laser-atmospheric-blade.webm",
        "props": {
          "variant": "atmospheric-blade"
        }
      },
      {
        "id": "vanishing-array",
        "label": "Vanishing Array",
        "description": "Violet and amber carrier rails accelerate from a pointer-steered horizon origin.",
        "thumbnail": "https://threeui.com/thumbnails/laser-vanishing-array.jpg",
        "preview": "https://threeui.com/previews/laser-vanishing-array.webm",
        "props": {
          "variant": "vanishing-array"
        }
      },
      {
        "id": "halftone-relay",
        "label": "Halftone Relay",
        "description": "An off-axis cyan relay where vapor resolves into an animated screen-space dot field.",
        "thumbnail": "https://threeui.com/thumbnails/laser-halftone-relay.jpg",
        "preview": "https://threeui.com/previews/laser-halftone-relay.webm",
        "props": {
          "variant": "halftone-relay"
        }
      }
    ]
  }, component: CommunityRenderer95 },
  { ...{
    "id": "gateway-flow",
    "variantOf": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "flow field",
      "trajectories",
      "gateway",
      "black",
      "background",
      "streaming",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Gateway Flow",
    "thumbnail": "https://threeui.com/thumbnails/gateway-flow.jpg",
    "description": "A black-stage flow canvas with streaming gateway trajectories.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 c5a1de43138f",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/gateway-flow.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "GatewayFlow",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer96 },
  { ...{
    "id": "connectivity-graph",
    "variantOf": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "graph",
      "network",
      "nodes",
      "links",
      "light mode",
      "background",
      "data visualization",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Connectivity Graph",
    "thumbnail": "https://threeui.com/thumbnails/connectivity-graph.jpg",
    "description": "A light-mode connectivity graph canvas with animated node links.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 98592824dd11",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/connectivity-graph.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "ConnectivityGraph",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "light",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 0.35
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1.5
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer97 },
  { ...{
    "id": "interface-lines",
    "variantOf": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "lines",
      "grid",
      "subtle",
      "background",
      "system ui",
      "interface",
      "technical"
    ],
    "category": "Backgrounds",
    "label": "Interface Lines",
    "thumbnail": "https://threeui.com/thumbnails/interface-lines.jpg",
    "description": "A faint interface line-field background for dense system UI stages.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 93ad384d1422",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/interface-lines.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "InterfaceLines",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer98 },
  { ...{
    "id": "wireframe-forms",
    "tags": [
      "canvas",
      "canvas2d",
      "ui",
      "wireframe",
      "3d",
      "cube",
      "cylinders",
      "sphere",
      "rotating",
      "geometry",
      "variants"
    ],
    "category": "UI Elements",
    "label": "Wireframe Forms",
    "thumbnail": "https://threeui.com/thumbnails/wireframe-forms.jpg",
    "description": "A family of rotating wireframe forms, with the cube, crossed cylinders, and nested sphere isolated as individual variants.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 828c6a635b54",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/wireframe-forms.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Three selectable shape variants with customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "WireframeForms",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      },
      {
        "name": "variant",
        "type": "choice",
        "value": "Cube | Cylinders | Sphere"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 3
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 0.35
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "cube",
        "label": "Cube",
        "description": "The prismatic cube study isolated as a single rotating wireframe form.",
        "thumbnail": "https://threeui.com/thumbnails/wireframe-forms.jpg",
        "preview": "https://threeui.com/previews/wireframe-forms.webm",
        "props": {
          "variant": "cube"
        }
      },
      {
        "id": "cylinders",
        "label": "Cylinders",
        "description": "The crossed logic cylinders isolated as a single rotating wireframe form.",
        "thumbnail": "https://threeui.com/thumbnails/wireframe-forms-cylinders.jpg",
        "preview": "https://threeui.com/previews/wireframe-forms-cylinders.webm",
        "props": {
          "variant": "cylinders"
        }
      },
      {
        "id": "sphere",
        "label": "Sphere",
        "description": "The nested icosahedral sphere isolated as a single rotating wireframe form.",
        "thumbnail": "https://threeui.com/thumbnails/wireframe-forms-sphere.jpg",
        "preview": "https://threeui.com/previews/wireframe-forms-sphere.webm",
        "props": {
          "variant": "sphere"
        }
      }
    ]
  }, component: CommunityRenderer99 },
  { ...{
    "id": "defense-lines",
    "variantOf": "constellation-field",
    "tags": [
      "canvas",
      "canvas2d",
      "lines",
      "red",
      "crimson",
      "hero",
      "background",
      "high contrast",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Defense Lines",
    "thumbnail": "https://threeui.com/thumbnails/defense-lines.jpg",
    "description": "A crimson defense-line canvas field behind a high-contrast hero stage.",
    "runtime": "Canvas 2D",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 4418b6ba7f1a",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/defense-lines.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "DefenseLines",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer100 },
  { ...{
    "id": "topo-field",
    "variantOf": "constellation-field",
    "tags": [
      "webgl",
      "glsl",
      "shader",
      "topography",
      "terrain",
      "contour lines",
      "elevation",
      "background",
      "flowing",
      "animated"
    ],
    "category": "Backgrounds",
    "label": "Topo Field",
    "thumbnail": "https://threeui.com/thumbnails/topo-field.jpg",
    "description": "A raw-WebGL topography field with flowing elevation bands.",
    "runtime": "Raw WebGL",
    "origin": "Neuform export",
    "sourceCommit": "SHA-256 70dbdaaec639",
    "sourceFiles": [
      "src/shaders/neuform-isolated/sources/topo-field.html",
      "src/shaders/neuform-isolated/NeuformBatchEffects.tsx"
    ],
    "passes": "1 isolated source pass",
    "interaction": "Customizable speed, size, length, density, opacity, and palette",
    "asset": "No owned binary assets",
    "assetCount": 0,
    "importName": "TopoField",
    "contract": [
      {
        "name": "source",
        "type": "fixed",
        "value": "Exact Neuform HTML"
      },
      {
        "name": "focus",
        "type": "host",
        "value": "Effect-only sandbox"
      },
      {
        "name": "mode",
        "type": "optional",
        "value": "dark | light"
      },
      {
        "name": "speed",
        "type": "number",
        "value": "1"
      },
      {
        "name": "size",
        "type": "number",
        "value": "1"
      },
      {
        "name": "length",
        "type": "number",
        "value": "1"
      },
      {
        "name": "density",
        "type": "number",
        "value": "1"
      },
      {
        "name": "opacity",
        "type": "number",
        "value": "1"
      },
      {
        "name": "palette",
        "type": "optional",
        "value": "Final-frame grade"
      },
      {
        "name": "assets",
        "type": "fixed",
        "value": "No owned binary assets"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0,
        "max": 3,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "size",
        "label": "Size",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "length",
        "label": "Length",
        "min": 0.35,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "density",
        "label": "Density",
        "min": 0.25,
        "max": 2.5,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "opacity",
        "label": "Opacity",
        "min": 0.05,
        "max": 1,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "hue",
        "label": "Hue",
        "min": -180,
        "max": 180,
        "step": 1,
        "digits": 0,
        "default": 0
      },
      {
        "key": "saturation",
        "label": "Saturation",
        "min": 0,
        "max": 2,
        "step": 0.01,
        "digits": 2,
        "default": 1
      },
      {
        "key": "brightness",
        "label": "Brightness",
        "min": 0.35,
        "max": 1.65,
        "step": 0.01,
        "digits": 2,
        "default": 1
      }
    ]
  }, component: CommunityRenderer101 },
  { ...{
    "id": "brand-orbs",
    "tags": [
      "canvas",
      "canvas2d",
      "ui",
      "loading",
      "loader",
      "status",
      "spinner",
      "agent",
      "thinking",
      "orb",
      "dots",
      "particles",
      "brand",
      "logo",
      "claude",
      "anthropic",
      "openai",
      "chatgpt",
      "codex",
      "cursor",
      "gemini",
      "google",
      "figma",
      "framer",
      "react",
      "swift",
      "apple",
      "designcode",
      "aura",
      "dreamcut",
      "ux",
      "css",
      "ios",
      "neuform",
      "github",
      "x",
      "twitter",
      "instagram",
      "threads",
      "meta",
      "linkedin",
      "email",
      "small",
      "20px",
      "medium",
      "56px",
      "light mode",
      "dark mode",
      "dark default",
      "reduced motion",
      "animated",
      "variants"
    ],
    "category": "UI Elements",
    "label": "Brand Orbs",
    "thumbnail": "https://threeui.com/thumbnails/brand-orbs.jpg",
    "description": "Twenty-three animated brand marks rebuilt as small and medium dimensional dot orbs for AI status, product activity, and compact loading states.",
    "runtime": "Canvas 2D",
    "origin": "HTML Pages — inspired by Thinking Orbs",
    "sourceCommit": "SHA-256 c2733de8cf7b",
    "sourceFiles": [
      "brand-orbs-v2.html — complete authored specimen library",
      "src/shaders/brand-orbs/sources/brand-orbs-v2.html",
      "src/shaders/brand-orbs/BrandOrbs.tsx"
    ],
    "passes": "1 transparent Canvas 2D dot-lattice pass",
    "interaction": "Twenty-three variants, small and medium presets, dark-first theme, speed, pause, reduced motion, visibility pause, and deterministic restart",
    "asset": "Embedded vector paths and procedural geometry; no external runtime assets",
    "assetCount": 0,
    "importName": "BrandOrbs",
    "contract": [
      {
        "name": "renderer",
        "type": "host",
        "value": "Sandboxed authored Canvas 2D engine"
      },
      {
        "name": "variants",
        "type": "fixed",
        "value": "23 brand marks"
      },
      {
        "name": "size",
        "type": "fixed",
        "value": "Small 20px | Medium 56px (default)"
      },
      {
        "name": "theme",
        "type": "adaptive",
        "value": "Dark (default) | Light"
      },
      {
        "name": "motion",
        "type": "adaptive",
        "value": "Speed | Pause | Reduced motion | Visibility"
      },
      {
        "name": "assets",
        "type": "embedded",
        "value": "Vector paths + procedural dots"
      }
    ],
    "controls": [
      {
        "kind": "choice",
        "key": "size",
        "label": "Size",
        "default": "medium",
        "options": [
          {
            "value": "small",
            "label": "Small"
          },
          {
            "value": "medium",
            "label": "Medium"
          }
        ]
      },
      {
        "kind": "choice",
        "key": "mode",
        "label": "Mode",
        "default": "dark",
        "options": [
          {
            "value": "dark",
            "label": "Dark"
          },
          {
            "value": "light",
            "label": "Light"
          }
        ]
      },
      {
        "key": "speed",
        "label": "Speed",
        "min": 0.25,
        "max": 2,
        "step": 0.05,
        "digits": 2,
        "default": 1
      }
    ],
    "variants": [
      {
        "id": "claude",
        "label": "Claude Code",
        "description": "A warm radial spark burst that expands and contracts around a bright core.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs.jpg",
        "preview": "https://threeui.com/previews/brand-orbs.webm",
        "props": {}
      },
      {
        "id": "openai",
        "label": "OpenAI",
        "description": "An interlocking six-loop bloom traced as a rotating monochrome dot lattice.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-openai.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-openai.webm",
        "props": {
          "variant": "openai"
        }
      },
      {
        "id": "codex",
        "label": "Codex",
        "description": "A rounded command-prompt mark that breathes as a dimensional prompt blob.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-codex.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-codex.webm",
        "props": {
          "variant": "codex"
        }
      },
      {
        "id": "cursor",
        "label": "Cursor",
        "description": "The Cursor arrow and frame resolved in dots with a timed click ripple.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-cursor.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-cursor.webm",
        "props": {
          "variant": "cursor"
        }
      },
      {
        "id": "gemini",
        "label": "Gemini",
        "description": "A four-point Gemini twinkle with orbiting light and a soft central pulse.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-gemini.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-gemini.webm",
        "props": {
          "variant": "gemini"
        }
      },
      {
        "id": "figma",
        "label": "Figma",
        "description": "Five dot swatches morph through the familiar stacked Figma silhouette.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-figma.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-figma.webm",
        "props": {
          "variant": "figma"
        }
      },
      {
        "id": "framer",
        "label": "Framer",
        "description": "The folded Framer F rendered as shifting blue dot bands.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-framer.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-framer.webm",
        "props": {
          "variant": "framer"
        }
      },
      {
        "id": "react",
        "label": "React",
        "description": "Three luminous electron ellipses orbit a bright React nucleus.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-react.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-react.webm",
        "props": {
          "variant": "react"
        }
      },
      {
        "id": "swift",
        "label": "Swift",
        "description": "The Swift bird silhouette sweeps through a warm coral dot field.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-swift.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-swift.webm",
        "props": {
          "variant": "swift"
        }
      },
      {
        "id": "designcode",
        "label": "DesignCode",
        "description": "The DesignCode monogram travels through a dense spherical dot field.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-designcode.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-designcode.webm",
        "props": {
          "variant": "designcode"
        }
      },
      {
        "id": "aura",
        "label": "Aura",
        "description": "Aura's native asymmetric dot field carries an expanding halo of light.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-aura.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-aura.webm",
        "props": {
          "variant": "aura"
        }
      },
      {
        "id": "dreamcut",
        "label": "DreamCut",
        "description": "Six tapered petals open, breathe, and rotate as a DreamCut bloom.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-dreamcut.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-dreamcut.webm",
        "props": {
          "variant": "dreamcut"
        }
      },
      {
        "id": "ui",
        "label": "UI",
        "description": "A paneled interface window assembles from cool blue dot segments.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-ui.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-ui.webm",
        "props": {
          "variant": "ui"
        }
      },
      {
        "id": "ux",
        "label": "UX",
        "description": "A warm journey curve connects three pulsing experience nodes.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-ux.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-ux.webm",
        "props": {
          "variant": "ux"
        }
      },
      {
        "id": "css",
        "label": "CSS",
        "description": "The CSS lettermark emerges as a purple scan moving through a rounded field.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-css.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-css.webm",
        "props": {
          "variant": "css"
        }
      },
      {
        "id": "ios",
        "label": "iOS",
        "description": "The iOS wordmark is sampled into an even monochrome dot matrix.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-ios.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-ios.webm",
        "props": {
          "variant": "ios"
        }
      },
      {
        "id": "neuform",
        "label": "Neuform",
        "description": "Eight directional Neuform chevrons rotate around a precise center.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-neuform.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-neuform.webm",
        "props": {
          "variant": "neuform"
        }
      },
      {
        "id": "github",
        "label": "GitHub",
        "description": "The Octocat silhouette appears as negative space inside a luminous orb.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-github.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-github.webm",
        "props": {
          "variant": "github"
        }
      },
      {
        "id": "x",
        "label": "X",
        "description": "The X mark is swept by a rotating highlight around its diagonal strokes.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-x.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-x.webm",
        "props": {
          "variant": "x"
        }
      },
      {
        "id": "instagram",
        "label": "Instagram",
        "description": "The Instagram camera mark glows through a violet-to-orange dot gradient.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-instagram.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-instagram.webm",
        "props": {
          "variant": "instagram"
        }
      },
      {
        "id": "threads",
        "label": "Threads",
        "description": "The Threads loop is traced by an angular highlight sweep.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-threads.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-threads.webm",
        "props": {
          "variant": "threads"
        }
      },
      {
        "id": "linkedin",
        "label": "LinkedIn",
        "description": "The LinkedIn mark scans across a blue rounded-square field.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-linkedin.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-linkedin.webm",
        "props": {
          "variant": "linkedin"
        }
      },
      {
        "id": "email",
        "label": "Email",
        "description": "A dimensional dotted envelope opens and sends a traveling signal.",
        "thumbnail": "https://threeui.com/thumbnails/brand-orbs-email.jpg",
        "preview": "https://threeui.com/previews/brand-orbs-email.webm",
        "props": {
          "variant": "email"
        }
      }
    ]
  }, component: CommunityRenderer102 }
];
export const VISIBLE_READY_SHADERS = READY_SHADERS.filter((shader) => !shader.variantOf);
export const READY_SHADER_COLLECTION_COUNT = VISIBLE_READY_SHADERS.reduce((total, shader) => total + (shader.variants?.length || 1), 0);
export function getReadyShader(id: string): ReadyShader { return READY_SHADERS.find((shader) => shader.id === id) ?? READY_SHADERS[0]; }
