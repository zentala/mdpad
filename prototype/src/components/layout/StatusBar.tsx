import type { EditorMode } from '@/types'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  filePath: string | null
  wordCount: number
  charCount: number
  editorMode: EditorMode
}

export function StatusBar({ filePath, wordCount, charCount, editorMode }: StatusBarProps) {
  const modeLabel = {
    visual: 'Visual',
    code: 'Code',
    read: 'Read',
  }[editorMode]

  return (
    <div className={styles.statusBar}>
      <span className={styles.segment}>
        words: {wordCount.toLocaleString()}
      </span>
      <span className={styles.segment}>
        chars: {charCount.toLocaleString()}
      </span>
      <span className={styles.divider} />
      <span className={styles.segment}>UTF-8</span>
      <span className={styles.segment}>LF</span>
      <span className={styles.segment}>MD</span>
      <span className={styles.divider} />
      <span className={styles.mode}>{modeLabel}</span>
      <span className={styles.spacer} />
      <span className={styles.filepath}>{filePath ?? 'No file open'}</span>
    </div>
  )
}
