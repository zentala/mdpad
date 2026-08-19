# AGENTS.md — mdpad

## What this is

mdpad is a local-first Markdown viewer and editor for developers who work with AI-generated specs, plans, and documentation. It runs as a Tauri v2 desktop app (Rust backend + React frontend) with a browser-based prototype at [mdpad.labs.zentala.agency](https://mdpad.labs.zentala.agency).

## Stack

- Package manager: **pnpm** (v10.28.0, from lockfile). Node version: 22 (from `.nvmrc`).
- Rust stable (Tauri v2 backend)
- React 19 + TypeScript 5.9 (frontend, in `prototype/`)
- Vite 8 + Vitest 4 (build + test)
- Tauri v2 (desktop runtime, `src-tauri/`)

## Layout

| Path | Holds |
|---|---|
| `prototype/` | React + Vite frontend app — components, state, editors, hooks |
| `prototype/src/components/` | UI components (layout, file-tree, markdown, toc, search, common) |
| `prototype/src/hooks/` | Custom hooks (useAppState, useTocHeadings, etc.) |
| `prototype/src/providers/` | AppStateProvider (Context + useReducer) |
| `prototype/src/plugins/` | Custom remark plugins (mark, sup/sub, wikilinks) |
| `prototype/src/test/` | Vitest setup + render helpers |
| `prototype/src/types/` | TypeScript interfaces |
| `prototype/scripts/` | Content generation script |
| `src-tauri/` | Rust backend — Tauri commands (list_files, read_file, watch_directory, etc.) |
| `.arch/` | Architecture docs and ADRs |
| `.github/workflows/` | CI (ci.yml), release (release.yml), Tauri release (tauri-release.yml) |
| `.plan/` | Project management (epics, backlog, STATE, JOURNAL) |

## Invariants — do not break these

- **Conventional Commits required** — enforced by `commitlint` (husky pre-commit hook) and CI (`amannn/action-semantic-pull-request`). Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`.
- **lint-staged runs ESLint + Prettier on staged .ts/.tsx files** — breaking this blocks commits via husky. Run `pnpm -C prototype lint` and `pnpm -C prototype format` before committing.
- **CI runs typecheck, lint, format, test, and build** — all must pass before merge (`.github/workflows/ci.yml`). Rust checks (cargo check, cargo test, clippy) also run.
- **`IS_TAURI` flag gates browser vs desktop behavior** — the app falls back to mock data when not running in Tauri. Never remove this branching.
- **Editor commands route through `EditorRef.execCommand`** — not `document.execCommand`. This is enforced by architecture (ADR 008).

## Commands

| Purpose | Command |
|---|---|
| install (root + prototype) | `pnpm bootstrap` |
| install (prototype only) | `pnpm install` (in `prototype/`) |
| typecheck | `pnpm typecheck` (in `prototype/`) |
| lint | `pnpm lint` (in `prototype/`) |
| format check | `pnpm format` (in `prototype/`) |
| test | `pnpm test` (in `prototype/`) |
| dev | `pnpm dev` (in `prototype/`) |
| build | `pnpm build` (in `prototype/`) |
| tauri dev | `pnpm tauri dev` (in root) |
| Rust checks | `cargo check`, `cargo test --lib`, `cargo clippy -- -D warnings` (in `src-tauri/`) |

## Runtime traps

- Dev server must build content first: `pnpm dev` runs `tsx scripts/build-content.ts` before Vite. If content generation fails, the dev server starts but renders empty.
- Husky pre-commit hook runs lint-staged (ESLint + Prettier). Skipping it with `--no-verify` bypasses quality gates.
- CI installs with `--frozen-lockfile` — never commit a lockfile you haven't tested with.
- The `prototype/` directory has its own `pnpm-lock.yaml` — root `pnpm install` does not install prototype deps. Use `pnpm bootstrap` for both.
- Tauri requires system libs on Linux: `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`. The CI workflow installs these.

## Conventions specific to this repo

- Files ≤ 250 lines, functions ≤ 50 lines (project standard).
- All UI icons from Lucide React — no other icon libraries.
- Dark/light/sepia/auto themes via CSS custom properties; `resolvedTheme` is never 'auto' at runtime.
- Settings persisted to `localStorage` (`mdpad-settings`, `mdpad-theme`).
- State managed via `AppStateProvider` (React Context + `useReducer`), not Redux/Zustand.
- Editor engines (CodeMirror 6, Milkdown) are lazy-loaded.
