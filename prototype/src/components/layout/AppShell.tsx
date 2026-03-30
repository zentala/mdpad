import type { ReactNode } from 'react'
import styles from './AppShell.module.css'

interface AppShellProps {
  menuBar: ReactNode
  sidebarBookmarks: ReactNode
  sidebar: ReactNode
  toolbar: ReactNode
  main: ReactNode
  toc: ReactNode
  statusBar: ReactNode
  sidebarOpen: boolean
  tocOpen: boolean
  zenMode?: boolean
}

export function AppShell({
  menuBar,
  sidebarBookmarks,
  sidebar,
  toolbar,
  main,
  toc,
  statusBar,
  sidebarOpen,
  tocOpen,
  zenMode = false,
}: AppShellProps) {
  return (
    <div className={styles.shell} data-zen={zenMode}>
      {!zenMode && <div className={styles.menuBar}>{menuBar}</div>}
      <div className={styles.body}>
        {!zenMode && sidebarOpen && (
          <div className={styles.sidebar}>{sidebar}</div>
        )}
        {!zenMode && sidebarBookmarks}
        <div className={styles.mainColumn}>
          {!zenMode && toolbar && <div className={styles.toolbar}>{toolbar}</div>}
          <div className={styles.contentRow}>
            <div className={styles.main}>{main}</div>
            {!zenMode && tocOpen && <div className={styles.resizerV} />}
            {!zenMode && tocOpen && <div className={styles.toc}>{toc}</div>}
          </div>
        </div>
      </div>
      {!zenMode && <div className={styles.statusBar}>{statusBar}</div>}
    </div>
  )
}
