import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ZenHoverBar } from './ZenHoverBar'

describe('ZenHoverBar', () => {
  const defaultProps = {
    editorMode: 'write' as const,
    onSetEditorMode: vi.fn(),
    onToggleZenMode: vi.fn(),
    theme: 'dark' as const,
    onSetTheme: vi.fn(),
    onToggleSettings: vi.fn(),
    isSettingsActive: false,
  }

  it('renders mode switcher buttons', () => {
    render(<ZenHoverBar {...defaultProps} />)
    expect(screen.getByTitle(/Visual editor/)).toBeInTheDocument()
    expect(screen.getByTitle(/Code editor/)).toBeInTheDocument()
    expect(screen.getByTitle(/Preview/)).toBeInTheDocument()
  })

  it('renders zen toggle in checked state', () => {
    render(<ZenHoverBar {...defaultProps} />)
    const zenToggle = screen.getByRole('switch')
    expect(zenToggle).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onToggleZenMode when zen toggle clicked', async () => {
    const onToggle = vi.fn()
    render(<ZenHoverBar {...defaultProps} onToggleZenMode={onToggle} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalled()
  })

  it('renders theme cycle button', () => {
    render(<ZenHoverBar {...defaultProps} theme="dark" />)
    expect(screen.getByTitle(/Theme: dark/)).toBeInTheDocument()
  })

  it('cycles theme on click', async () => {
    const onSetTheme = vi.fn()
    render(<ZenHoverBar {...defaultProps} theme="dark" onSetTheme={onSetTheme} />)
    await userEvent.click(screen.getByTitle(/Theme: dark/))
    expect(onSetTheme).toHaveBeenCalledWith('light')
  })

  it('calls onToggleSettings when settings button clicked', async () => {
    const onToggleSettings = vi.fn()
    render(<ZenHoverBar {...defaultProps} onToggleSettings={onToggleSettings} />)
    await userEvent.click(screen.getByTitle(/Settings/))
    expect(onToggleSettings).toHaveBeenCalled()
  })

  it('shows "Close Settings" title when settings is active', () => {
    render(<ZenHoverBar {...defaultProps} isSettingsActive={true} />)
    expect(screen.getByTitle('Close Settings')).toBeInTheDocument()
  })

  it('shows "Settings (Ctrl+,)" title when settings is not active', () => {
    render(<ZenHoverBar {...defaultProps} isSettingsActive={false} />)
    expect(screen.getByTitle('Settings (Ctrl+,)')).toBeInTheDocument()
  })

  it('renders logo', () => {
    render(<ZenHoverBar {...defaultProps} />)
    expect(screen.getAllByTitle('mdpad').length).toBeGreaterThan(0)
  })
})
