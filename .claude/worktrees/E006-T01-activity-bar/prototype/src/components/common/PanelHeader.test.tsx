/**
 * Tests for PanelHeader component — icon, title, action buttons.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FolderOpen } from 'lucide-react'
import { PanelHeader } from './PanelHeader'

describe('PanelHeader', () => {
  it('renders the title text', () => {
    render(<PanelHeader icon={FolderOpen} title="Explorer" />)
    expect(screen.getByText('Explorer')).toBeInTheDocument()
  })

  it('renders the icon', () => {
    const { container } = render(
      <PanelHeader icon={FolderOpen} title="Explorer" />,
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders without action buttons when none provided', () => {
    const { container } = render(
      <PanelHeader icon={FolderOpen} title="Explorer" />,
    )
    // The actions wrapper should not be in the DOM
    const actionsDiv = container.querySelector('[class*="actions"]')
    expect(actionsDiv).toBeNull()
  })

  it('renders action buttons when provided', () => {
    render(
      <PanelHeader
        icon={FolderOpen}
        title="Explorer"
        actions={
          <>
            <button type="button">Action 1</button>
            <button type="button">Action 2</button>
          </>
        }
      />,
    )
    expect(screen.getByText('Action 1')).toBeInTheDocument()
    expect(screen.getByText('Action 2')).toBeInTheDocument()
  })

  it('action buttons are clickable', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <PanelHeader
        icon={FolderOpen}
        title="Explorer"
        actions={
          <button type="button" onClick={onClick}>
            Refresh
          </button>
        }
      />,
    )

    await user.click(screen.getByText('Refresh'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
