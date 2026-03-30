import { useState, useRef, useEffect, type ReactNode } from 'react'
import {
  Pen,
  FileCode,
  Eye,
  Sun,
  Moon,
  Monitor,
  Settings,
  TextCursorInput,
  ZoomIn,
  ZoomOut,
  FilePlus,
  FolderOpen,
  Folder,
  Save,
  Copy,
  X,
  FileDown,
  FileOutput,
  LogOut,
  Undo2,
  Redo2,
  Scissors,
  ClipboardPaste,
  Search,
  Replace,
  FolderSearch,
  PanelLeft,
  PanelRight,
  Maximize,
  Info,
  Keyboard,
  BookOpen,
} from 'lucide-react'
import type { Theme, EditorMode } from '@/types'
import { Logo } from '@/components/common/Logo'
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
  onOpenSettings?: () => void
  onCloseTab?: () => void
  onToggleZenMode?: () => void
}

interface MenuItem {
  label: string
  shortcut?: string
  separator?: boolean
  action?: () => void
  checked?: boolean
  icon?: ReactNode
}

const I = 14
const W = 1.5

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
  onOpenSettings,
  onCloseTab,
  onToggleZenMode,
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
      { label: 'New File', shortcut: 'Ctrl+N', icon: <FilePlus size={I} strokeWidth={W} /> },
      { label: 'Open File…', shortcut: 'Ctrl+O', icon: <FolderOpen size={I} strokeWidth={W} /> },
      {
        label: 'Open Folder…',
        shortcut: 'Ctrl+Shift+O',
        icon: <Folder size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      { label: 'Save', shortcut: 'Ctrl+S', icon: <Save size={I} strokeWidth={W} /> },
      { label: 'Save As…', shortcut: 'Ctrl+Shift+S', icon: <Copy size={I} strokeWidth={W} /> },
      { label: '', separator: true },
      {
        label: 'Close Tab',
        shortcut: 'Ctrl+W',
        action: onCloseTab,
        icon: <X size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      { label: 'Export as PDF', icon: <FileDown size={I} strokeWidth={W} /> },
      { label: 'Export as HTML', icon: <FileOutput size={I} strokeWidth={W} /> },
      { label: '', separator: true },
      { label: 'Quit', shortcut: 'Ctrl+Q', icon: <LogOut size={I} strokeWidth={W} /> },
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', icon: <Undo2 size={I} strokeWidth={W} /> },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z', icon: <Redo2 size={I} strokeWidth={W} /> },
      { label: '', separator: true },
      { label: 'Cut', shortcut: 'Ctrl+X', icon: <Scissors size={I} strokeWidth={W} /> },
      { label: 'Copy', shortcut: 'Ctrl+C', icon: <Copy size={I} strokeWidth={W} /> },
      { label: 'Paste', shortcut: 'Ctrl+V', icon: <ClipboardPaste size={I} strokeWidth={W} /> },
      { label: '', separator: true },
      { label: 'Find', shortcut: 'Ctrl+F', icon: <Search size={I} strokeWidth={W} /> },
      { label: 'Find & Replace', shortcut: 'Ctrl+H', icon: <Replace size={I} strokeWidth={W} /> },
      {
        label: 'Find in Folder',
        shortcut: 'Ctrl+Shift+F',
        icon: <FolderSearch size={I} strokeWidth={W} />,
      },
    ],
    View: [
      {
        label: 'Toggle Sidebar',
        shortcut: 'Ctrl+Shift+L',
        action: onToggleSidebar,
        icon: <PanelLeft size={I} strokeWidth={W} />,
      },
      {
        label: 'Toggle Outline',
        shortcut: 'Ctrl+Shift+T',
        action: onToggleToc,
        icon: <PanelRight size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      { label: 'Zoom In', shortcut: 'Ctrl+=', icon: <ZoomIn size={I} strokeWidth={W} /> },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', icon: <ZoomOut size={I} strokeWidth={W} /> },
      { label: '', separator: true },
      {
        label: 'Theme: Auto',
        action: () => onSetTheme('auto'),
        checked: theme === 'auto',
        icon: <Monitor size={I} strokeWidth={W} />,
      },
      {
        label: 'Theme: Dark',
        action: () => onSetTheme('dark'),
        checked: theme === 'dark',
        icon: <Moon size={I} strokeWidth={W} />,
      },
      {
        label: 'Theme: Light',
        action: () => onSetTheme('light'),
        checked: theme === 'light',
        icon: <Sun size={I} strokeWidth={W} />,
      },
      {
        label: 'Theme: Sepia',
        action: () => onSetTheme('sepia'),
        checked: theme === 'sepia',
        icon: <BookOpen size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      {
        label: 'Zen Mode',
        shortcut: 'F11',
        action: onToggleZenMode,
        icon: <Maximize size={I} strokeWidth={W} />,
      },
    ],
    Help: [
      { label: 'About mdpad', action: onOpenAbout, icon: <Info size={I} strokeWidth={W} /> },
      {
        label: 'Keyboard Shortcuts',
        shortcut: 'Ctrl+?',
        action: onOpenShortcuts,
        icon: <Keyboard size={I} strokeWidth={W} />,
      },
      {
        label: 'Markdown Reference',
        action: onOpenMarkdownRef,
        icon: <BookOpen size={I} strokeWidth={W} />,
      },
    ],
  }

  return (
    <div className={styles.menuBar} ref={menuRef}>
      <div className={styles.appIcon} title="mdpad">
        <Logo size={18} />
      </div>

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
                    <span className={styles.iconSlot}>
                      {item.checked ? '✓' : (item.icon ?? null)}
                    </span>
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
        <Pen size={11} strokeWidth={1.5} className={styles.modeLabelIcon} />
        <span className={styles.modeLabel}>Edit</span>
        <div className={styles.editGroup}>
          <button
            className={`${styles.modeBtn} ${styles.modeBtnLeft} ${editorMode === 'write' ? styles.modeActive : ''}`}
            onClick={() => onSetEditorMode('write')}
            title="Visual editor — formatted preview (Ctrl+E)"
          >
            <TextCursorInput size={12} strokeWidth={1.75} />
            Visual
          </button>
          <button
            className={`${styles.modeBtn} ${styles.modeBtnRight} ${editorMode === 'code' ? styles.modeActive : ''}`}
            onClick={() => onSetEditorMode('code')}
            title="Code editor — raw Markdown (Ctrl+Shift+E)"
          >
            <FileCode size={12} strokeWidth={1.75} />
            Code
          </button>
        </div>
        <span className={styles.modeSeparator}>or</span>
        <button
          className={`${styles.modeBtn} ${styles.modeBtnStandalone} ${editorMode === 'preview' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('preview')}
          title="Preview — read-only (Ctrl+Shift+P)"
        >
          <Eye size={12} strokeWidth={1.75} />
          Preview
        </button>
      </div>

      <div className={styles.spacer} />

      {/* Right: quick actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.quickBtn}
          onClick={() => {
            const cycle: Theme[] = ['auto', 'dark', 'light', 'sepia']
            const next = cycle[(cycle.indexOf(theme) + 1) % cycle.length]
            onSetTheme(next)
          }}
          title={`Theme: ${theme} (click to cycle)`}
        >
          {theme === 'auto' ? (
            <Monitor size={14} strokeWidth={1.75} />
          ) : theme === 'dark' ? (
            <Moon size={14} strokeWidth={1.75} />
          ) : theme === 'sepia' ? (
            <BookOpen size={14} strokeWidth={1.75} />
          ) : (
            <Sun size={14} strokeWidth={1.75} />
          )}
        </button>
        <button className={styles.quickBtn} title="Settings (Ctrl+,)" onClick={onOpenSettings}>
          <Settings size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
