export type TopDockAxis = "x" | "y";

export type TopDockOptions = {
  proximity: number;
  spring: number;
  damping: number;
  widthGrowth: number;
  heightGrowth: number;
  drop: number;
  /* "y" measures the proximity field down a vertical rail: items grow taller and
     lean out sideways instead of widening and dropping */
  axis?: TopDockAxis;
  /* the items own the whole track, so their widths are renormalised against it:
     opening one cell takes room from its neighbours and the strip stays exactly
     as wide as its container */
  distribute?: boolean;
  /* the opposite deal: the track is pinned to the width it has at rest and the
     magnified row is allowed to overflow it. A bar that hugs its own content
     needs this — without it the growing row widens the bar, which both slides
     the brand and the actions around and resizes the box this controller
     re-measures from, cancelling the spring on the next frame. */
  lockTrack?: boolean;
};

type DockItemState = {
  element: HTMLElement;
  baseWidth: number;
  baseHeight: number;
  value: number;
  velocity: number;
  target: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function createTopDockController(
  root: HTMLElement,
  getOptions: () => TopDockOptions,
) {
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const precisionQuery = window.matchMedia("(hover:hover) and (pointer:fine)");
  const items: DockItemState[] = Array.from(root.querySelectorAll<HTMLElement>("[data-dock-item]")).map((element) => ({
    element,
    baseWidth: 0,
    baseHeight: 0,
    value: 0,
    velocity: 0,
    target: 0,
  }));

  let enabled = false;
  let pointerActive = false;
  let dirty = false;
  let frame = 0;

  const canAnimate = () => !reducedQuery.matches && root.clientWidth > 0 && window.innerWidth > 600 && precisionQuery.matches;

  const measure = () => {
    enabled = canAnimate();
    /* released first, so the rest width is measured against the track's own
       content rather than against the width the last measurement pinned */
    if (getOptions().lockTrack) root.style.width = "";
    for (const state of items) {
      state.element.style.width = "";
      state.element.style.height = "";
      state.element.style.transform = "";
      state.element.dataset.dockNear = "false";
    }
    for (const state of items) {
      const rect = state.element.getBoundingClientRect();
      state.baseWidth = rect.width;
      state.baseHeight = rect.height;
      state.value = 0;
      state.velocity = 0;
      state.target = 0;
    }
    pointerActive = false;
    dirty = false;
    /* a distributed strip has to fill its track even when the spring never runs
       — reduced motion, a coarse pointer, or a narrow viewport */
    if (getOptions().distribute) applyLayout();
    if (getOptions().lockTrack) root.style.width = `${root.getBoundingClientRect().width.toFixed(2)}px`;
    root.dataset.dockState = enabled ? "idle" : "static";
    root.dataset.dockMax = "0.00";
  };

  const setTargets = (clientX: number, clientY: number) => {
    if (!enabled) return;
    const options = getOptions();
    const vertical = options.axis === "y";
    const pointer = vertical ? clientY : clientX;
    const rects = items.map((state) => state.element.getBoundingClientRect());
    for (let index = 0; index < items.length; index += 1) {
      const rect = rects[index];
      const center = vertical ? rect.top + rect.height * 0.5 : rect.left + rect.width * 0.5;
      const proximity = clamp(1 - Math.abs(pointer - center) / Math.max(1, options.proximity), 0, 1);
      const influence = proximity * proximity * (3 - 2 * proximity);
      items[index].target = influence;
      items[index].element.dataset.dockNear = influence > 0.08 ? "true" : "false";
    }
    pointerActive = true;
    dirty = true;
    root.dataset.dockState = "active";
  };

  const focusItem = (item: HTMLElement) => {
    if (!enabled) return;
    const index = items.findIndex((state) => state.element === item);
    if (index < 0) return;
    items.forEach((state, itemIndex) => {
      state.target = itemIndex === index ? 1 : Math.abs(itemIndex - index) === 1 ? 0.24 : 0;
      state.element.dataset.dockNear = state.target > 0.08 ? "true" : "false";
    });
    pointerActive = false;
    dirty = true;
    root.dataset.dockState = "focus";
  };

  const reset = () => {
    pointerActive = false;
    dirty = true;
    items.forEach((state) => {
      state.target = 0;
      state.element.dataset.dockNear = "false";
    });
  };

  /* the only place item geometry is written, so the three fits stay one
     behaviour with three ways of spending the same spring value */
  const applyLayout = () => {
    const options = getOptions();
    if (options.distribute && options.axis !== "y") {
      const weights = items.map((state) => state.baseWidth + options.widthGrowth * clamp(state.value, 0, 1.08));
      const total = weights.reduce((sum, weight) => sum + weight, 0);
      const natural = items.reduce((sum, state) => sum + state.baseWidth, 0);
      /* squeezed below its own natural width the strip would clip every label,
         so it stops filling the track rather than crushing the cells */
      const track = root.clientWidth >= natural ? root.clientWidth : 0;
      items.forEach((state, index) => {
        state.element.style.width = track ? `${(track * weights[index] / total).toFixed(2)}px` : "";
        state.element.style.height = "";
        state.element.style.transform = "";
      });
      return;
    }
    for (const state of items) {
      const value = clamp(state.value, 0, 1.08);
      if (options.axis === "y") {
        state.element.style.width = "";
        state.element.style.height = `${(state.baseHeight + options.heightGrowth * value).toFixed(2)}px`;
        state.element.style.transform = `translateX(${(value * options.drop).toFixed(2)}px)`;
        continue;
      }
      const isLogo = state.element.classList.contains("animated-top-dock__logo");
      const extraWidth = isLogo ? options.widthGrowth * (14 / 17) : Math.min(options.widthGrowth, state.baseWidth * 0.24);
      const extraHeight = isLogo ? options.heightGrowth * (14 / 16) : options.heightGrowth;
      state.element.style.width = `${(state.baseWidth + extraWidth * value).toFixed(2)}px`;
      state.element.style.height = `${(state.baseHeight + extraHeight * value).toFixed(2)}px`;
      state.element.style.transform = `translateY(${(value * options.drop).toFixed(2)}px)`;
    }
  };

  const draw = () => {
    if (enabled && dirty) {
      const options = getOptions();
      let moving = false;
      let maxValue = 0;
      for (const state of items) {
        state.velocity += (state.target - state.value) * options.spring;
        state.velocity *= options.damping;
        state.value += state.velocity;
        if (Math.abs(state.target - state.value) < 0.001 && Math.abs(state.velocity) < 0.001) {
          state.value = state.target;
          state.velocity = 0;
        } else {
          moving = true;
        }
        maxValue = Math.max(maxValue, clamp(state.value, 0, 1.08));
      }
      applyLayout();
      root.dataset.dockMax = maxValue.toFixed(2);
      if (!moving) {
        dirty = false;
        if (items.every((state) => state.target === 0)) root.dataset.dockState = "idle";
      }
    }
    frame = requestAnimationFrame(draw);
  };

  const onPointerMove = (event: PointerEvent) => setTargets(event.clientX, event.clientY);
  const onWindowPointerMove = (event: PointerEvent) => {
    if (!pointerActive) return;
    const rootRect = root.getBoundingClientRect();
    const itemRects = items.map((state) => state.element.getBoundingClientRect());
    const bottom = Math.max(rootRect.bottom, ...itemRects.map((rect) => rect.bottom));
    const outside = event.clientX < rootRect.left || event.clientX > rootRect.right || event.clientY < rootRect.top || event.clientY > bottom;
    if (outside) reset();
  };
  const onFocusIn = (event: FocusEvent) => {
    const item = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-dock-item]");
    if (item) focusItem(item);
  };
  const onFocusOut = () => requestAnimationFrame(() => {
    if (!root.contains(document.activeElement)) reset();
  });
  const onKeyDown = (event: KeyboardEvent) => {
    const item = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-dock-item]");
    if (item && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      item.click();
    }
  };
  const onClick = () => reset();

  /* the spring writes an explicit pixel width onto every item, so the base
     measurement has to happen after the label font is available — measured
     against a fallback face, a variant with auto-width items locks in a box its
     own text then overflows */
  let released = false;
  const remeasure = () => { if (!released) measure(); };
  document.fonts?.ready.then(remeasure);

  /* re-measuring on the parent works for a dock inside a fixed bar, but a rail
     whose height follows its own items would resize its parent as it grows and
     cancel the spring on the next frame. A shell can opt out of that feedback
     loop by marking a box the dock cannot resize. */
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(root.closest<HTMLElement>("[data-dock-frame]") ?? root.parentElement ?? root);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerleave", reset);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  root.addEventListener("keydown", onKeyDown);
  root.addEventListener("click", onClick);
  window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
  reducedQuery.addEventListener("change", measure);
  precisionQuery.addEventListener("change", measure);
  measure();
  frame = requestAnimationFrame(draw);

  return () => {
    released = true;
    root.style.width = "";
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    root.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerleave", reset);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    root.removeEventListener("keydown", onKeyDown);
    root.removeEventListener("click", onClick);
    window.removeEventListener("pointermove", onWindowPointerMove);
    reducedQuery.removeEventListener("change", measure);
    precisionQuery.removeEventListener("change", measure);
  };
}
