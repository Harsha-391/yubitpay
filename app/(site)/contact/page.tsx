import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/Sections";
import { Band, Btn, DOCS, InnerHero, Intro, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { StaticForm } from "@/components/inner/StaticForm";
import { Reveal } from "@/lib/motion/Reveal";
import "./contact.css";

export const metadata: Metadata = { title: "Contact — Yubit Pay" };

// Copy word for word from Figma "Contact / Contact / Desktop 1440" (144:8118), in the .p2 palette.
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const Field = ({ id, label, n, children }: { id: string; label: string; n: number; children: React.ReactNode }) => (
  <div className="p2-field" data-r="up" style={i(n)}>
    <label className="p2-label" htmlFor={id}>{label}</label>
    {children}
  </div>
);

/*
  /contact. Hero: each title line settles into place from slightly larger · the form section covers the hero (desktop);
  heading letters rise, the form's fields surface in order and the contact channels arrive from the right · the band grows
  out of the ivory. A valid submit opens /contact/success (Figma's own confirmation page); nothing is sent.
*/
export default function Page() {
  return (
    <main className="inner p2">
      <InnerHero
        load="zoom" eyebrow="LET’S BUILD TOGETHER" lines={["Tell us the idea.", "We’ll talk infrastructure."]}
        sub="Exploring APIs, planning payment operations or looking for a custom financial application? Tell us what your team needs."
        actions={<><Btn href={START}>Get Started</Btn><Btn href={DOCS} kind="edge">Developer resources</Btn></>}
      />

      <section className="isec p2-sec" data-tone="light" aria-label="What are you building?">
        <Intro eyebrow="START A CONVERSATION" h="What are you building?" how="chars" />
        <div className="ct-row">
          <StaticForm
            className="p2-card ct-form" label="Submit request" go="/contact/success"
            after={<p className="p2-p14">We’ll use these details to respond to your enquiry. Never share passwords or API keys.</p>}
          >
            <h3 className="p2-h" data-r="up">Talk to the Yubit Pay team</h3>
            <p className="p2-p14" data-r="up" style={i(1)}>Fields marked * are required. Please don’t include account numbers, credentials or sensitive payment data.</p>
            <div className="ct-two">
              <Field id="ct-name" label="Full name *" n={2}><input id="ct-name" className="p2-input" name="name" autoComplete="name" placeholder="Your name" required /></Field>
              <Field id="ct-email" label="Work email *" n={3}><input id="ct-email" className="p2-input" name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></Field>
            </div>
            <div className="ct-two">
              <Field id="ct-company" label="Company *" n={4}><input id="ct-company" className="p2-input" name="company" autoComplete="organization" placeholder="Company name" required /></Field>
              <Field id="ct-phone" label="Phone (optional)" n={5}><input id="ct-phone" className="p2-input" name="phone" type="tel" autoComplete="tel" placeholder="+91 · Phone number" /></Field>
            </div>
            <Field id="ct-topic" label="I’m interested in *" n={6}>
              <span className="ct-select">
                <select id="ct-topic" className="p2-input" name="topic" required defaultValue="">
                  <option value="" disabled>Select a product or service</option>
                  <option>Payouts</option><option>Collections</option><option>UPI</option><option>Managed services / custom finapps</option><option>Other</option>
                </select>
                <Icon n="chevron-down-ink" w={16} />
              </span>
              <p className="p2-hint">Options: Payouts · Collections · UPI · Managed services / custom finapps · Other</p>
            </Field>
            <Field id="ct-msg" label="Message *" n={7}><textarea id="ct-msg" className="p2-input" name="message" placeholder="Tell us about your workflow, scale and plans…" required /></Field>
            <label className="p2-check ct-check" data-r="up" style={i(8)}>
              <input type="checkbox" name="consent" required />
              <span>I agree to be contacted about this request. See the Privacy Policy for how information is handled.</span>
            </label>
          </StaticForm>

          <div className="ct-channels">
            <div className="p2-card" data-r="right">
              <h3 className="ct-ch"><Icon n="messages-square" w={24} />Business and support</h3>
              <p className="p2-p">Questions about your use case, onboarding or existing payment operations.</p>
              <p className="ct-mail">support@yubitpay.example</p>
              <p className="p2-p14">Example contact placeholder · not a confirmed address</p>
            </div>
            <div className="p2-card" data-r="right" style={i(1)}>
              <h3 className="ct-ch"><Icon n="code-xml-ink" w={24} />Developer help</h3>
              <p className="p2-p">Bring an endpoint and a redacted request. Keep credentials and payment data private.</p>
              <p className="ct-mail">developers@yubitpay.example</p>
              <p className="p2-p14">Example contact placeholder · not a confirmed address</p>
              <Btn href={DOCS} kind="edge">Read the docs</Btn>
            </div>
            <div className="p2-card" data-r="right" style={i(2)}>
              <h3 className="p2-h24">Find us in India</h3>
              <p className="p2-p">Example office placeholder:<br />Level 4, 12 Residency Road,<br />Bengaluru, Karnataka 560025, India</p>
              <p className="p2-p14">Illustrative address only. Not a confirmed Yubit Pay office; replace before publication.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="ct-wrap">
        <Band h="Prefer to start with the APIs?" sub="Explore the sandbox, connect your first workflow and bring your questions to the conversation.">
          <Btn href={START}>Get Started</Btn>
          <Btn href={DOCS} kind="edge">Read the docs</Btn>
        </Band>
      </div>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
