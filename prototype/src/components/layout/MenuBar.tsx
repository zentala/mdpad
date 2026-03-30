import { useState, useRef, useEffect } from 'react'
import { Pen, FileCode, Eye } from 'lucide-react'
import type { Theme, EditorMode } from '@/types'
import styles from './MenuBar.module.css'

interface MenuBarProps {
  theme: Theme
  editorMode: EditorMode
  onToggleSidebar: () => void
  onToggleToc: () => void
  onSetTheme: (t: Theme) => void
  onSetEditorMode: (m: EditorMode) => void
  onOpenShortcuts?: () => void
  onOpenAbout?: () => void
  onOpenMarkdownRef?: () => void
  onCloseTab?: () => void
}

interface MenuItem {
  label: string
  shortcut?: string
  separator?: boolean
  action?: () => void
  checked?: boolean
}

export function MenuBar({
  theme,
  editorMode,
  onToggleSidebar,
  onToggleToc,
  onSetTheme,
  onSetEditorMode,
  onOpenShortcuts,
  onOpenAbout,
  onOpenMarkdownRef,
  onCloseTab,
}: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: 'New File', shortcut: 'Ctrl+N' },
      { label: 'Open File…', shortcut: 'Ctrl+O' },
      { label: 'Open Folder…', shortcut: 'Ctrl+Shift+O' },
      { label: '', separator: true },
      { label: 'Save', shortcut: 'Ctrl+S' },
      { label: 'Save As…', shortcut: 'Ctrl+Shift+S' },
      { label: '', separator: true },
      { label: 'Close Tab', shortcut: 'Ctrl+W', action: onCloseTab },
      { label: '', separator: true },
      { label: 'Export as PDF' },
      { label: 'Export as HTML' },
      { label: '', separator: true },
      { label: 'Quit', shortcut: 'Ctrl+Q' },
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z' },
      { label: '', separator: true },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { label: '', separator: true },
      { label: 'Find', shortcut: 'Ctrl+F' },
      { label: 'Find & Replace', shortcut: 'Ctrl+H' },
      { label: 'Find in Folder', shortcut: 'Ctrl+Shift+F' },
    ],
    View: [
      { label: 'Toggle Sidebar', shortcut: 'Ctrl+Shift+L', action: onToggleSidebar },
      { label: 'Toggle Outline', shortcut: 'Ctrl+Shift+T', action: onToggleToc },
      { label: '', separator: true },
      { label: 'Zoom In', shortcut: 'Ctrl+=' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-' },
      { label: '', separator: true },
      { label: 'Theme: Dark', action: () => onSetTheme('dark'), checked: theme === 'dark' },
      { label: 'Theme: Light', action: () => onSetTheme('light'), checked: theme === 'light' },
      { label: 'Theme: Sepia', action: () => onSetTheme('sepia'), checked: theme === 'sepia' },
      { label: '', separator: true },
      { label: 'Zen Mode', shortcut: 'F11' },
    ],
    Help: [
      { label: 'About zntl-md', action: onOpenAbout },
      { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+?', action: onOpenShortcuts },
      { label: 'Markdown Reference', action: onOpenMarkdownRef },
    ],
  }

  return (
    <div className={styles.menuBar} ref={menuRef}>
      <div className={styles.appIcon}>◆</div>

      {/* Left: dropdown menus */}
      {Object.entries(menus).map(([name, items]) => (
        <div key={name} className={styles.menuGroup}>
          <button
            className={`${styles.menuButton} ${openMenu === name ? styles.active : ''}`}
            onMouseDown={() => setOpenMenu(openMenu === name ? null : name)}
            onMouseEnter={() => openMenu && setOpenMenu(name)}
          >
            {name}
          </button>
          {openMenu === name && (
            <div className={styles.dropdown}>
              {items.map((item, i) =>
                item.separator ? (
                  <div key={i} className={styles.separator} />
                ) : (
                  <button
                    key={i}
                    className={styles.menuItem}
                    onClick={() => {
                      item.action?.()
                      setOpenMenu(null)
                    }}
                  >
                    <span className={styles.check}>{item.checked ? '✓' : ''}</span>
                    <span className={styles.label}>{item.label}</span>
                    {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}

      <div className={styles.spacer} />

      {/* Center: mode switcher */}
      <div className={styles.modeSwitch}>
        <button
          className={`${styles.modeBtn} ${editorMode === 'write' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('write')}
          title="Write — edit with rich preview (Ctrl+E)"
        >
          <Pen size={13} strokeWidth={1.75} />
          <span>Write</span>
        </button>
        <button
          className={`${styles.modeBtn} ${editorMode === 'code' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('code')}
          title="Code — raw markdown (Ctrl+Shift+E)"
        >
          <FileCode size={13} strokeWidth={1.75} />
          <span>Code</span>
        </button>
        <div className={styles.modeDivider} />
        <button
          className={`${styles.modeBtn} ${editorMode === 'preview' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('preview')}
          title="Preview — read-only (Ctrl+Shift+P)"
        >
          <Eye size={13} strokeWidth={1.75} />
          <span>Preview</span>
        </button>
      </div>

      <div className={styles.spacer} />
    </div>
  )
}
