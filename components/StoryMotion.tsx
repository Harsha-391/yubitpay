"use client";
import { useEffect } from "react";
import { countUp } from "@/lib/countUp";
import { onViewport, storyPace, unit } from "@/lib/viewport";

/*
  The pinned story (Story.tsx). One scroll position S, in viewport heights V, drives:
    0.00–0.50  hero copy, chips and the logo word leave (two-direction language)
    0.15–0.80  the lime triangle on the "i" grows and travels to the centre
    0.80–1.30  it flips (rotates 180° with a squash, so it reads as a turn) → ▼
    1.30–1.75  a stem grows from the tip → Y ("One integration. More potential.")
    1.80–2.15  Beat 1: the fill drains like ink, leaving the Y's luminous outline
    2.15–2.68  Beat 2: its three strokes peel off one at a time and float (left arm, stem, right arm)
    2.50–3.08  … then each travels to one card's top edge (left arm → left card, stem → centre, right arm → right card)
    2.90–3.46  Beat 3: borders draw round each card and lock with a click · held as outlines until 3.42
    3.42–3.92  Beat 4: cards fill (sides like liquid, centre like a light) · 3.7–3.95 light tint · 3.92–4.3 Beat 5: heading ← / text →
  Every write goes through a change-only cache, at most once per frame; Lenis (Flow.tsx) smooths the scroll.
  On phones/tablets the same timeline runs faster (storyPace) so the pin is ~3 screens, and every position is measured from the DOM,
  so the strokes land on whatever layout the cards have (a row on desktop, a stack on phones).
*/

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (s: number, a: number, b: number) => clamp((s - a) / (b - a));
const io = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const out = (t: number) => 1 - (1 - t) ** 3;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// triangle on the logo's "i", in the logo's 100×47 units (from the Figma vector)
const A = [79.3067, 0], B = [83.2114, 7.1323], C = [75.1973, 7.1324];
const G = [79.2385, 4.7549]; // centroid: the point it grows and flips around
const STEM_END = [79.3067, -6]; // stem grows "up" in local space = down once flipped
const TRI_W = 8.014;

export function StoryMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ready = "1";
    if (!root.classList.contains("m")) return;

    const $ = <T extends Element>(s: string, from: ParentNode = document) => from.querySelector(s) as T;
    const pin = $<HTMLElement>("#story-pin");
    const mark = $<SVGSVGElement>("#mark");
    const yMark = $<SVGGElement>("#y-mark");
    const yStem = $<SVGRectElement>("#y-stem");
    const yFill = $<SVGGElement>("#y-fill"), yInk = $<SVGRectElement>("#y-ink");
    const yLine = $<SVGPathElement>("#y-line"), yLineGlow = $<SVGPathElement>("#y-line-glow");
    const yGlow = $<HTMLElement>("#y-glow");
    const yLabel = $<HTMLElement>("#y-label");
    const cardsLayer = $<HTMLElement>("#cards");
    const tint = $<HTMLElement>("#tint");
    const headEl = $<HTMLElement>("#intro-h");
    const bodyEl = $<HTMLElement>("#intro-p");
    const hero = $<HTMLElement>(".hero", pin);
    const logo = $<HTMLElement>(".logo-big", hero);
    const t1 = $<HTMLElement>(".t1", hero), t2 = $<HTMLElement>(".t2", hero), sub = $<HTMLElement>(".sub", hero);
    const actions = $<HTMLElement>(".actions", hero), principles = $<HTMLElement>(".principles", hero), rays = $<HTMLElement>(".rays", hero);
    const chips = [...hero.querySelectorAll<HTMLElement>(".chip")];
    const conns = [...hero.querySelectorAll<HTMLElement>(".conn")];
    const lines = [0, 1, 2].map((j) => {
      const g = $(`[data-line="${j}"]`, mark);
      return { glow: $<SVGLineElement>("[data-glow]", g), core: $<SVGLineElement>("[data-core]", g) };
    });
    const frames = [0, 1, 2].map((k) => $<SVGGElement>(`[data-card="${k}"]`, mark));
    const borders = frames.map((fr) => [...fr.querySelectorAll("path")] as SVGPathElement[]);
    const cardEls = [...pin.querySelectorAll<HTMLElement>("[data-mcard]")];
    const fills = cardEls.map((c) => $<HTMLElement>("[data-fill]", c));
    const layers = cardEls.map((c) => [...c.querySelectorAll<HTMLElement>("[data-l]")]);

    // the hero entrance is CSS; once it has played, drop those animations so scroll writes are the only thing styling these nodes
    const amt = $<HTMLElement>(".webhook-amt", hero);
    const counting = setTimeout(() => amt && countUp(amt, 25000, 1100), 3100); // Act VII: the payout chip surfaces at 3.1s
    const entrance = hero.getAnimations({ subtree: true });
    Promise.all(entrance.map((a) => a.finished)).then(() => entrance.forEach((a) => a.cancel()), () => {});

    const seen = new WeakMap<Element, Record<string, string>>();
    const put = (el: Element, k: string, v: string, attr = false) => {
      const c = seen.get(el) ?? {};
      if (c[k] === v) return;
      c[k] = v; seen.set(el, c);
      if (attr) el.setAttribute(k, v); else (el as HTMLElement).style.setProperty(k, v);
    };
    const line = (el: SVGLineElement, x1: number, y1: number, x2: number, y2: number, w: number, o: number) => {
      put(el, "x1", x1.toFixed(1), true); put(el, "y1", y1.toFixed(1), true);
      put(el, "x2", x2.toFixed(1), true); put(el, "y2", y2.toFixed(1), true);
      put(el, "stroke-width", w.toFixed(2)); put(el, "opacity", o.toFixed(3));
    };

    let W = 0, V = 0, u = 1, T = 1, top = 0, r = 0, k0 = 1, K = 1, c0 = [0, 0], C1 = [0, 0];
    let cards: { x: number; y: number; w: number; h: number }[] = [], fTop: number[] = [], chipDir: number[] = [];

    const measure = () => {
      const p = pin.getBoundingClientRect();
      W = p.width; V = p.height; // the pin is 100svh: stable while a phone's address bar comes and goes
      u = unit(); T = storyPace();
      top = $<HTMLElement>("#story").getBoundingClientRect().top + window.scrollY;
      put(mark, "viewBox", `0 0 ${W.toFixed(1)} ${p.height.toFixed(1)}`, true);
      // start: exactly over the logo's own triangle. .illu's box is never transformed; the logo's offsets ignore its rise/scale animation.
      const ill = $<HTMLElement>("#illu").getBoundingClientRect(), wrap = logo.parentElement!;
      k0 = logo.offsetWidth / 100; // the logo svg is 100 units wide
      c0 = [ill.left - p.left + wrap.offsetLeft + logo.offsetLeft + G[0] * k0, ill.top - p.top + wrap.offsetTop + logo.offsetTop + G[1] * k0];
      K = (240 * u) / TRI_W;
      C1 = [W / 2, p.height * 0.34];
      r = 15 * u;
      cards = cardEls.map((el) => { const b = el.getBoundingClientRect(); return { x: b.left - p.left, y: b.top - p.top, w: b.width, h: b.height }; });
      fTop = [];
      cards.forEach((c, i) => {
        const cx = c.x + c.w / 2, x2 = c.x + c.w, y2 = c.y + c.h;
        const cw = `M${cx} ${c.y}H${x2 - r}A${r} ${r} 0 0 1 ${x2} ${c.y + r}V${y2 - r}A${r} ${r} 0 0 1 ${x2 - r} ${y2}H${cx}`;
        const ccw = `M${cx} ${c.y}H${c.x + r}A${r} ${r} 0 0 0 ${c.x} ${c.y + r}V${y2 - r}A${r} ${r} 0 0 0 ${c.x + r} ${y2}H${cx}`;
        borders[i].forEach((path, n) => { path.setAttribute("d", n % 2 ? ccw : cw); path.setAttribute("pathLength", "1"); });
        fTop.push((c.w / 2 - r) / (c.w - 2 * r + (c.h - 2 * r) + Math.PI * r)); // the landed stroke = the top edge
      });
      const mid = ill.left + ill.width / 2;
      chipDir = chips.map((c) => (c.getBoundingClientRect().left + c.offsetWidth / 2 < mid ? -1 : 1));
      seen.delete(yMark);
    };

    const render = () => {
      const S = (window.scrollY - top) * T;
      const Vh = V;

      // ---- hero leaves
      const e = io(seg(S, 0, 0.5 * Vh));
      put(t1, "transform", `translateX(${(-e * W * 0.55).toFixed(1)}px)`); put(t1, "opacity", (1 - e).toFixed(3));
      put(t2, "transform", `translateX(${(e * W * 0.55).toFixed(1)}px)`); put(t2, "opacity", (1 - e).toFixed(3));
      put(sub, "transform", `translateY(${(-e * 40 * u).toFixed(1)}px)`); put(sub, "opacity", (1 - e * 1.4).toFixed(3));
      put(actions, "transform", `scale(${(1 - 0.25 * e).toFixed(4)})`); put(actions, "opacity", (1 - e * 1.6).toFixed(3));
      chips.forEach((c, i) => {
        const d = chipDir[i] * e * 220 * u;
        put(c, "transform", `translate(${d.toFixed(1)}px, ${(-e * 30 * u).toFixed(1)}px)`); put(c, "opacity", (1 - e * 1.3).toFixed(3));
      });
      conns.forEach((c) => put(c, "opacity", (1 - e * 1.8).toFixed(3)));
      put(principles, "transform", `translateY(${(e * 140 * u).toFixed(1)}px)`); put(principles, "opacity", (1 - e * 1.5).toFixed(3));
      put(rays, "opacity", (1 - e * 2).toFixed(3));
      const w = io(seg(S, 0.12 * Vh, 0.5 * Vh));
      put(logo, "opacity", (1 - w).toFixed(3)); put(logo, "transform", `scale(${(1 - 0.08 * w).toFixed(4)})`);

      // ---- triangle → Y
      const g = io(seg(S, 0.15 * Vh, 0.8 * Vh));
      const f = io(seg(S, 0.8 * Vh, 1.3 * Vh));
      const st = out(seg(S, 1.3 * Vh, 1.75 * Vh));
      const cx = mix(c0[0], C1[0], g), cy = mix(c0[1], C1[1], g);
      const k = k0 * Math.pow(K / k0, g); // log-space so the growth feels even
      const rot = 180 * f, sx = 1 - 0.35 * Math.sin(Math.PI * f);
      put(yMark, "transform", `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${(k * sx).toFixed(4)} ${k.toFixed(4)}) translate(${-G[0]} ${-G[1]})`, true);
      const h = st * 7.6;
      put(yStem, "height", h.toFixed(3), true); put(yStem, "y", (1.6 - h).toFixed(3), true);

      // Beat 1 — the ink drains: the fill's level sinks from the top of the Y out through the stem; the sharp outline stays.
      // The mask is only attached while draining (a mask on every growth frame would be paint for nothing).
      const dr = io(seg(S, 1.8 * Vh, 2.15 * Vh));
      put(yFill, "mask", dr > 0 && dr < 1 ? "url(#y-drain)" : "none", true);
      put(yFill, "opacity", dr >= 1 ? "0" : "1");
      put(yInk, "transform", `translate(0 ${(-dr * 20).toFixed(3)})`, true);
      const handover = seg(S, 2.1 * Vh, 2.2 * Vh); // the outline becomes the three separate strokes
      const lineO = Math.min(1, dr * 3) * (1 - handover);
      put(yLine, "opacity", lineO.toFixed(3)); put(yLine, "stroke-width", (3 * u).toFixed(2));
      put(yLineGlow, "opacity", (lineO * (0.22 + 0.25 * Math.sin(Math.PI * dr))).toFixed(3)); put(yLineGlow, "stroke-width", (15 * u).toFixed(2));

      const away = seg(S, 2.5 * Vh, 2.95 * Vh);
      put(yGlow, "opacity", (seg(S, 0.5 * Vh, 1.1 * Vh) * (1 - 0.5 * dr) * (1 - away)).toFixed(3));
      put(yGlow, "transform", `translate(${cx.toFixed(1)}px, ${(cy + 3.5 * k).toFixed(1)}px) scale(${(0.55 + 0.45 * g).toFixed(3)})`);
      const lab = seg(S, 1.5 * Vh, 1.85 * Vh) * (1 - seg(S, 2.1 * Vh, 2.4 * Vh));
      put(yLabel, "opacity", lab.toFixed(3));
      put(yLabel, "transform", `translate(-50%, ${(cy + 13 * k + (1 - lab) * 16 * u).toFixed(1)}px)`);

      // screen position of a local (logo-unit) point under the current mark transform
      const cos = Math.cos((rot * Math.PI) / 180), sin = Math.sin((rot * Math.PI) / 180);
      const P = (p: number[]) => { const x = (p[0] - G[0]) * k * sx, y = (p[1] - G[1]) * k; return [cx + x * cos - y * sin, cy + x * sin + y * cos]; };
      const a = P(A), b = P(B), c = P(C), s = P([STEM_END[0], 1.6 - h]);
      const [lt, rt] = b[0] < c[0] ? [b, c] : [c, b];
      const strokes = [[lt, a], [a, s], [rt, a]]; // left arm, stem, right arm

      for (let j = 0; j < 3; j++) {
        const cd = cards[j];
        // Beat 2 — one at a time, each stroke lifts away from the Y (outward, a slight turn), then floats before it travels
        const pe = io(seg(S, (2.15 + 0.1 * j) * Vh, (2.4 + 0.1 * j) * Vh));
        const go = 2.5 + 0.09 * j, at = go + 0.4; // travel starts / lands
        const fl = seg(S, (2.4 + 0.1 * j) * Vh, go * Vh);
        const land = io(seg(S, go * Vh, at * Vh));
        const [p1, p2] = strokes[j];
        const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
        let nx = mx - cx, ny = my - cy;
        const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
        const off = (pe * 34 + fl * 14) * u, bob = -Math.sin(Math.PI * fl) * 6 * u;
        const th = (((j - 1) * 7 * pe + Math.sin(Math.PI * fl) * 2 * (j - 1)) * Math.PI) / 180;
        const lift = (p: number[]) => {
          const dx = p[0] - mx, dy = p[1] - my;
          return [mx + dx * Math.cos(th) - dy * Math.sin(th) + nx * off, my + dx * Math.sin(th) + dy * Math.cos(th) + ny * off + bob];
        };
        const f1 = lift(p1), f2 = lift(p2);

        const [q1, q2] = [[cd.x + r, cd.y], [cd.x + cd.w - r, cd.y]];
        const [s1, s2] = f1[0] <= f2[0] ? [f1, f2] : [f2, f1];
        const arc = Math.sin(Math.PI * land) * 70 * u; // a small arc on the way
        const x1 = mix(s1[0], q1[0], land), y1 = mix(s1[1], q1[1], land) - arc;
        const x2 = mix(s2[0], q2[0], land), y2 = mix(s2[1], q2[1], land) - arc;
        const landed = land >= 1;
        const show = landed ? 0 : handover;
        const wdt = mix(3 * u, 1.7 * u, land);
        line(lines[j].core, x1, y1, x2, y2, wdt, show);
        line(lines[j].glow, x1, y1, x2, y2, wdt * 5, show * (0.22 + 0.12 * Math.sin(Math.PI * fl)));

        // Beat 3 — the landed stroke draws the card's border both ways round from the top, and closes with a click:
        // a tiny overshoot of the whole frame plus a pulse of its glow
        const dEnd = at + 0.28;
        const draw = io(seg(S, at * Vh, dEnd * Vh));
        const bump = Math.sin(Math.PI * seg(S, (dEnd - 0.03) * Vh, (dEnd + 0.1) * Vh));
        const fade = 1 - seg(S, 3.9 * Vh, 4.15 * Vh);
        const dash = `${mix(fTop[j], 1, draw).toFixed(4)} 2`;
        const sc = 1 + 0.012 * bump, ccx = cd.x + cd.w / 2, ccy = cd.y + cd.h / 2;
        put(frames[j], "transform", bump > 0 ? `translate(${ccx.toFixed(1)} ${ccy.toFixed(1)}) scale(${sc.toFixed(4)}) translate(${(-ccx).toFixed(1)} ${(-ccy).toFixed(1)})` : "", true);
        borders[j].forEach((path, n) => {
          const o = (landed ? 1 : 0) * fade * (n < 2 ? 0.18 + 0.45 * bump : 1);
          put(path, "opacity", o.toFixed(3));
          if (o === 0) return;
          put(path, "stroke-dasharray", dash); put(path, "stroke-width", String(n < 2 ? 6 * u : 1.7 * u));
        });

        // Beat 4 — after a held moment as pure outlines, the cards fill: the sides rise like liquid (wave edge in CSS),
        // the centre opens from its middle like a light; then icon → title → text → button surface in turn
        const fi = seg(S, (3.42 + 0.07 * j) * Vh, (3.78 + 0.07 * j) * Vh), ef = out(fi);
        if (j === 1) { put(fills[j], "transform", `scale(${ef.toFixed(4)})`); put(fills[j], "opacity", seg(fi, 0, 0.3).toFixed(3)); }
        else put(fills[j], "transform", `translateY(calc(${((1 - ef) * 100).toFixed(2)}% + ${((1 - ef) * 18 * u).toFixed(1)}px))`); // + the wave crest, so it starts fully below the card
        layers[j].forEach((el, n) => {
          const t = out(seg(fi, 0.3 + n * 0.14, 0.58 + n * 0.14));
          put(el, "opacity", t.toFixed(3)); put(el, "transform", `translateY(${((1 - t) * 8 * u).toFixed(2)}px)`);
        });
      }

      // Beat 5 — the light tint, then heading from the left and text from the right
      put(tint, "opacity", io(seg(S, 3.7 * Vh, 3.95 * Vh)).toFixed(3));
      const hh = out(seg(S, 3.92 * Vh, 4.25 * Vh)), pp = out(seg(S, 3.97 * Vh, 4.3 * Vh));
      put(headEl, "opacity", hh.toFixed(3)); put(headEl, "transform", `translateX(${((hh - 1) * 90 * u).toFixed(1)}px)`);
      put(bodyEl, "opacity", pp.toFixed(3)); put(bodyEl, "transform", `translateX(${((1 - pp) * 90 * u).toFixed(1)}px)`);
      cardsLayer.classList.toggle("live", S > 3.8 * Vh);
      hero.style.pointerEvents = S > 0.4 * Vh ? "none" : "";
    };

    let raf = 0;
    const wake = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); };
    const remeasure = () => { measure(); render(); };
    remeasure();
    window.addEventListener("scroll", wake, { passive: true });
    const offViewport = onViewport(remeasure);
    document.fonts?.ready.then(remeasure);
    return () => {
      window.removeEventListener("scroll", wake); offViewport(); clearTimeout(counting);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
