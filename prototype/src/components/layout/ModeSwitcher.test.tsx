import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ModeSwitcher } from './ModeSwitcher'

describe('ModeSwitcher', () => {
  it('renders Visual, Code, and Preview buttons', () => {
    render(<ModeSwitcher editorMode="write" onSetEditorMode={vi.fn()} />)
    expect(screen.getByTitle(/Visual editor/)).toBeInTheDocument()
    expect(screen.getByTitle(/Code editor/)).toBeInTheDocument()
    expect(screen.getByTitle(/Preview/)).toBeInTheDocument()
  })

  it('highlights active mode (write → Visual)', () => {
    render(<ModeSwitcher editorMode="write" onSetEditorMode={vi.fn()} />)
    expect(screen.getByTitle(/Visual editor/)).toHaveClass(/modeActive/)
  })

  it('highlights active mode (preview)', () => {
    render(<ModeSwitcher editorMode="preview" onSetEditorMode={vi.fn()} />)
    expect(screen.getByTitle(/Preview/)).toHaveClass(/modeActive/)
  })

  it('calls onSetEditorMode when clicking a mode', async () => {
    const onSet = vi.fn()
    render(<ModeSwitcher editorMode="write" onSetEditorMode={onSet} />)
    await userEvent.click(screen.getByTitle(/Code editor/))
    expect(onSet).toHaveBeenCalledWith('code')
  })

  it('calls onSetEditorMode with preview', async () => {
    const onSet = vi.fn()
    render(<ModeSwitcher editorMode="write" onSetEditorMode={onSet} />)
    await userEvent.click(screen.getByTitle(/Preview/))
    expect(onSet).toHaveBeenCalledWith('preview')
  })
})
