---
id: E005
status: planned
created: 2026-03-30
---

# E005 — Orchestrator

## Wave 1: Content Build Script (foundation — everything depends on this)

### E005-T01: Build content script
**Files**: `prototype/scripts/build-content.ts`
**Deps**: none

Create a TypeScript script that:

1. **Scans the repo** from project root (`../` relative to prototype/) for `.md` files
   - Include: repo root `*.md`, `.arch/**/*.md`, `.plan/**/*.md`, `catalog-info.yaml`
   - Exclude: `node_modules/`, `.git/`, `examples/`, `prototype/`, `.claude/`
   - Use `fs.readdirSync` recursive or glob — no runtime deps beyond Node built-ins

2. **Builds FileNode tree** matching the `FileNode` interface:
   ```typescript
   interface FileNode {
     name: string
     path: string
     type: 'file' | 'folder'
     children?: FileNode[]
     extension?: string
   }
   ```
   - Sort: folders first, then files, alphabetical within each group
   - Compute `extension` from filename
   - Paths use forward slashes (normalize on Windows)

3. **Reads file contents** into a `Record<string, string>` keyed by path
   - Read each `.md` file as UTF-8 string
   - Read `catalog-info.yaml` as string too

4. **Outputs two generated files**:
   - `prototype/src/generated/file-tree.ts` — exports `generatedFileTree: FileNode[]`
   - `prototype/src/generated/markdown-content.ts` — exports `generatedMarkdownFiles: Record<string, string>` and `defaultFile: string` (set to `'README.md'`)
   - Both files start with `// AUTO-GENERATED — do not edit manually`
   - Content strings use template literals with proper escaping (backticks, `${`)

5. **Add to .gitignore**: `prototype/src/generated/`

6. **Add npm script**: `"build:content": "tsx scripts/build-content.ts"`
   - Requires `tsx` as devDependency for running TypeScript scripts

**Verification**:
- Run `pnpm build:content` from prototype/
- Verify `src/generated/file-tree.ts` contains actual repo files
- Verify `src/generated/markdown-content.ts` contains actual file contents
- Verify README.md is present, Welcome.md is NOT (it doesn't exist in repo root)

---

### E005-T02: Rename Welcome.md to REFERENCE.md
**Files**: `prototype/src/mock/welcome-content.ts`, `prototype/src/mock/markdown-content.ts`, `prototype/src/mock/file-tree.ts`, any component referencing `Welcome.md`
**Deps**: none (parallel with T01)

1. Rename all references from `Welcome.md` to `REFERENCE.md`
2. Update the welcome-content.ts heading from "Welcome to mdpad" to "Markdown Feature Reference"
3. Update file tree mock to show `REFERENCE.md` instead of `Welcome.md`
4. Update `defaultFile` in mock from `'Welcome.md'` to `'README.md'`
5. Create actual `REFERENCE.md` file in repo root with the showcase content
   (this file will be picked up by the build-content script in production)

**Verification**:
- `pnpm dev` — app loads, shows REFERENCE.md in file tree
- Default file is now README.md (mock version)
- REFERENCE.md still shows all markdown features when clicked

---

## Wave 2: Wire generated content + Vite config (depends on Wave 1)

### E005-T03: Switch from mock to generated data with fallback
**Files**: `prototype/src/mock/index.ts` (new), imports in components
**Deps**: T01, T02

1. Create `prototype/src/mock/index.ts` as the single import point:
   ```typescript
   // Try generated content first (exists after build:content), fall back to mock
   let fileTree: FileNode[]
   let markdownFiles: Record<string, string>
   let defaultFilePath: string

   try {
     const gen = await import('@/generated/file-tree')
     const genContent = await import('@/generated/markdown-content')
     fileTree = gen.generatedFileTree
     markdownFiles = genContent.generatedMarkdownFiles
     defaultFilePath = genContent.defaultFile
   } catch {
     // Generated files don't exist yet (dev mode without build:content)
     fileTree = mockFileTree
     markdownFiles = mockMarkdownFiles
     defaultFilePath = 'README.md'
   }

   export { fileTree, markdownFiles, defaultFilePath }
   ```
   - Alternative approach (simpler, recommended): use Vite's `import.meta.glob` or
     conditional import via env variable `VITE_USE_GENERATED=true`
   - Or: build:content always runs before both dev and build, making generated files
     always available. Then mock files become dev-only fallback.

2. Update all component imports to use `@/mock` (the index barrel) instead of
   direct imports from `@/mock/file-tree` and `@/mock/markdown-content`

3. Decision on approach: the simplest path is to make `build:content` part of the
   dev script too: `"dev": "tsx scripts/build-content.ts && vite"`. Then generated
   files always exist. Mock files become a safety net only.

**Verification**:
- `pnpm build:content && pnpm dev` — app shows real repo files
- Deleting `src/generated/` and running `pnpm dev` (without build:content) — app falls back to mock data
- All features work with generated data (tabs, outline, themes, search)

---

### E005-T04: Vite config for GitHub Pages
**Files**: `prototype/vite.config.ts`
**Deps**: none (parallel with T03, but in same wave for logical grouping)

1. Add `base` config for GitHub Pages:
   - If deploying to `mdpad.zentala.io` (custom domain), base is `/`
   - If deploying to `zentala.github.io/mdpad/`, base is `/mdpad/`
   - Use env variable: `base: process.env.GITHUB_PAGES ? '/mdpad/' : '/'`
   - With custom domain, base stays `/` — simpler

2. Ensure build output goes to `dist/` (default, already correct)

3. Add SPA routing support:
   - Post-build step: copy `dist/index.html` to `dist/404.html`
   - Add to build script or as vite plugin

4. Add meta tags plugin or manual `index.html` updates:
   - `<title>mdpad — Markdown Viewer</title>`
   - `<meta name="description" content="Lightweight markdown viewer for developers">`
   - Open Graph tags for link previews

**Verification**:
- `pnpm build` produces `dist/` with `index.html` and `404.html`
- `pnpm preview` — app works at localhost
- No broken asset paths in built output

---

## Wave 3: GitHub Actions + DNS (depends on Wave 2)

### E005-T05: GitHub Actions deploy workflow
**Files**: `.github/workflows/deploy.yml` (repo root, NOT prototype/)
**Deps**: T01, T03, T04

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # manual trigger

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: false  # don't need examples/

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          cache-dependency-path: prototype/pnpm-lock.yaml

      - name: Install dependencies
        working-directory: prototype
        run: pnpm install --frozen-lockfile

      - name: Generate content from repo
        working-directory: prototype
        run: pnpm build:content

      - name: Build
        working-directory: prototype
        run: pnpm build

      - name: Copy 404.html for SPA routing
        run: cp prototype/dist/index.html prototype/dist/404.html

      - name: Add CNAME for custom domain
        run: echo "mdpad.zentala.io" > prototype/dist/CNAME

      - uses: actions/upload-pages-artifact@v3
        with:
          path: prototype/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Key details:
- Uses `actions/deploy-pages` (not push to gh-pages branch) — modern approach
- `CNAME` file written into dist/ for custom domain persistence
- `submodules: false` — examples/ not needed for website build
- Working directory set to `prototype/` for all build steps
- `pnpm-lock.yaml` must exist (run `pnpm install` locally first if missing)

**Verification**:
- Push to main triggers the workflow
- Workflow completes successfully
- Site is accessible at the GitHub Pages URL

---

### E005-T06: Cloudflare DNS + GitHub Pages custom domain
**Files**: none (external configuration)
**Deps**: T05

1. **Cloudflare DNS**: Add CNAME record
   - Name: `mdpad`
   - Target: `zentala.github.io`
   - Proxy status: DNS only (orange cloud OFF) — GitHub Pages needs direct DNS
   - TTL: Auto

2. **GitHub repo settings**:
   - Settings → Pages → Source: GitHub Actions
   - Custom domain: `mdpad.zentala.io`
   - Enforce HTTPS: checked (GitHub provides free cert)

3. **Verify**: `dig mdpad.zentala.io` returns `zentala.github.io` CNAME
4. **Verify**: `curl -I https://mdpad.zentala.io` returns 200

**Verification**:
- `https://mdpad.zentala.io` loads the app
- HTTPS works (no cert warnings)
- HTTP redirects to HTTPS

---

## Wave 4: README + polish (depends on Wave 3)

### E005-T07: Write README.md for the website
**Files**: `README.md` (repo root)
**Deps**: T06 (need live URL for "try it now" link)

The README is the first thing users see on `mdpad.zentala.io`. Structure:

1. **Hero section**: project name, one-line description, badges
   - "Try it now — you're already using it!" callout
2. **What is mdpad**: 2-3 sentences, who it's for
3. **Features**: checklist of what works today vs planned
4. **Screenshots/GIFs**: skip for now, add placeholder text
5. **Installation**: `cargo install mdpad` (planned, not yet available)
6. **Quick start**: `mdpad .` / `mdpad README.md`
7. **Tech stack**: table (Tauri, comrak, React)
8. **Documentation links**: architecture, backlog, vision
9. **Contributing**: basic guidelines
10. **License**: MIT

Keep it concise. The app itself IS the documentation browser — link to
other docs via relative paths (they're clickable in the app).

**Verification**:
- README.md renders well in both GitHub and mdpad
- All relative links resolve in the deployed app
- No broken images or dead links

---

## Summary

| Wave | Tasks | Parallel? | Estimated effort |
|------|-------|-----------|-----------------|
| 1 | T01 (build script), T02 (rename Welcome→REFERENCE) | Yes | 2-3 hours |
| 2 | T03 (wire generated data), T04 (vite config) | Partial | 1-2 hours |
| 3 | T05 (GitHub Actions), T06 (DNS config) | Sequential | 1 hour |
| 4 | T07 (README rewrite) | Single task | 1 hour |

Total: ~5-7 hours of implementation.

## Progress

- [x] E005-T01 — Build content script
- [x] E005-T02 — Rename Welcome.md to REFERENCE.md
- [x] E005-T03 — Wire generated content with fallback
- [x] E005-T04 — Vite config for GitHub Pages
- [x] E005-T05 — GitHub Actions deploy workflow
- [x] E005-T06 — Cloudflare DNS + GitHub Pages config
- [x] E005-T07 — Write README.md for the website

## Status: 7/7 done. Epic complete.
