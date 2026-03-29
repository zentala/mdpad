import type { EditorMode } from '@/types'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  editorMode: EditorMode
  onSetEditorMode: (mode: EditorMode) => void
  onToggleSidebar: () => void
  onToggleToc: () => void
  onOpenSearch: () => void
}

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
        <ToolbarButton icon="B" title="Bold (Ctrl+B)" bold />
        <ToolbarButton icon="I" title="Italic (Ctrl+I)" italic />
        <ToolbarButton icon="S" title="Strikethrough" strike />
        <ToolbarButton icon="<>" title="Inline Code (Ctrl+`)" mono />
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <ToolbarButton icon="H1" title="Heading 1 (Ctrl+1)" mono small />
        <ToolbarButton icon="H2" title="Heading 2 (Ctrl+2)" mono small />
        <ToolbarButton icon="H3" title="Heading 3 (Ctrl+3)" mono small />
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <ToolbarButton icon="—" title="Ordered List" />
        <ToolbarButton icon="•" title="Unordered List" />
        <ToolbarButton icon="☐" title="Task List (Ctrl+Shift+X)" />
        <ToolbarButton icon="❝" title="Blockquote" />
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <ToolbarButton icon="🔗" title="Insert Link (Ctrl+K)" />
        <ToolbarButton icon="▣" title="Insert Image (Ctrl+Shift+I)" />
        <ToolbarButton icon="⊞" title="Insert Table (Ctrl+T)" />
        <ToolbarButton icon="{ }" title="Code Block (Ctrl+Shift+K)" mono small />
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <ToolbarButton icon="🔍" title="Find (Ctrl+F)" onClick={onOpenSearch} />
        <ToolbarButton icon="☰" title="Toggle Sidebar (Ctrl+Shift+L)" onClick={onToggleSidebar} />
        <ToolbarButton icon="¶" title="Toggle Outline (Ctrl+Shift+T)" onClick={onToggleToc} />
      </div>

      <div className={styles.spacer} />

      <div className={styles.modeSwitch}>
        {(['preview', 'source', 'reading'] as EditorMode[]).map(mode => (
          <button
            key={mode}
            className={`${styles.modeBtn} ${editorMode === mode ? styles.modeActive : ''}`}
            onClick={() => onSetEditorMode(mode)}
          >
            {mode === 'preview' ? 'Preview' : mode === 'source' ? 'Source' : 'Read'}
          </button>
        ))}
      </div>
    </div>
  )
}

function ToolbarButton({
  icon,
  title,
  bold,
  italic,
  strike,
  mono,
  small,
  onClick,
}: {
  icon: string
  title: string
  bold?: boolean
  italic?: boolean
  strike?: boolean
  mono?: boolean
  small?: boolean
  onClick?: () => void
}) {
  const style: React.CSSProperties = {
    fontWeight: bold ? 700 : undefined,
    fontStyle: italic ? 'italic' : undefined,
    textDecoration: strike ? 'line-through' : undefined,
    fontFamily: mono ? 'var(--font-mono)' : undefined,
    fontSize: small ? '10px' : undefined,
  }

  return (
    <button className={styles.btn} title={title} style={style} onClick={onClick}>
      {icon}
    </button>
  )
}
