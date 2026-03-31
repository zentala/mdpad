# E007 — Orchestrator

## Wave 0: Linting & Formatting Setup
- [x] **E007-T01** — Add ESLint with flat config
- [x] **E007-T02** — Add Prettier
- [x] **E007-T03** — Add standalone typecheck script

## Wave 1: CI Pipeline (depends on Wave 0)
- [x] **E007-T04** — Create CI workflow (.github/workflows/ci.yml)
- [x] **E007-T05** — Add Conventional Commits validation (parallel with T04)

## Wave 2: Branching & Pre-commit Hooks
- [x] **E007-T06** — Create dev branch, set as GitHub default
- [x] **E007-T07** — Configure Husky + lint-staged + commitlint

## Wave 3: Versioning & Release Workflow
- [x] **E007-T08** — Initialize versioning (v0.1.0 + CHANGELOG.md)
- [x] **E007-T09** — Create release workflow

## Wave 4: Docker Self-hosted
- [x] **E007-T10** — Create Dockerfile + entrypoint
- [x] **E007-T11** — Add Docker build to release workflow

## Wave 5: Documentation
- [x] **E007-T12** — Update README.md + CLAUDE.md + CONTRIBUTING.md

## Merge Order
Sequential: T01 → T02 → T03 → T04/T05 → T06/T07 → T08 → T09 → T10 → T11 → T12
