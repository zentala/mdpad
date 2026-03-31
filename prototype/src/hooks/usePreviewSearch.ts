/**
 * usePreviewSearch — DOM-based text search for preview mode.
 *
 * Walks text nodes in the preview container, wraps matches in <mark> elements,
 * and provides navigation between matches with scroll-into-view.
 */
import { useState, useCallback, useRef, useEffect } from 'react'

interface PreviewSearchResult {
  totalMatches: number
  currentMatch: number
  search: (query: string, caseSensitive: boolean) => void
  nextMatch: () => void
  prevMatch: () => void
  clearHighlights: () => void
}

const HIGHLIGHT_CLASS = 'search-highlight'
const ACTIVE_CLASS = 'search-highlight-active'

/** Collect all text nodes under a root element */
function getTextNodes(root: Element): Text[] {
  const nodes: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    nodes.push(node as Text)
    node = walker.nextNode()
  }
  return nodes
}

/** Remove all search highlight marks from a container */
function removeHighlights(container: Element) {
  const marks = container.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`)
  marks.forEach(mark => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  })
}

/**
 * Hook providing DOM-based find-in-file for the rendered preview container.
 * @param containerSelector CSS selector for the preview container
 */
export function usePreviewSearch(containerSelector: string): PreviewSearchResult {
  const [totalMatches, setTotalMatches] = useState(0)
  const [currentMatch, setCurrentMatch] = useState(0)
  const marksRef = useRef<HTMLElement[]>([])

  const getContainer = useCallback(
    () => document.querySelector(containerSelector),
    [containerSelector],
  )

  const clearHighlights = useCallback(() => {
    const container = getContainer()
    if (container) removeHighlights(container)
    marksRef.current = []
    setTotalMatches(0)
    setCurrentMatch(0)
  }, [getContainer])

  const highlightActive = useCallback((index: number) => {
    marksRef.current.forEach((m, i) => {
      m.classList.toggle(ACTIVE_CLASS, i === index)
    })
    const active = marksRef.current[index]
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const search = useCallback(
    (query: string, caseSensitive: boolean) => {
      const container = getContainer()
      if (!container) return

      removeHighlights(container)
      marksRef.current = []

      if (!query) {
        setTotalMatches(0)
        setCurrentMatch(0)
        return
      }

      const flags = caseSensitive ? 'g' : 'gi'
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escaped, flags)

      const textNodes = getTextNodes(container)
      const newMarks: HTMLElement[] = []

      for (const node of textNodes) {
        const text = node.textContent ?? ''
        const matches = [...text.matchAll(regex)]
        if (matches.length === 0) continue

        const parent = node.parentNode
        if (!parent) continue

        const frag = document.createDocumentFragment()
        let lastIndex = 0

        for (const match of matches) {
          const start = match.index!
          if (start > lastIndex) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex, start)))
          }
          const mark = document.createElement('mark')
          mark.className = HIGHLIGHT_CLASS
          mark.textContent = match[0]
          frag.appendChild(mark)
          newMarks.push(mark)
          lastIndex = start + match[0].length
        }

        if (lastIndex < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)))
        }

        parent.replaceChild(frag, node)
      }

      marksRef.current = newMarks
      setTotalMatches(newMarks.length)

      if (newMarks.length > 0) {
        setCurrentMatch(1)
        newMarks[0].classList.add(ACTIVE_CLASS)
        newMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setCurrentMatch(0)
      }
    },
    [getContainer],
  )

  const nextMatch = useCallback(() => {
    if (marksRef.current.length === 0) return
    setCurrentMatch(prev => {
      const next = prev >= marksRef.current.length ? 1 : prev + 1
      highlightActive(next - 1)
      return next
    })
  }, [highlightActive])

  const prevMatch = useCallback(() => {
    if (marksRef.current.length === 0) return
    setCurrentMatch(prev => {
      const next = prev <= 1 ? marksRef.current.length : prev - 1
      highlightActive(next - 1)
      return next
    })
  }, [highlightActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const container = getContainer()
      if (container) removeHighlights(container)
    }
  }, [getContainer])

  return { totalMatches, currentMatch, search, nextMatch, prevMatch, clearHighlights }
}
