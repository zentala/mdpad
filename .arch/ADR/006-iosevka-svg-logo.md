# ADR 006: Iosevka Bold SVG Paths for Logo

- **Status**: accepted
- **Date**: 2026-03-30
- **Epic**: E003

## Context

The mdpad logo (originally `#>`, now `#_`) was rendered as text using the browser's monospace font
fallback. This meant the logo looked different across browsers and OSes depending on
installed fonts. Favicon (32px) was especially inconsistent.

## Decision

Use **Iosevka Bold** glyph outlines converted to SVG `<path>` elements. The paths are
embedded directly in a reusable `Logo` React component and in `favicon.svg` / `logo.svg`.

## Alternatives

1. **Web font loading** — Load Iosevka as a web font. Rejected: FOUT in favicon, extra
   HTTP request, font won't load in SVG favicon context.
2. **JetBrains Mono paths** — Wider glyphs, less compact logo. Iosevka is narrower,
   making the two-character logo more square/compact.
3. **Keep text rendering** — Different on every browser. Unacceptable for brand identity.

## Consequences

- Logo looks identical everywhere (browser tab, MenuBar, AboutModal, EmptyState)
- No font dependency — pure SVG paths
- `prefers-color-scheme` media query in favicon SVG adapts to OS dark/light
- Single `Logo` component with `size` and `color` props for all uses
