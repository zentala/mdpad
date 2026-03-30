import { Modal } from './Modal'
import styles from './ShortcutsModal.module.css'

interface ShortcutsModalProps {
  onClose: () => void
}

const shortcuts = [
  { category: 'File', items: [
    { action: 'New file', keys: 'Ctrl+N' },
    { action: 'Open file', keys: 'Ctrl+O' },
    { action: 'Open folder', keys: 'Ctrl+Shift+O' },
    { action: 'Save', keys: 'Ctrl+S' },
    { action: 'Close file', keys: 'Ctrl+W' },
  ]},
  { category: 'Edit', items: [
    { action: 'Find', keys: 'Ctrl+F' },
    { action: 'Find & Replace', keys: 'Ctrl+H' },
    { action: 'Find in Folder', keys: 'Ctrl+Shift+F' },
    { action: 'Undo', keys: 'Ctrl+Z' },
    { action: 'Redo', keys: 'Ctrl+Shift+Z' },
  ]},
  { category: 'Format', items: [
    { action: 'Bold', keys: 'Ctrl+B' },
    { action: 'Italic', keys: 'Ctrl+I' },
    { action: 'Inline Code', keys: 'Ctrl+`' },
    { action: 'Link', keys: 'Ctrl+K' },
    { action: 'Heading 1–6', keys: 'Ctrl+1…6' },
    { action: 'Task List', keys: 'Ctrl+Shift+X' },
    { action: 'Code Block', keys: 'Ctrl+Shift+K' },
  ]},
  { category: 'View', items: [
    { action: 'Toggle Sidebar', keys: 'Ctrl+Shift+L' },
    { action: 'Toggle Outline', keys: 'Ctrl+Shift+T' },
    { action: 'Source Mode', keys: 'Ctrl+`' },
    { action: 'Reading Mode', keys: 'Ctrl+Shift+R' },
    { action: 'Zen Mode', keys: 'F11' },
    { action: 'Zoom In', keys: 'Ctrl+=' },
    { action: 'Zoom Out', keys: 'Ctrl+-' },
  ]},
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
                <span className={styles.action}>{item.action}</span>
                <kbd className={styles.keys}>{item.keys}</kbd>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  )
}
