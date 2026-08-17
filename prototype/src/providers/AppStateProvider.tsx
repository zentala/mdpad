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
import { markdownFiles, defaultFilePath, fileTree as staticFileTree, IS_TAURI } from '@/data'
import { useTauriFiles } from '@/hooks/useTauriFiles'
import { openFolder as openFolderAdapter } from '@/data/fsAdapter'
import { useCliArgs, type CliArgsPayload } from '@/hooks/useCliArgs'

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
  const [tauriTree, setTauriTree] = useState<FileNode[]>([])
  const [tauriContents, setTauriContents] = useState<Record<string, string>>({})
  const [webTree, setWebTree] = useState<FileNode[] | null>(null)
  const [webHandles, setWebHandles] = useState<Record<string, FileSystemFileHandle>>({})
  const [rootPath, setRootPath] = useState<string | null>(() => (IS_TAURI ? '.' : null))
  const editorRef = useRef<EditorRef | null>(null)

  const handleCliArgs = useCallback(
    (args: CliArgsPayload) => {
      setRootPath(args.rootPath)
      if (args.initialFile) {
        dispatch({ type: 'OPEN_FILE', path: args.initialFile })
      }
    },
    [dispatch],
  )

  useCliArgs(handleCliArgs)

  const openFolder = useCallback(() => {
    void openFolderAdapter().then(result => {
      if (!result) return
      setWebTree(result.tree)
      setWebHandles(result.fileHandles ?? {})
    })
  }, [])

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
    const tabId = activeTab.id
    const tabPath = activeTab.path
    loadFile(tabPath)
      .then(content => {
        if (content) setTauriContents(prev => ({ ...prev, [tabPath!]: content }))
      })
      .catch(err => {
        console.error('Failed to load file:', tabPath, err)
        const message = err instanceof Error ? err.message : String(err)
        dispatch({
          type: 'SET_TAB_ERROR',
          id: tabId,
          error: `Failed to load "${tabPath}": ${message}`,
        })
      })
  }, [activeTab?.id, activeTab?.path, loadFile, tauriContents])

  // Initialize file content in state when a file is opened
  useEffect(() => {
    if (!activeTab?.path || activeTab.type !== 'file') return
    const path = activeTab.path
    if (state.fileContents[path] !== undefined) return
    const source = IS_TAURI ? tauriContents[path] : markdownFiles[path]
    if (source !== undefined) {
      dispatch({ type: 'INIT_FILE_CONTENT', path, content: source })
    }
  }, [activeTab?.path, activeTab?.type, state.fileContents, tauriContents])

  // Read content for a file opened from a web directory picker (via its handle)
  useEffect(() => {
    if (IS_TAURI || !activeTab?.path || activeTab.type !== 'file') return
    const path = activeTab.path
    if (state.fileContents[path] !== undefined) return
    const handle = webHandles[path]
    if (!handle) return
    const tabId = activeTab.id
    handle
      .getFile()
      .then(f => f.text())
      .then(content => dispatch({ type: 'INIT_FILE_CONTENT', path, content }))
      .catch(err => {
        const message = err instanceof Error ? err.message : String(err)
        dispatch({ type: 'SET_TAB_ERROR', id: tabId, error: `Failed to load "${path}": ${message}` })
      })
  }, [activeTab?.id, activeTab?.path, activeTab?.type, state.fileContents, webHandles])

  // Resolve active markdown from editable state, falling back to source data
  const activeMarkdown = (() => {
    const tab = activeTab
    if (!tab || tab.type !== 'file' || !tab.path) return ''
    if (state.fileContents[tab.path] !== undefined) return state.fileContents[tab.path]
    if (IS_TAURI) return tauriContents[tab.path] ?? ''
    if (webHandles[tab.path]) return '' // content loads async from the file handle
    return markdownFiles[tab.path] ?? `# File not found\n\n\`${tab.path}\` is not available.`
  })()

  const currentFileTree = IS_TAURI ? tauriTree : (webTree ?? staticFileTree)
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
