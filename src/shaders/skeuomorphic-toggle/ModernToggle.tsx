import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import "./modern-toggle.css";
import { clamp, useToggleMode, type ToggleModePreference } from "./toggleMode";

export type ModernToggleProps = {
  mode?: ToggleModePreference;
  defaultOn?: boolean;
  label?: string;
  size?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  onChange?: (on: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

export const MODERN_TOGGLE_DEFAULTS = {
  mode: "auto" as ToggleModePreference,
  defaultOn: true,
  label: "Live Sync",
  size: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

export function ModernToggle({
  mode = MODERN_TOGGLE_DEFAULTS.mode,
  defaultOn = MODERN_TOGGLE_DEFAULTS.defaultOn,
  label = MODERN_TOGGLE_DEFAULTS.label,
  size = MODERN_TOGGLE_DEFAULTS.size,
  opacity = MODERN_TOGGLE_DEFAULTS.opacity,
  hue = MODERN_TOGGLE_DEFAULTS.hue,
  saturation = MODERN_TOGGLE_DEFAULTS.saturation,
  brightness = MODERN_TOGGLE_DEFAULTS.brightness,
  onChange,
  className,
  style,
}: ModernToggleProps) {
  const resolvedMode = useToggleMode(mode);
  const [on, setOn] = useState(defaultOn);
  const switchRef = useRef<HTMLButtonElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  /* A light spring rather than an eased transition: the knob leans into the
     travel, trails a little squash behind it, and settles with one small
     overshoot. Damping ratio ~0.67 — enough to read as a spring, well short
     of bouncy. */
  useEffect(() => {
    const control = switchRef.current;
    const thumb = thumbRef.current;
    if (!control || !thumb) return undefined;

    const reduceMotion = typeof window !== "undefined"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = on ? 1 : 0;
    let value = Number(thumb.dataset.progress ?? (on ? 1 : 0));
    let velocity = Number(thumb.dataset.velocity ?? 0);
    let handle = 0;
    let last = performance.now();

    const apply = (progress: number, speed: number) => {
      const travel = Math.max(0, control.clientWidth - thumb.offsetLeft * 2 - thumb.offsetWidth);
      /* Squash scales with how fast it is actually moving, and trails the
         direction of travel. */
      const lean = Math.min(1, Math.abs(speed) / 6);
      const scaleX = 1 + lean * 0.16;
      const scaleY = 1 - lean * 0.1;
      thumb.style.transformOrigin = speed >= 0 ? "right center" : "left center";
      thumb.style.transform =
        `translate3d(${(progress * travel).toFixed(2)}px, 0, 0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
    };

    if (reduceMotion) {
      thumb.dataset.progress = String(target);
      thumb.dataset.velocity = "0";
      apply(target, 0);
      return undefined;
    }

    const step = (now: number) => {
      const delta = Math.min(0.032, (now - last) / 1000);
      last = now;
      const stiffness = 210;
      const damping = 19.5;
      velocity += ((target - value) * stiffness - velocity * damping) * delta;
      value += velocity * delta;
      thumb.dataset.progress = String(value);
      thumb.dataset.velocity = String(velocity);
      apply(value, velocity);
      if (Math.abs(target - value) < 0.0006 && Math.abs(velocity) < 0.006) {
        value = target;
        velocity = 0;
        thumb.dataset.progress = String(target);
        thumb.dataset.velocity = "0";
        apply(target, 0);
        return;
      }
      handle = window.requestAnimationFrame(step);
    };

    handle = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(handle);
  }, [on]);

  const flip = useCallback(() => {
    setOn((current) => {
      const next = !current;
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const stageStyle = {
    "--modern-toggle-scale": clamp(size, 0.35, 2.5),
    "--modern-toggle-hue": `${clamp(hue, -180, 180)}deg`,
    "--modern-toggle-saturation": clamp(saturation, 0, 2),
    "--modern-toggle-brightness": clamp(brightness, 0.35, 1.65),
    opacity: clamp(opacity, 0.05, 1),
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`modern-toggle${className ? ` ${className}` : ""}`}
      data-mode={resolvedMode}
      data-state={on ? "on" : "off"}
      style={stageStyle}
    >
      <div className="modern-toggle__halo" aria-hidden="true" />
      <div className="modern-toggle__stack">
        <button
          type="button"
          ref={switchRef}
          className="modern-toggle__switch"
          role="switch"
          aria-checked={on}
          aria-label={label}
          onClick={flip}
        >
          <span className="modern-toggle__track" aria-hidden="true" />
          <span ref={thumbRef} className="modern-toggle__thumb" aria-hidden="true">
            <span className="modern-toggle__mark">
              <svg viewBox="0 0 24 24" data-mark="check" aria-hidden="true">
                <path d="M5 12.8 9.6 17.4 19 8" />
              </svg>
              <svg viewBox="0 0 24 24" data-mark="dash" aria-hidden="true">
                <path d="M6.5 12h11" />
              </svg>
            </span>
          </span>
        </button>
        <p className="modern-toggle__caption">
          <span>{label}</span>
          <b>{on ? "On" : "Off"}</b>
        </p>
      </div>
    </div>
  );
}
