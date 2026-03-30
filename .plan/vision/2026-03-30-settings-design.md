# Settings System Design — mdpad

## Overview
Simple, scrollable settings page rendered in a centered container (same width as markdown content). No sidebar navigation — sections stacked vertically with large headers.

## Layout
- Opens as a tab (like files), triggered by gear icon or Ctrl+,
- Content area: same centered container as markdown preview
- Sections: H2 heading + description + settings rows
- All settings persist to localStorage

## Sections

### General
| Setting | Control | Default |
|---------|---------|---------|
| Startup behavior | Dropdown: Last session / Empty workspace / Welcome page | Last session |
| Confirm before close | Toggle | ON |

### Appearance
| Setting | Control | Default |
|---------|---------|---------|
| Theme | Dropdown: Dark / Light / Sepia | Dark |
| Font size | Dropdown: 14 / 15 / 16 / 17 / 18 px | 16 |

### Editor
| Setting | Control | Default |
|---------|---------|---------|
| Word wrap | Toggle | ON |
| Folders collapsed by default | Toggle | ON |

### Preview
| Setting | Control | Default |
|---------|---------|---------|
| Render math (KaTeX) | Toggle | ON |
| Render Mermaid diagrams | Toggle | ON |

### Files
| Setting | Control | Default |
|---------|---------|---------|
| File extensions | Toggle list | .md ON, .markdown ON, .yaml OFF, .yml OFF, .json OFF |
| Exclude patterns | Editable list (add/remove) | node_modules, .git |

## Persistence
All settings stored in localStorage under key `mdpad-settings`.
Read on app init, written on every change.

## Components
- Reuse centered content container from MarkdownPreview
- Toggle component (already exists in mock)
- Dropdown/select component
- Editable list component (for exclude patterns)
- Toggle list component (for file extensions)

## Access
- Gear icon in MenuBar (top right)
- Ctrl+, keyboard shortcut
- File > Settings menu item (future)
