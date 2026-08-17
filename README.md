# mdpad

_Formerly zntl-md, renamed to mdpad on 2026-03-30._

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
- **No disk persistence in the web demo** — edits live in the browser; the desktop
  app is where Save / Open reach the file system
- **No CLI** — `cargo install mdpad` / `mdpad .` is not built
- **No server mode** — `mdpad --serve` does not exist
- **Desktop app not packaged for release** — the Tauri backend itself is built and
  wired (see below), but there is no installer yet

### Tauri backend
The Tauri backend is integrated, not a stub. `src-tauri/src/lib.rs` registers 5
commands — `list_files`, `read_file`, `watch_directory`, `unwatch_directory`,
`set_window_title` — and the frontend calls them via `hooks/useTauriFiles.ts` +
`lib/tauri-api.ts` under an `IS_TAURI` flag. Run it with `pnpm tauri dev`. Outside
Tauri (the web demo above) that flag is false and the app falls back to mock data.

### In short
Two things already work: a web demo (in-browser, mock data — no disk access) and a
Tauri backend wired for the desktop build (real disk file I/O via 5 Rust commands).
The CLI and desktop packaging for release remain to be implemented.

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
| Tauri desktop app | Backend wired (`pnpm tauri dev`), not packaged for release |
| Server mode (`mdpad --serve`) | Not implemented |

## Quick Start (prototype dev server only)

From a fresh clone, run `pnpm bootstrap` at the repo root (installs root tooling and
`prototype/` in one step). Then:

```bash
cd prototype
pnpm install
pnpm dev
# opens http://localhost:5173/
```

Manual dev server: http://localhost:5173. Under PM3 the app is served at
http://mdpad.internal.

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
