import { useEffect, useRef } from "react";

import type { NeuformIsolatedEffectProps } from "../neuform-isolated/NeuformIsolatedEffects";

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  uniform float uLight;
  uniform vec2 uSize;

  float hash21(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float boxSD(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + r;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float radius = uSize.y * 0.5;
    float sd = boxSD(p, uSize * 0.5, radius);
    float mask = 1.0 - smoothstep(-1.2, 0.6, sd);
    if (mask < 0.004) discard;

    float t = uTime;
    vec2 q = p / uSize.y;
    float aspect = uSize.x / uSize.y;

    vec3 darkPlate = mix(vec3(0.028, 0.022, 0.028), vec3(0.068, 0.050, 0.056), vUv.y);
    vec3 lightPlate = mix(vec3(0.930, 0.884, 0.842), vec3(0.985, 0.957, 0.925), vUv.y);
    vec3 col = mix(darkPlate, lightPlate, uLight);

    float s = q.x + q.y * 1.15;
    float rays = pow(max(0.0, sin(s * 3.6 - t * 0.50)), 1.7) * 0.62
               + pow(max(0.0, sin(s * 8.1 + t * 0.29 + 1.3)), 2.2) * 0.38;
    float head = (fract(t * 0.11) * 2.4 - 1.2) * aspect * 0.5;
    rays *= 0.22 + 1.15 * exp(-pow((q.x - head) * 1.30, 2.0));
    vec3 rayInk = mix(vec3(1.00, 0.82, 0.56), vec3(0.48, 0.25, 0.24), uLight);
    col += rayInk * rays * (0.20 + 0.42 * uHover);

    float motes = 0.0;
    for (int i = 0; i < 2; i++) {
      float fi = float(i);
      vec2 g = q * (4.2 + fi * 2.4) + vec2(fi * 7.3, -t * (0.26 + fi * 0.15) + fi * 3.1);
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;
      float hs = hash21(cell + fi * 17.0);
      if (hs < 0.45) continue;
      vec2 offset = (vec2(hs, fract(hs * 31.7)) - 0.5) * 0.62;
      float twinkle = 0.30 + 0.70 * sin(t * (1.3 + hs * 2.2) + hs * 40.0);
      motes += smoothstep(0.20, 0.02, length(f - offset)) * max(twinkle, 0.0) * (0.30 + 0.70 * hs);
    }
    vec3 moteInk = mix(vec3(1.00, 0.95, 0.86), vec3(0.34, 0.18, 0.20), uLight);
    col += moteInk * motes * (0.34 + 0.60 * uHover);

    float alpha = mask * (0.88 + 0.12 * uHover);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

const STYLES = `
  .threeui-raking-light-pill-stage {
    --threeui-raking-light-pill-ink: #fff;
    --threeui-raking-light-pill-edge: rgba(255, 255, 255, .26);
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    min-height: 240px;
    place-items: center;
    overflow: hidden;
    isolation: isolate;
    background: #160d0c;
  }
  .threeui-raking-light-pill-stage::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 68% 36%, rgba(126, 66, 43, .18), transparent 31%),
      radial-gradient(circle at 28% 74%, rgba(72, 25, 18, .28), transparent 38%),
      linear-gradient(132deg, #120b0a 0%, #21100d 52%, #0f0909 100%);
  }
  .threeui-raking-light-pill {
    position: relative;
    display: inline-flex;
    height: 45.9px;
    align-items: center;
    justify-content: center;
    padding: 0 23.4px;
    overflow: hidden;
    border: 1px solid var(--threeui-raking-light-pill-edge);
    border-radius: 999px;
    background: transparent;
    color: var(--threeui-raking-light-pill-ink);
    font: 400 18px/1 "Switzer", "Neue Montreal", -apple-system, "Helvetica Neue", Arial, sans-serif;
    white-space: nowrap;
    cursor: pointer;
    transition: border-color .45s cubic-bezier(.2, .75, .25, 1), transform .6s cubic-bezier(.2, .75, .25, 1);
    -webkit-font-smoothing: antialiased;
  }
  .threeui-raking-light-pill canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
  }
  .threeui-raking-light-pill span {
    position: relative;
    z-index: 1;
  }
  .threeui-raking-light-pill:hover {
    border-color: rgba(255, 255, 255, .5);
  }
  .threeui-raking-light-pill:focus-visible {
    outline: 2px solid var(--threeui-raking-light-pill-ink);
    outline-offset: 5px;
  }
  .threeui-raking-light-pill-stage[data-mode="light"] {
    --threeui-raking-light-pill-ink: #3f2c33;
    --threeui-raking-light-pill-edge: rgba(63, 44, 51, .28);
    background: #efe6dc;
  }
  .threeui-raking-light-pill-stage[data-mode="light"]::before {
    background:
      radial-gradient(circle at 68% 36%, rgba(162, 102, 78, .13), transparent 31%),
      radial-gradient(circle at 28% 74%, rgba(102, 53, 49, .08), transparent 38%),
      linear-gradient(132deg, #f4ece3 0%, #e7d9cd 52%, #f8f2eb 100%);
  }
  .threeui-raking-light-pill-stage[data-mode="light"] .threeui-raking-light-pill:hover {
    border-color: rgba(63, 44, 51, .5);
  }
  @media (prefers-reduced-motion: reduce) {
    .threeui-raking-light-pill { transition-duration: .01ms; }
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function RakingLightPillButton({
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
  className = "",
  style,
}: NeuformIsolatedEffectProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!gl) return undefined;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    if (!program) return undefined;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "aPosition");
    const timeUniform = gl.getUniformLocation(program, "uTime");
    const hoverUniform = gl.getUniformLocation(program, "uHover");
    const lightUniform = gl.getUniformLocation(program, "uLight");
    const sizeUniform = gl.getUniformLocation(program, "uSize");
    gl.useProgram(program);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    }, { rootMargin: "80px" });
    visibilityObserver.observe(stage);

    const startedAt = performance.now();
    let hover = 0;
    let animationFrame = 0;
    const render = (now: number) => {
      hover += (hoverTargetRef.current - hover) * 0.085;
      if (visible && !document.hidden) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(timeUniform, motionQuery.matches ? 2.4 : (now - startedAt) / 1000);
        gl.uniform1f(hoverUniform, hover);
        gl.uniform1f(lightUniform, mode === "light" ? 1 : 0);
        gl.uniform2f(sizeUniform, width, height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [mode]);

  return (
    <div
      ref={stageRef}
      className={`threeui-background threeui-raking-light-pill-stage${className ? ` ${className}` : ""}`}
      data-mode={mode}
      data-variant="raking-light-pill"
      style={style}
    >
      <style>{STYLES}</style>
      <button
        className="threeui-raking-light-pill"
        type="button"
        style={{ filter: `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})` }}
        onPointerEnter={() => { hoverTargetRef.current = 1; }}
        onPointerLeave={() => { hoverTargetRef.current = 0; }}
        onBlur={() => { hoverTargetRef.current = 0; }}
        onFocus={() => { hoverTargetRef.current = 1; }}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        <span>Field Notes 2026</span>
      </button>
    </div>
  );
}
