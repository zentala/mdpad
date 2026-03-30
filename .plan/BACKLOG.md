# Backlog — mdpad

## Epics
- [E001 — Project Bootstrap](epics/E001-2026-03-28-project-bootstrap/PLAN.md) — research, UX vision, project setup
- [E002 — Prototype v2](epics/E002-2026-03-30-prototype-v2/PLAN.md) — UX refinements, Lucide icons, tabs, mode rename
- [E003 — Prototype v3](epics/E003-2026-03-30-prototype-v3/PLAN.md) — full feature demo: activity bar, search, Shiki, Mermaid, settings
- [E004 — comrak Extensions](epics/E004-2026-03-30-comrak-extensions/PLAN.md) — math, footnotes, wiki-links, highlight, emoji, sup/sub, spoiler
- [E005 — Website Deploy](epics/E005-2026-03-30-website-deploy/PLAN.md) — deploy prototype to mdpad.zentala.io as live demo + docs site

## Ideas — High Priority
- [ ] **Logo `#>` tooltip** — hover on logo should show app name "mdpad" (currently no tooltip)
- [ ] **Settings tab — plan & implement** — define what settings the app has, save to localStorage. Minimum: theme (already switchable but not persisted), font size, sidebar width, default mode (Visual/Code/Preview). Settings tab UI already exists as mock — wire it to real localStorage persistence
- [ ] **Persist theme in localStorage** — remember last selected theme (dark/light/sepia) across sessions. Currently resets to dark on every page load
- [ ] **Unified SVG logo** — use `logo.svg` (`#>` in JetBrains Mono) everywhere: MenuBar icon (replace hardcoded text), empty state, about modal, favicon, OG image, README badge. Single source: `prototype/public/logo.svg`
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
- [ ] Research StackEdit (stackedit.io) features — map and adopt relevant ones

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
- [ ] **Subscript broken** — `H~2~O` renders as strikethrough (H̶2̶O) instead of subscript (H₂O). GFM `~text~` = strikethrough conflicts with `~text~` = subscript. Need conflict resolution: single `~` = sub, double `~~` = strikethrough
- [ ] **Multiline blockquote broken** — `>>>` renders as 3 nested blockquotes instead of single multiline block. remarkMultilineBlockquote plugin not working correctly
- [ ] **Wiki-links not clickable** — `[[README]]` and `[[Architecture Overview|.arch/ARCHITECTURE]]` render but are not interactive (no click handler)
- [ ] **Wiki-links wrong color** — link color doesn't match current theme skin (dark/light/sepia)
- [ ] **Anchor links broken for multi-file context** — `#user-content-math-katex` lacks file path prefix. Should be `/Welcome.md#math-katex` (dynamic from current file). Hover on heading shows nothing — only copy gives broken link
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
