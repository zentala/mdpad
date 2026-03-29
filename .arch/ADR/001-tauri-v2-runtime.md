# ADR 001: Use Tauri v2 as Application Runtime

- **Status**: accepted
- **Date**: 2026-03-28
- **Epic**: E001

## Context
Need a desktop runtime for a lightweight markdown viewer. Must be small (<15MB),
fast startup (<0.5s), cross-platform, and support Rust backend logic.

## Decision
Use Tauri v2 with system WebView (WebView2 on Windows, WebKit on macOS/Linux).

## Alternatives
- **Electron**: rejected — 80-150MB installer, 150-300MB RAM, 1-2s startup.
  Every major markdown editor (Obsidian, Typora, Mark Text, Zettlr) uses Electron.
  We want to differentiate on size and speed.
- **Qt/GTK native**: rejected — higher dev complexity, no web rendering for markdown.
- **.NET/WPF**: rejected — Windows-only (Markdown Monster approach).

## Consequences
- Binary ~10MB, RAM ~30-50MB, startup <0.5s
- Frontend must be web-compatible (no Node.js APIs)
- Backend logic in Rust (learning curve, but enables comrak parser)
- WebView rendering may differ across platforms (WebView2 vs WebKit)
- Tauri v2 is stable (released Oct 2024), production-ready
