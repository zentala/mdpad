# ADR 003: Use React for Frontend

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E002

## Context
Need a frontend framework for the Tauri WebView. Options: Svelte, React, vanilla.

## Decision
React + TypeScript with Vite bundler.

## Alternatives
- **Svelte**: smaller bundle, simpler syntax. Rejected — smaller ecosystem,
  fewer developers familiar, harder to find component libraries.
- **Vanilla JS**: Inkwell uses this. Rejected — too much boilerplate for
  complex UI (tabs, modals, panels, state management).

## Consequences
- Rich ecosystem (Lucide, react-markdown, Shiki, Mermaid all have React bindings)
- TypeScript-first with strong type inference
- Context + useReducer for state (no extra deps)
- Larger bundle than Svelte but acceptable for desktop app
