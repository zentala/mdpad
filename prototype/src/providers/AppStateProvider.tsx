import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import type { Theme, EditorMode, FileNode, EditorRef } from '@/types'
import { defaultFilePath } from '@/data'
import { useHostFiles } from '@/hooks/useHostFiles'

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
  /** Set when the file failed to load — displayed instead of content */
  loadError?: string
}

interface AppState {
  sidebarOpen: boolean
  sidebarPanel: 'explorer' | 'search' | 'settings'
  tocOpen: boolean
  theme: Theme
  editorMode: EditorMode
  tabs: Tab[]
  activeTabId: string | null
  searchQuery: string
  zoom: number
  zenMode: boolean
  /** Editable file contents — initialized from mock/Tauri data, updated by editors */
  fileContents: Record<string, string>
  /** Original file contents at open time — for dirty tracking */
  originalContents: Record<string, string>
  /** Web File System Access handles for files opened/saved outside Tauri, keyed by tab path */
  fileHandles: Record<string, FileSystemFileHandle>
}

type Action =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_PANEL'; panel: 'explorer' | 'search' | 'settings' }
  | { type: 'TOGGLE_TOC' }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_EDITOR_MODE'; mode: EditorMode }
  | { type: 'OPEN_FILE'; path: string }
  | { type: 'CLOSE_TAB'; id: string }
  | { type: 'CLOSE_OTHER_TABS'; id: string }
  | { type: 'CLOSE_ALL_TABS' }
  | { type: 'SET_ACTIVE_TAB'; id: string }
  | { type: 'NEW_FILE' }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'TOGGLE_ZEN_MODE' }
  | { type: 'SET_TAB_ERROR'; id: string; error: string }
  | { type: 'UPDATE_CONTENT'; path: string; content: string }
  | { type: 'SAVE_FILE'; path: string }
  | { type: 'INIT_FILE_CONTENT'; path: string; content: string }
  | {
      type: 'OPEN_EXTERNAL_FILE'
      path: string
      name: string
      content: string
      handle?: FileSystemFileHandle
    }
  | {
      type: 'SAVE_FILE_AS'
      tabId: string
      path: string
      name: string
      content: string
      handle?: FileSystemFileHandle
    }

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
    fileContents: {},
    originalContents: {},
    fileHandles: {},
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

    case 'SET_ZOOM':
      return { ...state, zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, action.zoom)) }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }

    case 'TOGGLE_ZEN_MODE':
      return { ...state, zenMode: !state.zenMode }

    case 'SET_TAB_ERROR': {
      const tabs = state.tabs.map(t => (t.id === action.id ? { ...t, loadError: action.error } : t))
      return { ...state, tabs }
    }

    case 'INIT_FILE_CONTENT': {
      if (state.fileContents[action.path] !== undefined) return state
      return {
        ...state,
        fileContents: { ...state.fileContents, [action.path]: action.content },
        originalContents: { ...state.originalContents, [action.path]: action.content },
      }
    }

    case 'UPDATE_CONTENT': {
      const newContents = { ...state.fileContents, [action.path]: action.content }
      const isModified = action.content !== state.originalContents[action.path]
      const tabs = state.tabs.map(t =>
        t.path === action.path ? { ...t, modified: isModified } : t,
      )
      return { ...state, fileContents: newContents, tabs }
    }

    case 'SAVE_FILE': {
      const content = state.fileContents[action.path]
      if (content === undefined) return state
      const newOriginal = { ...state.originalContents, [action.path]: content }
      const tabs = state.tabs.map(t => (t.path === action.path ? { ...t, modified: false } : t))
      return { ...state, originalContents: newOriginal, tabs }
    }

    case 'OPEN_EXTERNAL_FILE': {
      const existing = state.tabs.find(t => t.path === action.path)
      const fileHandles = action.handle
        ? { ...state.fileHandles, [action.path]: action.handle }
        : state.fileHandles
      if (existing) {
        return {
          ...state,
          activeTabId: existing.id,
          fileContents: { ...state.fileContents, [action.path]: action.content },
          originalContents: { ...state.originalContents, [action.path]: action.content },
          fileHandles,
        }
      }
      const tab: Tab = {
        id: `file-${action.path}`,
        type: 'file',
        path: action.path,
        name: action.name,
      }
      return {
        ...state,
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
        fileContents: { ...state.fileContents, [action.path]: action.content },
        originalContents: { ...state.originalContents, [action.path]: action.content },
        fileHandles,
      }
    }

    case 'SAVE_FILE_AS': {
      const oldTab = state.tabs.find(t => t.id === action.tabId)
      const oldPath = oldTab?.path
      const tabs = state.tabs.map(t =>
        t.id === action.tabId ? { ...t, path: action.path, name: action.name, modified: false } : t,
      )
      const fileContents = { ...state.fileContents, [action.path]: action.content }
      const originalContents = { ...state.originalContents, [action.path]: action.content }
      const fileHandles = { ...state.fileHandles }
      if (action.handle) fileHandles[action.path] = action.handle
      if (oldPath && oldPath !== action.path) {
        delete fileContents[oldPath]
        delete originalContents[oldPath]
        delete fileHandles[oldPath]
      }
      return { ...state, tabs, fileContents, originalContents, fileHandles }
    }

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
  editorRef: RefObject<EditorRef | null>
  /** Open a folder (web: directory picker) and replace the file tree. */
  openFolder: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const [osTheme, setOsTheme] = useState<'dark' | 'light'>(getOsTheme)
  const editorRef = useRef<EditorRef | null>(null)

  const activeTab = getActiveTab(state)

  const handleInitContent = useCallback(
    (path: string, content: string) => dispatch({ type: 'INIT_FILE_CONTENT', path, content }),
    [],
  )
  const handleLoadError = useCallback(
    (id: string, error: string) => dispatch({ type: 'SET_TAB_ERROR', id, error }),
    [],
  )
  const handleOpenInitialFile = useCallback(
    (path: string) => dispatch({ type: 'OPEN_FILE', path }),
    [],
  )

  const { fileTree, resolveMarkdown, openFolder } = useHostFiles({
    activeTab,
    fileContents: state.fileContents,
    onInitContent: handleInitContent,
    onLoadError: handleLoadError,
    onOpenInitialFile: handleOpenInitialFile,
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

  const activeMarkdown = resolveMarkdown(activeTab)

  const showToolbar = state.editorMode !== 'preview' && activeTab?.type === 'file'
  const showToc = state.tocOpen && activeTab?.type === 'file'

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        activeTab,
        activeMarkdown,
        fileTree,
        showToolbar,
        showToc,
        resolvedTheme,
        editorRef,
        openFolder,
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
