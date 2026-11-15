"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { lenisRef } from "@/lib/motion/lenis";
import { clamp, easeOut, layoutTop } from "@/lib/motion/math";
import { createPut } from "@/lib/motion/put";
import { remeasure, scene } from "@/lib/motion/scene";
import { toneAt } from "@/lib/motion/tone";
import { unit } from "@/lib/viewport";

/*
  Site-wide motion, mounted once in the root layout so it survives route changes:
    · the one Lenis instance (inertial scroll)
    · the nav: shrinks after the first scroll, light skin over light surfaces, page-progress line
    · the footer's wordmark rising with the last screen of scroll
    · pointer effects (spotlight, tilt, magnetic buttons — fine pointers only) and smooth in-page #links
  On a route change the scroll returns to the top and everything re-measures against the new page; the page's own
  scenes are registered (and disposed) by the page's components through lib/motion/scene.
*/
export function SiteMotion() {
  const path = usePathname();

  // once: Lenis, pointer effects, #links
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ready = "1";
    if (!root.classList.contains("m")) return;

    const lenis = new Lenis({ duration: 1.4, easing: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)), smoothWheel: true, syncTouch: false, wheelMultiplier: 1.6, autoRaf: true });
    lenisRef.current = lenis;

    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Element;
      const spot = t.closest<HTMLElement>("[data-spot]");
      if (spot) { const r = spot.getBoundingClientRect(); spot.style.setProperty("--mx", `${e.clientX - r.left}px`); spot.style.setProperty("--my", `${e.clientY - r.top}px`); }
      const tilt = t.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `perspective(${(1400 * unit()).toFixed(0)}px) rotateX(${(-ny * 6).toFixed(2)}deg) rotateY(${(nx * 8).toFixed(2)}deg)`;
      }
      const mag = t.closest<HTMLElement>("[data-magnet]");
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1)}px`;
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element, to = e.relatedTarget as Element | null;
      const tilt = t.closest<HTMLElement>("[data-tilt]"); if (tilt && !tilt.contains(to)) tilt.style.transform = "";
      const mag = t.closest<HTMLElement>("[data-magnet]"); if (mag && !mag.contains(to)) mag.style.translate = "";
    };
    if (fine) { document.addEventListener("pointermove", onPointer, { passive: true }); document.addEventListener("pointerout", onOut, { passive: true }); }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute("href")!.slice(1);
      lenis.scrollTo(id ? document.getElementById(id) ?? 0 : 0);
      if (id && location.hash !== `#${id}`) { history.pushState(null, "", `#${id}`); dispatchEvent(new HashChangeEvent("hashchange")); } // e.g. #faq-2 opens its answer
    };
    document.addEventListener("click", onClick);

    return () => {
      lenis.destroy(); lenisRef.current = null;
      document.removeEventListener("pointermove", onPointer); document.removeEventListener("pointerout", onOut); document.removeEventListener("click", onClick);
    };
  }, []);

  // per route: back to the top, then the nav + footer scene measured against this page
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("m")) return;
    if (!location.hash) { if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0); }

    const nav = document.querySelector<HTMLElement>(".nav");
    const progress = nav?.querySelector<HTMLElement>(".nav-progress") ?? null;
    const outro = document.querySelector<SVGSVGElement>("#outro-mark"), outroBox = outro?.parentElement ?? null; // measure the box, move the mark
    const toneEls = [...document.querySelectorAll<HTMLElement>("[data-tone]")].filter((e) => e !== nav);
    const { put } = createPut();
    let vh = 0, docH = 1, outTop = 0, outH = 0, tones: [number, string][] = [];

    const off = scene({
      measure() {
        vh = window.innerHeight;
        docH = Math.max(1, root.scrollHeight - vh);
        if (outroBox) { outTop = layoutTop(outroBox); outH = outroBox.offsetHeight; }
        tones = toneEls.map((e) => [layoutTop(e), e.dataset.tone ?? "dark"] as [number, string]) // layout tops: page scenes scale some of these.sort((a, b) => a[0] - b[0]);
      },
      frame(y) {
        // outro wordmark rises into place over the last screen
        if (outro) put(outro, "transform", `translate3d(0, ${((1 - easeOut(clamp((y + vh - outTop) / (outH * 0.95)))) * 38).toFixed(2)}%, 0)`);
        if (!nav) return;
        nav.classList.toggle("is-mini", y > 100);
        put(progress, "transform", `scaleX(${clamp(y / docH).toFixed(4)})`);
        const probe = y + 40;
        let tone = "dark";
        for (const [t, k] of tones) if (probe >= t) tone = k; // whatever section is under the nav
        tone = toneAt.current?.(probe) ?? tone;
        if (nav.dataset.tone !== tone) nav.dataset.tone = tone;
      },
    });
    remeasure(); // the page's own scenes registered just before this one: measure them against the reset scroll
    return off;
  }, [path]);

  return null;
}
