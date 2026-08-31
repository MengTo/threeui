import { useMemo } from "react";

import {
  NEUFORM_CRAFT_DEFAULTS,
  WovenCloth as WovenClothSource,
  type NeuformCraftEffectProps,
} from "../neuform-isolated/NeuformCraftEffects";
import atelierSource from "./woven-cloth-atelier.html?raw";
import iridescentSource from "./woven-cloth-iridescent.html?raw";
import washiSource from "./woven-cloth-washi.html?raw";

export const WOVEN_CLOTH_VARIANTS = ["woven-cloth", "iridescent", "atelier", "washi"] as const;
export type WovenClothVariant = (typeof WOVEN_CLOTH_VARIANTS)[number];

export type WovenClothProps = NeuformCraftEffectProps & {
  variant?: WovenClothVariant;
};

/* "woven-cloth" is the packaged Neuform export, rendered by its own isolated
   host so the authored document stays exactly as supplied. The other three are
   complete first-party documents: each keeps the parent's Verlet sheet and its
   habit of printing the wordmark into the textile, and rebuilds the material,
   the construction and the light around a different cloth. */
type CompanionDefinition = {
  title: string;
  background: string;
  source: string;
};

const COMPANIONS: Record<Exclude<WovenClothVariant, "woven-cloth">, CompanionDefinition> = {
  iridescent: {
    title: "Woven Cloth iridescent silk",
    background: "#05060d",
    source: iridescentSource,
  },
  atelier: {
    title: "Woven Cloth atelier flag",
    background: "#12100d",
    source: atelierSource,
  },
  washi: {
    title: "Woven Cloth washi noren",
    background: "#0d0a07",
    source: washiSource,
  },
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function CompanionCloth({
  definition,
  hue = NEUFORM_CRAFT_DEFAULTS.hue,
  saturation = NEUFORM_CRAFT_DEFAULTS.saturation,
  brightness = NEUFORM_CRAFT_DEFAULTS.brightness,
  className,
  style,
}: NeuformCraftEffectProps & { definition: CompanionDefinition }) {
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter = safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
    ? undefined
    : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      className={className}
      title={definition.title}
      srcDoc={definition.source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background: definition.background,
        filter,
        ...style,
      }}
    />
  );
}

export function WovenCloth({ variant = "woven-cloth", ...props }: WovenClothProps) {
  const definition = useMemo(
    () => (variant === "woven-cloth" ? undefined : COMPANIONS[variant] ?? undefined),
    [variant],
  );
  if (!definition) return <WovenClothSource {...props} />;
  return <CompanionCloth {...props} key={variant} definition={definition} />;
}
