# Journal — E005: Website Deploy

## Session 2026-03-30 08:00

- **Goal**: Deploy mdpad prototype to mdpad.zentala.io as live demo + docs site
- **Done**:
  - E005-T01: Build content script — scans repo, generates TS files (f867cdf)
  - E005-T02: Rename Welcome.md → REFERENCE.md (37bd476)
  - E005-T03: Wire generated content with mock fallback (c56aace)
  - E005-T04: Vite config for GitHub Pages + meta tags (7fc9d4c)
  - E005-T05: GitHub Actions deploy workflow (6c9c94e)
  - E005-T06: GitHub Pages config via `gh` CLI + Cloudflare DNS CNAME (manual)
  - E005-T07: README rewrite — features table, 3 modes, tech stack, logo (3261f1f)
  - Sidebar redesign: tabs moved to right side, uppercase, border merge (3c66521, 9d1621b)
  - Product vision brainstorm saved to .plan/vision/ (80b88dd)
  - Competitive research extended (docsify, grip, glow, Nimbalyst)
  - Logo SVG + favicon created (e934d79)
  - Removed welcome-content.ts mock, fixed build-content types (ff8e594)
  - Cleanup: removed screenshots from git (eaf5a8a)
  - 6 E004 bugs logged to backlog
  - Backlog cleanup (StackEdit duplicate removed)
- **Decisions**: REFERENCE.md is single source of truth (no more welcome-content.ts mock)
- **Findings this session**: 5 (build-content _childMap hack, theme not persisted, favicon missing, backlog duplicates, screenshots leaked to git)
- **Improvements logged**: all findings resolved or added to backlog
- **Next**:
  1. HTTPS enforcement (waiting for GitHub cert generation)
  2. Settings tab planning (what settings, localStorage persistence)
  3. Theme persistence in localStorage
  4. E004 bug fixes (subscript, multiline blockquote, wiki-links)
  5. Unified SVG logo usage across all components
