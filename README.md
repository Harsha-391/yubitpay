# Yubit Pay — homepage (Next.js)

Built from the Figma file `94SjQ6YLHVWuktOzdIAwZz` (node `245:7347`) and `guidlines/Yubit Pay Motion Direction.docx`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
node scripts/build-assets.mjs   # only if assets/raw or assets/icons change (regenerates AVIF/WebP + icon sprite)
node scripts/check.mjs          # dev-only checks + screenshots against a running server (see "Checking" below)
```

## Where things are
| | |
|---|---|
| `components/Story.tsx` + `StoryMotion.tsx` | pinned opening scene: hero → the logo's triangle grows, flips and grows a stem into a **Y** → the Y's three strokes become the product-card borders → cards fill |
| `components/Hero.tsx` | hero content (Figma) with the vector logo instead of the sculpture image |
| `components/Nav.tsx` | desktop bar with glass dropdowns + section highlight + progress line; phone/tablet menu sheet |
| `components/Scenes.tsx` | statement (word-by-word light-up), tilted banner tape, pinned horizontal solutions track, letter-rise heading, outro wordmark |
| `components/Playground.tsx` | drag playground: board zooms in, cards fly in with scroll, then throwable (momentum, tilt, bounds, parallax); ₹ counts up |
| `components/Sections.tsx` + `CodeCard.tsx`, `Accordion.tsx`, `FootCol.tsx`, `Reveal.tsx` | developer experience (tabs, copy, "Send test request"), FAQ (one open, `#faq-1…4`), closing panel + footer; scroll reveals |
| `components/TrackCard.tsx`, `YMark.tsx` | solutions card (unfolds on hover/tap), the Y mark |
| `lib/viewport.ts`, `lenis.ts`, `ia.ts`, `countUp.ts` | breakpoints + `--u` read from CSS + resize filtering; shared Lenis handle; nav/footer links; ₹ count-up |
| `components/Flow.tsx` | between-scene choreography, each scene different: statement covers the story · tape rows travel/lean · developer frame grows out of the lime · step bar · horizontal track · rising wordmark; plus Lenis, nav, spotlight, card tilt, magnetic buttons |
| `app/globals.css`, `sections.css`, `scenes.css` | desktop styles; every size is a Figma px × `--u` so the 1400×978 frame scales to any desktop screen |
| `app/mobile.css` | phone + tablet overrides (own sizes and stacked layouts, not the desktop numbers scaled down) |
| `components/sprite.generated.ts` | Figma SVG icons + logo as one inline sprite (`node scripts/build-assets.mjs`) |
| `app/(site)/…/page.tsx` + its `.css` | the inner pages (products, use cases, pricing, developers, about, contact, privacy), each from its own Figma frame; `app/login`, `app/signup` sit outside the site layout. Section-by-section motion: `docs/pages.md` |
| `components/inner/` | `Parts.tsx` (hero with one load sequence per page, intro, buttons, band, tables, cards), `PageMotion.tsx` (deck, stack, grow, sequence, word fill, scroll-spy, CTA triangle), `StaticForm.tsx` (the Figma forms are static: they validate and confirm, nothing is sent), `Password.tsx`, `Auth.tsx` |
| `app/inner.css`, `app/inner-mobile.css` | shared inner-page styles, including the `.p2` palette the docs / sandbox / company / auth frames are drawn in |

Motion is CSS + compositor transforms only (no canvas / WebGL, no video). References: `guidlines/reference source code` (loopsii.com) and `guidlines/gokiwi reference code`.

## Behaviour notes
- `prefers-reduced-motion` and no-JS both get the plain final layout (no pin, nothing hidden).
- First-load JS ≈ 188 KB gzipped (incl. React and Lenis); HTML with inlined CSS ≈ 69 KB gzipped. Lighthouse mobile: performance 93, accessibility 96 (the statement's not-yet-lit words are dimmed on purpose), best practices 100, SEO 100, CLS 0.
- Per-frame scroll work only writes changed values to a few elements (no inherited CSS vars on big subtrees, no per-frame clip-path, no 3D tilt): ~2–3% long frames across the whole page in headless Chrome's software renderer.
- If JS never comes alive the hidden-until-revealed states are dropped after 12 s (`data-ready` failsafe in `app/layout.tsx`).
- Copy that is not in the Figma: FAQ answers 2–4 and the Node.js / Python code tabs (marked `TODO: real copy`). Replace with real text.
- Interactive controls (menus, tabs, test request, FAQ, solutions cards, playground drag / arrow keys) all work under reduced motion, without the animation.
- Satoshi (hero sub-line only) comes from Fontshare; the other fonts are Google Fonts via `next/font`.

## Breakpoints
| | width | `--u` | layout |
|---|---|---|---|
| phone | < 768px | `max(1px, 100vw / 390)`: designed on a 390 frame | single column, own sizes; text ≥ 14px, labels ≥ 12px, tap targets ≥ 44px |
| tablet | 768–1099px | `min(100vw / 600, 100svh / 680)` | the phone structure, roomier (2-up grids) |
| desktop | ≥ 1100px | `min(100vw / 1400, 100svh / 978)` | the Figma layout, unchanged |

JS reads the live `--u` from a probe (`lib/viewport.ts`), so the motion code never re-derives the formula. On touch devices, height-only resizes under 120px (the address bar) are ignored so pinned scenes don't jump; rotation always re-measures. Hover-only effects (spotlight, tilt, magnetic buttons, rolling labels) run only under `(hover: hover) and (pointer: fine)`; touch gets a press state (scale 0.97 + lime ring). Safe-area insets pad the nav, menu sheet and footer (`viewport-fit=cover`).

## Phone / tablet behaviour per scene
- **Nav**: logo + Start building + menu button. The menu is a full-screen glass sheet; flute lines rain in, the four groups are accordions. While it's open the page behind is inert, Lenis is stopped and focus is trapped. It closes on Esc, a link tap or a hash change.
- **Hero**: heading, sub-line, CTAs side by side, logo, 2×2 connector chips, 2×2 principles. The curved connectors are hidden. Every Act still plays; the heading lines slide in from 70u rather than 50vw. Short phones (< 700px tall) drop the principle row so the pinned hero fits.
- **Story**: the same triangle → Y → strokes → borders → fill sequence, about 3 screens of scroll instead of about 4.5 (`storyPace`). The cards stack as compact rows, and the strokes land on the measured card rects.
- **Statement, tape**: same motion at phone type sizes.
- **Developer**: one column. The code body scrolls sideways inside its card, never the page. The step bar is vertical.
- **Playground**: 7 of the 11 cards, at phone positions, on a board of about 1.1 screens. Cards get `touch-action: none`, the board gets `pan-y`, so a swipe on the board still scrolls. No pointer parallax on touch.
- **Solutions**: the pinned horizontal track stays, with cards at 85vw (62vw on tablet). Tapping a card unfolds it.
- **FAQ, closing**: one column. **Footer**: columns become accordions. The outro wordmark scales to the width.

## Checking
`scripts/check.mjs` is dev-only and is not shipped. Run it against a running server (`npm run dev`, or set `URL=`):

```bash
node scripts/check.mjs                 # all 7 sizes
ONLY=390,1440 node scripts/check.mjs   # a quick pass
```

- **Sizes:** it loads 375×667, 390×844, 430×932 and 768×1024 (with `isMobile` + `hasTouch`), plus 1024×768, 1440×900 and 1920×1080.
- **Screenshots:** the hero after the load sequence, then every scene, saved to `scripts/shots/` (git-ignored).
- **Every size:** no horizontal overflow and no console errors.
- **Phones only:** no visible text under 12px.
- **Touch:** a touch drag moves a playground card, and a vertical swipe on the board scrolls the page.
- **Menu:** opens, keeps focus inside, Esc closes it.
- **Controls:** the dropdowns (hover and keyboard), section highlight, code tabs, test request, solutions expand and `#faq-3` deep link all work.
- **Reduced motion:** it re-runs with `reducedMotion: 'reduce'`, checks that every section and revealed element is visible, and that the controls still work.
- **Desktop baselines:** it diffs the desktop frames against `scripts/baseline/` (made by `scripts/baseline.mjs` before the responsive work). It fails above 3% changed pixels, except frames listed in `EXPECTED_DIFF`.

The script uses Playwright's full Chromium (`npx playwright install chromium`).

`scripts/check-pages.mjs` does the same for inner routes: `node scripts/check-pages.mjs /pricing /about …` (in Git Bash prefix `MSYS_NO_PATHCONV=1` so the routes aren't rewritten). At 390, 1440 and 1920 it screenshots the first screen and every section mid-entrance and settled (`scripts/shots/pages/`), and fails on console errors, horizontal overflow, phone text under 12px, or anything left hidden with reduced motion or without JS.
