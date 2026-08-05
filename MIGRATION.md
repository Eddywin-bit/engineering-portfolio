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

## Step 1b — Turn auto-renew ON

Namecheap → Domain List → `edwingyasi.me` → the **AUTO-RENEW** toggle.

It is off by default and yours is currently off. Once this domain is your main
address, letting it lapse takes the whole site down and puts the name back on
the open market for anyone to buy. Turn it on, and check the card on file is
valid. Do the same for `edwingyasi.online`, which you are keeping as a redirect.

## Step 2 — Add it to Vercel

Vercel → your project → **Settings → Domains → Add**.

Add both `edwingyasi.me` and `www.edwingyasi.me`.

Set **`edwingyasi.me` (the bare domain) as the primary**, and let
`www.edwingyasi.me` redirect to it. Note this is the opposite of the old
`.online` setup, where www was primary. It matters for the CMS login: the
OAuth popup must go to the host that does *not* redirect, and the build sets
that host from the same value.

Vercel then shows you the DNS records to create. Create them exactly as shown.

### Doing that in Namecheap

Namecheap → Domain List → `edwingyasi.me` → **Manage** → the **Advanced DNS**
tab. Not the Domain tab you were on; Advanced DNS is where records live.

**First delete the two records Namecheap creates by default.** A new domain
ships with a `CNAME` for `www` pointing at `parkingpage.namecheap.com` and a
`URL Redirect Record` for `@`. Leave either in place and it fights the records
you are about to add, and the site loads intermittently or not at all. This is
the most common way this goes wrong.

Then add what Vercel showed you. It will be shaped like this, but **use
Vercel's values, not these**, because they change:

| Type | Host | Value |
|---|---|---|
| A Record | `@` | the IP address Vercel shows |
| CNAME Record | `www` | the target Vercel shows |

`@` means the bare domain. TTL can stay on Automatic.

Do **not** use Namecheap's own "Redirect Domain" feature to point www at the
apex. Vercel already does that once both domains are added, and both trying at
once causes a redirect loop.

Your nameservers are already on **Namecheap BasicDNS**, which is correct. Do
not change them.

Wait until Vercel shows both domains as valid. DNS usually takes minutes, but
can take a few hours.

## Step 3 — Update the GitHub OAuth app

GitHub → **Settings → Developer settings → OAuth Apps** → your app.

Change the **Authorization callback URL** to exactly:

```
https://edwingyasi.me/api/callback
```

One character wrong and the CMS login fails with an unhelpful error. Copy and
paste it.

## Step 4 — Flip the switch

**Already done for `edwingyasi.me`.** The domain is written once, at the top of
`build.js`:

```js
const SITE = (process.env.SITE_URL || 'https://edwingyasi.me').replace(/\/+$/, '');
```

Every deployment builds from that, so there is nothing to set in Vercel. The
build prints the live value on every run:

```
build: site is https://edwingyasi.me
```

**If you move again later**, you have two ways to do it. Either edit that one
line and push, or set an environment variable in Vercel — **Settings →
Environment Variables**, name `SITE_URL`, value the new origin with no trailing
slash — then **Deployments → the latest one → Redeploy**. The variable wins over
the line in the file, so it is the way to test a domain before committing to it.

## Step 5 — Check it worked

1. Open `https://edwingyasi.me` — the site should load, and
   `https://www.edwingyasi.me` should redirect to it.
2. Open `https://edwingyasi.me/admin` and sign in. If login fails, step 3
   is wrong.
3. View the page source and search for `canonical`. It should say `.me`.
4. Paste a journal article link into a WhatsApp chat with yourself. The preview
   card should appear with the right image.

## Step 6 — Two bits of visible text

These are words on the page, not links, so no build changes them for you. Both
were updated by hand for the `.me` move; if you move again, they are the two to
remember.

- **The "Visit edwingyasi.me" label** on your projects section. It lives in the
  CMS: **Engineering Site → 5. Projects & Case Studies**, the Eon Designs entry,
  the link label field. One minute.
- **The fake Google preview** inside the admin panel's SEO editor, which is
  hardcoded in `admin/index.html`. Cosmetic, only you ever see it.

## Step 7 — Tell Google, and keep the old domain

This is the part that protects your search ranking. Do not skip it.

1. **Keep `edwingyasi.online` registered and redirecting to the new domain.**
   That redirect is what carries your existing Google ranking across. Google's
   own guidance is to keep it for **at least a year**. Letting it expire throws
   away everything the site has earned in search.
2. **Google Search Console** → add `edwingyasi.me` as a new property and
   verify it. Your verification file, `google5e961fde5173da87.html`, is already
   in the repository and will be served from the new domain automatically.
3. In Search Console, on the **old** property, use **Settings → Change of
   Address** and point it at the new one. This tells Google the move is
   deliberate and permanent.
4. Submit `https://edwingyasi.me/sitemap.xml` under **Sitemaps**.

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

**The new domain resolves, but to the wrong host.** The name works and yet
Vercel still says the domain is invalid. That means records exist but point
somewhere other than Vercel. The tell is the IP address: `185.199.108.153` and
its three neighbours ending `.153` are **GitHub Pages**, not Vercel. Vercel's
addresses are in the `216.198.79.x` and `64.29.17.x` ranges. Compare against
`edwingyasi.online`, which is already correct.

The fix is the same either way: in Advanced DNS delete every `A` and `CNAME`
record on `@` and `www`, then add only what Vercel's Domains page shows. Do not
keep the old ones alongside the new; two sets of records for one host means the
site loads from a different place on each request.

**Search Console says "Could not find your site."** That is not about the
verification file. It means the address you typed as the property never
answered, so check the spelling first: `edwingyasi.me` has a **g** in it. The
file method works on this site as-is, clean URLs and all.

**The CMS will not log in.** Almost always the OAuth callback URL in step 3.
It must be exactly `https://edwingyasi.me/api/callback`: no `www`, `https` not
`http`, no trailing slash.

**You want to undo the whole thing.** Set `SITE_URL` in Vercel to
`https://www.edwingyasi.online` and redeploy. That overrides the line in
`build.js` without touching any code, and every generated URL goes back. It
takes about two minutes and needs no GitHub access.

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
