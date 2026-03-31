import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ActivityBar } from './ActivityBar'

describe('ActivityBar', () => {
  const defaultProps = {
    activePanel: 'explorer' as const,
    sidebarOpen: true,
    onSelectPanel: vi.fn(),
    onOpenSettings: vi.fn(),
  }

  it('renders Explorer, Search, and Settings buttons', () => {
    render(<ActivityBar {...defaultProps} />)
    expect(screen.getByTitle('Explorer')).toBeInTheDocument()
    expect(screen.getByTitle('Search')).toBeInTheDocument()
    expect(screen.getByTitle('Settings')).toBeInTheDocument()
  })

  it('marks active panel with data-active=true', () => {
    render(<ActivityBar {...defaultProps} activePanel="explorer" sidebarOpen={true} />)
    expect(screen.getByTitle('Explorer')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTitle('Search')).toHaveAttribute('data-active', 'false')
  })

  it('marks no panel active when sidebar is closed', () => {
    render(<ActivityBar {...defaultProps} activePanel="explorer" sidebarOpen={false} />)
    expect(screen.getByTitle('Explorer')).toHaveAttribute('data-active', 'false')
    expect(screen.getByTitle('Search')).toHaveAttribute('data-active', 'false')
  })

  it('calls onSelectPanel when icon clicked', async () => {
    const onSelectPanel = vi.fn()
    render(<ActivityBar {...defaultProps} onSelectPanel={onSelectPanel} />)
    await userEvent.click(screen.getByTitle('Search'))
    expect(onSelectPanel).toHaveBeenCalledWith('search')
  })

  it('calls onOpenSettings when settings icon clicked', async () => {
    const onOpenSettings = vi.fn()
    render(<ActivityBar {...defaultProps} onOpenSettings={onOpenSettings} />)
    await userEvent.click(screen.getByTitle('Settings'))
    expect(onOpenSettings).toHaveBeenCalled()
  })

  it('shows X icon and Close Settings title when settings is active', () => {
    render(<ActivityBar {...defaultProps} settingsActive={true} />)
    const btn = screen.getByTitle('Close Settings')
    expect(btn).toHaveAttribute('data-active', 'true')
    expect(btn).toHaveAttribute('aria-label', 'Close Settings')
  })

  it('shows gear icon and Settings title when settings is not active', () => {
    render(<ActivityBar {...defaultProps} settingsActive={false} />)
    const btn = screen.getByTitle('Settings')
    expect(btn).toHaveAttribute('data-active', 'false')
    expect(btn).toHaveAttribute('aria-label', 'Settings')
  })
})
