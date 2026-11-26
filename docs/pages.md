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
7. **Sign-up specimens:** the lower half of `144:7658` ("Every state, clearly signposted", `144:7705`) is a sheet of input and submission states. Built as drawn below the sign-up form, like the other specimen sections (see 10), and also used as the source for the forms' states.
8. **Contact success:** its own route (Figma draws a full page); a valid contact submit opens it. The login and sign-up "success" ("✓ You’re signed in.") is shown even though nothing signs anyone in: say if you'd rather they only validate.
9. **Pricing tabs:** Figma draws each tab's content as its own section (with the "More volume?" band between Payouts and Collections) and its copy says "All tab contents are shown below as separate static state panels". Built that way, the tab lists jumping between the sections. Say if you want one section with a working tab control instead (that drops the two "TAB STATE /" intros and that sentence).
10. **Designer notes in the copy:** several frames carry notes that read like specimen labels, built word for word: "Shared detail template for Marketplace, Lending, Collections and Online Gaming…" (marketplace), "All tab contents are shown below…" (pricing), "Focused search · Static visual state · No live search" and "All four language samples are expanded below for review…" (docs), "Focused field · Example email placeholder", "STATIC SUBMISSION EXAMPLES" and "This mockup has not created a real account" (sandbox), the whole "One identity. Across every workflow." section on About, the contact placeholders ("Example contact placeholder · not a confirmed address", "Illustrative address only…"), the privacy draft notes and "Sticky TOC pattern / Static design · focus shown", the login "STATIC REVIEW · …" line, and sign-up's whole specimen sheet with its "Consistency check —" paragraph. Keep or drop?
11. **Link targets taken without a Figma target:** "Discuss marketplace / lending / collections / online gaming" and "Contact sales" → `/contact` (as the footer's "Talk to sales"); the sandbox resources → the docs page's sections (`#authentication`, `#webhook-events`, `#errors-and-retries`). Left `#`: "Explore the stacks", "Open sandbox workspace", the docs sidebar guides other than Getting Started and Sandbox.
12. **Forms:** Figma calls them static ("it does not send data"), so they validate and show the confirmation in the page and send nothing. Where should real submissions go?
13. **Payouts hero:** the Figma frame no longer has the "PAYOUTS API" eyebrow or the tags line (node `144:11913` is gone); the built page still shows both.

## Sections and motion, per page

Shared on every marketing page: the navbar (`131:33`), the closing CTA band (`131:146`) and the footer (`131:178`). They move into the shared layout and keep their homepage motion (H3 and H2 for the band, H10 for the footer columns, the rising wordmark).

Each first screen gets its own load sequence, listed as "Load". None reuses the homepage's order.

### Product pages (one template, three frames)

Motion source: `Yubit Pay Products Pages Motion Direction.pdf` (written for Payouts; the template gives all three pages the same choreography). Its §7–9 are placeholders, so FAQ, closing band and footer keep their motion.

| Section | Payouts | Collections | UPI | Motion (PDF §) |
|---|---|---|---|---|
| Inner page hero | `144:11890` | `144:11468` | `144:11087` | §1 **Load:** nav drops → flutes rain → eyebrow → heading glides in from the right while the sub-line drifts in from the left, together → buttons pop, lime first → API card rises from beneath the hero's edge (slowest) → mono tags drop |
| Process (4 steps) | `144:11922` | `144:11500` | `144:11119` | §2 a held deck (edges peeking, soft shadow, slight tilt). Scroll deals the top card to its slot, then the next, each tilting on departure and settling flat; scrubbed both ways. Pinned on desktop; on phones and tablets the deck sits on the first slot and deals as the list scrolls by |
| Feature panels (2×2) | `144:11944` | `144:11521` | `144:11140` | §3 bento: left column lowered from above the section, right column rises from below, one clock, landing together; then heading → copy surface |
| Dark CTA band | `144:11963` | `144:11540` | `144:11159` | §4 arrives as one object (drift + fade), then headline → sub-line → buttons. A lime gradient triangle follows the cursor with heavy lag (turns, tilts, its gradient's bright end leans toward the cursor, brightens with proximity); a hovered button blooms and lights the triangle. Static on touch |
| Pricing table | `144:11971` | `144:11548` | `144:11167` | §5 one plan card slides up from below the section, already complete, heavy settle; one shimmer when it rests; a hovered row lights from beneath while the others dim; Get Started springs as it lands and on hover |
| Connected products (2 cards) | `144:12019` | `144:11577` | `144:11196` | §6 a beat of empty slots, then each card is thrown from the opposite screen edge on an arc; the arcs cross mid-screen; slight overshoot and settle; key figure → detail → label last |
| FAQ | `144:12026` | `144:11584` | `144:11203` | Heading H6; items use the L4 disclosure, one open at a time |

PDF vs Figma: the PDF calls Payouts the right-hand card and Collections the left-hand one; the Figma Payouts frame draws Payouts first (left). The Figma order is kept; each card still launches from the opposite edge, so the arcs cross as described. The CTA triangle is drawn from the PDF: Figma has none (checked 2026-11-26: `144:11963` is gone, `144:11540` and `144:11159` hold only the intro and two buttons).

### `/use-cases` (`144:10678`)

Built. On desktop the four use cases and the band are one L6 stack (`[data-stack]`): each holds once its bottom reaches the screen's bottom (sticky `top` = screen − own height, written on measure), so the next slides over it only after it has been seen whole. Phones and tablets scroll normally. Inside, neighbouring sections never share a heading, panel, step or button entrance.

| Section | Node | Motion (built) |
|---|---|---|
| Inner page hero | `144:10682` | **Load** (`load="words"`): nav drops → flutes rain → eyebrow → title words fill in left to right (timed) → sub-line from the left and buttons from the right, together (H1) → tags drop (H4) |
| Marketplace (light) | `144:10711` | covers the hero (desktop); heading lines rise (H5); panels dealt (H10); steps a scrubbed sequence (G1, arrows slide); buttons pop (H2) |
| Lending (dark) | `144:10739` | slides over Marketplace (L6); heading letters rise (H6); panels from opposite sides (H1); steps drop with a bounce (H4); buttons surface (H3) |
| "Doesn't fit a box?" band | `144:10767` | slides up as a rounded card over Lending and grows to full width (H8, scrubbed); copy surfaces; buttons pop |
| Collections (light) | `144:10775` | slides over the band; heading from the left, sub-line from the right (H1); panels surface (H3); steps a scrubbed sequence; buttons pop |
| Online Gaming (dark) | `144:10803` | slides over Collections; heading lines rise; panels dealt; steps drop; buttons surface |

### `/use-cases/marketplace` (`144:10266`)

Built. Same Figma template as `/use-cases` (shares `use-cases.css`).

| Section | Node | Motion (built) |
|---|---|---|
| Inner page hero | `144:10270` | **Load** (`load="lines"`): nav drops → flutes rain → eyebrow → each title line rises out of its mask in turn (H5) → sub-line surfaces (H3) → buttons pop (H2) → tags drop |
| One structure. Four use cases. | `144:10299` | covers the hero (L8, desktop); heading from the left, sub from the right (H1); panels dealt (H10) |
| A path from buyer to seller. | `144:10311` | heading lines rise; the four steps are a scrubbed sequence (G1); the notice surfaces after the last step (H3). No connector line: Figma draws none |
| Two stacks. One shared context. | `144:10335` | heading letters rise (H6); the two product cards from opposite sides (H1); caption surfaces |
| Dark band | `144:10344` | grows out of the white around it (H8) |
| Clearer handoffs. | `144:10352` | heading lines rise (H5); the three cards drop with a bounce (H4). H12 drawn borders dropped: stroke animation is not transform/opacity |
| Start with the seller settlement. | `144:10369` | heading from the left (H1); the request card rises and its lines settle in order; the panel slides in from the right. L7 dropped: Figma puts the intro above the row, not beside it |

### `/pricing` (`144:9868`)

Built as Figma draws it: each tab's content is its own section (Payouts, then the "More volume?" band, then Collections, then UPI), each with the tab list showing its own tab selected. The tabs are links that jump between the three sections. Figma's copy says so ("All tab contents are shown below as separate static state panels"), and folding them into one tab control would drop that copy and the two "TAB STATE /" intros. Open question below.

| Section | Node | Motion (built) |
|---|---|---|
| Inner page hero | `144:9872` | **Load** (`load="sides"`): nav drops → flutes rain → eyebrow → title line 1 from the left edge, line 2 from the right, together (H1) → sub-line surfaces (H3) → buttons pop (H2) → tags drop (H4) |
| The details, without the guesswork. (Payouts state) | `144:9901` | covers the hero (L8, desktop); heading lines rise (H5); notice and tabs surface; both tables' rows rise in order while each rule draws from the left (L11) |
| More volume? band | `144:9964` | grows out of the white (H8) |
| Incoming money, clearly priced. (Collections state) | `144:9972` | heading letters rise (H6); tabs drop (H4); the table slides in whole from the right |
| Price every UPI operation. (UPI state) | `144:10000` | heading from the left (H1); tabs pop (H2); rows rise in order |
| Your workflow deserves a conversation. | `144:10028` | a light section in Figma (not a band): heading lines rise; buttons pop |
| Pricing FAQ | `144:10036` | heading letters rise (H6); items from the right; L4 disclosure, one open. Only the first answer exists in Figma |

### `/developers/docs` (`144:9263`)

Built. The frame is drawn in its own hex palette (`#14281d` ink, `#586859` muted, `#acbdb0` sub-lines, `#eff3e8` workspace, `#e8efdd` / `#d4deca` notices, a darker code card); `docs.css` keeps those values. Two icons in that palette were added to the sprite (`window-controls-dv`, `copy-dv`). Like pricing, Figma shows all four language samples expanded with cURL selected ("tabs are static visual states"), so the language tabs jump to each sample. The search field is drawn only in its focused state ("Static visual state · No live search") and is built that way: it does not search.

| Section | Node | Motion (built) |
|---|---|---|
| Inner page hero | `144:9267` | **Load** (`load="type"`): nav drops → flutes rain → eyebrow → the title types out letter by letter → sub-line surfaces → buttons pop → tags drop |
| Docs workspace | `144:9295` | covers the hero (L8, desktop). Sidebar entries slide in from the left and the "On this page" entries from the right; both are L7 sticky asides. The current section is marked as the article scrolls (`[data-spy]`: `aria-current` plus a bar that slides with the L5 knob curve). Article blocks surface (H3); the title's line rises (H5); code cards rise and their lines settle in order; the error entries drop (H4) |
| Your next integration starts here. | `144:9399` | grows out of the workspace's ivory (H8) |

Phones and tablets: the sidebar and the "On this page" list fold into "Guides +" and "On this page +" (Figma `293:14605`), built as `<details>` so they work without JS.

### `/developers/sandbox` (`144:8879`)

Built, in the `.p2` palette. Figma calls the form "a static form example; it does not send data", so `StaticForm` keeps everything in the page: the browser checks the fields, an invalid submit outlines them (Figma's error state: 2px ink) and shows the "Request not submitted" notice, a valid one swaps the form for Figma's success example. The submit button is disabled until hydrated, so without JS nothing submits (no personal details in a URL). The "Clear feedback" section keeps both examples as Figma draws them (static pictures).

| Section | Node | Motion (built) |
|---|---|---|
| Inner page hero | `144:8883` | **Load** (`load="drop"`): nav drops → flutes rain → eyebrow → each title line drops in from above and bounces (H4) → sub-line surfaces → buttons pop → tags drop |
| Tell us what you want to test. | `144:8911` | covers the hero (L8, desktop); heading lines rise (H5); the form's fields surface in order (H3); the explanation and resources slide in from the right and stay beside the longer form (L7 sticky) |
| Clear feedback at every step. | `144:8974` | heading from the left (H1); the validation and success examples are a scrubbed sequence (G1), validation first; the three steps pop (H2) |
| Dark band | `144:9014` | grows out of the ivory (H8) |
| FAQ | `144:9022` | heading letters rise (H6); items from the right; one answer in Figma |

### `/about` (`144:8465`)

Built, in the `.p2` palette. The artwork is Figma's "Financial infrastructure sculpture" image (served as a JPEG; `assets/raw/about-sculpture.jpg` → AVIF/WebP at 2×, lazy-loaded).

| Section | Node | Motion (built) |
|---|---|---|
| Inner page hero | `144:8469` | **Load** (`load="chars"`): nav drops → flutes rain → eyebrow → the title's letters rise and settle one after another (H6) → sub-line surfaces → buttons pop → tags drop |
| Good ideas shouldn’t get lost in the plumbing. | `144:8497` | covers the hero (L8, desktop); heading lines rise; the mission and story text lights up word by word with scroll (H7, `[data-fill]`, scrubbed); the artwork rises |
| A focused stack. More possibility. | `144:8511` | heading from the left, sub from the right (H1); the three facts are dealt (H10) |
| Dark band | `144:8529` | grows out of the ivory (H8) |
| Built for both sides of the handoff. | `144:8537` | copy surfaces (H3); the two team panels from opposite sides (H1); the scope card surfaces. No drawn line: Figma's scope card has none |
| Trust comes from the details. | `144:8565` | heading letters rise (H6); the three panels drop in (H4); notice surfaces; button pops. L6 dropped: the panels sit in a row, not a stack |
| One identity. Across every workflow. | `144:8584` | heading lines rise; the brand mark pops (H2); note surfaces |

### `/contact` (`144:8118`) and `/contact/success` (`144:7858`)

Built, in the `.p2` palette. The contact form is static like the others; a valid submit opens `/contact/success` (Figma's own confirmation page). New icons from this frame: `messages-square`, `code-xml-ink`, `chevron-down-ink`. The contact emails and office address are Figma's placeholders ("not a confirmed address"), shown as text, not links.

| Section | Node | Motion (built) |
|---|---|---|
| Contact hero | `144:8122` | **Load** (`load="zoom"`): nav drops → flutes rain → eyebrow → each title line settles into place from slightly larger → sub-line surfaces → buttons pop → tags drop |
| What are you building? | `144:8151` | covers the hero (L8, desktop); heading letters rise (H6); the form's fields surface in order (H3); the three contact channels arrive from the right |
| Prefer to start with the APIs? | `144:8216` | grows out of the ivory (H8) |
| Success hero | `144:7862` | **Load** (`load="rise"`): the eyebrow's check pops → the title rises as one block from beneath the hero's edge → sub-line → buttons → tags |
| A little clarity on the next steps. | `144:7891` | heading lines rise; the notice pops (H2); the three next steps are dealt (H10); the actions surface (H3) |

### `/privacy` (`144:2967`)

Built. A draft in Figma, with its placeholders ("[CONFIRMED LEGAL ENTITY]", "[DATE TO BE CONFIRMED]" …) kept word for word. No closing CTA band (Figma goes straight to the footer). The header glow is this frame's own (`legal-glow`).

| Section | Node | Motion (built) |
|---|---|---|
| Compact header | `144:2971` | **Load** (`data-load="legal"`): nav drops → flutes rain → eyebrow → the title rises out of its mask → description surfaces → the draft pill pops → the date drops |
| Legal article | `144:3000` | no entrances (long-form reading); the contents list is an L7 sticky aside that marks the section being read (`[data-spy]`, Figma's "Selected section anchor" style); stacked above the text on phones and tablets |

### `/login` (`144:7424`) and `/signup` (`144:7658`)

Built, outside the `(site)` group (no nav or footer), in the `.p2` palette, with the About sculpture (same Figma image). Split layout on desktop, stacked on phones and tablets without the artwork (as the phone frames). The forms are static: an invalid submit outlines the fields; a valid one shows the specimens' loading label ("◌ Signing in…" / "Creating account…") and then their success message below the button, keeping the form visible ("Keep the form visible while submitting"). Nothing is sent. "Show" toggles the password's visibility. "Forgot password? ↗" is `#` (no frame). Sign-up's specimen sheet "Every state, clearly signposted." (`144:7705`) is built as drawn, below the split layout (question 10).

| Section | Node | Motion (built) |
|---|---|---|
| Brand story (left) | `144:7427` / `144:7661` | **Load:** the panel slides in from the left edge; its headline lines rise from their masks (H5); its copy surfaces |
| Form region (right) | `144:7436` / `144:7670` | its blocks surface in order once the panel has landed (H3) |
| Specimen sheet (sign-up) | `144:7705` | heading lines rise; the four input states are dealt (H10); the three submission states surface |

### Dashboard (pending question 1)

Frames listed in the route table. Structure in each: sidebar (workspace switcher, navigation group, sandbox guide), workspace top bar, main content. No motion plan until it is confirmed in scope.

## Mobile disagreements

- **Nav on phones:** Figma's phone frames show a "Menu +" / "Sign in ↗" row under the bar. The build keeps the existing menu button and full-screen sheet (44px targets, focus trap, already tested).
- **Small text:** Figma's phone frames use 10–11px for code, tags, card labels and legal text. The build uses 12px, the site minimum.
- **Hero cover:** the hero staying put while the page slides over it is desktop only. On phones the hero is taller than the screen, so it scrolls normally.

## Built so far

| Route | Notes for review |
|---|---|
| `/products/payouts`, `/products/collections`, `/products/upi` | one template, three data sets; motion from the product PDF (see below) |
| `/use-cases` | L6 stack on desktop; "Discuss …" and "Contact sales" go to `/contact`; "Explore the stacks" is `#` (no target in Figma) |
| `/use-cases/marketplace` | shares `use-cases.css`; its product cards draw their preview on white, as in this frame |
| `/pricing` | the three tab states as three sections, as Figma draws them (question 9) |
| `/developers/docs` | `.p2` palette; sidebar guides without a frame are `#`; search field is the drawn static state |
| `/developers/sandbox` | `.p2` palette; static form (`StaticForm`); resources link to the docs page's sections; "Open sandbox workspace" is `#` |
| `/about` | `.p2` palette; sculpture image from Figma |
| `/contact`, `/contact/success` | `.p2` palette; static form that opens the success page |
| `/privacy` | `.p2` palette; sticky contents list; no closing band, as in Figma |
| `/login`, `/signup` | outside `(site)`; static forms with the specimens' loading and success states; sign-up's specimen sheet built as drawn |

Shared pieces added for these pages: `InnerHero` load variants (`glide`, `sides`, `lines`, `words`, `type`, `drop`, `chars`; one per page), `Btn kind="edge"` (lime outline), plain `Band` (H8 grow), `PriceTable r`, `ApiCard file/note/reveal`, `ProductCard flat/r`, `StaticForm`, the `.uc` white section, the `.p2` palette block, and in `PageMotion`: `[data-stack]` (L6), `[data-grow]` (H8), `[data-seq]` (G1), `[data-spy]`, `[data-fill]` (H7). `scripts/check-pages.mjs` walks any inner route (390 / 1440 / 1920, mid and settled shots, overflow, console, small text, reduced motion, no JS).

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
