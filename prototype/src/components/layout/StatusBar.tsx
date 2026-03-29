import type { EditorMode } from '@/types'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  filePath: string | null
  wordCount: number
  charCount: number
  editorMode: EditorMode
  readingTime?: number
}

export function StatusBar({ filePath, wordCount, charCount, editorMode, readingTime }: StatusBarProps) {
  const modeLabel = {
    write: 'Write',
    code: 'Code',
    preview: 'Preview',
  }[editorMode]

  return (
    <div className={styles.statusBar}>
      <span className={styles.segment}>
        {wordCount.toLocaleString()} words
      </span>
      <span className={styles.segment}>
        {charCount.toLocaleString()} chars
      </span>
      {readingTime && (
        <span className={styles.segment}>
          ~{readingTime} min read
        </span>
      )}
      <span className={styles.divider} />
      <span className={styles.segment}>UTF-8</span>
      <span className={styles.segment}>LF</span>
      <span className={styles.divider} />
      <span className={styles.mode}>{modeLabel}</span>
      <span className={styles.spacer} />
      <span className={styles.filepath}>{filePath ?? 'No file open'}</span>
    </div>
  )
}
