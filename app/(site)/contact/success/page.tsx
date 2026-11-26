import type { Metadata } from "next";
import { CtaBand } from "@/components/Sections";
import { Btn, DOCS, InnerHero, Intro, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import "../contact.css";

export const metadata: Metadata = { title: "Request submitted — Yubit Pay" };

// Copy word for word from Figma "Contact / Success / Desktop 1440" (144:7858), in the .p2 palette.
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const STEPS = [
  ["Check your details", "Keep an eye on the work email you provided. No response-time commitment is implied."],
  ["Explore the docs", "Review the stacks, authentication and sandbox workflow before your conversation."],
  ["Bring your use case", "Outline transaction flows, expected volume and any managed-services or custom-finapps needs."],
];

/*
  /contact/success. Hero: the eyebrow's check pops, then the title rises as one block from beneath the hero's edge · the
  section covers the hero (desktop); heading lines rise, the notice pops, the next steps are dealt, the actions surface.
*/
export default function Page() {
  return (
    <main className="inner p2">
      <InnerHero
        load="rise" eyebrow="✓ REQUEST SUBMITTED" lines={["The conversation", "starts here."]}
        sub="Thanks for telling us what you’re building. Your contact request has been received. Keep exploring while your use case is reviewed."
        actions={<><Btn href={START}>Get Started</Btn><Btn href="/" kind="edge">Back to Home</Btn></>}
      />

      <section className="isec p2-sec" data-tone="light" aria-label="A little clarity on the next steps.">
        <Intro eyebrow="WHAT HAPPENS NEXT" h="A little clarity on the next steps." how="lines" />
        <div className="p2-notice" data-r="pop" role="status">
          <p className="p2-notice-t">✓ Contact request received</p>
          <p className="p2-p14">This is a sample confirmation state. No real message is sent by this static design. We’ll use the work email provided to continue the conversation.</p>
        </div>
        <ol className="cs-steps">
          {STEPS.map(([t, d], n) => (
            <li key={t} className="p2-card" data-r="deal" style={i(n)}>
              <span className="mono cs-no">0{n + 1} →</span>
              <h3 className="p2-h24">{t}</h3>
              <p className="p2-p14">{d}</p>
            </li>
          ))}
        </ol>
        <div className="ihero-actions" data-r="up" style={i(3)}>
          <Btn href={START}>Get Started</Btn>
          <Btn href={DOCS} kind="edge">Read the docs</Btn>
          <Btn href="/" kind="edge">Back to Home</Btn>
        </div>
      </section>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
