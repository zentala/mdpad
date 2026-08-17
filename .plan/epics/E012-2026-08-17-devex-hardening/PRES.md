# E012 — DevEx Hardening — deck decyzyjny

## TLDR

Zrobiłem przegląd Developer Experience mdpad. Narzędzia są dobre (pełne CI, husky, codegen),
ale **dokumentacja rozjechała się ze stanem repo** i zebrało się trochę śmieci. 11 zadań, 31 pkt,
w większości drobne. Potrzebna decyzja: (a) czy robimy całość, czy tylko Wave 1; (b) co z martwymi
submodułami `examples/*` (usunąć czy udokumentować).

---

## Problem w jednym obrazku

Nowy developer otwiera projekt i dostaje **trzy różne instrukcje uruchomienia**:

- README: `pnpm dev` → otwórz `localhost:5173`
- CONTRIBUTING: `pnpm dev` → otwórz `localhost:3456` (zły port)
- CLAUDE.md: „NIGDY nie uruchamiaj `pnpm dev` ręcznie, użyj `mdpad.internal` przez PM3"

Do tego README twierdzi „brak backendu Tauri", a backend jest realny i wołany z frontendu.
W repo leżą trackowane pliki-śmieci Vima (`TASKS.NEXT.md~`, `.TASKS.NEXT.md.un~`).

---

## Znaleziska wg wagi

### 1. Docs kłamią o stanie repo — *High*

- **Kontekst**: dokumentacja to pierwszy kontakt z projektem; agent czyta CLAUDE.md, człowiek README.
- **Problem**: port 3456 vs 5173; localhost vs mdpad.internal; „brak backendu Tauri" gdy jest zintegrowany; CLAUDE.md z datą 2026-03-31 sprzed edytora.
- **Rozwiązanie**: jedno źródło prawdy o porcie/starcie; opis realnego stanu backendu.
- **Po zmianie**: każdy dokument mówi to samo; „ręczny dev = localhost, przez PM3 = mdpad.internal".
- **Zyski/Ryzyka**: +zaufanie do docs, zero ryzyka (edycja tekstu). Koszt: ~6 pkt.

### 2. Higiena repo — *Medium*

- **Kontekst**: `git ls-files` pokazuje pliki, które nigdy nie powinny być w repo.
- **Problem**: trackowane swap/backup Vima, luźny `TASKS.NEXT.md` z polskimi notatkami, osierocony `.planning/` obok `.plan/`.
- **Rozwiązanie**: usunąć śmieci, dodać `*~`/`*.un~` do gitignore, przenieść notatki do BACKLOG, skonsolidować `.planning/`.
- **Ryzyka**: minimalne — usuwamy tylko potwierdzone śmieci. Koszt: ~5 pkt.

### 3. Brakujące skróty deweloperskie — *Medium-High*

- **Kontekst**: powtarzalne czynności robione ręcznie.
- **Problem**: deploy = 4 komendy wklejane za każdym razem; dwa osobne `pnpm install`; brak `.nvmrc`; brak `tauri dev` mimo zintegrowanego backendu.
- **Rozwiązanie**: `pnpm setup`, `pnpm deploy`, `.nvmrc`, skrypt+dok `tauri dev`.
- **Ryzyka**: żadne istotne. Koszt: ~9 pkt (w tym decyzja o submodułach).

### 4. Brak progu coverage + rdzeń bez testów — *High*

- **Kontekst**: reguła projektu mówi o progu 80/70%, CI nic nie egzekwuje.
- **Problem**: brak configu coverage; edytory (CodeMirror/Milkdown), preview, integracja Tauri, większość pluginów remark — bez testów.
- **Rozwiązanie**: dodać coverage-v8 + próg + gate w CI; testy smoke rdzenia.
- **Ryzyka**: testy edytorów bywają kruche (ProseMirror/CodeMirror w jsdom) — zacząć od smoke. Koszt: ~11 pkt.

---

## Plan fal i punkty

| Wave | Zakres | Pkt | Importance |
|---|---|---|---|
| 1 | Docs + higiena | 9 | High/Medium |
| 2 | Onboarding + skrypty | 11 | Medium-High |
| 3 | Coverage + testy rdzenia | 11 | High |
| **Razem** | | **31** | |

---

## Decyzje, których potrzebuję

1. **Zakres**: cały epic (31 pkt) czy tylko Wave 1 od ręki (9 pkt, same docs+higiena)?
2. **Submoduły `examples/*`** (T07): usunąć (`deinit` — build je i tak wyklucza) czy zostawić jako reference i tylko udokumentować? Rekomendacja: usunąć.
3. **Coverage próg** (T12): start realistyczny (np. 50% lines, rośnie z czasem) czy od razu 70/80% z reguły? Rekomendacja: start 50%, podnosić.

Reszta to low-hanging fruit — po akceptacji mogę wdrożyć Wave 1 w tej samej sesji przez taniego subagenta.
