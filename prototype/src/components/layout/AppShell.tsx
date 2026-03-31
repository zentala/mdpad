import type { ReactNode } from 'react'
import styles from './AppShell.module.css'

interface AppShellProps {
  menuBar: ReactNode
  zenBar: ReactNode
  activityBar: ReactNode
  sidebar: ReactNode
  toolbar: ReactNode
  main: ReactNode
  statusBar: ReactNode
  sidebarOpen: boolean
  zenMode?: boolean
  /** Base font size for editor content (e.g. '16') */
  fontSize?: string
}

export function AppShell({
  menuBar,
  zenBar,
  activityBar,
  sidebar,
  toolbar,
  main,
  statusBar,
  sidebarOpen,
  zenMode = false,
  fontSize,
}: AppShellProps) {
  const shellStyle = fontSize
    ? ({ '--editor-font-size': `${fontSize}px` } as React.CSSProperties)
    : undefined

  return (
    <div className={styles.shell} data-zen={zenMode} style={shellStyle}>
      {zenMode ? zenBar : <div className={styles.menuBar}>{menuBar}</div>}
      <div className={styles.body}>
        {!zenMode && activityBar}
        {!zenMode && sidebarOpen && <div className={styles.sidebar}>{sidebar}</div>}
        <div className={styles.mainColumn}>
          {!zenMode && toolbar && <div className={styles.toolbar}>{toolbar}</div>}
          <div className={styles.contentRow}>
            <div className={styles.main}>{main}</div>
          </div>
        </div>
      </div>
      {!zenMode && <div className={styles.statusBar}>{statusBar}</div>}
    </div>
  )
}
