"use client";
import { useEffect, useRef } from "react";
import { countUp } from "@/lib/countUp";
import { onViewport, unit } from "@/lib/viewport";
import { Icon } from "./Icon";
import { YMark } from "./YMark";

/*
  Drag playground (Loopsii "dashboard" pattern, Figma content): as the board scrolls in it zooms up from 0.82 and every card
  flies in from its own scattered spot (scrubbed by scroll, so it plays backwards too). Once landed, cards drift with the pointer
  by depth and can be thrown — momentum, a tilt from the throw speed, soft bounces at the edges. The ₹ amount counts up once.
  One rAF loop that runs only while something is still moving; only transform / opacity are written.
  Phones get their own spots (px/py) and fewer cards (drop) so the board fits ~1.1 screens; touch has no pointer, so no parallax there.
*/
type Def = { x: number; y: number; px?: number; py?: number; drop?: true; z: number; r: number; node: React.ReactNode; cls?: string };

const chip = (icon: string, t: string, s: string) => (
  <>
    <span className="chip-sym"><Icon n={icon} w={20} /></span>
    <span className="chip-text"><span className="chip-title">{t}</span><span className="chip-sub">{s}</span></span>
  </>
);
const pill = (icon: string, t: string) => (<><Icon n={icon} w={18} />{t}</>);

const DEFS: Def[] = [
  { x: 4, y: 10, px: 2, py: 3, z: 0.7, r: -3, node: chip("arrow-down-left", "Collect payments", "UPI · Virtual accounts") },
  { x: 33, y: 2, drop: true, z: 0.45, r: 2, cls: "pg-code", node: (<><p className="mono"><span className="lime">POST</span> /v1/payouts</p><p className="mono cream pg-small">Authorization: Bearer &lt;YOUR_API_KEY&gt;</p></>) },
  { x: 63, y: 6, px: 33, py: 15, z: 1, r: 4, cls: "pg-webhook", node: (<><div className="webhook-head mono"><span>payout.processed</span><Icon n="circle-check" w={17} /></div><p className="webhook-amt">₹25,000.00</p><p className="webhook-foot mono">{"200 OK  ·  Webhook delivered"}</p></>) },
  { x: 41, y: 34, px: 5, py: 37, z: 1.25, r: -2, cls: "pg-cta", node: (<><YMark className="pg-y" /><a href="#" className="pg-cta-link">Start building <Icon n="arrow-up-right-dark" w={18} /></a></>) },
  { x: 2, y: 50, px: 55, py: 3, z: 0.55, r: 2, cls: "pg-pill", node: pill("braces", "RESTful APIs") },
  { x: 12, y: 70, px: 4, py: 77, z: 0.9, r: -4, node: chip("arrow-up-right-card", "Move money", "IMPS · NEFT · RTGS") },
  { x: 74, y: 44, px: 40, py: 87, z: 0.6, r: 3, node: chip("landmark", "Connect accounts", "Open banking APIs") },
  { x: 36, y: 80, px: 20, py: 66, z: 0.8, r: 2, cls: "pg-ok", node: (<><Icon n="response-dot" w={7} /><span className="mono lime">200 OK</span><span className="mono cream">{`{ "status": "processing" }`}</span></>) },
  { x: 80, y: 74, drop: true, z: 0.5, r: -3, cls: "pg-pill", node: pill("webhook", "Real-time webhooks") },
  { x: 62, y: 88, drop: true, z: 0.65, r: 1, cls: "pg-pill", node: pill("terminal", "Developer-first integration") },
  { x: 22, y: 38, drop: true, z: 0.4, r: -1, cls: "pg-pill", node: pill("indian-rupee", "India-native infrastructure") },
];

export function Playground() {
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = board.current;
    if (!el) return;
    const motion = root.classList.contains("m"); // reduced motion / no .m: no fly-in, no throw — dragging and keys still work
    const cards = [...el.querySelectorAll<HTMLElement>(".pg-card")];
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const u = unit;
    const st = cards.map((c, i) => ({ c, z: DEFS[i].z, r: DEFS[i].r, dx: 0, dy: 0, vx: 0, vy: 0, px: 0, py: 0, tx: 0, ty: 0, rot: 0, drag: false, lift: 0, box: { l: 0, t: 0, w: 0, h: 0 }, last: "", lastO: "", ent: 0, ex: 0, ey: 0, er: 0 }));
    let W = 0, H = 0, zTop = 20, raf = 0, prev = 0, boardTop = 0, lastScale = "", counted = false;
    const amount = el.querySelector<HTMLElement>(".webhook-amt");

    const measure = () => {
      W = el.clientWidth; H = el.clientHeight;
      boardTop = el.getBoundingClientRect().top + window.scrollY;
      st.forEach((s, i) => {
        s.box = { l: s.c.offsetLeft, t: s.c.offsetTop, w: s.c.offsetWidth, h: s.c.offsetHeight };
        // each card starts outward from the board centre, further for nearer (higher z) cards, with its own spin
        const cx = s.box.l + s.box.w / 2 - W / 2, cy = s.box.t + s.box.h / 2 - H / 2, d = Math.hypot(cx, cy) || 1;
        s.ex = (cx / d) * (260 + 160 * s.z) * u(); s.ey = (cy / d) * (220 + 140 * s.z) * u() + 120 * u(); s.er = (i % 2 ? 1 : -1) * (14 + (i % 4) * 6);
      });
    };
    const ease = (t: number) => 1 - (1 - t) ** 3;
    const onScroll = () => {
      if (!motion) { st.forEach((s) => (s.ent = 1)); wake(); return; }
      // board progress: 0 when its top is at the bottom of the screen, 1 when it has risen 85% of a screen
      const p = Math.min(1, Math.max(0, (window.scrollY + innerHeight - boardTop) / (innerHeight * 0.85)));
      const sc = `scale(${(0.82 + 0.18 * ease(p)).toFixed(4)})`;
      if (sc !== lastScale) { el.style.transform = sc; lastScale = sc; }
      st.forEach((s, i) => { s.ent = Math.min(1, Math.max(0, (p - (i / st.length) * 0.4) / 0.55)); });
      if (!counted && amount && st[2].ent > 0.7) { counted = true; countUp(amount, 25000); }
      wake();
    };

    const tick = (now: number) => {
      const dt = Math.min(40, prev ? now - prev : 16); prev = now;
      let moving = false;
      for (const s of st) {
        if (!s.drag) {
          // momentum with friction, soft bounce inside the board
          s.dx += s.vx * dt; s.dy += s.vy * dt;
          const f = Math.exp(-dt / 260); s.vx *= f; s.vy *= f;
          // bounds include the pointer-parallax offset so a thrown card always settles fully inside the board
          const minX = -s.box.l - s.px, maxX = W - s.box.l - s.box.w - s.px, minY = -s.box.t - s.py, maxY = H - s.box.t - s.box.h - s.py;
          if (s.dx < minX) { s.dx = minX; s.vx = Math.abs(s.vx) * 0.45; } else if (s.dx > maxX) { s.dx = maxX; s.vx = -Math.abs(s.vx) * 0.45; }
          if (s.dy < minY) { s.dy = minY; s.vy = Math.abs(s.vy) * 0.45; } else if (s.dy > maxY) { s.dy = maxY; s.vy = -Math.abs(s.vy) * 0.45; }
          if (Math.abs(s.vx) < 0.005) s.vx = 0;
          if (Math.abs(s.vy) < 0.005) s.vy = 0;
        }
        const k = 1 - Math.exp(-dt / 160);
        s.px += (s.tx - s.px) * k; s.py += (s.ty - s.py) * k;
        const rotT = s.drag || s.vx ? Math.max(-14, Math.min(14, s.vx * 18)) : 0;
        s.rot += (rotT - s.rot) * k;
        s.lift += ((s.drag ? 1 : 0) - s.lift) * k;
        const e = 1 - ease(s.ent);
        const tf = `translate3d(${(s.dx + s.px + s.ex * e).toFixed(1)}px, ${(s.dy + s.py + s.ey * e).toFixed(1)}px, 0) rotate(${(s.r + s.rot + s.er * e).toFixed(2)}deg) scale(${(1 + 0.05 * s.lift - 0.25 * e).toFixed(3)})`;
        if (tf !== s.last) { s.c.style.transform = tf; s.last = tf; }
        const o = Math.min(1, s.ent * 2.2).toFixed(3);
        if (o !== s.lastO) { s.c.style.opacity = o; s.lastO = o; }
        if (s.drag || s.vx || s.vy || Math.abs(s.tx - s.px) > 0.1 || Math.abs(s.ty - s.py) > 0.1 || Math.abs(s.rot - rotT) > 0.05 || Math.abs(s.lift - (s.drag ? 1 : 0)) > 0.005) moving = true;
      }
      raf = moving ? requestAnimationFrame(tick) : 0;
      if (!raf) prev = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    // drag
    let active: (typeof st)[number] | null = null, sx = 0, sy = 0, ox = 0, oy = 0, lx = 0, ly = 0, lt = 0;
    const down = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>(".pg-card");
      if (!card || (e.target as Element).closest("a")) return;
      if (st[cards.indexOf(card)].ent < 1) return; // not landed yet
      active = st[cards.indexOf(card)];
      active.drag = true; active.vx = active.vy = 0;
      card.setPointerCapture(e.pointerId); card.style.zIndex = String(++zTop); card.classList.add("grab");
      sx = e.clientX; sy = e.clientY; ox = active.dx; oy = active.dy; lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
      wake();
    };
    const move = (e: PointerEvent) => {
      if (active) {
        active.dx = ox + e.clientX - sx; active.dy = oy + e.clientY - sy;
        const dt = Math.max(1, e.timeStamp - lt);
        active.vx = active.vx * 0.6 + ((e.clientX - lx) / dt) * 0.4; active.vy = active.vy * 0.6 + ((e.clientY - ly) / dt) * 0.4;
        lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
        wake();
      } else if (fine && motion) {
        const b = el.getBoundingClientRect(), nx = ((e.clientX - b.left) / b.width) * 2 - 1, ny = ((e.clientY - b.top) / b.height) * 2 - 1, m = u();
        st.forEach((s) => { s.tx = -nx * s.z * 18 * m; s.ty = -ny * s.z * 14 * m; });
        wake();
      }
    };
    const up = () => {
      if (!active) return;
      active.drag = false; active.c.classList.remove("grab");
      if (!motion || performance.now() - lt > 80) { active.vx = 0; active.vy = 0; } // let go without a throw
      active = null; wake();
    };
    // keyboard: a focused card moves with the arrow keys (the same bounds keep it on the board)
    const DIRS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const key = (e: KeyboardEvent) => {
      const i = cards.indexOf(e.target as HTMLElement), d = DIRS[e.key];
      if (i < 0 || !d) return;
      e.preventDefault();
      const s = st[i], step = 24 * u();
      s.dx += d[0] * step; s.dy += d[1] * step; s.c.style.zIndex = String(++zTop);
      wake();
    };
    const leave = () => { if (!active) { st.forEach((s) => { s.tx = 0; s.ty = 0; }); wake(); } };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("keydown", key);
    const offViewport = onViewport(() => { measure(); onScroll(); });
    return () => {
      offViewport();
      cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); el.removeEventListener("pointerleave", leave); el.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <section className="play sec-pad" data-tone="light" aria-label="One integration">
      <div className="play-head">
        <h2 className="h2 ink" data-r="left">One integration.<br />More potential.</h2>
        <p className="play-hint mono" data-r="right" id="pg-hint">Drag the cards around<span className="sr-only"> (or focus one and use the arrow keys)</span></p>
      </div>
      <div className="board" ref={board} aria-describedby="pg-hint">
        {DEFS.map((d, i) => (
          <div key={i} className={`pg-card ${d.cls ?? "pg-chip"}`} data-drop={d.drop} tabIndex={0} aria-roledescription="draggable card" style={{ left: `${d.x}%`, top: `${d.y}%`, "--px": `${d.px}%`, "--py": `${d.py}%`, "--z": d.z, transform: `rotate(${d.r}deg)`, "--i": i } as React.CSSProperties}>
            {d.node}
          </div>
        ))}
      </div>
    </section>
  );
}
