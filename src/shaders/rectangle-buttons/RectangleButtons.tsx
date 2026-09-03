import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";

import {
  DarkGlassButton as DarkGlassRectangle,
  type SectionCompositionProps,
} from "../section-elements/SectionElements";
import type { LumenCtaProps } from "../lumen-cta/LumenCta";
import type { NeuformIsolatedEffectProps } from "../neuform-isolated/NeuformIsolatedEffects";

export type RectangleButtonVariant =
  | "dark-pill"
  | "launch-button"
  | "dot-border-button"
  | "floating-dots-cta"
  | "sliding-text-cta"
  | "gradient-beam-cta"
  | "gradient-pill-button"
  | "generate-button"
  | "glassmorphism-cta"
  | "spinning-border-button"
  | "gradient-cta"
  | "lumen-cta"
  | "lumen-cta-ghost"
  | "trochil-signal"
  | "attune-thermal"
  | "tideform-outline"
  | "understory-arrow-pill"
  | "meridian-keycap-primary"
  | "meridian-keycap-secondary"
  | "halvorsen-arrow-pill"
  | "aster-glass-access"
  | "aster-glass-arrow"
  | "ember-keycap"
  | "bloom-outline-button";

type SelectedPageButtonVariant = Extract<
  RectangleButtonVariant,
  | "trochil-signal"
  | "attune-thermal"
  | "tideform-outline"
  | "understory-arrow-pill"
  | "meridian-keycap-primary"
  | "meridian-keycap-secondary"
  | "halvorsen-arrow-pill"
  | "aster-glass-access"
  | "aster-glass-arrow"
  | "ember-keycap"
  | "bloom-outline-button"
>;

type IsolatedRectangleVariant = Exclude<
  RectangleButtonVariant,
  "dark-pill" | "lumen-cta" | "lumen-cta-ghost" | SelectedPageButtonVariant
>;

export type RectangleButtonsProps = SectionCompositionProps &
  NeuformIsolatedEffectProps &
  Omit<LumenCtaProps, "variant"> & {
    variant?: RectangleButtonVariant;
  };

const LumenCta = lazy(() =>
  import("../lumen-cta/LumenCta").then((module) => ({ default: module.LumenCta })),
);

const RECTANGLE_VARIANTS = {
  "launch-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.LaunchButton })),
  ),
  "dot-border-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.DotBorderButton })),
  ),
  "floating-dots-cta": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.FloatingDotsCta })),
  ),
  "sliding-text-cta": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.SlidingTextCta })),
  ),
  "gradient-beam-cta": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GradientBeamCta })),
  ),
  "gradient-pill-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GradientPillButton })),
  ),
  "generate-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GenerateButton })),
  ),
  "glassmorphism-cta": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GlassmorphismCta })),
  ),
  "spinning-border-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.SpinningBorderButton })),
  ),
  "gradient-cta": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.GradientCta })),
  ),
} satisfies Record<IsolatedRectangleVariant, LazyExoticComponent<ComponentType<NeuformIsolatedEffectProps>>>;

const SELECTED_PAGE_BUTTON_VARIANTS = new Set<RectangleButtonVariant>([
  "trochil-signal",
  "attune-thermal",
  "tideform-outline",
  "understory-arrow-pill",
  "meridian-keycap-primary",
  "meridian-keycap-secondary",
  "halvorsen-arrow-pill",
  "aster-glass-access",
  "aster-glass-arrow",
  "ember-keycap",
  "bloom-outline-button",
]);

function isSelectedPageButtonVariant(variant: RectangleButtonVariant): variant is SelectedPageButtonVariant {
  return SELECTED_PAGE_BUTTON_VARIANTS.has(variant);
}

const SELECTED_PAGE_BUTTON_STYLES = `
.threeui-page-button-stage {
  --threeui-page-ink: #fff;
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 240px;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  background: #050505;
  color: var(--threeui-page-ink);
  font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.threeui-page-button-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.threeui-page-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  font: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
}
.threeui-page-button:focus-visible {
  outline: 2px solid var(--threeui-page-ink);
  outline-offset: 5px;
}
.threeui-page-button-stage--trochil {
  background: #030303;
}
.threeui-page-button-stage--trochil::before {
  background: radial-gradient(circle at 71% 49%, rgba(251, 215, 54, .18), transparent 31%);
  opacity: .72;
}
.threeui-page-button--trochil {
  height: 52px;
  padding: 0 30px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .27);
  background: linear-gradient(180deg, rgba(255, 255, 255, .07), rgba(0, 0, 0, .36));
  box-shadow: 0 15px 36px rgba(0, 0, 0, .48), inset 0 1px rgba(255, 255, 255, .08);
  color: rgba(255, 255, 255, .82);
  font-size: 14px;
  font-weight: 500;
  transition: border-color .28s ease, color .28s ease, transform .28s ease, box-shadow .28s ease;
}
.threeui-page-button--trochil::before {
  content: "";
  position: absolute;
  inset: -1px;
  background: linear-gradient(105deg, transparent 17%, rgba(251, 215, 54, .25) 48%, transparent 76%);
  transform: translateX(-125%);
  transition: transform .65s cubic-bezier(.22, .61, .36, 1);
}
.threeui-page-button--trochil span { position: relative; }
.threeui-page-button--trochil:hover {
  border-color: rgba(251, 215, 54, .58);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, .58), 0 0 24px rgba(251, 215, 54, .12);
}
.threeui-page-button--trochil:hover::before { transform: translateX(125%); }
.threeui-page-button-stage--attune {
  background: #070709;
}
.threeui-page-button-stage--attune::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 122, 20, .12), transparent 32%);
}
.threeui-page-button--attune {
  gap: 10px;
  height: 52px;
  padding: 0 22px;
  border-radius: 11px;
  background: linear-gradient(180deg, #ffa347 0%, #ff7a14 48%, #f2610a 100%);
  box-shadow: inset 0 1px rgba(255, 255, 255, .26), 0 8px 28px rgba(255, 122, 20, .28);
  color: #1a0e04;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: .012em;
  transition: filter .18s ease, transform .18s ease, box-shadow .18s ease;
}
.threeui-page-button--attune svg { width: 8px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.7; }
.threeui-page-button--attune:hover { filter: brightness(1.09); transform: translateY(-2px); box-shadow: inset 0 1px rgba(255, 255, 255, .34), 0 12px 34px rgba(255, 122, 20, .36); }
.threeui-page-button--attune:active { transform: translateY(1px); }
.threeui-page-button-stage--tideform {
  background: #16181a;
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
}
.threeui-page-button-stage--tideform::before {
  background: radial-gradient(ellipse at 76% 44%, rgba(255, 122, 24, .12), transparent 34%);
}
.threeui-page-button--tideform {
  gap: 18px;
  padding: 17px 24px;
  border: 1px solid rgba(255, 255, 255, .22);
  background: rgba(255, 255, 255, .055);
  box-shadow: inset 0 1px rgba(255, 255, 255, .035);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  transition: border-color .25s ease, background-color .25s ease, color .25s ease;
}
.threeui-page-button--tideform svg { width: 21px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.25; transition: transform .25s cubic-bezier(.2, .8, .2, 1); }
.threeui-page-button--tideform:hover { border-color: #ff7a18; color: #ff7a18; background: rgba(255, 122, 24, .14); }
.threeui-page-button--tideform:hover svg { transform: translateX(4px); }
.threeui-page-button-stage--understory {
  --threeui-page-ink: #27222d;
  background: #f2efe7;
  color: #27222d;
}
.threeui-page-button-stage--understory::before {
  background: none;
}
.threeui-page-button--arrow-pill {
  gap: 18px;
  height: 54px;
  padding: 0 11px 0 36px;
  border-radius: 999px;
  font-size: 17px;
  letter-spacing: -.005em;
  transition: background .3s ease, transform .3s ease, color .3s ease;
}
.threeui-page-button--arrow-pill .threeui-page-button__disc {
  display: grid;
  width: 32px;
  height: 32px;
  flex: none;
  place-items: center;
  border-radius: 50%;
}
.threeui-page-button--arrow-pill svg { width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2; transition: transform .3s ease; }
.threeui-page-button--arrow-pill:hover { transform: translateY(-2px); }
.threeui-page-button--arrow-pill:hover svg { transform: translateX(2px); }
.threeui-page-button--understory {
  background: #9b78d0;
  color: #fff;
  box-shadow: 0 14px 30px rgba(82, 53, 112, .18);
}
.threeui-page-button--understory .threeui-page-button__disc { background: #f6f3ed; color: #9b78d0; }
.threeui-page-button--understory:hover { background: #8d69c5; }
.threeui-page-button-stage--halvorsen {
  background: #111113;
}
.threeui-page-button-stage--halvorsen::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, .06), transparent 35%);
}
.threeui-page-button--halvorsen {
  background: #f0eee7;
  color: #111113;
  box-shadow: 0 14px 34px rgba(0, 0, 0, .32);
}
.threeui-page-button--halvorsen .threeui-page-button__disc { background: #111113; color: #f0eee7; }
.threeui-page-button--halvorsen:hover { background: #fff; }
.threeui-page-button-stage--meridian {
  background: #04070d;
}
.threeui-page-button-stage--meridian::before {
  background: radial-gradient(circle at 50% 44%, rgba(77, 163, 255, .13), transparent 34%);
}
.threeui-page-button--meridian {
  height: 62px;
  padding: 0 30px;
  border-radius: 15px;
  flex-shrink: 0;
  background: #0c1017;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .07);
}
.threeui-page-button--meridian::before {
  content: "";
  position: absolute;
  inset: 3px 4px 9px;
  border-radius: 12px;
  background: linear-gradient(180deg, #2a3142, #1c2230);
  box-shadow: 0 5px 0 #080b11, 0 9px 15px -2px rgba(0, 0, 0, .62), inset 0 1px rgba(255, 255, 255, .11);
  transition: transform .13s cubic-bezier(.22, .61, .36, 1), box-shadow .13s cubic-bezier(.22, .61, .36, 1);
}
.threeui-page-button--meridian > span:not(.threeui-page-button__led) {
  position: relative;
  z-index: 1;
  color: #dde5f2;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -.005em;
}
.threeui-page-button--meridian .threeui-page-button__led {
  position: absolute;
  z-index: 1;
  top: 12px;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .16);
  transform: translateX(-50%);
  transition: background .22s ease, box-shadow .22s ease;
}
.threeui-page-button--meridian:hover::before { transform: translateY(4px); box-shadow: 0 1px 0 #080b11, 0 3px 8px -2px rgba(0, 0, 0, .55), inset 0 1px rgba(255, 255, 255, .11); }
.threeui-page-button--meridian:hover .threeui-page-button__led { background: #4da3ff; box-shadow: 0 0 7px #4da3ff; }
.threeui-page-button--meridian-primary { background: #050f1c; box-shadow: inset 0 0 0 1px rgba(77, 163, 255, .22); }
.threeui-page-button--meridian-primary::before { background: linear-gradient(180deg, #6db6ff, #2e85e8); box-shadow: 0 5px 0 #0b4a86, 0 9px 18px -2px rgba(21, 88, 158, .5), inset 0 1px rgba(255, 255, 255, .5); }
.threeui-page-button--meridian-primary > span:not(.threeui-page-button__led) { color: #04182f; }
.threeui-page-button--meridian-primary .threeui-page-button__led { background: rgba(4, 24, 47, .3); }
.threeui-page-button--meridian-primary:hover::before { box-shadow: 0 1px 0 #0b4a86, 0 3px 10px -2px rgba(21, 88, 158, .45), inset 0 1px rgba(255, 255, 255, .5); }
.threeui-page-button--meridian-primary:hover .threeui-page-button__led { background: #04182f; box-shadow: 0 0 6px rgba(4, 24, 47, .55); }
.threeui-page-button-stage--aster {
  background: #101010;
  font-family: "Roboto Flex", "Arial Narrow", Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.threeui-page-button-stage--aster::before {
  background:
    radial-gradient(circle at 64% 42%, rgba(255, 255, 255, .07), transparent 21%),
    radial-gradient(circle at 38% 62%, rgba(255, 255, 255, .035), transparent 27%);
}
.threeui-page-button--aster {
  height: 52px;
  border-radius: 12px;
  isolation: isolate;
  background: rgba(255, 255, 255, .055);
  color: #f1f1f1;
  font-size: 17px;
  font-variation-settings: "wdth" 100, "opsz" 14;
  letter-spacing: -.004em;
  box-shadow: 0 12px 34px -22px rgba(255, 255, 255, .35);
  backdrop-filter: blur(16px) saturate(1.25);
  -webkit-backdrop-filter: blur(16px) saturate(1.25);
  transition: transform .5s cubic-bezier(.22, 1, .36, 1), background .4s ease, color .4s ease, box-shadow .5s cubic-bezier(.22, 1, .36, 1);
}
.threeui-page-button--aster::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(148deg, rgba(255, 255, 255, .72), rgba(255, 255, 255, .16) 34%, rgba(255, 255, 255, .05) 58%, rgba(255, 255, 255, .34));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: filter .45s cubic-bezier(.22, 1, .36, 1);
}
.threeui-page-button--aster::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, .13), transparent 46%);
  pointer-events: none;
}
.threeui-page-button--aster > span { position: relative; z-index: 1; }
.threeui-page-button--aster:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, .15);
  color: #fff;
  box-shadow: 0 8px 26px -12px rgba(255, 255, 255, .42);
}
.threeui-page-button--aster:hover::before { filter: brightness(1.55); }
.threeui-page-button--aster:active { transform: translateY(0); }
.threeui-page-button--aster-access { padding: 0 31px; }
.threeui-page-button--aster-arrow { gap: 17px; padding: 0 7px 0 22px; }
.threeui-page-button--aster-arrow .threeui-page-button__chip {
  display: grid;
  width: 34px;
  height: 34px;
  flex: none;
  place-items: center;
  border-radius: 9px;
  background: rgba(255, 255, 255, .10);
}
.threeui-page-button--aster-arrow .threeui-page-button__chip::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(150deg, rgba(255, 255, 255, .75), rgba(255, 255, 255, .10) 62%, rgba(255, 255, 255, .42));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
}
.threeui-page-button--aster-arrow svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .5s cubic-bezier(.22, 1, .36, 1);
}
.threeui-page-button--aster-arrow:hover svg { transform: translateX(2px); }
.threeui-page-button-stage--ember-keycap {
  background: #080604;
  font-family: "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
}
.threeui-page-button-stage--ember-keycap::before {
  background:
    radial-gradient(ellipse at 50% 56%, rgba(255, 111, 35, .20), transparent 30%),
    linear-gradient(180deg, rgba(255, 119, 45, .035), transparent 58%);
}
.threeui-page-button-ember-wrap {
  position: relative;
  display: inline-block;
}
.threeui-page-button-ember-glow,
.threeui-page-button-ember-bloom {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  mix-blend-mode: plus-lighter;
  transition: opacity .16s ease, transform .16s ease;
}
.threeui-page-button-ember-glow {
  left: 6%;
  right: 6%;
  top: -9px;
  height: 16px;
  background: radial-gradient(closest-side, rgba(255, 222, 182, .95), rgba(255, 138, 54, .62) 50%, rgba(255, 96, 24, 0) 100%);
  filter: blur(4px);
  opacity: 1;
}
.threeui-page-button-ember-bloom {
  left: -10%;
  right: -10%;
  top: -31px;
  height: 58px;
  background: radial-gradient(closest-side, rgba(255, 128, 50, .55), rgba(255, 92, 24, .18) 58%, rgba(255, 72, 14, 0) 100%);
  filter: blur(12px);
  opacity: .85;
}
.threeui-page-button--ember-keycap {
  gap: .85em;
  padding: 1.05em 1.6em 1.1em;
  border-radius: 9px;
  background: linear-gradient(178deg, #4a4d54 0%, #34373d 18%, #23262b 62%, #1a1c20 100%);
  box-shadow:
    inset 0 1.5px 0 rgba(255, 238, 225, .22),
    inset 0 -1px 0 rgba(0, 0, 0, .75),
    0 7px 0 -1px #101215,
    0 12px 26px rgba(0, 0, 0, .62);
  color: #fff1e2;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .13em;
  text-transform: uppercase;
  transform: translateY(0);
  transition: transform .13s cubic-bezier(.3, .7, .3, 1), box-shadow .13s ease;
}
.threeui-page-button--ember-keycap .threeui-page-button__spark {
  width: 1.1em;
  height: 1.1em;
  flex: none;
  fill: #ff8a3d;
  filter: drop-shadow(0 0 .55em rgba(255, 120, 50, .9));
}
.threeui-page-button--ember-keycap .threeui-page-button__price { color: #b9ada3; }
.threeui-page-button-ember-wrap:hover .threeui-page-button--ember-keycap,
.threeui-page-button--ember-keycap:focus-visible {
  transform: translateY(5px);
  box-shadow:
    inset 0 1.5px 0 rgba(255, 238, 225, .26),
    inset 0 -1px 0 rgba(0, 0, 0, .75),
    0 2px 0 -1px #101215,
    0 5px 14px rgba(0, 0, 0, .6);
}
.threeui-page-button--ember-keycap:focus-visible {
  outline-color: #ff9a59;
}
.threeui-page-button-ember-wrap:hover .threeui-page-button-ember-glow,
.threeui-page-button-ember-wrap:focus-within .threeui-page-button-ember-glow {
  transform: translateY(5px) scaleX(1.05);
}
.threeui-page-button-ember-wrap:hover .threeui-page-button-ember-bloom,
.threeui-page-button-ember-wrap:focus-within .threeui-page-button-ember-bloom {
  opacity: 1;
  transform: translateY(5px) scale(1.05);
}
.threeui-page-button--ember-keycap:active { transform: translateY(6px); }
.threeui-page-button-stage--bloom-outline {
  --threeui-bloom-outline-edge: #f5ece6;
  --threeui-bloom-outline-fill: #f5ece6;
  --threeui-bloom-outline-fg: #3f2c33;
  --threeui-page-ink: #f5ece6;
  background: #b5808e;
  font-family: "General Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.threeui-page-button-stage--bloom-outline::before {
  background:
    radial-gradient(ellipse at 29% 24%, rgba(245, 236, 230, .2), transparent 34%),
    radial-gradient(ellipse at 75% 72%, rgba(63, 44, 51, .15), transparent 36%),
    repeating-radial-gradient(circle at 44% 48%, rgba(245, 236, 230, .1) 0 1px, transparent 1px 4px);
  opacity: .7;
  mix-blend-mode: soft-light;
}
.threeui-page-button--bloom-outline {
  --bloom-outline-x: 50%;
  --bloom-outline-y: 50%;
  --bloom-outline-diameter: 220px;
  gap: 13.6px;
  overflow: hidden;
  padding: 14.4px 23.2px;
  border: 1px solid currentColor;
  border-radius: 2px;
  background: transparent;
  color: var(--threeui-bloom-outline-edge);
  font-size: 14.72px;
  font-weight: 400;
  letter-spacing: .045em;
  line-height: 1;
  text-transform: uppercase;
  will-change: transform;
  transition:
    color .38s cubic-bezier(.22, .61, .36, 1),
    border-color .38s cubic-bezier(.22, .61, .36, 1),
    transform .55s cubic-bezier(.19, 1, .22, 1);
}
.threeui-page-button--bloom-outline::before {
  content: "";
  position: absolute;
  z-index: 0;
  left: var(--bloom-outline-x);
  top: var(--bloom-outline-y);
  width: var(--bloom-outline-diameter);
  height: var(--bloom-outline-diameter);
  border-radius: 50%;
  background: var(--threeui-bloom-outline-fill);
  transform: translate(-50%, -50%) scale(0);
  transition: transform .58s cubic-bezier(.19, 1, .22, 1);
}
.threeui-page-button--bloom-outline > * {
  position: relative;
  z-index: 1;
}
.threeui-page-button--bloom-outline:hover,
.threeui-page-button--bloom-outline:focus-visible {
  border-color: var(--threeui-bloom-outline-fg);
  color: var(--threeui-bloom-outline-fg);
}
.threeui-page-button--bloom-outline:hover::before,
.threeui-page-button--bloom-outline:focus-visible::before { transform: translate(-50%, -50%) scale(1); }
.threeui-page-button--bloom-outline .threeui-page-button__bloom-label {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
}
.threeui-page-button--bloom-outline .threeui-page-button__bloom-label > span {
  display: block;
  transition: transform .5s cubic-bezier(.19, 1, .22, 1);
}
.threeui-page-button--bloom-outline .threeui-page-button__bloom-label > span + span {
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(115%);
}
.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-label > span:first-child,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-label > span:first-child { transform: translateY(-115%); }
.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-label > span + span,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-label > span + span { transform: translateY(0); }
.threeui-page-button__bloom-dot {
  width: 4.8px;
  height: 4.8px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
  transition: transform .55s cubic-bezier(.19, 1, .22, 1), opacity .4s;
}
.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-dot:first-child,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-dot:first-child {
  opacity: .5;
  transform: translateX(5.44px) scale(.6);
}
.threeui-page-button--bloom-outline:hover .threeui-page-button__bloom-dot:last-child,
.threeui-page-button--bloom-outline:focus-visible .threeui-page-button__bloom-dot:last-child {
  transform: translateX(-5.44px) scale(1.7);
}

/* ---------------------------------------------------------------- *
   The other ground

   Eight of these treatments were drawn on their page's dark ground and
   Understory on its paper one, so the opposite mode is a re-tone rather
   than a wash: the stage takes the other ground, and every value that
   ground would swallow — edge, ink, sheen, cast shadow — is restated at
   the weight it was authored to read at. Geometry and motion never move.
 * ---------------------------------------------------------------- */
.threeui-page-button-stage[data-mode="light"] { --threeui-page-ink: #14161a; }

/* Trochil — the amber signal sheen, now over warm paper */
.threeui-page-button-stage--trochil[data-mode="light"] { background: #f5f3ee; }
.threeui-page-button-stage--trochil[data-mode="light"]::before {
  background: radial-gradient(circle at 71% 49%, rgba(196, 142, 6, .22), transparent 31%);
  opacity: .9;
}
.threeui-page-button-stage--trochil[data-mode="light"] .threeui-page-button--trochil {
  border-color: rgba(20, 19, 14, .22);
  background: linear-gradient(180deg, rgba(255, 255, 255, .95), rgba(20, 19, 14, .05));
  box-shadow: 0 14px 30px rgba(20, 19, 14, .13), inset 0 1px rgba(255, 255, 255, .9);
  color: rgba(20, 19, 14, .78);
}
.threeui-page-button-stage--trochil[data-mode="light"] .threeui-page-button--trochil::before {
  background: linear-gradient(105deg, transparent 17%, rgba(196, 142, 6, .3) 48%, transparent 76%);
}
.threeui-page-button-stage--trochil[data-mode="light"] .threeui-page-button--trochil:hover {
  border-color: rgba(176, 126, 4, .62);
  color: #14130e;
  box-shadow: 0 18px 38px rgba(20, 19, 14, .17), 0 0 22px rgba(196, 142, 6, .2);
}

/* Attune — the thermal cap already carries its own ink, so only the ground
   and the cast heat change */
.threeui-page-button-stage--attune[data-mode="light"] { background: #faf4ee; }
.threeui-page-button-stage--attune[data-mode="light"]::before {
  background: radial-gradient(circle at 50% 50%, rgba(255, 122, 20, .18), transparent 32%);
}
.threeui-page-button-stage--attune[data-mode="light"] .threeui-page-button--attune {
  box-shadow: inset 0 1px rgba(255, 255, 255, .5), 0 8px 24px rgba(226, 92, 6, .28);
}
.threeui-page-button-stage--attune[data-mode="light"] .threeui-page-button--attune:hover {
  box-shadow: inset 0 1px rgba(255, 255, 255, .58), 0 12px 30px rgba(226, 92, 6, .34);
}

/* Tideform — the outline drops to graphite and the hot state to a deeper
   orange, which is where it clears text contrast on paper */
.threeui-page-button-stage--tideform[data-mode="light"] { background: #eeece7; --threeui-page-ink: #16181a; }
.threeui-page-button-stage--tideform[data-mode="light"]::before {
  background: radial-gradient(ellipse at 76% 44%, rgba(214, 96, 12, .16), transparent 34%);
}
.threeui-page-button-stage--tideform[data-mode="light"] .threeui-page-button--tideform {
  border-color: rgba(22, 24, 26, .26);
  background: rgba(22, 24, 26, .035);
  box-shadow: inset 0 1px rgba(255, 255, 255, .7);
  color: #16181a;
}
.threeui-page-button-stage--tideform[data-mode="light"] .threeui-page-button--tideform:hover {
  border-color: #c25a0c;
  background: rgba(194, 90, 12, .1);
  color: #b4530b;
}

/* Understory runs the other way: the violet capsule is the constant, and
   dark mode is the ground it was never given */
.threeui-page-button-stage--understory[data-mode="dark"] {
  --threeui-page-ink: #ece7e0;
  background: #17141b;
  color: #ece7e0;
}
.threeui-page-button-stage--understory[data-mode="dark"]::before {
  background: radial-gradient(circle at 50% 50%, rgba(155, 120, 208, .16), transparent 34%);
}
.threeui-page-button-stage--understory[data-mode="dark"] .threeui-page-button--understory {
  background: #a482d9;
  box-shadow: 0 16px 34px rgba(0, 0, 0, .5);
}
.threeui-page-button-stage--understory[data-mode="dark"] .threeui-page-button--understory:hover { background: #b08fe2; }

/* Halvorsen is a maximum-contrast pill, so on paper it inverts rather than
   fades — the capsule takes the ink and the endcap takes the paper */
.threeui-page-button-stage--halvorsen[data-mode="light"] { background: #eeece5; }
.threeui-page-button-stage--halvorsen[data-mode="light"]::before {
  background: radial-gradient(circle at 50% 50%, rgba(17, 17, 19, .05), transparent 35%);
}
.threeui-page-button-stage--halvorsen[data-mode="light"] .threeui-page-button--halvorsen {
  background: #111113;
  box-shadow: 0 14px 30px rgba(17, 17, 19, .22);
  color: #f0eee7;
}
.threeui-page-button-stage--halvorsen[data-mode="light"] .threeui-page-button--halvorsen .threeui-page-button__disc {
  background: #f0eee7;
  color: #111113;
}
.threeui-page-button-stage--halvorsen[data-mode="light"] .threeui-page-button--halvorsen:hover { background: #000; }

/* Meridian — the keycap keeps its travel and its hard base edge; only the
   housing, the cap face, and the legend follow the light ground */
.threeui-page-button-stage--meridian[data-mode="light"] { background: #e9eef5; --threeui-page-ink: #04070d; }
.threeui-page-button-stage--meridian[data-mode="light"]::before {
  background: radial-gradient(circle at 50% 44%, rgba(46, 133, 232, .2), transparent 34%);
}
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian {
  background: #dfe5ee;
  box-shadow: inset 0 0 0 1px rgba(4, 7, 13, .09);
}
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian::before {
  background: linear-gradient(180deg, #fbfcfe, #e3e8f1);
  box-shadow: 0 5px 0 #bcc5d3, 0 9px 15px -2px rgba(4, 7, 13, .2), inset 0 1px #fff;
}
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian > span:not(.threeui-page-button__led) { color: #1d2532; }
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian .threeui-page-button__led { background: rgba(4, 7, 13, .18); }
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian:hover::before { box-shadow: 0 1px 0 #bcc5d3, 0 3px 8px -2px rgba(4, 7, 13, .18), inset 0 1px #fff; }
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian:hover .threeui-page-button__led { background: #2e85e8; box-shadow: 0 0 7px #2e85e8; }
/* the primary cap stays blue on both grounds, so it is restated after the
   secondary block rather than inheriting it */
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian-primary {
  background: #dbe7f6;
  box-shadow: inset 0 0 0 1px rgba(46, 133, 232, .3);
}
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian-primary::before {
  background: linear-gradient(180deg, #6db6ff, #2e85e8);
  box-shadow: 0 5px 0 #1d6dc4, 0 9px 18px -2px rgba(21, 88, 158, .32), inset 0 1px rgba(255, 255, 255, .5);
}
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian-primary > span:not(.threeui-page-button__led) { color: #04182f; }
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian-primary .threeui-page-button__led { background: rgba(4, 24, 47, .3); }
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian-primary:hover::before { box-shadow: 0 1px 0 #1d6dc4, 0 3px 10px -2px rgba(21, 88, 158, .3), inset 0 1px rgba(255, 255, 255, .5); }
.threeui-page-button-stage--meridian[data-mode="light"] .threeui-page-button--meridian-primary:hover .threeui-page-button__led { background: #04182f; box-shadow: 0 0 6px rgba(4, 24, 47, .55); }

/* Aster — the glass is a white edge lit from one corner, so on paper the
   whole build flips to graphite and the hover brightening becomes darkening */
.threeui-page-button-stage--aster[data-mode="light"] { background: #eceae7; --threeui-page-ink: #101010; }
.threeui-page-button-stage--aster[data-mode="light"]::before {
  background:
    radial-gradient(circle at 64% 42%, rgba(16, 16, 16, .06), transparent 21%),
    radial-gradient(circle at 38% 62%, rgba(16, 16, 16, .035), transparent 27%);
}
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster {
  background: rgba(16, 16, 16, .05);
  box-shadow: 0 14px 34px -22px rgba(16, 16, 16, .55);
  color: #16181a;
}
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster::before {
  background: linear-gradient(148deg, rgba(16, 16, 16, .45), rgba(16, 16, 16, .12) 34%, rgba(16, 16, 16, .05) 58%, rgba(16, 16, 16, .26));
}
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, .8), transparent 46%);
}
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster:hover {
  background: rgba(16, 16, 16, .1);
  box-shadow: 0 8px 26px -12px rgba(16, 16, 16, .3);
  color: #000;
}
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster:hover::before { filter: brightness(.68); }
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster-arrow .threeui-page-button__chip { background: rgba(16, 16, 16, .07); }
.threeui-page-button-stage--aster[data-mode="light"] .threeui-page-button--aster-arrow .threeui-page-button__chip::before {
  background: linear-gradient(150deg, rgba(16, 16, 16, .5), rgba(16, 16, 16, .1) 62%, rgba(16, 16, 16, .3));
}
.threeui-page-button-stage--ember-keycap[data-mode="light"] {
  background: #f2ece6;
  --threeui-page-ink: #1a1511;
}
.threeui-page-button-stage--ember-keycap[data-mode="light"]::before {
  background: radial-gradient(ellipse at 50% 56%, rgba(221, 84, 12, .20), transparent 30%);
}
.threeui-page-button-stage--ember-keycap[data-mode="light"] .threeui-page-button-ember-bloom {
  opacity: .66;
}
.threeui-page-button-stage--bloom-outline[data-mode="light"] {
  --threeui-bloom-outline-edge: #3f2c33;
  --threeui-bloom-outline-fill: #3f2c33;
  --threeui-bloom-outline-fg: #f5ece6;
  --threeui-page-ink: #3f2c33;
  background: #f5ece6;
}
.threeui-page-button-stage--bloom-outline[data-mode="light"]::before {
  background:
    radial-gradient(ellipse at 29% 24%, rgba(181, 128, 142, .2), transparent 34%),
    radial-gradient(ellipse at 75% 72%, rgba(63, 44, 51, .08), transparent 36%),
    repeating-radial-gradient(circle at 44% 48%, rgba(138, 95, 108, .08) 0 1px, transparent 1px 4px);
  mix-blend-mode: multiply;
}
@media (prefers-reduced-motion: reduce) {
  .threeui-page-button, .threeui-page-button::before, .threeui-page-button svg,
  .threeui-page-button-ember-glow, .threeui-page-button-ember-bloom { transition-duration: .01ms !important; }
  .threeui-page-button--bloom-outline { transform: none !important; }
}
`;

type SelectedPageButtonProps = Pick<NeuformIsolatedEffectProps, "mode" | "className" | "style"> & {
  variant: SelectedPageButtonVariant;
};

function ArrowIcon({ long = false }: { long?: boolean }) {
  return long ? (
    <svg viewBox="0 0 21 9" aria-hidden="true"><path d="M0 4.5h18M14.5 1.2 18.3 4.5l-3.8 3.3" /></svg>
  ) : (
    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5 8 6 3 10.5" /></svg>
  );
}

function SelectedPageButton({ variant, mode = "dark", className = "", style }: SelectedPageButtonProps) {
  let theme = "trochil";
  let button: ReactNode = null;

  switch (variant) {
    case "trochil-signal":
      button = <button className="threeui-page-button threeui-page-button--trochil" type="button"><span>Request access</span></button>;
      break;
    case "attune-thermal":
      theme = "attune";
      button = <button className="threeui-page-button threeui-page-button--attune" type="button"><span>Start free</span><ArrowIcon /></button>;
      break;
    case "tideform-outline":
      theme = "tideform";
      button = <button className="threeui-page-button threeui-page-button--tideform" type="button"><span>See the work</span><ArrowIcon long /></button>;
      break;
    case "understory-arrow-pill":
      theme = "understory";
      button = <button className="threeui-page-button threeui-page-button--arrow-pill threeui-page-button--understory" type="button"><span>Begin</span><span className="threeui-page-button__disc"><ArrowIcon /></span></button>;
      break;
    case "meridian-keycap-primary":
      theme = "meridian";
      button = <button className="threeui-page-button threeui-page-button--meridian threeui-page-button--meridian-primary" type="button"><span className="threeui-page-button__led" /><span>Start free</span></button>;
      break;
    case "meridian-keycap-secondary":
      theme = "meridian";
      button = <button className="threeui-page-button threeui-page-button--meridian" type="button"><span className="threeui-page-button__led" /><span>Book a walkthrough</span></button>;
      break;
    case "halvorsen-arrow-pill":
      theme = "halvorsen";
      button = <button className="threeui-page-button threeui-page-button--arrow-pill threeui-page-button--halvorsen" type="button"><span>See the work</span><span className="threeui-page-button__disc"><ArrowIcon /></span></button>;
      break;
    case "aster-glass-access":
      theme = "aster";
      button = <button className="threeui-page-button threeui-page-button--aster threeui-page-button--aster-access" type="button"><span>Get access</span></button>;
      break;
    case "aster-glass-arrow":
      theme = "aster";
      button = <button className="threeui-page-button threeui-page-button--aster threeui-page-button--aster-arrow" type="button"><span>Start free</span><span className="threeui-page-button__chip"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8M6.6 2.6 10 6 6.6 9.4" /></svg></span></button>;
      break;
    case "ember-keycap":
      theme = "ember-keycap";
      button = (
        <span className="threeui-page-button-ember-wrap">
          <button className="threeui-page-button threeui-page-button--ember-keycap" type="button">
            <svg className="threeui-page-button__spark" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 L61 39 L96 50 L61 61 L50 96 L39 61 L4 50 L39 39 Z" /></svg>
            <span>Pre-order</span>
            <span className="threeui-page-button__price">$249</span>
          </button>
          <span className="threeui-page-button-ember-glow" aria-hidden="true" />
          <span className="threeui-page-button-ember-bloom" aria-hidden="true" />
        </span>
      );
      break;
    case "bloom-outline-button":
      theme = "bloom-outline";
      button = (
        <button
          className="threeui-page-button threeui-page-button--bloom-outline"
          type="button"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const diameter = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
            event.currentTarget.style.setProperty("--bloom-outline-x", `${x.toFixed(1)}px`);
            event.currentTarget.style.setProperty("--bloom-outline-y", `${y.toFixed(1)}px`);
            event.currentTarget.style.setProperty("--bloom-outline-diameter", `${diameter.toFixed(1)}px`);
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              const dx = (x - rect.width / 2) / rect.width;
              const dy = (y - rect.height / 2) / rect.height;
              event.currentTarget.style.transform = `translate3d(${(dx * 14).toFixed(1)}px, ${(dy * 9).toFixed(1)}px, 0)`;
            }
          }}
          onPointerLeave={(event) => { event.currentTarget.style.transform = ""; }}
        >
          <span className="threeui-page-button__bloom-dot" aria-hidden="true" />
          <span className="threeui-page-button__bloom-label">
            <span>See the season</span>
            <span aria-hidden="true">See the season</span>
          </span>
          <span className="threeui-page-button__bloom-dot" aria-hidden="true" />
        </button>
      );
      break;
  }

  return (
    <div
      className={`threeui-page-button-stage threeui-page-button-stage--${theme}${className ? ` ${className}` : ""}`}
      data-mode={mode}
      data-variant={variant}
      style={style}
    >
      <style>{SELECTED_PAGE_BUTTON_STYLES}</style>
      {button}
    </div>
  );
}

export function RectangleButtons({ variant = "dark-pill", ...props }: RectangleButtonsProps) {
  if (variant === "dark-pill") {
    return <DarkGlassRectangle className={props.className} style={props.style} mode={props.mode === "light" ? "light" : "dark"} />;
  }

  if (variant === "lumen-cta" || variant === "lumen-cta-ghost") {
    return (
      <Suspense fallback={null}>
        <LumenCta {...props} variant={variant === "lumen-cta-ghost" ? "ghost" : "primary"} />
      </Suspense>
    );
  }

  if (isSelectedPageButtonVariant(variant)) {
    return (
      <SelectedPageButton
        variant={variant}
        mode={props.mode}
        className={props.className}
        style={props.style}
      />
    );
  }

  const Variant = RECTANGLE_VARIANTS[variant];
  return (
    <Suspense fallback={null}>
      <Variant {...props} />
    </Suspense>
  );
}

/** @deprecated Use RectangleButtons. */
export const DarkGlassButton = RectangleButtons;
/** @deprecated Use RectangleButtonsProps. */
export type DarkGlassButtonProps = RectangleButtonsProps;
/** @deprecated Use RectangleButtonVariant. */
export type DarkGlassButtonVariant = RectangleButtonVariant;
