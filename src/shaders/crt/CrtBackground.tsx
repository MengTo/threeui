import { useEffect, useRef } from "react";
import { createCrtRenderer, crtStyle, CRT_DEFAULTS, CRT_VARIANTS, type CrtOptions } from "./crtRenderer";
import type { CrtVariant } from "./crtScreens";

export { CRT_VARIANTS };
export type { CrtVariant };
export type CrtBackgroundProps = Partial<CrtOptions> & { className?: string };
export function CrtBackground({ className = "", ...props }: CrtBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null), canvasRef = useRef<HTMLCanvasElement>(null), optionsRef = useRef({ ...CRT_DEFAULTS, ...props }); optionsRef.current = { ...CRT_DEFAULTS, ...props };
  useEffect(() => { const host = hostRef.current, canvas = canvasRef.current; if (!host || !canvas) return undefined; const renderer = createCrtRenderer(host, canvas, () => optionsRef.current); let frame = 0, visible = true; const resize = () => { renderer.resize(); renderer.render(performance.now()); }, tick = (now: number) => { renderer.render(now); frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0; }; const resizeObserver = new ResizeObserver(resize), intersection = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (visible && !frame) frame = requestAnimationFrame(tick); if (!visible && frame) cancelAnimationFrame(frame), frame = 0; }); resizeObserver.observe(host); intersection.observe(host); resize(); frame = requestAnimationFrame(tick); return () => { if (frame) cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect(); renderer.dispose(); }; }, []);
  const options = optionsRef.current; return <div ref={hostRef} className={`threeui-background crt crt-${options.variant}${className ? ` ${className}` : ""}`} style={{ background: crtStyle(options.variant).background, opacity: options.opacity, filter: `hue-rotate(${options.hue}deg) saturate(${options.saturation}) brightness(${options.brightness})` }}><canvas ref={canvasRef} /></div>;
}
