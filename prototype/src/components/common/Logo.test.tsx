/**
 * Tests for Logo component — SVG rendering, props, accessibility.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders an SVG element with default props', () => {
    render(<Logo />)
    const svg = screen.getByRole('img', { name: 'mdpad' })
    expect(svg).toBeInTheDocument()
    expect(svg.tagName.toLowerCase()).toBe('svg')
  })

  it('applies default size of 20', () => {
    render(<Logo />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '20')
  })

  it('accepts a custom size', () => {
    render(<Logo size={40} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '40')
  })

  it('has accessible title defaulting to "mdpad"', () => {
    render(<Logo />)
    const title = screen.getByText('mdpad')
    expect(title.tagName.toLowerCase()).toBe('title')
  })

  it('accepts a custom title', () => {
    render(<Logo title="Custom Logo" />)
    const svg = screen.getByRole('img', { name: 'Custom Logo' })
    expect(svg).toBeInTheDocument()
    expect(screen.getByText('Custom Logo')).toBeInTheDocument()
  })

  it('accepts a custom className', () => {
    render(<Logo className="my-logo" />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveClass('my-logo')
  })

  it('renders two path elements for # and _ glyphs', () => {
    const { container } = render(<Logo />)
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(2)
  })

  it('uses currentColor by default', () => {
    const { container } = render(<Logo />)
    const g = container.querySelector('g')
    expect(g).toHaveAttribute('fill', 'currentColor')
  })

  it('accepts a custom color', () => {
    const { container } = render(<Logo color="red" />)
    const g = container.querySelector('g')
    expect(g).toHaveAttribute('fill', 'red')
  })
})
