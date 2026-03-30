# Feature Research — Markdown Rendering & Editor Capabilities

**Date**: 2026-03-30
**Linked from**: [Backlog](../BACKLOG.md)

Research covering: simple editor markdown plugins, full GFM spec, markdown
extensions beyond GFM, Obsidian/Notion/Typora patterns, and code highlighting
state of the art. Priority tags: **[MUST]** / **[NICE]** / **[LATER]**

---

## 1. Simple Editors — Markdown-Specific Features

### Notepad++ (via plugins)
- **NppMarkdownPanel** — live preview pane inside the editor window (WebView-based)
- **MarkdownViewerPlusPlus** — rendered preview in side pane, clicks open in browser
- Both support basic GFM; no TOC, no outline, no math
- No folding of markdown sections (folding is based on indentation/braces only)
- Syntax highlighting via custom language file (bold, italic, heading colors)

### Sublime Text (via packages)
- **MarkdownEditing** — improved syntax highlighting, correct ruler/wrap settings,
  auto-pair `**`, `_`, backtick, bracket matching for links
- **MarkdownPreview** — renders to browser tab (GitHub API or local Python parser);
  supports GFM, math (MathJax), Mermaid via extensions
- **MarkdownTOC** — auto-generates and maintains `<!-- MarkdownTOC -->` block in file
- **Minimap** — file minimap available in all modes (not markdown-specific)
- **Multiple cursors** — core Sublime feature, invaluable for editing markdown tables
- **Column selection** (`Shift+right-click drag`) — useful for table column editing
- No built-in folding of markdown sections; only indentation-based folding

### Kate (KDE editor)
- Syntax highlighting for markdown (headings, emphasis, code, links in different colors)
- Code folding for fenced code blocks
- Outline view via "Symbols" panel — lists headings with click-to-jump
- Preview panel (Kate 20.12+) — rendered HTML side-by-side using KSyntaxHighlighting
- Spell checking inline with squiggly underlines
- Vi input mode (modal editing built-in)
- Word count in status bar

### gedit (GNOME)
- Markdown plugin via `gedit-plugins` — preview in embedded WebView
- Spell checking
- Minimap plugin
- Line numbers, word wrap toggle
- No outline/TOC

### VS Code (reference — full markdown mode)
- Split pane preview (`Ctrl+K V`) synchronized bidirectionally
- Outline panel with full heading hierarchy + click to jump
- Double-click preview element to jump to source location
- Math rendering via KaTeX (`$` inline, `$$` block)
- Broken-link highlighting with diagnostics
- Rename header → updates all `[text](#heading)` links workspace-wide
- Smart selection expanding across blocks (heading, list, quote, code)
- Path completions in links (`/`), heading completions (`#`)
- Custom CSS for preview via settings
- Folding markdown sections by heading level

### Key takeaways from simple editors
- Outline/TOC with click-to-jump is the single most-requested feature after preview
- Folding by heading (not just by indent) is a VS Code-level feature absent in simple editors
- Multiple cursors and column selection are table editing lifesavers
- Spell check is expected even in read-focused tools

---

## 2. Full GFM Spec — What GitHub Supports

### CommonMark baseline (GFM extends these)
- ATX headings (`#` ... `######`)
- Setext headings (underline with `===` or `---`)
- Paragraphs, hard line breaks (two trailing spaces or `\`)
- Emphasis `*italic*`, strong `**bold**`, `***bold italic***`
- Inline code `` `code` ``, fenced code blocks (` ``` ` or `~~~`)
- Blockquotes (`>`)
- Lists: unordered (`-`, `*`, `+`), ordered (`1.`)
- Thematic breaks (`---`, `***`, `___`)
- Links `[text](url "title")`, reference links `[text][ref]`
- Images `![alt](src "title")`
- HTML inline and blocks (pass-through)
- Autolinks `<https://url>` (angle-bracket form only in CommonMark)
- Backslash escapes

### GFM extensions (GitHub-specific additions)
| Feature | Syntax | Notes |
|---------|--------|-------|
| Tables | `\| col \| col \|` with `\|---\|---\|` separator | Alignment via `:---:` |
| Strikethrough | `~~text~~` | Single `~` not supported |
| Task lists | `- [x] done` / `- [ ] todo` | Clickable on GitHub |
| Autolinks (extended) | bare URLs without angle brackets | `https://` auto-linked |
| Tag filter | Sanitizes `<script>`, `<style>` etc | Security feature |

### GitHub-specific (not in formal GFM spec, rendered on github.com)
| Feature | Syntax | Status |
|---------|--------|--------|
| **Alerts** | `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` | Stable 2024 |
| **Math (inline)** | `$x = y^2$` | Renders via MathJax on github.com |
| **Math (block)** | `$$\n...\n$$` | Full LaTeX block display |
| **Mermaid diagrams** | ` ```mermaid ` fenced block | Mermaid v10 on github.com |
| **Footnotes** | `[^1]` inline, `[^1]: text` definition | Rendered on github.com |
| **Collapsed sections** | `<details><summary>...</summary>` HTML | Standard HTML, widely supported |
| **Color previews** | hex, rgb(), hsl() in backticks | Colored swatches in comments |
| **Mention links** | `@username`, `#issue` | GitHub-specific; not relevant for us |

### What GFM does NOT include (common misconceptions)
- Definition lists
- Abbreviations (`*[abbr]: expansion`)
- Superscript / subscript
- Underline
- Spoiler/hidden text
- Custom containers / admonitions (beyond alerts)
- Wiki-links `[[page]]`
- Emoji shortcodes (`:rocket:`) — GitHub processes them server-side post-render

---

## 3. comrak Extension Inventory

comrak (our chosen Rust parser) supports the following extensions beyond GFM.
All can be toggled independently:

### GFM extensions (included by default in GFM mode)
`strikethrough`, `tagfilter`, `table`, `autolink`, `tasklist`

### Extra extensions available in comrak
| Extension | Syntax | Notes |
|-----------|--------|-------|
| `superscript` | `^text^` | x^2^ |
| `subscript` | `~text~` | H~2~O |
| `footnotes` | `[^1]` / `[^1]: text` | Block footnotes (kramdown style) |
| `inline_footnotes` | `^[text]` | Inline footnote syntax |
| `description_lists` | `: term\n  definition` | Definition list (DL/DT/DD) |
| `front_matter_delimiter` | `---` block at top | YAML/TOML frontmatter fence |
| `alerts` | `> [!NOTE]` | GitHub-style 5-type alerts |
| `math_dollars` | `$inline$` / `$$block$$` | Math via dollar delimiters |
| `math_code` | `` `math `math` `` | Math via code span with `math` lang |
| `shortcodes` | `:emoji_name:` | Emoji shortcodes |
| `wikilinks_title_before_pipe` | `[[label\|url]]` | Wiki-link syntax variant 1 |
| `wikilinks_title_after_pipe` | `[[url\|label]]` | Wiki-link syntax variant 2 |
| `underline` | `__text__` | Underline (overrides italic behavior) |
| `spoiler` | `\|\|text\|\|` | Hidden/spoiler text (Discord style) |
| `greentext` | Lines starting with `>` | 4chan-style green text |
| `multiline_block_quotes` | `>>>` ... `>>>` | Block quote spanning multiple paragraphs |
| `highlight` | `==text==` | Highlighted/marked text |
| `subtext` | (TBD) | Similar to subscript |
| `cjk_friendly_emphasis` | CJK character awareness | Fixes emphasis in Chinese/Japanese/Korean |

**Implication**: comrak already supports all the extensions we could want. The
question is which to enable in zntl-md. No custom parser work needed.

---

## 4. Diagram & Visual Extensions

### Mermaid (de facto standard for devs)
Supported diagram types in Mermaid 11 (2025):
- Flowchart / Graph
- Sequence diagram
- Class diagram
- State diagram
- Entity Relationship (ER)
- Gantt chart
- Pie chart
- Quadrant chart
- Journey (user journey)
- GitGraph
- Mindmap
- Timeline
- Block diagram
- Architecture diagram (beta)
- Packet diagram

### Other diagram formats (GLFM / Kroki)
| Format | Use case | Priority |
|--------|----------|----------|
| PlantUML | UML class, sequence, component | **[NICE]** |
| D2 | Modern infrastructure diagrams | **[NICE]** |
| Graphviz/DOT | Dependency graphs | **[LATER]** |
| draw.io XML | Embedded diagrams | **[LATER]** |

For zntl-md: Mermaid is **[MUST]**, others are **[LATER]**.

---

## 5. Markdown Extensions Beyond GFM — Developer Focus

### Admonitions / Callouts / Alerts
Three competing syntaxes, all popular:

| Syntax | Origin | Example |
|--------|--------|---------|
| GitHub Alerts | GitHub (2024) | `> [!NOTE]` |
| Obsidian Callouts | Obsidian | `> [!warning] Title` (collapsible: `> [!warning]+`) |
| Python/MkDocs Admonitions | Material MkDocs | `!!! note "Title"` |
| RST-style directives | Sphinx, MyST | `:::{note}` |

The **GitHub Alert** syntax is becoming the community standard. comrak supports it.
Obsidian adds collapsible callouts (`+` suffix = expanded, `-` = collapsed) — useful.

### Wiki-links `[[page]]`
- Obsidian: `[[pagename]]`, `[[pagename|display text]]`, `[[page#heading]]`, `[[page^block]]`
- Used heavily in `.plan/` and `.arch/` markdown directories
- comrak supports both `wikilinks_title_before_pipe` and `wikilinks_title_after_pipe`
- For zntl-md: resolving wiki-links to actual files in the open folder is a killer feature
  for AI-augmented developers navigating `.plan/` structures **[NICE]**

### Footnotes
- Block footnotes: `[^1]` inline, `[^1]: content` at bottom
- Inline footnotes: `^[content right here]`
- Renders as superscript numbers linking to footer section
- Common in academic and long-form developer docs **[NICE]**

### Definition Lists
```
Term
: Definition text here
: Second definition
```
Rarely used in practice but supported by many parsers **[LATER]**

### Abbreviations
```markdown
*[HTML]: Hyper Text Markup Language
```
HTML auto-gets `<abbr>` tags throughout document. Useful for technical docs **[LATER]**

### Math / LaTeX
- `$inline math$` and `$$block math$$` syntax (pandoc convention)
- Dollar collision issue: `$20,000` — parsers must require non-space after `$`
- KaTeX renders faster than MathJax; MathJax has better accessibility
- GitHub uses MathJax; Obsidian uses MathJax; most others use KaTeX
- comrak's `math_dollars` + `math_code` extensions cover both syntaxes **[MUST]** (KaTeX)

### Emoji Shortcodes `:name:`
- `:rocket:` → 🚀, `:warning:` → ⚠️
- comrak `shortcodes` extension handles this
- Needs emoji map (gemoji or similar) **[NICE]**

### Superscript / Subscript
- `^superscript^` and `~subscript~`
- Used in math contexts, chemical formulas, academic writing
- comrak supports both **[NICE]** (enable by default — harmless)

### Highlight / Mark
- `==highlighted text==` → `<mark>highlighted text</mark>`
- Obsidian uses this; MkDocs Material supports it
- Useful for reviewing specs and plans **[NICE]**

### Spoiler / Hidden Text
- `||spoiler text||` (Discord style)
- `> [!NOTE]` collapsed (Obsidian: `> [!note]-`)
- Less relevant for a viewer, but trivial to enable **[LATER]**

### Collapsible Sections
HTML `<details><summary>` — supported via HTML passthrough in CommonMark.
No special extension needed; just render HTML blocks. **[MUST]** (already works)

### Custom CSS Classes / Containers
- `:::note` ... `:::` (Vuepress, Docusaurus style)
- Not in comrak by default; would need custom preprocessing
- **[LATER]**

---

## 6. Obsidian / Notion / Typora — Patterns Worth Stealing

### From Typora
- **Seamless WYSIWYG** — hashes visible on hover/focus only; hidden on blur
  Status: planned in zntl-md as "Live Preview Mode" **[NICE]**
- **Source Code Mode** toggle `Ctrl+/` — instant raw markdown view
  Status: planned **[MUST]**
- **Focus Mode** — non-focused blocks faded to 40% opacity
  Status: planned **[NICE]**
- **Typewriter Mode** — cursor stays vertically centered
  Status: planned **[NICE]**
- **YAML frontmatter as styled table** — renders frontmatter as key-value card, not raw text
  Brilliant UX for AI-dev workflow where frontmatter carries status/metadata **[MUST]**
- **Context menus for tables** — right-click to add/delete row/column/align
  Status: **[NICE]** (editor mode)
- **Export to PDF** with CSS-based layout control

### From Obsidian
- **Three modes**: Source, Live Preview, Reading — clear mental model **[MUST]**
- **Properties panel** — visual YAML editor, not raw text; shows type-aware fields
  (date pickers for dates, toggle for booleans, tag editor for arrays) **[LATER]**
- **Collapsible callouts** — `> [!note]+` (expanded) / `> [!note]-` (collapsed)
  Useful for long spec documents **[NICE]**
- **Graph view** — visual map of all linked files; shows orphan files, clusters
  Interesting for `.plan/` / `.arch/` navigation but complex to build **[LATER]**
- **Backlinks panel** — "which files link to this file?" sidebar widget
  Extremely useful for `.plan/` structures **[NICE]**
- **Command Palette** (`Ctrl+K`) — fuzzy search across all commands
  Status: planned (Inkwell has this) **[MUST]**
- **Reading time estimate** — shows "5 min read" in status bar **[NICE]**
- **Tabs + split panes** — multiple files open simultaneously **[MUST]**
- **Drag-and-drop file reordering** in file tree
- **File reveal** — "Reveal in system explorer" from context menu **[MUST]**

### From Notion
- **Slash commands** `/` — quick block insertion menu (heading, list, code, table, etc.)
  Excellent for editing mode; reduces need for remembering syntax **[NICE]** (editor phase)
- **Drag-and-drop blocks** — reorder paragraphs by dragging left handle
  Complex to implement cleanly; **[LATER]**
- **Inline mentions** — `@filename` opens that file or creates link **[LATER]**
- **Breadcrumb navigation** — shows path: `Root > .plan > epics > E001 > PLAN.md` **[NICE]**
- **Embed blocks** — paste URL → becomes live embed (video, tweet, etc.) **[LATER]**
- **Database views** — table/kanban/calendar of structured data; requires frontmatter parsing
  Dataview-style queries would be powerful for AI-dev workflow **[LATER]**

### From Logseq / Roam
- **Block references** `((block-uuid))` — reference a specific paragraph from another file
  Extremely powerful but complex; creates tight coupling between files **[LATER]**
- **Daily notes** — auto-creates a dated markdown file for journaling
  Could be a `.plan/JOURNAL.md` accelerator **[LATER]**

### From Zettlr
- **Bibliography / citations** — BibTeX / CSL JSON integration
  Academic use case; not for AI-dev workflow **[SKIP]**
- **LanguageTool grammar check** — inline grammar/style suggestions
  Useful for writing docs and specs **[LATER]**
- **Snippet system** — named text snippets with cursor-position placeholders
  Useful for repetitive markdown structures (task file templates etc.) **[NICE]**

---

## 7. Code Syntax Highlighting — State of the Art

### Library Comparison

| Library | Engine | Languages | Performance | Bundle |
|---------|--------|-----------|-------------|--------|
| **Shiki** | TextMate grammar (VS Code engine) | 200+ | Slower startup, accurate | ~350KB+ |
| **Prism.js** | Custom grammar | 300+ | Fast, modular | ~30KB base |
| **highlight.js** | Custom grammar | 190+ | Fast, auto-detect | ~100KB |
| **starry-night** | TextMate grammar (GitHub engine) | 600+ | Medium | Large |

**Recommendation for zntl-md**: Shiki is the clear winner for a developer tool:
- Same engine as VS Code — developers trust the output
- TextMate grammars = same highlighting they see in their IDE
- Supports all VS Code themes out of the box
- Active development; Astro, Next.js, VitePress all use it in 2025

### Advanced Code Block Features

**Line highlighting** `{1,3-5}` in meta string:
```
```rust {1,3-5}
```
Highlights specific lines. comrak passes meta strings through; Shiki can consume them.

**Diff notation** (Shiki `transformerNotationDiff`):
```
```ts
const a = 1  // [!code --]
const b = 2  // [!code ++]
```
Shows red/green diff lines within a code block. Excellent for ADRs and changelogs.

**Word highlighting** (Shiki `transformerNotationHighlight`):
- `// [!code highlight]` on a specific line
- Or inline: `word` gets wrapped in `<mark>`

**Line numbers** — Shiki transformer adds `data-line` attributes; styled with CSS counters.
Standard user expectation for code-heavy docs.

**Copy button** — floating button per code block. Inkwell already does this.
Absolute must-have for developer audience. **[MUST]**

**Collapsed code** — long blocks fold with "show more" toggle. **[NICE]**

**File name / language badge** — metadata shown above code block:
```
```typescript filename="src/main.ts"
```
Display as `[ TypeScript ] [ src/main.ts ] [ Copy ]` header bar. **[NICE]**

**Language auto-detection** — when no language specified, use:
- `@vscode/vscode-languagedetection` (Microsoft ML model, same as VS Code)
- Or heuristic-based fallback (highlight.js has `highlightAuto`)

**Twoslash (TypeScript types in code blocks)** — hover shows inferred types.
Complex to implement; more for a documentation site than a viewer. **[LATER]**

### Language Coverage Targets
For a developer-focused viewer, priority languages:
- Tier 1 (**[MUST]**): `bash`/`shell`, `javascript`, `typescript`, `python`, `rust`,
  `go`, `json`, `yaml`, `toml`, `sql`, `html`, `css`, `markdown`, `dockerfile`
- Tier 2 (**[NICE]**): `java`, `c`, `cpp`, `csharp`, `ruby`, `php`, `swift`,
  `kotlin`, `r`, `scala`, `haskell`, `lua`, `vim`, `nginx`, `http`, `graphql`
- Tier 3 (**[LATER]**): 100+ more via Shiki's full grammar set (lazy-loaded)

---

## 8. Navigation & UX Patterns

### Document Navigation
- **Heading anchors** — every `H1`–`H6` gets an anchor `id`; hover shows `#` link **[MUST]**
- **TOC sidebar** — hierarchical heading tree, sticky while scrolling **[MUST]**
- **Breadcrumb** — `Folder > Subfolder > file.md` above document **[NICE]**
- **Back/forward navigation** — browser-like history within the session **[NICE]**
- **Jump to heading** via `Ctrl+G` or Command Palette **[NICE]**
- **Section folding** — collapse sections by clicking heading arrows **[NICE]**

### File Tree Features
- **Git status indicators** — colored dots/icons showing modified, new, untracked files
  Inkwell lacks this; huge differentiator for AI-dev workflow **[NICE]**
- **File type badges** — `.md` (default), `.yaml`, `.json` etc. with distinct icons **[NICE]**
- **Recent files list** — last N files opened, quick access **[NICE]**
- **Pinned files** — star/pin files to top of tree **[LATER]**
- **Collapse all / expand all** tree actions **[NICE]**

### Reading Experience
- **Reading time** — "~5 min read" in status bar **[NICE]**
- **Word count / char count** — live in status bar **[MUST]** (already planned)
- **Scroll position memory** — restores scroll position when reopening file **[NICE]**
- **Print-friendly styles** — `@media print` CSS for clean output **[NICE]**
- **Zoom** — `Ctrl+=` / `Ctrl+-` for font size adjustment **[MUST]**

---

## 9. Editor-Side Features (future edit mode)

### Text Editing Intelligence
- **Auto-pair** — `**`, `*`, `` ` ``, `[`, `(`, `"` close automatically **[MUST]** (editor phase)
- **List continuation** — Enter in list creates new `- ` or `1. ` item **[MUST]**
- **Table formatting** — auto-align pipe table columns on save **[NICE]**
- **Table editing** — Tab moves between cells; Enter adds row at end **[NICE]**
- **Smart paste** — paste URL on selected text → creates `[text](url)` link **[NICE]**
- **Image paste** — paste clipboard image → saved to `assets/` and linked **[NICE]**

### Writing Modes (already in UX vision)
- **Focus Mode** — fade non-focused paragraph **[NICE]**
- **Typewriter Mode** — cursor at vertical center **[NICE]**
- **Zen Mode** — hide all chrome **[NICE]**

### Quality Tools
- **Spell check** — inline squiggly underlines (browser spell check or custom) **[NICE]**
- **Link validation** — dead links highlighted in preview **[NICE]**
- **Frontmatter validation** — warn on malformed YAML **[NICE]**

---

## 10. Priority Summary

### Must-Have (v1.0)
- Full GFM rendering: tables, strikethrough, task lists, autolinks
- GitHub Alerts: `> [!NOTE/TIP/IMPORTANT/WARNING/CAUTION]`
- Math: `$inline$` and `$$block$$` via KaTeX
- Mermaid diagrams (v10+)
- Syntax highlighting via Shiki (Tier 1 languages)
- Copy button on every code block
- Heading anchors with hover-reveal `#` link
- Collapsible `<details>` blocks (HTML passthrough)
- YAML frontmatter rendered as key-value card (not raw)
- TOC sidebar with click-to-jump
- Three modes: Source / Live Preview / Reading

### Nice-to-Have (v1.x)
- Emoji shortcodes `:name:` → Unicode
- Superscript `^x^` and subscript `~x~`
- Highlight `==text==`
- Footnotes `[^1]`
- Obsidian-style collapsible callouts (`+`/`-` suffix)
- Wiki-links `[[page]]` resolved to actual files in open folder
- Section folding in preview by heading level
- Shiki: line highlighting, diff notation, file name badge, line numbers
- Backlinks panel ("linked from")
- Reading time estimate
- Breadcrumb navigation
- Git status indicators in file tree
- Scroll position memory per file

### Later / Post-v1
- Definition lists, abbreviations
- Graph view
- Properties panel (visual YAML editor)
- Dataview-style frontmatter queries
- PlantUML, D2, Graphviz diagram support
- Block references `((uuid))`
- Daily notes
- Drag-and-drop blocks
- Twoslash TypeScript annotations
- LanguageTool grammar check
- Snippet / template system

### Skip (out of scope for this tool)
- Bibliography / citations (academic — not the target user)
- Cloud sync / accounts
- Real-time collaboration
- Plugin marketplace (keep simple)
- Kanban / database views (that's Notion/Obsidian territory)
- Block-based outliner format (Logseq/Roam — opinionated format)

---

## Sources
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [GitHub Basic Writing and Formatting Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [comrak ExtensionOptions — docs.rs](https://docs.rs/comrak/latest/comrak/options/struct.Extension.html)
- [Shiki — Introduction](https://shiki.style/guide/)
- [GitLab Flavored Markdown Docs](https://docs.gitlab.com/user/markdown/)
- [Obsidian Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts)
- [NppMarkdownPanel](https://github.com/mohzy83/NppMarkdownPanel)
- [Sublime Text MarkdownPreview](https://github.com/facelessuser/MarkdownPreview)
- [Expressive Code — Syntax Highlighting](https://expressive-code.com/key-features/syntax-highlighting/)
- [KaTeX](https://katex.org/)
- [GitHub Alerts Discussion](https://github.com/orgs/community/discussions/16925)
- [The Ultimate Markdown Guide 2026](https://agmazon.com/blog/articles/technology/202603/markdown-complete-guide-en.html)
