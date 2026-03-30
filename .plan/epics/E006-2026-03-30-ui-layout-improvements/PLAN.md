# E006 — UI Layout Improvements: Activity Bar + Zen Mode

## What
Two UI changes to the prototype layout:
1. **Activity Bar** — VSCode-style vertical icon strip on the LEFT side, replacing the current SidebarBookmarks (rotated text tabs on the right edge)
2. **Zen Mode** — distraction-free full-screen content view for reading/writing

## Why
- **Activity Bar**: Current SidebarBookmarks use rotated text on the right edge of the sidebar — impractical, non-standard, and visually confusing. VSCode's activity bar pattern is universally understood: large icons on the left, always visible, click to toggle panels.
- **Zen Mode**: Users reading long documents need a distraction-free option. Standard feature in every serious editor (VSCode, Typora, iA Writer). Already listed in BACKLOG.md.

## Scope
- Prototype only (React + Vite mockup)
- No Tauri backend changes
- No new dependencies

## Design: Activity Bar

### Layout
- 48px wide vertical strip, LEFT side of the body (before sidebar)
- Always visible, regardless of sidebar open/close state
- Background: `var(--bg-surface)`, right border: `var(--border)`

### Icons (Lucide, 24px)
- **Top group**: Files (Explorer), Search
- **Bottom group** (flex-end, separated): Settings gear
- Active icon: left accent border (2px `var(--accent)`), icon color `var(--text-primary)`
- Inactive: icon color `var(--text-muted)`, hover → `var(--text-secondary)`

### Behavior
- Click inactive icon → switch panel + open sidebar (if closed)
- Click active icon → toggle sidebar open/close
- Bottom Settings icon → dispatch `OPEN_SETTINGS`
- Tooltip on hover with panel name

### Migration
- Remove `SidebarBookmarks` component entirely
- Remove `sidebarBookmarks` prop from `AppShell`
- Add `activityBar` slot to `AppShell` (renders before sidebar in flex row)
- Update `App.tsx` to render `ActivityBar` instead of `SidebarBookmarks`

## Design: Zen Mode

### Behavior
- Toggle via F11 (already in View menu) or Escape to exit
- Hides: MenuBar, ActivityBar, TabBar, Toolbar, Sidebar, StatusBar, TocPanel
- Shows: Content area only, fills entire viewport
- Subtle "Press Esc to exit Zen Mode" toast on entry (fades after 2s)

### State
- New state field: `zenMode: boolean` (default: `false`)
- New action: `TOGGLE_ZEN_MODE`
- Derived: when `zenMode` is true, AppShell hides all chrome
- Esc key handler: if zenMode → exit zen mode (not close modal)

### CSS
- `.shell[data-zen='true']` — hides all chrome via display:none
- Content area gets `height: 100vh`, no borders
- Smooth transition not needed (instant toggle, like VSCode)

## Acceptance Criteria
- [ ] Activity bar on left with Files + Search icons, Settings at bottom
- [ ] Clicking icons toggles/switches sidebar panels correctly
- [ ] SidebarBookmarks fully removed
- [ ] Zen mode toggleable via F11 and View menu
- [ ] Esc exits zen mode
- [ ] All existing tests still pass
- [ ] Both features work in dark/light/sepia themes

## Test Strategy
- Existing tests must pass (no regressions)
- Manual visual verification in dev server
- Activity bar: verify panel switching logic
- Zen mode: verify toggle/escape behavior
