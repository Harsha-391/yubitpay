import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { CtaBand } from "@/components/Sections";
import { Band, Btn, InnerHero, Intro, PriceTable, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import { ROUTES } from "@/lib/ia";
import { BAND_SUB, PRICING_NOTE, type Table } from "@/lib/products";
import "./pricing.css";

export const metadata: Metadata = { title: "Pricing — Yubit Pay" };

// Copy word for word from Figma "Pricing / Pricing / Desktop1440" (144:9868). Every rate is the Figma placeholder.
const V = "[YOUR PRICING VALUES]";
const SLABS: Table = { head: ["Amount / schedule", "IMPS", "UPI"], rows: [["Up to ₹1,000", V, V], ["₹1,001–₹25,000", V, V], ["₹25,001–₹2,00,000", V, V], ["Above ₹2,00,000 • eligible rails", V, V]] };
const SCHEDULES: Table = { head: ["Transfer rail", "Schedule", "Rate"], rows: [["NEFT", "In banking hours", V], ["NEFT", "Outside banking hours", V], ["RTGS", "In banking hours", V], ["RTGS", "Outside banking hours", V]] };
const COLLECTIONS: Table = { head: ["Operation", "Rate"], rows: [["Create virtual account", V], ["Collections to virtual account", V], ["Verify bank details", V]] };
const UPI: Table = { head: ["Operation", "Rate"], rows: [["Create UPI ID", V], ["Collections to UPI ID", V], ["UPI verification", V]] };
const OPS_SUB = "Operation-based pricing. Your commercial terms are confirmed before live access.";
const FAQ = [
  { q: "How is pricing confirmed?", a: "Rates are placeholders until your commercial terms are confirmed. Contact our team to discuss your stacks, expected volume and applicable GST." },
  { q: "Is GST included?" },
  { q: "Can we discuss volume-based pricing?" },
  { q: "What happens during onboarding?" },
];

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
type Id = "payouts" | "collections" | "upi";
const TABS: [Id, string][] = [["payouts", "Payouts"], ["collections", "Collections"], ["upi", "UPI"]];

// Figma draws each tab's content as its own section, each with the tab list showing that tab selected; the tabs jump between them.
function Tabs({ on, r }: { on: Id; r: string }) {
  return (
    <nav className="pr-tabs" aria-label="Pricing by product" data-r={r}>
      {TABS.map(([id, t], n) => (
        <a key={id} className="pr-tab" href={`#pricing-${id}`} aria-current={id === on ? "true" : undefined} style={i(n)}>{t}</a>
      ))}
    </nav>
  );
}
function State({ name, sub, children }: { name: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="pr-state">
      <h3 className="ih3 ih3-lg" data-r="up">{name}</h3>
      <p className="step-d14" data-r="up" style={i(1)}>{sub}</p>
      {children}
      <p className="step-d14" data-r="up">{PRICING_NOTE}</p>
    </div>
  );
}

/*
  /pricing. Hero: the title lines arrive from opposite edges · the Payouts state covers the hero (desktop), its table rows rise
  in order while their rules draw · the band grows out of the white · Collections: letters rise, tabs drop, the table slides in
  whole from the right · UPI: heading and sub-line from opposite sides, tabs pop, rows rise in order · the conversation section's
  heading lines rise and its buttons pop · FAQ letters rise and its items arrive from the right.
*/
export default function Page() {
  return (
    <main className="inner">
      <InnerHero
        load="sides" eyebrow="CLEAR COMMERCIAL FOUNDATIONS" lines={["Pick your stack.", "Plan your next step."]}
        sub="Explore the pricing structure for payouts, collections and UPI. Talk to our team to confirm rates for your business and volume."
        actions={<><Btn href={START}>Get Started</Btn><Btn href={ROUTES.contact} kind="edge">Contact sales</Btn></>}
      />

      <section id="pricing-payouts" className="isec uc pr" data-tone="light" aria-label="The details, without the guesswork.">
        <Intro
          eyebrow="ALL THREE PRICING STATES" h="The details, without the guesswork." how="lines"
          sub="All tab contents are shown below as separate static state panels. Amount slabs and schedules are illustrative; rates remain unconfirmed."
        />
        <div className="pr-notice" data-r="up">
          <p className="pr-notice-t">Pricing values awaiting confirmation</p>
          <p className="step-d14">Every rate is intentionally shown as [YOUR PRICING VALUES]. No published price or numeric rate is implied.</p>
        </div>
        <Tabs on="payouts" r="up" />
        <State name="Payouts" sub="Illustrative slab structure. Confirm eligible amount limits and banking-hour schedules during onboarding. Pricing fields are not availability guarantees.">
          <PriceTable t={SLABS} r="rows" />
          <div className="pr-sched">
            <h4 className="uc-h3" data-r="up">NEFT &amp; RTGS schedules</h4>
            <PriceTable t={SCHEDULES} r="rows" />
          </div>
        </State>
      </section>

      <div className="pr-wrap">
        <Band h="More volume? Let’s plan together." sub={BAND_SUB}>
          <Btn href={START}>Get Started</Btn>
          <Btn href={ROUTES.contact} kind="edge">Contact sales</Btn>
        </Band>
      </div>

      <section id="pricing-collections" className="isec uc pr" data-tone="light" aria-label="Incoming money, clearly priced.">
        <Intro eyebrow="TAB STATE / COLLECTIONS" h="Incoming money, clearly priced." how="chars" />
        <Tabs on="collections" r="drop" />
        <State name="Collections" sub={OPS_SUB}><PriceTable t={COLLECTIONS} r="right" /></State>
      </section>

      <section id="pricing-upi" className="isec uc pr" data-tone="light" aria-label="Price every UPI operation.">
        <Intro eyebrow="TAB STATE / UPI" h="Price every UPI operation." how="sides" />
        <Tabs on="upi" r="pop" />
        <State name="UPI" sub={OPS_SUB}><PriceTable t={UPI} r="rows" /></State>
      </section>

      <section className="isec uc" data-tone="light" aria-label="Your workflow deserves a conversation.">
        <Intro
          eyebrow="VOLUME-BASED PRICING" h="Your workflow deserves a conversation." how="lines"
          sub="Tell us your expected monthly transaction volume, typical amounts and required stacks. We’ll help confirm applicable slabs, schedules, GST and onboarding requirements."
        />
        <div className="ihero-actions" data-r="pop" style={i(3)}>
          <Btn href={START}>Get Started</Btn>
          <Btn href={ROUTES.contact} kind="edge">Contact sales</Btn>
        </div>
      </section>

      <section className="isec uc ifaq" data-tone="light" aria-label="Frequently asked questions">
        <Intro eyebrow="A LITTLE MORE CLARITY" h="Good questions. Clear answers." how="chars" />
        <Accordion items={FAQ} />
      </section>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
