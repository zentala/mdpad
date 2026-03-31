/**
 * SettingsProvider — exposes persisted settings to the entire component tree.
 * Wraps useSettings hook in a React context so any component can read settings
 * without prop-drilling. Theme remains synced with AppStateProvider.
 */
import { createContext, useContext, type ReactNode } from 'react'
import { useSettings, DEFAULT_SETTINGS, type SettingsState } from '@/hooks/useSettings'

interface SettingsContextValue {
  settings: SettingsState
  update: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
  updateExtension: (ext: string, enabled: boolean) => void
  setTheme: (theme: SettingsState['theme']) => void
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  update: () => {},
  updateExtension: () => {},
  setTheme: () => {},
})

/** Read-only access to current settings from any component */
export function useSettingsContext(): SettingsContextValue {
  return useContext(SettingsContext)
}

/** Provider that wraps the app tree. Must be inside AppStateProvider. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const value = useSettings()
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
