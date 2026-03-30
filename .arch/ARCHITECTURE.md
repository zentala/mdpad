# Architecture — mdpad

## Overview

mdpad is a lightweight desktop Markdown viewer built with Tauri v2.
It renders Markdown files with full GFM support using the comrak parser in Rust,
served through the system WebView.

## System Design

```
┌─────────────────────────────────────────────┐
│              Tauri Window                    │
│  ┌──────────┬────────────────┬───────────┐  │
│  │ File     │   Markdown     │   TOC     │  │
│  │ Tree     │   Preview      │  Outline  │  │
│  │          │                │           │  │
│  │ .md      │   Rendered     │  H1       │  │
│  │ .md      │   HTML from    │   H2      │  │
│  │ .md      │   comrak       │   H2      │  │
│  │          │                │  H1       │  │
│  └──────────┴────────────────┴───────────┘  │
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
| Markdown parser | comrak | Full GFM, production-proven (GitLab, Deno) |
| File watching | notify (Rust) | Cross-platform FS events |
| Frontend | React + TypeScript | Confirmed via prototype, Context + useReducer state |
| Diagrams | Mermaid.js | De facto standard for markdown diagrams (lazy-loaded) |
| Math | KaTeX | Faster than MathJax, good enough for devs |
| Syntax highlight | Shiki | GitHub themes (github-dark/light), 17 languages |
| State | Context + useReducer | AppStateProvider with typed actions, resolvedTheme |
| Persistence | localStorage | Theme (mdpad-theme), settings (mdpad-settings) |
| Testing | Vitest + testing-library | jsdom env, 36 tests across 5 files |

## Key ADRs

- [ADR 001 — Tauri v2 Runtime](ADR/001-tauri-v2-runtime.md)
- [ADR 002 — comrak Parser](ADR/002-comrak-parser.md)
- [ADR 003 — React Frontend](ADR/003-react-frontend.md)
- [ADR 004 — Shiki Syntax Highlighting](ADR/004-shiki-syntax-highlighting.md)
- [ADR 005 — Context + useReducer](ADR/005-context-usereducer.md)

## Reports

- [Market Research](../.plan/reports/2026-03-28-market-research.md) — competitive landscape analysis
- [UX Vision](../.plan/vision/2026-03-28-ux-vision.md) — detailed UX specification
