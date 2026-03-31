import { describe, it, expect } from 'vitest'
import { parseUrl } from '../useUrlSync'

describe('parseUrl', () => {
  it('returns empty for root', () => {
    expect(parseUrl('/')).toEqual({ type: 'empty' })
  })

  it('returns empty for empty string', () => {
    expect(parseUrl('')).toEqual({ type: 'empty' })
  })

  it('parses settings route', () => {
    expect(parseUrl('/settings')).toEqual({ type: 'settings' })
  })

  it('parses root-level file', () => {
    expect(parseUrl('/Welcome.md')).toEqual({
      type: 'file',
      path: 'Welcome.md',
    })
  })

  it('parses nested file path', () => {
    expect(parseUrl('/docs/README.md')).toEqual({
      type: 'file',
      path: 'docs/README.md',
    })
  })

  it('parses file with encoded characters', () => {
    expect(parseUrl('/docs/my%20file.md')).toEqual({
      type: 'file',
      path: 'docs/my file.md',
    })
  })

  it('returns empty for just slash', () => {
    expect(parseUrl('/')).toEqual({ type: 'empty' })
  })
})
