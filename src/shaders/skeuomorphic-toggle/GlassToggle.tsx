import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import "./glass-toggle.css";
import { createGlassToggleScene, type GlassToggleScene } from "./glassToggleScene";
import { clamp, useToggleMode, type ToggleModePreference } from "./toggleMode";

export type GlassToggleProps = {
  mode?: ToggleModePreference;
  defaultOn?: boolean;
  label?: string;
  speed?: number;
  size?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  onChange?: (on: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

export const GLASS_TOGGLE_DEFAULTS = {
  mode: "auto" as ToggleModePreference,
  defaultOn: true,
  label: "Live Sync",
  speed: 1,
  size: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

export function GlassToggle({
  mode = GLASS_TOGGLE_DEFAULTS.mode,
  defaultOn = GLASS_TOGGLE_DEFAULTS.defaultOn,
  label = GLASS_TOGGLE_DEFAULTS.label,
  speed = GLASS_TOGGLE_DEFAULTS.speed,
  size = GLASS_TOGGLE_DEFAULTS.size,
  opacity = GLASS_TOGGLE_DEFAULTS.opacity,
  hue = GLASS_TOGGLE_DEFAULTS.hue,
  saturation = GLASS_TOGGLE_DEFAULTS.saturation,
  brightness = GLASS_TOGGLE_DEFAULTS.brightness,
  onChange,
  className,
  style,
}: GlassToggleProps) {
  const resolvedMode = useToggleMode(mode);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<GlassToggleScene | null>(null);
  const [on, setOn] = useState(defaultOn);
  const [supported, setSupported] = useState(true);

  const flip = useCallback(() => {
    setOn((current) => {
      const next = !current;
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let scene: GlassToggleScene;
    try {
      scene = createGlassToggleScene({ canvas, mode: resolvedMode, speed, on: defaultOn });
    } catch {
      setSupported(false);
      return undefined;
    }
    sceneRef.current = scene;

    const syncSwitchFootprint = () => {
      const control = switchRef.current;
      if (!control) return;
      const footprint = scene.measureSwitch();
      control.style.width = `${Math.round(footprint.width)}px`;
      control.style.height = `${Math.round(footprint.height)}px`;
    };

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      scene.resize(box.width, box.height);
      syncSwitchFootprint();
    });
    observer.observe(host);
    scene.resize(host.clientWidth, host.clientHeight);
    syncSwitchFootprint();

    return () => {
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
    /* The scene is rebuilt only for the host element; appearance, speed and
       state are pushed through the imperative handles below. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setMode(resolvedMode);
  }, [resolvedMode]);

  useEffect(() => {
    sceneRef.current?.setSpeed(clamp(speed, 0, 3));
  }, [speed]);

  useEffect(() => {
    sceneRef.current?.setSize(clamp(size, 0.35, 2.5));
    const control = switchRef.current;
    const footprint = sceneRef.current?.measureSwitch();
    if (!control || !footprint) return;
    control.style.width = `${Math.round(footprint.width)}px`;
    control.style.height = `${Math.round(footprint.height)}px`;
  }, [size]);

  useEffect(() => {
    sceneRef.current?.setOn(on);
  }, [on]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const host = hostRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    sceneRef.current?.setPointer(clamp(x, -1, 1), clamp(-y, -1, 1));
  };

  const stageStyle = {
    "--glass-toggle-hue": `${clamp(hue, -180, 180)}deg`,
    "--glass-toggle-saturation": clamp(saturation, 0, 2),
    "--glass-toggle-brightness": clamp(brightness, 0.35, 1.65),
    opacity: clamp(opacity, 0.05, 1),
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={hostRef}
      className={`glass-toggle${className ? ` ${className}` : ""}`}
      data-mode={resolvedMode}
      data-state={on ? "on" : "off"}
      style={stageStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => sceneRef.current?.setPointer(0, 0)}
      onClick={flip}
    >
      <canvas ref={canvasRef} className="glass-toggle__canvas" />
      <button
        ref={switchRef}
        type="button"
        className="glass-toggle__switch"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={(event) => {
          /* The whole stage is clickable, so keep the button from toggling twice. */
          event.stopPropagation();
          flip();
        }}
      />
      <p className="glass-toggle__caption">
        <span>{label}</span>
        <b>{on ? "On" : "Off"}</b>
      </p>
      {supported ? null : (
        <p className="glass-toggle__fallback">This variant needs WebGL, which this browser did not provide.</p>
      )}
    </div>
  );
}
