---
id: E006-T05
epic: E006
status: pending
created: 2026-03-31
---
# E006-T05: Implement content zoom

## Problem
ZoomControl widget exists (bottom-right floating buttons, dispatches `SET_ZOOM`,
sets `--content-zoom` CSS variable) but zoom has no actual effect on content.
The CSS variable is set on the ZoomControl wrapper div but nothing consumes it.

## Solution
Apply the zoom level to the markdown content area so text/images scale.

### Implementation approach
Apply `transform: scale(var(--content-zoom))` or `zoom: var(--content-zoom)` to the
markdown preview container (`.markdownPreview` or the content wrapper in App.tsx).

**CSS `zoom` vs `transform: scale()`**:
- `zoom` — simpler, reflows text naturally, but non-standard (works in all browsers though)
- `transform: scale()` — standard, but doesn't reflow (content overflows or shrinks within fixed box)
- **Recommendation**: Use CSS `zoom` property — it reflows text like native browser zoom,
  which is what the user expects. The value is `state.zoom / 100` (e.g., 1.5 for 150%).

### Where to apply
- The `--content-zoom` variable needs to be on a parent that wraps the content area
- Apply `zoom: var(--content-zoom)` to the MarkdownPreview wrapper or the `.main` content area
- ZoomControl widget should stay at fixed size (not affected by zoom)

### Files to modify
- `prototype/src/components/markdown/MarkdownPreview.tsx` or its CSS module — apply zoom
- `prototype/src/App.tsx` — ensure `--content-zoom` variable is set on correct parent
- Possibly: `prototype/src/components/common/ZoomControl.tsx` — verify variable propagation

### Edge cases
- ZoomControl itself should NOT zoom (stays fixed at bottom-right)
- TOC panel should NOT zoom (it's separate from content)
- Scroll position should be preserved when zooming
- Min 50%, max 200% (already enforced in reducer)

### Verification
1. Click +/- on ZoomControl → content scales up/down
2. Click percentage → resets to 100%
3. ZoomControl widget stays same size
4. TOC panel unaffected
5. Ctrl+scroll or Ctrl+Plus/Minus should also work (if keyboard shortcuts exist)
6. Works in all themes
