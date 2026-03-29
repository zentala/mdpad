import type { TocHeading } from '@/types'
import styles from './TocPanel.module.css'

interface TocPanelProps {
  headings: TocHeading[]
  activeHeadingId: string | null
  onHeadingClick: (id: string) => void
}

export function TocPanel({ headings, activeHeadingId, onHeadingClick }: TocPanelProps) {
  if (headings.length === 0) {
    return (
      <div className={styles.tocPanel}>
        <div className={styles.header}>
          <span className={styles.title}>OUTLINE</span>
        </div>
        <div className={styles.empty}>No headings found</div>
      </div>
    )
  }

  return (
    <div className={styles.tocPanel}>
      <div className={styles.header}>
        <span className={styles.title}>OUTLINE</span>
        <span className={styles.count}>{headings.length}</span>
      </div>
      <div className={styles.list}>
        {headings.map(heading => (
          <button
            key={heading.id}
            className={`${styles.item} ${activeHeadingId === heading.id ? styles.active : ''}`}
            style={{ paddingLeft: (heading.level - 1) * 12 + 12 }}
            onClick={() => onHeadingClick(heading.id)}
          >
            <span className={styles.levelBadge}>H{heading.level}</span>
            <span className={styles.text}>{heading.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
