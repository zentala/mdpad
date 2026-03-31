export interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  extension?: string
}

export interface TocHeading {
  id: string
  text: string
  level: number
}

export interface FrontmatterData {
  [key: string]: string | number | boolean | string[]
}

export type Theme = 'dark' | 'light' | 'sepia' | 'auto'

/**
 * Editor modes. Internal values map to UI labels:
 * - 'write' → "Visual" (rendered WYSIWYG editing)
 * - 'code'  → "Code" (raw markdown source)
 * - 'preview' → "Preview" (read-only rendered view)
 */
export type EditorMode = 'write' | 'code' | 'preview'

export interface AppState {
  sidebarOpen: boolean
  tocOpen: boolean
  theme: Theme
  editorMode: EditorMode
  activeFilePath: string | null
  searchQuery: string
}

/** Commands that editor engines (CodeMirror, Milkdown) must support */
export type EditorCommand =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'code'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'undo'
  | 'redo'

/** Shared interface exposed by all editor engine components */
export interface EditorRef {
  getContent(): string
  setContent(md: string): void
  focus(): void
  execCommand(cmd: EditorCommand): void
}
