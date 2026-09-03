import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

import type { NeuformIsolatedEffectProps } from "../neuform-isolated/NeuformIsolatedEffects";

export type ShaderButtonVariant =
  | "star-portal"
  | "ignition-button"
  | "induction-button"
  | "plasma-button"
  | "tactile-button"
  | "thinking-button"
  | "raking-light-pill";

/** @deprecated Variant names that shipped before a rename. Use {@link ShaderButtonVariant}. */
export type LegacyShaderButtonVariant = "uploading-button";

export type ShaderButtonsProps = NeuformIsolatedEffectProps & {
  variant?: ShaderButtonVariant | LegacyShaderButtonVariant;
};

const LEGACY_SHADER_BUTTON_VARIANTS = {
  "uploading-button": "thinking-button",
} satisfies Record<LegacyShaderButtonVariant, ShaderButtonVariant>;

const SHADER_BUTTON_VARIANTS = {
  "star-portal": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.StarPortal })),
  ),
  "ignition-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.IgnitionButton })),
  ),
  "induction-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.InductionButton })),
  ),
  "plasma-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.PlasmaButton })),
  ),
  "tactile-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.TactileButton })),
  ),
  "thinking-button": lazy(() =>
    import("../neuform-isolated/NeuformIsolatedEffects").then((module) => ({ default: module.ThinkingButton })),
  ),
  "raking-light-pill": lazy(() =>
    import("./RakingLightPillButton").then((module) => ({ default: module.RakingLightPillButton })),
  ),
} satisfies Record<ShaderButtonVariant, LazyExoticComponent<ComponentType<NeuformIsolatedEffectProps>>>;

export function ShaderButtons({ variant = "star-portal", ...props }: ShaderButtonsProps) {
  const resolved = variant in LEGACY_SHADER_BUTTON_VARIANTS
    ? LEGACY_SHADER_BUTTON_VARIANTS[variant as LegacyShaderButtonVariant]
    : variant as ShaderButtonVariant;
  const Variant = SHADER_BUTTON_VARIANTS[resolved];

  return (
    <Suspense fallback={null}>
      <Variant {...props} />
    </Suspense>
  );
}
