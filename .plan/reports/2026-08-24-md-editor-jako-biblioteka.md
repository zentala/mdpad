# mdpad jako biblioteka edytora markdown dla vitals.internal

**Data:** 2026-08-24 · **Pytanie od:** Paweł · **Repo źródłowe:** mdpad @ `dev` (9abb200)

## TLDR

WYSIWYG z przełącznikiem na źródło z kolorowaniem składni **już istnieje i działa** —
sprawdziłem na żywo na mdpad.labs.zentala.agency: napisałem tekst w trybie Visual,
przełączyłem na Code, zmiana jest w źródle. Nie ma czego "rozwijać", jest co **wyjąć**.
Da się wydzielić `@zentala/md-editor` (~5 pkt) — dwa komponenty są już czyste, bez
zależności od stanu appki. Ale zanim to zrobimy: **vitals nie ma dziś czego edytować
markdownem**. Docsy są wkompilowane w bundle (`import.meta.glob` build-time), notatki to
zwykły `input` na wiersz w SQLite, a `data/health-src/*.md` to wsad do importera.
Decyzja, której potrzebuję, to nie "który edytor", tylko **co konkretnie ma być
edytowalne w vitals**.

---

## 1. Kontekst — co to jest mdpad, jak działa dziś

mdpad (dawniej zntl-md) to viewer + edytor markdown: React 19 + Vite w `prototype/`,
opakowany w Tauri (`src-tauri/`) na desktop. Publiczny demo-build stoi na
mdpad.labs.zentala.agency (Cloudflare Pages). Lokalnie ma pm3.yaml na `mdpad.internal`,
ale w daemonie PM3 go dziś nie ma, a wpisany port 5173 zajmuje meblarz — to już wisi
w `.plan/BACKLOG.md`.

Najnowsza praca jest na branchu **`dev`** (32 commity przed `main`; `main` ma tylko
jedną rzecz, której `dev` nie ma — odtrackowanie `.plan/`). Pracowałem na `dev`.

Architektura edytora to [ADR-008](../../.arch/ADR/008-editor-engine-codemirror-milkdown.md):
**dwa silniki, jeden na tryb**, interfejsem wymiany jest zwykły string markdown.

| Tryb | Silnik | Plik |
|---|---|---|
| Visual (WYSIWYG) | Milkdown (ProseMirror + remark) | `prototype/src/components/markdown/VisualEditor.tsx` (236 linii) |
| Code (źródło) | CodeMirror 6 + `@codemirror/lang-markdown` | `prototype/src/components/markdown/CodeEditor.tsx` (219 linii) |
| Preview (read-only) | react-markdown + remark/rehype | `prototype/src/components/markdown/MarkdownPreview.tsx` (262 linie) |

Przełącznik: `prototype/src/components/layout/ModeSwitcher.tsx` (48 linii).

## 2. Weryfikacja — co realnie zobaczyłem

Na żywo w Chrome, na mdpad.labs.zentala.agency:

1. Otwarty README.md w trybie **Visual** — renderowany dokument, kursor w tekście,
   pasek narzędzi (B/I/S, H1-H3, listy, cytat, link, obraz, tabela, szukaj).
2. Dopisałem `TEST-WYSIWYG` w nagłówku "What works" — wpisało się jak w edytorze tekstu.
3. Kliknąłem **Code** — CodeMirror z numerami linii, kolorowaniem składni, foldowaniem
   nagłówków; w linii 20 stoi `### What works TEST-WYSIWYG`. Tab dostał kropkę "dirty".

Czyli round-trip Visual → markdown → Code działa. **To dokładnie to, o co pytałeś.**

Czego NIE sprawdziłem: zapisu na dysk (demo tego nie ma — jest `fsAdapter`, ale w wersji
webowej przez File System Access API klienta, nie przez serwer).

## 3. Co się da wyjąć jako bibliotekę

Sprawdziłem importy. Podział jest szczęśliwy:

**Czyste, gotowe do wyjęcia (props in / props out):**

- `VisualEditor.tsx` — zależy od: `@milkdown/*`, `@/types` (`EditorRef`, `EditorCommand`),
  `@/utils/clipboard`, własny CSS module. Interfejs: `value`, `onChange(md)`, `ref`.
- `CodeEditor.tsx` — zależy od: `@codemirror/*`, tych samych dwóch lokalnych rzeczy.
  Ten sam interfejs.
- `ModeSwitcher.tsx`, `src/utils/clipboard.ts`, `src/types/`.
- 6 własnych pluginów remark (`src/plugins/`): wikilinks, mark, sup/sub, insert,
  spoiler, multiline blockquote.

**Brudne — wymaga rozprucia przed wyjęciem:**

- `MarkdownPreview.tsx` importuje `useAppContext` i `useSettingsContext` z providerów
  appki. Renderer jest przyspawany do stanu mdpada. Trzeba przepchnąć te ustawienia
  propsami, zanim pojedzie do paczki (~3 pkt).

**Kształt paczki, który proponuję:**

```
@zentala/md-editor
  <MarkdownEditor value onChange mode onModeChange />   # Visual|Code + przełącznik
  <MarkdownView value />                                # renderer (po rozpruciu)
  plugins/                                              # remark: wikilinks, mark, ...
```

Wydanie: Verdaccio na `npm.internal` (rejestr `@zentala/*`), skill `internal-publish-npm`.
mdpad zostaje pierwszym konsumentem własnej paczki — inaczej biblioteka umrze z rozjazdu.

**Koszt:** 5 pkt (wyjęcie + publikacja), +3 pkt jeśli od razu renderer.

## 4. Czego mdpad NIE rozwiązuje

To jest sedno. mdpad edytuje **markdown w przeglądarce**; nie zapisuje go na serwer.
`fsAdapter` ([ADR-009](../../.arch/ADR/009-fs-adapter-tauri-web.md)) ma dwie gałęzie:
Tauri IPC (desktop) i File System Access API (dysk *klienta*). Żadna z nich nie jest
"PUT na serwer, zapisz plik".

Ten kawałek **już mamy gdzie indziej** — `kb.internal` (`C:/code/internal/apps/kb.internal`)
robi dokładnie to od dawna i jest to nasza faktyczna konwencja:

- `src/components/GoalMarkdownEditor.tsx` — CodeMirror + pola frontmattera, "Edit"/"Save"
- `src/pages/api/kb/goal/[id].ts` — `export const PUT: APIRoute`
- `src/lib/kb-data.ts` — `writeFileSync(path, serializeFrontmatter(fm, body))`

Ta sama koperta (`ok()`/`err()`) powtarza się w `feat.ts`, `epic.ts`, `task.ts`.
Nowy edytor markdown po HTTP powinien iść tym kształtem, nie wymyślać swojego.

Wniosek: **mdpad wnosi WYSIWYG. Warstwę zapisu wnosi wzorzec z kb.internal.**

## 5. Vitals — co tam w ogóle jest markdownem

Sprawdziłem repo (`C:/Users/zentala/code/vitals`, agent-native + React Router 8 +
drizzle/libSQL, `vitals.internal:59090`, chodzi).

| Powierzchnia | Stan dziś | Da się edytować webowo? |
|---|---|---|
| `/docs` (`app/routes/docs.($docName).tsx`) | `import.meta.glob('../../docs/*.md', eager, raw)` — markdown **wkompilowany w bundle** | Nie bez zmiany na odczyt z dysku w runtime. Dziś leży tam jeden plik: `docs/nomenclature.md` |
| `/notes` (`app/components/notes/Notes.tsx`) | jednolinijkowy `<input>`, zapis do tabeli events jako `title` | Tak, ale to nie są pliki — to rekordy w SQLite. Markdown nawet się nie renderuje |
| `data/health-src/*.md` (24 pliki suplementów + SUPPLEMENTS.md) | wsad do `scripts/import-supplements.mjs` → tabele | Tak i to jest najsensowniejszy kandydat na pliki, ale edycja wymaga re-importu |
| Knowledge / conditions / packet | pola tekstowe w bazie, renderowane `react-markdown` | Tak — i to jest miejsce na WYSIWYG bez ryzyka diffów |

`DocMarkdown.tsx` (90 linii, react-markdown + remark-gfm + highlight.js) to cały dzisiejszy
renderer markdown w vitals — read-only.

## 6. Ryzyko, które trzeba sprawdzić przed decyzją

**Milkdown przepisuje cały dokument przy zapisie.** Serializacja idzie przez
remark-stringify, który normalizuje formatowanie do swoich domyślnych (w podglądzie
Code po edycji widziałem listy jako `* ` z pustą linią między pozycjami, gdy repo pisze
`- ` bez pustych linii). Dla rekordu w bazie to nieistotne. Dla **pliku pod gitem** to
oznacza, że jedno kliknięcie w Visual robi diff na cały plik.

Nie porównałem tego 1:1 (demo chodzi na mockowym README, nie na tym z repo), więc
traktuję to jako **ryzyko do potwierdzenia**, nie fakt. Sprawdzenie: round-trip
`readFile → Milkdown → getMarkdown → diff` na trzech prawdziwych plikach. 1 pkt.

Jeśli się potwierdzi, są trzy wyjścia: konfiguracja remark-stringify pod nasz styl,
Visual tylko dla treści z bazy (bez diffów), albo Visual jako tryb opt-in z ostrzeżeniem.

## 7. Rekomendacja

1. **Nie budować nowego edytora.** Odpowiedź na "czy ma to sens" brzmi: tak, i to już
   stoi — WYSIWYG + toggle na źródło z kolorowaniem to gotowa funkcja mdpada.
2. **Najpierw wybrać cel edycji w vitals** (sekcja 5). Bez tego paczka nie ma konsumenta.
3. **Potem** wyjąć `@zentala/md-editor` z mdpada (5 pkt) i wpiąć w vitals warstwą zapisu
   w kształcie z kb.internal (PUT + write, ~3 pkt).
4. Test round-tripu (1 pkt) przed wpuszczeniem Visual na pliki pod gitem.

## GAPS — czego nie sprawdziłem

- Czy `@internal/ui` (nasz design system) ma już cokolwiek edytorowego — nie sprawdzałem.
- Czy `cloudflare/hub/admin` (używa `@milkdown/*`) zapisuje markdown na serwer — recon
  to znalazł, ale nie prześledził.
- `C:/Users/zentala/code/zntl-md/prototype/` jest **bajt w bajt identyczny** z
  `mdpad/prototype/` — nie ustaliłem, czy to martwa kopia po zmianie nazwy, czy żywe repo.
  Osobny wpis w BACKLOG.
- Nie odpaliłem mdpada lokalnie (kolizja portu 5173 z meblarzem) — weryfikacja szła
  na publicznym demo.
- Nie sprawdziłem, czy vitals (agent-native) w ogóle wypuszcza własne API-route'y na
  zapis do dysku, czy wszystko musi iść przez `actions/`.
