# E010 — Functional Editor: From Prototype to Working App

## What
Make all non-functional UI elements actually work. The prototype has buttons,
menus, and shortcuts that look real but do nothing. This epic turns the visual
concept into a functional markdown editor.

## Why
The prototype misleads users — toolbar buttons, menu items, and keyboard shortcuts
exist but have no implementation. File editing, saving, search, and all text
formatting are completely fake. Before adding new features, the existing UI
must actually work.

## Scope
- Frontend only (React prototype) — no Tauri/Rust backend yet (that's E008)
- All editing happens in-memory (mock data)
- No real filesystem access (requires Tauri)
- Focus: make every visible button, menu item, and shortcut do what it claims
- localStorage used only for settings (already exists) — NOT for file persistence
  (throwaway code, Tauri will handle real fs)

## Non-goals
- Tauri desktop integration (E008)
- CLI implementation (E008)
- Server mode
- Real filesystem read/write (needs Tauri IPC)
- New features not already shown in UI
- File persistence across page reloads (defer to Tauri)

## Architecture Decision: Editor Engine (decided)

**CodeMirror 6** for Code mode + **Milkdown** for Visual mode.
See [ADR 008](../../.arch/ADR/008-editor-engine-codemirror-milkdown.md).

Key reasons:
- Milkdown uses remark (same pipeline as our react-markdown) — shared plugins
- Clean MD round-trip via remark-parse/stringify
- Tiptap rejected: lossy round-trip, no math/mermaid, paid collab
- Both MIT, both actively maintained (March 2026 releases)

## Constraint: Lazy Loading

Both editor engines must be lazy-loaded:
- **Preview mode** (default): loads neither CodeMirror nor Milkdown
- **Code mode**: `React.lazy(() => import('./CodeEditor'))` — loads CodeMirror
- **Visual mode**: `React.lazy(() => import('./VisualEditor'))` — loads Milkdown

This keeps the common case (viewing markdown) lightweight.

## Architecture: Content State Management

Single source of truth = **markdown string in AppState** per file.

```
  AppState.fileContents: Record<string, string>
        │
        ├──▶ CodeMirror (Code mode)
        │       onChange → dispatch(UPDATE_CONTENT, { path, content })
        │
        ├──▶ Milkdown (Visual mode)
        │       onChange → dispatch(UPDATE_CONTENT, { path, content })
        │
        └──▶ MarkdownPreview (Preview mode, read-only)

  Mode switch:
    Active editor serializes → UPDATE_CONTENT → new editor initializes from state

  Dirty tracking:
    originalContents: Record<string, string>  (snapshot at file open)
    Tab shows modified indicator when fileContents[path] !== originalContents[path]
```

**Undo/redo**: per-editor-instance (CodeMirror and Milkdown each manage own history).
History resets on mode switch — acceptable tradeoff, cross-mode undo is complex
and low-value for prototype phase.

**EditorRef interface** (shared contract):
```typescript
interface EditorRef {
  getContent(): string
  setContent(md: string): void
  focus(): void
  execCommand(cmd: EditorCommand): void
}
type EditorCommand = 'bold' | 'italic' | 'strikethrough' | 'code' |
  'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'orderedList' |
  'taskList' | 'blockquote' | 'codeBlock' | 'undo' | 'redo'
```

## Mode-specific UX

### Toolbar behavior per mode
- **Preview mode**: hide formatting buttons, show only Find + panel toggles
- **Code mode**: all buttons active (insert markdown syntax at cursor)
- **Visual mode**: all buttons active (WYSIWYG commands via Milkdown)
- Disabled buttons show tooltip "Switch to edit mode"

### Mode transitions
- Scroll position preserved (percentage-based)
- Cursor position: map to nearest line/heading
- Undo history resets on mode switch (per-editor-instance)

### Rich blocks in Visual mode
Mermaid, KaTeX, frontmatter render as **opaque read-only previews** in Milkdown.
Click to open source editor inline (code block). GitHub Alerts render as styled
blockquotes via remark plugin.

### Find in file (Ctrl+F)
Renders as **inline bar at top of ContentArea** (VS Code pattern), not floating modal.
Pushes content down, never obscures matches. Separate from folder search (sidebar).
In Code mode, delegates to `@codemirror/search` built-in panel.

### Insert operations
Insert Link (Ctrl+K) and Insert Image use **popovers anchored to cursor position**
(not modals — these are frequent operations). Insert Table uses popover with grid picker.

## Tauri Survival Scorecard

| Task | Survives Tauri? | Notes |
|------|----------------|-------|
| T01 CodeMirror | YES | Editor component reused as-is |
| T02 Milkdown | YES | Editor component reused as-is |
| T04 Find/Replace | YES | Search UI reused |
| T05 Insert ops | YES | Insert commands are editor-level |
| T06 File ops | PARTIAL | Dirty tracking survives, save action rewired to Tauri IPC |
| T07 Settings | YES | CSS variable application survives |
| T08 File tree CRUD | NO | Replaced by Tauri fs operations |
| T09 Export HTML | PARTIAL | HTML generation survives, download mechanism changes |
| T10 Export PDF | PARTIAL | Same as HTML |
| T11 Shortcuts audit | YES | Keyboard handling reused |

## Tasks

### T01: Content state layer + CodeMirror Code mode
**Wave 1 — foundation, must complete first**

Part A — Content state:
- Add `fileContents: Record<string, string>` to AppState (init from mock data)
- Add `originalContents: Record<string, string>` (snapshot for dirty tracking)
- Add `UPDATE_CONTENT` action (sets content + marks tab modified)
- Define `EditorRef` interface (getContent, setContent, focus, execCommand)
- Modified indicator on tabs: white dot (8px) replacing close-X, shows when dirty
  (VS Code pattern: dot on modified, hover reveals close button)

Part B — CodeMirror integration:
- New `CodeEditor.tsx` component wrapping `@uiw/react-codemirror`
- `@codemirror/lang-markdown` for syntax highlighting
- `@codemirror/search` for built-in find/replace (covers T04 for Code mode)
- Line numbers, active line highlight, heading folding
- onChange → dispatch(UPDATE_CONTENT)
- Wire Code-mode toolbar buttons: bold inserts `**`, italic `*`, heading `#`, etc.
- Lazy-loaded via `React.lazy`

Files: `AppStateProvider.tsx`, new `CodeEditor.tsx`, `Toolbar.tsx`, `TabBar.tsx`

### T02: Milkdown Visual mode + toolbar wiring
**Wave 2 — depends on T01 (needs EditorRef interface + content state)**

Part A — Spike: round-trip fidelity test
- Before full integration, test MD → Milkdown → MD with a sample file using ALL
  current remark plugins (GFM, math, mermaid, alerts, mark, sup/sub, wikilinks, spoiler)
- If fidelity is poor: fall back to CodeMirror-only with split-pane live preview
- This spike gates the rest of T02

Part B — Milkdown integration:
- New `VisualEditor.tsx` component with `@milkdown/react`
- `@milkdown/preset-gfm` for GFM support
- Create Milkdown theme consuming existing CSS custom properties (`--md-*` tokens)
  so Visual mode looks identical to Preview mode
- Rich blocks (Mermaid, KaTeX, frontmatter) as opaque read-only previews
- onChange → dispatch(UPDATE_CONTENT)
- Wire Visual-mode toolbar buttons via Milkdown commands
- FloatingToolbar: wire to active editor's execCommand
- Lazy-loaded via `React.lazy`

Files: new `VisualEditor.tsx`, new `milkdown-theme.ts`, `Toolbar.tsx`, `FloatingToolbar.tsx`

### T04: Find in file + Replace
**Wave 2 — parallel with T02**

- Code mode: enable `@codemirror/search` extension (config task, mostly done in T01)
- Preview mode: DOM-based text search with highlight overlay
- Refactor SearchBar from floating modal to **inline bar docked at top of ContentArea**
- Match count display ("3 of 12"), navigate between matches
- Replace (Code mode only via CodeMirror): replace current, replace all
- Regex toggle, case sensitivity toggle
- Visual mode: use ProseMirror find plugin or defer

Files: `SearchBar.tsx`, `ContentArea` layout

### T05: Insert operations
**Wave 3 — depends on T01/T02 (needs EditorRef)**

- Insert Link (Ctrl+K): **popover at cursor** with URL + text fields → `[text](url)`
- Insert Image: **popover at cursor** with URL + alt text → `![alt](url)`
- Insert Table: **popover with grid picker** (rows x cols) → markdown table
- Each inserts at cursor via active editor's EditorRef
- Works in both Code mode (insert syntax) and Visual mode (Milkdown command)

Files: `Toolbar.tsx`, new `InsertLinkPopover.tsx`, `InsertImagePopover.tsx`,
`InsertTablePopover.tsx`

### T06: File operations (in-memory, no persistence)
**Wave 3 — parallel**

- New File (Ctrl+N): creates empty entry in fileContents + opens tab
- Save (Ctrl+S): marks file as "saved" (resets dirty flag, updates originalContents)
  No actual persistence — just clears the modified indicator
- Save As: prompt for filename, clone content under new name
- Open File / Open Folder: show toast "Available in desktop app" (disabled in prototype)
- Quit: show toast "Available in desktop app"

Files: `MenuBar.tsx`, `AppStateProvider.tsx`

### T07: Settings application
**Wave 2 — parallel, no editor dependency**

- Font size: apply CSS variable `--editor-font-size` to editor + preview containers
- Word wrap: toggle on CodeMirror (lineWrapping extension) + preview (CSS)
- Render Math: conditionally enable/disable KaTeX in MarkdownPreview
- Render Mermaid: conditionally enable/disable Mermaid rendering
- File extensions filter: filter mock file tree by extensions
- Exclude patterns: hide matching files from tree
- Folders collapsed by default: apply to file tree initial state

Files: `useSettings.ts`, `MarkdownPreview.tsx`, `FileTree.tsx`

### T08: File tree CRUD (in-memory)
**Wave 4 — polish**

- Create folder (button exists, needs handler → adds to mock tree)
- Rename file/folder (right-click context menu → inline input)
- Delete file/folder (right-click → confirm dialog)
- Refresh button (reset to original mock data)
- All operations in-memory only, lost on reload (throwaway for Tauri)

File: `FileTree.tsx`

### T09: Export to HTML
**Wave 4 — parallel**

- Takes rendered HTML from MarkdownPreview DOM
- Wraps in standalone HTML document with embedded CSS (current theme)
- Downloads via browser `<a download>` API
- Includes Shiki styles, Mermaid SVGs (already rendered), KaTeX CSS inline
- Menu: File > Export > HTML. Toast: "Exported {filename}.html"

Files: `MenuBar.tsx`, new `utils/exportHtml.ts`

### T10: Export to PDF
**Wave 4 — parallel**

- Use `window.print()` with print-specific CSS (`@media print`)
- Apply current theme colors
- Page breaks before H1/H2 headings
- Hide UI chrome in print view
- Menu: File > Export > PDF. Toast: "Opening print dialog..."

Files: `MenuBar.tsx`, new `utils/exportPdf.ts`, new `print.css`

### T11: Keyboard shortcuts + menu audit
**Wave 4 — parallel**

- Verify all shortcuts in ShortcutsModal actually work
- Wire formatting shortcuts (Ctrl+B, Ctrl+I) to active editor's execCommand
- Clipboard menu items (Cut/Copy/Paste): call `document.execCommand()` or
  focus editor (CodeMirror/Milkdown handle natively). 30-min task, not standalone.
- Disable/grey out shortcuts for Tauri-only features (Open Folder, Quit)
- Update ShortcutsModal to show accurate state

Files: `App.tsx`, `ShortcutsModal.tsx`, `MenuBar.tsx`

## Acceptance Criteria
- [ ] Content state layer manages file content + dirty tracking
- [ ] Code mode has CodeMirror with syntax highlighting and inline search
- [ ] Visual mode has Milkdown WYSIWYG (or split-pane fallback)
- [ ] Toolbar buttons trigger real editor commands (per-mode behavior)
- [ ] Find in file works as inline bar with match highlighting
- [ ] Find and Replace works in Code mode
- [ ] Insert Link/Image/Table via popovers at cursor
- [ ] Modified indicator (dot) on unsaved tabs
- [ ] Settings (font size, word wrap, render toggles) actually apply
- [ ] File tree supports create/rename/delete (in-memory)
- [ ] Export to HTML downloads a standalone file
- [ ] Export to PDF opens print dialog with styled output
- [ ] All keyboard shortcuts do what the shortcuts modal claims
- [ ] Existing tests pass, new tests cover editor operations

## Test Strategy

**CodeMirror (state-level tests)**:
- Use `@codemirror/state` EditorState directly (no DOM needed)
- Test that commands produce correct doc changes (bold wraps selection, heading inserts `#`)
- Test search extension finds matches

**Milkdown (pipeline tests)**:
- Test at remark level: markdown-in → transform → markdown-out
- Round-trip fidelity tests for each plugin
- Use `@milkdown/test` utilities if available

**Integration tests (Playwright, deferred to E2E)**:
- Toolbar button → editor state change (needs real DOM)
- Mode switching preserves content
- Find/replace across file content

**Unit tests (Vitest)**:
- Export utilities (HTML structure validation)
- Content state reducer (UPDATE_CONTENT, dirty tracking)
- Settings application (CSS variable injection)
- Insert operations (markdown string generation)

## Dependencies
- E008 (Tauri) for real filesystem — this epic works in-memory only
- Editor engine: ADR 008 decided (CodeMirror 6 + Milkdown)

## Wave Plan

```
Wave 1 (foundation, sequential):
  └── T01: Content state layer + CodeMirror Code mode

Wave 2 (parallel, after Wave 1):
  ├── T02: Milkdown Visual mode + toolbar wiring (spike first!)
  ├── T04: Find in file + Replace (preview DOM search)
  └── T07: Settings application

Wave 3 (parallel, after Wave 2):
  ├── T05: Insert operations (needs EditorRef from T01/T02)
  └── T06: File operations (needs content state from T01)

Wave 4 (polish, parallel):
  ├── T08: File tree CRUD
  ├── T09: Export HTML
  ├── T10: Export PDF
  └── T11: Keyboard shortcuts + menu audit
```

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Milkdown round-trip mangles custom plugins | HIGH | T02 spike test gates full integration; fallback = split-pane CodeMirror + live preview |
| Bundle size bloat (250kB+ new deps) | MEDIUM | Lazy-load both editors; preview mode loads neither |
| Mode-switch content desync | MEDIUM | Single MD string source of truth, serialize before switch |
| jsdom can't test editors | LOW | Test state layer, not DOM; Playwright for integration |
