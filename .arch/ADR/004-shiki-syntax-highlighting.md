# ADR 004: Use Shiki for Syntax Highlighting

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E003

## Context
Need syntax highlighting for code blocks in markdown preview.

## Decision
Shiki with sync web bundle (github-dark + github-light themes).

## Alternatives
- **Prism.js** (~50KB): rejected — older token-based system, less accurate
  than VS Code TextMate grammars, different colors than what devs expect.
- **Highlight.js** (~100KB): rejected — similar issues to Prism.
- **Shiki lazy per-language**: rejected — async complexity, flash of
  unhighlighted content. Sync bundle (~500KB) is acceptable for desktop.

## Consequences
- Highlighting identical to VS Code (same TextMate grammars)
- 500KB added to bundle (one-time download, instant from disk in Tauri)
- 17 languages supported out of the box
- Theme auto-switches with app theme
