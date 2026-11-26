import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout, AuthLegal } from "@/components/inner/Auth";
import { Password } from "@/components/inner/Password";
import { StaticForm } from "@/components/inner/StaticForm";
import { Reveal } from "@/lib/motion/Reveal";
import { ROUTES } from "@/lib/ia";
import "../auth.css";

export const metadata: Metadata = { title: "Sign in — Yubit Pay" };

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/*
  /login, copy word for word from Figma "Auth / Login / Desktop 1440" (144:7424). Static like the other forms: a valid
  submit shows the sign-up page's loading and success specimens ("◌ Signing in…", then "✓ You’re signed in.") below the
  button and keeps the form visible, as the specimens say; nothing is sent.
*/
export default function Page() {
  return (
    <AuthLayout>
      <div className="au-head" style={i(1)}>
        <p className="p2-eb">YUBIT PAY ACCOUNT</p>
        <h1 className="au-h">Welcome back.</h1>
        <p className="p2-p">Sign in to your workspace. Keep your payment operations connected.</p>
      </div>
      <StaticForm
        className="au-f" label="Sign in" busy="◌ Signing in…" keep
        done={<div className="p2-notice"><p className="p2-notice-t">✓ You’re signed in.</p><p className="p2-p14">Your workspace is ready.</p></div>}
      >
        <div className="p2-field" style={i(2)}>
          <label className="p2-label" htmlFor="li-email">Work email</label>
          <input id="li-email" className="p2-input" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          <p className="p2-hint p2-err">ⓘ Enter a valid work email address.</p>
        </div>
        <div className="p2-field" style={i(3)}>
          <label className="p2-label" htmlFor="li-pw">Password</label>
          <Password id="li-pw" placeholder="Enter your password" autoComplete="current-password" />
        </div>
        <div className="au-prefs" style={i(4)}>
          <label className="p2-check au-check"><input type="checkbox" name="remember" /><span>Remember me</span></label>
          <Link className="au-link" href="#">Forgot password? ↗</Link>
        </div>
      </StaticForm>
      <Link className="au-cross" href={ROUTES.start}>New to Yubit Pay? Create an account ↗</Link>
      <div className="p2-notice">
        <p className="p2-notice-t">Keep credentials private</p>
        <p className="p2-p14">Use a trusted device. Your API key is not your account password; never share either with support.</p>
      </div>
      <p className="mono au-note">STATIC REVIEW · Default form shown here. Focus, error, success and loading specimens are appended to Sign Up at the same width.</p>
      <AuthLegal />
      <Reveal />
    </AuthLayout>
  );
}
