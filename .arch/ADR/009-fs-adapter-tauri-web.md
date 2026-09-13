# ADR 009: File system adapter — one interface over Tauri IPC and browser File System Access

- **Status**: accepted
- **Date**: 2026-08-17
- **Epic**: E011

## Context
Menu items Open File / Open Folder / Save / Save As need real file access. The
app runs in two hosts: a Tauri window (Rust backend, IPC commands `list_files` /
`read_file`, no write yet) and a plain browser (the web demo, mock data today).
Wiring each menu action to `IS_TAURI ? invoke(...) : browserApi(...)` at every
call site would scatter host detection through the UI.

## Decision
Introduce `src/data/fsAdapter.ts` — a single interface (`openFile`, `openFolder`,
`saveFile`, `saveFileAs`) that branches internally on the existing `isTauri()`
from `src/data/tauri-api.ts`:
- **Tauri branch** delegates to IPC wrappers (`listFiles`, `readFile`, and a new
  `writeFile` backed by a new Rust `write_file` command).
- **Web branch** uses the File System Access API (`showOpenFilePicker`,
  `showDirectoryPicker`, `showSaveFilePicker`), with an `<input type=file>` /
  `<a download>` fallback for browsers without it.

UI components call the adapter and never see the host branch.

## Alternatives
- **Inline `IS_TAURI` checks per action** — rejected: host detection leaks into
  every menu handler, hard to test, hard to swap.
- **Wait for Tauri-only file ops** — rejected: the web demo would keep dead menu
  items, and the browser can do real file I/O today via File System Access.

## Consequences
- One seam to mock in tests; UI tests never touch host APIs.
- Save requires a new Rust `write_file` command (backend had read-only ops).
- File handles must live in app state so Save can write in place.
- When Tauri gains more file ops, only the adapter's Tauri branch changes.
