"use client";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/ia";
import { lenisRef } from "@/lib/lenis";
import { Icon } from "./Icon";

const v = (o: Record<string, number>) => o as unknown as React.CSSProperties;

/*
  Desktop: the bar with four groups. Phone/tablet (< 1100px): logo + Start building + a menu button that opens a full-screen
  glass sheet — the hero's flute lines rain down as its entrance, groups are accordions. While open the page behind is
  inert and Lenis is stopped, so focus and scroll both stay in the sheet.
*/
export function Nav() {
  const [open, setOpen] = useState(false);
  const [acc, setAcc] = useState(-1); // expanded sheet group
  const layer = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const behind = [...document.querySelectorAll<HTMLElement>("main > :not(.navlayer)")];
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
                      <li key={l.t}><a href={l.href} onClick={close}>{l.t}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          <div className="sheet-foot" style={v({ "--i": NAV.length })}>
            <a className="btn btn-ghost" href="#" onClick={close}>Login</a>
            <a className="btn btn-lime" href="#" onClick={close}>
              Start building
              <Icon n="arrow-up-right-dark" w={18} />
            </a>
          </div>
        </nav>
      </div>

      <header className="nav">
        <a href="#" aria-label="Yubit Pay">
          <Icon n="logo" w={68} h={32} />
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((g) => (
            <button key={g.h} className="nav-item" type="button">
              <span className="roll" data-text={g.h}><span>{g.h}</span></span>
              <Icon n="chevron-down" w={12} />
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-login" href="#"><span className="roll" data-text="Login"><span>Login</span></span></a>
          <a className="btn btn-lime" href="#">
            Start building
            <Icon n="arrow-up-right-dark" w={18} />
          </a>
          <button ref={burger} type="button" className="nav-burger" aria-expanded={open} aria-controls="nav-sheet" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            <i /><i />
          </button>
        </div>
      </header>
    </div>
  );
}
