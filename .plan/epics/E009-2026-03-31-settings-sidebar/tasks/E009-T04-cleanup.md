---
id: E009-T04
epic: E009
status: todo
created: 2026-03-31
---
# E009-T04: Remove gear from MenuBar + cleanup

## What
- Remove settings gear icon from MenuBar top-right
- Update Ctrl+, shortcut → dispatch SET_SIDEBAR_PANEL 'settings'
- Update ZenHoverBar settings toggle → sidebar panel
- Remove TOGGLE_SETTINGS from Action type
- Remove unused imports (X from lucide-react in ActivityBar if still there)
- Clean up any dead code

## Files
- `src/components/layout/MenuBar.tsx`
- `src/components/layout/ZenHoverBar.tsx`
- `src/App.tsx`
- `src/providers/AppStateProvider.tsx`

## Tests
- Full test suite passes
- No TypeScript errors

## Verification
- `pnpm test` passes
- `pnpm typecheck` clean
- `pnpm lint` clean
- Visual: no gear in MenuBar, Ctrl+, works
