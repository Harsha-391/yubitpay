"use client";
import { useState } from "react";
import { Icon } from "./Icon";

export type QA = { q: string; a: string };

export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState(0); // the design shows the first one open
  return (
    <div className="faq-list">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} className="faq-item" data-open={on} data-r="right" style={{ "--i": i } as React.CSSProperties}>
            <h3>
              <button type="button" className="faq-q" aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span>{it.q}</span>
                <Icon n={on ? "minus" : "plus"} w={18} />
              </button>
            </h3>
            <div className="faq-a" id={`faq-a-${i}`} role="region">
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
