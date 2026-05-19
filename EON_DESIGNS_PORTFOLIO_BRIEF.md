# Eon Designs Portfolio Upgrade — Claude Code Brief (Final)

## Context

I'm Edwin Gyasi Owusu, founder of Eon Designs. My graphic design portfolio currently lives at `edwingyasi.online/designs/` as a subfolder of my Engineering Site repo. It was built with plain HTML by Gemini Pro. The brand language is solid but the site lags (large unoptimized images, no CDN), has no motion (feels static), and the AI chat icon is decorative (not functional).

I'm upgrading it to: handle 50+ designs with smooth scroll-triggered motion, fast HD image loading via Cloudinary CDN, easy upload workflow through a `designs.json` system, an AI assistant powered by Claude, and dedicated sub-pages for case studies and journal articles so I can share specific links on LinkedIn.

## Locked Values

- **Cloudinary cloud name**: `dytejwgxj`
- **Cloudinary base URL**: `https://res.cloudinary.com/dytejwgxj/image/upload/f_auto,q_auto/v1/eon-designs`
- **Categories (8)**: Food, Commercial, Branding, Media, Event, Academic, Experimental, Beauty
- **AI model**: `claude-sonnet-4-5`
- **AI SDK**: `@anthropic-ai/sdk` (latest, ^0.40.0)
- **Page structure**: Hybrid (main page + sub-pages for case studies and journal articles)
- **Accent color**: I'll pick when I see the build. Default to gold `#D4AF37` if I don't specify.

## Goals

1. Preserve existing site structure and brand identity
2. Sharpen aesthetic: pure white on pure black, bold color block break
3. Add scroll-triggered motion so the site feels alive
4. Move all images to Cloudinary CDN for fast HD loading
5. Build `designs.json` system for one-file add/remove workflow
6. Activate the AI chat assistant via Vercel serverless function
7. Build dedicated sub-pages for case studies and journal articles, fully shareable on LinkedIn

## Visual Aesthetic

Inspired by Affinity by Canva website aesthetics. Apply these visual treatments:

- **Pure white (#FFFFFF) on pure black (#000000)**. Drop the cream/beige tones from current site. Stark and confident.
- **One full-bleed color block section** as dramatic divider between Selected Works and About. Default to gold `#D4AF37` with cream `#F4E8D0` text. (Edwin will switch to cobalt `#1A2BFF` with lavender `#B8A8FF` text if he prefers.)
- **Expand icons** on every Vault gallery image. Small white square (32x32px), thin 1px white border, diagonal expand arrow inside. Positioned bottom-right of each card. Click opens lightbox.
- **Tag pill chips** on cards. Thin 1px white border, transparent background, white text, rounded-full, small padding. Just shows the category name.
- **Bold contrast everywhere**. No soft tones, no greys-on-greys. Either it's white, black, or a deliberate accent.

## Preserve (Do Not Change)

- **Typography**: Editorial serif for headings (looks like Playfair Display), italic accents on emphasis words like "Project" and "Eon", monospace small-caps for dates and labels
- **Logo**: The "ED" wordmark
- **Main page section structure**: Hero → Selected Works → [Color Block] → About → What I Do → Select Clients → Journal → The Vault → Start a Project (contact form)
- **Vault concept**: "Concept Archive — Internal design repository. 50+ raw outputs, daily renders, and visual experiments."
- **Existing About copy**: "I established Eon Designs to bridge the gap between functional clarity and lasting impact. The name Eon isn't accidental it represents deep time. My goal is to create visual systems that survive the trend cycle."
- **What I Do** services: Brand Identity, Social Media Design, Event Branding, Creative Direction, UI/UX
- **Select Clients**: AusIMM Tarkwa Chapter, GESS-KNUST, ICGC, Eon Designs, Fragilda Construction

## Page Architecture (Path B — Hybrid)

```
edwingyasi.online/designs/                              # Main scrolling page
edwingyasi.online/designs/case-studies/{slug}/          # Each Selected Work
edwingyasi.online/designs/journal/{slug}/               # Each Journal article
```

**Examples:**
- `edwingyasi.online/designs/case-studies/geolink-podcast/`
- `edwingyasi.online/designs/case-studies/viral-creative-suite/`
- `edwingyasi.online/designs/journal/why-eon/`
- `edwingyasi.online/designs/journal/empowering-the-next-gen/`

**Vault items do NOT get sub-pages.** They open as lightbox modals only.

## Tech Stack

- HTML, CSS, vanilla JavaScript (no framework)
- **Lenis** (smooth scroll) — CDN: `https://unpkg.com/lenis@1.1.13/dist/lenis.min.js`
- **Intersection Observer API** (native, for scroll-triggered animations)
- **Cloudinary** (image CDN)
- **Vercel serverless function** at `/api/chat.js` for AI chat
- **Anthropic SDK** (`@anthropic-ai/sdk`)

## File Structure

```
designs/
├── index.html                      # Main scrolling page
├── styles.css                      # Shared styles
├── script.js                       # Main page logic
├── designs.json                    # Single source of truth
├── case-studies/
│   ├── template.html               # Reusable template (reference only)
│   ├── geolink-podcast/
│   │   └── index.html
│   ├── viral-creative-suite/
│   │   └── index.html
│   └── ausimm-tarkwa-student-chapter/
│       └── index.html
├── journal/
│   ├── template.html               # Reusable template (reference only)
│   ├── empowering-the-next-gen/
│   │   └── index.html
│   ├── typography-is-voice/
│   │   └── index.html
│   └── why-eon/
│       └── index.html
├── api/
│   └── chat.js                     # Vercel serverless function
├── assets/
│   ├── ed-logo.svg
│   └── icons/                      # expand icon, pinterest, chat bubble
└── package.json
```

## designs.json Schema

```json
{
  "cloudinary": {
    "cloud_name": "dytejwgxj",
    "base_url": "https://res.cloudinary.com/dytejwgxj/image/upload/f_auto,q_auto/v1/eon-designs"
  },
  "categories": ["Food", "Commercial", "Branding", "Media", "Event", "Academic", "Experimental", "Beauty"],
  "selected_works": [
    {
      "id": "geolink-podcast",
      "slug": "geolink-podcast",
      "title": "Geolink Podcast",
      "category": "Media",
      "subtitle": "Media & Branding",
      "description": "Turning audio into a visual experience. A bold, editorial brand identity designed to amplify student voices and connect academia with industry.",
      "cover": "selected/geolink-cover.jpg",
      "gallery": [
        "selected/geolink-1.jpg",
        "selected/geolink-2.jpg",
        "selected/geolink-3.jpg"
      ],
      "case_study_url": "/designs/case-studies/geolink-podcast/",
      "client": "GESS-KNUST",
      "year": "2025",
      "role": "Brand Identity, Creative Direction",
      "tools": ["Affinity Designer", "Photoshop"]
    }
  ],
  "vault": [
    {
      "id": "savage-beauty",
      "title": "Savage Beauty",
      "category": "Beauty",
      "image": "vault/savage-beauty.jpg",
      "tags": ["experimental", "editorial", "fashion"]
    }
  ],
  "journal": [
    {
      "id": "empowering-the-next-gen",
      "slug": "empowering-the-next-gen",
      "date": "DEC 09, 2025",
      "title": "Empowering the Next Gen",
      "excerpt": "Reflecting on my time at New Juaben SHS. The hunger for technology in Ghana is undeniable; our job is simply to provide the roadmap.",
      "cover": "journal/next-gen-cover.jpg",
      "article_url": "/designs/journal/empowering-the-next-gen/",
      "read_time": "4 min read"
    }
  ]
}
```

Image paths in `designs.json` are relative to the Cloudinary base URL. JavaScript concatenates `cloudinary.base_url + "/" + image_path` when rendering.

## Sub-Page Template Specifications

### Case Study Page (`case-studies/{slug}/index.html`)

Each case study page must include:

1. **Same site nav** (ED logo top-left, hamburger menu top-right, chat bubble bottom-right)
2. **Hero block**:
   - Monospace small-caps category label (e.g., "MEDIA AND BRANDING")
   - Large serif title with italic accent
   - Subtitle line
   - Meta strip: Client, Year, Role, Tools (in monospace small-caps)
3. **Cover image** (full-width, with image reveal animation)
4. **Description section**: 1-2 paragraphs in white body text
5. **Gallery section**: Stack of images, each with reveal animation as scrolled to
6. **Two-column meta block**: Process notes, outcome, lessons learned (optional, depending on content)
7. **Back to portfolio link**: Bottom-left, serif italic, "Back to Selected Works"
8. **Next/Previous case study navigation**: Links to adjacent case studies
9. **Footer with contact CTA**

### Journal Article Page (`journal/{slug}/index.html`)

Each article page must include:

1. **Same site nav**
2. **Hero block**:
   - Monospace small-caps date stamp ("DEC 09, 2025") + read time ("4 MIN READ")
   - Large serif title
   - Excerpt as a deck
3. **Cover image** (full-width, with reveal animation)
4. **Article body**: Long-form prose in white text, ~720px max width for readability, generous line height
5. **Pull quotes**: Serif italic, indented, with a thin white left border
6. **Back to journal link**: Bottom-left
7. **Related articles** (2-3 cards at the bottom)
8. **Footer with contact CTA**

### Shared SEO + Social Tags

Every sub-page needs:

```html
<title>{Title} — Eon Designs</title>
<meta name="description" content="{description or excerpt}" />
<meta property="og:title" content="{Title} — Eon Designs" />
<meta property="og:description" content="{description or excerpt}" />
<meta property="og:image" content="{full Cloudinary URL of cover}" />
<meta property="og:url" content="{full canonical URL}" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="{full canonical URL}" />
```

This makes LinkedIn share cards look professional.

## Motion System

Same motion system applies to all pages (main + sub-pages):

### Smooth Scroll (Lenis)
```javascript
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### Section Reveals (Intersection Observer)
Element with `data-animate`. When 20% in view, add `.in-view` class:
- Headings: `translateY(40px)` to `0`, opacity `0` to `1`, 800ms cubic-bezier(0.16, 1, 0.3, 1)
- Body: same with 200ms delay
- Images: clip-path `inset(0 100% 0 0)` to `inset(0 0 0 0)`, 1000ms cubic-bezier(0.7, 0, 0.3, 1)
- Cards: staggered, 100ms delay each

### Hero
- Subtle parallax on hero text (0.3x scroll speed)
- ED logo gentle scale on load (0.95 to 1.0, 1.2s)

### Selected Works Cards
- Hover: image `scale(1.05)`, 600ms ease-out
- "VIEW CASE STUDY" link: underline grows left-to-right on hover

### Vault Grid
- Masonry layout (CSS columns or CSS Grid)
- Filter click: items fade and `scale(0.95)` out (300ms), new items fade and `scale(1)` in with 50ms stagger
- Native `loading="lazy"` on all images
- CSS skeleton shimmer while images load
- Expand icon bottom-right of each card opens lightbox

### Lightbox
Full-screen modal, dark backdrop (black at 95% opacity), image centered with `object-fit: contain`, ESC or click-outside to close, smooth fade in/out (300ms)

### Color Block Section (Main page only)
Full-bleed section between Selected Works and About. Background: gold `#D4AF37`. Content: giant serif italic quote in cream `#F4E8D0`.

Quote: *"Design shouldn't be disposable. I named my practice Eon to serve as a constant reminder. Ignore the trends. Build systems that last."*

Display size: ~4-6rem desktop, ~2.5-3rem mobile. Center aligned. Section padding 8rem top/bottom.

### Page Transitions Between Sub-Pages
When navigating from main page to a sub-page (or sub-page to sub-page), use a fade transition:
- Outgoing page: fade to opacity 0, 300ms
- Incoming page: scroll to top, fade in, 300ms
Can use the View Transitions API where supported, or fall back to a simple JS-driven fade.

### Buttons
"Start a Project" / "BOOK SESSION": white background fills from left on hover, text flips to black.

## AI Chat — Vercel Serverless Function

File: `designs/api/chat.js`

```javascript
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  const designsPath = path.join(process.cwd(), "designs", "designs.json");
  const designsData = JSON.parse(fs.readFileSync(designsPath, "utf-8"));

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are the AI assistant for Eon Designs, the graphic design practice of Edwin Gyasi Owusu (CEO Gyasi). Help visitors navigate the portfolio, recommend designs, explain services, share pricing context, and answer questions about Edwin's work.

About Edwin: Founder and Creative Director of Eon Designs. Final-year Geological Engineering student at KNUST, Kumasi, Ghana. Christian. Strategic, creative, leadership-oriented. PRO of AusIMM Tarkwa Student Chapter.

Services: Brand Identity, Social Media Design, Event Branding, Creative Direction, UI/UX.

Select Clients: AusIMM Tarkwa Chapter, GESS-KNUST, ICGC, Eon Designs, Fragilda Construction.

Design philosophy: "I established Eon Designs to bridge the gap between functional clarity and lasting impact. The name Eon represents deep time. My goal is to create visual systems that survive the trend cycle."

Tone: Confident, grounded, warm. Not salesy. Direct. Match the editorial feel of the portfolio. Brief responses (2-4 sentences typically).

Below is the live portfolio data. Use it to recommend specific designs by title and category. When mentioning a case study or journal article, include its full URL so visitors can click through.

PORTFOLIO DATA:
${JSON.stringify(designsData, null, 2)}

When asked about pricing, direct visitors to the contact form to start a project. Never invent designs not in the data above.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "AI assistant unavailable" });
  }
}
```

### Frontend Chat Widget
- The chat bubble (bottom-right) triggers a panel
- Click slides up a chat panel from bottom-right (380px wide desktop, full-width mobile)
- Panel: pure black background with thin white border, header "Ask about my work"
- Messages: user right-aligned in white-tinted bubbles, AI left-aligned plain text
- Input: bottom, white border, dark background, white text
- POST to `/api/chat` with full message history
- Show typing indicator (three pulsing dots) while waiting
- Render markdown (bold, italics, links, line breaks)

The chat widget loads on EVERY page (main + all sub-pages).

### Environment Variable
Add `ANTHROPIC_API_KEY` to Vercel project settings → Environment Variables. **Never commit the key to git.**

### package.json
```json
{
  "name": "eon-designs-portfolio",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.40.0"
  }
}
```

## Cloudinary Upload Workflow (For Edwin, post-launch)

1. Open console.cloudinary.com → Media Library
2. Create folders if not present: `eon-designs/selected/`, `eon-designs/vault/`, `eon-designs/journal/`, `eon-designs/clients/`
3. Drag-drop images
4. Note filename
5. Add entry to `designs.json` with relative path (e.g., `vault/new-design.jpg`)
6. For Selected Works or Journal items: also create the corresponding sub-page folder + `index.html` (copy from an existing one as template)
7. Commit and push. Vercel auto-deploys.

## Implementation Order

1. Read existing `designs/` folder, inventory current files
2. Create `designs.json` populated with current site content (3 Selected Works: Geolink Podcast, Viral Creative Suite, AusIMM Tarkwa Student Chapter; 3 Journal articles: Empowering the Next Gen, Typography is Voice, Why Eon; ~12 Vault items visible in screenshots)
3. Build new main `index.html` that loads `designs.json` and renders all sections dynamically
4. Build `styles.css` — shared across all pages
5. Build `script.js` with Lenis, Intersection Observer, vault filter, lightbox, chat widget
6. Build `case-studies/template.html` and individual sub-pages for each Selected Work
7. Build `journal/template.html` and individual sub-pages for each Journal article
8. Create `api/chat.js`
9. Create `package.json`
10. Test locally with `vercel dev`
11. Add `ANTHROPIC_API_KEY` to Vercel env vars
12. Commit and push

## Testing Checklist

- [ ] Main page loads under 2 seconds on 4G
- [ ] All images served from Cloudinary
- [ ] Smooth scroll active everywhere
- [ ] Section reveals trigger on scroll
- [ ] Vault filters reshuffle designs smoothly
- [ ] Expand icon on each Vault card opens lightbox
- [ ] Lightbox closes on ESC and click-outside
- [ ] Color block section displays between Selected Works and About
- [ ] AI chat bubble works on every page (main + all sub-pages)
- [ ] Each case study sub-page loads at its URL (e.g., `/designs/case-studies/geolink-podcast/`)
- [ ] Each journal article sub-page loads at its URL
- [ ] LinkedIn preview cards for sub-pages show cover image + title (test with LinkedIn Post Inspector)
- [ ] Back to portfolio link works on every sub-page
- [ ] Mobile responsive (test on actual phone)
- [ ] Existing routes still work (`/`, `/vault`, `/ledger`) — DO NOT BREAK THEM

## Hard Constraints

- All new code goes INSIDE the `designs/` folder only
- Do not modify the engineering portfolio at root
- Do not modify `vault/` or `ledger/` subfolders
- If anything is unclear, ask before guessing
- Never commit the Anthropic API key
