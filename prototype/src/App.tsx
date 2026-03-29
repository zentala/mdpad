import { useState, useCallback, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { MenuBar } from '@/components/layout/MenuBar'
import { Toolbar } from '@/components/layout/Toolbar'
import { StatusBar } from '@/components/layout/StatusBar'
import { FileTree } from '@/components/file-tree/FileTree'
import { TocPanel } from '@/components/toc/TocPanel'
import { MarkdownPreview } from '@/components/markdown/MarkdownPreview'
import { FloatingToolbar } from '@/components/markdown/FloatingToolbar'
import { SearchBar } from '@/components/search/SearchBar'
import { ShortcutsModal } from '@/components/common/ShortcutsModal'
import { useAppState } from '@/hooks/useAppState'
import { useTocHeadings } from '@/hooks/useTocHeadings'
import { mockFileTree } from '@/mock/file-tree'
import { mockMarkdownFiles } from '@/mock/markdown-content'

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

  const markdown = state.activeFilePath
    ? mockMarkdownFiles[state.activeFilePath] ?? `# File not found\n\n\`${state.activeFilePath}\` is not available in mock data.`
    : `# Welcome\n\nSelect a file from the sidebar.`

  const headings = useTocHeadings(markdown)

  const wordCount = useMemo(() => {
    return markdown.split(/\s+/).filter(Boolean).length
  }, [markdown])

  const charCount = useMemo(() => markdown.length, [markdown])

  const handleHeadingClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const showToolbar = state.editorMode !== 'reading'

  return (
    <>
      <AppShell
        sidebarOpen={state.sidebarOpen}
        tocOpen={state.tocOpen}
        menuBar={
          <>
            <MenuBar
              theme={state.theme}
              editorMode={state.editorMode}
              onToggleSidebar={toggleSidebar}
              onToggleToc={toggleToc}
              onSetTheme={setTheme}
              onSetEditorMode={setEditorMode}
              onOpenShortcuts={() => setShortcutsOpen(true)}
            />
            {showToolbar && (
              <Toolbar
                editorMode={state.editorMode}
                onSetEditorMode={setEditorMode}
                onToggleSidebar={toggleSidebar}
                onToggleToc={toggleToc}
                onOpenSearch={() => setSearchOpen(true)}
              />
            )}
            {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
          </>
        }
        sidebar={
          <FileTree
            files={mockFileTree}
            activeFilePath={state.activeFilePath}
            onFileSelect={setActiveFile}
          />
        }
        main={
          <MarkdownPreview
            markdown={markdown}
            editorMode={state.editorMode}
          />
        }
        toc={
          <TocPanel
            headings={headings}
            activeHeadingId={null}
            onHeadingClick={handleHeadingClick}
          />
        }
        statusBar={
          <StatusBar
            filePath={state.activeFilePath}
            wordCount={wordCount}
            charCount={charCount}
            editorMode={state.editorMode}
          />
        }
      />
      {showToolbar && <FloatingToolbar />}
      {shortcutsOpen && <ShortcutsModal onClose={() => setShortcutsOpen(false)} />}
    </>
  )
}
