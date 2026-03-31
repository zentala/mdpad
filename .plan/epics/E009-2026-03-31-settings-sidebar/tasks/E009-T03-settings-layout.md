---
id: E009-T03
epic: E009
status: todo
created: 2026-03-31
---
# E009-T03: Adapt SettingsView for sidebar width

## What
- SettingsView designed for ~800px content area, needs to work at ~250px sidebar
- Stack label + control vertically instead of side-by-side
- Reduce padding, font sizes where needed
- Ensure dropdowns, toggles, tag lists all fit
- Add overflow-y: auto for scrolling

## Files
- `src/components/settings/SettingsView.tsx` (if layout changes needed)
- `src/components/settings/SettingsView.module.css`

## Tests
- Existing SettingsView tests still pass
- Visual: all settings types render correctly in narrow sidebar

## Verification
- `pnpm test` passes
- Visual: settings scrollable, all controls usable
