/**
 * ZenHoverBar — always-visible transparent bar at top of screen in Zen Mode.
 * Semi-transparent (30% opacity) by default, full opacity on hover.
 * Left: logo. Center: mode switcher + zen toggle. Right: theme + settings.
 */
import type { EditorMode, Theme } from '@/types'
import { Sun, Moon, Monitor, BookOpen, Settings } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { ModeSwitcher } from './ModeSwitcher'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { ZenIcon } from './zenIcon'
import { getNextTheme } from './themeUtils'
import styles from './ZenHoverBar.module.css'

interface ZenHoverBarProps {
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
  onToggleZenMode: () => void
  theme: Theme
  onSetTheme: (t: Theme) => void
  onOpenSettings: () => void
}

const THEME_ICON_MAP: Record<Theme, typeof Sun> = {
  auto: Monitor,
  dark: Moon,
  sepia: BookOpen,
  light: Sun,
}

export function ZenHoverBar({
  editorMode,
  onSetEditorMode,
  onToggleZenMode,
  theme,
  onSetTheme,
  onOpenSettings,
}: ZenHoverBarProps) {
  const Icon = THEME_ICON_MAP[theme]

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.logo} title="mdpad">
          <Logo size={16} />
        </div>
      </div>

      <div className={styles.center}>
        <ModeSwitcher editorMode={editorMode} onSetEditorMode={onSetEditorMode} />
        <div className={styles.zenToggle}>
          <ToggleSwitch
            checked={true}
            onChange={onToggleZenMode}
            icon={ZenIcon}
            label="Zen"
            title="Exit Zen Mode (Esc)"
          />
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={() => onSetTheme(getNextTheme(theme))}
          title={`Theme: ${theme} (click to cycle)`}
        >
          <Icon size={14} strokeWidth={1.75} />
        </button>
        <button className={styles.iconBtn} onClick={onOpenSettings} title="Settings (Ctrl+,)">
          <Settings size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}
