import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ActivityBar } from './ActivityBar'

describe('ActivityBar', () => {
  const defaultProps = {
    activePanel: 'explorer' as const,
    sidebarOpen: true,
    onSelectPanel: vi.fn(),
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
    expect(screen.getByTitle('Settings')).toHaveAttribute('data-active', 'false')
  })

  it('marks no panel active when sidebar is closed', () => {
    render(<ActivityBar {...defaultProps} activePanel="explorer" sidebarOpen={false} />)
    expect(screen.getByTitle('Explorer')).toHaveAttribute('data-active', 'false')
    expect(screen.getByTitle('Search')).toHaveAttribute('data-active', 'false')
    expect(screen.getByTitle('Settings')).toHaveAttribute('data-active', 'false')
  })

  it('calls onSelectPanel when icon clicked', async () => {
    const onSelectPanel = vi.fn()
    render(<ActivityBar {...defaultProps} onSelectPanel={onSelectPanel} />)
    await userEvent.click(screen.getByTitle('Search'))
    expect(onSelectPanel).toHaveBeenCalledWith('search')
  })

  it('calls onSelectPanel with settings when settings icon clicked', async () => {
    const onSelectPanel = vi.fn()
    render(<ActivityBar {...defaultProps} onSelectPanel={onSelectPanel} />)
    await userEvent.click(screen.getByTitle('Settings'))
    expect(onSelectPanel).toHaveBeenCalledWith('settings')
  })

  it('marks settings panel active when selected and sidebar open', () => {
    render(<ActivityBar {...defaultProps} activePanel="settings" sidebarOpen={true} />)
    expect(screen.getByTitle('Settings')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTitle('Explorer')).toHaveAttribute('data-active', 'false')
  })
})
