---
status: planning
created: 2026-03-30
reviewed: CEO-expansion
title: E003 — Prototype v3: Full Feature Demo + GitHub Pages Deploy
---

# E003 — Prototype v3: Full Feature Demo + GitHub Pages Deploy

## What

Third major iteration of the React prototype. Implements all remaining UX features,
adds syntax highlighting, Mermaid diagrams, and deploys to GitHub Pages as a live demo.

## Why

v2 validated core layout and mode switching. Product strategy: "the terminal for your
markdown." This epic brings the prototype to a publicly usable state — real users
can try it in the browser while we build the Tauri backend.

## Guiding Principles

1. **Real components** — everything goes into the final Tauri app
2. **Mock data, real interactions** — no backend yet, all UI flows work
3. **Design review before implementation** — this plan reviewed (CEO expansion mode)
4. **Batch implementation** — coordinated waves, parallel subagents

## Architecture Decisions

### State Management: Context + useReducer
- Extract all state from App.tsx into AppStateProvider
- useReducer for predictable state transitions
- Components consume via useContext
- No new dependencies

### Tab Type System
```typescript
type TabType = 'file' | 'settings' | 'welcome'
interface Tab {
  id: string
  type: TabType
  path?: string
  name: string
  modified?: boolean
}
```

### Shiki: Sync bundle (shiki/bundle/web)
- Bundles common languages (~500KB vs 2MB full)
- Synchronous highlighting (no async component complexity)
- Themes: github-dark + github-light, auto-match app theme

### Mermaid: Lazy loaded
- Dynamic import on first ```mermaid block encountered
- Loading spinner while module loads (~1.5MB)
- Error: inline red error box, never crash

### Security: rehype-sanitize
- Add rehype-sanitize to markdown pipeline
- Prevents XSS via raw HTML in markdown content
- Required for GitHub Pages demo mode

## Scope — Organized by Wave

### Wave 0: Foundation (before everything)

**T00 — Refactor to Context + useReducer**
- Extract AppState from App.tsx into providers/AppStateProvider.tsx
- useReducer with typed actions
- App.tsx becomes thin shell: providers → layout → modals
- All components migrate from props to useContext

### Wave 1: Layout Architecture (depends on T00)

**T01 — Sidebar Bookmark Tabs (vertical text tabs)**
- NOT VS Code activity bar (icons only) — instead: vertical text tabs like book bookmarks
- Text rotated 90° (written sideways), with icon + label
- Tabs: "Explorer" (file icon), "Search" (magnifying glass icon)
- Bookmarks visible on left edge of sidebar, even when sidebar is expanded
- Click bookmark → switches sidebar panel content (Explorer ↔ Search)
- When sidebar collapsed → only bookmarks visible (narrow, ~28px)
- When sidebar expanded → bookmarks + panel content side by side
- Visual: tall narrow elements, like physical book tabs/bookmarks
- Future: add more bookmarks (Bookmarks, Git, Extensions)

**T02 — Search Panel in Sidebar**
- Second tab content in sidebar
- Search input + results grouped by file
- Click result → opens file, scrolls to match
- Find & Replace: second input + Replace/Replace All
- Toggles: case-sensitive, regex, whole word
- Edge case: 0 results → "No results" message
- Edge case: invalid regex → "Invalid pattern" message
- Edge case: 100+ matches → virtual list, cap display

**T03 — Empty State (no file open)**
- Shown when all tabs closed (or first launch)
- App logo (monochrome), app name, version
- Recent files list (mock)
- Keyboard shortcuts grid (top 8)
- Quick actions: Open File, Open Folder
- Also shown when folder has 0 .md files

### Wave 2: Content Features (parallel, depends on Wave 1)

**T04 — Syntax Highlighting (Shiki)**
- Install shiki, use shiki/bundle/web (sync, common languages)
- Languages: TypeScript, Rust, Bash, JSON, CSS, YAML, Python, Go, SQL, HTML, MD
- Themes: github-dark (dark mode), github-light (light/sepia mode)
- Theme auto-switches when user changes app theme
- Fallback: unknown language → plain monospace (never error)
- Add rehype-sanitize to markdown pipeline

**T05 — Mermaid Diagram Rendering**
- Lazy load mermaid.js via dynamic import()
- Detect ```mermaid fenced blocks, render as SVG
- Types: flowchart, sequence, class, ER, pie, gantt, git graph
- Loading state: spinner while mermaid loads
- Error: red-bordered box with error message inline
- Theme: dark/light auto-match via mermaid.initialize()

**T06 — GitHub Alerts**
- Parse `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`
- Render as colored callout boxes with Lucide icons
- Colors: NOTE=#58a6ff, TIP=#3fb950, IMPORTANT=#d2a8ff, WARNING=#d29922, CAUTION=#f85149
- Icon mapping: NOTE→Info, TIP→Lightbulb, IMPORTANT→Star, WARNING→AlertTriangle, CAUTION→OctagonAlert

**T07 — Image & Media Handling**
- Images render inline in preview (max-width: 100%)
- Click image → ImageLightbox component (fullscreen overlay)
- Lightbox: zoom in/out, close on Escape/click-outside
- Edge case: broken URL → placeholder with "Image not found"
- Demo images in Welcome.md (use picsum.photos or similar)
- Table demo section in Welcome.md

### Wave 3: Navigation & Polish (depends on Wave 2)

**T08 — "+" Tab (New File)**
- Plus icon button after last tab in tab bar
- Click → creates "Untitled.md" tab (type: 'file')
- Debounce: allow rapid clicks (each creates new Untitled-N.md)
- Empty editor ready for typing

**T09 — Tab Context Menu**
- Right-click tab → context menu
- Items: Close, Close Others, Close All, Copy Path, Reveal in Explorer
- Close Others: closes all tabs except right-clicked one
- Reveal in Explorer: scrolls file tree to show the file

**T10 — Settings Tab**
- Opens as tab (type: 'settings'), not modal
- Ctrl+, to open
- If already open → focus existing settings tab (don't duplicate)
- Categories: General, Appearance, Editor, Preview, Files, Shortcuts
- Mock controls: toggles, dropdowns, sliders (non-functional in prototype)

**T11 — Status Bar Redesign**
- Remove filepath (duplicated by tab tooltip)
- Keep: word count, char count, reading time (with icons)
- Keep: encoding (UTF-8), line ending (LF)
- Keep: mode indicator (icon + label)
- Add: git branch mock (`main`)
- Add: file size mock (`12.4 KB`)

**T12 — Floating Toolbar Scope Fix**
- Check if selection is within content area element
- If selection is in sidebar, outline, or other panel → don't show
- Use closest() or ref comparison to determine scope

### Wave 4: Demo & Polish (depends on Wave 3)

**T13 — Welcome.md Complete Rewrite**
- Full GFM showcase with ALL features working:
  - Headings (all 6 levels)
  - Lists (ordered, unordered, nested)
  - Task lists (with checkboxes)
  - Tables (aligned columns, complex content)
  - Code blocks in 6+ languages WITH Shiki highlighting
  - Mermaid diagrams (3+ types: flowchart, sequence, pie)
  - GitHub Alerts (all 5 types)
  - Images with captions
  - Frontmatter (rendered as property card)
  - Collapsible sections (<details>)
  - Inline formatting (bold, italic, strikethrough, code)
  - Blockquotes (nested)
  - Horizontal rules
  - Links (internal + external)

**T14 — Keyboard Shortcuts Wiring**
- Full shortcut map wired to actions:
  - Ctrl+P → Quick Open
  - Ctrl+W → Close tab (e.preventDefault to override browser)
  - Ctrl+N → New file (+ tab)
  - Ctrl+, → Settings tab
  - Ctrl+F → Search bar (in-file)
  - Ctrl+Shift+F → Search panel (sidebar)
  - Ctrl+Shift+L → Toggle sidebar
  - Ctrl+Shift+T → Toggle outline
  - Ctrl+E → Write mode
  - Ctrl+Shift+E → Code mode
  - Ctrl+Shift+P → Preview mode (known browser conflict)
- Note: Ctrl+Shift+P conflicts with Chrome DevTools. Documented as known limitation for web demo. No conflict in Tauri.

**T15 — App Icon & Logo**
- Replace ◆ with monochrome SVG logo
- Concept: `#_` (markdown heading + cursor)
- Works in light and dark themes
- Used in: activity bar top, empty state, about modal, favicon

**T16 — GitHub Pages Deploy**
- GitHub Actions workflow: build on push to main
- vite build → dist/ → gh-pages branch
- Custom domain or zentala.github.io/mdpad/
- 404.html for SPA routing

### Delight Features (integrated into waves)

**D1 — Copy Code Toast** (in T04)
- "Copied!" text replaces "copy" button for 1.5s
- Subtle checkmark animation

**D2 — Outline Scroll Tracking** (in existing TocPanel)
- IntersectionObserver tracks which heading is in viewport
- Current heading highlighted in outline with accent color
- Smooth transitions between highlights

**D3 — Internal Link Navigation** (in MarkdownPreview)
- Ctrl+click on `[text](file.md)` → opens that file in tree
- Match relative paths against mock file tree
- Unknown links → console.log (future: toast "File not found")

**D4 — Count Animation** (in StatusBar)
- Word/char count animates when switching files
- Subtle number roll effect (CSS counter or requestAnimationFrame)

## Out of Scope (deferred)

| Item | Reason | When |
|------|--------|------|
| Demo mode (localStorage) | Needs own design, data model | E004 |
| MDX support | Research pending, separate epic | After research |
| Plugin system | Far future | Much later |
| Vim keybindings | Niche feature | Backlog |
| Git integration | Needs Tauri backend | Backlog |
| Minimap | Low priority | Backlog |
| Drag-and-drop (tree) | Complex, needs drag API | Backlog |
| Drag-and-drop (tabs) | Nice but not critical | Backlog |
| Auto-save indicator | Needs real backend | Backlog |
| Wiki-links | Needs file resolution | Backlog |
| KaTeX math | Not core for target users | Backlog |
| `.mdpad/` repo config | Needs Tauri FS access | Vision |
| Breadcrumbs | Removed (redundant with tabs) | Decided against |

## Acceptance Criteria

- [ ] Context+useReducer state management
- [ ] Sidebar bookmark tabs (vertical text, rotated 90°)
- [ ] Search panel with results grouped by file
- [ ] Empty state when no tabs open
- [ ] Syntax highlighting (Shiki) in code blocks
- [ ] Mermaid diagrams render correctly (3+ types)
- [ ] GitHub Alerts render (5 types with colors)
- [ ] Images clickable with lightbox
- [ ] "+" tab creates new file
- [ ] Tab context menu (Close, Close Others, Copy Path)
- [ ] Settings opens as tab
- [ ] Status bar: git branch, file size (mock)
- [ ] Floating toolbar only on content selection
- [ ] All keyboard shortcuts wired
- [ ] Outline scroll tracking (IntersectionObserver)
- [ ] Internal link navigation (Ctrl+click)
- [ ] Copy code toast animation
- [ ] Welcome.md showcases ALL features
- [ ] TypeScript passes, build succeeds
- [ ] All three themes work correctly
- [ ] Deployed to GitHub Pages

## Test Strategy

- Manual visual verification of each feature
- `tsc --noEmit` passes
- `vite build` succeeds
- Check all three themes (dark, light, sepia)
- Check all three modes (Write/Visual, Code, Preview)
- Test on Chrome, Firefox, Edge (web demo)
- Verify all keyboard shortcuts
- Verify Shiki/Mermaid re-render on theme change
