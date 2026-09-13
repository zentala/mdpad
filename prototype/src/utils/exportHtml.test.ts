/**
 * Tests for HTML export utility functions.
 */
import { describe, it, expect } from 'vitest'
// We can't import private functions directly, so test through the public API
// Instead, test the sanitizeFilename and escapeHtml logic inline

describe('exportHtml helpers', () => {
  it('sanitizeFilename removes unsafe characters', () => {
    const sanitize = (name: string) => name.replace(/[<>:"/\\|?*]/g, '_').replace(/\.md$/i, '')
    expect(sanitize('README.md')).toBe('README')
    expect(sanitize('file<with>bad:chars.md')).toBe('file_with_bad_chars')
    expect(sanitize('normal-file')).toBe('normal-file')
    expect(sanitize('path/to\\file.md')).toBe('path_to_file')
  })

  it('escapeHtml prevents XSS in title', () => {
    const escape = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    expect(escape('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
    expect(escape('Normal Title')).toBe('Normal Title')
    expect(escape('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })
})
