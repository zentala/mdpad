/**
 * File system adapter — the one seam the app calls for open/save operations.
 * Branches on host: Tauri delegates to the Rust IPC commands (real
 * filesystem), the web build uses the File System Access API with a
 * download/`<input>` fallback. Tests mock this module, not its internals.
 */
import { isTauri, listFiles, readFile } from './tauri-api'
import { webOpenFile, webOpenFolder, webSaveFile, webSaveFileAs } from './fsAdapterWeb'
import type { FileNode } from '@/types'

/** Result of opening a single file. `handle` is set only in the web FSA path. */
export interface OpenedFile {
  name: string
  path: string
  content: string
  handle?: FileSystemFileHandle
}

/** Result of opening a folder. */
export interface OpenedFolder {
  tree: FileNode[]
  rootPath?: string
}

/** Where to write — a Tauri-relative path, or a web FSA handle. */
export interface SaveTarget {
  path?: string
  handle?: FileSystemFileHandle
}

/** Result of a "save as" — enough to target future saves at the same file. */
export interface SavedFileRef {
  name: string
  path?: string
  handle?: FileSystemFileHandle
}

const TAURI_ROOT = '.'

/**
 * Minimal fallback until `@/data/tauri-api` exports a real `writeFile`
 * (landing on a sibling branch). Swap this call for the real import once
 * `writeFile(rootPath, filePath, content): Promise<void>` exists there.
 */
async function writeFileFallback(
  _rootPath: string,
  _filePath: string,
  _content: string,
): Promise<void> {
  throw new Error('writeFile is not yet available in @/data/tauri-api — Tauri save is not wired')
}

/** Open a single file. Web only — Tauri files are opened via the folder tree. */
export async function openFile(): Promise<OpenedFile | null> {
  if (isTauri()) return null
  return webOpenFile()
}

/** Open a folder and return its markdown file tree. */
export async function openFolder(): Promise<OpenedFolder | null> {
  if (isTauri()) {
    const tree = await listFiles(TAURI_ROOT)
    return { tree, rootPath: TAURI_ROOT }
  }
  return webOpenFolder()
}

/** Write content to an already-known target (existing path or FSA handle). */
export async function saveFile(target: SaveTarget, content: string): Promise<void> {
  if (isTauri()) {
    if (!target.path) throw new Error('saveFile: missing path in Tauri mode')
    await writeFileFallback(TAURI_ROOT, target.path, content)
    return
  }
  if (!target.handle) throw new Error('saveFile: missing handle in web mode')
  await webSaveFile(target.handle, content)
}

/** Prompt for a new save location and write content there. */
export async function saveFileAs(
  content: string,
  suggestedName: string,
): Promise<SavedFileRef | null> {
  if (isTauri()) {
    await writeFileFallback(TAURI_ROOT, suggestedName, content)
    return { name: suggestedName, path: suggestedName }
  }
  return webSaveFileAs(content, suggestedName)
}

// Re-exported so callers reading a file already listed by openFolder (Tauri) can do so.
export { readFile as readTauriFile }
