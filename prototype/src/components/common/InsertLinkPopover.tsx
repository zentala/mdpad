/**
 * InsertLinkPopover — popover for inserting markdown links at cursor.
 * Renders anchored to a button position. Inserts `[text](url)`.
 */
import { useState, useRef, useEffect } from 'react'
import styles from './InsertPopover.module.css'

interface InsertLinkPopoverProps {
  anchorRect: DOMRect
  onInsert: (markdown: string) => void
  onClose: () => void
}

export function InsertLinkPopover({ anchorRect, onInsert, onClose }: InsertLinkPopoverProps) {
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    urlRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (!url.trim()) return
    const label = text.trim() || url.trim()
    onInsert(`[${label}](${url.trim()})`)
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
        <p className={styles.title}>Insert Link</p>
        <div className={styles.field}>
          <label className={styles.label}>URL</label>
          <input
            ref={urlRef}
            className={styles.input}
            placeholder="https://..."
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Text (optional)</label>
          <input
            className={styles.input}
            placeholder="Link text"
            value={text}
            onChange={e => setText(e.target.value)}
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
