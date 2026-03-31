import { Modal } from './Modal'
import styles from './ShortcutsModal.module.css'

interface ShortcutsModalProps {
  onClose: () => void
}

const shortcuts = [
  {
    category: 'File',
    items: [
      { action: 'New File', keys: 'Ctrl+N' },
      { action: 'Save', keys: 'Ctrl+S', note: 'desktop only' },
      { action: 'Close Tab', keys: 'Ctrl+W' },
      { action: 'Quick Open', keys: 'Ctrl+P' },
      { action: 'Settings', keys: 'Ctrl+,' },
    ],
  },
  {
    category: 'Edit',
    items: [
      { action: 'Undo', keys: 'Ctrl+Z' },
      { action: 'Redo', keys: 'Ctrl+Shift+Z' },
      { action: 'Find', keys: 'Ctrl+F' },
      { action: 'Find & Replace', keys: 'Ctrl+H' },
      { action: 'Find in Folder', keys: 'Ctrl+Shift+F' },
    ],
  },
  {
    category: 'View',
    items: [
      { action: 'Toggle Sidebar', keys: 'Ctrl+Shift+L' },
      { action: 'Toggle Outline', keys: 'Ctrl+Shift+T' },
      { action: 'Visual Mode', keys: 'Ctrl+E' },
      { action: 'Code Mode', keys: 'Ctrl+Shift+E' },
      { action: 'Preview Mode', keys: 'Ctrl+Shift+P' },
      { action: 'Reading Mode', keys: 'Ctrl+Shift+R' },
      { action: 'Zen Mode', keys: 'F11' },
      { action: 'Zoom In', keys: 'Ctrl+=' },
      { action: 'Zoom Out', keys: 'Ctrl+-' },
    ],
  },
]

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  return (
    <Modal title="Keyboard Shortcuts" onClose={onClose}>
      <div className={styles.grid}>
        {shortcuts.map(group => (
          <div key={group.category} className={styles.group}>
            <h3 className={styles.category}>{group.category}</h3>
            {group.items.map(item => (
              <div key={item.action} className={styles.row}>
                <span className={styles.action}>
                  {item.action}
                  {'note' in item && item.note && (
                    <span className={styles.note}> ({item.note})</span>
                  )}
                </span>
                <kbd className={styles.keys}>{item.keys}</kbd>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  )
}
