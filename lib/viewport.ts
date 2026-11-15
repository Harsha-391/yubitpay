import { useSyncExternalStore } from "react";

// Breakpoints (also in app/mobile.css): phone < 768 ≤ tablet < 1100 ≤ desktop.
export const isPhone = () => innerWidth < 768;
export const isCompact = () => innerWidth < 1100;

// --u as the CSS resolves it right now (it differs per breakpoint), read off a hidden probe instead of re-deriving the formula in JS.
let probe: HTMLElement | null = null;
export function unit() {
  if (!probe) {
    probe = document.createElement("i");
    probe.setAttribute("aria-hidden", "true");
    // small and fixed: a wide probe would itself widen a phone's layout viewport
    probe.style.cssText = "position:fixed;left:0;top:0;width:calc(100 * var(--u));height:0;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
  }
  return probe.getBoundingClientRect().width / 100;
}

// The pinned story is shorter on phones/tablets (~3 screens of thumb scroll instead of ~4.5): scroll is multiplied by this.
export const storyPace = () => (isCompact() ? 1.55 : 1);

/* Calls fn when the layout viewport really changes. On touch devices the address bar showing/hiding is a height-only
   resize of ~50–120px; re-measuring then would make the pinned scenes jump, so it is ignored. Rotation always counts. */
export function onViewport(fn: () => void) {
  const coarse = matchMedia("(pointer: coarse)").matches;
  let w = innerWidth, h = innerHeight;
  const check = () => {
    if (innerWidth === w && (coarse ? Math.abs(innerHeight - h) < 120 : innerHeight === h)) return;
    w = innerWidth; h = innerHeight; fn();
  };
  const turn = () => requestAnimationFrame(() => { w = innerWidth; h = innerHeight; fn(); }); // sizes settle a frame after the event
  addEventListener("resize", check);
  screen.orientation?.addEventListener("change", turn);
  return () => { removeEventListener("resize", check); screen.orientation?.removeEventListener("change", turn); };
}

// Media query as React state; false on the server, so server HTML is always the desktop/no-JS markup.
export function useMedia(q: string) {
  return useSyncExternalStore(
    (cb) => { const m = matchMedia(q); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => matchMedia(q).matches,
    () => false,
  );
}
