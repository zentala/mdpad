# Journal — E000: Maintenance

(Permanent epic for small/misc changes.)

## Session 2026-03-30 14:30
- **Goal**: Fix backlog items — blockquote bug, English fixes, tests, auto theme, localStorage persistence
- **Done**: 6 features/fixes across 10 commits (4 via parallel worktree agents, rest manual):
  - Multiline blockquote `>>>` fix — preprocessor approach (7e5af31, 2f80e3a)
  - English fixes — comrak attribution, Markdown capitalization (be0ded8)
  - Vitest setup + 36 tests: Logo, PanelHeader, SettingsView, AppStateProvider, blockquote (c8ac860, efcf650, 891ff35)
  - Auto theme (dark/light/sepia/auto from OS matchMedia) (84428a3, 3f6022d)
  - Settings localStorage persistence — theme + all settings survive reload (143bce4)
  - Impro fixes: theme desync, sepia icon, lazy init, useSettings extraction (efcf650, 891ff35)
  - Backlog items marked done: logo tooltip, unified SVG, localStorage, multiline blockquote (b3e91a7)
- **Decisions**: theme persisted in AppStateProvider (single source), settings in useSettings hook (separated concerns)
- **Findings**: SettingsView theme desync when changed from MenuBar (fixed), matchMedia missing in jsdom (mocked), tsconfig auto-detecting test types (excluded)
- **Improvements logged**: 2 rounds of impro, all findings resolved
- **Next**: TLS cert fix for mdpad.zentala.io, SEO fixes (og:image, meta desc, robots.txt)
