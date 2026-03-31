/**
 * InsertTablePopover — grid picker for inserting markdown tables.
 * Hover over cells to select rows x cols, click to insert.
 */
import { useState } from 'react'
import styles from './InsertPopover.module.css'

const MAX_ROWS = 8
const MAX_COLS = 8

interface InsertTablePopoverProps {
  anchorRect: DOMRect
  onInsert: (markdown: string) => void
  onClose: () => void
}

/** Generate a markdown table string for given dimensions */
function generateTable(rows: number, cols: number): string {
  const header = '| ' + Array.from({ length: cols }, (_, i) => `Header ${i + 1}`).join(' | ') + ' |'
  const separator = '| ' + Array.from({ length: cols }, () => '---').join(' | ') + ' |'
  const dataRows = Array.from(
    { length: rows - 1 },
    () => '| ' + Array.from({ length: cols }, () => '   ').join(' | ') + ' |',
  )
  return [header, separator, ...dataRows].join('\n')
}

export function InsertTablePopover({ anchorRect, onInsert, onClose }: InsertTablePopoverProps) {
  const [hover, setHover] = useState<{ row: number; col: number }>({ row: 0, col: 0 })

  const handleClick = () => {
    if (hover.row < 1 || hover.col < 1) return
    onInsert('\n' + generateTable(hover.row + 1, hover.col + 1) + '\n')
    onClose()
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.popover}
        style={{ top: anchorRect.bottom + 4, left: anchorRect.left }}
        onKeyDown={e => e.key === 'Escape' && onClose()}
      >
        <p className={styles.title}>Insert Table</p>
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 20px)` }}
          onClick={handleClick}
        >
          {Array.from({ length: MAX_ROWS * MAX_COLS }, (_, i) => {
            const row = Math.floor(i / MAX_COLS)
            const col = i % MAX_COLS
            const isActive = row <= hover.row && col <= hover.col
            return (
              <div
                key={i}
                className={`${styles.cell} ${isActive ? styles.active : ''}`}
                onMouseEnter={() => setHover({ row, col })}
              />
            )
          })}
        </div>
        <p className={styles.gridLabel}>
          {hover.row + 1} x {hover.col + 1}
        </p>
      </div>
    </>
  )
}
