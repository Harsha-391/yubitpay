// Product pages: copy word for word from Figma (Products / Payouts 144:11886, Collections 144:11464, UPI 144:11083).
// One template, three data sets. FAQ answers 2–4 do not exist in Figma, so those questions have no answer here.
export type Table = { head: string[]; rows: string[][] };
export type CardKey = "payouts" | "collections" | "open-banking";
export type Product = {
  title: string;
  hero: { eyebrow: string; lines: [string, string]; sub: string; request: string; body: string; response: string };
  process: { eyebrow: string; h: string; sub?: string; steps: { t: string; d: string }[] };
  panels: { eyebrow: string; h: string; sub: string; items: { t: string; d: string }[] };
  band: { h: string };
  pricing: { eyebrow: string; h: string; name: string; sub: string; tables: Table[]; second: { label: string; href: string } };
  connected: { eyebrow: string; h: string; cards: [CardKey, CardKey] };
};

const V = "[YOUR PRICING VALUES]";
export const PRICING_NOTE = "GST as applicable. Rates are not final; all price fields intentionally use [YOUR PRICING VALUES].";
export const BAND_SUB = "Start in the sandbox. Bring your team and your use case; we’ll help you plan the path to live access.";
export const FAQ = [
  { q: "What can I build with Yubit Pay?", a: "Use our APIs to collect payments, send payouts and connect banking workflows to your product. Start with one use case and add more as your business grows." },
  { q: "Can I test before going live?" },
  { q: "Which payment rails can I use?" },
  { q: "What happens during onboarding?" },
];

export const PAYOUTS: Product = {
  title: "Payouts",
  hero: {
    eyebrow: "PAYOUTS API", lines: ["Move money.", "Keep building."],
    sub: "Pay vendors, partners and customers through one developer-friendly API. Follow every transfer from request to confirmation.",
    request: "/v1/payouts",
    body: `{\n  "amount": 2500000,\n  "currency": "INR",\n  "mode": "IMPS",\n  "reference_id": "vendor_1042"\n}`,
    response: `{ "status": "processing" }`,
  },
  process: {
    eyebrow: "FROM REQUEST TO RECONCILED", h: "A clear path for every payout.", sub: "Start with a verified recipient. End with a traceable payment record.",
    steps: [
      { t: "Add a recipient", d: "Use bank account details and IFSC, or an eligible UPI ID. Validate details before sending." },
      { t: "Create a payout", d: "Choose IMPS, NEFT, RTGS or UPI. Attach a unique business reference." },
      { t: "Track the event", d: "Check status and handle processing, success and failure webhooks." },
      { t: "Reconcile", d: "Match final outcomes to your ledger and investigate exceptions." },
    ],
  },
  panels: {
    eyebrow: "BUILT FOR YOUR OPERATIONS", h: "Less chasing. More clarity.", sub: "Connect your product and finance workflow without losing the details.",
    items: [
      { t: "Four rails. One integration.", d: "Send IMPS, NEFT, RTGS and UPI transfers to eligible bank accounts or UPI IDs. Choose the rail that fits your workflow." },
      { t: "24/7 instant transfers", d: "Build around instant-transfer rails where available. Processing remains subject to bank, rail and beneficiary availability." },
      { t: "Routing with context", d: "Plan smart routing around supported rails, amount limits and bank availability. Keep routing decisions visible to your operations team." },
      { t: "Know where money is", d: "Check real-time status and consume webhook events. Reconcile using your reference ID rather than treating request acceptance as settlement." },
    ],
  },
  band: { h: "Your next payout starts with one request." },
  pricing: {
    eyebrow: "PRICING THAT FITS THE FLOW", h: "Plan your payout costs.", name: "Payouts",
    sub: "Illustrative slab structure. Confirm eligible amount limits and schedules during onboarding.",
    tables: [
      { head: ["Amount / schedule", "IMPS", "UPI"], rows: [["Up to ₹1,000", V, V], ["₹1,001–₹25,000", V, V]] },
      { head: ["Transfer rail", "In banking hours", "Outside banking hours"], rows: [["NEFT", V, V], ["RTGS", V, V]] },
    ],
    second: { label: "View all pricing", href: "/pricing" },
  },
  connected: { eyebrow: "CONNECTED BUILDING BLOCKS", h: "Money in. Money out.", cards: ["payouts", "collections"] },
};

export const COLLECTIONS: Product = {
  title: "Collections",
  hero: {
    eyebrow: "COLLECTIONS API", lines: ["Every payment.", "In the right place."],
    sub: "Create a unique virtual account for each customer. Receive funds, get alerts and match collections to your ledger without the guesswork.",
    request: "/v1/virtual-accounts",
    body: `{\n  "customer_id": "cust_1042",\n  "name": "Aster Supplies",\n  "reference_id": "invoice_208"\n}`,
    response: `{ "id": "va_1042",\n "status": "active" }`,
  },
  process: {
    eyebrow: "FROM CUSTOMER TO LEDGER", h: "One account. A clearer trail.",
    steps: [
      { t: "Create", d: "Map a unique virtual account to your customer ID." },
      { t: "Share", d: "Show the account details in your invoice or customer experience." },
      { t: "Receive", d: "Accept eligible UPI, NEFT, IMPS and RTGS payments." },
      { t: "Reconcile", d: "Use instant funds alerts and references to update your ledger." },
    ],
  },
  panels: {
    eyebrow: "THE DETAILS, CONNECTED", h: "Built to keep collections in sync.", sub: "Give finance and engineering a shared view of incoming money.",
    items: [
      { t: "Unique customer accounts", d: "Tie each incoming transfer to a dedicated customer ID. Keep multiple payments connected to the right account." },
      { t: "Bank account verification", d: "Check beneficiary bank details as part of your onboarding and payment workflow. Review exceptions before proceeding." },
      { t: "Funds alerts", d: "Receive collection events when incoming funds are reported. Validate and process each event before updating balances." },
      { t: "Reconciliation that follows the reference", d: "Match virtual account, customer and payment references. Keep duplicate and unmatched events visible for review." },
    ],
  },
  band: { h: "Make reconciliation part of the product." },
  pricing: {
    eyebrow: "SIMPLE COMMERCIAL PLANNING", h: "Know what you’re building on.", name: "Collections",
    sub: "Operation-based pricing. Your commercial terms are confirmed before live access.",
    tables: [{ head: ["Operation", "Rate"], rows: [["Create virtual account", V], ["Collections to virtual account", V], ["Verify bank details", V]] }],
    second: { label: "Discuss your volume", href: "/contact" },
  },
  connected: { eyebrow: "EXPAND YOUR WORKFLOW", h: "A connected foundation.", cards: ["collections", "open-banking"] },
};

export const UPI: Product = {
  title: "UPI",
  hero: {
    eyebrow: "UPI API", lines: ["Meet customers", "where they pay."],
    sub: "Create merchant UPI IDs, generate QR codes and connect payment callbacks to your product. Familiar payments. A clearer developer workflow.",
    request: "/v1/upi/ids",
    body: `{\n  "merchant_ref": "store_1042",\n  "display_name": "Aster Store",\n  "reference_id": "upi_208"\n}`,
    response: `{ "id": "upi_1042",\n "status": "active" }`,
  },
  process: {
    eyebrow: "MAKE THE CONNECTION", h: "From UPI ID to payment event.",
    steps: [
      { t: "Create an ID", d: "Issue a merchant UPI ID for an eligible business." },
      { t: "Generate a QR", d: "Present payment details in a QR or supported collect request." },
      { t: "Receive callbacks", d: "Listen for instant payment notifications and validate the event." },
      { t: "Update your product", d: "Match references and reflect the confirmed payment status." },
    ],
  },
  panels: {
    eyebrow: "A NATIVE PAYMENT EXPERIENCE", h: "Familiar to customers. Useful to builders.", sub: "Connect the front-end payment moment to your back-office workflow.",
    items: [
      { t: "Merchant UPI IDs", d: "Create and manage IDs linked to your merchant reference. Keep status and ownership clear." },
      { t: "QR generation", d: "Generate QR payment payloads for your merchant experience. Keep reference information with each request." },
      { t: "Collect requests and verification", d: "Create eligible collect requests and verify UPI details before starting the payment flow." },
      { t: "Instant callbacks", d: "Use event-driven updates rather than relying on the customer screen alone. Track callback delivery and reconcile status." },
    ],
  },
  band: { h: "Bring your UPI workflow into the sandbox." },
  pricing: {
    eyebrow: "PRICING BY OPERATION", h: "Plan for every payment touchpoint.", name: "UPI",
    sub: "Operation-based pricing. Your commercial terms are confirmed before live access.",
    tables: [{ head: ["Operation", "Rate"], rows: [["Create UPI ID", V], ["Collections to UPI ID", V], ["UPI verification", V]] }],
    second: { label: "Contact sales", href: "/contact" },
  },
  connected: { eyebrow: "MONEY IN MOTION", h: "Build beyond the payment moment.", cards: ["collections", "payouts"] },
};
