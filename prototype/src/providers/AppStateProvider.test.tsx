/**
 * Tests for localStorage persistence and content state in AppStateProvider.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AppStateProvider, useAppContext } from './AppStateProvider'

function hookWrapper({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>
}

const THEME_KEY = 'mdpad-theme'

/** Helper component to read and set theme */
function ThemeReader() {
  const { state, dispatch, resolvedTheme } = useAppContext()
  return (
    <div>
      <span data-testid="theme">{state.theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => dispatch({ type: 'SET_THEME', theme: 'sepia' })}>Set Sepia</button>
      <button onClick={() => dispatch({ type: 'SET_THEME', theme: 'auto' })}>Set Auto</button>
    </div>
  )
}

/** Helper component to test sidebar panel switching */
function SidebarPanelTester() {
  const { state, dispatch } = useAppContext()
  return (
    <div>
      <span data-testid="sidebar-panel">{state.sidebarPanel}</span>
      <span data-testid="sidebar-open">{String(state.sidebarOpen)}</span>
      <button onClick={() => dispatch({ type: 'SET_SIDEBAR_PANEL', panel: 'settings' })}>
        Open Settings Panel
      </button>
      <button onClick={() => dispatch({ type: 'SET_SIDEBAR_PANEL', panel: 'explorer' })}>
        Open Explorer Panel
      </button>
    </div>
  )
}

describe('AppStateProvider localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to auto theme when no localStorage', () => {
    render(
      <AppStateProvider>
        <ThemeReader />
      </AppStateProvider>,
    )
    expect(screen.getByTestId('theme').textContent).toBe('auto')
  })

  it('loads persisted theme from localStorage', () => {
    localStorage.setItem(THEME_KEY, 'sepia')
    render(
      <AppStateProvider>
        <ThemeReader />
      </AppStateProvider>,
    )
    expect(screen.getByTestId('theme').textContent).toBe('sepia')
  })

  it('ignores invalid theme values in localStorage', () => {
    localStorage.setItem(THEME_KEY, 'neon-pink')
    render(
      <AppStateProvider>
        <ThemeReader />
      </AppStateProvider>,
    )
    expect(screen.getByTestId('theme').textContent).toBe('auto')
  })

  it('saves theme to localStorage on dispatch', async () => {
    render(
      <AppStateProvider>
        <ThemeReader />
      </AppStateProvider>,
    )
    await act(async () => {
      screen.getByText('Set Sepia').click()
    })
    expect(localStorage.getItem(THEME_KEY)).toBe('sepia')
  })

  it('resolves auto to dark/light based on OS preference', () => {
    render(
      <AppStateProvider>
        <ThemeReader />
      </AppStateProvider>,
    )
    // matchMedia mock in setup.ts returns dark
    expect(screen.getByTestId('resolved').textContent).toBe('dark')
  })

  it('resolves explicit theme directly', async () => {
    render(
      <AppStateProvider>
        <ThemeReader />
      </AppStateProvider>,
    )
    await act(async () => {
      screen.getByText('Set Sepia').click()
    })
    expect(screen.getByTestId('resolved').textContent).toBe('sepia')
  })
})

describe('SET_SIDEBAR_PANEL settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sets sidebar panel to settings', async () => {
    render(
      <AppStateProvider>
        <SidebarPanelTester />
      </AppStateProvider>,
    )
    await act(async () => {
      screen.getByText('Open Settings Panel').click()
    })
    expect(screen.getByTestId('sidebar-panel').textContent).toBe('settings')
    expect(screen.getByTestId('sidebar-open').textContent).toBe('true')
  })

  it('toggles sidebar closed when clicking active settings panel', async () => {
    render(
      <AppStateProvider>
        <SidebarPanelTester />
      </AppStateProvider>,
    )
    // Open settings panel
    await act(async () => {
      screen.getByText('Open Settings Panel').click()
    })
    expect(screen.getByTestId('sidebar-panel').textContent).toBe('settings')
    expect(screen.getByTestId('sidebar-open').textContent).toBe('true')

    // Click again to close
    await act(async () => {
      screen.getByText('Open Settings Panel').click()
    })
    expect(screen.getByTestId('sidebar-open').textContent).toBe('false')
  })

  it('switches from settings to explorer panel', async () => {
    render(
      <AppStateProvider>
        <SidebarPanelTester />
      </AppStateProvider>,
    )
    await act(async () => {
      screen.getByText('Open Settings Panel').click()
    })
    expect(screen.getByTestId('sidebar-panel').textContent).toBe('settings')

    await act(async () => {
      screen.getByText('Open Explorer Panel').click()
    })
    expect(screen.getByTestId('sidebar-panel').textContent).toBe('explorer')
    expect(screen.getByTestId('sidebar-open').textContent).toBe('true')
  })
})

describe('Content state management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('INIT_FILE_CONTENT stores content and original', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => {
      result.current.dispatch({ type: 'INIT_FILE_CONTENT', path: 'test.md', content: '# Hello' })
    })
    expect(result.current.state.fileContents['test.md']).toBe('# Hello')
    expect(result.current.state.originalContents['test.md']).toBe('# Hello')
  })

  it('INIT_FILE_CONTENT does not overwrite existing content', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => {
      result.current.dispatch({ type: 'INIT_FILE_CONTENT', path: 'test.md', content: '# First' })
    })
    act(() => {
      result.current.dispatch({ type: 'INIT_FILE_CONTENT', path: 'test.md', content: '# Second' })
    })
    expect(result.current.state.fileContents['test.md']).toBe('# First')
  })

  it('UPDATE_CONTENT marks tab as modified', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => {
      result.current.dispatch({ type: 'OPEN_FILE', path: 'test.md' })
    })
    act(() => {
      result.current.dispatch({ type: 'INIT_FILE_CONTENT', path: 'test.md', content: '# Orig' })
    })
    act(() => {
      result.current.dispatch({ type: 'UPDATE_CONTENT', path: 'test.md', content: '# Changed' })
    })
    const tab = result.current.state.tabs.find(t => t.path === 'test.md')
    expect(tab?.modified).toBe(true)
  })

  it('UPDATE_CONTENT with original content clears modified', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => {
      result.current.dispatch({ type: 'OPEN_FILE', path: 'test.md' })
    })
    act(() => {
      result.current.dispatch({ type: 'INIT_FILE_CONTENT', path: 'test.md', content: '# Orig' })
    })
    act(() => {
      result.current.dispatch({ type: 'UPDATE_CONTENT', path: 'test.md', content: '# Changed' })
    })
    act(() => {
      result.current.dispatch({ type: 'UPDATE_CONTENT', path: 'test.md', content: '# Orig' })
    })
    const tab = result.current.state.tabs.find(t => t.path === 'test.md')
    expect(tab?.modified).toBe(false)
  })

  it('SAVE_FILE resets modified flag and updates originalContents', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper: hookWrapper })
    act(() => {
      result.current.dispatch({ type: 'OPEN_FILE', path: 'test.md' })
    })
    act(() => {
      result.current.dispatch({ type: 'INIT_FILE_CONTENT', path: 'test.md', content: '# Orig' })
    })
    act(() => {
      result.current.dispatch({ type: 'UPDATE_CONTENT', path: 'test.md', content: '# Saved' })
    })
    act(() => {
      result.current.dispatch({ type: 'SAVE_FILE', path: 'test.md' })
    })
    const tab = result.current.state.tabs.find(t => t.path === 'test.md')
    expect(tab?.modified).toBe(false)
    expect(result.current.state.originalContents['test.md']).toBe('# Saved')
  })
})
