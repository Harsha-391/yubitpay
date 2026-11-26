import Link from "next/link";
import { Icon } from "../Icon";
import artAvif from "@/assets/img/about-sculpture-1216.avif";
import artWebp from "@/assets/img/about-sculpture-1216.webp";

/*
  Figma "Split authentication layout" (login 144:7426, sign-up 144:7660): the brand story on the left, the form region on
  the right; stacked on phones (293:13475), where the artwork is dropped. No site nav or footer: these pages sit outside
  the (site) group. Load: the brand panel slides in from the left edge and its headline lines rise from their masks; then
  the form region's blocks surface in order (auth.css).
*/
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="au p2">
      <aside className="au-story" aria-label="Yubit Pay">
        <Link className="brand au-brand" href="/"><span className="brand-sym"><Icon n="waypoints" w={23} /></span>yubit pay</Link>
        <div className="au-intro">
          <p className="eyebrow au-up">LESS FRICTION. MORE SHIPPING.</p>
          <p className="au-headline">
            <span className="au-m"><span>Your next idea.</span></span>
            <span className="au-m lime"><span>Our financial infrastructure.</span></span>
          </p>
          <p className="p2-p au-sub au-up">Connect collections, payouts and UPI with a sandbox-first developer workflow.</p>
        </div>
        {/* the same Figma image as /about (image hash b3995) */}
        <picture className="au-art">
          <source type="image/avif" srcSet={artAvif.src} />
          <img src={artWebp.src} width={580} height={330} alt="" decoding="async" />
        </picture>
        <p className="mono au-signals au-up">3 STACKS / 4 RAILS / ONE INTEGRATION APPROACH</p>
        <p className="p2-p14 au-sub au-up">Sandbox account activated instantly; live access subject to onboarding</p>
      </aside>
      <div className="au-form">
        <Link className="au-back" href="/">← Back to Home</Link>
        {children}
      </div>
    </main>
  );
}

// "© 2026 Yubit Pay · Privacy Policy · Terms of Use" (Terms has no frame, so it stays text).
export function AuthLegal() {
  return <p className="au-legal">© 2026 Yubit Pay · <Link href="/privacy">Privacy Policy</Link> · Terms of Use</p>;
}
