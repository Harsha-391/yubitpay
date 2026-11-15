// One link map for the desktop dropdowns, the phone menu and the footer.
// Figma shows the nav chevrons but no open menus, so the menu entries are the Figma page names; "#" = no frame in Figma yet.
export type Group = { h: string; links: { t: string; href: string }[] };
const g = (h: string, ...l: [string, string][]): Group => ({ h, links: l.map(([t, href]) => ({ t, href })) });

export const ROUTES = {
  login: "/login",
  start: "/signup",
  docs: "/developers/docs",
  contact: "/contact",
  privacy: "/privacy",
};

export const NAV: Group[] = [
  g("Products", ["Payouts", "/products/payouts"], ["Collections", "/products/collections"], ["UPI", "/products/upi"]),
  g("Solutions", ["Use cases", "/use-cases"], ["Marketplace", "/use-cases/marketplace"]),
  g("Developers", ["Documentation", "/developers/docs"], ["Sandbox access", "/developers/sandbox"]),
  g("Company", ["About", "/about"], ["Pricing", "/pricing"], ["Contact", "/contact"]),
];

// The footer columns are Figma copy (component "Home / Footer").
export const FOOTER: Group[] = [
  g("Platform", ["Collections", "/products/collections"], ["Payouts", "/products/payouts"], ["Open banking", "#"]),
  g("Developers", ["API documentation", "/developers/docs"], ["API reference", "#"], ["Get started", "/developers/sandbox"]),
  g("Company", ["About Yubit Pay", "/about"], ["Contact us", "/contact"], ["Talk to sales", "/contact"]),
];
