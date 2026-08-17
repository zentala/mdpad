/**
 * SearchBar — inline find/replace bar docked at top of content area.
 *
 * Find: DOM-based text search with highlight navigation (preview/write modes;
 * Code mode delegates find to CodeMirror's built-in search, this bar won't open for it).
 * Replace: reads/writes the editor's content through EditorRef (write and code modes).
 * Read-only preview has no replace target, so its UI is hidden entirely.
 */
import { useState, useRef, useEffect, useCallback, type RefObject } from 'react'
import { ChevronUp, ChevronDown, X, CaseSensitive, Replace, ReplaceAll } from 'lucide-react'
import { usePreviewSearch } from '@/hooks/usePreviewSearch'
import type { EditorRef } from '@/types'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  onClose: () => void
  editorMode: 'write' | 'code' | 'preview'
  editorRef?: RefObject<EditorRef | null>
  /** Open with the replace row already expanded (menu "Find & Replace" / Ctrl+H) */
  withReplace?: boolean
}

/** Escape regex metacharacters so the raw query is matched literally */
function toSearchRegex(query: string, caseSensitive: boolean, global: boolean): RegExp {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const flags = (global ? 'g' : '') + (caseSensitive ? '' : 'i')
  return new RegExp(escaped, flags)
}

/**
 * Inline search bar for find-in-file and replace.
 * In preview/write mode, performs DOM-based search on the rendered content.
 */
export function SearchBar({ onClose, editorMode, editorRef, withReplace }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  // null = follow the `withReplace` prop; true/false = user has toggled it manually
  const [replaceOverride, setReplaceOverride] = useState<boolean | null>(null)
  const showReplace = replaceOverride ?? Boolean(withReplace)
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

  /** Replace one occurrence of `query`, or every occurrence when `all` is set */
  const runReplace = useCallback(
    (all: boolean) => {
      const editor = editorRef?.current
      if (!editor || !query) return
      const content = editor.getContent()
      const regex = toSearchRegex(query, caseSensitive, all)
      if (!regex.test(content)) return
      editor.setContent(content.replace(regex, () => replaceText))
    },
    [editorRef, query, caseSensitive, replaceText],
  )

  const handleReplace = useCallback(() => runReplace(false), [runReplace])
  const handleReplaceAll = useCallback(() => runReplace(true), [runReplace])

  // Read-only preview has no content to write back to — replace is editable-modes only
  const isEditable = editorMode !== 'preview'

  return (
    <div className={styles.searchBar}>
      <div className={styles.row}>
        {isEditable && (
          <button
            className={`${styles.iconBtn} ${showReplace ? styles.iconBtnActive : ''}`}
            onClick={() => setReplaceOverride(!showReplace)}
            title="Toggle Replace"
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

      {showReplace && isEditable && (
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
          <button
            className={styles.iconBtn}
            title="Replace"
            onClick={handleReplace}
            disabled={!query}
          >
            <Replace size={14} />
          </button>
          <button
            className={styles.iconBtn}
            title="Replace All"
            onClick={handleReplaceAll}
            disabled={!query}
          >
            <ReplaceAll size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
