/**
 * useSettings — persists non-theme settings to localStorage.
 * Theme is managed by AppStateProvider (single source of truth).
 */
import { useState, useCallback, useEffect } from 'react'
import { useAppContext } from '@/providers/AppStateProvider'
import type { Theme } from '@/types'

const SETTINGS_KEY = 'mdpad-settings'

/** Settings state persisted to localStorage */
export interface SettingsState {
  theme: Theme
  fontSize: string
  wordWrap: boolean
  foldersCollapsed: boolean
  renderMath: boolean
  renderMermaid: boolean
  extensions: Record<string, boolean>
  excludePatterns: string[]
  startupBehavior: string
  confirmBeforeClose: boolean
}

export const DEFAULT_SETTINGS: SettingsState = {
  theme: 'auto',
  fontSize: '16',
  wordWrap: true,
  foldersCollapsed: true,
  renderMath: true,
  renderMermaid: true,
  extensions: {
    '.md': true,
    '.markdown': true,
    '.yaml': false,
    '.yml': false,
    '.json': false,
  },
  startupBehavior: 'last-session',
  confirmBeforeClose: true,
  excludePatterns: ['node_modules', '.git', 'dist'],
}

/** Load non-theme settings from localStorage with per-key validation */
function loadSettings(): Partial<Omit<SettingsState, 'theme'>> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as Partial<Omit<SettingsState, 'theme'>>
  } catch {
    return {}
  }
}

/** Persist non-theme settings to localStorage */
function saveSettings(settings: SettingsState) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { theme, ...rest } = settings
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(rest))
  } catch {
    /* noop */
  }
}

/** Hook: manages settings state with localStorage persistence + theme sync */
export function useSettings() {
  const { state, dispatch } = useAppContext()

  const [settings, setSettings] = useState<SettingsState>(() => {
    const stored = loadSettings()
    return { ...DEFAULT_SETTINGS, ...stored, theme: state.theme }
  })

  // Sync theme from AppState (e.g. changed via MenuBar cycle button)
  useEffect(() => {
    setSettings(prev => (prev.theme !== state.theme ? { ...prev, theme: state.theme } : prev))
  }, [state.theme])

  const update = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      saveSettings(next)
      return next
    })
  }, [])

  const updateExtension = useCallback((ext: string, enabled: boolean) => {
    setSettings(prev => {
      const next = { ...prev, extensions: { ...prev.extensions, [ext]: enabled } }
      saveSettings(next)
      return next
    })
  }, [])

  const setTheme = useCallback(
    (theme: Theme) => {
      dispatch({ type: 'SET_THEME', theme })
    },
    [dispatch],
  )

  return { settings, update, updateExtension, setTheme }
}
