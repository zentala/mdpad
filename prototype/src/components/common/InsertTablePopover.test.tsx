/**
 * Tests for markdown table generation.
 */
import { describe, it, expect } from 'vitest'

// Inline the generateTable function for testing (same logic as InsertTablePopover)
function generateTable(rows: number, cols: number): string {
  const header = '| ' + Array.from({ length: cols }, (_, i) => `Header ${i + 1}`).join(' | ') + ' |'
  const separator = '| ' + Array.from({ length: cols }, () => '---').join(' | ') + ' |'
  const dataRows = Array.from(
    { length: rows - 1 },
    () => '| ' + Array.from({ length: cols }, () => '   ').join(' | ') + ' |',
  )
  return [header, separator, ...dataRows].join('\n')
}

describe('generateTable', () => {
  it('generates a 2x2 table', () => {
    const result = generateTable(2, 2)
    const lines = result.split('\n')
    expect(lines).toHaveLength(3) // header + separator + 1 data row
    expect(lines[0]).toContain('Header 1')
    expect(lines[0]).toContain('Header 2')
    expect(lines[1]).toContain('---')
  })

  it('generates a 3x3 table with 2 data rows', () => {
    const lines = generateTable(3, 3).split('\n')
    expect(lines).toHaveLength(4) // header + separator + 2 data rows
    expect(lines[0]).toContain('Header 1')
    expect(lines[0]).toContain('Header 3')
    expect(lines[1]).toContain('---')
  })

  it('generates a 1x1 table (header only)', () => {
    const lines = generateTable(1, 1).split('\n')
    expect(lines).toHaveLength(2) // header + separator, no data rows
    expect(lines[0]).toBe('| Header 1 |')
  })
})
