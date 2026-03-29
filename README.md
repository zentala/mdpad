# zntl-md

Lightweight Tauri-based Markdown viewer for developers.

Browse project folders, preview Markdown files with full GFM support, Mermaid diagrams,
YAML frontmatter, and syntax-highlighted code blocks. Designed for AI-augmented dev workflows.

## Features (planned)

- CLI launch: `zntl-md .` or `zntl-md README.md`
- File tree sidebar
- TOC / heading navigation
- GFM rendering (tables, task lists, strikethrough)
- Mermaid diagrams
- YAML frontmatter display
- Code block syntax highlighting
- Cross-file search
- Dark / light theme
- Export PDF / HTML
- Auto-reload on external file changes
- Tiny footprint (~10MB installer, ~40MB RAM)

## Tech Stack

- [Tauri v2](https://tauri.app/) — Rust + WebView
- [comrak](https://github.com/kivikakk/comrak) — GFM Markdown parser (Rust)
- Frontend: TBD

## Documentation

- [Architecture](.arch/ARCHITECTURE.md)
- [Backlog](.plan/BACKLOG.md)
- [Market Research](.plan/reports/2026-03-28-market-research.md)
- [UX Vision](.plan/vision/2026-03-28-ux-vision.md)

## License

TBD
