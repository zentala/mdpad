import { useState, useCallback } from 'react'
import type { AppState, Theme, EditorMode } from '@/types'
import { defaultFile } from '@/mock/markdown-content'

const initialState: AppState = {
  sidebarOpen: true,
  tocOpen: true,
  theme: 'dark',
  editorMode: 'visual',
  activeFilePath: defaultFile,
  searchQuery: '',
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState)

  const toggleSidebar = useCallback(() => {
    setState(s => ({ ...s, sidebarOpen: !s.sidebarOpen }))
  }, [])

  const toggleToc = useCallback(() => {
    setState(s => ({ ...s, tocOpen: !s.tocOpen }))
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setState(s => ({ ...s, theme }))
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const setEditorMode = useCallback((editorMode: EditorMode) => {
    setState(s => ({ ...s, editorMode }))
  }, [])

  const setActiveFile = useCallback((path: string) => {
    setState(s => ({ ...s, activeFilePath: path }))
  }, [])

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState(s => ({ ...s, searchQuery }))
  }, [])

  return {
    state,
    toggleSidebar,
    toggleToc,
    setTheme,
    setEditorMode,
    setActiveFile,
    setSearchQuery,
  }
}
