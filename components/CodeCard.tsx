"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { countUp } from "@/lib/motion/countUp";
import { CopyButton } from "./CopyButton";
import { Icon } from "./Icon";

const JSON_BODY = `{
  "amount": 2500000,
  "currency": "INR",
  "mode": "IMPS",
  "reference_id": "vendor_1042"
}`;

// Illustrative only (the design labels it so). cURL is the Figma copy; the other two are the same request.
const SNIPPETS = {
  cURL: { comment: "# One request. Money in motion.", curl: true, body: JSON_BODY },
  // TODO: real copy — placeholder snippet, not from the Figma
  "Node.js": {
    comment: "// One request. Money in motion.",
    curl: false,
    body: `await fetch("/v1/payouts", {
  method: "POST",
  headers: { Authorization: "Bearer <YOUR_API_KEY>" },
  body: JSON.stringify({
    amount: 2500000,
    currency: "INR",
    mode: "IMPS",
    reference_id: "vendor_1042",
  }),
});`,
  },
  // TODO: real copy — placeholder snippet, not from the Figma
  Python: {
    comment: "# One request. Money in motion.",
    curl: false,
    body: `requests.post(
    "/v1/payouts",
    headers={"Authorization": "Bearer <YOUR_API_KEY>"},
    json={
        "amount": 2500000,
        "currency": "INR",
        "mode": "IMPS",
        "reference_id": "vendor_1042",
    },
)`,
  },
} as const;
type Lang = keyof typeof SNIPPETS;
const LANGS = Object.keys(SNIPPETS) as Lang[];
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  Tabs crossfade (old snippet fades out, new one settles in line by line) while the body's height eases to the new snippet.
  "Send test request" plays the illustrative round trip: request line lights → 200 OK → payout.processed webhook slides in, ₹ counts up.
  Under reduced motion every control still works, just without the timing.
*/
export function CodeCard() {
  const [lang, setLang] = useState<Lang>("cURL"); // selected tab
  const [shown, setShown] = useState<Lang>("cURL"); // rendered snippet: follows `lang` after the fade-out
  const [run, setRun] = useState(0); // 0 idle · 1 sending · 2 200 OK · 3 webhook delivered
  const stage = useRef<HTMLDivElement>(null), from = useRef(0), swapped = useRef(false), amt = useRef<HTMLParagraphElement>(null);
  const s = SNIPPETS[shown];
  const text = s.curl ? `${s.comment}\nPOST /v1/payouts\nAuthorization: Bearer <YOUR_API_KEY>\n${s.body}` : `${s.comment}\n${s.body}`;

  const pick = (l: Lang) => {
    if (l === lang) return;
    setLang(l); swapped.current = true;
    if (still() || !stage.current) { setShown(l); return; }
    from.current = stage.current.offsetHeight;
    stage.current.classList.add("out");
    setTimeout(() => setShown(l), 150);
  };

  // one-shot height transition old → new, then back to auto
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el || !from.current) return;
    el.classList.remove("out");
    el.style.height = "";
    const to = el.offsetHeight;
    el.style.height = `${from.current}px`;
    el.getBoundingClientRect();
    el.style.height = `${to}px`;
    from.current = 0;
    const t = setTimeout(() => (el.style.height = ""), 450);
    return () => clearTimeout(t);
  }, [shown]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = LANGS[(LANGS.indexOf(lang) + d + LANGS.length) % LANGS.length];
    pick(n);
    document.getElementById(`code-tab-${LANGS.indexOf(n)}`)?.focus();
  };

  const send = () => {
    if (run === 1 || run === 2) return;
    const q = still();
    setRun(1);
    setTimeout(() => setRun(2), q ? 0 : 750);
    setTimeout(() => { setRun(3); if (amt.current) countUp(amt.current, 25000, 1100); }, q ? 0 : 1350);
  };

  return (
    <div className="code" data-r="up" data-run={run} style={i(1)}>
      <div className="code-head">
        <Icon n="window-controls" w={33} h={7} />
        <span className="mono code-file">your-next-integration.sh</span>
        <CopyButton text={text} />
      </div>
      <div className="code-tabs mono" role="tablist" aria-label="Language">
        {LANGS.map((l, n) => (
          <button key={l} id={`code-tab-${n}`} type="button" role="tab" aria-selected={l === lang} aria-controls="code-panel" tabIndex={l === lang ? 0 : -1} className="tab" onClick={() => pick(l)} onKeyDown={onTabKey}>
            {l}
          </button>
        ))}
      </div>
      <div className="code-stage" ref={stage}>
        <div className={swapped.current ? "code-body mono swap" : "code-body mono"} id="code-panel" role="tabpanel" aria-labelledby={`code-tab-${LANGS.indexOf(lang)}`} key={shown} tabIndex={0}>
          <p className="cl c12" style={i(0)}>{s.comment}</p>
          {s.curl && (
            <>
              <p className="cl c13 req" style={i(1)}><span className="lime">POST</span> /v1/payouts</p>
              <p className="cl c11 cream" style={i(2)}>Authorization: Bearer &lt;YOUR_API_KEY&gt;</p>
            </>
          )}
          <pre className={s.curl ? "cl c12 json" : "cl c12 json req"} style={i(s.curl ? 3 : 1)}>{s.body}</pre>
        </div>
      </div>
      <div className="code-resp mono resp">
        <Icon n="response-dot" w={7} />
        <span className="lime">200 OK</span>
        <span className="cream">{`{ "status": "processing" }`}</span>
        <button type="button" className="code-send" onClick={send} disabled={run === 1 || run === 2}>
          {run === 1 || run === 2 ? "Sending…" : run === 3 ? "Send again" : "Send test request"}
        </button>
      </div>
      <div className="code-hook disc" data-open={run === 3}>
        <div>
          <div className="hook-card">
            <div className="webhook-head mono"><span>payout.processed</span><Icon n="circle-check" w={17} /></div>
            <p className="webhook-amt" ref={amt}>₹25,000.00</p>
            <p className="webhook-foot mono">{"200 OK  ·  Webhook delivered"}</p>
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">{run === 3 ? "Illustrative webhook delivered: payout.processed, ₹25,000.00" : ""}</span>
      <p className="code-note">Illustrative request · Explore the docs for API specifications</p>
    </div>
  );
}
