import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Btn } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import { ROUTES } from "@/lib/ia";
import "./privacy.css";

export const metadata: Metadata = { title: "Privacy Policy — Yubit Pay" };

// Copy word for word from Figma "Legal / Privacy Policy / Desktop 1440" (144:2967), in the .p2 palette. A draft, as Figma says.
const SECTIONS: [string, string[]][] = [
  ["Scope and responsibility", [
    "This draft describes how [CONFIRMED LEGAL ENTITY] might handle information when businesses visit the Yubit Pay website, request access or use the platform. The final policy should identify the legal entity, its role for each processing activity and any separate business agreements.",
    "Payment data processed on behalf of a customer may be governed by additional instructions or contractual terms. This draft does not establish a final controller or processor allocation.",
  ]],
  ["Information we may collect", [
    "Account and contact information may include a name, work email, company, phone number and the contents of a request. Business verification and onboarding may require additional information; the final notice should specify the actual categories collected.",
    "Operational information may include payment references, recipient identifiers, timestamps, status events, device details and service logs. Do not send passwords, API keys or unnecessary sensitive information in contact forms or support requests.",
  ]],
  ["How information may be used", [
    "Information may be used to respond to requests, provide account access, support payment workflows, investigate errors and meet applicable obligations. Each purpose and its legal basis must be confirmed before the final policy is published.",
    "Use only the information needed for the workflow. Product analytics, marketing communications and optional cookies should have their own clearly described purpose and preference controls where required.",
  ]],
  ["Sharing and service providers", [
    "Payment workflows can involve banking partners, payment networks and operational service providers. The final policy should describe actual recipient categories, why information is shared and the contractual or legal safeguards that apply.",
    "Information may also need to be disclosed in response to a lawful request. This draft does not authorize unrestricted sharing or imply that every data category is shared with every partner.",
  ]],
  ["Retention and security", [
    "Retention should reflect the purpose of collection, applicable requirements and documented deletion practices. Specific retention periods have not been confirmed and should not be inferred from this sample.",
    "Access controls, credential management and operational logging should be documented as part of the security program. No certification or absolute security guarantee is asserted here. Businesses should keep API credentials server-side and restrict access to authorized staff.",
  ]],
  ["Your choices and rights", [
    "Depending on applicable law and your relationship with the service, you may have rights relating to access, correction, deletion or withdrawal of optional consent. The final policy should explain how to submit requests and any verification steps.",
    "Some information may need to be retained for legal, security or transaction-record purposes. Applicable exceptions and response processes require legal review; this draft does not promise a specific deadline.",
  ]],
  ["Cookies and international handling", [
    "The final website should disclose the cookies and similar technologies actually used, distinguish essential from optional technologies and provide appropriate controls. This mockup does not assert that a particular analytics or advertising provider is installed.",
    "Any cross-border processing, hosting locations or transfer safeguards should be described only after the actual infrastructure and legal requirements are confirmed.",
  ]],
  ["Updates and contact", [
    "Material updates should be communicated through an appropriate notice and a confirmed effective date. The date placeholder above must be replaced before publication.",
    "For privacy questions use [CONFIRMED PRIVACY EMAIL] and [CONFIRMED BUSINESS ADDRESS]. These are contact placeholders, not approved addresses. Example email: privacy@yubitpay.example.",
  ]],
];
const nn = (n: number) => String(n + 1).padStart(2, "0");

/*
  /privacy. Long-form reading, so the motion is quiet: the compact header loads (title rises from its mask, the description
  surfaces, the draft pill pops, the date drops); the article itself has no entrances. The contents list is sticky beside it
  (L7) and marks the section being read ([data-spy]).
*/
export default function Page() {
  return (
    <main className="inner p2">
      <section className="ihero lg-head" data-load="legal" aria-label="Privacy Policy">
        <Icon n="legal-glow" w={780} h={800} className="lg-glow" />
        <div className="flutes" aria-hidden="true" />
        <div className="ihero-in sec lg-in">
          <p className="eyebrow ihero-eb">LEGAL / DRAFT DOCUMENT</p>
          <h1 className="lg-h"><span>Privacy Policy</span></h1>
          <p className="ihero-sub lg-sub">How information may be collected, used and protected across Yubit Pay. A readable draft for review, not a published privacy commitment.</p>
          <div className="lg-status">
            <span className="lg-pill">Draft for legal review</span>
            <span className="mono lg-date">Updated: [DATE TO BE CONFIRMED]</span>
          </div>
        </div>
      </section>

      <section className="isec p2-sec lg-article" data-tone="light" aria-label="Privacy Policy draft">
        <div className="p2-notice">
          <p className="p2-notice-t lg-nt">Draft for legal review — not approved policy</p>
          <p className="p2-p14">Sample drafting content for design review, not legal advice. Confirm the legal entity, actual business practices and applicable law before publication. This mockup makes no final legal or business commitments.</p>
        </div>
        <div className="lg-layout">
          <nav className="lg-toc" aria-label="On this page">
            <p className="p2-eb">ON THIS PAGE</p>
            <div className="lg-toc-list" data-spy>
              {SECTIONS.map(([t], n) => <a key={t} href={`#section-${nn(n)}`}>{nn(n)}  {t}</a>)}
            </div>
            <p className="mono lg-toc-note">Sticky TOC pattern<br />Static design · focus shown</p>
          </nav>
          <div className="lg-body">
            {SECTIONS.map(([t, ps], n) => (
              <section key={t} id={`section-${nn(n)}`} className="lg-sec" aria-label={t}>
                <p className="mono lg-ref">#section-{nn(n)}</p>
                <h2 className="lg-h2">{nn(n)}. {t}</h2>
                {ps.map((p) => <p key={p.slice(0, 24)} className="p2-p">{p}</p>)}
              </section>
            ))}
            <div className="p2-notice">
              <p className="p2-notice-t lg-nt">Questions about this draft?</p>
              <p className="p2-p14">Contact [CONFIRMED LEGAL CONTACT EMAIL]. Example only: legal@yubitpay.example. Business address: [CONFIRMED BUSINESS ADDRESS]. Replace these placeholders and obtain legal approval before publication.</p>
            </div>
            <div className="ihero-actions">
              <Btn href={ROUTES.contact} kind="edge">Contact the team</Btn>
              <Btn href="#" kind="edge">Back to top</Btn>
            </div>
          </div>
        </div>
      </section>

      <Reveal />
      <PageMotion />
    </main>
  );
}
