import { useState } from 'react'
import { Plus, X, Copy, XCircle, Trash2, FolderOpen } from 'lucide-react'
import { ContextMenu, type ContextMenuItem } from '@/components/common/ContextMenu'
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
  onCloseOtherTabs?: (id: string) => void
  onCloseAllTabs?: () => void
  onNewFile?: () => void
}

export function TabBar({
  tabs,
  activeTab,
  onSelectTab,
  onCloseTab,
  onCloseOtherTabs,
  onCloseAllTabs,
  onNewFile,
}: TabBarProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(
    null,
  )

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, tabId })
  }

  const contextItems: ContextMenuItem[] = contextMenu
    ? [
        { label: 'Close', icon: <X size={14} />, action: () => onCloseTab(contextMenu.tabId) },
        {
          label: 'Close Others',
          icon: <XCircle size={14} />,
          action: () => onCloseOtherTabs?.(contextMenu.tabId),
        },
        {
          label: 'Close All',
          icon: <Trash2 size={14} />,
          action: () => onCloseAllTabs?.(),
          danger: true,
        },
        { label: '', action: () => {}, separator: true },
        {
          label: 'Copy Path',
          icon: <Copy size={14} />,
          action: () => {
            const tab = tabs.find(t => t.path === contextMenu.tabId)
            if (tab?.fullPath) navigator.clipboard.writeText(tab.fullPath)
          },
        },
        { label: 'Reveal in Explorer', icon: <FolderOpen size={14} />, action: () => {} },
      ]
    : []

  return (
    <>
      <div className={styles.tabBar}>
        {tabs.map(tab => (
          <div
            key={tab.path}
            className={`${styles.tab} ${tab.path === activeTab ? styles.active : ''}`}
            onClick={() => onSelectTab(tab.path)}
            onContextMenu={e => handleContextMenu(e, tab.path)}
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
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  )
}
