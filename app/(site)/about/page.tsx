import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/Sections";
import { Band, Btn, DOCS, InnerHero, Intro, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import artAvif from "@/assets/img/about-sculpture-1216.avif";
import artWebp from "@/assets/img/about-sculpture-1216.webp";
import "./about.css";

export const metadata: Metadata = { title: "About — Yubit Pay" };

// Copy word for word from Figma "About / About / Desktop1440" (144:8465), in the .p2 palette.
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
// Text whose words light up with scroll (H7): one span per word.
const Fill = ({ className, children }: { className: string; children: string }) => (
  <p className={className}>{children.split(" ").map((w, k) => <span key={k} className="fw">{w} </span>)}</p>
);
const FACTS = [
  ["3", "API stacks", "Payouts, Collections and UPI. Modular building blocks for money movement."],
  ["4", "Transfer rails", "IMPS, NEFT, RTGS and UPI, subject to supported flows and availability."],
  ["1", "Shared approach", "Developer-first requests, traceable references and event-driven operations."],
];
const TRUST = [
  ["Control access deliberately", "Plan server-side key storage, appropriate operational access and credential rotation. Keep Sandbox and Live environments clearly separated."],
  ["Design for traceability", "Use references, event logs and status checks to make payment outcomes reviewable. Review data handling and retention before launch."],
  ["Onboard with context", "Discuss business eligibility, supported capabilities and applicable bank or regulatory requirements before enabling a live workflow."],
];

/*
  /about. Hero: the title's letters rise one after another · the ivory covers the hero (desktop); the mission text lights up
  word by word with scroll while the artwork rises · the three facts are dealt · the band grows out of the ivory · the two
  team panels arrive from opposite sides and the scope card surfaces · the trust panels drop in on the dark section · the
  brand mark pops.
*/
export default function Page() {
  return (
    <main className="inner p2">
      <InnerHero
        load="chars" eyebrow="BUILT FOR INDIA. BUILT FOR BUILDERS." lines={["Your ambition.", "A connected foundation."]}
        sub="We’re building developer-friendly financial infrastructure for Indian businesses. So teams can spend more time on their product and less time stitching payment workflows together."
        actions={<><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="edge">Explore the docs</Btn></>}
      />

      <section className="isec p2-sec" data-tone="light" aria-label="Good ideas shouldn’t get lost in the plumbing.">
        <Intro eyebrow="WHY WE EXIST" h="Good ideas shouldn’t get lost in the plumbing." how="lines" />
        <div className="ab-row">
          <div className="ab-story" data-fill>
            <h3 className="ih3 ih3-lg">Our mission</h3>
            <Fill className="p2-p">Make it simpler for businesses to connect payments, payouts and banking workflows to their products. Bring clear references, understandable states and useful events to the way money moves.</Fill>
            <h3 className="p2-h24">Who we are</h3>
            <Fill className="p2-p">Yubit Pay is a B2B fintech platform for developers, founders and finance teams building in India. We focus on the infrastructure between a product experience and its financial operations.</Fill>
            <Fill className="p2-p">From paying a partner to matching an incoming collection, our aim is a connected workflow—not another disconnected integration.</Fill>
          </div>
          <figure className="ab-art" data-r="up">
            <picture>
              <source type="image/avif" srcSet={artAvif.src} />
              <img src={artWebp.src} width={608} height={360} alt="" loading="lazy" decoding="async" />
            </picture>
            <figcaption className="p2-p14">One connected foundation for your financial workflows.</figcaption>
          </figure>
        </div>
      </section>

      <section className="isec p2-sec" data-tone="light" aria-label="A focused stack. More possibility.">
        <Intro eyebrow="THE PRODUCT, IN PERSPECTIVE" h="A focused stack. More possibility." how="sides" sub="Product facts, not adoption claims. Choose what your workflow needs and build from there." />
        <div className="ab-three">
          {FACTS.map(([v, t, d], n) => (
            <article key={t} className="p2-card" data-r="deal" style={i(n)}>
              <p className="ab-fact">{v}</p>
              <h3 className="p2-h24">{t}</h3>
              <p className="p2-p14">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="ab-wrap">
        <Band h="Build your next financial experience with us." sub="Start in the sandbox. Bring your team and your use case; plan the path to live access.">
          <Btn href={START}>Get Started</Btn>
          <Btn href={DOCS} kind="edge">Read the docs</Btn>
        </Band>
      </div>

      <section className="isec p2-sec" data-tone="light" aria-label="Built for both sides of the handoff.">
        <Intro eyebrow="WHY YUBIT PAY" h="Built for both sides of the handoff." how="up" sub="Engineering and operations should not have to piece together two different stories about the same payment." />
        <div className="ab-two">
          <article className="p2-card" data-r="left">
            <p className="p2-eb">FOR THE TEAM THAT BUILDS</p>
            <h3 className="p2-h">Less stitching. More shipping.</h3>
            <p className="p2-p">Use modular APIs and a sandbox-first workflow. Keep implementation context alongside the payment reference, not buried in a spreadsheet.</p>
            <p className="p2-p14">Start with one stack. Test responses and exceptions. Connect callbacks before you plan launch.</p>
          </article>
          <article className="p2-card" data-r="right">
            <p className="p2-eb">FOR THE TEAM THAT OPERATES</p>
            <h3 className="p2-h">Follow the money. Keep the context.</h3>
            <p className="p2-p">Follow statuses, review exceptions and reconcile incoming and outgoing money. Give finance and engineering a common language.</p>
            <p className="p2-p14">Connect each business operation to its reference, its events and its final outcome.</p>
          </article>
        </div>
        <div className="p2-card" data-r="up">
          <h3 className="p2-h24">Three stacks. Practical building blocks.</h3>
          <div className="ab-three ab-scope">
            {[["Payouts", "Send to bank accounts or UPI IDs. Follow transfers with status checks."], ["Collections", "Create unique virtual accounts per customer and receive funds alerts."], ["UPI", "Create merchant UPI IDs and QR codes; connect payment callbacks."]].map(([t, d]) => (
              <div key={t} className="ab-stack"><h4 className="ab-stack-t">{t}</h4><p className="p2-p14">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="isec ab-trust" data-tone="dark" aria-label="Trust comes from the details.">
        <Intro eyebrow="SECURITY AND RESPONSIBILITY" h="Trust comes from the details." how="chars" dark sub="Security is an implementation discipline. Our approach starts with deliberate access, traceable operations and the requirements of your workflow." />
        <div className="ab-three">
          {TRUST.map(([t, d], n) => (
            <article key={t} className="ab-panel" data-r="drop" style={i(n)}>
              <h3 className="p2-h24">{t}</h3>
              <p className="p2-p">{d}</p>
            </article>
          ))}
        </div>
        <div className="ab-note" data-r="up">
          <p className="p2-notice-t">An approach, not a certification claim</p>
          <p className="p2-p14">These principles describe how to plan an integration. No certification, regulatory approval or independently verified security guarantee is asserted here. Confirm relevant controls and responsibilities during onboarding.</p>
        </div>
        <div data-r="pop"><Btn href={START}>Get Started</Btn></div>
      </section>

      <section className="isec p2-sec" data-tone="light" aria-label="One identity. Across every workflow.">
        <Intro eyebrow="CONSISTENCY CHECK" h="One identity. Across every workflow." how="lines" />
        <p className="brand ab-brand" data-r="pop"><span className="brand-sym"><Icon n="waypoints" w={23} /></span>yubit pay</p>
        <p className="p2-p14" data-r="up">Home components reused: navbar, primary and secondary buttons, FAQ, CTA band, footer, code block and brand. Forest, lime and ivory; DM Sans and IBM Plex Mono; the same borders, radii and section rhythm. New patterns: documentation navigation, search, language review panels and sandbox form fields. All states are static, with no prototype wiring.</p>
      </section>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
