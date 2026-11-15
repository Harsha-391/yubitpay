import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { SPRITE } from "@/components/sprite.generated";
import "./globals.css";
import "./sections.css";
import "./scenes.css";
import "./mobile.css"; // phone + tablet overrides; last so they win at equal specificity

const dm = DM_Sans({ subsets: ["latin"], axes: ["opsz"], variable: "--font-dm", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-grotesk", display: "swap", preload: false });
const satoshi = localFont({ src: "./fonts/Satoshi-Regular.woff2", weight: "400", variable: "--font-satoshi", display: "swap" });

// ₹ lives in DM Sans' latin-ext file (31KB); a 1.5KB subset of that same glyph avoids the download on first view.
const rupee = localFont({ src: "./fonts/DMSans-rupee.woff2", weight: "100 1000", variable: "--font-rupee", display: "swap", declarations: [{ prop: "unicode-range", value: "U+20B9" }] });

export const metadata: Metadata = {
  title: "Yubit Pay — Financial infrastructure for India",
  description: "Connect payments, payouts and open banking with developer-friendly APIs. Less complexity. More possibility.",
};

// cover: draw under the notch / home bar; the nav, menu sheet and footer pad themselves with env(safe-area-inset-*)
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#0c2017" };

// Adds `m` (scroll-morph hidden states) only when JS runs and motion is allowed; without it the page is the plain final layout.
// If the JS never comes alive (data-ready is set by Morph/Reveal) drop `m` after 12s so nothing stays hidden.
const EARLY = `var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("m");setTimeout(function(){d.dataset.ready||d.classList.remove("m")},12000)}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dm.variable} ${mono.variable} ${grotesk.variable} ${satoshi.variable} ${rupee.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: EARLY }} />
      </head>
      <body>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: SPRITE }} />
        {children}
      </body>
    </html>
  );
}
