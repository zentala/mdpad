import { useState, useEffect, useCallback } from 'react'
import styles from './FloatingToolbar.module.css'

export function FloatingToolbar() {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setVisible(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setPosition({
      top: rect.top - 44,
      left: rect.left + rect.width / 2,
    })
    setVisible(true)
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mouseup', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mouseup', handleSelectionChange)
    }
  }, [handleSelectionChange])

  if (!visible) return null

  return (
    <div
      className={styles.floating}
      style={{ top: position.top, left: position.left }}
    >
      <button className={styles.btn} title="Bold"><b>B</b></button>
      <button className={styles.btn} title="Italic"><i>I</i></button>
      <button className={styles.btn} title="Strikethrough"><s>S</s></button>
      <button className={`${styles.btn} ${styles.mono}`} title="Code">&lt;&gt;</button>
      <div className={styles.divider} />
      <button className={styles.btn} title="Link">🔗</button>
      <button className={styles.btn} title="Highlight">🖍</button>
    </div>
  )
}
