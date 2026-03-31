/**
 * ModeSwitcher — reusable editor mode toggle: Edit [Visual|Code] or Preview.
 * Used in MenuBar and ZenHoverBar.
 */
import { Pen, FileCode, Eye, TextCursorInput } from 'lucide-react'
import type { EditorMode } from '@/types'
import styles from './ModeSwitcher.module.css'

interface ModeSwitcherProps {
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
}

export function ModeSwitcher({ editorMode, onSetEditorMode }: ModeSwitcherProps) {
  return (
    <div className={styles.modeSwitch}>
      <Pen size={11} strokeWidth={1.5} className={styles.modeLabelIcon} />
      <span className={styles.modeLabel}>Edit</span>
      <div className={styles.editGroup}>
        <button
          className={`${styles.modeBtn} ${styles.modeBtnLeft} ${editorMode === 'write' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('write')}
          title="Visual editor — formatted preview (Ctrl+E)"
        >
          <TextCursorInput size={12} strokeWidth={1.75} />
          Visual
        </button>
        <button
          className={`${styles.modeBtn} ${styles.modeBtnRight} ${editorMode === 'code' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('code')}
          title="Code editor — raw Markdown (Ctrl+Shift+E)"
        >
          <FileCode size={12} strokeWidth={1.75} />
          Code
        </button>
      </div>
      <span className={styles.modeSeparator}>or</span>
      <button
        className={`${styles.modeBtn} ${styles.modeBtnStandalone} ${editorMode === 'preview' ? styles.modeActive : ''}`}
        onClick={() => onSetEditorMode('preview')}
        title="Preview — read-only (Ctrl+Shift+P)"
      >
        <Eye size={12} strokeWidth={1.75} />
        Preview
      </button>
    </div>
  )
}
