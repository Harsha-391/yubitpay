"use client";
import { useState } from "react";
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

export function CodeCard() {
  const [lang, setLang] = useState<Lang>("cURL");
  const [copied, setCopied] = useState(false);
  const s = SNIPPETS[lang];
  const text = s.curl ? `${s.comment}\nPOST /v1/payouts\nAuthorization: Bearer <YOUR_API_KEY>\n${s.body}` : `${s.comment}\n${s.body}`;

  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => {});
  };

  return (
    <div className="code" data-r="up" style={{ "--i": 1 } as React.CSSProperties}>
      <div className="code-head">
        <Icon n="window-controls" w={33} h={7} />
        <span className="mono code-file">your-next-integration.sh</span>
        <button type="button" className="copy-btn" onClick={copy} aria-label={copied ? "Copied" : "Copy code"}>
          <Icon n={copied ? "check" : "copy"} w={16} />
        </button>
      </div>
      <div className="code-tabs mono" role="tablist" aria-label="Language">
        {(Object.keys(SNIPPETS) as Lang[]).map((l) => (
          <button key={l} type="button" role="tab" aria-selected={l === lang} className="tab" onClick={() => setLang(l)}>
            {l}
          </button>
        ))}
      </div>
      <div className="code-body mono" key={lang}>
        <p className="cl c12" style={{ "--i": 0 } as React.CSSProperties}>{s.comment}</p>
        {s.curl && (
          <>
            <p className="cl c13" style={{ "--i": 1 } as React.CSSProperties}><span className="lime">POST</span> /v1/payouts</p>
            <p className="cl c11 cream" style={{ "--i": 2 } as React.CSSProperties}>Authorization: Bearer &lt;YOUR_API_KEY&gt;</p>
          </>
        )}
        <pre className="cl c12 json" style={{ "--i": s.curl ? 3 : 1 } as React.CSSProperties}>{s.body}</pre>
      </div>
      <div className="code-resp mono resp">
        <Icon n="response-dot" w={7} />
        <span className="lime">200 OK</span>
        <span className="cream">{`{ "status": "processing" }`}</span>
      </div>
      <p className="code-note">Illustrative request · Explore the docs for API specifications</p>
    </div>
  );
}
