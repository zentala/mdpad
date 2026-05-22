---
status: pending
created: 2026-03-30
title: E005 — Website Deploy (mdpad.zentala.io)
---

# E005 — Website Deploy (mdpad.zentala.io)

## What

Deploy the prototype as a GitHub Pages site at `mdpad.zentala.io`.
The deployed app displays the repository's own markdown files, serving
simultaneously as product demo and project documentation.

## Why

mdpad has no public presence. Deploying the prototype itself as the website
solves two problems at once:
1. Visitors see the product in action (live demo)
2. Project docs (README, architecture, plans) are browsable without cloning

No server needed. Static site, GitHub Pages, zero ongoing cost.

## Scope

### In scope
- Build script that reads real `.md` files from the repo and generates mock data
- Vite config for GitHub Pages (base path, SPA routing)
- GitHub Actions workflow for automated deploy on push to main
- Cloudflare DNS CNAME for `mdpad.zentala.io`
- README.md rewrite for the website landing experience
- Rename `Welcome.md` to `REFERENCE.md` (markdown feature showcase)

### Out of scope
- Editing capabilities on the deployed site
- Server-side rendering
- Search indexing / SEO beyond basic meta tags
- Custom 404 page design (use SPA redirect trick)
- Analytics (can be added later via Cloudflare)

## Constraints

- The prototype uses hardcoded mock data in `prototype/src/mock/`
- The `FileNode` type and `mockMarkdownFiles` record are the integration points
- The build-content script must produce files matching these exact interfaces
- GitHub Pages serves from `gh-pages` branch or `/docs` folder (we use `gh-pages` branch via Actions)
- SPA routing requires a `404.html` that redirects to `index.html`

## Acceptance Criteria

- [ ] `mdpad.zentala.io` loads the prototype app in a browser
- [ ] File tree shows actual repo `.md` files (not hardcoded mock data)
- [ ] README.md is the default file shown on page load
- [ ] REFERENCE.md (renamed Welcome.md) is accessible and shows full markdown feature showcase
- [ ] Pushing to `main` triggers automatic redeploy
- [ ] All existing prototype features work (tabs, outline, themes, search, editor modes)
- [ ] Build completes in under 2 minutes on GitHub Actions

## Architecture Decisions

### Content generation at build time (not runtime)

The build script reads `.md` files from the repo and generates TypeScript source files
that replace the mock data. This means:
- No fetch calls at runtime, no CORS, no loading states
- Content is baked into the JS bundle (acceptable — markdown files are small)
- File tree structure is computed at build time
- Tradeoff: bundle size grows with repo content. For our repo (~50 .md files, ~200KB text)
  this adds negligible overhead

### GitHub Pages over Cloudflare Pages

GitHub Pages is simpler for a repo that wants to deploy itself:
- No separate project to configure
- Built-in GitHub Actions integration
- Custom domain via CNAME file + Cloudflare DNS
- Cloudflare Pages would require a separate build config and repo connection

### File filtering strategy

The build script includes:
- All `.md` files from repo root, `.arch/`, `.plan/` (recursively)
- `catalog-info.yaml` (shown as read-only)
- Excludes: `node_modules/`, `.git/`, `examples/` (submodules), `prototype/` (meta-circular)

### SPA routing via 404.html

GitHub Pages doesn't support SPA routing natively. The standard workaround:
- Copy `index.html` to `404.html` in the build output
- GitHub Pages serves `404.html` for any unknown path
- The SPA router takes over and resolves the route client-side

## Test Strategy

### Unit tests
- `build-content.ts`: test file discovery, tree building, content reading
- Test that generated output matches `FileNode[]` and `Record<string, string>` types
- Test file filtering (excludes node_modules, .git, examples, prototype)
- Test path normalization (Windows backslashes to forward slashes)

### Integration tests
- Full build pipeline: run build-content, then vite build, verify dist/ output
- Verify generated mock data is valid TypeScript that imports correctly

### E2E tests (post-deploy)
- Load `mdpad.zentala.io` in browser
- Verify file tree renders
- Click README.md, verify content appears
- Navigate to `.arch/ARCHITECTURE.md` via file tree
- Verify REFERENCE.md renders with all markdown features

### Coverage targets
- `build-content.ts` utilities: 100% (pure functions)
- Overall build pipeline: smoke test (build succeeds, dist/ has expected files)

## Dependencies

- Cloudflare DNS access (user owns zentala.io)
- GitHub repo settings: Pages enabled, custom domain configured
- Repo must be public (or GitHub Pages Pro) for custom domain
