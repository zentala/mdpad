import { Plus, X } from 'lucide-react'
import styles from './TabBar.module.css'

interface Tab {
  path: string
  name: string
  modified?: boolean
  fullPath?: string
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string | null
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  onNewFile?: () => void
}

export function TabBar({ tabs, activeTab, onSelectTab, onCloseTab, onNewFile }: TabBarProps) {
  return (
    <div className={styles.tabBar}>
      {tabs.map(tab => (
        <div
          key={tab.path}
          className={`${styles.tab} ${tab.path === activeTab ? styles.active : ''}`}
          onClick={() => onSelectTab(tab.path)}
          title={tab.fullPath ?? tab.name}
        >
          <span className={styles.name}>{tab.name}</span>
          {tab.modified && <span className={styles.dot} />}
          <button
            className={styles.close}
            onClick={e => {
              e.stopPropagation()
              onCloseTab(tab.path)
            }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
      {onNewFile && (
        <button className={styles.newTab} onClick={onNewFile} title="New File (Ctrl+N)">
          <Plus size={14} />
        </button>
      )}
    </div>
  )
}
