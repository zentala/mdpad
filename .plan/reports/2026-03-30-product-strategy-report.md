# mdpad — Product Strategy & UX Research Report

**Date**: 2026-03-30
**Linked from**: [Backlog](../BACKLOG.md), [Architecture](../../.arch/ARCHITECTURE.md)

---

## Part 1: Use Cases and Target Audiences

### Persona 1 — The AI-Augmented Solo Developer ("the main target")

**Profile**: Senior developer, 5+ years experience, works heavily with AI tools (Claude Code,
Cursor, GitHub Copilot). Keeps all project context in markdown: `.plan/`, `.arch/`, ADRs,
ORCHESTRATOR.md files. Uses CLI as primary interface.

**Triggers for opening mdpad**:
- Starting a work session: `mdpad .` from project root to review what's in progress
- Reviewing AI-generated specs before approving them
- Reading ADRs to understand why a past decision was made
- Checking epic PLAN.md while implementing a task

**What they DO in the app**:
- Open a folder of 20-50 markdown files, browse them quickly
- Jump between BACKLOG.md, ORCHESTRATOR.md, task files non-linearly
- Read Mermaid architecture diagrams without exporting them
- Reference a task spec in one tab while coding in their editor

**Pain points solved vs alternatives**:
- VS Code: heavyweight, distracting with language server popups, splits focus from actual coding
- Obsidian: PKM-focused, wants you to live inside it, slow to spin up for quick lookups
- Terminal cat/bat: no rendering, no navigation, no diagrams

**Aha moment**: `mdpad .` in a project root, file tree loads in <0.3s, Mermaid diagram
renders inline, Ctrl+P opens the exact file needed in two keystrokes. No Electron bloat, no
account required, no telemetry phone-home. "This is what I wanted all along."

---

### Persona 2 — The Technical Writer / Documentation Owner

**Profile**: Developer advocate, technical writer, or team lead who owns team documentation.
Writes in VS Code but previews in browser or awkward preview panes. Maintains READMEs,
runbooks, onboarding docs for 5-15 person teams.

**Triggers**:
- Reviewing a PR that touches documentation
- Doing a "docs audit" session before a release
- Creating onboarding materials and wanting to see exactly what new team members will see

**What they DO**:
- Navigate between related docs to check consistency
- Verify that tables render correctly, images load, code blocks have the right language tag
- Export to HTML for sharing with non-developers

**Pain points solved**:
- GitHub's web renderer: requires pushing first, slow feedback loop, no offline work
- VS Code preview: fine but split-pane eats screen real estate on laptop
- Typora: $15, no cross-file search, no folder context

**Aha moment**: opening a repo folder and seeing ALL docs as a navigable tree, then finding
a broken cross-reference via search in under 10 seconds. "I can do a full docs audit without
touching the browser or IDE."

---

### Persona 3 — The Open Source Maintainer

**Profile**: Maintains 3-8 GitHub repos, writes thorough READMEs, CHANGELOGs, CONTRIBUTING
guides. Reads other projects' docs when evaluating dependencies.

**Triggers**:
- Evaluating a dependency: `git clone <repo> && mdpad .` to read docs offline
- Writing release notes: wants to preview CHANGELOG.md as it will appear on GitHub
- Reviewing contributor PRs that include documentation

**What they DO**:
- Quick pass over README to check visual structure
- Navigate to specific sections via TOC
- Copy code block examples to test them

**Pain points solved**:
- GitHub-flavored preview requires network and browser context switching
- Need to see tables, task lists, and code blocks exactly as GitHub renders them

**Aha moment**: `git clone + mdpad .` replaces an entire "open GitHub in browser" workflow.
Offline, instant, pixel-accurate GFM rendering.

---

### Persona 4 — The Architecture Reviewer

**Profile**: Tech lead or senior engineer who reviews system design docs, RFCs, and ADRs
before approvals. Spends significant time reading rather than writing.

**Triggers**:
- RFC review in a design meeting (needs a good display interface, not raw markdown)
- Async review of an architecture proposal shared as a git repo
- Looking up a past ADR to understand a constraint

**What they DO**:
- Read long documents with complex Mermaid diagrams
- Navigate via TOC to specific sections
- Occasionally annotate (copy section, paste into comments elsewhere)

**Pain points solved**:
- Reading raw markdown in GitHub is tolerable but Mermaid diagrams are invisible
- Sharing a "read-only rendered view" of a spec requires exporting to PDF or Notion

**Aha moment**: clicking a Mermaid architecture diagram and seeing it render perfectly
in-app, then using the TOC to jump between the rationale, alternatives, and decision sections
in a long ADR. "This is better than reading on GitHub."

---

### Persona 5 — The AI Workflow Engineer / Prompt Writer

**Profile**: Works on AI agent systems, writes elaborate system prompts, CLAUDE.md files,
and workflow specifications in markdown. Files contain YAML frontmatter, nested lists,
code blocks with custom languages, and tables.

**Triggers**:
- Reviewing a CLAUDE.md or AGENTS.md before deploying an agent
- Iterating on a prompt engineering spec with structured formatting
- Checking that YAML frontmatter in a STATE.md file is rendering correctly

**What they DO**:
- Read files with mixed content: YAML blocks, bash commands, tables, nested lists
- Switch between multiple related files rapidly (hooks.md, branching.md, workflows.md)
- Need YAML frontmatter rendered as a styled table, not raw text

**Pain points solved**:
- No existing tool handles YAML frontmatter elegantly in a folder-browse context
- AI workflow files often have complex nested structures that render poorly in simple viewers

**Aha moment**: YAML frontmatter rendered as clean property table at document top, with
status pills (like "production", "experimental") visually distinct. The file structure
finally matches the mental model. "This was built for exactly my workflow."

---

## Part 2: Value Proposition

### What Makes mdpad Different

**From VS Code markdown preview**:
VS Code is an editor that happens to preview markdown. mdpad is a viewer that can
optionally edit. The mental mode is reversed — default is reading, editing is opt-in.
Practical differences: no language server overhead, no telemetry, CLI-launchable in <0.5s,
purpose-built navigation for folder-level browsing (not single-file preview).

**From Obsidian**:
Obsidian is a Personal Knowledge Management system. It wants to own your files, your vault,
your workflow. mdpad has zero lock-in — your files are plain .md on the filesystem, the
app is just a window to them. No vault database, no proprietary plugins, no sync account.
Obsidian launches in 2-3 seconds; mdpad in under 0.5s. Obsidian uses 300MB RAM idle;
mdpad targets under 50MB.

**From Typora**:
Typora is WYSIWYG-first; the source is hidden. mdpad is preview-first; the source is
available but secondary. Typora is commercial ($15), closed-source, and lacks cross-file
search. mdpad is designed for folder-level workflows, not single-document editing sessions.

**From Inkwell (closest Tauri competitor)**:
Inkwell is an editor with excellent UX. mdpad is a viewer/navigator first. Inkwell lacks
cross-file search (the one feature every documentation-heavy developer needs). mdpad's
target workflow is `mdpad .` and browse/read, not open-a-file-and-edit.

### The 3 Things mdpad Must Do BETTER Than Anyone Else

1. **Instant folder navigation**: From `mdpad .` to reading any file in the repo must
   take under 3 keystrokes. Ctrl+P quick-open, file tree, TOC — all work together.
   No other tool optimizes for "I have 50 docs, help me find and read the right one fast."

2. **Pixel-perfect GFM + developer extensions**: Tables, task lists, fenced code with
   syntax highlighting, Mermaid diagrams, YAML frontmatter display, GitHub Alerts —
   the full developer markdown vocabulary, rendered exactly as it would appear on GitHub,
   with zero configuration required.

3. **Invisible footprint**: <0.5s startup, <50MB RAM, <15MB installer. Opens, shows content,
   stays out of the way. No account creation, no telemetry, no update nags, no cloud sync
   prompts. Feels like a native filesystem tool, not a SaaS product.

### Anti-Goals — What mdpad Should NOT Try to Be

- A note-taking app (that's Obsidian, Logseq, Notion)
- A full writing environment with collaboration features (that's Notion, HackMD)
- A document editor that competes with Word/Google Docs (wrong audience entirely)
- A plugin platform (premature complexity, maintenance burden)
- A git client (show git branch in status bar, fine; full diff view, no)
- A replacement for Obsidian's graph view / backlinks ecosystem (out of scope)
- Cross-platform syncing / cloud storage (use the filesystem, that's the point)

### One-Sentence Elevator Pitch

**"mdpad is the terminal for your markdown — `mdpad .` and instantly navigate, read,
and preview every file in your project, with zero bloat and zero lock-in."**

---

## Part 3: Brand Story

### Personality

If mdpad were a person, it would be a senior systems engineer who uses a tiling window
manager, has aliases for everything, and gets visibly annoyed when tools add three splash
screens and require an account to open a local file. They are precise, fast, opinionated
about defaults, and deeply respectful of the user's time. They think VS Code is good but
too heavy for reading docs. They have never launched Electron willingly.

Traits: **precise, minimal, fast, no-nonsense, opinionated, respectful of your filesystem**.

### Visual Language

The aesthetic is **terminal-meets-notebook**. Think:
- Monochrome primary palette — the UI chrome should almost disappear, letting the document
  content dominate
- Accent color: single warm amber or cool blue-gray, used only for interactive elements
  and syntax highlights
- Typography: system UI font for chrome, a high-quality monospace for code (JetBrains Mono
  or Fira Code as bundled default), a clean proportional serif or sans for body text
- Density: compact but breathable — like a well-formatted man page or GitHub README
- Surfaces: flat, no gradients, very subtle borders — the kind of UI that looks designed
  by removing things, not adding them

The dark theme is the default (developers live in dark mode). The light theme should look
like a printed technical document, not a cheery productivity app.

### App Icon / Logo

Current diamond icon is wrong for the brand — it reads "gem/jewel" and doesn't communicate
markdown or developer tooling.

**What the icon should communicate**: speed, documents, precision, terminal aesthetics.

**Recommendation**: A stylized `M_` or `#_` glyph — the `#` of markdown heading syntax
combined with the `_` cursor. Monochromatic, geometric, works at 16px.
Alternatively: a single clean document shape with a lightning bolt or chevron, signifying
"fast document viewer." The name `mdpad` contains `.md` — the icon could embed this.

Colors: monochromatic dark-on-light / light-on-dark. Avoid blue — every Electron app uses
blue. A dark neutral (near-black) or deep forest green reads "terminal" and "technical."

### Name Analysis

**"mdpad"** — honest assessment:

Weaknesses:
- Not pronounceable as a word ("zentala-md" requires knowing the author's brand)
- Lowercase brand name requires intentional branding consistency
- Hyphenated name with file extension embedded — reads as a filename, not a product
- "zntl" has no inherent meaning without knowing it's short for "zentala"

Strengths:
- Honest, no-marketing-fluff naming — fits the brand personality
- The `.md` extension embedded in the name is clever for the target audience
- Memorable among developers who already know the zentala ecosystem
- Works perfectly as a CLI command: `mdpad .` is clean

**Alternatives worth considering**:

| Name | CLI command | Vibe |
|------|-------------|------|
| `mdview` | `mdview .` | Descriptive but generic |
| `mdx` (taken) | — | Already overloaded by MDX format |
| `foliomd` | `foliomd .` | Portfolio of docs — more brand |
| `mdnav` | `mdnav .` | Navigation-focused, clear |
| `leafmd` | `leafmd .` | Light, organic — might be too soft |
| `specd` | `specd .` | Spec-first, developer-focused |
| `docpane` | `docpane .` | Descriptive, panel-metaphor |

**Verdict**: Keep `mdpad` if this is primarily a personal tool in the zentala ecosystem.
If targeting broader open-source adoption, consider `mdnav` or a similarly descriptive
CLI-first name. The current name is perfect for the tool's current scope.

---

## Part 4: Competitive UX Audit

### VS Code

**Top-right title bar**: Window controls (minimize/maximize/close) on Windows. Custom title
bar shows active file path. No app-specific controls in title bar area — everything lives in
the status bar or activity bar.

**Menu bar**: File / Edit / Selection / View / Go / Run / Terminal / Help. Extremely full —
VS Code suffers from menu overload. For mdpad: steal the `Go` menu concept (Go to File,
Go to Line, Go to Symbol) — this maps perfectly to markdown navigation.

**Sidebar collapse**: Activity bar on the far left (icon-only), clicking an icon
opens/closes the sidebar panel. The sidebar can be fully hidden; the activity bar stays
visible. Icons use tooltips on hover. **Steal this**: vertical icon tab strip for Explorer
vs Search vs (future) Backlinks.

**Tab management**: Tabs at top, overflow uses `>` chevron for hidden tabs. Tab has dot
indicator for unsaved changes. Right-click context menu: Close, Close Others, Close All,
Copy Path, Reveal in Explorer. **Steal everything here** — it's the industry standard.

**Status bar**: Bottom, full width. Left: branch name, sync status, errors/warnings count.
Right: line/column, encoding, line ending, language mode, notifications bell. Color changes
on errors (red) or during operations (blue). For mdpad: steal git branch + file info on
right, nothing on left (or file path breadcrumb).

**What to steal from VS Code**:
- Activity bar (vertical icon tabs for panel switching)
- Ctrl+P quick-open fuzzy file search
- Breadcrumb navigation above content
- Tab right-click context menu
- Status bar with git branch
- `Go to` menu section
- Section folding by heading level

**What to avoid from VS Code**:
- 9-item menu bar (overwhelming for a viewer)
- Settings as full page with 500+ options
- Language server integration, diagnostics, problem panels
- Split pane editing (viewer, not editor)
- Extension marketplace (keep it simple)

---

### Cursor

**Top-right corner**: Traffic light window controls + custom title showing project name.
AI chat toggle button (prominent). Layout switcher (side-by-side vs stacked views).

**Menu bar**: Inherits VS Code structure but adds AI-specific menus. Not relevant to borrow.

**Sidebar**: Same activity bar concept as VS Code, slightly cleaner default state.

**What to steal from Cursor**:
- The idea of a single prominent action in the title bar / toolbar that represents the
  app's unique value. For mdpad: the mode switcher (Edit/Preview/Read) deserves
  exactly this visual prominence — it's the defining interaction of the app.
- Clean, minimal chrome that makes content feel primary

**What to avoid**:
- AI integration in the main workflow (scope creep)
- The two-editor layout complexity (not relevant to a viewer)

---

### JetBrains IDEs (IntelliJ, WebStorm, etc.)

**Top-right corner**: Run/debug buttons (not relevant), project name, VCS widget showing
branch. On recent versions: a floating toolbar with AI/chat button.

**Menu bar**: Full 10+ item menu with deeply nested submenus. Complex power-user targeting.
Navigation menu is strong: Navigate > File, Navigate > Symbol, Navigate > Class.

**Sidebar**: Tool windows on left/right/bottom, each collapsible to a vertical tab strip.
**This is the gold standard for panel management** — each panel has a named vertical tab,
clicking toggles it, panels can be undocked, floating, or split.

**Tab management**: Tabs at top with "Recently Opened" overflow. Tabs can be split
horizontally or vertically. Tab groups (pinned tabs section). Good "Recent Files" popup.

**Status bar**: Branch (git), encoding, line ending, cursor position, VCS change indicator.
Compact and information-dense without being noisy.

**What to steal from JetBrains**:
- Tool window / panel architecture: named vertical tabs that collapse to icon strips
- "Recent Files" popup (Ctrl+E equivalent) — navigating recent docs is a real workflow
- The concept of "pinned tabs" for frequently referenced docs in a project
- Clean compact status bar design

**What to avoid**:
- The complexity of multi-window, multi-split, multi-panel layouts
- Configuration depth (10-panel settings dialog with hundreds of options)

---

### Zed

**Top-right corner**: Collaboration avatars (for multiplayer), project panel toggle.
Minimal — almost no buttons visible. The title bar is nearly empty, which forces the user
to learn keyboard shortcuts.

**Menu bar**: Minimal by design — File / Edit / Selection / View / Go / Window / Help.
Fewer items than VS Code. The View menu cleanly controls panels.

**Sidebar collapse**: Left sidebar toggles with single button or Cmd+\\. No vertical tab
strip — sidebar has tabs at its top. Clean but less discoverable than VS Code activity bar.

**Tab management**: Tabs with dot indicator for modified files. Very clean visual design.
Tab bar can be hidden. No overflow handling — horizontal scroll instead.

**Status bar**: Extremely minimal. Only: branch, diagnostics count, language. Right side:
vim mode indicator. Trusts keyboard-first users.

**What to steal from Zed**:
- Minimal title bar / menu philosophy — less is more for a focused viewer
- The visual density choices (more content, less chrome)
- Status bar minimalism — don't put things in the status bar just because you can
- Clean, fast-feeling tab design
- The philosophy: "good defaults beat infinite configuration"

**What to avoid**:
- Multiplayer/collaboration features (out of scope)
- The "so minimal it's hard to discover" trap — target audience includes less keyboard-fluent users

---

### Synthesis: What mdpad Should Steal

| Pattern | Source | Implementation |
|---------|--------|----------------|
| Vertical activity bar (icon tabs) | VS Code, JetBrains | Explorer / Search / (Backlinks later) |
| Ctrl+P quick-open | VS Code, Zed | Fuzzy file search modal |
| Breadcrumb above content | VS Code | `folder > subfolder > file.md` |
| Tab right-click context menu | VS Code | Close, Close Others, Copy Path |
| Git branch in status bar | VS Code, JetBrains, Zed | Status bar left side |
| Mode switcher as prominent toolbar element | Cursor (AI button pattern) | Edit/Preview/Read segmented control |
| Panel-as-collapsible-vertical-tab | JetBrains | Explorer and Outline collapse |
| "Recent files" popup | JetBrains | Ctrl+E or equivalent |
| Minimal status bar | Zed | Only what's needed |
| Single accent action in toolbar | Cursor | Mode switcher prominently placed |

---

## Part 5: Feature Prioritization

### Core — Without This, the App Has No Reason to Exist

These features define the product. If any of them are broken or missing, users do not
install mdpad at all.

- **CLI launch**: `mdpad .` and `mdpad file.md` — this is the entire distribution
  mechanism and the reason to choose mdpad over opening a browser tab
- **File tree sidebar** — without folder browsing, it's just a single-file viewer
- **GFM rendering** — tables, task lists, strikethrough, autolinks, fenced code
- **Syntax-highlighted code blocks** — every developer document has code; uncolored
  code blocks are a dealbreaker after 2025
- **Mermaid diagram rendering** — architecture diagrams in `.arch/` are useless unrendered
- **Fast startup** (<0.5s) and **small footprint** (<50MB RAM, <15MB installer) —
  if these benchmarks are missed, the Tauri choice is wasted and users will use VS Code

### Expected — Users Feel Something Is Missing Without These

Users will install mdpad but leave bad reviews or switch back to alternatives.

- **TOC / outline panel** with heading navigation and click-to-jump
- **YAML frontmatter display** as a styled table/properties panel (not raw text)
- **Cross-file search** (folder-level) — the single biggest gap in Inkwell
- **Dark/light theme** with OS preference detection
- **Tab management** — multiple files open simultaneously is table stakes in 2025
- **Ctrl+P quick-open** fuzzy file search — keyboard-first navigation
- **File watcher** / auto-reload on external changes — files change while you're in the app
- **GitHub Alerts** rendering (NOTE, WARNING, CAUTION, TIP, IMPORTANT) — common in modern READMEs
- **Copy button on code blocks** — users copy code, always
- **Breadcrumb navigation** above content

### Delightful — Makes Users Love the App

These are the features users mention in "why I switched" posts. They don't expect them
but are genuinely happy when they find them.

- **Zoom control** as floating widget in content area (not app-level zoom)
- **Floating formatting toolbar** on text selection (Bold/Italic/Code/Link bubble)
- **Tab tooltips** showing full file path on hover
- **Tab right-click context menu** (Close Others, Copy Path, Reveal in Explorer)
- **File status dots** in tree (open dot, unsaved dot — VS Code style)
- **Empty state / Welcome.md** that showcases all GFM features on first open
- **Zen mode** — fullscreen, all chrome hidden, pure reading
- **Drag-and-drop** .md files onto window to open
- **Scroll position memory** per file (return to the same position when switching tabs)
- **Pinned tabs** for frequently referenced files in a project session
- **KaTeX math rendering** — subset of developers needs this; those who need it REALLY need it
- **Git branch** display in status bar (no actions, just display)
- **Minimap** in sidebar for long documents (optional, toggleable)

### Unnecessary — Nice Idea but Doesn't Serve Core Use Case

These features would consume engineering time without materially improving the
primary workflow of "open folder, browse, read."

- **Plugin system** — premature complexity, creates maintenance burden, delays shipping
  the core. Add only after the app is stable with 1000+ users.
- **Wiki-links `[[page]]`** — useful in PKM workflows (Obsidian, Logseq) but the target
  user works with standard markdown, not wiki syntax. Add to backlog, not roadmap.
- **Graph view** — Obsidian's graph view is impressive but is primarily a visual toy.
  Zero productivity value for the "read specs quickly" workflow.
- **Version history** (Inkwell feature) — the target user already has git. This duplicates
  git functionality without git's context.
- **WYSIWYG inline editing** (Typora style) — mdpad is a viewer first. WYSIWYG editing
  requires a fundamentally different architecture and codebase approach. Defer indefinitely
  or spin off as a separate product.
- **Template system** — nice for note-taking apps, irrelevant for reading project docs
- **Image paste from clipboard** — useful in an editor, irrelevant in a viewer
- **Backlinks panel** — Obsidian-style backlinks require index maintenance. Adds complexity
  without solving the core use case. Consider for v3+ only.
- **Cloud sync / sharing** — antithetical to the brand. The filesystem is the sync layer.
- **Collaboration / multiplayer** — wrong product entirely

---

## Summary: The Single Clearest Opinion

mdpad's competitive moat is **the combination of three things no other tool does together**:
(1) CLI-first folder launch in <0.5s,
(2) pixel-perfect GFM + Mermaid rendering with cross-file navigation,
(3) <50MB RAM with no cloud dependency.

Every feature decision should be tested against: "does this make the folder browsing +
reading experience faster and more accurate?" If no, deprioritize it.

The existential risk is feature creep toward Obsidian or Typora, where the app becomes
a mediocre version of a better-funded competitor. Stay small, stay fast, stay readable.
