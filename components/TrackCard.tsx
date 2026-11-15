"use client";
import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { YMark } from "./YMark";

/*
  A solutions card: title first; the description + link unfold on hover (fine pointers) or on tap / Enter (the whole card is
  the toggle). The height animates via grid rows, so nothing is measured. Without JS (no data-ready) every card stays open.
*/
export function TrackCard({ n, icon, t, d, cls }: { n: number; icon: string; t: string; d: string; cls: string }) {
  const [open, setOpen] = useState(false);
  const hover = useRef(false);
  const mouse = (on: boolean) => (e: React.PointerEvent) => { if (e.pointerType === "mouse") { hover.current = on; setOpen(on); } };
  return (
    <article className={`tcard ${cls}`} data-open={open} onPointerEnter={mouse(true)} onPointerLeave={mouse(false)}>
      <span className="tc-n mono">0{n} / 03</span>
      <YMark className="tc-y" />
      <div className="tc-body">
        <span className="tc-sym"><Icon n={icon} w={30} /></span>
        <h3 className="tc-t">
          <button type="button" className="tc-toggle" aria-expanded={open} aria-controls={`tc-more-${n}`} onClick={() => setOpen((o) => (hover.current ? true : !o))}>
            {t}
            <Icon n="chevron-down" w={22} className="tc-chev" />
          </button>
        </h3>
        <div className="tc-more disc" id={`tc-more-${n}`}>
          <div>
            <p className="tc-p">{d}</p>
            <a className="tc-link" href="#">
              <span className="roll" data-text="Explore"><span>Explore</span></span>
              <Icon n="arrow-up-right-docs" w={18} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
