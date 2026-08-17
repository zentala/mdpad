# Contributing to mdpad

## Branching Model

- **`dev`** — default branch, active development
- **`main`** — production releases only (merge from dev creates a release)

## Development Setup

On a fresh clone, run `pnpm setup` from the repo root (installs the root
tooling and `prototype/` in one step: `pnpm install && pnpm -C prototype install`).

```bash
cd prototype
pnpm install
pnpm dev        # Start dev server
pnpm test       # Run tests
pnpm lint       # ESLint check
pnpm format     # Prettier check
pnpm typecheck  # TypeScript compilation check
```

Manual dev server: http://localhost:5173. Under PM3 the app is served at
http://mdpad.internal.

The desktop app runs via `pnpm tauri dev` from the repo root. Deploy of the
web demo to Cloudflare Pages runs via `pnpm -C prototype deploy`.

`examples/*` are git submodules of reference Tauri markdown editors — reference
only, optional. Run `git submodule update --init` if you want them; the build
excludes them otherwise.

## Workflow

1. Create feature branch from `dev`: `git checkout -b feat/my-feature dev`
2. Make changes, commit with [Conventional Commits](https://www.conventionalcommits.org/)
3. Push and open PR to `dev`
4. CI runs: typecheck, lint, format, test, build
5. PR title must follow Conventional Commits format

## Commit Convention

Format: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

Examples:
```
feat(prototype): add dark mode toggle
fix(markdown): resolve heading anchor links
chore(ci): update Node.js version in workflow
```

## Pre-commit Hooks

Husky runs automatically on every commit:
- **pre-commit**: ESLint + Prettier on staged files (via lint-staged)
- **commit-msg**: Conventional Commits validation (via commitlint)

## Release Process

1. All work happens on `dev` branch
2. When ready for release: bump version in `prototype/package.json`
3. Update `CHANGELOG.md` with new version section
4. Create PR from `dev` to `main`
5. On merge to `main`: GitHub Actions creates release + Docker image

## Docker (Self-hosted)

```bash
docker pull ghcr.io/zentala/mdpad:latest
docker run -p 8080:8080 ghcr.io/zentala/mdpad
```
