/**
 * Ambient declarations for the File System Access API entry points and
 * directory-iteration methods missing from TypeScript's stock lib.dom.d.ts.
 * (`FileSystemFileHandle` / `FileSystemDirectoryHandle` themselves ARE
 * declared upstream — only the picker functions and iterators are not.)
 */

interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite'
}

interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string[]>
}

interface OpenFilePickerOptions {
  multiple?: boolean
  excludeAcceptAllOption?: boolean
  types?: FilePickerAcceptType[]
}

interface SaveFilePickerOptions {
  suggestedName?: string
  excludeAcceptAllOption?: boolean
  types?: FilePickerAcceptType[]
}

interface DirectoryPickerOptions {
  id?: string
  mode?: 'read' | 'readwrite'
}

interface FileSystemDirectoryHandle {
  entries(): AsyncIterableIterator<[string, FileSystemFileHandle | FileSystemDirectoryHandle]>
  values(): AsyncIterableIterator<FileSystemFileHandle | FileSystemDirectoryHandle>
  keys(): AsyncIterableIterator<string>
  [Symbol.asyncIterator](): AsyncIterableIterator<
    [string, FileSystemFileHandle | FileSystemDirectoryHandle]
  >
}

interface Window {
  showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>
  showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>
  showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>
}
