/** Shared theme utilities used by MenuBar and ZenHoverBar */
import type { Theme } from '@/types'

const THEME_CYCLE: Theme[] = ['auto', 'dark', 'light', 'sepia']

export function getNextTheme(current: Theme): Theme {
  return THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length]
}

/** Map theme to icon name for lookup outside render */
export type ThemeIconName = 'Monitor' | 'Moon' | 'BookOpen' | 'Sun'

export function getThemeIconName(theme: Theme): ThemeIconName {
  if (theme === 'auto') return 'Monitor'
  if (theme === 'dark') return 'Moon'
  if (theme === 'sepia') return 'BookOpen'
  return 'Sun'
}
