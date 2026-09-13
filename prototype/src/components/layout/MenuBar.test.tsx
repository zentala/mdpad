/**
 * Tests for MenuBar — File and Edit menu items call their wired handlers.
 * View/Help menus and Quit-inside-Tauri live in MenuBar.view-help.test.tsx.
 */
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MenuBar, type MenuBarHandlers } from './menuBarTestUtils'

async function openMenu(name: string) {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name }))
  return user
}

describe('MenuBar — File menu', () => {
  it('New File calls onNewFile', async () => {
    const h: MenuBarHandlers = { onNewFile: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('File')
    await user.click(screen.getByText('New File'))
    expect(h.onNewFile).toHaveBeenCalledTimes(1)
  })

  it('Open File calls onOpenFile', async () => {
    const h: MenuBarHandlers = { onOpenFile: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('File')
    await user.click(screen.getByText('Open File…'))
    expect(h.onOpenFile).toHaveBeenCalledTimes(1)
  })

  it('Save calls onSave', async () => {
    const h: MenuBarHandlers = { onSave: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('File')
    await user.click(screen.getByText('Save'))
    expect(h.onSave).toHaveBeenCalledTimes(1)
  })

  it('Save As calls onSaveAs', async () => {
    const h: MenuBarHandlers = { onSaveAs: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('File')
    await user.click(screen.getByText('Save As…'))
    expect(h.onSaveAs).toHaveBeenCalledTimes(1)
  })

  it('Close Tab calls onCloseTab', async () => {
    const h: MenuBarHandlers = { onCloseTab: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('File')
    await user.click(screen.getByText('Close Tab'))
    expect(h.onCloseTab).toHaveBeenCalledTimes(1)
  })

  it('Export submenu opens and PDF calls onExportPdf', async () => {
    const h: MenuBarHandlers = { onExportPdf: vi.fn() }
    render(<MenuBar {...h} />)
    await openMenu('File')
    fireEvent.mouseEnter(screen.getByText('Export').closest('div')!)
    expect(screen.getByText('PDF')).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()

    fireEvent.click(screen.getByText('PDF'))
    expect(h.onExportPdf).toHaveBeenCalledTimes(1)
  })

  it('Export submenu HTML calls onExportHtml', async () => {
    const h: MenuBarHandlers = { onExportHtml: vi.fn() }
    render(<MenuBar {...h} />)
    await openMenu('File')
    fireEvent.mouseEnter(screen.getByText('Export').closest('div')!)
    fireEvent.click(screen.getByText('HTML'))
    expect(h.onExportHtml).toHaveBeenCalledTimes(1)
  })

  it('does not render Quit outside Tauri', async () => {
    render(<MenuBar />)
    await openMenu('File')
    expect(screen.queryByText('Quit')).not.toBeInTheDocument()
  })
})

describe('MenuBar — Edit menu', () => {
  it('Undo/Redo/Cut/Copy/Paste call onEditCommand with the right command', async () => {
    const onEditCommand = vi.fn()
    render(<MenuBar onEditCommand={onEditCommand} />)
    const cases: Array<[string, string]> = [
      ['Undo', 'undo'],
      ['Redo', 'redo'],
      ['Cut', 'cut'],
      ['Copy', 'copy'],
      ['Paste', 'paste'],
    ]
    for (const [label, cmd] of cases) {
      onEditCommand.mockClear()
      const user = await openMenu('Edit')
      await user.click(screen.getByText(label))
      expect(onEditCommand).toHaveBeenCalledWith(cmd)
    }
  })

  it('Find calls onFind', async () => {
    const h: MenuBarHandlers = { onFind: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('Edit')
    await user.click(screen.getByText('Find'))
    expect(h.onFind).toHaveBeenCalledTimes(1)
  })

  it('Find & Replace calls onFindReplace', async () => {
    const h: MenuBarHandlers = { onFindReplace: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('Edit')
    await user.click(screen.getByText('Find & Replace'))
    expect(h.onFindReplace).toHaveBeenCalledTimes(1)
  })

  it('Find in Folder calls onFindInFolder', async () => {
    const h: MenuBarHandlers = { onFindInFolder: vi.fn() }
    render(<MenuBar {...h} />)
    const user = await openMenu('Edit')
    await user.click(screen.getByText('Find in Folder'))
    expect(h.onFindInFolder).toHaveBeenCalledTimes(1)
  })
})
