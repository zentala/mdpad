/**
 * SidebarBookmarks — vertical tab strip on the right edge of the sidebar.
 * Shows rotated text labels (bottom-to-top) for switching sidebar panels.
 * Active tab merges visually with sidebar content; inactive tabs appear darker.
 * Visible even when sidebar content is collapsed.
 */
import { Files, Search } from 'lucide-react'
import styles from './SidebarBookmarks.module.css'

type SidebarPanel = 'explorer' | 'search'

interface SidebarBookmarksProps {
  activePanel: SidebarPanel
  onSelectPanel: (panel: SidebarPanel) => void
}

const tabs: { panel: SidebarPanel; label: string; Icon: typeof Files }[] = [
  { panel: 'explorer', label: 'Explorer', Icon: Files },
  { panel: 'search', label: 'Search', Icon: Search },
]

export function SidebarBookmarks({ activePanel, onSelectPanel }: SidebarBookmarksProps) {
  return (
    <div className={styles.strip}>
      {tabs.map(({ panel, label, Icon }) => (
        <button
          key={panel}
          className={styles.tab}
          data-active={activePanel === panel}
          onClick={() => onSelectPanel(panel)}
          title={label}
        >
          <span className={styles.label}>
            <Icon className={styles.icon} />
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
