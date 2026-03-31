---
updated: 2026-03-31T05:55:00Z
active_epic: none
active_epic_path: none
current_wave: none
---

## Status
E006 UI Layout Improvements: 3/3 complete. Activity Bar, Zen Mode, Zen Hover Bar.
E007 Release Engineering: 12/12 complete. CI/CD, branching, releases, Docker all working.
E008 Tauri Desktop App: 13/14 complete. T09 (manual E2E verification) remaining.
E005 website deploy: 7/7 complete. Site live at https://mdpad.zentala.io.
E004 comrak extensions: 9/9 complete.
E003 prototype v3: 20/21 complete.

## Completed This Session
- E007: ESLint + Prettier + typecheck scripts
- E007: CI workflow (GitHub Actions — typecheck, lint, format, test, build)
- E007: Dev/main branching (dev = default, main = releases)
- E007: Husky + lint-staged + commitlint
- E007: Versioning v0.1.0 + CHANGELOG.md
- E007: Release workflow (GitHub Release + web zip on push to main)
- E007: Docker (multi-stage Dockerfile + nginx + GHCR push)
- E007: CONTRIBUTING.md, README CI badge, CLAUDE.md update
- E008: Tauri v2 scaffold (Cargo.toml, tauri.conf.json, lib.rs, main.rs)
- E008: File system commands (list_files, read_file) + 4 Rust tests
- E008: Dual-mode data layer (Tauri IPC vs static imports)
- E008: File watcher (notify crate) + 7 Rust tests
- E008: CLI argument handling (tauri-plugin-cli)
- E008: Window polish (set_window_title, window-state)
- E008: Tauri release workflow (cross-platform) + Rust CI checks
- ADR-007: Keep remark pipeline in Tauri (defer comrak)
- Improvements: error handling, constants, clippy fixes, Docker env

## Tests
- 59 JavaScript tests (Vitest) — passing (+23 from E006)
- 11 Rust tests (cargo test) — passing

## Next Steps
1. Run `cargo tauri dev` to verify E2E (E008-T09)
2. Merge dev → main for v0.1.0 release
3. TLS cert fix for mdpad.zentala.io
4. Tests for E004 remark plugins (11 plugins, 0 coverage)
