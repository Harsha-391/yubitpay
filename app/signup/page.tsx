import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Intro } from "@/components/inner/Parts";
import { AuthLayout, AuthLegal } from "@/components/inner/Auth";
import { Password } from "@/components/inner/Password";
import { StaticForm } from "@/components/inner/StaticForm";
import { Reveal } from "@/lib/motion/Reveal";
import { ROUTES } from "@/lib/ia";
import "../auth.css";

export const metadata: Metadata = { title: "Get started — Yubit Pay" };

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/*
  /signup, copy word for word from Figma "Auth / Sign Up / Desktop 1440" (144:7658). Static: a valid submit shows the
  loading and success specimens below the button and keeps the form visible; nothing is sent. Below the split layout,
  Figma's "Every state, clearly signposted." specimen sheet (144:7705) is built as drawn: the input states are dealt,
  the submission states surface in order.
*/
export default function Page() {
  return (
    <>
      <AuthLayout>
        <div className="au-head" style={i(1)}>
          <p className="p2-eb">YUBIT PAY ACCOUNT</p>
          <h1 className="au-h">Start building.</h1>
          <p className="p2-p">Create your sandbox account. Explore the APIs before you plan live access.</p>
        </div>
        <StaticForm
          className="au-f" label="Get Started" busy="Creating account…" keep
          done={<div className="p2-notice"><p className="p2-notice-t">✓ You’re signed in.</p><p className="p2-p14">Sandbox account activated instantly; live access subject to onboarding.</p></div>}
        >
          <div className="p2-field" style={i(2)}>
            <label className="p2-label" htmlFor="su-name">Full name *</label>
            <input id="su-name" className="p2-input" name="name" autoComplete="name" placeholder="Your full name" required />
          </div>
          <div className="p2-field" style={i(3)}>
            <label className="p2-label" htmlFor="su-email">Work email *</label>
            <input id="su-email" className="p2-input" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
            <p className="p2-hint p2-err">ⓘ Enter a valid work email address.</p>
          </div>
          <div className="p2-field" style={i(4)}>
            <label className="p2-label" htmlFor="su-company">Company *</label>
            <input id="su-company" className="p2-input" name="company" autoComplete="organization" placeholder="Company name" required />
          </div>
          <div className="p2-field" style={i(5)}>
            <label className="p2-label" htmlFor="su-pw">Password *</label>
            <Password id="su-pw" placeholder="Create a strong password" autoComplete="new-password" />
            <p className="p2-hint">Use a unique password with letters, numbers and symbols.</p>
          </div>
          <label className="p2-check au-check" style={i(6)}>
            <input type="checkbox" name="consent" required />
            <span>I agree to the Terms of Use and acknowledge the Privacy Policy. I’m authorized to create an account for my company.</span>
          </label>
        </StaticForm>
        <div className="p2-notice">
          <p className="p2-notice-t">Build in the sandbox first</p>
          <p className="p2-p14">Sandbox account activated instantly; live access subject to onboarding. Sandbox activity is for testing and does not move real money.</p>
        </div>
        <Link className="au-cross" href={ROUTES.login}>Already have an account? Sign in ↗</Link>
        <AuthLegal />
      </AuthLayout>

      <section className="isec p2 p2-sec au-states" data-tone="light" aria-label="Every state, clearly signposted.">
        <Intro eyebrow="AUTH / STATIC UI STATES" h="Every state, clearly signposted." how="lines" sub="Review specimens only — not additional steps in either form. No interactions are wired." />
        {/* pictures of each state (Figma "Form input / Default · Focus · Error · Success"), not live fields */}
        <div className="au-grid2">
          {[
            ["DEFAULT", "Work email", "you@company.com", "Awaiting input. Main forms show this state.", ""],
            ["FOCUS", "Work email", "builder@company.example│", "Visible outline and caret indicate keyboard focus.", "is-err"],
            ["ERROR", "Work email · needs attention", "builder@", "ⓘ Enter a valid work email address.", "is-err"],
            ["SUCCESS", "Work email · valid", "builder@company.example", "✓ Email format looks good. Example address only.", "ok"],
          ].map(([eb, label, value, hint, kind], n) => (
            <div key={eb} className="p2-card" data-r="deal" style={i(n)}>
              <p className="p2-eb">{eb}</p>
              <div className="p2-field">
                <p className="p2-label">{label}</p>
                <p className={`p2-input au-spec ${kind === "is-err" ? "is-err" : ""}`}>{value}{kind === "ok" && <Icon n="circle-check-ink" w={20} />}</p>
                <p className="p2-hint">{hint}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="au-grid3">
          <div className="p2-card" data-r="up">
            <p className="p2-eb">LOADING / SIGN UP &amp; LOGIN</p>
            <span className="btn btn-lime au-wide">◌ Signing in…<Icon n="arrow-up-right-dark" w={18} /></span>
            <p className="p2-p14">Get Started → Creating account…<br />Keep the form visible while submitting.</p>
          </div>
          <div className="p2-card au-errcard" data-r="up" style={i(1)}>
            <p className="p2-eb">ERROR / LOGIN</p>
            <p className="p2-notice-t au-lh">ⓘ We couldn’t sign you in.</p>
            <p className="p2-p14">Check your email and password, then try again. Use Forgot password if you need to reset access.</p>
          </div>
          <div className="p2-card au-okcard" data-r="up" style={i(2)}>
            <p className="p2-eb">SUCCESS / SIGN UP &amp; LOGIN</p>
            <p className="p2-notice-t au-lh">✓ You’re signed in.</p>
            <p className="p2-p14">Sign up: Sandbox account activated instantly; live access subject to onboarding. Login: Your workspace is ready.</p>
          </div>
        </div>
        <p className="au-legal" data-r="up">Consistency check — Home navbar, primary / secondary buttons, CTA band, footer and brand reused as instances across Contact and Auth. DM Sans, IBM Plex Mono, Home greens, radii and spacing retained. New patterns: labelled inputs, checkbox, interest selector and static form feedback.</p>
      </section>
      <Reveal />
    </>
  );
}
