/**
 * useHostFiles — owns everything about *where files come from*, so the app
 * state provider stays focused on editor/UI state.
 *
 * One place resolves file content across the three hosts:
 * - Tauri: IPC `list_files` / `read_file` (+ live watcher) via useTauriFiles
 * - Web "Open Folder": File System Access directory handles
 * - Web demo: bundled/mock markdown
 */
import { useState, useCallback, useEffect } from 'react'
import type { FileNode } from '@/types'
import { markdownFiles, fileTree as staticFileTree, IS_TAURI } from '@/data'
import { useTauriFiles } from '@/hooks/useTauriFiles'
import { useCliArgs, type CliArgsPayload } from '@/hooks/useCliArgs'
import { openFolder as openFolderAdapter } from '@/data/fsAdapter'

/** Minimal shape the hook needs from the active tab (avoids importing provider types). */
interface ActiveTabLike {
  id: string
  type: 'file' | 'settings' | 'welcome'
  path?: string
}

interface UseHostFilesParams {
  activeTab: ActiveTabLike | null
  /** Editable content already in app state, keyed by path. */
  fileContents: Record<string, string>
  /** Seed app state with a file's on-disk content. */
  onInitContent: (path: string, content: string) => void
  /** Report a load failure for a tab. */
  onLoadError: (tabId: string, message: string) => void
  /** Open a file the CLI handed us at launch (Tauri). */
  onOpenInitialFile: (path: string) => void
}

interface UseHostFilesResult {
  fileTree: FileNode[]
  /** Full markdown for a tab: editable state first, then the host source. */
  resolveMarkdown: (tab: ActiveTabLike | null) => string
  /** Web: pick a directory and replace the file tree with it. */
  openFolder: () => void
}

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

export function useHostFiles({
  activeTab,
  fileContents,
  onInitContent,
  onLoadError,
  onOpenInitialFile,
}: UseHostFilesParams): UseHostFilesResult {
  const [tauriTree, setTauriTree] = useState<FileNode[]>([])
  const [tauriContents, setTauriContents] = useState<Record<string, string>>({})
  const [webTree, setWebTree] = useState<FileNode[] | null>(null)
  const [webHandles, setWebHandles] = useState<Record<string, FileSystemFileHandle>>({})
  const [rootPath, setRootPath] = useState<string | null>(() => (IS_TAURI ? '.' : null))
  const [treeVersion, setTreeVersion] = useState(0)

  const handleCliArgs = useCallback(
    (args: CliArgsPayload) => {
      setRootPath(args.rootPath)
      if (args.initialFile) onOpenInitialFile(args.initialFile)
    },
    [onOpenInitialFile],
  )
  useCliArgs(handleCliArgs)

  const openFolder = useCallback(() => {
    void openFolderAdapter().then(result => {
      if (!result) return
      setWebTree(result.tree)
      setWebHandles(result.fileHandles ?? {})
    })
  }, [])

  const handleFileTree = useCallback((tree: FileNode[]) => setTauriTree(tree), [])
  const handleFileContent = useCallback((path: string, content: string) => {
    if (content) setTauriContents(prev => ({ ...prev, [path]: content }))
  }, [])
  const handleTreeRefresh = useCallback(() => setTreeVersion(v => v + 1), [])

  const { loadFile } = useTauriFiles({
    rootPath,
    treeVersion,
    onFileTree: handleFileTree,
    onFileContent: handleFileContent,
    onFileTreeRefresh: handleTreeRefresh,
  })

  // Tauri: read the active file's content over IPC
  useEffect(() => {
    if (!IS_TAURI || !activeTab?.path) return
    if (tauriContents[activeTab.path]) return
    const tabId = activeTab.id
    const tabPath = activeTab.path
    loadFile(tabPath)
      .then(content => {
        if (content) setTauriContents(prev => ({ ...prev, [tabPath]: content }))
      })
      .catch(err => onLoadError(tabId, `Failed to load "${tabPath}": ${errorMessage(err)}`))
  }, [activeTab?.id, activeTab?.path, loadFile, tauriContents, onLoadError])

  // Seed app state with content from the bundled/Tauri source
  useEffect(() => {
    if (!activeTab?.path || activeTab.type !== 'file') return
    const path = activeTab.path
    if (fileContents[path] !== undefined) return
    const source = IS_TAURI ? tauriContents[path] : markdownFiles[path]
    if (source !== undefined) onInitContent(path, source)
  }, [activeTab?.path, activeTab?.type, fileContents, tauriContents, onInitContent])

  // Web "Open Folder": read the active file's content from its FSA handle
  useEffect(() => {
    if (IS_TAURI || !activeTab?.path || activeTab.type !== 'file') return
    const path = activeTab.path
    if (fileContents[path] !== undefined) return
    const handle = webHandles[path]
    if (!handle) return
    const tabId = activeTab.id
    handle
      .getFile()
      .then(f => f.text())
      .then(content => onInitContent(path, content))
      .catch(err => onLoadError(tabId, `Failed to load "${path}": ${errorMessage(err)}`))
  }, [activeTab?.id, activeTab?.path, activeTab?.type, fileContents, webHandles, onInitContent, onLoadError])

  const resolveMarkdown = useCallback(
    (tab: ActiveTabLike | null): string => {
      if (!tab || tab.type !== 'file' || !tab.path) return ''
      if (fileContents[tab.path] !== undefined) return fileContents[tab.path]
      if (IS_TAURI) return tauriContents[tab.path] ?? ''
      if (webHandles[tab.path]) return '' // content loads async from the file handle
      return markdownFiles[tab.path] ?? `# File not found\n\n\`${tab.path}\` is not available.`
    },
    [fileContents, tauriContents, webHandles],
  )

  const fileTree = IS_TAURI ? tauriTree : (webTree ?? staticFileTree)

  return { fileTree, resolveMarkdown, openFolder }
}
