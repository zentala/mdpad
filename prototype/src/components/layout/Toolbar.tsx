import {
  Undo2, Redo2,
  Bold, Italic, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks, Quote,
  Link, Image, Table, SquareCode,
  Search, PanelLeft, PanelRight,
} from 'lucide-react'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  onToggleSidebar: () => void
  onToggleToc: () => void
  onOpenSearch: () => void
}

const S = 16
const W = 1.75

export function Toolbar({ onToggleSidebar, onToggleToc, onOpenSearch }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {/* Left edge: toggle sidebar */}
      <Btn icon={<PanelLeft size={S} strokeWidth={W} />} title="Toggle Explorer (Ctrl+Shift+L)" onClick={onToggleSidebar} />

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Undo2 size={S} strokeWidth={W} />} title="Undo (Ctrl+Z)" />
        <Btn icon={<Redo2 size={S} strokeWidth={W} />} title="Redo (Ctrl+Shift+Z)" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Bold size={S} strokeWidth={W} />} title="Bold (Ctrl+B)" />
        <Btn icon={<Italic size={S} strokeWidth={W} />} title="Italic (Ctrl+I)" />
        <Btn icon={<Strikethrough size={S} strokeWidth={W} />} title="Strikethrough" />
        <Btn icon={<Code size={S} strokeWidth={W} />} title="Inline Code" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Heading1 size={S} strokeWidth={W} />} title="Heading 1 (Ctrl+1)" />
        <Btn icon={<Heading2 size={S} strokeWidth={W} />} title="Heading 2 (Ctrl+2)" />
        <Btn icon={<Heading3 size={S} strokeWidth={W} />} title="Heading 3 (Ctrl+3)" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<ListOrdered size={S} strokeWidth={W} />} title="Ordered List" />
        <Btn icon={<List size={S} strokeWidth={W} />} title="Unordered List" />
        <Btn icon={<ListChecks size={S} strokeWidth={W} />} title="Task List" />
        <Btn icon={<Quote size={S} strokeWidth={W} />} title="Blockquote" />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn icon={<Link size={S} strokeWidth={W} />} title="Insert Link (Ctrl+K)" />
        <Btn icon={<Image size={S} strokeWidth={W} />} title="Insert Image" />
        <Btn icon={<Table size={S} strokeWidth={W} />} title="Insert Table" />
        <Btn icon={<SquareCode size={S} strokeWidth={W} />} title="Code Block" />
      </div>

      <Sep />

      <Btn icon={<Search size={S} strokeWidth={W} />} title="Find (Ctrl+F)" onClick={onOpenSearch} />

      <div className={styles.spacer} />

      {/* Right edge: toggle outline */}
      <Btn icon={<PanelRight size={S} strokeWidth={W} />} title="Toggle Outline (Ctrl+Shift+T)" onClick={onToggleToc} />
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
