import { useState, useEffect } from 'react'
import type { TocHeading } from '@/types'

/**
 * Tracks which heading is currently visible in the viewport
 * using IntersectionObserver. Returns the id of the active heading.
 */
export function useActiveHeading(headings: TocHeading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )

    const elements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [headings])

  return activeId
}
