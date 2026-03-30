export const welcomeMarkdown = `---
title: Welcome to mdpad
version: 0.1.0
status: development
author: zentala
---

# Welcome to mdpad ◆

A lightweight, fast Markdown viewer built for developers who work with AI-generated
specs, plans, and documentation.

---

## GFM Feature Showcase

Everything below demonstrates what mdpad renders. This is your **reference page**
for all supported Markdown features.

---

## Text Formatting

Regular text, **bold text**, *italic text*, ***bold italic***, ~~strikethrough~~,
and \`inline code\` all work as expected.

You can also combine them: ***~~bold italic strikethrough~~***

---

## Headings

All six levels of headings are supported (you're looking at H2 right now).

### H3 — Third Level
#### H4 — Fourth Level
##### H5 — Fifth Level
###### H6 — Sixth Level

---

## Links

- [Internal link to another file](.arch/ARCHITECTURE.md)
- [External link](https://github.com)
- Autolinks: https://tauri.app

---

## Lists

### Unordered
- First item
- Second item
  - Nested item A
  - Nested item B
    - Deep nested
- Third item

### Ordered
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task Lists
- [x] Market research completed
- [x] UX vision document written
- [x] Project structure bootstrapped
- [ ] Implement file tree component
- [ ] Add syntax highlighting
- [ ] Support Mermaid diagrams

---

## Blockquotes

> This is a simple blockquote.

> **Note**: Blockquotes can contain **formatted text**, \`code\`,
> and even [links](https://example.com).

> Multi-paragraph blockquote:
>
> First paragraph with important context.
>
> Second paragraph with more details.

### Nested Blockquotes

> Outer quote
> > Inner quote
> > > Even deeper

---

## Tables

### Simple Table

| Feature | Status | Priority |
|---------|--------|----------|
| File tree | Done | P0 |
| Markdown preview | Done | P0 |
| TOC panel | Done | P0 |
| Mermaid diagrams | Planned | P1 |
| Math rendering | Planned | P1 |
| Export PDF | Planned | P2 |

### Aligned Table

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Content | More content | 42 |
| Data | Data | 100 |

---

## Code Blocks

### TypeScript

\`\`\`typescript
interface MarkdownFile {
  path: string;
  content: string;
  frontmatter?: Record<string, unknown>;
}

async function loadFile(path: string): Promise<MarkdownFile> {
  const content = await readFile(path, 'utf-8');
  const { data, content: body } = parseFrontmatter(content);
  return { path, content: body, frontmatter: data };
}
\`\`\`

### Rust

\`\`\`rust
use comrak::{markdown_to_html, ComrakOptions};

fn render_markdown(input: &str) -> String {
    let mut options = ComrakOptions::default();
    options.extension.strikethrough = true;
    options.extension.table = true;
    options.extension.tasklist = true;
    markdown_to_html(input, &options)
}
\`\`\`

### Bash

\`\`\`bash
# Install and run mdpad
cargo install mdpad
mdpad .                    # Open current directory
mdpad docs/README.md       # Open specific file
mdpad --theme dark .       # Open with dark theme
\`\`\`

### JSON

\`\`\`json
{
  "name": "mdpad",
  "version": "0.1.0",
  "description": "Lightweight Tauri-based Markdown viewer",
  "tapiVersion": "2.0",
  "dependencies": {
    "comrak": "0.28",
    "notify": "7.0"
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
  font-weight: 700;
  border-bottom: 1px solid var(--border);
}
\`\`\`

### Plain Text (no language)

\`\`\`
┌──────────────────────────────────────────┐
│              Application Layout          │
│  ┌────────┬──────────────┬───────────┐  │
│  │ File   │   Markdown   │   TOC     │  │
│  │ Tree   │   Preview    │  Outline  │  │
│  └────────┴──────────────┴───────────┘  │
│  └─ Status Bar ──────────────────────┘  │
└──────────────────────────────────────────┘
\`\`\`

---

## YAML Frontmatter

This page itself has frontmatter at the top! Look at the **Properties** panel above.
Frontmatter is rendered as a styled, collapsible table with:

- Status pills (colored badges for \`status\` fields)
- Date formatting
- Collapsible toggle

---

## Horizontal Rules

Three ways to create them:

---

***

___

---

## Inline Elements

| Element | Syntax | Rendered |
|---------|--------|----------|
| Bold | \`**text**\` | **text** |
| Italic | \`*text*\` | *text* |
| Code | \`\\\`code\\\`\` | \`code\` |
| Strikethrough | \`~~text~~\` | ~~text~~ |
| Link | \`[text](url)\` | [text](#) |

---

## Images

Images are rendered inline. In the full app, drag-and-drop and paste-from-clipboard
will be supported.

---

## HTML Support

Raw HTML is supported for cases where Markdown isn't enough:

<details>
<summary>Click to expand — collapsible section</summary>

This content is hidden by default! Great for:
- FAQ sections
- Long code examples
- Optional details

\`\`\`
Hidden code block inside collapsible!
\`\`\`

</details>

<div style="padding: 12px; border-left: 4px solid #60a5fa; background: rgba(96,165,250,0.1); border-radius: 4px; margin: 12px 0;">
  <strong>💡 Custom callout via HTML</strong><br/>
  You can use raw HTML for custom styling when needed.
</div>

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle sidebar | \`Ctrl+Shift+L\` |
| Toggle outline | \`Ctrl+Shift+T\` |
| Find | \`Ctrl+F\` |
| Source mode | \`Ctrl+\\\`\` |
| Reading mode | \`Ctrl+Shift+R\` |
| New file | \`Ctrl+N\` |
| Open folder | \`Ctrl+Shift+O\` |
| Command palette | \`Ctrl+K\` |

---

## Mermaid Diagrams

### Flowchart

\`\`\`mermaid
flowchart LR
    A[Open Folder] --> B{Has .md files?}
    B -->|Yes| C[Show File Tree]
    B -->|No| D[Show Empty State]
    C --> E[Select File]
    E --> F[Render Preview]
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Tauri
    participant comrak

    User->>CLI: mdpad .
    CLI->>Tauri: Open window
    Tauri->>comrak: Parse markdown
    comrak-->>Tauri: HTML output
    Tauri-->>User: Rendered preview
\`\`\`

### Pie Chart

\`\`\`mermaid
pie title Feature Completion
    "Done" : 7
    "In Progress" : 3
    "Planned" : 11
\`\`\`

---

## GitHub Alerts

> [!NOTE]
> This is a **note** alert. Use it for additional information the reader should be aware of.

> [!TIP]
> This is a **tip** alert. Use it for helpful suggestions and best practices.

> [!IMPORTANT]
> This is an **important** alert. Use it for critical information that requires attention.

> [!WARNING]
> This is a **warning** alert. Use it to highlight potential issues or dangers.

> [!CAUTION]
> This is a **caution** alert. Use it to advise about negative consequences of an action.

---

## What's Coming Next

- [ ] **Mermaid diagrams** — flowcharts, sequence diagrams, ER diagrams
- [ ] **Math rendering** — LaTeX via KaTeX (\`$E = mc^2$\`)
- [ ] **Syntax highlighting** — full Prism.js integration with 300+ languages
- [ ] **File watcher** — auto-reload when AI agents write to your files
- [ ] **Search** — find across all files in the folder
- [ ] **Export** — PDF and standalone HTML export
- [ ] **Custom CSS** — style the preview your way
- [ ] **Command palette** — quick access to all actions

---

*Built with ❤️ using Tauri v2 + React + comrak*
`
