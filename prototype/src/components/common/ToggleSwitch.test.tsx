import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ToggleSwitch } from './ToggleSwitch'

describe('ToggleSwitch', () => {
  it('renders with label', () => {
    render(<ToggleSwitch checked={false} onChange={vi.fn()} label="Zen" />)
    expect(screen.getByText('Zen')).toBeInTheDocument()
  })

  it('has role=switch with aria-checked=false', () => {
    render(<ToggleSwitch checked={false} onChange={vi.fn()} label="Test" />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('has aria-checked=true when checked', () => {
    render(<ToggleSwitch checked={true} onChange={vi.fn()} label="Test" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange with opposite value on click', async () => {
    const onChange = vi.fn()
    render(<ToggleSwitch checked={false} onChange={onChange} label="Test" />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange(false) when checked=true and clicked', async () => {
    const onChange = vi.fn()
    render(<ToggleSwitch checked={true} onChange={onChange} label="Test" />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('renders title tooltip', () => {
    render(<ToggleSwitch checked={false} onChange={vi.fn()} title="Zen Mode (F11)" />)
    expect(screen.getByTitle('Zen Mode (F11)')).toBeInTheDocument()
  })
})
