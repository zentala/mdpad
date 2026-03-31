# mdpad — UI Review

**Audited:** 2026-03-31
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists)
**Screenshots:** Captured (dev server running at localhost:3456)
**Screenshot path:** `.planning/ui-reviews/mdpad-20260331-093207/`

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Context-specific labels throughout, zero generic fallbacks |
| 2. Visuals | 3/4 | Strong hierarchy, strong icon system; mobile viewport completely broken |
| 3. Color | 3/4 | Well-disciplined token system; 11 hardcoded rgba values outside tokens |
| 4. Typography | 3/4 | Solid type scale via tokens; 25 hardcoded px/em overrides bypass the system |
| 5. Spacing | 3/4 | 4px grid declared; ~15 one-off pixel values outside the grid |
| 6. Experience Design | 3/4 | Excellent state coverage; no aria-label on ActivityBar icon buttons |

**Overall: 19/24**

---

## Top 3 Priority Fixes

1. **Mobile viewport renders blank** — the app is unusable below ~900px wide because `overflow: hidden` on `body`/`#root` clips all content with no responsive fallback. Although this is a desktop Tauri app, the GitHub Pages demo is publicly accessible and will appear broken to anyone visiting on a mobile device. Fix: add a `@media (max-width: 768px)` rule that shows a "mdpad is a desktop app — open on desktop to try it" message instead of a blank screen.

2. **ActivityBar icon buttons lack aria-label** — `ActivityBar.tsx:33` and `ActivityBar.tsx:45` render `<button>` elements with only a `title` attribute. The `title` attribute is not reliably announced by screen readers on interactive elements. All three buttons (Explorer, Search, Settings) need `aria-label` matching the `title` value. The Toolbar component handles this correctly with its `Btn` helper — the same pattern should apply to ActivityBar.

3. **25 font-size declarations bypass the token system** — files including `MenuBar.module.css:21` (13px), `ModeSwitcher.module.css:15` (9px), `FrontmatterDisplay.module.css:30` (8px), `SearchBar.module.css:38` (12px), `TocPanel.module.css:90` (9px) use raw pixel values instead of `var(--font-size-*)` tokens. This makes theme-level font scaling impossible and creates visual inconsistency (8px and 9px text is below readable threshold on most displays). Replace with `var(--font-size-xs)` (11px) as the minimum, or add `--font-size-2xs: 10px` to tokens.css for cases requiring smaller labels.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

All user-facing strings are specific and purposeful.

**Strengths:**
- Empty state (`EmptyState.tsx`) uses branded tagline "The terminal for your Markdown" — consistent with CLAUDE.md elevator pitch
- Quick Open empty state: "No files found" — specific and accurate
- TOC empty state: "No headings found" — specific and accurate
- Search empty state: "No results found" — specific and accurate
- All toolbar buttons use descriptive titles with keyboard shortcuts: "Toggle Explorer (Ctrl+Shift+L)", "Bold (Ctrl+B)" etc.
- Menu items match platform conventions: "Open File…", "Save As…", "Export as PDF"
- Zen mode toggle label: "Exit Zen Mode (Esc)" — communicates both action and shortcut
- Mermaid error label: "Mermaid Error" with the error text — developer-appropriate

**No generic fallbacks found:** grep for "Submit", "Click Here", "OK", "Something went wrong" returned no results in component code.

**One minor note:** The `Modal` close button (`Modal.tsx:25`) has no title attribute — icon-only X button with no accessible label. Not enough to affect score given the modal title always provides context.

---

### Pillar 2: Visuals (3/4)

The desktop UI has strong visual hierarchy and a coherent design language. The mobile experience is a critical gap for the web demo.

**Strengths:**
- Clear visual hierarchy: MenuBar (36px) → TabBar → Toolbar → Content — each layer has appropriate weight
- Activity bar follows the VSCode pattern exactly — universally understood, 48px wide, left accent border on active panel
- Lucide icons used consistently at matched stroke widths (1.5 for status bar, 1.75 for toolbar, 2.0 implied elsewhere)
- Tab active state uses bottom `2px solid var(--accent)` border — clear selection indicator
- Logo (`#_`) is distinctive and renders correctly as SVG with size/color props
- Sidebar + TocPanel use `--bg-surface` elevation, main area uses `--bg-primary` — creates correct depth hierarchy
- Scrollbars are minimal (6px, appear-on-hover) — reduces visual noise
- ZenHoverBar opacity pattern (0.3 → 1.0 on hover) is elegant for distraction-free mode

**Issues:**
- **Mobile viewport is a blank dark screen** — screenshot confirms complete failure at 375px. No `@media` queries exist in any CSS file. The `overflow: hidden` on `body` and `#root` (global.css:11-13) combined with fixed `height: 100%` creates a completely invisible app on narrow viewports. Since mdpad.zentala.io is publicly accessible, this is a visible quality gap.
- **Tab close button invisible until hover** — `TabBar.module.css:63-65` sets `opacity: 0` on the close X button, revealing it only on tab hover. This is a discovered affordance — new users won't know how to close a tab. Consider showing the X at reduced opacity (0.4) by default on the active tab.
- **No focus ring styles** — no `:focus-visible` CSS found in any module. Keyboard navigation is fully wired (App.tsx:70-124) but there is no visual feedback when tabbing through the UI.

---

### Pillar 3: Color (3/4)

The token system is well-structured with 3 complete theme definitions and a disciplined set of semantic variables. The main issue is hardcoded rgba values in component CSS that should be tokens.

**Token system strengths:**
- `tokens.css` defines complete dark, light, and sepia themes via `[data-theme]` selectors
- Semantic naming: `--text-primary/secondary/muted/accent`, `--bg-primary/surface/elevated/hover/active` — intent is clear
- Accent (`--accent`, `--accent-hover`, `--accent-dim`) is used purposefully: active tab borders, active sidebar icons, hover states
- Status colors (`--status-done`, `--status-progress`, `--status-blocked`) are defined as tokens
- Alert colors in `MarkdownPreview.module.css` use hardcoded values appropriate to GitHub Alert spec (#58a6ff, #3fb950, etc.) — acceptable since these are content-semantic

**Issues:**
- `rgba(0, 0, 0, 0.35)`, `rgba(0, 0, 0, 0.4)`, `rgba(0, 0, 0, 0.85)`, `rgba(0, 0, 0, 0.5)` appear in overlays and box-shadows across 7 files — these are hardcoded and will look wrong on the sepia theme where pure black shadows create a jarring contrast. Should be `--shadow-overlay: rgba(0,0,0,0.4)` in tokens.css.
- `rgba(248, 113, 113, 0.1)` in `ContextMenu.module.css:45` (danger item background) is hardcoded red — should be `var(--status-blocked)` with alpha or a new `--danger-dim` token.
- `rgba(46, 160, 67, 0.1)` in `MarkdownPreview.module.css:337` is hardcoded green — appropriate for GitHub Alert success tint but could be `var(--status-done)` with alpha.
- One hardcoded color in TSX: `errorColor: '#cc0000'` in `MarkdownPreview.tsx:107` for KaTeX errors — should reference a token or CSS variable.

**60/30/10 color split assessment:** The neutral backgrounds (60%) + muted text and surfaces (30%) + blue accent (10%) split is well-balanced and consistent across all three themes.

---

### Pillar 4: Typography (3/4)

The design token system defines a clear 7-step scale (`xs` through `2xl`) plus semantic font families. The weakness is that approximately 25 component CSS files bypass this scale with raw pixel values.

**Type scale defined in tokens.css:**
```
--font-size-xs:   11px
--font-size-sm:   12px
--font-size-base: 14px  (body default)
--font-size-md:   15px
--font-size-lg:   18px
--font-size-xl:   24px
--font-size-2xl:  30px
```

**Font weights in use:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold) — well-controlled, 4 levels appropriate for this type of app.

**Font families:** `--font-sans: DM Sans` for UI, `--font-mono: JetBrains Mono` for code — correct semantic split.

**Hardcoded size violations (non-exhaustive):**
- `EmptyState.module.css:16` — `font-size: 48px` for logo (should be a token or custom property)
- `EmptyState.module.css:66,103` — `font-size: 10px` (below `--font-size-xs`, likely illegible at 1.0x zoom)
- `FrontmatterDisplay.module.css:30` — `font-size: 8px` (well below readable threshold on any display)
- `ModeSwitcher.module.css:15,25` — `font-size: 9px` (near illegible on retina at 1x)
- `TocPanel.module.css:90` — `font-size: 9px` for level badges (H1, H2)
- `MenuBar.module.css:21` — `font-size: 13px` for app icon (between `--font-size-sm` and `--font-size-base`)
- `SearchBar.module.css:38,117` — `font-size: 12px` and `font-size: 13px` (use `--font-size-sm` and `--font-size-base`)
- `Modal.module.css:63` — `font-size: 16px` (use `--font-size-md` at 15px or add `--font-size-base-plus`)

The 8px and 9px values are particularly concerning — these will be illegible at system font scale 1.0 on most monitors and completely inaccessible at any browser zoom level below 100%.

---

### Pillar 5: Spacing (3/4)

The `tokens.css` header declares "4px spacing grid, deliberate density." The token file defines structural dimensions (`--sidebar-width`, `--menubar-height`, etc.) but does not define spacing step tokens (no `--space-1: 4px`, `--space-2: 8px`, etc.). Components mostly follow the 4px grid but several use non-grid values.

**Consistent patterns (good):**
- Most component padding values: `4px`, `8px`, `12px`, `16px`, `24px`, `32px` — all grid-aligned
- Gap values: `4px`, `6px`, `8px`, `12px` — mostly grid-aligned
- The main content padding `32px 40px 64px` (`MarkdownPreview.module.css:3`) is deliberate and appropriate for reading

**Non-grid values found:**
- `5px` appears 2x (`EmptyState.module.css:107`, `ToggleSwitch.module.css`) — neither 4px nor 8px
- `6px` appears 13x — could be intentional for tighter sub-components but breaks grid purity
- `7px` in `SearchBar.module.css` — odd value, likely `6px` or `8px` intended
- `10px` appears in several places between `8px` and `12px` grid steps
- `1em 0` in MarkdownPreview — acceptable for prose layout (relative to content font size)

**Missing:** There are no spacing tokens (CSS custom properties for spacing steps). Adding `--space-1: 4px` through `--space-8: 32px` to tokens.css would enforce the grid system and prevent future non-grid values.

**Inline style with computed spacing:** `TocPanel.tsx:46` uses `style={{ paddingLeft: (heading.level - 1) * 12 + 12 }}` — this is intentional algorithmic indentation, not a spacing violation.

---

### Pillar 6: Experience Design (3/4)

The app has excellent coverage of the three key UX states (loading, error, empty) and strong keyboard interaction design. The accessibility gaps prevent a 4/4.

**Loading states:**
- Mermaid diagrams show "Loading diagram..." during async import (`MermaidBlock.tsx:61-64`) — good
- Shiki highlighting uses synchronous bundle — no loading flash needed

**Error states:**
- Mermaid render errors display inline with error text in a bordered box (`MermaidBlock.tsx:69-74`) — correct, never crashes
- KaTeX has `throwOnError: false` — silent degradation
- localStorage parse errors silently fall back to defaults (`AppStateProvider.tsx:23,33`) — good resilience
- File load failure is silently swallowed: `AppStateProvider.tsx:273` uses `.catch(err => console.error(...))` — no user-visible feedback when a file fails to load. Should show an inline error state in the content area.

**Empty states:**
- No active file: `EmptyState` component with logo, tagline, quick actions, shortcut grid — excellent
- Quick Open with no matches: "No files found" (`QuickOpen.tsx:68`) — good
- TOC with no headings: "No headings found" (`TocPanel.tsx:24`) — good
- Search with no results: "No results found" (`SearchPanel.tsx:143`) — good

**Keyboard interaction:**
- 13 shortcuts wired in `App.tsx` covering all primary actions — comprehensive
- Escape handling for Zen Mode, ContextMenu, ImageLightbox — consistent
- Known limitation documented: Ctrl+Shift+P conflicts with Chrome DevTools in web demo

**Accessibility gaps:**
- `ActivityBar.tsx:33` — `<button>` for Explorer icon: has `title` but no `aria-label`. The `title` attribute is not reliably announced by screen readers on focusable elements.
- `ActivityBar.tsx:45` — `<button>` for Settings icon: same issue
- `Modal.tsx:25` — close button has neither `title` nor `aria-label`
- No `:focus-visible` ring in any CSS module — keyboard users have no visual navigation cue
- `ToggleSwitch.tsx:21` has `role="switch"` and `aria-checked` — correct pattern
- `Logo.tsx` has `role="img"` and `aria-label` — correct
- `HeadingWithAnchor.tsx:32` has `aria-label` on anchor links — correct

**Confirmation for destructive actions:**
- "Close All" in tab context menu (`TabBar.tsx:52-54`) has `danger: true` styling but no confirmation dialog — closing all tabs is irreversible. Should prompt "Close all N tabs?"

---

## Files Audited

**Layout components:**
- `src/components/layout/AppShell.tsx` + `.module.css`
- `src/components/layout/MenuBar.tsx` + `.module.css`
- `src/components/layout/ActivityBar.tsx` + `.module.css`
- `src/components/layout/TabBar.tsx` + `.module.css`
- `src/components/layout/Toolbar.tsx` + `.module.css`
- `src/components/layout/StatusBar.tsx` + `.module.css`
- `src/components/layout/ZenHoverBar.tsx` + `.module.css`
- `src/components/layout/ModeSwitcher.tsx` + `.module.css` (partial)

**Common components:**
- `src/components/common/EmptyState.tsx` + `.module.css`
- `src/components/common/Logo.tsx`
- `src/components/common/Modal.tsx` + `.module.css` (partial)
- `src/components/common/ZoomControl.tsx` (partial)
- `src/components/common/QuickOpen.tsx` (partial)

**Content components:**
- `src/components/markdown/MarkdownPreview.module.css` (partial)
- `src/components/markdown/MermaidBlock.tsx` (partial)
- `src/components/toc/TocPanel.tsx` + `.module.css` (partial)
- `src/components/search/SearchPanel.tsx` (partial)

**Theme:**
- `src/theme/tokens.css`
- `src/theme/global.css`

**App entry:**
- `src/App.tsx` (keyboard handlers, state wiring)

**Screenshots:**
- `.planning/ui-reviews/mdpad-20260331-093207/desktop-wait.png` — 1440x900, app loaded
- `.planning/ui-reviews/mdpad-20260331-093207/mobile.png` — 375x812, blank (expected — no responsive layout)
- `.planning/ui-reviews/mdpad-20260331-093207/tablet.png` — 768x1024, blank (same cause)
