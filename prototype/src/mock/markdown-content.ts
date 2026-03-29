import { welcomeMarkdown } from './welcome-content'

export const mockMarkdownFiles: Record<string, string> = {
  'Welcome.md': welcomeMarkdown,
  'README.md': `---
id: zntl-md
status: development
created: 2026-03-28
owner: zentala
---

# zntl-md

Lightweight Tauri-based Markdown viewer for developers.

Browse project folders, preview Markdown files with full GFM support, Mermaid diagrams,
YAML frontmatter, and syntax-highlighted code blocks. Designed for AI-augmented dev workflows.

## Features (planned)

- [x] CLI launch: \`zntl-md .\` or \`zntl-md README.md\`
- [x] File tree sidebar
- [ ] TOC / heading navigation
- [ ] GFM rendering (tables, task lists, strikethrough)
- [ ] Mermaid diagrams
- [ ] YAML frontmatter display
- [ ] Code block syntax highlighting

## Tech Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Runtime | Tauri v2 | Small binary (~10MB), native WebView |
| Parser | comrak | Full GFM, used by GitLab, Deno |
| Frontend | React | Rich ecosystem, TypeScript support |
| Diagrams | Mermaid.js | De facto standard |

## Quick Start

\`\`\`bash
# Install
cargo install zntl-md

# Open current folder
zntl-md .

# Open specific file
zntl-md docs/README.md
\`\`\`

## Architecture

\`\`\`typescript
interface AppConfig {
  theme: 'dark' | 'light' | 'sepia';
  fontSize: number;
  showHiddenFiles: boolean;
  autoReload: boolean;
}

function createApp(config: AppConfig): void {
  const watcher = new FileWatcher(config.autoReload);
  const parser = new ComrakParser();
  const renderer = new MarkdownRenderer(parser);

  renderer.mount('#app');
  watcher.start();
}
\`\`\`

> **Note**: This project is in early development. The architecture above
> represents the planned design, not the current implementation.

## Documentation

- [Architecture](.arch/ARCHITECTURE.md)
- [Backlog](.plan/BACKLOG.md)
- [Market Research](.plan/reports/2026-03-28-market-research.md)

## License

MIT
`,

  '.plan/epics/E001-project-bootstrap/PLAN.md': `---
id: E001
status: done
created: 2026-03-28
completed: 2026-03-28
---

# E001 — Project Bootstrap

## What

Set up zntl-md project: research market, define UX vision, bootstrap project structure,
add reference examples.

## Why

Before writing code, we need clear understanding of the competitive landscape,
a detailed UX specification, and properly structured project files.

## Acceptance Criteria

- [x] Market research report written and linked
- [x] UX vision document with all menus, panels, shortcuts defined
- [x] Project structure bootstrapped
- [x] Example repos added as submodules
- [x] All docs linked in documentation tree (no orphans)

## Tasks

| ID | Status | Description |
|----|--------|-------------|
| E001-T01 | done | Market research |
| E001-T02 | done | UX vision document |
| E001-T03 | done | Add example submodules |
`,

  '.arch/ARCHITECTURE.md': `# Architecture — zntl-md

## Overview

zntl-md is a lightweight desktop Markdown viewer built with Tauri v2.

\`\`\`
┌──────────────────────────────────────────┐
│              Tauri Window                │
│  ┌────────┬──────────────┬───────────┐  │
│  │ File   │   Markdown   │   TOC     │  │
│  │ Tree   │   Preview    │  Outline  │  │
│  └────────┴──────────────┴───────────┘  │
│  └─ Status Bar ──────────────────────┘  │
└──────────────────────────────────────────┘
\`\`\`

## Key ADRs

- [ADR 001 — Tauri v2 Runtime](ADR/001-tauri-v2-runtime.md)
- [ADR 002 — comrak Parser](ADR/002-comrak-parser.md)
`,

  'CLAUDE.md': `---
type: project-config
lifecycle: experimental
---

# zntl-md — Tauri Markdown Viewer

## Purpose

Lightweight desktop Markdown viewer for developers who work with AI-generated specs.

## Conventions

- Follow global CLAUDE.md conventions (LF, pnpm, TypeScript)
- Rust: no unwrap() in production, doc comments on pub fn
- Files ≤ 250 lines, functions ≤ 50 lines
`,
}

export const defaultFile = 'Welcome.md'
