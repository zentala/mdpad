# E009 Orchestrator — Settings Sidebar

## Wave 1 (sequential — each builds on previous)

### T01: Add 'settings' to SidebarPanel type + reducer
- Add `'settings'` to `SidebarPanel` union type in AppStateProvider
- Remove `OPEN_SETTINGS` and `TOGGLE_SETTINGS` actions from reducer
- Remove settings tab creation logic
- Update `SET_SIDEBAR_PANEL` to handle 'settings'
- Update tests in `AppStateProvider.test.tsx`
- **Files**: `providers/AppStateProvider.tsx`, `providers/AppStateProvider.test.tsx`

### T02: Move gear to ActivityBar top group + sidebar routing
- Move Settings icon from bottom section to top group (3rd after Explorer, Search)
- Remove `settingsActive` prop, `closeBadge` CSS, X icon swap logic
- ActivityBar click dispatches `SET_SIDEBAR_PANEL` with 'settings' (same as Explorer/Search)
- In App.tsx sidebar section: render `<SettingsView />` when `sidebarPanel === 'settings'`
- Remove settings tab rendering from main content area
- Update `ActivityBar.test.tsx`
- **Files**: `ActivityBar.tsx`, `ActivityBar.module.css`, `ActivityBar.test.tsx`, `App.tsx`

### T03: Adapt SettingsView for sidebar width
- SettingsView currently designed for wide content area (~800px)
- Adapt layout for sidebar width (~250px): stack label+control vertically, reduce padding
- Test all settings types: dropdowns, toggles, tag lists, text inputs
- Ensure scrollable when content exceeds sidebar height
- **Files**: `SettingsView.tsx`, `SettingsView.module.css`

### T04: Remove gear from MenuBar + cleanup
- Remove settings gear icon from MenuBar top-right area
- Update Ctrl+, shortcut to dispatch `SET_SIDEBAR_PANEL` with 'settings'
- Update ZenHoverBar settings toggle to use sidebar panel
- Remove unused imports (X from lucide-react in ActivityBar)
- Remove `TOGGLE_SETTINGS` from Action type
- Run full test suite, fix any broken tests
- **Files**: `MenuBar.tsx`, `App.tsx`, `ZenHoverBar.tsx`, `AppStateProvider.tsx`

### T05: URL sync update
- Remove `/settings` URL routing from `useUrlSync.ts`
- Settings is now sidebar state, not a route — URL should only reflect active file
- Update `useUrlSync.test.ts`
- **Files**: `hooks/useUrlSync.ts`, `hooks/__tests__/useUrlSync.test.ts`

## Verification
- [ ] `pnpm test` — all pass
- [ ] `pnpm typecheck` — clean
- [ ] `pnpm lint` — clean
- [ ] Visual: gear is 3rd icon in ActivityBar
- [ ] Visual: settings opens in sidebar, same width as Explorer
- [ ] Visual: all settings functional (theme, toggles, dropdowns, tags)
- [ ] Visual: sidebar scrolls if settings exceed height
- [ ] Visual: no gear in MenuBar
- [ ] Visual: Ctrl+, opens settings panel
