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
| `icon.svg` | modern browsers, scales cleanly |
| `favicon-16.png`, `favicon-32.png` | explicit raster sizes |
| `apple-touch-icon.png` | 180px, iOS home screen |
| `icon-192.png`, `icon-512.png` | PWA, referenced by `site.webmanifest` |

The mark is an "E" monogram: emerald plate (`#0F766E` → `#0A5952`), off-white
stem and upper arms, gold lower arm echoing the emerald-to-gold rule on the
project cards. It is regenerated by a throwaway zero-dependency Node script
(rasteriser + PNG encoder via `zlib` + ICO packer), not by an image editor.
The same geometry is inlined as SVG in the admin brand bar. To change the mark,
edit the SVG in `admin/index.html` and re-derive the rasters to match.

Note: the Eon Designs site now uses this favicon too. `designs/Assets/logo.webp`
is still the in-page logo, it is only the browser-tab icon that is shared.

## Admin Theme

`admin/index.html` carries the whole theme in one inline `<style>` plus the
preview registrations. Decap ships no theming API, so the CSS hooks on the
readable component suffix emotion leaves on its generated class names
(`[class*="-AppHeader"]`, `[class*="-ControlContainer"]`). If a Decap upgrade
renames a component, that rule silently stops applying, it does not break.

`[class*=...]` matches a **substring**, so a hook written for a parent silently
claims its children too. `-Card` also matches `-CardHeading` and `-CardBody`,
`-Toolbar` also matches `-ToolbarContainer`. Before adding a hook, check whether
Decap emits a longer component name containing it, and exclude it with `:not()`
if so. This is the single easiest way to break this file.

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

## Updates Log

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
