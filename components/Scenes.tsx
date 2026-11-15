import { Fragment } from "react";
import { Words } from "./Sections";
import { TrackCard } from "./TrackCard";
import { YMark } from "./YMark";

export { YMark };

const vars = (o: Record<string, number>) => o as unknown as React.CSSProperties;

// Letters that rise one by one when revealed (FAQ heading). Each line keeps its words together.
export function Chars({ lines, className }: { lines: string[]; className: string }) {
  let c = 0;
  return (
    <h2 className={`${className} chars`} data-r="chars" aria-label={lines.join(" ")}>
      {lines.map((l, li) => (
        <span key={li} className="cl-line" aria-hidden="true">
          {[...l].map((ch, k) => (
            <span key={k} className="ch" style={vars({ "--c": c++ })}>{ch === " " ? " " : ch}</span>
          ))}
        </span>
      ))}
    </h2>
  );
}

/* Statement — the hero sub-line as one big sentence, lit word by word while pinned (gokiwi "everyday more" / Loopsii intro).
   It is also the only panel that slides OVER the previous scene (the finished product cards). */
const STATEMENT: [string, boolean][] = [
  ["Connect", false], ["payments,", true], ["payouts", true], ["and", false], ["open", true], ["banking", true], ["with", false],
  ["developer-friendly", false], ["APIs.", false], ["Less", false], ["complexity.", false], ["More", true], ["possibility.", true],
];
export function Statement() {
  return (
    <section className="statement" id="statement" data-tone="dark" aria-label="What Yubit Pay does">
      <div className="statement-pin" data-p data-idle style={vars({ "--n": STATEMENT.length })}>
        <YMark className="statement-y" />
        <p className="statement-text">
          {STATEMENT.map(([w, hi], i) => (
            <Fragment key={i}>
              <span className={hi ? "w hi" : "w"} style={vars({ "--w": i })}>{w}</span>{" "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}

/* Banner — a tilted lime tape crossing the page. Rows drift on their own, travel with scroll and lean with scroll speed (Flow.tsx). */
const TERMS = ["Collections", "Payouts", "Open banking", "UPI", "Virtual accounts", "IMPS · NEFT · RTGS", "Real-time webhooks", "RESTful APIs"];
function Row({ rev }: { rev?: boolean }) {
  const list = rev ? [...TERMS].reverse() : TERMS;
  return (
    <div className={rev ? "mq-row rev" : "mq-row"} data-dir={rev ? 1 : -1}>
      <div className="mq-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="mq-set" aria-hidden={copy === 1}>
            {list.map((t) => (
              <Fragment key={t}>
                <span className="mq-item">{t}</span>
                <svg className="mq-tri" viewBox="0 0 10 9" aria-hidden="true"><path d="M5 0 L10 9 L0 9 Z" fill="currentColor" /></svg>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export function Banner() {
  return (
    <section className="banner" data-tone="light" aria-label="APIs">
      <div className="tape">
        <Row />
        <Row rev />
      </div>
    </section>
  );
}

/* Solutions — a pinned horizontal track: scrolling down slides the cards sideways (gokiwi rewards carousel / Loopsii pinned demo). */
const SOLUTIONS = [
  { icon: "rocket", t: "Startups & fintechs", d: "Embed collections and payouts into the product you’re building.", cls: "tc-1" },
  { icon: "store", t: "Platforms & marketplaces", d: "Connect incoming payments with vendor and partner settlements.", cls: "tc-2" },
  { icon: "blocks", t: "SaaS & tech companies", d: "Automate financial operations without adding operational overhead.", cls: "tc-3" },
];
export function SolutionsTrack() {
  return (
    <section className="tracks" id="tracks" data-tone="dark" aria-label="Solutions">
      <div className="tracks-pin" data-spot>
        <div className="track" id="track">
          <div className="tcard tc-intro">
            <p className="eyebrow">YOUR VISION. OUR FOUNDATION.</p>
            <Words className="h2" lines={["Different products.", "Shared possibilities."]} />
            <p className="lead">From a first release to your next stage of growth, build financial workflows around your business—not the other way around.</p>
          </div>
          {SOLUTIONS.map((s, i) => <TrackCard key={s.t} n={i + 1} icon={s.icon} t={s.t} d={s.d} cls={s.cls} />)}
        </div>
        <div className="track-bar" aria-hidden="true"><i id="track-fill" /></div>
      </div>
    </section>
  );
}

/* Outro — the whole wordmark, huge; it rises into place with the last bit of scroll (Flow.tsx). */
export function Outro() {
  return (
    <div className="outro" aria-hidden="true">
      <svg viewBox="0 0 100 47" id="outro-mark"><use href="#logo" width="100" height="47" /></svg>
    </div>
  );
}
