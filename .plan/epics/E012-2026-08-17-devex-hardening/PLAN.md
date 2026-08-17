# E012 — DevEx Hardening

## TLDR

Domykamy tarcia Developer Experience wykryte w [DevEx Review](../../reports/2026-08-17-devex-review.md).
Fundament (CI, husky, codegen) jest dobry — ten epic naprawia **rozjazd docs ze stanem repo**,
**higienę repo** i **braki w automatyzacji/coverage**. Większość zadań tania (≤2 pkt).
31 pkt w 3 falach; Wave 1 (docs+higiena) do zrobienia od ręki.

## What

Uporządkować DevEx mdpad: usunąć sprzeczności w dokumentacji uruchamiania, wyczyścić
trackowane śmieci i osierocone foldery, dodać brakujące skróty deweloperskie
(setup, deploy, tauri dev, .nvmrc) i wprowadzić próg coverage z testami rdzenia edytora.

## Why

Nowy developer (i agent) dostaje sprzeczne instrukcje: README każe otwierać `localhost:5173`,
CONTRIBUTING podaje port 3456, CLAUDE.md zakazuje ręcznego `pnpm dev` i każe `mdpad.internal`.
Docs twierdzą „brak backendu Tauri", gdy backend jest realny i wołany z frontendu. W repo leżą
trackowane pliki-śmieci Vima i martwe submoduły. Brak progu coverage mimo reguły projektu.
Każde z osobna drobne; razem obniżają zaufanie do dokumentacji i spowalniają wejście.

## Scope

- **W zakresie**: dokumentacja dev-setup, higiena repo, skrypty package.json, `.nvmrc`,
  submoduły examples, config coverage + testy rdzenia edytora/preview/Tauri/pluginów.
- **Poza zakresem**: nowe funkcje produktu, refaktor architektury, deploy CF Pages jako
  GitHub Action (tylko skrypt lokalny), audyt bezpieczeństwa/perf.

## Constraints

- Pliki ≤ 250 linii, funkcje ≤ 50 linii.
- Zmiany dokumentacji nie mogą wprowadzić nowej sprzeczności — jedno źródło prawdy o porcie/domenie.
- Nie łamać CI (frozen-lockfile) — zmiany w `package.json` z aktualizacją lockfile.

## Acceptance criteria

1. Wszystkie docs (README, CONTRIBUTING, CLAUDE.md) zgadzają się co do portu (5173) i sposobu
   startu; sprzeczność localhost/mdpad.internal rozstrzygnięta jednym zdaniem „dla ludzi X, dla PM3 Y".
2. README/CLAUDE.md odzwierciedlają realny stan backendu Tauri (zintegrowany, nie „brak").
3. `git ls-files` nie zawiera plików `*~`/`*.un~`; `.gitignore` je wyklucza.
4. `.planning/` skonsolidowane lub usunięte; `TASKS.NEXT.md` przeniesiony do `.plan/BACKLOG.md`.
5. Submoduły examples albo udokumentowane, albo `deinit` (decyzja w ORCHESTRATOR T07).
6. `pnpm setup`, `pnpm deploy`, skrypt/dok `tauri dev`, `.nvmrc` (node 22) dostępne.
7. `pnpm test:coverage` działa, próg ustawiony, gate w CI; rdzeń edytora ma testy smoke.

## Testing strategy

- Zmiany docs/higieny: weryfikacja `git ls-files` + ręczne przeczytanie, że instrukcje są spójne.
- Skrypty: uruchomić `pnpm setup`, `pnpm deploy --dry`/lokalny build, `tauri dev` — potwierdzić że startują.
- Coverage: `pnpm test:coverage` przechodzi próg; nowe testy smoke dla `CodeEditor`/`VisualEditor`/
  `MarkdownPreview` renderują się bez błędu i reagują na podstawową interakcję.

## Zadania

Pełna rozpiska, fale i zależności → [ORCHESTRATOR.md](ORCHESTRATOR.md).
Deck dla decydenta → [PRES.md](PRES.md).

## Powiązania

- Źródło: [DevEx Review 2026-08-17](../../reports/2026-08-17-devex-review.md)
- Backlog: [.plan/BACKLOG.md](../../BACKLOG.md)
