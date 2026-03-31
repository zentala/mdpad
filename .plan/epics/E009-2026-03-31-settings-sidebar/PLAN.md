# E009: Settings as Sidebar Panel

## Problem
Settings is currently a tab in the main content area (like a file). This creates UX confusion:
- Settings gear icon exists in both ActivityBar (bottom-left) and MenuBar (top-right)
- Toggle behavior is unclear — clicking gear doesn't visually indicate it will close settings
- Settings tab competes with file tabs for space
- The X badge indicator was too subtle/invisible across themes

## Solution
Move Settings from a tab to a sidebar panel, same as Explorer and Search. This follows the VSCode pattern where settings is accessed from the activity bar.

## Changes
1. **ActivityBar**: Move Settings gear from bottom to top group (3rd icon after Explorer, Search)
2. **Sidebar**: Add SettingsPanel that renders SettingsView content in the sidebar
3. **Remove settings tab**: No more settings as a tab in the content area
4. **Remove MenuBar gear**: Settings only accessible from ActivityBar (+ Ctrl+, shortcut)
5. **Toggle behavior**: Same as Explorer/Search — click to open, click again to close/toggle sidebar

## Scope
- Move SettingsView content into sidebar panel
- Update SidebarPanel type: `'explorer' | 'search' | 'settings'`
- Remove OPEN_SETTINGS/TOGGLE_SETTINGS tab logic from reducer
- Remove settings gear from MenuBar
- Keep Ctrl+, shortcut (switches to settings panel)
- Keep all existing settings functionality (theme, font size, word wrap, etc.)

## Out of scope
- Settings search/filter
- Settings categories collapsible
- Settings import/export

## Acceptance criteria
- [ ] Settings gear is 3rd icon in ActivityBar (after Explorer, Search)
- [ ] Clicking gear opens settings in sidebar (same area as file tree)
- [ ] Clicking gear again closes sidebar (or switches away)
- [ ] Ctrl+, opens settings panel
- [ ] No settings tab in tab bar
- [ ] No gear icon in MenuBar top-right
- [ ] All settings (theme, font size, editor, preview, files) work in sidebar
- [ ] Settings panel scrollable if content exceeds sidebar height
- [ ] All existing tests pass
- [ ] New tests for settings panel toggle behavior

## Test strategy
- Unit tests: reducer handles SET_SIDEBAR_PANEL with 'settings'
- Unit tests: ActivityBar renders 3 icons in top group
- Unit tests: SettingsView renders in sidebar context
- Integration: toggle settings panel open/close
