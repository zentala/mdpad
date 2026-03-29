import { useState, useRef } from 'react'
import type { FileNode } from '@/types'
import styles from './FileTree.module.css'

interface FileTreeProps {
  files: FileNode[]
  activeFilePath: string | null
  onFileSelect: (path: string) => void
}

/** Known file icons for developer markdown workflows */
const FILE_ICONS: Record<string, string> = {
  'README.md': '📖',
  'CLAUDE.md': '🤖',
  'BACKLOG.md': '📋',
  'STATE.md': '📊',
  'DONE.md': '✅',
  'PLAN.md': '🗺',
  'ORCHESTRATOR.md': '🎯',
  'JOURNAL.md': '📓',
  'IMPROVEMENTS.md': '💡',
  'ARCHITECTURE.md': '🏗',
  'HISTORY.md': '📜',
  'DDD.md': '🧩',
  'Welcome.md': '👋',
}

const FOLDER_ICONS: Record<string, string> = {
  '.plan': '📂',
  '.arch': '🏛',
  '.claude': '⚙',
  'ADR': '⚖',
  'epics': '🎬',
  'tasks': '📝',
  'reports': '📊',
  'vision': '🔭',
}

const VIEWABLE_EXTENSIONS = new Set(['md', 'markdown'])

export function FileTree({ files, activeFilePath, onFileSelect }: FileTreeProps) {
  const [creatingFile, setCreatingFile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredFiles = filterViewableFiles(files)

  const handleCreateFile = () => {
    setCreatingFile(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleCreateConfirm = (name: string) => {
    setCreatingFile(false)
    if (name.trim()) {
      const path = name.endsWith('.md') ? name : `${name}.md`
      onFileSelect(path)
    }
  }

  return (
    <div className={styles.fileTree}>
      <div className={styles.header}>
        <span className={styles.title}>Explorer</span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} title="New File" onClick={handleCreateFile}>+</button>
          <button className={styles.actionBtn} title="Collapse All">⊟</button>
          <button className={styles.actionBtn} title="Refresh">↻</button>
        </div>
      </div>
      <div className={styles.tree}>
        {creatingFile && (
          <div className={styles.createInput} style={{ paddingLeft: 8 }}>
            <span className={styles.icon}>◇</span>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="filename.md"
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreateConfirm((e.target as HTMLInputElement).value)
                if (e.key === 'Escape') setCreatingFile(false)
              }}
              onBlur={e => handleCreateConfirm(e.target.value)}
            />
          </div>
        )}
        {filteredFiles.map(node => (
          <FileTreeNode
            key={node.path}
            node={node}
            depth={0}
            activeFilePath={activeFilePath}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  )
}

function FileTreeNode({
  node,
  depth,
  activeFilePath,
  onFileSelect,
}: {
  node: FileNode
  depth: number
  activeFilePath: string | null
  onFileSelect: (path: string) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)
  const isActive = node.path === activeFilePath
  const isFolder = node.type === 'folder'
  const indent = depth * 16 + 8

  const icon = isFolder
    ? (expanded ? '▼ ' : '▶ ') + getFolderIcon(node.name)
    : getFileIcon(node.name, node.extension)

  const filteredChildren = isFolder ? filterViewableFiles(node.children ?? []) : []

  return (
    <>
      <button
        className={`${styles.node} ${isActive ? styles.active : ''}`}
        style={{ paddingLeft: indent }}
        onClick={() => {
          if (isFolder) {
            setExpanded(!expanded)
          } else {
            onFileSelect(node.path)
          }
        }}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.name}>{node.name}</span>
      </button>
      {isFolder && expanded && filteredChildren.map(child => (
        <FileTreeNode
          key={child.path}
          node={child}
          depth={depth + 1}
          activeFilePath={activeFilePath}
          onFileSelect={onFileSelect}
        />
      ))}
    </>
  )
}

function getFileIcon(name: string, ext?: string): string {
  if (FILE_ICONS[name]) return FILE_ICONS[name]
  switch (ext) {
    case 'md':
    case 'markdown': return '◇'
    default: return '◻'
  }
}

function getFolderIcon(name: string): string {
  return FOLDER_ICONS[name] ?? '📁'
}

function filterViewableFiles(files: FileNode[]): FileNode[] {
  return files.filter(f => {
    if (f.type === 'folder') {
      const children = filterViewableFiles(f.children ?? [])
      return children.length > 0
    }
    return VIEWABLE_EXTENSIONS.has(f.extension ?? '')
  }).map(f => {
    if (f.type === 'folder') {
      return { ...f, children: filterViewableFiles(f.children ?? []) }
    }
    return f
  })
}
