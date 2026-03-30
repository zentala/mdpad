---
id: E006-T01
epic: E006
status: pending
created: 2026-03-30
branch: feat/E006-T01-activity-bar
---
# E006-T01: VSCode-style Activity Bar

## Goal
Replace SidebarBookmarks (rotated text tabs on right edge) with a VSCode-style vertical Activity Bar on the LEFT side.

## Steps

### 1. Create ActivityBar component
- `prototype/src/components/layout/ActivityBar.tsx`
- `prototype/src/components/layout/ActivityBar.module.css`
- Props: `activePanel`, `sidebarOpen`, `onSelectPanel`, `onOpenSettings`
- Top icons: Files (explorer), Search — 24px Lucide icons
- Bottom icon: Settings (gear) — separated with flex spacer
- Active indicator: 2px left border with `var(--accent)`
- Width: 48px, background: `var(--bg-surface)`, border-right: `var(--border)`
- Full height of body area

### 2. Update AppShell
- Remove `sidebarBookmarks` prop
- Add `activityBar` prop (ReactNode)
- In `.body` flex row: `activityBar` → `sidebar` → `mainColumn`
- Activity bar is always rendered (not conditional on sidebarOpen)

### 3. Update AppShell.module.css
- Add `.activityBar` class: width 48px, flex-shrink 0, display flex, flex-direction column, border-right
- Remove any SidebarBookmarks positioning hacks

### 4. Update App.tsx
- Replace `<SidebarBookmarks>` with `<ActivityBar>`
- Pass correct props from state/dispatch
- Handle click logic: click active → toggle sidebar, click inactive → switch panel + open

### 5. Delete SidebarBookmarks
- Remove `SidebarBookmarks.tsx` and `SidebarBookmarks.module.css`

### 6. Verify
- `pnpm test` — all tests pass
- Dev server — visual check all themes
- Panel switching works correctly
- Settings icon opens settings tab

## Commit
`feat(E006-T01): replace SidebarBookmarks with VSCode-style Activity Bar`
