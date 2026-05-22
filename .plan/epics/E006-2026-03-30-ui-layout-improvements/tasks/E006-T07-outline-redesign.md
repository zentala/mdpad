---
id: E006-T07
epic: E006
status: pending
created: 2026-03-31
title: Outline panel redesign — floating, transparent, minimal
---
# E006-T07: Outline panel redesign — floating, transparent, minimal

## Problem
Current TocPanel (outline) feels detached from the content:
- Separate background (`--bg-surface`)
- Vertical border on the left (`border-left: 1px solid var(--border)`)
- Distinct visual block — looks like a separate panel, not part of the article

## Design goal
Outline should feel like a **floating article navigation** — part of the content,
not a separate panel. Think: Wikipedia sidebar TOC, or Medium's floating chapter nav.

### Visual design
- **Background**: transparent (same as content area, no `--bg-surface`)
- **No borders**: remove left border, remove any separating lines
- **Low visibility at rest**: ~20% opacity for the entire outline
- **Hover reveal**: mouse over outline area → fade to full opacity (smooth transition)
- **Active heading stays visible**: the currently-active heading marker persists at full opacity
- **Close button (x)**: stays functional, same low-opacity behavior

### Positioning
- **Closer to content**: not flush against the right edge of the viewport
- Should start at roughly the same vertical level as the article title/first heading
- Positioned to the right of the article text, but not far-right margin
- Think: `margin-left: 2rem` gap from the article text, not pinned to viewport edge
- Still sticky/floating as user scrolls (current behavior via CSS sticky)

### Layout changes
- Remove the `.resizerV` (resize handle) between content and outline — it's a panel
  separator, but outline is no longer a panel
- Outline lives INSIDE the content area or overlays it, not as a sibling flex item
- Consider: outline absolutely/sticky positioned within the content wrapper

### Terminology
"Outline" is the correct term (used by Google Docs, Notion, VS Code).
Alternative: "Table of Contents" / "TOC" / "On this page" (used by docs sites).
Keep "Outline" — it's the most concise and widely understood in editor context.

### Files to modify
- `prototype/src/components/toc/TocPanel.module.css` — major styling overhaul
- `prototype/src/components/toc/TocPanel.tsx` — possibly adjust structure
- `prototype/src/components/layout/AppShell.module.css` — remove resizer, change layout
- `prototype/src/components/layout/AppShell.tsx` — move outline into content area
- `prototype/src/App.tsx` — adjust where TocPanel is rendered

### Requires visual review
This task changes the feel of the entire reading experience. Before implementing:
1. Create a CSS-only prototype of the new outline style
2. Review in dark/light/sepia themes
3. Test with short articles (2-3 headings) and long articles (20+ headings)
4. Verify it doesn't overlap content text at narrow viewport widths

### Verification
1. Outline has transparent background (matches content area)
2. No vertical or horizontal borders/separators
3. Low opacity (~20%) at rest
4. Full opacity on hover (smooth transition)
5. Active heading always visible
6. Starts at article content level, not viewport top
7. Positioned right of text, not far-right margin
8. Still tracks scroll position (active heading follows reading)
9. Works in dark/light/sepia themes
10. Doesn't break at narrow viewports
