# ADR 005: Use Context + useReducer for State Management

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E003

## Context
App.tsx grew to 190+ lines with 10+ useState calls. Needed centralized state.

## Decision
React Context + useReducer with typed actions. No external state library.

## Alternatives
- **Zustand** (~1KB): rejected — adds dependency for what useReducer handles.
  Migration path exists if needed later.
- **Keep useState in App.tsx**: rejected — unsustainable at 20+ features.
- **Redux**: rejected — overkill for a desktop app prototype.

## Consequences
- Zero new dependencies
- Typed actions (OPEN_FILE, CLOSE_TAB, SET_THEME, etc.)
- Derived state computed in provider (showToolbar, showToc, activeMarkdown)
- Easy to test reducer in isolation
- Tab type system (file | settings | welcome) cleanly modeled
