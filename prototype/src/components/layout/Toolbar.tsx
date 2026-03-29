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
        <ToolbarBtn icon="𝐁" title="Bold (Ctrl+B)" />
        <ToolbarBtn icon="𝐼" title="Italic (Ctrl+I)" />
        <ToolbarBtn icon="S̶" title="Strikethrough" />
        <ToolbarBtn icon="⟨⟩" title="Inline Code (Ctrl+`)" />
      </div>

      <Sep />

      <div className={styles.group}>
        <ToolbarBtn icon="H₁" title="Heading 1 (Ctrl+1)" />
        <ToolbarBtn icon="H₂" title="Heading 2 (Ctrl+2)" />
        <ToolbarBtn icon="H₃" title="Heading 3 (Ctrl+3)" />
      </div>

      <Sep />

      <div className={styles.group}>
        <ToolbarBtn icon="☰" title="Ordered List" />
        <ToolbarBtn icon="•" title="Unordered List" />
        <ToolbarBtn icon="☐" title="Task List (Ctrl+Shift+X)" />
        <ToolbarBtn icon="❝" title="Blockquote" />
      </div>

      <Sep />

      <div className={styles.group}>
        <ToolbarBtn icon="🔗" title="Insert Link (Ctrl+K)" />
        <ToolbarBtn icon="▣" title="Insert Image" />
        <ToolbarBtn icon="⊞" title="Insert Table (Ctrl+T)" />
        <ToolbarBtn icon="⌥" title="Code Block (Ctrl+Shift+K)" />
      </div>

      <Sep />

      <div className={styles.group}>
        <ToolbarBtn icon="⌕" title="Find (Ctrl+F)" onClick={onOpenSearch} />
        <ToolbarBtn icon="◧" title="Toggle Sidebar" onClick={onToggleSidebar} />
        <ToolbarBtn icon="¶" title="Toggle Outline" onClick={onToggleToc} />
      </div>

      <div className={styles.spacer} />

      <div className={styles.modeSwitch}>
        <button
          className={`${styles.modeBtn} ${editorMode === 'visual' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('visual')}
          title="Visual Editor — rendered markdown with inline editing"
        >
          <span className={styles.modeIcon}>◉</span>
          Visual
        </button>
        <button
          className={`${styles.modeBtn} ${editorMode === 'code' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('code')}
          title="Code Editor — raw markdown source"
        >
          <span className={styles.modeIcon}>⟨/⟩</span>
          Code
        </button>
        <button
          className={`${styles.modeBtn} ${editorMode === 'read' ? styles.modeActive : ''}`}
          onClick={() => onSetEditorMode('read')}
          title="Read — read-only rendered view"
        >
          <span className={styles.modeIcon}>◎</span>
          Read
        </button>
      </div>
    </div>
  )
}

function ToolbarBtn({ icon, title, onClick }: { icon: string; title: string; onClick?: () => void }) {
  return (
    <button className={styles.btn} title={title} onClick={onClick}>
      {icon}
    </button>
  )
}

function Sep() {
  return <div className={styles.divider} />
}
