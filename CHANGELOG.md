# Changelog

All notable changes to mdpad will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-31

### Added
- React prototype with full markdown rendering pipeline
- GFM support (tables, task lists, strikethrough, autolinks)
- GitHub Alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- Mermaid diagram rendering (flowchart, sequence, pie, gantt, ER, state)
- Shiki syntax highlighting (17 languages, github-dark/light themes)
- KaTeX math rendering (inline and block)
- YAML frontmatter as styled property table with status pills
- 11 custom remark/rehype plugins (mark, sup/sub, wikilinks, spoiler, insert, multiline blockquote)
- File tree sidebar with Lucide icons per file type
- TOC/outline panel with scroll tracking (IntersectionObserver)
- Tab system with context menu, tooltips
- VSCode-style Activity Bar (Files, Search, Settings)
- Zen Mode (F11 distraction-free reading)
- Dark/light/sepia/auto themes (auto follows OS via matchMedia)
- Quick Open (Ctrl+P), keyboard shortcuts modal
- Floating toolbar on text selection
- Zoom control (floating widget)
- Copy code button with toast animation
- Internal link navigation
- Image lightbox with zoom
- Settings panel with localStorage persistence
- ESLint + Prettier + Husky pre-commit hooks
- CI pipeline (GitHub Actions: typecheck, lint, format, test, build)
- Cloudflare Pages deployment at mdpad.labs.zentala.agency
- Conventional Commits validation

[0.1.0]: https://github.com/zentala/mdpad/releases/tag/v0.1.0
