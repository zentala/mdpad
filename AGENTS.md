# AGENTS.md — mdpad

## What this is

A lightweight Markdown editor & viewer for developers who work with AI-generated specs, plans, and documentation. It is a React + TypeScript prototype frontend (a working in-browser web demo on mock content) paired with a Tauri v2 / Rust desktop backend; both live in this one repo, but the desktop app is backend-wired, not packaged for release, and there is no CLI or server mode yet.

## Stack

- Package manager: **pnpm** (`packageManager: pnpm@10.28.0` in `package.json`, confirmed by `pnpm-lock.yaml` at the root and `prototype/pnpm-lock.yaml`). Node version: **22** (`.nvmrc`; CI also sets `node-version: 22`).
- Frontend: React 19 + TypeScript, Vite 8, Vitest, ESLint 10 (flat config) + Prettier — all under `prototype/`.
- Desktop backend: Rust (edition 2024), Tauri v2, `notify`, `walkdir`, `tokio`, `thiserror` — in `src-tauri/`.
- Two independent pnpm projects, not one workspace: the root holds dev tooling (`@tauri-apps/cli`, husky, lint-staged, commitlint); `prototype/` holds the app. Install each separately.
- Run: Vite dev server (`pnpm dev` in `prototype/`, port 5173); desktop via `pnpm tauri dev`. Build is `tsx scripts/build-content.ts && tsc && vite build`.

## Layout

| Path | Holds |
|---|---|
| `prototype/` | React + Vite frontend — all app code, tests, mock data, vite/vitest/eslint config |
| `src-tauri/` | Rust Tauri v2 backend — 6 IPC commands, `Cargo.toml`, `tauri.conf.json` |
| `.arch/` | Architecture docs and ADRs (001–009) |
| `.plan/` | Epics, tasks, backlog, reports, STATE — planning artifacts; not a build input |
| `.github/workflows/` | CI (`ci.yml`), release + Docker (`release.yml`), Tauri release |
| `.husky/` | `commit-msg` (commitlint) and `pre-commit` (lint-staged + taskmd validate) hooks |
| `examples/` | Git submodules — reference Tauri markdown editors; never a build dependency |
| `docker/` | `nginx.conf` used by the root `Dockerfile` |
| `pm3.yaml` | PM3 service definition — the dev server is PM3-managed |

## Invariants — do not break these

- **Every commit and PR title must be a Conventional Commit** (types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`) — enforced by `commitlint` via `.husky/commit-msg` and by the `conventional-commits` CI job. A non-conventional commit is rejected locally and in CI.
- **LF line endings** — `.gitattributes` sets `* text=auto eol=lf` and explicit `eol=lf` for js/ts/tsx/json/md/rs/toml/html/css/svelte. New files of those types must not introduce CRLF.
- **ESLint must stay under 10 warnings** — `pnpm lint` runs `eslint src --max-warnings 10`; CI runs it and lint-staged re-runs it with `--fix --max-warnings 10` on commit. The 11th warning fails the build.
- **Rust must be clippy-clean with `-D warnings`** — the `rust` CI job fails on any clippy warning. Production Rust code returns `Result` (via `thiserror`); `unwrap()` appears only in `#[cfg(test)]` code.
- **Task-file frontmatter must be valid taskmd** — `.husky/pre-commit` runs `taskmd validate` whenever `.taskmd.yaml` is present; invalid frontmatter blocks the commit.
- **Branching: `dev` is the default/active branch; `main` is releases only** — enforced by workflow triggers: `ci.yml` runs on push to `dev` and on PRs to `dev`/`main`; `release.yml` (GitHub Release + Docker image) runs only on push to `main`.

## Dependency boundaries

The frontend and the Rust backend are separate builds that communicate only over Tauri IPC; there is no cross-import between `prototype/` and `src-tauri/`. File I/O goes through one seam ([.arch/ARCHITECTURE.md](.arch/ARCHITECTURE.md), E011 / ADR 009):

```
UI (MenuBar / App handlers)
        │  openFile / openFolder / saveFile / saveFileAs
        ▼
   fsAdapter.ts
     ├── Tauri branch → tauri-api.ts → IPC → Rust (list_files, read_file, write_file)
     └── Web branch  → fsAdapterWeb.ts → File System Access API
                        (showOpenFilePicker / showDirectoryPicker / showSaveFilePicker)
                        with <input type=file> + Blob-download fallback
```

The Rust backend registers 6 commands: `list_files`, `read_file`, `write_file`, `watch_directory`, `unwatch_directory`, `set_window_title` (`src-tauri/src/commands/`).

## Commands

All pnpm commands run from `prototype/`; `pnpm -C prototype <script>` works from the root.

| Purpose | Command |
|---|---|
| install (everything, from root) | `pnpm bootstrap` |
| install (prototype only) | `pnpm -C prototype install` |
| dev server (prototype) | `pnpm -C prototype dev` |
| typecheck | `pnpm -C prototype typecheck` |
| lint | `pnpm -C prototype lint` |
| format check | `pnpm -C prototype format` |
| test | `pnpm -C prototype test` |
| build | `pnpm -C prototype build` |
| Tauri dev (desktop app) | `pnpm tauri dev` |
| Rust check | `cd src-tauri && cargo check` |
| Rust test | `cd src-tauri && cargo test --lib` |
| Rust clippy | `cd src-tauri && cargo clippy -- -D warnings` |
| deploy (Cloudflare Pages) | `cd prototype && pnpm deploy` |

## Runtime traps

- **The dev server is PM3-managed** — `pm3.yaml` defines the `dev` service (`pnpm dev` in `prototype/`, port 5173, domain `mdpad.internal`). Do not start a second `pnpm dev` by hand; it collides with PM3's process and leaves orphans.
- **`pnpm dev` / `build` / `deploy` generate content first** — each runs `tsx scripts/build-content.ts`, which writes `prototype/src/generated/` (gitignored, and excluded from ESLint). Run these scripts, not bare `vite`, or generated content is missing.
- **`examples/` are git submodules** — CI checks them out with `submodules: false`; they are reference material only.
- **Two separate lockfiles** — root `pnpm-lock.yaml` and `prototype/pnpm-lock.yaml`. CI installs `prototype/` with `--frozen-lockfile` against the prototype lockfile, so dependency changes in `prototype/package.json` require updating `prototype/pnpm-lock.yaml` (run `pnpm install` in `prototype/`).

## Conventions specific to this repo

- State is React Context + useReducer (`AppStateProvider`), never a store library (ADR 005).
- Editor engines are CodeMirror 6 (code mode) and Milkdown (visual mode), both lazy-loaded; editor commands route through `EditorRef.execCommand`, not `document.execCommand` (ADR 008).
- `prototype/src/generated/` is build output — never hand-edit it.