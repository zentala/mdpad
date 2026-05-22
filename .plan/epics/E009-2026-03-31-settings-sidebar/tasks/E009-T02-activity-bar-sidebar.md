---
id: E009-T02
epic: E009
status: pending
created: 2026-03-31
title: Move gear to ActivityBar top group + sidebar routing
---
# E009-T02: Move gear to ActivityBar top group + sidebar routing

## What
- Move Settings gear from bottom to top group (3rd icon after Explorer, Search)
- Remove settingsActive prop, closeBadge CSS, X icon swap
- ActivityBar Settings click dispatches SET_SIDEBAR_PANEL 'settings'
- In App.tsx: render SettingsView in sidebar when panel === 'settings'
- Remove settings tab rendering from main content area

## Files
- `src/components/layout/ActivityBar.tsx`
- `src/components/layout/ActivityBar.module.css`
- `src/components/layout/ActivityBar.test.tsx`
- `src/App.tsx`

## Tests
- ActivityBar renders 3 icons in top group (Explorer, Search, Settings)
- Clicking Settings calls onSelectPanel('settings')
- No settingsActive prop needed

## Verification
- `pnpm test` passes
- `pnpm typecheck` clean
- Visual: gear is 3rd icon, settings renders in sidebar
