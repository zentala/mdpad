# DevEx Review — mdpad

**Data**: 2026-08-17
**Zakres**: Developer Experience — onboarding, spójność docs, higiena repo, skrypty, testy, backend Rust.
**Metoda**: przegląd configów + eksploracja subagentem, weryfikacja przez `git ls-files`.
**Epic z taskami**: [E012 — DevEx Hardening](../epics/E012-2026-08-17-devex-hardening/PLAN.md)

## TLDR

mdpad to dojrzały prototyp (React+Vite web-demo + realny, zintegrowany szkielet
backendu Tauri). Fundament DevEx jest dobry — CI pełne (typecheck/lint/format/test/build
+ Rust job), husky+commitlint, codegen wbudowany w `pnpm dev`. Problem nie leży w braku
narzędzi, lecz w **rozjeździe dokumentacji ze stanem repo** i **higienie**: sprzeczne
instrukcje uruchamiania (port 3456 vs 5173, localhost vs mdpad.internal), docs twierdzą
„brak backendu Tauri" gdy backend jest realny i wołany z frontendu, trackowane pliki-śmieci
edytora, martwe submoduły, brak progu coverage mimo reguły projektu. Wszystko to naprawialne
tanio (większość ≤2 pkt). Rekomendacja: epic E012, Wave 1 (docs+higiena, ~9 pkt) do zrobienia
od ręki, Wave 2 (skrypty+coverage, ~12 pkt), Wave 3 (testy rdzenia, 8 pkt) na później.

## Co działa dobrze (kontekst przed werdyktem)

| Obszar | Stan |
|---|---|
| CI | Pełny: typecheck, lint, format, test, build + osobny job Rust (cargo check/test/clippy) + gate Conventional Commits na tytule PR |
| Pre-commit | husky + lint-staged (eslint --fix + prettier) + commitlint + gate taskmd |
| Codegen | `build-content.ts` wbudowany w skrypt `dev` i `build` — dev nie musi o nim pamiętać |
| Onboarding (happy path) | 3 kroki: clone → `cd prototype && pnpm install` → `pnpm dev` |
| Backend Rust | Szkielet realny: 5 komend (list_files, read_file, watch/unwatch_directory, set_window_title), CLI args, window-state |

## Znaleziska (tarcia DevEx)

### A. Rozjazd dokumentacji ze stanem repo — *Importance: High*

| # | Znalezisko | Plik | Pkt |
|---|---|---|---|
| A1 | CONTRIBUTING.md podaje `http://localhost:3456` — Vite startuje na 5173, port jest błędny | `CONTRIBUTING.md:13` | 1 |
| A2 | Sprzeczne instrukcje startu: README/CONTRIBUTING każą ręcznie `cd prototype && pnpm dev` + localhost; CLAUDE.md tego **zakazuje** i każe `mdpad.internal` przez PM3 | README/CONTRIBUTING vs CLAUDE.md | 2 |
| A3 | README i CLAUDE.md twierdzą „No Tauri backend yet — mock data only", a backend jest realny i **wołany z frontendu** (`useTauriFiles.ts`, `tauri-api.ts`, `invoke()` pod `IS_TAURI`) | `README.md:35`, `CLAUDE.md` | 2 |
| A4 | CLAUDE.md „Current State (2026-03-31)" + „Formerly zntl-md" — nieaktualizowany po E010 (działający edytor) | `CLAUDE.md` | 1 |

### B. Higiena repo — *Importance: Medium*

| # | Znalezisko | Plik | Pkt |
|---|---|---|---|
| B1 | Trackowane pliki-śmieci edytora (Vim swap/backup) | `.TASKS.NEXT.md.un~`, `TASKS.NEXT.md~` (oba w `git ls-files`) | 1 |
| B2 | `TASKS.NEXT.md` — luźne polskie notatki robocze obok formalnego `.plan/BACKLOG.md` | `TASKS.NEXT.md` | 1 |
| B3 | `.planning/ui-reviews/` — osierocony folder (tylko `.gitignore` w środku), nielinkowany, duplikuje `.plan/UI-REVIEW.md` | `.planning/` | 2 |
| B4 | `*~` i `*.un~` nie są w `.gitignore` — śmieci mogą wracać | `.gitignore` | 1 |

### C. Onboarding — *Importance: Medium*

| # | Znalezisko | Plik | Pkt |
|---|---|---|---|
| C1 | 4 submoduły `examples/*` (obce repo) niedokumentowane — clone bez `--recurse-submodules` daje puste foldery; `build-content.ts` i tak je wyklucza → są martwym balastem | `.gitmodules` | 3 |
| C2 | Dwa osobne `pnpm install` (root dla hooków + prototype dla appki) nigdzie razem nieopisane; root nie jest prawdziwym workspace (brak `packages:`) | `package.json`, `prototype/pnpm-workspace.yaml` | 2 |
| C3 | `shiki` zdublowany w root i prototype `package.json` — root go nie używa | `package.json` | 1 |
| C4 | Brak `.nvmrc` mimo globalnej reguły „pnpm + .nvmrc"; CI używa node 22 | — | 1 |

### D. Skrypty deweloperskie / deploy — *Importance: Medium-High*

| # | Znalezisko | Plik | Pkt |
|---|---|---|---|
| D1 | Deploy w pełni ręczny — 4-liniowa procedura wklejana za każdym razem, brak `pnpm deploy` i brak CF Pages w Actions | `CLAUDE.md:84-95` | 2 |
| D2 | Brak jednokomandowego setupu (root+prototype install) | `package.json` | 1 |
| D3 | Brak skryptu/dokumentacji `tauri dev` mimo zintegrowanego backendu — nie da się łatwo przetestować ścieżki desktopowej | `prototype/package.json` | 3 |

### E. Testy — *Importance: High*

| # | Znalezisko | Plik | Pkt |
|---|---|---|---|
| E1 | Brak konfiguracji coverage — brak `@vitest/coverage-v8`, brak progu, brak `test:coverage`, brak gate w CI, mimo reguły projektu o progu 80/70% | `vitest.config.ts`, CI | 3 |
| E2 | Rdzeń produktu bez testów: `CodeEditor`, `VisualEditor`, `MarkdownPreview`, integracja Tauri (`useTauriFiles`, `tauri-api`), większość remark-pluginów | `prototype/src/` | 8 |

## Sumy punktów

| Wave | Zakres | Pkt |
|---|---|---|
| 1 | Docs (A) + higiena (B) | 9 |
| 2 | Onboarding (C) + skrypty (D) | 11 |
| 3 | Coverage + testy rdzenia (E) | 11 |
| **Razem** | | **31** |

## GAPS — czego ten przegląd nie dotknął

- **Nie uruchomiłem** dev servera ani `tauri dev` — stan „działa" wnioskowany z kodu/CI, nie zaobserwowany.
- Nie audytowałem realnej jakości testów (asercje vs. smoke) — tylko pokrycie plikowe.
- Nie sprawdzałem `release.yml`/`tauri-release.yml`/`Dockerfile` pod kątem poprawności działania — tylko obecność.
- Nie oceniałem wydajności builda ani rozmiaru bundla.
- Perf/bezpieczeństwo poza zakresem (to review DevEx, nie audyt bezpieczeństwa).
