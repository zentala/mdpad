import React, { useState, useRef } from 'react'
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Link,
  Image,
  Table,
  SquareCode,
  Search,
  PanelLeft,
  PanelRight,
} from 'lucide-react'
import { InsertLinkPopover } from '@/components/common/InsertLinkPopover'
import { InsertImagePopover } from '@/components/common/InsertImagePopover'
import { InsertTablePopover } from '@/components/common/InsertTablePopover'
import type { EditorCommand, EditorRef } from '@/types'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  onToggleSidebar: () => void
  onToggleToc: () => void
  onOpenSearch: () => void
  editorRef?: React.RefObject<EditorRef | null>
  editorMode: 'write' | 'code' | 'preview'
}

const S = 16
const W = 1.75

export function Toolbar({
  onToggleSidebar,
  onToggleToc,
  onOpenSearch,
  editorRef,
  editorMode,
}: ToolbarProps) {
  const run = (cmd: EditorCommand) => editorRef?.current?.execCommand(cmd)
  const isEditing = editorMode !== 'preview'

  type PopoverType = 'link' | 'image' | 'table' | null
  const [popover, setPopover] = useState<PopoverType>(null)
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null)
  const linkBtnRef = useRef<HTMLButtonElement>(null)
  const imageBtnRef = useRef<HTMLButtonElement>(null)
  const tableBtnRef = useRef<HTMLButtonElement>(null)

  const openPopover = (type: PopoverType, btnRef: React.RefObject<HTMLButtonElement | null>) => {
    if (btnRef.current) {
      setPopoverRect(btnRef.current.getBoundingClientRect())
      setPopover(type)
    }
  }

  const handleInsert = (markdown: string) => {
    const editor = editorRef?.current
    if (!editor) return
    editor.insertAtCursor(markdown)
    editor.focus()
  }

  return (
    <div className={styles.toolbar}>
      <Btn
        icon={<PanelLeft size={S} strokeWidth={W} />}
        title="Toggle Explorer (Ctrl+Shift+L)"
        onClick={onToggleSidebar}
      />

      <Sep />

      <div className={styles.group}>
        <Btn
          icon={<Undo2 size={S} strokeWidth={W} />}
          title="Undo (Ctrl+Z)"
          onClick={() => run('undo')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Redo2 size={S} strokeWidth={W} />}
          title="Redo (Ctrl+Shift+Z)"
          onClick={() => run('redo')}
          disabled={!isEditing}
        />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn
          icon={<Bold size={S} strokeWidth={W} />}
          title="Bold (Ctrl+B)"
          onClick={() => run('bold')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Italic size={S} strokeWidth={W} />}
          title="Italic (Ctrl+I)"
          onClick={() => run('italic')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Strikethrough size={S} strokeWidth={W} />}
          title="Strikethrough"
          onClick={() => run('strikethrough')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Code size={S} strokeWidth={W} />}
          title="Inline Code"
          onClick={() => run('code')}
          disabled={!isEditing}
        />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn
          icon={<Heading1 size={S} strokeWidth={W} />}
          title="Heading 1 (Ctrl+1)"
          onClick={() => run('heading1')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Heading2 size={S} strokeWidth={W} />}
          title="Heading 2 (Ctrl+2)"
          onClick={() => run('heading2')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Heading3 size={S} strokeWidth={W} />}
          title="Heading 3 (Ctrl+3)"
          onClick={() => run('heading3')}
          disabled={!isEditing}
        />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn
          icon={<ListOrdered size={S} strokeWidth={W} />}
          title="Ordered List"
          onClick={() => run('orderedList')}
          disabled={!isEditing}
        />
        <Btn
          icon={<List size={S} strokeWidth={W} />}
          title="Unordered List"
          onClick={() => run('bulletList')}
          disabled={!isEditing}
        />
        <Btn
          icon={<ListChecks size={S} strokeWidth={W} />}
          title="Task List"
          onClick={() => run('taskList')}
          disabled={!isEditing}
        />
        <Btn
          icon={<Quote size={S} strokeWidth={W} />}
          title="Blockquote"
          onClick={() => run('blockquote')}
          disabled={!isEditing}
        />
      </div>

      <Sep />

      <div className={styles.group}>
        <Btn
          ref={linkBtnRef}
          icon={<Link size={S} strokeWidth={W} />}
          title="Insert Link (Ctrl+K)"
          onClick={() => openPopover('link', linkBtnRef)}
          disabled={!isEditing}
        />
        <Btn
          ref={imageBtnRef}
          icon={<Image size={S} strokeWidth={W} />}
          title="Insert Image"
          onClick={() => openPopover('image', imageBtnRef)}
          disabled={!isEditing}
        />
        <Btn
          ref={tableBtnRef}
          icon={<Table size={S} strokeWidth={W} />}
          title="Insert Table"
          onClick={() => openPopover('table', tableBtnRef)}
          disabled={!isEditing}
        />
        <Btn
          icon={<SquareCode size={S} strokeWidth={W} />}
          title="Code Block"
          onClick={() => run('codeBlock')}
          disabled={!isEditing}
        />
      </div>

      <Sep />

      <Btn
        icon={<Search size={S} strokeWidth={W} />}
        title="Find (Ctrl+F)"
        onClick={onOpenSearch}
      />

      <div className={styles.spacer} />

      <Btn
        icon={<PanelRight size={S} strokeWidth={W} />}
        title="Toggle Outline (Ctrl+Shift+T)"
        onClick={onToggleToc}
      />
      {popover === 'link' && popoverRect && (
        <InsertLinkPopover
          anchorRect={popoverRect}
          onInsert={handleInsert}
          onClose={() => setPopover(null)}
        />
      )}
      {popover === 'image' && popoverRect && (
        <InsertImagePopover
          anchorRect={popoverRect}
          onInsert={handleInsert}
          onClose={() => setPopover(null)}
        />
      )}
      {popover === 'table' && popoverRect && (
        <InsertTablePopover
          anchorRect={popoverRect}
          onInsert={handleInsert}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  )
}

const Btn = React.forwardRef<
  HTMLButtonElement,
  { icon: React.ReactNode; title: string; onClick?: () => void; disabled?: boolean }
>(function Btn({ icon, title, onClick, disabled }, ref) {
  return (
    <button
      ref={ref}
      className={`${styles.btn} ${disabled ? styles.disabled : ''}`}
      title={disabled ? `${title} (switch to edit mode)` : title}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {icon}
    </button>
  )
})

function Sep() {
  return <div className={styles.divider} />
}
