"use client";
import { useEffect } from "react";
import { lenisRef } from "@/lib/motion/lenis";
import { clamp, docTop, easeOut } from "@/lib/motion/math";
import { createPut } from "@/lib/motion/put";
import { scene } from "@/lib/motion/scene";
import { toneAt } from "@/lib/motion/tone";
import { storyPace, unit } from "@/lib/viewport";

/*
  Homepage choreography between and inside scenes (patterns from the Loopsii / gokiwi references) — every scene enters differently:
    statement  slides up OVER the finished story (rounded, scaling) while the story sinks and dims; its words light with --p
    banner     a tilted tape; rows travel with scroll, lean and speed up with scroll velocity, pause off-screen
    developer  a dark frame that grows out of the lime around it and eases back as it leaves; the step bar fills
    solutions  pinned horizontal track: vertical scroll slides the cards sideways, watermarks parallax, progress bar fills
  One scene on the shared loop (lib/motion/scene); Lenis, the nav, the footer wordmark and pointer effects are site-wide (SiteMotion.tsx).
  Only transform / opacity / one CSS var on small subtrees are written, once per frame, and only when they change.
*/
export function Flow() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ready = "1";
    if (!root.classList.contains("m")) return;

    const $ = <T extends Element>(s: string) => document.querySelector(s) as T | null;
    const story = $<HTMLElement>("#story")!, storyPin = $<HTMLElement>("#story-pin")!;
    const statement = $<HTMLElement>("#statement"), statementP = statement?.querySelector<HTMLElement>("[data-p]") ?? null;
    const banner = $<HTMLElement>(".banner"), rows = [...document.querySelectorAll<HTMLElement>(".mq-row")];
    const rowAnims = rows.map((r) => r.querySelector<HTMLElement>(".mq-track")!.getAnimations()[0]).filter(Boolean);
    const frame = $<HTMLElement>("#dev"), journey = $<HTMLElement>("#journey"), journeyFill = $<HTMLElement>("#journey-fill");
    const tracks = $<HTMLElement>("#tracks"), track = $<HTMLElement>("#track"), trackFill = $<HTMLElement>("#track-fill");
    const tcards = track ? [...track.children] as HTMLElement[] : [];
    const tys = tcards.map((c) => c.querySelector<HTMLElement>(".tc-y"));

    const storyDim = document.createElement("div");
    storyDim.className = "dim"; storyDim.setAttribute("aria-hidden", "true"); storyPin.appendChild(storyDim);

    const { put, forget } = createPut();
    let vh = 0, W = 0, u = 1, tintAt = 0, stTop = 0, stH = 0, bnTop = 0, frTop = 0, frH = 0, jTop = 0;
    let tkTop = 0, tkTravel = 0, tkH = 0, centers: number[] = [], rate = 1;

    // inside the story the nav is light once the story has turned light (StoryMotion), until the dark statement covers it
    toneAt.current = (probe) => (probe >= tintAt && probe < stTop ? "light" : null);

    const off = scene({
      measure() {
        vh = storyPin.offsetHeight; W = window.innerWidth; u = unit(); // the pin is 100svh: ignores a phone's address bar
        tintAt = docTop(story) + (3.8 * vh) / storyPace();
        if (statement) { stTop = docTop(statement); stH = statement.offsetHeight; }
        if (banner) bnTop = docTop(banner);
        if (frame) { frame.style.scale = "1"; forget(frame); frTop = docTop(frame); frH = frame.offsetHeight; } // measure unscaled, then re-apply
        if (journey) jTop = docTop(journey);
        if (tracks && track) {
          tkTravel = Math.max(0, track.scrollWidth - W);
          tracks.style.height = `${vh + tkTravel + vh * 0.25}px`; // the track's travel + a short hold on the last card
          tkTop = docTop(tracks); tkH = tracks.offsetHeight;
          centers = tcards.map((c) => c.offsetLeft + c.offsetWidth / 2);
        }
      },
      frame(sy) {
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
        const v = lenisRef.current?.velocity || 0;
        const lean = Math.max(-8, Math.min(8, -v * 0.25));
        rows.forEach((r) => {
          const x = (sy - bnTop) * 0.35 * Number(r.dataset.dir);
          put(r, "transform", `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${lean.toFixed(2)}deg)`);
        });
        const target = 1 + Math.min(5, Math.abs(v) * 0.12);
        if (Math.abs(target - rate) > 0.05 || (target === 1 && rate !== 1)) { rate = target; rowAnims.forEach((a) => (a.playbackRate = rate)); }

        // developer frame grows out of the lime and eases back as it leaves
        if (frame) {
          const e = easeOut(clamp((sy + vh - frTop) / (vh * 0.85)));
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
      },
    });

    // the marquee doesn't run while it can't be seen
    const io = new IntersectionObserver(([en]) => rowAnims.forEach((a) => (en.isIntersecting ? a.play() : a.pause())));
    if (banner) io.observe(banner);

    return () => { off(); io.disconnect(); storyDim.remove(); toneAt.current = null; };
  }, []);
  return null;
}
