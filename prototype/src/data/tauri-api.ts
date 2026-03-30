/**
 * Tauri IPC wrappers for file system operations.
 * Only imported when running inside a Tauri window.
 */
import { invoke } from '@tauri-apps/api/core'
import { listen, type UnlistenFn } from '@tauri-apps/api/event'
import type { FileNode } from '@/types'

/** Scan a directory recursively and return the file tree. */
export async function listFiles(rootPath: string): Promise<FileNode[]> {
  return invoke<FileNode[]>('list_files', { rootPath })
}

/** Read the content of a single file. */
export async function readFile(rootPath: string, filePath: string): Promise<string> {
  return invoke<string>('read_file', { rootPath, filePath })
}

/** File system event emitted by the Rust watcher. */
export interface FsEvent {
  type: 'file_changed' | 'file_created' | 'file_deleted'
  path: string
}

/** Subscribe to file system events from the Rust watcher. */
export async function onFsEvent(callback: (event: FsEvent) => void): Promise<UnlistenFn> {
  return listen<FsEvent>('fs_event', event => {
    callback(event.payload)
  })
}

/** Check if running inside a Tauri window. */
export function isTauri(): boolean {
  return '__TAURI_INTERNALS__' in window
}
