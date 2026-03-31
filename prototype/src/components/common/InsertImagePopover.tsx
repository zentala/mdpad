/**
 * InsertImagePopover — popover for inserting markdown images at cursor.
 * Inserts `![alt](url)`.
 */
import { useState, useRef, useEffect } from 'react'
import styles from './InsertPopover.module.css'

interface InsertImagePopoverProps {
  anchorRect: DOMRect
  onInsert: (markdown: string) => void
  onClose: () => void
}

export function InsertImagePopover({ anchorRect, onInsert, onClose }: InsertImagePopoverProps) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    urlRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (!url.trim()) return
    onInsert(`![${alt.trim() || 'image'}](${url.trim()})`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.popover}
        style={{ top: anchorRect.bottom + 4, left: anchorRect.left }}
        onKeyDown={handleKeyDown}
      >
        <p className={styles.title}>Insert Image</p>
        <div className={styles.field}>
          <label className={styles.label}>Image URL</label>
          <input
            ref={urlRef}
            className={styles.input}
            placeholder="https://...image.png"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Alt text (optional)</label>
          <input
            className={styles.input}
            placeholder="Description"
            value={alt}
            onChange={e => setAlt(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={onClose}>
            Cancel
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
            Insert
          </button>
        </div>
      </div>
    </>
  )
}
