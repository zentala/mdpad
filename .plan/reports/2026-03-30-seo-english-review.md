# SEO & English Language Review — mdpad.zentala.io

**Date**: 2026-03-30
**Reviewer**: Claude (automated audit)
**Site**: https://mdpad.zentala.io
**Source reviewed**: `prototype/index.html`, `README.md`, `REFERENCE.md`, all visible-text components

---

## Critical Finding: TLS Certificate Error

The site at `https://mdpad.zentala.io` returns `ERR_TLS_CERT_ALTNAME_INVALID`. The SSL
certificate does not cover the `mdpad.zentala.io` subdomain. This means:

- Search engines cannot crawl the site (Google requires HTTPS)
- Browsers show a security warning, blocking most visitors
- All SEO efforts are moot until this is fixed

**Action**: Check Cloudflare DNS/Pages settings. Ensure `mdpad.zentala.io` has a valid
CNAME or A record pointing to the Pages deployment, and that the SSL certificate
covers this subdomain (Cloudflare usually auto-provisions; may need to re-trigger).

---

## SEO Audit

### 1. Page Title

**Current**: `mdpad — Markdown Viewer`

**Issues**:
- Acceptable length (26 chars, under 60 limit)
- Descriptive enough for search

**Recommendation**: Consider adding a differentiator: `mdpad — Markdown Viewer for Developers`
to target the developer audience and differentiate from generic markdown tools.

### 2. Meta Description

**Current**: `Markdown editor & viewer for CLI, desktop and server`

**Issues**:
- Too short (51 chars; optimal is 120-160 chars)
- Missing key selling points (offline, GFM, Mermaid, syntax highlighting)

**Recommendation**:
```
Lightweight offline Markdown viewer and editor for developers. GFM tables, Mermaid diagrams, syntax highlighting, YAML frontmatter — all in one fast desktop app. Open from your terminal with mdpad.
```

### 3. Open Graph Tags

**Present**:
- `og:title` — yes
- `og:description` — yes (same short description)
- `og:type` — yes (`website`)
- `og:url` — yes (`https://mdpad.zentala.io`)

**Missing**:
- `og:image` — **critical omission**. Social shares (Twitter, LinkedIn, Discord, Slack)
  will show no preview image. Need a 1200x630 OG image showing the app UI.
- `og:site_name` — missing (should be `mdpad`)
- `og:locale` — missing (should be `en_US`)

### 4. Twitter Card Tags

**Missing entirely.** Add:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="mdpad — Markdown Viewer for Developers">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://mdpad.zentala.io/og-image.png">
```

### 5. Canonical URL

**Missing.** Add:
```html
<link rel="canonical" href="https://mdpad.zentala.io/">
```

### 6. robots.txt

**Missing.** No `prototype/public/robots.txt` exists. The deployed site returns nothing.

**Recommendation**: Create `prototype/public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://mdpad.zentala.io/sitemap.xml
```

### 7. Sitemap

**Missing.** No `sitemap.xml` exists.

**Note**: Since this is an SPA (single-page app), a sitemap is less critical. However,
a minimal one listing the root URL would still help. For a prototype/demo site this
is low priority.

### 8. Semantic HTML

**Issues**:
- The entire app renders inside `<div id="root">` — no semantic landmarks
  (`<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`)
- This is a React SPA, so the HTML document itself is minimal — search engines
  that don't execute JavaScript will see an empty page
- No `<noscript>` fallback for search engines or users without JS

**Recommendation**: Add a `<noscript>` tag with basic content and links:
```html
<noscript>
  <h1>mdpad — Markdown Viewer for Developers</h1>
  <p>A lightweight desktop Markdown viewer. Enable JavaScript to use the app.</p>
  <p><a href="https://github.com/zentala/mdpad">View on GitHub</a></p>
</noscript>
```

### 9. Image Alt Texts

- **Logo SVG** (`Logo.tsx`): Has proper `role="img"` and `aria-label="mdpad"` — good
- **Favicon**: Present (`favicon.svg`) — good
- **Images in REFERENCE.md**: Placeholder images from `picsum.photos` have basic alt
  texts (`Wide landscape demo`, `Square thumbnail`) — acceptable for demo content

### 10. Heading Hierarchy

- The app EmptyState uses `<h1>mdpad</h1>` — correct single H1
- Markdown content rendered via ReactMarkdown preserves heading hierarchy from source files
- **Issue**: When viewing REFERENCE.md, the document starts with H1, then uses H2, H3 etc.
  correctly. However, the app shell itself has no heading structure — the tab bar,
  sidebar, and toolbar are all `<div>` and `<button>` elements without ARIA landmarks.

### 11. Performance Basics

- **Google Fonts loaded via preconnect** — good (`fonts.googleapis.com`, `fonts.gstatic.com`)
- **Two font families loaded** (JetBrains Mono + DM Sans) — acceptable but adds weight
- **Mermaid.js**: Lazy-loaded (good) — only imported when a mermaid block is present
- **Shiki**: Loaded per-theme — could be heavy but appropriate for the use case
- **Vite build**: Production build will tree-shake and minify — good
- **No explicit image optimization** — demo images are external (picsum.photos)
- **No `_headers` file** for Cloudflare Pages — missing cache control headers

**Recommendation**: Add `prototype/public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 12. Mobile Friendliness

- **Viewport meta tag present** — `width=device-width, initial-scale=1.0` — good
- **No responsive breakpoints visible** in the app shell — this is a desktop app
  prototype, so mobile responsiveness is a lower priority, but the demo site should
  at least not break on mobile viewports

### 13. Structured Data / JSON-LD

**Missing.** For a software product page, consider adding SoftwareApplication schema:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "mdpad",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, macOS, Linux",
  "description": "Lightweight Markdown viewer for developers",
  "url": "https://mdpad.zentala.io",
  "license": "https://opensource.org/licenses/MIT"
}
```

This is low priority for a prototype but would help if you want the site to rank.

---

## English Language Review

### README.md

Overall the README reads well. Specific issues:

1. **Line 3**: `you're looking at this README right now!`
   - **Issue**: This is only true when viewing in the deployed demo. If someone reads the
     README on GitHub, this is confusing.
   - **Suggestion**: Change to `interactive prototype demo` or add context:
     `you can browse this README in the app!`

2. **Line 11**: `A local-first Markdown tool built for developers who work with AI-generated specs, plans, and documentation.`
   - **Issue**: Good sentence, but "local-first" is jargon that may not resonate with all
     developers. It also contradicts "server mode" listed below.
   - **Suggestion**: `An offline-capable Markdown tool built for developers...`

3. **Line 13**: `What it is: A fast, offline viewer and editor for .md files with full GFM support.`
   - **Good**: Clear and concise.

4. **Line 15**: `What it isn't: Not a wiki, not a note-taking app, not Notion. Just Markdown, done right.`
   - **Issue**: "Not a wiki, not a note-taking app, not Notion" — the triple negation
     followed by "Just" works well rhetorically. However, "done right" is a bold claim
     for a prototype. Consider softening: `Just Markdown, nothing else.`

5. **Line 81**: `All documentation is browsable in the live demo:`
   - **Issue**: The links point to relative paths (`.arch/ARCHITECTURE.md`,
     `.plan/BACKLOG.md`) which work in the demo but not on GitHub.
   - **Note**: This is a feature, not a bug — it drives people to the demo.

6. **Line 95**: `` `#` = Markdown heading. `>` = terminal prompt. Two characters, zero ambiguity. ``
   - **Good**: Punchy and memorable.

### REFERENCE.md

1. **Line 14**: `Launch from your terminal, browse any folder, and preview markdown with full GFM support.`
   - **Issue**: "markdown" should be capitalized as "Markdown" for consistency (it's
     capitalized elsewhere in the document as a proper noun).

2. **Lines 533-540** ("What's Coming Next" section):
   - **Issue**: This list is outdated — several items (Mermaid diagrams, math rendering,
     full-text search, tab support) are already implemented in the prototype.
   - **Action**: Update this section to reflect current state. Either remove completed
     items or mark them as done.

3. **Line 246**: `mdpad uses comrak for parsing — the same engine that powers GitHub and GitLab rendering.`
   - **Issue**: comrak is used by GitLab (confirmed) and Deno. The claim that it "powers
     GitHub" rendering is inaccurate — GitHub uses its own `cmark-gfm` parser. comrak is
     GFM-*compatible*, not the actual GitHub parser.
   - **Suggestion**: `mdpad uses comrak for parsing — the same engine used by GitLab, with full GitHub Flavored Markdown compatibility.`

### Component Text (UI strings)

1. **AboutModal.tsx**: `Built with Tauri v2 + React + comrak.`
   - **Good**: Clean and accurate.

2. **EmptyState.tsx**: `The terminal for your markdown`
   - **Issue**: "markdown" should be "Markdown" (proper noun, product identity).

3. **ShortcutsModal.tsx**: Shortcut labels are clear and consistent. No issues.

4. **SettingsView.tsx**: Setting labels and hints are well-written:
   - `What to show when the app opens` — clear
   - `Ask before closing unsaved files` — clear
   - `Display LaTeX math expressions (KaTeX)` — clear

5. **StatusBar.tsx**: Hardcoded `12.4 KB` file size — this is mock data, acceptable
   for prototype but should be noted as a thing to fix.

### Meta Description (index.html)

**Current**: `Markdown editor & viewer for CLI, desktop and server`

- **Issue**: Uses `&` instead of `and` — not wrong but looks informal in search results.
- **Issue**: "for CLI, desktop and server" — unclear what "server" means to someone
  unfamiliar with the product. Better: "for your terminal, desktop, and self-hosted server."

### Terminology Consistency

| Term | Used as | Recommendation |
|------|---------|----------------|
| markdown / Markdown | Mixed case throughout | Standardize on "Markdown" (proper noun) |
| GFM | Used consistently | Good |
| comrak | Lowercase consistently | Good (matches crate name) |
| file tree / File tree | Mixed case | Use "file tree" in prose, "File Tree" in UI labels |
| TOC / outline | Used interchangeably | Pick one for UI, one for docs. Current: "Outline" in UI, "TOC" in code — acceptable |

---

## Priority Summary

### Must Fix (blocks all SEO)
1. **TLS certificate** — site is unreachable via HTTPS
2. **Missing `og:image`** — no social preview on any platform

### Should Fix (significant SEO impact)
3. **Meta description too short** — expand to 120-160 chars
4. **Missing Twitter Card tags** — no Twitter/X preview
5. **Missing canonical URL** — potential duplicate content issues
6. **Missing `robots.txt`** — tells crawlers nothing
7. **Missing `<noscript>` content** — SEO fallback for JS-only SPA
8. **Add `_headers` file** — security headers + caching

### Nice to Have (polish)
9. **Structured data (JSON-LD)** — SoftwareApplication schema
10. **Capitalize "Markdown" consistently** — proper noun
11. **Update REFERENCE.md "What's Coming Next"** — outdated items
12. **Fix comrak/GitHub claim** — factual inaccuracy
13. **Expand og:description** — match the improved meta description
14. **Add `og:site_name`** and `og:locale`
