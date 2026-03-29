import { useState } from 'react'
import type { FileNode } from '@/types'
import styles from './FileTree.module.css'

interface FileTreeProps {
  files: FileNode[]
  activeFilePath: string | null
  onFileSelect: (path: string) => void
}

export function FileTree({ files, activeFilePath, onFileSelect }: FileTreeProps) {
  return (
    <div className={styles.fileTree}>
      <div className={styles.header}>
        <span className={styles.title}>EXPLORER</span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} title="New File">+</button>
          <button className={styles.actionBtn} title="Refresh">↻</button>
        </div>
      </div>
      <div className={styles.tree}>
        {files.map(node => (
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
  const [expanded, setExpanded] = useState(depth < 1)
  const isActive = node.path === activeFilePath
  const isFolder = node.type === 'folder'
  const indent = depth * 16 + 8

  const icon = isFolder
    ? expanded ? '▼' : '▶'
    : getFileIcon(node.extension)

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
        onContextMenu={e => e.preventDefault()}
      >
        <span className={`${styles.icon} ${isFolder ? styles.folderIcon : ''}`}>{icon}</span>
        <span className={styles.name}>{node.name}</span>
      </button>
      {isFolder && expanded && node.children?.map(child => (
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

function getFileIcon(ext?: string): string {
  switch (ext) {
    case 'md': return '◇'
    case 'yaml':
    case 'yml': return '⚙'
    case 'json': return '{ }'
    case 'ts':
    case 'tsx': return 'TS'
    case 'rs': return '🦀'
    default: return '◻'
  }
}
