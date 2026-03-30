import { useState } from 'react'
import type { FrontmatterData } from '@/types'
import styles from './FrontmatterDisplay.module.css'

interface FrontmatterDisplayProps {
  data: FrontmatterData
}

const STATUS_COLORS: Record<string, string> = {
  done: 'var(--status-done)',
  completed: 'var(--status-done)',
  development: 'var(--status-progress)',
  'in-progress': 'var(--status-progress)',
  experimental: 'var(--status-progress)',
  blocked: 'var(--status-blocked)',
  deprecated: 'var(--status-blocked)',
}

export function FrontmatterDisplay({ data }: FrontmatterDisplayProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={styles.frontmatter}>
      <button className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <span className={styles.chevron}>{collapsed ? '▶' : '▼'}</span>
        <span className={styles.label}>Properties</span>
        <span className={styles.count}>{Object.keys(data).length}</span>
      </button>
      {!collapsed && (
        <div className={styles.table}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className={styles.row}>
              <span className={styles.key}>{key}</span>
              <span className={styles.value}>
                {key === 'status' || key === 'lifecycle' ? (
                  <StatusPill value={String(value)} />
                ) : (
                  String(value)
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusPill({ value }: { value: string }) {
  const color = STATUS_COLORS[value.toLowerCase()] ?? 'var(--text-muted)'
  return (
    <span
      className={styles.statusPill}
      style={{ '--pill-color': color } as React.CSSProperties}
    >
      <span className={styles.dot} />
      {value}
    </span>
  )
}
