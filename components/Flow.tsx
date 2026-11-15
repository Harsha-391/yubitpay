"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { lenisRef } from "@/lib/lenis";
import { onViewport, storyPace, unit } from "@/lib/viewport";

/*
  Scroll choreography between and inside scenes (patterns from the Loopsii / gokiwi references) — every scene enters differently:
    statement  slides up OVER the finished story (rounded, scaling) while the story sinks and dims; its words light with --p
    banner     a tilted tape; rows travel with scroll, lean and speed up with scroll velocity, pause off-screen
    developer  a dark frame that grows out of the lime around it and eases back as it leaves; the step bar fills
    solutions  pinned horizontal track: vertical scroll slides the cards sideways, watermarks parallax, progress bar fills
    outro      the giant wordmark rises into place with the last screen of scroll
  plus: Lenis inertial scroll, nav mini / light skin, cursor spotlight, card tilt [data-tilt], magnetic buttons [data-magnet].
  Only transform / opacity / one CSS var on small subtrees are written, once per frame, and only when they change.
*/
export function Flow() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ready = "1";
    if (!root.classList.contains("m")) return;

    const lenis = new Lenis({ duration: 1.4, easing: (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)), smoothWheel: true, syncTouch: false, wheelMultiplier: 1.6, autoRaf: true });
    lenisRef.current = lenis;
    const $ = <T extends Element>(s: string) => document.querySelector(s) as T | null;
    const nav = $<HTMLElement>(".nav")!;
    const story = $<HTMLElement>("#story")!, storyPin = $<HTMLElement>("#story-pin")!;
    const statement = $<HTMLElement>("#statement"), statementP = statement?.querySelector<HTMLElement>("[data-p]") ?? null;
    const banner = $<HTMLElement>(".banner"), rows = [...document.querySelectorAll<HTMLElement>(".mq-row")];
    const rowAnims = rows.map((r) => r.querySelector<HTMLElement>(".mq-track")!.getAnimations()[0]).filter(Boolean);
    const frame = $<HTMLElement>("#dev"), journey = $<HTMLElement>("#journey"), journeyFill = $<HTMLElement>("#journey-fill");
    const tracks = $<HTMLElement>("#tracks"), track = $<HTMLElement>("#track"), trackFill = $<HTMLElement>("#track-fill");
    const tcards = track ? [...track.children] as HTMLElement[] : [];
    const tys = tcards.map((c) => c.querySelector<HTMLElement>(".tc-y"));
    const outro = $<SVGSVGElement>("#outro-mark"), outroBox = outro?.parentElement ?? null; // measure the box, move the mark
    const fluteGlow = $<HTMLElement>(".flute-glow");
    const toneEls = [...document.querySelectorAll<HTMLElement>("[data-tone]")].filter((e) => e !== nav);

    const storyDim = document.createElement("div");
    storyDim.className = "dim"; storyDim.setAttribute("aria-hidden", "true"); storyPin.appendChild(storyDim);

    const seen = new WeakMap<Element, Record<string, string>>();
    const put = (el: Element | null, k: string, v: string) => {
      if (!el) return;
      const c = seen.get(el) ?? {};
      if (c[k] === v) return;
      c[k] = v; seen.set(el, c); (el as HTMLElement).style.setProperty(k, v);
    };
    const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
    let vh = 0, W = 0, u = 1, tintAt = 0, stTop = 0, stH = 0, bnTop = 0, frTop = 0, frH = 0, jTop = 0;
    const progress = nav.querySelector<HTMLElement>(".nav-progress");
    let docH = 1, tkTop = 0, tkTravel = 0, tkH = 0, outTop = 0, outH = 0, tones: [number, string][] = [], centers: number[] = [];

    const measure = () => {
      vh = storyPin.offsetHeight; W = window.innerWidth; u = unit(); // the pin is 100svh: ignores a phone's address bar
      tintAt = docTop(story) + (3.8 * vh) / storyPace(); // the story turns light here (StoryMotion)
      if (statement) { stTop = docTop(statement); stH = statement.offsetHeight; }
      if (banner) bnTop = docTop(banner);
      if (frame) { frame.style.scale = "1"; seen.delete(frame); frTop = docTop(frame); frH = frame.offsetHeight; } // measure unscaled, then re-apply
      if (journey) jTop = docTop(journey);
      if (tracks && track) {
        tkTravel = Math.max(0, track.scrollWidth - W);
        tracks.style.height = `${vh + tkTravel + vh * 0.25}px`; // the track's travel + a short hold on the last card
        tkTop = docTop(tracks); tkH = tracks.offsetHeight;
        centers = tcards.map((c) => c.offsetLeft + c.offsetWidth / 2);
      }
      if (outroBox) { outTop = docTop(outroBox); outH = outroBox.offsetHeight; }
      docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      tones = toneEls.map((e) => [docTop(e), e.dataset.tone ?? "dark"] as [number, string]).sort((a, b) => a[0] - b[0]);
    };

    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    const ease = (t: number) => 1 - (1 - t) ** 3;

    let raf = 0, rate = 1;
    const frameFn = () => {
      raf = 0;
      const sy = window.scrollY;

      // statement covers the story
      if (statement) {
        const e = clamp((sy + vh - stTop) / vh);
        put(statement, "scale", (0.94 + 0.06 * e).toFixed(4));
        put(statement, "border-radius", e >= 1 ? "0" : `${(44 * u).toFixed(1)}px ${(44 * u).toFixed(1)}px 0 0`);
        put(storyPin, "scale", (1 - 0.06 * e).toFixed(4));
        put(storyDim, "opacity", (0.55 * e).toFixed(3));
        put(statementP, "--p", clamp((sy - stTop) / Math.max(1, stH - vh * 1.15)).toFixed(3));
      }

      // tape: rows travel with scroll (opposite ways) and lean with speed
      const v = lenis.velocity || 0;
      const lean = Math.max(-8, Math.min(8, -v * 0.25));
      rows.forEach((r) => {
        const x = (sy - bnTop) * 0.35 * Number(r.dataset.dir);
        put(r, "transform", `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${lean.toFixed(2)}deg)`);
      });
      const target = 1 + Math.min(5, Math.abs(v) * 0.12);
      if (Math.abs(target - rate) > 0.05 || (target === 1 && rate !== 1)) { rate = target; rowAnims.forEach((a) => (a.playbackRate = rate)); }

      // developer frame grows out of the lime and eases back as it leaves
      if (frame) {
        const e = ease(clamp((sy + vh - frTop) / (vh * 0.85)));
        const l = clamp((sy - (frTop + frH - vh * 0.55)) / (vh * 0.55));
        put(frame, "scale", (0.86 + 0.14 * e - 0.07 * l).toFixed(4));
      }
      if (journeyFill) put(journeyFill, "--j", clamp((sy + vh * 0.8 - jTop) / (vh * 0.35)).toFixed(4)); // CSS scales X on desktop, Y on phones

      // horizontal track
      if (track) {
        const p = clamp((sy - tkTop) / Math.max(1, tkH - vh - vh * 0.25));
        const x = p * tkTravel;
        put(track, "transform", `translate3d(${(-x).toFixed(1)}px, 0, 0)`);
        put(trackFill, "transform", `scaleX(${p.toFixed(4)})`);
        tys.forEach((y, i) => { if (y) put(y, "transform", `translate3d(${((centers[i] - x - W / 2) * -0.18).toFixed(1)}px, 0, 0)`); });
      }

      // outro wordmark rises into place over the last screen
      if (outro) {
        const p = ease(clamp((sy + vh - outTop) / (outH * 0.95)));
        put(outro, "transform", `translate3d(0, ${((1 - p) * 38).toFixed(2)}%, 0)`);
      }

      // nav
      nav.classList.toggle("is-mini", sy > 100);
      put(progress, "transform", `scaleX(${clamp(sy / docH).toFixed(4)})`);
      const probe = sy + 40;
      let tone = probe >= tintAt ? "light" : "dark"; // inside the story: light once it has turned light
      for (const [t, k] of tones) if (probe >= t) tone = k; // after it: whatever scene is under the nav
      if (nav.dataset.tone !== tone) nav.dataset.tone = tone;
    };
    const wake = () => { rest(); if (!raf) raf = requestAnimationFrame(frameFn); };

    // the marquee doesn't run while it can't be seen
    const io = new IntersectionObserver(([en]) => rowAnims.forEach((a) => (en.isIntersecting ? a.play() : a.pause())));
    if (banner) io.observe(banner);

    // idle: lights breathe once the scroll has rested; loops in [data-idle] scenes stop off-screen and while the tab is hidden
    let idleT = 0;
    const rest = () => { root.classList.remove("idle"); clearTimeout(idleT); idleT = window.setTimeout(() => root.classList.add("idle"), 2500); };
    const offscreen = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)));
    document.querySelectorAll("[data-idle]").forEach((e) => offscreen.observe(e));
    const away = () => root.classList.toggle("away", document.hidden);
    document.addEventListener("visibilitychange", away);
    rest();

    // pointer: spotlight, card tilt, magnetic buttons (fine pointers only; CSS transitions do the easing)
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Element;
      if (fluteGlow && t.closest(".hero")) {
        const r = fluteGlow.getBoundingClientRect();
        put(fluteGlow, "--fx", `${(e.clientX - r.left).toFixed(0)}px`); put(fluteGlow, "--fy", `${(e.clientY - r.top).toFixed(0)}px`);
      }
      const spot = t.closest<HTMLElement>("[data-spot]");
      if (spot) { const r = spot.getBoundingClientRect(); spot.style.setProperty("--mx", `${e.clientX - r.left}px`); spot.style.setProperty("--my", `${e.clientY - r.top}px`); }
      const tilt = t.closest<HTMLElement>("[data-tilt]");
      if (tilt) {
        const r = tilt.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `perspective(${(1400 * u).toFixed(0)}px) rotateX(${(-ny * 6).toFixed(2)}deg) rotateY(${(nx * 8).toFixed(2)}deg)`;
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

    const remeasure = () => { measure(); frameFn(); };
    remeasure();
    lenis.on("scroll", wake);
    window.addEventListener("scroll", wake, { passive: true });
    const offViewport = onViewport(remeasure);
    document.fonts?.ready.then(remeasure);
    const ro = new ResizeObserver(() => remeasure()); // the FAQ accordion and late fonts change heights
    ro.observe(document.body);
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
      clearTimeout(idleT); offscreen.disconnect(); document.removeEventListener("visibilitychange", away); root.classList.remove("idle", "away");
      lenis.destroy(); lenisRef.current = null; offViewport(); ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); storyDim.remove();
      window.removeEventListener("scroll", wake);
      document.removeEventListener("pointermove", onPointer); document.removeEventListener("pointerout", onOut); document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
