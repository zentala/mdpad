/**
 * Tests for web "Open Folder" wiring: openFolder() replaces the file tree and
 * a file opened from that tree loads its content via the FSA file handle.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppStateProvider, useAppContext } from './AppStateProvider'

const openFolderMock = vi.fn()
vi.mock('@/data/fsAdapter', () => ({
  openFolder: () => openFolderMock(),
}))

function wrapper({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>
}

function fakeHandle(text: string): FileSystemFileHandle {
  return {
    getFile: async () => ({ text: async () => text }) as unknown as File,
  } as unknown as FileSystemFileHandle
}

describe('web Open Folder', () => {
  beforeEach(() => {
    localStorage.clear()
    openFolderMock.mockReset()
  })

  it('openFolder replaces the file tree with the picked directory', async () => {
    openFolderMock.mockResolvedValue({
      tree: [{ name: 'guide.md', path: 'docs/guide.md', type: 'file', extension: 'md' }],
      fileHandles: { 'docs/guide.md': fakeHandle('# Guide') },
    })
    const { result } = renderHook(() => useAppContext(), { wrapper })

    await act(async () => {
      result.current.openFolder()
    })

    await waitFor(() => {
      expect(result.current.fileTree).toEqual([
        { name: 'guide.md', path: 'docs/guide.md', type: 'file', extension: 'md' },
      ])
    })
  })

  it('loads content for a file opened from the picked folder via its handle', async () => {
    openFolderMock.mockResolvedValue({
      tree: [{ name: 'guide.md', path: 'docs/guide.md', type: 'file', extension: 'md' }],
      fileHandles: { 'docs/guide.md': fakeHandle('# Loaded from handle') },
    })
    const { result } = renderHook(() => useAppContext(), { wrapper })

    await act(async () => {
      result.current.openFolder()
    })
    await act(async () => {
      result.current.dispatch({ type: 'OPEN_FILE', path: 'docs/guide.md' })
    })

    await waitFor(() => {
      expect(result.current.activeMarkdown).toBe('# Loaded from handle')
    })
  })

  it('does nothing when the folder picker is cancelled', async () => {
    openFolderMock.mockResolvedValue(null)
    const { result } = renderHook(() => useAppContext(), { wrapper })
    const before = result.current.fileTree

    await act(async () => {
      result.current.openFolder()
    })

    expect(result.current.fileTree).toBe(before)
  })
})
