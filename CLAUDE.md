# mdpad — Tauri Markdown Viewer

**Formerly**: zntl-md → renamed to mdpad
**Domain**: mdpad.zentala.io
**Repo**: github.com/zentala/mdpad

## Purpose
Lightweight desktop Markdown viewer for developers who work with AI-generated specs,
plans, and documentation. Launch from terminal, browse folder, preview markdown with
full GFM support, Mermaid diagrams, YAML frontmatter, and syntax-highlighted code blocks.

## Target User
AI-augmented developers who keep project specs, plans, ADRs, and documentation in Markdown.
They need to quickly preview and navigate markdown files without opening a full IDE.

## Tech Stack
- **Runtime**: Tauri v2 (Rust backend + WebView frontend)
- **Parser**: comrak (Rust, GFM-compatible — used by GitLab, Deno)
- **Frontend**: TBD (Svelte or React)
- **Build**: Cargo + pnpm

## Key Features (planned)
- CLI launch: `mdpad .` or `mdpad file.md`
- File tree sidebar with folder browsing
- TOC/outline panel with heading navigation
- Live preview with GFM rendering
- Mermaid diagram support
- YAML frontmatter display
- Syntax highlighting for code blocks
- Search across files
- Dark/light theme
- Export PDF/HTML
- File watcher (auto-reload on external changes)
- Small footprint (<15MB installer, <50MB RAM)

## Project Structure
```
.arch/           — architecture docs, ADRs, domain model
.plan/           — epics, tasks, backlog, reports, vision
.claude/         — Claude Code config and hooks
examples/        — git submodules of reference Tauri markdown editors
src-tauri/       — Rust backend (TBD)
src/             — Frontend (TBD)
```

## Documentation Tree
- [Architecture](.arch/ARCHITECTURE.md) — system design, tech choices
- [Backlog](.plan/BACKLOG.md) — ideas, unrefined work
- [Reports](.plan/reports/) — research and analysis

## Conventions
- Follow global CLAUDE.md conventions (LF, pnpm, TypeScript, Conventional Commits)
- Rust: no unwrap() in production, doc comments on pub fn
- Files ≤ 250 lines, functions ≤ 50 lines
