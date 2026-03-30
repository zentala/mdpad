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

### Next Steps (outdated — see session close below)

---

## Session Close 2026-03-30
- **Goal**: Build complete interactive React prototype of mdpad
- **Done**: E003 20/21 tasks complete, E004+E005 planned, all impro findings fixed
  - Commits: 7ab13c7..de9b806 (35+ commits total)
  - Renamed project zntl-md → mdpad, pushed to github.com/zentala/mdpad
  - Built: Shiki (17 langs), Mermaid diagrams, GitHub Alerts, sidebar bookmarks,
    search panel, settings tab, tab context menu, empty state, Quick Open,
    floating toolbar, zoom control, keyboard shortcuts, image lightbox
  - Architecture: Context+useReducer, typed actions, tab type system
  - Research: product strategy, markdown ecosystem, comrak extensions
- **Decisions**: React (ADR 003), Shiki (ADR 004), Context+useReducer (ADR 005),
  mode names Visual/Code/Preview, no MDX, no breadcrumbs, Mermaid v1 D2 v2
- **Findings this session**: 7 (mode churn, breadcrumbs removal, Mermaid theme,
  comrak Anthropic scope, reducer side effect, dead files, missing sanitize)
- **Improvements logged**: 15 from impro review, all fixed
- **Next**:
  1. E005 — deploy to mdpad.zentala.io (build script + GitHub Actions)
  2. E004 — comrak extensions (math, footnotes, wiki-links, emoji)
  3. E003 T16 absorbed into E005
  4. Backlog: sidebar file delete/rename, Zen mode, semi-visual edit,
     tags system, competitive research (Mark Text, Joplin, StackEdit)

---

### Finding 2026-03-30 — E004/E005 Plan Review

**E004 (comrak Extensions) — Scope & Structure**

Strengths:
- Excellent extension inventory: clear MUST/SHOULD/COULD/WON'T categories with solid rationale
- Smart remark/rehype mapping identifies existing packages vs custom plugins (5 new packages + custom plugins under 50 lines)
- Dependencies between waves are clean: Wave 1 foundational, Wave 2 builds on it, Wave 3 is standalone content
- Good test strategy: clear distinction between unit (custom plugins), integration (pipeline), visual (themes)

Concerns:
- **T08 is undersized**: groups 4 independent features (Insert, Multiline Blockquotes, Description Lists, Spoiler) into one task. Each is a custom plugin + CSS styling + tests. Recommend splitting into T08 (Insert + Multiline) and T09 (Description Lists + Spoiler) to reduce cognitive load per agent.
- **Welcome.md scope unclear**: T09 says "extend Welcome.md" but doesn't define content. Vision file `2026-03-30-comrak-extensions-spec.md` is referenced but example structure isn't sketched. Recommend adding a subsection here showing 1-2 example layouts.
- **Wave 3 has only 1 task**: could move T09 (Welcome.md) into E003 as part of prototype completion instead — Welcome.md is documentation, not architecture. If you keep it in E004, confirm whether T09 blocks anything in E005 (site deploy).

Recommendations:
- Split T08 into two tasks for parallel execution
- Add example "extension section" structure to PLAN.md (what should Welcome.md showcase look like?)
- Consider: is Welcome.md rewrite E004 or E003 scope? (Blocks E005's website deploy if in E004)

---

**E005 (Website Deploy) — Scope & Execution**

Strengths:
- Clear architecture decision: content generation at build time (no runtime fetch), solves bundle transparency
- Good constraint clarity: hardcoded mock data → TypeScript generation, GitHub Pages routing, file filtering
- Test strategy is realistic: unit (build script), integration (full pipeline), E2E (post-deploy)
- Eliminates meta-circular risk by excluding `prototype/` folder from content

Concerns:
- **Missing task structure**: PLAN.md has no task breakdown. No T01, T02, etc. It's acceptance criteria + architecture, but no "how to execute" (ORCHESTRATOR.md context). What are the concrete steps? Recommend creating detailed ORCHESTRATOR.md.
- **Dependency on E003**: Welcome.md → REFERENCE.md rename is assumed. If E004/E003 delays this rename, E005 breaks. Confirm timing.
- **Build script complexity underestimated**: generating TypeScript with proper tree structure + file content record is non-trivial. Test strategy mentions it but PLAN.md doesn't detail the algorithm.
- **404.html routing untested**: SPA 404 trick is common but GitHub Pages behavior varies by repo config. Recommend explicit E2E step to verify custom domain + SPA routing together.

Recommendations:
- **Write ORCHESTRATOR.md** with explicit tasks: build script, Vite config, Actions workflow, DNS setup, E2E verification
- **Add task**: "Verify SPA routing + custom domain on GitHub Pages" (often has subtle CNAME/apex domain interaction)
- **Clarify dependency**: document that E005 depends on E003 finishing Welcome.md → REFERENCE.md rename
- **Document build script algorithm**: pseudo-code or algorithm section (tree traversal, file filtering, TypeScript gen)

---

**E004 → E005 Dependency**

Current assumption: E004 (extensions) completes before E005 (deploy). This is safe IF Welcome.md showcase doesn't block initial deploy. Recommend:
- E005 can proceed with current Welcome.md (or rename it REFERENCE.md as-is)
- E004's Welcome.md extension showcase is a post-deploy enhancement, not a blocker
- If you want showcase in initial deploy, make it an E005 task, not E004

---

**Overall Assessment**

Both plans are solid. E004 is well-researched and task-breakdown is clean (with split recommendation). E005 needs task detail (ORCHESTRATOR.md) and dependency clarification. No architectural red flags — both respect prototype architecture and follow incremental delivery.

Estimated execution: E004 = 3-4 days (8 parallel tasks), E005 = 1-2 days (2-3 sequential tasks, assuming build script is straightforward).

---

## Session 2026-03-30 (second) — UI Polish + Settings + Bugfixes

### Goal
UI polish session: sidebar tabs, logo, Settings brainstorm + implementation, E004 bugfixes via subagents, competitive research, SEO/English review.

### Done (12 commits: 53d0fd3..d96773e)
- **Logo**: Iosevka Bold SVG paths → `Logo` component reused in MenuBar, AboutModal, EmptyState, favicon (ADR-006)
- **Sidebar tabs**: floating layout (no gap), mono font, hover transitions, no double border
- **PanelHeader**: reusable component for Explorer/Search headers, exported `panelActionBtn` class
- **TabBar above Toolbar**: tabs always visible, toolbar only for file tabs
- **StatusBar**: hides file info when no file, removed mode display (MenuBar is source of truth), real file size
- **Settings**: brainstormed → designed → implemented. Centered container, stacked sections (General, Appearance, Editor, Preview, Files). File extensions as toggles, exclude patterns with add/remove. Theme dropdown syncs with AppState.
- **Search**: Replace toggle in header, replace input appears on toggle
- **E004 bugfixes** (subagent, worktree): subscript fix (singleTilde:false), wiki-link colors+click+anchor scroll
- **External links**: now open in new tab instead of being blocked
- **Competitive research** (subagent): docsify.js, grip, glow → feature mapping report
- **SEO/English review** (subagent): TLS cert issue, missing og:image, capitalization fixes → report
- **Impro review**: 14 findings, all fixed (external links, Settings sync, :global antipattern, magic values, clipboard catch, CLAUDE.md, ADR-006, favicon ratio)

### Decisions
- Settings layout: simple stacked sections, no sidebar nav (user chose option C)
- Logo font: Iosevka Bold (narrowest monospace, compact `#>`) → ADR-006
- Folders collapsed by default in file tree
- Mode display removed from StatusBar (no duplication with MenuBar)

### Findings this session: 3
1. Settings button in MenuBar had no onClick handler (silent no-op)
2. External links were blocked by blanket `e.preventDefault()` on all `<a>` tags
3. `snapshot.md` (stale Playwright dump) appeared in file tree

### Improvements logged: 14 (from impro), all resolved

### Next
1. Settings localStorage persistence (currently mock state only)
2. TLS cert fix for mdpad.zentala.io (SEO review finding)
3. SEO fixes: og:image, meta description, robots.txt
4. English fixes: comrak attribution (GitLab not GitHub), capitalization
5. Multiline blockquote bug (still open from E004)
6. Tests for new components (Logo, PanelHeader, SettingsView)
7. Competitive research ideas: auto dark/light from OS, named theme presets
