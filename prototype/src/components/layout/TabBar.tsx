import { X } from 'lucide-react'
import styles from './TabBar.module.css'

interface Tab {
  path: string
  name: string
  modified?: boolean
}

interface TabBarProps {
  tabs: Tab[]
  activeTab: string | null
  onSelectTab: (path: string) => void
  onCloseTab: (path: string) => void
}

export function TabBar({ tabs, activeTab, onSelectTab, onCloseTab }: TabBarProps) {
  if (tabs.length === 0) {
    return <div className={styles.tabBar} />
  }

  return (
    <div className={styles.tabBar}>
      {tabs.map(tab => (
        <div
          key={tab.path}
          className={`${styles.tab} ${tab.path === activeTab ? styles.active : ''}`}
          onClick={() => onSelectTab(tab.path)}
          title={tab.path}
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
    </div>
  )
}
