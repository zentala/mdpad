# Runbook — migracja `.plan/` do prywatnego nested repo (mdpad)

## TLDR

DevEx review (E012, finding #6) zauważył, że `.plan/` jest **trackowane w publicznym
repo** `github.com/zentala/mdpad`, podczas gdy global rule mówi, że shippable/public
repos mają `.plan/` gitignoreować i trzymać jako osobny prywatny nested repo. Ten
dokument to **runbook** — nic nie wykonuje. Decyzja go/no-go należy do Pawła, bo
doszły trzy niuanse (niżej), których standardowy wzorzec nie pokrywa.

**Rekomendacja:** najpierw rozstrzygnąć intencję (build-in-public vs prywatne), bo od
tego zależy, czy migracja w ogóle ma sens. Nie wykonywać, dopóki druga sesja pracująca
na tej gałęzi nie skończy.

## Kontekst — stan dziś

- `.plan/` jest trackowane przez główny repo (nie ma go w `.gitignore`); zawiera epiki
  (E001–E012), reporty, PRES, BACKLOG, STATE, sesje.
- `mdpad` to **publiczny** repo na GitHub (`github.com/zentala/mdpad`) — więc całe
  `.plan/` jest jawne w internecie, wraz z historią.
- Global rule (`CLAUDE.md` → „Plan & reference repos"): public repos gitignoreują
  `.plan/`; working material żyje lokalnie w `.plan/` jako **własny nested git repo**
  z prywatnym remote (host per routing: public project → GitHub, więc
  `zentala/mdpad-plan`).

## Trzy niuanse, które komplikują decyzję

1. **Historia już jest publiczna.** `git rm -r --cached .plan` + gitignore zatrzymuje
   trackowanie OD TERAZ, ale wszystkie dotychczasowe commity na GitHubie nadal zawierają
   `.plan/`. Pełne wyczyszczenie wymagałoby przepisania historii (`git filter-repo`) +
   force-push — kosztowne i psujące klony. Dla planów/reportów (nie sekretów) zwykle
   nie warto. **Wniosek:** migracja chroni tylko PRZYSZŁE `.plan`, nie przeszłość.
2. **mdpad to publiczny showcase.** Możliwe, że `.plan/` jest jawne CELOWO
   („build in public" — plany i decyzje jako część portfolio). Wtedy to nie drift, tylko
   wybór, i #6 = „won't do".
3. **Równoległa sesja.** W trakcie tej sesji inna sesja commitowała na
   `fix/migrate-zentala-agency` (epic `E011-menu-actions`). Jej niezacommitowana praca
   w `.plan/` byłaby w grze przy `git rm --cached` / przenoszeniu — migracja teraz może
   zgubić lub skonfliktować jej zmiany. **Wykonać dopiero, gdy repo jest „ciche".**

## Runbook (gdy zapadnie decyzja: migrować)

Wykonuje agent `git-ops` (repo host + nested-repo pattern to jego domena).

1. **Sanity — brak sekretów w `.plan/`:** `git -C .plan grep -rIl -e "PRIVATE KEY" -e
   "password" -e "token" 2>/dev/null` oraz przegląd `.env`-podobnych plików. Jeśli coś
   jest — wyjąć do password-brokera PRZED czymkolwiek.
2. **Utwórz prywatny remote:** `gh repo create zentala/mdpad-plan --private` (GitHub,
   bo mdpad jest publiczny → host GitHub per routing rule).
3. **Zabezpiecz CAŁĄ bieżącą zawartość** (włącznie z pracą drugiej sesji): upewnij się,
   że nic w `.plan/` nie jest niezacommitowane w main przed odpięciem; jeśli jest —
   najpierw commit w main albo skoordynuj z drugą sesją.
4. **Nested init + push:** `cd .plan && git init && git add -A && git commit -m
   "chore: import plan history" && git remote add origin
   git@github.com:zentala/mdpad-plan.git && git push -u origin main`. **Zweryfikuj push**
   (repo na GitHub ma pliki) PRZED krokiem 5.
5. **Odepnij w main (nieodwracalne dla trackingu):** `git rm -r --cached .plan && echo
   ".plan/" >> .gitignore && git commit -m "chore: untrack .plan (moved to private
   nested repo)"`.
6. **Weryfikacja:** `git status` w main nie pokazuje `.plan/`; `.plan/.git` istnieje;
   `git -C .plan log` ma historię; parent `git check-ignore .plan` = ignored.

## Ryzyka

| Ryzyko | Waga | Mitygacja |
|---|---|---|
| Zgubienie pracy drugiej sesji przy odpięciu | High | Wykonać tylko gdy repo ciche; commit/skoordynuj wprzód |
| Fałszywe poczucie prywatności (historia public zostaje) | Medium | Świadomie zaakceptować albo `filter-repo` (osobna, cięższa operacja) |
| `.plan` traci wersjonowanie w oknie między krokiem 5 a udanym push nested | Medium | Kolejność: push nested (4) PRZED untrack (5), zweryfikować |
| Utrata linku z main → runbooków/reportów w `.plan` | Low | To zamierzone; dostęp przez prywatny mdpad-plan |

## Decyzja potrzebna od Pawła

- **Intencja:** `.plan` ma być prywatne, czy zostaje jawne (build-in-public)?
- Jeśli prywatne: czyścimy też historię (`filter-repo`, cięższe) czy tylko od teraz?
- Punkty: `3` (sam nested-repo) / `8` (z czyszczeniem historii). Importance: Medium.
