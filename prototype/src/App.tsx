import { useState, useCallback, useEffect } from 'react'
import { AppStateProvider, useAppContext } from '@/providers/AppStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { MenuBar } from '@/components/layout/MenuBar'
import { Toolbar } from '@/components/layout/Toolbar'
import { TabBar } from '@/components/layout/TabBar'
import { StatusBar } from '@/components/layout/StatusBar'
import { FileTree } from '@/components/file-tree/FileTree'
import { TocPanel } from '@/components/toc/TocPanel'
import { MarkdownPreview } from '@/components/markdown/MarkdownPreview'
import { FloatingToolbar } from '@/components/markdown/FloatingToolbar'
import { SearchBar } from '@/components/search/SearchBar'
import { ShortcutsModal } from '@/components/common/ShortcutsModal'
import { AboutModal } from '@/components/common/AboutModal'
import { QuickOpen } from '@/components/common/QuickOpen'
import { ZoomControl } from '@/components/common/ZoomControl'
import { useTocHeadings } from '@/hooks/useTocHeadings'
import { useActiveHeading } from '@/hooks/useActiveHeading'
import { mockFileTree } from '@/mock/file-tree'

export default function App() {
  return (
    <AppStateProvider>
      <AppInner />
    </AppStateProvider>
  )
}

function AppInner() {
  const { state, dispatch, activeTab, activeMarkdown, showToolbar, showToc } = useAppContext()

  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [quickOpenVisible, setQuickOpenVisible] = useState(false)

  const headings = useTocHeadings(activeMarkdown)
  const activeHeadingId = useActiveHeading(headings)
  const wordCount = activeMarkdown.split(/\s+/).filter(Boolean).length
  const charCount = activeMarkdown.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const handleFileSelect = useCallback((path: string) => {
    dispatch({ type: 'OPEN_FILE', path })
  }, [dispatch])

  const handleCloseTab = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_TAB', id })
  }, [dispatch])

  const handleCloseActiveTab = useCallback(() => {
    if (activeTab) dispatch({ type: 'CLOSE_TAB', id: activeTab.id })
  }, [activeTab, dispatch])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'w') { e.preventDefault(); handleCloseActiveTab() }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); setQuickOpenVisible(v => !v) }
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); dispatch({ type: 'NEW_FILE' }) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handleCloseActiveTab, dispatch])

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
        tocOpen={showToc}
        menuBar={
          <MenuBar
            theme={state.theme}
            editorMode={state.editorMode}
            onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            onToggleToc={() => dispatch({ type: 'TOGGLE_TOC' })}
            onSetTheme={t => dispatch({ type: 'SET_THEME', theme: t })}
            onSetEditorMode={m => dispatch({ type: 'SET_EDITOR_MODE', mode: m })}
            onOpenShortcuts={() => setShortcutsOpen(true)}
            onOpenAbout={() => setAboutOpen(true)}
            onOpenMarkdownRef={() => handleFileSelect('Welcome.md')}
            onCloseTab={handleCloseActiveTab}
          />
        }
        toolbar={
          <>
            {showToolbar && (
              <Toolbar
                onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                onToggleToc={() => dispatch({ type: 'TOGGLE_TOC' })}
                onOpenSearch={() => setSearchOpen(true)}
              />
            )}
            {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
            <TabBar
              tabs={tabBarTabs}
              activeTab={state.activeTabId}
              onSelectTab={id => dispatch({ type: 'SET_ACTIVE_TAB', id })}
              onCloseTab={handleCloseTab}
              onCloseOtherTabs={id => dispatch({ type: 'CLOSE_OTHER_TABS', id })}
              onCloseAllTabs={() => dispatch({ type: 'CLOSE_ALL_TABS' })}
              onNewFile={() => dispatch({ type: 'NEW_FILE' })}
            />
          </>
        }
        sidebar={
          <FileTree
            files={mockFileTree}
            activeFilePath={activeTab?.path ?? null}
            onFileSelect={handleFileSelect}
          />
        }
        main={
          activeTab?.type === 'file' ? (
            <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
              <MarkdownPreview markdown={activeMarkdown} editorMode={state.editorMode} onNavigate={handleFileSelect} />
              <ZoomControl />
            </div>
          ) : activeTab === null ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>◆</div>
                <div style={{ fontSize: 14 }}>No file open</div>
                <div style={{ fontSize: 12, marginTop: 8, opacity: 0.6 }}>Ctrl+P to search files · Ctrl+N for new file</div>
              </div>
            </div>
          ) : null
        }
        toc={
          <TocPanel
            headings={headings}
            activeHeadingId={activeHeadingId}
            onHeadingClick={handleHeadingClick}
            onClose={() => dispatch({ type: 'TOGGLE_TOC' })}
          />
        }
        statusBar={
          <StatusBar
            filePath={activeTab?.path ?? null}
            wordCount={wordCount}
            charCount={charCount}
            editorMode={state.editorMode}
            readingTime={readingTime}
          />
        }
      />
      {showToolbar && <FloatingToolbar />}
      {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {quickOpenVisible && (
        <QuickOpen
          files={mockFileTree}
          onSelect={handleFileSelect}
          onClose={() => setQuickOpenVisible(false)}
        />
      )}
    </>
  )
}
