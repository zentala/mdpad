# E010 — Journal

## Session 2026-03-31 — Epic creation
- **Goal**: Document all non-functional features, create implementation plan
- **Done**: Full audit of fake vs real features, README disclaimer, 13-task epic plan
- **Decisions**: CodeMirror 6 recommended for code mode, Milkdown/Tiptap for visual (ADR needed)
- **Next**: ADR for editor engine selection, then Wave 1 implementation

## Session 2026-03-31 13:00 — Full implementation
- **Goal**: Review plan (CEO + Eng + UI), implement all 4 waves of E010
- **Done**:
  - Triple review (CEO, Eng, UI) → rewrote plan with fixes (425cfec)
  - ADR 008: CodeMirror 6 + Milkdown as editor engines (eb7441a)
  - README WIP disclaimer added (f05dd28)
  - **Wave 1**: T01 content state + CodeMirror Code mode (c9108a8)
  - **Wave 2**: T02 Milkdown Visual WYSIWYG (f041a3a), T04 find/replace (5f09945), T07 settings wired (5a3744f)
  - **Wave 3**: T05 insert popovers (f5481d9), T06 file operations (1ccb20c)
  - **Wave 4**: T08 file tree CRUD (04725ba), T09+T10 export HTML/PDF (4cae00b), T11 shortcuts audit (66a152c)
  - **Impro review**: all 13 findings fixed (17fd061) — insertAtCursor, stale Milkdown, missing commands, DRY popovers, tests, CLAUDE.md
- **Decisions**:
  - CodeMirror 6 for Code mode + Milkdown for Visual mode ([ADR 008](../../.arch/ADR/008-editor-engine-codemirror-milkdown.md))
  - Lazy-load both editors (Preview mode loads 0kB extra)
  - Single markdown string as content source of truth, per-editor undo
  - File tree CRUD is UI-only (deferred to Tauri for real fs ops)
- **Findings this session**: 13 (all fixed in impro review)
- **Improvements logged**: 0 (all findings fixed inline)
- **Tests**: 76 → 81
- **Next**: Visual QA in dev server, push to remote, E008 Tauri integration
