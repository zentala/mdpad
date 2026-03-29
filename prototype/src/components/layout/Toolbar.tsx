import type { EditorMode } from '@/types'
import {
  Bold, Italic, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks, Quote,
  Link, Image, Table, SquareCode,
  Search, PanelLeft, PanelRight,
  Pen, FileCode, Eye,
} from 'lucide-react'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
  onToggleSidebar: () => void
  onToggleToc: () => void
  onOpenSearch: () => void
}

const ICON_SIZE = 16
const STROKE = 1.75

export function Toolbar({
  editorMode,
  onSetEditorMode,
  onToggleSidebar,
  onToggleToc,
  onOpenSearch,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <Btn icon={<Bold size={ICON_SIZE} strokeWidth={STROKE} />} title="Bold (Ctrl+B)" />
        <Btn icon={<Italic size={ICON_SIZE} strokeWidth={STROKE} />} title="Italic (Ctrl+I)" />
        <Btn icon={<Strikethrough size={ICON_SIZE} strokeWidth={STROKE} />} title="Strikethrough" />
        <Btn icon={<Code size={ICON_SIZE} strokeWidth={STROKE} />} title="Inline Code" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Heading1 size={ICON_SIZE} strokeWidth={STROKE} />} title="Heading 1 (Ctrl+1)" />
        <Btn icon={<Heading2 size={ICON_SIZE} strokeWidth={STROKE} />} title="Heading 2 (Ctrl+2)" />
        <Btn icon={<Heading3 size={ICON_SIZE} strokeWidth={STROKE} />} title="Heading 3 (Ctrl+3)" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<ListOrdered size={ICON_SIZE} strokeWidth={STROKE} />} title="Ordered List" />
        <Btn icon={<List size={ICON_SIZE} strokeWidth={STROKE} />} title="Unordered List" />
        <Btn icon={<ListChecks size={ICON_SIZE} strokeWidth={STROKE} />} title="Task List" />
        <Btn icon={<Quote size={ICON_SIZE} strokeWidth={STROKE} />} title="Blockquote" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Link size={ICON_SIZE} strokeWidth={STROKE} />} title="Insert Link (Ctrl+K)" />
        <Btn icon={<Image size={ICON_SIZE} strokeWidth={STROKE} />} title="Insert Image" />
        <Btn icon={<Table size={ICON_SIZE} strokeWidth={STROKE} />} title="Insert Table" />
        <Btn icon={<SquareCode size={ICON_SIZE} strokeWidth={STROKE} />} title="Code Block" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Search size={ICON_SIZE} strokeWidth={STROKE} />} title="Find (Ctrl+F)" onClick={onOpenSearch} />
        <Btn icon={<PanelLeft size={ICON_SIZE} strokeWidth={STROKE} />} title="Toggle Sidebar" onClick={onToggleSidebar} />
        <Btn icon={<PanelRight size={ICON_SIZE} strokeWidth={STROKE} />} title="Toggle Outline" onClick={onToggleToc} />
      </div>

      <div className={styles.spacer} />

      <div className={styles.modeSwitch}>
        <button
          className={`${styles.modeBtn} ${editorMode === 'write' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('write')}
          title="Write — edit with rendered preview (Ctrl+E)"
        >
          <Pen size={12} strokeWidth={2} />
          Write
        </button>
        <button
          className={`${styles.modeBtn} ${editorMode === 'code' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('code')}
          title="Code — raw markdown source (Ctrl+Shift+E)"
        >
          <FileCode size={12} strokeWidth={2} />
          Code
        </button>
        <div className={styles.modeDivider} />
        <button
          className={`${styles.modeBtn} ${editorMode === 'preview' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('preview')}
          title="Preview — read-only rendered view (Ctrl+Shift+P)"
        >
          <Eye size={12} strokeWidth={2} />
          Preview
        </button>
      </div>
    </div>
  )
}

function Btn({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick?: () => void }) {
  return (
    <button className={styles.btn} title={title} onClick={onClick}>
      {icon}
    </button>
  )
}

function Sep() {
  return <div className={styles.divider} />
}
