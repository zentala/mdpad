import { useState, useRef, useEffect } from 'react'
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
}

interface MenuItem {
  label: string
  shortcut?: string
  separator?: boolean
  submenu?: MenuItem[]
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
      { label: 'Export as PDF', shortcut: 'Ctrl+Shift+P' },
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
      { label: 'Write', shortcut: 'Ctrl+E', action: () => onSetEditorMode('write'), checked: editorMode === 'write' },
      { label: 'Code', shortcut: 'Ctrl+Shift+E', action: () => onSetEditorMode('code'), checked: editorMode === 'code' },
      { label: 'Preview', shortcut: 'Ctrl+Shift+P', action: () => onSetEditorMode('preview'), checked: editorMode === 'preview' },
      { label: '', separator: true },
      { label: 'Zoom In', shortcut: 'Ctrl+=' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-' },
    ],
    Format: [
      { label: 'Bold', shortcut: 'Ctrl+B' },
      { label: 'Italic', shortcut: 'Ctrl+I' },
      { label: 'Strikethrough', shortcut: 'Ctrl+Shift+~' },
      { label: 'Inline Code', shortcut: 'Ctrl+`' },
      { label: '', separator: true },
      { label: 'Heading 1', shortcut: 'Ctrl+1' },
      { label: 'Heading 2', shortcut: 'Ctrl+2' },
      { label: 'Heading 3', shortcut: 'Ctrl+3' },
      { label: '', separator: true },
      { label: 'Ordered List', shortcut: 'Ctrl+Shift+]' },
      { label: 'Unordered List', shortcut: 'Ctrl+Shift+[' },
      { label: 'Task List', shortcut: 'Ctrl+Shift+X' },
      { label: 'Blockquote', shortcut: 'Ctrl+Shift+Q' },
      { label: 'Code Block', shortcut: 'Ctrl+Shift+K' },
      { label: '', separator: true },
      { label: 'Insert Link', shortcut: 'Ctrl+K' },
      { label: 'Insert Image', shortcut: 'Ctrl+Shift+I' },
      { label: 'Insert Table', shortcut: 'Ctrl+T' },
    ],
    Help: [
      { label: 'About zntl-md' },
      { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+?', action: () => onOpenShortcuts?.() },
      { label: 'Markdown Reference' },
    ],
  }

  return (
    <div className={styles.menuBar} ref={menuRef}>
      <div className={styles.appIcon}>◆</div>
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
      <div className={styles.themeSwitch}>
        {(['dark', 'light', 'sepia'] as Theme[]).map(t => (
          <button
            key={t}
            className={`${styles.themeBtn} ${theme === t ? styles.activeTheme : ''}`}
            onClick={() => onSetTheme(t)}
            title={t}
          >
            {t === 'dark' ? '●' : t === 'light' ? '○' : '◐'}
          </button>
        ))}
      </div>
    </div>
  )
}
