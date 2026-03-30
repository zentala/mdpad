/**
 * Tests for multiline blockquote preprocessor.
 */
import { describe, it, expect } from 'vitest'
import { preprocessMultilineBlockquotes } from './remarkMultilineBlockquote'

describe('preprocessMultilineBlockquotes', () => {
  it('converts >>> fences to HTML blockquote tags', () => {
    const input = '>>>\nHello world\n>>>'
    const result = preprocessMultilineBlockquotes(input)
    expect(result).toContain('<blockquote class="multiline-blockquote">')
    expect(result).toContain('Hello world')
    expect(result).toContain('</blockquote>')
  })

  it('preserves content outside fences', () => {
    const input = 'before\n>>>\ninside\n>>>\nafter'
    const result = preprocessMultilineBlockquotes(input)
    expect(result).toContain('before')
    expect(result).toContain('inside')
    expect(result).toContain('after')
  })

  it('auto-closes unclosed fence', () => {
    const input = '>>>\nunclosed content'
    const result = preprocessMultilineBlockquotes(input)
    expect(result).toContain('<blockquote class="multiline-blockquote">')
    expect(result).toContain('</blockquote>')
  })

  it('handles multiple fenced blocks', () => {
    const input = '>>>\nfirst\n>>>\n\n>>>\nsecond\n>>>'
    const result = preprocessMultilineBlockquotes(input)
    const opens = result.match(/<blockquote/g)
    const closes = result.match(/<\/blockquote>/g)
    expect(opens).toHaveLength(2)
    expect(closes).toHaveLength(2)
  })

  it('returns input unchanged when no fences present', () => {
    const input = 'just normal markdown\n> regular quote'
    expect(preprocessMultilineBlockquotes(input)).toBe(input)
  })

  it('handles empty input', () => {
    expect(preprocessMultilineBlockquotes('')).toBe('')
  })

  it('handles fence with surrounding whitespace', () => {
    const input = '  >>>  \ncontent\n  >>>  '
    const result = preprocessMultilineBlockquotes(input)
    expect(result).toContain('<blockquote class="multiline-blockquote">')
    expect(result).toContain('</blockquote>')
  })
})
