import { Accordion } from "@/components/Accordion";
import { CtaBand } from "@/components/Sections";
import { Reveal } from "@/lib/motion/Reveal";
import { BAND_SUB, FAQ, PRICING_NOTE, type Product } from "@/lib/products";
import { PageMotion } from "./PageMotion";
import { ApiCard, Band, Btn, DOCS, InnerHero, Intro, PriceTable, ProductCard, START } from "./Parts";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/*
  Product page template (Payouts / Collections / UPI), choreographed by "Yubit Pay Products Pages Motion Direction.pdf":
  §1 hero (two-handed heading, popping buttons, rising preview) · §2 the four steps are a held deck that scroll deals out ·
  §3 the bento assembles from two directions · §4 the CTA band with the cursor-aware triangle · §5 the pricing plan arrives
  as one card · §6 the two product cards cross on parabolic arcs. FAQ, closing band and footer keep their existing motion
  (the brief's §7–9 are placeholders).
*/
export function ProductPage({ p }: { p: Product }) {
  return (
    <main className="inner">
      <InnerHero eyebrow={p.hero.eyebrow} lines={p.hero.lines} sub={p.hero.sub} actions={<><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="line">Read the docs</Btn></>}>
        <ApiCard request={p.hero.request} body={p.hero.body} response={p.hero.response} />
      </InnerHero>

      {/* §2: a held deck; PageMotion [data-deck] deals the cards to their slots as the section scrolls (pinned on desktop) */}
      <section className="deck-sec" data-deck data-tone="light" aria-label={p.process.h}>
        <div className="isec deck-stage">
          <Intro eyebrow={p.process.eyebrow} h={p.process.h} sub={p.process.sub} how="lines" />
          <ol className="steps">
            {p.process.steps.map((s, n) => (
              <li key={s.t} className="step-c" style={i(n)}>
                <span className="mono step-no">0{n + 1} <span className="step-arrow">→</span></span>
                <h3 className="ih3">{s.t}</h3>
                <p className="step-d14">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* §3: left column falls from above, right column rises from below; they land together, then their copy surfaces */}
      <section className="isec bento-sec" data-tone="light" aria-label={p.panels.h}>
        <Intro eyebrow={p.panels.eyebrow} h={p.panels.h} sub={p.panels.sub} how="sides" />
        <div className="panels" data-r="bento">
          {p.panels.items.map((x) => (
            <article key={x.t} className="panel">
              <h3 className="ih3">{x.t}</h3>
              <p className="ibody">{x.d}</p>
            </article>
          ))}
        </div>
      </section>

      <Band tri h={p.band.h} sub={BAND_SUB}><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="line">Read the docs</Btn></Band>

      {/* §5: one plan card slides up from below the section, already complete; a shimmer once it rests; rows light on hover */}
      <section className="isec plan-sec" data-tone="light" aria-label={p.pricing.h}>
        <Intro eyebrow={p.pricing.eyebrow} h={p.pricing.h} how="lines" />
        <div className="plan-wrap" data-r="plan">
          <div className="plan">
            <h3 className="ih3 ih3-lg">{p.pricing.name}</h3>
            <p className="step-d14">{p.pricing.sub}</p>
            {p.pricing.tables.map((t) => <PriceTable key={t.head[0]} t={t} />)}
            <p className="step-d14">{PRICING_NOTE}</p>
            <div className="plan-cta">
              <span className="plan-go"><Btn href={START}>Get Started</Btn></span>
              <Btn href={p.pricing.second.href} kind="line">{p.pricing.second.label}</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* §6: each card is thrown from the opposite edge; the arcs cross mid-screen, then figure → detail → label surface */}
      <section className="isec arc-sec" data-tone="light" aria-label={p.connected.h}>
        <Intro eyebrow={p.connected.eyebrow} h={p.connected.h} how="up" />
        <div className="pcards" data-r="arc">
          <ProductCard k={p.connected.cards[0]} />
          <ProductCard k={p.connected.cards[1]} />
        </div>
      </section>

      <section className="isec ifaq" data-tone="light" aria-label="Frequently asked questions">
        <Intro eyebrow="A LITTLE MORE CLARITY" h="Good questions. Clear answers." how="chars" />
        <Accordion items={FAQ} />
      </section>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
