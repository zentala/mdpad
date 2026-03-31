/**
 * SearchBar — inline find/replace bar docked at top of content area.
 *
 * Preview/Write modes: DOM-based text search with highlight navigation.
 * Code mode: delegates to CodeMirror's built-in search (this bar won't open).
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronUp, ChevronDown, X, CaseSensitive, Replace, ReplaceAll } from 'lucide-react'
import { usePreviewSearch } from '@/hooks/usePreviewSearch'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  onClose: () => void
  editorMode: 'write' | 'code' | 'preview'
}

/**
 * Inline search bar for find-in-file and replace.
 * In preview/write mode, performs DOM-based search on the rendered content.
 */
export function SearchBar({ onClose, editorMode }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { totalMatches, currentMatch, search, nextMatch, prevMatch, clearHighlights } =
    usePreviewSearch('[class*="preview"]')

  // Focus input on mount and handle Escape
  useEffect(() => {
    inputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearHighlights()
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose, clearHighlights])

  // Run search when query or caseSensitive changes
  useEffect(() => {
    search(query, caseSensitive)
  }, [query, caseSensitive, search])

  // Cleanup highlights on unmount
  useEffect(() => {
    return () => clearHighlights()
  }, [clearHighlights])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        prevMatch()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        nextMatch()
      }
    },
    [nextMatch, prevMatch],
  )

  const handleClose = useCallback(() => {
    clearHighlights()
    onClose()
  }, [clearHighlights, onClose])

  const isPreviewLike = editorMode === 'preview' || editorMode === 'write'

  return (
    <div className={styles.searchBar}>
      <div className={styles.row}>
        {isPreviewLike && (
          <button
            className={`${styles.iconBtn} ${showReplace ? styles.iconBtnActive : ''}`}
            onClick={() => setShowReplace(v => !v)}
            title="Toggle Replace"
            disabled
          >
            <Replace size={14} />
          </button>
        )}
        <div className={styles.inputGroup}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Find in file..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`${styles.toggle} ${caseSensitive ? styles.toggleActive : ''}`}
            onClick={() => setCaseSensitive(v => !v)}
            title="Match Case"
          >
            <CaseSensitive size={14} />
          </button>
        </div>
        <span className={styles.count}>
          {query ? `${currentMatch} of ${totalMatches}` : 'No results'}
        </span>
        <button className={styles.iconBtn} onClick={prevMatch} title="Previous (Shift+Enter)">
          <ChevronUp size={14} />
        </button>
        <button className={styles.iconBtn} onClick={nextMatch} title="Next (Enter)">
          <ChevronDown size={14} />
        </button>
        <button className={styles.iconBtn} onClick={handleClose} title="Close (Esc)">
          <X size={14} />
        </button>
      </div>

      {showReplace && !isPreviewLike && (
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Replace..."
              value={replaceText}
              onChange={e => setReplaceText(e.target.value)}
            />
          </div>
          <button className={styles.iconBtn} title="Replace">
            <Replace size={14} />
          </button>
          <button className={styles.iconBtn} title="Replace All">
            <ReplaceAll size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
