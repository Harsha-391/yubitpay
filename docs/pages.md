# Pages: Figma inventory, motion plan, homepage audit

Figma file `94SjQ6YLHVWuktOzdIAwZz`. Read through the Figma MCP on 2026-11-16.

- **Page 1** (`0:1`): the 23 final desktop frames (1440 wide) plus the 1400×978 landing animation frame.
- **drafts** (`45:2`): phone (375) and tablet (768) frames for every page, in two sets, plus empty "Building …" placeholders.
- **Products** (`131:2`): shared components ("exact Home copies"): navbar, three product cards, accordion, CTA band, footer, code block, brand, buttons with hover variants.

Pattern IDs (L, G, H) refer to `docs/motion-patterns.md`.

## Routes

| Route | Desktop frame | Phone / tablet frames (drafts) |
|---|---|---|
| `/` | `245:7347` landing animation, `159:7241` static homepage | already built |
| `/products/payouts` | `144:11886` | `293:16283` / `293:16428` |
| `/products/collections` | `144:11464` | `293:16033` / `293:16157` |
| `/products/upi` | `144:11083` | `293:15783` / `293:15907` |
| `/use-cases` | `144:10678` | `293:15488` / `293:15633` |
| `/use-cases/marketplace` | `144:10266` | `293:15269` / `293:15376` |
| `/pricing` | `144:9868` | `293:14810` / `293:15037` |
| `/developers/docs` | `144:9263` | `293:14577` / `293:14691` |
| `/developers/sandbox` | `144:8879` | `293:14290` / `293:14431` |
| `/about` | `144:8465` | `293:14051` / `293:14168` |
| `/contact` | `144:8118` | `293:13850` / `293:13948` |
| `/contact/success` | `144:7858` | `293:13747` / `293:13796` |
| `/privacy` | `144:2967` | `293:10692` / `293:10771` |
| `/login` | `144:7424` | `293:13473` / `293:13514` |
| `/signup` | `144:7658` | `293:13555` / `293:13651` |
| `/dashboard` | `144:7117` | `293:13037` / `293:13276` |
| `/dashboard/payouts` | `144:6480` (states: `144:5440`) | `293:12652` / `293:12864` |
| `/dashboard/virtual-accounts` | `144:5910` (states: `144:5334`) | `293:12308` / `293:12481` |
| `/dashboard/upi` | `144:5133` | `293:11954` / `293:12124` |
| `/dashboard/transactions` | `144:4525` | `293:11475` / `293:11731` |
| `/dashboard/settings` | `144:3858` | `293:11143` / `293:11304` |
| dashboard empty state | `144:3360` | `293:10855` / `293:10994` |

### In Figma only as empty placeholders: not buildable
Terms, Refund, Not Found, Maintenance, Thank You and "States" exist only as "Building …" frames on the drafts page (three grey rectangles each, no content). They are not built. The footer's "Terms of service" link has nowhere to go.

### Decisions so far
- **Scope (answered):** website only. The seven dashboard frames are not built.
- **Defaults taken where there was no answer** (say so if any is wrong): the newer mobile set; each route shows the nav its own Figma frame shows; pricing is built word for word; links with no Figma frame stay `#`; the two "your decision" audit lists are left as they are.
- **Menu entries:** Figma shows the nav chevrons but no open menu, so the dropdown and phone-menu entries are the Figma page names (`lib/ia.ts`).
- **Assets:** icons and images are exported from Figma page by page, in the commit that builds the page, not all up front.

### Questions for review
1. **Dashboard (7 frames):** it is an app, with its own sidebar and sample data, not a marketing page. In scope now, or a later round?
2. **Which mobile set:** drafts holds two sets per page. The older one is named "Mobile 375 / Tablet 768"; the newer one "Mobile375 / Tablet768" matches the desktop naming and is the one listed above. Confirm the newer set is current.
3. **Nav on inner pages:** inner frames show the waypoints brand mark with "yubit pay", "Sign in" and "Get Started". The built homepage shows the wordmark logo, "Login" and "Start building" (from `245:7347`). The static homepage `159:7241` uses the brand mark with "Login / Start building". Which nav does the shared layout use?
4. **Pricing values:** every rate in Figma is the literal text `[YOUR PRICING VALUES]`. Built word for word unless you supply rates.
5. **Use-case details:** only Marketplace has a detail frame ("detail template"). Lending, Collections and Online Gaming have none, so their "Explore" actions have no destination.
6. **Footer links without frames:** "Open banking", "API reference", "Terms of service".
7. **Sign-up specimens:** the lower half of `144:7658` ("Every state, clearly signposted", `144:7705`) is a sheet of input and submission states, not a page section. Used as the source for the form's states, not rendered.
8. **Contact success:** built as the success state of `/contact` and as its own route, since Figma draws a full page.

## Sections and motion, per page

Shared on every marketing page: the navbar (`131:33`), the closing CTA band (`131:146`) and the footer (`131:178`). They move into the shared layout and keep their homepage motion (H3 and H2 for the band, H10 for the footer columns, the rising wordmark).

Each first screen gets its own load sequence, listed as "Load". None reuses the homepage's order.

### Product pages (one template, three frames)

| Section | Payouts | Collections | UPI | Motion |
|---|---|---|---|---|
| Inner page hero | `144:11890` | `144:11468` | `144:11087` | **Load:** L1 nav drops → flutes rain (brief Act II) → eyebrow, then the two title lines rise from masks (L3) → sub-line H3 → buttons H2 → code card rises from below (brief Act V), its lines settle → mono tags H4 |
| Process (4 steps) | `144:11922` | `144:11500` | `144:11119` | The ivory panel covers the hero (L8). Steps are a G1 scroll sequence: a rule draws across (L11) and each step lights as it passes, scrubbed both ways |
| Feature panels (2×2) | `144:11944` | `144:11521` | `144:11140` | L6 sticky stacking: heading stays, panels pile up |
| Dark CTA band | `144:11963` | `144:11540` | `144:11159` | H8: grows out of the ivory around it |
| Pricing table | `144:11971` | `144:11548` | `144:11167` | Row rules draw from the left (L11), rows follow in order |
| Connected products (2 cards) | `144:12019` | `144:11577` | `144:11196` | H1: the two cards arrive from opposite sides |
| FAQ | `144:12026` | `144:11584` | `144:11203` | Heading H6; items use the L4 disclosure, one open at a time |

State changes: code tabs (existing crossfade with height morph), copy button, FAQ (L4).

### `/use-cases` (`144:10678`)

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:10682` | **Load:** L1 → flutes → title words fill left to right (H7, timed, not scrubbed) → sub-line and buttons H1 from opposite sides → tags H4 |
| Marketplace | `144:10711` | The four use-case sections are one L6 stack: each section pins under the nav and the next slides over it |
| Lending | `144:10739` | L6, as above |
| "Doesn't fit a box?" dark band | `144:10767` | H8 |
| Collections | `144:10775` | L6 |
| Online Gaming | `144:10803` | L6 |

### `/use-cases/marketplace` (`144:10266`)

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:10270` | **Load:** L1 → flutes → eyebrow → title H5 → sub H3 → buttons H2 |
| One structure. Four use cases. | `144:10299` | L8 cover; cards H10 dealt |
| A path from buyer to seller. | `144:10311` | G1 scroll sequence along the path, connector drawn with L11; status notice H3 after the last step |
| Two stacks. One shared context. | `144:10335` | H1: the two stacks from opposite sides |
| Dark band | `144:10344` | H8 |
| Clearer handoffs. | `144:10352` | H5 heading; cards with H12 drawn borders |
| Start with the seller settlement. | `144:10369` | L7 sticky intro beside the content |

### `/pricing` (`144:9868`)

Figma draws the three tab contents as three stacked "state panels" and says so in its copy. Built as one tab list with three panels.

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:9872` | **Load:** L1 → flutes → title lines H1 from opposite sides → sub H3 → buttons H2 → tags H4 |
| The details, without the guesswork. (Payouts panel) | `144:9901` | L8 cover; notice H3; table rules L11 |
| Collections panel | `144:9972` | tab state |
| UPI panel | `144:10000` | tab state |
| More volume? dark band | `144:9964` | H8 |
| Your workflow deserves a conversation. dark band | `144:10028` | H8, mirrored origin |
| Pricing FAQ | `144:10036` | H6 heading, L4 disclosure |

State changes: the tab indicator slides with the L5 knob curve; the old panel leaves toward the side the new tab is on and the new one arrives from the other (direction follows tab order); the container height morphs (as the homepage code card).

### `/developers/docs` (`144:9263`)

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:9267` | **Load:** L1 → flutes → title H5 → sub H3 |
| Docs workspace: search input, sidebar, article | `144:9295` (`144:9296`, `144:9301`) | L8 cover. Sidebar is an L7 sticky aside with the current heading marked as the article scrolls. Search field focus state from `144:9296` |
| Your next integration starts here. | `144:9399` | H8 |

State changes: sidebar highlight follows scroll; code blocks reuse the code-card tabs.

### `/developers/sandbox` (`144:8879`)

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:8883` | **Load:** L1 → flutes → eyebrow → title H5 → sub H3 |
| Tell us what you want to test. (form) | `144:8911` | L8 cover; L7 sticky intro beside the form; fields H3 in order |
| Clear feedback at every step. | `144:8974` | G1 scroll sequence through the feedback states |
| Dark band | `144:9014` | H8 |
| FAQ | `144:9022` | H6, L4 |

State changes: field focus, validation and submit states, taken from the specimens in `144:7705` and the docs input `144:9296`; success swaps the form for its confirmation with a height morph.

### `/about` (`144:8465`)

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:8469` | **Load:** L1 → flutes → title letters rise (H6) → sub H3 |
| Good ideas shouldn't get lost in the plumbing. | `144:8497` | L8 cover; body words fill with scroll (H7) |
| A focused stack. More possibility. | `144:8511` | H10 dealt cards |
| Dark band | `144:8529` | H8 |
| Built for both sides of the handoff. | `144:8537` | H1 two sides; "Connected product scope" row drawn with L11 |
| Trust comes from the details. | `144:8565` | L6 stacking; notice H3 |
| One identity. Across every workflow. | `144:8584` | Brand mark H2 |

### `/contact` (`144:8118`) and `/contact/success` (`144:7858`)

| Section | Node | Motion |
|---|---|---|
| Inner page hero | `144:8122` / `144:7862` | **Load:** L1 → flutes → title H1 → sub H3 |
| What are you building? (form) | `144:8151` | L8 cover; L7 sticky intro; fields H3 in order |
| Prefer to start with the APIs? | `144:8216` | H8 |
| Success: A little clarity on the next steps. | `144:7891` | Notice H2; next-step cards H10; actions H3 |

State changes: focus and validation as the sandbox form; on submit the form leaves and the success content arrives with a height morph.

### `/privacy` (`144:2967`)

| Section | Node | Motion |
|---|---|---|
| Compact header | `144:2971` | **Load:** L1 → title H5 |
| Legal article | `144:3000` (`144:3001` notice, `144:3004` reading layout) | L7 sticky contents list with the current section marked; no other motion (long-form reading) |

### `/login` (`144:7424`) and `/signup` (`144:7658`)

| Section | Node | Motion |
|---|---|---|
| Brand story (left) | `144:7427` / `144:7661` | **Load:** panel slides in from the left edge, its copy rises from masks (H5) |
| Form region (right) | `144:7436` / `144:7670` | Fields H3 in order after the panel lands |

State changes: input focus, error and success states from the specimens `144:7710`; submission states from `144:7741`.

### Dashboard (pending question 1)

Frames listed in the route table. Structure in each: sidebar (workspace switcher, navigation group, sandbox guide), workspace top bar, main content. No motion plan until it is confirmed in scope.

## Mobile disagreements

- **Nav on phones:** Figma's phone frames show a "Menu +" / "Sign in ↗" row under the bar. The build keeps the existing menu button and full-screen sheet (44px targets, focus trap, already tested).
- **Small text:** Figma's phone frames use 10–11px for code, tags, card labels and legal text. The build uses 12px, the site minimum.
- **Hero cover:** the hero staying put while the page slides over it is desktop only. On phones the hero is taller than the screen, so it scrolls normally.

## Built so far

| Route | Commit | Notes for review |
|---|---|---|
| `/products/payouts`, `/products/collections`, `/products/upi` | one commit (one template, three data sets) | see below |

Missing in Figma, so not invented (product pages):
- **FAQ answers 2–4:** Figma only draws the first answer. The other three questions are shown but do not open.
- **Node.js / Python requests:** Figma's API card shows three language labels but only the cURL request. The other two are labels, not tabs.
- **"Explore open banking":** no Open banking page exists, so the link is `#`.
- **Button hover:** Figma's secondary hover variant is identical to its normal state, so the new outline button has no hover design of its own.

## Banned-style allowlist (for the Phase 3 check)

| Selector | Style | Figma node that justifies it |
|---|---|---|
| `.glow` (hero ambient glow) | radial gradient (SVG asset) | `245:7368`, `165:7332`, `144:11891` "Ambient glow" |
| `.cta-glow` | radial gradient (SVG asset) | `245:7604`, `159:7564`, `131:135` "Conversion glow" |
| `.flutes` | linear gradient | `245:7350`, `165:7314`, `144:11892` "Architectural flute" |

Figma has **no** background blur or layer blur on any node in the homepage frames, an inner-page hero or the CTA band.

## Homepage audit against the hard rule

### Removed (no source in Figma, the brief or the references)

| Item | Where it was | Added |
|---|---|---|
| Cursor glow on the hero flutes | `.flute-glow`, `Hero.tsx`, `Flow.tsx` | last round |
| Idle breathe / y-breathe loops and the `idle` timer | `scenes.css`, `Flow.tsx`, `data-idle` attributes | last round |
| Pulsing 200 OK dot | `dot-pulse` in `sections.css` | last round |
| Ticker event stream | `Ticker.tsx`, its CSS | last round |
| Idle drift of playground cards on touch | `pg-drift` in `mobile.css` | last round |
| Backdrop blur on the nav dropdowns | `.nav-panel > div` | last round |
| Backdrop blur on the phone menu sheet | `.sheet` | last round |

### Kept, with a source

| Item | Source |
|---|---|
| Hero ambient glow, CTA conversion glow, flutes | Figma (allowlist above) |
| Static 200 OK dot | Figma code block `131:202` |
| Ray burst with a soft blur | brief, Act VI ("soft, slightly blurred beams") |
| Ink drain, luminous outline, lock click, liquid fill | brief, Beats 1 to 4 |
| Statement, tape, playground, horizontal track, outro wordmark | first build, from the references (gokiwi EverydayMore, loopsii marquee / app demo / outro) |
| Disclosures, label roll, count-up | L4, G3, L10 |

### From the first build, no Figma source: your decision

These predate last round, so they were left in place. Each is on the banned list unless you allow it.

| Item | Where | Note |
|---|---|---|
| Nav background blur (8px) | `.nav::before` | Figma's nav has no blur. loopsii's `.nav_body` does use one. Removing it needs a more opaque nav background. |
| Cursor spotlight on dark panels | `[data-spot]::before` in `sections.css` | A cursor-follow radial gradient. |
| Glow behind the growing Y | `.y-glow` in `globals.css` | A radial-gradient blob. |
| Blur-in reveal on the closing heading | `[data-r="blur"]` in `scenes.css` | `filter: blur`. |
| Marquee on the tape | `.mq-track` in `scenes.css` | An infinite, auto-scrolling loop. loopsii and gokiwi both have marquee rows; Figma does not. |
| Card tilt and magnetic buttons | `[data-tilt]`, `[data-magnet]` | Pointer effects. Not in Figma; could not be confirmed in the references because their JS was not saved. |
| Playground board grid lines | `.board` background | Two linear gradients drawn as a grid. |

### Asked for last round, no Figma source: your decision

| Item | Note |
|---|---|
| Nav scroll-progress line | Not in Figma or the references. |
| Lime ring on press (touch) | Figma has button hover variants (`175:7612`, `175:7617`) but no pressed state. |
| "Send test request" and its webhook card | Not in Figma's code block `131:202`. |
| Solutions cards that hide their description until hover or tap | Figma's homepage (`159:7495`) shows a plain list with everything visible. |
| Desktop dropdown menus | Figma shows the chevrons but no open state. |
