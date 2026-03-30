import { useState, useCallback, useMemo, useEffect } from 'react'
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
import { useAppState } from '@/hooks/useAppState'
import { useTocHeadings } from '@/hooks/useTocHeadings'
import { mockFileTree } from '@/mock/file-tree'
import { mockMarkdownFiles } from '@/mock/markdown-content'

interface OpenTab {
  path: string
  name: string
}

export default function App() {
  const {
    state,
    toggleSidebar,
    toggleToc,
    setTheme,
    setEditorMode,
    setActiveFile,
  } = useAppState()

  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [quickOpenVisible, setQuickOpenVisible] = useState(false)
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { path: 'Welcome.md', name: 'Welcome.md' },
  ])

  const handleFileSelect = useCallback((path: string) => {
    setActiveFile(path)
    setOpenTabs(tabs => {
      if (tabs.some(t => t.path === path)) return tabs
      const name = path.split('/').pop() ?? path
      return [...tabs, { path, name }]
    })
  }, [setActiveFile])

  const handleCloseTab = useCallback((path: string) => {
    setOpenTabs(tabs => {
      const filtered = tabs.filter(t => t.path !== path)
      if (filtered.length === 0) return tabs
      if (state.activeFilePath === path) {
        setActiveFile(filtered[filtered.length - 1].path)
      }
      return filtered
    })
  }, [state.activeFilePath, setActiveFile])

  const handleCloseActiveTab = useCallback(() => {
    if (state.activeFilePath) handleCloseTab(state.activeFilePath)
  }, [state.activeFilePath, handleCloseTab])

  const handleOpenMarkdownRef = useCallback(() => {
    handleFileSelect('Welcome.md')
  }, [handleFileSelect])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'w') {
        e.preventDefault()
        handleCloseActiveTab()
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        setQuickOpenVisible(v => !v)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handleCloseActiveTab])

  const markdown = state.activeFilePath
    ? mockMarkdownFiles[state.activeFilePath] ?? `# File not found\n\n\`${state.activeFilePath}\` is not available in mock data.`
    : `# Welcome\n\nSelect a file from the sidebar.`

  const headings = useTocHeadings(markdown)
  const wordCount = useMemo(() => markdown.split(/\s+/).filter(Boolean).length, [markdown])
  const charCount = useMemo(() => markdown.length, [markdown])
  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount])

  const handleHeadingClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const showToolbar = state.editorMode !== 'preview'

  return (
    <>
      <AppShell
        sidebarOpen={state.sidebarOpen}
        tocOpen={state.tocOpen}
        menuBar={
          <MenuBar
            theme={state.theme}
            editorMode={state.editorMode}
            onToggleSidebar={toggleSidebar}
            onToggleToc={toggleToc}
            onSetTheme={setTheme}
            onSetEditorMode={setEditorMode}
            onOpenShortcuts={() => setShortcutsOpen(true)}
            onOpenAbout={() => setAboutOpen(true)}
            onOpenMarkdownRef={handleOpenMarkdownRef}
            onCloseTab={handleCloseActiveTab}
          />
        }
        toolbar={
          <>
            {showToolbar && (
              <Toolbar
                onToggleSidebar={toggleSidebar}
                onToggleToc={toggleToc}
                onOpenSearch={() => setSearchOpen(true)}
              />
            )}
            {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
            <TabBar
              tabs={openTabs}
              activeTab={state.activeFilePath}
              onSelectTab={handleFileSelect}
              onCloseTab={handleCloseTab}
            />

          </>
        }
        sidebar={
          <FileTree
            files={mockFileTree}
            activeFilePath={state.activeFilePath}
            onFileSelect={handleFileSelect}
          />
        }
        main={
          <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
            <MarkdownPreview
              markdown={markdown}
              editorMode={state.editorMode}
            />
            <ZoomControl />
          </div>
        }
        toc={
          <TocPanel
            headings={headings}
            activeHeadingId={null}
            onHeadingClick={handleHeadingClick}
            onClose={toggleToc}
          />
        }
        statusBar={
          <StatusBar
            filePath={state.activeFilePath}
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
