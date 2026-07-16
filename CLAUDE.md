# Engineering Site & Eon Designs Portfolio

This repo hosts `edwingyasi.online` (the engineering portfolio) plus subfolders for design portfolio, Prompt Vault, and My Ledger. Currently building the new Eon Designs portfolio inside `/eon/`.

## Owner

Edwin Gyasi Owusu (CEO Gyasi). Final-year Geological Engineering student at KNUST, Ghana. Founder and Creative Director of Eon Designs. Address as "CEO Gyasi" or "Edwin".

## Folder Structure

- `/` — Engineering portfolio (live at edwingyasi.online) — DO NOT MODIFY
- `/eon/` — Eon Designs portfolio v2 (the active build)
- `/designs/` — old portfolio — DO NOT TOUCH
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

- NEVER modify files at repo root (the engineering portfolio)
- NEVER touch `/designs/`, `/vault/`, or `/ledger/` folders
- NEVER commit `ANTHROPIC_API_KEY` or any secret
- ALWAYS work inside `/eon/` for this project
- ALWAYS verify changes locally before pushing
- Do NOT copy visual structure or layout from `/designs/index.html`

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

## Updates Log

- 2026-05-19: Built designs/ v2 but looked too similar to old site because brief said "preserve existing brand identity." New build (eon/) starts completely fresh with no reference to old site structure.
