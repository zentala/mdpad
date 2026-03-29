import { useState, useRef, useEffect } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [matchCount] = useState(0)
  const [currentMatch] = useState(0)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputGroup}>
        <span className={styles.icon}>🔍</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Find in file..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className={`${styles.toggle} ${caseSensitive ? styles.toggleActive : ''}`}
          onClick={() => setCaseSensitive(!caseSensitive)}
          title="Case Sensitive"
        >
          Aa
        </button>
        <button
          className={`${styles.toggle} ${useRegex ? styles.toggleActive : ''}`}
          onClick={() => setUseRegex(!useRegex)}
          title="Regex"
        >
          .*
        </button>
      </div>
      <div className={styles.nav}>
        <span className={styles.count}>
          {query ? `${currentMatch} of ${matchCount}` : 'No results'}
        </span>
        <button className={styles.navBtn} title="Previous (Shift+Enter)">▲</button>
        <button className={styles.navBtn} title="Next (Enter)">▼</button>
      </div>
      <button className={styles.closeBtn} onClick={onClose} title="Close (Esc)">✕</button>
    </div>
  )
}
