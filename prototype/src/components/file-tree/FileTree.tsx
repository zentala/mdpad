import { useState, useRef, useMemo } from 'react'
import type { FileNode } from '@/types'
import { useSettingsContext } from '@/providers/SettingsProvider'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  BookOpen,
  ClipboardList,
  BarChart3,
  CheckCircle,
  Map,
  Target,
  BookMarked,
  Lightbulb,
  Building2,
  ScrollText,
  Bot,
  Gavel,
  Library,
  FilePlus,
  FolderPlus,
  RefreshCw,
  Files,
} from 'lucide-react'
import { PanelHeader, panelActionBtn } from '@/components/common/PanelHeader'
import styles from './FileTree.module.css'

interface FileTreeProps {
  files: FileNode[]
  activeFilePath: string | null
  onFileSelect: (path: string) => void
}

const VIEWABLE_EXTENSIONS = new Set(['md', 'markdown'])
const ICON_SIZE = 14
const STROKE = 1.5

/** Map known filenames to Lucide icons */
function getFileIcon(name: string) {
  const icons: Record<string, React.ReactNode> = {
    'README.md': <BookOpen size={ICON_SIZE} strokeWidth={STROKE} />,
    'CLAUDE.md': <Bot size={ICON_SIZE} strokeWidth={STROKE} />,
    'BACKLOG.md': <ClipboardList size={ICON_SIZE} strokeWidth={STROKE} />,
    'STATE.md': <BarChart3 size={ICON_SIZE} strokeWidth={STROKE} />,
    'DONE.md': <CheckCircle size={ICON_SIZE} strokeWidth={STROKE} />,
    'PLAN.md': <Map size={ICON_SIZE} strokeWidth={STROKE} />,
    'ORCHESTRATOR.md': <Target size={ICON_SIZE} strokeWidth={STROKE} />,
    'JOURNAL.md': <BookMarked size={ICON_SIZE} strokeWidth={STROKE} />,
    'IMPROVEMENTS.md': <Lightbulb size={ICON_SIZE} strokeWidth={STROKE} />,
    'ARCHITECTURE.md': <Building2 size={ICON_SIZE} strokeWidth={STROKE} />,
    'HISTORY.md': <ScrollText size={ICON_SIZE} strokeWidth={STROKE} />,
    'REFERENCE.md': <Library size={ICON_SIZE} strokeWidth={STROKE} />,
  }
  if (icons[name]) return icons[name]
  if (name.match(/^\d+-/)) return <Gavel size={ICON_SIZE} strokeWidth={STROKE} />
  return <FileText size={ICON_SIZE} strokeWidth={STROKE} />
}

export function FileTree({ files, activeFilePath, onFileSelect }: FileTreeProps) {
  const [creatingFile, setCreatingFile] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { settings } = useSettingsContext()

  /** Build set of enabled extensions from settings (e.g. '.md' -> 'md') */
  const allowedExts = useMemo(() => {
    const enabled = Object.entries(settings.extensions)
      .filter(([, v]) => v)
      .map(([ext]) => ext.replace(/^\./, ''))
    return enabled.length > 0 ? new Set(enabled) : VIEWABLE_EXTENSIONS
  }, [settings.extensions])

  const filteredFiles = useMemo(() => filterViewableFiles(files, allowedExts), [files, allowedExts])

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
      <PanelHeader
        icon={Files}
        title="Explorer"
        actions={
          <>
            <button className={panelActionBtn} title="New File" onClick={handleCreateFile}>
              <FilePlus size={14} strokeWidth={1.5} />
            </button>
            <button className={panelActionBtn} title="New Folder">
              <FolderPlus size={14} strokeWidth={1.5} />
            </button>
            <button className={panelActionBtn} title="Refresh">
              <RefreshCw size={13} strokeWidth={1.5} />
            </button>
          </>
        }
      />
      <div className={styles.tree}>
        {filteredFiles.map(node => (
          <FileTreeNode
            key={node.path}
            node={node}
            depth={0}
            activeFilePath={activeFilePath}
            onFileSelect={onFileSelect}
            allowedExts={allowedExts}
            foldersCollapsed={settings.foldersCollapsed}
          />
        ))}
        {creatingFile && (
          <div className={styles.createInput} style={{ paddingLeft: 8 }}>
            <FileText size={ICON_SIZE} strokeWidth={STROKE} />
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
      </div>
    </div>
  )
}

function FileTreeNode({
  node,
  depth,
  activeFilePath,
  onFileSelect,
  allowedExts,
  foldersCollapsed,
}: {
  node: FileNode
  depth: number
  activeFilePath: string | null
  onFileSelect: (path: string) => void
  allowedExts: Set<string>
  foldersCollapsed: boolean
}) {
  const [expanded, setExpanded] = useState(!foldersCollapsed)
  const isActive = node.path === activeFilePath
  const isFolder = node.type === 'folder'
  const indent = depth * 16 + 8
  const filteredChildren = isFolder ? filterViewableFiles(node.children ?? [], allowedExts) : []

  return (
    <>
      <button
        className={`${styles.node} ${isActive ? styles.active : ''}`}
        style={{ paddingLeft: indent }}
        onClick={() => {
          if (isFolder) setExpanded(!expanded)
          else onFileSelect(node.path)
        }}
      >
        {isFolder ? (
          <span className={styles.folderIcon}>
            {expanded ? (
              <>
                <ChevronDown size={10} />
                <FolderOpen size={ICON_SIZE} strokeWidth={STROKE} />
              </>
            ) : (
              <>
                <ChevronRight size={10} />
                <Folder size={ICON_SIZE} strokeWidth={STROKE} />
              </>
            )}
          </span>
        ) : (
          <span className={styles.icon}>{getFileIcon(node.name)}</span>
        )}
        <span className={styles.name}>{node.name}</span>
      </button>
      {isFolder &&
        expanded &&
        filteredChildren.map(child => (
          <FileTreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            activeFilePath={activeFilePath}
            onFileSelect={onFileSelect}
            allowedExts={allowedExts}
            foldersCollapsed={foldersCollapsed}
          />
        ))}
    </>
  )
}

function filterViewableFiles(
  files: FileNode[],
  allowedExts: Set<string> = VIEWABLE_EXTENSIONS,
): FileNode[] {
  return files
    .filter(f => {
      if (f.type === 'folder') return filterViewableFiles(f.children ?? [], allowedExts).length > 0
      return allowedExts.has(f.extension ?? '')
    })
    .map(f => {
      if (f.type === 'folder') {
        return { ...f, children: filterViewableFiles(f.children ?? [], allowedExts) }
      }
      return f
    })
}
