# Competitive Research: docsify, grip, glow

**Date**: 2026-03-30
**Purpose**: Feature mapping and UX pattern analysis for mdpad
**Tools researched**: docsify.js, grip (Python), glow (Go/Charmbracelet)

---

## 1. docsify.js

**URL**: https://docsify.js.org
**GitHub**: https://github.com/docsifyjs/docsify
**Category**: Documentation site generator (browser-based, no build step)
**Language**: JavaScript

### What it is

Docsify turns markdown files into a navigable website with zero build step.
Unlike static-site generators (Hugo, Jekyll), it loads and parses markdown
at runtime in the browser. This "no build" philosophy is its core differentiator.

### Key features

| Feature | Details |
|---------|---------|
| **Zero build** | No static HTML generation; loads `.md` files directly at runtime |
| **Sidebar navigation** | Auto-generated from `_sidebar.md` file; supports nested hierarchies |
| **Navbar** | Top navigation from `_navbar.md`; supports dropdown menus |
| **Cover page** | Splash/landing page from `_coverpage.md` |
| **Full-text search** | Plugin-based; indexes content client-side with configurable depth (1-6 heading levels) |
| **Multiple themes** | vue (default), buble, dark, pure; plus community themes |
| **Emoji support** | Native emoji rendering (built-in since v4.13) |
| **Embedded files** | Video, audio, iframes, code blocks, and other markdown files can be embedded |
| **Vue integration** | Vue components can be used directly inside markdown |
| **Server-side rendering** | SSR support for SEO |

### Plugin system

Docsify has a well-designed plugin architecture built around lifecycle hooks:

- `init` -- script initialization (once)
- `mounted` -- DOM mount complete (once)
- `beforeEach` -- before each markdown file is parsed
- `afterEach` -- after each markdown file is rendered
- `doneEach` -- after page render complete
- `ready` -- all plugins loaded

**Official plugins**: full-text search, Google Analytics, emoji, external script loading.

**Community plugins** (via awesome-docsify):
- `docsify-mermaid` -- Mermaid diagram rendering
- `docsify-mermaid-zoom` -- SVG zoom for diagrams
- `docsify-copy-code` -- copy button on code blocks
- `docsify-pagination` -- prev/next navigation
- `docsify-tabs` -- tabbed content sections
- `docsify-sidebar-collapse` -- collapsible sidebar sections
- `docsify-themeable` -- CSS-variable-based theme system

### How it handles key concerns

| Concern | Approach |
|---------|----------|
| **File navigation** | `_sidebar.md` defines the tree; supports nested bullet lists for hierarchy |
| **Search** | Plugin with configurable `maxAge`, `paths`, `placeholder`, `depth` (heading levels) |
| **Themes** | CSS stylesheet swap; `docsify-themeable` adds CSS custom property theming |
| **Dark mode** | Via `docsify-darklight-theme` plugin or CSS `prefers-color-scheme` media query |
| **Configuration** | Single `window.$docsify` object in `index.html`; all options declarative |

### What mdpad can learn

1. **`_sidebar.md` as navigation spec**: The idea that a simple markdown file
   defines the sidebar tree is elegant. mdpad could support a similar convention
   where a `_sidebar.md` or `_nav.md` in any folder overrides auto-generated
   file tree ordering.

2. **Plugin lifecycle hooks**: The `beforeEach`/`afterEach` pattern for
   transforming markdown content is clean and composable. mdpad's Rust
   pipeline could expose similar hooks for user-defined transformations.

3. **Cover page convention**: `_coverpage.md` as a landing/splash page for a
   documentation folder. mdpad could render folder-level cover pages when
   opening a directory.

4. **Embedded content**: docsify embeds other markdown files inline. mdpad
   could support `!include` or transclusion syntax for composing documents.

5. **Search depth configuration**: Letting users choose heading depth (1-6)
   for search indexing is a practical UX detail.

---

## 2. grip

**URL**: https://github.com/joeyespo/grip
**Category**: Local GitHub-style markdown previewer
**Language**: Python

### What it is

Grip is a minimalist command-line tool that renders markdown files using
GitHub's own Markdown API, ensuring pixel-perfect GitHub rendering. It
serves files on a local HTTP server with live reload.

### Key features

| Feature | Details |
|---------|---------|
| **GitHub-exact rendering** | Uses GitHub's Markdown API for identical output |
| **Live reload** | File changes reflected in browser without manual refresh |
| **HTML export** | `grip --export` generates standalone HTML files |
| **Offline mode** | `render_offline` flag uses Python-Markdown (WIP, not full parity) |
| **Dark/light themes** | Matches GitHub's light and dark mode |
| **Wide rendering** | `render_wide` option for full-width content |
| **Inline styles** | `render_inline` embeds CSS directly in exported HTML |
| **CLI simplicity** | `grip README.md` -- one command to preview |
| **Auto-open browser** | `-b` flag opens browser tab automatically |

### How it handles key concerns

| Concern | Approach |
|---------|----------|
| **File navigation** | None -- single file viewer only; no tree, no multi-file |
| **Search** | None -- browser's Ctrl+F only |
| **Themes** | Light/dark matching GitHub's own themes |
| **Configuration** | Python config file (`~/.grip/settings.py`); env vars for API credentials |

### Limitations

- **API rate limiting**: GitHub API has hourly rate limits; requires auth for heavy use
- **No file tree**: Single-file only; no folder browsing
- **No plugin system**: No extensibility beyond the Python API
- **Offline rendering**: Still WIP; not feature-complete
- **No GFM extensions**: Relies entirely on GitHub's API for rendering fidelity

### What mdpad can learn

1. **"Looks exactly like GitHub" as a feature**: Many developers want their
   markdown to look the same locally as on GitHub. mdpad could offer a
   "GitHub mode" theme that closely matches GitHub's CSS.

2. **Zero-config CLI launch**: `grip README.md` is the gold standard for
   simplicity. mdpad's CLI should be equally simple: `mdpad .` or `mdpad README.md`.

3. **Live reload without refresh**: Grip's instant update on file save (no
   page refresh needed) is a key UX feature mdpad must match via Tauri's
   file watcher.

4. **Export to HTML**: Standalone HTML export is useful for sharing rendered
   documents with non-technical stakeholders.

5. **Wide mode toggle**: A simple toggle for wide vs. constrained content
   width is a practical feature for reading vs. presenting.

---

## 3. glow

**URL**: https://github.com/charmbracelet/glow
**Category**: Terminal markdown viewer with TUI file browser
**Language**: Go (uses Glamour rendering engine)

### What it is

Glow is a terminal-based markdown reader with two modes: a CLI renderer
(pipe/file input) and a TUI file browser for discovering and reading
markdown in a directory tree. Built by Charmbracelet using their
Bubble Tea TUI framework and Glamour stylesheet engine.

### Key features

| Feature | Details |
|---------|---------|
| **TUI file browser** | Launch `glow` without args to browse markdown files in current dir |
| **CLI rendering** | `glow file.md` renders directly to terminal output |
| **Multiple input sources** | Local files, stdin, HTTP URLs, GitHub/GitLab repos |
| **Glamour styles** | Stylesheet-based rendering with named themes (dark, light, dracula, tokyo-night, ascii, pink, notty) |
| **Auto theme detection** | Detects terminal background color; picks dark/light automatically |
| **Custom stylesheets** | JSON-based style definitions; `GLAMOUR_STYLE` env var |
| **Word wrap** | Configurable wrap width (default 80) |
| **Line numbers** | Optional line numbers in TUI mode |
| **Mouse support** | Mouse wheel scrolling in TUI |
| **Pager navigation** | Search, jump-to-line, link following in TUI pager (2026 additions) |
| **Git-aware** | In a git repo, searches the entire repo for markdown files |

### Glamour style system

Glamour is the rendering engine behind glow. It uses JSON-based stylesheets
that control every element's appearance:

```
Default styles: ascii, auto, dark, dracula, tokyo-night, light, notty, pink
Custom: set GLAMOUR_STYLE env var to a JSON file path
```

Each style defines colors, margins, padding, and formatting for every
markdown element (headings, code blocks, links, lists, blockquotes, etc.).
This is essentially a CSS-like system for terminal rendering.

### How it handles key concerns

| Concern | Approach |
|---------|----------|
| **File navigation** | TUI mode: flat list of all `.md` files in directory tree with filter |
| **Search** | Filter bar in TUI browser; text search in pager mode (2026) |
| **Themes** | Named themes via Glamour; auto-detection; custom JSON stylesheets |
| **Configuration** | `GLAMOUR_STYLE` env var; CLI flags (`-s`, `-w`, `-l`) |

### Former stash feature (removed)

Glow previously had an encrypted cloud stash for saving markdown documents
with end-to-end encryption. This feature was removed in recent versions.
The concept of bookmarking/stashing documents for quick access remains
interesting for mdpad.

### What mdpad can learn

1. **Auto theme detection**: Glow detects terminal background color and
   picks an appropriate theme. mdpad should detect system dark/light
   mode preference and apply the matching theme on first launch.

2. **Named theme presets**: Glow's approach of named themes (dracula,
   tokyo-night, etc.) is developer-friendly. mdpad should ship with
   popular editor themes as presets.

3. **Git-aware file discovery**: When inside a git repo, glow searches
   the entire repo for markdown. mdpad should also understand git
   boundaries and offer "show all markdown in this repo" as a view.

4. **Multiple input sources**: Accepting URLs and GitHub/GitLab repo
   paths as input is valuable. mdpad could open remote markdown via URL.

5. **JSON-based style system**: Glamour's approach of defining element
   styles via JSON is clean and user-extensible. mdpad's theme system
   could adopt a similar token-based approach for customization.

6. **Pager-style navigation**: Search within document, jump-to-line, and
   link following are features glow added in 2026. All are relevant for
   mdpad's preview mode.

7. **Flat file list with filter**: Glow's TUI shows all markdown files
   in a flat, filterable list. This is a useful alternative view to
   a hierarchical tree -- mdpad could offer both tree and flat list views.

---

## Comparison table

| Feature | docsify | grip | glow | mdpad (current) | mdpad (opportunity) |
|---------|---------|------|------|-----------------|---------------------|
| **Platform** | Browser | Browser (local server) | Terminal | Desktop (Tauri) | -- |
| **File tree** | Sidebar via `_sidebar.md` | None | Flat list + filter | Hierarchical tree | Add flat list view |
| **Search** | Full-text plugin | Browser Ctrl+F | Filter bar + pager search | Quick Open (Ctrl+P) | Add full-text content search |
| **Themes** | 4 built-in + CSS vars | Light/dark (GitHub) | 7 named + custom JSON | Dark/light/sepia | Add named presets (dracula, etc.) |
| **Dark mode** | Plugin / media query | GitHub-style | Auto-detect terminal bg | Manual toggle | Auto-detect OS preference |
| **Mermaid** | Community plugin | No | No | Built-in | -- |
| **Syntax highlight** | Prism.js plugin | GitHub API | Terminal ANSI colors | Shiki (17 langs) | -- |
| **GFM support** | Partial | Full (GitHub API) | Via goldmark | Full (comrak) | -- |
| **GitHub Alerts** | No | Via GitHub API | No | Built-in | -- |
| **Frontmatter** | No | No | No | Styled property table | -- |
| **Live reload** | Runtime loading | File watch + auto-refresh | No | Not yet | File watcher (Tauri) |
| **Export** | No (runtime only) | HTML export | No | Not yet | HTML/PDF export |
| **Plugin system** | 6 lifecycle hooks | None | None (Glamour is separate) | Not yet | Rust plugin hooks |
| **CLI launch** | `docsify serve` | `grip file.md` | `glow file.md` | Not yet | `mdpad .` / `mdpad file.md` |
| **Embedded content** | MD, video, audio, iframe | No | No | No | Transclusion / `!include` |
| **Cover page** | `_coverpage.md` convention | No | No | No | Folder cover pages |
| **Configuration** | JS object in HTML | Python config file | Env vars + CLI flags | Not yet | YAML/TOML config file |
| **Offline** | Yes (all client-side) | WIP | Yes | Yes (Tauri native) | -- |
| **Wide mode** | No | `render_wide` flag | Word wrap config | No | Content width toggle |

---

## Recommendations for mdpad

### High priority (core UX gaps these tools expose)

1. **Auto-detect OS dark/light mode** (from glow)
   mdpad should read the system theme preference on launch and apply the
   matching theme. Tauri provides `window.matchMedia('(prefers-color-scheme: dark)')`.
   Currently mdpad requires manual toggle.

2. **Full-text content search** (from docsify)
   Quick Open (Ctrl+P) searches filenames only. Add Ctrl+Shift+F for
   full-text search across all markdown files in the workspace, with
   configurable heading depth indexing.

3. **Zero-config CLI launch** (from grip)
   `mdpad .` to open current directory, `mdpad README.md` to open a single
   file. This is table-stakes for developer tools. Tauri's CLI plugin
   supports this.

4. **File watcher with live reload** (from grip)
   When a file changes on disk, update the preview without user action.
   Tauri's `notify` crate handles filesystem events. This is critical
   for the "edit in VS Code, preview in mdpad" workflow.

### Medium priority (competitive differentiation)

5. **Named theme presets** (from glow)
   Ship with 5-7 popular themes: github-light, github-dark, dracula,
   tokyo-night, solarized-dark, one-dark, nord. Users expect this from
   any modern developer tool.

6. **Flat file list view** (from glow)
   Add an alternative sidebar view that shows all markdown files in a flat,
   filterable list instead of the tree hierarchy. Useful for large repos
   where you know the filename but not the path.

7. **Content width toggle** (from grip)
   A simple toggle between constrained (prose-width, ~720px) and wide
   (full-width) content rendering. Useful for tables and diagrams.

8. **HTML export** (from grip)
   Export rendered markdown as standalone HTML with inlined styles.
   Useful for sharing with non-technical stakeholders.

### Low priority (future differentiators)

9. **Folder cover pages** (from docsify)
   When opening a directory that contains a `_coverpage.md` or `README.md`,
   show it as the folder's landing page in the content area.

10. **Transclusion / embedded markdown** (from docsify)
    Support `!include(path/to/file.md)` syntax to compose documents from
    fragments. Valuable for documentation projects with shared sections.

11. **Plugin lifecycle hooks** (from docsify)
    When building comrak extensions (E004), design the pipeline with
    `before_parse` / `after_render` hooks so users can add custom
    transformations.

12. **Git-aware file discovery** (from glow)
    Detect git repository boundaries and offer a "show all markdown in
    this repo" mode, even when launched from a subdirectory.

### Anti-patterns to avoid

- **grip's API dependency**: Never depend on an external API for rendering.
  mdpad's comrak-based local rendering is the right choice.

- **docsify's runtime-only approach**: No build step is elegant for docs
  sites but fragile for a desktop app. mdpad should pre-render for speed.

- **glow's removed stash feature**: Cloud features add complexity and
  maintenance burden. Keep mdpad focused on local-first functionality.

---

## Sources

- [docsify.js official site](https://docsify.js.org/)
- [docsify GitHub repository](https://github.com/docsifyjs/docsify)
- [docsify plugins documentation](https://github.com/docsifyjs/docsify/blob/develop/docs/plugins.md)
- [docsify configuration](https://github.com/docsifyjs/docsify/blob/develop/docs/configuration.md)
- [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable/)
- [awesome-docsify plugin list](https://github.com/docsifyjs/awesome-docsify)
- [docsify-darklight-theme](https://github.com/boopathikumar018/docsify-darklight-theme)
- [grip GitHub repository](https://github.com/joeyespo/grip)
- [grip manpage](https://manpages.ubuntu.com/manpages/focal/man1/grip.1.html)
- [glow GitHub repository](https://github.com/charmbracelet/glow)
- [glamour stylesheet engine](https://github.com/charmbracelet/glamour)
- [glamour styles gallery](https://github.com/charmbracelet/glamour/blob/master/styles/gallery/README.md)
- [charmbracelet/glow DeepWiki](https://deepwiki.com/charmbracelet/glow)
