# Motion patterns catalogue

Every page section picks its motion from this list. Nothing outside it is used.

## What the reference files actually contain

| File | What was saved | What that means |
|---|---|---|
| `guidlines/reference source code` (loopsii.com) | Full markup and 209 KB of inline CSS. The JavaScript is one external module (`/_astro/Layout.astro…`) and was **not** saved. | CSS values below are quoted from the file. Anything driven by JS (the `data-module` behaviours, the `data-r/x/y` offsets) is read from the markup and the CSS states it toggles, not from code. |
| `guidlines/gokiwi reference code` (gokiwi.in) | Markup only: 190 characters of CSS, no JS. | Only section structure and class names can be cited. Behaviour is inferred from those names and marked "inferred". |

Two things from the brief could not be found in the saved files, so they are not in the catalogue:
- **loopsii footer "opens at top 10%"**: no such rule in the CSS or markup. It is probably a JS scroll trigger.
- **loopsii `data-r` / `data-x` / `data-y` / `data-sx` / `data-sy` offsets**: the attributes are there (91 elements, on the app-demo cards) but no CSS reads them. The homepage playground already follows this pattern (scattered start offsets per card, scrubbed by scroll).

## Easing (loopsii `:root`)

| Token here | Curve | loopsii use |
|---|---|---|
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | disclosures: `.faq_body`, `.features_body`, toggle bars, `.faq_answer` (0.6s) |
| `--ease-strong` | `cubic-bezier(.84, 0, .16, 1)` | `--ease` (0.8s) and `--fast-ease` (0.6s): the site's default move |
| `--ease-smooth` | `cubic-bezier(.76, 0, .24, 1)` | `--smooth`: `.nav_body` width morph (0.9s) |
| `--ease-back` | `cubic-bezier(.3, 1.3, .4, 1)` | `.pricing_knob` (0.45s): the only overshoot |
| (not used) | `cubic-bezier(.4, 0, .2, 1)` | Tailwind's default transition curve, not a loopsii choice |

The homepage keeps its Figma curve (`--ease`, `cubic-bezier(0.632, 0.017, 0.145, 1)`) and its two springs. New pages use the Figma curve for entrances and the loopsii curves above for state changes.

## Patterns from loopsii

| ID | Pattern | Where in the reference | Approach |
|---|---|---|---|
| L1 | Nav drops in on load | `.is-loading .nav_slide { transform: translateY(-200%) }` | CSS keyframe from above. Already the homepage's Act I. |
| L2 | Nav morph | `data-module="NavMorph"` on `.nav_body`; `.is-compact` narrows the width, `.is-open` changes the radius; `transition: width .9s var(--smooth)` | Class toggle on scroll. The homepage's `is-mini` is the same idea. |
| L3 | Title split | `data-module="Title"` on the hero `h2.hero_split` (JS not saved) | Lines or words wrapped in masks and raised in order. Same as the homepage's `data-r="lines"`. |
| L4 | Disclosure | `.faq_body` / `.features_body`: `grid-template-rows: 0fr → 1fr`, 0.6s `--ease-in-out`. `.faq_answer`: opacity 0 → 1 and `translate 0 12px → 0`, delayed 0.1s. `.faq_toggle` bars rotate to 45° / 135°. | Pure CSS on an `is-open` class. No measuring. |
| L5 | Toggle with knob | `.pricing_knob { transition: translate .45s cubic-bezier(.3,1.3,.4,1) }`; `.pricing_price:not(.is-active) { opacity: 0 }` (0.4s); `.pricing_sheet` background-color 0.5s | The indicator slides with a small overshoot; the two contents sit in one grid cell and crossfade. |
| L6 | Sticky stacking cards | `.highlights_card { position: sticky; top: calc(… + var(--i) * 26 …) }`, `.highlights_title` sticky above | Each card pins a little lower than the one before, so they pile up as you scroll. CSS only. |
| L7 | Sticky aside | `.faq_intro`, `.features_aside`: `top: calc(var(--nav-space) + 20…)` | The intro column stays while the list scrolls past. CSS only. |
| L8 | Section covers the previous one | `section.app-demo--pinned … z-2 -mt-(--screen-h)`; `.intro_overlay` reads `--progress` | Negative top margin of one screen plus a higher z-index. One CSS var written per frame. The homepage statement already does this. |
| L9 | Pinned wheel with rolling digits | `section.roadmap` is `--screen-h × 4` tall; `.roadmap_wheel { transform: rotate(calc(var(--wheel) * 1deg)) }`; `.roadmap_num` repeats its digit via `content: attr(data-reel)` and `translate: 0 calc(var(--roll) * var(--period))` | Tall section, sticky stage, one scroll var. The digit roll is a counter that scrubs. |
| L10 | Counter | `data-module="Counter"` on `p.counter` (JS not saved) | Number counts up once when seen. `lib/countUp.ts`. |
| L11 | Lines that draw from their start | `.stack_vline`, `.stack_tail { transform-origin: 50% 0 }` | `scaleY` or `scaleX` from one end, scrubbed. The homepage step bar uses it. |
| L12 | Slider with prev / next | `.testimonials` sets `--card`, `--gap`, `--slot`; buttons carry `data-dir="prev|next"` | A track translated by whole slots. |
| L13 | Weight hover | `data-module="WeightHover"` on `.nav_link` (JS not saved; variable-font weight) | Not planned: DM Sans weight changes would shift layout. Listed because the brief names it. |
| L14 | Feature icon | `data-module="FeatureIcon"` with `data-icon` (JS not saved) | Not planned: the Figma icons are static. |
| L15 | Button fill sweep | `.btn_bg-item { clip-path: polygon(… var(--progress) …) }` | Not used as written: it animates `clip-path` per frame, which the architecture rules forbid. The existing ghost-button sweep (`background-size`) does the same job. |
| L16 | App demo, clock, shape grid | `AppDemoMount`, `Clock`, `data-shape`, `data-lane` timeline bars | Not planned: nothing in the Figma file corresponds to them. |

## Patterns from gokiwi (structure only, behaviour inferred)

| ID | Pattern | Where in the reference | Approach |
|---|---|---|---|
| G1 | Scroll sequence | `ScrollSequenceSection_*` | A pinned stage whose steps advance with scroll. Built with the pin helper and one progress value. |
| G2 | Showcase carousel | `RewardsShowcaseSection_navButton*`, `…navFace`, `…navIcon` | Prev / next buttons moving a track. Same mechanics as L12. |
| G3 | Label roll | `navbar_navLabel` with `data-text` | The existing `.roll`. |
| G4 | Mobile nav panel with a product list | `navbar_mobilePanel`, `navbar_mobileProductsList`, `navbar_mobileProductsChevron` | The existing menu sheet and its accordions. |
| G5 | Card sections | `EverydayBenefitSection`, `EverydayMoreSection` | The homepage statement comes from "EverydayMore". |
| G6 | Sticky card | `StickyDownloadCard` | A card that stays in view beside scrolling content. Same CSS as L7. |
| G7 | Logo rows, testimonials | `TrustedBanksSection`, `FeaturedInSection`, `LoveSection` | Not planned: the Figma file has no logos or testimonials. |

## Patterns already on the homepage (kept, reused through `lib/motion/`)

| ID | Pattern | Where |
|---|---|---|
| H1 | Two directions: heading from one side, text from the other | brief Act III and Beat 5; `data-r="left"` / `"right"` |
| H2 | Pop with spring | brief Act IV; `data-r="pop"` |
| H3 | Surface: fade with a short upward drift | brief Act VII; `data-r="up"` |
| H4 | Drop with bounce | brief Act VIII; `drop` keyframe |
| H5 | Masked lines rise | `data-r="lines"` (L3) |
| H6 | Letters rise | `data-r="chars"` |
| H7 | Words fill with scroll | `.words` |
| H8 | Frame grows out of the colour around it | `.frame` in `Flow.tsx` |
| H9 | Pinned horizontal track | `#tracks` in `Flow.tsx` |
| H10 | Dealt columns | `data-r="deal"` |
| H11 | Liquid fill from the bottom | brief Beat 4; `.fill` |
| H12 | Border drawn round a card | brief Beat 3; SVG dash |
