/**
 * Tests for Toolbar — formatting buttons call editorRef.execCommand with the
 * right command, buttons disable in preview mode, and insert popovers open.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { RefObject } from 'react'
import { Toolbar } from './Toolbar'
import type { EditorRef } from '@/types'

function makeEditorRef(): RefObject<EditorRef | null> {
  return {
    current: {
      execCommand: vi.fn(),
      insertAtCursor: vi.fn(),
      focus: vi.fn(),
      getContent: vi.fn(() => ''),
      setContent: vi.fn(),
    },
  }
}

const noop = () => {}

describe('Toolbar — formatting commands', () => {
  it.each([
    ['Undo (Ctrl+Z)', 'undo'],
    ['Redo (Ctrl+Shift+Z)', 'redo'],
    ['Bold (Ctrl+B)', 'bold'],
    ['Italic (Ctrl+I)', 'italic'],
    ['Strikethrough', 'strikethrough'],
    ['Inline Code', 'code'],
    ['Heading 1 (Ctrl+1)', 'heading1'],
    ['Heading 2 (Ctrl+2)', 'heading2'],
    ['Heading 3 (Ctrl+3)', 'heading3'],
    ['Ordered List', 'orderedList'],
    ['Unordered List', 'bulletList'],
    ['Task List', 'taskList'],
    ['Blockquote', 'blockquote'],
    ['Code Block', 'codeBlock'],
  ] as const)('%s calls execCommand(%s)', async (title, cmd) => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle(title))
    expect(editorRef.current!.execCommand).toHaveBeenCalledWith(cmd)
  })
})

describe('Toolbar — preview mode disables formatting buttons', () => {
  it('formatting buttons are disabled in preview mode', () => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="preview"
      />,
    )
    expect(screen.getByTitle(/Bold/)).toHaveAttribute('aria-disabled', 'true')
  })

  it('clicking a disabled button does not call execCommand', async () => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="preview"
      />,
    )
    await userEvent.click(screen.getByTitle(/Bold/))
    expect(editorRef.current!.execCommand).not.toHaveBeenCalled()
  })

  it('formatting buttons are enabled in write mode', () => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="write"
      />,
    )
    expect(screen.getByTitle(/Bold/)).toHaveAttribute('aria-disabled', 'false')
  })
})

describe('Toolbar — insert popovers', () => {
  it('Insert Link opens the link popover form', async () => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle('Insert Link (Ctrl+K)'))
    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument()
  })

  it('Insert Image opens the image popover form', async () => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle('Insert Image'))
    expect(screen.getByPlaceholderText('https://...image.png')).toBeInTheDocument()
  })

  it('Insert Table opens the table popover', async () => {
    const editorRef = makeEditorRef()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorRef={editorRef}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle('Insert Table'))
    expect(screen.getByText('Insert Table')).toBeInTheDocument()
  })
})

describe('Toolbar — other actions', () => {
  it('Find button calls onOpenSearch', async () => {
    const onOpenSearch = vi.fn()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={noop}
        onOpenSearch={onOpenSearch}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle('Find (Ctrl+F)'))
    expect(onOpenSearch).toHaveBeenCalledTimes(1)
  })

  it('Toggle Explorer button calls onToggleSidebar', async () => {
    const onToggleSidebar = vi.fn()
    render(
      <Toolbar
        onToggleSidebar={onToggleSidebar}
        onToggleToc={noop}
        onOpenSearch={noop}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle(/Toggle Explorer/))
    expect(onToggleSidebar).toHaveBeenCalledTimes(1)
  })

  it('Toggle Outline button calls onToggleToc', async () => {
    const onToggleToc = vi.fn()
    render(
      <Toolbar
        onToggleSidebar={noop}
        onToggleToc={onToggleToc}
        onOpenSearch={noop}
        editorMode="write"
      />,
    )
    await userEvent.click(screen.getByTitle(/Toggle Outline/))
    expect(onToggleToc).toHaveBeenCalledTimes(1)
  })
})
