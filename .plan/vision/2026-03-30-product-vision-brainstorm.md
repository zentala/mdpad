# Product Vision Brainstorm — mdpad

## Date: 2026-03-30

## What mdpad IS
- Local WYSIWYG Markdown editor & viewer
- CLI tool: `mdpad file.md` opens Tauri desktop window
- Server mode: `mdpad ./docs --serve --port 3000` — HTTP file browser
- Browser mode: `mdpad file.md --browser` — opens in system browser
- AI agent rendering layer — skill for Claude Code agents to display formatted MD to users

## What mdpad is NOT
- Not a cloud service / SaaS
- Not a wiki or Notion clone
- Not an "everything editor"
- No database, no proprietary format, no login/accounts
- Not Electron (Tauri instead)
- No config required to start

## Four Operating Modes
1. `mdpad file.md` — Tauri desktop, VIEW mode
2. `mdpad file.md --edit` — Tauri desktop, EDIT mode (WYSIWYG)
3. `mdpad ./docs --serve` — HTTP file browser on server
4. `mdpad file.md --browser` — system browser

## Target Audience
Developers with VPS/homelab who:
- Have many .md files in repositories
- Want to browse them without opening full IDE
- Value CLI tools
- Don't want Obsidian on a server
- Use AI agents that generate markdown output

## Unique Angle: AI Agent Integration
No existing MD viewer/editor has AI agent integration. mdpad can serve as rendering layer:
- Agent generates report → calls mdpad skill → user sees formatted output in Tauri window
- Agent on server → mdpad --serve → returns URL for preview
- Claude Code skill for displaying markdown to users

## Name Decision
- Name: **mdpad** (lowercase, always)
- Meaning: "Markdown Notepad" — like Notepad but for MD
- Logo: `#>` (markdown heading + terminal prompt)
- Domain: mdpad.zentala.io (subdomain)
- Repo: zentala/mdpad
- Description: "Markdown editor & viewer for CLI, desktop and server"

## Competitive Landscape Summary
| Tool | Lang | GUI | WYSIWYG | File Browser | AI-ready |
|------|------|-----|---------|-------------|----------|
| grip | Python | browser | No | No | No |
| glow | Go | terminal only | No | Yes TUI | No |
| Typora | - | desktop | Yes | No | No |
| Obsidian | - | desktop | Yes plugin | No | No |
| Mark Text | - | desktop | Yes | No | No |
| Zettlr | - | desktop | Yes | No | No |
| VS Code | - | IDE | plugin | Yes | partial |
| docsify | JS | browser | No | Yes | No |
| mdbook | Rust | browser | No | Yes | No |
| **mdpad** | **TS/Rust** | **Tauri+browser** | **Yes** | **Yes** | **Yes** |

## mdpad Advantages
- Editor + viewer + file browser + AI-ready in one `npm install -g`
- Offline, no API rate limits (unlike grip's GitHub API dependency)
- Node.js ecosystem = natural AI tooling integration
- Three deployment modes (CLI, desktop, server) from single codebase
- Self-contained, zero config to start

## Marketing Strategy
- Good README on GitHub
- Post on r/selfhosted and r/commandline
- Hacker News "Show HN: mdpad — Markdown viewer for your terminal and server"
- Demo GIF: `mdpad README.md` → Tauri window opens in 1 second
