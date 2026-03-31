# ADR 007: Keep React/remark Pipeline in Tauri (Defer comrak)

- **Status**: accepted
- **Date**: 2026-03-31
- **Epic**: E008

## Context

ADR-002 chose comrak (Rust) as the markdown parser for the Tauri desktop app. However, the React prototype now has a mature rendering pipeline with remark/rehype and 11 custom plugins (mark, sup/sub, wikilinks, spoiler, insert, multiline blockquote, math, emoji, GitHub alerts, definition lists, GFM).

Rewriting all 11 plugins for comrak would take significant effort and delay the Tauri release.

## Decision

Keep the React/remark/rehype rendering pipeline for Tauri v0.1. The Rust backend handles only file I/O (list_files, read_file, watch_directory). Markdown parsing stays in the frontend WebView.

## Alternatives

1. **Use comrak in Rust, rewrite all plugins** — highest performance, but weeks of work replicating 11 plugins. No user-visible benefit since WebView rendering is fast enough.
2. **Hybrid: comrak for basic rendering, remark for extensions** — complex two-parser architecture, maintenance burden, potential inconsistencies.
3. **Keep remark/rehype entirely** (chosen) — zero migration cost, all plugins work immediately, ship Tauri faster.

## Consequences

- Tauri app ships faster with full feature parity to the web demo
- Markdown parsing happens in WebView JS, not native Rust — acceptable for file sizes under 10MB
- comrak remains a future optimization option for large-file performance
- ADR-002 is not superseded — comrak is still the long-term choice, just deferred
