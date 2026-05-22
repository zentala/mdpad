---
id: E009-T01
epic: E009
status: pending
created: 2026-03-31
title: Add 'settings' to SidebarPanel type + reducer cleanup
---
# E009-T01: Add 'settings' to SidebarPanel type + reducer cleanup

## What
- Add `'settings'` to `SidebarPanel` union type
- Remove `OPEN_SETTINGS` and `TOGGLE_SETTINGS` actions
- Remove settings tab creation logic from reducer
- Settings is now just a sidebar panel, same as explorer/search

## Files
- `src/providers/AppStateProvider.tsx`
- `src/providers/AppStateProvider.test.tsx`

## Tests
- Update existing TOGGLE_SETTINGS tests to use SET_SIDEBAR_PANEL
- Test: SET_SIDEBAR_PANEL with 'settings' sets panel correctly
- Test: no settings tab created when switching to settings panel

## Verification
- `pnpm test` passes
- `pnpm typecheck` clean
