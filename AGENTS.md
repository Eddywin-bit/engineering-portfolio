# AGENTS.md

**The full ruleset for this repository is in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md). Read it
before changing anything.**

It is kept there rather than here because GitHub Copilot loads that path
automatically as repository context. This file exists so that agents which look
for `AGENTS.md` are not left without instructions. Only the rules below are
duplicated, because they are the ones whose violation causes immediate, visible
damage to a live site, and they change rarely.

---

## The site in one paragraph

Two static sites in one repository: an engineering portfolio at `/` and the Eon
Designs portfolio at `/designs/`, both edited through a Decap CMS panel at
`/admin`. Plain HTML, CSS and vanilla JavaScript, no framework. `node build.js`
renders JSON from `/content/` into marked regions of the HTML. Vercel deploys
automatically on every push to `main`; `main` is production, there is no staging.

The owner is not a developer and maintains the site through the CMS. Any change
that forces him back into code to update content is the wrong change.

## Rules that must not be broken

1. **Never touch `/vault/` or `/ledger/`.** Separate projects, same repository.
2. **Never commit a secret.** Tokens and API keys live in Vercel's environment
   variables only.
3. **Never hand-edit between `<!-- CMS:START -->` and `<!-- CMS:END -->`.**
   `build.js` overwrites those regions, so the edit is lost on the next deploy.
   Change the JSON in `/content/`, or change the generator in `build.js`.
4. **Never hand-edit `designs/js/data.js` or anything in `/journal/`.** Both are
   generated, and `/journal/` is wiped and rewritten on every build.
5. **Always run `node build.js` and confirm it exits 0 before pushing.** It
   fails loudly when a CMS marker goes missing, which is the main way this
   repository breaks.
6. **A field added to `admin/config.yml` must also be rendered in `build.js` and
   mirrored in the preview in `admin/index.html`.** All three, or none.
7. **`vercel.json` rejects unknown top-level keys.** A `"//comment"` entry fails
   the whole deployment and silently leaves the old version live.
8. **Verify visually and by measurement**, at 320, 390, 768, 900 and 1440 wide,
   before calling anything done. Check for horizontal overflow every time.

## Commands

```bash
node build.js     # required before every push, must exit 0
npx serve .       # local preview, handles clean URLs
npx decap-server  # local CMS backend
```

Everything else — the architecture, the design tokens, and a long list of traps
that have already cost real time — is in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md).
Historical context and the reasoning behind past decisions is in `CLAUDE.md`.
