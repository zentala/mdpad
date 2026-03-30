# Contributing to mdpad

## Branching Model

- **`dev`** — default branch, active development
- **`main`** — production releases only (merge from dev creates a release)

## Development Setup

```bash
cd prototype
pnpm install
pnpm dev        # Start dev server at http://localhost:3456
pnpm test       # Run tests
pnpm lint       # ESLint check
pnpm format     # Prettier check
pnpm typecheck  # TypeScript compilation check
```

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
