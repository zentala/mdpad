/**
 * SettingsView — scrollable settings page with stacked sections.
 * Centered container matching markdown content width. No sidebar nav.
 * Settings persist to localStorage.
 */
import { useState, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import { useAppContext } from '@/providers/AppStateProvider'
import type { Theme } from '@/types'
import styles from './SettingsView.module.css'

/** Toggle switch — reusable settings control */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={`${styles.toggle} ${value ? styles.on : ''}`}
      onClick={() => onChange(!value)}
      type="button"
    >
      <span className={styles.toggleKnob} />
    </button>
  )
}

/** Select dropdown — reusable settings control */
function Select({ options, value, onChange }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

/** Single setting row — label + hint on left, control on right */
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

/** Extension toggle row */
function ExtensionToggle({ ext, enabled, onChange }: {
  ext: string; enabled: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className={styles.extensionRow}>
      <code className={styles.extensionName}>{ext}</code>
      <Toggle value={enabled} onChange={onChange} />
    </div>
  )
}

/** Editable list with add/remove */
function EditableList({ items, onChange }: {
  items: string[]; onChange: (items: string[]) => void
}) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = useCallback(() => {
    const trimmed = inputValue.trim()
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed])
      setInputValue('')
    }
  }, [inputValue, items, onChange])

  return (
    <div className={styles.editableList}>
      <div className={styles.tagList}>
        {items.map(item => (
          <span key={item} className={styles.tag}>
            {item}
            <span className={styles.tagRemove} onClick={() => onChange(items.filter(i => i !== item))}>
              <X size={10} />
            </span>
          </span>
        ))}
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          type="text"
          placeholder="Add pattern..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        />
        <button className={styles.addBtn} onClick={handleAdd} type="button">
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

const SETTINGS_KEY = 'mdpad-settings'

/** Load non-theme settings from localStorage, merged with defaults */
function loadSettings(): Omit<SettingsState, 'theme'> | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return JSON.parse(raw) as Omit<SettingsState, 'theme'>
  } catch { /* noop */ }
  return null
}

/** Persist non-theme settings to localStorage */
function saveSettings(settings: SettingsState) {
  try {
    const { theme: _, ...rest } = settings
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(rest))
  } catch { /* noop */ }
}

/** Settings state persisted to localStorage */
interface SettingsState {
  theme: string
  fontSize: string
  wordWrap: boolean
  foldersCollapsed: boolean
  renderMath: boolean
  renderMermaid: boolean
  extensions: Record<string, boolean>
  excludePatterns: string[]
  startupBehavior: string
  confirmBeforeClose: boolean
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'auto',
  fontSize: '16',
  wordWrap: true,
  foldersCollapsed: true,
  renderMath: true,
  renderMermaid: true,
  extensions: {
    '.md': true,
    '.markdown': true,
    '.yaml': false,
    '.yml': false,
    '.json': false,
  },
  startupBehavior: 'last-session',
  confirmBeforeClose: true,
  excludePatterns: ['node_modules', '.git', 'dist'],
}

export function SettingsView() {
  const { state, dispatch } = useAppContext()
  const [settings, setSettings] = useState<SettingsState>(() => {
    const stored = loadSettings()
    return { ...DEFAULT_SETTINGS, ...stored, theme: state.theme }
  })

  const update = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      saveSettings(next)
      return next
    })
  }, [])

  const updateExtension = useCallback((ext: string, enabled: boolean) => {
    setSettings(prev => {
      const next = { ...prev, extensions: { ...prev.extensions, [ext]: enabled } }
      saveSettings(next)
      return next
    })
  }, [])

  return (
    <div className={styles.settingsView}>
      <div className={styles.container}>
        {/* General */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>General</h2>
          <SettingRow label="Startup behavior" hint="What to show when the app opens">
            <Select
              options={[
                { label: 'Last session', value: 'last-session' },
                { label: 'Empty workspace', value: 'empty' },
                { label: 'Welcome page', value: 'welcome' },
              ]}
              value={settings.startupBehavior}
              onChange={v => update('startupBehavior', v)}
            />
          </SettingRow>
          <SettingRow label="Confirm before close" hint="Ask before closing unsaved files">
            <Toggle value={settings.confirmBeforeClose} onChange={v => update('confirmBeforeClose', v)} />
          </SettingRow>
        </section>

        {/* Appearance */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <SettingRow label="Theme" hint="Application color scheme">
            <Select
              options={[
                { label: 'Auto (system)', value: 'auto' },
                { label: 'Dark', value: 'dark' },
                { label: 'Light', value: 'light' },
                { label: 'Sepia', value: 'sepia' },
              ]}
              value={settings.theme}
              onChange={v => {
                update('theme', v)
                dispatch({ type: 'SET_THEME', theme: v as Theme })
              }}
            />
          </SettingRow>
          <SettingRow label="Font size" hint="Base font size for content">
            <Select
              options={['14', '15', '16', '17', '18'].map(s => ({ label: `${s}px`, value: s }))}
              value={settings.fontSize}
              onChange={v => update('fontSize', v)}
            />
          </SettingRow>
        </section>

        {/* Editor */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Editor</h2>
          <SettingRow label="Word wrap" hint="Wrap long lines in the editor">
            <Toggle value={settings.wordWrap} onChange={v => update('wordWrap', v)} />
          </SettingRow>
          <SettingRow label="Folders collapsed" hint="Collapse all folders by default in file tree">
            <Toggle value={settings.foldersCollapsed} onChange={v => update('foldersCollapsed', v)} />
          </SettingRow>
        </section>

        {/* Preview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Preview</h2>
          <SettingRow label="Render math" hint="Display LaTeX math expressions (KaTeX)">
            <Toggle value={settings.renderMath} onChange={v => update('renderMath', v)} />
          </SettingRow>
          <SettingRow label="Render Mermaid" hint="Render Mermaid diagrams inline">
            <Toggle value={settings.renderMermaid} onChange={v => update('renderMermaid', v)} />
          </SettingRow>
        </section>

        {/* Files */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Files</h2>
          <SettingRow label="File extensions" hint="Which file types to show in the file tree">
            <div className={styles.extensionList}>
              {Object.entries(settings.extensions).map(([ext, enabled]) => (
                <ExtensionToggle
                  key={ext}
                  ext={ext}
                  enabled={enabled}
                  onChange={v => updateExtension(ext, v)}
                />
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Exclude patterns" hint="Glob patterns to hide from file tree">
            <EditableList
              items={settings.excludePatterns}
              onChange={items => update('excludePatterns', items)}
            />
          </SettingRow>
        </section>
      </div>
    </div>
  )
}
