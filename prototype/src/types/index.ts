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

export type Theme = 'dark' | 'light' | 'sepia'

/** Visual = rendered WYSIWYG, Code = raw markdown, Read = read-only */
export type EditorMode = 'visual' | 'code' | 'read'

export interface AppState {
  sidebarOpen: boolean
  tocOpen: boolean
  theme: Theme
  editorMode: EditorMode
  activeFilePath: string | null
  searchQuery: string
}
