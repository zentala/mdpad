/**
 * Reducer branch coverage for AppStateProvider not covered by
 * AppStateProvider.test.tsx (theme/sidebar-panel/content state).
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppStateProvider, useAppContext } from './AppStateProvider'

function hookWrapper({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>
}

describe('AppStateProvider reducer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('OPEN_FILE adds a new tab and activates it', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'foo.md' }))
    const tab = result.current.state.tabs.find(t => t.path === 'foo.md')
    expect(tab).toBeDefined()
    expect(tab?.name).toBe('foo.md')
    expect(result.current.state.activeTabId).toBe(tab?.id)
  })

  it('OPEN_FILE reuses an existing tab instead of duplicating', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'foo.md' }))
    const countBefore = result.current.state.tabs.length
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'foo.md' }))
    expect(result.current.state.tabs.length).toBe(countBefore)
  })

  it('CLOSE_TAB removes the tab and activates the previous one', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'a.md' }))
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'b.md' }))
    const bId = result.current.state.activeTabId!
    act(() => result.current.dispatch({ type: 'CLOSE_TAB', id: bId }))
    expect(result.current.state.tabs.find(t => t.id === bId)).toBeUndefined()
    expect(result.current.state.activeTabId).not.toBe(bId)
  })

  it('CLOSE_TAB on the last tab clears activeTabId', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'CLOSE_ALL_TABS' }))
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'only.md' }))
    const id = result.current.state.activeTabId!
    act(() => result.current.dispatch({ type: 'CLOSE_TAB', id }))
    expect(result.current.state.tabs).toHaveLength(0)
    expect(result.current.state.activeTabId).toBeNull()
  })

  it('CLOSE_OTHER_TABS keeps only the given tab', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'a.md' }))
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'b.md' }))
    const bId = result.current.state.activeTabId!
    act(() => result.current.dispatch({ type: 'CLOSE_OTHER_TABS', id: bId }))
    expect(result.current.state.tabs).toHaveLength(1)
    expect(result.current.state.tabs[0].id).toBe(bId)
    expect(result.current.state.activeTabId).toBe(bId)
  })

  it('CLOSE_ALL_TABS empties tabs and clears activeTabId', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'a.md' }))
    act(() => result.current.dispatch({ type: 'CLOSE_ALL_TABS' }))
    expect(result.current.state.tabs).toHaveLength(0)
    expect(result.current.state.activeTabId).toBeNull()
  })

  it('NEW_FILE adds an Untitled tab', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    const countBefore = result.current.state.tabs.length
    act(() => result.current.dispatch({ type: 'NEW_FILE' }))
    expect(result.current.state.tabs.length).toBe(countBefore + 1)
    const newTab = result.current.state.tabs[result.current.state.tabs.length - 1]
    expect(newTab.name).toMatch(/^Untitled-\d+\.md$/)
    expect(newTab.path).toBeUndefined()
    expect(result.current.state.activeTabId).toBe(newTab.id)
  })

  it('SET_ACTIVE_TAB switches the active tab', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'a.md' }))
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'b.md' }))
    const aId = result.current.state.tabs.find(t => t.path === 'a.md')!.id
    act(() => result.current.dispatch({ type: 'SET_ACTIVE_TAB', id: aId }))
    expect(result.current.state.activeTabId).toBe(aId)
  })

  it('TOGGLE_ZEN_MODE flips zenMode', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    expect(result.current.state.zenMode).toBe(false)
    act(() => result.current.dispatch({ type: 'TOGGLE_ZEN_MODE' }))
    expect(result.current.state.zenMode).toBe(true)
    act(() => result.current.dispatch({ type: 'TOGGLE_ZEN_MODE' }))
    expect(result.current.state.zenMode).toBe(false)
  })

  it('SET_ZOOM sets zoom within range', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'SET_ZOOM', zoom: 120 }))
    expect(result.current.state.zoom).toBe(120)
  })

  it('SET_ZOOM clamps to MIN_ZOOM (50)', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'SET_ZOOM', zoom: 10 }))
    expect(result.current.state.zoom).toBe(50)
  })

  it('SET_ZOOM clamps to MAX_ZOOM (200)', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'SET_ZOOM', zoom: 500 }))
    expect(result.current.state.zoom).toBe(200)
  })

  it('TOGGLE_TOC flips tocOpen', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    const before = result.current.state.tocOpen
    act(() => result.current.dispatch({ type: 'TOGGLE_TOC' }))
    expect(result.current.state.tocOpen).toBe(!before)
  })

  it('SET_EDITOR_MODE sets editorMode', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'SET_EDITOR_MODE', mode: 'preview' }))
    expect(result.current.state.editorMode).toBe('preview')
  })

  it('SET_TAB_ERROR sets loadError on the given tab', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'broken.md' }))
    const id = result.current.state.activeTabId!
    act(() => result.current.dispatch({ type: 'SET_TAB_ERROR', id, error: 'boom' }))
    const tab = result.current.state.tabs.find(t => t.id === id)
    expect(tab?.loadError).toBe('boom')
  })

  it('OPEN_EXTERNAL_FILE adds a tab with content and handle', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() =>
      result.current.dispatch({
        type: 'OPEN_EXTERNAL_FILE',
        path: '/abs/ext.md',
        name: 'ext.md',
        content: '# External',
      }),
    )
    const tab = result.current.state.tabs.find(t => t.path === '/abs/ext.md')
    expect(tab).toBeDefined()
    expect(tab?.name).toBe('ext.md')
    expect(result.current.state.fileContents['/abs/ext.md']).toBe('# External')
    expect(result.current.state.originalContents['/abs/ext.md']).toBe('# External')
    expect(result.current.state.activeTabId).toBe(tab?.id)
  })

  it('OPEN_EXTERNAL_FILE on an already-open path refreshes content instead of duplicating', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() =>
      result.current.dispatch({
        type: 'OPEN_EXTERNAL_FILE',
        path: '/abs/ext.md',
        name: 'ext.md',
        content: '# First',
      }),
    )
    const countBefore = result.current.state.tabs.length
    act(() =>
      result.current.dispatch({
        type: 'OPEN_EXTERNAL_FILE',
        path: '/abs/ext.md',
        name: 'ext.md',
        content: '# Second',
      }),
    )
    expect(result.current.state.tabs.length).toBe(countBefore)
    expect(result.current.state.fileContents['/abs/ext.md']).toBe('# Second')
  })

  it('SAVE_FILE_AS renames the tab and moves content to the new path', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'NEW_FILE' }))
    const tabId = result.current.state.activeTabId!
    act(() =>
      result.current.dispatch({
        type: 'SAVE_FILE_AS',
        tabId,
        path: '/abs/new.md',
        name: 'new.md',
        content: '# Saved',
      }),
    )
    const tab = result.current.state.tabs.find(t => t.id === tabId)
    expect(tab?.path).toBe('/abs/new.md')
    expect(tab?.name).toBe('new.md')
    expect(tab?.modified).toBe(false)
    expect(result.current.state.fileContents['/abs/new.md']).toBe('# Saved')
  })

  it('SAVE_FILE_AS removes stale content under the old path', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => result.current.dispatch({ type: 'OPEN_FILE', path: 'old.md' }))
    const tabId = result.current.state.activeTabId!
    act(() =>
      result.current.dispatch({
        type: 'INIT_FILE_CONTENT',
        path: 'old.md',
        content: '# Old',
      }),
    )
    act(() =>
      result.current.dispatch({
        type: 'SAVE_FILE_AS',
        tabId,
        path: '/abs/renamed.md',
        name: 'renamed.md',
        content: '# Old',
      }),
    )
    expect(result.current.state.fileContents['old.md']).toBeUndefined()
    expect(result.current.state.originalContents['old.md']).toBeUndefined()
    expect(result.current.state.fileContents['/abs/renamed.md']).toBe('# Old')
  })
})
