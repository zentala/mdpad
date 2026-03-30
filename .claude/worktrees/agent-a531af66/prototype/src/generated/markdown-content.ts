// AUTO-GENERATED — do not edit manually

export const generatedMarkdownFiles: Record<string, string> = {
  ".arch/ADR/001-tauri-v2-runtime.md": `# ADR 001: Use Tauri v2 as Application Runtime

- **Status**: accepted
- **Date**: 2026-03-28
- **Epic**: E001

## Context
Need a desktop runtime for a lightweight markdown viewer. Must be small (<15MB),
fast startup (<0.5s), cross-platform, and support Rust backend logic.

## Decision
Use Tauri v2 with system WebView (WebView2 on Windows, WebKit on macOS/Linux).

## Alternatives
- **Electron**: rejected — 80-150MB installer, 150-300MB RAM, 1-2s startup.
  Every major markdown editor (Obsidian, Typora, Mark Text, Zettlr) uses Electron.
  We want to differentiate on size and speed.
- **Qt/GTK native**: rejected — higher dev complexity, no web rendering for markdown.
- **.NET/WPF**: rejected — Windows-only (Markdown Monster approach).

## Consequences
- Binary ~10MB, RAM ~30-50MB, startup <0.5s
- Frontend must be web-compatible (no Node.js APIs)
- Backend logic in Rust (learning curve, but enables comrak parser)
- WebView rendering may differ across platforms (WebView2 vs WebKit)
- Tauri v2 is stable (released Oct 2024), production-ready
`,
  ".arch/ADR/002-comrak-parser.md": `# ADR 002: Use comrak as Markdown Parser

- **Status**: accepted
- **Date**: 2026-03-28
- **Epic**: E001

## Context
Need a markdown parser with full GFM (GitHub Flavored Markdown) support:
tables, task lists, strikethrough, autolinks, fenced code blocks.

## Decision
Use comrak (Rust crate) — a port of cmark-gfm from C.

## Alternatives
- **pulldown-cmark**: faster, event-based, used by mdBook/rustdoc.
  Rejected — lacks full GFM extension support (no task lists, autolinks).
- **markdown (crate)**: less popular, smaller community.
- **JS parsers (marked, remark, markdown-it)**: would work in WebView but
  miss the opportunity to parse in Rust backend for better performance.

## Consequences
- Full GFM compatibility out of the box
- Production-proven: used by GitLab, Deno, docs.rs, crates.io
- Parsing happens in Rust backend → HTML sent to WebView via IPC
- Slightly slower than pulldown-cmark but GFM support is worth it
`,
  ".arch/ADR/003-react-frontend.md": `# ADR 003: Use React for Frontend

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E002

## Context
Need a frontend framework for the Tauri WebView. Options: Svelte, React, vanilla.

## Decision
React + TypeScript with Vite bundler.

## Alternatives
- **Svelte**: smaller bundle, simpler syntax. Rejected — smaller ecosystem,
  fewer developers familiar, harder to find component libraries.
- **Vanilla JS**: Inkwell uses this. Rejected — too much boilerplate for
  complex UI (tabs, modals, panels, state management).

## Consequences
- Rich ecosystem (Lucide, react-markdown, Shiki, Mermaid all have React bindings)
- TypeScript-first with strong type inference
- Context + useReducer for state (no extra deps)
- Larger bundle than Svelte but acceptable for desktop app
`,
  ".arch/ADR/004-shiki-syntax-highlighting.md": `# ADR 004: Use Shiki for Syntax Highlighting

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E003

## Context
Need syntax highlighting for code blocks in markdown preview.

## Decision
Shiki with sync web bundle (github-dark + github-light themes).

## Alternatives
- **Prism.js** (~50KB): rejected — older token-based system, less accurate
  than VS Code TextMate grammars, different colors than what devs expect.
- **Highlight.js** (~100KB): rejected — similar issues to Prism.
- **Shiki lazy per-language**: rejected — async complexity, flash of
  unhighlighted content. Sync bundle (~500KB) is acceptable for desktop.

## Consequences
- Highlighting identical to VS Code (same TextMate grammars)
- 500KB added to bundle (one-time download, instant from disk in Tauri)
- 17 languages supported out of the box
- Theme auto-switches with app theme
`,
  ".arch/ADR/005-context-usereducer.md": `# ADR 005: Use Context + useReducer for State Management

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E003

## Context
App.tsx grew to 190+ lines with 10+ useState calls. Needed centralized state.

## Decision
React Context + useReducer with typed actions. No external state library.

## Alternatives
- **Zustand** (~1KB): rejected — adds dependency for what useReducer handles.
  Migration path exists if needed later.
- **Keep useState in App.tsx**: rejected — unsustainable at 20+ features.
- **Redux**: rejected — overkill for a desktop app prototype.

## Consequences
- Zero new dependencies
- Typed actions (OPEN_FILE, CLOSE_TAB, SET_THEME, etc.)
- Derived state computed in provider (showToolbar, showToc, activeMarkdown)
- Easy to test reducer in isolation
- Tab type system (file | settings | welcome) cleanly modeled
`,
  ".arch/ADR/006-iosevka-svg-logo.md": `# ADR 006: Iosevka Bold SVG Paths for Logo

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E003

## Context

The mdpad logo \`#>\` was originally rendered as text using the browser's monospace font
fallback. This meant the logo looked different across browsers and OSes depending on
installed fonts. Favicon (32px) was especially inconsistent.

## Decision

Use **Iosevka Bold** glyph outlines converted to SVG \`<path>\` elements. The paths are
embedded directly in a reusable \`Logo\` React component and in \`favicon.svg\` / \`logo.svg\`.

## Alternatives

1. **Web font loading** — Load Iosevka as a web font. Rejected: FOUT in favicon, extra
   HTTP request, font won't load in SVG favicon context.
2. **JetBrains Mono paths** — Wider glyphs, less compact \`#>\`. Iosevka is narrower,
   making the two-character logo more square/compact.
3. **Keep text rendering** — Different on every browser. Unacceptable for brand identity.

## Consequences

- Logo looks identical everywhere (browser tab, MenuBar, AboutModal, EmptyState)
- No font dependency — pure SVG paths
- \`prefers-color-scheme\` media query in favicon SVG adapts to OS dark/light
- Single \`Logo\` component with \`size\` and \`color\` props for all uses
`,
  ".arch/ADR/_template.md": `# ADR NNN: Title

- **Status**: proposed | accepted | superseded | deprecated
- **Date**: YYYY-MM-DD
- **Epic**: ENNN

## Context
Why this decision was needed.

## Decision
What we chose.

## Alternatives
What we rejected and why.

## Consequences
What follows from this decision.
`,
  ".arch/ARCHITECTURE.md": `# Architecture — mdpad

## Overview

mdpad is a lightweight desktop Markdown viewer built with Tauri v2.
It renders Markdown files with full GFM support using the comrak parser in Rust,
served through the system WebView.

## System Design

\`\`\`
┌─────────────────────────────────────────────┐
│              Tauri Window                    │
│  ┌──────────┬────────────────┬───────────┐  │
│  │ File     │   Markdown     │   TOC     │  │
│  │ Tree     │   Preview      │  Outline  │  │
│  │          │                │           │  │
│  │ .md      │   Rendered     │  H1       │  │
│  │ .md      │   HTML from    │   H2      │  │
│  │ .md      │   comrak       │   H2      │  │
│  │          │                │  H1       │  │
│  └──────────┴────────────────┴───────────┘  │
│  └─ Status Bar ─────────────────────────┘   │
└─────────────────────────────────────────────┘
         │                    ▲
         │ IPC commands       │ Rendered HTML
         ▼                    │
┌─────────────────────────────────────────────┐
│              Rust Backend                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ File     │  │ comrak   │  │ File      │ │
│  │ System   │  │ Parser   │  │ Watcher   │ │
│  │ Scanner  │  │ (GFM)    │  │ (notify)  │ │
│  └──────────┘  └──────────┘  └───────────┘ │
└─────────────────────────────────────────────┘
\`\`\`

## Tech Choices

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Runtime | Tauri v2 | Small binary (~10MB), native WebView, Rust backend |
| Markdown parser | comrak | Full GFM, production-proven (GitLab, Deno) |
| File watching | notify (Rust) | Cross-platform FS events |
| Frontend | TBD | Svelte (small bundle) or React (ecosystem) |
| Diagrams | Mermaid.js | De facto standard for markdown diagrams |
| Math | KaTeX | Faster than MathJax, good enough for devs |
| Syntax highlight | Prism.js or highlight.js | Code block coloring |

## Key ADRs

- [ADR 001 — Tauri v2 Runtime](ADR/001-tauri-v2-runtime.md)
- [ADR 002 — comrak Parser](ADR/002-comrak-parser.md)
- [ADR 003 — React Frontend](ADR/003-react-frontend.md)
- [ADR 004 — Shiki Syntax Highlighting](ADR/004-shiki-syntax-highlighting.md)
- [ADR 005 — Context + useReducer](ADR/005-context-usereducer.md)

## Reports

- [Market Research](../.plan/reports/2026-03-28-market-research.md) — competitive landscape analysis
- [UX Vision](../.plan/vision/2026-03-28-ux-vision.md) — detailed UX specification
`,
  ".arch/HISTORY.md": `# History — mdpad

## 2026-03-28 — Project inception
- Market research: analyzed 15+ markdown editors (Typora, Obsidian, Mark Text, etc.)
- Identified niche: no good lightweight CLI-launchable markdown viewer with file tree
- Tauri ecosystem explored: Inkwell, MarkFlowy, Otterly, MarkditorApp
- Decision: Tauri v2 + comrak + Svelte/React frontend
- UX vision document created
`,
  ".plan/BACKLOG.md": `# Backlog — mdpad

## Epics
- [E001 — Project Bootstrap](epics/E001-2026-03-28-project-bootstrap/PLAN.md) — research, UX vision, project setup
- [E002 — Prototype v2](epics/E002-2026-03-30-prototype-v2/PLAN.md) — UX refinements, Lucide icons, tabs, mode rename
- [E003 — Prototype v3](epics/E003-2026-03-30-prototype-v3/PLAN.md) — full feature demo: activity bar, search, Shiki, Mermaid, settings
- [E004 — comrak Extensions](epics/E004-2026-03-30-comrak-extensions/PLAN.md) — math, footnotes, wiki-links, highlight, emoji, sup/sub, spoiler
- [E005 — Website Deploy](epics/E005-2026-03-30-website-deploy/PLAN.md) — deploy prototype to mdpad.zentala.io as live demo + docs site

## Ideas — High Priority
- [ ] **Logo \`#>\` tooltip** — hover on logo should show app name "mdpad" (currently no tooltip)
- [ ] **Settings tab — plan & implement** — define what settings the app has, save to localStorage. Minimum: theme (already switchable but not persisted), font size, sidebar width, default mode (Visual/Code/Preview). Settings tab UI already exists as mock — wire it to real localStorage persistence
- [ ] **Persist theme in localStorage** — remember last selected theme (dark/light/sepia) across sessions. Currently resets to dark on every page load
- [ ] **Unified SVG logo** — use \`logo.svg\` (\`#>\` in JetBrains Mono) everywhere: MenuBar icon (replace hardcoded text), empty state, about modal, favicon, OG image, README badge. Single source: \`prototype/public/logo.svg\`
- [ ] Demo mode — deploy to GitHub Pages, localStorage persistence for edits → partially covered by [E005](epics/E005-2026-03-30-website-deploy/PLAN.md)
- [ ] Floating toolbar only on content selection (not outline/sidebar)
- [ ] File status indicators (open dot, unsaved dot) on file tree icons
- [ ] Empty states (no file open, empty folder, file not found)
- [ ] Breadcrumb navigation above content
- [ ] Syntax highlighting via Shiki (github-dark + github-light themes)
- [ ] GitHub Alerts rendering (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- [ ] KaTeX math rendering ($inline$, $$block$$) — planned in E004-T02
- [ ] Wiki-links [[page]] → navigate to file — planned in E004-T07 (prototype decoration; full resolution needs Tauri)
- [ ] Drag-and-drop .md files onto window to open
- [ ] Recent files on empty state / startup
- [ ] Folder chevron+icon combined (single element, not separate)
- [ ] JSON/YAML file viewer — render YAML/JSON with syntax highlighting and structured view (catalog-info.yaml already in file tree but not rendered in preview)
- [ ] Scroll position memory per file
- [ ] Image demo: inline images, click to enlarge, copy link, context menu
- [ ] YouTube embed demo: embedded videos in markdown
- [ ] Table demo: full GFM table showcase in Welcome.md
- [ ] Image lightbox: click image → fullscreen overlay with zoom
- [ ] Mermaid/chart rendering demo (flowchart, sequence, ER, pie, gantt)
- [ ] Empty state / welcome page when no tabs open (like VS Code)
- [ ] Settings page as a tab (like VS Code settings)
- [ ] Tabs always visible (even with 1 tab)
- [ ] MDX support research and potential implementation
- [ ] Research: future of Markdown, new flavors, AI dev context needs

- [ ] Research StackEdit (stackedit.io) features — map and adopt relevant ones
- [ ] Delete files/folders from Explorer (right-click → Delete, confirm dialog)
- [ ] Undo/Redo buttons in toolbar (before Bold/Italic, remove from Edit menu)
- [ ] Rename files/folders in Explorer (right-click → Rename, inline input)
- [ ] Mermaid theme matching (dark/light/sepia should change diagram colors)
- [ ] Standalone files in CAPS LOCK (WELCOME.md, REFERENCE.md, README.md)

- [ ] Code editor: line numbers + active line highlight (subtle background)
- [ ] Search in Preview mode — currently search bar tied to toolbar (edit only). Need search accessible in all modes. Design decision needed.
- [ ] Zen Mode — full screen distraction-free view. Design: what's visible? Just content? Status bar? How to exit?
- [ ] Semi-visual edit mode — markdown markers (##, >, **) shown semi-transparent alongside rendered content (like StackEdit left pane). Possibly 3 edit sub-modes: Full Visual, Semi-Visual (default), Code

## Research — Competitive Feature Mapping
- [ ] Research Mark Text (marktext/marktext) — feature map, what to adopt
- [ ] Research Joplin (joplinapp.org) — note-taking features, tags, notebooks
- [ ] Research Calmly Writer (calmlywriter.com) — distraction-free writing UX
- [ ] Research docsify.js (https://docsify.js.org) — investigate features, helpers, plugins, what to adopt for mdpad
- [ ] Research grip (Python GitHub MD renderer) — compare rendering approach
- [ ] Research glow (Go terminal MD viewer by Charmbracelet) — TUI file browser ideas
- [ ] AI agent skill for mdpad — Claude Code skill to display formatted MD to users (unique differentiator)

## Vision — Future Modes (explore after v1 dev mode is complete)
- [ ] Tags system — YAML frontmatter tags, reusable across app, tag browser panel
- [ ] Folder as knowledge base — folder = notebook, browse/search/tag across files
- [ ] Three app modes (long-term vision, may be overkill):
  - Developer mode (current) — browse project .plan/.arch files
  - Note-taking mode — notebooks, tags, daily notes
  - Writer mode — distraction-free, chapter structure, word count goals
- [ ] Evaluate if multi-mode is worth it or if dev mode + tags covers enough

## Bugs / Fixes (E004 follow-up)
- [ ] **Subscript broken** — \`H~2~O\` renders as strikethrough (H̶2̶O) instead of subscript (H₂O). GFM \`~text~\` = strikethrough conflicts with \`~text~\` = subscript. Need conflict resolution: single \`~\` = sub, double \`~~\` = strikethrough
- [ ] **Multiline blockquote broken** — \`>>>\` renders as 3 nested blockquotes instead of single multiline block. remarkMultilineBlockquote plugin not working correctly
- [ ] **Wiki-links not clickable** — \`[[README]]\` and \`[[Architecture Overview|.arch/ARCHITECTURE]]\` render but are not interactive (no click handler)
- [ ] **Wiki-links wrong color** — link color doesn't match current theme skin (dark/light/sepia)
- [ ] **Anchor links broken for multi-file context** — \`#user-content-math-katex\` lacks file path prefix. Should be \`/Welcome.md#math-katex\` (dynamic from current file). Hover on heading shows nothing — only copy gives broken link
- [ ] **No tests for E004 extensions** — 11 remark/rehype plugins with zero test coverage. Need unit tests for each plugin + integration test for full pipeline

## Ideas — Lower Priority
- [ ] Plugin system (later — keep simple first)
- [ ] Vim keybindings
- [ ] Git integration (show diffs in preview, git status in file tree)
- [ ] Template system for new markdown files
- [ ] Adopt main/dev branching model
- [ ] Backlinks panel ("linked from this file")
- [ ] Section folding by heading
- [ ] Footnotes, highlight ==text==, emoji :shortcodes: — all planned in E004
- [ ] Graph view (Obsidian-style)

## Research
- [Market Research](reports/2026-03-28-market-research.md) — competitive landscape
- [UX Vision](vision/2026-03-28-ux-vision.md) — detailed UX specification
- [UX Refinement Notes](vision/2026-03-30-ux-refinement-notes.md) — user feedback, stream of consciousness
- [V3 Ideas](vision/2026-03-30-v3-ideas.md) — sidebar tabs, search panel, zoom, settings, demo mode
- [Feature Research](reports/2026-03-30-feature-research.md) — GFM spec, markdown extensions, editor patterns, code highlighting
- [Product Strategy Report](reports/2026-03-30-product-strategy-report.md) — personas, value prop, brand, competitive UX audit, feature prioritization
- [comrak Extensions Spec](vision/2026-03-30-comrak-extensions-spec.md) — Welcome.md content spec for E004 extension showcase
- [Product Vision Brainstorm](vision/2026-03-30-product-vision-brainstorm.md) — competitive landscape, 4 operating modes, AI agent integration

## Reference Examples
- [examples/](../examples/) — git submodules of Tauri markdown editors
`,
  ".plan/DONE.md": `# Completed Tasks — mdpad

- [x] [E001-T01 — Market Research](epics/E001-2026-03-28-project-bootstrap/tasks/E001-T01-market-research.md) — E001, 2026-03-28
- [x] [E001-T02 — UX Vision](epics/E001-2026-03-28-project-bootstrap/tasks/E001-T02-ux-vision.md) — E001, 2026-03-28
- [x] [E001-T03 — Example Submodules](epics/E001-2026-03-28-project-bootstrap/tasks/E001-T03-example-submodules.md) — E001, 2026-03-28
- [x] E003-T00 — Context + useReducer refactor — E003, 2026-03-30
- [x] E003-T01 — Sidebar Bookmark Tabs — E003, 2026-03-30
- [x] E003-T02 — Search Panel in Sidebar — E003, 2026-03-30
- [x] E003-T03 — Empty State — E003, 2026-03-30
- [x] E003-T04 — Shiki Syntax Highlighting — E003, 2026-03-30
- [x] E003-T05 — Mermaid Diagram Rendering — E003, 2026-03-30
- [x] E003-T06 — GitHub Alerts — E003, 2026-03-30
- [x] E003-T07 — Image & Media Lightbox — E003, 2026-03-30
- [x] E003-T08 — "+" Tab (New File) — E003, 2026-03-30
- [x] E003-T09 — Tab Context Menu — E003, 2026-03-30
- [x] E003-T10 — Settings Tab — E003, 2026-03-30
- [x] E003-T11 — Status Bar Redesign — E003, 2026-03-30
- [x] E003-T12 — Floating Toolbar Scope Fix — E003, 2026-03-30
- [x] E003-T13 — Welcome.md Complete Rewrite — E003, 2026-03-30
- [x] E003-T14 — Keyboard Shortcuts Wiring — E003, 2026-03-30
- [x] E003-T15 — App Icon & Logo — E003, 2026-03-30
- [x] E003-D1 — Copy Code Toast — E003, 2026-03-30
- [x] E003-D2 — Outline Scroll Tracking — E003, 2026-03-30
- [x] E003-D3 — Internal Link Navigation — E003, 2026-03-30
- [x] E003-D4 — Count Animation — E003, 2026-03-30
- [x] E005-T01 — Build content script — E005, 2026-03-30
- [x] E005-T02 — Rename Welcome.md to REFERENCE.md — E005, 2026-03-30
- [x] E005-T03 — Wire generated content with mock fallback — E005, 2026-03-30
- [x] E005-T04 — Vite config for GitHub Pages — E005, 2026-03-30
- [x] E005-T05 — GitHub Actions deploy workflow — E005, 2026-03-30
- [x] E005-T06 — Cloudflare DNS + GitHub Pages config — E005, 2026-03-30
- [x] E005-T07 — README rewrite — E005, 2026-03-30
`,
  ".plan/IMPROVEMENTS.md": `# Global Improvements — mdpad

(No entries yet — quality catches will be logged here by the Stop hook.)
`,
  ".plan/STATE.md": `---
updated: 2026-03-30T12:30:00Z
active_epic: none
active_epic_path: none
current_wave: none
---

## Status
E005 website deploy: 7/7 tasks complete. Site live at https://mdpad.zentala.io (TLS cert issue).
E004 comrak extensions: 9/9 complete + 4 bugfixes applied (subscript, wiki-links, anchors).
E003 prototype v3: 20/21 complete (T16 → E005, done).

## Completed This Session
- UI polish: Logo SVG (Iosevka), sidebar tabs floating, PanelHeader reusable, TabBar above Toolbar
- Settings: brainstormed + implemented (centered container, 5 sections, toggles, dropdowns)
- StatusBar: conditional file info, removed mode display
- E004 bugfixes (subagent): subscript, wiki-link color/click, anchor scroll
- Competitive research (subagent): docsify.js, grip, glow
- SEO/English review (subagent): 14 recommendations
- Impro review: 14 findings, all resolved
- ADR-006: Iosevka Bold SVG logo

## Next Steps
1. Settings localStorage persistence
2. TLS cert fix for mdpad.zentala.io
3. SEO fixes (og:image, meta description, robots.txt)
4. English fixes (comrak attribution, capitalization)
5. Multiline blockquote bug
6. Tests for new components (Logo, PanelHeader, SettingsView)
7. Auto dark/light from OS (competitive research recommendation)
`,
  ".plan/epics/E000-maintenance/IMPROVEMENTS.md": `# Improvements — E000: Maintenance

(No entries yet.)
`,
  ".plan/epics/E000-maintenance/JOURNAL.md": `# Journal — E000: Maintenance

(Permanent epic for small/misc changes.)
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/IMPROVEMENTS.md": `# Improvements — E001: Project Bootstrap

(No entries yet.)
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/JOURNAL.md": `# Journal — E001: Project Bootstrap

## Session 2026-03-28

### Finding 2026-03-28 — Tauri markdown niche is open
Market research revealed no dominant Tauri-based markdown viewer.
Inkwell is closest but paywalls export features. MarkFlowy is beta.
Mark Text (Electron, 55k stars) is abandoned since 2022.
→ Clear opportunity for a lightweight, CLI-first viewer.

### Finding 2026-03-28 — UX vision completed
Agent produced 1067-line [UX specification](../../vision/2026-03-28-ux-vision.md) covering
all menus, context menus, settings, keyboard shortcuts, 3 editor modes, file watcher,
accessibility, and P0-P3 feature priority matrix. Based on analysis of Typora, Obsidian,
Mark Text, VS Code, Zettlr, and Inkwell.

### Finding 2026-03-28 — comrak is the right parser
comrak (Rust) has full GFM support and is used by GitLab, Deno, docs.rs.
pulldown-cmark is faster but lacks GFM extensions.
→ Decision: use comrak.

- **Goal**: bootstrap project, research market, define UX
- **Done**: market research complete, project structure created
- **In progress**: UX vision document (agent running)
- **Next**: add example submodules, complete UX vision

## Session 2026-03-30 (auto — session ended without done.)
- **Note**: Session ended without \`done.\` command. No journal was written.
- **State at exit**: see STATE.md for last known state
- **Action needed**: next session should review what happened and write proper journal
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/ORCHESTRATOR.md": `# Orchestrator — E001: Project Bootstrap

## Wave 1 (parallel)
- [x] E001-T01 — Market research
- [x] E001-T02 — UX vision document
- [x] E001-T03 — Example submodules

## Dependencies
None — all tasks are independent.
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/PLAN.md": `# E001 — Project Bootstrap

## What
Set up mdpad project: research market, define UX vision, bootstrap project structure,
add reference examples.

## Why
Before writing code, we need clear understanding of the competitive landscape,
a detailed UX specification, and properly structured project files.

## Scope
- Market research on existing markdown viewers
- Detailed UX vision document
- Project structure (.plan/, .arch/, .claude/)
- Reference examples as git submodules
- CLAUDE.md, catalog-info.yaml, README.md

## Acceptance Criteria
- [x] Market research report written and linked
- [x] UX vision document with all menus, panels, shortcuts defined
- [x] Project structure bootstrapped
- [x] Example repos added as submodules
- [x] All docs linked in documentation tree (no orphans)

## Reports
- [Market Research](../../../.plan/reports/2026-03-28-market-research.md)
- [UX Vision](../../vision/2026-03-28-ux-vision.md)

## Tasks
- [E001-T01 — Market Research](tasks/E001-T01-market-research.md)
- [E001-T02 — UX Vision](tasks/E001-T02-ux-vision.md)
- [E001-T03 — Example Submodules](tasks/E001-T03-example-submodules.md)
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/tasks/E001-T01-market-research.md": `---
id: E001-T01
epic: E001
status: done
created: 2026-03-28
completed: 2026-03-28
---
# E001-T01: Market Research

Research existing desktop markdown viewers/editors.
Analyze competitive landscape, identify gaps, evaluate Tauri feasibility.

## Output
- [Market Research Report](../../../reports/2026-03-28-market-research.md)
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/tasks/E001-T02-ux-vision.md": `---
id: E001-T02
epic: E001
status: done
created: 2026-03-28
completed: 2026-03-28
---
# E001-T02: UX Vision Document

Create detailed UX specification: all menus, context menus, settings panels,
keyboard shortcuts, editing behavior, panel layouts, status bar.

## Output
- [UX Vision](../../../vision/2026-03-28-ux-vision.md)
`,
  ".plan/epics/E001-2026-03-28-project-bootstrap/tasks/E001-T03-example-submodules.md": `---
id: E001-T03
epic: E001
status: done
created: 2026-03-28
completed: 2026-03-28
---
# E001-T03: Add Example Submodules

Add reference Tauri markdown editors as git submodules in examples/ folder:
- Inkwell
- MarkFlowy
- Otterly
- MarkditorApp
`,
  ".plan/epics/E002-2026-03-30-prototype-v2/PLAN.md": `---
id: E002
status: in-progress
created: 2026-03-30
---

# E002 — Prototype v2: UX Refinements + Feature Expansion

## What

Refine the interactive React prototype based on user feedback and research findings.
Rename modes, restructure layout, add missing features, improve visual polish.

## Why

v1 prototype validated the core concept. User feedback identified several UX issues:
toolbar scope, mode naming confusion, missing interactivity, icon quality.
Research revealed must-have features (alerts, math, syntax highlighting).

## User Feedback Summary

### 1. Mode Renaming
- ~~"Live Preview"~~ → **"Visual"** (visual WYSIWYG-style editor)
- ~~"Source"~~ → **"Code"** (raw markdown source code)
- ~~"Reading"~~ → **"Read"** (read-only, no editing)
- Conceptual split: **Edit** (Visual | Code) vs **Read**

### 2. Layout: Toolbar Scope
- Toolbar MUST be only above the main text area
- NOT spanning full width across sidebar + text + toc
- Explorer sidebar extends to full height (menu bar to status bar)
- Outline panel extends to full height
- Only the center column has: toolbar → content

### 3. Mode Switcher Redesign
- Add icons to mode buttons
- Two conceptual levels: Edit vs Read
- Edit has sub-modes: Visual (rendered) and Code (raw markdown)
- Consider: segmented control with icon+label

### 4. File Tree Improvements
- **+ button must work** — mock creating a new file (input field appears)
- **Better file icons** — special icons for known files:
  - README.md → book icon
  - BACKLOG.md → list icon
  - STATE.md → dashboard icon
  - ARCHITECTURE.md → building icon
  - ADR/*.md → gavel/decision icon
  - PLAN.md → map icon
  - JOURNAL.md → notebook icon
  - ORCHESTRATOR.md → conductor icon
  - IMPROVEMENTS.md → lightbulb icon
  - DONE.md → checkmark icon
  - Folder icons: different for .plan/, .arch/, .claude/
- **Hide non-viewable files** — catalog-info.yaml, .json, .yaml NOT shown
  (future: add support for viewing them; for now hide)

### 5. Toolbar Visual Polish
- ALL icons same color (monochrome, no blue emoji)
- Icons BIGGER (current too small)
- Clean, consistent icon style (SVG or Unicode symbols)

### 6. Research-Driven Features (must-have)

#### GitHub Alerts
Render \`> [!NOTE]\`, \`> [!TIP]\`, \`> [!IMPORTANT]\`, \`> [!WARNING]\`, \`> [!CAUTION]\`
as colored callout boxes with icons. comrak supports this natively.

#### Syntax Highlighting
Add Shiki (or Prism.js) for proper code coloring.
Must support: TypeScript, Rust, Bash, JSON, CSS, YAML, Python, Go, SQL, HTML, Markdown.

#### Math Rendering
KaTeX for \`$inline$\` and \`$$block$$\` math expressions.

### 7. Research-Driven Features (nice-to-have, high ROI)

- **Wiki-links** \`[[page]]\` → navigate to file in folder
- **Breadcrumb navigation** — path to current file above content
- **Reading time** in status bar
- **Footnotes** \`[^1]\` rendering
- **Highlight** \`==text==\` rendering
- **Emoji shortcodes** \`:rocket:\` → 🚀
- **Scroll position memory** per file
- **Section folding** by heading

## Architecture Decisions

### Non-markdown files: hide for now
- Only show .md and .markdown files in file tree
- Future epic: add JSON/YAML viewer, image preview
- ADR: not needed (simple scope decision, reversible)

### Toolbar placement
- Toolbar is a child of the main content column, NOT a global bar
- This means AppShell layout changes: sidebar and toc span full height
- Toolbar + search bar + content are all inside the center column

## Acceptance Criteria

- [ ] Modes renamed: Visual / Code / Read
- [ ] Toolbar only above text area (sidebar/toc full height)
- [ ] Mode switcher with icons
- [ ] File tree: + creates mock file, better icons, non-md hidden
- [ ] Toolbar icons: monochrome, bigger, consistent
- [ ] GitHub Alerts rendering
- [ ] Syntax highlighting (Shiki or Prism)
- [ ] Welcome.md updated with all new features
- [ ] All components build without errors

## Test Strategy

- Visual: open prototype, verify each feature manually
- TypeScript: \`tsc --noEmit\` passes
- Build: \`vite build\` succeeds
`,
  ".plan/epics/E003-2026-03-30-prototype-v3/JOURNAL.md": `# Journal — E003: Prototype v3

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
- Tab type system: \`file | settings | welcome\`
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
- Final mode switcher: \`✏ EDIT [Visual][Code] OR [👁 Preview]\`

### Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| App name | mdpad | Short, memorable, domain available |
| State management | Context + useReducer | No new deps, typed actions |
| Syntax highlighting | Shiki sync bundle | Same as VS Code, 500KB acceptable |
| Mermaid loading | Lazy dynamic import | 1.5MB, only load when needed |
| Mode names | Write/Code/Preview → Visual/Code/Preview | "Write" confused with text input |
| Mode switcher layout | \`EDIT [Visual][Code] OR [Preview]\` | Labels clarify grouping |
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

All user ideas recorded in \`.plan/vision/2026-03-30-v3-ideas.md\`:
- Sidebar bookmark tabs (vertical text, not VS Code activity bar)
- Search panel in sidebar
- Settings as tab (not modal)
- Zoom floating widget (content only, not whole UI)
- Image lightbox, YouTube embeds
- Mermaid/chart demos
- Demo mode (localStorage, GitHub Pages)
- Semi-visual edit mode (markdown markers semi-transparent)
- Per-repo config \`.mdpad/\` folder
- File icon pattern matching system (extensible, regex)
- StackEdit feature mapping
- Code editor: line numbers + active line highlight
- Search in Preview mode (design decision needed)
- Zen Mode (full screen distraction-free)
- File/folder delete and rename in Explorer

### Subagents Dispatched (this session)
1. Product strategy research → \`.plan/reports/2026-03-30-product-strategy-report.md\`
2. Markdown ecosystem research → \`.plan/reports/2026-03-30-markdown-ecosystem-research.md\`
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
- **Welcome.md scope unclear**: T09 says "extend Welcome.md" but doesn't define content. Vision file \`2026-03-30-comrak-extensions-spec.md\` is referenced but example structure isn't sketched. Recommend adding a subsection here showing 1-2 example layouts.
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
- Eliminates meta-circular risk by excluding \`prototype/\` folder from content

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
- **Logo**: Iosevka Bold SVG paths → \`Logo\` component reused in MenuBar, AboutModal, EmptyState, favicon (ADR-006)
- **Sidebar tabs**: floating layout (no gap), mono font, hover transitions, no double border
- **PanelHeader**: reusable component for Explorer/Search headers, exported \`panelActionBtn\` class
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
- Logo font: Iosevka Bold (narrowest monospace, compact \`#>\`) → ADR-006
- Folders collapsed by default in file tree
- Mode display removed from StatusBar (no duplication with MenuBar)

### Findings this session: 3
1. Settings button in MenuBar had no onClick handler (silent no-op)
2. External links were blocked by blanket \`e.preventDefault()\` on all \`<a>\` tags
3. \`snapshot.md\` (stale Playwright dump) appeared in file tree

### Improvements logged: 14 (from impro), all resolved

### Next
1. Settings localStorage persistence (currently mock state only)
2. TLS cert fix for mdpad.zentala.io (SEO review finding)
3. SEO fixes: og:image, meta description, robots.txt
4. English fixes: comrak attribution (GitLab not GitHub), capitalization
5. Multiline blockquote bug (still open from E004)
6. Tests for new components (Logo, PanelHeader, SettingsView)
7. Competitive research ideas: auto dark/light from OS, named theme presets
`,
  ".plan/epics/E003-2026-03-30-prototype-v3/ORCHESTRATOR.md": `# Orchestrator — E003: Prototype v3

## Wave 0 (sequential — foundation)
- [x] T00 — Refactor to Context + useReducer

## Wave 1 (parallel — layout, depends on T00)
- [x] T01 — Sidebar Bookmark Tabs
- [x] T02 — Search Panel in Sidebar
- [x] T03 — Empty State

## Wave 2 (parallel — content features, depends on Wave 1)
- [x] T04 — Syntax Highlighting (Shiki) + D1 (copy toast)
- [x] T05 — Mermaid Diagram Rendering
- [x] T06 — GitHub Alerts
- [x] T07 — Image & Media + lightbox

## Wave 3 (parallel — navigation & polish, depends on Wave 2)
- [x] T08 — "+" Tab (New File)
- [x] T09 — Tab Context Menu
- [x] T10 — Settings Tab
- [x] T11 — Status Bar Redesign + D4 (count animation)
- [x] T12 — Floating Toolbar Scope Fix

## Wave 4 (sequential — demo & polish, depends on Wave 3)
- [x] T13 — Welcome.md Complete Rewrite
- [x] T14 — Keyboard Shortcuts Wiring
- [x] T15 — App Icon & Logo
- [ ] T16 — GitHub Pages Deploy

## Delight Features (integrated)
- [x] D1 — Copy Code Toast (in T04)
- [x] D2 — Outline Scroll Tracking
- [x] D3 — Internal Link Navigation
- [x] D4 — Count Animation (in T11)

## Status: 20/21 done. T16 (deploy) moved to E005 (website deploy epic).
`,
  ".plan/epics/E003-2026-03-30-prototype-v3/PLAN.md": `---
id: E003
status: planning
created: 2026-03-30
reviewed: CEO-expansion
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
\`\`\`typescript
type TabType = 'file' | 'settings' | 'welcome'
interface Tab {
  id: string
  type: TabType
  path?: string
  name: string
  modified?: boolean
}
\`\`\`

### Shiki: Sync bundle (shiki/bundle/web)
- Bundles common languages (~500KB vs 2MB full)
- Synchronous highlighting (no async component complexity)
- Themes: github-dark + github-light, auto-match app theme

### Mermaid: Lazy loaded
- Dynamic import on first \`\`\`mermaid block encountered
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
- Detect \`\`\`mermaid fenced blocks, render as SVG
- Types: flowchart, sequence, class, ER, pie, gantt, git graph
- Loading state: spinner while mermaid loads
- Error: red-bordered box with error message inline
- Theme: dark/light auto-match via mermaid.initialize()

**T06 — GitHub Alerts**
- Parse \`> [!NOTE]\`, \`> [!TIP]\`, \`> [!IMPORTANT]\`, \`> [!WARNING]\`, \`> [!CAUTION]\`
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
- Add: git branch mock (\`main\`)
- Add: file size mock (\`12.4 KB\`)

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
- Concept: \`#>\` (markdown heading + terminal prompt)
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
- Ctrl+click on \`[text](file.md)\` → opens that file in tree
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
| \`.mdpad/\` repo config | Needs Tauri FS access | Vision |
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
- \`tsc --noEmit\` passes
- \`vite build\` succeeds
- Check all three themes (dark, light, sepia)
- Check all three modes (Write/Visual, Code, Preview)
- Test on Chrome, Firefox, Edge (web demo)
- Verify all keyboard shortcuts
- Verify Shiki/Mermaid re-render on theme change
`,
  ".plan/epics/E004-2026-03-30-comrak-extensions/ORCHESTRATOR.md": `# Orchestrator — E004: comrak Extension Support

## Wave 1 (parallel — independent, no shared file touches)
- [x] T01 — Header IDs + Anchor Links (\`rehype-slug\`, heading hover \`#\`)
- [x] T02 — Math Rendering (\`remark-math\` + \`rehype-katex\`, inline + block)
- [x] T03 — Emoji Shortcodes (\`remark-gemoji\`, \`:name:\` → Unicode)
- [x] T04 — Highlight / Mark (custom plugin, \`==text==\` → \`<mark>\`)

## Wave 2 (parallel — depends on Wave 1 remark pipeline being stable)
- [x] T05 — Footnotes (block \`[^1]\` + inline \`^[text]\`, footer section)
- [x] T06 — Superscript & Subscript (\`^sup^\` / \`~sub~\`, conflict resolution)
- [x] T07 — Wiki-links (custom plugin, \`[[page]]\` / \`[[label|page]]\`, tooltip)
- [x] T08 — Insert + Multiline Blockquotes + Description Lists + Spoiler

## Wave 3 (sequential — content, depends on Wave 2 for live examples)
- [x] T09 — Welcome.md Extension Showcase (content only, no code)

## Merge Order
Wave 1 (T01–T04 parallel) → Wave 2 (T05–T08 parallel) → Wave 3 (T09)

## Status: 9/9 done. Epic complete.
`,
  ".plan/epics/E004-2026-03-30-comrak-extensions/PLAN.md": `---
id: E004
status: planning
created: 2026-03-30
---

# E004 — comrak Extension Support: Prototype + Backend Plan

## What

Evaluate every comrak extension, decide which to support, and implement them in
the React prototype using remark/rehype equivalents. Simultaneously define the
final comrak configuration for the Rust backend. Extend Welcome.md with a full
extension showcase.

## Why

comrak (our chosen Rust parser) supports 20+ extensions beyond GFM. Some are
essential for the AI-developer workflow (footnotes, wiki-links, math, highlight);
others are noise. We need deliberate decisions now — before building the Tauri
backend — so we don't back ourselves into awkward rendering contracts.

The React prototype must mirror the final comrak output: same semantics, same CSS
classes, same visual result. This epic closes the gap.

## Guiding Principles

1. **Target user first**: AI-augmented developers writing specs, plans, and ADRs.
   Every extension must justify itself against that workflow.
2. **comrak is the source of truth**: the React prototype mimics comrak's HTML
   output structure so CSS works unchanged when Tauri ships.
3. **No breaking changes to existing rendering**: E003 established the baseline.
   This epic only adds — never removes.
4. **React prototype = functional demo**: all enabled extensions must render
   visually correct in the browser prototype.

---

## Extension Inventory & Decisions

### Already Handled (not in scope)
| Extension | Status | Where |
|-----------|--------|-------|
| \`table\` | Done | E001 |
| \`strikethrough\` | Done | E001 |
| \`tasklist\` | Done | E001 |
| \`autolink\` | Done | E001 |
| \`tagfilter\` | Done | E001 |
| \`front_matter_delimiter\` | Done | E001 |
| \`alerts\` | In E003 | T06 |
| Syntax highlighting (Shiki) | In E003 | T04 |
| Mermaid diagrams | In E003 | T05 |

### New Extensions — Priority Decisions

#### MUST implement (core AI-dev workflow)

| Extension | comrak field | Syntax | Rationale |
|-----------|-------------|--------|-----------|
| **Footnotes** | \`footnotes\` | \`[^1]\` + \`[^1]: text\` | Long-form specs and ADRs use footnotes extensively |
| **Header IDs** | \`header_ids\` | \`## Title\` → \`id="title"\` | Enables anchor links, TOC navigation, deep links |
| **Math (dollars)** | \`math_dollars\` | \`$inline$\` / \`$$block$$\` | AI-generated specs increasingly include formulas |
| **Highlight / Mark** | \`highlight\` | \`==text==\` | Reviewing/annotating specs and plans |
| **Wiki-links** | \`wikilinks_title_before_pipe\` | \`[[page]]\` / \`[[label\\|page]]\` | Navigating \`.plan/\` / \`.arch/\` file graphs |
| **Emoji shortcodes** | \`shortcodes\` | \`:rocket:\` → 🚀 | Ubiquitous in developer markdown, status docs |

#### SHOULD implement (common, low-effort)

| Extension | comrak field | Syntax | Rationale |
|-----------|-------------|--------|-----------|
| **Superscript** | \`superscript\` | \`^text^\` | Math contexts, versioning (\`v1^st^\`), footnote refs |
| **Subscript** | \`subscript\` | \`~text~\` | Chemical formulas, technical notation |
| **Inline footnotes** | \`inline_footnotes\` | \`^[text]\` | Cleaner inline asides vs block footnote syntax |
| **Multiline blockquotes** | \`multiline_block_quotes\` | \`>>>\` … \`>>>\` | Long quoted passages in specs/ADRs |
| **Insert** | \`insert\` | \`++text++\` | Useful paired with strikethrough for change tracking |

#### COULD implement (niche, non-breaking)

| Extension | comrak field | Syntax | Rationale |
|-----------|-------------|--------|-----------|
| **Description lists** | \`description_lists\` | \`Term\\n: Definition\` | Glossaries, DDD.md domain model docs |
| **Spoiler** | \`spoiler\` | \`\\|\\|text\\|\\|\` | Collapsible answers in tutorial/quiz docs |

#### WON'T implement

| Extension | comrak field | Reason |
|-----------|-------------|--------|
| **Greentext** | \`greentext\` | 4chan-style ">" quotes — actively harmful to markdown semantics |
| **CJK friendly emphasis** | \`cjk_friendly_emphasis\` | Target users write primarily in English; zero benefit |
| **Subtext** | \`subtext\` | Undocumented/unstable; use \`subscript\` instead |
| **Phoenix HEEx** | \`phoenix_heex\` | Elixir-specific template syntax; completely irrelevant |
| **Math (code)** | \`math_code\` | Conflicts with syntax highlighting; \`math_dollars\` covers all cases |
| **Wikilinks (after pipe)** | \`wikilinks_title_after_pipe\` | Pick one convention; \`title_before_pipe\` matches Obsidian |

---

## React Prototype: remark/rehype Implementation Map

For each MUST/SHOULD/COULD extension, the equivalent in the React pipeline:

| Extension | React/remark approach | Package |
|-----------|----------------------|---------|
| Header IDs | \`rehype-slug\` | \`rehype-slug\` (already needed for TOC) |
| Footnotes | \`remark-footnotes\` or \`remark-gfm\` (includes footnotes) | \`remark-footnotes\` |
| Inline footnotes | Same plugin as footnotes | — |
| Math (dollars) | \`remark-math\` + \`rehype-katex\` | \`remark-math\`, \`rehype-katex\` |
| Highlight | \`rehype-mark\` or custom rehype plugin | custom or \`rehype-mark\` |
| Wiki-links | Custom remark plugin (parse \`[[...]]\`, resolve to links) | custom |
| Emoji shortcodes | \`remark-gemoji\` or \`remark-emoji\` | \`remark-gemoji\` |
| Superscript | \`remark-supersub\` or custom | \`rehype-accessible-emojis\` pattern |
| Subscript | Same plugin as superscript | — |
| Multiline blockquotes | Custom remark plugin | custom |
| Insert | Custom rehype plugin (\`++text++\` → \`<ins>\`) | custom |
| Description lists | \`remark-definition-list\` | \`remark-definition-list\` |
| Spoiler | Custom rehype plugin (\`||text||\` → spoiler span) | custom |

### Plugin installation budget
New packages for prototype: \`remark-math\`, \`rehype-katex\`, \`rehype-slug\`,
\`remark-footnotes\`, \`remark-gemoji\`. The rest use custom plugins kept under 50 lines.

---

## Out of Scope

| Item | Reason | When |
|------|--------|------|
| Math accessibility (MathML) | KaTeX handles it reasonably | Post-v1 |
| Wiki-link resolution to actual files | Needs Tauri FS access | Backend phase |
| Obsidian-style collapsible callouts (\`+\`/\`-\`) | Beyond GFM alerts | Backlog |
| Abbreviations (\`*[HTML]: ...\`) | Not in comrak | Backlog |
| Custom CSS classes/containers (\`:::\`) | Not in comrak | Backlog |

---

## Scope — Task Breakdown

### Wave 1 (parallel — independent, foundational)

**T01 — Header IDs + Anchor Links**
- Add \`rehype-slug\` to remark pipeline
- Every H1–H6 gets an \`id\` attribute (slug of heading text)
- Hover heading → \`#\` anchor link appears (right-aligned, muted)
- Click \`#\` → copies anchor URL to clipboard + toast "Copied!"
- comrak config note: \`header_ids: Some(String::new())\` (empty prefix)

**T02 — Math Rendering (KaTeX)**
- Install \`remark-math\` + \`rehype-katex\` + \`katex/dist/katex.min.css\`
- Inline math: \`$x^2$\` → \`<span class="math math-inline">...</span>\`
- Block math: \`$$\\n...\\n$$\` → \`<div class="math math-display">...</div>\`
- Error: malformed LaTeX → show red error inline (never crash)
- comrak config note: \`math_dollars: true\`

**T03 — Emoji Shortcodes**
- Install \`remark-gemoji\` (uses GitHub's gemoji dataset, ~200KB)
- \`:rocket:\` → 🚀, \`:warning:\` → ⚠️, \`:+1:\` → 👍
- Unknown shortcodes pass through as literal text
- comrak config note: \`shortcodes: true\`

**T04 — Highlight / Mark**
- Custom remark plugin: \`==text==\` → \`<mark>text</mark>\`
- CSS: \`mark { background: var(--mark-bg); color: var(--mark-fg); border-radius: 2px; }\`
- Three theme variants: yellow (light), orange-tinted (sepia), blue-tinted (dark)
- comrak config note: \`highlight: true\`

### Wave 2 (parallel — depends on Wave 1 infra)

**T05 — Footnotes (block + inline)**
- Install \`remark-footnotes\` (or use \`remark-gfm\` v4 which includes footnotes)
- Block: \`[^1]\` → superscript number link; \`[^1]: text\` → footer section
- Inline: \`^[text]\` → same rendering as block footnotes
- Footnote section: \`<section class="footnotes">\` with \`<hr>\` separator
- Back-link from footnote to reference marker
- comrak config note: \`footnotes: true\`, \`inline_footnotes: true\`

**T06 — Superscript & Subscript**
- Custom remark plugin: \`^text^\` → \`<sup>text</sup>\`, \`~text~\` → \`<sub>text</sub>\`
- Note: \`~text~\` conflicts with GFM strikethrough \`~~text~~\`. comrak resolves by:
  single \`~\` = subscript, double \`~~\` = strikethrough. Replicate this in remark.
- comrak config note: \`superscript: true\`, \`subscript: true\`

**T07 — Wiki-links**
- Custom remark plugin: parse \`[[page]]\` and \`[[label|page]]\`
- In prototype: render as \`<a href="#wikilink-page" class="wikilink">page</a>\`
- Visual: styled with a distinct link color (purple/violet, Obsidian convention)
- Tooltip on hover: "Wiki-link: page.md (navigation requires Tauri backend)"
- comrak config note: \`wikilinks_title_before_pipe: true\`

**T08 — Insert + Multiline Blockquotes + Description Lists + Spoiler**
- Insert (\`++text++\`): custom plugin → \`<ins>text</ins>\`, styled as underline + green tint
- Multiline blockquotes (\`>>>\` … \`>>>\`): custom plugin → standard \`<blockquote>\`
- Description lists (\`Term\\n: Def\`): \`remark-definition-list\` → \`<dl><dt><dd>\`
- Spoiler (\`||text||\`): custom plugin → \`<span class="spoiler">\`, blurred by default,
  click/hover to reveal
- comrak config notes: \`insert: true\`, \`multiline_block_quotes: true\`,
  \`description_lists: true\`, \`spoiler: true\`

### Wave 3 (sequential — Welcome.md showcase)

**T09 — Welcome.md Extension Showcase**
- Add "Markdown Extensions" section to Welcome.md
- One subsection per enabled extension with live example
- Content spec defined in \`.plan/vision/2026-03-30-comrak-extensions-spec.md\`
- This is a content/documentation task, no code changes

---

## Acceptance Criteria

- [ ] Every H1–H6 gets a stable \`id\`; hover shows \`#\` anchor link
- [ ] Math renders via KaTeX for both inline and block syntax
- [ ] Emoji shortcodes convert to Unicode characters
- [ ] \`==highlight==\` renders as \`<mark>\` with themed background
- [ ] Footnotes render with superscript numbers and footer section
- [ ] \`^sup^\` and \`~sub~\` render as \`<sup>\` / \`<sub>\` without breaking \`~~strikethrough~~\`
- [ ] \`[[page]]\` wiki-links render as styled anchor with tooltip
- [ ] \`++inserted++\` renders as \`<ins>\` with green underline style
- [ ] Multiline blockquotes (\`>>>\`) render as standard blockquotes
- [ ] Description lists (\`Term\\n: Def\`) render as \`<dl>/<dt>/<dd>\`
- [ ] \`||spoiler||\` renders blurred, revealed on click
- [ ] Welcome.md showcases all extensions with live examples
- [ ] \`tsc --noEmit\` passes, \`vite build\` succeeds
- [ ] All three themes (dark, light, sepia) render extensions correctly

---

## Test Strategy

### Unit tests
- Custom remark plugins: one test per plugin covering happy path + edge cases
- Superscript/subscript conflict resolution (\`~single~\` vs \`~~double~~\`)
- Wiki-link parser: \`[[page]]\`, \`[[label|page]]\`, nested brackets, empty

### Integration tests
- Full markdown pipeline: input string → rendered HTML fragment
- KaTeX: valid formula renders, invalid formula shows error (not crash)
- Emoji: known shortcode resolves, unknown passes through as literal

### Visual verification
- Open Welcome.md in prototype, verify each extension renders correctly
- Check all three themes
- Check no regressions to existing GFM rendering

### Coverage target
- Custom plugins: 100% (small, pure functions)
- React components using new features: ≥80%
`,
  ".plan/epics/E005-2026-03-30-website-deploy/JOURNAL.md": `# Journal — E005: Website Deploy

## Session 2026-03-30 08:00

- **Goal**: Deploy mdpad prototype to mdpad.zentala.io as live demo + docs site
- **Done**:
  - E005-T01: Build content script — scans repo, generates TS files (f867cdf)
  - E005-T02: Rename Welcome.md → REFERENCE.md (37bd476)
  - E005-T03: Wire generated content with mock fallback (c56aace)
  - E005-T04: Vite config for GitHub Pages + meta tags (7fc9d4c)
  - E005-T05: GitHub Actions deploy workflow (6c9c94e)
  - E005-T06: GitHub Pages config via \`gh\` CLI + Cloudflare DNS CNAME (manual)
  - E005-T07: README rewrite — features table, 3 modes, tech stack, logo (3261f1f)
  - Sidebar redesign: tabs moved to right side, uppercase, border merge (3c66521, 9d1621b)
  - Product vision brainstorm saved to .plan/vision/ (80b88dd)
  - Competitive research extended (docsify, grip, glow, Nimbalyst)
  - Logo SVG + favicon created (e934d79)
  - Removed welcome-content.ts mock, fixed build-content types (ff8e594)
  - Cleanup: removed screenshots from git (eaf5a8a)
  - 6 E004 bugs logged to backlog
  - Backlog cleanup (StackEdit duplicate removed)
- **Decisions**: REFERENCE.md is single source of truth (no more welcome-content.ts mock)
- **Findings this session**: 5 (build-content _childMap hack, theme not persisted, favicon missing, backlog duplicates, screenshots leaked to git)
- **Improvements logged**: all findings resolved or added to backlog
- **Next**:
  1. HTTPS enforcement (waiting for GitHub cert generation)
  2. Settings tab planning (what settings, localStorage persistence)
  3. Theme persistence in localStorage
  4. E004 bug fixes (subscript, multiline blockquote, wiki-links)
  5. Unified SVG logo usage across all components
`,
  ".plan/epics/E005-2026-03-30-website-deploy/ORCHESTRATOR.md": `---
id: E005
status: planned
created: 2026-03-30
---

# E005 — Orchestrator

## Wave 1: Content Build Script (foundation — everything depends on this)

### E005-T01: Build content script
**Files**: \`prototype/scripts/build-content.ts\`
**Deps**: none

Create a TypeScript script that:

1. **Scans the repo** from project root (\`../\` relative to prototype/) for \`.md\` files
   - Include: repo root \`*.md\`, \`.arch/**/*.md\`, \`.plan/**/*.md\`, \`catalog-info.yaml\`
   - Exclude: \`node_modules/\`, \`.git/\`, \`examples/\`, \`prototype/\`, \`.claude/\`
   - Use \`fs.readdirSync\` recursive or glob — no runtime deps beyond Node built-ins

2. **Builds FileNode tree** matching the \`FileNode\` interface:
   \`\`\`typescript
   interface FileNode {
     name: string
     path: string
     type: 'file' | 'folder'
     children?: FileNode[]
     extension?: string
   }
   \`\`\`
   - Sort: folders first, then files, alphabetical within each group
   - Compute \`extension\` from filename
   - Paths use forward slashes (normalize on Windows)

3. **Reads file contents** into a \`Record<string, string>\` keyed by path
   - Read each \`.md\` file as UTF-8 string
   - Read \`catalog-info.yaml\` as string too

4. **Outputs two generated files**:
   - \`prototype/src/generated/file-tree.ts\` — exports \`generatedFileTree: FileNode[]\`
   - \`prototype/src/generated/markdown-content.ts\` — exports \`generatedMarkdownFiles: Record<string, string>\` and \`defaultFile: string\` (set to \`'README.md'\`)
   - Both files start with \`// AUTO-GENERATED — do not edit manually\`
   - Content strings use template literals with proper escaping (backticks, \`\${\`)

5. **Add to .gitignore**: \`prototype/src/generated/\`

6. **Add npm script**: \`"build:content": "tsx scripts/build-content.ts"\`
   - Requires \`tsx\` as devDependency for running TypeScript scripts

**Verification**:
- Run \`pnpm build:content\` from prototype/
- Verify \`src/generated/file-tree.ts\` contains actual repo files
- Verify \`src/generated/markdown-content.ts\` contains actual file contents
- Verify README.md is present, Welcome.md is NOT (it doesn't exist in repo root)

---

### E005-T02: Rename Welcome.md to REFERENCE.md
**Files**: \`prototype/src/mock/welcome-content.ts\`, \`prototype/src/mock/markdown-content.ts\`, \`prototype/src/mock/file-tree.ts\`, any component referencing \`Welcome.md\`
**Deps**: none (parallel with T01)

1. Rename all references from \`Welcome.md\` to \`REFERENCE.md\`
2. Update the welcome-content.ts heading from "Welcome to mdpad" to "Markdown Feature Reference"
3. Update file tree mock to show \`REFERENCE.md\` instead of \`Welcome.md\`
4. Update \`defaultFile\` in mock from \`'Welcome.md'\` to \`'README.md'\`
5. Create actual \`REFERENCE.md\` file in repo root with the showcase content
   (this file will be picked up by the build-content script in production)

**Verification**:
- \`pnpm dev\` — app loads, shows REFERENCE.md in file tree
- Default file is now README.md (mock version)
- REFERENCE.md still shows all markdown features when clicked

---

## Wave 2: Wire generated content + Vite config (depends on Wave 1)

### E005-T03: Switch from mock to generated data with fallback
**Files**: \`prototype/src/mock/index.ts\` (new), imports in components
**Deps**: T01, T02

1. Create \`prototype/src/mock/index.ts\` as the single import point:
   \`\`\`typescript
   // Try generated content first (exists after build:content), fall back to mock
   let fileTree: FileNode[]
   let markdownFiles: Record<string, string>
   let defaultFilePath: string

   try {
     const gen = await import('@/generated/file-tree')
     const genContent = await import('@/generated/markdown-content')
     fileTree = gen.generatedFileTree
     markdownFiles = genContent.generatedMarkdownFiles
     defaultFilePath = genContent.defaultFile
   } catch {
     // Generated files don't exist yet (dev mode without build:content)
     fileTree = mockFileTree
     markdownFiles = mockMarkdownFiles
     defaultFilePath = 'README.md'
   }

   export { fileTree, markdownFiles, defaultFilePath }
   \`\`\`
   - Alternative approach (simpler, recommended): use Vite's \`import.meta.glob\` or
     conditional import via env variable \`VITE_USE_GENERATED=true\`
   - Or: build:content always runs before both dev and build, making generated files
     always available. Then mock files become dev-only fallback.

2. Update all component imports to use \`@/mock\` (the index barrel) instead of
   direct imports from \`@/mock/file-tree\` and \`@/mock/markdown-content\`

3. Decision on approach: the simplest path is to make \`build:content\` part of the
   dev script too: \`"dev": "tsx scripts/build-content.ts && vite"\`. Then generated
   files always exist. Mock files become a safety net only.

**Verification**:
- \`pnpm build:content && pnpm dev\` — app shows real repo files
- Deleting \`src/generated/\` and running \`pnpm dev\` (without build:content) — app falls back to mock data
- All features work with generated data (tabs, outline, themes, search)

---

### E005-T04: Vite config for GitHub Pages
**Files**: \`prototype/vite.config.ts\`
**Deps**: none (parallel with T03, but in same wave for logical grouping)

1. Add \`base\` config for GitHub Pages:
   - If deploying to \`mdpad.zentala.io\` (custom domain), base is \`/\`
   - If deploying to \`zentala.github.io/mdpad/\`, base is \`/mdpad/\`
   - Use env variable: \`base: process.env.GITHUB_PAGES ? '/mdpad/' : '/'\`
   - With custom domain, base stays \`/\` — simpler

2. Ensure build output goes to \`dist/\` (default, already correct)

3. Add SPA routing support:
   - Post-build step: copy \`dist/index.html\` to \`dist/404.html\`
   - Add to build script or as vite plugin

4. Add meta tags plugin or manual \`index.html\` updates:
   - \`<title>mdpad — Markdown Viewer</title>\`
   - \`<meta name="description" content="Lightweight markdown viewer for developers">\`
   - Open Graph tags for link previews

**Verification**:
- \`pnpm build\` produces \`dist/\` with \`index.html\` and \`404.html\`
- \`pnpm preview\` — app works at localhost
- No broken asset paths in built output

---

## Wave 3: GitHub Actions + DNS (depends on Wave 2)

### E005-T05: GitHub Actions deploy workflow
**Files**: \`.github/workflows/deploy.yml\` (repo root, NOT prototype/)
**Deps**: T01, T03, T04

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: false  # don't need examples/

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          cache-dependency-path: prototype/pnpm-lock.yaml

      - name: Install dependencies
        working-directory: prototype
        run: pnpm install --frozen-lockfile

      - name: Generate content from repo
        working-directory: prototype
        run: pnpm build:content

      - name: Build
        working-directory: prototype
        run: pnpm build

      - name: Copy 404.html for SPA routing
        run: cp prototype/dist/index.html prototype/dist/404.html

      - name: Add CNAME for custom domain
        run: echo "mdpad.zentala.io" > prototype/dist/CNAME

      - uses: actions/upload-pages-artifact@v3
        with:
          path: prototype/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
\`\`\`

Key details:
- Uses \`actions/deploy-pages\` (not push to gh-pages branch) — modern approach
- \`CNAME\` file written into dist/ for custom domain persistence
- \`submodules: false\` — examples/ not needed for website build
- Working directory set to \`prototype/\` for all build steps
- \`pnpm-lock.yaml\` must exist (run \`pnpm install\` locally first if missing)

**Verification**:
- Push to main triggers the workflow
- Workflow completes successfully
- Site is accessible at the GitHub Pages URL

---

### E005-T06: Cloudflare DNS + GitHub Pages custom domain
**Files**: none (external configuration)
**Deps**: T05

1. **Cloudflare DNS**: Add CNAME record
   - Name: \`mdpad\`
   - Target: \`zentala.github.io\`
   - Proxy status: DNS only (orange cloud OFF) — GitHub Pages needs direct DNS
   - TTL: Auto

2. **GitHub repo settings**:
   - Settings → Pages → Source: GitHub Actions
   - Custom domain: \`mdpad.zentala.io\`
   - Enforce HTTPS: checked (GitHub provides free cert)

3. **Verify**: \`dig mdpad.zentala.io\` returns \`zentala.github.io\` CNAME
4. **Verify**: \`curl -I https://mdpad.zentala.io\` returns 200

**Verification**:
- \`https://mdpad.zentala.io\` loads the app
- HTTPS works (no cert warnings)
- HTTP redirects to HTTPS

---

## Wave 4: README + polish (depends on Wave 3)

### E005-T07: Write README.md for the website
**Files**: \`README.md\` (repo root)
**Deps**: T06 (need live URL for "try it now" link)

The README is the first thing users see on \`mdpad.zentala.io\`. Structure:

1. **Hero section**: project name, one-line description, badges
   - "Try it now — you're already using it!" callout
2. **What is mdpad**: 2-3 sentences, who it's for
3. **Features**: checklist of what works today vs planned
4. **Screenshots/GIFs**: skip for now, add placeholder text
5. **Installation**: \`cargo install mdpad\` (planned, not yet available)
6. **Quick start**: \`mdpad .\` / \`mdpad README.md\`
7. **Tech stack**: table (Tauri, comrak, React)
8. **Documentation links**: architecture, backlog, vision
9. **Contributing**: basic guidelines
10. **License**: MIT

Keep it concise. The app itself IS the documentation browser — link to
other docs via relative paths (they're clickable in the app).

**Verification**:
- README.md renders well in both GitHub and mdpad
- All relative links resolve in the deployed app
- No broken images or dead links

---

## Summary

| Wave | Tasks | Parallel? | Estimated effort |
|------|-------|-----------|-----------------|
| 1 | T01 (build script), T02 (rename Welcome→REFERENCE) | Yes | 2-3 hours |
| 2 | T03 (wire generated data), T04 (vite config) | Partial | 1-2 hours |
| 3 | T05 (GitHub Actions), T06 (DNS config) | Sequential | 1 hour |
| 4 | T07 (README rewrite) | Single task | 1 hour |

Total: ~5-7 hours of implementation.

## Progress

- [x] E005-T01 — Build content script
- [x] E005-T02 — Rename Welcome.md to REFERENCE.md
- [x] E005-T03 — Wire generated content with fallback
- [x] E005-T04 — Vite config for GitHub Pages
- [x] E005-T05 — GitHub Actions deploy workflow
- [x] E005-T06 — Cloudflare DNS + GitHub Pages config
- [x] E005-T07 — Write README.md for the website

## Status: 7/7 done. Epic complete.
`,
  ".plan/epics/E005-2026-03-30-website-deploy/PLAN.md": `---
id: E005
status: planned
created: 2026-03-30
---

# E005 — Website Deploy (mdpad.zentala.io)

## What

Deploy the prototype as a GitHub Pages site at \`mdpad.zentala.io\`.
The deployed app displays the repository's own markdown files, serving
simultaneously as product demo and project documentation.

## Why

mdpad has no public presence. Deploying the prototype itself as the website
solves two problems at once:
1. Visitors see the product in action (live demo)
2. Project docs (README, architecture, plans) are browsable without cloning

No server needed. Static site, GitHub Pages, zero ongoing cost.

## Scope

### In scope
- Build script that reads real \`.md\` files from the repo and generates mock data
- Vite config for GitHub Pages (base path, SPA routing)
- GitHub Actions workflow for automated deploy on push to main
- Cloudflare DNS CNAME for \`mdpad.zentala.io\`
- README.md rewrite for the website landing experience
- Rename \`Welcome.md\` to \`REFERENCE.md\` (markdown feature showcase)

### Out of scope
- Editing capabilities on the deployed site
- Server-side rendering
- Search indexing / SEO beyond basic meta tags
- Custom 404 page design (use SPA redirect trick)
- Analytics (can be added later via Cloudflare)

## Constraints

- The prototype uses hardcoded mock data in \`prototype/src/mock/\`
- The \`FileNode\` type and \`mockMarkdownFiles\` record are the integration points
- The build-content script must produce files matching these exact interfaces
- GitHub Pages serves from \`gh-pages\` branch or \`/docs\` folder (we use \`gh-pages\` branch via Actions)
- SPA routing requires a \`404.html\` that redirects to \`index.html\`

## Acceptance Criteria

- [ ] \`mdpad.zentala.io\` loads the prototype app in a browser
- [ ] File tree shows actual repo \`.md\` files (not hardcoded mock data)
- [ ] README.md is the default file shown on page load
- [ ] REFERENCE.md (renamed Welcome.md) is accessible and shows full markdown feature showcase
- [ ] Pushing to \`main\` triggers automatic redeploy
- [ ] All existing prototype features work (tabs, outline, themes, search, editor modes)
- [ ] Build completes in under 2 minutes on GitHub Actions

## Architecture Decisions

### Content generation at build time (not runtime)

The build script reads \`.md\` files from the repo and generates TypeScript source files
that replace the mock data. This means:
- No fetch calls at runtime, no CORS, no loading states
- Content is baked into the JS bundle (acceptable — markdown files are small)
- File tree structure is computed at build time
- Tradeoff: bundle size grows with repo content. For our repo (~50 .md files, ~200KB text)
  this adds negligible overhead

### GitHub Pages over Cloudflare Pages

GitHub Pages is simpler for a repo that wants to deploy itself:
- No separate project to configure
- Built-in GitHub Actions integration
- Custom domain via CNAME file + Cloudflare DNS
- Cloudflare Pages would require a separate build config and repo connection

### File filtering strategy

The build script includes:
- All \`.md\` files from repo root, \`.arch/\`, \`.plan/\` (recursively)
- \`catalog-info.yaml\` (shown as read-only)
- Excludes: \`node_modules/\`, \`.git/\`, \`examples/\` (submodules), \`prototype/\` (meta-circular)

### SPA routing via 404.html

GitHub Pages doesn't support SPA routing natively. The standard workaround:
- Copy \`index.html\` to \`404.html\` in the build output
- GitHub Pages serves \`404.html\` for any unknown path
- The SPA router takes over and resolves the route client-side

## Test Strategy

### Unit tests
- \`build-content.ts\`: test file discovery, tree building, content reading
- Test that generated output matches \`FileNode[]\` and \`Record<string, string>\` types
- Test file filtering (excludes node_modules, .git, examples, prototype)
- Test path normalization (Windows backslashes to forward slashes)

### Integration tests
- Full build pipeline: run build-content, then vite build, verify dist/ output
- Verify generated mock data is valid TypeScript that imports correctly

### E2E tests (post-deploy)
- Load \`mdpad.zentala.io\` in browser
- Verify file tree renders
- Click README.md, verify content appears
- Navigate to \`.arch/ARCHITECTURE.md\` via file tree
- Verify REFERENCE.md renders with all markdown features

### Coverage targets
- \`build-content.ts\` utilities: 100% (pure functions)
- Overall build pipeline: smoke test (build succeeds, dist/ has expected files)

## Dependencies

- Cloudflare DNS access (user owns zentala.io)
- GitHub repo settings: Pages enabled, custom domain configured
- Repo must be public (or GitHub Pages Pro) for custom domain
`,
  ".plan/reports/2026-03-28-market-research.md": `# Market Research — Desktop Markdown Viewers

**Date**: 2026-03-28
**Epic**: [E001](../epics/E001-2026-03-28-project-bootstrap/PLAN.md)
**Task**: [E001-T01](../epics/E001-2026-03-28-project-bootstrap/tasks/E001-T01-market-research.md)

## Executive Summary

No dominant lightweight, CLI-launchable Markdown viewer exists. Existing tools are
either heavy (Electron, 100MB+), abandoned, or commercial. The Tauri niche is open —
Inkwell is closest but paywalls export and lacks cross-file search.

## Tier 1 — Mature, Widely Used

| App | Tech | License | Stars | Strengths | Weaknesses |
|-----|------|---------|-------|-----------|------------|
| **Obsidian** | Electron | Freeware | N/A | Huge plugin ecosystem, graph view, PKM | Heavy (~300MB RAM), PKM-focused not viewer |
| **Typora** | Electron | $15 | N/A | Best WYSIWYG UX, seamless inline preview | Closed source, no file tree search |
| **Mark Text** | Electron | MIT | ~55k | Free Typora clone, 33 themes | Abandoned since March 2022 |
| **Zettlr** | Electron | GPL | ~10k | Academic: BibTeX, Zotero, Zettelkasten | Niche audience, complex UI |
| **Joplin** | Electron | MIT | ~48k | Sync, encryption, plugins | Note-taking focus, not file viewer |

## Tier 2 — Specialized / Windows-first

| App | Tech | License | Strengths | Weaknesses |
|-----|------|---------|-----------|------------|
| **Markdown Monster** | .NET/WPF | Commercial | Very feature-rich, Windows-native | Windows-only, commercial |
| **ghostwriter** | Qt (C++) | GPL | Fast, native, elegant | Limited features |
| **Logseq** | Electron | AGPL ~35k | Outliner, graph, daily notes | Block-based, opinionated format |

## Tauri-Based Markdown Editors

This is a **relatively underserved niche**. Most Tauri projects are hobby or beta-stage.

### Inkwell (most complete)
- **Stack**: Tauri v2 + Rust + vanilla JS
- **Size**: ~11 MB
- **Features**: Split-pane preview, GFM, syntax highlighting (30+ langs), Mermaid, TOC, tabs, autosave, version history, image paste, focus mode, 4 themes, 10 templates
- **Model**: Free, paywall $19 for PDF/HTML export + future features
- **Status**: Active (Show HN 2025)
- **Repo**: github.com/4worlds4w-svg/inkwell

### MarkFlowy
- **Stack**: Tauri + Rust + React/Prosemirror
- **Size**: <20 MB
- **Features**: WYSIWYG + source mode, AI integration (DeepSeek, ChatGPT), custom themes
- **Status**: Beta
- **Repo**: github.com/drl990114/MarkFlowy

### Otterly
- **Stack**: Tauri + Svelte 5 + Rust
- **Features**: WYSIWYG via Milkdown/ProseMirror, wiki-links, backlinks, FTS5 search
- **Status**: Active
- **Repo**: github.com/ajkdrag/otterly

### MarkditorApp
- **Stack**: Tauri + TypeScript
- **Goal**: Open-source Typora alternative
- **Status**: WIP
- **Repo**: github.com/greyovo/MarkditorApp

## Feature Matrix — Best Apps Compared

| Feature | Typora | Obsidian | Mark Text | Zettlr | Inkwell | MM |
|---------|--------|----------|-----------|--------|---------|-----|
| File tree | YES | YES | YES | YES | YES | YES |
| Live preview (split) | NO* | YES | NO* | YES | YES | YES |
| WYSIWYG inline | YES | Opt | YES | NO | NO | NO |
| TOC / heading nav | YES | YES | YES | YES | YES | YES |
| Syntax highlight code | YES | YES | YES | YES | YES | YES |
| Mermaid diagrams | YES | YES | YES | YES | YES | plug |
| Math/LaTeX | YES | plug | YES | YES | NO | NO |
| Cross-file search | file | YES | YES | YES | NO | YES |
| Dark/light themes | YES | YES | 33! | YES | 4 | YES |
| Custom CSS | YES | YES | YES | YES | NO | YES |
| Export PDF | YES | plug | YES | YES | $$ | YES |
| CLI launch | YES | YES | YES | YES | ? | NO |
| Vim keybindings | YES | plug | NO | NO | road | NO |
| Frontmatter YAML | YES | YES | YES | YES | YES | YES |
| Image paste | YES | YES | YES | YES | YES | YES |
| Wiki-links | NO | YES | NO | YES | NO | NO |
| Tabs | NO | YES | NO | YES | YES | YES |
| Plugin system | NO | YES | NO | NO | NO | YES |

*Typora/Mark Text use inline WYSIWYG instead of split view.

## What Users Value Most

Based on HN, Reddit, reviews:

### Must-haves (deal-breakers)
1. **Speed** — preview <50ms, no typing lag
2. **Correct GFM** — tables, checkboxes, fenced code, strikethrough
3. **Syntax highlighting** — code blocks with language detection
4. **File tree** — folder browsing, not single-file
5. **No vendor lock-in** — plain .md files on filesystem

### Important
6. TOC / outline panel
7. Mermaid diagrams
8. Dark/light theme (respecting OS preference)
9. YAML frontmatter
10. Cross-file search

### Developer-specific
11. CLI launch (\`app .\` or \`app file.md\`)
12. Small installer (<15MB vs Electron 100MB+)
13. Fast startup (<0.5s)
14. Vim keybindings

### Anti-patterns (what users hate)
- Bloat and feature creep
- Required cloud sync / accounts
- Telemetry
- Subscription model
- 400MB Electron reimplementation

## Tauri Feasibility Assessment

### Tauri vs Electron

| Aspect | Electron | Tauri |
|--------|---------|-------|
| Installer size | 80-150 MB | 2-10 MB |
| RAM idle | 150-300 MB | 30-50 MB |
| Startup | 1-2s | <0.5s |
| Node.js | Required (bundled) | Not needed |
| WebView | Chromium (bundled) | System native |

### Rust Markdown Libraries

| Library | Standard | Used by |
|---------|---------|---------|
| **comrak** | CommonMark + GFM | GitLab, Deno, docs.rs |
| **pulldown-cmark** | CommonMark | mdBook, rustdoc |

**Recommendation**: comrak — full GFM, production-proven.

### Verdict
Tauri is an excellent fit. The niche is open. Inkwell proves the concept works.
Our differentiator: CLI-first, developer-focused, AI-workflow optimized.
`,
  ".plan/reports/2026-03-30-competitive-research-docsify-grip-glow.md": `# Competitive Research: docsify, grip, glow

**Date**: 2026-03-30
**Purpose**: Feature mapping and UX pattern analysis for mdpad
**Tools researched**: docsify.js, grip (Python), glow (Go/Charmbracelet)

---

## 1. docsify.js

**URL**: https://docsify.js.org
**GitHub**: https://github.com/docsifyjs/docsify
**Category**: Documentation site generator (browser-based, no build step)
**Language**: JavaScript

### What it is

Docsify turns markdown files into a navigable website with zero build step.
Unlike static-site generators (Hugo, Jekyll), it loads and parses markdown
at runtime in the browser. This "no build" philosophy is its core differentiator.

### Key features

| Feature | Details |
|---------|---------|
| **Zero build** | No static HTML generation; loads \`.md\` files directly at runtime |
| **Sidebar navigation** | Auto-generated from \`_sidebar.md\` file; supports nested hierarchies |
| **Navbar** | Top navigation from \`_navbar.md\`; supports dropdown menus |
| **Cover page** | Splash/landing page from \`_coverpage.md\` |
| **Full-text search** | Plugin-based; indexes content client-side with configurable depth (1-6 heading levels) |
| **Multiple themes** | vue (default), buble, dark, pure; plus community themes |
| **Emoji support** | Native emoji rendering (built-in since v4.13) |
| **Embedded files** | Video, audio, iframes, code blocks, and other markdown files can be embedded |
| **Vue integration** | Vue components can be used directly inside markdown |
| **Server-side rendering** | SSR support for SEO |

### Plugin system

Docsify has a well-designed plugin architecture built around lifecycle hooks:

- \`init\` -- script initialization (once)
- \`mounted\` -- DOM mount complete (once)
- \`beforeEach\` -- before each markdown file is parsed
- \`afterEach\` -- after each markdown file is rendered
- \`doneEach\` -- after page render complete
- \`ready\` -- all plugins loaded

**Official plugins**: full-text search, Google Analytics, emoji, external script loading.

**Community plugins** (via awesome-docsify):
- \`docsify-mermaid\` -- Mermaid diagram rendering
- \`docsify-mermaid-zoom\` -- SVG zoom for diagrams
- \`docsify-copy-code\` -- copy button on code blocks
- \`docsify-pagination\` -- prev/next navigation
- \`docsify-tabs\` -- tabbed content sections
- \`docsify-sidebar-collapse\` -- collapsible sidebar sections
- \`docsify-themeable\` -- CSS-variable-based theme system

### How it handles key concerns

| Concern | Approach |
|---------|----------|
| **File navigation** | \`_sidebar.md\` defines the tree; supports nested bullet lists for hierarchy |
| **Search** | Plugin with configurable \`maxAge\`, \`paths\`, \`placeholder\`, \`depth\` (heading levels) |
| **Themes** | CSS stylesheet swap; \`docsify-themeable\` adds CSS custom property theming |
| **Dark mode** | Via \`docsify-darklight-theme\` plugin or CSS \`prefers-color-scheme\` media query |
| **Configuration** | Single \`window.$docsify\` object in \`index.html\`; all options declarative |

### What mdpad can learn

1. **\`_sidebar.md\` as navigation spec**: The idea that a simple markdown file
   defines the sidebar tree is elegant. mdpad could support a similar convention
   where a \`_sidebar.md\` or \`_nav.md\` in any folder overrides auto-generated
   file tree ordering.

2. **Plugin lifecycle hooks**: The \`beforeEach\`/\`afterEach\` pattern for
   transforming markdown content is clean and composable. mdpad's Rust
   pipeline could expose similar hooks for user-defined transformations.

3. **Cover page convention**: \`_coverpage.md\` as a landing/splash page for a
   documentation folder. mdpad could render folder-level cover pages when
   opening a directory.

4. **Embedded content**: docsify embeds other markdown files inline. mdpad
   could support \`!include\` or transclusion syntax for composing documents.

5. **Search depth configuration**: Letting users choose heading depth (1-6)
   for search indexing is a practical UX detail.

---

## 2. grip

**URL**: https://github.com/joeyespo/grip
**Category**: Local GitHub-style markdown previewer
**Language**: Python

### What it is

Grip is a minimalist command-line tool that renders markdown files using
GitHub's own Markdown API, ensuring pixel-perfect GitHub rendering. It
serves files on a local HTTP server with live reload.

### Key features

| Feature | Details |
|---------|---------|
| **GitHub-exact rendering** | Uses GitHub's Markdown API for identical output |
| **Live reload** | File changes reflected in browser without manual refresh |
| **HTML export** | \`grip --export\` generates standalone HTML files |
| **Offline mode** | \`render_offline\` flag uses Python-Markdown (WIP, not full parity) |
| **Dark/light themes** | Matches GitHub's light and dark mode |
| **Wide rendering** | \`render_wide\` option for full-width content |
| **Inline styles** | \`render_inline\` embeds CSS directly in exported HTML |
| **CLI simplicity** | \`grip README.md\` -- one command to preview |
| **Auto-open browser** | \`-b\` flag opens browser tab automatically |

### How it handles key concerns

| Concern | Approach |
|---------|----------|
| **File navigation** | None -- single file viewer only; no tree, no multi-file |
| **Search** | None -- browser's Ctrl+F only |
| **Themes** | Light/dark matching GitHub's own themes |
| **Configuration** | Python config file (\`~/.grip/settings.py\`); env vars for API credentials |

### Limitations

- **API rate limiting**: GitHub API has hourly rate limits; requires auth for heavy use
- **No file tree**: Single-file only; no folder browsing
- **No plugin system**: No extensibility beyond the Python API
- **Offline rendering**: Still WIP; not feature-complete
- **No GFM extensions**: Relies entirely on GitHub's API for rendering fidelity

### What mdpad can learn

1. **"Looks exactly like GitHub" as a feature**: Many developers want their
   markdown to look the same locally as on GitHub. mdpad could offer a
   "GitHub mode" theme that closely matches GitHub's CSS.

2. **Zero-config CLI launch**: \`grip README.md\` is the gold standard for
   simplicity. mdpad's CLI should be equally simple: \`mdpad .\` or \`mdpad README.md\`.

3. **Live reload without refresh**: Grip's instant update on file save (no
   page refresh needed) is a key UX feature mdpad must match via Tauri's
   file watcher.

4. **Export to HTML**: Standalone HTML export is useful for sharing rendered
   documents with non-technical stakeholders.

5. **Wide mode toggle**: A simple toggle for wide vs. constrained content
   width is a practical feature for reading vs. presenting.

---

## 3. glow

**URL**: https://github.com/charmbracelet/glow
**Category**: Terminal markdown viewer with TUI file browser
**Language**: Go (uses Glamour rendering engine)

### What it is

Glow is a terminal-based markdown reader with two modes: a CLI renderer
(pipe/file input) and a TUI file browser for discovering and reading
markdown in a directory tree. Built by Charmbracelet using their
Bubble Tea TUI framework and Glamour stylesheet engine.

### Key features

| Feature | Details |
|---------|---------|
| **TUI file browser** | Launch \`glow\` without args to browse markdown files in current dir |
| **CLI rendering** | \`glow file.md\` renders directly to terminal output |
| **Multiple input sources** | Local files, stdin, HTTP URLs, GitHub/GitLab repos |
| **Glamour styles** | Stylesheet-based rendering with named themes (dark, light, dracula, tokyo-night, ascii, pink, notty) |
| **Auto theme detection** | Detects terminal background color; picks dark/light automatically |
| **Custom stylesheets** | JSON-based style definitions; \`GLAMOUR_STYLE\` env var |
| **Word wrap** | Configurable wrap width (default 80) |
| **Line numbers** | Optional line numbers in TUI mode |
| **Mouse support** | Mouse wheel scrolling in TUI |
| **Pager navigation** | Search, jump-to-line, link following in TUI pager (2026 additions) |
| **Git-aware** | In a git repo, searches the entire repo for markdown files |

### Glamour style system

Glamour is the rendering engine behind glow. It uses JSON-based stylesheets
that control every element's appearance:

\`\`\`
Default styles: ascii, auto, dark, dracula, tokyo-night, light, notty, pink
Custom: set GLAMOUR_STYLE env var to a JSON file path
\`\`\`

Each style defines colors, margins, padding, and formatting for every
markdown element (headings, code blocks, links, lists, blockquotes, etc.).
This is essentially a CSS-like system for terminal rendering.

### How it handles key concerns

| Concern | Approach |
|---------|----------|
| **File navigation** | TUI mode: flat list of all \`.md\` files in directory tree with filter |
| **Search** | Filter bar in TUI browser; text search in pager mode (2026) |
| **Themes** | Named themes via Glamour; auto-detection; custom JSON stylesheets |
| **Configuration** | \`GLAMOUR_STYLE\` env var; CLI flags (\`-s\`, \`-w\`, \`-l\`) |

### Former stash feature (removed)

Glow previously had an encrypted cloud stash for saving markdown documents
with end-to-end encryption. This feature was removed in recent versions.
The concept of bookmarking/stashing documents for quick access remains
interesting for mdpad.

### What mdpad can learn

1. **Auto theme detection**: Glow detects terminal background color and
   picks an appropriate theme. mdpad should detect system dark/light
   mode preference and apply the matching theme on first launch.

2. **Named theme presets**: Glow's approach of named themes (dracula,
   tokyo-night, etc.) is developer-friendly. mdpad should ship with
   popular editor themes as presets.

3. **Git-aware file discovery**: When inside a git repo, glow searches
   the entire repo for markdown. mdpad should also understand git
   boundaries and offer "show all markdown in this repo" as a view.

4. **Multiple input sources**: Accepting URLs and GitHub/GitLab repo
   paths as input is valuable. mdpad could open remote markdown via URL.

5. **JSON-based style system**: Glamour's approach of defining element
   styles via JSON is clean and user-extensible. mdpad's theme system
   could adopt a similar token-based approach for customization.

6. **Pager-style navigation**: Search within document, jump-to-line, and
   link following are features glow added in 2026. All are relevant for
   mdpad's preview mode.

7. **Flat file list with filter**: Glow's TUI shows all markdown files
   in a flat, filterable list. This is a useful alternative view to
   a hierarchical tree -- mdpad could offer both tree and flat list views.

---

## Comparison table

| Feature | docsify | grip | glow | mdpad (current) | mdpad (opportunity) |
|---------|---------|------|------|-----------------|---------------------|
| **Platform** | Browser | Browser (local server) | Terminal | Desktop (Tauri) | -- |
| **File tree** | Sidebar via \`_sidebar.md\` | None | Flat list + filter | Hierarchical tree | Add flat list view |
| **Search** | Full-text plugin | Browser Ctrl+F | Filter bar + pager search | Quick Open (Ctrl+P) | Add full-text content search |
| **Themes** | 4 built-in + CSS vars | Light/dark (GitHub) | 7 named + custom JSON | Dark/light/sepia | Add named presets (dracula, etc.) |
| **Dark mode** | Plugin / media query | GitHub-style | Auto-detect terminal bg | Manual toggle | Auto-detect OS preference |
| **Mermaid** | Community plugin | No | No | Built-in | -- |
| **Syntax highlight** | Prism.js plugin | GitHub API | Terminal ANSI colors | Shiki (17 langs) | -- |
| **GFM support** | Partial | Full (GitHub API) | Via goldmark | Full (comrak) | -- |
| **GitHub Alerts** | No | Via GitHub API | No | Built-in | -- |
| **Frontmatter** | No | No | No | Styled property table | -- |
| **Live reload** | Runtime loading | File watch + auto-refresh | No | Not yet | File watcher (Tauri) |
| **Export** | No (runtime only) | HTML export | No | Not yet | HTML/PDF export |
| **Plugin system** | 6 lifecycle hooks | None | None (Glamour is separate) | Not yet | Rust plugin hooks |
| **CLI launch** | \`docsify serve\` | \`grip file.md\` | \`glow file.md\` | Not yet | \`mdpad .\` / \`mdpad file.md\` |
| **Embedded content** | MD, video, audio, iframe | No | No | No | Transclusion / \`!include\` |
| **Cover page** | \`_coverpage.md\` convention | No | No | No | Folder cover pages |
| **Configuration** | JS object in HTML | Python config file | Env vars + CLI flags | Not yet | YAML/TOML config file |
| **Offline** | Yes (all client-side) | WIP | Yes | Yes (Tauri native) | -- |
| **Wide mode** | No | \`render_wide\` flag | Word wrap config | No | Content width toggle |

---

## Recommendations for mdpad

### High priority (core UX gaps these tools expose)

1. **Auto-detect OS dark/light mode** (from glow)
   mdpad should read the system theme preference on launch and apply the
   matching theme. Tauri provides \`window.matchMedia('(prefers-color-scheme: dark)')\`.
   Currently mdpad requires manual toggle.

2. **Full-text content search** (from docsify)
   Quick Open (Ctrl+P) searches filenames only. Add Ctrl+Shift+F for
   full-text search across all markdown files in the workspace, with
   configurable heading depth indexing.

3. **Zero-config CLI launch** (from grip)
   \`mdpad .\` to open current directory, \`mdpad README.md\` to open a single
   file. This is table-stakes for developer tools. Tauri's CLI plugin
   supports this.

4. **File watcher with live reload** (from grip)
   When a file changes on disk, update the preview without user action.
   Tauri's \`notify\` crate handles filesystem events. This is critical
   for the "edit in VS Code, preview in mdpad" workflow.

### Medium priority (competitive differentiation)

5. **Named theme presets** (from glow)
   Ship with 5-7 popular themes: github-light, github-dark, dracula,
   tokyo-night, solarized-dark, one-dark, nord. Users expect this from
   any modern developer tool.

6. **Flat file list view** (from glow)
   Add an alternative sidebar view that shows all markdown files in a flat,
   filterable list instead of the tree hierarchy. Useful for large repos
   where you know the filename but not the path.

7. **Content width toggle** (from grip)
   A simple toggle between constrained (prose-width, ~720px) and wide
   (full-width) content rendering. Useful for tables and diagrams.

8. **HTML export** (from grip)
   Export rendered markdown as standalone HTML with inlined styles.
   Useful for sharing with non-technical stakeholders.

### Low priority (future differentiators)

9. **Folder cover pages** (from docsify)
   When opening a directory that contains a \`_coverpage.md\` or \`README.md\`,
   show it as the folder's landing page in the content area.

10. **Transclusion / embedded markdown** (from docsify)
    Support \`!include(path/to/file.md)\` syntax to compose documents from
    fragments. Valuable for documentation projects with shared sections.

11. **Plugin lifecycle hooks** (from docsify)
    When building comrak extensions (E004), design the pipeline with
    \`before_parse\` / \`after_render\` hooks so users can add custom
    transformations.

12. **Git-aware file discovery** (from glow)
    Detect git repository boundaries and offer a "show all markdown in
    this repo" mode, even when launched from a subdirectory.

### Anti-patterns to avoid

- **grip's API dependency**: Never depend on an external API for rendering.
  mdpad's comrak-based local rendering is the right choice.

- **docsify's runtime-only approach**: No build step is elegant for docs
  sites but fragile for a desktop app. mdpad should pre-render for speed.

- **glow's removed stash feature**: Cloud features add complexity and
  maintenance burden. Keep mdpad focused on local-first functionality.

---

## Sources

- [docsify.js official site](https://docsify.js.org/)
- [docsify GitHub repository](https://github.com/docsifyjs/docsify)
- [docsify plugins documentation](https://github.com/docsifyjs/docsify/blob/develop/docs/plugins.md)
- [docsify configuration](https://github.com/docsifyjs/docsify/blob/develop/docs/configuration.md)
- [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable/)
- [awesome-docsify plugin list](https://github.com/docsifyjs/awesome-docsify)
- [docsify-darklight-theme](https://github.com/boopathikumar018/docsify-darklight-theme)
- [grip GitHub repository](https://github.com/joeyespo/grip)
- [grip manpage](https://manpages.ubuntu.com/manpages/focal/man1/grip.1.html)
- [glow GitHub repository](https://github.com/charmbracelet/glow)
- [glamour stylesheet engine](https://github.com/charmbracelet/glamour)
- [glamour styles gallery](https://github.com/charmbracelet/glamour/blob/master/styles/gallery/README.md)
- [charmbracelet/glow DeepWiki](https://deepwiki.com/charmbracelet/glow)
`,
  ".plan/reports/2026-03-30-feature-research.md": `# Feature Research — Markdown Rendering & Editor Capabilities

**Date**: 2026-03-30
**Linked from**: [Backlog](../BACKLOG.md)

Research covering: simple editor markdown plugins, full GFM spec, markdown
extensions beyond GFM, Obsidian/Notion/Typora patterns, and code highlighting
state of the art. Priority tags: **[MUST]** / **[NICE]** / **[LATER]**

---

## 1. Simple Editors — Markdown-Specific Features

### Notepad++ (via plugins)
- **NppMarkdownPanel** — live preview pane inside the editor window (WebView-based)
- **MarkdownViewerPlusPlus** — rendered preview in side pane, clicks open in browser
- Both support basic GFM; no TOC, no outline, no math
- No folding of markdown sections (folding is based on indentation/braces only)
- Syntax highlighting via custom language file (bold, italic, heading colors)

### Sublime Text (via packages)
- **MarkdownEditing** — improved syntax highlighting, correct ruler/wrap settings,
  auto-pair \`**\`, \`_\`, backtick, bracket matching for links
- **MarkdownPreview** — renders to browser tab (GitHub API or local Python parser);
  supports GFM, math (MathJax), Mermaid via extensions
- **MarkdownTOC** — auto-generates and maintains \`<!-- MarkdownTOC -->\` block in file
- **Minimap** — file minimap available in all modes (not markdown-specific)
- **Multiple cursors** — core Sublime feature, invaluable for editing markdown tables
- **Column selection** (\`Shift+right-click drag\`) — useful for table column editing
- No built-in folding of markdown sections; only indentation-based folding

### Kate (KDE editor)
- Syntax highlighting for markdown (headings, emphasis, code, links in different colors)
- Code folding for fenced code blocks
- Outline view via "Symbols" panel — lists headings with click-to-jump
- Preview panel (Kate 20.12+) — rendered HTML side-by-side using KSyntaxHighlighting
- Spell checking inline with squiggly underlines
- Vi input mode (modal editing built-in)
- Word count in status bar

### gedit (GNOME)
- Markdown plugin via \`gedit-plugins\` — preview in embedded WebView
- Spell checking
- Minimap plugin
- Line numbers, word wrap toggle
- No outline/TOC

### VS Code (reference — full markdown mode)
- Split pane preview (\`Ctrl+K V\`) synchronized bidirectionally
- Outline panel with full heading hierarchy + click to jump
- Double-click preview element to jump to source location
- Math rendering via KaTeX (\`$\` inline, \`$$\` block)
- Broken-link highlighting with diagnostics
- Rename header → updates all \`[text](#heading)\` links workspace-wide
- Smart selection expanding across blocks (heading, list, quote, code)
- Path completions in links (\`/\`), heading completions (\`#\`)
- Custom CSS for preview via settings
- Folding markdown sections by heading level

### Key takeaways from simple editors
- Outline/TOC with click-to-jump is the single most-requested feature after preview
- Folding by heading (not just by indent) is a VS Code-level feature absent in simple editors
- Multiple cursors and column selection are table editing lifesavers
- Spell check is expected even in read-focused tools

---

## 2. Full GFM Spec — What GitHub Supports

### CommonMark baseline (GFM extends these)
- ATX headings (\`#\` ... \`######\`)
- Setext headings (underline with \`===\` or \`---\`)
- Paragraphs, hard line breaks (two trailing spaces or \`\\\`)
- Emphasis \`*italic*\`, strong \`**bold**\`, \`***bold italic***\`
- Inline code \`\` \`code\` \`\`, fenced code blocks (\` \`\`\` \` or \`~~~\`)
- Blockquotes (\`>\`)
- Lists: unordered (\`-\`, \`*\`, \`+\`), ordered (\`1.\`)
- Thematic breaks (\`---\`, \`***\`, \`___\`)
- Links \`[text](url "title")\`, reference links \`[text][ref]\`
- Images \`![alt](src "title")\`
- HTML inline and blocks (pass-through)
- Autolinks \`<https://url>\` (angle-bracket form only in CommonMark)
- Backslash escapes

### GFM extensions (GitHub-specific additions)
| Feature | Syntax | Notes |
|---------|--------|-------|
| Tables | \`\\| col \\| col \\|\` with \`\\|---\\|---\\|\` separator | Alignment via \`:---:\` |
| Strikethrough | \`~~text~~\` | Single \`~\` not supported |
| Task lists | \`- [x] done\` / \`- [ ] todo\` | Clickable on GitHub |
| Autolinks (extended) | bare URLs without angle brackets | \`https://\` auto-linked |
| Tag filter | Sanitizes \`<script>\`, \`<style>\` etc | Security feature |

### GitHub-specific (not in formal GFM spec, rendered on github.com)
| Feature | Syntax | Status |
|---------|--------|--------|
| **Alerts** | \`> [!NOTE]\`, \`> [!TIP]\`, \`> [!IMPORTANT]\`, \`> [!WARNING]\`, \`> [!CAUTION]\` | Stable 2024 |
| **Math (inline)** | \`$x = y^2$\` | Renders via MathJax on github.com |
| **Math (block)** | \`$$\\n...\\n$$\` | Full LaTeX block display |
| **Mermaid diagrams** | \` \`\`\`mermaid \` fenced block | Mermaid v10 on github.com |
| **Footnotes** | \`[^1]\` inline, \`[^1]: text\` definition | Rendered on github.com |
| **Collapsed sections** | \`<details><summary>...</summary>\` HTML | Standard HTML, widely supported |
| **Color previews** | hex, rgb(), hsl() in backticks | Colored swatches in comments |
| **Mention links** | \`@username\`, \`#issue\` | GitHub-specific; not relevant for us |

### What GFM does NOT include (common misconceptions)
- Definition lists
- Abbreviations (\`*[abbr]: expansion\`)
- Superscript / subscript
- Underline
- Spoiler/hidden text
- Custom containers / admonitions (beyond alerts)
- Wiki-links \`[[page]]\`
- Emoji shortcodes (\`:rocket:\`) — GitHub processes them server-side post-render

---

## 3. comrak Extension Inventory

comrak (our chosen Rust parser) supports the following extensions beyond GFM.
All can be toggled independently:

### GFM extensions (included by default in GFM mode)
\`strikethrough\`, \`tagfilter\`, \`table\`, \`autolink\`, \`tasklist\`

### Extra extensions available in comrak
| Extension | Syntax | Notes |
|-----------|--------|-------|
| \`superscript\` | \`^text^\` | x^2^ |
| \`subscript\` | \`~text~\` | H~2~O |
| \`footnotes\` | \`[^1]\` / \`[^1]: text\` | Block footnotes (kramdown style) |
| \`inline_footnotes\` | \`^[text]\` | Inline footnote syntax |
| \`description_lists\` | \`: term\\n  definition\` | Definition list (DL/DT/DD) |
| \`front_matter_delimiter\` | \`---\` block at top | YAML/TOML frontmatter fence |
| \`alerts\` | \`> [!NOTE]\` | GitHub-style 5-type alerts |
| \`math_dollars\` | \`$inline$\` / \`$$block$$\` | Math via dollar delimiters |
| \`math_code\` | \`\` \`math \`math\` \`\` | Math via code span with \`math\` lang |
| \`shortcodes\` | \`:emoji_name:\` | Emoji shortcodes |
| \`wikilinks_title_before_pipe\` | \`[[label\\|url]]\` | Wiki-link syntax variant 1 |
| \`wikilinks_title_after_pipe\` | \`[[url\\|label]]\` | Wiki-link syntax variant 2 |
| \`underline\` | \`__text__\` | Underline (overrides italic behavior) |
| \`spoiler\` | \`\\|\\|text\\|\\|\` | Hidden/spoiler text (Discord style) |
| \`greentext\` | Lines starting with \`>\` | 4chan-style green text |
| \`multiline_block_quotes\` | \`>>>\` ... \`>>>\` | Block quote spanning multiple paragraphs |
| \`highlight\` | \`==text==\` | Highlighted/marked text |
| \`subtext\` | (TBD) | Similar to subscript |
| \`cjk_friendly_emphasis\` | CJK character awareness | Fixes emphasis in Chinese/Japanese/Korean |

**Implication**: comrak already supports all the extensions we could want. The
question is which to enable in mdpad. No custom parser work needed.

---

## 4. Diagram & Visual Extensions

### Mermaid (de facto standard for devs)
Supported diagram types in Mermaid 11 (2025):
- Flowchart / Graph
- Sequence diagram
- Class diagram
- State diagram
- Entity Relationship (ER)
- Gantt chart
- Pie chart
- Quadrant chart
- Journey (user journey)
- GitGraph
- Mindmap
- Timeline
- Block diagram
- Architecture diagram (beta)
- Packet diagram

### Other diagram formats (GLFM / Kroki)
| Format | Use case | Priority |
|--------|----------|----------|
| PlantUML | UML class, sequence, component | **[NICE]** |
| D2 | Modern infrastructure diagrams | **[NICE]** |
| Graphviz/DOT | Dependency graphs | **[LATER]** |
| draw.io XML | Embedded diagrams | **[LATER]** |

For mdpad: Mermaid is **[MUST]**, others are **[LATER]**.

---

## 5. Markdown Extensions Beyond GFM — Developer Focus

### Admonitions / Callouts / Alerts
Three competing syntaxes, all popular:

| Syntax | Origin | Example |
|--------|--------|---------|
| GitHub Alerts | GitHub (2024) | \`> [!NOTE]\` |
| Obsidian Callouts | Obsidian | \`> [!warning] Title\` (collapsible: \`> [!warning]+\`) |
| Python/MkDocs Admonitions | Material MkDocs | \`!!! note "Title"\` |
| RST-style directives | Sphinx, MyST | \`:::{note}\` |

The **GitHub Alert** syntax is becoming the community standard. comrak supports it.
Obsidian adds collapsible callouts (\`+\` suffix = expanded, \`-\` = collapsed) — useful.

### Wiki-links \`[[page]]\`
- Obsidian: \`[[pagename]]\`, \`[[pagename|display text]]\`, \`[[page#heading]]\`, \`[[page^block]]\`
- Used heavily in \`.plan/\` and \`.arch/\` markdown directories
- comrak supports both \`wikilinks_title_before_pipe\` and \`wikilinks_title_after_pipe\`
- For mdpad: resolving wiki-links to actual files in the open folder is a killer feature
  for AI-augmented developers navigating \`.plan/\` structures **[NICE]**

### Footnotes
- Block footnotes: \`[^1]\` inline, \`[^1]: content\` at bottom
- Inline footnotes: \`^[content right here]\`
- Renders as superscript numbers linking to footer section
- Common in academic and long-form developer docs **[NICE]**

### Definition Lists
\`\`\`
Term
: Definition text here
: Second definition
\`\`\`
Rarely used in practice but supported by many parsers **[LATER]**

### Abbreviations
\`\`\`markdown
*[HTML]: Hyper Text Markup Language
\`\`\`
HTML auto-gets \`<abbr>\` tags throughout document. Useful for technical docs **[LATER]**

### Math / LaTeX
- \`$inline math$\` and \`$$block math$$\` syntax (pandoc convention)
- Dollar collision issue: \`$20,000\` — parsers must require non-space after \`$\`
- KaTeX renders faster than MathJax; MathJax has better accessibility
- GitHub uses MathJax; Obsidian uses MathJax; most others use KaTeX
- comrak's \`math_dollars\` + \`math_code\` extensions cover both syntaxes **[MUST]** (KaTeX)

### Emoji Shortcodes \`:name:\`
- \`:rocket:\` → 🚀, \`:warning:\` → ⚠️
- comrak \`shortcodes\` extension handles this
- Needs emoji map (gemoji or similar) **[NICE]**

### Superscript / Subscript
- \`^superscript^\` and \`~subscript~\`
- Used in math contexts, chemical formulas, academic writing
- comrak supports both **[NICE]** (enable by default — harmless)

### Highlight / Mark
- \`==highlighted text==\` → \`<mark>highlighted text</mark>\`
- Obsidian uses this; MkDocs Material supports it
- Useful for reviewing specs and plans **[NICE]**

### Spoiler / Hidden Text
- \`||spoiler text||\` (Discord style)
- \`> [!NOTE]\` collapsed (Obsidian: \`> [!note]-\`)
- Less relevant for a viewer, but trivial to enable **[LATER]**

### Collapsible Sections
HTML \`<details><summary>\` — supported via HTML passthrough in CommonMark.
No special extension needed; just render HTML blocks. **[MUST]** (already works)

### Custom CSS Classes / Containers
- \`:::note\` ... \`:::\` (Vuepress, Docusaurus style)
- Not in comrak by default; would need custom preprocessing
- **[LATER]**

---

## 6. Obsidian / Notion / Typora — Patterns Worth Stealing

### From Typora
- **Seamless WYSIWYG** — hashes visible on hover/focus only; hidden on blur
  Status: planned in mdpad as "Live Preview Mode" **[NICE]**
- **Source Code Mode** toggle \`Ctrl+/\` — instant raw markdown view
  Status: planned **[MUST]**
- **Focus Mode** — non-focused blocks faded to 40% opacity
  Status: planned **[NICE]**
- **Typewriter Mode** — cursor stays vertically centered
  Status: planned **[NICE]**
- **YAML frontmatter as styled table** — renders frontmatter as key-value card, not raw text
  Brilliant UX for AI-dev workflow where frontmatter carries status/metadata **[MUST]**
- **Context menus for tables** — right-click to add/delete row/column/align
  Status: **[NICE]** (editor mode)
- **Export to PDF** with CSS-based layout control

### From Obsidian
- **Three modes**: Source, Live Preview, Reading — clear mental model **[MUST]**
- **Properties panel** — visual YAML editor, not raw text; shows type-aware fields
  (date pickers for dates, toggle for booleans, tag editor for arrays) **[LATER]**
- **Collapsible callouts** — \`> [!note]+\` (expanded) / \`> [!note]-\` (collapsed)
  Useful for long spec documents **[NICE]**
- **Graph view** — visual map of all linked files; shows orphan files, clusters
  Interesting for \`.plan/\` / \`.arch/\` navigation but complex to build **[LATER]**
- **Backlinks panel** — "which files link to this file?" sidebar widget
  Extremely useful for \`.plan/\` structures **[NICE]**
- **Command Palette** (\`Ctrl+K\`) — fuzzy search across all commands
  Status: planned (Inkwell has this) **[MUST]**
- **Reading time estimate** — shows "5 min read" in status bar **[NICE]**
- **Tabs + split panes** — multiple files open simultaneously **[MUST]**
- **Drag-and-drop file reordering** in file tree
- **File reveal** — "Reveal in system explorer" from context menu **[MUST]**

### From Notion
- **Slash commands** \`/\` — quick block insertion menu (heading, list, code, table, etc.)
  Excellent for editing mode; reduces need for remembering syntax **[NICE]** (editor phase)
- **Drag-and-drop blocks** — reorder paragraphs by dragging left handle
  Complex to implement cleanly; **[LATER]**
- **Inline mentions** — \`@filename\` opens that file or creates link **[LATER]**
- **Breadcrumb navigation** — shows path: \`Root > .plan > epics > E001 > PLAN.md\` **[NICE]**
- **Embed blocks** — paste URL → becomes live embed (video, tweet, etc.) **[LATER]**
- **Database views** — table/kanban/calendar of structured data; requires frontmatter parsing
  Dataview-style queries would be powerful for AI-dev workflow **[LATER]**

### From Logseq / Roam
- **Block references** \`((block-uuid))\` — reference a specific paragraph from another file
  Extremely powerful but complex; creates tight coupling between files **[LATER]**
- **Daily notes** — auto-creates a dated markdown file for journaling
  Could be a \`.plan/JOURNAL.md\` accelerator **[LATER]**

### From Zettlr
- **Bibliography / citations** — BibTeX / CSL JSON integration
  Academic use case; not for AI-dev workflow **[SKIP]**
- **LanguageTool grammar check** — inline grammar/style suggestions
  Useful for writing docs and specs **[LATER]**
- **Snippet system** — named text snippets with cursor-position placeholders
  Useful for repetitive markdown structures (task file templates etc.) **[NICE]**

---

## 7. Code Syntax Highlighting — State of the Art

### Library Comparison

| Library | Engine | Languages | Performance | Bundle |
|---------|--------|-----------|-------------|--------|
| **Shiki** | TextMate grammar (VS Code engine) | 200+ | Slower startup, accurate | ~350KB+ |
| **Prism.js** | Custom grammar | 300+ | Fast, modular | ~30KB base |
| **highlight.js** | Custom grammar | 190+ | Fast, auto-detect | ~100KB |
| **starry-night** | TextMate grammar (GitHub engine) | 600+ | Medium | Large |

**Recommendation for mdpad**: Shiki is the clear winner for a developer tool:
- Same engine as VS Code — developers trust the output
- TextMate grammars = same highlighting they see in their IDE
- Supports all VS Code themes out of the box
- Active development; Astro, Next.js, VitePress all use it in 2025

### Advanced Code Block Features

**Line highlighting** \`{1,3-5}\` in meta string:
\`\`\`
\`\`\`rust {1,3-5}
\`\`\`
Highlights specific lines. comrak passes meta strings through; Shiki can consume them.

**Diff notation** (Shiki \`transformerNotationDiff\`):
\`\`\`
\`\`\`ts
const a = 1  // [!code --]
const b = 2  // [!code ++]
\`\`\`
Shows red/green diff lines within a code block. Excellent for ADRs and changelogs.

**Word highlighting** (Shiki \`transformerNotationHighlight\`):
- \`// [!code highlight]\` on a specific line
- Or inline: \`word\` gets wrapped in \`<mark>\`

**Line numbers** — Shiki transformer adds \`data-line\` attributes; styled with CSS counters.
Standard user expectation for code-heavy docs.

**Copy button** — floating button per code block. Inkwell already does this.
Absolute must-have for developer audience. **[MUST]**

**Collapsed code** — long blocks fold with "show more" toggle. **[NICE]**

**File name / language badge** — metadata shown above code block:
\`\`\`
\`\`\`typescript filename="src/main.ts"
\`\`\`
Display as \`[ TypeScript ] [ src/main.ts ] [ Copy ]\` header bar. **[NICE]**

**Language auto-detection** — when no language specified, use:
- \`@vscode/vscode-languagedetection\` (Microsoft ML model, same as VS Code)
- Or heuristic-based fallback (highlight.js has \`highlightAuto\`)

**Twoslash (TypeScript types in code blocks)** — hover shows inferred types.
Complex to implement; more for a documentation site than a viewer. **[LATER]**

### Language Coverage Targets
For a developer-focused viewer, priority languages:
- Tier 1 (**[MUST]**): \`bash\`/\`shell\`, \`javascript\`, \`typescript\`, \`python\`, \`rust\`,
  \`go\`, \`json\`, \`yaml\`, \`toml\`, \`sql\`, \`html\`, \`css\`, \`markdown\`, \`dockerfile\`
- Tier 2 (**[NICE]**): \`java\`, \`c\`, \`cpp\`, \`csharp\`, \`ruby\`, \`php\`, \`swift\`,
  \`kotlin\`, \`r\`, \`scala\`, \`haskell\`, \`lua\`, \`vim\`, \`nginx\`, \`http\`, \`graphql\`
- Tier 3 (**[LATER]**): 100+ more via Shiki's full grammar set (lazy-loaded)

---

## 8. Navigation & UX Patterns

### Document Navigation
- **Heading anchors** — every \`H1\`–\`H6\` gets an anchor \`id\`; hover shows \`#\` link **[MUST]**
- **TOC sidebar** — hierarchical heading tree, sticky while scrolling **[MUST]**
- **Breadcrumb** — \`Folder > Subfolder > file.md\` above document **[NICE]**
- **Back/forward navigation** — browser-like history within the session **[NICE]**
- **Jump to heading** via \`Ctrl+G\` or Command Palette **[NICE]**
- **Section folding** — collapse sections by clicking heading arrows **[NICE]**

### File Tree Features
- **Git status indicators** — colored dots/icons showing modified, new, untracked files
  Inkwell lacks this; huge differentiator for AI-dev workflow **[NICE]**
- **File type badges** — \`.md\` (default), \`.yaml\`, \`.json\` etc. with distinct icons **[NICE]**
- **Recent files list** — last N files opened, quick access **[NICE]**
- **Pinned files** — star/pin files to top of tree **[LATER]**
- **Collapse all / expand all** tree actions **[NICE]**

### Reading Experience
- **Reading time** — "~5 min read" in status bar **[NICE]**
- **Word count / char count** — live in status bar **[MUST]** (already planned)
- **Scroll position memory** — restores scroll position when reopening file **[NICE]**
- **Print-friendly styles** — \`@media print\` CSS for clean output **[NICE]**
- **Zoom** — \`Ctrl+=\` / \`Ctrl+-\` for font size adjustment **[MUST]**

---

## 9. Editor-Side Features (future edit mode)

### Text Editing Intelligence
- **Auto-pair** — \`**\`, \`*\`, \`\` \` \`\`, \`[\`, \`(\`, \`"\` close automatically **[MUST]** (editor phase)
- **List continuation** — Enter in list creates new \`- \` or \`1. \` item **[MUST]**
- **Table formatting** — auto-align pipe table columns on save **[NICE]**
- **Table editing** — Tab moves between cells; Enter adds row at end **[NICE]**
- **Smart paste** — paste URL on selected text → creates \`[text](url)\` link **[NICE]**
- **Image paste** — paste clipboard image → saved to \`assets/\` and linked **[NICE]**

### Writing Modes (already in UX vision)
- **Focus Mode** — fade non-focused paragraph **[NICE]**
- **Typewriter Mode** — cursor at vertical center **[NICE]**
- **Zen Mode** — hide all chrome **[NICE]**

### Quality Tools
- **Spell check** — inline squiggly underlines (browser spell check or custom) **[NICE]**
- **Link validation** — dead links highlighted in preview **[NICE]**
- **Frontmatter validation** — warn on malformed YAML **[NICE]**

---

## 10. Priority Summary

### Must-Have (v1.0)
- Full GFM rendering: tables, strikethrough, task lists, autolinks
- GitHub Alerts: \`> [!NOTE/TIP/IMPORTANT/WARNING/CAUTION]\`
- Math: \`$inline$\` and \`$$block$$\` via KaTeX
- Mermaid diagrams (v10+)
- Syntax highlighting via Shiki (Tier 1 languages)
- Copy button on every code block
- Heading anchors with hover-reveal \`#\` link
- Collapsible \`<details>\` blocks (HTML passthrough)
- YAML frontmatter rendered as key-value card (not raw)
- TOC sidebar with click-to-jump
- Three modes: Source / Live Preview / Reading

### Nice-to-Have (v1.x)
- Emoji shortcodes \`:name:\` → Unicode
- Superscript \`^x^\` and subscript \`~x~\`
- Highlight \`==text==\`
- Footnotes \`[^1]\`
- Obsidian-style collapsible callouts (\`+\`/\`-\` suffix)
- Wiki-links \`[[page]]\` resolved to actual files in open folder
- Section folding in preview by heading level
- Shiki: line highlighting, diff notation, file name badge, line numbers
- Backlinks panel ("linked from")
- Reading time estimate
- Breadcrumb navigation
- Git status indicators in file tree
- Scroll position memory per file

### Later / Post-v1
- Definition lists, abbreviations
- Graph view
- Properties panel (visual YAML editor)
- Dataview-style frontmatter queries
- PlantUML, D2, Graphviz diagram support
- Block references \`((uuid))\`
- Daily notes
- Drag-and-drop blocks
- Twoslash TypeScript annotations
- LanguageTool grammar check
- Snippet / template system

### Skip (out of scope for this tool)
- Bibliography / citations (academic — not the target user)
- Cloud sync / accounts
- Real-time collaboration
- Plugin marketplace (keep simple)
- Kanban / database views (that's Notion/Obsidian territory)
- Block-based outliner format (Logseq/Roam — opinionated format)

---

## 11. Competitive Tools Registry — CLI & Server Markdown Renderers

Tools specifically relevant to mdpad's CLI/server/AI niche (desktop editors covered
in [Market Research](2026-03-28-market-research.md)).

| Tool | Lang | Type | URL | Key Features | mdpad Relevance |
|------|------|------|-----|-------------|-----------------|
| **docsify.js** | JS | Browser/server | https://docsify.js.org | No static HTML build, runtime rendering, plugin system, sidebar nav, search, themes | Server mode inspiration; plugin architecture; sidebar helpers |
| **grip** | Python | Browser | https://github.com/joeyespo/grip | GitHub API rendering (exact GitHub look), CLI \`grip file.md\`, auto-refresh | CLI UX reference; rendering fidelity benchmark. Downside: API rate limits |
| **glow** | Go | Terminal TUI | https://github.com/charmbracelet/glow | TUI file browser, glamour rendering, stash (bookmarks), pager mode | TUI file browser UX ideas; CLI workflow inspiration |
| **Nimbalyst** | - | Desktop | AI-native editor | AI-first editing, context-aware suggestions | AI integration patterns; differentiation research |
| **mdbook** | Rust | Browser/CLI | https://github.com/rust-lang/mdBook | Rust-native, SUMMARY.md nav, search, themes, print page | Rust ecosystem reference; navigation patterns |
| **docsaurus** | JS | Static site | https://docusaurus.io | MDX, versioning, i18n, sidebar from filesystem | Documentation site patterns (less relevant for viewer) |

### Research Priorities
- **docsify.js** — HIGH: closest to mdpad's server mode. Investigate plugin system,
  sidebar generation from filesystem, search implementation, theme switching
- **grip** — MEDIUM: compare rendering approach (GitHub API vs local comrak).
  Study CLI UX (\`grip file.md\` opens browser automatically)
- **glow** — MEDIUM: TUI file browser is excellent. Study Charmbracelet's Bubble Tea
  framework patterns for potential future terminal mode
- **Nimbalyst** — LOW: AI-native editor, research their AI integration approach
  as differentiation benchmark

---

## Sources
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [GitHub Basic Writing and Formatting Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [comrak ExtensionOptions — docs.rs](https://docs.rs/comrak/latest/comrak/options/struct.Extension.html)
- [Shiki — Introduction](https://shiki.style/guide/)
- [GitLab Flavored Markdown Docs](https://docs.gitlab.com/user/markdown/)
- [Obsidian Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts)
- [NppMarkdownPanel](https://github.com/mohzy83/NppMarkdownPanel)
- [Sublime Text MarkdownPreview](https://github.com/facelessuser/MarkdownPreview)
- [Expressive Code — Syntax Highlighting](https://expressive-code.com/key-features/syntax-highlighting/)
- [KaTeX](https://katex.org/)
- [GitHub Alerts Discussion](https://github.com/orgs/community/discussions/16925)
- [The Ultimate Markdown Guide 2026](https://agmazon.com/blog/articles/technology/202603/markdown-complete-guide-en.html)
`,
  ".plan/reports/2026-03-30-markdown-ecosystem-research.md": `---
title: "Markdown Ecosystem Research: State, Trends, and Recommendations for mdpad"
date: 2026-03-30
author: research-agent
tags: [markdown, MDX, diagrams, AI-dev, trends]
---

# Markdown Ecosystem Research

> Research for mdpad: understanding the full markdown landscape to make informed
> decisions about feature scope, parser choice, and product positioning.

---

## 1. State of Markdown in 2025–2026

### The Standard Landscape

Markdown has no single governing authority — it is a fragmented ecosystem held together
by CommonMark, which is as close to a "standard" as the format has. CommonMark 0.31.2
(released 2024) is the current specification. It is precise, complete, and has a full
test suite. It is the base that everything else builds on.

**The hierarchy in practice:**

\`\`\`
CommonMark (spec)
└── GFM — GitHub Flavored Markdown (CommonMark + 5 extensions)
    ├── GLFM — GitLab Flavored Markdown (GFM + math, multiline blockquotes, references)
    ├── Obsidian Markdown (GFM + wikilinks, callouts, embeds, properties)
    └── "Platform markdown" — Notion, Linear, Confluence (GFM-ish, proprietary quirks)
\`\`\`

**Assessment**: CommonMark is stable. GFM is the de-facto minimum for developer tools.
No new standard is emerging that would replace either. The fragmentation lives in
extensions, not the core.

### GFM (GitHub Flavored Markdown)

GFM adds exactly five extensions over CommonMark:
- **Tables** — pipe-delimited
- **Task lists** — \`- [x]\` checkboxes
- **Strikethrough** — \`~~text~~\`
- **Autolinks** — bare URL → link
- **Disallowed raw HTML** (security filter)

GFM is the universal minimum for developer documentation. Any markdown viewer that
does not render GFM correctly is non-functional for developers.

**Recommendation**: GFM support is table stakes. comrak (our chosen parser) passes the
GFM spec 100%. No action needed here — just turn on all five GFM extensions.

### GitLab Flavored Markdown (GLFM)

GLFM extends GFM with:
- **Math** — \`$inline$\` and \`$$block$$\` via KaTeX/MathJax
- **Multiline blockquotes** — \`>>>\` syntax
- **GitLab cross-references** — \`#123\`, \`@user\`, \`!12\` (MR), \`%42\` (milestone)
- **Color chips** — inline hex colors rendered as colored squares
- **Superscript/subscript** — \`^sup^\` / \`~sub~\`
- **Footnotes** — \`[^1]\` syntax (non-standard but widely expected)
- **Definition lists** — \`Term:\\n: definition\`

**Key insight**: The GitLab cross-references are implementation-specific (they resolve
against a GitLab project). A standalone viewer cannot implement these meaningfully.
However, the remaining extensions (math, footnotes, superscript) are portable and
worth supporting.

**Recommendation for mdpad**: Support math (KaTeX), footnotes, and superscript.
Skip GLFM-specific reference linking.

### Obsidian Markdown

Obsidian's extensions are the most radical departure from standard markdown:

- **Wikilinks** — \`[[Note Title]]\` and \`[[Note|Alias]]\`
- **Embeds** — \`![[Note]]\` pulls another note's content inline
- **Block references** — \`[[Note#^block-id]]\` — link to a specific paragraph
- **Callouts** — blockquote-derived colored boxes, 13 built-in types, nestable,
  collapsible (\`> [!NOTE]+\`)
- **Properties** (v1.4+) — YAML frontmatter with a visual editor in app
- **Mermaid** — native support
- **Dataview** — community plugin, treats frontmatter as a queryable database

**Key insight**: Obsidian's extensions are deliberately non-portable. They work only
inside Obsidian vaults. The callout syntax (\`> [!NOTE]\`) is increasingly copied by
other tools (GitHub's alert syntax, for example), but it's not yet standardized.

GitHub added their own alert syntax in 2023: \`> [!NOTE]\`, \`> [!TIP]\`, \`> [!WARNING]\`,
\`> [!CAUTION]\`, \`> [!IMPORTANT]\`. This is now rendered on GitHub.com natively.
This is the callout syntax gaining traction.

**Recommendation for mdpad**: Implement GitHub-style alerts (\`> [!NOTE]\` etc.) —
this is where the ecosystem is converging. Consider Obsidian-style callouts as v2.

### Docusaurus / Astro / VitePress Extensions

These static site generators treat markdown as content and add framework-specific
compilation features:

| Feature | Docusaurus | Astro | VitePress |
|---------|-----------|-------|-----------|
| MDX (JSX in markdown) | Yes (default) | Optional | No |
| Frontmatter (YAML) | Yes | Yes (YAML + TOML) | Yes |
| Code line highlighting | Yes | Yes | Yes |
| Admonitions/callouts | Yes | Via plugins | Yes |
| Custom components in md | MDX | MDX or Markdoc | Vue components |
| Markdoc support | No | Yes (optional) | No |

**Key insight for mdpad**: These platforms add value through build-time integration
(component rendering, versioning, search indexing). A standalone viewer cannot
replicate build-time JSX execution. What we *can* render: frontmatter, admonitions,
code highlighting, diagrams.

**Assessment**: The SSG-specific extensions are not relevant to a desktop viewer.
Frontmatter display and code syntax highlighting are the high-value portable features.

---

## 2. MDX — Should We Support It?

### What Is MDX?

MDX 3 (current, released late 2023) = Markdown + JSX + JavaScript imports/exports.
It compiles to React (or Preact/Vue) components. Example:

\`\`\`mdx
import Chart from './Chart'

# My Doc

<Chart data={props.data} />

Normal **markdown** here.
\`\`\`

MDX is a *build-time* format. It requires a bundler (webpack, Vite, esbuild) to
execute the JavaScript and render the JSX. It is not a renderable string at runtime
without a full JS runtime.

### Who Uses MDX?

- **Next.js** — \`@next/mdx\`, used for docs and blog posts
- **Docusaurus 3** — MDX by default for all \`.md\` and \`.mdx\` files
- **Astro** — optional \`@astrojs/mdx\` integration
- **Gatsby** — \`gatsby-plugin-mdx\`
- **Remix** — via custom loaders

Adoption is strong in the web content and developer documentation space. It is the
dominant format for interactive developer documentation (component playgrounds,
live code demos).

### Is MDX Relevant for AI-Dev Workflows?

No, not primarily. AI generates plain markdown, not JSX. The typical AI-dev workflow
produces:
- \`PLAN.md\`, \`ADR-001.md\`, \`BACKLOG.md\` — plain GFM
- \`SPEC.md\`, \`AGENTS.md\`, \`CLAUDE.md\` — plain GFM with YAML frontmatter
- Mermaid diagram blocks inside markdown code fences
- Frontmatter-heavy markdown for structured metadata

MDX is a web publishing tool. AI-generated project documentation is GFM with
frontmatter and diagrams — no JSX involved.

### What Would Supporting MDX Require?

Options in a Tauri Rust backend:
1. **Shell out to Node.js** — call \`@mdx-js/mdx\` to compile, get HTML back.
   Requires Node installed. Fragile, heavy.
2. **Bundle a JS engine** (QuickJS, Boa crate) — execute MDX compilation in-process.
   Significant size and complexity increase.
3. **Partial support** — strip JSX, render pure markdown content, show placeholder
   for JSX component blocks.
   Feasible in Rust. Lossy but useful.

### Recommendation

**v1**: No MDX support. The target user (AI-augmented developer reading specs and
plans) has zero MDX files in their workflow.

**v2**: Consider option 3 (graceful degradation) — detect \`.mdx\` files, render
the markdown content, display a notice for JSX blocks. Low effort, good UX for
anyone who opens an MDX file accidentally.

**Never**: Full MDX compilation with JSX execution. This is a scope bloat that
turns a viewer into a mini-bundler.

---

## 3. What People Want from Markdown Editors and Viewers

### Top Developer Requests (synthesized from Reddit r/markdown, HN, dev.to, 2024–2025)

**Rendering quality:**
- Correct GFM tables (many tools still break complex tables)
- Code syntax highlighting (non-negotiable)
- Math support (KaTeX preferred over MathJax for speed)
- Mermaid rendering without external server calls
- GitHub-style alerts/callouts
- Correct footnote rendering

**Navigation:**
- TOC sidebar with scroll-sync highlighting
- File tree for browsing a documentation directory
- Keyboard navigation (j/k scroll, quick file open)
- Back/forward navigation between files (like a browser)
- Scroll position memory per file

**Performance:**
- Instant open (no "loading" splash)
- Fast rendering for large files (500–2000 lines, AI generates these)
- No memory bloat (Electron-based tools are despised for this)

**Workflow integration:**
- CLI launch: \`mdpad .\` or \`mdpad file.md\`
- File watcher — auto-reload when the file changes
- Wikilink-style navigation (click \`[[filename]]\` to open)
- Deep link to heading — \`file.md#heading\`
- Copy rendered HTML or markdown source easily

**Search:**
- Full-text search across folder
- Highlight matches in preview
- Search within current file (Ctrl+F in preview pane)

**Missing from the market (gap analysis):**
- A viewer purpose-built for *reading* (not editing) AI-generated docs
- Folder-level navigation + markdown rendering in a small, fast binary
- Wikilink navigation across local files without requiring an Obsidian vault
- Frontmatter viewer (structured display of YAML metadata)
- Git blame / history integration for markdown files

### What AI Developers Specifically Need

The spec-driven development workflow (GitHub Spec Kit, Claude Code's plan-first
approach, Replit's Plan Mode) generates a specific file pattern:

\`\`\`
PLAN.md, SPEC.md, ORCHESTRATOR.md — long, structured planning docs
tasks/E001-T01-*.md — individual task specs with YAML frontmatter
ADR/001-*.md — architecture decisions
JOURNAL.md — append-heavy live notes
BACKLOG.md — running list of ideas
\`\`\`

Key needs for this workflow:
1. **Frontmatter rendering** — display \`id\`, \`status\`, \`created\`, \`epic\` fields cleanly
2. **Checkbox state rendering** — \`[x]\` / \`[ ]\` tasks visible at a glance
3. **Auto-reload** — Claude writes to file → viewer refreshes (zero friction)
4. **Large file handling** — JOURNAL.md can grow to 1000+ lines
5. **Folder navigation** — navigate between plan files without leaving the viewer
6. **Status badges** — render frontmatter \`status: done|in-progress|blocked\` as visual tags
7. **Link following** — click relative markdown links \`[Task](../tasks/E001-T01.md)\`

---

## 4. AI + Markdown: The Intersection

### The AGENTS.md / CLAUDE.md Ecosystem

The most significant 2025 development in AI+Markdown: the formalization of AI instruction
files as markdown documents.

**AGENTS.md** — vendor-neutral, launched mid-2025 by OpenAI, Anthropic, Google, Cursor,
Sourcegraph, Factory. Donated to Linux Foundation's Agentic AI Foundation (AAIF) in
December 2025. Supported by Claude Code, Cursor, GitHub Copilot, Gemini CLI, Windsurf,
Aider, Zed, Warp, RooCode. Over 60,000 GitHub repos have adopted it.

**CLAUDE.md** — Anthropic's per-project context file. Standard GFM with headings
organizing rules, conventions, and instructions for Claude.

**SKILL.md** — Emerging agent skill definition format (agentskills.io open standard).
YAML frontmatter for metadata + markdown body for instructions.

**Key implication for mdpad**: These files are now first-class documentation
artifacts in AI-dev projects. A viewer that renders them beautifully — showing
frontmatter clearly, rendering task lists, code blocks — serves a real need.

### AI Generates Structured Markdown Heavily

AI systems produce markdown with these patterns:
- YAML frontmatter with \`status\`, \`id\`, \`created\`, \`epic\`, \`tags\` fields
- Task lists with \`[ ]\` / \`[x]\` mixed depth
- Code blocks with language hints (rust, typescript, bash, yaml)
- Mermaid diagrams for architecture visualization
- Tables for comparison or status tracking
- Callout-style blockquotes for notes/warnings

The document lengths AI generates are significantly longer than human-written markdown.
A spec for a multi-week project can be 500–2000 lines. A JOURNAL.md can reach 5000+
lines over weeks. Performance at these sizes is a real differentiator.

### Auto-Reload / File Watching

This is the #1 quality-of-life feature for AI-dev workflows. The pattern is:
1. Developer prompts agent
2. Agent writes to \`PLAN.md\`
3. Developer should see updated content immediately

Without auto-reload, the developer must manually refresh. This interrupts flow.
Every significant competitor (VS Code preview, Typora, Obsidian) does this.
For mdpad it is non-negotiable — it is core to the value proposition.

### Frontmatter as Structured Metadata

YAML frontmatter is how AI agents encode machine-readable metadata in human-readable docs.
The \`frontmatter-format\` project (github.com/jlevy/frontmatter-format) formalizes this
as a convention for any text file (markdown, HTML, Python, CSS).

For a markdown viewer, frontmatter display options to consider:
- **Raw YAML** — show the \`---\` block as a code block (current minimal approach)
- **Rendered table** — convert frontmatter to a key/value table with styling
- **Status badges** — detect common keys (\`status\`, \`lifecycle\`, \`tags\`) and render
  them as visual tags above the document

The status badge approach is the highest-value option — it immediately communicates
document state without requiring the reader to parse the YAML header.

---

## 5. Chart and Diagram Ecosystem

### Mermaid — The Clear Winner for Now

**Current diagram types (2025):**
- Flowchart / Graph (most used)
- Sequence diagram
- Class diagram
- State diagram
- Entity-Relationship (ER)
- Gantt chart
- Git graph
- Mindmap
- C4 architecture diagram
- XY chart (bar, line)
- Sankey diagram
- Kanban
- Quadrant chart
- Block diagram (new 2024)
- Packet diagram

**Platform support**: GitHub (native), GitLab (native), Notion, Confluence, Linear,
HackMD, VS Code (extension), Obsidian (built-in). This ubiquity is Mermaid's biggest
advantage — it's the only format where you can paste a fence block and expect it to
render anywhere.

**Weaknesses**: Layout engine is unpredictable for complex graphs. Styling options are
limited. Syntax is inconsistent across diagram types. Large diagrams become chaotic.

**Verdict**: Must support. It's what AI generates when asked to draw a diagram.
Claude, ChatGPT, and Gemini all default to Mermaid.

### D2 — The Serious Contender

D2 (written in Go, BSD-licensed core) offers:
- Superior layout algorithms (TALA, ELK, Dagre options)
- Better styling (themes, per-element colors/shapes)
- Cleaner, more consistent syntax
- Container/group support for system architecture diagrams
- SQL tables as native diagram objects
- Sequence diagrams, class diagrams
- Markdown in labels

D2 is better than Mermaid for architecture diagrams. It is gaining adoption among
developers who write serious system docs. However, it has zero platform support —
you cannot paste D2 code into GitHub and get a diagram. It requires a CLI renderer.

In the context of AI generation: current LLMs generate D2 when explicitly asked,
but default to Mermaid. This will likely shift as D2 matures.

**Verdict**: Support in v2. Rendering D2 in Tauri requires either:
1. Shipping a small Go binary (d2 has a programmatic API)
2. WebAssembly build of D2 (exists experimentally)
3. Server-side rendering (defeats offline-first goal)

Option 2 (WASM) is the right approach for a local viewer.

### PlantUML — Declining but Not Dead

PlantUML is Java-based, requiring either a local JVM or a remote render server
(plantuml.com). This is a significant friction point. It is still used heavily in
enterprise environments with Confluence integration.

**Verdict**: Low priority. The Java/server dependency makes it inappropriate for a
lightweight local viewer. If requested, provide a "render via plantuml.com" option
as an optional feature, clearly marked as requiring internet.

### Chart.js / Vega-Lite in Markdown

These are not "in markdown" in any standard sense — they require MDX or custom
processing to embed. A few tools (Observable notebooks, JupyterBook) support Vega-Lite
fences, but there's no cross-platform standard.

**Verdict**: Skip for now. This is a niche use case. Not relevant to the AI-dev
docs workflow.

### Recommended Diagram Support Order

1. **Mermaid** — v1, non-negotiable
2. **D2** — v2, architecture-focused users will love this
3. **PlantUML (remote)** — v3, optional, for enterprise legacy users
4. **Vega-Lite / Chart.js** — backlog, only if demand materializes

---

## 6. Future Trends

### Where Markdown Is Heading (2–3 Year View)

**Markdown will not be replaced.** It has become infrastructure. The reasons are:
- AI systems produce it natively — LLMs are trained on vast markdown corpora
- Git-native (text diffs work perfectly)
- Readable without rendering (important for resilience)
- The AGENTS.md / SKILL.md / CLAUDE.md ecosystem has just standardized around it
- GitHub, GitLab, NPM, PyPI, crates.io all render it

The question is not "will markdown be replaced?" but "what gets layered on top?"

### Trend 1: Markdown as Machine Interface

The biggest shift: markdown is no longer just a human authoring format. It's now
the interface between humans and AI agents. AGENTS.md (60,000+ repos), Spec Kit,
spec-driven development workflows — these treat markdown as a *contract*, not just
documentation.

**Implication for mdpad**: We're not just a doc viewer. We're potentially part of
the AI-dev workflow toolchain. Positioning as "the viewer for your AI-generated
project docs" is a strong, defensible niche.

### Trend 2: Frontmatter Formalization

YAML frontmatter is becoming structured metadata with semantics. The \`frontmatter-format\`
project and agent skill specifications are converging on common field names: \`status\`,
\`id\`, \`created\`, \`updated\`, \`tags\`, \`lifecycle\`. Future viewers will interpret this
semantically — filtering files by status, showing recently-updated docs, grouping by
tags.

**Implication**: Build frontmatter parsing into the data model from day one. Expose
an API that lets the UI query files by frontmatter fields. This is the foundation for
"smart folder" views.

### Trend 3: Callout Syntax Convergence

GitHub's alert syntax (\`> [!NOTE]\`, \`> [!WARNING]\` etc.) is gaining adoption outside
GitHub. Obsidian, GitLab, Docusaurus, and others are converging on variants of this
pattern. It will likely become a de-facto extension within 2 years.

**Implication**: Implement GitHub-style alerts in v1. They are already standard enough.

### Trend 4: Diagram-as-Code Ubiquity

AI agents are generating diagrams as code (Mermaid, increasingly D2). The pattern of
embedding diagram code in markdown fences is now the dominant way developers include
visual architecture docs. This is accelerating.

**Implication**: Diagram rendering is not a "nice to have" — it's core functionality
for an AI-dev doc viewer.

### Trend 5: Collaborative Markdown (Niche)

Real-time collaborative markdown (HackMD, Notion, Linear) uses Y.js CRDT for shared
editing. The Ink and Switch team (Peritext, 2022) proved rich-text CRDTs are feasible.
However, collaborative editing in a local file-based viewer is a contradiction. mdpad
is a local viewer for local files. Collaboration happens through Git.

**Implication**: Ignore this trend. It's for web-based platforms.

### Trend 6: Richer SSG Formats Will Not Replace Markdown

MDX (JSX in markdown) and Markdoc (Stripe's typed components in markdown) are
build-time formats. They require compilation pipelines. They serve web publishing,
not developer documentation reading. Neither is a "markdown replacement" — they're
markdown extensions for specific publishing contexts.

**Markdoc** (Stripe's approach) is interesting because it enforces schema validation
and stays closer to content-as-data rather than content-as-code. But it's still a
build-time format.

**Implication**: Markdoc and MDX are not our concern. Our concern is the vast
majority of developer markdown that is plain GFM + frontmatter + diagrams.

### What Could Actually Threaten Markdown?

The only credible threat is Notion-style block editors becoming the default for
developer docs. Notion, Linear, Coda, and Confluence use block-based rich text
(not markdown). These formats are:
- Not text-diffable
- Locked to the platform
- Not LLM-native output

AI coding agents do not output Notion blocks. They output markdown. This is unlikely
to change. The lock-in economics of block-based formats actually benefit markdown
as the portable alternative.

---

## Summary Recommendations for mdpad

### v1 Feature Set (must have)

| Feature | Rationale |
|---------|-----------|
| GFM (all 5 extensions) | Universal minimum |
| Syntax highlighting | Non-negotiable for devs |
| Mermaid rendering | AI-generated diagrams |
| YAML frontmatter display | AI-dev metadata |
| GitHub-style alerts \`> [!NOTE]\` | Fast-converging standard |
| File tree sidebar | Folder-level doc navigation |
| TOC sidebar with scroll-sync | Navigation in long docs |
| Relative link following | Navigate between project files |
| Auto-reload on file change | Core AI-dev workflow feature |
| CLI launch \`mdpad .\` | Developer workflow integration |
| Math support (KaTeX) | GLFM/Obsidian portable feature |
| Footnotes | Widely expected, easy to add |

### v2 Feature Set (next milestone)

| Feature | Rationale |
|---------|-----------|
| D2 diagram rendering (WASM) | Architecture docs |
| Frontmatter status badges | AI-dev task tracking |
| Full-text search across folder | Large project navigation |
| Wikilink resolution \`[[file]]\` | Obsidian vault compat |
| Task list checkbox rendering | Plan/task tracking docs |
| File watching efficiency (inotify) | Performance at scale |
| Export to HTML / PDF | Sharing rendered docs |

### Never (explicit non-goals)

| Feature | Reason |
|---------|--------|
| MDX full execution | Requires bundler, wrong scope |
| PlantUML (local Java) | JVM dependency, too heavy |
| Collaborative editing | Wrong product category |
| Block editor (Notion-style) | Defeats markdown purpose |
| Cloud sync | Local-first is the point |

### Parser Choice Validation

**comrak** remains the correct choice. It:
- Passes 100% CommonMark + GFM spec
- Is used by GitLab, Deno, crates.io, Reddit — production-battle-tested
- Supports math, footnotes, superscript via extensions
- Has plugin API for syntax highlighting (syntect)
- Is actively maintained (Anthropic scope since Sept 2025)

No competing Rust markdown parser offers the same spec compliance + GFM + extension
story in a single crate.

---

*Report generated: 2026-03-30*
*Sources: GitHub Blog, MDX docs, text-to-diagram.com, Mermaid docs, D2 docs, AGENTS.md spec,
agentskills.io, comrak GitHub, HackMD blog, Visual Studio Magazine, addyosmani.com,
GitLab Markdown docs, Obsidian docs, Docusaurus docs, Astro docs*
`,
  ".plan/reports/2026-03-30-product-strategy-report.md": `# mdpad — Product Strategy & UX Research Report

**Date**: 2026-03-30
**Linked from**: [Backlog](../BACKLOG.md), [Architecture](../../.arch/ARCHITECTURE.md)

---

## Part 1: Use Cases and Target Audiences

### Persona 1 — The AI-Augmented Solo Developer ("the main target")

**Profile**: Senior developer, 5+ years experience, works heavily with AI tools (Claude Code,
Cursor, GitHub Copilot). Keeps all project context in markdown: \`.plan/\`, \`.arch/\`, ADRs,
ORCHESTRATOR.md files. Uses CLI as primary interface.

**Triggers for opening mdpad**:
- Starting a work session: \`mdpad .\` from project root to review what's in progress
- Reviewing AI-generated specs before approving them
- Reading ADRs to understand why a past decision was made
- Checking epic PLAN.md while implementing a task

**What they DO in the app**:
- Open a folder of 20-50 markdown files, browse them quickly
- Jump between BACKLOG.md, ORCHESTRATOR.md, task files non-linearly
- Read Mermaid architecture diagrams without exporting them
- Reference a task spec in one tab while coding in their editor

**Pain points solved vs alternatives**:
- VS Code: heavyweight, distracting with language server popups, splits focus from actual coding
- Obsidian: PKM-focused, wants you to live inside it, slow to spin up for quick lookups
- Terminal cat/bat: no rendering, no navigation, no diagrams

**Aha moment**: \`mdpad .\` in a project root, file tree loads in <0.3s, Mermaid diagram
renders inline, Ctrl+P opens the exact file needed in two keystrokes. No Electron bloat, no
account required, no telemetry phone-home. "This is what I wanted all along."

---

### Persona 2 — The Technical Writer / Documentation Owner

**Profile**: Developer advocate, technical writer, or team lead who owns team documentation.
Writes in VS Code but previews in browser or awkward preview panes. Maintains READMEs,
runbooks, onboarding docs for 5-15 person teams.

**Triggers**:
- Reviewing a PR that touches documentation
- Doing a "docs audit" session before a release
- Creating onboarding materials and wanting to see exactly what new team members will see

**What they DO**:
- Navigate between related docs to check consistency
- Verify that tables render correctly, images load, code blocks have the right language tag
- Export to HTML for sharing with non-developers

**Pain points solved**:
- GitHub's web renderer: requires pushing first, slow feedback loop, no offline work
- VS Code preview: fine but split-pane eats screen real estate on laptop
- Typora: $15, no cross-file search, no folder context

**Aha moment**: opening a repo folder and seeing ALL docs as a navigable tree, then finding
a broken cross-reference via search in under 10 seconds. "I can do a full docs audit without
touching the browser or IDE."

---

### Persona 3 — The Open Source Maintainer

**Profile**: Maintains 3-8 GitHub repos, writes thorough READMEs, CHANGELOGs, CONTRIBUTING
guides. Reads other projects' docs when evaluating dependencies.

**Triggers**:
- Evaluating a dependency: \`git clone <repo> && mdpad .\` to read docs offline
- Writing release notes: wants to preview CHANGELOG.md as it will appear on GitHub
- Reviewing contributor PRs that include documentation

**What they DO**:
- Quick pass over README to check visual structure
- Navigate to specific sections via TOC
- Copy code block examples to test them

**Pain points solved**:
- GitHub-flavored preview requires network and browser context switching
- Need to see tables, task lists, and code blocks exactly as GitHub renders them

**Aha moment**: \`git clone + mdpad .\` replaces an entire "open GitHub in browser" workflow.
Offline, instant, pixel-accurate GFM rendering.

---

### Persona 4 — The Architecture Reviewer

**Profile**: Tech lead or senior engineer who reviews system design docs, RFCs, and ADRs
before approvals. Spends significant time reading rather than writing.

**Triggers**:
- RFC review in a design meeting (needs a good display interface, not raw markdown)
- Async review of an architecture proposal shared as a git repo
- Looking up a past ADR to understand a constraint

**What they DO**:
- Read long documents with complex Mermaid diagrams
- Navigate via TOC to specific sections
- Occasionally annotate (copy section, paste into comments elsewhere)

**Pain points solved**:
- Reading raw markdown in GitHub is tolerable but Mermaid diagrams are invisible
- Sharing a "read-only rendered view" of a spec requires exporting to PDF or Notion

**Aha moment**: clicking a Mermaid architecture diagram and seeing it render perfectly
in-app, then using the TOC to jump between the rationale, alternatives, and decision sections
in a long ADR. "This is better than reading on GitHub."

---

### Persona 5 — The AI Workflow Engineer / Prompt Writer

**Profile**: Works on AI agent systems, writes elaborate system prompts, CLAUDE.md files,
and workflow specifications in markdown. Files contain YAML frontmatter, nested lists,
code blocks with custom languages, and tables.

**Triggers**:
- Reviewing a CLAUDE.md or AGENTS.md before deploying an agent
- Iterating on a prompt engineering spec with structured formatting
- Checking that YAML frontmatter in a STATE.md file is rendering correctly

**What they DO**:
- Read files with mixed content: YAML blocks, bash commands, tables, nested lists
- Switch between multiple related files rapidly (hooks.md, branching.md, workflows.md)
- Need YAML frontmatter rendered as a styled table, not raw text

**Pain points solved**:
- No existing tool handles YAML frontmatter elegantly in a folder-browse context
- AI workflow files often have complex nested structures that render poorly in simple viewers

**Aha moment**: YAML frontmatter rendered as clean property table at document top, with
status pills (like "production", "experimental") visually distinct. The file structure
finally matches the mental model. "This was built for exactly my workflow."

---

## Part 2: Value Proposition

### What Makes mdpad Different

**From VS Code markdown preview**:
VS Code is an editor that happens to preview markdown. mdpad is a viewer that can
optionally edit. The mental mode is reversed — default is reading, editing is opt-in.
Practical differences: no language server overhead, no telemetry, CLI-launchable in <0.5s,
purpose-built navigation for folder-level browsing (not single-file preview).

**From Obsidian**:
Obsidian is a Personal Knowledge Management system. It wants to own your files, your vault,
your workflow. mdpad has zero lock-in — your files are plain .md on the filesystem, the
app is just a window to them. No vault database, no proprietary plugins, no sync account.
Obsidian launches in 2-3 seconds; mdpad in under 0.5s. Obsidian uses 300MB RAM idle;
mdpad targets under 50MB.

**From Typora**:
Typora is WYSIWYG-first; the source is hidden. mdpad is preview-first; the source is
available but secondary. Typora is commercial ($15), closed-source, and lacks cross-file
search. mdpad is designed for folder-level workflows, not single-document editing sessions.

**From Inkwell (closest Tauri competitor)**:
Inkwell is an editor with excellent UX. mdpad is a viewer/navigator first. Inkwell lacks
cross-file search (the one feature every documentation-heavy developer needs). mdpad's
target workflow is \`mdpad .\` and browse/read, not open-a-file-and-edit.

### The 3 Things mdpad Must Do BETTER Than Anyone Else

1. **Instant folder navigation**: From \`mdpad .\` to reading any file in the repo must
   take under 3 keystrokes. Ctrl+P quick-open, file tree, TOC — all work together.
   No other tool optimizes for "I have 50 docs, help me find and read the right one fast."

2. **Pixel-perfect GFM + developer extensions**: Tables, task lists, fenced code with
   syntax highlighting, Mermaid diagrams, YAML frontmatter display, GitHub Alerts —
   the full developer markdown vocabulary, rendered exactly as it would appear on GitHub,
   with zero configuration required.

3. **Invisible footprint**: <0.5s startup, <50MB RAM, <15MB installer. Opens, shows content,
   stays out of the way. No account creation, no telemetry, no update nags, no cloud sync
   prompts. Feels like a native filesystem tool, not a SaaS product.

### Anti-Goals — What mdpad Should NOT Try to Be

- A note-taking app (that's Obsidian, Logseq, Notion)
- A full writing environment with collaboration features (that's Notion, HackMD)
- A document editor that competes with Word/Google Docs (wrong audience entirely)
- A plugin platform (premature complexity, maintenance burden)
- A git client (show git branch in status bar, fine; full diff view, no)
- A replacement for Obsidian's graph view / backlinks ecosystem (out of scope)
- Cross-platform syncing / cloud storage (use the filesystem, that's the point)

### One-Sentence Elevator Pitch

**"mdpad is the terminal for your markdown — \`mdpad .\` and instantly navigate, read,
and preview every file in your project, with zero bloat and zero lock-in."**

---

## Part 3: Brand Story

### Personality

If mdpad were a person, it would be a senior systems engineer who uses a tiling window
manager, has aliases for everything, and gets visibly annoyed when tools add three splash
screens and require an account to open a local file. They are precise, fast, opinionated
about defaults, and deeply respectful of the user's time. They think VS Code is good but
too heavy for reading docs. They have never launched Electron willingly.

Traits: **precise, minimal, fast, no-nonsense, opinionated, respectful of your filesystem**.

### Visual Language

The aesthetic is **terminal-meets-notebook**. Think:
- Monochrome primary palette — the UI chrome should almost disappear, letting the document
  content dominate
- Accent color: single warm amber or cool blue-gray, used only for interactive elements
  and syntax highlights
- Typography: system UI font for chrome, a high-quality monospace for code (JetBrains Mono
  or Fira Code as bundled default), a clean proportional serif or sans for body text
- Density: compact but breathable — like a well-formatted man page or GitHub README
- Surfaces: flat, no gradients, very subtle borders — the kind of UI that looks designed
  by removing things, not adding them

The dark theme is the default (developers live in dark mode). The light theme should look
like a printed technical document, not a cheery productivity app.

### App Icon / Logo

Current diamond icon is wrong for the brand — it reads "gem/jewel" and doesn't communicate
markdown or developer tooling.

**What the icon should communicate**: speed, documents, precision, terminal aesthetics.

**Recommendation**: A stylized \`M_\` or \`#>\` glyph — the \`#\` of markdown heading syntax
combined with the \`>\` of a terminal prompt. Monochromatic, geometric, works at 16px.
Alternatively: a single clean document shape with a lightning bolt or chevron, signifying
"fast document viewer." The name \`mdpad\` contains \`.md\` — the icon could embed this.

Colors: monochromatic dark-on-light / light-on-dark. Avoid blue — every Electron app uses
blue. A dark neutral (near-black) or deep forest green reads "terminal" and "technical."

### Name Analysis

**"mdpad"** — honest assessment:

Weaknesses:
- Not pronounceable as a word ("zentala-md" requires knowing the author's brand)
- Lowercase brand name requires intentional branding consistency
- Hyphenated name with file extension embedded — reads as a filename, not a product
- "zntl" has no inherent meaning without knowing it's short for "zentala"

Strengths:
- Honest, no-marketing-fluff naming — fits the brand personality
- The \`.md\` extension embedded in the name is clever for the target audience
- Memorable among developers who already know the zentala ecosystem
- Works perfectly as a CLI command: \`mdpad .\` is clean

**Alternatives worth considering**:

| Name | CLI command | Vibe |
|------|-------------|------|
| \`mdview\` | \`mdview .\` | Descriptive but generic |
| \`mdx\` (taken) | — | Already overloaded by MDX format |
| \`foliomd\` | \`foliomd .\` | Portfolio of docs — more brand |
| \`mdnav\` | \`mdnav .\` | Navigation-focused, clear |
| \`leafmd\` | \`leafmd .\` | Light, organic — might be too soft |
| \`specd\` | \`specd .\` | Spec-first, developer-focused |
| \`docpane\` | \`docpane .\` | Descriptive, panel-metaphor |

**Verdict**: Keep \`mdpad\` if this is primarily a personal tool in the zentala ecosystem.
If targeting broader open-source adoption, consider \`mdnav\` or a similarly descriptive
CLI-first name. The current name is perfect for the tool's current scope.

---

## Part 4: Competitive UX Audit

### VS Code

**Top-right title bar**: Window controls (minimize/maximize/close) on Windows. Custom title
bar shows active file path. No app-specific controls in title bar area — everything lives in
the status bar or activity bar.

**Menu bar**: File / Edit / Selection / View / Go / Run / Terminal / Help. Extremely full —
VS Code suffers from menu overload. For mdpad: steal the \`Go\` menu concept (Go to File,
Go to Line, Go to Symbol) — this maps perfectly to markdown navigation.

**Sidebar collapse**: Activity bar on the far left (icon-only), clicking an icon
opens/closes the sidebar panel. The sidebar can be fully hidden; the activity bar stays
visible. Icons use tooltips on hover. **Steal this**: vertical icon tab strip for Explorer
vs Search vs (future) Backlinks.

**Tab management**: Tabs at top, overflow uses \`>\` chevron for hidden tabs. Tab has dot
indicator for unsaved changes. Right-click context menu: Close, Close Others, Close All,
Copy Path, Reveal in Explorer. **Steal everything here** — it's the industry standard.

**Status bar**: Bottom, full width. Left: branch name, sync status, errors/warnings count.
Right: line/column, encoding, line ending, language mode, notifications bell. Color changes
on errors (red) or during operations (blue). For mdpad: steal git branch + file info on
right, nothing on left (or file path breadcrumb).

**What to steal from VS Code**:
- Activity bar (vertical icon tabs for panel switching)
- Ctrl+P quick-open fuzzy file search
- Breadcrumb navigation above content
- Tab right-click context menu
- Status bar with git branch
- \`Go to\` menu section
- Section folding by heading level

**What to avoid from VS Code**:
- 9-item menu bar (overwhelming for a viewer)
- Settings as full page with 500+ options
- Language server integration, diagnostics, problem panels
- Split pane editing (viewer, not editor)
- Extension marketplace (keep it simple)

---

### Cursor

**Top-right corner**: Traffic light window controls + custom title showing project name.
AI chat toggle button (prominent). Layout switcher (side-by-side vs stacked views).

**Menu bar**: Inherits VS Code structure but adds AI-specific menus. Not relevant to borrow.

**Sidebar**: Same activity bar concept as VS Code, slightly cleaner default state.

**What to steal from Cursor**:
- The idea of a single prominent action in the title bar / toolbar that represents the
  app's unique value. For mdpad: the mode switcher (Edit/Preview/Read) deserves
  exactly this visual prominence — it's the defining interaction of the app.
- Clean, minimal chrome that makes content feel primary

**What to avoid**:
- AI integration in the main workflow (scope creep)
- The two-editor layout complexity (not relevant to a viewer)

---

### JetBrains IDEs (IntelliJ, WebStorm, etc.)

**Top-right corner**: Run/debug buttons (not relevant), project name, VCS widget showing
branch. On recent versions: a floating toolbar with AI/chat button.

**Menu bar**: Full 10+ item menu with deeply nested submenus. Complex power-user targeting.
Navigation menu is strong: Navigate > File, Navigate > Symbol, Navigate > Class.

**Sidebar**: Tool windows on left/right/bottom, each collapsible to a vertical tab strip.
**This is the gold standard for panel management** — each panel has a named vertical tab,
clicking toggles it, panels can be undocked, floating, or split.

**Tab management**: Tabs at top with "Recently Opened" overflow. Tabs can be split
horizontally or vertically. Tab groups (pinned tabs section). Good "Recent Files" popup.

**Status bar**: Branch (git), encoding, line ending, cursor position, VCS change indicator.
Compact and information-dense without being noisy.

**What to steal from JetBrains**:
- Tool window / panel architecture: named vertical tabs that collapse to icon strips
- "Recent Files" popup (Ctrl+E equivalent) — navigating recent docs is a real workflow
- The concept of "pinned tabs" for frequently referenced docs in a project
- Clean compact status bar design

**What to avoid**:
- The complexity of multi-window, multi-split, multi-panel layouts
- Configuration depth (10-panel settings dialog with hundreds of options)

---

### Zed

**Top-right corner**: Collaboration avatars (for multiplayer), project panel toggle.
Minimal — almost no buttons visible. The title bar is nearly empty, which forces the user
to learn keyboard shortcuts.

**Menu bar**: Minimal by design — File / Edit / Selection / View / Go / Window / Help.
Fewer items than VS Code. The View menu cleanly controls panels.

**Sidebar collapse**: Left sidebar toggles with single button or Cmd+\\\\. No vertical tab
strip — sidebar has tabs at its top. Clean but less discoverable than VS Code activity bar.

**Tab management**: Tabs with dot indicator for modified files. Very clean visual design.
Tab bar can be hidden. No overflow handling — horizontal scroll instead.

**Status bar**: Extremely minimal. Only: branch, diagnostics count, language. Right side:
vim mode indicator. Trusts keyboard-first users.

**What to steal from Zed**:
- Minimal title bar / menu philosophy — less is more for a focused viewer
- The visual density choices (more content, less chrome)
- Status bar minimalism — don't put things in the status bar just because you can
- Clean, fast-feeling tab design
- The philosophy: "good defaults beat infinite configuration"

**What to avoid**:
- Multiplayer/collaboration features (out of scope)
- The "so minimal it's hard to discover" trap — target audience includes less keyboard-fluent users

---

### Synthesis: What mdpad Should Steal

| Pattern | Source | Implementation |
|---------|--------|----------------|
| Vertical activity bar (icon tabs) | VS Code, JetBrains | Explorer / Search / (Backlinks later) |
| Ctrl+P quick-open | VS Code, Zed | Fuzzy file search modal |
| Breadcrumb above content | VS Code | \`folder > subfolder > file.md\` |
| Tab right-click context menu | VS Code | Close, Close Others, Copy Path |
| Git branch in status bar | VS Code, JetBrains, Zed | Status bar left side |
| Mode switcher as prominent toolbar element | Cursor (AI button pattern) | Edit/Preview/Read segmented control |
| Panel-as-collapsible-vertical-tab | JetBrains | Explorer and Outline collapse |
| "Recent files" popup | JetBrains | Ctrl+E or equivalent |
| Minimal status bar | Zed | Only what's needed |
| Single accent action in toolbar | Cursor | Mode switcher prominently placed |

---

## Part 5: Feature Prioritization

### Core — Without This, the App Has No Reason to Exist

These features define the product. If any of them are broken or missing, users do not
install mdpad at all.

- **CLI launch**: \`mdpad .\` and \`mdpad file.md\` — this is the entire distribution
  mechanism and the reason to choose mdpad over opening a browser tab
- **File tree sidebar** — without folder browsing, it's just a single-file viewer
- **GFM rendering** — tables, task lists, strikethrough, autolinks, fenced code
- **Syntax-highlighted code blocks** — every developer document has code; uncolored
  code blocks are a dealbreaker after 2025
- **Mermaid diagram rendering** — architecture diagrams in \`.arch/\` are useless unrendered
- **Fast startup** (<0.5s) and **small footprint** (<50MB RAM, <15MB installer) —
  if these benchmarks are missed, the Tauri choice is wasted and users will use VS Code

### Expected — Users Feel Something Is Missing Without These

Users will install mdpad but leave bad reviews or switch back to alternatives.

- **TOC / outline panel** with heading navigation and click-to-jump
- **YAML frontmatter display** as a styled table/properties panel (not raw text)
- **Cross-file search** (folder-level) — the single biggest gap in Inkwell
- **Dark/light theme** with OS preference detection
- **Tab management** — multiple files open simultaneously is table stakes in 2025
- **Ctrl+P quick-open** fuzzy file search — keyboard-first navigation
- **File watcher** / auto-reload on external changes — files change while you're in the app
- **GitHub Alerts** rendering (NOTE, WARNING, CAUTION, TIP, IMPORTANT) — common in modern READMEs
- **Copy button on code blocks** — users copy code, always
- **Breadcrumb navigation** above content

### Delightful — Makes Users Love the App

These are the features users mention in "why I switched" posts. They don't expect them
but are genuinely happy when they find them.

- **Zoom control** as floating widget in content area (not app-level zoom)
- **Floating formatting toolbar** on text selection (Bold/Italic/Code/Link bubble)
- **Tab tooltips** showing full file path on hover
- **Tab right-click context menu** (Close Others, Copy Path, Reveal in Explorer)
- **File status dots** in tree (open dot, unsaved dot — VS Code style)
- **Empty state / Welcome.md** that showcases all GFM features on first open
- **Zen mode** — fullscreen, all chrome hidden, pure reading
- **Drag-and-drop** .md files onto window to open
- **Scroll position memory** per file (return to the same position when switching tabs)
- **Pinned tabs** for frequently referenced files in a project session
- **KaTeX math rendering** — subset of developers needs this; those who need it REALLY need it
- **Git branch** display in status bar (no actions, just display)
- **Minimap** in sidebar for long documents (optional, toggleable)

### Unnecessary — Nice Idea but Doesn't Serve Core Use Case

These features would consume engineering time without materially improving the
primary workflow of "open folder, browse, read."

- **Plugin system** — premature complexity, creates maintenance burden, delays shipping
  the core. Add only after the app is stable with 1000+ users.
- **Wiki-links \`[[page]]\`** — useful in PKM workflows (Obsidian, Logseq) but the target
  user works with standard markdown, not wiki syntax. Add to backlog, not roadmap.
- **Graph view** — Obsidian's graph view is impressive but is primarily a visual toy.
  Zero productivity value for the "read specs quickly" workflow.
- **Version history** (Inkwell feature) — the target user already has git. This duplicates
  git functionality without git's context.
- **WYSIWYG inline editing** (Typora style) — mdpad is a viewer first. WYSIWYG editing
  requires a fundamentally different architecture and codebase approach. Defer indefinitely
  or spin off as a separate product.
- **Template system** — nice for note-taking apps, irrelevant for reading project docs
- **Image paste from clipboard** — useful in an editor, irrelevant in a viewer
- **Backlinks panel** — Obsidian-style backlinks require index maintenance. Adds complexity
  without solving the core use case. Consider for v3+ only.
- **Cloud sync / sharing** — antithetical to the brand. The filesystem is the sync layer.
- **Collaboration / multiplayer** — wrong product entirely

---

## Summary: The Single Clearest Opinion

mdpad's competitive moat is **the combination of three things no other tool does together**:
(1) CLI-first folder launch in <0.5s,
(2) pixel-perfect GFM + Mermaid rendering with cross-file navigation,
(3) <50MB RAM with no cloud dependency.

Every feature decision should be tested against: "does this make the folder browsing +
reading experience faster and more accurate?" If no, deprioritize it.

The existential risk is feature creep toward Obsidian or Typora, where the app becomes
a mediocre version of a better-funded competitor. Stay small, stay fast, stay readable.
`,
  ".plan/reports/2026-03-30-seo-english-review.md": `# SEO & English Language Review — mdpad.zentala.io

**Date**: 2026-03-30
**Reviewer**: Claude (automated audit)
**Site**: https://mdpad.zentala.io
**Source reviewed**: \`prototype/index.html\`, \`README.md\`, \`REFERENCE.md\`, all visible-text components

---

## Critical Finding: TLS Certificate Error

The site at \`https://mdpad.zentala.io\` returns \`ERR_TLS_CERT_ALTNAME_INVALID\`. The SSL
certificate does not cover the \`mdpad.zentala.io\` subdomain. This means:

- Search engines cannot crawl the site (Google requires HTTPS)
- Browsers show a security warning, blocking most visitors
- All SEO efforts are moot until this is fixed

**Action**: Check Cloudflare DNS/Pages settings. Ensure \`mdpad.zentala.io\` has a valid
CNAME or A record pointing to the Pages deployment, and that the SSL certificate
covers this subdomain (Cloudflare usually auto-provisions; may need to re-trigger).

---

## SEO Audit

### 1. Page Title

**Current**: \`mdpad — Markdown Viewer\`

**Issues**:
- Acceptable length (26 chars, under 60 limit)
- Descriptive enough for search

**Recommendation**: Consider adding a differentiator: \`mdpad — Markdown Viewer for Developers\`
to target the developer audience and differentiate from generic markdown tools.

### 2. Meta Description

**Current**: \`Markdown editor & viewer for CLI, desktop and server\`

**Issues**:
- Too short (51 chars; optimal is 120-160 chars)
- Missing key selling points (offline, GFM, Mermaid, syntax highlighting)

**Recommendation**:
\`\`\`
Lightweight offline Markdown viewer and editor for developers. GFM tables, Mermaid diagrams, syntax highlighting, YAML frontmatter — all in one fast desktop app. Open from your terminal with mdpad.
\`\`\`

### 3. Open Graph Tags

**Present**:
- \`og:title\` — yes
- \`og:description\` — yes (same short description)
- \`og:type\` — yes (\`website\`)
- \`og:url\` — yes (\`https://mdpad.zentala.io\`)

**Missing**:
- \`og:image\` — **critical omission**. Social shares (Twitter, LinkedIn, Discord, Slack)
  will show no preview image. Need a 1200x630 OG image showing the app UI.
- \`og:site_name\` — missing (should be \`mdpad\`)
- \`og:locale\` — missing (should be \`en_US\`)

### 4. Twitter Card Tags

**Missing entirely.** Add:
\`\`\`html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="mdpad — Markdown Viewer for Developers">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://mdpad.zentala.io/og-image.png">
\`\`\`

### 5. Canonical URL

**Missing.** Add:
\`\`\`html
<link rel="canonical" href="https://mdpad.zentala.io/">
\`\`\`

### 6. robots.txt

**Missing.** No \`prototype/public/robots.txt\` exists. The deployed site returns nothing.

**Recommendation**: Create \`prototype/public/robots.txt\`:
\`\`\`
User-agent: *
Allow: /
Sitemap: https://mdpad.zentala.io/sitemap.xml
\`\`\`

### 7. Sitemap

**Missing.** No \`sitemap.xml\` exists.

**Note**: Since this is an SPA (single-page app), a sitemap is less critical. However,
a minimal one listing the root URL would still help. For a prototype/demo site this
is low priority.

### 8. Semantic HTML

**Issues**:
- The entire app renders inside \`<div id="root">\` — no semantic landmarks
  (\`<main>\`, \`<nav>\`, \`<header>\`, \`<footer>\`, \`<article>\`)
- This is a React SPA, so the HTML document itself is minimal — search engines
  that don't execute JavaScript will see an empty page
- No \`<noscript>\` fallback for search engines or users without JS

**Recommendation**: Add a \`<noscript>\` tag with basic content and links:
\`\`\`html
<noscript>
  <h1>mdpad — Markdown Viewer for Developers</h1>
  <p>A lightweight desktop Markdown viewer. Enable JavaScript to use the app.</p>
  <p><a href="https://github.com/zentala/mdpad">View on GitHub</a></p>
</noscript>
\`\`\`

### 9. Image Alt Texts

- **Logo SVG** (\`Logo.tsx\`): Has proper \`role="img"\` and \`aria-label="mdpad"\` — good
- **Favicon**: Present (\`favicon.svg\`) — good
- **Images in REFERENCE.md**: Placeholder images from \`picsum.photos\` have basic alt
  texts (\`Wide landscape demo\`, \`Square thumbnail\`) — acceptable for demo content

### 10. Heading Hierarchy

- The app EmptyState uses \`<h1>mdpad</h1>\` — correct single H1
- Markdown content rendered via ReactMarkdown preserves heading hierarchy from source files
- **Issue**: When viewing REFERENCE.md, the document starts with H1, then uses H2, H3 etc.
  correctly. However, the app shell itself has no heading structure — the tab bar,
  sidebar, and toolbar are all \`<div>\` and \`<button>\` elements without ARIA landmarks.

### 11. Performance Basics

- **Google Fonts loaded via preconnect** — good (\`fonts.googleapis.com\`, \`fonts.gstatic.com\`)
- **Two font families loaded** (JetBrains Mono + DM Sans) — acceptable but adds weight
- **Mermaid.js**: Lazy-loaded (good) — only imported when a mermaid block is present
- **Shiki**: Loaded per-theme — could be heavy but appropriate for the use case
- **Vite build**: Production build will tree-shake and minify — good
- **No explicit image optimization** — demo images are external (picsum.photos)
- **No \`_headers\` file** for Cloudflare Pages — missing cache control headers

**Recommendation**: Add \`prototype/public/_headers\`:
\`\`\`
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable
\`\`\`

### 12. Mobile Friendliness

- **Viewport meta tag present** — \`width=device-width, initial-scale=1.0\` — good
- **No responsive breakpoints visible** in the app shell — this is a desktop app
  prototype, so mobile responsiveness is a lower priority, but the demo site should
  at least not break on mobile viewports

### 13. Structured Data / JSON-LD

**Missing.** For a software product page, consider adding SoftwareApplication schema:
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "mdpad",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, macOS, Linux",
  "description": "Lightweight Markdown viewer for developers",
  "url": "https://mdpad.zentala.io",
  "license": "https://opensource.org/licenses/MIT"
}
\`\`\`

This is low priority for a prototype but would help if you want the site to rank.

---

## English Language Review

### README.md

Overall the README reads well. Specific issues:

1. **Line 3**: \`you're looking at this README right now!\`
   - **Issue**: This is only true when viewing in the deployed demo. If someone reads the
     README on GitHub, this is confusing.
   - **Suggestion**: Change to \`interactive prototype demo\` or add context:
     \`you can browse this README in the app!\`

2. **Line 11**: \`A local-first Markdown tool built for developers who work with AI-generated specs, plans, and documentation.\`
   - **Issue**: Good sentence, but "local-first" is jargon that may not resonate with all
     developers. It also contradicts "server mode" listed below.
   - **Suggestion**: \`An offline-capable Markdown tool built for developers...\`

3. **Line 13**: \`What it is: A fast, offline viewer and editor for .md files with full GFM support.\`
   - **Good**: Clear and concise.

4. **Line 15**: \`What it isn't: Not a wiki, not a note-taking app, not Notion. Just Markdown, done right.\`
   - **Issue**: "Not a wiki, not a note-taking app, not Notion" — the triple negation
     followed by "Just" works well rhetorically. However, "done right" is a bold claim
     for a prototype. Consider softening: \`Just Markdown, nothing else.\`

5. **Line 81**: \`All documentation is browsable in the live demo:\`
   - **Issue**: The links point to relative paths (\`.arch/ARCHITECTURE.md\`,
     \`.plan/BACKLOG.md\`) which work in the demo but not on GitHub.
   - **Note**: This is a feature, not a bug — it drives people to the demo.

6. **Line 95**: \`\` \`#\` = Markdown heading. \`>\` = terminal prompt. Two characters, zero ambiguity. \`\`
   - **Good**: Punchy and memorable.

### REFERENCE.md

1. **Line 14**: \`Launch from your terminal, browse any folder, and preview markdown with full GFM support.\`
   - **Issue**: "markdown" should be capitalized as "Markdown" for consistency (it's
     capitalized elsewhere in the document as a proper noun).

2. **Lines 533-540** ("What's Coming Next" section):
   - **Issue**: This list is outdated — several items (Mermaid diagrams, math rendering,
     full-text search, tab support) are already implemented in the prototype.
   - **Action**: Update this section to reflect current state. Either remove completed
     items or mark them as done.

3. **Line 246**: \`mdpad uses comrak for parsing — the same engine that powers GitHub and GitLab rendering.\`
   - **Issue**: comrak is used by GitLab (confirmed) and Deno. The claim that it "powers
     GitHub" rendering is inaccurate — GitHub uses its own \`cmark-gfm\` parser. comrak is
     GFM-*compatible*, not the actual GitHub parser.
   - **Suggestion**: \`mdpad uses comrak for parsing — the same engine used by GitLab, with full GitHub Flavored Markdown compatibility.\`

### Component Text (UI strings)

1. **AboutModal.tsx**: \`Built with Tauri v2 + React + comrak.\`
   - **Good**: Clean and accurate.

2. **EmptyState.tsx**: \`The terminal for your markdown\`
   - **Issue**: "markdown" should be "Markdown" (proper noun, product identity).

3. **ShortcutsModal.tsx**: Shortcut labels are clear and consistent. No issues.

4. **SettingsView.tsx**: Setting labels and hints are well-written:
   - \`What to show when the app opens\` — clear
   - \`Ask before closing unsaved files\` — clear
   - \`Display LaTeX math expressions (KaTeX)\` — clear

5. **StatusBar.tsx**: Hardcoded \`12.4 KB\` file size — this is mock data, acceptable
   for prototype but should be noted as a thing to fix.

### Meta Description (index.html)

**Current**: \`Markdown editor & viewer for CLI, desktop and server\`

- **Issue**: Uses \`&\` instead of \`and\` — not wrong but looks informal in search results.
- **Issue**: "for CLI, desktop and server" — unclear what "server" means to someone
  unfamiliar with the product. Better: "for your terminal, desktop, and self-hosted server."

### Terminology Consistency

| Term | Used as | Recommendation |
|------|---------|----------------|
| markdown / Markdown | Mixed case throughout | Standardize on "Markdown" (proper noun) |
| GFM | Used consistently | Good |
| comrak | Lowercase consistently | Good (matches crate name) |
| file tree / File tree | Mixed case | Use "file tree" in prose, "File Tree" in UI labels |
| TOC / outline | Used interchangeably | Pick one for UI, one for docs. Current: "Outline" in UI, "TOC" in code — acceptable |

---

## Priority Summary

### Must Fix (blocks all SEO)
1. **TLS certificate** — site is unreachable via HTTPS
2. **Missing \`og:image\`** — no social preview on any platform

### Should Fix (significant SEO impact)
3. **Meta description too short** — expand to 120-160 chars
4. **Missing Twitter Card tags** — no Twitter/X preview
5. **Missing canonical URL** — potential duplicate content issues
6. **Missing \`robots.txt\`** — tells crawlers nothing
7. **Missing \`<noscript>\` content** — SEO fallback for JS-only SPA
8. **Add \`_headers\` file** — security headers + caching

### Nice to Have (polish)
9. **Structured data (JSON-LD)** — SoftwareApplication schema
10. **Capitalize "Markdown" consistently** — proper noun
11. **Update REFERENCE.md "What's Coming Next"** — outdated items
12. **Fix comrak/GitHub claim** — factual inaccuracy
13. **Expand og:description** — match the improved meta description
14. **Add \`og:site_name\`** and \`og:locale\`
`,
  ".plan/vision/2026-03-28-ux-vision.md": `# mdpad — Comprehensive UX Specification

**Target users:** AI developers working with Markdown-heavy project directories (specs, plans,
documentation, YAML configs, \`.plan/\`, \`.arch/\` folder structures).

**Core philosophy:** Fast, lightweight, read-first viewer that earns the right to edit.
Inspired by the best of Typora (seamless inline editing), Obsidian (file tree + TOC),
and Inkwell (Tauri-native, offline-first, no bloat). Every feature must serve the primary
workflow: open a folder, browse files, read and occasionally edit.

---

## Research Summary by App

### Typora
- Seamless WYSIWYG: hashes visible only on hover/focus, hidden on blur
- Live preview — no separate preview pane, no mode switch
- Focus Mode (fades other blocks), Typewriter Mode (cursor stays centered)
- Source Code Mode toggled with \`Ctrl+/\`
- File sidebar + Articles (flat file list) sidebar, toggled independently
- Outline panel (third sidebar panel)
- Full menu bar: File, Edit, Paragraph, Format, View, Themes, Window, Help
- Context menus: table ops (add/delete rows/cols), image ops, link ops, code block ops
- Preferences: General, Appearance, Editor, Image, Markdown, Export, Files
- YAML frontmatter rendered as styled table at top of document (not raw YAML)
- Status bar: word count, file size, cursor position, encoding

### Obsidian
- Three editing modes: Source, Live Preview, Reading
- Left sidebar: File Explorer, Search, Bookmarks, Tags
- Right sidebar: TOC/Outline, Backlinks, Properties
- File Explorer: create/rename/delete/move files and folders, drag and drop
- Context menu on file: Open, Open in new tab, Open to right, Open in new window,
  Make a copy, Move file to, Rename, Delete, Reveal in system explorer, Copy path
- Context menu on folder: New note, New folder, Rename, Delete, Reveal in system explorer
- Settings: General, Editor, Files & Links, Appearance, Hotkeys, Core plugins, Community plugins
- Properties panel for YAML frontmatter (visual key-value editor)
- Tabs support, split panes, custom layouts
- Extensive hotkey customization

### Mark Text
- Pure WYSIWYG — hashes auto-disappear, never shown
- Format overlay (floating toolbar) appears on text selection
- Quick Insert: type \`@\` at line start for element menu
- Line transformer: click icon to turn line into another type
- Table editor: drag rows/cols, align, add/delete in-cell
- Three writing modes: Normal, Focus, Typewriter
- View menu: Source mode, Typewriter, Focus, hide/show tabs/sidebar
- Search: per-file find-and-replace, multi-file search across open folder
- Image tools: resize, alignment control, cloud upload, relative path
- Auto-complete: brackets, quotes, markdown pairs
- Status bar: word count, cursor position
- Encoding/line ending detection and override via command palette

### VS Code Markdown Preview
- Split-pane: editor left, preview right (\`Ctrl+K V\`)
- Synchronized scrolling (bidirectional, configurable)
- Outline panel in File Explorer sidebar — header hierarchy tree
- Double-click preview element to jump to editor location
- Math rendering via KaTeX (\`$\` inline, \`$$\` block)
- Link validation with broken-link highlighting
- Rename headers updates all links (workspace-wide refactor)
- Smart selection: expand/shrink across headers, lists, quotes, code blocks
- Path completions with \`/\`, header completions with \`#\` in links
- Custom CSS for preview via \`markdown.styles\` setting
- Three security levels for preview sandbox
- Doc Writer profile: spell checker + linter preset

### Zettlr
- CodeMirror-based editor with optional Vim/Emacs input modes
- Status bar: cursor position, word count, char count, editor mode, diagnostics
- Settings categories (11): General, Appearance, File Manager, Editor, Spellchecking,
  Autocorrect, Citations (CSL/BibTeX), Zettelkasten, Snippets, Import/Export, Advanced
- Academic features: citation support (CSL JSON / BibTeX), LanguageTool grammar check
- Split-screen: two notes side by side or tabs
- File manager: thin/expanded/combined display modes
- Toolbar customizable (show/hide buttons)
- Markdown rendering modes: Preview (rich text) or Raw (syntax visible)
- Smart quotes / autocorrect / text replacement patterns
- Keyboard shortcuts: \`Ctrl+B\` bold, \`Ctrl+I\` italic, \`Ctrl+K\` link, \`Ctrl+Shift+I\` image,
  \`Ctrl+T\` task list, \`Ctrl+E\` export

### Inkwell (Tauri-based reference)
- Tauri v2 + Rust, ~12MB binary, <1s startup, zero telemetry
- Split-pane with draggable divider
- Full GFM + Mermaid + KaTeX math
- Copy button on every code block
- Command Palette (\`Ctrl+K\`) with fuzzy search
- TOC auto-generated from headings, click-to-jump
- Focus Mode (hides all chrome), Typewriter Mode (centers cursor line)
- 4 themes + custom theme builder (6 color pickers + live preview)
- 3 font families, font size 14–24px
- Version history: auto-snapshot every 5 min, diff viewer, one-click restore
- 10 built-in templates + custom template saving
- Tab-based editing, drag-and-drop, auto-save on every keystroke
- File tree sidebar, persists between sessions
- Paste/drag images from clipboard (auto-resize large images)

---

## Application Layout

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│  [Menu Bar]  File  Edit  View  Format  Help                     │
├──────────────────┬──────────────────────────────┬───────────────┤
│  [Left Sidebar]  │  [Main Editor/Viewer Area]   │ [Right Panel] │
│  ┌────────────┐  │                              │  [TOC/Outline]│
│  │ File Tree  │  │  [Toolbar strip]             │               │
│  │            │  │  ─────────────────────────   │  H1 Title     │
│  │ > .plan/   │  │                              │   H2 Section  │
│  │   > E001/  │  │  [Document content]          │    H3 Sub     │
│  │   > E002/  │  │                              │   H2 Section  │
│  │ README.md  │  │                              │               │
│  │ BACKLOG.md │  │                              │               │
│  └────────────┘  │                              │               │
├──────────────────┴──────────────────────────────┴───────────────┤
│  [Status Bar]  words: 1,204  chars: 7,842  Ln 45, Col 12  UTF-8 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Panel Sizes (defaults)
| Panel | Default width | Min width | Max width |
|-------|--------------|-----------|-----------|
| Left sidebar (file tree) | 240px | 160px | 400px |
| Main editor/viewer | (fills remaining) | 400px | — |
| Right panel (TOC) | 200px | 140px | 320px |

- All panel dividers are draggable (cursor: col-resize)
- Sidebar collapse: clicking the divider arrow, or keyboard shortcut
- Right panel starts hidden by default; user opens it
- Window minimum size: 800×500px

### Panels overview
- **Left sidebar**: File Tree (always shown by default), Search (tab)
- **Main area**: single document view (viewer or editor, unified)
- **Right panel**: TOC/Outline (optional, toggle)
- **Toolbar**: thin strip below menu bar, optional (can be hidden)
- **Status bar**: always visible at bottom

---

## Menu Bar

### File Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| New File | \`Ctrl+N\` | Creates untitled.md in current folder |
| New Folder | \`Ctrl+Shift+N\` | Creates folder in current directory |
| Open File… | \`Ctrl+O\` | File picker, filters .md files |
| Open Folder… | \`Ctrl+Shift+O\` | Opens folder in file tree |
| Open Recent | ▶ submenu | Last 10 folders/files |
| ─── | | |
| Save | \`Ctrl+S\` | Saves current file |
| Save As… | \`Ctrl+Shift+S\` | Save copy to new path |
| Rename… | \`F2\` | Rename current file inline |
| ─── | | |
| Export → | ▶ submenu | |
| &nbsp;&nbsp;Export as PDF | \`Ctrl+Shift+P\` | |
| &nbsp;&nbsp;Export as HTML | | |
| &nbsp;&nbsp;Export as DOCX | | (optional, via pandoc) |
| ─── | | |
| Print… | \`Ctrl+P\` | |
| ─── | | |
| Close File | \`Ctrl+W\` | |
| Quit | \`Ctrl+Q\` | |

### Edit Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Undo | \`Ctrl+Z\` | |
| Redo | \`Ctrl+Shift+Z\` | |
| ─── | | |
| Cut | \`Ctrl+X\` | |
| Copy | \`Ctrl+C\` | |
| Copy as Markdown | \`Ctrl+Shift+C\` | Copies with raw markdown syntax |
| Paste | \`Ctrl+V\` | |
| Paste as Plain Text | \`Ctrl+Shift+V\` | Strips formatting |
| ─── | | |
| Select All | \`Ctrl+A\` | |
| Select Word | \`Ctrl+D\` | |
| Select Line | \`Ctrl+L\` | |
| Select Block | \`Ctrl+Shift+D\` | Selects current paragraph/block |
| ─── | | |
| Find | \`Ctrl+F\` | In-file search bar |
| Find & Replace | \`Ctrl+H\` | |
| Find in Folder | \`Ctrl+Shift+F\` | Global search across all files |
| ─── | | |
| Toggle Comment | \`Ctrl+/\` | HTML comment wrap |

### View Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Toggle Sidebar | \`Ctrl+Shift+L\` | Collapses/shows left sidebar |
| Toggle TOC Panel | \`Ctrl+Shift+T\` | Collapses/shows right panel |
| Toggle Toolbar | | |
| Toggle Status Bar | | |
| ─── | | |
| Source Mode | \`Ctrl+\\\`\` | Raw markdown, no rendering |
| Live Preview Mode | | Default editing mode |
| Reading Mode | \`Ctrl+Shift+R\` | Read-only rendered, no cursor |
| ─── | | |
| Focus Mode | \`F8\` | Fades non-active block |
| Typewriter Mode | \`F9\` | Keeps cursor at vertical center |
| Zen Mode | \`F11\` | Hides all chrome (full focus) |
| ─── | | |
| Zoom In | \`Ctrl+=\` | |
| Zoom Out | \`Ctrl+-\` | |
| Reset Zoom | \`Ctrl+0\` | |
| ─── | | |
| Full Screen | \`F11\` / \`Alt+Enter\` | |
| ─── | | |
| Themes | ▶ submenu | Light, Dark, Sepia, Mono, System |

### Format Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| Bold | \`Ctrl+B\` | |
| Italic | \`Ctrl+I\` | |
| Underline | \`Ctrl+U\` | |
| Strikethrough | \`Ctrl+Shift+~\` | |
| Inline Code | \`Ctrl+\`\` \` | |
| Highlight | \`Ctrl+Shift+H\` | \`==text==\` syntax |
| Superscript | | \`^text^\` |
| Subscript | | \`~text~\` |
| Clear Formatting | \`Ctrl+\\\` | Strips all inline styles |
| ─── | | |
| Heading 1 | \`Ctrl+1\` | |
| Heading 2 | \`Ctrl+2\` | |
| Heading 3 | \`Ctrl+3\` | |
| Heading 4 | \`Ctrl+4\` | |
| Heading 5 | \`Ctrl+5\` | |
| Heading 6 | \`Ctrl+6\` | |
| Normal/Paragraph | \`Ctrl+0\` | Removes heading |
| ─── | | |
| Ordered List | \`Ctrl+Shift+]\` | |
| Unordered List | \`Ctrl+Shift+[\` | |
| Task List | \`Ctrl+Shift+X\` | Checkbox list |
| Blockquote | \`Ctrl+Shift+Q\` | |
| Code Block | \`Ctrl+Shift+K\` | Inserts fenced code block |
| Math Block | \`Ctrl+Shift+M\` | LaTeX math block |
| Mermaid Block | | Inserts mermaid code block |
| Horizontal Rule | | Inserts \`---\` |
| ─── | | |
| Insert Link | \`Ctrl+K\` | Opens link dialog |
| Insert Image | \`Ctrl+Shift+I\` | File picker or URL |
| Insert Table | \`Ctrl+T\` | Column/row count dialog |

### Help Menu
| Item | Shortcut | Notes |
|------|----------|-------|
| About mdpad | | Version, build info |
| Documentation | \`F1\` | Opens docs in browser |
| Keyboard Shortcuts | \`Ctrl+?\` | Shows shortcuts cheat sheet panel |
| Markdown Reference | | Opens GFM reference |
| ─── | | |
| Check for Updates | | |
| Report Issue | | Opens GitHub Issues |

---

## Context Menus

### File Tree — File Context Menu (right-click on .md file)
\`\`\`
Open
Open in Split View
──────────────────
Reveal in Explorer          (Windows: Explorer, macOS: Finder)
Open in Default App
Copy Path
Copy Relative Path
──────────────────
New File Here
New Folder Here
──────────────────
Rename                      (F2)
Duplicate
Move to Folder…
──────────────────
Delete                      (Del / Backspace)
\`\`\`

### File Tree — Folder Context Menu (right-click on folder)
\`\`\`
New File Here               (Ctrl+N)
New Folder Here             (Ctrl+Shift+N)
──────────────────
Expand All
Collapse All
──────────────────
Reveal in Explorer
Copy Path
──────────────────
Rename                      (F2)
Delete
\`\`\`

### File Tree — Empty Space Context Menu (right-click on blank area)
\`\`\`
New File
New Folder
──────────────────
Refresh
──────────────────
Open Folder…
\`\`\`

### Editor — Text Selection Context Menu
\`\`\`
Cut
Copy
Copy as Markdown
Paste
Paste as Plain Text
──────────────────
Bold
Italic
Inline Code
Insert Link
──────────────────
Search Selection Online
──────────────────
Format Selection →          (submenu with all inline formats)
\`\`\`

### Editor — Heading Context Menu (right-click on heading)
\`\`\`
Edit Heading
──────────────────
Increase Level              (e.g., H2 → H1)
Decrease Level              (e.g., H2 → H3)
──────────────────
Copy Heading Link           (#anchor)
Copy Heading Text
──────────────────
Collapse Section
Expand Section
──────────────────
Convert to Paragraph
\`\`\`

### Editor — Code Block Context Menu
\`\`\`
Copy Code
Select All Code
──────────────────
Change Language…            (opens language picker dropdown)
──────────────────
Toggle Line Numbers
Toggle Word Wrap
──────────────────
Open in External Editor
──────────────────
Convert to Inline Code      (only if single-line content)
Delete Block
\`\`\`

### Editor — Image Context Menu
\`\`\`
Open Image
Open Image in Browser
Copy Image
Copy Image URL
Save Image As…
──────────────────
Align Left
Align Center
Align Right
──────────────────
Edit Alt Text…
Edit Title…
──────────────────
Change Image…               (file picker)
Delete Image
\`\`\`

### Editor — Link Context Menu
\`\`\`
Open Link                   (Ctrl+Click)
Open Link in Browser
Copy Link URL
Copy Link Text
──────────────────
Edit Link…
Unlink                      (keeps text, removes link)
\`\`\`

### Editor — Table Context Menu
\`\`\`
Insert Row Above
Insert Row Below
Insert Column Left
Insert Column Right
──────────────────
Delete Row
Delete Column
──────────────────
Align Column Left
Align Column Center
Align Column Right
──────────────────
Copy Table as TSV
Copy Table as Markdown
──────────────────
Delete Table
\`\`\`

### Editor — Task List Item Context Menu
\`\`\`
Toggle Complete
──────────────────
Add Sub-task
──────────────────
Convert to List Item
Convert to Paragraph
──────────────────
Delete Item
\`\`\`

### TOC Panel — Heading Item Context Menu
\`\`\`
Scroll to Heading
Copy Heading Link
──────────────────
Collapse Section
Expand Section
\`\`\`

---

## Settings / Preferences Panel

Access: \`Ctrl+,\` or File → Preferences

Layout: Left category list + right content pane (same pattern as VS Code / Obsidian)

### General
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Language | dropdown | System | UI language |
| Startup behavior | dropdown | Restore last session | Options: Empty, Last file, Last folder, Choose folder |
| Default folder | path input | — | Default open-folder path |
| Auto-save | toggle | ON | Saves on every keystroke |
| Auto-save interval | number | 500ms | If auto-save is on |
| Confirm before delete | toggle | ON | Dialog before deleting files |
| Check for updates on start | toggle | ON | |

### Appearance
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Theme | dropdown | System | Light, Dark, Sepia, Mono, System |
| Use separate dark mode theme | toggle | OFF | |
| Dark mode theme | dropdown | Dark | Shown if above is ON |
| Font family | dropdown | System Sans | System Sans, Crimson Pro (serif), IBM Plex Mono, Custom |
| Custom font | text input | — | Font name if Custom selected |
| Font size | slider | 16px | Range: 12–28px |
| Line height | slider | 1.6 | Range: 1.2–2.4 |
| Paragraph spacing | slider | 1em | Range: 0–2em |
| Content width | slider | 720px | Max content column width |
| Custom CSS | button + editor | — | Opens inline CSS editor |

### Editor
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Default editing mode | dropdown | Live Preview | Source, Live Preview, Reading |
| Indentation | radio | Spaces | Spaces or Tabs |
| Tab size | number | 2 | Spaces per indent |
| Word wrap | toggle | ON | |
| Show line numbers (source mode) | toggle | OFF | |
| Spell check | toggle | ON | |
| Spell check language | dropdown | System | |
| Auto-pair brackets | toggle | ON | Auto-close \`(\`, \`[\`, \`{\`, \`"\`, \`\` \` \`\` |
| Smart quotes | toggle | OFF | Curly quotes |
| Auto-convert markdown on paste | toggle | ON | HTML → Markdown paste conversion |
| Highlight current line | toggle | ON | |
| Cursor blink rate | slider | 500ms | 0 = no blink |

### Preview
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Render math (KaTeX) | toggle | ON | Inline \`$\` and block \`$$\` |
| Render Mermaid diagrams | toggle | ON | |
| Render task list checkboxes | toggle | ON | Interactive checkboxes |
| Render YAML frontmatter | dropdown | Styled table | Options: Styled table, Raw YAML, Hidden |
| Syntax highlighting theme | dropdown | GitHub | GitHub, Monokai, One Dark, Solarized, Dracula |
| Code block line numbers | toggle | OFF | |
| Code block copy button | toggle | ON | |
| Strikethrough syntax | toggle | ON | \`~~text~~\` |
| Highlight syntax | toggle | ON | \`==text==\` |
| Footnotes | toggle | ON | |
| Definition lists | toggle | OFF | |
| HTML in markdown | toggle | OFF | Allow raw HTML rendering |

### Files
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Default file encoding | dropdown | UTF-8 | |
| Default line endings | dropdown | LF | LF, CRLF, CR |
| File extensions to show | multi-select | .md, .markdown | Can add .txt, .mdx, etc. |
| Show hidden files | toggle | OFF | Files/folders starting with \`.\` |
| Show file extensions | toggle | OFF | |
| File sort order | dropdown | Name A→Z | Name A→Z, Name Z→A, Modified (newest), Modified (oldest), Created |
| Auto-reload on external change | dropdown | Prompt | Auto-reload, Prompt, Ignore |
| Backup location | path input | — | Optional backup folder |
| Max recent items | number | 10 | |

### Keyboard Shortcuts
- Full table of all shortcuts
- Click any row to rebind (press new key combination)
- Reset to defaults button
- Export / Import shortcuts as JSON
- Search shortcuts by name

---

## Toolbar

Thin strip (32px height) below the menu bar. Optional (can be hidden in View menu).

\`\`\`
[New File] [Open Folder] [Save]  |  [Bold] [Italic] [Code] [Link] [Image]  |
[H1][H2][H3]  |  [Ordered List] [Unordered List] [Task List] [Quote] [Table]  |
[Code Block] [Math] [Mermaid]  |  [Find]  |  [Source Mode toggle]
\`\`\`

- Icons only by default, tooltips with shortcut on hover
- Compact: if window narrower than 900px, groups collapse to dropdowns
- Toolbar can be customized (show/hide individual buttons) via Settings → Appearance

---

## File Tree (Left Sidebar)

### Structure
\`\`\`
[Folder icon] project-root/         ← root label (clickable → opens folder picker)
  ▼ [Folder icon] .arch/
      ARCHITECTURE.md
      ▼ ADR/
          001-postgres.md
  ▼ [Folder icon] .plan/
      STATE.md
      BACKLOG.md
      ▼ epics/
          ▼ E001-setup/
              PLAN.md
              JOURNAL.md
  README.md                         ← active file (highlighted)
  catalog-info.yaml
\`\`\`

### Header buttons (top of sidebar)
\`\`\`
[New File] [New Folder] [Collapse All] [Refresh] [Search...]
\`\`\`

### File icons by type
| Extension | Icon |
|-----------|------|
| \`.md\`, \`.markdown\` | Document/page icon |
| \`.yaml\`, \`.yml\` | Gear/config icon |
| \`.json\` | Brackets icon |
| \`.txt\` | Plain text icon |
| \`.png\`, \`.jpg\`, \`.gif\`, \`.svg\` | Image icon |
| \`folder\` | Folder icon (open/closed state) |
| \`folder\` starting with \`.\` | Dotted folder icon |

### Behaviors
- Click file: opens in main area
- Double-click file: if already open and in source mode, focuses editor
- Click folder: toggles expand/collapse
- Drag file: move to another folder (shows drop indicator)
- Drag folder: move folder with all contents
- Keyboard navigation: arrow keys move selection, Enter opens file, Space expands folder
- Indent per depth level: 16px
- Show/hide dot-files: respects Settings → Files → Show hidden files
- Current open file highlighted with accent background
- Modified (unsaved) files show a dot indicator next to name
- Filter/search: type in the search box at top of sidebar to live-filter visible files

### Sort options (header dropdown)
- Name A→Z (default)
- Name Z→A
- Modified (newest first)
- Modified (oldest first)
- Folders first / Files first toggle

---

## TOC / Outline Panel (Right Sidebar)

### Layout
\`\`\`
[OUTLINE]                           [x close]
──────────────────────────────────────────────
  H1 Main Title
    H2 Installation
      H3 Prerequisites
      H3 Quick Start
    H2 Configuration
    H2 API Reference         ← currently visible (highlighted accent)
      H3 Endpoints
        H4 GET /users
        H4 POST /users
    H2 Contributing
\`\`\`

### Behaviors
- Generated automatically from all \`#\` headings in document
- Indent: 12px per heading level (H1 → no indent, H2 → 12px, H3 → 24px, etc.)
- Click heading: smooth-scrolls document to that heading
- As user scrolls: currently visible heading is highlighted in the TOC
  (uses IntersectionObserver; switches when heading enters viewport top ±80px)
- Long heading text truncated with ellipsis, full text on tooltip
- Collapse/expand individual sections by clicking the triangle icon on H1/H2
- Collapse All / Expand All buttons in panel header
- Minimum depth shown: configurable (default: H1–H4, deeper levels hidden)

---

## Main Editor / Viewer Area

### Three modes

#### 1. Live Preview Mode (default)
- Headings styled (H1 large, H2 medium, etc.), hashes hidden
- Click anywhere on rendered content → cursor appears, content becomes editable
- Move cursor away from a heading → hashes disappear again
- Inline: bold text rendered **bold**, but \`**\` visible when cursor is inside
- Code blocks: rendered with syntax highlight, copy button, language label
- Images: rendered inline at full width (max: content width)
- YAML frontmatter: rendered as styled property table (not raw text)
- Task list checkboxes: interactive (click to toggle ✓)
- Mermaid blocks: rendered as SVG diagram
- Math blocks: rendered via KaTeX
- Tables: rendered with zebra striping
- Links: underlined, Ctrl+Click to open

#### 2. Source Mode
- Raw Markdown text, monospace font
- Syntax highlighting on markdown tokens (different color for hashes, bold markers, etc.)
- Line numbers visible (if enabled in settings)
- No rendering of headings, images, etc.
- Toggle: \`Ctrl+\\\`\` or View → Source Mode

#### 3. Reading Mode
- Fully rendered, no cursor, no editing
- Purely for reading (no accidental edits)
- Scroll-only interaction
- Toggle: \`Ctrl+Shift+R\`

### Heading display (Live Preview)

| State | Visual |
|-------|--------|
| Cursor elsewhere | Heading rendered, no \`#\` visible, styled by level |
| Cursor in heading line | \`# \` shown in dimmed/muted color before heading text |
| Hover over heading | Anchor link icon \`¶\` appears at right edge |
| H1 | Font size: 2em, font-weight: 700 |
| H2 | Font size: 1.5em, font-weight: 600 |
| H3 | Font size: 1.25em, font-weight: 600 |
| H4 | Font size: 1.1em, font-weight: 600 |
| H5 | Font size: 1em, font-weight: 600 |
| H6 | Font size: 0.9em, font-weight: 600, color: muted |

- Hash marks \`#\` shown in-line only when cursor is on that heading
- Hash marks styled with reduced opacity (e.g., 35%) so they don't dominate
- Clicking heading anchor \`¶\` copies \`#heading-anchor\` link to clipboard

### Code Block Features

\`\`\`
┌──────────────────────────────────────────────────┐
│ typescript                           [copy] [wrap] │
│ ──────────────────────────────────────────────     │
│  1  interface User {                               │
│  2    id: string;                                  │
│  3    name: string;                                │
│  4  }                                              │
└──────────────────────────────────────────────────┘
\`\`\`

- Language label top-left (clickable in edit mode → opens language picker)
- Copy button top-right: copies code content, button shows "Copied!" for 1.5s
- Wrap toggle top-right: toggles word wrap for this block
- Line numbers: left gutter (configurable in settings; default OFF)
- Syntax highlighting: matches selected theme (GitHub, Monokai, etc.)
- Scroll horizontally if content exceeds width (not word-wrapped by default)
- In Source Mode: code block still highlighted (no special chrome)
- Mermaid block: language label shows "mermaid", diagram rendered below fence
- Math block: language \`math\` or raw \`$$\`, rendered as KaTeX output

### YAML Frontmatter Display

\`\`\`
┌──────────────────────────────────────────────────┐
│  ▼ Properties                              [edit] │
│  ──────────────────────────────────────────────   │
│  id           E002-T03                            │
│  epic         E002                                │
│  status       done                                │
│  created      2026-03-22                          │
│  branch       feat/E002-T03-user-endpoint         │
└──────────────────────────────────────────────────┘
\`\`\`

- Rendered as a styled key-value table (not raw \`---\` YAML)
- Collapsible: click \`▼ Properties\` to toggle
- \`[edit]\` button: switches frontmatter to raw editable YAML in-place
- In Source Mode: always shows raw YAML between \`---\` fences
- Special treatment for known keys: \`status\` shows color pill (done=green,
  in-progress=yellow, blocked=red), \`date\` values formatted as human-readable

### File Watcher / Auto-Reload

Critical feature for AI dev workflow (AI tools write files externally):

- Monitors open file with native OS file watching (Tauri \`fs::watch\`)
- When external change detected:
  - **Auto-reload mode**: silently reloads, scrolls to previous position
  - **Prompt mode**: toast notification "File changed externally — Reload?" with
    [Reload] [Keep mine] buttons
  - **Ignore mode**: no notification, user reloads manually with \`Ctrl+Shift+R\` (Reading
    mode) or \`F5\`
- If file has unsaved local edits AND external change: always prompts (never auto-overwrite)
- File deleted externally: notification "File was deleted. Save a copy?" — [Save As] [Close]

### Large File Handling

- Files up to 10MB: full live preview
- Files 10–50MB: source mode only (live preview disabled with notice)
- Files >50MB: offers partial load (first 5000 lines) with notice
- Line count shown in status bar for awareness
- Virtual scrolling for long documents (no full DOM render)

---

## Search Features

### In-File Search (\`Ctrl+F\`)

\`\`\`
┌─────────────────────────────────────────────────────┐
│  🔍 [search text________] [▲] [▼] [Aa] [.*] [x]    │
│     3 of 12 matches                                  │
└─────────────────────────────────────────────────────┘
\`\`\`

Replaces toolbar strip (or slides in below toolbar). Options:
- \`[Aa]\`: case-sensitive toggle
- \`[.*]\`: regex mode toggle
- \`[▲][▼]\`: previous/next match
- Matches highlighted in document; current match highlighted differently
- Press \`Escape\` to close and return focus to editor

### Find & Replace (\`Ctrl+H\`)

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  Find:    [_________________] [Aa] [.*]                      │
│  Replace: [_________________]                                │
│  [Replace] [Replace All] [▲] [▼]  x of y matches     [x]   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Global Search (\`Ctrl+Shift+F\`)

Opens a search panel in the left sidebar (replaces file tree tab):

\`\`\`
[← Files]  SEARCH
──────────────────────────────
🔍 [search query_____________]
[Aa] [.*] [Whole word]

Results: 23 matches in 8 files
──────────────────────────────
▼ README.md (3 matches)
  Ln 12: ...implement the **search** feature...
  Ln 45: ...global search across all...
  Ln 87: ...search results are highlighted...
▼ BACKLOG.md (2 matches)
  Ln 5: ...add search to file tree...
  ...
\`\`\`

- Live results as you type (debounced 300ms)
- Click any result: opens file, scrolls to match, highlights term
- Regex support via \`[.*]\` toggle
- Case-sensitive via \`[Aa]\` toggle
- Whole word toggle
- Results grouped by file, file count shown
- Context: shows one line of surrounding text per match

---

## Status Bar

\`\`\`
│ words: 1,204  chars: 7,842  │  Ln 45, Col 12  │  UTF-8  │  LF  │  MD  │ ⬤ modified │
\`\`\`

| Segment | Content | Click action |
|---------|---------|-------------|
| Word count | \`words: 1,204\` | Toggles between full doc / selection count |
| Char count | \`chars: 7,842\` | Same as above |
| Position | \`Ln 45, Col 12\` | Opens "Go to Line" dialog |
| Encoding | \`UTF-8\` | Opens encoding picker |
| Line endings | \`LF\` | Toggles LF / CRLF |
| File type | \`MD\` | Reminds of format; click for syntax mode info |
| Modified indicator | \`⬤ modified\` (orange dot) | — (shows when unsaved changes exist) |

- Modified indicator disappears after save
- Selected text: word count switches to show selection stats (e.g., \`sel: 43 words\`)
- Zoom level shown if not 100%: \`📐 125%\` — click to reset

---

## Special AI Developer Workflow Features

### YAML Frontmatter (documented above in detail)
- Property table rendering with collapsible toggle
- Known fields get semantic styling (status pills, date formatting)
- Edit button for in-place raw edit

### Mermaid Diagram Rendering
- Auto-detected from \` \`\`\`mermaid \` code fences
- Renders: flowchart, sequence, class, state, ER, Gantt, pie, Git graph, XY chart
- Light/dark theme auto-matches editor theme
- Diagram errors shown inline with line number (not silently swallowed)
- Right-click diagram: "Copy SVG", "Copy PNG", "Open in Mermaid Live Editor"
- Zoom in/out on diagram with Ctrl+scroll

### Task List Interactivity
- \`- [ ]\` and \`- [x]\` rendered as interactive checkboxes
- Click checkbox in Live Preview mode: toggles state AND writes change to file
- Does not require entering edit mode to toggle tasks
- Right-click checkbox item: full task context menu (documented above)

### File Watcher (documented above in detail)
- Critical for AI workflows: AI agents writing to files while viewer is open

### Command Palette (\`Ctrl+K\`)
- Fuzzy-search all commands, files, and headings
- Recent commands at top
- Keyboard-navigable (\`↑↓\` to move, \`Enter\` to execute, \`Esc\` to dismiss)
- Groups: Files (recent), Commands, Headings in current file

### Templates
- New file: offers template picker if templates exist in \`.mdpad/templates/\`
- Built-in templates: Blank, PLAN.md, JOURNAL.md, ADR, BACKLOG, Task, README
- User can save current file as template (File → Save as Template…)

### Drag-and-Drop Image Handling
- Drag image file onto editor: inserts \`![alt](relative/path)\` syntax
- Paste image from clipboard: saves to \`assets/\` folder (configurable), inserts link
- Large images auto-resized to max 1200px on paste/drop
- Alt text prompt on drop (optional, can skip)

### Version History
- Auto-snapshot when file saved (if content changed)
- Access via File → Version History or right-click file in tree
- View: diff between snapshots, timestamped list
- Restore: one-click, with confirmation
- Snapshots stored in \`.mdpad/history/<filename>/\` (gitignore-able)
- Max 30 snapshots per file (FIFO purge)

### Print / Export
- Print via system dialog: renders preview first
- Export PDF: embeds fonts, renders full markdown to PDF
- Export HTML: single-file with inline CSS, all assets embedded as data URIs

---

## Keyboard Shortcuts Reference

### Navigation
| Action | Shortcut |
|--------|----------|
| Open Quick Switcher / Command Palette | \`Ctrl+K\` |
| Open file | \`Ctrl+O\` |
| Open folder | \`Ctrl+Shift+O\` |
| Navigate back | \`Alt+Left\` |
| Navigate forward | \`Alt+Right\` |
| Go to line | \`Ctrl+G\` |
| Scroll to top | \`Ctrl+Home\` |
| Scroll to bottom | \`Ctrl+End\` |
| Toggle sidebar | \`Ctrl+Shift+L\` |
| Toggle TOC | \`Ctrl+Shift+T\` |
| Focus file tree | \`Ctrl+Shift+E\` |
| Focus editor | \`Escape\` (from tree/search) |

### File Operations
| Action | Shortcut |
|--------|----------|
| New file | \`Ctrl+N\` |
| Save | \`Ctrl+S\` |
| Save as | \`Ctrl+Shift+S\` |
| Close file | \`Ctrl+W\` |
| Rename file | \`F2\` |
| Find in folder | \`Ctrl+Shift+F\` |

### Editing
| Action | Shortcut |
|--------|----------|
| Bold | \`Ctrl+B\` |
| Italic | \`Ctrl+I\` |
| Underline | \`Ctrl+U\` |
| Strikethrough | \`Ctrl+Shift+~\` |
| Inline code | \`Ctrl+\`\` \` |
| Heading 1–6 | \`Ctrl+1\` – \`Ctrl+6\` |
| Normal paragraph | \`Ctrl+0\` |
| Insert link | \`Ctrl+K\` |
| Insert image | \`Ctrl+Shift+I\` |
| Insert table | \`Ctrl+T\` |
| Insert code block | \`Ctrl+Shift+K\` |
| Insert math block | \`Ctrl+Shift+M\` |
| Ordered list | \`Ctrl+Shift+]\` |
| Unordered list | \`Ctrl+Shift+[\` |
| Task list | \`Ctrl+Shift+X\` |
| Blockquote | \`Ctrl+Shift+Q\` |
| Horizontal rule | \`Ctrl+Shift+-\` |
| Undo | \`Ctrl+Z\` |
| Redo | \`Ctrl+Shift+Z\` |
| Select all | \`Ctrl+A\` |
| Find | \`Ctrl+F\` |
| Find & replace | \`Ctrl+H\` |
| Clear formatting | \`Ctrl+\\\` |

### View
| Action | Shortcut |
|--------|----------|
| Source mode | \`Ctrl+\\\`\` |
| Reading mode | \`Ctrl+Shift+R\` |
| Focus mode | \`F8\` |
| Typewriter mode | \`F9\` |
| Zen / full focus | \`F11\` |
| Full screen | \`Alt+Enter\` |
| Zoom in | \`Ctrl+=\` |
| Zoom out | \`Ctrl+-\` |
| Reset zoom | \`Ctrl+0\` |
| Preferences | \`Ctrl+,\` |
| Keyboard shortcuts | \`Ctrl+?\` |

---

## Visual Design Principles

### Typography
- Body text: system sans-serif (San Francisco / Segoe UI / Ubuntu) by default
- Code: monospace (JetBrains Mono, Cascadia Code, or system mono fallback)
- Heading scale: modular, ratio ~1.25
- Line length: capped at 720px (configurable) for readability
- Line height: 1.6 (adjustable)

### Color Themes

#### Light (default)
- Background: \`#ffffff\`
- Surface (sidebar): \`#f5f5f5\`
- Text: \`#1a1a1a\`
- Muted text: \`#6b6b6b\`
- Accent: \`#2563eb\` (Tailwind blue-600)
- Selection: \`#bfdbfe\`
- Code block bg: \`#f3f4f6\`
- Border: \`#e5e7eb\`

#### Dark
- Background: \`#1e1e1e\`
- Surface: \`#252526\`
- Text: \`#d4d4d4\`
- Muted: \`#858585\`
- Accent: \`#60a5fa\`
- Selection: \`#264f78\`
- Code block bg: \`#2d2d2d\`
- Border: \`#3e3e42\`

#### Sepia
- Background: \`#f8f2e3\`
- Surface: \`#ede7d3\`
- Text: \`#3d2b1f\`
- Accent: \`#8b4513\`
- Code block bg: \`#ede7d3\`

#### Mono
- Background: \`#f9f9f9\`
- All text: \`#111111\`
- Accent: \`#111111\` (no color)
- Code block bg: \`#eeeeee\`

### Spacing & Layout
- Sidebar padding: 8px horizontal
- Content padding: 48px top/bottom, 40px left/right (on content column)
- Heading spacing: 1.5em above, 0.5em below
- Paragraph spacing: 1em
- Code block padding: 16px
- Border radius: 6px on code blocks, 4px on buttons, 8px on dialogs

### Micro-interactions
- File tree hover: subtle bg tint transition 100ms
- Active file: left-border accent 3px + bg highlight
- Code block copy button: fade-in on block hover (hidden by default)
- Checkbox toggle: subtle animation (scale 0.9 → 1.0), checkmark draws in
- Scroll-to-heading from TOC: smooth scroll, heading briefly flashes accent bg for 300ms
- Auto-reload: document fades out briefly (150ms) then back in when reloaded
- Modified dot in status bar: appears immediately on first keystroke after save

---

## Accessibility

- All interactive elements have focus rings (not just mouse-accessible)
- Keyboard-only navigation through all panels and menus
- ARIA labels on icon-only toolbar buttons
- Respect system reduce-motion preference: disable transitions/animations
- Respect system high-contrast mode
- Minimum tap/click target: 24×24px (toolbar buttons 32×32px)
- Screen reader: document structure announced via heading level

---

## Platform-Specific Notes (Tauri/Windows primary)

- Window controls: native title bar on Windows (close/minimize/maximize OS-standard)
- File associations: \`.md\` and \`.markdown\` files open in mdpad on double-click (opt-in during install)
- System tray: no (not a background service)
- Native notifications: use OS toast for auto-reload prompts, version update alerts
- Native file dialogs: use OS file/folder pickers (not custom web dialogs)
- Drag files from OS Explorer onto app window: opens them
- Context menu "Open with mdpad" registered on install for \`.md\` files
- Jump list (Windows): Recent files appear in taskbar jump list
- Deep link: \`zntlmd://open?path=C:\\code\\project\` URI scheme (optional v2 feature)

---

## Feature Priority Matrix

| Feature | Priority | Notes |
|---------|----------|-------|
| File tree + folder open | P0 | Core |
| Live preview rendering | P0 | Core |
| YAML frontmatter table display | P0 | Key for AI dev workflow |
| File watcher / auto-reload | P0 | Critical for AI dev workflow |
| Task list checkbox interactivity | P0 | Used constantly in .plan/ files |
| TOC / outline panel | P0 | Essential for navigation |
| In-file search | P0 | Core |
| Context menus (file tree + editor) | P0 | Core |
| Mermaid rendering | P1 | Common in AI-generated specs |
| Global search | P1 | |
| Source mode | P1 | |
| Code block: copy + language label | P1 | |
| Themes (light/dark) | P1 | |
| Math rendering (KaTeX) | P1 | |
| Export PDF/HTML | P2 | |
| Focus / Typewriter mode | P2 | |
| Version history | P2 | |
| Templates | P2 | |
| Command palette | P2 | |
| Vim/Emacs input mode | P3 | |
| Citation support | P3 | Not needed for target users |
| Custom CSS | P3 | |

---

*Generated: 2026-03-28. Sources: Typora docs, Obsidian help, Zettlr docs, Mark Text docs,
VS Code markdown docs, Inkwell GitHub, and cross-referencing UX research on markdown editor patterns.*
`,
  ".plan/vision/2026-03-30-comrak-extensions-spec.md": `# comrak Extensions Showcase — Welcome.md Content Spec

**Date**: 2026-03-30
**Epic**: [E004](../epics/E004-2026-03-30-comrak-extensions/PLAN.md)
**Purpose**: Content spec for the "Markdown Extensions" section of Welcome.md.
Each block below is ready to paste into Welcome.md verbatim once the corresponding
rendering task is implemented.

---

## Section to Add to Welcome.md

The section goes after the existing GFM showcase (tables, task lists, code blocks)
and before the Mermaid section.

---

\`\`\`markdown
## Markdown Extensions

mdpad renders all comrak extensions beyond standard GFM.
Each section below demonstrates live rendering.

---

### Header Anchors

Every heading in mdpad gets a stable anchor link.
Hover any heading to reveal the \`#\` link. Click it to copy the URL.

\`\`\`md
## My Section
### Sub-section
\`\`\`

> Headings H1–H6 all get slugged IDs. Deep-linking into long specs works out of the box.

---

### Math (KaTeX)

Inline and block LaTeX math via KaTeX.

**Inline math** — wrap with single dollar signs:

Einstein's famous equation: $E = mc^2$

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

**Block math** — wrap with double dollar signs:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}
$$

> AI-generated architecture specs, ML research notes, and algorithm documentation
> all benefit from proper formula rendering.

---

### Emoji Shortcodes

Use GitHub-compatible emoji shortcodes — they resolve to Unicode characters:

| Shortcode | Result |
|-----------|--------|
| \`:rocket:\` | :rocket: |
| \`:warning:\` | :warning: |
| \`:white_check_mark:\` | :white_check_mark: |
| \`:x:\` | :x: |
| \`:bulb:\` | :bulb: |
| \`:memo:\` | :memo: |
| \`:hammer_and_wrench:\` | :hammer_and_wrench: |
| \`:sparkles:\` | :sparkles: |
| \`:bug:\` | :bug: |
| \`:fire:\` | :fire: |

Status: :white_check_mark: Done &nbsp; In progress: :hammer_and_wrench: &nbsp; Blocked: :x:

---

### Highlight / Mark

Use \`==double equals==\` to mark important text:

The deployment window is ==Friday 23:00–01:00 UTC==. Do **not** deploy outside this window.

Review comments marked ==pending approval== must be addressed before merge.

Three acceptance criteria remain ==unverified== and need manual testing.

> Pairs well with spec review: highlight unknowns, decisions, blockers.

---

### Footnotes

Block footnotes — place the reference inline, definition at the bottom:

The CAP theorem[^cap] states that distributed systems can guarantee at most two of
three properties. Dynamo[^dynamo] chose availability and partition tolerance.

[^cap]: Brewer, E. A. (2000). Towards Robust Distributed Systems. PODC Keynote.
[^dynamo]: DeCandia et al. (2007). Dynamo: Amazon's Highly Available Key-value Store. SOSP.

Inline footnotes — definition right where you reference it:

The service uses exponential backoff^[Base delay 100ms, multiplier 2, max 30s, jitter ±20%.] for retries.

> Long ADRs and research reports benefit from citations without cluttering the prose.

---

### Superscript & Subscript

Superscript with \`^carets^\`:

Version 2^nd^ release · HTTP/1^st^ generation · O(n^2^) complexity · x^n+1^

Subscript with \`~tildes~\`:

Water: H~2~O · Carbon dioxide: CO~2~ · Sulfuric acid: H~2~SO~4~

Combined in a chemical equation:

CH~4~ + 2O~2~ → CO~2~ + 2H~2~O

> Note: \`~~double tilde~~\` is still strikethrough. ~~Deprecated API~~ keeps working.

---

### Wiki-links

Navigate the file graph with \`[[wikilinks]]\`:

See the [[Architecture]] document for system design decisions.

The [[ADR/001-use-postgres|database decision]] was made in Q1.

Refer to [[.plan/BACKLOG]] for the full feature backlog.

> Wiki-links display as styled purple links in the prototype. In the final Tauri app,
> they navigate to the linked file within the open folder.

---

### Insert (Track Changes)

Use \`++double plus++\` for inserted text, paired with ~~strikethrough~~ for edits:

The API ~~returns a list~~ ++returns a paginated cursor++ for all endpoints.

Status changed from ~~\`draft\`~~ to ++\`approved\`++.

> Useful in ADRs to show what changed between decision revisions.

---

### Multiline Blockquotes

Standard \`>\` blockquotes are line-by-line. Use \`>>>\` for multi-paragraph quotes:

>>>
This is a long quoted passage that spans multiple paragraphs.

It can contain **formatting**, \`code\`, lists, and other block elements
without needing a \`>\` prefix on every single line.

The closing \`>>>\` ends the blockquote.
>>>

> Useful for quoting long specification passages or referencing RFC sections.

---

### Description Lists

Term on its own line, definition preceded by \`:\`:

API Gateway
: Single entry point for all client requests. Handles auth, rate limiting, routing.
: Also responsible for SSL termination and request logging.

Circuit Breaker
: Design pattern that prevents cascading failures by temporarily blocking calls
  to a failing dependency.

Idempotency Key
: Client-generated unique ID that allows safe request retries without duplicate
  side effects.

> Perfect for DDD.md domain glossaries and architecture documentation.

---

### Spoiler Text

Reveal hidden text on click — useful for answers, solutions, or sensitive info:

The answer is ||42||.

The root password is ||hunter2|| (just kidding).

The plot twist: ||the butler did it||.

> In review docs or quiz-style onboarding guides, spoilers prevent accidental reveals.

---
\`\`\`

---

## Implementation Notes

- Each section has a \`---\` separator for visual breathing room.
- The Math section requires \`katex/dist/katex.min.css\` imported in the app.
- Wiki-links in the prototype render purple with a tooltip; no file resolution yet.
- Spoiler CSS: \`filter: blur(4px); cursor: pointer;\` + \`:hover { filter: none; }\`
  or a click-to-toggle with \`data-revealed\` attribute.
- All emoji shortcodes in the table are live — they will render as actual emoji.
- Footnote section should render at the bottom of Welcome.md (comrak default behavior).
`,
  ".plan/vision/2026-03-30-product-vision-brainstorm.md": `# Product Vision Brainstorm — mdpad

## Date: 2026-03-30

## What mdpad IS
- Local WYSIWYG Markdown editor & viewer
- CLI tool: \`mdpad file.md\` opens Tauri desktop window
- Server mode: \`mdpad ./docs --serve --port 3000\` — HTTP file browser
- Browser mode: \`mdpad file.md --browser\` — opens in system browser
- AI agent rendering layer — skill for Claude Code agents to display formatted MD to users

## What mdpad is NOT
- Not a cloud service / SaaS
- Not a wiki or Notion clone
- Not an "everything editor"
- No database, no proprietary format, no login/accounts
- Not Electron (Tauri instead)
- No config required to start

## Four Operating Modes
1. \`mdpad file.md\` — Tauri desktop, VIEW mode
2. \`mdpad file.md --edit\` — Tauri desktop, EDIT mode (WYSIWYG)
3. \`mdpad ./docs --serve\` — HTTP file browser on server
4. \`mdpad file.md --browser\` — system browser

## Target Audience
Developers with VPS/homelab who:
- Have many .md files in repositories
- Want to browse them without opening full IDE
- Value CLI tools
- Don't want Obsidian on a server
- Use AI agents that generate markdown output

## Unique Angle: AI Agent Integration
No existing MD viewer/editor has AI agent integration. mdpad can serve as rendering layer:
- Agent generates report → calls mdpad skill → user sees formatted output in Tauri window
- Agent on server → mdpad --serve → returns URL for preview
- Claude Code skill for displaying markdown to users

## Name Decision
- Name: **mdpad** (lowercase, always)
- Meaning: "Markdown Notepad" — like Notepad but for MD
- Logo: \`#>\` (markdown heading + terminal prompt)
- Domain: mdpad.zentala.io (subdomain)
- Repo: zentala/mdpad
- Description: "Markdown editor & viewer for CLI, desktop and server"

## Competitive Landscape Summary
| Tool | Lang | GUI | WYSIWYG | File Browser | AI-ready |
|------|------|-----|---------|-------------|----------|
| grip | Python | browser | No | No | No |
| glow | Go | terminal only | No | Yes TUI | No |
| Typora | - | desktop | Yes | No | No |
| Obsidian | - | desktop | Yes plugin | No | No |
| Mark Text | - | desktop | Yes | No | No |
| Zettlr | - | desktop | Yes | No | No |
| VS Code | - | IDE | plugin | Yes | partial |
| docsify | JS | browser | No | Yes | No |
| mdbook | Rust | browser | No | Yes | No |
| **mdpad** | **TS/Rust** | **Tauri+browser** | **Yes** | **Yes** | **Yes** |

## mdpad Advantages
- Editor + viewer + file browser + AI-ready in one \`npm install -g\`
- Offline, no API rate limits (unlike grip's GitHub API dependency)
- Node.js ecosystem = natural AI tooling integration
- Three deployment modes (CLI, desktop, server) from single codebase
- Self-contained, zero config to start

## Marketing Strategy
- Good README on GitHub
- Post on r/selfhosted and r/commandline
- Hacker News "Show HN: mdpad — Markdown viewer for your terminal and server"
- Demo GIF: \`mdpad README.md\` → Tauri window opens in 1 second
`,
  ".plan/vision/2026-03-30-settings-design.md": `# Settings System Design — mdpad

## Overview
Simple, scrollable settings page rendered in a centered container (same width as markdown content). No sidebar navigation — sections stacked vertically with large headers.

## Layout
- Opens as a tab (like files), triggered by gear icon or Ctrl+,
- Content area: same centered container as markdown preview
- Sections: H2 heading + description + settings rows
- All settings persist to localStorage

## Sections

### General
| Setting | Control | Default |
|---------|---------|---------|
| Startup behavior | Dropdown: Last session / Empty workspace / Welcome page | Last session |
| Confirm before close | Toggle | ON |

### Appearance
| Setting | Control | Default |
|---------|---------|---------|
| Theme | Dropdown: Dark / Light / Sepia | Dark |
| Font size | Dropdown: 14 / 15 / 16 / 17 / 18 px | 16 |

### Editor
| Setting | Control | Default |
|---------|---------|---------|
| Word wrap | Toggle | ON |
| Folders collapsed by default | Toggle | ON |

### Preview
| Setting | Control | Default |
|---------|---------|---------|
| Render math (KaTeX) | Toggle | ON |
| Render Mermaid diagrams | Toggle | ON |

### Files
| Setting | Control | Default |
|---------|---------|---------|
| File extensions | Toggle list | .md ON, .markdown ON, .yaml OFF, .yml OFF, .json OFF |
| Exclude patterns | Editable list (add/remove) | node_modules, .git |

## Persistence
All settings stored in localStorage under key \`mdpad-settings\`.
Read on app init, written on every change.

## Components
- Reuse centered content container from MarkdownPreview
- Toggle component (already exists in mock)
- Dropdown/select component
- Editable list component (for exclude patterns)
- Toggle list component (for file extensions)

## Access
- Gear icon in MenuBar (top right)
- Ctrl+, keyboard shortcut
- File > Settings menu item (future)
`,
  ".plan/vision/2026-03-30-ux-refinement-notes.md": `# UX Refinement — Stream of Consciousness Notes

**Date**: 2026-03-30
**Context**: User feedback after seeing v1 prototype

## What Works Well
- Three-panel layout (file tree | preview | TOC) — user likes it
- Dark theme looks good
- File tree navigation works
- YAML frontmatter display with status pills

## User Feedback — Issues

### Dropdown Menus Are Wrong for Frequent Actions
- Format menu (Bold, Italic, etc.) should NOT be a dropdown
- Need a **toolbar strip with icons** — like Google Docs / Word
- View mode switching (Preview/Source/Reading) should be a **segmented control**
  visible at all times, not buried in dropdown
- The toolbar should only appear in edit modes, NOT in Reading mode

### Floating Selection Toolbar
- When user selects text, a **floating bubble** should appear nearby
- Contains: Bold, Italic, Strikethrough, Code, Link, Highlight
- Like Mark Text / Notion / Google Docs
- Disappears when selection is cleared

### Search Experience
- "Find" and "Find in Folder" should NOT be in dropdown
- Find in file: **inline search bar** at top of editor (like VS Code Ctrl+F)
- Find in folder: **replaces file tree** in sidebar as a tab
- Search bar has: case-sensitive toggle, regex toggle, prev/next arrows, match count
- Folder search: results grouped by file, click to jump

### Help Menu — Modals, Not Tabs
- "About", "Keyboard Shortcuts", "Markdown Reference" → modal overlays
- Keyboard shortcuts: nice grid of keys with categories
- Not a new tab or new window

### Welcome/Demo Page
- App opens with a Welcome.md by default
- Shows ALL GFM features as a showcase / reference
- Should include: headings, lists, task lists, tables, code blocks (multiple languages),
  blockquotes, links, images, horizontal rules, inline formatting, HTML support
- This IS the documentation / onboarding

### ASCII Art / Monospace
- Plain code blocks (no language) must render in monospace
- ASCII diagrams like architecture boxes must align properly

### Links
- Clicking a link should NOT navigate (it was changing the theme!)
- Internal links should navigate to file in the tree
- External links should open in browser

### Code Highlighting
- Currently no syntax coloring — just monospace
- Need Prism.js or Shiki for proper language-aware highlighting
- Must support: TypeScript, Rust, Bash, JSON, CSS, YAML, Python, Go, SQL, etc.

## UX Architecture Decision

### What Lives Where

| Element | Implementation | Notes |
|---------|---------------|-------|
| **Toolbar strip** | Fixed bar below menu, icons | Bold/Italic/Code/Link/H1-3/Lists/Table/CodeBlock/Image |
| **View mode switcher** | Segmented control in toolbar (right side) | Preview / Source / Read |
| **Search in file** | Inline bar, slides down from top of editor | Ctrl+F, Esc to close |
| **Search in folder** | Sidebar tab (replaces file tree) | Ctrl+Shift+F |
| **Floating toolbar** | Bubble on text selection | Bold/Italic/Code/Link |
| **Format menu** | REMOVED from menu bar | Replaced by toolbar |
| **View menu** | Keep only: sidebar/toc toggles, zoom, zen mode | Mode switching goes to toolbar |
| **Help modals** | Modal overlays | Shortcuts, About, Markdown Reference |
| **File menu** | Keep as dropdown | Standard file operations |
| **Edit menu** | Keep as dropdown | Undo/Redo/Cut/Copy/Paste |

### Toolbar Visibility Rules
- **Preview mode**: toolbar visible, all buttons active
- **Source mode**: toolbar visible, all buttons active
- **Reading mode**: toolbar HIDDEN (read-only, no editing)
- **Zen mode**: everything hidden

## Next Steps (from this session)
1. Research additional features from other editors
2. Design review of proposed changes
3. Implement v2 prototype with all refinements
4. Add syntax highlighting (Prism.js or Shiki)
`,
  ".plan/vision/2026-03-30-v3-ideas.md": `# V3 Ideas — Stream of Consciousness

**Date**: 2026-03-30
**Context**: User feedback during prototype v2 iteration. All ideas collected here
for batch review and implementation in one pass.

## Layout & Navigation

### Sidebar Collapse — Vertical Tab Bar (VS Code style)
- Explorer nie powinien "znikać" — powinien się zwijać do pionowego taba
- Pionowy tab po lewej: ikona + tekst "Explorer" napisany pionowo
- Obok niego drugi tab: "Search" / "Find"
- Kliknięcie na tab rozwija/zwija sidebar
- Ikona kiera (◆) w lewym górnym rogu → zamienić na ikonę toggle Explorer?
- Albo: kier zostaje jako logo, a toggle Explorer to osobny element

### Outline Collapse
- Analogicznie do Explorer — zwijanie Outline
- Przycisk chowania Outline powinien być **przyciągnięty do prawej strony** toolbara
- Przycisk chowania Explorer powinien być **przyciągnięty do lewej strony** toolbara
- Żeby było jasne, że te przyciski dotyczą paneli po bokach

### Search Panel (sidebar tab)
- Osobny tab w sidebarze obok Explorer
- Jak w VS Code: wpisujesz frazę, wyniki pogrupowane po plikach
- Klik na wynik → otwiera plik i scrolluje do match
- Find & Replace: drugie pole input, przyciski Replace / Replace All
- Toggle: case-sensitive, regex, whole word
- Nawigacja: prev/next match (strzałki)

## Content Area

### Zoom Control — Floating w prawym dolnym rogu
- NIE w menu bar (tam sugeruje zoom całej aplikacji)
- Floating mini-widget w prawym dolnym rogu editora
- Dwie ikony: ZoomIn / ZoomOut
- Aktualny zoom level: np. "125%"
- Dotyczy TYLKO contentu (font-size preview), nie UI
- Klik na procent → reset do 100%
- Ctrl+= / Ctrl+- jako skróty

### Markdown Reference
- Globalny plik wbudowany w aplikację
- Help → Markdown Reference otwiera go jako nowy tab
- Nieedytowalny (Preview mode wymuszone)
- Zawiera pełne demo wszystkich GFM features
- W przyszłości: osobny od Welcome.md

## Settings

### Co powinno być w Settings?
Trzeba zaprojektować panel Settings. Propozycje kategorii:
- **General**: startup behavior, auto-save, language
- **Appearance**: theme, font family, font size, line height, content width
- **Editor**: tab size, word wrap, auto-pair brackets, spell check
- **Preview**: render math, render mermaid, render frontmatter style
- **Files**: encoding, line endings, hidden files, file extensions
- **Keyboard Shortcuts**: full table, rebindable

### Settings UI
- Modal overlay? Osobny panel? Pełna strona?
- VS Code: osobna karta z search
- Obsidian: modal z lewym sidebar kategorii
- Proponuję: modal overlay z category sidebar (jak Obsidian)

## File Tree

### File Status Indicators
- Otwarty plik: subtelna ikona (np. mały dot) po prawej stronie
- Niezapisany: pomarańczowy dot
- Jak w VS Code: zmodyfikowany = dot, otwarty w tabie = pogrubienie

## Demo Mode (przyszły epic)
- Aplikacja deployowalna na GitHub Pages
- Edycje zapisywane w localStorage/IndexedDB
- Komunikat: "Your changes are saved locally"
- Jeśli plik się zmieni (update aplikacji) → nadpisanie lokalnych zmian
- Użytkownik może eksperymentować z edycją

## UX Refinement Notes

### Toolbar Button Placement
- **Lewa strona**: toggle Explorer (PanelLeft)
- **Prawa strona**: toggle Outline (PanelRight)
- Reszta ikon formatowania na środku
- To sprawia że jest jasne co kontroluje co

### Theme Toggle w Menu Bar
- Ikona Sun/Moon w prawym rogu menu bar — cykluje dark/light/sepia
- PLUS theme w View menu z checkmarkami — oba działają
- Settings (⚙) obok theme toggle

### Floating Toolbar (text selection)
- Pojawia się TYLKO przy zaznaczeniu tekstu w content area
- NIE pojawia się przy zaznaczeniu w Outline/Explorer/Sidebar
- Zawiera: Bold, Italic, Strikethrough, Code, Link

## Mode Switcher Redesign

### Labeled Groups: "Edit" + "Preview"
- Zamiast flat \`[Write | Code || Preview]\`
- Zrobić: \`Edit: [Visual] [Code]  |  [Preview]\`
- "Edit" jako label/prefix przed dwoma przyciskami
- Wizualnie grupuje Write+Code jako tryby edycji
- Preview oddzielone dividerem
- Label "Edit" może być wyszarzony/muted, nie button
- Ikony zostają: Pen (Visual), FileCode (Code), Eye (Preview)
- Rozważyć: elementy nieco większe, lepiej widoczne

## Tabs

### Tab Tooltip
- Hover na tab → dymek z pełną ścieżką (np. \`.arch/ADR/002-comrak-parser.md\`)
- Pojawia się po ~500ms delay (standard OS tooltip timing)
- Może zawierać: ścieżka, rozmiar, last modified
- Proste do zrobienia: \`title\` attribute na tab div

## Menu Dropdown Icons

### Lucide ikony w menu items
- Każdy item w dropdown menu (File, Edit, View, Help) powinien mieć ikonę po lewej
- Używamy tej samej paczki Lucide co w toolbarze
- Mapping:
  - New File → FilePlus
  - Open File → FolderOpen
  - Open Folder → Folder
  - Save → Save
  - Save As → SaveAll / Copy
  - Close Tab → X
  - Export PDF → FileDown
  - Export HTML → FileCode
  - Quit → LogOut
  - Undo → Undo2
  - Redo → Redo2
  - Cut → Scissors
  - Copy → Copy
  - Paste → ClipboardPaste
  - Find → Search
  - Find & Replace → Replace
  - Find in Folder → FolderSearch
  - Toggle Sidebar → PanelLeft
  - Toggle Outline → PanelRight
  - Zoom In → ZoomIn
  - Zoom Out → ZoomOut
  - Theme items → Sun/Moon/BookOpen
  - Zen Mode → Maximize
  - About → Info
  - Keyboard Shortcuts → Keyboard
  - Markdown Reference → BookOpen
- Items z checkmarkiem (theme, mode) → check zamiast ikony

## Priority for V3 Batch

### Must-implement (this batch)
1. Sidebar vertical tabs (Explorer + Search)
2. Search panel in sidebar
3. Toolbar: PanelLeft na lewej, PanelRight na prawej
4. Zoom floating widget w prawym dolnym rogu
5. Settings modal (choćby skeleton)
6. Markdown Reference jako globalny tab
7. Tab tooltips z pełną ścieżką
8. Lucide ikony w dropdown menu items

### Must-implement (cont.)
9. Mode switcher redesign: \`Edit: [Visual] [Code] | [Preview]\`
10. Lucide ikony w menu bar items (File, Edit, View, Help — same items)
11. Logo/app icon redesign — nie niebieski kier, coś monochromatyczne
12. Quick Open modal (Ctrl+P) — fuzzy file search
13. Breadcrumbs nad contentem
14. Tab right-click context menu (Close, Close Others, Copy Path)
15. Drag-and-drop plików w Explorer (przenoś między folderami)

## Tab System

### Tabs Always Visible
- Tabs muszą być ZAWSZE widoczne, nawet jeśli jest tylko 1 tab
- Usunięto logikę ukrywania tabów przy <=1
- Zamknięcie ostatniego taba → pusta strona (welcome/empty state)

### "+" Tab (New File)
- Ostatni tab po prawej to przycisk "+"
- Kliknięcie = Ctrl+N = nowy nienazwany plik markdown
- Otwiera pusty tab "Untitled.md"
- Przy pierwszym save proponuje nazwę i lokalizację
- Trzeba zaprojektować flow: nowy plik → edycja → save dialog

### Empty State (no tabs open)
- Jak w VS Code: logo + recent files + keyboard shortcuts
- Strona powitalna gdy brak otwartych plików
- Quick actions: Open File, Open Folder, Recent files list

### Settings as Tab
- Settings otwiera się jako tab (jak VS Code)
- Nie modal, nie osobne okno — TAB
- Kategorie po lewej, opcje po prawej
- Ctrl+, otwiera settings tab

## Images & Media

### Image Demo & Handling
- Demo z inline obrazkami w Welcome.md
- Klik w obraz → powiększenie (lightbox overlay z zoom)
- Context menu na obrazku: Copy link, Open in browser, Save as
- YouTube embedy w markdown (iframe rendering)

### Table Demo
- Pełne demo tabel GFM w Welcome.md
- Różne wyrównania, długie treści, nested content

## Charts & Diagrams

### Mermaid Support (must-have)
- Flowchart, sequence, ER, pie, gantt, git graph
- Demo w Welcome.md z przykładami każdego typu
- Renderowanie w preview mode
- Dark/light theme matching
- Error handling: pokaz błąd inline, nie crash

## Research Needed

### Markdown Future & AI Context
- Przyszłość Markdown — co się zmienia?
- MDX — czy wspierać? Kiedy?
- Nowe flavors poza GFM (GitLab, Obsidian, etc.)
- State of the art wyświetlania markdown w kontekście AI coding
- Czego ludzie szukają w markdown viewerach? (Reddit, HN, surveys)
- Jakie nowe funkcjonalności mogą być potrzebne dla AI devs?

## Mode Switcher — Final Design

### Layout
\`\`\`
✏ EDIT [Visual][Code]  OR  [👁 Preview]
\`\`\`
- ✏ ikona pena przed EDIT
- EDIT jako label (9px, uppercase, bold, muted)
- [Visual][Code] jako joined segmented control
- OR jako separator (9px, uppercase, bold, muted, equal margins 12px)
- [👁 Preview] jako standalone button

## File Icon System — Extensible Pattern Matching

### Current state
Hardcoded \`name → Lucide icon\` map in FileTree.tsx. Works for known files
(README, PLAN, JOURNAL etc.) but not extensible by users.

### Target architecture
\`\`\`typescript
interface IconRule {
  pattern: string | RegExp    // "README.md", "*.test.ts", /^ADR-\\d+/
  icon: string                // Lucide icon name
  color?: string              // optional color override
  priority?: number           // higher = matched first
}
\`\`\`

- Default rules cover common dev files (README, CHANGELOG, tests, configs)
- Per-repo customization via \`.mdpad/icons.yaml\`
- Settings UI to add custom rules
- Regex support for flexible matching (e.g. all ADR files)

### Implementation
1. Extract to \`utils/file-icons.ts\` — pure function, testable
2. Default rules as JSON config, not hardcoded JSX
3. Future: load \`.mdpad/icons.yaml\` when Tauri FS available

## Agent Proposals — Moje pomysły

### Status bar — prawy dolny róg
Zamiast duplikować ścieżkę pliku (jest już w tab + tooltip):
- **Git branch** — np. \`main\` lub \`feat/E002\` — przydatne dla devów
- **File size** — \`12.4 KB\` — informacja o rozmiarze
- **Last modified** — \`2 min ago\` — kiedy plik był ostatnio zmieniany
- Albo **breadcrumb** — \`.arch / ADR / 002-comrak.md\` — klikalne segmenty
- Breadcrumb byłby lepszy niż filepath bo jest interaktywny

### Keyboard-driven navigation
- \`Ctrl+P\` — Quick Open (fuzzy file search, jak VS Code)
- Wpisujesz nazwę pliku → lista wyników → Enter otwiera
- Absolutnie kluczowe dla power users — ważniejsze niż sidebar search
- Prosty komponent: modal z inputem + lista filtrowana

### Breadcrumb bar
- Nad contentem, pod toolbar/tabs: \`.arch > ADR > 002-comrak-parser.md\`
- Kliknięcie na segment → otwiera folder w Explorer
- Ostatni segment = nazwa pliku (nieklikalny lub dropdown z siblings)
- Standard w VS Code, Notion, Confluence

### Auto-save indicator
- W status bar lub tab: mała animacja "saving..." → "saved ✓"
- Ważne dla edytora — user musi wiedzieć że zmiany się zapisały

### Drag-and-drop tab reorder
- Przeciąganie tabów żeby zmienić kolejność
- Standard w każdym tab-based UI

### Context menu na tab
- Right-click na tab → Close, Close Others, Close All, Copy Path, Reveal in Explorer
- Standard w VS Code

### Minimap (opcjonalnie)
- Wąski podgląd dokumentu po prawej stronie contentu
- Jak w VS Code/Sublime — pozwala szybko nawigować długie pliki
- Przydatne dla 1000+ linii specs

## Future Vision — App Modes & Knowledge Base

### Tags System
- YAML frontmatter \`tags: [planning, architecture, rust]\`
- Tag browser panel in sidebar (new bookmark tab)
- Filter files by tag, show tag cloud
- Tags reusable across entire folder/project
- Auto-suggest tags based on existing ones

### Folder as Knowledge Base
- Any folder opened in mdpad becomes a searchable knowledge base
- Full-text search, tag filtering, date sorting
- "Recently modified" view
- "Orphan files" detection (files not linked from anywhere)
- Similar to Obsidian vault but without proprietary format

### Three App Modes (long-term, evaluate feasibility)
1. **Developer Mode** (current focus) — browse .plan/.arch, specs, ADRs
2. **Note-taking Mode** — notebooks, daily notes, tags, backlinks
3. **Writer Mode** — distraction-free, chapter structure, word goals

Question: is multi-mode worth the complexity, or does dev mode + tags
+ zen mode cover 90% of use cases? Evaluate after v1 is complete.

### Competitive Research Needed
- Mark Text (github.com/marktext/marktext) — 55k stars, WYSIWYG patterns
- Joplin (joplinapp.org) — note-taking, tags, notebooks, sync
- Calmly Writer (calmlywriter.com) — distraction-free writing UX

### Nice-to-have (if time)
7. File status indicators
8. Floating toolbar scope fix (only content)
9. Syntax highlighting (Shiki)
10. GitHub Alerts rendering
`,
  "CLAUDE.md": `# mdpad — Tauri Markdown Viewer

**Formerly**: zntl-md → renamed to mdpad (2026-03-30)
**Domain**: mdpad.zentala.io
**Repo**: github.com/zentala/mdpad
**Elevator pitch**: "The terminal for your markdown"

## Purpose
Lightweight desktop Markdown viewer for developers who work with AI-generated specs,
plans, and documentation. Launch from terminal, browse folder, preview markdown with
full GFM support, Mermaid diagrams, YAML frontmatter, and syntax-highlighted code blocks.

## Target User
AI-augmented developers who keep project specs, plans, ADRs, and documentation in Markdown.
They need to quickly preview and navigate markdown files without opening a full IDE.

## Current State (2026-03-30)
- **Prototype**: React + TypeScript + Vite interactive mockup with real components
- **Location**: \`prototype/\` directory
- **Dev server**: \`cd prototype && pnpm dev\` → http://localhost:3456/
- **Status**: E003 (prototype v3) in progress — 13/21 tasks done
- **No Tauri backend yet** — mock data only, components ready for integration

## Tech Stack
- **Runtime**: Tauri v2 (Rust backend + WebView frontend)
- **Parser**: comrak (Rust, GFM-compatible — used by GitLab, Deno, under Anthropic scope)
- **Frontend**: React + TypeScript (confirmed)
- **Syntax highlighting**: Shiki (github-dark/light themes)
- **Diagrams**: Mermaid.js (lazy-loaded)
- **Icons**: Lucide React
- **State management**: React Context + useReducer
- **Build**: Cargo + pnpm

## Key Features (implemented in prototype)
- File tree sidebar with Lucide icons per file type
- TOC/outline panel with scroll tracking (IntersectionObserver)
- GFM rendering (tables, task lists, strikethrough, autolinks)
- GitHub Alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- Mermaid diagram rendering (flowchart, sequence, pie)
- Shiki syntax highlighting (17 languages)
- YAML frontmatter as styled property table with status pills
- Tab system with +, context menu, tooltips
- Mode switcher: \`✏ EDIT [Visual][Code] OR [👁 Preview]\`
- Dark/light/sepia themes
- Quick Open (Ctrl+P), keyboard shortcuts
- Floating toolbar on text selection
- Zoom control (floating widget)
- Copy code toast animation
- Internal link navigation

## Architecture

### State: AppStateProvider (Context + useReducer)
Typed actions: OPEN_FILE, CLOSE_TAB, NEW_FILE, OPEN_SETTINGS,
SET_THEME, SET_EDITOR_MODE, TOGGLE_SIDEBAR, SET_SIDEBAR_PANEL, etc.

### Tab types
\`\`\`typescript
type TabType = 'file' | 'settings' | 'welcome'
\`\`\`

### Editor modes
- **Visual** (write) — rendered WYSIWYG with inline editing
- **Code** — raw markdown source
- **Preview** — read-only rendered view

### Component structure
\`\`\`
AppStateProvider → AppShell
  ├── MenuBar (Logo SVG, mode switcher center, quick actions right)
  ├── Sidebar (FileTree / SearchPanel via SidebarBookmarks)
  │   └── PanelHeader (reusable: icon + title + panelActionBtn actions)
  ├── MainColumn
  │   ├── TabBar (always visible, +, context menu)
  │   ├── Toolbar (only for file tabs: formatting, panel toggles)
  │   └── ContentArea (MarkdownPreview / SettingsView / EmptyState)
  │       └── TocPanel (outline, right side)
  └── StatusBar (file metadata, hidden when no file active)
\`\`\`

### Reusable components (common/)
- **Logo** — SVG component with Iosevka Bold \`#>\` paths, size/color props
- **PanelHeader** — sidebar panel header (icon + title + actions), exports \`panelActionBtn\` class
- **ZoomControl**, **Modal**, **QuickOpen**, **ContextMenu**, **EmptyState**, **AboutModal**

## Project Structure
\`\`\`
.arch/           — architecture docs, ADRs
.plan/           — epics, tasks, backlog, reports, vision
  epics/E003-*/  — current: prototype v3
  epics/E004-*/  — planned: comrak extensions
  vision/        — UX ideas, stream of consciousness, feature specs
  reports/       — research (market, features, product strategy, markdown ecosystem)
.claude/         — Claude Code config and hooks
examples/        — git submodules of reference Tauri markdown editors
prototype/       — React + Vite interactive prototype (CURRENT WORK)
  src/
    components/  — layout/, file-tree/, markdown/, toc/, search/, common/
    hooks/       — useAppState, useTocHeadings, useActiveHeading, useShikiHighlighter, useFrontmatter
    providers/   — AppStateProvider (Context + useReducer)
    mock/        — file tree + markdown content
    theme/       — CSS tokens + global styles
    types/       — TypeScript interfaces
\`\`\`

## Documentation Tree
- [Architecture](.arch/ARCHITECTURE.md) — system design, tech choices
- [Backlog](.plan/BACKLOG.md) — all ideas and planned work
- [E003 Journal](.plan/epics/E003-2026-03-30-prototype-v3/JOURNAL.md) — session log
- [V3 Ideas](.plan/vision/2026-03-30-v3-ideas.md) — UX vision, stream of consciousness
- [Product Strategy](.plan/reports/2026-03-30-product-strategy-report.md) — personas, brand, UX audit
- [Markdown Ecosystem](.plan/reports/2026-03-30-markdown-ecosystem-research.md) — future of MD
- [Product Vision Brainstorm](.plan/vision/2026-03-30-product-vision-brainstorm.md) — competitive landscape, 4 operating modes, AI agent integration

## User Preferences (from this session)
- All user ideas → save to vision file FIRST, then create tasks
- Real components (not throwaway HTML mockups)
- Design review before implementation (CEO + eng review skills)
- Modular, hierarchical, progressive disclosure
- Standalone files in CAPS (README.md, WELCOME.md, REFERENCE.md)
- Mode switcher: \`✏ EDIT [Visual][Code] OR [👁 Preview]\`
- Toolbar only above content (sidebar/outline full height)
- Lucide icons everywhere (monochrome, consistent)
- No breadcrumbs (redundant with tabs)
- Undo/Redo in BOTH toolbar AND Edit menu

## Conventions
- Follow global CLAUDE.md conventions (LF, pnpm, TypeScript, Conventional Commits)
- Rust: no unwrap() in production, doc comments on pub fn
- Files ≤ 250 lines, functions ≤ 50 lines (exception: REFERENCE.md — content file, no limit)
- Commit + push after each completed task
`,
  "README.md": `# mdpad

> **[Live Demo → mdpad.zentala.io](https://mdpad.zentala.io)** — you're looking at this README right now!

Markdown editor & viewer for CLI, desktop and server.

Open \`.md\` files from your terminal, browse them on your server, or edit them in a desktop app. One tool, three modes.

## What is mdpad?

A local-first Markdown tool built for developers who work with AI-generated specs, plans, and documentation. No cloud, no accounts, no config — just \`mdpad .\` and you're browsing.

**What it is:** A fast, offline viewer and editor for \`.md\` files with full GFM support.

**What it isn't:** Not a wiki, not a note-taking app, not Notion. Just Markdown, done right.

## Features

| Feature | Status |
|---------|--------|
| File tree sidebar with icons | Done |
| WYSIWYG visual editing | Done |
| Code mode (raw markdown) | Done |
| Preview mode (read-only) | Done |
| GFM (tables, task lists, strikethrough) | Done |
| Syntax highlighting (Shiki, 17 languages) | Done |
| Mermaid diagrams (flowchart, sequence, pie) | Done |
| YAML frontmatter as property card | Done |
| GitHub Alerts (NOTE, TIP, WARNING, CAUTION) | Done |
| KaTeX math rendering | Done |
| Dark / light / sepia themes | Done |
| TOC outline with scroll tracking | Done |
| Cross-file search | Done |
| Keyboard shortcuts (Ctrl+P, Ctrl+W, etc.) | Done |
| Tab system with context menu | Done |
| Wiki-links, footnotes, emoji shortcodes | Done |
| CLI launch (\`mdpad .\`) | Planned |
| Tauri desktop app | Planned |
| Server mode (\`mdpad --serve\`) | Planned |
| Export PDF / HTML | Planned |

## Quick Start

\`\`\`bash
# (planned — not yet available)
cargo install mdpad

# Open current folder
mdpad .

# Open specific file
mdpad README.md

# Serve on your server
mdpad ./docs --serve --port 3000
\`\`\`

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Runtime | [Tauri v2](https://tauri.app/) | Small binary (~10MB), native WebView |
| Parser | [comrak](https://github.com/kivikakk/comrak) | GFM-compatible, used by GitLab & Deno |
| Frontend | React + TypeScript | Rich ecosystem, type safety |
| Syntax | [Shiki](https://shiki.style/) | TextMate grammars, accurate coloring |
| Diagrams | [Mermaid.js](https://mermaid.js.org/) | De facto standard |
| Math | [KaTeX](https://katex.org/) | Fast math typesetting |
| Icons | [Lucide](https://lucide.dev/) | Consistent, monochrome |
| Build | Vite + pnpm | Fast builds, strict deps |

## Three Modes (planned)

\`\`\`
mdpad file.md              # Tauri desktop — VIEW mode
mdpad file.md --edit       # Tauri desktop — EDIT mode
mdpad ./docs --serve       # HTTP file browser on server
\`\`\`

## Documentation

All documentation is browsable in the [live demo](https://mdpad.zentala.io):

- [Architecture](.arch/ARCHITECTURE.md) — system design, tech choices
- [Backlog](.plan/BACKLOG.md) — all ideas and planned work
- [Feature Reference](REFERENCE.md) — full markdown feature showcase
- [Product Vision](.plan/vision/2026-03-30-product-vision-brainstorm.md) — competitive landscape, roadmap
- [Market Research](.plan/reports/2026-03-28-market-research.md) — competitive analysis

## Logo

\`\`\`
#>
\`\`\`

\`#\` = Markdown heading. \`>\` = terminal prompt. Two characters, zero ambiguity.

## License

MIT
`,
  "REFERENCE.md": `---
title: Markdown Feature Reference
version: 0.1.0
status: development
author: zentala
date: 2026-03-30
tags: [markdown, viewer, tauri, developer-tools]
---

# Markdown Feature Reference

A lightweight, fast Markdown viewer built with **Tauri v2** for developers who work
with AI-generated specs, plans, and documentation. Launch from your terminal, browse
any folder, and preview markdown with full GFM support.

---

## Text Formatting

Regular text, **bold text**, *italic text*, ***bold italic***, ~~strikethrough~~,
and \`inline code\` all render correctly. You can combine them freely:
***~~bold italic strikethrough~~***, **\`bold code\`**, *\`italic code\`*.

Subscript and superscript: H~2~O and x^2^.

---

## Headings

All six heading levels are supported (this section uses H2):

### H3 — Subsection
#### H4 — Topic
##### H5 — Detail
###### H6 — Fine Print

---

## Links

- [Architecture overview](.arch/ARCHITECTURE.md) — internal project link
- [Project backlog](.plan/BACKLOG.md) — planned features and ideas
- [ADR: Tauri v2 runtime](.arch/ADR/001-tauri-v2-runtime.md) — architecture decision
- [Tauri documentation](https://tauri.app) — external link
- [comrak on crates.io](https://crates.io/crates/comrak) — the parser powering mdpad
- Autolink: https://github.com/nickel-org/rust-mustache

---

## Lists

### Unordered
- File tree sidebar with folder browsing
- Live preview with instant rendering
  - GFM tables, task lists, strikethrough
  - YAML frontmatter parsing
    - Status pills with colored badges
    - Date and tag formatting
- Mermaid diagram support

### Ordered
1. Open a folder or file from the CLI
2. Browse the file tree in the sidebar
   1. Click any \`.md\` file to preview
   2. Use the outline panel for navigation
3. Toggle between reading and source mode

### Task Lists
- [x] Project structure bootstrapped
- [x] Markdown preview with comrak
- [x] File tree sidebar component
- [x] TOC outline panel
- [x] YAML frontmatter display
- [ ] Mermaid diagram rendering
- [ ] Full-text search across files
- [ ] PDF and HTML export

---

## Tables

### Feature Status

| Feature | Status | Priority | Module |
|---------|--------|----------|--------|
| File tree | Done | P0 | sidebar |
| Markdown preview | Done | P0 | preview |
| TOC panel | Done | P0 | outline |
| Frontmatter display | Done | P0 | preview |
| Dark/light theme | Done | P1 | shell |
| Mermaid diagrams | Planned | P1 | preview |
| Search | Planned | P1 | search |
| Export PDF/HTML | Planned | P2 | export |

### Column Alignment

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Tauri v2 | Rust + WebView | 15 MB |
| comrak | GFM-compatible | 0.28 |
| React | TypeScript | 18.3 |

---

## Code Blocks

### TypeScript

\`\`\`typescript
interface MarkdownFile {
  path: string;
  content: string;
  frontmatter?: Record<string, unknown>;
}

async function loadMarkdown(path: string): Promise<MarkdownFile> {
  const raw = await invoke<string>('read_file', { path });
  const { data, content } = parseFrontmatter(raw);
  return { path, content, frontmatter: data };
}
\`\`\`

### Rust

\`\`\`rust
use comrak::{markdown_to_html, Options};

/// Renders GFM markdown to HTML with all extensions enabled.
pub fn render(input: &str) -> String {
    let mut opts = Options::default();
    opts.extension.strikethrough = true;
    opts.extension.table = true;
    opts.extension.tasklist = true;
    opts.extension.autolink = true;
    markdown_to_html(input, &opts)
}
\`\`\`

### Bash

\`\`\`bash
# Install and launch mdpad
cargo install mdpad
mdpad .                    # Open current directory
mdpad docs/README.md       # Open a specific file
mdpad --theme dark .plan/  # Dark theme on a subfolder
\`\`\`

### JSON

\`\`\`json
{
  "name": "mdpad",
  "version": "0.1.0",
  "description": "Lightweight Tauri-based Markdown viewer",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "tauri": "tauri"
  }
}
\`\`\`

### CSS

\`\`\`css
:root {
  --bg-primary: #1a1b1e;
  --text-primary: #e1e2e5;
  --accent: #60a5fa;
  --font-mono: 'JetBrains Mono', monospace;
}

.markdown-preview h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.3em;
}
\`\`\`

### Python

\`\`\`python
import subprocess
from pathlib import Path

def find_markdown_files(root: Path) -> list[Path]:
    """Recursively find all .md files under root."""
    return sorted(
        p for p in root.rglob("*.md")
        if not any(part.startswith(".") for part in p.parts)
    )
\`\`\`

---

## Mermaid Diagrams

### Application Architecture

\`\`\`mermaid
flowchart LR
    CLI[CLI Entry] --> Tauri[Tauri Shell]
    Tauri --> FileSystem[File System API]
    Tauri --> WebView[WebView Frontend]
    FileSystem --> Watcher[File Watcher]
    WebView --> Parser[comrak Parser]
    WebView --> Mermaid[Mermaid Renderer]
    WebView --> Highlight[Syntax Highlighter]
\`\`\`

### User Flow

\`\`\`mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Tauri
    participant comrak

    User->>CLI: mdpad ./docs
    CLI->>Tauri: Open window with path
    Tauri->>Tauri: Scan directory tree
    Tauri-->>User: Show file tree sidebar
    User->>Tauri: Click README.md
    Tauri->>comrak: Parse markdown to HTML
    comrak-->>Tauri: Rendered HTML
    Tauri-->>User: Display preview
\`\`\`

### Feature Completion

\`\`\`mermaid
pie title Development Progress
    "Completed" : 7
    "In Progress" : 3
    "Planned" : 11
\`\`\`

---

## GitHub Alerts

> [!NOTE]
> mdpad uses **comrak** for parsing — the same engine that powers GitHub and GitLab rendering.

> [!TIP]
> Press \`Ctrl+Shift+L\` to toggle the file tree sidebar and maximize your reading area.

> [!IMPORTANT]
> Frontmatter must be valid YAML and appear at the very top of the file, delimited by \`---\`.

> [!WARNING]
> Files larger than 1 MB may experience slower rendering. Consider splitting large documents.

> [!CAUTION]
> Do not edit files through mdpad while another process holds a write lock — changes may be lost.

---

## Blockquotes

> A simple blockquote with a single thought.

> **Design principle**: mdpad should open instantly, render faithfully, and stay out of the way.
> Every feature must justify its impact on startup time and memory footprint.

> Multi-paragraph blockquote:
>
> The first paragraph sets context about the problem space.
>
> The second paragraph elaborates with specific constraints and trade-offs.

### Nested Blockquotes

> Outer context
> > Inner detail
> > > Deep clarification

---

## Images

![Wide landscape demo](https://picsum.photos/800/400)

A smaller inline image for visual variety:

![Square thumbnail](https://picsum.photos/200/200)

---

## HTML Support

<details>
<summary>Click to expand — mdpad rendering pipeline</summary>

The rendering pipeline processes markdown in three stages:

1. **Parse** — comrak converts GFM to an AST
2. **Transform** — frontmatter extraction, Mermaid detection, link rewriting
3. **Render** — AST to HTML, syntax highlighting, diagram rendering

\`\`\`
Input (.md) -> comrak AST -> Transform -> HTML -> WebView
\`\`\`

</details>

<div style="padding: 12px; border-left: 4px solid #60a5fa; background: rgba(96,165,250,0.1); border-radius: 4px; margin: 12px 0;">
  <strong>Custom HTML callout</strong><br/>
  Raw HTML is supported for cases where standard Markdown syntax is not enough.
</div>

---

## Inline Elements Reference

| Element | Syntax | Rendered |
|---------|--------|----------|
| Bold | \`**text**\` | **text** |
| Italic | \`*text*\` | *text* |
| Bold italic | \`***text***\` | ***text*** |
| Inline code | \`\` \`code\` \`\` | \`code\` |
| Strikethrough | \`~~text~~\` | ~~text~~ |
| Link | \`[text](url)\` | [text](#) |
| Image | \`![alt](url)\` | (see above) |

---

## Horizontal Rules

Three equivalent syntaxes:

---

***

___

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle sidebar | \`Ctrl+Shift+L\` |
| Toggle outline | \`Ctrl+Shift+T\` |
| Find in file | \`Ctrl+F\` |
| Source mode | \`\` Ctrl+\` \`\` |
| Reading mode | \`Ctrl+Shift+R\` |
| Open folder | \`Ctrl+Shift+O\` |
| Command palette | \`Ctrl+K\` |
| Zoom in | \`Ctrl+=\` |
| Zoom out | \`Ctrl+-\` |

---

## Markdown Extensions

mdpad goes beyond standard GFM with a rich set of extensions.
Each subsection below shows the raw syntax and its rendered output.

### Header IDs & Anchors

Headings automatically receive URL-friendly IDs. Hover over any heading
to see the \`#\` anchor link icon appear — click it to get a direct link.

\`\`\`markdown
### My Section Title
\`\`\`

Try hovering over the headings on this page to see anchors in action.

### Math (KaTeX)

Inline math uses single dollar signs, block math uses double.

\`\`\`markdown
Inline: $E = mc^2$

Block:
$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$
\`\`\`

Inline: $E = mc^2$ — Einstein's famous equation.

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### Emoji Shortcodes

Type shortcodes between colons to insert emoji.

\`\`\`markdown
:rocket: :warning: :+1: :heart: :sparkles: :bug: :memo:
\`\`\`

:rocket: :warning: :+1: :heart: :sparkles: :bug: :memo:

### Highlight / Mark

Wrap text in double equals to ==highlight== it.

\`\`\`markdown
This is ==highlighted text== in a sentence.
\`\`\`

This is ==highlighted text== in a sentence. Use it to draw attention to ==key terms== or ==important values==.

### Footnotes

Reference footnotes with \`[^label]\` and define them anywhere in the document.
You can also use inline footnotes with \`^[text]\`.

\`\`\`markdown
mdpad uses comrak[^1] for parsing and Shiki[^2] for highlighting.

You can also use inline footnotes^[Like this one, defined right where it's used.].

[^1]: comrak is a GFM-compatible Markdown parser written in Rust.
[^2]: Shiki uses TextMate grammars for accurate syntax coloring.
\`\`\`

mdpad uses comrak[^1] for parsing and Shiki[^2] for highlighting.

You can also use inline footnotes^[Like this one, defined right where it's used.].

[^1]: comrak is a GFM-compatible Markdown parser written in Rust.
[^2]: Shiki uses TextMate grammars for accurate syntax coloring.

### Superscript & Subscript

Use carets for ^superscript^ and single tildes for ~subscript~.
Remember: ~~double tildes~~ produce strikethrough instead.

\`\`\`markdown
E = mc^2^   (superscript)
H~2~O       (subscript)
~~deleted~~ (strikethrough)
\`\`\`

E = mc^2^, the speed of light squared. Water is H~2~O. And ~~this is deleted~~.

### Wiki-links

Link to other files in your project using double-bracket wiki-style syntax.

\`\`\`markdown
[[README]]
[[Architecture Overview|.arch/ARCHITECTURE]]
\`\`\`

[[README]] and [[Architecture Overview|.arch/ARCHITECTURE]]

### Insert

Mark newly inserted text with double plus signs.

\`\`\`markdown
++inserted text++
\`\`\`

The config now requires ++a valid API key++ to authenticate.

### Description Lists

Define terms followed by a colon-prefixed definition on the next line.

\`\`\`markdown
comrak
: A GFM-compatible Markdown parser written in Rust.

Shiki
: A syntax highlighter that uses TextMate grammars.

KaTeX
: A fast math typesetting library for the web.
\`\`\`

comrak
: A GFM-compatible Markdown parser written in Rust.

Shiki
: A syntax highlighter that uses TextMate grammars.

KaTeX
: A fast math typesetting library for the web.

### Spoiler

Hide text behind a blur that reveals on hover.

\`\`\`markdown
||This text is hidden until you hover over it.||
\`\`\`

The secret feature is ||a built-in markdown linter that checks your docs for broken links||.

### Multiline Blockquotes

Use triple angle brackets \`>>>\` to create blockquotes that span
multiple paragraphs without needing \`>\` on each line.

\`\`\`markdown
>>>
This is a multiline blockquote.

It can span multiple paragraphs without
repeating the > character on every line.

Perfect for longer quoted passages.
>>>
\`\`\`

>>>
This is a multiline blockquote.

It can span multiple paragraphs without
repeating the > character on every line.

Perfect for longer quoted passages.
>>>

---

## What's Coming Next

- [ ] **Mermaid diagrams** — flowcharts, sequence, ER, pie charts
- [ ] **Math rendering** — LaTeX via KaTeX (\`$E = mc^2$\`)
- [ ] **Full-text search** — find across all files in the folder
- [ ] **File watcher** — auto-reload when files change on disk
- [ ] **Export** — PDF and standalone HTML output
- [ ] **Custom CSS** — style the preview with your own theme
- [ ] **Command palette** — quick access to every action
- [ ] **Tab support** — open multiple files side by side

---

*Built with Tauri v2 + React + comrak*
`,
  "catalog-info.yaml": `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: mdpad
  description: Lightweight Tauri-based Markdown viewer for developers
  annotations:
    github.com/project-slug: zentala/mdpad
spec:
  type: tool
  lifecycle: experimental
  owner: zentala
`,
}

export const defaultFile = 'README.md'
