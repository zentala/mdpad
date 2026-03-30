# Journal — E003: Prototype v3

## Session 2026-03-30 — Major prototype build session

### Goal
Build complete interactive React prototype of mdpad with all planned features.
CEO review + eng review → implementation.

### What Was Done

#### Planning & Review
- Created E003 PLAN.md with 17 tasks + 4 delights in 5 waves
- CEO review in EXPANSION mode — added GitHub Pages deploy, delights, tab type system
- Eng review — confirmed Context+useReducer, Shiki sync bundle, rehype-sanitize
- Product strategy research (subagent) → personas, brand story, competitive audit
- Markdown ecosystem research (subagent) → future of MD, MDX verdict (no), AGENTS.md trend
- comrak extensions planning (subagent) → E004 epic created with 9 tasks

#### Architecture
- **T00**: Refactored App.tsx to Context+useReducer (AppStateProvider)
- Tab type system: `file | settings | welcome`
- Typed actions: OPEN_FILE, CLOSE_TAB, CLOSE_OTHER_TABS, NEW_FILE, OPEN_SETTINGS, etc.

#### Content Features Implemented
- **T04**: Shiki syntax highlighting (github-dark/light, 17 languages)
- **T05**: Mermaid diagram rendering (lazy-loaded, dark/light theme matching)
- **T06**: GitHub Alerts (5 types: NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- **D1**: Copy code toast ("✓ copied" animation)
- **D2**: Outline scroll tracking (IntersectionObserver)
- **D3**: Internal link navigation (click link → opens file)

#### UI/UX Features
- **T08**: "+" tab button for new files
- **T09**: Tab context menu (Close, Close Others, Close All, Copy Path)
- **T03**: Empty state with logo, shortcuts, quick actions
- **T12**: Floating toolbar scoped to content only (not sidebar/outline)
- **T14**: Full keyboard shortcuts (Ctrl+P, W, N, comma, F, E, Shift+E/P/F/L/T)
- Undo/Redo in both toolbar AND Edit menu

#### Naming & Branding
- Renamed zntl-md → **mdpad**
- Domain: mdpad.zentala.io
- Repo: github.com/zentala/mdpad
- Mode naming iterations: Live Preview → Visual → Write; Source → Code; Reading → Read → Preview
- Final mode switcher: `✏ EDIT [Visual][Code] OR [👁 Preview]`

### Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| App name | mdpad | Short, memorable, domain available |
| State management | Context + useReducer | No new deps, typed actions |
| Syntax highlighting | Shiki sync bundle | Same as VS Code, 500KB acceptable |
| Mermaid loading | Lazy dynamic import | 1.5MB, only load when needed |
| Mode names | Write/Code/Preview → Visual/Code/Preview | "Write" confused with text input |
| Mode switcher layout | `EDIT [Visual][Code] OR [Preview]` | Labels clarify grouping |
| Breadcrumbs | Removed | Redundant with tab tooltips |
| Format menu | Removed | Toolbar replaces it |
| Theme location | View menu + quick action icon | Both accessible |
| MDX support | No (never full, maybe graceful degradation) | Not relevant for AI-dev |
| Diagram support | Mermaid v1, D2 v2 | Mermaid is what AI generates |

### Findings

#### Finding — Mode switcher went through 7 iterations
Mode naming and layout was the most iterated component. Lesson: lock down
naming conventions in UX spec BEFORE implementation next time.

#### Finding — Breadcrumbs were added and immediately removed
Implemented breadcrumb bar, user pointed out it duplicates tab info.
Lesson: challenge "standard" patterns against actual information hierarchy.

#### Finding — Mermaid needs theme re-initialization
Mermaid.js caches its theme. When app theme changes, mermaid.initialize()
must be called again before next render. Implemented in MermaidBlock.

#### Finding — comrak is now under Anthropic scope
As of Sept 2025, comrak maintenance falls under Anthropic. This is good
for long-term stability of our parser choice.

### User Feedback Captured (in vision files)

All user ideas recorded in `.plan/vision/2026-03-30-v3-ideas.md`:
- Sidebar bookmark tabs (vertical text, not VS Code activity bar)
- Search panel in sidebar
- Settings as tab (not modal)
- Zoom floating widget (content only, not whole UI)
- Image lightbox, YouTube embeds
- Mermaid/chart demos
- Demo mode (localStorage, GitHub Pages)
- Semi-visual edit mode (markdown markers semi-transparent)
- Per-repo config `.mdpad/` folder
- File icon pattern matching system (extensible, regex)
- StackEdit feature mapping
- Code editor: line numbers + active line highlight
- Search in Preview mode (design decision needed)
- Zen Mode (full screen distraction-free)
- File/folder delete and rename in Explorer

### Subagents Dispatched (this session)
1. Product strategy research → `.plan/reports/2026-03-30-product-strategy-report.md`
2. Markdown ecosystem research → `.plan/reports/2026-03-30-markdown-ecosystem-research.md`
3. comrak extensions planning → E004 epic created
4. T01 sidebar bookmarks → in progress
5. T10+T11 settings+status bar → in progress

### What's Left (E003)
- T01: Sidebar bookmark tabs (subagent working)
- T02: Search panel in sidebar
- T07: Image & media lightbox
- T10: Settings tab (subagent working)
- T11: Status bar redesign (subagent working)
- T13: Welcome.md complete rewrite
- T15: App icon & logo
- T16: GitHub Pages deploy
- D4: Count animation

### Next Steps
1. Wait for subagents, merge their work
2. Implement remaining tasks (T02, T07, T13)
3. Welcome.md rewrite with ALL features showcased
4. Deploy to GitHub Pages
5. Start E004 (comrak extensions) or E005 (Tauri integration)
