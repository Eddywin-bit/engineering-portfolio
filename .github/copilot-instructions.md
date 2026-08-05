# Copilot instructions — edwingyasi.online

Repository rules and hard-won traps for this project. Read this before changing
anything. Most of the rules below exist because breaking them has already broken
the live site at least once.

The owner is **Edwin Gyasi Owusu**, a geological engineering graduate of KNUST in
Ghana and founder of Eon Designs. He is not a developer. He maintains this site
through a CMS panel, not by editing code. Anything you change must keep that
true: if a change means he has to touch code to update content, it is wrong.

`CLAUDE.md` in the repo root holds the full dated history of why things are the
way they are. This file is the working ruleset. If the two ever disagree, this
file wins, but read the history before overturning a decision, because most of
them were made after a failure.

---

## 1. What this repository is

Two separate static sites, one repository, one deployment.

| Path | What it is | Live at |
|---|---|---|
| `/` | Engineering portfolio | `www.edwingyasi.online` |
| `/designs/` | Eon Designs portfolio | `www.edwingyasi.online/designs` |
| `/admin/` | Decap CMS panel that edits **both** | `/admin` |
| `/api/` | GitHub OAuth endpoints for the CMS | serverless |
| `/content/` | The content source of truth, JSON | not served |
| `/journal/` | Generated article pages | `/journal/<slug>` |
| `/case-studies/` | Three hand-written case study pages | `/case-studies/<slug>` |
| `/vault/`, `/ledger/` | Unrelated apps | **do not touch** |

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no build step
other than `node build.js`. Hosted on Vercel, which deploys automatically on
every push to `main`.

There is **no runtime dependency on any AI service.** The site is static files.
It will keep working indefinitely with no subscription to anything.

---

## 2. Hard rules

These are not stylistic preferences. Breaking any of them causes a visible
failure on a live site.

1. **Never touch `/vault/` or `/ledger/`.** They are separate projects that
   happen to live in this repository.
2. **Never commit a secret.** Not `ANTHROPIC_API_KEY`, not
   `GITHUB_OAUTH_CLIENT_SECRET`, not any token. They belong in Vercel's
   environment variables and nowhere else.
3. **Never hand-edit anything between `<!-- CMS:START name -->` and
   `<!-- CMS:END name -->`.** `build.js` overwrites those regions on every
   deploy, so your edit will vanish. Change the JSON in `/content/` instead, or
   change the generator in `build.js`.
4. **Never hand-edit `designs/js/data.js`.** It is generated from
   `content/designs/*.json`.
5. **Never hand-edit anything in `/journal/`.** The whole directory is rewritten
   on every build, and stale files are deleted.
6. **Always run `node build.js` and confirm it exits 0 before pushing.** It
   fails loudly if a CMS marker has gone missing, which is the main way this
   repo breaks.
7. **Do not add a number to a heading that describes a count.** "Three case
   studies" goes stale the moment a project is added. This has happened twice.

---

## 3. How content reaches the page

```
content/engineering/*.json  ──►  build.js  ──►  index.html            (10 regions)
content/engineering/journal/*.json ──► build.js ──► journal/<slug>.html
content/designs/*.json      ──►  build.js  ──►  designs/index.html    (12 regions)
                                           └──►  designs/js/data.js
```

The CMS commits JSON to `/content/`. Vercel then runs `node build.js`, which
renders that JSON into marked regions of the HTML. The important consequence:
**content ends up in the static HTML**, so search engines and link previews see
real text, not an empty shell. Do not replace this with client-side rendering.

Everything outside the markers — all CSS, all scripts, the layout — is never
touched by the build. The build is idempotent: running it twice changes nothing.

### The CMS panel

`admin/config.yml` defines the fields, `admin/index.html` carries the theme and
the preview renderers. Collections:

- **engineering** — 10 files: meta, nav, hero, about, projects, skills,
  experience, journal (heading only), contact, footer
- **journal_posts** — a *folder* collection, one file per post in
  `content/engineering/journal/`
- **designs** — 8 files: meta, nav, hero, works, vault, about, journal, contact

`publish_mode: simple`, so nothing reaches GitHub until **Publish** is clicked.

**If you add a field to `config.yml`, you must also render it in `build.js` and
mirror it in the preview renderer in `admin/index.html`.** All three or none;
a field that saves but never appears is worse than no field.

---

## 4. Traps that have already cost real time

### `vercel.json` rejects unknown keys
The schema is strict. The `"//comment": "..."` trick for annotating JSON
**fails the entire deployment**, silently leaving the previous version live.
Explanations for that file belong in this document, not in it.

### Admin theme: `[class*="-X"]` matches substrings
Decap ships no theming API, so `admin/index.html` hooks onto emotion's generated
class names. `[class*=...]` matches a **substring**, so a hook written for a
parent silently claims its children:

- `-Card` also matches `-CardHeading`, `-CardBody`, `-CardText`, `-CardsGrid`
- `-Toolbar` also matches `-ToolbarContainer`, `-ToolbarButton`
- `-ListCard` also matches `-ListCardLink`, `-ListCardTitle`
- `-LoginButton` also matches `-LoginButtonIcon`

The tell is a control that has grown an inner control: a box around a label, a
pill inside a pill. Before adding a hook, check whether Decap emits a longer
name containing it and exclude it with `:not()`. This has caused nearly every
visual defect ever found on that panel.

The mirror-image failure also happens: `[class*="-X"]` needs the hyphen, so a
component whose name *ends* in X is not matched by a hook for `-X`.

### `registerPreviewStyle` treats argument one as a URL
Raw CSS needs `{ raw: true }` as the second argument. Without it the entire
stylesheet string is set as a `<link href>`, requested as a path, and 404s, so
every preview silently renders unstyled in Times New Roman. The only call that
should omit the flag is one that really is a URL.

### YAML block scalars inside flow mappings
`- { label: x, hint: >- ... }` throws `BAD_SCALAR_START` and takes the **whole
admin panel** down, not just that field. Fields needing a multi-line hint must
be written in block style. Parse-check `config.yml` after editing it.

### An element cannot be its own container query container
`100cqw` resolves against the nearest **ancestor** container, never the
element's own. Declaring `container-type` and then using `cqw` on the same
element silently falls back to the viewport. This is why `.hero-part` (the
container) and `.hero-word` (the text) are separate elements.

### `<img width>` and `<img height>` are CSS presentational hints
`height="600"` lands as `height: 600px` and beats `aspect-ratio`, which only
governs when one axis is `auto`. Set `height: auto` explicitly. Keep the
attributes; they still reserve the box before the image loads.

### Clash Display stops at weight 700
There is no 800 or 900. Asking for one gets a synthesised fake bold that looks
nothing like the real face. The font is self-hosted at
`fonts/clash-display-var.woff2`, one variable file covering 200–700, 18KB.

### Measured type ratios are weight-sensitive
`--ratio` and `--ratio-m` in the hero are **measured**, not guessed. "EDWIN"
renders 3.21x its font size at weight 600 but 3.29x at 700. If you change the
heading weight, the name's sizing must be remeasured in the same pass or it will
overflow into the portrait or float short of it. Measure with a `Range` over
`.hero-word`; the element's own `getBoundingClientRect` reports the column it
fills, not the glyphs.

### Percentages hide invisible animations
Animation travel expressed as a percentage of a small element looks reasonable
in code and can work out to about one pixel. **Measure motion in pixels.**

### `cleanUrls` only strips `.html`
It will not rescue a wrong path to a PDF or an image. The CV is
`/Edwin_Gyasi_Resume.pdf`; a link to `resume.pdf` 404s silently.

### Media over 1 MB looks broken in the panel but is fine on the site
Decap's GitHub backend loads media through the Contents API, which only returns
file content up to 1 MB. Past that the editor has nothing to draw, but the file
commits normally and Vercel serves it. Not a bug to fix; the field hints already
say to keep uploads under 1 MB.

### Share images must be JPEG or PNG
WhatsApp and most scrapers will not render WebP, and they want roughly
1200x630. `buildJournalPages` picks, in order: a pre-rendered
`images/og/<slug>.jpg`, else the cover if it is already JPEG or PNG, else the
generic site card.

### Preview sync-scroll is broken upstream
The toggle works, the preview never follows. It is a Decap bug in how it passes
a raw DOM element where `react-scroll-sync` expects a ref. Not reachable from
`admin/index.html`. Left deliberately broken; do not write a shim.

---

## 5. Design system

Do not introduce new colours or fonts without being asked.

**Engineering site**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF8` | page background |
| `--ink` | `#1C1C1C` | body text |
| `--emerald` | `#0F766E` | accent, links, primary buttons |
| `--gold` | `#C89B3C` | secondary accent, used sparingly |
| `--font-heading` / `--font-body` | Clash Display | everything |

Headings are weight 600, secondary headings 500. Body copy does not go below
15px on phones.

Navigation is **two separate components**, not one that restyles: a floating
dark dock pinned to the bottom on desktop, a dark top bar plus a full-screen
overlay on phones, switched at 900px. Both are `position: fixed`, so `body`
reserves room with padding. They are different shapes; do not try to merge them.

**Eon Designs site** uses Tailwind via CDN with a config block inside
`designs/index.html`. Its colour is spread across that config, `build.js`, and
`designs/js/app.js`. A token remap only reaches single-role tokens; `white` and
`black` are used in two opposite roles there and must be changed per usage.

---

## 6. Working practice

- **Verify visually before claiming something is done.** Serve the repo with
  `npx serve .` (not `python3 -m http.server`, which does not do clean URLs) and
  look at the page at 320, 390, 768, 900 and 1440 wide.
- **Measure rather than eyeball** anything that is a match to a reference:
  contrast, spacing, type width, shape. Judging by eye has been wrong more often
  than it has been right on this project.
- **Check for horizontal overflow at every breakpoint.** It is the most common
  regression here.
- Prefer small, verifiable changes. Confirm the Vercel deploy went green after
  pushing, because a failed build silently leaves the old version live.

### Commands

```bash
node build.js          # required before every push; must exit 0
npx serve .            # local preview with clean URLs
npx decap-server       # local CMS backend (config has local_backend: true)
```

### Deploying

Push to `main`. Vercel builds with `node build.js` and deploys. There is no
staging environment, so `main` is production.

---

## 7. Things that live outside this repository

These cannot be restored from git. If they are lost, parts of the site break
with no way to reconstruct them from the code.

- **Vercel environment variables:** `GITHUB_OAUTH_CLIENT_ID`,
  `GITHUB_OAUTH_CLIENT_SECRET`, `ALLOWED_GITHUB_LOGIN`. Without these the CMS
  login fails.
- **GitHub OAuth App callback URL**, which must be exactly
  `https://www.edwingyasi.online/api/callback`.
- **Domain and DNS** configured in Vercel.

The canonical host is `www.edwingyasi.online`; the apex redirects to it. Use the
www host anywhere an absolute URL is required.

### Changing the domain

`build.js` has a single `SITE` constant, and setting the `SITE_URL` environment
variable in Vercel overrides it with no code change. These are **not** generated
and still need editing by hand: `admin/config.yml` (`base_url`, `site_url`,
`display_url`), `admin/index.html`, the three `case-studies/*.html`,
`robots.txt`, `sitemap.xml`, and the "Visit edwingyasi.online" label in
`content/engineering/projects.json`.
