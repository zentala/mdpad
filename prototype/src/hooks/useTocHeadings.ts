import { useMemo } from 'react'
import GithubSlugger from 'github-slugger'
import type { TocHeading } from '@/types'

/**
 * Extract TOC headings from markdown source.
 * Uses github-slugger for IDs to match rehype-slug output.
 */
export function useTocHeadings(markdown: string): TocHeading[] {
  return useMemo(() => {
    const headings: TocHeading[] = []
    const slugger = new GithubSlugger()
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
        const text = match[2].replace(/[*_`[\]]/g, '').replace(/==|~~|\+\+|\|\||\^(?!\[)/g, '')
        const id = slugger.slug(text)
        headings.push({ id, text, level: match[1].length })
      }
    }

    return headings
  }, [markdown])
}
