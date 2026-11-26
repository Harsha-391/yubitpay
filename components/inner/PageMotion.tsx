"use client";
import { useEffect } from "react";
import { clamp, easeInOut, easeOut, layoutTop, mix, seg } from "@/lib/motion/math";
import { createPut } from "@/lib/motion/put";
import { pinned, scene } from "@/lib/motion/scene";
import { unit } from "@/lib/viewport";

/*
  Inner-page motion that CSS reveals can't do (product brief, "Yubit Pay Products Pages Motion Direction.pdf"):
    [data-deck]  §2 a held deck of cards; scroll deals the top card to its slot, then the next, each tilting on its way
                 out and settling flat. Pinned on desktop (the stage is sticky); elsewhere it plays as the list scrolls by.
                 Scrubbed, so it gathers back into the deck when you scroll up.
    [data-tri]   §4 the CTA triangle follows the cursor through water: it turns and tilts toward it, its gradient's bright
                 end leans toward it, and it brightens with proximity. A loop that runs only while it is still settling.
*/
export function PageMotion() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("m")) return;
    const offs: (() => void)[] = [];

    // ---- §2 the deck
    const { put } = createPut();
    const decks = [...document.querySelectorAll<HTMLElement>("[data-deck]")].map((el) => {
      const list = el.querySelector<HTMLElement>(".steps")!;
      return { el, list, cards: [...list.children] as HTMLElement[], top: 0, h: 0, lt: 0, lh: 0, pin: false, slots: [] as number[][], anchor: [0, 0] };
    });
    let vh = 0, u = 1;
    if (decks.length) offs.push(scene({
      measure() {
        vh = window.innerHeight; u = unit();
        for (const d of decks) {
          d.pin = window.innerWidth >= 1100; // the same breakpoint that makes the stage sticky (inner.css)
          d.top = layoutTop(d.el); d.h = d.el.offsetHeight; d.lt = layoutTop(d.list); d.lh = d.list.offsetHeight;
          d.slots = d.cards.map((c) => [c.offsetLeft, c.offsetTop]);
          // the deck is held centred over the row on desktop, over the first slot where the cards stack in columns
          d.anchor = d.pin ? [(d.list.clientWidth - d.cards[0].offsetWidth) / 2, 0] : d.slots[0];
        }
      },
      frame(y) {
        for (const d of decks) {
          const p = d.pin ? pinned(y, d.top, d.h, vh) : clamp((y + vh * 0.85 - d.lt) / (d.lh + vh * 0.25));
          const e = d.cards.map((_, k) => easeInOut(seg(p, 0.06 + k * 0.21, 0.36 + k * 0.21)));
          d.cards.forEach((c, k) => {
            let gone = 0;
            for (let j = 0; j < k; j++) gone += e[j];
            const depth = k - gone, t = e[k], arc = Math.sin(Math.PI * t); // depth: its place in what is left of the deck
            const sx = d.anchor[0] - d.slots[k][0] + depth * 12 * u, sy = d.anchor[1] - d.slots[k][1] - depth * 12 * u - 16 * u;
            const x = mix(sx, 0, t), yy = mix(sy, 0, t) - arc * 28 * u;
            const rot = mix(-1.5 + depth * 1.6, 0, t) - arc * 6, sc = mix(1 - depth * 0.035, 1, t);
            put(c, "transform", t >= 1 ? "none" : `translate3d(${x.toFixed(1)}px, ${yy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`);
            put(c, "z-index", String(10 - k));
            put(c, "--sh", (1 - t).toFixed(3));
          });
        }
      },
    }));

    // ---- [data-stack] L6: each child sticks once its bottom reaches the screen's bottom (top = screen − own height), so the
    //      next one slides over it only after it has been seen whole. Written on measure only; CSS makes them sticky (desktop).
    //      Flow tops come from the (non-sticky) stack's top plus the heights before, because a stuck child's offsetTop moves.
    // ---- [data-grow] H8: a dark band grows out of what is around it. [data-seq] G1: --p 0→1 as a list rises; CSS staggers its children.
    const stacks = [...document.querySelectorAll<HTMLElement>("[data-stack]")];
    const grows = [...document.querySelectorAll<HTMLElement>("[data-grow]")];
    const seqs = [...document.querySelectorAll<HTMLElement>("[data-seq]")];
    const flow = new Map<Element, number>();
    const top = (el: HTMLElement) => { // inside a stack child, measure from the child (both carry the same stuck offset)
      const c = el.closest<HTMLElement>("[data-stack] > *");
      return c ? flow.get(c)! + layoutTop(el) - layoutTop(c) : layoutTop(el);
    };
    let growTop: number[] = [], seqTop: number[] = [], seqSpan: number[] = [];
    if (stacks.length + grows.length + seqs.length) offs.push(scene({
      measure() {
        vh = window.innerHeight; u = unit();
        for (const s of stacks) {
          let t = layoutTop(s);
          for (const c of s.children as HTMLCollectionOf<HTMLElement>) {
            flow.set(c, t); t += c.offsetHeight;
            put(c, "top", `${Math.min(0, vh - c.offsetHeight)}px`);
          }
        }
        growTop = grows.map(top); seqTop = seqs.map(top);
        seqSpan = seqs.map((el) => Math.max(vh * 0.35, el.offsetHeight * 0.9)); // a stacked list (phones) takes its own height to play through
      },
      frame(y) {
        // done by the time the list's top is a third of a screen above the bottom edge: the whole row is in view by then
        seqs.forEach((el, k) => put(el, "--p", clamp((y + vh * 0.92 - seqTop[k]) / seqSpan[k]).toFixed(3)));
        grows.forEach((el, k) => {
          const e = easeOut(clamp((y + vh - growTop[k]) / (vh * 0.7)));
          put(el, "transform", e >= 1 ? "none" : `scale(${(0.9 + 0.1 * e).toFixed(4)})`);
          put(el, "border-radius", e >= 1 ? "0" : `${(32 * u).toFixed(1)}px`);
        });
      },
    }));

    // ---- [data-spy] an "On this page" list: the anchor whose section is under the top third of the screen is current
    //      (aria-current), and its .spy-bar slides to it. Attributes and the bar change only when the section changes.
    const spies = [...document.querySelectorAll<HTMLElement>("[data-spy]")].map((nav) => ({
      links: [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')], bar: nav.querySelector<HTMLElement>(".spy-bar"), tops: [] as number[],
    }));
    if (spies.length) offs.push(scene({
      measure() {
        vh = window.innerHeight;
        for (const s of spies) s.tops = s.links.map((a) => { const t = document.getElementById(a.hash.slice(1)); return t ? top(t) : Infinity; });
      },
      frame(y) {
        for (const s of spies) {
          let k = 0;
          s.tops.forEach((t, n) => { if (t <= y + vh * 0.3) k = n; });
          s.links.forEach((a, n) => put(a, "aria-current", n === k ? "true" : "false", true));
          put(s.bar, "transform", `translateY(${s.links[k]?.offsetTop ?? 0}px)`);
        }
      },
    }));

    // ---- [data-fill] H7: each word's opacity from the block's progress through the lower screen, scrubbed both ways.
    //      Written per word through put (only the few words crossing the threshold change in a frame).
    const fills = [...document.querySelectorAll<HTMLElement>("[data-fill]")].map((el) => ({ el, words: [...el.querySelectorAll<HTMLElement>(".fw")], top: 0, h: 0 }));
    if (fills.length) offs.push(scene({
      measure() { vh = window.innerHeight; for (const f of fills) { f.top = top(f.el); f.h = f.el.offsetHeight; } },
      frame(y) {
        for (const f of fills) {
          const p = clamp((y + vh * 0.85 - f.top) / (f.h + vh * 0.35)), n = f.words.length;
          f.words.forEach((w, k) => put(w, "opacity", clamp(p * (n + 6) - k, 0.15, 1).toFixed(2)));
        }
      },
    }));

    // ---- §4 the cursor-aware triangle
    const wrap = document.querySelector<HTMLElement>("[data-tri]");
    const band = wrap?.closest<HTMLElement>(".band");
    const svg = wrap?.querySelector<SVGSVGElement>("svg");
    const grad = wrap?.querySelector<SVGLinearGradientElement>("linearGradient");
    if (wrap && band && svg && grad && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const cur = { a: -Math.PI / 4, rz: 0, rx: 0, g: 0.4 }, tgt = { ...cur };
      let raf = 0, last = 0;
      const tick = (t: number) => {
        const dt = Math.min(64, last ? t - last : 16); last = t;
        const k = 1 - Math.exp(-dt / 700); // "through water": a long, heavy lag
        cur.a += ((((tgt.a - cur.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI)) * k; // shortest way round
        cur.rz += (tgt.rz - cur.rz) * k; cur.rx += (tgt.rx - cur.rx) * k; cur.g += (tgt.g - cur.g) * k;
        const cx = Math.cos(cur.a) * 48, cy = Math.sin(cur.a) * 48;
        put(grad, "x1", (50 - cx).toFixed(2), true); put(grad, "y1", (50 - cy).toFixed(2), true);
        put(grad, "x2", (50 + cx).toFixed(2), true); put(grad, "y2", (50 + cy).toFixed(2), true);
        put(wrap, "transform", `perspective(${(900 * unit()).toFixed(0)}px) rotateX(${cur.rx.toFixed(2)}deg) rotate(${cur.rz.toFixed(2)}deg)`);
        put(svg, "opacity", (0.5 + 0.5 * cur.g).toFixed(3));
        const still = Math.abs(tgt.rz - cur.rz) < 0.02 && Math.abs(tgt.rx - cur.rx) < 0.02 && Math.abs(tgt.g - cur.g) < 0.002;
        raf = still ? 0 : requestAnimationFrame(tick);
        if (!raf) last = 0;
      };
      const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
      const move = (e: PointerEvent) => {
        const b = band.getBoundingClientRect(), r = wrap.getBoundingClientRect();
        if (e.clientY < b.top - 120 || e.clientY > b.bottom + 120) { if (tgt.g !== 0.4) { tgt.rz = 0; tgt.rx = 0; tgt.g = 0.4; wake(); } return; }
        const tx = r.left + r.width / 2, ty = r.top + r.height / 2;
        const nx = clamp(((e.clientX - b.left) / b.width) * 2 - 1, -1, 1), ny = clamp(((e.clientY - b.top) / b.height) * 2 - 1, -1, 1);
        tgt.a = Math.atan2(e.clientY - ty, e.clientX - tx);
        tgt.rz = nx * 12; tgt.rx = -ny * 14;
        tgt.g = 1 - clamp(Math.hypot(e.clientX - tx, e.clientY - ty) / (Math.hypot(b.width, b.height) * 0.55));
        wake();
      };
      window.addEventListener("pointermove", move, { passive: true });
      offs.push(() => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); });
    }

    return () => offs.forEach((f) => f());
  }, []);
  return null;
}
