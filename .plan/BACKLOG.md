# Backlog — zntl-md

## Epics
- [E001 — Project Bootstrap](epics/E001-2026-03-28-project-bootstrap/PLAN.md) — research, UX vision, project setup
- [E002 — Prototype v2](epics/E002-2026-03-30-prototype-v2/PLAN.md) — UX refinements, Lucide icons, tabs, mode rename

## Ideas — High Priority
- [ ] Demo mode — deploy to GitHub Pages, localStorage persistence for edits
- [ ] Floating toolbar only on content selection (not outline/sidebar)
- [ ] File status indicators (open dot, unsaved dot) on file tree icons
- [ ] Empty states (no file open, empty folder, file not found)
- [ ] Breadcrumb navigation above content
- [ ] Syntax highlighting via Shiki (github-dark + github-light themes)
- [ ] GitHub Alerts rendering (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- [ ] KaTeX math rendering ($inline$, $$block$$)
- [ ] Wiki-links [[page]] → navigate to file
- [ ] Drag-and-drop .md files onto window to open
- [ ] Recent files on empty state / startup
- [ ] Folder chevron+icon combined (single element, not separate)
- [ ] JSON/YAML file viewer (future — currently hidden)
- [ ] Scroll position memory per file
- [ ] Image demo: inline images, click to enlarge, copy link, context menu
- [ ] YouTube embed demo: embedded videos in markdown
- [ ] Table demo: full GFM table showcase in Welcome.md
- [ ] Image lightbox: click image → fullscreen overlay with zoom

## Ideas — Lower Priority
- [ ] Plugin system (later — keep simple first)
- [ ] Vim keybindings
- [ ] Git integration (show diffs in preview, git status in file tree)
- [ ] Template system for new markdown files
- [ ] Adopt main/dev branching model
- [ ] Backlinks panel ("linked from this file")
- [ ] Section folding by heading
- [ ] Footnotes, highlight ==text==, emoji :shortcodes:
- [ ] Graph view (Obsidian-style)

## Research
- [Market Research](reports/2026-03-28-market-research.md) — competitive landscape
- [UX Vision](vision/2026-03-28-ux-vision.md) — detailed UX specification
- [UX Refinement Notes](vision/2026-03-30-ux-refinement-notes.md) — user feedback, stream of consciousness
- [V3 Ideas](vision/2026-03-30-v3-ideas.md) — sidebar tabs, search panel, zoom, settings, demo mode
- [Feature Research](reports/2026-03-30-feature-research.md) — GFM spec, markdown extensions, editor patterns, code highlighting
- [Product Strategy Report](reports/2026-03-30-product-strategy-report.md) — personas, value prop, brand, competitive UX audit, feature prioritization

## Reference Examples
- [examples/](../examples/) — git submodules of Tauri markdown editors
