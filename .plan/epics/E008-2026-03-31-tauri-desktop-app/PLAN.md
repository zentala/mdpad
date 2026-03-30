# E008 — Tauri Desktop App

## What
Create a native Tauri v2 desktop application wrapping the React prototype with real filesystem access.

## Why
mdpad's core value prop is "the terminal for your markdown" — launch from CLI, browse folder, preview .md files. This requires native filesystem access that only a desktop app provides.

## Scope
- Tauri v2 scaffold (Cargo.toml, tauri.conf.json, main.rs, lib.rs)
- File system commands (list_files, read_file via IPC)
- File watcher (auto-refresh on changes, notify crate)
- CLI arguments (mdpad /path/to/folder)
- Dual-mode data layer (Tauri IPC vs static imports)
- Cross-platform builds (Windows, macOS, Linux)
- GitHub Actions with tauri-action

## Key Decision: Parser
Keep React/remark pipeline (not comrak). 11 custom plugins would need rewriting. Comrak deferred to future optimization epic.

## Out of Scope
- comrak Rust parser integration
- File editing/saving (read-only for v0.1)
- Multiple root directories (single folder at a time)
- Auto-updater

## Acceptance Criteria
- [ ] `cargo tauri dev` opens window with prototype
- [ ] `cargo tauri dev -- -- /path` opens specified folder
- [ ] Real file tree from disk displayed in sidebar
- [ ] Click file → content loads and renders with full pipeline
- [ ] File changes on disk trigger auto-refresh
- [ ] `cargo tauri build` produces installable binary
- [ ] CI builds cross-platform on tag push
- [ ] Web SPA mode still works unchanged

## Test Strategy
- Rust unit tests for file commands (list_files, read_file)
- Manual E2E: open folder, navigate files, verify rendering
- CI: cargo check + cargo test + cargo clippy
