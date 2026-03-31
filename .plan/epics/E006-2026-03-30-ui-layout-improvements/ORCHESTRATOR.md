# E006 — Orchestrator

## Wave 1 (parallel — independent tasks, separate files)

### T01 — Activity Bar (VSCode-style sidebar icons)
- **Branch**: `feat/E006-T01-activity-bar`
- **Files**: ActivityBar.tsx, ActivityBar.module.css, AppShell.tsx, AppShell.module.css, App.tsx
- **Remove**: SidebarBookmarks.tsx, SidebarBookmarks.module.css
- **Status**: [x] ✓ merged to main

### T02 — Zen Mode
- **Branch**: `feat/E006-T02-zen-mode`
- **Files**: AppStateProvider.tsx, AppShell.tsx, AppShell.module.css, App.tsx, types/index.ts
- **Status**: [x] ✓ merged to main

### T03 — Zen Hover Bar
- **Branch**: `feat/E006-T03-zen-hover-bar`
- **Files**: ZenHoverBar.tsx, ZenHoverBar.module.css, AppShell.tsx
- **Status**: [x] ✓ merged to dev

## Wave 2 (independent tasks)

### T04 — Zen Mode Settings toggle
- **Task**: [E006-T04](tasks/E006-T04-zen-settings-toggle.md)
- **Files**: ZenHoverBar.tsx, AppStateProvider.tsx
- **Status**: [x] ✓ merged to dev

### T05 — Content zoom
- **Task**: [E006-T05](tasks/E006-T05-content-zoom.md)
- **Files**: MarkdownPreview.tsx/CSS, App.tsx, ZoomControl.tsx
- **Status**: [x] ✓ merged to dev

### T06 — Logo #> → #_
- **Task**: [E006-T06](tasks/E006-T06-logo-hash-underscore.md)
- **Files**: Logo.tsx, favicon.svg, logo.svg, scripts/
- **Status**: [x] ✓ merged to dev

### T07 — Outline redesign (floating, transparent)
- **Task**: [E006-T07](tasks/E006-T07-outline-redesign.md)
- **Files**: TocPanel.tsx/CSS, AppShell.tsx/CSS, App.tsx
- **Status**: [x] ✓ merged to dev

## Merge Order
1. T01 first (layout changes to AppShell) ✓
2. T02 second (adds zenMode on top of new layout) ✓
3. T03 (zen hover bar) ✓
4. Wave 2: T04, T05, T06 are independent — can be parallel
5. T07 last (touches AppShell layout, should go after T04/T05)
