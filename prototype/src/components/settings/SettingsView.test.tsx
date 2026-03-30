/**
 * Tests for SettingsView — section rendering, theme dispatch, toggle state.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProvider } from '@/test/render-with-provider'
import { SettingsView } from './SettingsView'

/** Spy on dispatch by intercepting useAppContext */
const dispatchSpy = vi.fn()

vi.mock('@/providers/AppStateProvider', async () => {
  const actual = await vi.importActual<
    typeof import('@/providers/AppStateProvider')
  >('@/providers/AppStateProvider')
  return {
    ...actual,
    useAppContext: () => ({
      state: {
        sidebarOpen: true,
        sidebarPanel: 'explorer' as const,
        tocOpen: true,
        theme: 'dark' as const,
        editorMode: 'write' as const,
        tabs: [],
        activeTabId: null,
        searchQuery: '',
        zoom: 100,
      },
      dispatch: dispatchSpy,
      activeTab: null,
      activeMarkdown: '',
      showToolbar: false,
      showToc: false,
    }),
  }
})

describe('SettingsView', () => {
  beforeEach(() => {
    dispatchSpy.mockClear()
  })

  it('renders all five sections', () => {
    renderWithProvider(<SettingsView />)

    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Files')).toBeInTheDocument()
  })

  it('displays setting labels with hints', () => {
    renderWithProvider(<SettingsView />)

    expect(screen.getByText('Theme')).toBeInTheDocument()
    expect(
      screen.getByText('Application color scheme'),
    ).toBeInTheDocument()
    expect(screen.getByText('Word wrap')).toBeInTheDocument()
    expect(screen.getByText('Render math')).toBeInTheDocument()
  })

  it('dispatches SET_THEME when theme select changes', async () => {
    const user = userEvent.setup()
    renderWithProvider(<SettingsView />)

    // Find the theme select (in Appearance section)
    const appearanceSection = screen.getByText('Appearance').closest('section')!
    const themeSelect = within(appearanceSection).getByDisplayValue('Dark')

    await user.selectOptions(themeSelect, 'light')

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'SET_THEME',
      theme: 'light',
    })
  })

  it('toggle switches change state on click', async () => {
    const user = userEvent.setup()
    renderWithProvider(<SettingsView />)

    // Word wrap toggle is ON by default — clicking turns it off
    const editorSection = screen.getByText('Editor').closest('section')!
    const toggleButtons = within(editorSection).getAllByRole('button')
    const wordWrapToggle = toggleButtons[0]

    // Default: has "on" class
    expect(wordWrapToggle.className).toContain('on')

    await user.click(wordWrapToggle)

    // After click: "on" class removed
    expect(wordWrapToggle.className).not.toContain('on')
  })

  it('renders file extension toggles', () => {
    renderWithProvider(<SettingsView />)

    expect(screen.getByText('.md')).toBeInTheDocument()
    expect(screen.getByText('.markdown')).toBeInTheDocument()
    expect(screen.getByText('.yaml')).toBeInTheDocument()
    expect(screen.getByText('.json')).toBeInTheDocument()
  })

  it('renders exclude patterns', () => {
    renderWithProvider(<SettingsView />)

    expect(screen.getByText('node_modules')).toBeInTheDocument()
    expect(screen.getByText('.git')).toBeInTheDocument()
    expect(screen.getByText('dist')).toBeInTheDocument()
  })

  it('renders startup behavior select with default value', () => {
    renderWithProvider(<SettingsView />)

    const generalSection = screen.getByText('General').closest('section')!
    const startupSelect = within(generalSection).getByDisplayValue(
      'Last session',
    )
    expect(startupSelect).toBeInTheDocument()
  })
})
