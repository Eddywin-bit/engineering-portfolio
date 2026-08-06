# Running your site — Edwin's manual

This is written for you, not for a developer and not for an AI. It covers both
sites: the engineering portfolio at **edwingyasi.me** and the Eon Designs
portfolio at **edwingyasi.me/designs**.

Everything you need for day to day work is in section 2. You should not need to
touch code for anything in it.

---

## 1. The thirty-second version

- Your site is **static files**. There is no database and no server that can go
  down. It does not depend on Claude, or on any AI, or on any subscription.
- You edit content at **[edwingyasi.me/admin](https://edwingyasi.me/admin)**.
- When you click **Publish**, the panel saves to GitHub. Vercel notices, rebuilds
  the site, and puts it live. This takes about a minute.
- Nothing you can do in the admin panel can permanently break the site. Every
  change is a saved version you can go back to.

---

## 2. Editing content

Go to **[edwingyasi.me/admin](https://edwingyasi.me/admin)** and
sign in with GitHub. You will see three groups in the sidebar.

### Engineering Site

| Entry | What it controls |
|---|---|
| 1. Page Title & SEO | Browser tab title, and the description Google shows |
| 2. Navigation Bar | Your name, the menu links, the Contact button, your location |
| 3. Hero | Your name, portrait photo, the two labels beside it, the tagline, the buttons |
| 4. About | The heading, the paragraphs, the four statistics |
| 5. Projects & Case Studies | The project cards |
| 6. Skills & Certifications | Skill blocks and badges |
| 7. Experience | Your roles: title, organisation, dates |
| 8. Journal Section | Only the heading above the articles |
| 9. Contact | Email, LinkedIn, CV link, the Eon Designs link |
| 10. Footer | Footer text and social links |

### Journal Posts

Your articles, one entry each, with real **New Post** and **Delete entry**
buttons.

### Case Studies

Your case study pages, one entry each, with **New Case Study** and **Delete
entry** buttons. These used to be hand-written HTML that only a developer could
add. They are ordinary CMS entries now.

### Eon Designs Site

| Entry | What it controls |
|---|---|
| 1. Page Title, SEO & Logo | Tab title, description, logo |
| 2. Navigation Bar | Menu links |
| 3. Hero | The opening screen |
| 4. Selected Works | Your featured design projects |
| 5. The Vault | The archive grid |
| 6. About | About text and image |
| 7. Journal | Design essays |
| 8. Contact & Footer | Contact details and footer |

### The one thing to remember

**Changes are not live until you click Publish.** The button sometimes still
reads "Published" from your previous save, which makes it look finished when it
is not. If a change has not appeared on the site after a couple of minutes, go
back and check that you actually published it.

---

## 3. Common jobs

### Add a journal article
Journal Posts → **New Post**. Fill in title, date, cover image, excerpt and body.
Publish. The article page is created automatically at `/journal/your-title`, and
it appears on the home page. You do not create the page yourself.

### Delete a journal article
Open it → **Delete entry**. It is removed from the site and its page is deleted
on the next build.

### Add a project
Engineering Site → 5. Projects & Case Studies → add an item to the list.

The **Link** field is optional. Leave it empty if the case study page does not
exist yet, and the card will still display correctly without a dead link. Only
one project should be set to the wide card.

### Add a case study

Two steps, both in the panel.

1. **Case Studies → New Case Study.** Fill in the title, the category line, the
   intro, and the body. The file name you give it becomes the web address, so
   `trace-metals` becomes `edwingyasi.me/case-studies/trace-metals`. Keep it
   short, lower case, words joined by hyphens.
2. **Engineering Site → 5. Projects & Case Studies → add an item**, and set its
   **Link** to `case-studies/` followed by that same file name. This is what
   puts the card on your home page. Step 1 builds the page; step 2 is the only
   thing that links to it.

Writing the body, everything optional:

| To get | Type |
|---|---|
| A section heading | `## The problem` |
| Bold | `**like this**` |
| A bulleted list | lines starting with `- ` |
| A green callout box | lines starting with `> `, with `> **A label**` first |
| The rounded tool chips | `tools: Python, QGIS, SQL` on its own line |
| Two pictures side by side | two image lines in a row, no captions |
| Framed phone screenshots | an image line, then an italic caption line, repeated |
| A link | `[the words shown](https://the-address)` |

Leave a blank line between blocks. Everything else is filled in for you: the
address, the share card, the sitemap entry, and the styling.

**End a case study with where the work lives.** A last paragraph like this is
worth more than anything else you can add, because it is what a technical
reviewer clicks:

```
Data from the [Ghana Statistical Service](https://statsghana.gov.gh).
Full analysis in the [GitHub repository](https://github.com/Eddywin-bit/your-repo).
Interactive dashboard on [Tableau Public](https://public.tableau.com/app/profile/you).
```

Square brackets hold the words people read, round brackets hold the address.
Links to other sites open in a new tab automatically, so nobody loses your page
by following one.

Blank lines between the images of a group do not matter. The editor adds them
on its own, and they are ignored: pictures next to each other in the text end
up next to each other on the page.

### Change your CV
Contact → the CV link points at `/Edwin_Gyasi_Resume.pdf`. To replace the file
itself you need to upload a new PDF to the repository, which is a code-side job.
The simplest path is to keep the same filename so nothing else has to change.

### Change your photo
Hero → Portrait Photo. Upload an upright picture, roughly 3 wide by 4 tall.

### Images: the rules that matter
- **Keep uploads under 1 MB.** Larger files work on the live site but show as a
  broken thumbnail in the panel, because of a GitHub limit. Not your fault and
  not a bug.
- **Cover images should be JPG or PNG, not WEBP.** WhatsApp and most link
  previews refuse to display WEBP, so a WEBP cover falls back to a generic card
  when someone shares your article.
- Engineering images go to `/images/`, Eon Designs images to `/designs/images/`.
  The panel handles this for you.

---

## 4. Checking a change went live

1. Publish in the panel.
2. Wait about a minute.
3. Open the site and **hard refresh**: `Ctrl + Shift + R` on Windows.

If it still has not changed, open **vercel.com**, find the project, and look at
the most recent deployment. Green means it worked. Red means the build failed
and **your old site is still live**, which is the safe outcome but means your
change is not showing. Click into the failed build to see the error, or ask
Copilot to look at it.

---

## 5. What never to touch

You will not hit these through the admin panel. They matter if you or an AI is
editing files directly.

- **`/vault/` and `/ledger/`** — separate projects that happen to live in the
  same repository.
- **Anything between `<!-- CMS:START -->` and `<!-- CMS:END -->`** in the HTML
  files. Those blocks are regenerated on every deploy, so edits there vanish.
- **`designs/js/data.js`**, **everything in `/journal/`**, and **everything in
  `/case-studies/`** — generated files, rewritten on every build.
- **`vercel.json`** — its format is strict. A stray comment breaks every future
  deploy.

---

## 6. Using GitHub Copilot for code changes

You have Copilot Pro. For anything the CMS cannot do — layout, colours, new
sections, bug fixes — it can work on this repository the way Claude Code has.

**Set-up:** open the project folder in VS Code with the Copilot extension signed
in. That is all. Copilot automatically reads `.github/copilot-instructions.md`
in this repository, which contains every rule and every trap we have hit,
so it starts with the same knowledge rather than from nothing.

**How to get good results:**

- Use **Agent mode** in Copilot Chat for changes that touch more than one file.
- Ask for **one specific thing at a time**. "Make the experience dates grey and
  smaller" works far better than "improve the experience section".
- Tell it to **run `node build.js` and confirm it exits 0** before it finishes.
  This is in its instructions, but say it anyway.
- Ask it to **show you a screenshot or describe what changed** before pushing.
- After it pushes, **check the Vercel deploy is green**.

**Things to be wary of:**

- It is weaker at "make this look like this screenshot" than at concrete,
  described changes. Describe what you want in words.
- If it says something is done, check the live site yourself. Trust the site,
  not the summary.
- If it breaks something, see section 8. Nothing is unrecoverable.

You can also use Copilot on github.com by opening an issue describing what you
want and assigning it to Copilot. It will work in the background and open a pull
request for you to review before anything goes live, which is the safest way to
make a change you are unsure about.

---

## 7. Things that exist outside the repository

**These cannot be recovered from the code.** If they are lost, the CMS login or
the domain stops working with no way to rebuild them from what is in GitHub.
Keep a record somewhere safe.

**In your Vercel project settings, under Environment Variables:**

| Name | What it is |
|---|---|
| `GITHUB_OAUTH_CLIENT_ID` | Identifies the login app |
| `GITHUB_OAUTH_CLIENT_SECRET` | Its password. Never goes in the code |
| `ALLOWED_GITHUB_LOGIN` | Your GitHub username. Locks the panel to you alone |

**In your GitHub account, under Settings → Developer settings → OAuth Apps:**

There is an app whose **Authorization callback URL must be exactly**
`https://edwingyasi.me/api/callback`. If this is wrong by even one
character, the CMS login fails.

**In Vercel, under Domains:** `edwingyasi.me` (primary) and `www.edwingyasi.me`,
plus `edwingyasi.online` and `www.edwingyasi.online` kept as redirects.
The bare `edwingyasi.me` is the real one; everything else redirects to it.

**If you ever change domain**, follow `MIGRATION.md`. It is written so you can
do it yourself without any AI. In short: buy the domain, add it in Vercel,
update the OAuth callback URL, then set one environment variable, `SITE_URL`,
and redeploy. That single variable moves every link on both sites, and deleting
it again puts everything back, so it is safe to try. Keep the old
domain registered and redirecting for at least a year, because that redirect is
what carries your Google ranking across.

---

## 8. When something goes wrong

**The site looks broken after a change.**
Every version is saved. In GitHub, open the repository, click **Commits**, find
the last one that was fine, and revert the ones after it. Or ask Copilot: "revert
the last commit and push". The site returns to its previous state in about a
minute.

**The admin panel will not load.**
Usually `admin/config.yml` has a formatting error. The most common cause is a
multi-line hint written on one line. Revert the last change to that file.

**Cannot log in to the panel.**
Check the three Vercel environment variables in section 7, and check the OAuth
callback URL is exactly right.

**A change published but is not showing.**
Check the Vercel deployment is green, then hard refresh. If the deploy is red,
the build failed and the old site is still live.

**An article was deleted but is still on the site.**
Confirm you clicked Publish. Check the repository: if the file is still in
`content/engineering/journal/`, the deletion never reached GitHub.

---

## 9. What this site costs to keep running

- **Vercel** — free tier, comfortably within limits for a portfolio.
- **Domain** — annual renewal to your registrar.
- **GitHub** — free.
- **Fonts, images, everything else** — self-hosted in the repository. No
  third-party service to pay or to fail.

No AI subscription is needed to keep the site online, to edit its content, or to
publish. That was deliberate.
