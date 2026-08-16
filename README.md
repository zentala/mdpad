# mdpad

[![CI](https://github.com/zentala/mdpad/actions/workflows/ci.yml/badge.svg)](https://github.com/zentala/mdpad/actions/workflows/ci.yml)

> **[Live Demo → mdpad.labs.zentala.agency](https://mdpad.labs.zentala.agency)**

Markdown editor & viewer for CLI, desktop and server. **In-browser demo of a working editor.**

## Status: Work In Progress

The web demo now runs a **functional editor** (E010): edit markdown visually
(Milkdown WYSIWYG) or as raw source (CodeMirror), find & replace, insert links/images/
tables, export HTML/PDF, and undo/redo. Changes live **in the browser only** — there is
no disk persistence, CLI, or desktop app yet.

What you see at [mdpad.labs.zentala.agency](https://mdpad.labs.zentala.agency) is a
**static React demo** on mock content. It demonstrates the real editor and UI, but does
not save to or open from your file system.

### What works
- **Visual editing** — Milkdown WYSIWYG in write mode
- **Code editing** — CodeMirror 6 raw-markdown mode
- **Find & Replace** — in-file search and replace
- **Insert** — link, image, and table popovers
- **Export** — HTML and PDF (browser print)
- **Undo / Redo** — full editor history
- **Formatting toolbar** — Bold, Italic, Headings, Lists, quotes, code
- Browsing mock files, tabs, themes, modes (Visual/Code/Preview)
- Markdown preview: GFM, Shiki syntax highlighting, Mermaid diagrams, KaTeX math
- Sidebar (Explorer, Search, Settings), Zen mode, zoom, outline, Quick Open (Ctrl+P)

### What does NOT work yet
- **No disk persistence** — edits live in the browser; Save / Open need the desktop app
- **No CLI** — `cargo install mdpad` / `mdpad .` is not built
- **No Tauri desktop app** — the Rust backend is not wired for release
- **No server mode** — `mdpad --serve` does not exist

### In short
A working in-browser Markdown editor demo. File I/O to disk, the CLI, and desktop
packaging remain to be implemented.

## Vision

A local-first Markdown tool built for developers who work with AI-generated specs,
plans, and documentation. No cloud, no accounts, no config — just `mdpad .` and
you're browsing.

**What it will be:** A fast, offline viewer and editor for `.md` files with full GFM support.

**What it isn't:** Not a wiki, not a note-taking app, not Notion. Just Markdown, done right.

## Planned Features

| Feature | Status |
|---------|--------|
| File tree sidebar with icons | UI done (mock data) |
| Markdown preview (GFM, Shiki, Mermaid, KaTeX) | UI done (read-only) |
| Dark / light / sepia themes | Working |
| TOC outline with scroll tracking | Working |
| Cross-file search (mock data) | Working |
| Navigation shortcuts (Ctrl+P, Ctrl+W, etc.) | Working |
| Tab system with context menu | Working |
| Zen mode, zoom, Quick Open | Working |
| Text editing (Bold, Italic, Headings, Lists) | Working (in-browser) |
| WYSIWYG visual editing | Working (Milkdown) |
| Code mode editing (raw markdown) | Working (CodeMirror) |
| Find in file / Find & Replace | Working |
| Undo / Redo | Working |
| Insert Link / Image / Table | Working |
| Export PDF / HTML | Working |
| File create / delete / rename | Prototype (mock tree) |
| Save / Save As / Open File to disk | Needs desktop app |
| Settings applied to UI | Partial |
| CLI launch (`mdpad .`) | Not implemented |
| Tauri desktop app | Not implemented |
| Server mode (`mdpad --serve`) | Not implemented |

## Quick Start (prototype dev server only)

```bash
cd prototype
pnpm install
pnpm dev
# opens http://localhost:5173/
```

The CLI commands below are **planned but do not exist yet**:
```bash
# (future — not available)
cargo install mdpad
mdpad .
mdpad README.md
mdpad ./docs --serve --port 3000
```

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Runtime | [Tauri v2](https://tauri.app/) | Small binary (~10MB), native WebView |
| Parser | [comrak](https://github.com/kivikakk/comrak) | GFM-compatible, used by GitLab & Deno |
| Frontend | React + TypeScript | Rich ecosystem, type safety |
| Syntax | [Shiki](https://shiki.style/) | TextMate grammars, accurate coloring |
| Diagrams | [Mermaid.js](https://mermaid.js.org/) | De facto standard |
| Math | [KaTeX](https://katex.org/) | Fast math typesetting |
| Icons | [Lucide](https://lucide.dev/) | Consistent, monochrome |
| Build | Vite + pnpm | Fast builds, strict deps |

## Three Modes (planned)

```
mdpad file.md              # Tauri desktop — VIEW mode
mdpad file.md --edit       # Tauri desktop — EDIT mode
mdpad ./docs --serve       # HTTP file browser on server
```

## Documentation

All documentation is browsable in the [live demo](https://mdpad.labs.zentala.agency):

- [Architecture](.arch/ARCHITECTURE.md) — system design, tech choices
- [Backlog](.plan/BACKLOG.md) — all ideas and planned work
- [Feature Reference](REFERENCE.md) — full markdown feature showcase
- [Product Vision](.plan/vision/2026-03-30-product-vision-brainstorm.md) — competitive landscape, roadmap
- [Market Research](.plan/reports/2026-03-28-market-research.md) — competitive analysis

## Logo

```
#_
```

`#` = Markdown heading. `_` = cursor/prompt. Two characters, zero ambiguity.

## License

MIT
