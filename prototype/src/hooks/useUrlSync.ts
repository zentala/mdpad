import { useEffect, useRef } from 'react'
import type { Tab } from '@/providers/AppStateProvider'

/** Build a pathname from the active tab state */
function tabToPath(tab: Tab | null): string {
  if (!tab) return '/'
  if (tab.type === 'settings') return '/settings'
  if (tab.type === 'file' && tab.path) return `/${encodeURI(tab.path)}`
  return '/'
}

/** Route descriptor parsed from the current URL */
export interface UrlRoute {
  type: 'file' | 'settings' | 'empty'
  path?: string
}

/** Parse a pathname into a route descriptor */
export function parseUrl(pathname: string): UrlRoute {
  const clean = decodeURIComponent(pathname)
  if (clean === '/settings') return { type: 'settings' }
  if (clean.length > 1) {
    const filePath = clean.startsWith('/') ? clean.slice(1) : clean
    if (filePath && filePath !== 'settings') return { type: 'file', path: filePath }
  }
  return { type: 'empty' }
}

interface UseUrlSyncOptions {
  activeTab: Tab | null
  dispatch: React.Dispatch<
    | { type: 'OPEN_FILE'; path: string }
    | { type: 'OPEN_SETTINGS' }
    | { type: 'SET_ACTIVE_TAB'; id: string }
  >
}

/**
 * Synchronize URL pathname with the active tab state.
 * - Files: /Welcome.md, /docs/README.md
 * - Settings: /settings
 * - Empty: /
 */
export function useUrlSync({ activeTab, dispatch }: UseUrlSyncOptions) {
  const isPopstateRef = useRef(false)

  useEffect(() => {
    const route = parseUrl(window.location.pathname)
    if (route.type === 'file' && route.path) {
      dispatch({ type: 'OPEN_FILE', path: route.path })
    } else if (route.type === 'settings') {
      dispatch({ type: 'OPEN_SETTINGS' })
    }
  }, [dispatch])

  useEffect(() => {
    if (isPopstateRef.current) {
      isPopstateRef.current = false
      return
    }
    const desired = tabToPath(activeTab)
    if (window.location.pathname !== desired) {
      window.history.pushState(null, '', desired)
    }
  }, [activeTab?.id, activeTab?.type, activeTab?.path])

  useEffect(() => {
    const onPopState = () => {
      isPopstateRef.current = true
      const route = parseUrl(window.location.pathname)
      if (route.type === 'file' && route.path) {
        dispatch({ type: 'OPEN_FILE', path: route.path })
      } else if (route.type === 'settings') {
        dispatch({ type: 'OPEN_SETTINGS' })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [dispatch])
}
