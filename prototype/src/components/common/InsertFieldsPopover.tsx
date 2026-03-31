/**
 * InsertFieldsPopover — reusable popover for inserting markdown with input fields.
 * Used by InsertLinkPopover and InsertImagePopover.
 */
import { useState, useRef, useEffect } from 'react'
import styles from './InsertPopover.module.css'

export interface PopoverField {
  key: string
  label: string
  placeholder: string
  required?: boolean
}

interface InsertFieldsPopoverProps {
  title: string
  fields: PopoverField[]
  anchorRect: DOMRect
  onInsert: (values: Record<string, string>) => void
  onClose: () => void
}

export function InsertFieldsPopover({
  title,
  fields,
  anchorRect,
  onInsert,
  onClose,
}: InsertFieldsPopoverProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, ''])),
  )
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const hasRequired = fields.every(f => !f.required || values[f.key]?.trim())
    if (!hasRequired) return
    onInsert(values)
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
        <p className={styles.title}>{title}</p>
        {fields.map((field, i) => (
          <div key={field.key} className={styles.field}>
            <label className={styles.label}>{field.label}</label>
            <input
              ref={i === 0 ? firstRef : undefined}
              className={styles.input}
              placeholder={field.placeholder}
              value={values[field.key]}
              onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
            />
          </div>
        ))}
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
