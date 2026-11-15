"use client";
import { useState } from "react";
import type { Group } from "@/lib/ia";
import { useMedia } from "@/lib/viewport";
import { Icon } from "./Icon";

// A footer link column. On phones it is an accordion; the server renders the open, heading-only version (desktop and no-JS).
export function FootCol({ g, n }: { g: Group; n: number }) {
  const phone = useMedia("(max-width: 767px)");
  const [open, setOpen] = useState(false);
  const shut = phone && !open;
  return (
    <nav className="foot-col" aria-label={g.h} data-r="deal" data-open={!shut} style={{ "--i": n } as React.CSSProperties}>
      {phone ? (
        <h2>
          <button type="button" className="foot-h" aria-expanded={open} aria-controls={`foot-${n}`} onClick={() => setOpen(!open)}>
            {g.h}
            <Icon n="chevron-down" w={16} />
          </button>
        </h2>
      ) : (
        <p className="foot-h">{g.h}</p>
      )}
      <div className="disc" id={`foot-${n}`} inert={shut}>
        <div className="foot-links">
          {g.links.map((l) => (
            <a key={l.t} href={l.href}>
              <span className="roll" data-text={l.t}><span>{l.t}</span></span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
