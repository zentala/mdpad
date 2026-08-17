# E012 — ORCHESTRATOR

## TLDR

11 zadań w 3 falach, 31 pkt. Wave 1 (docs+higiena) niezależne, tanie, do zrobienia od ręki.
Wave 2 (onboarding+skrypty) niezależne między sobą. Wave 3 (coverage+testy) — T10 przed T11.

## Wave 1 — Docs + higiena (9 pkt) · *Importance: High/Medium*

TLDR: usuń sprzeczności w instrukcjach i wyczyść śmieci. Zadania niezależne, można równolegle.

- [x] **T01** — Napraw port w CONTRIBUTING.md (3456 → 5173) i zsynchronizuj sekcję dev-setup z README. — `1` · High · `CONTRIBUTING.md:13`
- [x] **T02** — Rozstrzygnij localhost vs mdpad.internal: dodaj do README/CONTRIBUTING jedno zdanie „ręczny dev: localhost:5173; przez PM3: mdpad.internal", spójne z CLAUDE.md. — `2` · High
- [x] **T03** — Zaktualizuj README + CLAUDE.md: backend Tauri jest zintegrowany (5 komend, wołany pod `IS_TAURI`), nie „brak backendu". Odśwież „Current State" i usuń nieaktualne „Formerly zntl-md" z nagłówka stanu. — `2` · High · `README.md:35`, `CLAUDE.md`
- [x] **T04** — Usuń trackowane śmieci `.TASKS.NEXT.md.un~`, `TASKS.NEXT.md~`; dodaj `*~` i `*.un~` do `.gitignore`. — `1` · Medium
- [x] **T05** — Przenieś treść `TASKS.NEXT.md` do `.plan/BACKLOG.md` (link do zentala.agency + autor w About/SEO); usuń plik z roota. — `1` · Medium
- [x] **T06** — Skonsoliduj `.planning/ui-reviews/` do `.plan/UI-REVIEW.md` (lub usuń, jeśli pusty) — zlikwiduj rozjazd `.planning/` vs `.plan/`. — `2` · Medium

## Wave 2 — Onboarding + skrypty (11 pkt) · *Importance: Medium-High*

TLDR: dodaj brakujące skróty i rozstrzygnij los submodułów. Zadania niezależne.

- [x] **T07** — Submoduły `examples/*`: DECYZJA — `git submodule deinit --all` (build je wyklucza, są balastem) LUB udokumentuj `git submodule update --init` w CONTRIBUTING. Rekomendacja: deinit + notka „reference-only, opcjonalne". — `3` · Medium · `.gitmodules`
- [x] **T08** — Dodaj root skrypt `setup` (`pnpm install && pnpm -C prototype install`), usuń nieużywany `shiki` z root `package.json`, udokumentuj dwuetapowy install w CONTRIBUTING. — `2` · Medium
- [x] **T09** — Dodaj `.nvmrc` (node 22, zgodnie z CI) w roocie i/lub prototype. — `1` · Medium
- [x] **T10** — Dodaj `prototype/package.json` skrypt `deploy` opakowujący 4-liniową procedurę wrangler (build-content → tsc → vite build → 404 copy → wrangler pages deploy); zaktualizuj CLAUDE.md by wskazywał `pnpm deploy`. — `2` · Medium-High · `CLAUDE.md:84-95`
- [x] **T11** — Dodaj skrypt/dokumentację `tauri dev` (`@tauri-apps/cli` + skrypt w prototype lub root) i wpis w CONTRIBUTING „jak uruchomić wersję desktopową". — `3` · Medium

## Wave 3 — Coverage + testy rdzenia (11 pkt) · *Importance: High*

> **ODŁOŻONE (2026-08-17)** — decyzja Pawła: testami zajmie się osobny skrypt/agent.
> Pełny spis luk (config coverage + nietestowany rdzeń: CodeEditor, VisualEditor,
> MarkdownPreview, integracja Tauri, remark-pluginy) przeniesiony do
> [`.plan/BACKLOG.md` → sekcja „Testy — luki pokrycia"](../../BACKLOG.md). Następny
> agent bierze zadanie stamtąd.

TLDR: T12 (config coverage) przed T13 (testy). T13 duże — rozbić na podfale ≤8 agentów.

- [ ] **T12** — Dodaj `@vitest/coverage-v8`, sekcję `coverage` w `vitest.config.ts` z progiem (start realistyczny, np. lines 50% → docelowo 70/80 z reguły), skrypt `test:coverage`, gate w CI (`.github/workflows/ci.yml`). — `3` · High
- [ ] **T13** — Testy smoke dla rdzenia bez pokrycia: `CodeEditor`, `VisualEditor`, `MarkdownPreview`, integracja Tauri (`useTauriFiles`/`tauri-api` z mockiem `invoke`), remark-pluginy (`remarkWikilinks`, `remarkMark`, `remarkSupSub`, `remarkSpoiler`, `remarkInsert`). Nazwa test-pliku = basename źródła. — `8` · High *(rozbić na podzadania)*

## Zależności i fale

- Wave 1: wszystkie niezależne → równolegle (worktree per task lub batch, ≤8 agentów).
- Wave 2: wszystkie niezależne → równolegle.
- Wave 3: **T12 → T13** (config przed testami korzystającymi z progu). T13 dzielić na ≤8 równoległych.

## Sumy

| Wave | Pkt |
|---|---|
| 1 | 9 |
| 2 | 11 |
| 3 | 11 |
| **Razem** | **31** |
