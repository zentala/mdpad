/**
 * Tests for SearchBar — find match counting via usePreviewSearch, replace via
 * editorRef, and replace UI visibility per editor mode.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { RefObject } from 'react'
import { SearchBar } from './SearchBar'
import type { EditorRef } from '@/types'

/** A container matching usePreviewSearch's `[class*="preview"]` selector */
function PreviewContainer({ text }: { text: string }) {
  return <div className="preview">{text}</div>
}

function makeEditorRef(content: string): RefObject<EditorRef | null> {
  return {
    current: {
      execCommand: vi.fn(),
      insertAtCursor: vi.fn(),
      focus: vi.fn(),
      getContent: vi.fn(() => content),
      setContent: vi.fn(),
    },
  }
}

describe('SearchBar — find', () => {
  it('shows match count as the query changes', async () => {
    render(
      <>
        <PreviewContainer text="the cat sat on the mat" />
        <SearchBar onClose={vi.fn()} editorMode="write" />
      </>,
    )
    await userEvent.type(screen.getByPlaceholderText('Find in file...'), 'the')
    expect(await screen.findByText('1 of 2')).toBeInTheDocument()
  })

  it('shows "No results" when the query is empty', () => {
    render(
      <>
        <PreviewContainer text="the cat sat on the mat" />
        <SearchBar onClose={vi.fn()} editorMode="write" />
      </>,
    )
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('shows 0 matches for a query not present in the text', async () => {
    render(
      <>
        <PreviewContainer text="the cat sat on the mat" />
        <SearchBar onClose={vi.fn()} editorMode="write" />
      </>,
    )
    await userEvent.type(screen.getByPlaceholderText('Find in file...'), 'zzz')
    expect(await screen.findByText('0 of 0')).toBeInTheDocument()
  })

  it('close button calls onClose', async () => {
    const onClose = vi.fn()
    render(
      <>
        <PreviewContainer text="hello" />
        <SearchBar onClose={onClose} editorMode="write" />
      </>,
    )
    await userEvent.click(screen.getByTitle('Close (Esc)'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('SearchBar — replace', () => {
  it('replace row is hidden by default until toggled', () => {
    render(
      <>
        <PreviewContainer text="hello world" />
        <SearchBar onClose={vi.fn()} editorMode="write" />
      </>,
    )
    expect(screen.queryByPlaceholderText('Replace...')).not.toBeInTheDocument()
  })

  it('withReplace opens the replace row immediately', () => {
    render(
      <>
        <PreviewContainer text="hello world" />
        <SearchBar onClose={vi.fn()} editorMode="write" withReplace />
      </>,
    )
    expect(screen.getByPlaceholderText('Replace...')).toBeInTheDocument()
  })

  it('Replace All calls editorRef.setContent with every occurrence replaced', async () => {
    const editorRef = makeEditorRef('foo bar foo baz foo')
    render(
      <>
        <PreviewContainer text="foo bar foo baz foo" />
        <SearchBar onClose={vi.fn()} editorMode="write" editorRef={editorRef} withReplace />
      </>,
    )
    await userEvent.type(screen.getByPlaceholderText('Find in file...'), 'foo')
    await userEvent.type(screen.getByPlaceholderText('Replace...'), 'qux')
    await userEvent.click(screen.getByTitle('Replace All'))
    expect(editorRef.current!.setContent).toHaveBeenCalledWith('qux bar qux baz qux')
  })

  it('Replace replaces only the first occurrence', async () => {
    const editorRef = makeEditorRef('foo bar foo')
    render(
      <>
        <PreviewContainer text="foo bar foo" />
        <SearchBar onClose={vi.fn()} editorMode="write" editorRef={editorRef} withReplace />
      </>,
    )
    await userEvent.type(screen.getByPlaceholderText('Find in file...'), 'foo')
    await userEvent.type(screen.getByPlaceholderText('Replace...'), 'qux')
    await userEvent.click(screen.getByTitle('Replace'))
    expect(editorRef.current!.setContent).toHaveBeenCalledWith('qux bar foo')
  })

  it('replace UI is hidden entirely in preview mode', () => {
    render(
      <>
        <PreviewContainer text="hello world" />
        <SearchBar onClose={vi.fn()} editorMode="preview" withReplace />
      </>,
    )
    expect(screen.queryByPlaceholderText('Replace...')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Toggle Replace')).not.toBeInTheDocument()
  })
})
