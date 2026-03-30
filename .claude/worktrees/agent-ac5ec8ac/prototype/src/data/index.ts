/**
 * Data layer — single import point for file tree and markdown content.
 * Prefers generated content (from build:content script), falls back to mock data.
 */
import type { FileNode } from '@/types'

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
