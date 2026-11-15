import Link from "next/link";
import { ROUTES } from "@/lib/ia";
import type { CardKey, Table } from "@/lib/products";
import { CopyButton } from "../CopyButton";
import { Icon } from "../Icon";

// Building blocks shared by the inner pages (Figma "Inner page hero", "Section introduction", cards, tables, dark band).
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

export function Btn({ href, children, kind = "lime" }: { href: string; children: string; kind?: "lime" | "line" }) {
  return (
    <Link className={`btn btn-${kind}`} href={href}>
      {children}
      <Icon n={kind === "lime" ? "arrow-up-right-dark" : "arrow-up-right-light"} w={18} />
    </Link>
  );
}

/* First screen of an inner page. Its load sequence is its own (not the homepage's): nav drops → flutes rain →
   eyebrow → the two title lines rise one after the other → sub-line surfaces → buttons pop → the preview rises → tags drop. */
export function InnerHero({ eyebrow, lines, sub, actions, tags = true, children }: { eyebrow: string; lines: [string, string]; sub: string; actions?: React.ReactNode; tags?: boolean; children?: React.ReactNode }) {
  return (
    <section className="ihero" aria-label={lines.join(" ")}>
      <Icon n="inner-glow" w={1008} h={700} className="ihero-glow" />
      <div className="flutes" aria-hidden="true" />
      <div className="ihero-in sec">
        <div className="ihero-row">
          <div className="ihero-copy">
            <p className="eyebrow ihero-eb">{eyebrow}</p>
            <h1 className="ih1">
              <span className="ih1-l"><span>{lines[0]}</span></span>
              <span className="ih1-l lime"><span>{lines[1]}</span></span>
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
export function ApiCard({ request, body, response }: { request: string; body: string; response: string }) {
  const text = `# Illustrative request. Not a specification.\nPOST ${request}\nBearer <SANDBOX_KEY>\n${body}`;
  return (
    <div className="code in api">
      <div className="code-head">
        <Icon n="window-controls" w={33} h={7} />
        <span className="mono code-file">illustrative-request.sh</span>
        <CopyButton text={text} />
      </div>
      <div className="code-tabs mono">
        <span className="tab" aria-current="true">cURL</span>
        <span className="tab">Node.js</span>
        <span className="tab">Python</span>
      </div>
      <div className="code-body mono">
        <p className="cl c12 cream" style={i(0)}># Illustrative request. Not a specification.</p>
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

// Dark band between light sections; it grows out of the ivory around it (PageMotion scales [data-grow]).
export function Band({ h, sub, children }: { h: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="grow-wrap" data-tone="light">
      <section className="isec band" data-grow data-tone="dark" aria-label={h}>
        <div className="intro-i">
          <p className="eyebrow" data-r="up">BUILD WITH YUBIT PAY</p>
          <h2 className="ih2" data-r="up" style={i(1)}>{h}</h2>
          <p className="ibody" data-r="up" style={i(2)}>{sub}</p>
        </div>
        <div className="ihero-actions" data-r="pop">{children}</div>
      </section>
    </div>
  );
}

// Rows arrive in order and each row's rule draws from the left. On phones a row becomes a record (label above value), as in the Figma mobile frames.
export function PriceTable({ t }: { t: Table }) {
  return (
    <div className="ptable" role="table" data-r="rows" style={{ "--cols": t.head.length } as React.CSSProperties}>
      <div className="pt-head" role="row">
        {t.head.map((h) => <span key={h} role="columnheader">{h}</span>)}
      </div>
      {t.rows.map((r, n) => (
        <div key={r[0]} className="pt-row" role="row" style={i(n)}>
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
export function ProductCard({ k, from }: { k: CardKey; from: "left" | "right" }) {
  const c = CARDS[k];
  return (
    <article className="pcard" data-r={from}>
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
