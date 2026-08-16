<!--
pm-onboarded: 2026-05-22
pm-version: 0.1.0
-->

# mdpad — Tauri Markdown Viewer

**Formerly**: zntl-md → renamed to mdpad (2026-03-30)
**Domain**: mdpad.labs.zentala.agency
**Repo**: github.com/zentala/mdpad
**Elevator pitch**: "The terminal for your markdown"

## Purpose
Lightweight desktop Markdown viewer for developers who work with AI-generated specs,
plans, and documentation. Launch from terminal, browse folder, preview markdown with
full GFM support, Mermaid diagrams, YAML frontmatter, and syntax-highlighted code blocks.

## Target User
AI-augmented developers who keep project specs, plans, ADRs, and documentation in Markdown.
They need to quickly preview and navigate markdown files without opening a full IDE.

## Current State (2026-03-31)
- **Prototype**: React + TypeScript + Vite interactive mockup with real components
- **Location**: `prototype/` directory
- **Dev server**: `cd prototype && pnpm dev` → http://localhost:5173/
- **Status**: E003-E006 complete, E010 functional editor complete, E008 (Tauri) planned
- **Version**: 0.1.0
- **Live**: https://mdpad.labs.zentala.agency (Cloudflare Pages)
- **No Tauri backend yet** — mock data only, components ready for integration

## Branching
- **`dev`** — default branch, active development
- **`main`** — releases only (merge from dev triggers GitHub Release + Docker image)

## Quality Scripts
```bash
cd prototype
pnpm lint       # ESLint (flat config, typescript-eslint, react-hooks)
pnpm format     # Prettier check
pnpm typecheck  # tsc --noEmit
pnpm test       # Vitest
pnpm build      # Full build (content generation + tsc + vite)
```

## CI/CD
- **CI**: `.github/workflows/ci.yml` — runs on PR to dev/main: typecheck, lint, format, test, build
- **Release**: `.github/workflows/release.yml` — GitHub Release + Docker on push to main
- **Pre-commit**: Husky + lint-staged (ESLint + Prettier) + commitlint (Conventional Commits)

## Deployment (manual — Cloudflare Pages)
The live site is **https://mdpad.labs.zentala.agency** (`mdpad-4z3.pages.dev`). It serves
the prototype editor. Deploy is manual, NOT git-integrated (GitHub Pages was dropped):
```bash
cd prototype
node_modules/.bin/tsx scripts/build-content.ts   # regen src/generated from repo .md
node_modules/.bin/tsc && node_modules/.bin/vite build
node -e "require('fs').copyFileSync('dist/index.html','dist/404.html')"
wrangler pages deploy dist --project-name mdpad --branch main --commit-dirty=true
```
Custom domain wired in the CF dashboard (CNAME `mdpad.labs → mdpad-4z3.pages.dev`).
Account `zentala@gmail.com` (`wrangler whoami`). Re-run on API timeout — blobs are cached.

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
- Floating outline panel (transparent, 20% opacity, hover reveal, auto-hides <1000px)
- GFM rendering (tables, task lists, strikethrough, autolinks)
- GitHub Alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- Mermaid diagram rendering (flowchart, sequence, pie)
- Shiki syntax highlighting (17 languages)
- YAML frontmatter as styled property table with status pills
- Tab system with +, context menu, tooltips
- Mode switcher: `✏ EDIT [Visual][Code] OR [👁 Preview]`
- Dark/light/sepia/auto themes (auto follows OS via matchMedia)
- Quick Open (Ctrl+P), keyboard shortcuts
- Floating toolbar on text selection
- Content zoom (50-200%, CSS zoom on preview, floating ZoomControl widget)
- Copy code toast animation
- Internal link navigation
- Zen Mode settings toggle (open/close from ZenHoverBar)
- Mobile fallback message (desktop-only app notice)
- File load error state (inline error display)
- Close All tabs confirmation dialog
- Design token system (font-size, shadow, danger-dim, spacing grid)

## Architecture

### State: AppStateProvider (Context + useReducer)
Typed actions: OPEN_FILE, CLOSE_TAB, NEW_FILE, OPEN_SETTINGS,
SET_THEME, SET_EDITOR_MODE, TOGGLE_SIDEBAR, SET_SIDEBAR_PANEL, etc.
- `resolvedTheme` — derived state, never 'auto' (resolves to dark/light from OS)
- Theme persisted to `localStorage` key `mdpad-theme`
- Settings persisted to `localStorage` key `mdpad-settings`

### Tab types
```typescript
type TabType = 'file' | 'settings' | 'welcome'
```

### Editor modes
- **Visual** (write) — Milkdown WYSIWYG editor (lazy-loaded)
- **Code** — CodeMirror 6 raw markdown editor (lazy-loaded)
- **Preview** — read-only rendered view (react-markdown, loads no editor engine)

### Editor architecture (E010)
```
EditorRef interface (shared contract: getContent, setContent, insertAtCursor, focus, execCommand)
  ├── CodeEditor.tsx — CodeMirror 6 wrapper, markdown syntax highlighting, @codemirror/search
  └── VisualEditor.tsx — Milkdown wrapper, commonmark + GFM presets, ProseMirror-based

Content state: AppState.fileContents (editable) + originalContents (dirty tracking)
Actions: INIT_FILE_CONTENT, UPDATE_CONTENT, SAVE_FILE
```

### Component structure
```
AppStateProvider → AppShell
  ├── MenuBar (Logo, menus, ModeSwitcher center, Zen toggle, theme+settings right)
  ├── ZenHoverBar (zen mode: Logo, ModeSwitcher, Zen toggle, theme+settings — 30% opacity)
  ├── ActivityBar (VSCode-style left icon strip: Explorer, Search, Settings)
  ├── Sidebar (FileTree / SearchPanel)
  │   └── PanelHeader (reusable: icon + title + panelActionBtn actions)
  ├── SettingsProvider (wraps useSettings hook as context)
  ├── MainColumn
  │   ├── TabBar (always visible, +, context menu, modified dot indicator)
  │   ├── Toolbar (formatting buttons, disabled in Preview mode, insert popovers)
  │   ├── SearchBar (inline find/replace bar, docked top of content)
  │   └── ContentArea (CodeEditor / VisualEditor / MarkdownPreview / SettingsView)
  │       └── TocPanel (outline, right side)
  └── StatusBar (file metadata, hidden when no file active)
```

### Reusable components (common/)
- **Logo** — SVG component with Iosevka Bold `#_` paths, size/color props
- **PanelHeader** — sidebar panel header (icon + title + actions), exports `panelActionBtn` class
- **ModeSwitcher** — editor mode toggle (Edit [Visual|Code] or Preview), used in MenuBar + ZenHoverBar
- **ToggleSwitch** — iOS-style on/off toggle with optional icon + label
- **ZoomControl**, **Modal**, **QuickOpen**, **ContextMenu**, **EmptyState**, **AboutModal**
- **InsertFieldsPopover** — reusable popover with configurable input fields
- **InsertLinkPopover**, **InsertImagePopover** — wrappers using InsertFieldsPopover
- **InsertTablePopover** — grid picker for markdown tables

### Utilities (utils/)
- **exportHtml.ts** — export preview as standalone HTML with embedded theme CSS
- **exportPdf.ts** — trigger browser print dialog with print-specific CSS

### Hooks
- **usePreviewSearch** — DOM-based text search in preview mode with match highlighting

### Providers
- **AppStateProvider** — main state (tabs, theme, editor mode, file contents, dirty tracking)
- **SettingsProvider** — wraps useSettings hook, provides settings context to all components

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
    plugins/     — custom remark plugins (mark, sup/sub, wikilinks, etc.)
    test/        — vitest setup + render helpers
    types/       — TypeScript interfaces
```

## Testing
- **Framework**: Vitest + @testing-library/react + jsdom
- **Run**: `cd prototype && pnpm test` (or `pnpm test:watch`)
- **Config**: `prototype/vitest.config.ts` (path aliases, CSS modules, setup file)
- **Setup**: `src/test/setup.ts` (jest-dom matchers, matchMedia mock)
- **Helper**: `src/test/render-with-provider.tsx` (wraps in AppStateProvider)

## Documentation Tree
- [Architecture](.arch/ARCHITECTURE.md) — system design, tech choices
- [Backlog](.plan/BACKLOG.md) — all ideas and planned work
- [Ideas](.plan/IDEAS.md) — raw unrefined ideas for future
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
- Files ≤ 250 lines, functions ≤ 50 lines (exception: REFERENCE.md — content file, no limit)
- Commit + push after each completed task
