import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import "./shader-toggle.css";
import { createShaderToggleScene, type ShaderToggleScene } from "./shaderToggleScene";
import { clamp, useToggleMode, type ToggleModePreference } from "./toggleMode";

export type ShaderToggleProps = {
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

export const SHADER_TOGGLE_DEFAULTS = {
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

export function ShaderToggle({
  mode = SHADER_TOGGLE_DEFAULTS.mode,
  defaultOn = SHADER_TOGGLE_DEFAULTS.defaultOn,
  label = SHADER_TOGGLE_DEFAULTS.label,
  speed = SHADER_TOGGLE_DEFAULTS.speed,
  size = SHADER_TOGGLE_DEFAULTS.size,
  opacity = SHADER_TOGGLE_DEFAULTS.opacity,
  hue = SHADER_TOGGLE_DEFAULTS.hue,
  saturation = SHADER_TOGGLE_DEFAULTS.saturation,
  brightness = SHADER_TOGGLE_DEFAULTS.brightness,
  onChange,
  className,
  style,
}: ShaderToggleProps) {
  const resolvedMode = useToggleMode(mode);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<ShaderToggleScene | null>(null);
  const [on, setOn] = useState(defaultOn);
  const [supported, setSupported] = useState(true);

  const flip = useCallback(() => {
    setOn((current) => {
      const next = !current;
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const syncSwitchFootprint = useCallback(() => {
    const control = switchRef.current;
    const footprint = sceneRef.current?.measureSwitch();
    if (!control || !footprint) return;
    control.style.width = `${Math.round(footprint.width)}px`;
    control.style.height = `${Math.round(footprint.height)}px`;
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let scene: ShaderToggleScene;
    try {
      scene = createShaderToggleScene({
        canvas,
        mode: resolvedMode,
        speed,
        size: clamp(size, 0.35, 2.5),
        on: defaultOn,
      });
    } catch {
      setSupported(false);
      return undefined;
    }
    sceneRef.current = scene;

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
    /* Built once for the host element; every knob below is pushed in. */
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
    syncSwitchFootprint();
  }, [size, syncSwitchFootprint]);

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
    "--shader-toggle-hue": `${clamp(hue, -180, 180)}deg`,
    "--shader-toggle-saturation": clamp(saturation, 0, 2),
    "--shader-toggle-brightness": clamp(brightness, 0.35, 1.65),
    opacity: clamp(opacity, 0.05, 1),
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={hostRef}
      className={`shader-toggle${className ? ` ${className}` : ""}`}
      data-mode={resolvedMode}
      data-state={on ? "on" : "off"}
      style={stageStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => sceneRef.current?.setPointer(0, 0)}
      onClick={flip}
    >
      <canvas ref={canvasRef} className="shader-toggle__canvas" />
      <button
        ref={switchRef}
        type="button"
        className="shader-toggle__switch"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={(event) => {
          /* The whole stage is clickable, so keep the button from toggling twice. */
          event.stopPropagation();
          flip();
        }}
      />
      <p className="shader-toggle__caption">
        <span>{label}</span>
        <b>{on ? "On" : "Off"}</b>
      </p>
      {supported ? null : (
        <p className="shader-toggle__fallback">This variant needs WebGL, which this browser did not provide.</p>
      )}
    </div>
  );
}
