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
