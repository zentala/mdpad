# ADR 008: Editor Engine — CodeMirror 6 + Milkdown

- **Status**: accepted
- **Date**: 2026-03-31
- **Epic**: E010

## Context

The mdpad prototype has no editor engine. All editing UI (toolbar buttons, formatting
shortcuts, undo/redo) is non-functional. We need to choose an editor engine to make
the Code mode (raw markdown) and Visual mode (WYSIWYG) actually work.

Requirements:
- Clean markdown round-trip (MD → editor → MD without loss)
- GFM support (tables, task lists, strikethrough, autolinks)
- Plugin support for KaTeX math, Mermaid diagrams, GitHub Alerts
- React integration (official or mature community wrapper)
- MIT license
- Active maintenance

## Decision

**Two engines, one per editing mode:**

1. **CodeMirror 6** (`@codemirror/lang-markdown` + `@uiw/react-codemirror`) for **Code mode**
   - Raw markdown source editing with syntax highlighting
   - Line numbers, active line, heading folding
   - Built-in search/replace (`@codemirror/search`)
   - ~150 kB gzipped

2. **Milkdown** (`@milkdown/core` + `@milkdown/react` + `@milkdown/preset-gfm`) for **Visual mode**
   - WYSIWYG editing with ProseMirror under the hood
   - Markdown serialization via remark-parse/remark-stringify (same unified pipeline
     we already use for react-markdown — shared plugin ecosystem)
   - Built-in plugins: `plugin-math` (KaTeX), `plugin-diagram` (Mermaid), `plugin-collab` (Yjs)
   - ~100 kB gzipped

**Preview mode** stays unchanged — read-only `react-markdown` + remark/rehype plugins.

## Alternatives Considered

### Tiptap (rejected)
- ProseMirror-based WYSIWYG, 29k stars, very popular
- **Rejected because:**
  - Markdown is a conversion layer, not native format — lossy round-trip
  - No built-in math, mermaid, or GitHub Alerts support
  - Collaborative editing is paid Pro ($149/mo)
  - Hybrid Typora-like mode not feasible without fighting the abstraction
  - Would require `tiptap-markdown` community plugin + many custom extensions

### Monaco (rejected)
- VS Code's editor engine, excellent for code editing
- **Rejected because:** ~2 MB bundle size, massive overkill for markdown editing

### textarea + custom (rejected)
- Minimal bundle, full control
- **Rejected because:** must build everything from scratch — undo history,
  selection handling, keyboard shortcuts, search/replace, syntax highlighting

### CodeMirror 6 only (rejected for Visual mode)
- Could add decorations to make bold text look bold inline
- **Rejected for Visual because:** fundamentally a source editor, cannot do true
  WYSIWYG (rendered tables, images, block formatting)

### Milkdown only (rejected for Code mode)
- Could expose raw markdown in a text node
- **Rejected for Code because:** ProseMirror schema overhead unnecessary for raw text editing,
  CodeMirror is purpose-built for code/text and has better performance for large files

## Consequences

### Positive
- Clean separation: CodeMirror owns Code mode, Milkdown owns Visual mode
- Shared remark plugin pipeline between Milkdown and existing react-markdown Preview
- Both MIT, both actively maintained (releases in March 2026)
- Future collab editing supported by both (CodeMirror OT + Milkdown Yjs)
- Built-in search/replace in CodeMirror (free T05 implementation)

### Negative
- Two editor engines = larger total bundle (~250 kB gzip combined)
- Developers must learn two APIs (CodeMirror + ProseMirror/Milkdown)
- Mode switching requires content sync between engines (markdown string as interchange)
- Milkdown's plugin versions lag behind core (math 7.5.9 vs core 7.20.0)

### Migration path
- T01: Integrate CodeMirror 6 for Code mode (replace `<pre>` block)
- T02: Integrate Milkdown for Visual mode (replace static render in edit context)
- Content interchange: both read/write plain markdown strings via app state
