---
id: E003
status: planning
created: 2026-03-30
---

# E003 — Prototype v3: Full Feature Demo

## What

Third major iteration of the interactive React prototype. Implements all remaining
UX features to create a complete, polished demo of zntl-md that can be shown to users
and eventually deployed to GitHub Pages.

## Why

v2 validated core layout and mode switching. User provided extensive feedback
covering navigation, search, diagrams, media, and polish. Product strategy report
identified core value: "the terminal for your markdown." This epic brings the
prototype to demo-ready state.

## Guiding Principles

1. **Real components** — everything built here goes into the final Tauri app
2. **Mock data, real interactions** — no backend yet, but all UI flows work
3. **Design review before implementation** — CEO/UX/English review on this plan first
4. **Batch implementation** — all changes in one coordinated wave, not piecemeal

## Scope — Organized by Wave

### Wave 1: Layout Architecture (depends on nothing)

**T01 — Sidebar Activity Bar (VS Code style)**
- Vertical icon bar on far left (Explorer, Search icons)
- Click icon → expands/collapses corresponding sidebar panel
- Explorer panel content stays the same (file tree)
- When collapsed: only icon bar visible (36px wide)
- App icon/logo at top of activity bar

**T02 — Search Panel in Sidebar**
- Second tab in sidebar after Explorer
- Search input + results grouped by file
- Click result → opens file, scrolls to match
- Find & Replace with second input + Replace/Replace All
- Toggles: case-sensitive, regex, whole word

**T03 — Empty State (no file open)**
- Shown when all tabs closed
- App logo, recent files list, keyboard shortcuts grid
- Quick actions: Open File, Open Folder
- Similar to VS Code welcome page but simpler

### Wave 2: Content Features (depends on Wave 1 layout)

**T04 — Syntax Highlighting (Shiki)**
- Install shiki, configure github-dark + github-light themes
- Replace plain code blocks with highlighted output
- Support: TypeScript, Rust, Bash, JSON, CSS, YAML, Python, Go, SQL, HTML, Markdown
- Theme auto-matches app theme (dark/light)

**T05 — Mermaid Diagram Rendering**
- Install mermaid.js
- Detect ```mermaid fenced blocks, render as SVG
- Support: flowchart, sequence, class, ER, pie, gantt, git graph
- Dark/light theme matching
- Error: show error message inline, don't crash
- Demo in Welcome.md with examples of each type

**T06 — GitHub Alerts**
- Render `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`
- Colored callout boxes with Lucide icons
- Colors from GitHub's design system (blue, green, purple, yellow, red)
- Demo in Welcome.md

**T07 — Image & Media Handling**
- Images render inline in preview
- Click image → lightbox overlay (fullscreen with zoom)
- Image context menu: Copy URL, Open in browser, Save as
- Demo images in Welcome.md
- Table demo section in Welcome.md (aligned columns, nested content)

### Wave 3: Navigation & Polish (depends on Wave 2)

**T08 — "+" Tab (New File)**
- Plus button as last tab
- Click → creates "Untitled.md" tab
- Empty editor, not yet saved
- First save → name prompt (mock)

**T09 — Tab Context Menu**
- Right-click tab → Close, Close Others, Close All, Copy Path
- Reveal in Explorer (scrolls file tree to file)

**T10 — Settings Tab**
- Opens as a tab (like VS Code), not modal
- Categories: General, Appearance, Editor, Preview, Files, Shortcuts
- Mock controls (toggles, dropdowns, sliders)
- Ctrl+, to open

**T11 — Status Bar Redesign**
- Remove filepath (duplicated by tab + tooltip)
- Add: git branch indicator, file size
- Mode icon + label stays
- Word count, char count, reading time stay

**T12 — Floating Toolbar Scope Fix**
- Only appears on text selection in content area
- NOT in outline, sidebar, or any other panel

### Wave 4: Demo & Polish (depends on Wave 3)

**T13 — Welcome.md Complete Rewrite**
- Full GFM showcase: all heading levels, lists, task lists, tables
- Code blocks in 6+ languages WITH syntax highlighting
- Mermaid diagrams (3+ types)
- GitHub Alerts (all 5 types)
- Images with captions
- Frontmatter demo
- Collapsible sections
- Math formulas (if KaTeX added)

**T14 — Keyboard Shortcuts Wiring**
- Ctrl+P → Quick Open
- Ctrl+W → Close tab
- Ctrl+N → New file
- Ctrl+, → Settings
- Ctrl+F → Search bar
- Ctrl+Shift+F → Search in sidebar
- Ctrl+Shift+L → Toggle sidebar
- Ctrl+Shift+T → Toggle outline
- Ctrl+E → Write mode
- Ctrl+Shift+E → Code mode
- Ctrl+Shift+P → Preview mode

**T15 — App Icon & Logo**
- Replace ◆ with proper monochrome logo
- Suggestion from product report: `#>` (heading + terminal prompt)
- SVG, scalable, works in light and dark

## Out of Scope (deferred)

- Demo mode (localStorage persistence) → E004
- MDX support → after research, separate epic
- Plugin system → much later
- Vim keybindings → backlog
- Git integration → backlog
- Minimap → backlog
- Drag-and-drop files in Explorer → backlog
- Drag-and-drop tab reorder → backlog
- Auto-save indicator → needs real backend
- Wiki-links → needs file resolution logic
- KaTeX math → nice-to-have, not core

## Acceptance Criteria

- [ ] Activity bar with Explorer + Search tabs
- [ ] Search panel with results grouped by file
- [ ] Empty state when no tabs open
- [ ] Syntax highlighting in code blocks (Shiki)
- [ ] Mermaid diagrams render correctly
- [ ] GitHub Alerts render with colors and icons
- [ ] Images clickable with lightbox
- [ ] "+" tab creates new file
- [ ] Tab context menu (Close, Close Others, Copy Path)
- [ ] Settings opens as tab
- [ ] Floating toolbar only on content selection
- [ ] All keyboard shortcuts wired
- [ ] Welcome.md showcases all features
- [ ] TypeScript passes, build succeeds
- [ ] All three themes work correctly

## Test Strategy

- Manual visual verification of each feature
- `tsc --noEmit` passes
- `vite build` succeeds
- Check all three themes (dark, light, sepia)
- Check all three modes (Visual, Code, Preview)
