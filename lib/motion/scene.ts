import { onViewport } from "@/lib/viewport";

/*
  One scroll loop for the whole site. A page section registers a scene: `measure` reads layout (on load, real viewport
  changes, late fonts, content height changes) and `frame` writes for the current scroll position — at most once per
  animation frame, and it runs backwards as happily as forwards. The loop only exists while at least one scene does,
  so a route change (its scenes dispose) leaves no listener or rAF behind.
*/
export type Scene = { measure?: () => void; frame: (scrollY: number) => void };

const scenes = new Set<Scene>();
let raf = 0, stop: (() => void) | null = null;

const run = () => { raf = 0; const y = window.scrollY; scenes.forEach((s) => s.frame(y)); };
export const wake = () => { if (!raf && scenes.size) raf = requestAnimationFrame(run); };
export const remeasure = () => { scenes.forEach((s) => s.measure?.()); if (scenes.size) run(); };

function start() {
  window.addEventListener("scroll", wake, { passive: true });
  const offViewport = onViewport(remeasure);
  const ro = new ResizeObserver(remeasure); // accordions, tab panels and late fonts change heights
  ro.observe(document.body);
  document.fonts?.ready.then(() => scenes.size && remeasure());
  stop = () => { window.removeEventListener("scroll", wake); offViewport(); ro.disconnect(); cancelAnimationFrame(raf); raf = 0; stop = null; };
}

export function scene(s: Scene) {
  scenes.add(s);
  if (!stop) start();
  s.measure?.(); s.frame(window.scrollY);
  return () => { scenes.delete(s); if (!scenes.size) stop?.(); };
}

// Scroll-scrub: 0 when the section's top reaches the bottom of the screen, 1 when its bottom leaves the top.
export const through = (y: number, top: number, height: number, vh: number) => Math.min(1, Math.max(0, (y + vh - top) / (vh + height)));
// Entering: 0 when its top reaches the bottom of the screen, 1 after it has risen `span` screens.
export const entering = (y: number, top: number, vh: number, span = 1) => Math.min(1, Math.max(0, (y + vh - top) / (vh * span)));
// Pin: for a tall section whose child is `position: sticky; top: 0; height: 100svh` — 0 when it pins, 1 when it releases.
export const pinned = (y: number, top: number, height: number, vh: number) => Math.min(1, Math.max(0, (y - top) / Math.max(1, height - vh)));
