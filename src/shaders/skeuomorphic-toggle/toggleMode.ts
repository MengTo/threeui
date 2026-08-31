import { useEffect, useState } from "react";

export type ToggleMode = "dark" | "light";
export type ToggleModePreference = ToggleMode | "auto";

export function readAutomaticToggleMode(): ToggleMode {
  if (typeof document === "undefined" || typeof window === "undefined") return "dark";
  const root = document.documentElement;
  const declared = root.dataset.theme ?? root.dataset.scheme;
  if (declared === "light" || declared === "dark") return declared;
  if (root.classList.contains("light")) return "light";
  if (root.classList.contains("dark")) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/* Mirrors the packaged export's automatic appearance: the site's own
   data-theme/data-scheme attribute wins, then the system preference. */
export function useToggleMode(preference: ToggleModePreference): ToggleMode {
  const enabled = preference === "auto";
  const [automatic, setAutomatic] = useState<ToggleMode>(readAutomaticToggleMode);

  useEffect(() => {
    if (!enabled || typeof document === "undefined" || typeof window === "undefined") return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setAutomatic(readAutomaticToggleMode());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-scheme", "data-theme"],
    });
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [enabled]);

  if (preference === "light" || preference === "dark") return preference;
  return automatic;
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
