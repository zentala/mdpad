/**
 * ZenHoverBar — floating bar that appears when hovering the top edge of the
 * screen in Zen Mode. Shows mode switcher + exit button (JetBrains pattern).
 */
import { useState, useRef, useCallback } from 'react'
import { Minimize2 } from 'lucide-react'
import type { EditorMode } from '@/types'
import { ModeSwitcher } from './ModeSwitcher'
import styles from './ZenHoverBar.module.css'

interface ZenHoverBarProps {
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
  onExitZenMode: () => void
}

const HIDE_DELAY = 1500

export function ZenHoverBar({ editorMode, onSetEditorMode, onExitZenMode }: ZenHoverBarProps) {
  const [visible, setVisible] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }, [])

  const handleZoneEnter = useCallback(() => {
    clearHideTimer()
    setVisible(true)
  }, [clearHideTimer])

  const handleBarLeave = useCallback(() => {
    clearHideTimer()
    hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }, [clearHideTimer])

  const handleBarEnter = useCallback(() => {
    clearHideTimer()
  }, [clearHideTimer])

  return (
    <>
      <div className={styles.hoverZone} onMouseEnter={handleZoneEnter} />
      <div
        className={`${styles.bar} ${visible ? styles.barVisible : ''}`}
        onMouseEnter={handleBarEnter}
        onMouseLeave={handleBarLeave}
      >
        <ModeSwitcher editorMode={editorMode} onSetEditorMode={onSetEditorMode} />
        <div className={styles.spacer} />
        <button className={styles.exitBtn} onClick={onExitZenMode} title="Exit Zen Mode (Esc)">
          <Minimize2 size={14} strokeWidth={1.75} />
          Exit Zen
        </button>
      </div>
    </>
  )
}
