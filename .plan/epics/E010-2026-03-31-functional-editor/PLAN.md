# E010 — Functional Editor: From Prototype to Working App

## What
Make all non-functional UI elements actually work. The prototype currently has
buttons, menus, and shortcuts that look real but do nothing. This epic turns
the visual concept into a functional markdown editor.

## Why
The prototype misleads users — toolbar buttons, menu items, and keyboard shortcuts
exist but have no implementation. File editing, saving, search, and all text
formatting are completely fake. Before adding any new features, the existing UI
must actually work.

## Scope
- Frontend only (React prototype) — no Tauri/Rust backend yet (that's E008)
- All editing happens in-memory (mock data, localStorage persistence)
- No real filesystem access (that requires Tauri)
- Focus: make every visible button, menu item, and shortcut do what it claims

## Non-goals
- Tauri desktop integration (E008)
- CLI implementation (E008)
- Server mode
- Real filesystem read/write (needs Tauri IPC)
- New features not already shown in UI

## Architecture Decision: Editor Engine (decided)

**CodeMirror 6** for Code mode + **Milkdown** for Visual mode.
See [ADR 008](../../.arch/ADR/008-editor-engine-codemirror-milkdown.md) for full rationale.

Key reasons:
- Milkdown uses remark (same pipeline as our react-markdown) — shared plugins
- Clean MD round-trip via remark-parse/stringify
- Tiptap rejected: lossy round-trip, no math/mermaid, paid collab
- Both MIT, both actively maintained (March 2026 releases)

## Tasks

### T01: Editor engine integration (Code mode)
Integrate CodeMirror 6 as the code editing engine for raw markdown.
- Replace `<pre>` block in MarkdownPreview code mode with CodeMirror
- Markdown syntax highlighting in editor
- Line numbers, active line highlight
- Content state syncs with app state (edits update the in-memory file content)
- File: `Toolbar.tsx`, `MarkdownPreview.tsx`, new `CodeEditor.tsx` component

### T02: Visual editing mode (WYSIWYG)
Implement WYSIWYG editing for Visual mode using Milkdown.
- Rich text editing with markdown serialization
- Toolbar buttons wire to editor commands (bold, italic, heading, list, etc.)
- Two-way sync: markdown source <-> visual editor
- File: new `VisualEditor.tsx` component, `Toolbar.tsx` button wiring

### T03: Toolbar button wiring
Connect all Toolbar and FloatingToolbar buttons to the editor engine.
- Bold (Ctrl+B), Italic (Ctrl+I), Strikethrough, Inline Code
- Headings H1-H3 (Ctrl+1/2/3)
- Ordered List, Unordered List, Task List, Blockquote
- Code Block
- FloatingToolbar: same actions on text selection
- Undo/Redo buttons + Ctrl+Z / Ctrl+Shift+Z
- Files: `Toolbar.tsx`, `FloatingToolbar.tsx`

### T04: Find in file (Ctrl+F)
Make the in-file search bar actually work.
- Search current file content for query string
- Highlight matches in the editor/preview
- Show match count ("3 of 12")
- Navigate between matches (up/down arrows, Enter)
- Case sensitivity toggle
- File: `SearchBar.tsx`

### T05: Find and Replace (Ctrl+H)
Extend find-in-file with replace functionality.
- Replace current match
- Replace all matches
- Regex support toggle
- Works in Code mode (CodeMirror has built-in search)
- File: `SearchBar.tsx`

### T06: Insert operations
Implement Insert Link, Insert Image, Insert Table dialogs.
- Insert Link (Ctrl+K): modal with URL + text fields → inserts `[text](url)`
- Insert Image: modal with URL + alt text → inserts `![alt](url)`
- Insert Table: grid picker (rows x cols) → inserts markdown table
- Each inserts markdown at cursor position in editor
- Files: `Toolbar.tsx`, new modal components

### T07: File operations (in-memory)
Make Save, New File, and file management work within the prototype's mock data.
- New File (Ctrl+N): creates empty file in mock tree + opens tab
- Save (Ctrl+S): persists current content to localStorage
- Save As (Ctrl+Shift+S): prompt for new filename, save to localStorage
- File content persists across page reloads via localStorage
- Modified indicator (dot) on tab for unsaved changes
- Files: `MenuBar.tsx`, `AppStateProvider.tsx`, `TabBar.tsx`

### T08: Clipboard and Edit menu
Wire Edit menu items to browser clipboard API.
- Cut (Ctrl+X): cut selected text from editor
- Copy (Ctrl+C): copy selected text
- Paste (Ctrl+V): paste at cursor
- Select All (Ctrl+A)
- These should work natively with CodeMirror; just ensure menu items dispatch correctly
- File: `MenuBar.tsx`

### T09: Settings application
Make stored settings actually affect the UI.
- Font size: apply to editor and preview (CSS variable)
- Word wrap: toggle on CodeMirror + preview
- Render Math: conditionally enable/disable KaTeX plugin
- Render Mermaid: conditionally enable/disable Mermaid rendering
- File extensions filter: filter file tree by extensions
- Exclude patterns: hide matching files from tree
- Folders collapsed by default: apply to file tree initial state
- Files: `useSettings.ts`, `MarkdownPreview.tsx`, `FileTree.tsx`, `CodeEditor.tsx`

### T10: File tree management
Add file/folder CRUD operations to the file tree.
- Create folder (button already exists, needs handler)
- Rename file/folder (right-click context menu → inline input)
- Delete file/folder (right-click → confirm dialog)
- Refresh button (re-scan mock data)
- All operations in-memory (localStorage persistence)
- File: `FileTree.tsx`

### T11: Export to HTML
Implement HTML export for the current file.
- Takes current rendered HTML from MarkdownPreview
- Wraps in standalone HTML document with embedded CSS (current theme)
- Downloads as `.html` file via browser download API
- Includes syntax highlighting styles, Mermaid SVGs, KaTeX CSS
- File: `MenuBar.tsx`, new `exportHtml.ts` utility

### T12: Export to PDF
Implement PDF export using browser print or a library.
- Option A: `window.print()` with print-specific CSS
- Option B: html2pdf.js or jsPDF for direct PDF generation
- Apply current theme styling
- Handle Mermaid diagrams (render to SVG first)
- Page breaks on headings
- File: `MenuBar.tsx`, new `exportPdf.ts` utility

### T13: Keyboard shortcuts audit
Ensure all claimed keyboard shortcuts actually work.
- Formatting: Ctrl+B, Ctrl+I, Ctrl+U (need editor)
- Headings: Ctrl+1/2/3 (need editor)
- Navigation: all already working
- File operations: Ctrl+S (save), Ctrl+O (open — show info that needs Tauri)
- Print: Ctrl+P is Quick Open (correct, no print shortcut needed)
- Remove or disable shortcuts for features that need Tauri (Open Folder, Quit)
- ShortcutsModal: update to show only working shortcuts
- File: `App.tsx`, `ShortcutsModal.tsx`

## Acceptance Criteria
- [ ] Code mode has a real editor (CodeMirror) with syntax highlighting
- [ ] Visual mode has WYSIWYG editing with markdown serialization
- [ ] All toolbar buttons trigger real editor commands
- [ ] Find in file works with match highlighting and navigation
- [ ] Find and Replace works in code mode
- [ ] Insert Link/Image/Table insert markdown at cursor
- [ ] Files persist to localStorage across page reloads
- [ ] Modified indicator on unsaved tabs
- [ ] Settings (font size, word wrap, render toggles) actually apply
- [ ] File tree supports create/rename/delete (in-memory)
- [ ] Export to HTML downloads a standalone file
- [ ] Export to PDF generates a printable document
- [ ] All keyboard shortcuts do what the shortcuts modal claims
- [ ] Existing tests still pass, new tests cover editor operations

## Test Strategy
- **Unit tests**: editor commands (bold wraps selection, heading inserts `#`)
- **Unit tests**: export utilities (HTML structure, PDF generation)
- **Integration tests**: toolbar button → editor state change
- **Integration tests**: find/replace across file content
- **Integration tests**: settings applied to rendered output
- **E2E** (deferred to E008): full editing workflow with Tauri file I/O

## Dependencies
- E008 (Tauri) for real filesystem — this epic works with in-memory/localStorage only
- Editor engine selection needs ADR before T01/T02 begin

## Wave Plan
- **Wave 1**: T01 (CodeMirror) + T09 (settings apply) — foundation
- **Wave 2**: T02 (WYSIWYG) + T03 (toolbar wiring) + T04 (find in file) — core editing
- **Wave 3**: T05 (replace) + T06 (insert) + T07 (file ops) + T08 (clipboard) — completeness
- **Wave 4**: T10 (file tree) + T11 (HTML export) + T12 (PDF export) + T13 (shortcuts audit) — polish
