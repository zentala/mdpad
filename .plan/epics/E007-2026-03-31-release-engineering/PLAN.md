# E007 — Release Engineering & CI/CD

## What
Set up professional CI/CD pipeline, branching model, release automation, and self-hosted distribution for mdpad.

## Why
mdpad has no CI tests, no linting, no releases, and no way to distribute the app beyond GitHub Pages. To become a real product, it needs automated quality gates and multiple distribution channels.

## Scope
- ESLint + Prettier + typecheck pipeline
- GitHub Actions CI (test/lint/format/build on PR)
- Dev/main branching model
- Husky pre-commit hooks
- Semver versioning (v0.1.0)
- GitHub Releases with web build artifacts
- Docker image for self-hosted deployment

## Out of Scope
- Tauri desktop builds (E008)
- semantic-release automation (manual versioning for v0.x)
- Branch protection requiring reviews (solo dev)

## Acceptance Criteria
- [ ] `pnpm lint && pnpm format && pnpm typecheck && pnpm test` all pass
- [ ] CI runs on every PR to dev/main
- [ ] Husky blocks commits with lint errors
- [ ] Merge to main creates GitHub Release with web zip
- [ ] Docker image serves mdpad with custom content via volume mount
- [ ] CONTRIBUTING.md documents the workflow

## Test Strategy
- E007 is infrastructure — verified by CI pipeline passing on real PRs
- Docker verified by building and running locally
- Pre-commit hooks verified by attempting a bad commit
