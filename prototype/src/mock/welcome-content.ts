/**
 * Welcome page markdown content for mdpad prototype.
 * Demonstrates every supported GFM feature with realistic mdpad documentation.
 */
export const welcomeMarkdown = `---
title: Welcome to mdpad
version: 0.1.0
status: development
author: zentala
date: 2026-03-30
tags: [markdown, viewer, tauri, developer-tools]
---

# Welcome to mdpad

A lightweight, fast Markdown viewer built with **Tauri v2** for developers who work
with AI-generated specs, plans, and documentation. Launch from your terminal, browse
any folder, and preview markdown with full GFM support.

---

## Text Formatting

Regular text, **bold text**, *italic text*, ***bold italic***, ~~strikethrough~~,
and \`inline code\` all render correctly. You can combine them freely:
***~~bold italic strikethrough~~***, **\`bold code\`**, *\`italic code\`*.

Subscript and superscript via HTML: H<sub>2</sub>O and x<sup>2</sup>.

---

## Headings

All six heading levels are supported (this section uses H2):

### H3 — Subsection
#### H4 — Topic
##### H5 — Detail
###### H6 — Fine Print

---

## Links

- [Architecture overview](.arch/ARCHITECTURE.md) — internal project link
- [Project backlog](.plan/BACKLOG.md) — planned features and ideas
- [ADR: Tauri v2 runtime](.arch/ADR/001-tauri-v2-runtime.md) — architecture decision
- [Tauri documentation](https://tauri.app) — external link
- [comrak on crates.io](https://crates.io/crates/comrak) — the parser powering mdpad
- Autolink: https://github.com/nickel-org/rust-mustache

---

## Lists

### Unordered
- File tree sidebar with folder browsing
- Live preview with instant rendering
  - GFM tables, task lists, strikethrough
  - YAML frontmatter parsing
    - Status pills with colored badges
    - Date and tag formatting
- Mermaid diagram support

### Ordered
1. Open a folder or file from the CLI
2. Browse the file tree in the sidebar
   1. Click any \`.md\` file to preview
   2. Use the outline panel for navigation
3. Toggle between reading and source mode

### Task Lists
- [x] Project structure bootstrapped
- [x] Markdown preview with comrak
- [x] File tree sidebar component
- [x] TOC outline panel
- [x] YAML frontmatter display
- [ ] Mermaid diagram rendering
- [ ] Full-text search across files
- [ ] PDF and HTML export

---

## Tables

### Feature Status

| Feature | Status | Priority | Module |
|---------|--------|----------|--------|
| File tree | Done | P0 | sidebar |
| Markdown preview | Done | P0 | preview |
| TOC panel | Done | P0 | outline |
| Frontmatter display | Done | P0 | preview |
| Dark/light theme | Done | P1 | shell |
| Mermaid diagrams | Planned | P1 | preview |
| Search | Planned | P1 | search |
| Export PDF/HTML | Planned | P2 | export |

### Column Alignment

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Tauri v2 | Rust + WebView | 15 MB |
| comrak | GFM-compatible | 0.28 |
| React | TypeScript | 18.3 |

---

## Code Blocks

### TypeScript

\`\`\`typescript
interface MarkdownFile {
  path: string;
  content: string;
  frontmatter?: Record<string, unknown>;
}

async function loadMarkdown(path: string): Promise<MarkdownFile> {
  const raw = await invoke<string>('read_file', { path });
  const { data, content } = parseFrontmatter(raw);
  return { path, content, frontmatter: data };
}
\`\`\`

### Rust

\`\`\`rust
use comrak::{markdown_to_html, Options};

/// Renders GFM markdown to HTML with all extensions enabled.
pub fn render(input: &str) -> String {
    let mut opts = Options::default();
    opts.extension.strikethrough = true;
    opts.extension.table = true;
    opts.extension.tasklist = true;
    opts.extension.autolink = true;
    markdown_to_html(input, &opts)
}
\`\`\`

### Bash

\`\`\`bash
# Install and launch mdpad
cargo install mdpad
mdpad .                    # Open current directory
mdpad docs/README.md       # Open a specific file
mdpad --theme dark .plan/  # Dark theme on a subfolder
\`\`\`

### JSON

\`\`\`json
{
  "name": "mdpad",
  "version": "0.1.0",
  "description": "Lightweight Tauri-based Markdown viewer",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "tauri": "tauri"
  }
}
\`\`\`

### CSS

\`\`\`css
:root {
  --bg-primary: #1a1b1e;
  --text-primary: #e1e2e5;
  --accent: #60a5fa;
  --font-mono: 'JetBrains Mono', monospace;
}

.markdown-preview h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.3em;
}
\`\`\`

### Python

\`\`\`python
import subprocess
from pathlib import Path

def find_markdown_files(root: Path) -> list[Path]:
    """Recursively find all .md files under root."""
    return sorted(
        p for p in root.rglob("*.md")
        if not any(part.startswith(".") for part in p.parts)
    )
\`\`\`

---

## Mermaid Diagrams

### Application Architecture

\`\`\`mermaid
flowchart LR
    CLI[CLI Entry] --> Tauri[Tauri Shell]
    Tauri --> FileSystem[File System API]
    Tauri --> WebView[WebView Frontend]
    FileSystem --> Watcher[File Watcher]
    WebView --> Parser[comrak Parser]
    WebView --> Mermaid[Mermaid Renderer]
    WebView --> Highlight[Syntax Highlighter]
\`\`\`

### User Flow

\`\`\`mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Tauri
    participant comrak

    User->>CLI: mdpad ./docs
    CLI->>Tauri: Open window with path
    Tauri->>Tauri: Scan directory tree
    Tauri-->>User: Show file tree sidebar
    User->>Tauri: Click README.md
    Tauri->>comrak: Parse markdown to HTML
    comrak-->>Tauri: Rendered HTML
    Tauri-->>User: Display preview
\`\`\`

### Feature Completion

\`\`\`mermaid
pie title Development Progress
    "Completed" : 7
    "In Progress" : 3
    "Planned" : 11
\`\`\`

---

## GitHub Alerts

> [!NOTE]
> mdpad uses **comrak** for parsing — the same engine that powers GitHub and GitLab rendering.

> [!TIP]
> Press \`Ctrl+Shift+L\` to toggle the file tree sidebar and maximize your reading area.

> [!IMPORTANT]
> Frontmatter must be valid YAML and appear at the very top of the file, delimited by \`---\`.

> [!WARNING]
> Files larger than 1 MB may experience slower rendering. Consider splitting large documents.

> [!CAUTION]
> Do not edit files through mdpad while another process holds a write lock — changes may be lost.

---

## Blockquotes

> A simple blockquote with a single thought.

> **Design principle**: mdpad should open instantly, render faithfully, and stay out of the way.
> Every feature must justify its impact on startup time and memory footprint.

> Multi-paragraph blockquote:
>
> The first paragraph sets context about the problem space.
>
> The second paragraph elaborates with specific constraints and trade-offs.

### Nested Blockquotes

> Outer context
> > Inner detail
> > > Deep clarification

---

## Images

![Wide landscape demo](https://picsum.photos/800/400)

A smaller inline image for visual variety:

![Square thumbnail](https://picsum.photos/200/200)

---

## HTML Support

<details>
<summary>Click to expand — mdpad rendering pipeline</summary>

The rendering pipeline processes markdown in three stages:

1. **Parse** — comrak converts GFM to an AST
2. **Transform** — frontmatter extraction, Mermaid detection, link rewriting
3. **Render** — AST to HTML, syntax highlighting, diagram rendering

\`\`\`
Input (.md) -> comrak AST -> Transform -> HTML -> WebView
\`\`\`

</details>

<div style="padding: 12px; border-left: 4px solid #60a5fa; background: rgba(96,165,250,0.1); border-radius: 4px; margin: 12px 0;">
  <strong>Custom HTML callout</strong><br/>
  Raw HTML is supported for cases where standard Markdown syntax is not enough.
</div>

---

## Inline Elements Reference

| Element | Syntax | Rendered |
|---------|--------|----------|
| Bold | \`**text**\` | **text** |
| Italic | \`*text*\` | *text* |
| Bold italic | \`***text***\` | ***text*** |
| Inline code | \`\\\`code\\\`\` | \`code\` |
| Strikethrough | \`~~text~~\` | ~~text~~ |
| Link | \`[text](url)\` | [text](#) |
| Image | \`![alt](url)\` | (see above) |

---

## Horizontal Rules

Three equivalent syntaxes:

---

***

___

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle sidebar | \`Ctrl+Shift+L\` |
| Toggle outline | \`Ctrl+Shift+T\` |
| Find in file | \`Ctrl+F\` |
| Source mode | \`Ctrl+\\\`\` |
| Reading mode | \`Ctrl+Shift+R\` |
| Open folder | \`Ctrl+Shift+O\` |
| Command palette | \`Ctrl+K\` |
| Zoom in | \`Ctrl+=\` |
| Zoom out | \`Ctrl+-\` |

---

## What's Coming Next

- [ ] **Mermaid diagrams** — flowcharts, sequence, ER, pie charts
- [ ] **Math rendering** — LaTeX via KaTeX (\`$E = mc^2$\`)
- [ ] **Full-text search** — find across all files in the folder
- [ ] **File watcher** — auto-reload when files change on disk
- [ ] **Export** — PDF and standalone HTML output
- [ ] **Custom CSS** — style the preview with your own theme
- [ ] **Command palette** — quick access to every action
- [ ] **Tab support** — open multiple files side by side

---

*Built with Tauri v2 + React + comrak*
`;
