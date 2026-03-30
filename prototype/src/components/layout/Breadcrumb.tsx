import { ChevronRight } from 'lucide-react'
import styles from './Breadcrumb.module.css'

interface BreadcrumbProps {
  filePath: string | null
}

export function Breadcrumb({ filePath }: BreadcrumbProps) {
  if (!filePath) return null

  const segments = filePath.split('/')

  return (
    <div className={styles.breadcrumb}>
      {segments.map((segment, i) => (
        <span key={i} className={styles.segment}>
          {i > 0 && <ChevronRight size={12} className={styles.separator} />}
          <span className={i === segments.length - 1 ? styles.current : styles.ancestor}>
            {segment}
          </span>
        </span>
      ))}
    </div>
  )
}
