# E008 — Orchestrator

## Wave 1: Scaffold
- [x] **E008-T01** — Create src-tauri/ scaffold
- [x] **E008-T02** — Update Vite config for Tauri (parallel with T01)
- [x] **E008-T03** — Generate app icons (parallel with T01)
- [x] **E008-T04** — Verify cargo tauri dev works (cargo check passes)

## Wave 2: File System Commands
- [x] **E008-T05** — Implement file commands (list_files, read_file)
- [x] **E008-T06** — Write Rust tests for file commands (4 tests passing)

## Wave 3: Frontend IPC Integration
- [x] **E008-T07** — Create Tauri data layer (tauri-api.ts, dual-mode index.ts)
- [x] **E008-T08** — Async file loading in AppStateProvider
- [ ] **E008-T09** — End-to-end verification (needs cargo tauri dev on user machine)

## Wave 4: File Watching
- [x] **E008-T10** — Implement file watcher (notify crate + 7 tests)

## Wave 5: CLI Arguments
- [x] **E008-T11** — CLI argument handling (tauri-plugin-cli + useCliArgs hook)

## Wave 6: Polish & CI
- [x] **E008-T12** — Window polish (set_window_title command, window-state plugin)
- [x] **E008-T13** — Tauri CI/CD workflow (tauri-action cross-platform)
- [x] **E008-T14** — Add Rust CI checks to ci.yml (cargo check/test/clippy)
