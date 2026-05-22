---
status: planning
created: 2026-03-30
title: E004 — comrak Extension Support: Prototype + Backend Plan
---

# E004 — comrak Extension Support: Prototype + Backend Plan

## What

Evaluate every comrak extension, decide which to support, and implement them in
the React prototype using remark/rehype equivalents. Simultaneously define the
final comrak configuration for the Rust backend. Extend Welcome.md with a full
extension showcase.

## Why

comrak (our chosen Rust parser) supports 20+ extensions beyond GFM. Some are
essential for the AI-developer workflow (footnotes, wiki-links, math, highlight);
others are noise. We need deliberate decisions now — before building the Tauri
backend — so we don't back ourselves into awkward rendering contracts.

The React prototype must mirror the final comrak output: same semantics, same CSS
classes, same visual result. This epic closes the gap.

## Guiding Principles

1. **Target user first**: AI-augmented developers writing specs, plans, and ADRs.
   Every extension must justify itself against that workflow.
2. **comrak is the source of truth**: the React prototype mimics comrak's HTML
   output structure so CSS works unchanged when Tauri ships.
3. **No breaking changes to existing rendering**: E003 established the baseline.
   This epic only adds — never removes.
4. **React prototype = functional demo**: all enabled extensions must render
   visually correct in the browser prototype.

---

## Extension Inventory & Decisions

### Already Handled (not in scope)
| Extension | Status | Where |
|-----------|--------|-------|
| `table` | Done | E001 |
| `strikethrough` | Done | E001 |
| `tasklist` | Done | E001 |
| `autolink` | Done | E001 |
| `tagfilter` | Done | E001 |
| `front_matter_delimiter` | Done | E001 |
| `alerts` | In E003 | T06 |
| Syntax highlighting (Shiki) | In E003 | T04 |
| Mermaid diagrams | In E003 | T05 |

### New Extensions — Priority Decisions

#### MUST implement (core AI-dev workflow)

| Extension | comrak field | Syntax | Rationale |
|-----------|-------------|--------|-----------|
| **Footnotes** | `footnotes` | `[^1]` + `[^1]: text` | Long-form specs and ADRs use footnotes extensively |
| **Header IDs** | `header_ids` | `## Title` → `id="title"` | Enables anchor links, TOC navigation, deep links |
| **Math (dollars)** | `math_dollars` | `$inline$` / `$$block$$` | AI-generated specs increasingly include formulas |
| **Highlight / Mark** | `highlight` | `==text==` | Reviewing/annotating specs and plans |
| **Wiki-links** | `wikilinks_title_before_pipe` | `[[page]]` / `[[label\|page]]` | Navigating `.plan/` / `.arch/` file graphs |
| **Emoji shortcodes** | `shortcodes` | `:rocket:` → 🚀 | Ubiquitous in developer markdown, status docs |

#### SHOULD implement (common, low-effort)

| Extension | comrak field | Syntax | Rationale |
|-----------|-------------|--------|-----------|
| **Superscript** | `superscript` | `^text^` | Math contexts, versioning (`v1^st^`), footnote refs |
| **Subscript** | `subscript` | `~text~` | Chemical formulas, technical notation |
| **Inline footnotes** | `inline_footnotes` | `^[text]` | Cleaner inline asides vs block footnote syntax |
| **Multiline blockquotes** | `multiline_block_quotes` | `>>>` … `>>>` | Long quoted passages in specs/ADRs |
| **Insert** | `insert` | `++text++` | Useful paired with strikethrough for change tracking |

#### COULD implement (niche, non-breaking)

| Extension | comrak field | Syntax | Rationale |
|-----------|-------------|--------|-----------|
| **Description lists** | `description_lists` | `Term\n: Definition` | Glossaries, DDD.md domain model docs |
| **Spoiler** | `spoiler` | `\|\|text\|\|` | Collapsible answers in tutorial/quiz docs |

#### WON'T implement

| Extension | comrak field | Reason |
|-----------|-------------|--------|
| **Greentext** | `greentext` | 4chan-style ">" quotes — actively harmful to markdown semantics |
| **CJK friendly emphasis** | `cjk_friendly_emphasis` | Target users write primarily in English; zero benefit |
| **Subtext** | `subtext` | Undocumented/unstable; use `subscript` instead |
| **Phoenix HEEx** | `phoenix_heex` | Elixir-specific template syntax; completely irrelevant |
| **Math (code)** | `math_code` | Conflicts with syntax highlighting; `math_dollars` covers all cases |
| **Wikilinks (after pipe)** | `wikilinks_title_after_pipe` | Pick one convention; `title_before_pipe` matches Obsidian |

---

## React Prototype: remark/rehype Implementation Map

For each MUST/SHOULD/COULD extension, the equivalent in the React pipeline:

| Extension | React/remark approach | Package |
|-----------|----------------------|---------|
| Header IDs | `rehype-slug` | `rehype-slug` (already needed for TOC) |
| Footnotes | `remark-footnotes` or `remark-gfm` (includes footnotes) | `remark-footnotes` |
| Inline footnotes | Same plugin as footnotes | — |
| Math (dollars) | `remark-math` + `rehype-katex` | `remark-math`, `rehype-katex` |
| Highlight | `rehype-mark` or custom rehype plugin | custom or `rehype-mark` |
| Wiki-links | Custom remark plugin (parse `[[...]]`, resolve to links) | custom |
| Emoji shortcodes | `remark-gemoji` or `remark-emoji` | `remark-gemoji` |
| Superscript | `remark-supersub` or custom | `rehype-accessible-emojis` pattern |
| Subscript | Same plugin as superscript | — |
| Multiline blockquotes | Custom remark plugin | custom |
| Insert | Custom rehype plugin (`++text++` → `<ins>`) | custom |
| Description lists | `remark-definition-list` | `remark-definition-list` |
| Spoiler | Custom rehype plugin (`||text||` → spoiler span) | custom |

### Plugin installation budget
New packages for prototype: `remark-math`, `rehype-katex`, `rehype-slug`,
`remark-footnotes`, `remark-gemoji`. The rest use custom plugins kept under 50 lines.

---

## Out of Scope

| Item | Reason | When |
|------|--------|------|
| Math accessibility (MathML) | KaTeX handles it reasonably | Post-v1 |
| Wiki-link resolution to actual files | Needs Tauri FS access | Backend phase |
| Obsidian-style collapsible callouts (`+`/`-`) | Beyond GFM alerts | Backlog |
| Abbreviations (`*[HTML]: ...`) | Not in comrak | Backlog |
| Custom CSS classes/containers (`:::`) | Not in comrak | Backlog |

---

## Scope — Task Breakdown

### Wave 1 (parallel — independent, foundational)

**T01 — Header IDs + Anchor Links**
- Add `rehype-slug` to remark pipeline
- Every H1–H6 gets an `id` attribute (slug of heading text)
- Hover heading → `#` anchor link appears (right-aligned, muted)
- Click `#` → copies anchor URL to clipboard + toast "Copied!"
- comrak config note: `header_ids: Some(String::new())` (empty prefix)

**T02 — Math Rendering (KaTeX)**
- Install `remark-math` + `rehype-katex` + `katex/dist/katex.min.css`
- Inline math: `$x^2$` → `<span class="math math-inline">...</span>`
- Block math: `$$\n...\n$$` → `<div class="math math-display">...</div>`
- Error: malformed LaTeX → show red error inline (never crash)
- comrak config note: `math_dollars: true`

**T03 — Emoji Shortcodes**
- Install `remark-gemoji` (uses GitHub's gemoji dataset, ~200KB)
- `:rocket:` → 🚀, `:warning:` → ⚠️, `:+1:` → 👍
- Unknown shortcodes pass through as literal text
- comrak config note: `shortcodes: true`

**T04 — Highlight / Mark**
- Custom remark plugin: `==text==` → `<mark>text</mark>`
- CSS: `mark { background: var(--mark-bg); color: var(--mark-fg); border-radius: 2px; }`
- Three theme variants: yellow (light), orange-tinted (sepia), blue-tinted (dark)
- comrak config note: `highlight: true`

### Wave 2 (parallel — depends on Wave 1 infra)

**T05 — Footnotes (block + inline)**
- Install `remark-footnotes` (or use `remark-gfm` v4 which includes footnotes)
- Block: `[^1]` → superscript number link; `[^1]: text` → footer section
- Inline: `^[text]` → same rendering as block footnotes
- Footnote section: `<section class="footnotes">` with `<hr>` separator
- Back-link from footnote to reference marker
- comrak config note: `footnotes: true`, `inline_footnotes: true`

**T06 — Superscript & Subscript**
- Custom remark plugin: `^text^` → `<sup>text</sup>`, `~text~` → `<sub>text</sub>`
- Note: `~text~` conflicts with GFM strikethrough `~~text~~`. comrak resolves by:
  single `~` = subscript, double `~~` = strikethrough. Replicate this in remark.
- comrak config note: `superscript: true`, `subscript: true`

**T07 — Wiki-links**
- Custom remark plugin: parse `[[page]]` and `[[label|page]]`
- In prototype: render as `<a href="#wikilink-page" class="wikilink">page</a>`
- Visual: styled with a distinct link color (purple/violet, Obsidian convention)
- Tooltip on hover: "Wiki-link: page.md (navigation requires Tauri backend)"
- comrak config note: `wikilinks_title_before_pipe: true`

**T08 — Insert + Multiline Blockquotes + Description Lists + Spoiler**
- Insert (`++text++`): custom plugin → `<ins>text</ins>`, styled as underline + green tint
- Multiline blockquotes (`>>>` … `>>>`): custom plugin → standard `<blockquote>`
- Description lists (`Term\n: Def`): `remark-definition-list` → `<dl><dt><dd>`
- Spoiler (`||text||`): custom plugin → `<span class="spoiler">`, blurred by default,
  click/hover to reveal
- comrak config notes: `insert: true`, `multiline_block_quotes: true`,
  `description_lists: true`, `spoiler: true`

### Wave 3 (sequential — Welcome.md showcase)

**T09 — Welcome.md Extension Showcase**
- Add "Markdown Extensions" section to Welcome.md
- One subsection per enabled extension with live example
- Content spec defined in `.plan/vision/2026-03-30-comrak-extensions-spec.md`
- This is a content/documentation task, no code changes

---

## Acceptance Criteria

- [ ] Every H1–H6 gets a stable `id`; hover shows `#` anchor link
- [ ] Math renders via KaTeX for both inline and block syntax
- [ ] Emoji shortcodes convert to Unicode characters
- [ ] `==highlight==` renders as `<mark>` with themed background
- [ ] Footnotes render with superscript numbers and footer section
- [ ] `^sup^` and `~sub~` render as `<sup>` / `<sub>` without breaking `~~strikethrough~~`
- [ ] `[[page]]` wiki-links render as styled anchor with tooltip
- [ ] `++inserted++` renders as `<ins>` with green underline style
- [ ] Multiline blockquotes (`>>>`) render as standard blockquotes
- [ ] Description lists (`Term\n: Def`) render as `<dl>/<dt>/<dd>`
- [ ] `||spoiler||` renders blurred, revealed on click
- [ ] Welcome.md showcases all extensions with live examples
- [ ] `tsc --noEmit` passes, `vite build` succeeds
- [ ] All three themes (dark, light, sepia) render extensions correctly

---

## Test Strategy

### Unit tests
- Custom remark plugins: one test per plugin covering happy path + edge cases
- Superscript/subscript conflict resolution (`~single~` vs `~~double~~`)
- Wiki-link parser: `[[page]]`, `[[label|page]]`, nested brackets, empty

### Integration tests
- Full markdown pipeline: input string → rendered HTML fragment
- KaTeX: valid formula renders, invalid formula shows error (not crash)
- Emoji: known shortcode resolves, unknown passes through as literal

### Visual verification
- Open Welcome.md in prototype, verify each extension renders correctly
- Check all three themes
- Check no regressions to existing GFM rendering

### Coverage target
- Custom plugins: 100% (small, pure functions)
- React components using new features: ≥80%
