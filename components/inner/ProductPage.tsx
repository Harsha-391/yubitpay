import { Accordion } from "@/components/Accordion";
import { CtaBand } from "@/components/Sections";
import { Reveal } from "@/lib/motion/Reveal";
import { BAND_SUB, FAQ, PRICING_NOTE, type Product } from "@/lib/products";
import { PageMotion } from "./PageMotion";
import { ApiCard, Band, Btn, DOCS, InnerHero, Intro, PriceTable, ProductCard, START } from "./Parts";

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/*
  Product page template (Payouts / Collections / UPI). Each section hands over differently:
  hero stays while the ivory page slides over it → steps arrive in sequence with scroll → panels are dealt →
  the dark band grows out of the ivory → table rows draw in order → the two product cards meet from opposite sides → FAQ letters rise.
*/
export function ProductPage({ p }: { p: Product }) {
  return (
    <main className="inner">
      <InnerHero eyebrow={p.hero.eyebrow} lines={p.hero.lines} sub={p.hero.sub} actions={<><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="line">Read the docs</Btn></>}>
        <ApiCard request={p.hero.request} body={p.hero.body} response={p.hero.response} />
      </InnerHero>

      <section className="isec" data-tone="light" aria-label={p.process.h}>
        <Intro eyebrow={p.process.eyebrow} h={p.process.h} sub={p.process.sub} how="lines" />
        <ol className="steps" data-seq>
          {p.process.steps.map((s, n) => (
            <li key={s.t} className="step-c" style={i(n)}>
              <span className="mono step-no">0{n + 1} <span className="step-arrow">→</span></span>
              <h3 className="ih3">{s.t}</h3>
              <p className="step-d14">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="isec" data-tone="light" aria-label={p.panels.h}>
        <Intro eyebrow={p.panels.eyebrow} h={p.panels.h} sub={p.panels.sub} how="sides" />
        <div className="panels">
          {p.panels.items.map((x, n) => (
            <article key={x.t} className="panel" data-r="deal" style={i(n)}>
              <h3 className="ih3">{x.t}</h3>
              <p className="ibody">{x.d}</p>
            </article>
          ))}
        </div>
      </section>

      <Band h={p.band.h} sub={BAND_SUB}><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="line">Read the docs</Btn></Band>

      <section className="isec" data-tone="light" aria-label={p.pricing.h}>
        <Intro eyebrow={p.pricing.eyebrow} h={p.pricing.h} how="lines" />
        <div className="pricing-b">
          <h3 className="ih3 ih3-lg" data-r="up">{p.pricing.name}</h3>
          <p className="step-d14" data-r="up" style={i(1)}>{p.pricing.sub}</p>
          {p.pricing.tables.map((t) => <PriceTable key={t.head[0]} t={t} />)}
          <p className="step-d14" data-r="up">{PRICING_NOTE}</p>
        </div>
        <div data-r="pop"><Btn href={START}>Get Started</Btn></div>
        <div data-r="pop" style={i(1)}><Btn href={p.pricing.second.href} kind="line">{p.pricing.second.label}</Btn></div>
      </section>

      <section className="isec" data-tone="light" aria-label={p.connected.h}>
        <Intro eyebrow={p.connected.eyebrow} h={p.connected.h} how="up" />
        <div className="pcards">
          <ProductCard k={p.connected.cards[0]} from="left" />
          <ProductCard k={p.connected.cards[1]} from="right" />
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
