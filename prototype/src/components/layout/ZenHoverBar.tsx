/**
 * ZenHoverBar — floating bar that appears when hovering the top edge of the
 * screen in Zen Mode. Shows centered mode switcher + zen toggle (JetBrains pattern).
 */
import { useState, useRef, useCallback } from 'react'
import type { EditorMode } from '@/types'
import { ModeSwitcher } from './ModeSwitcher'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import styles from './ZenHoverBar.module.css'

interface ZenHoverBarProps {
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
  onToggleZenMode: () => void
}

const HIDE_DELAY = 1500

export function ZenHoverBar({ editorMode, onSetEditorMode, onToggleZenMode }: ZenHoverBarProps) {
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
        <div className={styles.spacer} />
        <ModeSwitcher editorMode={editorMode} onSetEditorMode={onSetEditorMode} />
        <div className={styles.zenToggle}>
          <ToggleSwitch
            checked={true}
            onChange={onToggleZenMode}
            label="Zen"
            title="Exit Zen Mode (Esc)"
          />
        </div>
        <div className={styles.spacer} />
      </div>
    </>
  )
}
