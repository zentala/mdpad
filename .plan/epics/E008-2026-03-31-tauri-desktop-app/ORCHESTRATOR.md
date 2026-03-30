# E008 — Orchestrator

## Wave 1: Scaffold
- [ ] **E008-T01** — Create src-tauri/ scaffold
- [ ] **E008-T02** — Update Vite config for Tauri (parallel with T01)
- [ ] **E008-T03** — Generate app icons (parallel with T01)
- [ ] **E008-T04** — Verify cargo tauri dev works

## Wave 2: File System Commands
- [ ] **E008-T05** — Implement file commands (list_files, read_file)
- [ ] **E008-T06** — Write Rust tests for file commands

## Wave 3: Frontend IPC Integration
- [ ] **E008-T07** — Create Tauri data layer (tauri-api.ts, dual-mode index.ts)
- [ ] **E008-T08** — Async file loading in AppStateProvider
- [ ] **E008-T09** — End-to-end verification

## Wave 4: File Watching
- [ ] **E008-T10** — Implement file watcher (notify crate + frontend events)

## Wave 5: CLI Arguments
- [ ] **E008-T11** — CLI argument handling (tauri-plugin-cli)

## Wave 6: Polish & CI
- [ ] **E008-T12** — Window polish (state, title, icons, file association)
- [ ] **E008-T13** — Tauri CI/CD workflow (tauri-action)
- [ ] **E008-T14** — Add Rust CI checks to ci.yml
