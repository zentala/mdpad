# mdpad — Tauri Markdown Viewer

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
- **Location**: `prototype/` directory
- **Dev server**: `cd prototype && pnpm dev` → http://localhost:3456/
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
- Mode switcher: `✏ EDIT [Visual][Code] OR [👁 Preview]`
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
```typescript
type TabType = 'file' | 'settings' | 'welcome'
```

### Editor modes
- **Visual** (write) — rendered WYSIWYG with inline editing
- **Code** — raw markdown source
- **Preview** — read-only rendered view

### Component structure
```
AppStateProvider → AppShell
  ├── MenuBar (mode switcher center, quick actions right)
  ├── Sidebar (FileTree / SearchPanel via bookmarks)
  ├── MainColumn
  │   ├── Toolbar (Undo/Redo, formatting, panel toggles)
  │   ├── TabBar (+, context menu)
  │   └── ContentArea (MarkdownPreview / SettingsView / EmptyState)
  │       └── TocPanel (outline, right side)
  └── StatusBar
```

## Project Structure
```
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
```

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
- Mode switcher: `✏ EDIT [Visual][Code] OR [👁 Preview]`
- Toolbar only above content (sidebar/outline full height)
- Lucide icons everywhere (monochrome, consistent)
- No breadcrumbs (redundant with tabs)
- Undo/Redo in BOTH toolbar AND Edit menu

## Conventions
- Follow global CLAUDE.md conventions (LF, pnpm, TypeScript, Conventional Commits)
- Rust: no unwrap() in production, doc comments on pub fn
- Files ≤ 250 lines, functions ≤ 50 lines
- Commit + push after each completed task
