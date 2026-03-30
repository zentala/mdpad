/**
 * StatusBar — bottom bar showing file metadata.
 * Only shows file-specific info (words, chars, encoding) when a file is active.
 * Mode display removed — mode switcher in MenuBar is the single source of truth.
 */
import { Type, Hash, Clock, FileType, WrapText, GitBranch, HardDrive } from 'lucide-react'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  wordCount: number
  charCount: number
  fileSize: number
  readingTime?: number
  hasActiveFile: boolean
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function StatusBar({
  wordCount,
  charCount,
  fileSize,
  readingTime,
  hasActiveFile,
}: StatusBarProps) {
  return (
    <div className={styles.statusBar}>
      <span className={styles.branch}>
        <GitBranch size={11} strokeWidth={1.5} />
        main
      </span>
      {hasActiveFile && (
        <>
          <span className={styles.divider} />
          <span className={styles.segment}>
            <Type size={11} strokeWidth={1.5} />
            {wordCount.toLocaleString()} words
          </span>
          <span className={styles.segment}>
            <Hash size={11} strokeWidth={1.5} />
            {charCount.toLocaleString()} chars
          </span>
          {readingTime && readingTime > 0 && (
            <span className={styles.segment}>
              <Clock size={11} strokeWidth={1.5} />~{readingTime} min
            </span>
          )}
          <span className={styles.divider} />
          <span className={styles.segment}>
            <HardDrive size={11} strokeWidth={1.5} />
            {formatSize(fileSize)}
          </span>
          <span className={styles.divider} />
          <span className={styles.segment}>
            <FileType size={11} strokeWidth={1.5} />
            UTF-8
          </span>
          <span className={styles.segment}>
            <WrapText size={11} strokeWidth={1.5} />
            LF
          </span>
        </>
      )}
    </div>
  )
}
