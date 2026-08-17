# E011 — Menu & Actions Hardening

## TLDR

Audyt ([raport](../../reports/2026-08-17-menu-actions-audit.md)) pokazał, że na
33 pozycje menu/akcji 8 to martwe kliknięcia, 5 podejrzanych (`execCommand`),
Replace jest w całości niefunkcjonalne, a interaktywna warstwa (MenuBar,
Toolbar, skróty, SearchBar) ma **zero testów**. Ten epic naprawia martwe/psujące
się akcje i domyka regresję testami, żeby żadna pozycja menu nie mogła po cichu
przestać działać.

## Cel

1. Każda pozycja menu albo działa, albo jest jawnie oznaczona jako wymagająca
   backendu (Tauri) i wyłączona/ukryta — żadnych cichych atrap.
2. Replace faktycznie zastępuje tekst.
3. Undo/Redo/Cut/Copy/Paste trafiają do właściwego edytora (nie `document.execCommand`).
4. Regresyjne testy na całą warstwę akcji: MenuBar, Toolbar, skróty, SearchBar.

## Zakres

W zakresie: MenuBar, Toolbar, skróty w `App.tsx`, SearchBar, kontrakt
`EditorRef`. Poza zakresem: menu kontekstowe drzewa plików, TabBar
context-menu, realny filesystem (to E008/Tauri).

## Zasada dla pozycji plikowych — przeglądarka to potrafi

Korekta pierwotnego audytu: Open File / Open Folder / Save As **da się** zrobić
w przeglądarce przez **File System Access API** (`showOpenFilePicker`,
`showDirectoryPicker`, `showSaveFilePicker` — Chromium), z fallbackiem
`<input type="file">` + `<a download>` (Firefox/Safari). Nie czekamy na Tauri.

**Warstwa abstrakcji (`fsAdapter`):** jeden interfejs `openFile / openFolder /
saveFile / saveFileAs`, który **wpina się w istniejący wzorzec `IS_TAURI`**
(`src/data/tauri-api.ts` — `isTauri()`, `listFiles`, `readFile`, `onFsEvent`).
Gałąź Tauri używa IPC, gałąź web używa File System Access API. UI woła adapter,
nie zna gałęzi.

**Stan faktyczny Tauri (ground-truth 2026-08-17):** backend ma `list_files`,
`read_file`, `watch_directory`, ale **NIE ma `write_file`** — zapis nie działa
na żadnej ścieżce. Open Folder w Tauri już działa (`list_files`), więc web
tylko dokłada `showDirectoryPicker()`. Save wymaga: nowej komendy Rust
`write_file` (ścieżka Tauri) + `saveFile`/`saveFileAs` web (FSA).

**Model menu File (rekomendacja):**
- **Save** — zapis źródła `.md`. Jeśli plik ma uchwyt (otwarty przez FSA) →
  zapis w miejscu; jeśli nie (mock/nowy) → zachowuje się jak Save As.
- **Save As…** — `showSaveFilePicker()`, wybór nowej lokalizacji. Zostaje —
  to inna operacja niż Save (Save = znany uchwyt, Save As = nowy).
- **Export ▸** — submenu formatów pochodnych: **PDF**, **HTML** (dziś płaskie
  pozycje). Rozróżnienie czyste: *Save/Save As = źródło `.md`*, *Export =
  render do innego formatu*. „Export as MD" świadomie pomijamy (Save As już
  pobiera kopię `.md`) — do potwierdzenia z użytkownikiem.
- **Quit** — jedyna pozycja realnie niemożliwa w karcie → **ukryć** w buildzie
  web (`if (!isTauri)`), wróci w E008.

## Acceptance criteria

- [ ] Żadna pozycja menu z podpiętą akcją nie jest „martwym kliknięciem"
      (Zoom In/Out, Find in Folder podpięte do tych samych dispatchy co skróty).
- [ ] Pozycje wymagające backendu są `disabled` z czytelnym tooltipem.
- [ ] Replace i Replace All działają w trybie edycji (Code + Visual).
- [ ] Undo/Redo/Cut/Copy/Paste z menu Edit działają na aktywnym edytorze.
- [ ] Testy: MenuBar (każda podpięta akcja woła właściwy handler), Toolbar
      (każda komenda woła `execCommand` z właściwym argumentem), skróty
      (keydown → właściwy dispatch), SearchBar (find + replace).
- [ ] Nietestowane gałęzie reducera dopięte testami.
- [ ] `pnpm test` + `pnpm typecheck` + `pnpm lint` zielone na zebranej gałęzi.

## Test strategy

- **Unit/integration (Vitest + RTL):** render MenuBar z mockowanymi
  handlerami, klik każdej pozycji, asercja że właściwy `onX` został wywołany.
  Toolbar analogicznie z mock `editorRef`. Skróty: `fireEvent.keyDown` na
  `document`, asercja dispatch. SearchBar: wpisz frazę, replace, sprawdź wynik.
- **Runtime (ręcznie, raz):** oba silniki edytora — Undo/Redo/Cut/Copy/Paste i
  komendy Toolbar, bo `EditorRef.execCommand` ma dwie implementacje. Zgodnie z
  regułą „zobacz zanim ogłosisz" — statyczny audyt nie wystarcza dla ⚠️.

## Architecture impact

Nietrywialna — nowy komponent + nowy przepływ + nowa integracja:
- **Nowy komponent:** `src/data/fsAdapter.ts` (warstwa plików Tauri/web).
- **Nowy przepływ danych:** uchwyty plików (`fileHandles`) w `AppState`, żeby
  Save zapisywał w miejscu; submenu w `MenuBar` (`MenuItem.submenu`).
- **Nowa komenda backendu:** Rust `write_file` w `src-tauri/src/lib.rs`.
- **ADR:** [`009-fs-adapter-tauri-web.md`](../../../.arch/ADR/009-fs-adapter-tauri-web.md) (accepted).
- **`.arch/ARCHITECTURE.md`:** wymaga aktualizacji (nowa warstwa `fsAdapter`,
  komenda `write_file`, `fileHandles` w stanie) — sub-task w T11.

## Powiązania

- Raport źródłowy: [`.plan/reports/2026-08-17-menu-actions-audit.md`](../../reports/2026-08-17-menu-actions-audit.md)
- Wcześniejszy epic edytora: E010 (functional editor) — ten epic domyka jego luki.
- Pozycje 🔒 wracają jako funkcjonalne w E008 (Tauri desktop).
