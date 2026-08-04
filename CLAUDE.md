# Engineering Site & Eon Designs Portfolio

This repo hosts `edwingyasi.online` (the engineering portfolio) plus subfolders for design portfolio, Prompt Vault, and My Ledger. Currently building the new Eon Designs portfolio inside `/eon/`.

## Owner

Edwin Gyasi Owusu (CEO Gyasi). Final-year Geological Engineering student at KNUST, Ghana. Founder and Creative Director of Eon Designs. Address as "CEO Gyasi" or "Edwin".

## Folder Structure

- `/` — Engineering portfolio (live at edwingyasi.online) — content is CMS-managed, see Decap CMS below
- `/admin/` — Decap CMS admin panel (`index.html` + `config.yml`)
- `/content/` — CMS content source of truth (JSON), `engineering/` and `designs/`
- `/api/` — Vercel serverless functions: GitHub OAuth provider for the CMS
- `/images/` — CMS uploads for the engineering site
- `build.js` — injects `/content` JSON into the HTML at deploy time
- `/eon/` — Eon Designs portfolio v2 (not yet scaffolded as of 2026-07-30)
- `/designs/` — Eon Designs site, live at edwingyasi.online/designs — CMS-managed
- `/vault/` — Prompt Vault PWA — DO NOT TOUCH
- `/ledger/` — My Ledger — DO NOT TOUCH

## Current Build

All work happens inside `/eon/`. Full spec is in `EON_PORTFOLIO_BRIEF.md` at repo root.

Do NOT reference, copy, or replicate anything from `/designs/`. That folder is the old site. The new build is completely fresh.

## Tech Stack

- HTML / CSS / vanilla JavaScript (no framework)
- Cloudinary CDN for images (cloud name: `dytejwgxj`)
- Images currently at `../designs/Assets/` — referenced via relative path from `/eon/`
- Vercel hosting (auto-deploys from main branch)
- Vercel serverless function at `/eon/api/chat.js` for AI chat
- `@anthropic-ai/sdk` for Claude integration in the chat endpoint
- Lenis for smooth scroll (lerp: 0.08, smoothWheel: true on Windows)

## Commands

- Local dev: `cd eon && vercel dev` or `cd eon && npx serve .`
- Install deps: `cd eon && npm install`
- Deploy: push to main, Vercel auto-deploys

## Hard Rules

- NEVER touch `/vault/` or `/ledger/` folders
- NEVER commit `ANTHROPIC_API_KEY`, `GITHUB_OAUTH_CLIENT_SECRET`, or any secret
- NEVER hand-edit content inside a `<!-- CMS:START -->` / `<!-- CMS:END -->` block. `build.js` overwrites it. Edit the JSON in `/content/` instead.
- NEVER hand-edit `designs/js/data.js`. It is generated from `/content/designs/*.json`.
- ALWAYS run `node build.js` and confirm it exits 0 before pushing
- For the EON v2 build specifically, work inside `/eon/`
- Do NOT copy visual structure or layout from `/designs/index.html` into `/eon/`

## Standing Habit

Whenever a structural or setup decision is made in this project, append a short
note to this file in the same commit, without being asked. Structural means:
new tooling, new folder conventions, build or deploy changes, auth setup,
content pipeline changes, or a rule in this file being superseded.

## Visual Conventions (EON v2)

- Background: `#0A0A0A` (near-black, not pure black)
- Body text: `#F0EDE8` (warm off-white)
- Accent: `#C0C0C0` (cold platinum)
- Typography: Playfair Display 900 (display) + Inter 100/200 (body) + JetBrains Mono 400 (labels)
- Custom cursor replaces browser default on desktop
- Full-screen nav overlay, no standard navbar
- Images lead — hero is a full-bleed image, name withheld until scroll
- Feeling: intimidating and premium

## Verification

For all frontend work, use the Claude Chrome extension to visually verify changes in localhost before claiming completion.

## Communication Preferences

- Address as CEO Gyasi or Edwin
- Use periods or commas instead of em dashes
- Direct, honest feedback over flattery
- Concise responses, no fluff

## Decap CMS

Both live sites are edited from one panel. No code editing required.

**Admin panel:** https://www.edwingyasi.online/admin
**Config:** `/admin/config.yml` — **Loader/theme:** `/admin/index.html`

The canonical host is `www.edwingyasi.online`. The apex 307-redirects to it.
Use the www host anywhere an absolute URL is required, including the GitHub
OAuth callback and `base_url` in config.yml.

`admin/index.html` must keep its `<link rel="cms-config-url" href="/admin/config.yml">`.
Vercel serves the page at both `/admin` and `/admin/`, and without that absolute
link Decap resolves a relative `config.yml` against the `/admin` base, which
lands on `/config.yml` at the site root and 404s.

### How content reaches the page

Decap commits JSON to `/content/`. Vercel then runs `node build.js` (set as the
build command in `vercel.json`), which renders that JSON into marked regions of
the HTML. Content ends up in the static HTML, so SEO and link previews stay correct.

```
/content/engineering/*.json ──► build.js ──► index.html          (9 regions)
/content/designs/*.json     ──► build.js ──► designs/index.html  (12 regions)
                                          └► designs/js/data.js  (regenerated)
```

Regions are bracketed by `<!-- CMS:START name -->` / `<!-- CMS:END name -->`.
Everything outside those markers (all CSS, all scripts, layout) is never touched.
The build is idempotent, and it fails loudly if a marker goes missing.

### Collection map

| Collection | Content folder | Renders into |
|---|---|---|
| **Engineering Site** | `content/engineering/` | `index.html` |
| **Eon Designs Site** | `content/designs/` | `designs/index.html` + `designs/js/data.js` |

Engineering entries: Page Title & SEO, Navigation, Hero, About, Projects &
Case Studies, Skills & Certifications, Experience, Contact, Footer.

Eon Designs entries: Page Title/SEO/Logo, Navigation, Hero, Selected Works,
The Vault, About, Journal, Contact & Footer.

Repeatable content (project cards, case studies, vault artifacts, journal posts,
experience entries, skill badges, client list, social links) uses list widgets,
so items can be added, edited, deleted, and drag-reordered.

### Auth

Vercel has no Git Gateway, so `/api/auth.js` and `/api/callback.js` in this repo
act as the GitHub OAuth provider. Same domain, no Netlify or Cloudflare Worker.

GitHub OAuth App callback URL must be exactly:
`https://www.edwingyasi.online/api/callback`

Required Vercel environment variables:
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `ALLOWED_GITHUB_LOGIN` — restricts the panel to a single GitHub account

### Media

Engineering uploads → `/images/`. Eon Designs uploads → `/designs/images/`.
Pre-existing artwork in `designs/Assets/` is untouched and still referenced.

### Local testing

`npx decap-server` (config has `local_backend: true`), serve the repo, open
`/admin`. Or skip the UI: edit a file in `/content/`, run `node build.js`,
and check the HTML.

## Brand Assets

Site-wide favicon set lives at the repo root and is referenced with absolute
paths (`/favicon.ico`), so the same tags work from `/`, `/designs/`, and `/admin/`.

| File | Use |
|---|---|
| `favicon.ico` | legacy, embeds 16 / 32 / 48 |
| `icon.svg` | modern browsers |
| `favicon-16.png`, `favicon-32.png` | explicit raster sizes |
| `apple-touch-icon.png` | 180px, iOS home screen |
| `icon-192.png`, `icon-512.png` | PWA, referenced by `site.webmanifest` |
| `images/logo-mark.png` | 740x881 RGBA cube, transparent, the nav brand everywhere |

These are supplied as finished artwork now. The earlier set was an "E" monogram
generated by a throwaway Node rasteriser and inlined as SVG in the admin brand
bar; both of those are gone. The admin bar renders `/favicon-32.png` through an
`<img>`, so the mark is whatever the favicon is, and there is no second copy of
the geometry to keep in sync.

`icon.svg` is **not vector**. It is an `<svg>` wrapping one
`data:image/png;base64` payload, zero `<path>` elements. It is valid and
renders, but it does not scale cleanly and it is larger than `icon-512.png` for
the same pixels. If a true vector mark ever exists, this is the file to replace.

The nav brand is written by `build.js`, not by hand. It is now the cube mark
plus the name as **live text**, so `nav.brand` is what the visitor reads rather
than only the accessible name, and the `<img>` is `alt=""` because the adjacent
`<span>` already names the link. The three `case-studies/` pages are static and
carry the same markup and CSS, maintained by hand.

The name is deliberately smaller than the mark: 15px/600 beside a 30px cube,
about half its height, so it reads as a label rather than a second wordmark.
The old rule was 1.05rem/700, which was sized to style a PNG's alt text and is
too heavy next to a real icon. Do not let it creep back up.

`images/logo.png`, the 326x160 teal wordmark, is deleted. Its one non-obvious
reference was `logo_url` in `admin/config.yml`, the Decap **login screen**
graphic, which now points at the cube. Decap renders
`logo_url ? <img src=u> : <DecapLogoIcon>`, so a dead path there is a broken
image on the login page, not a fallback.

Note: the Eon Designs site now uses this favicon too. `designs/Assets/logo.webp`
is still the in-page logo, it is only the browser-tab icon that is shared.

## Admin Theme

`admin/index.html` carries the whole theme in one inline `<style>` plus the
preview registrations. Decap ships no theming API, so the CSS hooks on the
readable component suffix emotion leaves on its generated class names
(`[class*="-AppHeader"]`, `[class*="-ControlContainer"]`). If a Decap upgrade
renames a component, that rule silently stops applying, it does not break.

`[class*=...]` matches a **substring**, so a hook written for a parent silently
claims its children too. `-Card` also matches `-CardHeading`, `-CardBody`,
`-CardText`, `-CardFileIcon` and `-CardsGrid`; `-Toolbar` also matches
`-ToolbarContainer` and `-ToolbarButton`; `-ListCard` also matches
`-ListCardLink` and `-ListCardTitle`; `-LoginButton` also matches
`-LoginButtonIcon`. Before adding a hook, check whether Decap emits a longer
component name containing it, and exclude it with `:not()` if so. This is the
single easiest way to break this file, and it has caused every visual defect
found on this panel so far bar one.

Decap sizes its toolbar buttons with `height:36px`, a matching
`line-height:36px`, `padding:0 15px` and an `overflow:hidden`, against a global
`box-sizing:border-box`. Do not add vertical padding to them. The height stays
pinned, so the padding eats the content box while the 36px line box is still
laid out from the top of it, and the label sits low and clips against the
bottom edge. Centre the label with flex instead, which survives later changes
to height, border width, font size and weight.

The tell is a control that has grown an inner control: a box around a label, a
pill inside a pill. Watch hover especially, because a child caught this way
matches `:hover` on its own when the cursor is over it, so it lifts and
lightens independently of the parent it lives in.

The opposite failure also happens: a hook that matches **nothing**, which is
invisible until you notice the styling it promises never applied. `-Toast`
(Decap ships react-toastify, the classes are `Toastify__*`), `-MediaCardText`
(the component is `-CardText`) and `-PageLogoIcon` on the login screen (that
component belongs to a module the auth page does not use) were all dead. If a
rule looks like it should explain what you are seeing and does not, verify the
component name is really emitted before trusting it.

Three structural pieces worth knowing:

- The brand bar outranks Decap's sticky header, which means it also outranks the
  modal layer. `body.ReactModal__Body--open .ega-brand { display: none }` steps
  it aside while the media library is open. Keep that rule if you touch the
  z-index.
- The wordmark is a real `<header class="ega-brand">` fixed above the app,
  because Decap has no slot for one. `body` gets `padding-top` and Decap's own
  sticky header is offset by the same `--bar` value. Change one, change both.
- Both collections contain files named `meta`, `nav`, `hero`, `about`, and
  `contact`, and Decap keys preview templates by file name. So a single
  dispatcher is registered under every name and branches on
  `collection.get('name')` to pick the engineering or designs renderer.

Preview panes reuse the real class names and values from the live pages, so a
change to `index.html` component CSS should be mirrored in the
`registerPreviewStyle` block or the preview will drift out of date.

Preview keys are positional. `resetKeys()` runs at the top of `Preview` so a
node keeps its key across renders. Do not make `key()` monotonic again, that
remounts the entire preview subtree on every keystroke.

`registerPreviewStyle(css)` treats its first argument as a **URL**. Raw CSS
needs the second argument, `{ raw: true }`. Without it the whole stylesheet
string is set as a `<link href>`, requested as a path, and 404s, so every
preview silently renders unstyled in Times New Roman. The one call that should
omit the flag is the Google Fonts one, because that really is a URL. To check
it is live: `iframe.contentDocument.styleSheets[1].cssRules.length` should be
non-zero, and there should be a `<style>` in the iframe, not a giant `<link>`.

The editor route (`-EditorContainer`) is `position:absolute; inset:0` against
the viewport, so it never inherits the `--bar` body padding the way the
collection list does. It needs both `top` and `height` overridden; Decap sets
an explicit height, so moving `top` alone pushes the bottom of both panes off
screen.

## Verifying admin fixes

Drive the panel with **real clicks** (`a.click()` on the entry links, or
Playwright clicks). Do **not** navigate by assigning `location.hash`. The URL
and the field labels update either way, but only a real click fires the
entry-load side effect, so hash assignment leaves the draft parked on the
previously loaded entry, and the preview looks frozen. That is a testing
artifact, not a product bug. It cost a full round of misdiagnosis on
2026-07-31.

Contrast checks on the preview must resolve gradients. `.skill-block
.certifications` paints with `background-image: linear-gradient(...)` and a
transparent `background-color`, so a checker that only walks `backgroundColor`
falls through to white and reports a bogus ~1:1 on white-on-emerald text.

## Known upstream bug: preview sync-scroll

The sync-scroll toggle at the top right of the editor works as a control, but
the preview never follows. This is a Decap bug, not a theme regression, and it
is not reachable from `admin/index.html`.

Decap mounts the preview pane's scroll target as

```js
<ScrollSyncPane attachTo={frameContext.document.scrollingElement}>
```

passing a raw DOM element. `react-scroll-sync` expects a **ref object** and
resolves it with `node = this.props.attachTo.current`, so the lookup yields
`undefined`, `componentDidMount` skips `registerPane`, and the preview is never
registered. Only the left editor pane is registered, and the sync loop skips
the pane the event came from, so nothing moves. The toggle itself is fine: it
flips `scrollSyncEnabled` and writes it to localStorage.

The bundle is loaded from unpkg, so there is nothing local to patch. The only
in-repo fix is a standalone shim that listens on the control pane and drives
`iframe.contentDocument.scrollingElement.scrollTop` itself. That reimplements
the feature rather than fixing it, and it would double-sync if Decap ever ships
the upstream fix, so it has not been written. Left deliberately broken.

## Changing the domain

`build.js` has a single `SITE` constant near the top, and everything it
generates (canonical links, og:/twitter: tags on the journal pages and the
designs site) is built from it. Setting the `SITE_URL` environment variable in
Vercel overrides it with **no code change at all**. Verified by running
`SITE_URL=https://edwingyasi.me node build.js` and confirming every generated
absolute URL moved, then reverting.

Same-site links in `/content` are stored **root-relative** (`/designs`,
`/og-designs.png`) precisely so they survive a domain move untouched.
`abs()` in `build.js` absolutises them at build time where a full URL is
required, which is only ever og:/twitter: and canonical.

These are NOT generated and still need editing by hand:

| File | What |
|---|---|
| `admin/config.yml` | `base_url`, `site_url`, `display_url` |
| `admin/index.html` | brand-bar link, and the URL shown in the login preview |
| `case-studies/*.html` | canonical + og:/twitter: on all three, they are static |
| `robots.txt` | the `Sitemap:` line |
| `sitemap.xml` | the one `<loc>` |
| `content/engineering/projects.json` | the Eon strip label reads "Visit edwingyasi.online" — display text, so it is CMS content |

Outside the repo, and only the owner can do these:

- Add the new domain in Vercel and point DNS at it.
- **Keep the old domain registered and redirecting.** That 301 is what carries
  the existing Google ranking. Google's guidance is a year minimum.
- Update the **GitHub OAuth App callback URL**. It must match exactly or the
  CMS login breaks the moment the domain changes.
- Google Search Console: add the new property, verify, then run **Change of
  Address**.

## Updates Log

- 2026-08-04: A third mobile pass that cut **spacing** rather than type.

  **The nav brand name stays visible at all times.** A scroll-reveal was tried
  here (hide `.brand span` until the hero scrolls away, to stop the name
  reading twice on the first screen) and the owner rejected it: the name is
  wanted beside the mark permanently. Do not reintroduce it.

  On "everything looks too big" the measurement said the type was already fine
  (body 15.5px, section titles 25.9px) and the real cost was **vertical
  rhythm**: `section.sec` carried 72px of padding top and bottom, so a 390px
  screen scrolled 8821px. Phone spacing is now roughly two thirds of desktop
  (sections 41.6px, cards 18.4px, grid gaps 13.6px, badges and skill icons
  tightened), with type nudged one step down alongside it. Page height came
  down to 7582px, about 14 percent shorter, and four skill badges now fit a row
  where two did before. Body copy is 15px and should not go below that.


- 2026-08-01: Clean URLs, and link-preview cards that actually render.

  **`cleanUrls: true` in `vercel.json`.** Note `vercel.json` is validated
  against a strict schema that **rejects unknown top-level keys**, so the
  `"//name": "explanation"` trick for commenting JSON breaks the deployment
  outright. It is not a warning, the build fails and the previous version
  stays live. Explanations for that file belong here, not in it.

  Pages are now `/journal/my-post` and
  `/case-studies/geofield`, no `.html`. Vercel 308-redirects the old `.html`
  form, so anything already shared keeps working. Canonical and `og:url` must
  be the **clean** form or they point at a redirect. Note `python3 -m
  http.server` does not do this, so extensionless links 404 under it; `npx
  serve` handles them.

  **Share cards.** A shared post previewed badly for two reasons. The
  `og:image` was the post cover, `designs/Assets/NewJuaben1.webp`, and it was
  **640x480 WebP**: WhatsApp and most scrapers will not render WebP, and they
  want roughly 1200x630. Separately the three `case-studies/*.html` pages had
  **no og tags at all**, so they previewed as a bare link.

  `buildJournalPages` now picks the share image in this order: a pre-rendered
  `images/og/<slug>.jpg`, else the cover if it is already JPEG or PNG, else
  `/og-engineering.png`. So a post always previews with something. The
  1200x630 `og:image:width`/`height` pair is emitted **only** for the two
  known-sized sources; declaring it for an arbitrary CMS upload would tell the
  scraper the wrong shape. The case study pages got canonical, og: and
  twitter: tags by hand, since they are static.

  The cards in `images/og/` were generated by loading the source image into a
  1200x630 page in headless Chromium and screenshotting it as JPEG. Serve the
  image over **http://**, not `file://`: a `file://` `<img>` inside
  `page.setContent` does not load, and the screenshot silently comes out as an
  empty box. Regenerate the same way if a cover changes.

  The Cover Image hint now says JPG or PNG rather than WEBP, because a WEBP
  cover silently falls back to the generic site card.

- 2026-08-01: Journal posts moved from a list widget to a **folder collection**,
  so the panel can delete them.

  A post deleted in the panel stayed live, and the toolbar read "Published"
  (Decap's label for "no unsaved changes") rather than offering "Publish".
  Removing an item from a `widget: list` inside a file collection had not
  marked the entry dirty, so nothing was ever committed. Verified against
  `origin/main`: the only CMS commit touching the file was the one that added
  the post, and no delete commit exists. This could not be reproduced here,
  because the panel loads Decap from unpkg and the sandbox blocks it.

  Rather than work around the list widget, posts are now **one file each** in
  `content/engineering/journal/`, exposed as a top-level `journal_posts` folder
  collection. Folder collections have first-class **New Post** and **Delete
  entry** actions that commit immediately, which sidesteps the dirty-tracking
  problem entirely. `content/engineering/journal.json` keeps only the section
  heading now.

  Consequences worth knowing:
  - The **filename is the slug and therefore the URL**, so renaming a post no
    longer changes its link. `build.js` reads the folder with
    `loadJournalPosts()`.
  - Dates are stored ISO (`YYYY-MM-DD`) via a datetime widget so posts sort
    newest first, and `displayDate()` renders "Dec 09, 2025". It parses the
    string by hand rather than with `Date()`, which would shift a bare
    `YYYY-MM-DD` by a day in a negative-offset timezone.
  - The preview dispatcher keyed on entry slug **before** collection name,
    which was safe only while every entry was a fixed file name. With
    user-named posts, an article titled "Hero" would have rendered with the
    hero-section renderer. It now skips the slug lookup for folder
    collections (`props.collection.get('folder')`).
  - A folder collection is a **top-level** entry in `collections:`, not an item
    under a file collection's `files:`. Nesting it parses but does nothing.

  The projects list still uses a list widget, so the same deletion problem may
  apply there; it has not been converted.

- 2026-08-01: Hero name set edge to edge, plus two CMS findings from real use.

  **Hero name.** The name now fills the column on phones and still never wraps.
  A fixed vw value cannot do both: the width the name needs depends on the font
  that actually loaded, and a value safe for the fallback font leaves the
  webfont looking small. So `fitHeroName()` in the page script measures the
  rendered text once at a known size and scales to the available width, to
  98.5% fill. It re-runs on `document.fonts.ready` and on resize, and only
  below 600px. The CSS clamp (7.8vw) stays as the no-JS fallback and the
  pre-fit value, so the name is never oversized before the script runs. The
  `white-space:nowrap` on the mobile rule is safe only because that fallback
  fits unaided; do not raise the clamp.

  **Media over 1 MB looks broken in the panel but is fine on the site.** A
  1.62 MB upload rendered as a broken thumbnail in both the image widget and
  the preview pane, while displaying correctly on the live site. Decap's GitHub
  backend loads media through the **Contents API, which only returns file
  content up to 1 MB**; past that the editor has nothing to draw, but the file
  is committed normally and Vercel serves it straight from the repo. Not a
  theme bug and not fixable in `admin/index.html`. The Cover Image field now
  carries a hint saying to keep uploads under 1 MB.

  **Deleting a list item does not save by itself.** A post removed in the panel
  was still live because the change was never committed: `publish_mode: simple`
  means nothing reaches GitHub until **Publish** is clicked, and the button
  keeps reading "Published" from the previous save, which makes it look done.
  Confirmed by reading `content/engineering/journal.json` on `origin/main`,
  where the post was still present. When a deletion "does not take", check the
  file on the remote before touching the build; the generator is not at fault,
  the commit never happened.

- 2026-08-01: Second mobile type pass, and the name now holds one line.

  Headings came down again (section titles 29.6px -> 25.9px, contact heading
  25.9 -> 23.2, card titles ~19 -> 17.6). Body copy stayed at **15.5px and
  should not go lower**; it is already at the low end of comfortable, and the
  complaint was about heading weight, not paragraphs.

  The hero is now `clamp(1.35rem, 7.8vw, 2.35rem)`, sized from measurement so
  "Edwin Gyasi Owusu." stays on ONE line. At this weight and tracking the name
  needs roughly **10.7px of width per 1px of font size**, so the ceiling is
  (viewport - 40px gutters) / 10.7: about 26px at 320, 30px at 375, 33px at
  430. 7.8vw sits under that everywhere. **Raising this re-wraps the name**,
  and the old fixed `1.95rem` override in the 380px query was removed for the
  same reason.

  Three traps found in the process, all invisible without a browser:

  - The hero roles joined with `&nbsp;·&nbsp;`, so the ONLY break points were
    the ordinary spaces inside role names: the line broke as "Geological /
    Engineer". Each role is a `<span class="role">` with `white-space:nowrap`
    now and the separators are ordinary spaces. Making both unbreakable is the
    obvious wrong fix, it leaves no break point at all and overflows.
  - `.brand span` wrapped at =<340px. It is a **flex item**, so wrapping shows
    up as doubled height, NOT as two client rects; `getClientRects().length`
    reports 1 either way. Check the height.
  - After `white-space:nowrap` fixed that, the name overflowed its flex space
    at 320px and the CTA painted over the last letters. `getBoundingClientRect`
    on `.brand` reports the allotted width, not the overflowing content, so it
    showed no overlap while the screenshot clearly did. Measure the text with a
    `Range` over the span, and look at a screenshot. Both sides shrink under
    380px now.

- 2026-08-01: Content edits, plus hardening the CMS against non-coder input.

  Removed the Energy Efficiency Audit project (not a real project) and deleted
  its now-orphaned `case-studies/energy-audit.html`, recoverable from git.
  Certifications: Google Data Analytics is complete, so `· 3 / 8` became
  `Certificate`; French and Genser were dropped.

  The projects subtitle hardcoded a count ("Three case studies", later "Four"),
  which silently goes stale every time a project is added or removed. It is
  count-free now. **Do not reintroduce a number into that string.**

  The panel is operated by someone who does not edit code, so two real traps
  were closed in the project card renderer:
  - `href` was always rendered as an `<a>`, so a project added before its case
    study page exists would have linked to a 404. `href` is optional now: blank
    renders a `<div class="project-card no-link">` with the arrow suppressed and
    the hover lift disabled, and an `https://` value opens in a new tab.
  - `p.tools.map` and `b.badges.map` threw on an empty list, which fails the
    whole build, not just that card. Both are `(x || [])` now.
  Verified by adding a project with no link and no tools plus a new journal
  post, building, and confirming the page renders and the post's page appears.

  `admin/config.yml` gained hints saying exactly this, and the Journal
  collection has a description noting its pages are created automatically.

  **YAML trap worth remembering:** a block scalar (`>-`) cannot be used inside
  a flow mapping (`- { label: x, hint: >- ... }`). It throws
  `BAD_SCALAR_START` and takes the entire admin panel down, not just that
  field. Fields needing a multi-line hint must be written in block style. This
  was caught only because the config is parse-checked; do that after editing it.

- 2026-08-01: Journal posts are **real pages** now, not a modal, and the card
  hover rail is one colour.

  Each post renders to `journal/<slug>.html`, generated by `build.js` because
  posts come from the CMS and cannot be hand-written like `case-studies/`.
  **Do not hand-edit anything in `journal/`, the directory is rewritten on
  every build.** Stale pages are deleted on each run, so renaming or removing a
  post in Decap does not leave an orphan URL behind; slugs are de-duplicated
  with a numeric suffix so two posts sharing a title cannot overwrite each
  other. The page template mirrors the `case-studies/*.html` stylesheet so an
  article and a case study read as the same site, and each page carries its own
  canonical, og: and twitter: tags, which the modal could not have.

  Removed with the modal: the `.journal-modal*` and `.post-*` CSS in
  `index.html`, the reader script in the IIFE, and the hidden
  `.journal-sources` block that existed only to feed it. Cards are `<a>`
  elements now rather than `<button>`. `icon()` throws on an unknown name, so
  `arrow-left` had to be added to `STROKE_ICONS` for the back link.

  Hover colour: `.project-card::before` and `.journal-card::before` painted a
  `linear-gradient(90deg, emerald, gold)` rail, which read as a two-tone
  green-and-yellow sweep. Both are solid `--emerald` now, in `index.html` and
  in the matching `registerPreviewStyle` rules in `admin/index.html`. The
  journal date pin was gold and is now emerald, matching the project card pin.
  Gold survives as a static accent elsewhere (the stat "+"), it is only the
  hover rail that was two-tone.

  Note `sitemap.xml` still lists only the homepage. Journal posts and case
  studies are reachable by crawl from the homepage, but they are not enumerated
  there.

- 2026-08-01: Added **GeoField** as the lead project, plus a mobile type-scale
  fix. GeoField lives in two other repos, `Eddywin-bit/geofield-instrument`
  (the app) and `Eddywin-bit/geofield-assets` (APK and the 92MB Ghana
  PMTiles); neither is part of this repo, so they were attached to the session
  and cloned to `/workspace/`.

  The project images are **real UI, not mockups**: the app was installed and
  run (`npx vite dev --host 127.0.0.1`, IPv4 is required, the sandbox has no
  IPv6 and the default `--host` fails with `EAFNOSUPPORT`), then screenshotted
  at 412x892 with geolocation faked to KNUST so the Locate and Log screens show
  a genuine identification (Granitoid Undifferentiated). Screens are in
  `images/geofield/`; `hero.png` is a 16:9 composite built by screenshotting a
  local HTML file that frames two of them, since project cards need 16:9 and a
  phone screenshot is tall. If the app UI changes, regenerate rather than edit.

  Case study facts come from the app repo, not invention: 17 mapped geological
  units, `com.eondesigns.geofield`, Capacitor 7 + React/TS, MapLibre GL v5, the
  92MB PMTiles basemap fetched in resumable ranged chunks, and the removed
  static-averaging GPS mode. That repo's CLAUDE.md marks the geology engine and
  data shapes as locked files, so treat its content as read-only reference.

  `projects.json` gained the entry and the previous `wide` card was set narrow,
  since only one card should span the grid. The section subtitle said "Three
  case studies" and is now "Four" — that string is content, so it does not
  update itself.

  Mobile type: the phone scale was genuinely oversized, measured at 390px as
  hero 50.7px and section titles 35.2px. The `max-width:600px` block now sets an
  explicit scale (hero 39px, section titles 29.6px, contact heading 25.9px,
  body 15.5px), and the 380px hero override dropped 2.3rem -> 1.95rem. Headings
  took the cut; body copy stays near 15-16px. For reference the designs site was
  already modest on mobile (hero `text-4xl` = 36px, sections `text-3xl` = 30px),
  so it was left alone; the engineering site was the outlier.

- 2026-08-01: Added a **Journal** section to the root site, and split the
  journal content between the two sites by topic. The root site is the owner's
  personal site (engineering plus data analytics plus writing), not only an
  engineering CV, so long-form writing lives there now. "Empowering the Next
  Gen" moved from `content/designs/journal.json` to a new
  `content/engineering/journal.json`; the two design essays (Typography is
  Voice, Why 'Eon'?) stay on Eon Designs. Posts are **not** duplicated: each
  lives in exactly one place, so there is one copy to edit.

  New region `e-journal` (engineering is 10 regions now, was 9), a `#journal`
  section between Experience and Contact, and a nav link added via
  `content/engineering/nav.json`. Cards reuse the `.project-card` language
  (hover lift, emerald-to-gold top rail) with a gold date dot to distinguish
  them.

  The existing `renderMarkdown` could **not** be reused: it emits Tailwind
  utility classes, which only exist on the designs site. The root site is plain
  custom CSS, so `ejBody`/`ejInline` render the same markdown subset (###,
  bullets, image groups with an italic caption line, bold/italic/links) as
  semantic tags styled under `.post-body`. Same authoring rules, two renderers,
  because the two sites do not share a stylesheet.

  Full post bodies are emitted into the page inside a hidden
  `.journal-sources` block and cloned into the modal on click, so the writing
  is in the static HTML for SEO rather than existing only in JS.

  CMS: new "8. Journal" file collection (Contact and Footer renumbered to 9 and
  10). Note both collections now contain a file named `journal`, so the admin
  preview dispatcher needed `E.journal` added beside `D.journal` — without it
  the engineering entry silently falls through to the generic `Fallback`
  preview. Preview styles for `.journal-*` were mirrored into the
  `registerPreviewStyle` block per the existing rule.

- 2026-08-01: Fixed three empty social icons on both sites' contact rows.
  lucide dropped its brand icons, so `data-lucide="instagram"`, `"twitter"`,
  and `"facebook"` rendered nothing, leaving empty bordered boxes (Pinterest
  was fine because it was already an inline SVG). Added the three brand paths
  to `FILL_ICONS` in `build.js` and generalised the social renderer to emit an
  inline SVG for any network present there, falling back to lucide otherwise.
  General lesson: do not rely on an icon CDN for brand marks, they get removed
  for trademark reasons. The X mark is keyed as `twitter` to match the content.

- 2026-08-01: Flipped the `/designs/` (Eon Designs) site from its dark luxury
  theme to a warm off-white light theme. Everything else (layout, content,
  images, animations) is unchanged. The theme was baked into ~180 Tailwind
  utility classes across three files, so the change spans all three: the
  `tailwind.config` in `designs/index.html` (base surfaces via the `dark-950`/
  `dark-900` tokens now resolve to `#f9f8f6`/`#efece7`, a new `ink` `#141414`
  token for dark text and inverted chips, and a darkened `gray` scale for muted
  text on light), the CMS-region templates in `build.js`, and the
  script-injected cards/modals/vault/chat in `designs/js/app.js`. Champagne
  accent darkened `#E0D4C5` -> `#b8a688` (`brand-500`) so it reads on cream, as
  the owner approved. `white`/`black` could not be token-remapped because the
  design uses them in two opposite roles (base light surfaces vs inverted
  accent chips), so those were converted per-usage. Surfaces kept deliberately
  dark: the lightbox backdrop and image hover scrims (white captions stay). The
  nav mark `Assets/logo.webp` is white artwork, invisible on cream, so
  `#logo-img { filter: brightness(0) }` in the base `<style>` darkens it.
  `content/designs/about.json` carried two hardcoded `text-white` emphasis
  spans (the one place a color class lives in content, not a template); changed
  to `text-ink`. Note the Tailwind CDN the site loads at runtime is blocked in
  the web session sandbox, so the styled page could not be screenshot-verified
  there; verification was static plus a direct look at the logo asset. General
  lesson: this site's color is spread across config + `build.js` + `app.js` +
  one content JSON, and a token remap only reaches single-role tokens.

- 2026-07-31: New brand assets, and a nav padding bug found while fitting them.
  The nav is the cube mark plus the name as live text now, on `index.html` via
  `build.js`, on the three case studies by hand, and in the admin brand bar.
  `images/logo.png` is gone; `admin/config.yml` had the only reference that
  would have broken silently.

  The reported symptom was "the logo and Contact button touch the screen edges
  on mobile", but it was never a mobile rule. `.nav-inner` carried
  `padding: 1rem 0`, and the element is `class="wrap nav-inner"`, so that
  shorthand reset `.wrap`'s `padding: 0 clamp(1.25rem, 4vw, 2rem)` to zero at
  **every** width. Above 1180px the max-width centring hands back a margin and
  hides it; from 1180px down the bar runs flush. Both that rule and its
  `.scrolled` twin use vertical longhands now, so the two rules compose. At
  375px the gutters measure 20px a side with 40.8px between brand and CTA,
  which needed no further tightening in the 380px query.

  General lesson: on an element with two layout classes, prefer longhands.
  A shorthand in the later rule silently discards the other rule's sides.

- 2026-07-31: Took the fill back off the header tabs. The selected tab and the
  selected collection in the sidebar were both --emerald-tint blocks a short
  distance apart, so they merged into one green shape and the header stopped
  reading as its own region. The tabs now carry no background in any state and
  spell selection with a rail under the label; fill belongs to the sidebar
  alone. Keep it that way, and note the hover rule has to restate
  `background: transparent` because `[class*="-AppHeader"] a:hover` fills it
  --emerald-soft at equal specificity.

  Scoping the chrome rule to `header[class*="-AppHeader"]` fixed a collision
  that had been there since the first theme: -AppHeader is a prefix of
  -AppHeaderContent, -AppHeaderNavList, -AppHeaderNavLink, -AppHeaderButton,
  -AppHeaderActions, -AppHeaderQuickNewButton and -AppHeaderLogo, so the panel
  background and bottom hairline meant for the bar were being drawn on all
  seven. The bar's real bottom edge was one hairline among several, which is
  the opposite of the separation it exists to provide.

- 2026-07-31: Header tabs and the Published control. The Contents/Media tabs
  had never had a selected state, for two reasons at once: the rule was hung
  off `-AppHeaderActions` while the tabs live in `-AppHeaderNavList`, and the
  selected class is not an emotion class at all. Decap passes react-router
  `activeClassName="header-link-active"`, a plain literal, so `[class*="active"]`
  could not have reached it either. Media is a `<button>` opening a modal, not
  a route, so it can never take that class; its lit state comes from
  `body.ReactModal__Body--open`. Also unstuck the leading icons, which carry
  Decap's own `color:#b3b9c4` and so ignored every colour set on the tab.

  The Published button was still sitting low after the toolbar centring in
  06bf3b6, because that fix never reached it. Its label is
  `PublishedToolbarButton`, and `[class*="-ToolbarButton"]` matches on the
  hyphen, which the "d" in "Published" occupies. It is not a ToolbarButton in
  any case, it is a DropdownButton like the "Publish" half. New instance of a
  familiar failure, but the mirror image of the usual one: not a hook claiming
  a child it should not, a hook missing a component whose name merely looks
  like it contains it. **`[class*="-X"]` needs the hyphen too, so a label that
  ends in X is not matched by a hook for -X.** Both halves also had their
  dropdown caret pinned at `top:16px`, measured against a borderless box, now
  centred.

- 2026-07-31: Fixed the light node on the login button. `-LoginButton` is a
  prefix of `-LoginButtonIcon`, so the provider icon was being painted as its
  own pill inside the button, and on hover it matched `:hover` in its own
  right and lifted a lighter pill out of the left of the control. Fourth
  instance of the same substring collision, so the rule above now lists every
  pair seen and describes the hover tell.

- 2026-07-31: Login screen, in two passes. First removed `logo_url`, which had
  been pointing at `og-engineering.png` and putting a dark 1200x630 Open Graph
  tile across the middle of a light screen. That turned out to be half the
  story: Decap's auth page is `logo_url ? <img> : <DecapLogoIcon 300px>`, so
  clearing the key just handed the slot to their pink wordmark. There is no
  "no logo" state. Pointed it at `/images/logo.png` instead and hid
  `-NetlifyCreditIcon`, the credit mark Decap only appends on the custom-logo
  branch. The `-PageLogoIcon` / `-CustomLogoIcon` hooks that were supposed to
  control this matched neither branch and never fired, which is why the OG card
  showed with an apparent `display:none` sitting right above it: the auth page
  is the `exus10f*` family, and `PageLogoIcon` lives in an unrelated module.
  The heading had been absolutely positioned at a pixel offset measured to
  clear the old logo, which is what made them overlap; it is a flex item now,
  ordered between the mark and the button.

- 2026-07-31: Swapped in the supplied brand artwork. The engineering nav brand
  is an `<img>` now, changed in `build.js` rather than `index.html` because the
  next CMS publish rewrites that region. The admin bar's inlined monogram SVG
  became an `<img src="/favicon-32.png">`, which removes the duplicate copy of
  the mark that had to be kept in sync by hand. Publish toasts were being
  covered by the brand bar: Decap ships react-toastify, whose container is
  fixed top-right at z-index 9999 with a 16px offset, against `.ega-brand` at
  10000 across the same strip. The toast now clears the bar instead of fighting
  it for the space. `case-studies/*.html` still carry the old text wordmark.

- 2026-07-31: Fixed the editor's Published/Publish control and the media
  library's non-image placeholder. The status button was white-on-white at
  1.0:1 because `[class*="-ToolbarButton"][class*="-Toolbar"]` matches itself
  ("-ToolbarButton" contains "-Toolbar") and outranked the rule supplying the
  background, keeping only its `color:#fff`. Its unpublished twin was the
  mirror image, --ink-mute on emerald at 1.05:1, because that state is built
  from DropdownButton rather than ToolbarButton and so was reached only by a
  one-attribute selector that `[class*="-Toolbar"] button` beat. Both states
  now sit above 4.5:1. Also gave non-image media entries a real placeholder:
  `-CardFileIcon` is an empty div Decap never fills, and `-CardText` is the
  filename, and both begin with "-Card", so both were being drawn as nested
  white panels.

- 2026-07-31: Simplified the collection entry cards to plain rectangles with a
  hover lift. Same substring trap as always: `-ListCardLink` and
  `-ListCardTitle` both contain "ListCard", and the collection grid is called
  `-CardsGrid`, so the card treatment was painting a bordered panel on the link
  *and* the heading *and* the grid. That is where the box around the "3. Hero"
  text came from. Dropped the emerald-to-gold `::before` hairline and the
  emerald hover border; hover is now a 2px lift plus a soft neutral shadow.

- 2026-07-31: Browser audit of the live panel, then five real fixes. The big
  one: `registerPreviewStyle` was missing `{ raw: true }`, so no preview has
  ever been styled. That also explained the oversized preview images, since the
  missing sheet is what carries `img{max-width:100%}`. Also offset the editor
  route out from under the brand bar (four toolbar controls were unclickable),
  re-rooted the designs previews' `Assets/` paths to `/designs/`, stopped
  `D.about` escaping its inline markup, and corrected two media-modal contrast
  hooks, one of which (`-MediaCardText`) named a component Decap does not emit.
  The reported stale-preview bug turned out **not to exist**: it was an artifact
  of driving navigation with `location.hash`, now written up above. Ignored
  `.playwright-mcp/`, `scratchpad/`, and the two audit screenshots, by name
  rather than `*.png`, since the favicons and og: images sit at the repo root.

- 2026-07-30: Fixed five admin preview and chrome defects. Four were the same
  root cause, `[class*=...]` substring collisions claiming child components,
  which is now written up as a rule above. The fifth was monotonic React keys
  remounting the preview on every keystroke. Verified from source only, the
  reported stale-preview-content symptom is still open and needs a browser.
- 2026-07-30: Re-themed the admin panel to the engineering site's light palette
  and added a site-wide favicon set. The first admin theme borrowed the Eon
  dark/champagne identity, which read as a third brand rather than as part of
  either site. Now every token comes from the `:root` block of `index.html`.
  Also replaced the generic field-dump preview with per-section templates that
  render the real components. Preview panes for Eon Designs sections stay dark,
  since that is what the page they edit actually looks like.
- 2026-05-19: Built designs/ v2 but looked too similar to old site because brief said "preserve existing brand identity." New build (eon/) starts completely fresh with no reference to old site structure.
- 2026-07-30: Fixed `Failed to load config.yml (404)`. Cause was relative path resolution, not a missing or blocked file. Vercel serves the panel at `/admin` without a trailing slash, so Decap's default relative `config.yml` resolved to `/config.yml` at the site root. Fixed with an absolute `cms-config-url` link. Also pinned all absolute CMS URLs to the canonical `www` host, since the apex 307-redirects and an OAuth popup should not travel through a redirect.
- 2026-07-30: Added Decap CMS covering both live sites. Chose build-time injection over client-side hydration so edited content stays in the static HTML for SEO and link previews. This required marking regions in `index.html` and `designs/index.html` and switching the root Vercel project from pure-static to `node build.js`. Verified the rendered output is byte-identical to the pre-CMS pages. Superseded the old "never modify root / never touch /designs/" rules, which are incompatible with a CMS that edits both sites.
