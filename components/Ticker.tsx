"use client";
import { useEffect, useRef, useState } from "react";

// Demo events only: event types the APIs produce, with round sample amounts. No customers, no volumes, no live data.
const EVENTS = [
  { k: "UPI collect", v: "₹1,200.00", s: "captured" },
  { k: "IMPS payout", v: "₹25,000.00", s: "processed" },
  { k: "Webhook", v: "payout.processed", s: "200 OK" },
  { k: "UPI collect", v: "₹499.00", s: "captured" },
  { k: "NEFT payout", v: "₹8,000.00", s: "processing" },
  { k: "Webhook", v: "payment.captured", s: "200 OK" },
];

/*
  A sandbox-style event stream, clearly labelled as illustrative. A new event drops in every ~2.6s, the oldest fades out.
  It only runs while on screen and while the tab is visible; under reduced motion it is a still list.
*/
export function Ticker() {
  const [n, setN] = useState(3); // events shown so far
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !box.current) return;
    let t = 0, seen = false;
    const run = () => { clearInterval(t); if (seen && !document.hidden) t = window.setInterval(() => setN((x) => x + 1), 2600); };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; run(); });
    io.observe(box.current);
    document.addEventListener("visibilitychange", run);
    return () => { clearInterval(t); io.disconnect(); document.removeEventListener("visibilitychange", run); };
  }, []);

  const rows = [0, 1, 2, 3].map((k) => n - 1 - k).filter((i) => i >= 0);
  return (
    <div className="ticker" ref={box}>
      <p className="ticker-label mono">Illustrative · sandbox events, not live data</p>
      <ol className="ticker-list" aria-hidden="true">
        {rows.map((i, k) => {
          const e = EVENTS[i % EVENTS.length];
          return (
            <li key={i} className="tk mono" style={{ "--k": k } as React.CSSProperties}>
              <span className="tk-dot" />
              <span className="tk-k">{e.k}</span>
              <span className="tk-v">{e.v}</span>
              <span className="tk-s">{e.s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
