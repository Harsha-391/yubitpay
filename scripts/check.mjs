// Dev-only (not shipped): node scripts/check.mjs  [URL=http://localhost:3000]
// Screenshots every scene at 7 sizes into scripts/shots/, asserts layout + touch behaviour, re-checks with reduced motion,
// and diffs desktop against scripts/baseline/ (made by scripts/baseline.mjs). Exits 1 if any assertion fails.
import { mkdirSync } from "node:fs";
import sharp from "sharp";
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000";
const SIZES = [
  [375, 667, true], [390, 844, true], [430, 932, true], [768, 1024, true], // isMobile + hasTouch
  [1024, 768, false], [1440, 900, false], [1920, 1080, false],
].filter(([w]) => !process.env.ONLY || process.env.ONLY.split(",").includes(String(w))); // ONLY=390,1440 for a quick pass
// Desktop frames that are allowed to differ from the baseline because the story beats were reworked on purpose (Phase 2).
const EXPECTED_DIFF = new Set(process.env.EXPECTED_DIFF?.split(",") ?? ["3"]);
const fails = [];
const fail = (where, msg) => { fails.push(`${where}: ${msg}`); console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

const browser = await chromium.launch({ channel: "chromium" }); // full Chromium (new headless): no separate headless-shell download
const wait = (p, ms) => p.waitForTimeout(ms);
const scrollTo = async (page, y) => { await page.evaluate((y) => window.scrollTo(0, y), Math.round(y)); await wait(page, 1300); };
const docTop = (page, sel) => page.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY : null; }, sel);

// Text that is on screen and smaller than 12px (phones only).
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
// against the configured width: on a phone, overflowing content silently widens innerWidth itself
const overflow = (page) => page.evaluate((w) => Math.max(document.documentElement.scrollWidth, innerWidth) - w, page.viewportSize().width);

// Touch via CDP: Playwright's touchscreen only taps, and a drag needs real touchstart/move/end through Chrome's input pipeline.
async function swipe(page, cdp, x, y, dx, dy) {
  const pt = (px, py) => [{ x: px, y: py, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(x, y) });
  for (let i = 1; i <= 12; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(x + (dx * i) / 12, y + (dy * i) / 12) }); await wait(page, 16); }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await wait(page, 900);
}

async function scenes(page, dir) {
  const H = await page.evaluate(() => innerHeight);
  const story = await docTop(page, "#story"), storyH = await page.evaluate(() => document.querySelector("#story").offsetHeight);
  const tracks = await docTop(page, "#tracks"), tracksH = await page.evaluate(() => document.querySelector("#tracks").offsetHeight);
  const stops = [
    ["01-story-y", story + (storyH - H) * 0.32], ["02-story-strokes", story + (storyH - H) * 0.6], ["03-story-cards", story + (storyH - H) * 0.85],
    ["04-statement", (await docTop(page, "#statement")) + H * 0.9], ["05-tape", (await docTop(page, ".banner")) - H * 0.3],
    ["06-dev", await docTop(page, "#dev")], ["07-dev-code", (await docTop(page, ".code")) - H * 0.15],
    ["08-play", (await docTop(page, ".board")) - H * 0.12], ["09-tracks", tracks + (tracksH - H) * 0.5],
    ["10-faq", await docTop(page, ".faq")], ["11-closing", await docTop(page, ".closing")], ["12-footer", 1e7],
  ];
  for (const [name, y] of stops) {
    await scrollTo(page, y);
    await page.screenshot({ path: `${dir}/${name}.png` });
    const o = await overflow(page);
    if (o > 0) fail(dir, `${name}: horizontal overflow ${o}px`);
    if (page.viewportSize().width < 768) {
      const t = await tinyText(page);
      if (t.length) fail(dir, `${name}: text under 12px: ${t.slice(0, 4).join(" | ")}`);
    }
  }
}

async function touchChecks(page, label) {
  const cdp = await page.context().newCDPSession(page);
  await scrollTo(page, (await docTop(page, ".board")) - 60);
  await wait(page, 600);
  // a card that is landed and on screen
  const card = await page.evaluate(() => {
    const c = [...document.querySelectorAll(".pg-card")].find((c) => c.offsetParent && !c.querySelector("a") && c.getBoundingClientRect().top > 80 && c.getBoundingClientRect().bottom < innerHeight - 20);
    if (!c) return null; c.dataset.probe = "1"; const r = c.getBoundingClientRect(), b = c.parentElement.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, dir: r.left + r.width / 2 < b.left + b.width / 2 ? 1 : -1 }; // drag toward the middle: the bounds stop it at the edge
  });
  if (!card) return fail(label, "no playground card on screen to drag");
  const before = await page.evaluate(() => document.querySelector("[data-probe]").getBoundingClientRect().left);
  await swipe(page, cdp, card.x, card.y, 70 * card.dir, 0);
  const after = await page.evaluate(() => document.querySelector("[data-probe]").getBoundingClientRect().left);
  if (Math.abs(after - before) > 25) ok(`touch drag moved a card ${Math.round(after - before)}px`); else fail(label, `touch drag did not move the card (${Math.round(after - before)}px)`);

  // an empty spot on the board: a vertical swipe there must scroll the page
  const spot = await page.evaluate(() => {
    const b = document.querySelector(".board"), r = b.getBoundingClientRect();
    for (let y = r.top + 30; y < Math.min(r.bottom, innerHeight) - 30; y += 20)
      for (let x = r.left + 20; x < r.right - 20; x += 20) if (document.elementFromPoint(x, y) === b) return { x, y };
    return null;
  });
  if (!spot) return fail(label, "no empty spot on the board to swipe");
  const y0 = await page.evaluate(() => scrollY);
  await swipe(page, cdp, spot.x, spot.y, 0, -220);
  const y1 = await page.evaluate(() => scrollY);
  if (y1 - y0 > 60) ok(`vertical swipe on the board scrolled ${Math.round(y1 - y0)}px`); else fail(label, `vertical swipe on the board did not scroll (${Math.round(y1 - y0)}px)`);
}

// phone/tablet menu: opens, keeps focus inside, Escape closes it
async function menuChecks(page, label) {
  await scrollTo(page, 0);
  await page.click(".nav-burger");
  await wait(page, 1300);
  await page.screenshot({ path: `${label}/13-menu.png` });
  const open = await page.evaluate(() => document.querySelector(".sheet").dataset.open === "true" && document.documentElement.classList.contains("sheet-open"));
  if (open) ok("menu opens and locks scroll"); else return fail(label, "menu did not open");
  for (let i = 0; i < 14; i++) await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => !!document.activeElement?.closest(".navlayer"));
  if (inside) ok("focus stays in the menu"); else fail(label, "focus escaped the open menu");
  await page.click(".sheet-h");
  await wait(page, 700);
  await page.screenshot({ path: `${label}/14-menu-group.png` });
  await page.keyboard.press("Escape");
  await wait(page, 600);
  const shut = await page.evaluate(() => document.querySelector(".sheet").dataset.open === "false" && document.activeElement?.classList.contains("nav-burger"));
  if (shut) ok("Escape closes the menu and returns focus"); else fail(label, "Escape did not close the menu");
}

async function diff(a, b) {
  const [x, y] = await Promise.all([sharp(a).raw().toBuffer({ resolveWithObject: true }), sharp(b).raw().toBuffer({ resolveWithObject: true })]);
  if (x.info.width !== y.info.width || x.info.height !== y.info.height) return 1;
  let bad = 0; const c = x.info.channels;
  for (let i = 0; i < x.data.length; i += c) if (Math.abs(x.data[i] - y.data[i]) + Math.abs(x.data[i + 1] - y.data[i + 1]) + Math.abs(x.data[i + 2] - y.data[i + 2]) > 48) bad++;
  return bad / (x.data.length / c);
}

for (const [w, h, touch] of SIZES) {
  const dir = `scripts/shots/${w}x${h}`; mkdirSync(dir, { recursive: true });
  console.log(`\n${w}×${h}${touch ? " (touch)" : ""}`);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(URL, { waitUntil: "networkidle" });
  await wait(page, 5500); // the hero load sequence ends ≈ 5s
  await page.screenshot({ path: `${dir}/00-hero.png` });
  if ((await overflow(page)) > 0) fail(dir, "hero: horizontal overflow");
  if (w < 768) { const t = await tinyText(page); if (t.length) fail(dir, `hero: text under 12px: ${t.slice(0, 4).join(" | ")}`); }
  await scenes(page, dir);

  if (!touch && w >= 1440) {
    for (const s of [0, 3, 6, 9, 14]) {
      await scrollTo(page, s * h); await wait(page, 500);
      const path = `${dir}/base-${s}.png`; await page.screenshot({ path });
      const d = await diff(path, `scripts/baseline/${w}x${h}-${s}.png`);
      const msg = `baseline ${s}vh differs on ${(d * 100).toFixed(2)}% of pixels`;
      if (d <= 0.03) ok(msg); else if (EXPECTED_DIFF.has(String(s))) console.log(`  ~ ${msg} (expected: story beats reworked)`); else fail(dir, msg);
    }
  }
  if (touch) await touchChecks(page, dir);
  if (w < 1100) await menuChecks(page, dir);
  if (errors.length) fail(dir, `console errors: ${[...new Set(errors)].slice(0, 3).join(" | ")}`); else ok("no console errors");
  await ctx.close();
}

// reduced motion: the plain final layout, nothing hidden, controls still work
for (const [w, h, touch] of [[390, 844, true], [1440, 900, false]]) {
  const label = `reduced ${w}×${h}`; console.log(`\n${label}`);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: touch, hasTouch: touch, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await wait(page, 800);
  const hidden = await page.evaluate(() => {
    if (document.documentElement.classList.contains("m")) return ["html still has .m"];
    const bad = [];
    for (const el of document.querySelectorAll("main section, main footer, [data-r], .mcard, .pg-card:not([data-drop]), .principle, .chip")) {
      const cs = getComputedStyle(el);
      if (el.closest(".sheet")) continue;
      if (cs.display === "none" && !el.matches(".label, .principles .principle")) bad.push(el.className || el.tagName);
      else if (cs.opacity !== "1" || cs.visibility !== "visible") bad.push(`${el.className} (opacity ${cs.opacity})`);
    }
    return bad;
  });
  if (hidden.length) fail(label, `hidden under reduced motion: ${hidden.slice(0, 5).join(" | ")}`); else ok("every section and revealed element is visible");
  if ((await overflow(page)) > 0) fail(label, "horizontal overflow");
  await page.screenshot({ path: `scripts/shots/reduced-${w}x${h}.png`, fullPage: true });
  await ctx.close();
}

await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : "\nall checks passed");
process.exit(fails.length ? 1 : 0);
