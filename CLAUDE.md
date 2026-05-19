# Engineering Site & Eon Designs Portfolio

This repo hosts `edwingyasi.online` (the engineering portfolio) plus subfolders for design portfolio, Prompt Vault, and My Ledger. Currently building the Eon Designs portfolio upgrade inside `/designs/`.

## Owner

Edwin Gyasi Owusu (CEO Gyasi). Final-year Geological Engineering student at KNUST, Ghana. Founder and Creative Director of Eon Designs. Address as "CEO Gyasi" or "Edwin".

## Folder Structure

- `/` — Engineering portfolio (live at edwingyasi.online) — DO NOT MODIFY
- `/designs/` — Eon Designs graphic portfolio (the active build)
- `/vault/` — Prompt Vault PWA — DO NOT TOUCH
- `/ledger/` — My Ledger — DO NOT TOUCH

## Current Build

All work happens inside `/designs/`. Full spec is in `EON_DESIGNS_PORTFOLIO_BRIEF.md` at repo root.

## Tech Stack

- HTML / CSS / vanilla JavaScript (no framework)
- Cloudinary CDN for images (cloud name: `dytejwgxj`)
- Vercel hosting (auto-deploys from main branch)
- Vercel serverless function at `/designs/api/chat.js` for AI chat
- `@anthropic-ai/sdk` for Claude integration in the chat endpoint
- Lenis for smooth scroll

## Commands

- Local dev: `cd designs && vercel dev`
- Install deps: `cd designs && npm install`
- Deploy: push to main, Vercel auto-deploys

## Hard Rules

- NEVER modify files at repo root (the engineering portfolio)
- NEVER touch `/vault/` or `/ledger/` folders
- NEVER commit `ANTHROPIC_API_KEY` or any secret
- ALWAYS work inside `/designs/` for this project
- ALWAYS verify changes locally with `vercel dev` before pushing

## Visual Conventions

- Pure white `#FFFFFF` on pure black `#000000` — no cream tones in the new build
- Editorial serif for headings (Playfair Display or similar), monospace small-caps for labels and dates
- Mobile-first responsive design
- Use Cloudinary URLs for ALL images, never local paths
- One accent color block section in gold `#D4AF37` (or cobalt if Edwin overrides)

## Verification

For all frontend work, use the Claude Chrome extension to visually verify changes in localhost before claiming completion. Boris's #1 tip: give Claude a way to verify, then it iterates until it's right.

## Communication Preferences

- Address as CEO Gyasi or Edwin
- Use periods or commas instead of em dashes
- Direct, honest feedback over flattery
- Concise responses, no fluff

## Updates Log

Append lessons learned below when mistakes happen. Format: `- {date}: {what was wrong} → {correction}`
