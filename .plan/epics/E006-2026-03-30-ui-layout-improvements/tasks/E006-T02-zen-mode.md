---
id: E006-T02
epic: E006
status: pending
created: 2026-03-30
branch: feat/E006-T02-zen-mode
title: Zen Mode
---
# E006-T02: Zen Mode

## Goal
Add distraction-free Zen Mode that hides all UI chrome and shows only content.

## Steps

### 1. Add state
In `AppStateProvider.tsx`:
- Add `zenMode: boolean` to `AppState` (default: false)
- Add action `TOGGLE_ZEN_MODE` to toggle it
- Expose `zenMode` in context value

### 2. Update AppShell
- Accept `zenMode` prop (boolean)
- Add `data-zen={zenMode}` attribute to `.shell` div
- When zen=true: hide menuBar, activityBar/sidebar, toolbar (TabBar+Toolbar), statusBar, toc
- Only show `.main` content, filling full viewport

### 3. Update AppShell.module.css
- `.shell[data-zen='true'] .menuBar { display: none }`
- Same for `.activityBar`, `.sidebar`, `.toolbar`, `.statusBar`, `.toc`
- `.shell[data-zen='true'] .body { height: 100vh }` — content fills screen
- `.shell[data-zen='true'] .main` — remove borders, full width/height

### 4. Add keyboard shortcuts in App.tsx
- F11 → dispatch `TOGGLE_ZEN_MODE`
- Escape → if zenMode is on, exit zen mode (priority over modal close)

### 5. Wire up View menu
- MenuBar "Zen Mode" item → `onToggleZenMode` callback
- Add `onToggleZenMode` prop to MenuBar

### 6. Add exit hint
- When entering zen mode, show a subtle centered text "Press Esc to exit Zen Mode"
- Auto-fades after 2 seconds (CSS animation, opacity 0)
- No extra component needed — just a div with CSS keyframe

### 7. Verify
- `pnpm test` — all tests pass
- Dev server — F11 enters zen mode, Esc exits
- Works in all themes
- View > Zen Mode menu item works

## Commit
`feat(E006-T02): add Zen Mode — distraction-free full-screen content view`
