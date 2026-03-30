import type { ReactNode } from 'react'
import styles from './AppShell.module.css'

interface AppShellProps {
  menuBar: ReactNode
  sidebar: ReactNode
  toolbar: ReactNode
  main: ReactNode
  toc: ReactNode
  statusBar: ReactNode
  sidebarOpen: boolean
  tocOpen: boolean
}

export function AppShell({
  menuBar,
  sidebar,
  toolbar,
  main,
  toc,
  statusBar,
  sidebarOpen,
  tocOpen,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.menuBar}>{menuBar}</div>
      <div className={styles.body}>
        {sidebarOpen && (
          <div className={styles.sidebar}>{sidebar}</div>
        )}
        {sidebarOpen && <div className={styles.resizer} />}
        <div className={styles.mainColumn}>
          {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
          <div className={styles.contentRow}>
            <div className={styles.main}>{main}</div>
            {tocOpen && <div className={styles.resizerV} />}
            {tocOpen && <div className={styles.toc}>{toc}</div>}
          </div>
        </div>
      </div>
      <div className={styles.statusBar}>{statusBar}</div>
    </div>
  )
}
