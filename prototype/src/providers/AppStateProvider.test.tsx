/**
 * Tests for localStorage persistence in AppStateProvider.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AppStateProvider, useAppContext } from './AppStateProvider'

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

/** Helper component to test settings toggle */
function SettingsToggler() {
  const { state, dispatch, activeTab } = useAppContext()
  return (
    <div>
      <span data-testid="active-tab-type">{activeTab?.type ?? 'none'}</span>
      <span data-testid="tab-count">{state.tabs.length}</span>
      <button onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}>Toggle Settings</button>
      <button onClick={() => dispatch({ type: 'OPEN_FILE', path: 'README.md' })}>Open File</button>
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

describe('OPEN_SETTINGS toggle', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('opens settings on first click', async () => {
    render(
      <AppStateProvider>
        <SettingsToggler />
      </AppStateProvider>,
    )
    await act(async () => {
      screen.getByText('Toggle Settings').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).toBe('settings')
  })

  it('closes settings on second click when settings is active', async () => {
    render(
      <AppStateProvider>
        <SettingsToggler />
      </AppStateProvider>,
    )
    // Open settings
    await act(async () => {
      screen.getByText('Toggle Settings').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).toBe('settings')

    // Close settings (toggle)
    await act(async () => {
      screen.getByText('Toggle Settings').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).not.toBe('settings')
  })

  it('opens settings when clicking from a file tab', async () => {
    render(
      <AppStateProvider>
        <SettingsToggler />
      </AppStateProvider>,
    )
    // Open a file first
    await act(async () => {
      screen.getByText('Open File').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).toBe('file')

    // Open settings
    await act(async () => {
      screen.getByText('Toggle Settings').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).toBe('settings')
  })

  it('returns to file tab after closing settings', async () => {
    render(
      <AppStateProvider>
        <SettingsToggler />
      </AppStateProvider>,
    )
    // Open file, then settings, then close settings
    await act(async () => {
      screen.getByText('Open File').click()
    })
    await act(async () => {
      screen.getByText('Toggle Settings').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).toBe('settings')

    await act(async () => {
      screen.getByText('Toggle Settings').click()
    })
    expect(screen.getByTestId('active-tab-type').textContent).toBe('file')
  })
})
