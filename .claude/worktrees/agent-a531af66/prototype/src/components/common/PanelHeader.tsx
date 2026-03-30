/**
 * PanelHeader — reusable header for sidebar panels (Explorer, Search, etc.).
 * Shows an icon, title, and optional action buttons in a consistent layout.
 */
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import styles from './PanelHeader.module.css'

interface PanelHeaderProps {
  icon: LucideIcon
  title: string
  actions?: ReactNode
}

/** CSS class for action buttons inside PanelHeader */
export const panelActionBtn = styles.actionBtn
export const panelActionBtnActive = styles.actionBtnActive

export function PanelHeader({ icon: Icon, title, actions }: PanelHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <Icon size={13} strokeWidth={1.5} className={styles.icon} />
        <span className={styles.title}>{title}</span>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
