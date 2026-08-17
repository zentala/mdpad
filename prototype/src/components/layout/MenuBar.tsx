import { useState, useRef, useEffect, type ReactNode } from 'react'
import {
  Sun,
  Moon,
  Monitor,
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
import type { Theme, EditorMode, EditorCommand } from '@/types'
import { Logo } from '@/components/common/Logo'
import { ModeSwitcher } from './ModeSwitcher'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { getNextTheme } from './themeUtils'
import { ZenIcon } from './zenIcon'
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
  onToggleZenMode?: () => void
  onNewFile?: () => void
  onSave?: () => void
  onExportHtml?: () => void
  onExportPdf?: () => void
  onFind?: () => void
  onFindReplace?: () => void
  onFindInFolder?: () => void
  onEditCommand?: (cmd: EditorCommand) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
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
  onCloseTab,
  onToggleZenMode,
  onNewFile,
  onSave,
  onExportHtml,
  onExportPdf,
  onFind,
  onFindReplace,
  onFindInFolder,
  onEditCommand,
  onZoomIn,
  onZoomOut,
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
      {
        label: 'New File',
        shortcut: 'Ctrl+N',
        action: onNewFile,
        icon: <FilePlus size={I} strokeWidth={W} />,
      },
      { label: 'Open File…', shortcut: 'Ctrl+O', icon: <FolderOpen size={I} strokeWidth={W} /> },
      {
        label: 'Open Folder…',
        shortcut: 'Ctrl+Shift+O',
        icon: <Folder size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      {
        label: 'Save',
        shortcut: 'Ctrl+S',
        icon: <Save size={I} strokeWidth={W} />,
        action: onSave,
      },
      { label: 'Save As…', shortcut: 'Ctrl+Shift+S', icon: <Copy size={I} strokeWidth={W} /> },
      { label: '', separator: true },
      {
        label: 'Close Tab',
        shortcut: 'Ctrl+W',
        action: onCloseTab,
        icon: <X size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      { label: 'Export as PDF', action: onExportPdf, icon: <FileDown size={I} strokeWidth={W} /> },
      {
        label: 'Export as HTML',
        action: onExportHtml,
        icon: <FileOutput size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      { label: 'Quit', shortcut: 'Ctrl+Q', icon: <LogOut size={I} strokeWidth={W} /> },
    ],
    Edit: [
      {
        label: 'Undo',
        shortcut: 'Ctrl+Z',
        action: () => onEditCommand?.('undo'),
        icon: <Undo2 size={I} strokeWidth={W} />,
      },
      {
        label: 'Redo',
        shortcut: 'Ctrl+Shift+Z',
        action: () => onEditCommand?.('redo'),
        icon: <Redo2 size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      {
        label: 'Cut',
        shortcut: 'Ctrl+X',
        action: () => onEditCommand?.('cut'),
        icon: <Scissors size={I} strokeWidth={W} />,
      },
      {
        label: 'Copy',
        shortcut: 'Ctrl+C',
        action: () => onEditCommand?.('copy'),
        icon: <Copy size={I} strokeWidth={W} />,
      },
      {
        label: 'Paste',
        shortcut: 'Ctrl+V',
        action: () => onEditCommand?.('paste'),
        icon: <ClipboardPaste size={I} strokeWidth={W} />,
      },
      { label: '', separator: true },
      {
        label: 'Find',
        shortcut: 'Ctrl+F',
        action: onFind,
        icon: <Search size={I} strokeWidth={W} />,
      },
      {
        label: 'Find & Replace',
        shortcut: 'Ctrl+H',
        action: onFindReplace,
        icon: <Replace size={I} strokeWidth={W} />,
      },
      {
        label: 'Find in Folder',
        shortcut: 'Ctrl+Shift+F',
        action: onFindInFolder,
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
      {
        label: 'Zoom In',
        shortcut: 'Ctrl+=',
        action: onZoomIn,
        icon: <ZoomIn size={I} strokeWidth={W} />,
      },
      {
        label: 'Zoom Out',
        shortcut: 'Ctrl+-',
        action: onZoomOut,
        icon: <ZoomOut size={I} strokeWidth={W} />,
      },
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

      {/* Center: mode switcher + zen toggle */}
      <ModeSwitcher editorMode={editorMode} onSetEditorMode={onSetEditorMode} />
      <div className={styles.zenToggle}>
        <ToggleSwitch
          checked={false}
          onChange={() => onToggleZenMode?.()}
          icon={ZenIcon}
          label="Zen"
          title="Zen Mode (F11)"
        />
      </div>

      <div className={styles.spacer} />

      {/* Right: quick actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.quickBtn}
          onClick={() => onSetTheme(getNextTheme(theme))}
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
      </div>
    </div>
  )
}
