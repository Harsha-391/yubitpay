// Dev-only: captures the desktop reference shots that scripts/check.mjs compares against.
import { chromium } from "playwright";
const URL = process.env.URL ?? "http://localhost:3000";
const STOPS = [0, 3, 6, 9, 14]; // viewport heights of scroll
const browser = await chromium.launch({ channel: "chromium" }) // full Chromium (new headless); no separate headless-shell download;
for (const [w, h] of [[1440, 900], [1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(5500); // hero load sequence ends ≈ 5s
  for (const s of STOPS) {
    await page.evaluate((y) => window.scrollTo(0, y), s * h);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `scripts/baseline/${w}x${h}-${s}.png` });
  }
  await page.close();
}
await browser.close();
