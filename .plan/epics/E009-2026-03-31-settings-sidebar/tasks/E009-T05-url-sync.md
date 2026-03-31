---
id: E009-T05
epic: E009
status: todo
created: 2026-03-31
---
# E009-T05: URL sync update

## What
- Remove /settings URL routing from useUrlSync
- Settings is sidebar state, not a route
- URL only reflects active file: /README.md, /REFERENCE.md, /
- parseUrl no longer matches '/settings'

## Files
- `src/hooks/useUrlSync.ts`
- `src/hooks/__tests__/useUrlSync.test.ts`

## Tests
- Remove settings route test case
- Ensure '/settings' is treated as a file path (or empty)
- All other URL tests pass

## Verification
- `pnpm test` passes
- `pnpm typecheck` clean
