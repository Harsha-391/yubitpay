import { Fragment } from "react";
import { Accordion, type QA } from "./Accordion";
import { CodeCard } from "./CodeCard";
import { Icon } from "./Icon";
import { Chars, Outro } from "./Scenes";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

const benefits = ["Consistent request and response patterns", "Webhooks that keep your product in sync", "A sandbox to test before you go live"];
const steps = [
  { n: "01", t: "Explore the stack", d: "Find the APIs that fit your product." },
  { n: "02", t: "Build and test", d: "Connect your workflows in the sandbox." },
  { n: "03", t: "Bring it to life", d: "Work with our team to get launch-ready." },
];
// Only the first answer is in the Figma; the other three are assembled from copy already on the page — replace with real answers.
const faqs: QA[] = [
  { q: "What can I build with Yubit Pay?", a: "Use our APIs to collect payments, send payouts and connect banking workflows to your product. Start with one use case and add more as your business grows." },
  { q: "Who is Yubit Pay built for?", a: "Startups and fintechs, platforms and marketplaces, and SaaS and tech companies that want to embed collections, payouts and open banking into their product." },
  { q: "Can I test the APIs before going live?", a: "Yes. Connect your workflows in the sandbox and test them before you go live." },
  { q: "How do I get started with pricing and onboarding?", a: "Talk to our team. We’ll help you find the APIs that fit your product and get launch-ready." },
];
const footerCols = [
  { h: "Platform", l: ["Collections", "Payouts", "Open banking"] },
  { h: "Developers", l: ["API documentation", "API reference", "Get started"] },
  { h: "Company", l: ["About Yubit Pay", "Contact us", "Talk to sales"] },
];

// Heading words fill in with scroll: opacity comes from the panel's --enter (set by Flow.tsx), so the line reads as it rises.
export function Words({ lines, className }: { lines: string[]; className: string }) {
  let w = 0;
  const n = lines.join(" ").split(" ").length;
  return (
    <h2 className={`${className} words`} style={{ "--n": n } as React.CSSProperties}>
      {lines.map((l, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {l.split(" ").map((word, k) => (
            <span key={k} className="w" style={{ "--w": w++ } as React.CSSProperties}>{word} </span>
          ))}
        </Fragment>
      ))}
    </h2>
  );
}

const Roll = ({ children }: { children: string }) => (
  <span className="roll" data-text={children}>
    <span>{children}</span>
  </span>
);

export function DeveloperExperience() {
  return (
    // the dark frame grows out of the lime tape above it (Flow.tsx scales .frame by scroll)
    <div className="frame-wrap" data-tone="light">
    <section className="sec dev frame" id="dev" aria-label="Developer experience" data-spot data-tone="dark">
      <div className="dev-intro">
        <div className="dev-story">
          <p className="eyebrow" data-r="up">LESS FRICTION. MORE SHIPPING.</p>
          <div className="stack18">
            <h2 className="h2 lines" data-r="lines">
              <span className="ln"><span>Built for the way</span></span>
              <span className="ln"><span>you build.</span></span>
            </h2>
            <p className="lead" data-r="right">Your team shouldn’t have to become banking experts to build a great financial product. Work with clear APIs, predictable responses and event-driven workflows.</p>
          </div>
          <ul className="benefits">
            {benefits.map((b, n) => (
              <li key={b} className="benefit" data-r="up" style={i(n)}>
                <Icon n="check" w={17} />
                {b}
              </li>
            ))}
          </ul>
          <a className="btn btn-ghost btn-docs" href="#" data-r="pop">
            Read the docs
            <Icon n="arrow-up-right-docs" w={18} />
          </a>
        </div>
        <CodeCard />
      </div>
      <ol className="journey" id="journey">
        <li className="journey-bar" aria-hidden="true"><i id="journey-fill" /></li>
        {steps.map((s, n) => (
          <li key={s.n} className="step" data-r="up" style={i(n)}>
            <span className="mono lime step-n">{s.n}</span>
            <div className="step-d">
              <p className="step-t">{s.t}</p>
              <p className="step-p">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
    </div>
  );
}

export function Faq() {
  return (
    <section className="sec faq" aria-label="Frequently asked questions" data-tone="light">
      <div className="faq-intro">
        <p className="eyebrow dark" data-r="up">A LITTLE MORE CLARITY</p>
        <Chars className="h2 ink" lines={["Good questions.", "Clear answers."]} />
        <p className="faq-more" data-r="up" style={i(1)}>Have something else in mind?</p>
        <a className="faq-link" href="#" data-r="up" style={i(2)}>
          Let’s talk about your use case
          <Icon n="arrow-up-right-faq" w={18} />
        </a>
      </div>
      <Accordion items={faqs} />
    </section>
  );
}

export function Closing() {
  return (
    <div className="closing" data-tone="dark">
      <section className="cta-wrap sec" aria-label="Build with Yubit Pay">
        <div className="cta" data-r="up" data-spot data-tilt>
          <Icon n="conversion-glow" w={600} className="cta-glow" />
          <div className="cta-copy">
            <p className="eyebrow">BUILD WHAT’S NEXT</p>
            <h2 className="cta-h" data-r="blur">Big ideas deserve<br />a better foundation.</h2>
            <p className="cta-p">Let’s build your next financial experience, together.</p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-lime btn-cta" href="#" data-r="pop" data-magnet>
              Talk to our team
              <Icon n="arrow-up-right-cta" w={18} />
            </a>
            <a className="cta-doc" href="#">Or explore the documentation ↗</a>
          </div>
        </div>
      </section>
      <footer className="sec foot">
        <div className="foot-nav">
          <div className="foot-brand" data-r="up">
            <a className="brand" href="#">
              <span className="brand-sym"><Icon n="waypoints" w={23} /></span>
              yubit pay
            </a>
            <p className="foot-about">Financial infrastructure for the next generation of Indian businesses.</p>
            <p className="foot-tag">Built for India. Open to possibility.</p>
          </div>
          {footerCols.map((c, n) => (
            <nav key={c.h} className="foot-col" aria-label={c.h} data-r="up" style={i(n + 1)}>
              <p className="foot-h">{c.h}</p>
              {c.l.map((l) => (
                <a key={l} href="#"><Roll>{l}</Roll></a>
              ))}
            </nav>
          ))}
        </div>
        <div className="legal">
          <p>© 2026 Yubit Pay. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </div>
          <p>India · English</p>
        </div>
        <Outro />
      </footer>
    </div>
  );
}
