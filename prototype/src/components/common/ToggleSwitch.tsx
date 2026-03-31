/**
 * ToggleSwitch — iOS-style on/off toggle with optional icon and label.
 */
import type { ReactNode } from 'react'
import styles from './ToggleSwitch.module.css'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  icon?: ReactNode
  title?: string
}

export function ToggleSwitch({ checked, onChange, label, icon, title }: ToggleSwitchProps) {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.on : ''}`}
      onClick={() => onChange(!checked)}
      title={title}
      role="switch"
      aria-checked={checked}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </button>
  )
}
