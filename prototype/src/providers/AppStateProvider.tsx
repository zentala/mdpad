import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Theme, EditorMode, FileNode } from '@/types'
import { markdownFiles, defaultFilePath, fileTree as staticFileTree, IS_TAURI } from '@/data'
import { useTauriFiles } from '@/hooks/useTauriFiles'

const THEME_KEY = 'mdpad-theme'
const VALID_THEMES: Theme[] = ['dark', 'light', 'sepia', 'auto']

/** Read persisted theme from localStorage */
function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored && VALID_THEMES.includes(stored as Theme)) return stored as Theme
  } catch {
    /* localStorage unavailable */
  }
  return 'auto'
}

/** Save theme to localStorage */
function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* noop */
  }
}

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
  zenMode: boolean
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
  | { type: 'TOGGLE_ZEN_MODE' }

const initialTab: Tab = {
  id: 'welcome',
  type: 'file',
  path: defaultFilePath,
  name: defaultFilePath.split('/').pop() ?? defaultFilePath,
}

function createInitialState(): AppState {
  return {
    sidebarOpen: true,
    sidebarPanel: 'explorer',
    tocOpen: true,
    theme: loadTheme(),
    editorMode: 'write',
    tabs: [initialTab],
    activeTabId: 'welcome',
    searchQuery: '',
    zoom: 100,
    zenMode: false,
  }
}

const MIN_ZOOM = 50
const MAX_ZOOM = 200

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
      return { ...state, zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, action.zoom)) }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }

    case 'TOGGLE_ZEN_MODE':
      return { ...state, zenMode: !state.zenMode }

    default:
      return state
  }
}

/** Derived state helpers */
function getActiveTab(state: AppState): Tab | null {
  return state.tabs.find(t => t.id === state.activeTabId) ?? null
}

/** Resolve 'auto' theme to actual dark/light based on OS preference */
function getOsTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Context */
interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
  activeTab: Tab | null
  activeMarkdown: string
  fileTree: FileNode[]
  showToolbar: boolean
  showToc: boolean
  resolvedTheme: 'dark' | 'light' | 'sepia'
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const [osTheme, setOsTheme] = useState<'dark' | 'light'>(getOsTheme)
  const [tauriTree, setTauriTree] = useState<FileNode[]>([])
  const [tauriContents, setTauriContents] = useState<Record<string, string>>({})
  const [rootPath] = useState<string | null>(() => (IS_TAURI ? '.' : null))

  const handleFileTree = useCallback((tree: FileNode[]) => setTauriTree(tree), [])
  const handleFileContent = useCallback((path: string, content: string) => {
    if (content) setTauriContents(prev => ({ ...prev, [path]: content }))
  }, [])
  const [treeVersion, setTreeVersion] = useState(0)
  const handleTreeRefresh = useCallback(() => {
    setTreeVersion(v => v + 1)
  }, [])

  const { loadFile } = useTauriFiles({
    rootPath,
    treeVersion,
    onFileTree: handleFileTree,
    onFileContent: handleFileContent,
    onFileTreeRefresh: handleTreeRefresh,
  })

  // Listen for OS color scheme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setOsTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolvedTheme: 'dark' | 'light' | 'sepia' = state.theme === 'auto' ? osTheme : state.theme

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    saveTheme(state.theme)
  }, [resolvedTheme, state.theme])

  const activeTab = getActiveTab(state)

  // Load file content in Tauri mode when active tab changes
  useEffect(() => {
    if (!IS_TAURI || !activeTab?.path) return
    if (tauriContents[activeTab.path]) return
    loadFile(activeTab.path)
      .then(content => {
        if (content) setTauriContents(prev => ({ ...prev, [activeTab.path!]: content }))
      })
      .catch(err => console.error('Failed to load file:', activeTab.path, err))
  }, [activeTab?.path, loadFile, tauriContents])

  // Resolve active markdown from either Tauri cache or static files
  const activeMarkdown = (() => {
    const tab = activeTab
    if (!tab || tab.type !== 'file' || !tab.path) return ''
    if (IS_TAURI) return tauriContents[tab.path] ?? ''
    return markdownFiles[tab.path] ?? `# File not found\n\n\`${tab.path}\` is not available.`
  })()

  const currentFileTree = IS_TAURI ? tauriTree : staticFileTree
  const showToolbar = state.editorMode !== 'preview' && activeTab?.type === 'file'
  const showToc = state.tocOpen && activeTab?.type === 'file'

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        activeTab,
        activeMarkdown,
        fileTree: currentFileTree,
        showToolbar,
        showToc,
        resolvedTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppStateProvider')
  return ctx
}
