# Architecture — mdpad

## Overview

mdpad is a lightweight desktop Markdown viewer built with Tauri v2.
It renders Markdown files with full GFM support using the comrak parser in Rust,
served through the system WebView.

## System Design

```
┌─────────────────────────────────────────────┐
│              Tauri Window                    │
│  ┌──────────┬───────────────────────────┐    │
│  │ File     │   Markdown Preview        │    │
│  │ Tree     │                    ┌────┐ │    │
│  │          │   Rendered         │ TOC│ │    │
│  │ .md      │   HTML from        │ ·H1│ │    │
│  │ .md      │   comrak           │  H2│ │    │
│  │ .md      │                    └────┘ │    │
│  │          │              [Zoom ±]     │    │
│  └──────────┴───────────────────────────┘    │
│  └─ Status Bar ─────────────────────────┘   │
└─────────────────────────────────────────────┘
         │                    ▲
         │ IPC commands       │ Rendered HTML
         ▼                    │
┌─────────────────────────────────────────────┐
│              Rust Backend                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ File     │  │ comrak   │  │ File      │ │
│  │ System   │  │ Parser   │  │ Watcher   │ │
│  │ Scanner  │  │ (GFM)    │  │ (notify)  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
└─────────────────────────────────────────────┘
```

## Tech Choices

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Runtime | Tauri v2 | Small binary (~10MB), native WebView, Rust backend |
| Markdown parser | remark/rehype (React) | 11 custom plugins, comrak deferred ([ADR-007](ADR/007-keep-remark-pipeline-in-tauri.md)) |
| File watching | notify (Rust) | Cross-platform FS events |
| Frontend | React + TypeScript | Confirmed via prototype, Context + useReducer state |
| Diagrams | Mermaid.js | De facto standard for markdown diagrams (lazy-loaded) |
| Math | KaTeX | Faster than MathJax, good enough for devs |
| Syntax highlight | Shiki | GitHub themes (github-dark/light), 17 languages |
| Code editor | CodeMirror 6 | Raw markdown editing, built-in search, lazy-loaded ([ADR-008](ADR/008-editor-engine-codemirror-milkdown.md)) |
| Visual editor | Milkdown | WYSIWYG via ProseMirror + remark, shared plugin pipeline, lazy-loaded ([ADR-008](ADR/008-editor-engine-codemirror-milkdown.md)) |
| State | Context + useReducer | AppStateProvider with typed actions, fileContents, dirty tracking |
| Persistence | localStorage | Theme (mdpad-theme), settings (mdpad-settings) |
| Testing | Vitest + testing-library | jsdom env, 81 JS tests + 11 Rust tests |
| Linting | ESLint 10 + Prettier | Flat config, lint-staged via Husky |
| CI/CD | GitHub Actions | CI on PR, deploy to GH Pages, release workflow + Docker |
| Branching | dev/main | dev = default, main = releases only |

## File system layer (E011)

Open/Save go through one seam, `src/data/fsAdapter.ts`, which branches on
`isTauri()`:

```
UI (MenuBar / App handlers)
        │  openFile / openFolder / saveFile / saveFileAs
        ▼
   fsAdapter.ts
     ├── Tauri branch → tauri-api.ts → IPC → Rust (list_files, read_file, write_file)
     └── Web branch  → fsAdapterWeb.ts → File System Access API
                        (showOpenFilePicker / showDirectoryPicker / showSaveFilePicker)
                        with <input type=file> + Blob-download fallback
```

- Rust gained a `write_file` command (path-traversal guarded) — the backend was
  read-only before E011.
- App state holds `fileHandles: Record<path, FileSystemFileHandle>` so Save can
  write in place (web); Save falls back to Save As when no handle/path is known.
- `MenuBar` supports nested submenus (`MenuItem.submenu`) — used by Export ▸
  (PDF / HTML). Quit renders only inside Tauri.
- Editor commands (undo/redo/cut/copy/paste) route through `EditorRef.execCommand`
  to the active engine, not `document.execCommand`.
- Decision: [ADR 009](ADR/009-fs-adapter-tauri-web.md).

## Key ADRs

- [ADR 001 — Tauri v2 Runtime](ADR/001-tauri-v2-runtime.md)
- [ADR 002 — comrak Parser](ADR/002-comrak-parser.md)
- [ADR 003 — React Frontend](ADR/003-react-frontend.md)
- [ADR 004 — Shiki Syntax Highlighting](ADR/004-shiki-syntax-highlighting.md)
- [ADR 005 — Context + useReducer](ADR/005-context-usereducer.md)
- [ADR 007 — Keep remark Pipeline in Tauri](ADR/007-keep-remark-pipeline-in-tauri.md)
- [ADR 008 — Editor Engine: CodeMirror 6 + Milkdown](ADR/008-editor-engine-codemirror-milkdown.md)
- [ADR 009 — File system adapter (Tauri IPC + browser FSA)](ADR/009-fs-adapter-tauri-web.md)

## Reports

- [Market Research](../.plan/reports/2026-03-28-market-research.md) — competitive landscape analysis
- [UX Vision](../.plan/vision/2026-03-28-ux-vision.md) — detailed UX specification
