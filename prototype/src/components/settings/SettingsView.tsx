/**
 * Settings view rendered as a tab, similar to VS Code settings.
 * Categories on left, setting controls on right.
 * All controls are mock (non-functional) for prototype purposes.
 */
import { useState } from 'react'
import {
  Settings, Palette, PenTool, Eye, FolderOpen,
  X,
} from 'lucide-react'
import styles from './SettingsView.module.css'

type CategoryId = 'general' | 'appearance' | 'editor' | 'preview' | 'files'

interface Category {
  id: CategoryId
  label: string
  icon: typeof Settings
}

const CATEGORIES: Category[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'editor', label: 'Editor', icon: PenTool },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'files', label: 'Files', icon: FolderOpen },
]

/** Mock toggle component */
function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      className={`${styles.toggle} ${on ? styles.on : ''}`}
      onClick={() => setOn(v => !v)}
      type="button"
    >
      <span className={styles.toggleKnob} />
    </button>
  )
}

/** Mock select dropdown */
function Select({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? options[0])
  return (
    <select
      className={styles.select}
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

/** Mock slider */
function Slider({ min, max, defaultValue, unit = '' }: {
  min: number; max: number; defaultValue: number; unit?: string
}) {
  const [val, setVal] = useState(defaultValue)
  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        value={val}
        onChange={e => setVal(Number(e.target.value))}
      />
      <span className={styles.sliderValue}>{val}{unit}</span>
    </div>
  )
}

/** Mock multi-select with removable tags */
function MultiSelect({ tags }: { tags: string[] }) {
  const [items, setItems] = useState(tags)
  const handleRemove = (tag: string) => setItems(prev => prev.filter(t => t !== tag))
  return (
    <div className={styles.multiSelect}>
      {items.map(tag => (
        <span key={tag} className={styles.multiTag}>
          {tag}
          <span className={styles.multiTagRemove} onClick={() => handleRemove(tag)}>
            <X size={10} />
          </span>
        </span>
      ))}
    </div>
  )
}

/** Single setting row with label, hint, and control */
function SettingRow({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className={styles.settingRow}>
      <div className={styles.settingInfo}>
        <span className={styles.settingLabel}>{label}</span>
        {hint && <span className={styles.settingHint}>{hint}</span>}
      </div>
      <div className={styles.settingControl}>{children}</div>
    </div>
  )
}

function GeneralSettings() {
  return (
    <>
      <h2 className={styles.sectionTitle}>General</h2>
      <p className={styles.sectionDescription}>Core application behavior</p>
      <SettingRow label="Auto-save" hint="Automatically save files after changes">
        <Toggle defaultOn />
      </SettingRow>
      <SettingRow label="Startup behavior" hint="What to show when the app opens">
        <Select options={['Last session', 'Empty workspace', 'Welcome page']} />
      </SettingRow>
      <SettingRow label="Confirm before close" hint="Ask before closing unsaved files">
        <Toggle defaultOn />
      </SettingRow>
      <SettingRow label="Auto-update" hint="Check for updates on startup">
        <Toggle defaultOn />
      </SettingRow>
    </>
  )
}

function AppearanceSettings() {
  return (
    <>
      <h2 className={styles.sectionTitle}>Appearance</h2>
      <p className={styles.sectionDescription}>Visual theme and typography</p>
      <SettingRow label="Theme" hint="Application color scheme">
        <Select options={['Dark', 'Light', 'Sepia']} />
      </SettingRow>
      <SettingRow label="Font size" hint="Base font size for markdown content">
        <Slider min={12} max={28} defaultValue={14} unit="px" />
      </SettingRow>
      <SettingRow label="Content width" hint="Maximum width of the preview area">
        <Slider min={600} max={1200} defaultValue={800} unit="px" />
      </SettingRow>
      <SettingRow label="UI font" hint="Font used for menus and panels">
        <Select options={['DM Sans', 'Inter', 'System default']} />
      </SettingRow>
      <SettingRow label="Monospace font" hint="Font used for code blocks">
        <Select options={['JetBrains Mono', 'Cascadia Code', 'Fira Code']} />
      </SettingRow>
    </>
  )
}

function EditorSettings() {
  return (
    <>
      <h2 className={styles.sectionTitle}>Editor</h2>
      <p className={styles.sectionDescription}>Markdown editing preferences</p>
      <SettingRow label="Tab size" hint="Number of spaces per tab">
        <Select options={['2', '4']} defaultValue="2" />
      </SettingRow>
      <SettingRow label="Word wrap" hint="Wrap long lines in the editor">
        <Toggle defaultOn />
      </SettingRow>
      <SettingRow label="Spell check" hint="Highlight spelling mistakes">
        <Toggle />
      </SettingRow>
      <SettingRow label="Line numbers" hint="Show line numbers in code mode">
        <Toggle defaultOn />
      </SettingRow>
      <SettingRow label="Auto-close brackets" hint="Automatically close brackets and quotes">
        <Toggle defaultOn />
      </SettingRow>
    </>
  )
}

function PreviewSettings() {
  return (
    <>
      <h2 className={styles.sectionTitle}>Preview</h2>
      <p className={styles.sectionDescription}>Markdown rendering options</p>
      <SettingRow label="Render math" hint="Display LaTeX math expressions">
        <Toggle defaultOn />
      </SettingRow>
      <SettingRow label="Render Mermaid" hint="Render Mermaid diagrams inline">
        <Toggle defaultOn />
      </SettingRow>
      <SettingRow label="Frontmatter style" hint="How to display YAML frontmatter">
        <Select options={['Table', 'Raw YAML', 'Hidden']} />
      </SettingRow>
      <SettingRow label="Syntax highlighting" hint="Theme for code blocks">
        <Select options={['One Dark', 'GitHub Dark', 'Dracula', 'Nord']} />
      </SettingRow>
      <SettingRow label="Scroll sync" hint="Sync editor and preview scroll position">
        <Toggle defaultOn />
      </SettingRow>
    </>
  )
}

function FilesSettings() {
  return (
    <>
      <h2 className={styles.sectionTitle}>Files</h2>
      <p className={styles.sectionDescription}>File browser and handling</p>
      <SettingRow label="Show hidden files" hint="Display dotfiles in the file tree">
        <Toggle />
      </SettingRow>
      <SettingRow label="File extensions" hint="Recognized markdown file extensions">
        <MultiSelect tags={['.md', '.mdx', '.markdown', '.txt']} />
      </SettingRow>
      <SettingRow label="Exclude patterns" hint="Glob patterns to hide from file tree">
        <MultiSelect tags={['node_modules', '.git', 'dist', '.next']} />
      </SettingRow>
      <SettingRow label="Sort order" hint="How files are sorted in the tree">
        <Select options={['Name (A-Z)', 'Name (Z-A)', 'Modified', 'Type']} />
      </SettingRow>
      <SettingRow label="Watch for changes" hint="Auto-reload when files change on disk">
        <Toggle defaultOn />
      </SettingRow>
    </>
  )
}

const SECTION_MAP: Record<CategoryId, () => JSX.Element> = {
  general: GeneralSettings,
  appearance: AppearanceSettings,
  editor: EditorSettings,
  preview: PreviewSettings,
  files: FilesSettings,
}

export function SettingsView() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('general')
  const SectionComponent = SECTION_MAP[activeCategory]

  return (
    <div className={styles.settingsView}>
      <div className={styles.categories}>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              className={`${styles.categoryItem} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              <Icon size={14} strokeWidth={1.5} />
              {cat.label}
            </button>
          )
        })}
      </div>
      <div className={styles.content}>
        <SectionComponent />
      </div>
    </div>
  )
}
