/**
 * ToggleSwitch — iOS-style on/off toggle with optional label.
 */
import styles from './ToggleSwitch.module.css'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  title?: string
}

export function ToggleSwitch({ checked, onChange, label, title }: ToggleSwitchProps) {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.on : ''}`}
      onClick={() => onChange(!checked)}
      title={title}
      role="switch"
      aria-checked={checked}
    >
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </button>
  )
}
