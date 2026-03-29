import { useMemo } from 'react'
import type { TocHeading } from '@/types'

export function useTocHeadings(markdown: string): TocHeading[] {
  return useMemo(() => {
    const headings: TocHeading[] = []
    const lines = markdown.split('\n')
    let inFrontmatter = false
    let inCodeBlock = false

    for (const line of lines) {
      if (line.trim() === '---') {
        inFrontmatter = !inFrontmatter
        continue
      }
      if (inFrontmatter) continue

      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }
      if (inCodeBlock) continue

      const match = line.match(/^(#{1,6})\s+(.+)/)
      if (match) {
        const text = match[2].replace(/[*_`\[\]]/g, '')
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
        headings.push({ id, text, level: match[1].length })
      }
    }

    return headings
  }, [markdown])
}
