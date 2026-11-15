"use client";
import { useEffect, useState } from "react";
import { lenisRef } from "@/lib/motion/lenis";
import { Icon } from "./Icon";

export type QA = { q: string; a: string };

// One answer open at a time; each item is deep-linkable as #faq-1 … #faq-n (opening one also updates the address bar).
export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState(0); // the design shows the first one open

  useEffect(() => {
    const fromHash = () => {
      const n = Number(/^#faq-(\d+)$/.exec(location.hash)?.[1]);
      if (!n || n > items.length) return;
      setOpen(n - 1);
      const el = document.getElementById(`faq-${n}`);
      if (el) lenisRef.current ? lenisRef.current.scrollTo(el, { offset: -120 }) : el.scrollIntoView({ block: "center" });
    };
    fromHash();
    addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, [items.length]);

  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    history.replaceState(null, "", next < 0 ? location.pathname + location.search : `#faq-${next + 1}`); // shareable, no jump
  };

  return (
    <div className="faq-list">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} id={`faq-${i + 1}`} className="faq-item" data-open={on} data-r="right" style={{ "--i": i } as React.CSSProperties}>
            <h3>
              <button type="button" className="faq-q" aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => toggle(i)}>
                <span>{it.q}</span>
                <Icon n={on ? "minus" : "plus"} w={18} />
              </button>
            </h3>
            <div className="faq-a" id={`faq-a-${i}`} role="region" aria-label={it.q}>
              <div>
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
