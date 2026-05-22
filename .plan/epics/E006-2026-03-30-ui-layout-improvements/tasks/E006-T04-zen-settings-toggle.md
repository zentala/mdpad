---
id: E006-T04
epic: E006
status: pending
created: 2026-03-31
title: Zen Mode — Settings toggle (open/close)
---
# E006-T04: Zen Mode — Settings toggle (open/close)

## Problem
In Zen Mode, clicking the Settings icon in ZenHoverBar opens the Settings tab,
but there's no way to close it. The user is stuck in Settings with no escape.

## Solution
Make the Settings icon a toggle: click to open, click again to close.

### Behavior
- **First click**: Opens Settings tab (current behavior via `OPEN_SETTINGS`)
- **Second click**: Closes the Settings tab (returns to previous file tab)
- Same pattern as Activity Bar's Settings icon in normal mode

### Implementation
In `ZenHoverBar.tsx`, the Settings button's `onClick` should:
1. Check if active tab is already `type: 'settings'`
2. If yes → dispatch `CLOSE_TAB` for the settings tab (or switch to previous tab)
3. If no → dispatch `OPEN_SETTINGS` (current behavior)

Alternatively, add a `TOGGLE_SETTINGS` action to AppStateProvider that handles this.

### Files to modify
- `prototype/src/components/layout/ZenHoverBar.tsx` — toggle logic
- `prototype/src/providers/AppStateProvider.tsx` — possibly new `TOGGLE_SETTINGS` action

### Verification
1. Enter Zen Mode (F11)
2. Click Settings icon → Settings opens
3. Click Settings icon again → Settings closes, returns to file
4. Repeat — should toggle reliably
5. Works in all themes (dark/light/sepia)
