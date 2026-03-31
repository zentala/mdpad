# mdpad

[![CI](https://github.com/zentala/mdpad/actions/workflows/ci.yml/badge.svg)](https://github.com/zentala/mdpad/actions/workflows/ci.yml)

> **[Live Demo → mdpad.zentala.io](https://mdpad.zentala.io)**

Markdown editor & viewer for CLI, desktop and server. **Concept & visual prototype.**

## Status: Work In Progress

**This is a visual concept / UI prototype only.** The application is not functional
for real use. There is no working desktop app, no CLI, and no file system access.

What you see at [mdpad.zentala.io](https://mdpad.zentala.io) is a **static React demo**
running on mock data. It demonstrates the intended UI, layout, and design direction
but does not actually edit, save, or open files.

### What works (UI navigation only)
- Browsing mock files in the file tree
- Switching tabs, themes, modes (Visual/Code/Preview)
- Markdown preview with GFM, Shiki syntax highlighting, Mermaid diagrams, KaTeX math
- Sidebar panels (Explorer, Search across mock files, Settings)
- Zen mode, zoom, outline panel, Quick Open (Ctrl+P)

### What does NOT work
- **No file editing** — Bold, Italic, Heading, List buttons are non-functional (no editor engine)
- **No file saving** — Save / Save As do nothing
- **No file opening** — Open File / Open Folder do nothing (mock data only)
- **No find in file** — Ctrl+F opens a modal that always shows "0 of 0"
- **No find & replace** — UI exists but replace does nothing
- **No undo/redo** — buttons exist but have no state tracking
- **No insert operations** — Insert Link, Image, Table buttons are decorative
- **No export** — Export to PDF / HTML is not implemented
- **No clipboard** — Cut / Copy / Paste menu items are non-functional
- **No print** — no print handler exists
- **No file management** — cannot create, delete, or rename files on disk
- **No CLI** — `cargo install mdpad` does not exist, CLI is not built
- **No Tauri desktop app** — Rust backend is not implemented
- **No server mode** — `mdpad --serve` does not exist
- **No production build tested** — the app has not been verified as a standalone build
- **Settings are stored** but most are not applied (font size, word wrap, etc.)

### In short
This is a **UI/UX concept** for a markdown editor. All editing, file I/O, and desktop
integration remain to be implemented. Do not use this for actual work.

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
| Text editing (Bold, Italic, Headings, Lists) | Not implemented |
| WYSIWYG visual editing | Not implemented |
| Code mode editing (raw markdown) | Not implemented |
| Find in file / Find & Replace | Not implemented |
| Undo / Redo | Not implemented |
| Save / Save As / Open File | Not implemented |
| File create / delete / rename | Not implemented |
| Insert Link / Image / Table | Not implemented |
| Export PDF / HTML | Not implemented |
| Settings applied to UI | Not implemented |
| CLI launch (`mdpad .`) | Not implemented |
| Tauri desktop app | Not implemented |
| Server mode (`mdpad --serve`) | Not implemented |

## Quick Start (prototype dev server only)

```bash
cd prototype
pnpm install
pnpm dev
# opens http://localhost:3456/
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

All documentation is browsable in the [live demo](https://mdpad.zentala.io):

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
