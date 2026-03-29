# UX Refinement — Stream of Consciousness Notes

**Date**: 2026-03-30
**Context**: User feedback after seeing v1 prototype

## What Works Well
- Three-panel layout (file tree | preview | TOC) — user likes it
- Dark theme looks good
- File tree navigation works
- YAML frontmatter display with status pills

## User Feedback — Issues

### Dropdown Menus Are Wrong for Frequent Actions
- Format menu (Bold, Italic, etc.) should NOT be a dropdown
- Need a **toolbar strip with icons** — like Google Docs / Word
- View mode switching (Preview/Source/Reading) should be a **segmented control**
  visible at all times, not buried in dropdown
- The toolbar should only appear in edit modes, NOT in Reading mode

### Floating Selection Toolbar
- When user selects text, a **floating bubble** should appear nearby
- Contains: Bold, Italic, Strikethrough, Code, Link, Highlight
- Like Mark Text / Notion / Google Docs
- Disappears when selection is cleared

### Search Experience
- "Find" and "Find in Folder" should NOT be in dropdown
- Find in file: **inline search bar** at top of editor (like VS Code Ctrl+F)
- Find in folder: **replaces file tree** in sidebar as a tab
- Search bar has: case-sensitive toggle, regex toggle, prev/next arrows, match count
- Folder search: results grouped by file, click to jump

### Help Menu — Modals, Not Tabs
- "About", "Keyboard Shortcuts", "Markdown Reference" → modal overlays
- Keyboard shortcuts: nice grid of keys with categories
- Not a new tab or new window

### Welcome/Demo Page
- App opens with a Welcome.md by default
- Shows ALL GFM features as a showcase / reference
- Should include: headings, lists, task lists, tables, code blocks (multiple languages),
  blockquotes, links, images, horizontal rules, inline formatting, HTML support
- This IS the documentation / onboarding

### ASCII Art / Monospace
- Plain code blocks (no language) must render in monospace
- ASCII diagrams like architecture boxes must align properly

### Links
- Clicking a link should NOT navigate (it was changing the theme!)
- Internal links should navigate to file in the tree
- External links should open in browser

### Code Highlighting
- Currently no syntax coloring — just monospace
- Need Prism.js or Shiki for proper language-aware highlighting
- Must support: TypeScript, Rust, Bash, JSON, CSS, YAML, Python, Go, SQL, etc.

## UX Architecture Decision

### What Lives Where

| Element | Implementation | Notes |
|---------|---------------|-------|
| **Toolbar strip** | Fixed bar below menu, icons | Bold/Italic/Code/Link/H1-3/Lists/Table/CodeBlock/Image |
| **View mode switcher** | Segmented control in toolbar (right side) | Preview / Source / Read |
| **Search in file** | Inline bar, slides down from top of editor | Ctrl+F, Esc to close |
| **Search in folder** | Sidebar tab (replaces file tree) | Ctrl+Shift+F |
| **Floating toolbar** | Bubble on text selection | Bold/Italic/Code/Link |
| **Format menu** | REMOVED from menu bar | Replaced by toolbar |
| **View menu** | Keep only: sidebar/toc toggles, zoom, zen mode | Mode switching goes to toolbar |
| **Help modals** | Modal overlays | Shortcuts, About, Markdown Reference |
| **File menu** | Keep as dropdown | Standard file operations |
| **Edit menu** | Keep as dropdown | Undo/Redo/Cut/Copy/Paste |

### Toolbar Visibility Rules
- **Preview mode**: toolbar visible, all buttons active
- **Source mode**: toolbar visible, all buttons active
- **Reading mode**: toolbar HIDDEN (read-only, no editing)
- **Zen mode**: everything hidden

## Next Steps (from this session)
1. Research additional features from other editors
2. Design review of proposed changes
3. Implement v2 prototype with all refinements
4. Add syntax highlighting (Prism.js or Shiki)
