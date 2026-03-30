import { useMemo } from 'react'
import type { FrontmatterData } from '@/types'

export function useFrontmatter(markdown: string): {
  data: FrontmatterData | null
  content: string
} {
  return useMemo(() => {
    const fmRegex = /^---\n([\s\S]*?)\n---/
    const match = markdown.match(fmRegex)

    if (!match) return { data: null, content: markdown }

    const data: FrontmatterData = {}
    const lines = match[1].split('\n')

    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim()
        const value = line.slice(colonIdx + 1).trim()
        data[key] = value
      }
    }

    const content = markdown.slice(match[0].length).trim()
    return { data, content }
  }, [markdown])
}
