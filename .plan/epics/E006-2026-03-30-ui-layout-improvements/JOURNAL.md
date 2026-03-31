# E006 — Journal

## Session 2026-03-31 01:00
- **Goal**: Activity Bar (VSCode-style) + Zen Mode design & implementation
- **Done**:
  - T01: VSCode Activity Bar — replaced SidebarBookmarks with left icon strip (3c2561e, 4dd3899)
  - T02: Zen Mode — F11/Esc toggle, hides all chrome (ab1f893, f65d9b7)
  - T03: Zen hover bar — evolved through 5 iterations based on user feedback:
    1. Hover-reveal at top edge (JetBrains pattern) (0ad4de2)
    2. Centered mode switcher + Zen toggle switch (bbccaad)
    3. Maximize icon + spacing fix (162077c)
    4. Always-visible, transparent (30% opacity), no background, sticky (e1fc97b)
  - Impro: orphan cleanup, .gitignore, DRY theme utils, 23 new tests (4accdc1)
  - Extracted reusable components: ModeSwitcher, ToggleSwitch, themeUtils
- **Decisions**:
  - Activity Bar 48px wide, icons 24px (VSCode standard)
  - Zen Mode bar always visible (not hover-triggered), 30% opacity → 100% on hover
  - Zen toggle is iOS-style switch, same in MenuBar and ZenHoverBar
  - UX research done: JetBrains hover-reveal pattern adopted, then evolved to always-visible
- **Findings this session**: 0
- **Improvements logged**: 7 issues found in impro review, all fixed
- **Tests**: 36 → 59 (ActivityBar 5, ModeSwitcher 5, ToggleSwitch 6, ZenHoverBar 7)
- **Next**: push to dev, merge to main if CI passes

## Session 2026-03-31 09:00
- **Goal**: Plan new tasks + UI audit + implement all findings
- **Done**:
  - Created IDEAS.md for unrefined future ideas (plugin enable/disable)
  - Planned 4 new tasks: T04 zen toggle, T05 zoom, T06 logo, T07 outline
  - Ran 6-pillar UI audit (score: 19/24) → UI-REVIEW.md
  - Dispatched 7 parallel agents in worktrees, merged all to dev:
    - T04: Zen Mode settings toggle (009488d)
    - T05: Content zoom via CSS zoom property (a5f1d98)
    - T06: Logo #> → #_ with Iosevka Bold underscore (8eba8aa)
    - T07: Outline redesign — floating, transparent, 20% opacity (3eaf807)
    - Audit a11y: aria-labels, focus-visible rings, modal close (4f84b5e)
    - Audit CSS: font-size/shadow/spacing tokens, 18 files fixed (6a01c66)
    - Audit UX: mobile fallback, Close All confirm, file error state (12caeda)
  - Post-review polish: logo docs update, remaining token misses (b8ca5d7)
  - Stop hook additions: TOGGLE_SETTINGS action, useUrlSync, logo blink, AboutModal polish (2743940)
  - E009 settings sidebar epic created by stop hook (09eb633)
- **Decisions**:
  - Logo changed to #_ (underscore = cursor metaphor, reversible)
  - Outline is floating overlay inside content area (not separate panel)
  - Mobile fallback uses hardcoded colors (no React/theme outside #root)
  - CSS zoom property chosen over transform:scale (reflows text naturally)
- **Findings this session**: 0
- **Improvements logged**: 14 audit items found and fixed, 5 post-review items fixed
- **Tests**: 59 → 74 (TOGGLE_SETTINGS 4, ActivityBar badge 2, ZenHoverBar updates, URL sync)
- **Next**: visual QA of outline and logo, push to remote, E009 settings sidebar
