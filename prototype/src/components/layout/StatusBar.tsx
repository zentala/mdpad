import { Pen, FileCode, Eye, Type, Hash, Clock, FileType, WrapText, GitBranch, HardDrive } from 'lucide-react'
import type { EditorMode } from '@/types'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  wordCount: number
  charCount: number
  editorMode: EditorMode
  readingTime?: number
}

const MODE_CONFIG = {
  write: { icon: Pen, label: 'Write' },
  code: { icon: FileCode, label: 'Code' },
  preview: { icon: Eye, label: 'Preview' },
} as const

export function StatusBar({ wordCount, charCount, editorMode, readingTime }: StatusBarProps) {
  const mode = MODE_CONFIG[editorMode]
  const ModeIcon = mode.icon

  return (
    <div className={styles.statusBar}>
      <span className={styles.branch}>
        <GitBranch size={11} strokeWidth={1.5} />
        main
      </span>
      <span className={styles.divider} />
      <span className={styles.segment}>
        <Type size={11} strokeWidth={1.5} />
        {wordCount.toLocaleString()} words
      </span>
      <span className={styles.segment}>
        <Hash size={11} strokeWidth={1.5} />
        {charCount.toLocaleString()} chars
      </span>
      {readingTime && (
        <span className={styles.segment}>
          <Clock size={11} strokeWidth={1.5} />
          ~{readingTime} min
        </span>
      )}
      <span className={styles.divider} />
      <span className={styles.segment}>
        <HardDrive size={11} strokeWidth={1.5} />
        12.4 KB
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
      <span className={styles.divider} />
      <span className={styles.mode}>
        <ModeIcon size={11} strokeWidth={1.75} />
        {mode.label}
      </span>
    </div>
  )
}
