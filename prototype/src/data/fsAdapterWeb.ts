/**
 * Web-host file I/O for fsAdapter — File System Access API where the browser
 * supports it, otherwise a plain `<input type=file>` (read) / Blob download
 * (write) fallback.
 */
import type { FileNode } from '@/types'
import type { OpenedFile, OpenedFolder, SavedFileRef } from './fsAdapter'

const MD_ACCEPT: FilePickerAcceptType = {
  description: 'Markdown',
  accept: { 'text/markdown': ['.md', '.markdown'] },
}
const MARKDOWN_EXTENSIONS = new Set(['md', 'markdown'])

function hasFileSystemAccess(): boolean {
  return 'showOpenFilePicker' in window
}

/** Open a single markdown file via the native picker, or the `<input>` fallback. */
export async function webOpenFile(): Promise<OpenedFile | null> {
  if (!hasFileSystemAccess()) return openFileViaInput()
  let handles: FileSystemFileHandle[]
  try {
    handles = await window.showOpenFilePicker({ types: [MD_ACCEPT] })
  } catch {
    return null // user cancelled the picker
  }
  const handle = handles[0]
  const file = await handle.getFile()
  const content = await file.text()
  return { name: file.name, path: file.name, content, handle }
}

/** Fallback file read for browsers without the File System Access API. */
function openFileViaInput(): Promise<OpenedFile | null> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,text/markdown'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) {
        resolve(null)
        return
      }
      file.text().then(content => resolve({ name: file.name, path: file.name, content }))
    }
    input.click()
  })
}

/** Open a folder and build its FileNode tree. Requires the FSA API — no fallback exists. */
export async function webOpenFolder(): Promise<OpenedFolder | null> {
  if (!hasFileSystemAccess() || !('showDirectoryPicker' in window)) return null
  let rootHandle: FileSystemDirectoryHandle
  try {
    rootHandle = await window.showDirectoryPicker()
  } catch {
    return null // user cancelled the picker
  }
  const fileHandles: Record<string, FileSystemFileHandle> = {}
  const tree = await walkDirectory(rootHandle, rootHandle.name, fileHandles)
  return { tree, rootPath: rootHandle.name, fileHandles }
}

/** Recursively walk a directory handle into a sorted FileNode tree, markdown files only. */
async function walkDirectory(
  handle: FileSystemDirectoryHandle,
  path: string,
  fileHandles: Record<string, FileSystemFileHandle>,
): Promise<FileNode[]> {
  const nodes: FileNode[] = []
  for await (const [name, entry] of handle.entries()) {
    const entryPath = `${path}/${name}`
    if (entry.kind === 'directory') {
      const children = await walkDirectory(entry, entryPath, fileHandles)
      nodes.push({ name, path: entryPath, type: 'folder', children })
      continue
    }
    const extension = name.split('.').pop()?.toLowerCase()
    if (!extension || !MARKDOWN_EXTENSIONS.has(extension)) continue
    nodes.push({ name, path: entryPath, type: 'file', extension })
    fileHandles[entryPath] = entry
  }
  return nodes.sort((a, b) => a.name.localeCompare(b.name))
}

/** Write content to an already-granted FSA file handle. */
export async function webSaveFile(handle: FileSystemFileHandle, content: string): Promise<void> {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

/** Save-as: native picker when available, else a Blob download link. */
export async function webSaveFileAs(
  content: string,
  suggestedName: string,
): Promise<SavedFileRef | null> {
  if (hasFileSystemAccess() && 'showSaveFilePicker' in window) {
    let handle: FileSystemFileHandle
    try {
      handle = await window.showSaveFilePicker({ suggestedName, types: [MD_ACCEPT] })
    } catch {
      return null // user cancelled the picker
    }
    await webSaveFile(handle, content)
    return { name: handle.name, handle }
  }
  downloadAsFile(content, suggestedName)
  return { name: suggestedName }
}

/** Trigger a browser download of `content` as `filename` via a Blob URL. */
function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
