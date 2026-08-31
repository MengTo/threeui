import { buildShaderToggleFragment, SHADER_TOGGLE_VERTEX } from "./shaderToggleGlsl";
import type { ToggleMode } from "./toggleMode";

export type ShaderToggleSceneOptions = {
  canvas: HTMLCanvasElement;
  mode: ToggleMode;
  speed: number;
  size: number;
  on: boolean;
};

export type ShaderToggleScene = {
  setMode: (mode: ToggleMode) => void;
  setSpeed: (speed: number) => void;
  setSize: (size: number) => void;
  setOn: (on: boolean) => void;
  setPointer: (x: number, y: number) => void;
  resize: (width: number, height: number) => void;
  /* CSS-pixel footprint of the drawn capsule, so the DOM control matches it. */
  measureSwitch: () => { width: number; height: number };
  dispose: () => void;
};

/* Control-space constants, shared with the fragment shader. */
const TRACK_HALF_LENGTH = 1.35;
const TRACK_RADIUS = 1;
const HEIGHT_SHARE = 0.13;
const WIDTH_SHARE = 0.18;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Shader could not be created.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader failed to compile: ${log ?? "unknown error"}`);
  }
  return shader;
}

export function createShaderToggleScene({
  canvas,
  mode,
  speed,
  size,
  on,
}: ShaderToggleSceneOptions): ShaderToggleScene {
  const context = canvas.getContext("webgl", { antialias: true, alpha: false })
    ?? canvas.getContext("experimental-webgl", { antialias: true, alpha: false });
  if (!context) throw new Error("WebGL is unavailable.");
  const gl = context as WebGLRenderingContext;

  /* Derivatives give the distance fields a one-pixel edge at any scale; the
     shader falls back to a fixed width when the extension is absent. */
  const hasDerivatives = Boolean(gl.getExtension("OES_standard_derivatives"));

  const program = gl.createProgram();
  if (!program) throw new Error("Program could not be created.");
  const vertex = compile(gl, gl.VERTEX_SHADER, SHADER_TOGGLE_VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, buildShaderToggleFragment(hasDerivatives));
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    throw new Error(`Program failed to link: ${log ?? "unknown error"}`);
  }
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    res: gl.getUniformLocation(program, "uRes"),
    unit: gl.getUniformLocation(program, "uUnit"),
    time: gl.getUniformLocation(program, "uTime"),
    on: gl.getUniformLocation(program, "uOn"),
    progress: gl.getUniformLocation(program, "uProgress"),
    mode: gl.getUniformLocation(program, "uMode"),
    pointer: gl.getUniformLocation(program, "uPointer"),
  };

  const pixelRatio = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 2);
  const reduceMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 1;
  let height = 1;
  let unit = 1;
  let sizeScale = size;
  let currentMode = mode;
  let currentSpeed = speed;
  let target = on ? 1 : 0;
  let progress = target;
  let velocity = 0;
  let glow = target;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let elapsed = 0;
  let last = typeof performance === "undefined" ? 0 : performance.now();
  let disposed = false;
  let handle = 0;

  function layout() {
    /* The capsule keeps ~13% of the stage height and never spills past 18% of
       its width, so all four variants read at the same size in the picker. */
    unit = Math.min(
      (height * HEIGHT_SHARE) / (TRACK_RADIUS * 2),
      (width * WIDTH_SHARE) / ((TRACK_HALF_LENGTH + TRACK_RADIUS) * 2),
    ) * sizeScale;
  }

  function resize(nextWidth: number, nextHeight: number) {
    width = Math.max(1, Math.round(nextWidth));
    height = Math.max(1, Math.round(nextHeight));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
    layout();
  }

  function measureSwitch() {
    return {
      width: unit * (TRACK_HALF_LENGTH + TRACK_RADIUS) * 2,
      height: unit * TRACK_RADIUS * 2,
    };
  }

  function frame(now: number) {
    if (disposed) return;
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += delta * currentSpeed;

    const stiffness = reduceMotion ? 420 : 165;
    const damping = 2 * Math.sqrt(stiffness);
    const step = reduceMotion ? Math.min(delta, 0.016) : delta;
    velocity += (target - progress) * stiffness * step - velocity * damping * step;
    progress += velocity * step;
    glow += (target - glow) * Math.min(1, delta * 5.5);
    smoothX += (pointerX - smoothX) * Math.min(1, delta * 3.4);
    smoothY += (pointerY - smoothY) * Math.min(1, delta * 3.4);

    gl.uniform2f(uniforms.res, canvas.width, canvas.height);
    gl.uniform1f(uniforms.unit, unit * pixelRatio);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.on, glow);
    gl.uniform1f(uniforms.progress, progress);
    gl.uniform1f(uniforms.mode, currentMode === "dark" ? 1 : 0);
    gl.uniform2f(uniforms.pointer, smoothX, smoothY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    handle = window.requestAnimationFrame(frame);
  }

  handle = window.requestAnimationFrame(frame);

  return {
    setMode(next) {
      currentMode = next;
    },
    setSpeed(next) {
      currentSpeed = next;
    },
    setSize(next) {
      sizeScale = next;
      layout();
    },
    setOn(next) {
      target = next ? 1 : 0;
    },
    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
    },
    resize,
    measureSwitch,
    dispose() {
      disposed = true;
      window.cancelAnimationFrame(handle);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      /* Never force a context loss here: React remounts this effect on the same
         canvas in StrictMode, and a lost context can never be re-acquired. */
    },
  };
}
