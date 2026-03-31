import { useState, useCallback, useEffect, useMemo } from 'react'
import { AppStateProvider, useAppContext } from '@/providers/AppStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { MenuBar } from '@/components/layout/MenuBar'
import { Toolbar } from '@/components/layout/Toolbar'
import { TabBar } from '@/components/layout/TabBar'
import { StatusBar } from '@/components/layout/StatusBar'
import { ActivityBar } from '@/components/layout/ActivityBar'
import { ZenHoverBar } from '@/components/layout/ZenHoverBar'
import { FileTree } from '@/components/file-tree/FileTree'
import { TocPanel } from '@/components/toc/TocPanel'
import { MarkdownPreview } from '@/components/markdown/MarkdownPreview'
import { SettingsView } from '@/components/settings/SettingsView'
import { FloatingToolbar } from '@/components/markdown/FloatingToolbar'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchPanel } from '@/components/search/SearchPanel'
import { ShortcutsModal } from '@/components/common/ShortcutsModal'
import { AboutModal } from '@/components/common/AboutModal'
import { QuickOpen } from '@/components/common/QuickOpen'
import { EmptyState } from '@/components/common/EmptyState'
import { ZoomControl } from '@/components/common/ZoomControl'
import { useTocHeadings } from '@/hooks/useTocHeadings'
import { useActiveHeading } from '@/hooks/useActiveHeading'

export default function App() {
  return (
    <AppStateProvider>
      <AppInner />
    </AppStateProvider>
  )
}

function AppInner() {
  const { state, dispatch, activeTab, activeMarkdown, fileTree, showToolbar, showToc } =
    useAppContext()

  type ModalType = 'search' | 'shortcuts' | 'about' | 'quickOpen' | null
  const [openModal, setOpenModal] = useState<ModalType>(null)

  const headings = useTocHeadings(activeMarkdown)
  const activeHeadingId = useActiveHeading(headings)
  const wordCount = useMemo(
    () => activeMarkdown.split(/\s+/).filter(Boolean).length,
    [activeMarkdown],
  )
  const charCount = useMemo(() => activeMarkdown.length, [activeMarkdown])
  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount])

  const handleFileSelect = useCallback(
    (path: string) => {
      dispatch({ type: 'OPEN_FILE', path })
    },
    [dispatch],
  )

  const handleCloseTab = useCallback(
    (id: string) => {
      dispatch({ type: 'CLOSE_TAB', id })
    },
    [dispatch],
  )

  const handleCloseActiveTab = useCallback(() => {
    if (activeTab) dispatch({ type: 'CLOSE_TAB', id: activeTab.id })
  }, [activeTab, dispatch])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_ZEN_MODE' })
        return
      }
      if (e.key === 'Escape' && state.zenMode) {
        dispatch({ type: 'TOGGLE_ZEN_MODE' })
        return
      }
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault()
        handleCloseActiveTab()
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        setOpenModal(m => (m === 'quickOpen' ? null : 'quickOpen'))
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        dispatch({ type: 'NEW_FILE' })
      }
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault()
        dispatch({ type: 'OPEN_SETTINGS' })
      }
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault()
        setOpenModal('search')
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        dispatch({ type: 'SET_SIDEBAR_PANEL', panel: 'search' })
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_SIDEBAR' })
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        dispatch({ type: 'TOGGLE_TOC' })
      }
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault()
        dispatch({ type: 'SET_EDITOR_MODE', mode: 'write' })
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        dispatch({ type: 'SET_EDITOR_MODE', mode: 'code' })
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        dispatch({ type: 'SET_EDITOR_MODE', mode: 'preview' })
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handleCloseActiveTab, dispatch, state.zenMode])

  const handleHeadingClick = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Map tabs to TabBar format
  const tabBarTabs = state.tabs.map(t => ({
    path: t.id,
    name: t.name,
    modified: t.modified,
    fullPath: t.path,
  }))

  return (
    <>
      <AppShell
        sidebarOpen={state.sidebarOpen}
        zenMode={state.zenMode}
        zenBar={
          <ZenHoverBar
            editorMode={state.editorMode}
            onSetEditorMode={m => dispatch({ type: 'SET_EDITOR_MODE', mode: m })}
            onToggleZenMode={() => dispatch({ type: 'TOGGLE_ZEN_MODE' })}
            theme={state.theme}
            onSetTheme={t => dispatch({ type: 'SET_THEME', theme: t })}
            onOpenSettings={() => dispatch({ type: 'OPEN_SETTINGS' })}
          />
        }
        activityBar={
          <ActivityBar
            activePanel={state.sidebarPanel}
            sidebarOpen={state.sidebarOpen}
            onSelectPanel={panel => dispatch({ type: 'SET_SIDEBAR_PANEL', panel })}
            onOpenSettings={() => dispatch({ type: 'OPEN_SETTINGS' })}
          />
        }
        menuBar={
          <MenuBar
            theme={state.theme}
            editorMode={state.editorMode}
            onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            onToggleToc={() => dispatch({ type: 'TOGGLE_TOC' })}
            onSetTheme={t => dispatch({ type: 'SET_THEME', theme: t })}
            onSetEditorMode={m => dispatch({ type: 'SET_EDITOR_MODE', mode: m })}
            onOpenShortcuts={() => setOpenModal('shortcuts')}
            onOpenAbout={() => setOpenModal('about')}
            onOpenMarkdownRef={() => handleFileSelect('REFERENCE.md')}
            onOpenSettings={() => dispatch({ type: 'OPEN_SETTINGS' })}
            onCloseTab={handleCloseActiveTab}
            onToggleZenMode={() => dispatch({ type: 'TOGGLE_ZEN_MODE' })}
          />
        }
        toolbar={
          <>
            <TabBar
              tabs={tabBarTabs}
              activeTab={state.activeTabId}
              onSelectTab={id => dispatch({ type: 'SET_ACTIVE_TAB', id })}
              onCloseTab={handleCloseTab}
              onCloseOtherTabs={id => dispatch({ type: 'CLOSE_OTHER_TABS', id })}
              onCloseAllTabs={() => dispatch({ type: 'CLOSE_ALL_TABS' })}
              onNewFile={() => dispatch({ type: 'NEW_FILE' })}
            />
            {showToolbar && (
              <Toolbar
                onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                onToggleToc={() => dispatch({ type: 'TOGGLE_TOC' })}
                onOpenSearch={() => setOpenModal('search')}
              />
            )}
            {openModal === 'search' && <SearchBar onClose={() => setOpenModal(null)} />}
          </>
        }
        sidebar={
          state.sidebarPanel === 'search' ? (
            <SearchPanel />
          ) : (
            <FileTree
              files={fileTree}
              activeFilePath={activeTab?.path ?? null}
              onFileSelect={handleFileSelect}
            />
          )
        }
        main={
          activeTab?.type === 'settings' ? (
            <SettingsView />
          ) : activeTab?.type === 'file' ? (
            <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
              <MarkdownPreview
                markdown={activeMarkdown}
                editorMode={state.editorMode}
                onNavigate={handleFileSelect}
              />
              {!state.zenMode && showToc && (
                <TocPanel
                  headings={headings}
                  activeHeadingId={activeHeadingId}
                  onHeadingClick={handleHeadingClick}
                  onClose={() => dispatch({ type: 'TOGGLE_TOC' })}
                />
              )}
              <ZoomControl />
            </div>
          ) : (
            <EmptyState
              onNewFile={() => dispatch({ type: 'NEW_FILE' })}
              onOpenQuickSearch={() => setOpenModal('quickOpen')}
            />
          )
        }
        statusBar={
          <StatusBar
            wordCount={wordCount}
            charCount={charCount}
            fileSize={new TextEncoder().encode(activeMarkdown).length}
            readingTime={readingTime}
            hasActiveFile={activeTab?.type === 'file'}
          />
        }
      />
      {showToolbar && <FloatingToolbar />}
      {openModal === 'shortcuts' && <ShortcutsModal onClose={() => setOpenModal(null)} />}
      {openModal === 'about' && <AboutModal onClose={() => setOpenModal(null)} />}
      {openModal === 'quickOpen' && (
        <QuickOpen
          files={fileTree}
          onSelect={handleFileSelect}
          onClose={() => setOpenModal(null)}
        />
      )}
    </>
  )
}
