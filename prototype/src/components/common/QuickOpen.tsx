import { useState, useRef, useEffect, useMemo } from 'react'
import { FileText, Search } from 'lucide-react'
import type { FileNode } from '@/types'
import styles from './QuickOpen.module.css'

interface QuickOpenProps {
  files: FileNode[]
  onSelect: (path: string) => void
  onClose: () => void
}

export function QuickOpen({ files, onSelect, onClose }: QuickOpenProps) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allFiles = useMemo(() => flattenFiles(files), [files])

  const filtered = useMemo(() => {
    if (!query.trim()) return allFiles.slice(0, 12)
    const q = query.toLowerCase()
    return allFiles
      .filter(f => f.path.toLowerCase().includes(q) || f.name.toLowerCase().includes(q))
      .slice(0, 12)
  }, [query, allFiles])

  useEffect(() => {
    inputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      onSelect(filtered[selectedIdx].path)
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <Search size={16} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Type to search files..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.results}>
          {filtered.length === 0 && <div className={styles.empty}>No files found</div>}
          {filtered.map((file, i) => (
            <button
              key={file.path}
              className={`${styles.result} ${i === selectedIdx ? styles.selected : ''}`}
              onClick={() => {
                onSelect(file.path)
                onClose()
              }}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              <FileText size={14} className={styles.fileIcon} />
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.filePath}>{file.path}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function flattenFiles(nodes: FileNode[]): { name: string; path: string }[] {
  const result: { name: string; path: string }[] = []
  for (const node of nodes) {
    if (node.type === 'file' && (node.extension === 'md' || node.extension === 'markdown')) {
      result.push({ name: node.name, path: node.path })
    }
    if (node.children) {
      result.push(...flattenFiles(node.children))
    }
  }
  return result
}
