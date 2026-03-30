/**
 * SearchPanel — sidebar panel for searching across all project files.
 * Replaces FileTree when the "Search" sidebar bookmark tab is active.
 */
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Search, CaseSensitive, Regex, FileText, Replace } from 'lucide-react'
import { markdownFiles } from '@/data'
import { useAppContext } from '@/providers/AppStateProvider'
import { PanelHeader, panelActionBtn, panelActionBtnActive } from '@/components/common/PanelHeader'
import styles from './SearchPanel.module.css'

interface SearchResult {
  filePath: string
  fileName: string
  matches: { lineNumber: number; lineText: string }[]
}

/** Search all mock markdown files for lines matching a query */
function searchFiles(
  query: string,
  files: Record<string, string>,
  caseSensitive: boolean,
  useRegex: boolean,
): SearchResult[] {
  if (!query.trim()) return []

  const results: SearchResult[] = []

  for (const [filePath, content] of Object.entries(files)) {
    const lines = content.split('\n')
    const matches: { lineNumber: number; lineText: string }[] = []

    let matcher: (line: string) => boolean
    if (useRegex) {
      try {
        const re = new RegExp(query, caseSensitive ? '' : 'i')
        matcher = (line: string) => re.test(line)
      } catch {
        return []
      }
    } else {
      const q = caseSensitive ? query : query.toLowerCase()
      matcher = (line: string) => {
        const l = caseSensitive ? line : line.toLowerCase()
        return l.includes(q)
      }
    }

    for (let i = 0; i < lines.length; i++) {
      if (matcher(lines[i])) {
        matches.push({ lineNumber: i + 1, lineText: lines[i] })
      }
    }

    if (matches.length > 0) {
      const fileName = filePath.split('/').pop() ?? filePath
      results.push({ filePath, fileName, matches })
    }
  }

  return results
}

export function SearchPanel() {
  const { dispatch } = useAppContext()
  const [query, setQuery] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegexFlag, setUseRegexFlag] = useState(false)
  const [replaceMode, setReplaceMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(
    () => searchFiles(query, markdownFiles, caseSensitive, useRegexFlag),
    [query, caseSensitive, useRegexFlag],
  )

  const totalMatches = useMemo(
    () => results.reduce((sum, r) => sum + r.matches.length, 0),
    [results],
  )

  const handleResultClick = useCallback(
    (path: string) => {
      dispatch({ type: 'OPEN_FILE', path })
    },
    [dispatch],
  )

  return (
    <div className={styles.panel}>
      <PanelHeader
        icon={Search}
        title="Search"
        actions={
          <button
            className={`${panelActionBtn} ${replaceMode ? panelActionBtnActive : ''}`}
            onClick={() => setReplaceMode(v => !v)}
            title="Toggle Search and Replace"
          >
            <Replace size={14} />
          </button>
        }
      />
      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <Search size={13} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Search files..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            className={`${styles.toggle} ${caseSensitive ? styles.toggleActive : ''}`}
            onClick={() => setCaseSensitive(v => !v)}
            title="Case Sensitive"
          >
            <CaseSensitive size={14} />
          </button>
          <button
            className={`${styles.toggle} ${useRegexFlag ? styles.toggleActive : ''}`}
            onClick={() => setUseRegexFlag(v => !v)}
            title="Use Regular Expression"
          >
            <Regex size={14} />
          </button>
        </div>
        {replaceMode && (
          <div className={styles.inputGroup}>
            <Replace size={13} className={styles.searchIcon} />
            <input
              className={styles.input}
              type="text"
              placeholder="Replace with..."
            />
          </div>
        )}
      </div>

      <div className={styles.results}>
        {query && results.length === 0 && (
          <div className={styles.noResults}>No results found</div>
        )}
        {query && results.length > 0 && (
          <div className={styles.summary}>
            {totalMatches} result{totalMatches !== 1 ? 's' : ''} in {results.length} file
            {results.length !== 1 ? 's' : ''}
          </div>
        )}
        {results.map(result => (
          <div key={result.filePath} className={styles.fileGroup}>
            <button
              className={styles.fileHeader}
              onClick={() => handleResultClick(result.filePath)}
            >
              <FileText size={13} className={styles.fileIcon} />
              <span className={styles.fileName}>{result.fileName}</span>
              <span className={styles.matchCount}>{result.matches.length}</span>
            </button>
            {result.matches.map(m => (
              <button
                key={`${result.filePath}:${m.lineNumber}`}
                className={styles.matchLine}
                onClick={() => handleResultClick(result.filePath)}
              >
                <span className={styles.lineNum}>{m.lineNumber}</span>
                <span className={styles.lineText}>{m.lineText.trim()}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
