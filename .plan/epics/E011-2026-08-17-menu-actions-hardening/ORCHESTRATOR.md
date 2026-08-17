# E011 — ORCHESTRATOR

## Status (2026-08-17) — DONE except T03 (deferred)

Wykonane przez 4 równoległych subagentów (worktree) + integracja w main loop:
- **T00, T01, T02a, T04, T08** (Agent F) — fsAdapter, Open File, Save/Save As, Export ▸ submenu, Quit ukryte. ✅
- **T02b** (Agent R) — Rust `write_file` + wrapper + **path-traversal fix** (hook flagował), 13 rust testów. ✅
- **T05, T06, T07** (Agent E) — Replace działa, Undo/Redo/Cut/Copy/Paste przez `EditorRef`, Zoom/Find-in-Folder z menu. ✅
- **T09, T10** (Agent T) — 81→**159** testów (MenuBar, Toolbar, SearchBar, skróty, reducer). ✅
- **T11** (main) — ARCHITECTURE.md zaktualizowane, ADR 009, runtime QA na `mdpad.internal` (Replace i Undo zobaczone na żywo), pełny suite zielony. ✅
- **T03 (Open Folder web) — ODŁOŻONE.** Najdroższy task (8 pkt), wymaga refaktoru drzewa na dynamiczny stan; w Tauri folder już działa (`list_files`). `fsAdapter.openFolder()` gotowy, niepodpięty do menu. Tani follow-up.

Bramka jakości na zebranej gałęzi: `tsc` ✅ · 159/159 vitest ✅ · eslint 0 błędów · `cargo test` 13/13 ✅.

## TLDR

11 tasków w 4 falach. Suma: **52 pkt**. Fala 0 = warstwa plików w przeglądarce
(File System Access API) + realny Open/Save/Save As. Fala 1 = naprawy pozostałych
akcji (Replace, Undo/Redo, Zoom, Export submenu, ukrycie Quit). Fala 2 = testy
warstwy akcji. Fala 3 = weryfikacja runtime + merge.

Legenda pkt: skala Fibonacci z CLAUDE.md.

## Wave 0 — File I/O w przeglądarce (fundament)

### T00 — Warstwa abstrakcji `fsAdapter` · 5 pkt · Importance: High
Nowy `src/data/fsAdapter.ts`: interfejs `openFile()`, `openFolder()`,
`saveFile(handle, content)`, `saveFileAs(content, name)`. **Wpina się w
istniejący `isTauri()` z `src/data/tauri-api.ts`** — gałąź Tauri deleguje do
IPC (`listFiles`/`readFile` istnieją; `writeFile` dodaje T02b), gałąź web to
File System Access API (detekcja `'showOpenFilePicker' in window`) z fallbackiem
(`<input type=file>` odczyt, `<a download>`/blob zapis). NIE twórz nowej flagi
`isTauri` — użyj istniejącej. UI woła adapter, nie zna gałęzi.
**Test:** mock obu gałęzi, asercja routingu Tauri vs web vs fallback.

### T01 — Open File… działa · 3 pkt · High
`MenuBar` File → Open File → `fsAdapter.openFile()` → wczytaj `.md` do nowej
karty (nowy dispatch, np. `OPEN_EXTERNAL_FILE` z treścią + uchwytem). Podepnij
skrót Ctrl+O.
**Test:** klik → adapter wywołany → karta z treścią.

### T02a — Save / Save As (frontend) · 5 pkt · High
Rozszerz stan o uchwyty plików (`fileHandles`). **Save**: uchwyt jest →
`saveFile`; brak → zachowuje się jak Save As. **Save As…**: `saveFileAs()`,
zapamiętaj nowy uchwyt. Podepnij `onSaveAs` w `MenuBar` (dziś brak akcji).
Zaktualizuj reducer `SAVE_FILE`, żeby czyścił `modified` po realnym zapisie.
**Test:** Save z uchwytem → `saveFile` z treścią; Save bez uchwytu → picker.

### T02b — Komenda Rust `write_file` (Tauri) · 3 pkt · High
Backend nie ma zapisu. Dodaj `write_file(root_path, file_path, content)` w
`src-tauri/src/lib.rs` (bez `unwrap()`, doc comment — reguła rust.md),
zarejestruj w handlerze, dodaj wrapper `writeFile` w `src/data/tauri-api.ts`.
Gałąź Tauri `fsAdapter.saveFile` deleguje tu.
**Test:** wrapper woła `invoke('write_file', …)`; smoke Rust jeśli jest harness.

### T03 — Open Folder… (web) → realne drzewo · 8 pkt · Medium
W Tauri Open Folder **już działa** (`list_files`) — ten task dokłada gałąź web:
`showDirectoryPicker()` → rekurencyjny walk → mapowanie na `FileNode[]` (ten sam
typ co Tauri) → podmiana mocka w `FileTree`, lazy read treści przy otwarciu.
Fallback: brak FSA → komunikat „użyj Open File" (directory picker nie ma
fallbacku input-file). Reużyj kształtu drzewa z `useTauriFiles`.
**Test:** mock directory handle → `FileNode[]` o właściwej strukturze.

## Wave 1 — naprawy pozostałych akcji (równoległe)

### T04 — Export ▸ submenu (PDF / HTML) · 3 pkt · Medium
Restrukturyzacja menu File: zwiń „Export as PDF" + „Export as HTML" w jedną
pozycję **Export** z rozwijanym submenu. Wymaga wsparcia submenu w `MenuBar`
(dziś płaska lista) — dodaj `MenuItem.submenu?: MenuItem[]` i render zagnieżdżony.
Akcje bez zmian (`onExportPdf`, `onExportHtml`).

### T05 — Replace faktycznie działa · 5 pkt · High
`SearchBar.tsx`: zdejmij `disabled` z toggle Replace, podepnij `onClick` do
Replace / Replace All, użyj `replaceText`. Tryb Code → `@codemirror/search`;
Visual/write → replace na treści; czysty preview → ukryj replace. Rozdziel
„Find" i „Find & Replace" w `App.tsx` (flaga `withReplace`).
**Test:** fraza → replace all → asercja zmienionej treści.

### T06 — Undo/Redo/Cut/Copy/Paste na edytorze · 5 pkt · High
`MenuBar` menu Edit: zamiast `document.execCommand` przekaż z `App.tsx`
handlery wołające `editorRef.current.execCommand('undo'|...)`. Rozszerz
`EditorRef` i obie implementacje (`CodeEditor`, `VisualEditor`) o cut/copy/paste
jeśli brak. W preview te pozycje `disabled`.
**Test:** klik → właściwy `execCommand` na mocku.

### T07 — Zoom In/Out + Find in Folder z menu · 2 pkt · Medium
`App.tsx` + `MenuBar`: podepnij `onZoomIn/onZoomOut` (dispatch `SET_ZOOM`) i
`onFindInFolder` (dispatch `SET_SIDEBAR_PANEL panel:'search'`) — te same
dispatch co skróty. Koniec martwych kliknięć.

### T08 — Ukryj Quit w buildzie web · 1 pkt · Low
Użyj istniejącego `isTauri()` z `src/data/tauri-api.ts` (flaga
`__TAURI_INTERNALS__`); Quit renderowany tylko w Tauri (+ podepnij realną
komendę zamknięcia okna). Reszta pozycji File jest funkcjonalna po Wave 0,
więc bez `disabled`.

## Wave 2 — testy warstwy akcji (zależą od Wave 0–1)

### T09 — Testy MenuBar + skrótów · 5 pkt · High
`MenuBar.test.tsx`: render z mock handlerami, otwórz każdy dropdown (i submenu
Export), klik każdej podpiętej pozycji → asercja wywołania. Test skrótów:
`keyDown` Ctrl+S/O/N/W/B/I/=/- i Ctrl+Shift+* → właściwy dispatch/execCommand.

### T10 — Testy Toolbar + SearchBar + reducer · 5 pkt · High
`Toolbar.test.tsx`: mock `editorRef`, każdy przycisk → `execCommand(<cmd>)`;
popovery → `insertAtCursor`. `SearchBar.test.tsx`: find + replace (po T05).
`AppStateProvider.test.tsx`: dopnij nietestowane gałęzie (OPEN_FILE, CLOSE_TAB,
CLOSE_OTHER_TABS, CLOSE_ALL_TABS, NEW_FILE, SET_ACTIVE_TAB, TOGGLE_ZEN_MODE,
SET_ZOOM, TOGGLE_TOC, SET_EDITOR_MODE, SET_TAB_ERROR + nowe akcje plikowe).

## Wave 3 — weryfikacja + merge

### T11 — Runtime QA + ARCHITECTURE + full test + merge · 3 pkt · High
Odpal `mdpad.internal`. Ręcznie: Open File (realny plik), Save/Save As (sprawdź
że plik ląduje na dysku), Open Folder, Export submenu, Undo/Redo/Cut/Copy/Paste
w Code i Visual (⚠️ z audytu), Replace. **Zaktualizuj `.arch/ARCHITECTURE.md`**:
warstwa `fsAdapter`, komenda Rust `write_file`, `fileHandles` w stanie, submenu
w MenuBar. Pełny `pnpm test` na zebranej gałęzi PRZED merge. Merge → dev.

## Podział na równoległych agentów (worktree)

Żeby uniknąć konfliktów na `MenuBar.tsx`/`App.tsx` (centralne pliki), 3 spójne
domeny odpalane równolegle, potem testy, potem QA:

- **Agent F — File domain** (`E011-files`): T00, T01, T02a, T03, T04, T08.
  Włada menu **File** w MenuBar + file-handlery w App + fsAdapter + FileTree.
- **Agent R — Rust backend** (`E011-rust`): T02b. Izolowany (`src-tauri/`,
  `src/data/tauri-api.ts`). Zero konfliktu.
- **Agent E — Edit/View/Search** (`E011-editor`): T05, T06, T07. Menu **Edit/View**
  w MenuBar + SearchBar + EditorRef/CodeEditor/VisualEditor + search/zoom handlery App.

Po zmerdowaniu F+R+E → **Agent T** (`E011-tests`): T09, T10. Na końcu T11 (główny
loop): QA runtime + ARCHITECTURE + pełny test + merge do dev.

## Suma punktów: 53

| Wave | Taski | Pkt |
|---|---|---|
| 0 — File I/O | T00, T01, T02a, T02b, T03 | 24 |
| 1 — naprawy | T04–T08 | 16 |
| 2 — testy | T09–T10 | 10 |
| 3 — QA/merge | T11 | 3 |

## Decyzje (przyjęte domyślnie — user away 2026-08-17, do potwierdzenia)
- **Menu File = wariant 1**: Save As zostaje, Export ▸ = PDF + HTML, bez „Export
  as MD" (Save As już pobiera kopię `.md`). Jeśli zmienisz → korekta T04.
- **Open Folder = teraz** (T03, 8 pkt, web). Najdroższy task; jeśli chcesz
  lżejszy epic, wytnij T03 → 45 pkt (Tauri i tak ma folder przez `list_files`).
