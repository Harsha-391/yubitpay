import type { Metadata } from "next";
import { CtaBand } from "@/components/Sections";
import { Band, Btn, InnerHero, Intro, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import { ROUTES } from "@/lib/ia";
import "./use-cases.css";

export const metadata: Metadata = { title: "Use cases — Yubit Pay" };

// Copy word for word from Figma "Use Cases / Overview / Desktop1440" (144:10678).
type Case = {
  id: string; dark?: boolean; eyebrow: string; h: string; sub: string; cta: string;
  panels: [string, string][]; steps: [string, string][];
  // each section enters its own way (neighbours never share one); see docs/pages.md
  how: { intro: "lines" | "chars" | "sides"; panels: "deal" | "sides" | "up"; steps: "seq" | "drop"; actions: "pop" | "up" };
};
const CASES: Case[] = [
  {
    id: "marketplace", eyebrow: "USE CASE / MARKETPLACE", h: "Marketplace", cta: "Discuss marketplace",
    sub: "Keep collections, refunds and vendor settlements connected to the order lifecycle.",
    panels: [["The problem", "Incoming customer payments and seller settlements live in separate tools. Your team is left matching references by hand."], ["The connected solution", "Use virtual accounts or UPI to identify receipts, then send seller payouts with a shared order reference."]],
    steps: [["Buyer pays", "Assign payment details and attach the customer or order reference."], ["Match the order", "Map the incoming funds event to the order in your ledger."], ["Settle the seller", "Create the seller payout and track its final status."]],
    how: { intro: "lines", panels: "deal", steps: "seq", actions: "pop" },
  },
  {
    id: "lending", dark: true, eyebrow: "USE CASE / LENDING", h: "Lending", cta: "Discuss lending",
    sub: "Keep payment operations traceable. Lending decisions and regulatory obligations remain with your business.",
    panels: [["The problem", "Disbursements and repayments need a clear trail. Ambiguous recipient details and unmatched receipts create operational work."], ["The connected solution", "Verify bank details, send eligible disbursements and map repayment virtual accounts to each borrower reference."]],
    steps: [["Verify borrower", "Check the bank details for an approved borrower reference."], ["Disburse funds", "Send the eligible payout and retain the payment ID and status."], ["Match repayment", "Use the assigned virtual account to reconcile each receipt."]],
    how: { intro: "chars", panels: "sides", steps: "drop", actions: "up" },
  },
  {
    id: "collections", eyebrow: "USE CASE / COLLECTIONS", h: "Collections", cta: "Discuss collections",
    sub: "Give your team a consistent view of matched, duplicate and unmatched incoming payments.",
    panels: [["The problem", "Shared bank details make it difficult to tell who paid. Receipts arrive before your ledger catches up."], ["The connected solution", "Create customer-specific virtual accounts and process funds alerts using customer and payment references."]],
    steps: [["Assign account", "Create unique payment details for each customer reference."], ["Receive funds", "Process a funds alert for incoming UPI, NEFT, IMPS or RTGS."], ["Reconcile ledger", "Match receipts and flag duplicates or exceptions for review."]],
    how: { intro: "sides", panels: "up", steps: "seq", actions: "pop" },
  },
  {
    id: "online-gaming", dark: true, eyebrow: "USE CASE / ONLINE GAMING", h: "Online Gaming", cta: "Discuss online gaming",
    sub: "Keep payment state separate from game state. Eligibility, user verification and responsible-use controls need business review.",
    panels: [["The problem", "Eligible platforms need to connect player payments and withdrawals without losing transaction context."], ["The connected solution", "Use UPI or virtual accounts for collections and payouts for approved withdrawal flows, subject to onboarding and applicable requirements."]],
    steps: [["Identify payment", "Associate the collection event with a verified player reference."], ["Review withdrawal", "Apply eligibility, approval and responsible-use controls in your product."], ["Send and track", "Create an approved payout and reflect its confirmed status."]],
    how: { intro: "lines", panels: "deal", steps: "drop", actions: "up" },
  },
];

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

// Figma skins: the panels are dark except on Collections; the flow steps are light except on Marketplace.
function UseCase({ c }: { c: Case }) {
  return (
    <section id={c.id} className="isec uc" data-tone={c.dark ? "dark" : "light"} aria-label={c.h}>
      <Intro eyebrow={c.eyebrow} h={c.h} sub={c.sub} how={c.how.intro} dark={c.dark} />
      <div className="panels uc-panels">
        {c.panels.map(([t, d], n) => (
          <article key={t} className={c.id === "collections" ? "panel" : "panel is-dark"} data-r={c.how.panels === "sides" ? (n ? "right" : "left") : c.how.panels} style={i(n)}>
            <h3 className="uc-h3">{t}</h3>
            <p className="ibody">{d}</p>
          </article>
        ))}
      </div>
      <ol className="steps uc-steps" data-seq={c.how.steps === "seq" || undefined}>
        {c.steps.map(([t, d], n) => (
          <li key={t} className={c.id === "marketplace" ? "step-c is-dark" : "step-c"} data-r={c.how.steps === "drop" ? "drop" : undefined} style={i(n)}>
            <span className="mono step-no">0{n + 1} <span className="step-arrow">→</span></span>
            <h3 className="uc-h3">{t}</h3>
            <p className="step-d14">{d}</p>
          </li>
        ))}
      </ol>
      <div className="ihero-actions" data-r={c.how.actions} style={i(2)}>
        <Btn href={START}>Get Started</Btn>
        <Btn href={ROUTES.contact} kind="edge">{c.cta}</Btn>
      </div>
    </section>
  );
}

/*
  /use-cases: hero (words fill) → the four use cases and the band are one L6 stack on desktop: each holds once it has been
  seen whole and the next slides over it; the band in the middle grows instead (H8). Inside, every section's heading, panels,
  steps and buttons enter differently from its neighbours'.
*/
export default function Page() {
  return (
    <main className="inner">
      <InnerHero
        load="words" eyebrow="YOUR VISION. OUR FOUNDATION." lines={["Different products.", "Connected possibilities."]}
        sub="Bring collections, payouts and UPI into the workflows your business actually runs. Choose the stack. Keep the context."
        actions={<><Btn href={START}>Get Started</Btn><Btn href="#" kind="edge">Explore the stacks</Btn></>}
      />
      <div className="uc-stack" data-stack>
        <UseCase c={CASES[0]} />
        <UseCase c={CASES[1]} />
        <Band h="Your use case doesn’t fit a box? Good." sub="Start in the sandbox. Bring your team and your use case; we’ll help you plan the path to live access.">
          <Btn href={START}>Get Started</Btn>
          <Btn href={ROUTES.contact} kind="edge">Contact sales</Btn>
        </Band>
        <UseCase c={CASES[2]} />
        <UseCase c={CASES[3]} />
      </div>
      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
