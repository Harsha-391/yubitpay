import type { Metadata } from "next";
import { CtaBand } from "@/components/Sections";
import { ApiCard, Band, Btn, DOCS, InnerHero, Intro, ProductCard, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import { ROUTES } from "@/lib/ia";
import { BAND_SUB } from "@/lib/products";
import "../use-cases.css";
import "./marketplace.css";

export const metadata: Metadata = { title: "Marketplace — Yubit Pay" };

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const Step = ({ n, t, d, r }: { n: number; t: string; d: string; r?: string }) => (
  <li className="step-c" data-r={r} style={i(n)}>
    <span className="mono step-no">0{n + 1} <span className="step-arrow">→</span></span>
    <h3 className="uc-h3">{t}</h3>
    <p className="step-d14">{d}</p>
  </li>
);

const PATH = [
  ["Collect", "Buyer pays using an assigned virtual account or merchant UPI experience."],
  ["Match", "Link the collection event to order_208 and confirm receipt in your ledger."],
  ["Settle", "Create an eligible seller payout using settlement_208 as the business reference."],
  ["Review", "Track payout status, handle exceptions and retain the reconciliation record."],
];
const TEAMS = [
  ["For engineering", "Keep collection and payout events tied to stable product references."],
  ["For finance", "See what is matched, processing or needs investigation in one operational flow."],
  ["For sellers", "Reflect confirmed payout status instead of an ambiguous payment request."],
];

/*
  /use-cases/marketplace, copy word for word from Figma "Use Cases / Marketplace detail template / Desktop1440" (144:10266).
  Hero: title lines rise from masks · the ivory covers the hero (desktop) and its panels are dealt · the path plays as a
  scrubbed sequence, its notice surfacing after the last step · the two stacks arrive from opposite sides · the band grows
  out of the white · the team cards drop in · the implementation's request card rises and settles line by line while its
  panel slides in from the right. Neighbouring headings never share an entrance either.
*/
export default function Page() {
  return (
    <main className="inner">
      <InnerHero
        load="lines" eyebrow="USE CASE / MARKETPLACE" lines={["Connect the order.", "Complete the money flow."]}
        sub="Help buyers pay and sellers get paid. Keep incoming funds, settlements and exceptions connected to a single order reference."
        actions={<><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="edge">Read the docs</Btn></>}
      />

      <section className="isec uc" data-tone="light" aria-label="One structure. Four use cases.">
        <Intro
          eyebrow="SHARED DETAIL TEMPLATE" h="One structure. Four use cases." how="sides"
          sub="Shared detail template for Marketplace, Lending, Collections and Online Gaming. This fully populated marketplace example sets the structure for each: problem, solution, flow, stack, outcomes and implementation."
        />
        <div className="panels uc-panels">
          <article className="panel" data-r="deal" style={i(0)}>
            <h3 className="uc-h3">The operational gap</h3>
            <p className="ibody">Orders, receipts and seller payouts often sit in different systems. Finance sees money; your product sees orders. Refunds and unsettled balances need manual investigation.</p>
          </article>
          <article className="panel" data-r="deal" style={i(1)}>
            <h3 className="uc-h3">Bring the references together</h3>
            <p className="ibody">Assign customer payment details, map funds events to order IDs and create seller payouts with settlement references. Track each final status before closing the ledger entry.</p>
          </article>
        </div>
      </section>

      <section className="isec uc mk-path" data-tone="light" aria-label="A path from buyer to seller.">
        <Intro eyebrow="THE MARKETPLACE FLOW" h="A path from buyer to seller." how="lines" />
        <ol className="steps" data-seq>
          {PATH.map(([t, d], n) => <Step key={t} n={n} t={t} d={d} />)}
        </ol>
        <div className="mk-notice" data-r="up">
          <p className="mk-notice-t">Keep business rules in your product</p>
          <p className="step-d14">Settlement timing, seller eligibility and refund approvals are your business policies. Yubit Pay connects the payment operations; it does not define marketplace obligations.</p>
        </div>
      </section>

      <section className="isec uc" data-tone="light" aria-label="Two stacks. One shared context.">
        <Intro
          eyebrow="RECOMMENDED STACK" h="Two stacks. One shared context." how="chars"
          sub="Use Collections to identify incoming funds and Payouts to move approved seller settlements. Add the UPI stack when your checkout needs merchant UPI IDs or QR codes."
        />
        <div className="pcards">
          <ProductCard k="collections" flat r="left" />
          <ProductCard k="payouts" flat r="right" />
        </div>
        <p className="step-d14" data-r="up">Illustrative stack previews · Sample transaction data</p>
      </section>

      <div className="mk-wrap">
        <Band h="Build around your marketplace, not around the plumbing." sub={BAND_SUB}>
          <Btn href={START}>Get Started</Btn>
          <Btn href={ROUTES.contact} kind="edge">Contact sales</Btn>
        </Band>
      </div>

      <section className="isec uc" data-tone="light" aria-label="Clearer handoffs. Traceable decisions.">
        <Intro eyebrow="WHAT CHANGES FOR YOUR TEAM" h="Clearer handoffs. Traceable decisions." how="lines" />
        <ol className="steps uc-steps">
          {TEAMS.map(([t, d], n) => <Step key={t} n={n} t={t} d={d} r="drop" />)}
        </ol>
      </section>

      <section className="isec uc mk-impl" data-tone="dark" aria-label="Start with the seller settlement.">
        <Intro
          eyebrow="IMPLEMENTATION EXAMPLE" h="Start with the seller settlement." how="sides" dark
          sub="Illustrative request only. Confirm API fields, amount units and supported rails in the current documentation."
        />
        <div className="mk-row">
          <ApiCard
            reveal file="seller-settlement.sh" note="# Illustrative seller settlement" request="/v1/payouts"
            body={`{\n  "amount": 2500000,\n  "currency": "INR",\n  "mode": "IMPS",\n  "reference_id":\n    "settlement_208"\n}`}
            response={`{ "status": "processing" }`}
          />
          <article className="panel is-dark" data-r="right" style={i(2)}>
            <h3 className="uc-h3">Keep the event trail intact.</h3>
            <p className="ibody">Store the returned payment ID. Subscribe to payout events, validate each callback and query status when an outcome is unclear.</p>
            <p className="ibody">Do not automatically retry a transfer until its final state is known. Reconcile the confirmed result against your settlement reference.</p>
            <Btn href={START}>Get Started</Btn>
          </article>
        </div>
      </section>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
