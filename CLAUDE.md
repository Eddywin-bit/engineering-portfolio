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

## Updates Log

- 2026-05-19: Built designs/ v2 but looked too similar to old site because brief said "preserve existing brand identity." New build (eon/) starts completely fresh with no reference to old site structure.
- 2026-07-30: Fixed `Failed to load config.yml (404)`. Cause was relative path resolution, not a missing or blocked file. Vercel serves the panel at `/admin` without a trailing slash, so Decap's default relative `config.yml` resolved to `/config.yml` at the site root. Fixed with an absolute `cms-config-url` link. Also pinned all absolute CMS URLs to the canonical `www` host, since the apex 307-redirects and an OAuth popup should not travel through a redirect.
- 2026-07-30: Added Decap CMS covering both live sites. Chose build-time injection over client-side hydration so edited content stays in the static HTML for SEO and link previews. This required marking regions in `index.html` and `designs/index.html` and switching the root Vercel project from pure-static to `node build.js`. Verified the rendered output is byte-identical to the pre-CMS pages. Superseded the old "never modify root / never touch /designs/" rules, which are incompatible with a CMS that edits both sites.
