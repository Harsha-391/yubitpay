// Dev-only (not shipped): node scripts/check-pages.mjs /use-cases /pricing …   [URL=http://localhost:3000] [ONLY=390,1440]
// Inner pages: at 390 (touch), 1440 and 1920 it screenshots the first screen after its load sequence, then every top-level
// section mid-entrance and settled (scripts/shots/pages/), and asserts: no console errors, no horizontal overflow, no text
// under 12px on phones. Then it re-loads with reduced motion and with JS off and asserts nothing is left hidden. Exits 1 on failure.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000";
const routes = process.argv.slice(2);
const SIZES = [[390, 844, true], [1440, 900, false], [1920, 1080, false]].filter(([w]) => !process.env.ONLY || process.env.ONLY.split(",").includes(String(w)));
const fails = [];
const fail = (where, msg) => { fails.push(`${where}: ${msg}`); console.log(`  ✗ ${msg}`); };
const wait = (p, ms) => p.waitForTimeout(ms);

const browser = await chromium.launch({ channel: "chromium" });

const overflow = (page) => page.evaluate((w) => Math.max(document.documentElement.scrollWidth, innerWidth) - w, page.viewportSize().width);
const tinyText = (page) => page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 11.95) out.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 24)}" ${fs.toFixed(1)}px`);
  }
  return out;
});
// Top-level sections of the page (the hero, each section, the closing band, the footer), as document tops.
const sections = (page) => page.evaluate(() => {
  const list = [...document.querySelectorAll("main section, main [data-stack] > *, .closing")].filter((e) => !e.parentElement.closest("main section, .closing"));
  return list.map((e, n) => {
    let y = 0; for (let el = e; el; el = el.offsetParent) y += el.offsetTop; // flow position (sticky children report their stuck offset otherwise)
    const s = e.closest("[data-stack]");
    if (s && e.parentElement === s) { y = 0; for (let el = s; el; el = el.offsetParent) y += el.offsetTop; for (const c of s.children) { if (c === e) break; y += c.offsetHeight; } }
    return [`${String(n).padStart(2, "0")}-${(e.getAttribute("aria-label") ?? e.className).replace(/[^a-z0-9]+/gi, "-").slice(0, 28).toLowerCase()}`, y, e.offsetHeight];
  });
});
// Every reveal-gated element must end up visible (opacity ~1) once JS has had its chance or when motion is off.
const hidden = (page) => page.evaluate(() => [...document.querySelectorAll("main [data-r], main [data-seq] > *, main .ih1, main .ihero-sub, main .btn")]
  .filter((e) => { const r = e.getBoundingClientRect(); return r.width && parseFloat(getComputedStyle(e).opacity) < 0.95; })
  .map((e) => `${e.tagName.toLowerCase()}.${e.className}`).slice(0, 8));

for (const route of routes) {
  const slug = route.replace(/\//g, "_") || "_home";
  const dir = `scripts/shots/pages/${slug}`;
  mkdirSync(dir, { recursive: true });
  for (const [w, h, touch] of SIZES) {
    const where = `${route} @${w}`;
    console.log(where);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text())); // the response hook names the URL
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url().replace(URL, "")}`));
    const res = await page.goto(URL + route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) fail(where, `HTTP ${res?.status()}`);
    await wait(page, 900);
    await page.screenshot({ path: `${dir}/${w}-00-load-mid.png` });
    await wait(page, 3000);
    await page.screenshot({ path: `${dir}/${w}-00-load-settled.png` });
    for (const [name, y, sh] of await sections(page)) {
      if (y < 10) continue;
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, Math.round(y - h * 0.55)));
      await wait(page, 380);
      await page.screenshot({ path: `${dir}/${w}-${name}-mid.png` });
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(y - (sh < h ? (h - sh) / 2 : 0)));
      await wait(page, 2600);
      await page.screenshot({ path: `${dir}/${w}-${name}-settled.png` });
      const o = await overflow(page);
      if (o > 0) fail(where, `${name}: horizontal overflow ${o}px`);
      if (touch) { const t = await tinyText(page); if (t.length) fail(where, `${name}: text under 12px: ${t.slice(0, 4).join(" | ")}`); }
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await wait(page, 2600);
    await page.screenshot({ path: `${dir}/${w}-99-end.png` });
    if (errors.length) fail(where, `console errors: ${errors.slice(0, 3).join(" | ")}`);
    await ctx.close();

    // reduced motion and no JS: everything visible straight away
    for (const [label, opts] of [["reduced motion", { reducedMotion: "reduce" }], ["no JS", { javaScriptEnabled: false }]]) {
      const c2 = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, ...opts });
      const p2 = await c2.newPage();
      await p2.goto(URL + route, { waitUntil: "load" });
      await wait(p2, 4000); // the CSS load sequence still plays without JS; it has to have finished
      const left = await hidden(p2);
      if (left.length) fail(where, `${label}: still hidden: ${left.join(", ")}`);
      else console.log(`  ✓ ${label}: nothing hidden`);
      if (w === 390 || w === 1440) await p2.screenshot({ path: `${dir}/${w}-zz-${label.replace(" ", "-")}.png`, fullPage: true });
      await c2.close();
    }
  }
}
await browser.close();
if (fails.length) { console.log(`\n${fails.length} failure(s):\n${fails.join("\n")}`); process.exit(1); }
console.log("\nall checks passed");
