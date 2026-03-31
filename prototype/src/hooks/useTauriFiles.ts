/**
 * useTauriFiles — loads file tree and content from the filesystem via Tauri IPC.
 * Only active when running inside a Tauri window.
 */
import { useEffect, useCallback, useRef } from 'react'
import { IS_TAURI } from '@/data'
import { listFiles, readFile, onFsEvent } from '@/data/tauri-api'
import type { FileNode } from '@/types'

interface UseTauriFilesProps {
  rootPath: string | null
  treeVersion: number
  onFileTree: (tree: FileNode[]) => void
  onFileContent: (path: string, content: string) => void
  onFileTreeRefresh: () => void
}

/**
 * Hook that manages Tauri filesystem integration.
 * Loads file tree on mount, reads files on demand, watches for changes.
 */
export function useTauriFiles({
  rootPath,
  treeVersion,
  onFileTree,
  onFileContent,
  onFileTreeRefresh,
}: UseTauriFilesProps) {
  const unlistenRef = useRef<(() => void) | null>(null)

  // Load file tree when rootPath changes
  useEffect(() => {
    if (!IS_TAURI || !rootPath) return

    listFiles(rootPath)
      .then(onFileTree)
      .catch(err => console.error('Failed to list files:', err))
  }, [rootPath, treeVersion, onFileTree])

  // Set up file watcher
  useEffect(() => {
    if (!IS_TAURI || !rootPath) return

    onFsEvent(event => {
      if (event.type === 'file_created' || event.type === 'file_deleted') {
        onFileTreeRefresh()
      } else if (event.type === 'file_changed') {
        onFileContent(event.path, '') // Signal to reload
      }
    })
      .then(unlisten => {
        unlistenRef.current = unlisten
      })
      .catch(err => console.error('Failed to set up file watcher:', err))

    return () => {
      unlistenRef.current?.()
      unlistenRef.current = null
    }
  }, [rootPath, onFileContent, onFileTreeRefresh])

  /** Read a file's content via IPC. */
  const loadFile = useCallback(
    async (filePath: string): Promise<string> => {
      if (!IS_TAURI || !rootPath) return ''
      return readFile(rootPath, filePath)
    },
    [rootPath],
  )

  return { loadFile, isTauri: IS_TAURI }
}
