import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/Sections";
import { Band, Btn, DOCS, InnerHero, Intro, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { StaticForm } from "@/components/inner/StaticForm";
import { Reveal } from "@/lib/motion/Reveal";
import "./sandbox.css";

export const metadata: Metadata = { title: "Sandbox access — Yubit Pay" };

// Copy word for word from Figma "Developers / Sandbox Access / Desktop1440" (144:8879), in the .p2 palette.
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const FAQ = [
  { q: "Does the sandbox move real money?", a: "No. Use test data to explore workflows. Sandbox and Live use separate credentials; live access is subject to business onboarding and enabled capabilities." },
  { q: "What should I prepare for live access?" },
];
// The resources point at the matching sections of the docs page (the only docs frame in Figma).
const RESOURCES = [
  ["Getting Started", "Set up credentials, make an illustrative request and follow its outcome.", DOCS],
  ["Authentication", "Keep API keys on the server and separate Sandbox from Live.", `${DOCS}#authentication`],
  ["Webhooks", "Validate and persist events; make duplicate handling safe.", `${DOCS}#webhook-events`],
  ["Error codes", "Inspect a response before retrying the original operation.", `${DOCS}#errors-and-retries`],
];
const Notice = ({ t, children, className = "", r = "up" }: { t: string; children: React.ReactNode; className?: string; r?: string }) => (
  <div className={`p2-notice ${className}`} data-r={r || undefined}><p className="p2-notice-t">{t}</p><p className="p2-p14">{children}</p></div>
);
// Figma "Sandbox success example": the form's confirmation state, shown again as the static example below.
const Success = () => (
  <>
    <p className="p2-eb">SUCCESS / SAMPLE CONFIRMATION</p>
    <h3 className="p2-h24">✓ Your sandbox is ready.</h3>
    <p className="p2-p">Sample workspace: Aster Labs. Sandbox account activated instantly; live access subject to onboarding. This mockup has not created a real account.</p>
    <div className="p2-notice"><p className="p2-notice-t">Next: set up your credentials</p><p className="p2-p14">Open the sample workspace, create your server-side test key and follow Getting Started. Use synthetic payment details only.</p></div>
    <Btn href="#">Open sandbox workspace</Btn>
    <Btn href={DOCS} kind="edge">Read the docs</Btn>
  </>
);

/*
  /developers/sandbox. Hero: the title lines drop in and bounce · the form section covers the hero (desktop); its fields
  surface in order while the explanation and resources stay beside it (L7 sticky) · the two feedback examples play as a
  scrubbed sequence, validation first, and the three steps pop · the band grows out of the ivory · FAQ letters rise.
*/
export default function Page() {
  return (
    <main className="inner p2">
      <InnerHero
        load="drop" eyebrow="DEVELOPER SANDBOX" lines={["Test the workflow.", "Then build what’s next."]}
        sub="Request a sandbox workspace for Payouts, Collections and UPI. Explore the integration before your team plans Live access."
        actions={<><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="edge">Read the docs</Btn></>}
      />

      <section className="isec p2-sec" data-tone="light" aria-label="Tell us what you want to test.">
        <Intro eyebrow="REQUEST SANDBOX ACCESS" h="Tell us what you want to test." how="lines" sub="A little context helps us point you to the right stack. Use this environment to test your integration, not to move real money." />
        <div className="sb-row">
          <StaticForm
            className="p2-card sb-form" label="Request sandbox access" done={<Success />}
            after={<Notice t="Sandbox account activated instantly">Live access subject to onboarding. Test credentials and synthetic data stay separate from Live. Enabled capabilities are confirmed during onboarding.</Notice>}
          >
            <p className="p2-eb" data-r="up">YOUR WORKSPACE STARTS HERE</p>
            <h3 className="p2-h" data-r="up" style={i(1)}>Request access</h3>
            <p className="p2-p14" data-r="up" style={i(2)}>All fields marked * are required.</p>
            <div className="p2-field" data-r="up" style={i(3)}>
              <label className="p2-label" htmlFor="sb-name">Full name *</label>
              <input id="sb-name" className="p2-input" name="name" autoComplete="name" placeholder="Your name" required />
            </div>
            <div className="p2-field" data-r="up" style={i(4)}>
              <label className="p2-label" htmlFor="sb-email">Work email *</label>
              <input id="sb-email" className="p2-input" name="email" type="email" autoComplete="email" placeholder="you@company.example" required />
              <p className="p2-hint">Focused field · Example email placeholder</p>
              <p className="p2-hint p2-err">ⓘ Enter a complete work email address.</p>
            </div>
            <div className="p2-field" data-r="up" style={i(5)}>
              <label className="p2-label" htmlFor="sb-company">Company *</label>
              <input id="sb-company" className="p2-input" name="company" autoComplete="organization" placeholder="Company name" required />
            </div>
            <div className="p2-field" data-r="up" style={i(6)}>
              <label className="p2-label" htmlFor="sb-stack">Stack interest *</label>
              <select id="sb-stack" className="p2-input sb-select" name="stack" required defaultValue="">
                <option value="" disabled>Choose Payouts, Collections or UPI ⌄</option>
                <option>Payouts</option><option>Collections</option><option>UPI</option>
              </select>
            </div>
            <div className="p2-field" data-r="up" style={i(7)}>
              <label className="p2-label" htmlFor="sb-case">Your use case *</label>
              <textarea id="sb-case" className="p2-input" name="useCase" placeholder="Describe your payment flow, the users involved and what you want to test…" required />
            </div>
            <label className="p2-check" data-r="up" style={i(8)}>
              <input type="checkbox" name="consent" required />
              <span>I agree to the Terms of Use and acknowledge the Privacy Policy.</span>
            </label>
            <p className="p2-p14" data-r="up" style={i(9)}>Do not submit account credentials or real customer payment details. This is a static form example; it does not send data.</p>
            <Notice t="Request not submitted" className="form-fail" r="">Check the outlined field and try again. Your name, company and use case are retained.</Notice>
          </StaticForm>

          <div className="sb-aside">
            <div className="sb-env" data-r="right">
              <p className="p2-eb sb-lime">TEST FIRST. LAUNCH DELIBERATELY.</p>
              <h3 className="p2-h">A safe place to learn the flow.</h3>
              <p className="p2-p">Explore requests, response handling and callbacks without moving real money. Keep keys server-side, store useful references and test exceptions before launch.</p>
              <div className="sb-env-note"><p className="p2-notice-t">Sandbox ≠ Live</p><p className="p2-p14">Sandbox activation is for testing. Live money movement requires separate credentials, business onboarding and confirmation of available capabilities.</p></div>
            </div>
            <div className="p2-card" data-r="right" style={i(2)}>
              <p className="p2-eb">YOUR NEXT REFERENCE</p>
              <h3 className="p2-h">Start with the foundations.</h3>
              {RESOURCES.map(([t, d, href]) => (
                <Link key={t} className="sb-res" href={href}><span className="sb-res-t">{t} ↗</span><span className="p2-p14">{d}</span></Link>
              ))}
              <Btn href={DOCS} kind="edge">Open documentation</Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="isec p2-sec" data-tone="light" aria-label="Clear feedback at every step.">
        <Intro eyebrow="STATIC SUBMISSION EXAMPLES" h="Clear feedback at every step." how="sides" sub="Validation and confirmation are shown together for review. They are visual examples, not separate submissions or live interactions." />
        <div className="sb-examples" data-seq>
          <div className="p2-card" style={i(0)}>
            <p className="p2-eb">VALIDATION / NOT SUBMITTED</p>
            <h3 className="p2-h24">Review your work email.</h3>
            {/* a picture of the error state (Figma "Form input / Error"), not a live field */}
            <div className="p2-field">
              <p className="p2-label">Work email *</p>
              <p className="p2-input is-err">alex@</p>
              <p className="p2-hint">ⓘ Enter a complete work email address.</p>
            </div>
            <div className="p2-notice"><p className="p2-notice-t">Request not submitted</p><p className="p2-p14">Check the outlined field and try again. Your name, company and use case are retained.</p></div>
            <span className="btn btn-lime">Request sandbox access<Icon n="arrow-up-right-dark" w={18} /></span>
          </div>
          <div className="p2-card" style={i(1)}><Success /></div>
        </div>
        <ol className="sb-steps">
          {[["Set your API key", "Store it on the server, never in client code."], ["Test an operation", "Use test recipients and a traceable business reference."], ["Connect events", "Validate callbacks and review every final status."]].map(([t, d], n) => (
            <li key={t} className="p2-card sb-step" data-r="pop" style={i(n)}>
              <span className="mono sb-no">0{n + 1} →</span>
              <h3 className="p2-h24">{t}</h3>
              <p className="p2-p14">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="sb-wrap">
        <Band h="From a test request to your next release." sub="Start in the sandbox. Bring your team and your use case; plan the path to live access.">
          <Btn href={START}>Get Started</Btn>
          <Btn href={DOCS} kind="edge">Read the docs</Btn>
        </Band>
      </div>

      <section className="isec p2-sec ifaq sb-faq" data-tone="light" aria-label="Frequently asked questions">
        <Intro eyebrow="A LITTLE MORE CLARITY" h="Good questions. Clear answers." how="chars" />
        <Accordion items={FAQ} />
      </section>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
