import { FileText, FolderOpen, Keyboard } from 'lucide-react'
import { Logo } from './Logo'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  onNewFile: () => void
  onOpenQuickSearch: () => void
}

const SHORTCUTS = [
  { keys: 'Ctrl+P', label: 'Quick Open' },
  { keys: 'Ctrl+N', label: 'New File' },
  { keys: 'Ctrl+Shift+O', label: 'Open Folder' },
  { keys: 'Ctrl+,', label: 'Settings' },
  { keys: 'Ctrl+Shift+L', label: 'Toggle Sidebar' },
  { keys: 'Ctrl+Shift+T', label: 'Toggle Outline' },
]

export function EmptyState({ onNewFile, onOpenQuickSearch }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Logo size={64} className={styles.logo} />
        <h1 className={styles.title}>mdpad</h1>
        <p className={styles.subtitle}>The terminal for your Markdown</p>

        <div className={styles.actions}>
          <button className={styles.action} onClick={onNewFile}>
            <FileText size={16} />
            New File
            <span className={styles.shortcut}>Ctrl+N</span>
          </button>
          <button className={styles.action} onClick={onOpenQuickSearch}>
            <FolderOpen size={16} />
            Quick Open
            <span className={styles.shortcut}>Ctrl+P</span>
          </button>
        </div>

        <div className={styles.shortcuts}>
          <div className={styles.shortcutsHeader}>
            <Keyboard size={14} />
            Keyboard Shortcuts
          </div>
          <div className={styles.shortcutsGrid}>
            {SHORTCUTS.map(s => (
              <div key={s.keys} className={styles.shortcutRow}>
                <kbd className={styles.kbd}>{s.keys}</kbd>
                <span className={styles.shortcutLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
