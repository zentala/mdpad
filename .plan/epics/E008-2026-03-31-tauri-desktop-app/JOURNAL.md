# E008 — Journal

## Session 2026-03-31 — Epic creation
- **Goal**: Build Tauri v2 desktop app wrapping React prototype
- **Context**: No Rust code exists yet. Prototype has complete React/remark rendering pipeline.
- **Decision**: Keep React/remark pipeline, use Tauri only for filesystem access + CLI
- **Plan**: 14 tasks across 6 waves

## Session 2026-03-31 05:00 — Full implementation (13/14 tasks)
- **Goal**: Implement all Tauri waves
- **Done**:
  - Wave 1: Scaffold — Cargo.toml, main.rs, lib.rs, tauri.conf.json, icons (51dc30f)
  - Wave 2: File commands — list_files, read_file + 4 Rust tests (51dc30f)
  - Wave 3: Frontend IPC — tauri-api.ts, useTauriFiles, dual-mode AppStateProvider (d8c6496)
  - Wave 4: File watcher — notify crate, WatcherState, 7 tests (3b49c08)
  - Wave 5: CLI args — resolve_source(), useCliArgs hook (3a0b72c)
  - Wave 6: Polish — set_window_title, tauri-release.yml, Rust CI checks (259e60a)
  - Improvements: error handling, constants, ADR-007, Docker env, clippy fixes (697e2a7..6cbc8ea)
- **Decisions**: [ADR-007](.arch/ADR/007-keep-remark-pipeline-in-tauri.md) — remark over comrak for v0.1
- **Tests**: 36 JS + 11 Rust = 47 total
- **Remaining**: T09 — manual E2E verification (cargo tauri dev)
- **Next**: Test `cargo tauri dev` interactively, then merge dev → main for v0.1.0 release
