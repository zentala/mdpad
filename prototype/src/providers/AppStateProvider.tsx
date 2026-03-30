import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { Theme, EditorMode } from '@/types'
import { mockMarkdownFiles, defaultFile } from '@/mock/markdown-content'

/** Tab represents an open document or special view */
export interface Tab {
  id: string
  type: 'file' | 'settings' | 'welcome'
  path?: string
  name: string
  modified?: boolean
}

interface AppState {
  sidebarOpen: boolean
  sidebarPanel: 'explorer' | 'search'
  tocOpen: boolean
  theme: Theme
  editorMode: EditorMode
  tabs: Tab[]
  activeTabId: string | null
  searchQuery: string
  zoom: number
}

type Action =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_PANEL'; panel: 'explorer' | 'search' }
  | { type: 'TOGGLE_TOC' }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_EDITOR_MODE'; mode: EditorMode }
  | { type: 'OPEN_FILE'; path: string }
  | { type: 'CLOSE_TAB'; id: string }
  | { type: 'CLOSE_OTHER_TABS'; id: string }
  | { type: 'CLOSE_ALL_TABS' }
  | { type: 'SET_ACTIVE_TAB'; id: string }
  | { type: 'NEW_FILE' }
  | { type: 'OPEN_SETTINGS' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_SEARCH_QUERY'; query: string }

const initialTab: Tab = {
  id: 'welcome',
  type: 'file',
  path: defaultFile,
  name: defaultFile.split('/').pop() ?? defaultFile,
}

const initialState: AppState = {
  sidebarOpen: true,
  sidebarPanel: 'explorer',
  tocOpen: true,
  theme: 'dark',
  editorMode: 'write',
  tabs: [initialTab],
  activeTabId: 'welcome',
  searchQuery: '',
  zoom: 100,
}

let untitledCounter = 0

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case 'SET_SIDEBAR_PANEL':
      if (state.sidebarPanel === action.panel && state.sidebarOpen) {
        return { ...state, sidebarOpen: false }
      }
      return { ...state, sidebarPanel: action.panel, sidebarOpen: true }

    case 'TOGGLE_TOC':
      return { ...state, tocOpen: !state.tocOpen }

    case 'SET_THEME':
      return { ...state, theme: action.theme }

    case 'SET_EDITOR_MODE':
      return { ...state, editorMode: action.mode }

    case 'OPEN_FILE': {
      const existing = state.tabs.find(t => t.path === action.path)
      if (existing) {
        return { ...state, activeTabId: existing.id }
      }
      const name = action.path.split('/').pop() ?? action.path
      const tab: Tab = { id: `file-${action.path}`, type: 'file', path: action.path, name }
      return { ...state, tabs: [...state.tabs, tab], activeTabId: tab.id }
    }

    case 'CLOSE_TAB': {
      const filtered = state.tabs.filter(t => t.id !== action.id)
      if (filtered.length === 0) {
        return { ...state, tabs: [], activeTabId: null }
      }
      if (state.activeTabId === action.id) {
        return { ...state, tabs: filtered, activeTabId: filtered[filtered.length - 1].id }
      }
      return { ...state, tabs: filtered }
    }

    case 'CLOSE_OTHER_TABS': {
      const kept = state.tabs.filter(t => t.id === action.id)
      return { ...state, tabs: kept, activeTabId: action.id }
    }

    case 'CLOSE_ALL_TABS':
      return { ...state, tabs: [], activeTabId: null }

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTabId: action.id }

    case 'NEW_FILE': {
      untitledCounter++
      const tab: Tab = {
        id: `untitled-${untitledCounter}`,
        type: 'file',
        path: undefined,
        name: `Untitled-${untitledCounter}.md`,
      }
      return { ...state, tabs: [...state.tabs, tab], activeTabId: tab.id }
    }

    case 'OPEN_SETTINGS': {
      const existing = state.tabs.find(t => t.type === 'settings')
      if (existing) return { ...state, activeTabId: existing.id }
      const tab: Tab = { id: 'settings', type: 'settings', name: 'Settings' }
      return { ...state, tabs: [...state.tabs, tab], activeTabId: tab.id }
    }

    case 'SET_ZOOM':
      return { ...state, zoom: Math.min(200, Math.max(50, action.zoom)) }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }

    default:
      return state
  }
}

/** Derived state helpers */
function getActiveTab(state: AppState): Tab | null {
  return state.tabs.find(t => t.id === state.activeTabId) ?? null
}

function getActiveMarkdown(state: AppState): string {
  const tab = getActiveTab(state)
  if (!tab || tab.type !== 'file' || !tab.path) return ''
  return mockMarkdownFiles[tab.path] ?? `# File not found\n\n\`${tab.path}\` is not available.`
}

/** Context */
interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  activeTab: Tab | null
  activeMarkdown: string
  showToolbar: boolean
  showToc: boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Sync theme to DOM (side effect belongs here, not in reducer)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const activeTab = getActiveTab(state)
  const activeMarkdown = getActiveMarkdown(state)
  const showToolbar = state.editorMode !== 'preview' && activeTab?.type === 'file'
  const showToc = state.tocOpen && activeTab?.type === 'file'

  return (
    <AppContext.Provider value={{ state, dispatch, activeTab, activeMarkdown, showToolbar, showToc }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppStateProvider')
  return ctx
}
