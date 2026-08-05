# Moving to a new domain

Written so you can do this yourself, without an AI, in about fifteen minutes of
actual work.

The site is built so that **the domain lives in one place**. Setting a single
environment variable in Vercel moves every canonical link, every share-preview
URL, the sitemap, the robots file, the three case-study pages, and the CMS
configuration. There is no hunting through files.

Verified by running the whole build against `edwingyasi.me` and confirming every
generated URL moved and no external link (LinkedIn, GitHub) was touched.

---

## Before you start

**Do not change anything until the new domain is bought and pointed at Vercel.**
If you flip the switch first, every canonical URL on your site will point at a
domain that does not resolve. Google will follow those links, find nothing, and
you will lose ranking you spent a year earning. Order matters here.

---

## Step 1 — Buy the domain

Buy `edwingyasi.me` from any registrar. **Keep `edwingyasi.online` registered
and paid for.** Do not let it lapse. See step 7 for why.

## Step 2 — Add it to Vercel

Vercel → your project → **Settings → Domains → Add**.

Add both `edwingyasi.me` and `www.edwingyasi.me`. Vercel will show you the DNS
records to create at your registrar. Create them exactly as shown.

Set **`www.edwingyasi.me` as the primary**, and let the bare `edwingyasi.me`
redirect to it. This matches how the site works today and matters for the CMS
login, which breaks if the OAuth popup travels through a redirect.

Wait until Vercel shows both as valid. DNS can take anywhere from minutes to a
few hours.

## Step 3 — Update the GitHub OAuth app

GitHub → **Settings → Developer settings → OAuth Apps** → your app.

Change the **Authorization callback URL** to exactly:

```
https://www.edwingyasi.me/api/callback
```

One character wrong and the CMS login fails with an unhelpful error. Copy and
paste it.

## Step 4 — Flip the switch

Vercel → **Settings → Environment Variables** → add:

| Name | Value |
|---|---|
| `SITE_URL` | `https://www.edwingyasi.me` |

Then **Deployments → the latest one → Redeploy**.

That is the whole code-side migration. When the build finishes it will print:

```
build: site is https://www.edwingyasi.me — 7 domain-dependent file(s) updated
```

If it still says `.online`, the variable was not saved or you redeployed an old
build. Check the variable, then redeploy again.

## Step 5 — Check it worked

1. Open `https://www.edwingyasi.me` — the site should load.
2. Open `https://www.edwingyasi.me/admin` and sign in. If login fails, step 3
   is wrong.
3. View the page source and search for `canonical`. It should say `.me`.
4. Paste a journal article link into a WhatsApp chat with yourself. The preview
   card should appear with the right image.

## Step 6 — Two bits of visible text

These are words on the page, not links, so no build can change them for you.

- **"Visit edwingyasi.online"** on your projects section. Edit it in the CMS:
  **Engineering Site → 5. Projects & Case Studies**, find the Eon Designs entry,
  change the label. One minute.
- The fake Google preview inside the admin panel's SEO editor still shows the
  old domain. Cosmetic, only you ever see it, harmless.

## Step 7 — Tell Google, and keep the old domain

This is the part that protects your search ranking. Do not skip it.

1. **Keep `edwingyasi.online` registered and redirecting to the new domain.**
   That redirect is what carries your existing Google ranking across. Google's
   own guidance is to keep it for **at least a year**. Letting it expire throws
   away everything the site has earned in search.
2. **Google Search Console** → add `www.edwingyasi.me` as a new property and
   verify it. Your verification file, `google5e961fde5173da87.html`, is already
   in the repository and will be served from the new domain automatically.
3. In Search Console, on the **old** property, use **Settings → Change of
   Address** and point it at the new one. This tells Google the move is
   deliberate and permanent.
4. Submit `https://www.edwingyasi.me/sitemap.xml` under **Sitemaps**.

Expect a few weeks for Google to fully switch over. Traffic usually dips
slightly and recovers. That is normal and not a sign anything is broken.

## Step 8 — Update your links

Nothing technical, but easy to forget: your LinkedIn profile, your CV, your
email signature, your Instagram bio, any business cards.

---

## If something goes wrong

**The site is unreachable on the new domain.** DNS has not propagated, or the
records are wrong. Check Vercel's Domains page for the exact records expected.
The old domain keeps working throughout, so you are never offline.

**The CMS will not log in.** Almost always the OAuth callback URL in step 3.
It must be exactly `https://www.edwingyasi.me/api/callback`, with `www`, with
`https`, no trailing slash.

**You want to undo the whole thing.** Delete the `SITE_URL` variable in Vercel
and redeploy. Everything reverts to `.online`. Nothing in the code changed, so
there is nothing to revert in GitHub.

---

## What the build actually does

For reference, `buildDomainFiles()` in `build.js` rewrites:

| File | What changes |
|---|---|
| `robots.txt` | the `Sitemap:` line |
| `sitemap.xml` | the `<loc>` (`lastmod` is deliberately left alone) |
| `case-studies/*.html` × 3 | canonical, `og:url`, `og:image`, `twitter:image` |
| `admin/index.html` | the brand link |
| `admin/config.yml` | `base_url`, `site_url`, `display_url` |

`index.html`, `designs/index.html` and every `journal/*.html` page are generated
from the `SITE` constant anyway, so they follow automatically.

It works by reading the previous origin out of `sitemap.xml` and swapping that
exact string. That is why external links are safe: a pattern loose enough to
catch every URL of yours would also catch LinkedIn and GitHub.
