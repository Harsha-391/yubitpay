"use client";
import { useEffect } from "react";
import { clamp, easeOut, layoutTop } from "@/lib/motion/math";
import { createPut } from "@/lib/motion/put";
import { scene } from "@/lib/motion/scene";
import { unit } from "@/lib/viewport";

/*
  Scroll scenes of an inner page, both scrubbed (they run backwards too):
    [data-seq]   a sequence: writes --p (0→1 as the block rises through the lower part of the screen); CSS staggers its children from it
    [data-grow]  a dark band that grows out of the light section around it
  One scene on the shared loop; it disposes with the page.
*/
export function PageMotion() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("m")) return;
    const seqs = [...document.querySelectorAll<HTMLElement>("[data-seq]")];
    const grows = [...document.querySelectorAll<HTMLElement>("[data-grow]")];
    const { put } = createPut();
    let vh = 0, u = 1, seqTop: number[] = [], seqSpan: number[] = [], growTop: number[] = [];
    return scene({
      measure() {
        vh = window.innerHeight; u = unit();
        seqTop = seqs.map(layoutTop); growTop = grows.map(layoutTop);
        seqSpan = seqs.map((el) => Math.max(vh * 0.5, el.offsetHeight * 0.9)); // a stacked list (phones) takes its own height to play through
      },
      frame(y) {
        seqs.forEach((el, k) => put(el, "--p", clamp((y + vh * 0.88 - seqTop[k]) / seqSpan[k]).toFixed(3)));
        grows.forEach((el, k) => {
          const e = easeOut(clamp((y + vh - growTop[k]) / (vh * 0.7)));
          put(el, "scale", (0.9 + 0.1 * e).toFixed(4));
          put(el, "border-radius", e >= 1 ? "0" : `${(32 * u).toFixed(1)}px`);
        });
      },
    });
  }, []);
  return null;
}
