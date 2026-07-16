# EON — Portfolio Rebuild Brief
## Folder: `/eon/` inside Engineering Site repo

---

## The Feeling
**Intimidating and premium.** When someone lands on this site they should feel slightly underdressed. Like walking into a high-end gallery or opening a luxury brand lookbook. Silent confidence. No noise. No explanation. The work speaks first.

This is NOT a redesign of the old `designs/` site. This is a completely new build with a completely new visual language.

---

## Locked Values

- **Background**: `#0A0A0A` (near-black, not pure black — adds depth)
- **Body text**: `#F0EDE8` (warm off-white — feels expensive, not clinical)
- **Accent**: `#C0C0C0` (cold platinum — rare, silent, intimidating)
- **Error/alert**: `#8B0000` (deep red, used sparingly for urgency only)
- **Cloudinary cloud name**: `dytejwgxj`
- **Image source**: local `../designs/Assets/` for now. Cloudinary flip later via `designs.json` mode flag.
- **AI model**: `claude-sonnet-4-5` via `@anthropic-ai/sdk`
- **AI SDK version**: `^0.40.0`

---

## Typography System

This is where the intimidation comes from. The contrast between heavy and thin is the whole personality.

**Display / Headings**: Playfair Display, weight 900 (black). Massive. Dominant. Use for section titles and the name reveal.

**Body / Labels**: Inter, weight 100–200 (ultra-thin). Whisper-thin. Everything that isn't a headline uses this. The contrast with the 900-weight serif is stark and intentional.

**Monospace / Meta**: JetBrains Mono, weight 400. Used only for small labels, dates, category tags, and the "EON" wordmark in the hero.

**Scale**:
- Display: `clamp(5rem, 12vw, 14rem)` — massive on desktop
- H1: `clamp(3rem, 6vw, 7rem)`
- H2: `clamp(1.5rem, 3vw, 3rem)`
- Body: `1rem`, line-height `1.8`
- Label/meta: `0.65rem`, letter-spacing `0.2em`, uppercase

Load from Google Fonts:
`https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Inter:wght@100;200;300&family=JetBrains+Mono:wght@400&display=swap`

---

## Custom Cursor

Replace the default cursor entirely on desktop (not mobile).

- **Default state**: small platinum dot, 8px diameter, no fill, 1px platinum border, mix-blend-mode: difference
- **Hover over images/cards**: expands to 64px circle, thin 1px platinum border only (no fill), smooth 300ms transition
- **Hover over links**: dot becomes a horizontal line (2px height, 24px width)
- **Clicking**: dot pulses (scale 0.8 then back to 1, 150ms)

Implementation: two DOM elements (`.cursor-dot` and `.cursor-ring`), positioned fixed, pointer-events none, updated via `mousemove`. Disable on touch devices.

---

## Navigation

**No standard navbar.** No hamburger. No visible nav on load.

Top of every page:
- Top-left: `EON` in JetBrains Mono, 0.65rem, platinum, letter-spacing 0.3em. Links to `/eon/`.
- Top-right: A single `+` icon (platinum, 20px). On click, triggers full-screen overlay.

**Full-screen nav overlay**:
- Background: `#0A0A0A` at 97% opacity, covers entire viewport
- `+` becomes `×` on open
- Nav items appear one by one with 80ms stagger, sliding up from 30px below:
  - WORK
  - THE VAULT
  - ABOUT
  - JOURNAL
  - START A PROJECT
- Each item: Playfair Display 900, massive (clamp 3rem to 8vw), off-white
- Hover on each item: platinum underline grows left-to-right
- Bottom of overlay: email `gyasiedwin14@gmail.com` in thin Inter, platinum
- ESC key closes overlay

---

## Page Sections — Main (`index.html`)

### 1. Hero

Full-bleed. No text explaining who Edwin is. The work speaks first.

```
[FULL VIEWPORT IMAGE — Geolink Podcast banner: Banner_Geolink.webp]
```

- Image fills 100vh, `object-fit: cover`
- Over the image, two text elements only:
  - Top-left: `EON` monospace label (already in nav, sits inside the image area)
  - Bottom-left: One line in ultra-thin Inter 200: `Creative Direction. Brand Identity. Visual Systems.` in off-white, `font-size: 0.8rem`, letter-spacing 0.15em
- No Edwin's name. No title. No CTA buttons.
- Subtle Ken Burns effect on the image (scale 1.0 → 1.05 over 8 seconds, CSS animation)
- Scroll indicator: a single thin vertical line (platinum, 40px) at bottom-center, pulses opacity 1→0.3 on loop

### 2. Identity Reveal

First section after hero. This is where the name appears — as a reward for scrolling.

- Full-width section, `padding: 12rem 0`
- Left half: massive display type — `EDWIN` on one line, `GYASI` on next, `OWUSU.` on third — Playfair Display 900, `clamp(4rem, 10vw, 11rem)`, off-white
- Right half: single paragraph in ultra-thin Inter, `font-size: 1rem`, `max-width: 380px`:
  > "I established Eon Designs to bridge the gap between functional clarity and lasting impact. The name Eon represents deep time. My goal is to create visual systems that survive the trend cycle."
- Below the paragraph: a thin platinum horizontal rule (1px, 60px wide), then a small label: `KUMASI, GHANA — EST. 2023`
- Animate in: name slides up from 60px, paragraph fades in 400ms later

### 3. Selected Works

**Horizontal scroll on desktop. Vertical stack on mobile.**

Section header:
- Left-aligned: `SELECTED WORKS` in JetBrains Mono, 0.65rem, platinum, letter-spacing 0.25em
- Right-aligned: `03 PROJECTS` in same style

Horizontal scroll container (desktop, ≥768px):
- `display: flex`, `overflow-x: scroll`, `scroll-snap-type: x mandatory`, `scrollbar-width: none`
- Each card: `scroll-snap-align: start`, `min-width: 70vw`, `height: 80vh`
- Card structure:
  - Image fills the card, `object-fit: cover`
  - On hover: image scales to 1.03, 600ms ease
  - Bottom of card: a platinum bar slides up from bottom (40px height) revealing: category label (mono) + project title (Playfair Display, weight 900, large) + "VIEW CASE STUDY →" (thin Inter)
  - Expand icon: top-right, 28px white square with thin border, diagonal arrow

Cards (in order):
1. Geolink Podcast — `../designs/Assets/selected/Banner_Geolink.webp` — category: MEDIA & BRANDING
2. Viral Creative Suite — `../designs/Assets/selected/yt-thumb-main.webp` — category: DIGITAL STRATEGY
3. AusIMM Tarkwa Chapter — `../designs/Assets/selected/ausimm-main.webp` — category: CORPORATE IDENTITY

Mobile (< 768px): full-width stacked cards, 60vw height each, same bottom-reveal on tap.

### 4. Tension Line

Full-bleed typographic section. No images. Pure text. This is the intimidating moment.

- Background: `#0A0A0A`
- Centered, `padding: 10rem 2rem`
- One massive line of text: `"BUILD SYSTEMS THAT LAST."` — Playfair Display italic 900, `clamp(2.5rem, 7vw, 8rem)`, off-white
- Below it, thin Inter 100: `— EON DESIGNS PHILOSOPHY`
- A thin platinum border (1px) frames the entire section with 40px inset (like a poster frame)
- On scroll into view: text slides up from 80px, border draws in clockwise (CSS clip-path animation)

This replaces yesterday's gold color block. Same drama, more intimidating.

### 5. The Vault Preview

Shows 6 items from the vault as a teaser. "Load All" opens the full overlay.

Section header: `THE VAULT — 37 ARTIFACTS` in monospace

Grid: 3 columns desktop, 2 columns mobile, tight gap (8px), no rounded corners

Each item:
- Image square ratio, `object-fit: cover`
- On hover: platinum border appears (1px), thin label slides up from bottom showing category + title
- Filter buttons are NOT visible by default. They appear only when the user hovers over the grid area (the whole section). This feels like a secret control panel.

Filter buttons on hover (appear at the top of the vault section):
`ALL · FOOD · COMMERCIAL · BRANDING · MEDIA · EVENT · ACADEMIC · EXPERIMENTAL · BEAUTY`
- Thin Inter 100, 0.65rem, platinum, letter-spacing 0.15em
- Active filter underlined with platinum line
- Click filters grid with 300ms fade + scale transition

Expand icon on each card opens lightbox (full-screen, `#0A0A0A` backdrop, image centered, ESC to close).

### 6. About — What I Do

Minimal. No checklist. No bullet points.

Left: `WHAT I DO` monospace label, then the 5 services as a typographic list — each service name in Playfair Display 900, large, stacked vertically with a thin platinum rule between each.

Right: Select Clients in a tight grid of name pills — thin platinum border, transparent background, Inter 100.

### 7. Journal

3 cards in a 3-column grid (desktop), single column (mobile).

Each card:
- Cover image top (16:9 ratio)
- Below: platinum label (date + read time in mono), title in Playfair Display weight 900, excerpt in thin Inter
- Bottom: `READ ARTICLE →` in mono, platinum
- Click navigates to `/eon/journal/{slug}/` (real URL)

### 8. Contact

Minimal. One statement, one input.

- Massive display text: `START A PROJECT.` — Playfair Display italic 900, clamp 3rem to 8vw
- Below: thin Inter 100 `gyasiedwin14@gmail.com`
- Below: a single full-width form: Name, Email, Project Goals (3 fields), then `BOOK SESSION` button
- Button: off-white background, near-black text — inverted from everything else. On hover: platinum border appears, background stays.

---

## Sub-Pages

### Case Study pages (`/eon/case-studies/{slug}/index.html`)

Each page:
- Same nav (EON + overlay)
- Hero: full-bleed cover image, 70vh
- Below: two-column — left: massive Playfair Display 900 title + category label. Right: client, year, role, tools in thin Inter with platinum labels.
- Description paragraph
- Challenge + Solution in a split block
- Gallery: full-width images stacked with 8px gap
- Bottom: `← BACK TO WORK` and `NEXT PROJECT →` in thin mono

Three pages: `geolink-podcast`, `viral-creative-suite`, `ausimm-tarkwa-student-chapter`

### Journal article pages (`/eon/journal/{slug}/index.html`)

- Hero: cover image full-bleed 60vh
- Below: date, read time (mono), massive title, body text in Inter 300, 720px max-width centered
- Pull quotes: Playfair Display italic 900, large, platinum left border (3px), indented
- Bottom: related articles (2 cards), `← BACK TO JOURNAL`

Three pages: `empowering-the-next-gen`, `typography-is-voice`, `why-eon`

### OG Tags on every sub-page
```html
<meta property="og:title" content="{Title} — EON Designs" />
<meta property="og:description" content="{excerpt}" />
<meta property="og:image" content="{full Cloudinary or absolute URL of cover}" />
<meta property="og:url" content="https://edwingyasi.online/eon/{path}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## AI Chat

Same implementation as yesterday's brief:
- Floating icon bottom-right (platinum chat bubble SVG, 48px)
- Click opens panel sliding up (380px wide desktop, full-width mobile)
- Background `#0A0A0A`, thin 1px platinum border
- Header: `ASK ABOUT MY WORK` in monospace
- Vercel serverless function at `/eon/api/chat.js`
- Uses `designs.json` from the eon folder for context
- Model: `claude-sonnet-4-5`, max_tokens 1024
- Typing indicator: three platinum dots pulsing

---

## Motion System

- **Lenis smooth scroll**: initialize with `lerp: 0.08` (slower, more luxurious than default 0.1). On Windows, set `smoothWheel: true, wheelMultiplier: 0.8`.
- **Intersection Observer**: `data-reveal` attribute. At 15% in view, add `.revealed`. CSS transitions:
  - Default reveal: `translateY(50px) → 0`, opacity 0 → 1, 900ms cubic-bezier(0.16, 1, 0.3, 1)
  - Image reveal: clip-path `inset(0 0 100% 0) → inset(0 0 0% 0)`, 1000ms cubic-bezier(0.7, 0, 0.3, 1) (wipes UP, not sideways)
  - Staggered children: each child gets 120ms additional delay
- **Page transition**: on navigate to sub-page, platinum overlay sweeps across screen left-to-right (300ms), then sweeps off right-to-left (300ms). Use View Transitions API where supported.
- **prefers-reduced-motion**: skip all transforms, plain opacity fade only, disable Lenis

---

## File Structure

```
eon/
├── index.html
├── styles.css
├── script.js
├── designs.json          # Same schema as before, mode: local, base: ../designs/Assets
├── package.json
├── vercel.json           # Routing config if needed
├── case-studies/
│   ├── geolink-podcast/index.html
│   ├── viral-creative-suite/index.html
│   └── ausimm-tarkwa-student-chapter/index.html
├── journal/
│   ├── empowering-the-next-gen/index.html
│   ├── typography-is-voice/index.html
│   └── why-eon/index.html
└── api/
    └── chat.js
```

No `Assets/` folder inside `eon/`. All images reference `../designs/Assets/` relative paths. This avoids duplicating 60+ image files.

---

## designs.json (eon version)

Same schema as before but with updated base path:

```json
{
  "image_source": {
    "mode": "local",
    "local_base": "../designs/Assets",
    "cdn_base": "https://res.cloudinary.com/dytejwgxj/image/upload/f_auto,q_auto/v1/eon-designs"
  }
}
```

Image paths stay the same (e.g. `selected/Banner_Geolink.webp`). Local resolver prepends `../designs/Assets/`.

---

## What Makes This DIFFERENT From The Old Site

The old site: name in hero, text first, images second, section-by-section scrolling, cream tones, moderate typography weight.

This site:
1. Image in hero, name withheld until scroll
2. Horizontal scroll for works (not vertical cards)
3. Custom platinum cursor (replaces browser default entirely)
4. Full-screen nav overlay (not a top navbar)
5. Tension Line section (massive typographic statement, no images)
6. Vault filters hidden until hover (feels like discovering a secret)
7. Near-black `#0A0A0A` not pure `#000000` — depth vs flatness
8. Off-white `#F0EDE8` not pure `#FFFFFF` — warmth vs clinical
9. Platinum `#C0C0C0` not gold — cold vs warm
10. 900-weight serif + 100-weight sans contrast (extreme weight difference)
11. Image wipe reveal (up) not slide reveal (side)
12. Platinum overlay page transitions

---

## Hard Constraints

- ALL work inside `/eon/` folder only
- Do NOT touch `/designs/`, `/vault/`, `/ledger/`, root `index.html`
- Do NOT copy or replicate the visual structure of `designs/index.html`
- NEVER commit `ANTHROPIC_API_KEY`
- Images referenced via `../designs/Assets/` — do not copy image files into `eon/`
- If anything is unclear, ask before building

---

## Execution Order

1. Create `eon/` folder and all subdirectories
2. Create `designs.json` with updated base path
3. Build `styles.css` — design tokens first, then layout, then animations
4. Build `index.html` — structure only, no inline styles
5. Build `script.js` — Lenis, custom cursor, Intersection Observer, nav overlay, horizontal scroll, vault filter, lightbox, chat widget
6. Build `package.json` + `api/chat.js`
7. Build 3 case study sub-pages
8. Build 3 journal sub-pages
9. Run `npm install` in `eon/` folder
10. Test with `vercel dev` or `npx serve .`
11. Verify: cursor works, horizontal scroll works, nav overlay works, vault filters appear on hover, chat opens, sub-page URLs work, mobile responsive
12. Commit: `feat(eon): portfolio v2 — intimidating and premium`
