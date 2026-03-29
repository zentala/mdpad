# Journal — E001: Project Bootstrap

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
- **Note**: Session ended without `done.` command. No journal was written.
- **State at exit**: see STATE.md for last known state
- **Action needed**: next session should review what happened and write proper journal
