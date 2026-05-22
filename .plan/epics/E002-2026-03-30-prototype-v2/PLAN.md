---
status: in-progress
created: 2026-03-30
title: E002 — Prototype v2: UX Refinements + Feature Expansion
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
Render `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`
as colored callout boxes with icons. comrak supports this natively.

#### Syntax Highlighting
Add Shiki (or Prism.js) for proper code coloring.
Must support: TypeScript, Rust, Bash, JSON, CSS, YAML, Python, Go, SQL, HTML, Markdown.

#### Math Rendering
KaTeX for `$inline$` and `$$block$$` math expressions.

### 7. Research-Driven Features (nice-to-have, high ROI)

- **Wiki-links** `[[page]]` → navigate to file in folder
- **Breadcrumb navigation** — path to current file above content
- **Reading time** in status bar
- **Footnotes** `[^1]` rendering
- **Highlight** `==text==` rendering
- **Emoji shortcodes** `:rocket:` → 🚀
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
- TypeScript: `tsc --noEmit` passes
- Build: `vite build` succeeds
