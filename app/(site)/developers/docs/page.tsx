import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/Sections";
import { Band, Btn, DOCS, InnerHero, START } from "@/components/inner/Parts";
import { PageMotion } from "@/components/inner/PageMotion";
import { Reveal } from "@/lib/motion/Reveal";
import "./docs.css";

export const metadata: Metadata = { title: "Documentation — Yubit Pay" };

// Copy word for word from Figma "Developers / Documentation" (desktop 144:9263, phone 293:14577). Its palette is the frame's own hex values.
const SANDBOX = "/developers/sandbox";
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

// Sidebar entries. Only "Getting Started" (this page) and "Sandbox" have a frame in Figma; the others stay "#".
const GUIDES: [string, string][] = [
  ["Getting Started", DOCS], ["Authentication / API key", "#"], ["Payouts API", "#"], ["Collections API", "#"],
  ["UPI API", "#"], ["Webhooks", "#"], ["Sandbox", SANDBOX], ["Error codes", "#"],
];
const TOC: [string, string][] = [
  ["Sandbox setup", "sandbox-setup"], ["Authentication", "authentication"], ["First request", "first-request"], ["Language samples", "language-samples"],
  ["Webhook events", "webhook-events"], ["Errors and retries", "errors-and-retries"], ["Live access", "live-access"],
];
const LANGS = [["cURL", "curl"], ["Node", "node"], ["Python", "python"], ["Java", "java"]];
const SAMPLES: { id: string; name: string; tab: number; body: string }[] = [
  { id: "curl", name: "cURL", tab: 0, body: `export BASE_URL="https://sandbox.example.com"\nexport API_KEY="<SANDBOX_KEY>"\ncurl -X POST "$BASE_URL/v1/payouts" \\\n  -H "Authorization: Bearer $API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"amount":2500000,\n       "currency":"INR", "mode":"IMPS",\n       "reference_id":"vendor_1042"}'` },
  { id: "node", name: "Node", tab: 1, body: `// Server-side JavaScript / fetch\nconst base = process.env.BASE_URL;\nconst key = process.env.API_KEY;\nconst payload = {\n  amount: 2500000, currency: "INR",\n  mode: "IMPS", reference_id: "vendor_1042"\n};\nconst res = await fetch(base + "/v1/payouts", {\n  method: "POST",\n  headers: {\n    Authorization: "Bearer " + key,\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify(payload)\n});\nconst result = await res.json();\nif (!res.ok) throw new Error(result.code);\nconsole.log(result.id, result.status);` },
  { id: "python", name: "Python", tab: 2, body: `import os, requests\nbase = os.environ["BASE_URL"]\nkey = os.environ["API_KEY"]\npayload = {\n  "amount": 2500000, "currency": "INR",\n  "mode": "IMPS",\n  "reference_id": "vendor_1042"\n}\nresponse = requests.post(\n  base + "/v1/payouts",\n  headers={"Authorization": "Bearer " + key},\n  json=payload, timeout=30\n)\nresponse.raise_for_status()\nresult = response.json()\nprint(result["id"], result["status"])` },
  { id: "java", name: "Java", tab: 2, body: `// Java 17 / java.net.http\nvar base = System.getenv("BASE_URL");\nvar key = System.getenv("API_KEY");\nvar payload = """\n  {"amount":2500000, "currency":"INR",\n   "mode":"IMPS",\n   "reference_id":"vendor_1042"}\n  """;\nvar request = HttpRequest.newBuilder()\n  .uri(URI.create(base + "/v1/payouts"))\n  .header("Authorization", "Bearer " + key)\n  .header("Content-Type", "application/json")\n  .POST(BodyPublishers.ofString(payload))\n  .build();\nvar response = HttpClient.newHttpClient()\n  .send(request, BodyHandlers.ofString());\nSystem.out.println(response.statusCode());\nSystem.out.println(response.body());` },
];

// Figma "Illustrative API request and response" in this frame's palette; its three tab labels are labels, not tabs.
function DocCode({ file, tab, request, post = true, body, resp }: { file: string; tab: number; request: string; post?: boolean; body: string; resp: string }) {
  const note = "# Illustrative API, not a specification";
  return (
    <div className="code api dc" data-r="up">
      <div className="code-head">
        <Icon n="window-controls-dv" w={33} h={7} />
        <span className="mono code-file">{file}</span>
        <CopyButton icon="copy-dv" text={`${note}\nPOST ${request}\nAuthorization: Bearer <KEY>\n${body}`} />
      </div>
      <div className="code-tabs mono">
        {["cURL", "Node", "Python / Java"].map((t, k) => <span key={t} className="tab" aria-current={k === tab || undefined}>{t}</span>)}
      </div>
      <div className="code-body mono">
        <p className="cl c12 dc-dim" style={i(0)}>{note}</p>
        <p className="cl c13" style={i(1)}>{post ? <><span className="lime">POST</span> {request}</> : `POST ${request}`}</p>
        <p className="cl c11 dc-dim" style={i(2)}>Authorization: Bearer &lt;KEY&gt;</p>
        <pre className="cl c12 json" style={i(3)}>{body}</pre>
      </div>
      <div className="code-resp mono resp">
        <Icon n="response-dot" w={7} />
        <span className="lime">200 OK</span>
        <span className="api-resp dc-dim">{resp}</span>
      </div>
      <p className="code-note">Illustrative API · Placeholder endpoints</p>
    </div>
  );
}
const Notice = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <div className="p2-notice" data-r="up"><p className="p2-notice-t">{t}</p><p className="p2-p14">{children}</p></div>
);
const Guides = () => (
  <nav className="dv-guides" aria-label="Developer guides">
    {GUIDES.map(([t, href], n) => (
      <Link key={t} className="dv-item" href={href} aria-current={n === 0 ? "page" : undefined} data-r="left" style={i(n)}>{t}</Link>
    ))}
  </nav>
);
const Toc = () => (
  <nav className="dv-toc-list" aria-label="On this page" data-spy>
    <i className="spy-bar" aria-hidden="true" />
    {TOC.map(([t, id], n) => <a key={id} href={`#${id}`} data-r="right" style={i(n)}>{t}</a>)}
  </nav>
);

/*
  /developers/docs. Hero: the title types out letter by letter · the workspace covers the hero (desktop); the sidebar entries
  slide in from the left and the "On this page" entries from the right, both sticky beside the article, the current section
  marked as it scrolls (a bar slides to it); the article's blocks surface as they arrive and each code card's lines
  settle in order · the band grows out of the workspace's ivory.
*/
export default function Page() {
  return (
    <main className="inner p2 dv">
      <InnerHero
        load="type" eyebrow="DEVELOPER DOCUMENTATION" lines={["Less friction.", "More building."]}
        sub="Start with credentials. Make a request. Connect the events. Explore how Payouts, Collections and UPI fit your product."
        actions={<><Btn href={START}>Get Started</Btn><Btn href={SANDBOX} kind="edge">Request sandbox access</Btn></>}
      />

      <section className="dv-ws" data-tone="light" aria-label="Documentation">
        <div className="dv-search p2-field" data-r="up">
          <label className="p2-label" htmlFor="dv-q">Search documentation</label>
          <input id="dv-q" className="p2-input dv-input" type="search" placeholder="Search guides, endpoints and errors…" />
          <p className="p2-hint">Focused search · Static visual state · No live search</p>
        </div>

        {/* phones and tablets: the sidebar and the "On this page" list fold into two disclosures (Figma "Collapsed documentation controls") */}
        <div className="dv-fold">
          <details>
            <summary className="btn btn-edge dv-sum">Guides +<Icon n="arrow-up-right-dark" w={18} /></summary>
            <Guides />
          </details>
          <details>
            <summary className="btn btn-edge dv-sum">On this page +<Icon n="arrow-up-right-dark" w={18} /></summary>
            <Toc />
          </details>
        </div>

        <div className="dv-layout">
          <aside className="dv-side">
            <p className="p2-eb" data-r="up">DEVELOPER GUIDES</p>
            <Guides />
            <div data-r="pop" style={i(8)}><Btn href={SANDBOX}>Sandbox access</Btn></div>
          </aside>

          <article className="dv-article">
            <p className="dv-crumb" data-r="up">Developers / Guides / Getting Started</p>
            <div className="dv-intro">
              <p className="p2-eb" data-r="up">START SMALL. BUILD WITH CONTEXT.</p>
              <h2 className="ih2 lines" data-r="lines"><span className="ln"><span>Getting Started</span></span></h2>
              <p className="p2-p" data-r="up" style={i(2)}>Your first payment workflow, from a sandbox key to a reviewable outcome. This guide explains the integration approach before you plan live access.</p>
            </div>
            <Notice t="Illustrative APIs — not a published specification">All URLs, fields, status values and code below are examples. example.com is a placeholder domain, not a Yubit Pay endpoint. Confirm the actual API contract, amount units and verification method before implementation.</Notice>

            <h3 id="sandbox-setup" className="p2-h" data-r="up">1. Set up your sandbox</h3>
            <p className="p2-p" data-r="up">Request access with your work email, company and intended use case. Choose Payouts, Collections or UPI. Sandbox account activated instantly; live access subject to onboarding. Use test recipients and synthetic payment data only.</p>
            <div data-r="pop"><Btn href={SANDBOX}>Request sandbox access</Btn></div>

            <h3 id="authentication" className="p2-h" data-r="up">2. Authenticate on your server</h3>
            <p className="p2-p" data-r="up">Open Settings → API keys in your sandbox workspace. Save the key in a server-side environment variable. Send it in the Authorization header; never embed it in a browser, mobile app or public repository. Keep Sandbox and Live credentials separate and rotate keys when access changes.</p>
            <Notice t="Example environment variables">BASE_URL = https://sandbox.example.com (placeholder)<br />API_KEY = &lt;SANDBOX_KEY&gt; (never a real secret in this guide)</Notice>

            <h3 id="first-request" className="p2-h" data-r="up">3. Make your first request</h3>
            <p className="p2-p" data-r="up">Choose an eligible recipient and supported rail. Attach a reference to the business operation, such as vendor_1042. Confirm required recipient fields, supported amounts and duplicate-request handling in the API reference. The minimal payload below demonstrates the pattern, not a complete production request.</p>
            {/* Figma shows all four samples expanded with cURL selected; the tabs jump to each sample */}
            <nav id="language-samples" className="dv-langs" aria-label="Language samples" data-r="up">
              {LANGS.map(([t, id], n) => <a key={id} className="dv-lang mono" href={`#sample-${id}`} aria-current={n === 0 ? "true" : undefined}>{t}</a>)}
            </nav>
            <p className="p2-p14" data-r="up">All four language samples are expanded below for review. cURL is the selected tab; tabs are static visual states.</p>
            {SAMPLES.map((s) => (
              <div key={s.id} id={`sample-${s.id}`} className="dv-sample">
                <h4 className="dv-h4" data-r="up">{s.name} sample</h4>
                <DocCode file={`${s.name} · illustrative sample`} tab={s.tab} request="/v1/payouts" body={s.body} resp={`{ "id": "pay_1042", "status": "processing" }`} />
              </div>
            ))}
            <Notice t="Accepted does not mean completed">Store the payment ID with your business reference. A processing response is not a completed transfer. Resolve the final outcome through status checks and verified webhook events; reconcile it with the original operation.</Notice>

            <h3 id="webhook-events" className="p2-h" data-r="up">4. Handle webhook events</h3>
            <p className="p2-p" data-r="up">Configure a server endpoint in Settings. Validate callbacks using the documented verification method, then persist each event before processing it. Handle duplicates safely and acknowledge only after your service has accepted the event. Do not mark an operation successful from an unverified callback.</p>
            <DocCode
              file="cURL · illustrative sample" tab={0} request="/your/webhook-endpoint" post={false} resp={`{ "received": true }`}
              body={`{\n  "event": "payout.processed",\n  "event_id": "evt_sample_1042",\n  "payment_id": "pay_1042",\n  "reference_id": "vendor_1042",\n  "status": "success"\n}`}
            />

            <h3 id="errors-and-retries" className="p2-h" data-r="up">5. Test errors and uncertain outcomes</h3>
            <p className="p2-p" data-r="up">A timeout does not prove a payout failed. Check the original payment status and reference before creating another request. Test invalid credentials, incomplete recipients, pending outcomes and repeated events before live access.</p>
            <div className="dv-errors">
              {[
                ["401 · Authentication", "Check the environment and server-side key. Never include secrets in logs."],
                ["400 · Validation", "Review required fields and supported values. Correct the request before retrying."],
                ["429 · Request limit", "Follow documented retry guidance. Avoid a burst of identical requests."],
                ["5xx / timeout · Uncertain", "Inspect the original operation first; use documented retry and duplicate protection."],
              ].map(([t, d], n) => (
                <div key={t} className="dv-err" data-r="drop" style={i(n)}><p className="dv-err-t">{t}</p><p className="p2-p14">{d}</p></div>
              ))}
            </div>

            <h3 id="live-access" className="p2-h" data-r="up">Choose your next reference</h3>
            <p className="p2-p" data-r="up">Payouts API → outgoing transfers and status checks. Collections API → unique virtual accounts and funds alerts. UPI API → merchant IDs, QR generation, collect requests and verification. Webhooks → callbacks and event handling. Error codes → response diagnosis.</p>
            <Notice t="Before you go live">Confirm business eligibility, enabled capabilities, access scopes, recipient flows, data handling and event verification during onboarding. Live access is separate from sandbox activation.</Notice>
            <div data-r="pop"><Btn href={START}>Get Started</Btn></div>
            <div data-r="pop" style={i(1)}><Btn href={SANDBOX} kind="edge">Request sandbox access</Btn></div>
          </article>

          <aside className="dv-toc">
            <p className="p2-eb" data-r="up">ON THIS PAGE</p>
            <Toc />
          </aside>
        </div>
      </section>

      <div className="dv-wrap">
        <Band h="Your next integration starts here." sub="Start in the sandbox. Bring your team and your use case; plan the path to live access.">
          <Btn href={START}>Get Started</Btn>
          <Btn href={DOCS} kind="edge">Read the docs</Btn>
        </Band>
      </div>

      <CtaBand label="Get Started" href={START} />
      <Reveal />
      <PageMotion />
    </main>
  );
}
