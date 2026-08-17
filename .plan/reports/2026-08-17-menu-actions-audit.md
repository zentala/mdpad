# Audyt: menu, dropdowny i akcje — czy działają i czy mają testy

## TLDR

Przejrzałem statycznie wszystkie pozycje menu (`MenuBar`), pasek narzędzi
(`Toolbar`), skróty klawiszowe (`App.tsx`) i pasek wyszukiwania (`SearchBar`)
pod kątem: (1) czy akcja jest podpięta, (2) czy działa, (3) czy ma sens jej
test, (4) czy testy są pełne.

Wynik: **na 33 sprawdzone pozycje 18 działa, 8 to martwe kliknięcia (brak
akcji), 5 jest podejrzanych (`document.execCommand` — nie trafia do edytora),
a Replace jest w całości niefunkcjonalne.** Pokrycie testami interaktywnej
warstwy, o którą pytasz, wynosi **zero** — nie istnieje ani jeden test dla
`MenuBar`, `Toolbar`, skrótów klawiszowych ani `SearchBar`. Istniejące testy
(reducer, kilka liści UI) są sensowne, ale płytkie i omijają całą powierzchnię
akcji.

To audyt statyczny (czytanie kodu). Pozycji oznaczonych „podejrzane" nie
odpalałem w przeglądarce — wymagają weryfikacji runtime.

---

## 1. MenuBar — pozycje dropdownów

Legenda: ✅ działa · ❌ martwe kliknięcie (brak akcji) · ⚠️ podejrzane (do
weryfikacji runtime) · 🔒 wymaga backendu (Tauri / niemożliwe w przeglądarce)

### File
| Pozycja | Podpięcie | Status | Uwaga |
|---|---|---|---|
| New File | `onNewFile` → `NEW_FILE` | ✅ | działa, jest też skrót Ctrl+N |
| Open File… | — | ❌🔒 | brak `action`, brak skrótu; potrzebny FS/Tauri |
| Open Folder… | — | ❌🔒 | jw. |
| Save | `onSave` → `SAVE_FILE` | ✅ | działa (stan w pamięci), Ctrl+S |
| Save As… | — | ❌🔒 | brak akcji |
| Close Tab | `onCloseTab` | ✅ | Ctrl+W |
| Export as PDF | `onExportPdf` | ✅ | otwiera dialog druku |
| Export as HTML | `onExportHtml` | ✅ | zapis standalone HTML |
| Quit | — | ❌🔒 | brak akcji; w przeglądarce nie do zrobienia |

### Edit
| Pozycja | Podpięcie | Status | Uwaga |
|---|---|---|---|
| Undo | `document.execCommand('undo')` | ⚠️ | nie trafia do historii CodeMirror/Milkdown |
| Redo | `document.execCommand('redo')` | ⚠️ | jw. |
| Cut | `document.execCommand('cut')` | ⚠️ | tylko przy natywnym zaznaczeniu/focusie |
| Copy | `document.execCommand('copy')` | ⚠️ | jw. |
| Paste | `document.execCommand('paste')` | ⚠️ | przeglądarki blokują `paste` — praktycznie martwe |
| Find | `onFind` → modal search | ✅ | DOM-search w preview/write |
| Find & Replace | `onFindReplace` → **ten sam** modal co Find | ❌ | Replace nie działa (patrz §4) |
| Find in Folder | pusta `action: () => {}` | ❌ | kliknięcie nic nie robi; działa tylko skrót Ctrl+Shift+F |

### View
| Pozycja | Podpięcie | Status | Uwaga |
|---|---|---|---|
| Toggle Sidebar | `onToggleSidebar` | ✅ | |
| Toggle Outline | `onToggleToc` | ✅ | |
| Zoom In | — | ❌ | brak akcji; działa tylko skrót Ctrl+= |
| Zoom Out | — | ❌ | brak akcji; działa tylko skrót Ctrl+- |
| Theme: Auto/Dark/Light/Sepia | `onSetTheme(...)` | ✅ | 4 pozycje, z checkmarkiem |
| Zen Mode | `onToggleZenMode` | ✅ | F11 |

### Help
| Pozycja | Podpięcie | Status |
|---|---|---|
| About mdpad | `onOpenAbout` | ✅ |
| Keyboard Shortcuts | `onOpenShortcuts` | ✅ |
| Markdown Reference | `onOpenMarkdownRef` → `REFERENCE.md` | ✅ |

**Bilans MenuBar:** 18 ✅ · 8 ❌ · 5 ⚠️.

---

## 2. Toolbar — przyciski formatowania

Wszystkie przyciski wołają `editorRef.current.execCommand(cmd)` (własny
kontrakt `EditorRef`, nie `document.execCommand`) lub otwierają popover
(link/image/table → `insertAtCursor`). To jest zrobione dobrze i spójnie
(E010). Przyciski są `disabled` w trybie preview — poprawnie.

Statyczny werdykt: **prawdopodobnie działa**, ale **brak jakiegokolwiek testu**
— żaden z ~18 przycisków (bold, italic, strikethrough, code, H1–H3, listy,
quote, link, image, table, codeBlock) nie ma asercji, że wywołuje właściwą
komendę na edytorze. Do weryfikacji runtime dla obu silników (CodeMirror i
Milkdown), bo `EditorRef.execCommand` ma dwie różne implementacje.

---

## 3. Skróty klawiszowe (`App.tsx`)

Duży `keydown`-handler obsługuje: F11, Escape, Ctrl+W/P/N/,/F/S/E/H/=/-,
Ctrl+Shift+F/L/T/R/E/P oraz Ctrl+B/I (formatowanie). Logika wygląda spójnie,
ale ma dwie rozjazdy z menu:

- **Zoom** i **Find in Folder** działają TYLKO ze skrótu — z menu są martwe
  (patrz §1). Ta sama akcja podpięta w jednym miejscu, w drugim nie.
- **Ctrl+H** (Replace) i **Find & Replace** z menu otwierają zwykły
  `search` — bez trybu replace.

**Brak testów skrótów w całości** — 0 asercji, że np. Ctrl+S dispatchuje
`SAVE_FILE` albo Ctrl+B woła `execCommand('bold')`.

---

## 4. SearchBar — Replace jest martwe

Najpoważniejsze pojedyncze znalezisko. W `SearchBar.tsx`:

- Przycisk „Toggle Replace" ma na sztywno atrybut **`disabled`**
  (linia ~82) — nie da się rozwinąć panelu replace w preview/write.
- Wiersz replace pokazuje się pod warunkiem `showReplace && !isPreviewLike`,
  ale toggle istnieje tylko dla `isPreviewLike` → w praktyce **nigdy się nie
  pokaże**.
- Przyciski „Replace" i „Replace All" (linie ~130, ~133) **nie mają żadnego
  `onClick`** — to czyste atrapy.
- `replaceText` jest w stanie, ale nie jest nigdzie używany.

Efekt: cała funkcja Replace (menu „Find & Replace", skrót Ctrl+H, przyciski w
pasku) jest niefunkcjonalna. Find działa, Replace nie.

---

## 5. Pokrycie testami — czy są pełne?

Istnieje 12 plików testowych:

| Plik | Co pokrywa | Sens |
|---|---|---|
| `AppStateProvider.test` | reducer: SET_THEME, SET_SIDEBAR_PANEL, INIT/UPDATE/SAVE content | ✅ sensowne, ale częściowe |
| `SettingsView.test` | ustawienia | ✅ |
| `ModeSwitcher.test` | przełącznik trybów | ✅ |
| `ActivityBar`, `ZenHoverBar`, `Logo`, `PanelHeader`, `ToggleSwitch`, `InsertTablePopover` | liście UI | ✅ płytkie |
| `useUrlSync`, `remarkMultilineBlockquote`, `exportHtml` | util/hook | ✅ |

**Czego brak (zero testów):**
- `MenuBar` — żadna pozycja menu nie ma testu.
- `Toolbar` — żaden przycisk formatowania.
- Skróty klawiszowe z `App.tsx`.
- `SearchBar` — find i replace.
- `CodeEditor` / `VisualEditor` — kontrakt `EditorRef.execCommand` (obie implementacje).
- `exportPdf`.

**Reducer — nietestowane gałęzie:** OPEN_FILE, CLOSE_TAB, CLOSE_OTHER_TABS,
CLOSE_ALL_TABS, NEW_FILE, SET_ACTIVE_TAB, TOGGLE_ZEN_MODE, SET_ZOOM,
TOGGLE_TOC, SET_EDITOR_MODE, SET_TAB_ERROR.

**Werdykt na Twoje pytanie:** testy, które są, mają sens — ale są dalekie od
pełnych. Cała warstwa, o którą pytasz (menu + akcje), jest niepokryta. Nie da
się dziś regresyjnie wyłapać, że któraś pozycja menu przestała działać.

---

## 6. GAPS — czego ten audyt nie sprawdził

- Nie odpalałem apki w przeglądarce — statusy ⚠️ (execCommand) wymagają
  weryfikacji runtime na obu silnikach edytora.
- Nie sprawdziłem, czy `REFERENCE.md` faktycznie ładuje się z „Markdown
  Reference" (założyłem, że plik istnieje w mock/generated).
- Nie audytowałem menu kontekstowego drzewa plików (Rename/Delete/New Folder)
  ani TabBar context-menu — poza zakresem pytania o menu górne i akcje.
- Toolbar popovers (link/image/table) — sprawdzone, że wołają `insertAtcursor`,
  ale nie zweryfikowałem poprawności wstawianego markdownu runtime.
