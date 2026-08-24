# Backlog — mdpad

## Epics
- [E001 — Project Bootstrap](epics/E001-2026-03-28-project-bootstrap/PLAN.md) — research, UX vision, project setup
- [E002 — Prototype v2](epics/E002-2026-03-30-prototype-v2/PLAN.md) — UX refinements, Lucide icons, tabs, mode rename
- [E003 — Prototype v3](epics/E003-2026-03-30-prototype-v3/PLAN.md) — full feature demo: activity bar, search, Shiki, Mermaid, settings
- [E004 — comrak Extensions](epics/E004-2026-03-30-comrak-extensions/PLAN.md) — math, footnotes, wiki-links, highlight, emoji, sup/sub, spoiler
- [E005 — Website Deploy](epics/E005-2026-03-30-website-deploy/PLAN.md) — deploy prototype to mdpad.zentala.io as live demo + docs site
- [E006 — UI Layout Improvements](epics/E006-2026-03-30-ui-layout-improvements/PLAN.md) — VSCode Activity Bar + Zen Mode
- [E009 — Settings Sidebar](epics/E009-2026-03-31-settings-sidebar/PLAN.md) — move settings from tab to sidebar panel
- [E010 — Functional Editor](epics/E010-2026-03-31-functional-editor/PLAN.md) — make all fake UI actually work: editor engine, toolbar, find/replace, file ops, export, settings
- [E012 — DevEx Hardening](epics/E012-2026-08-17-devex-hardening/PLAN.md) — fix docs/repo drift, hygiene, dev scripts, coverage ([DevEx Review](reports/2026-08-17-devex-review.md))

## Ideas — High Priority
- [ ] **zentala.agency link + autorstwo** — dodać link do zentala.agency w About/AboutModal oraz informację, że autorem jest Paweł Żentała (from TASKS.NEXT.md, 2026-08-17)
- [ ] **SEO: zentala.agency w About app** — link + słowa kluczowe w About, bo ludzie będą publikowali wygenerowane MD; przydatne dla SEO (from TASKS.NEXT.md, 2026-08-17)
- [x] **Logo `#_` tooltip** — hover on logo shows "mdpad" (Logo component `title` prop + MenuBar `title` attr)
- [x] **Settings localStorage persistence** — all settings persisted (theme in AppStateProvider, others in SettingsView). Theme survives page reload from both MenuBar and Settings
- [x] **Persist theme in localStorage** — theme saved on every change, loaded on init (dark/light/sepia/auto)
- [x] **Unified SVG logo** — Logo component (Iosevka Bold `#_` SVG) used in MenuBar, AboutModal, EmptyState, favicon
- [ ] Demo mode — deploy to GitHub Pages, localStorage persistence for edits → partially covered by [E005](epics/E005-2026-03-30-website-deploy/PLAN.md)
- [ ] Floating toolbar only on content selection (not outline/sidebar)
- [ ] File status indicators (open dot, unsaved dot) on file tree icons
- [ ] Empty states (no file open, empty folder, file not found)
- [ ] Breadcrumb navigation above content
- [ ] Syntax highlighting via Shiki (github-dark + github-light themes)
- [ ] GitHub Alerts rendering (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- [ ] KaTeX math rendering ($inline$, $$block$$) — planned in E004-T02
- [ ] Wiki-links [[page]] → navigate to file — planned in E004-T07 (prototype decoration; full resolution needs Tauri)
- [ ] Drag-and-drop .md files onto window to open
- [ ] Recent files on empty state / startup
- [ ] Folder chevron+icon combined (single element, not separate)
- [ ] JSON/YAML file viewer — render YAML/JSON with syntax highlighting and structured view (catalog-info.yaml already in file tree but not rendered in preview)
- [ ] Scroll position memory per file
- [ ] Image demo: inline images, click to enlarge, copy link, context menu
- [ ] YouTube embed demo: embedded videos in markdown
- [ ] Table demo: full GFM table showcase in Welcome.md
- [ ] Image lightbox: click image → fullscreen overlay with zoom
- [ ] Mermaid/chart rendering demo (flowchart, sequence, ER, pie, gantt)
- [ ] Empty state / welcome page when no tabs open (like VS Code)
- [ ] Settings page as a tab (like VS Code settings)
- [ ] Tabs always visible (even with 1 tab)
- [ ] MDX support research and potential implementation
- [ ] Research: future of Markdown, new flavors, AI dev context needs

- [ ] Research StackEdit (stackedit.io) features — map and adopt relevant ones
- [ ] Delete files/folders from Explorer (right-click → Delete, confirm dialog)
- [ ] Undo/Redo buttons in toolbar (before Bold/Italic, remove from Edit menu)
- [ ] Rename files/folders in Explorer (right-click → Rename, inline input)
- [ ] Mermaid theme matching (dark/light/sepia should change diagram colors)
- [ ] Standalone files in CAPS LOCK (WELCOME.md, REFERENCE.md, README.md)

- [ ] Code editor: line numbers + active line highlight (subtle background)
- [ ] Search in Preview mode — currently search bar tied to toolbar (edit only). Need search accessible in all modes. Design decision needed.
- [x] Zen Mode — F11 toggles, Esc exits. Hides all chrome, shows only content. (E006-T02)
- [ ] Semi-visual edit mode — markdown markers (##, >, **) shown semi-transparent alongside rendered content (like StackEdit left pane). Possibly 3 edit sub-modes: Full Visual, Semi-Visual (default), Code

## Research — Competitive Feature Mapping
- [ ] Research Mark Text (marktext/marktext) — feature map, what to adopt
- [ ] Research Joplin (joplinapp.org) — note-taking features, tags, notebooks
- [ ] Research Calmly Writer (calmlywriter.com) — distraction-free writing UX
- [ ] Research docsify.js (https://docsify.js.org) — investigate features, helpers, plugins, what to adopt for mdpad
- [ ] Research grip (Python GitHub MD renderer) — compare rendering approach
- [ ] Research glow (Go terminal MD viewer by Charmbracelet) — TUI file browser ideas
- [ ] AI agent skill for mdpad — Claude Code skill to display formatted MD to users (unique differentiator)

## Vision — Future Modes (explore after v1 dev mode is complete)
- [ ] Tags system — YAML frontmatter tags, reusable across app, tag browser panel
- [ ] Folder as knowledge base — folder = notebook, browse/search/tag across files
- [ ] Three app modes (long-term vision, may be overkill):
  - Developer mode (current) — browse project .plan/.arch files
  - Note-taking mode — notebooks, tags, daily notes
  - Writer mode — distraction-free, chapter structure, word count goals
- [ ] Evaluate if multi-mode is worth it or if dev mode + tags covers enough

## Bugs / Fixes (E004 follow-up)
- [ ] **Subscript broken** — `H~2~O` renders as strikethrough (H̶2̶O) instead of subscript (H₂O). GFM `~text~` = strikethrough conflicts with `~text~` = subscript. Need conflict resolution: single `~` = sub, double `~~` = strikethrough
- [x] **Multiline blockquote fixed** — preprocessor converts `>>>` fences to HTML blockquotes before AST parsing
- [ ] **Wiki-links not clickable** — `[[README]]` and `[[Architecture Overview|.arch/ARCHITECTURE]]` render but are not interactive (no click handler)
- [ ] **Wiki-links wrong color** — link color doesn't match current theme skin (dark/light/sepia)
- [ ] **Anchor links broken for multi-file context** — `#user-content-math-katex` lacks file path prefix. Should be `/Welcome.md#math-katex` (dynamic from current file). Hover on heading shows nothing — only copy gives broken link
- [ ] **No tests for E004 extensions** — 11 remark/rehype plugins with zero test coverage. Need unit tests for each plugin + integration test for full pipeline

## Decyzje otwarte (E012 DevEx review)
- [ ] **`.plan/` trackowane w publicznym repo** — migrować do prywatnego nested repo czy zostawić jako build-in-public? Runbook + niuanse (historia już public, równoległa sesja): [Plan-repo migration runbook](reports/2026-08-17-plan-repo-migration-runbook.md). Decyzja: intencja + czy czyścić historię.

## Testy — luki pokrycia (E012 Wave 3, ODŁOŻONE — inny agent rozpisze)

TLDR: DevEx review (E012) znalazł brak konfiguracji coverage i zero testów na rdzeniu
edytora. Wave 3 świadomie pominięta w implementacji — osobny skrypt/agent zajmie się
testami. Ten spis mówi CO jest do zrobienia, żeby następny agent nie musiał zgadywać.

**Brak infrastruktury coverage (T12):**
- [ ] Brak `@vitest/coverage-v8` w devDependencies — `pnpm test --coverage` nie zadziała.
- [ ] Brak sekcji `coverage` w `prototype/vitest.config.ts` (provider, reporter, thresholds).
- [ ] Brak skryptu `test:coverage` w `prototype/package.json`.
- [ ] Brak gate coverage w CI (`.github/workflows/ci.yml`) — nikt nie pilnuje regresji.
- Rekomendowany próg startowy: lines 50% (realistyczny dla obecnego stanu) → docelowo 70/80% zgodnie z `rules/testing.md`.

**Rdzeń bez żadnych testów (T13) — pliki i czego brakuje:**
- [ ] `components/editor/CodeEditor.tsx` (CodeMirror 6) — brak smoke: mount, `getContent`/`setContent`, `insertAtCursor`, `execCommand`.
- [ ] `components/editor/VisualEditor.tsx` (Milkdown/ProseMirror) — brak smoke: mount, round-trip treści, lazy-load engine.
- [ ] `components/markdown/MarkdownPreview.tsx` (react-markdown) — brak testu renderu GFM/frontmatter.
- [ ] Integracja Tauri: `hooks/useTauriFiles.ts` + `lib/tauri-api.ts` — brak testu z mockiem `invoke` (5 komend: list_files, read_file, watch_directory, unwatch_directory, set_window_title) pod flagą `IS_TAURI`.
- [ ] Remark-pluginy w `src/plugins/`: `remarkWikilinks`, `remarkMark`, `remarkSupSub`, `remarkSpoiler`, `remarkInsert` — zero testów (patrz też bug „No tests for E004 extensions" wyżej: 11 pluginów).
- Konwencja: nazwa test-pliku = basename źródła (`CodeEditor.tsx` → `CodeEditor.test.tsx`), by spełnić per-file coverage gate.
- Znane pułapki: jsdom nie renderuje ProseMirror/CodeMirror w pełni — smoke = mount + kontrakt `EditorRef`, nie pełna interakcja; `invoke` mockować przez `vi.mock('@tauri-apps/api/core')`.

## Ideas — Lower Priority
- [ ] Plugin system (later — keep simple first)
- [ ] Plugin enable/disable in Settings — see [IDEAS.md](IDEAS.md)
- [ ] Vim keybindings
- [ ] Git integration (show diffs in preview, git status in file tree)
- [ ] Template system for new markdown files
- [ ] Adopt main/dev branching model
- [ ] Backlinks panel ("linked from this file")
- [ ] Section folding by heading
- [ ] Footnotes, highlight ==text==, emoji :shortcodes: — all planned in E004
- [ ] Graph view (Obsidian-style)

## Research
- [Market Research](reports/2026-03-28-market-research.md) — competitive landscape
- [UX Vision](vision/2026-03-28-ux-vision.md) — detailed UX specification
- [UX Refinement Notes](vision/2026-03-30-ux-refinement-notes.md) — user feedback, stream of consciousness
- [V3 Ideas](vision/2026-03-30-v3-ideas.md) — sidebar tabs, search panel, zoom, settings, demo mode
- [Feature Research](reports/2026-03-30-feature-research.md) — GFM spec, markdown extensions, editor patterns, code highlighting
- [Product Strategy Report](reports/2026-03-30-product-strategy-report.md) — personas, value prop, brand, competitive UX audit, feature prioritization
- [comrak Extensions Spec](vision/2026-03-30-comrak-extensions-spec.md) — Welcome.md content spec for E004 extension showcase
- [Product Vision Brainstorm](vision/2026-03-30-product-vision-brainstorm.md) — competitive landscape, 4 operating modes, AI agent integration

## Reference Examples
- [examples/](../examples/) — git submodules of Tauri markdown editors

- [ ] **`mdpad.internal` registry entry is stale** — registered as `proxy` on port
  5173, the port `meblarz.internal` actually holds; no mdpad PM3 service is running,
  and `mdpad/pm3.yaml` hardcodes the same 5173. The registry reports it `up`, which
  is a false positive — it is proxying to meblarz's server. Fix: give mdpad its own
  port in `pm3.yaml` and re-register the domain. Found 2026-08-20 during a
  freevilisation session, filed there first, moved here as the owning repo.
  (Importance: Medium, Points: 1)

- [ ] **`.arch/` still exists alongside `.plan/` — never migrated** — breaks
  `~/.claude/rules/plan-arch-structure.md:25-32`, which makes `.plan/` the only
  planning tree. Two trees means hooks, viewers and agents read the wrong one.
  Found by `/conventions-scan` sweep of 10 repos, 2026-08-24
  (`~/.claude/.plan/reports/2026-08-24-konwencje-z-repo.md`). Fix: `git mv` the
  contents into `.plan/`, delete `.arch/`, fix inbound links. (Importance: Medium, Points: 2)

- [ ] **Wydzielić `@zentala/md-editor` z `prototype/`** — `VisualEditor.tsx` (Milkdown)
  i `CodeEditor.tsx` (CodeMirror 6) są już czyste: props `value`/`onChange`/`ref`, poza
  tym tylko `@/types` i `@/utils/clipboard`. Do paczki idą też `ModeSwitcher.tsx`
  i `src/plugins/` (6 pluginów remark). `MarkdownPreview.tsx` NIE — jest przyspawany do
  `useAppContext` i `useSettingsContext`, wymaga rozprucia na propsy (+3 pkt). Publikacja
  na `npm.internal` (Verdaccio, `@zentala/*`), mdpad pierwszym konsumentem własnej paczki.
  Powód: zntl-portal (log.internal) chce edycji markdown w webie i nie ma sensu pisać tego drugi raz.
  Analiza: [reports/2026-08-24-md-editor-jako-biblioteka.md](reports/2026-08-24-md-editor-jako-biblioteka.md)
  (Importance: Medium, Points: 5)

- [ ] **Sprawdzić, czy Milkdown przepisuje cały plik przy round-tripie** — serializacja
  idzie przez remark-stringify z domyślnymi ustawieniami (listy `* ` + puste linie),
  a repo pisze `- ` bez pustych linii. Jeśli tak, jedno wejście w tryb Visual robi diff
  na cały plik pod gitem. Test: `readFile → Milkdown → getMarkdown → diff` na trzech
  prawdziwych plikach. Blokuje wypuszczenie trybu Visual na pliki wersjonowane.
  (Importance: High, Points: 1)

- [ ] **`C:/Users/zentala/code/zntl-md/` to bajt w bajt kopia `mdpad/prototype/`** —
  nie wiadomo, czy to martwa pozostałość po zmianie nazwy (zntl-md → mdpad, 2026-03-30),
  czy żywe drugie repo. Dwie kopie tego samego kodu = zmiany trafią do jednej.
  Ustalić remote'y i historię, potem skasować albo udokumentować. Znalezione 2026-08-24.
  (Importance: Medium, Points: 1)
