/**
 * ActivityBar — VSCode-style vertical icon strip on the left side of the app body.
 * Top section: panel icons (Explorer, Search, Settings).
 * Clicking the active panel toggles the sidebar; clicking an inactive panel switches and opens it.
 */
import { Files, Search, Settings } from 'lucide-react'
import styles from './ActivityBar.module.css'

type SidebarPanel = 'explorer' | 'search' | 'settings'

interface ActivityBarProps {
  activePanel: SidebarPanel
  sidebarOpen: boolean
  onSelectPanel: (panel: SidebarPanel) => void
}

const panelIcons: { panel: SidebarPanel; label: string; Icon: typeof Files }[] = [
  { panel: 'explorer', label: 'Explorer', Icon: Files },
  { panel: 'search', label: 'Search', Icon: Search },
  { panel: 'settings', label: 'Settings', Icon: Settings },
]

export function ActivityBar({ activePanel, sidebarOpen, onSelectPanel }: ActivityBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.topGroup}>
        {panelIcons.map(({ panel, label, Icon }) => (
          <button
            key={panel}
            className={styles.iconBtn}
            data-active={sidebarOpen && activePanel === panel}
            onClick={() => onSelectPanel(panel)}
            title={label}
            aria-label={label}
          >
            <Icon size={24} />
          </button>
        ))}
      </div>
    </div>
  )
}
