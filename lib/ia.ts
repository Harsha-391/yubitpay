// One link map for the desktop mega menus, the phone menu and the footer. Placeholder hrefs until the pages exist.
export type Group = { h: string; links: { t: string; href: string }[] };
const g = (h: string, ...t: string[]): Group => ({ h, links: t.map((x) => ({ t: x, href: "#" })) });

export const NAV: Group[] = [
  g("Products", "Collections", "Payouts", "Open banking"),
  g("Solutions", "Startups & fintechs", "Platforms & marketplaces", "SaaS & tech companies"),
  g("Developers", "API documentation", "API reference", "Get started"),
  g("Company", "About Yubit Pay", "Contact us", "Talk to sales"),
];

// The footer keeps its Figma headings ("Platform" = the Products group).
export const FOOTER: Group[] = [{ ...NAV[0], h: "Platform" }, NAV[2], NAV[3]];
