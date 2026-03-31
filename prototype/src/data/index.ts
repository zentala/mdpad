/**
 * Data layer — single import point for file tree and markdown content.
 *
 * Dual-mode:
 * - Browser (GitHub Pages): uses generated/mock static data
 * - Tauri desktop: loads from filesystem via IPC commands
 */
import type { FileNode } from '@/types'

/** Whether we're running inside a Tauri desktop window. */
export const IS_TAURI = '__TAURI_INTERNALS__' in window

let fileTree: FileNode[]
let markdownFiles: Record<string, string>
let defaultFilePath: string

try {
  const genTree = await import('@/generated/file-tree')
  const genContent = await import('@/generated/markdown-content')
  fileTree = genTree.generatedFileTree
  markdownFiles = genContent.generatedMarkdownFiles
  defaultFilePath = genContent.defaultFile
} catch {
  const mockTree = await import('@/mock/file-tree')
  const mockContent = await import('@/mock/markdown-content')
  fileTree = mockTree.mockFileTree
  markdownFiles = mockContent.mockMarkdownFiles
  defaultFilePath = mockContent.defaultFile
}

export { fileTree, markdownFiles, defaultFilePath }
