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
