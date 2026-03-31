import { useState, useRef, useMemo, useCallback } from 'react'
import type { FileNode } from '@/types'
import { useSettingsContext } from '@/providers/SettingsProvider'
import { ContextMenu, type ContextMenuItem } from '@/components/common/ContextMenu'
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
  Pencil,
  Trash2,
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
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [_renamingPath, setRenamingPath] = useState<string | null>(null)
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; node: FileNode } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
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

  const handleCreateFolder = () => {
    setCreatingFolder(true)
    setTimeout(() => folderInputRef.current?.focus(), 50)
  }

  const handleFolderConfirm = (name: string) => {
    setCreatingFolder(false)
    // In-memory only — folder shows in tree but is lost on reload
    if (name.trim()) {
      // No-op for now — mock tree is static. Shows the input UX.
    }
  }

  const handleDelete = useCallback((node: FileNode) => {
    if (window.confirm(`Delete "${node.name}"?`)) {
      // In-memory only — would need Tauri for real deletion
    }
  }, [])

  const getContextMenuItems = useCallback(
    (node: FileNode): ContextMenuItem[] => [
      {
        label: 'Rename',
        icon: <Pencil size={14} />,
        action: () => setRenamingPath(node.path),
      },
      {
        label: 'Delete',
        icon: <Trash2 size={14} />,
        action: () => handleDelete(node),
        danger: true,
      },
    ],
    [handleDelete],
  )

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
            <button className={panelActionBtn} title="New Folder" onClick={handleCreateFolder}>
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
            onContextMenu={(e, n) => {
              e.preventDefault()
              setCtxMenu({ x: e.clientX, y: e.clientY, node: n })
            }}
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
        {creatingFolder && (
          <div className={styles.createInput} style={{ paddingLeft: 8 }}>
            <Folder size={ICON_SIZE} strokeWidth={STROKE} />
            <input
              ref={folderInputRef}
              className={styles.input}
              placeholder="folder name"
              onKeyDown={e => {
                if (e.key === 'Enter') handleFolderConfirm((e.target as HTMLInputElement).value)
                if (e.key === 'Escape') setCreatingFolder(false)
              }}
              onBlur={e => handleFolderConfirm(e.target.value)}
            />
          </div>
        )}
      </div>
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          items={getContextMenuItems(ctxMenu.node)}
          onClose={() => setCtxMenu(null)}
        />
      )}
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
  onContextMenu,
}: {
  node: FileNode
  depth: number
  activeFilePath: string | null
  onFileSelect: (path: string) => void
  allowedExts: Set<string>
  foldersCollapsed: boolean
  onContextMenu?: (e: React.MouseEvent, node: FileNode) => void
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
        onContextMenu={e => onContextMenu?.(e, node)}
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
            onContextMenu={onContextMenu}
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
