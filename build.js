#!/usr/bin/env node
/**
 * Static content build for edwingyasi.online
 * -------------------------------------------------------------
 * Reads the JSON files Decap CMS writes into /content and injects
 * rendered HTML into the marked regions of:
 *
 *   index.html              (Engineering Site)
 *   designs/index.html      (Eon Designs Site)
 *   designs/js/data.js      (regenerated wholesale)
 *
 * Regions are marked in the HTML with:
 *   <!-- CMS:START name --> ... <!-- CMS:END name -->
 *
 * The markers survive every build, so this is idempotent: running it
 * twice produces byte-identical output. Nothing outside the markers
 * is ever touched, which is why all the CSS, scripts and layout in
 * those files stay exactly where they are.
 *
 * Zero dependencies. Node 18+.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const json = (...p) => JSON.parse(read(...p));

/* ============================================================
   Helpers
   ============================================================ */

/** Escape for a text node. Quotes are legal here, so they stay literal. */
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Escape for a double-quoted attribute value. */
const attr = (s) => esc(s).replace(/"/g, '&quot;');

/** Rich text fields may contain <strong>/<span> etc. Passed through as-is. */
const rich = (s) => String(s == null ? '' : s);

const linkAttrs = (item) => {
  let out = '';
  if (item.new_tab) out += ' target="_blank" rel="noopener"';
  if (item.download) out += ' download';
  return out;
};

/* ============================================================
   Icon registry — inline SVGs kept out of the CMS so an editor
   can pick an icon by name without ever seeing markup.
   ============================================================ */

const STROKE_ICONS = {
  'arrow-right': '<path d="M5 12h14M13 5l7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 17L17 7M9 7h8v8"/>',
  'layers':
    '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  'palette':
    '<circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/>' +
    '<circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/>' +
    '<path d="M12 22s-7-4-7-10c0-3 2-5 5-5"/>',
  'check-circle':
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'mail':
    '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>' +
    '<polyline points="22,6 12,13 2,6"/>',
  'globe':
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>' +
    '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
};

/** Icons drawn with fill instead of stroke. */
const FILL_ICONS = {
  'linkedin':
    '<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.78C.8 0 0 .77 0 1.73v20.55C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.72V1.73C24 .77 23.2 0 22.22 0z"/>',
  'pinterest':
    '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.69-2.425-2.857-2.425-4.587 0-3.743 2.718-7.178 7.848-7.178 4.125 0 7.325 2.946 7.325 6.883 0 4.116-2.596 7.432-6.197 7.432-1.213 0-2.352-.629-2.738-1.375 0 0-.599 2.286-.744 2.83-.268 1.025-1.001 2.302-1.492 3.076 1.12.333 2.308.513 3.541.513 6.627 0 12.001-5.367 12.001-12.001 0-6.627-5.373-12.001-12.001-12.001z"/>',
  'instagram':
    '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
  'twitter':
    '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  'facebook':
    '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
};

function icon(name, strokeWidth = '2', cls = '') {
  const c = cls ? ` class="${cls}"` : '';
  if (FILL_ICONS[name]) {
    return `<svg${c} viewBox="0 0 24 24" fill="currentColor">${FILL_ICONS[name]}</svg>`;
  }
  const body = STROKE_ICONS[name];
  if (!body) throw new Error(`build: unknown icon "${name}"`);
  return (
    `<svg${c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" ` +
    `stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  );
}

/* Lucide icons on the designs site are rendered client-side by name. */
const lucide = (name, cls) => `<i data-lucide="${name}" class="${cls}"></i>`;

/* ============================================================
   Region replacement
   ============================================================ */

function replaceRegion(html, name, inner, file) {
  const re = new RegExp(
    `(<!--\\s*CMS:START ${name}\\s*-->)[\\s\\S]*?(<!--\\s*CMS:END ${name}\\s*-->)`
  );
  if (!re.test(html)) {
    throw new Error(`build: region "${name}" not found in ${file}`);
  }
  // Function replacer so $ in content is never treated as a backreference.
  return html.replace(re, (_m, open, close) => `${open}\n${inner}\n${close}`);
}

function applyRegions(file, regions) {
  const abs = path.join(ROOT, file);
  let html = fs.readFileSync(abs, 'utf8');
  for (const [name, inner] of Object.entries(regions)) {
    html = replaceRegion(html, name, inner, file);
  }
  fs.writeFileSync(abs, html);
  return Object.keys(regions).length;
}

/* ============================================================
   Minimal Markdown renderer (Journal bodies only)
   ------------------------------------------------------------
   Emits the exact utility classes the Eon journal modal already
   uses, so plain markdown in the CMS renders identically to the
   hand-written HTML it replaces.
   ============================================================ */

function inlineMd(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" class="text-brand-500 underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
}

const IMG_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;

function renderMarkdown(src) {
  const blocks = String(src || '').trim().split(/\n\s*\n/);
  const out = [];
  let ledeUsed = false;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    const lines = block.split('\n').map((l) => l.trim());

    // Heading
    if (/^###\s+/.test(block)) {
      const text = block.replace(/^###\s+/, '');
      out.push(
        `<h3 class="text-ink font-display text-2xl mt-10 mb-4">${inlineMd(text)}</h3>`
      );
      continue;
    }

    // Bullet list
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      const items = lines
        .map((l) => `<li>${inlineMd(l.replace(/^[-*]\s+/, ''))}</li>`)
        .join('\n                    ');
      out.push(
        '<ul class="list-disc pl-5 mb-6 space-y-3 marker:text-brand-500 text-gray-400">\n' +
          `                    ${items}\n                </ul>`
      );
      continue;
    }

    // Image group: every line is an image. Renders as the two-up grid,
    // picking up an immediately following *italic* line as the caption.
    if (lines.every((l) => IMG_LINE.test(l))) {
      const imgs = lines.map((l) => l.match(IMG_LINE));
      let caption = '';
      const next = (blocks[i + 1] || '').trim();
      if (/^\*[^*]+\*$/.test(next)) {
        caption = next.replace(/^\*|\*$/g, '');
        i++; // consume it
      }
      const cells = imgs
        .map(
          (m) =>
            '<div class="relative aspect-video rounded-lg overflow-hidden">\n' +
            `                        <img src="${attr(m[2])}" class="object-cover w-full h-full hover:scale-105 transition-transform duration-500" alt="${attr(m[1])}">\n` +
            '                    </div>'
        )
        .join('\n                    ');
      const cap = caption
        ? `\n                    <p class="col-span-1 md:col-span-2 text-xs text-center text-gray-600 font-mono mt-2">${esc(caption)}</p>`
        : '';
      out.push(
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">\n' +
          `                    ${cells}${cap}\n                </div>`
      );
      continue;
    }

    // Paragraph. The first one is the article lede.
    const cls = ledeUsed ? 'mb-4' : 'mb-6 text-lg font-medium text-ink';
    ledeUsed = true;
    out.push(`<p class="${cls}">${inlineMd(block.replace(/\n/g, ' '))}</p>`);
  }

  return out.join('\n                ');
}

/* ============================================================
   Engineering Journal body renderer
   ------------------------------------------------------------
   The engineering site is plain custom CSS (no Tailwind), so this
   emits semantic tags styled under `.post-body` in index.html.
   ============================================================ */

function ejInline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
}

function ejBody(src) {
  const blocks = String(src || '').trim().split(/\n\s*\n/);
  const out = [];
  let lede = false;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;
    const lines = block.split('\n').map((l) => l.trim());

    if (/^###\s+/.test(block)) {
      out.push(`            <h3>${ejInline(block.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      const items = lines
        .map((l) => `<li>${ejInline(l.replace(/^[-*]\s+/, ''))}</li>`)
        .join('\n                ');
      out.push(`            <ul>\n                ${items}\n            </ul>`);
      continue;
    }
    if (lines.every((l) => IMG_LINE.test(l))) {
      const imgs = lines.map((l) => l.match(IMG_LINE));
      let cap = '';
      const next = (blocks[i + 1] || '').trim();
      if (/^\*[^*]+\*$/.test(next)) {
        cap = next.replace(/^\*|\*$/g, '');
        i++;
      }
      const cells = imgs
        .map((m) => `<img src="${attr(m[2])}" alt="${attr(m[1])}" loading="lazy">`)
        .join('\n                ');
      const capHtml = cap ? `\n                <figcaption>${esc(cap)}</figcaption>` : '';
      const two = imgs.length > 1 ? ' two' : '';
      out.push(`            <figure class="post-figs${two}">\n                ${cells}${capHtml}\n            </figure>`);
      continue;
    }
    const cls = lede ? '' : ' class="lede"';
    lede = true;
    out.push(`            <p${cls}>${ejInline(block.replace(/\n/g, ' '))}</p>`);
  }
  return out.join('\n');
}

/* ============================================================
   ENGINEERING SITE
   ============================================================ */

function buildEngineering() {
  const meta = json('content', 'engineering', 'meta.json');
  const nav = json('content', 'engineering', 'nav.json');
  const hero = json('content', 'engineering', 'hero.json');
  const about = json('content', 'engineering', 'about.json');
  const projects = json('content', 'engineering', 'projects.json');
  const skills = json('content', 'engineering', 'skills.json');
  const experience = json('content', 'engineering', 'experience.json');
  const journal = json('content', 'engineering', 'journal.json');
  const contact = json('content', 'engineering', 'contact.json');
  const footer = json('content', 'engineering', 'footer.json');

  const button = (b) => {
    const sw = b.style === 'primary' ? '2.2' : '2';
    return (
      `<a class="btn ${attr(b.style)}" href="${attr(b.href)}"${linkAttrs(b)}>\n` +
      `            ${esc(b.label)}\n` +
      `            ${icon(b.icon, sw)}\n` +
      `          </a>`
    );
  };

  const regions = {};

  /* ---- head ---- */
  regions['e-head'] =
    `  <title>${esc(meta.title)}</title>\n` +
    `  <meta name="description" content="${attr(meta.description)}" />`;

  /* ---- nav ---- */
  regions['e-nav'] =
    // Icon plus live text. The mark is the cube on its own, so the name is
    // real text again rather than glyphs baked into a PNG, which means
    // nav.brand is what the visitor reads and not just the accessible name.
    // The img is therefore alt="" — decorative, because the adjacent span
    // already names the link and a screen reader should not hear it twice.
    // width/height reserve the row against reflow and only need to carry the
    // right ratio; images/logo-mark.png is 740x881, so 30x36 matches it to
    // within a percent. CSS sets the rendered height.
    `      <a href="#top" class="brand"><img src="/images/logo-mark.png" alt="" width="30" height="36" class="brand-mark" /><span>${esc(nav.brand)}</span></a>\n` +
    `      <nav class="nav-links" aria-label="Primary">\n` +
    nav.links
      .map((l) => `        <a href="${attr(l.href)}">${esc(l.label)}</a>`)
      .join('\n') +
    `\n      </nav>\n` +
    `      <a class="nav-cta" href="${attr(nav.cta_href)}">\n` +
    `        ${esc(nav.cta_label)}\n` +
    `        ${icon('arrow-right', '2')}\n` +
    `      </a>`;

  /* ---- hero ---- */
  regions['e-hero'] =
    `        <h1 class="reveal" data-d="1">${esc(hero.headline)}</h1>\n\n` +
    `        <p class="hero-role reveal" data-d="2">\n` +
    `          ${hero.roles.map(esc).join('&nbsp;·&nbsp;')}\n` +
    `        </p>\n\n` +
    `        <p class="hero-sub reveal" data-d="3">\n` +
    `          ${esc(hero.subline)}\n` +
    `        </p>\n\n` +
    `        <div class="hero-buttons reveal" data-d="4">\n` +
    `          ${hero.buttons.map(button).join('\n          ')}\n` +
    `        </div>`;

  /* ---- about ---- */
  const stats = about.stats
    .map(
      (s) =>
        `            <div class="stat">\n` +
        `              <div class="n">${esc(s.number)}${s.plus ? '<span class="plus">+</span>' : ''}</div>\n` +
        `              <div class="lbl">${esc(s.label_line_1)}<br>${esc(s.label_line_2)}</div>\n` +
        `            </div>`
    )
    .join('\n');

  regions['e-about'] =
    `        <div class="sec-eyebrow reveal">${esc(about.eyebrow)}</div>\n` +
    `        <h2 class="sec-title reveal" data-d="1">${esc(about.title)}</h2>\n\n` +
    `        <div class="about-grid">\n` +
    `          <div class="about-stats reveal" data-d="2">\n${stats}\n          </div>\n\n` +
    `          <div class="about-body reveal" data-d="3">\n` +
    about.paragraphs
      .map((p) => `            <p>\n              ${rich(p)}\n            </p>`)
      .join('\n') +
    `\n          </div>\n        </div>`;

  /* ---- projects ---- */
  const cards = projects.items
    .map((p, i) => {
      const d = i > 0 ? ` data-d="${i}"` : '';
      const wide = p.wide ? ' wide' : '';
      const tools = p.tools
        .map((t) => `                <span>${esc(t)}</span>`)
        .join('\n');
      return (
        `          <a class="project-card${wide} reveal"${d} href="${attr(p.href)}">\n` +
        `            <div class="project-visual">\n` +
        `              <img src="${attr(p.image)}" alt="${attr(p.image_alt)}" loading="lazy" />\n` +
        `            </div>\n` +
        `            <div class="project-cat"><span class="pin"></span> ${esc(p.category)}</div>\n` +
        `            <h3 class="project-title">${esc(p.title)}</h3>\n` +
        `            <p class="project-desc">${esc(p.description)}</p>\n` +
        `            <div class="project-footer">\n` +
        `              <div class="project-tools">\n${tools}\n              </div>\n` +
        `              <span class="project-arrow">\n` +
        `                ${esc(p.link_label)}\n` +
        `                ${icon('arrow-right', '2.2')}\n` +
        `              </span>\n` +
        `            </div>\n` +
        `          </a>`
      );
    })
    .join('\n\n');

  const eon = projects.eon_strip;
  const eonStrip = !eon || eon.enabled === false ? '' :
    `\n\n        <!-- Eon Designs spotlight -->\n` +
    `        <div class="eon-strip reveal" data-d="2">\n` +
    `          <div class="eon-content">\n` +
    `            <div class="eon-eyebrow">\n` +
    `              <span>◆</span>\n` +
    `              ${esc(eon.eyebrow)}\n` +
    `            </div>\n` +
    `            <h3 class="eon-title">${esc(eon.title)}</h3>\n` +
    `            <p class="eon-desc">\n              ${esc(eon.description)}\n            </p>\n` +
    `          </div>\n` +
    `          <a class="eon-link" href="${attr(eon.link_href)}" target="_blank" rel="noopener">\n` +
    `            ${esc(eon.link_label)}\n` +
    `            ${icon('arrow-up-right', '2')}\n` +
    `          </a>\n        </div>`;

  regions['e-projects'] =
    `        <div class="sec-eyebrow reveal">${esc(projects.eyebrow)}</div>\n` +
    `        <h2 class="sec-title reveal" data-d="1">${esc(projects.title)}</h2>\n` +
    `        <p class="sec-sub reveal" data-d="2">${esc(projects.subtitle)}</p>\n\n` +
    `        <div class="projects-grid">\n\n${cards}\n\n        </div>${eonStrip}`;

  /* ---- skills ---- */
  const blocks = skills.blocks
    .map((b, i) => {
      const d = i > 0 ? ` data-d="${i > 2 ? 1 : i}"` : '';
      const badges = b.badges
        .map((x) => `              <span class="badge">${esc(x)}</span>`)
        .join('\n');
      return (
        `          <div class="skill-block ${attr(b.theme)} reveal"${d}>\n` +
        `            <div class="skill-icon">\n` +
        `              ${icon(b.icon, '1.8')}\n` +
        `            </div>\n` +
        `            <h3>${esc(b.heading)}</h3>\n` +
        `            <p class="skill-note">${esc(b.note)}</p>\n` +
        `            <div class="badges">\n${badges}\n            </div>\n` +
        `          </div>`
      );
    })
    .join('\n\n');

  regions['e-skills'] =
    `        <div class="sec-eyebrow reveal">${esc(skills.eyebrow)}</div>\n` +
    `        <h2 class="sec-title reveal" data-d="1">${esc(skills.title)}</h2>\n` +
    `        <p class="sec-sub reveal" data-d="2">${esc(skills.subtitle)}</p>\n\n` +
    `        <div class="skills-blocks">\n\n${blocks}\n\n        </div>`;

  /* ---- experience ---- */
  const entries = experience.entries
    .map((e, i) => {
      const d = i > 0 ? ` data-d="${i}"` : '';
      return (
        `          <div class="exp reveal"${d}>\n` +
        `            <div class="exp-date">${esc(e.date)}</div>\n` +
        `            <h3 class="exp-role">${esc(e.role)}</h3>\n` +
        `            <div class="exp-org">${esc(e.org)}</div>\n` +
        `            <p class="exp-desc">\n              ${esc(e.description)}\n            </p>\n` +
        `          </div>`
      );
    })
    .join('\n\n');

  regions['e-experience'] =
    `        <div class="sec-eyebrow reveal">${esc(experience.eyebrow)}</div>\n` +
    `        <h2 class="sec-title reveal" data-d="1">${esc(experience.title)}</h2>\n` +
    `        <p class="sec-sub reveal" data-d="2">${esc(experience.subtitle)}</p>\n\n` +
    `        <div class="timeline">\n\n${entries}\n\n        </div>`;

  /* ---- journal ---- */
  const jCards = journal.posts
    .map((p, i) => {
      const d = i > 0 ? ` data-d="${i > 3 ? 1 : i}"` : '';
      return (
        `          <button type="button" class="journal-card reveal"${d} data-post="${i}" aria-haspopup="dialog">\n` +
        `            <div class="journal-visual">\n` +
        `              <img src="${attr(p.image)}" alt="${attr(p.title)}" loading="lazy" />\n` +
        `            </div>\n` +
        `            <div class="journal-date"><span class="pin"></span> ${esc(p.date)}</div>\n` +
        `            <h3 class="journal-title">${esc(p.title)}</h3>\n` +
        `            <p class="journal-excerpt">${esc(p.excerpt)}</p>\n` +
        `            <span class="journal-arrow">\n` +
        `              Read article\n` +
        `              ${icon('arrow-right', '2.2')}\n` +
        `            </span>\n` +
        `          </button>`
      );
    })
    .join('\n\n');

  // Full post bodies live in the DOM (hidden) so they are crawlable and
  // shareable; the modal script reveals the matching article on click.
  const jArticles = journal.posts
    .map(
      (p, i) =>
        `        <article class="journal-source" id="jpost-${i}" hidden>\n` +
        `          <div class="post-date">${esc(p.date)}</div>\n` +
        `          <h1 class="post-title">${esc(p.title)}</h1>\n` +
        `          <div class="post-hero"><img src="${attr(p.image)}" alt="${attr(p.title)}" /></div>\n` +
        `          <div class="post-body">\n${ejBody(p.body)}\n          </div>\n` +
        `        </article>`
    )
    .join('\n');

  regions['e-journal'] =
    `        <div class="sec-eyebrow reveal">${esc(journal.eyebrow)}</div>\n` +
    `        <h2 class="sec-title reveal" data-d="1">${esc(journal.title)}</h2>\n` +
    `        <p class="sec-sub reveal" data-d="2">${esc(journal.subtitle)}</p>\n\n` +
    `        <div class="journal-grid">\n\n${jCards}\n\n        </div>\n\n` +
    `        <div class="journal-sources" hidden>\n${jArticles}\n        </div>`;

  /* ---- contact ---- */
  regions['e-contact'] =
    `        <div class="contact-card reveal">\n` +
    `          <h2>${esc(contact.title)}</h2>\n` +
    `          <p>${esc(contact.intro)}</p>\n` +
    `          <div class="contact-links">\n` +
    `            ${contact.links.map(button).join('\n            ')}\n` +
    `          </div>\n        </div>`;

  /* ---- footer ---- */
  const socials = footer.socials
    .map((s) => {
      const t = s.new_tab ? ' target="_blank" rel="noopener"' : '';
      return (
        `          <a href="${attr(s.href)}"${t} aria-label="${attr(s.label)}">\n` +
        `            ${icon(s.icon, '1.8')}\n` +
        `          </a>`
      );
    })
    .join('\n');

  regions['e-footer'] =
    `      <div class="foot-brand">${esc(footer.brand)}</div>\n` +
    `      <div class="foot-note">${esc(footer.note)}</div>\n` +
    `      <div class="foot-socials">\n${socials}\n      </div>`;

  return applyRegions('index.html', regions);
}

/* ============================================================
   EON DESIGNS SITE
   ============================================================ */

function buildDesigns() {
  const meta = json('content', 'designs', 'meta.json');
  const nav = json('content', 'designs', 'nav.json');
  const hero = json('content', 'designs', 'hero.json');
  const works = json('content', 'designs', 'works.json');
  const vault = json('content', 'designs', 'vault.json');
  const about = json('content', 'designs', 'about.json');
  const journal = json('content', 'designs', 'journal.json');
  const contact = json('content', 'designs', 'contact.json');

  const regions = {};

  /* ---- head ---- */
  regions['d-head'] =
    `    <title>${esc(meta.title)}</title>\n\n` +
    `    <!-- SOCIAL SHARE PREVIEW (The "Link Card") -->\n` +
    `    <meta property="og:type" content="website">\n` +
    `    <meta property="og:url" content="${attr(meta.og_url)}">\n` +
    `    <meta property="og:title" content="${attr(meta.og_title)}">\n` +
    `    <meta property="og:description" content="${attr(meta.og_description)}">\n` +
    `    <meta property="og:image" content="${attr(meta.og_image)}">\n\n` +
    `    <!-- TWITTER / X CARD -->\n` +
    `    <meta name="twitter:card" content="summary_large_image">\n` +
    `    <meta name="twitter:url" content="${attr(meta.og_url)}">\n` +
    `    <meta name="twitter:title" content="${attr(meta.og_title)}">\n` +
    `    <meta name="twitter:description" content="${attr(meta.og_description)}">\n` +
    `    <meta name="twitter:image" content="${attr(meta.og_image)}">`;

  /* ---- desktop nav ---- */
  const navBtn = (l) =>
    `                <button onclick="scrollToSection('${attr(l.target)}')" class="nav-link text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-ink transition-colors relative group">\n` +
    `                    ${esc(l.label)} <span class="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-500 transition-all group-hover:w-full"></span>\n` +
    `                </button>`;

  regions['d-nav'] =
    nav.links.map(navBtn).join('\n') +
    `\n                <button onclick="scrollToSection('${attr(nav.cta_target)}')" class="px-6 py-2 border border-black/20 text-ink font-medium text-[10px] tracking-widest uppercase hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all duration-500">${esc(nav.cta_label)}</button>`;

  /* ---- mobile nav ---- */
  regions['d-mobile-nav'] =
    nav.links
      .map(
        (l) =>
          `             <button onclick="scrollToSection('${attr(l.target)}'); toggleMobileMenu()" class="text-xl font-display font-medium text-gray-400 hover:text-ink text-left transition-colors border-b border-black/10 pb-4">${esc(l.label)}</button>`
      )
      .join('\n') +
    `\n             <button onclick="scrollToSection('${attr(nav.cta_target)}'); toggleMobileMenu()" class="mt-4 px-6 py-4 bg-ink text-white font-bold text-center w-full uppercase tracking-widest text-xs">${esc(nav.cta_label)}</button>`;

  /* ---- hero ---- */
  regions['d-hero'] =
    `            <div class="inline-block mb-8 md:mb-10 animate-fade-in opacity-0" style="animation-delay: 0.2s">\n` +
    `                <span class="py-2 px-4 border border-brand-500/30 rounded-full text-brand-500 text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase backdrop-blur-md font-medium">${esc(hero.badge)}</span>\n` +
    `            </div>\n\n` +
    `            <h1 class="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-display font-medium text-ink mb-6 md:mb-8 leading-[1.1] md:leading-tight animate-slide-up opacity-0" style="animation-delay: 0.3s">\n` +
    `                ${esc(hero.headline)}\n` +
    `            </h1>\n\n` +
    `            <p class="text-gray-400 max-w-xl mx-auto text-sm md:text-lg leading-relaxed mb-10 md:mb-12 font-light animate-slide-up opacity-0 px-4 md:px-0" style="animation-delay: 0.5s">\n` +
    `                ${esc(hero.subline_line_1)} <br/>\n` +
    `                ${esc(hero.subline_line_2_before)} <span class="text-brand-500 italic font-display text-lg md:text-xl">${esc(hero.subline_emphasis)}</span> ${esc(hero.subline_line_2_after)}\n` +
    `            </p>\n\n` +
    `            <div class="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center animate-slide-up opacity-0" style="animation-delay: 0.7s">\n` +
    `               <button onclick="scrollToSection('work')" class="w-full md:w-auto px-10 py-4 bg-brand-500 text-ink text-xs font-bold tracking-widest uppercase hover:bg-ink hover:text-white transition-all duration-300 min-w-[160px] shadow-[0_0_20px_rgba(184,166,136,0.25)]">${esc(hero.primary_button)}</button>\n` +
    `               <button onclick="scrollToSection('vault')" class="w-full md:w-auto px-10 py-4 border border-black/20 text-ink text-xs font-bold tracking-widest uppercase hover:border-brand-500 hover:text-brand-500 transition-all duration-300 min-w-[160px]">${esc(hero.secondary_button)}</button>\n` +
    `            </div>`;

  /* ---- works heading ---- */
  regions['d-work-head'] =
    `                <div>\n` +
    `                    <h2 class="text-3xl md:text-6xl font-display font-medium text-ink mb-2">${esc(works.heading)}</h2>\n` +
    `                    <p class="text-gray-500 font-light text-sm md:text-base">${esc(works.subheading)}</p>\n` +
    `                </div>\n` +
    `                <span class="hidden md:block text-brand-500/50 text-sm font-mono">${esc(works.counter)}</span>`;

  /* ---- vault heading ---- */
  regions['d-vault-head'] =
    `                <div>\n` +
    `                    <div class="flex items-center gap-2 text-brand-500 mb-4">\n` +
    `                        ${lucide('lock', 'w-3 h-3')}\n` +
    `                        <span class="text-[10px] font-mono uppercase tracking-[0.2em]">${esc(vault.eyebrow)}</span>\n` +
    `                    </div>\n` +
    `                    <h2 class="text-3xl md:text-6xl font-display font-medium tracking-tight text-ink">${esc(vault.heading)}</h2>\n` +
    `                </div>\n` +
    `                <p class="text-gray-400 max-w-sm text-sm leading-relaxed text-left md:text-left font-light">\n` +
    `                    ${esc(vault.description)}\n` +
    `                </p>`;

  regions['d-vault-cta'] =
    `                <button onclick="openFullVault()" class="w-full md:w-auto group inline-flex items-center justify-center gap-3 px-12 py-4 border border-black/10 rounded-none text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all duration-500">\n` +
    `                    ${lucide('grid', 'w-4 h-4 group-hover:text-brand-500 transition-colors')}\n` +
    `                    <span class="text-xs tracking-[0.2em] uppercase">${esc(vault.load_all_label)}</span>\n` +
    `                </button>`;

  regions['d-archive-head'] =
    `                        <h2 class="text-xl md:text-2xl font-display text-ink">${esc(vault.archive_heading)}</h2>\n` +
    `                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Total Artifacts: <span id="artifact-count" class="text-ink invisible">0</span></p>`;

  /* ---- about ---- */
  const caps = about.capabilities
    .map(
      (c) =>
        `                                <li class="flex items-center gap-3 text-gray-400 text-sm">\n` +
        `                                    <span class="text-brand-500">${lucide('check', 'w-3 h-3')}</span> ${esc(c)}\n` +
        `                                </li>`
    )
    .join('\n');

  const clients = about.clients
    .map(
      (c) =>
        `                                <span class="px-4 py-1 border border-black/10 text-xs text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors cursor-default">${esc(c)}</span>`
    )
    .join('\n');

  regions['d-about'] =
    `                <!-- Image/Visual -->\n` +
    `                <div class="w-full md:w-5/12 relative group">\n` +
    `                    <div class="aspect-[3/4] overflow-hidden relative max-w-sm mx-auto md:max-w-none">\n` +
    `                        <img id="profile-img" src="${attr(about.image)}" onerror="this.src='${attr(about.image_fallback)}'" alt="${attr(about.heading_line_1 + ' ' + about.heading_line_2)}" class="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />\n` +
    `                        <div class="absolute inset-0 bg-black/10"></div>\n` +
    `                    </div>\n` +
    `                    <div class="absolute -bottom-4 -right-4 w-full h-full border border-brand-500/20 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 hidden md:block"></div>\n` +
    `                </div>\n\n` +
    `                <!-- Content -->\n` +
    `                <div class="w-full md:w-7/12">\n` +
    `                    <span class="text-brand-500 font-mono text-xs tracking-[0.2em] uppercase mb-4 md:mb-6 block">${esc(about.eyebrow)}</span>\n\n` +
    `                    <h2 class="text-3xl md:text-5xl font-display font-medium tracking-tight text-ink mb-6 md:mb-8">\n` +
    `                        ${esc(about.heading_line_1)} <br/> ${esc(about.heading_line_2)}\n` +
    `                    </h2>\n\n` +
    `                    <div class="space-y-6 text-gray-400 text-sm md:text-base leading-relaxed font-light">\n` +
    about.paragraphs
      .map((p) => `                        <p>\n                            ${rich(p)}\n                        </p>`)
      .join('\n') +
    `\n                    </div>\n\n` +
    `                    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">\n` +
    `                        <div>\n` +
    `                            <h4 class="text-ink font-display font-medium tracking-wide mb-6 text-lg">${esc(about.capabilities_heading)}</h4>\n` +
    `                            <ul class="space-y-3">\n${caps}\n                            </ul>\n` +
    `                        </div>\n` +
    `                        <div>\n` +
    `                             <h4 class="text-ink font-display font-medium tracking-wide mb-6 text-lg">${esc(about.clients_heading)}</h4>\n` +
    `                             <div class="flex flex-wrap gap-2">\n${clients}\n                             </div>\n` +
    `                        </div>\n` +
    `                    </div>\n` +
    `                </div>`;

  /* ---- journal heading ---- */
  regions['d-journal-head'] =
    `             <h2 class="text-3xl md:text-5xl font-display font-medium text-ink mb-10 md:mb-16">${esc(journal.heading)}</h2>`;

  /* ---- contact ---- */
  const socialLink = (s) => {
    // Brand/social marks: render as inline SVG at build time. lucide dropped
    // its brand icons, so `<i data-lucide="instagram">` etc. render nothing.
    const fill = FILL_ICONS[s.network];
    const inner = fill
        ? `\n                             <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">${fill}</svg>\n                         `
        : lucide(s.network, 'w-4 h-4');
    const extra = fill ? ' flex items-center justify-center' : '';
    return (
      `                         <a href="${attr(s.href)}" target="_blank" class="p-3 border border-black/10 text-gray-400 hover:text-black hover:bg-brand-500 hover:border-brand-500 transition-all${extra}">${inner}</a>`
    );
  };

  regions['d-contact'] =
    `                 <div class="lg:col-span-2">\n` +
    `                     <h2 class="text-3xl md:text-5xl font-display text-ink mb-8">${esc(contact.heading_line_1)} <br/><span class="text-brand-500 italic">${esc(contact.heading_emphasis)}</span></h2>\n\n` +
    `                     <a href="mailto:${attr(contact.email)}" class="flex items-center gap-4 text-ink hover:text-brand-500 transition-colors mb-4 group">\n` +
    `                         <div class="w-10 h-10 border border-black/10 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-black group-hover:border-brand-500 transition-all">\n` +
    `                             ${lucide('mail', 'w-4 h-4')}\n` +
    `                         </div>\n` +
    `                         <span class="text-base md:text-lg font-display">${esc(contact.email)}</span>\n` +
    `                     </a>\n\n` +
    `                     <div class="flex gap-3 md:gap-4 mt-8">\n` +
    contact.socials.map(socialLink).join('\n') +
    `\n                     </div>\n` +
    `                 </div>\n\n` +
    `                 <div class="lg:col-span-3 bg-dark-900 p-6 md:p-12 border border-black/5">\n` +
    `                     <form onsubmit="handleFormSubmit(event)" class="space-y-10">\n` +
    `                         <div class="grid grid-cols-1 md:grid-cols-2 gap-8">\n` +
    `                             <input type="text" name="name" required class="bg-transparent border-b border-black/10 py-4 text-ink focus:border-brand-500 outline-none font-display text-lg md:text-xl transition-all w-full" placeholder="${attr(contact.name_placeholder)}" />\n` +
    `                             <input type="email" name="email" required class="bg-transparent border-b border-black/10 py-4 text-ink focus:border-brand-500 outline-none font-display text-lg md:text-xl transition-all w-full" placeholder="${attr(contact.email_placeholder)}" />\n` +
    `                         </div>\n` +
    `                         <textarea rows="3" name="message" class="w-full bg-transparent border-b border-black/10 py-4 text-ink focus:border-brand-500 outline-none font-display text-lg md:text-xl resize-none transition-all" placeholder="${attr(contact.message_placeholder)}"></textarea>\n` +
    `                         <button type="submit" id="submit-btn" class="px-10 py-5 bg-brand-500 text-ink font-bold uppercase tracking-widest text-xs hover:bg-ink hover:text-white transition-all w-full md:w-auto">${esc(contact.submit_label)}</button>\n` +
    `                     </form>\n` +
    `                 </div>`;

  /* ---- footer ---- */
  regions['d-footer'] = `        ${esc(contact.footer)}`;

  const count = applyRegions('designs/index.html', regions);
  buildDesignsData({ meta, works, vault, journal });
  return count;
}

/* ============================================================
   designs/js/data.js — regenerated from the CMS content.
   app.js imports from here, so its shape must stay identical.
   ============================================================ */

function buildDesignsData({ meta, works, vault, journal }) {
  const projects = works.items.map((p, i) => ({
    id: i + 1,
    title: p.title,
    category: p.category,
    image: p.image,
    fallbackImage: p.image,
    client: p.client,
    year: p.year,
    role: p.role,
    description: p.description,
    challenge: p.challenge,
    solution: p.solution,
    gallery: p.gallery || [],
  }));

  const blogPosts = journal.posts.map((b, i) => ({
    id: i + 1,
    title: b.title,
    date: b.date,
    image: b.image,
    excerpt: b.excerpt,
    content: '\n            ' + renderMarkdown(b.body) + '\n        ',
  }));

  const vaultItems = vault.items.map((v, i) => ({
    id: i + 1,
    category: v.category,
    title: v.title,
    src: v.src,
    full: v.full || v.src,
  }));

  const out =
    '// ===== DATA & CONFIGURATION =====\n' +
    '// GENERATED FILE — do not edit by hand.\n' +
    '// Source of truth: /content/designs/*.json, edited at /admin.\n' +
    '// Regenerate with: node build.js\n\n' +
    '// AI KEY — intentionally blank. Never commit a key here.\n' +
    'export const GEMINI_API_KEY = "";\n\n' +
    `export const LOGO_FILENAME = ${JSON.stringify(meta.logo)};\n\n` +
    `export const projects = ${JSON.stringify(projects, null, 4)};\n\n` +
    `export const blogPosts = ${JSON.stringify(blogPosts, null, 4)};\n\n` +
    `export const vaultItems = ${JSON.stringify(vaultItems, null, 4)};\n`;

  fs.writeFileSync(path.join(ROOT, 'designs', 'js', 'data.js'), out);
}

/* ============================================================
   Run
   ============================================================ */

try {
  const e = buildEngineering();
  const d = buildDesigns();
  console.log(`build: engineering site — ${e} regions rendered`);
  console.log(`build: eon designs site — ${d} regions rendered + data.js`);
  console.log('build: ok');
} catch (err) {
  console.error('\nBUILD FAILED\n' + err.message + '\n');
  process.exit(1);
}
