/**
 * Tests for MenuBar — View and Help menu items, plus Tauri-only Quit.
 * File and Edit menus live in MenuBar.test.tsx.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { MenuBar, type MenuBarHandlers } from './menuBarTestUtils'

async function openMenu(name: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name }))
  return user
}

describe('MenuBar — View menu', () => {
  it('Toggle Sidebar calls onToggleSidebar', async () => {
    const h: MenuBarHandlers = { onToggleSidebar: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('View')
    await user.click(screen.getByText('Toggle Sidebar'))
    expect(h.onToggleSidebar).toHaveBeenCalledTimes(1)
  })

  it('Toggle Outline calls onToggleToc', async () => {
    const h: MenuBarHandlers = { onToggleToc: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('View')
    await user.click(screen.getByText('Toggle Outline'))
    expect(h.onToggleToc).toHaveBeenCalledTimes(1)
  })

  it('Zoom In calls onZoomIn', async () => {
    const h: MenuBarHandlers = { onZoomIn: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('View')
    await user.click(screen.getByText('Zoom In'))
    expect(h.onZoomIn).toHaveBeenCalledTimes(1)
  })

  it('Zoom Out calls onZoomOut', async () => {
    const h: MenuBarHandlers = { onZoomOut: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('View')
    await user.click(screen.getByText('Zoom Out'))
    expect(h.onZoomOut).toHaveBeenCalledTimes(1)
  })

  it('Theme items call onSetTheme with the right theme', async () => {
    const onSetTheme = vi.fn()
    render(<MenuBar onSetTheme={onSetTheme} />)
    const cases: Array<[string, string]> = [
      ['Theme: Auto', 'auto'],
      ['Theme: Dark', 'dark'],
      ['Theme: Light', 'light'],
      ['Theme: Sepia', 'sepia'],
    ]
    for (const [label, theme] of cases) {
      onSetTheme.mockClear()
      const user = await openMenu('View')
      await user.click(screen.getByText(label))
      expect(onSetTheme).toHaveBeenCalledWith(theme)
    }
  })

  it('Zen Mode calls onToggleZenMode', async () => {
    const h: MenuBarHandlers = { onToggleZenMode: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('View')
    await user.click(screen.getByText('Zen Mode'))
    expect(h.onToggleZenMode).toHaveBeenCalledTimes(1)
  })
})

describe('MenuBar — Help menu', () => {
  it('About mdpad calls onOpenAbout', async () => {
    const h: MenuBarHandlers = { onOpenAbout: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('Help')
    await user.click(screen.getByText('About mdpad'))
    expect(h.onOpenAbout).toHaveBeenCalledTimes(1)
  })

  it('Keyboard Shortcuts calls onOpenShortcuts', async () => {
    const h: MenuBarHandlers = { onOpenShortcuts: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('Help')
    await user.click(screen.getByText('Keyboard Shortcuts'))
    expect(h.onOpenShortcuts).toHaveBeenCalledTimes(1)
  })

  it('Markdown Reference calls onOpenMarkdownRef', async () => {
    const h: MenuBarHandlers = { onOpenMarkdownRef: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('Help')
    await user.click(screen.getByText('Markdown Reference'))
    expect(h.onOpenMarkdownRef).toHaveBeenCalledTimes(1)
  })
})

describe('MenuBar — Tauri-only Quit', () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__
  })

  it('renders Quit and calls onQuit inside Tauri', async () => {
    ;(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {}
    const h: MenuBarHandlers = { onQuit: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('File')
    await user.click(screen.getByText('Quit'))
    expect(h.onQuit).toHaveBeenCalledTimes(1)
  })
})
