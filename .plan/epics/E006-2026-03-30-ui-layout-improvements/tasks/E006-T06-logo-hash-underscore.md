---
id: E006-T06
epic: E006
status: pending
created: 2026-03-31
title: Change logo from #> to #_ and ensure single source of truth
---
# E006-T06: Change logo from #> to #_ and ensure single source of truth

## What
Replace the `>` glyph with `_` (underscore) in the logo: `#>` → `#_`.

## Why
User preference — testing how `#_` looks as the mdpad logotype. Reversible.

## Single source of truth audit
Currently the logo glyphs exist in multiple places:
1. **`prototype/src/components/common/Logo.tsx`** — `HASH_PATH` + `GT_PATH` SVG path constants
2. **`prototype/public/favicon.svg`** — same paths hardcoded in static SVG (32x24)
3. **`prototype/public/logo.svg`** — same paths in static SVG (64x64)

**Problem**: 3 separate copies of the same SVG paths. Changing the logo requires
editing 3 files. This violates single source of truth.

### Implementation

#### Step 1: Generate `_` (underscore) glyph path
- The current paths are Iosevka Bold outlines extracted from the font
- Need the underscore glyph path data from Iosevka Bold at same UPM scale
- Option A: Extract from Iosevka Bold font file (fonttools / opentype.js)
- Option B: Manually trace — underscore is a simple horizontal bar near the baseline

#### Step 2: Replace GT_PATH with UNDERSCORE_PATH in Logo.tsx
- Rename `GT_PATH` → `UNDERSCORE_PATH`
- Update viewBox if underscore has different width
- Verify aspect ratio still works (`size * ratio` calculation)

#### Step 3: Single source of truth for favicon/logo SVGs
- Option A: Build script that generates `favicon.svg` and `logo.svg` from Logo.tsx paths
- Option B: Public SVGs import/reference the same path data
- Option C: At minimum, add a comment in all 3 files pointing to Logo.tsx as the source

**Recommendation**: Option A — a small script in `prototype/scripts/` that writes
`public/favicon.svg` and `public/logo.svg` from the path constants in Logo.tsx.
Add to `build` step or as standalone `pnpm gen:logo`.

### Files to modify
- `prototype/src/components/common/Logo.tsx` — new underscore path
- `prototype/public/favicon.svg` — regenerated
- `prototype/public/logo.svg` — regenerated
- `prototype/scripts/` — new `gen-logo.ts` script (optional but recommended)
- `prototype/package.json` — add `gen:logo` script (if build script approach)

### Verification
1. Logo shows `#_` in MenuBar, ZenHoverBar, AboutModal, EmptyState
2. Favicon shows `#_` in browser tab
3. `logo.svg` matches
4. All 3 SVG sources are either generated or clearly linked
5. Existing Logo tests still pass (update snapshot if needed)
