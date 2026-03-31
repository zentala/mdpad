# mdpad

[![CI](https://github.com/zentala/mdpad/actions/workflows/ci.yml/badge.svg)](https://github.com/zentala/mdpad/actions/workflows/ci.yml)

> **[Live Demo → mdpad.zentala.io](https://mdpad.zentala.io)** — you're looking at this README right now!

Markdown editor & viewer for CLI, desktop and server.

Open `.md` files from your terminal, browse them on your server, or edit them in a desktop app. One tool, three modes.

## What is mdpad?

A local-first Markdown tool built for developers who work with AI-generated specs, plans, and documentation. No cloud, no accounts, no config — just `mdpad .` and you're browsing.

**What it is:** A fast, offline viewer and editor for `.md` files with full GFM support.

**What it isn't:** Not a wiki, not a note-taking app, not Notion. Just Markdown, done right.

## Features

| Feature | Status |
|---------|--------|
| File tree sidebar with icons | Done |
| WYSIWYG visual editing | Done |
| Code mode (raw markdown) | Done |
| Preview mode (read-only) | Done |
| GFM (tables, task lists, strikethrough) | Done |
| Syntax highlighting (Shiki, 17 languages) | Done |
| Mermaid diagrams (flowchart, sequence, pie) | Done |
| YAML frontmatter as property card | Done |
| GitHub Alerts (NOTE, TIP, WARNING, CAUTION) | Done |
| KaTeX math rendering | Done |
| Dark / light / sepia themes | Done |
| TOC outline with scroll tracking | Done |
| Cross-file search | Done |
| Keyboard shortcuts (Ctrl+P, Ctrl+W, etc.) | Done |
| Tab system with context menu | Done |
| Wiki-links, footnotes, emoji shortcodes | Done |
| CLI launch (`mdpad .`) | Planned |
| Tauri desktop app | Planned |
| Server mode (`mdpad --serve`) | Planned |
| Export PDF / HTML | Planned |

## Quick Start

```bash
# (planned — not yet available)
cargo install mdpad

# Open current folder
mdpad .

# Open specific file
mdpad README.md

# Serve on your server
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
