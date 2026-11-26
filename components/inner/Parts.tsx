import Link from "next/link";
import { ROUTES } from "@/lib/ia";
import type { CardKey, Table } from "@/lib/products";
import { CopyButton } from "../CopyButton";
import { Icon } from "../Icon";

// Building blocks shared by the inner pages (Figma "Inner page hero", "Section introduction", cards, tables, dark band).
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

// lime: primary · line: outline in --deep (product heroes) · edge: outline in lime (use cases and later frames). Outline text and arrow follow the section's colour.
export function Btn({ href, children, kind = "lime" }: { href: string; children: string; kind?: "lime" | "line" | "edge" }) {
  return (
    <Link className={`btn btn-${kind}`} href={href}>
      {children}
      <Icon n={kind === "lime" ? "arrow-up-right-dark" : "arrow-up-right-light"} w={18} />
    </Link>
  );
}

/* First screen of an inner page. `load` picks its load sequence, so no two pages open the same way:
   glide  (product brief §1): eyebrow → heading glides in from the right while the sub-line drifts in from the left → buttons pop → preview rises → tags drop
   sides  (pricing): eyebrow → the title lines arrive from opposite edges → sub-line surfaces → buttons pop → tags drop
   lines  (marketplace): eyebrow → the two title lines rise out of their masks in turn → sub-line surfaces → buttons pop → tags drop
   words  (use cases): eyebrow → the title's words fill left to right → sub-line and buttons arrive from opposite sides → tags drop
   type   (docs): eyebrow → the title types out letter by letter → sub-line surfaces → buttons pop → tags drop
   drop   (sandbox): eyebrow → the title lines drop in from above and bounce → sub-line surfaces → buttons pop → tags drop
   chars  (about): eyebrow → the title letters rise and settle one after another → sub-line surfaces → buttons pop → tags drop
   zoom   (contact): eyebrow → each title line settles from slightly larger, coming into focus → sub-line → buttons pop → tags drop
   rise   (contact success): the eyebrow check pops → the title rises as one block from beneath the hero edge → sub-line → buttons → tags */
export function InnerHero({ eyebrow, lines, sub, actions, tags = true, load = "glide", children }: { eyebrow: string; lines: [string, string]; sub: string; actions?: React.ReactNode; tags?: boolean; load?: "glide" | "sides" | "lines" | "words" | "type" | "drop" | "chars" | "zoom" | "rise"; children?: React.ReactNode }) {
  let w = 0, c = 0; // word / letter index across both lines, for the stagger
  // letters stay together per word, so a narrow screen wraps between words, never inside one
  const typed = (l: string) => l.split(" ").map((x, n, all) => (
    <span key={n} className="ch-w">{[...(n < all.length - 1 ? x + " " : x)].map((ch, k) => <span key={k} className="c" style={{ "--c": c++ } as React.CSSProperties}>{ch}</span>)}</span>
  ));
  return (
    <section className="ihero" data-load={load} aria-label={lines.join(" ")}>
      <Icon n="inner-glow" w={1008} h={700} className="ihero-glow" />
      <div className="flutes" aria-hidden="true" />
      <div className="ihero-in sec">
        <div className="ihero-row">
          <div className="ihero-copy">
            <p className="eyebrow ihero-eb">{eyebrow}</p>
            <h1 className="ih1">
              {lines.map((l, k) => (
                <span key={k} className={k ? "ih1-l lime" : "ih1-l"}>
                  <span>{load === "words" ? l.split(" ").map((x, n) => <span key={n} className="w" style={{ "--w": w++ } as React.CSSProperties}>{x} </span>) : load === "type" || load === "chars" ? typed(l) : l}</span>
                </span>
              ))}
            </h1>
            <p className="ihero-sub">{sub}</p>
            {actions && <div className="ihero-actions">{actions}</div>}
          </div>
          {children && <div className="ihero-side">{children}</div>}
        </div>
        {tags && (
          <p className="ihero-tags mono">
            <span>INDIA-NATIVE</span><span aria-hidden="true">/</span><span>REST APIs</span><span aria-hidden="true">/</span><span>SANDBOX FIRST</span>
          </p>
        )}
      </div>
    </section>
  );
}

// Figma "Illustrative API request and response". Only the cURL request exists in Figma, so the other two languages are labels, not tabs.
// In a hero it plays with the load sequence; elsewhere (`reveal`) it rises when scrolled to and its lines settle then.
export function ApiCard({ request, body, response, file = "illustrative-request.sh", note = "# Illustrative request. Not a specification.", reveal }: { request: string; body: string; response: string; file?: string; note?: string; reveal?: boolean }) {
  const text = `${note}\nPOST ${request}\nBearer <SANDBOX_KEY>\n${body}`;
  return (
    <div className={reveal ? "code api" : "code in api"} data-r={reveal ? "up" : undefined}>
      <div className="code-head">
        <Icon n="window-controls" w={33} h={7} />
        <span className="mono code-file">{file}</span>
        <CopyButton text={text} />
      </div>
      <div className="code-tabs mono">
        <span className="tab" aria-current="true">cURL</span>
        <span className="tab">Node.js</span>
        <span className="tab">Python</span>
      </div>
      <div className="code-body mono">
        <p className="cl c12 cream" style={i(0)}>{note}</p>
        <p className="cl c13" style={i(1)}><span className="lime">POST</span> {request}</p>
        <p className="cl c11 cream" style={i(2)}>Bearer &lt;SANDBOX_KEY&gt;</p>
        <pre className="cl c12 json lime" style={i(3)}>{body}</pre>
      </div>
      <div className="code-resp mono resp">
        <Icon n="response-dot" w={7} />
        <span className="lime">200 OK</span>
        <span className="cream api-resp">{response}</span>
      </div>
      <p className="code-note">Illustrative API · Confirm fields in the docs</p>
    </div>
  );
}

// each word with a trailing space, and the index of its first letter (for the letter stagger)
const words = (h: string) => { let at = 0; return h.split(" ").map((w, n, all) => { const t = n < all.length - 1 ? w + " " : w; const r: [string, number] = [t, at]; at += t.length; return r; }); };

// Eyebrow + heading + optional line. `how` picks the heading's entrance so neighbouring sections never share one.
export function Intro({ eyebrow, h, sub, how, dark }: { eyebrow: string; h: string; sub?: string; how: "lines" | "sides" | "up" | "chars"; dark?: boolean }) {
  return (
    <div className="intro-i">
      <p className={dark ? "eyebrow" : "eyebrow dark"} data-r="up">{eyebrow}</p>
      {how === "lines" && <h2 className="ih2 lines" data-r="lines"><span className="ln"><span>{h}</span></span></h2>}
      {how === "sides" && <h2 className="ih2" data-r="left">{h}</h2>}
      {how === "up" && <h2 className="ih2" data-r="up" style={i(1)}>{h}</h2>}
      {how === "chars" && (
        <h2 className="ih2 chars" data-r="chars" aria-label={h}>
          <span className="cl-line" aria-hidden="true">
            {words(h).map(([w, at], n) => (
              // letters stay together per word, so a narrow screen wraps between words, never inside one
              <span key={n} className="ch-w">
                {[...w].map((ch, k) => <span key={k} className="ch" style={{ "--c": at + k } as React.CSSProperties}>{ch}</span>)}
              </span>
            ))}
          </span>
        </h2>
      )}
      {sub && <p className="ibody" data-r={how === "sides" ? "right" : "up"} style={i(2)}>{sub}</p>}
    </div>
  );
}

/* Product brief §4, the CTA block: the band arrives as one object (drift + fade), then headline → sub-line → buttons.
   The lime triangle knows where the cursor is (PageMotion [data-tri]): it turns and tilts toward it with heavy lag,
   its gradient's bright end leans toward it, and it brightens as the cursor comes closer or rests on a button. */
export function Band({ h, sub, tri, eyebrow = "BUILD WITH YUBIT PAY", children }: { h: string; sub: string; tri?: boolean; eyebrow?: string; children: React.ReactNode }) {
  // Without the product brief's triangle: a plain dark band that grows out of whatever is around it (H8, PageMotion [data-grow]).
  if (!tri) return (
    <section className="isec band" data-grow data-tone="dark" aria-label={h}>
      <Intro eyebrow={eyebrow} h={h} sub={sub} how="up" dark />
      <div className="ihero-actions" data-r="pop" style={i(3)}>{children}</div>
    </section>
  );
  return (
    <div className="band-wrap" data-r="slab" data-tone="light">
      <section className="isec band" data-tone="dark" aria-label={h}>
        <div className="tri-wrap" data-tri aria-hidden="true">
          <svg className="tri" viewBox="0 0 100 88">
            <defs>
              <linearGradient id="tri-g" gradientUnits="userSpaceOnUse" x1="20" y1="80" x2="80" y2="10">
                <stop offset="0" stopColor="#1C382A" />
                <stop offset="0.55" stopColor="#5F8F3E" />
                <stop offset="1" stopColor="#C0F476" />
              </linearGradient>
            </defs>
            <path d="M50 2 L98 86 L2 86 Z" fill="url(#tri-g)" />
          </svg>
        </div>
        <div className="intro-i">
          <p className="eyebrow slab-1">BUILD WITH YUBIT PAY</p>
          <h2 className="ih2 slab-1">{h}</h2>
          <p className="ibody slab-2">{sub}</p>
        </div>
        <div className="ihero-actions slab-3">{children}</div>
      </section>
    </div>
  );
}

// Part of the plan card, which arrives whole (brief §5): no row-by-row build. On phones a row becomes a record (label above value), as in the Figma mobile frames.
// `r`: its own entrance ("rows": rows rise in order while each rule draws from the left; or any [data-r] variant).
export function PriceTable({ t, r }: { t: Table; r?: string }) {
  return (
    <div className="ptable" role="table" data-r={r} style={{ "--cols": t.head.length } as React.CSSProperties}>
      <div className="pt-head" role="row">
        {t.head.map((h) => <span key={h} role="columnheader">{h}</span>)}
      </div>
      {t.rows.map((r, n) => (
        <div key={n} className="pt-row" role="row" style={i(n)}>
          {r.map((c, k) => <span key={k} role="cell" data-label={t.head[k]}>{c}</span>)}
        </div>
      ))}
    </div>
  );
}

// Figma components "Home / Card / Payouts | Collections | Open banking".
const CARDS: Record<CardKey, { t: string; d: string; link: string; href: string }> = {
  payouts: { t: "Payouts", d: "Pay vendors, partners and customers through a single API. Track every transfer from request to confirmation.", link: "Explore payouts", href: "/products/payouts" },
  collections: { t: "Collections", d: "Accept UPI payments and collect through virtual accounts. Reconcile incoming payments without the manual work.", link: "Explore collections", href: "/products/collections" },
  "open-banking": { t: "Open banking", d: "Connect your product to banking workflows. Bring account verification and financial operations into your stack.", link: "Explore open banking", href: "#" },
};
// Brief §6: launched from the opposite screen edge along an arc (CSS keyframes keyed off the .pcards reveal).
// `flat`: the marketplace frame's instances draw the preview on white instead of ivory. `r`: a reveal of its own.
export function ProductCard({ k, flat, r }: { k: CardKey; flat?: boolean; r?: string }) {
  const c = CARDS[k];
  return (
    <article className={flat ? "pcard pcard-flat" : "pcard"} data-r={r}>
      <div className={`pcard-prev pv-${k}`} aria-hidden="true">
        {k === "payouts" && ["Vendor payment", "Partner settlement", "Customer refund"].map((l) => (
          <div key={l} className="pv-entry"><i /><span>{l}</span><Icon n="check" w={14} /></div>
        ))}
        {k === "collections" && (
          <>
            <div className="pv-va"><span>VIRTUAL ACCOUNT</span><Icon n="landmark-ink" w={18} /></div>
            <p className="pv-amt">₹1,24,500.00</p>
            <div className="pv-status"><Icon n="circle-check" w={16} /><span>Payment received</span><span className="mono pv-rail">via UPI</span></div>
          </>
        )}
        {k === "open-banking" && (
          <>
            <div className="pv-hub"><Icon n="landmark-ink" w={28} /><i /><span><Icon n="waypoints-c" w={32} /></span><i /><Icon n="layers" w={28} /></div>
            <p className="pv-cap">Your product ↔ Banking workflows</p>
          </>
        )}
      </div>
      <div className="pcard-d">
        <h3 className="pcard-t">{c.t}</h3>
        <p className="pcard-p">{c.d}</p>
      </div>
      <Link className="pcard-link" href={c.href}>
        {c.link}
        <Icon n="arrow-up-right-light" w={18} />
      </Link>
    </article>
  );
}

export const START = ROUTES.start, DOCS = ROUTES.docs;
