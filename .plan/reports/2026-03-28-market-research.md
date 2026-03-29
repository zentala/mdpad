# Market Research — Desktop Markdown Viewers

**Date**: 2026-03-28
**Epic**: [E001](../epics/E001-2026-03-28-project-bootstrap/PLAN.md)
**Task**: [E001-T01](../epics/E001-2026-03-28-project-bootstrap/tasks/E001-T01-market-research.md)

## Executive Summary

No dominant lightweight, CLI-launchable Markdown viewer exists. Existing tools are
either heavy (Electron, 100MB+), abandoned, or commercial. The Tauri niche is open —
Inkwell is closest but paywalls export and lacks cross-file search.

## Tier 1 — Mature, Widely Used

| App | Tech | License | Stars | Strengths | Weaknesses |
|-----|------|---------|-------|-----------|------------|
| **Obsidian** | Electron | Freeware | N/A | Huge plugin ecosystem, graph view, PKM | Heavy (~300MB RAM), PKM-focused not viewer |
| **Typora** | Electron | $15 | N/A | Best WYSIWYG UX, seamless inline preview | Closed source, no file tree search |
| **Mark Text** | Electron | MIT | ~55k | Free Typora clone, 33 themes | Abandoned since March 2022 |
| **Zettlr** | Electron | GPL | ~10k | Academic: BibTeX, Zotero, Zettelkasten | Niche audience, complex UI |
| **Joplin** | Electron | MIT | ~48k | Sync, encryption, plugins | Note-taking focus, not file viewer |

## Tier 2 — Specialized / Windows-first

| App | Tech | License | Strengths | Weaknesses |
|-----|------|---------|-----------|------------|
| **Markdown Monster** | .NET/WPF | Commercial | Very feature-rich, Windows-native | Windows-only, commercial |
| **ghostwriter** | Qt (C++) | GPL | Fast, native, elegant | Limited features |
| **Logseq** | Electron | AGPL ~35k | Outliner, graph, daily notes | Block-based, opinionated format |

## Tauri-Based Markdown Editors

This is a **relatively underserved niche**. Most Tauri projects are hobby or beta-stage.

### Inkwell (most complete)
- **Stack**: Tauri v2 + Rust + vanilla JS
- **Size**: ~11 MB
- **Features**: Split-pane preview, GFM, syntax highlighting (30+ langs), Mermaid, TOC, tabs, autosave, version history, image paste, focus mode, 4 themes, 10 templates
- **Model**: Free, paywall $19 for PDF/HTML export + future features
- **Status**: Active (Show HN 2025)
- **Repo**: github.com/4worlds4w-svg/inkwell

### MarkFlowy
- **Stack**: Tauri + Rust + React/Prosemirror
- **Size**: <20 MB
- **Features**: WYSIWYG + source mode, AI integration (DeepSeek, ChatGPT), custom themes
- **Status**: Beta
- **Repo**: github.com/drl990114/MarkFlowy

### Otterly
- **Stack**: Tauri + Svelte 5 + Rust
- **Features**: WYSIWYG via Milkdown/ProseMirror, wiki-links, backlinks, FTS5 search
- **Status**: Active
- **Repo**: github.com/ajkdrag/otterly

### MarkditorApp
- **Stack**: Tauri + TypeScript
- **Goal**: Open-source Typora alternative
- **Status**: WIP
- **Repo**: github.com/greyovo/MarkditorApp

## Feature Matrix — Best Apps Compared

| Feature | Typora | Obsidian | Mark Text | Zettlr | Inkwell | MM |
|---------|--------|----------|-----------|--------|---------|-----|
| File tree | YES | YES | YES | YES | YES | YES |
| Live preview (split) | NO* | YES | NO* | YES | YES | YES |
| WYSIWYG inline | YES | Opt | YES | NO | NO | NO |
| TOC / heading nav | YES | YES | YES | YES | YES | YES |
| Syntax highlight code | YES | YES | YES | YES | YES | YES |
| Mermaid diagrams | YES | YES | YES | YES | YES | plug |
| Math/LaTeX | YES | plug | YES | YES | NO | NO |
| Cross-file search | file | YES | YES | YES | NO | YES |
| Dark/light themes | YES | YES | 33! | YES | 4 | YES |
| Custom CSS | YES | YES | YES | YES | NO | YES |
| Export PDF | YES | plug | YES | YES | $$ | YES |
| CLI launch | YES | YES | YES | YES | ? | NO |
| Vim keybindings | YES | plug | NO | NO | road | NO |
| Frontmatter YAML | YES | YES | YES | YES | YES | YES |
| Image paste | YES | YES | YES | YES | YES | YES |
| Wiki-links | NO | YES | NO | YES | NO | NO |
| Tabs | NO | YES | NO | YES | YES | YES |
| Plugin system | NO | YES | NO | NO | NO | YES |

*Typora/Mark Text use inline WYSIWYG instead of split view.

## What Users Value Most

Based on HN, Reddit, reviews:

### Must-haves (deal-breakers)
1. **Speed** — preview <50ms, no typing lag
2. **Correct GFM** — tables, checkboxes, fenced code, strikethrough
3. **Syntax highlighting** — code blocks with language detection
4. **File tree** — folder browsing, not single-file
5. **No vendor lock-in** — plain .md files on filesystem

### Important
6. TOC / outline panel
7. Mermaid diagrams
8. Dark/light theme (respecting OS preference)
9. YAML frontmatter
10. Cross-file search

### Developer-specific
11. CLI launch (`app .` or `app file.md`)
12. Small installer (<15MB vs Electron 100MB+)
13. Fast startup (<0.5s)
14. Vim keybindings

### Anti-patterns (what users hate)
- Bloat and feature creep
- Required cloud sync / accounts
- Telemetry
- Subscription model
- 400MB Electron reimplementation

## Tauri Feasibility Assessment

### Tauri vs Electron

| Aspect | Electron | Tauri |
|--------|---------|-------|
| Installer size | 80-150 MB | 2-10 MB |
| RAM idle | 150-300 MB | 30-50 MB |
| Startup | 1-2s | <0.5s |
| Node.js | Required (bundled) | Not needed |
| WebView | Chromium (bundled) | System native |

### Rust Markdown Libraries

| Library | Standard | Used by |
|---------|---------|---------|
| **comrak** | CommonMark + GFM | GitLab, Deno, docs.rs |
| **pulldown-cmark** | CommonMark | mdBook, rustdoc |

**Recommendation**: comrak — full GFM, production-proven.

### Verdict
Tauri is an excellent fit. The niche is open. Inkwell proves the concept works.
Our differentiator: CLI-first, developer-focused, AI-workflow optimized.
