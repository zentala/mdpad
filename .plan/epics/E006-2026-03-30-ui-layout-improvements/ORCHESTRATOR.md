# E006 — Orchestrator

## Wave 1 (parallel — independent tasks, separate files)

### T01 — Activity Bar (VSCode-style sidebar icons)
- **Branch**: `feat/E006-T01-activity-bar`
- **Files**: ActivityBar.tsx, ActivityBar.module.css, AppShell.tsx, AppShell.module.css, App.tsx
- **Remove**: SidebarBookmarks.tsx, SidebarBookmarks.module.css
- **Status**: [ ]

### T02 — Zen Mode
- **Branch**: `feat/E006-T02-zen-mode`
- **Files**: AppStateProvider.tsx, AppShell.tsx, AppShell.module.css, App.tsx, types/index.ts
- **Status**: [ ]

## Merge Order
1. T01 first (layout changes to AppShell)
2. T02 second (adds zenMode on top of new layout)
