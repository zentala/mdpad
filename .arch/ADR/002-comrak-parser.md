# ADR 002: Use comrak as Markdown Parser

- **Status**: accepted
- **Date**: 2026-03-28
- **Epic**: E001

## Context
Need a markdown parser with full GFM (GitHub Flavored Markdown) support:
tables, task lists, strikethrough, autolinks, fenced code blocks.

## Decision
Use comrak (Rust crate) — a port of cmark-gfm from C.

## Alternatives
- **pulldown-cmark**: faster, event-based, used by mdBook/rustdoc.
  Rejected — lacks full GFM extension support (no task lists, autolinks).
- **markdown (crate)**: less popular, smaller community.
- **JS parsers (marked, remark, markdown-it)**: would work in WebView but
  miss the opportunity to parse in Rust backend for better performance.

## Consequences
- Full GFM compatibility out of the box
- Production-proven: used by GitLab, Deno, docs.rs, crates.io
- Parsing happens in Rust backend → HTML sent to WebView via IPC
- Slightly slower than pulldown-cmark but GFM support is worth it
