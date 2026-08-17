/**
 * Shared test helper for MenuBar.test.tsx / MenuBar.view-help.test.tsx —
 * a MenuBar wrapper with sensible defaults so each test only supplies the
 * handler(s) it asserts on.
 */
import { vi } from 'vitest'
import { MenuBar as RealMenuBar } from './MenuBar'
import type { Theme, EditorMode, EditorCommand } from '@/types'

export interface MenuBarHandlers {
  theme?: Theme
  editorMode?: EditorMode
  onToggleSidebar?: () => void
  onToggleToc?: () => void
  onSetTheme?: (t: Theme) => void
  onSetEditorMode?: (m: EditorMode) => void
  onOpenShortcuts?: () => void
  onOpenAbout?: () => void
  onOpenMarkdownRef?: () => void
  onCloseTab?: () => void
  onToggleZenMode?: () => void
  onNewFile?: () => void
  onSave?: () => void
  onSaveAs?: () => void
  onOpenFile?: () => void
  onQuit?: () => void
  onExportHtml?: () => void
  onExportPdf?: () => void
  onFind?: () => void
  onFindReplace?: () => void
  onFindInFolder?: () => void
  onEditCommand?: (cmd: EditorCommand) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
}

/** Renders MenuBar with `theme`/`editorMode` defaulted and unused handlers stubbed. */
export function MenuBar(props: MenuBarHandlers) {
  return (
    <RealMenuBar
      theme={props.theme ?? 'dark'}
      editorMode={props.editorMode ?? 'write'}
      onToggleSidebar={props.onToggleSidebar ?? vi.fn()}
      onToggleToc={props.onToggleToc ?? vi.fn()}
      onSetTheme={props.onSetTheme ?? vi.fn()}
      onSetEditorMode={props.onSetEditorMode ?? vi.fn()}
      onOpenShortcuts={props.onOpenShortcuts}
      onOpenAbout={props.onOpenAbout}
      onOpenMarkdownRef={props.onOpenMarkdownRef}
      onCloseTab={props.onCloseTab}
      onToggleZenMode={props.onToggleZenMode}
      onNewFile={props.onNewFile}
      onSave={props.onSave}
      onSaveAs={props.onSaveAs}
      onOpenFile={props.onOpenFile}
      onQuit={props.onQuit}
      onExportHtml={props.onExportHtml}
      onExportPdf={props.onExportPdf}
      onFind={props.onFind}
      onFindReplace={props.onFindReplace}
      onFindInFolder={props.onFindInFolder}
      onEditCommand={props.onEditCommand}
      onZoomIn={props.onZoomIn}
      onZoomOut={props.onZoomOut}
    />
  )
}
