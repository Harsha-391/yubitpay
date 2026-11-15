"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, ROUTES } from "@/lib/ia";
import { lenisRef } from "@/lib/motion/lenis";
import { Roll } from "@/lib/motion/Roll";
import { Icon } from "./Icon";

const v = (o: Record<string, number>) => o as unknown as React.CSSProperties;

// which nav group each scene belongs to (section-aware highlight)
const SCENES: [string, number][] = [["#story", 0], ["#statement", 0], [".banner", 0], ["#dev", 2], [".play", 2], ["#tracks", 1], [".faq", 3], [".closing", 3]];

/*
  Desktop: four groups, each a glass dropdown — opens on hover (with intent delays, so passing over doesn't flicker it open)
  or on click; keyboard: Enter/Space/↓ opens, ←/→ moves between groups, ↑/↓ moves between links, Esc closes.
  The current scene's group is marked, and a thin lime line along the bottom shows page progress (written by Flow.tsx).
  Phone/tablet (< 1100px): logo + Start building + a menu button that opens a full-screen glass sheet — the hero's flute
  lines rain down as its entrance, groups are accordions. While open the page behind is inert and Lenis is stopped.
*/
export function Nav() {
  const [open, setOpen] = useState(false); // phone/tablet sheet
  const [acc, setAcc] = useState(-1); // expanded sheet group
  const [menu, setMenu] = useState(-1); // open desktop dropdown
  const [here, setHere] = useState(-1); // group of the scene in view
  const [ready, setReady] = useState(false); // closed panels go inert only once JS runs: without it CSS opens them on hover
  const layer = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const close = () => setOpen(false);
  const pathname = usePathname();
  // The layout's HTML is shared by every route, so nothing rendered here may depend on the path until after hydration:
  // `path` fills in on mount, and the home / inner variants of the bar are both in the markup (CSS shows one, see inner.css).
  const [path, setPath] = useState("");
  useEffect(() => setPath(pathname), [pathname]);
  const pageGroup = NAV.findIndex((g) => g.links.some((l) => l.href === path)); // the group this page belongs to
  const current = path === "/" ? here : pageGroup; // on the homepage the highlight follows the scene in view instead
  useEffect(() => { setOpen(false); setMenu(-1); }, [pathname]);

  const trigger = (i: number) => layer.current?.querySelector<HTMLElement>(`#nav-t${i}`);
  const items = (i: number) => [...(layer.current?.querySelectorAll<HTMLElement>(`#nav-p${i} a`) ?? [])];
  const later = (fn: () => void, ms: number) => { clearTimeout(timer.current); timer.current = window.setTimeout(fn, ms); };

  // phone/tablet sheet: lock scroll + focus while open
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const behind = [...document.querySelectorAll<HTMLElement>("main, .closing")];
    behind.forEach((e) => (e.inert = true));
    lenisRef.current?.stop();
    root.classList.add("sheet-open"); // native touch scroll is not Lenis's: stop it with overflow
    layer.current?.querySelector<HTMLElement>(".sheet-h")?.focus();

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); burger.current?.focus(); return; }
      if (e.key !== "Tab" || !layer.current) return;
      // keep Tab inside the bar + sheet (the rest of the page is inert anyway; this stops focus escaping to the browser UI)
      const f = [...layer.current.querySelectorAll<HTMLElement>("a[href], button")].filter((x) => x.offsetParent && !x.closest("[inert]"));
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1]?.focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0]?.focus(); }
    };
    const wide = matchMedia("(min-width: 1100px)");
    addEventListener("keydown", key);
    addEventListener("hashchange", close);
    wide.addEventListener("change", close);
    return () => {
      behind.forEach((e) => (e.inert = false));
      lenisRef.current?.start();
      root.classList.remove("sheet-open");
      removeEventListener("keydown", key); removeEventListener("hashchange", close); wide.removeEventListener("change", close);
    };
  }, [open]);

  // desktop dropdown: close on outside click / scroll away / hash navigation
  useEffect(() => {
    if (menu < 0) return;
    const off = (e: Event) => { if (!(e.target as Element).closest?.(".nav-group")) setMenu(-1); };
    const shut = () => setMenu(-1);
    document.addEventListener("pointerdown", off);
    addEventListener("hashchange", shut);
    return () => { document.removeEventListener("pointerdown", off); removeEventListener("hashchange", shut); };
  }, [menu]);

  // section-aware: the scene crossing the middle of the screen
  useEffect(() => {
    setReady(true);
    const els = SCENES.map(([s, g]) => [document.querySelector(s), g] as const).filter(([e]) => e) as [Element, number][];
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setHere(els.find(([el]) => el === e.target)?.[1] ?? -1);
    }, { rootMargin: "-50% 0px -50% 0px" });
    els.forEach(([e]) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const onTriggerKey = (e: React.KeyboardEvent, i: number) => {
    const go = (j: number) => { const n = (j + NAV.length) % NAV.length; trigger(n)?.focus(); if (menu >= 0) setMenu(n); };
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setMenu(i); requestAnimationFrame(() => items(i)[0]?.focus()); }
    else if (e.key === "Escape") setMenu(-1);
  };
  const onPanelKey = (e: React.KeyboardEvent, i: number) => {
    const list = items(i), at = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") { e.preventDefault(); list[(at + 1) % list.length]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (at <= 0) trigger(i)?.focus(); else list[at - 1]?.focus(); }
    else if (e.key === "Escape") { setMenu(-1); trigger(i)?.focus(); }
  };

  return (
    <div className="navlayer" ref={layer} data-sheet={open}>
      <div className="sheet" id="nav-sheet" data-open={open} inert={!open}>
        <div className="sheet-rain" aria-hidden="true" />
        <nav className="sheet-body" aria-label="Menu">
          {NAV.map((g, i) => {
            const on = acc === i;
            return (
              <div key={g.h} className="sheet-group" data-open={on} style={v({ "--i": i })}>
                <button type="button" className="sheet-h" aria-expanded={on} aria-controls={`sheet-g${i}`} onClick={() => setAcc(on ? -1 : i)}>
                  {g.h}
                  <Icon n="chevron-down" w={16} />
                </button>
                <div className="disc" id={`sheet-g${i}`} inert={!on}>
                  <ul className="sheet-links">
                    {g.links.map((l) => (
                      <li key={l.t}><Link href={l.href} aria-current={l.href === path ? "page" : undefined} onClick={close}>{l.t}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          <div className="sheet-foot" style={v({ "--i": NAV.length })}>
            <Link className="btn btn-ghost" href={ROUTES.login} onClick={close}><span className="on-home">Login</span><span className="on-inner">Sign in</span></Link>
            <Link className="btn btn-lime" href={ROUTES.start} onClick={close}>
              <span className="on-home">Start building</span><span className="on-inner">Get Started</span>
              <Icon n="arrow-up-right-dark" w={18} />
            </Link>
          </div>
        </nav>
      </div>

      <header className="nav">
        <Link className="on-home" href="/" aria-label="Yubit Pay">
          <Icon n="logo" w={68} h={32} />
        </Link>
        <Link className="brand on-inner" href="/">
          <span className="brand-sym"><Icon n="waypoints" w={23} /></span>
          yubit pay
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((g, i) => {
            const on = menu === i;
            return (
              <div
                key={g.h}
                className="nav-group"
                data-open={on}
                onPointerEnter={(e) => { if (e.pointerType === "mouse") later(() => setMenu(i), menu >= 0 ? 0 : 120); }}
                onPointerLeave={(e) => { if (e.pointerType === "mouse") later(() => setMenu((m) => (m === i ? -1 : m)), 250); }}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMenu((m) => (m === i ? -1 : m)); }}
              >
                <button
                  id={`nav-t${i}`}
                  className="nav-item"
                  type="button"
                  aria-expanded={on}
                  aria-controls={`nav-p${i}`}
                  aria-current={current === i ? "true" : undefined}
                  onClick={() => { clearTimeout(timer.current); setMenu(on ? -1 : i); }}
                  onKeyDown={(e) => onTriggerKey(e, i)}
                >
                  <span className="roll" data-text={g.h}><span>{g.h}</span></span>
                  <Icon n="chevron-down" w={12} />
                </button>
                <div className="nav-panel disc" id={`nav-p${i}`} inert={ready && !on} onKeyDown={(e) => onPanelKey(e, i)}>
                  <div>
                    <ul className="nav-menu">
                      {g.links.map((l, n) => (
                        <li key={l.t} style={v({ "--i": n })}>
                          <Link href={l.href} aria-current={l.href === path ? "page" : undefined}>
                            {l.t}
                            <Icon n="arrow-up-right-light" w={16} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="nav-actions">
          <Link className="nav-login" href={ROUTES.login}><span className="on-home"><Roll>Login</Roll></span><span className="on-inner"><Roll>Sign in</Roll></span></Link>
          <Link className="btn btn-lime" href={ROUTES.start}>
            <span className="on-home">Start building</span><span className="on-inner">Get Started</span>
            <Icon n="arrow-up-right-dark" w={18} />
          </Link>
          <button ref={burger} type="button" className="nav-burger" aria-expanded={open} aria-controls="nav-sheet" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            <i /><i />
          </button>
        </div>
        <i className="nav-progress" aria-hidden="true" />
      </header>
    </div>
  );
}
