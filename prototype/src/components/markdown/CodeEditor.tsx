/**
 * CodeEditor — CodeMirror 6 wrapper for raw markdown editing (Code mode).
 *
 * Lazy-loaded via React.lazy to keep Preview mode lightweight.
 * Exposes EditorRef interface for toolbar command integration.
 */
import { useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { search } from '@codemirror/search'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import type { EditorRef, EditorCommand } from '@/types'
import styles from './CodeEditor.module.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  theme: 'dark' | 'light' | 'sepia'
}

/** Maps EditorCommand to markdown syntax insertion */
function getMarkdownSyntax(cmd: EditorCommand): { wrap?: string; prefix?: string; block?: string } {
  switch (cmd) {
    case 'bold':
      return { wrap: '**' }
    case 'italic':
      return { wrap: '*' }
    case 'strikethrough':
      return { wrap: '~~' }
    case 'code':
      return { wrap: '`' }
    case 'heading1':
      return { prefix: '# ' }
    case 'heading2':
      return { prefix: '## ' }
    case 'heading3':
      return { prefix: '### ' }
    case 'bulletList':
      return { prefix: '- ' }
    case 'orderedList':
      return { prefix: '1. ' }
    case 'taskList':
      return { prefix: '- [ ] ' }
    case 'blockquote':
      return { prefix: '> ' }
    case 'codeBlock':
      return { block: '```\n\n```' }
    default:
      return {}
  }
}

export const CodeEditor = forwardRef<EditorRef, CodeEditorProps>(function CodeEditor(
  { value, onChange, theme },
  ref,
) {
  const cmRef = useRef<ReactCodeMirrorRef>(null)

  const handleChange = useCallback(
    (val: string) => {
      onChange(val)
    },
    [onChange],
  )

  const execCommand = useCallback((cmd: EditorCommand) => {
    const view = cmRef.current?.view
    if (!view) return

    if (cmd === 'undo') {
      import('@codemirror/commands').then(m => m.undo(view))
      return
    }
    if (cmd === 'redo') {
      import('@codemirror/commands').then(m => m.redo(view))
      return
    }

    const { wrap, prefix, block } = getMarkdownSyntax(cmd)
    const { from, to } = view.state.selection.main
    const selected = view.state.sliceDoc(from, to)

    if (wrap) {
      const replacement = `${wrap}${selected || 'text'}${wrap}`
      view.dispatch({
        changes: { from, to, insert: replacement },
        selection: {
          anchor: from + wrap.length,
          head: from + wrap.length + (selected.length || 4),
        },
      })
    } else if (prefix) {
      const line = view.state.doc.lineAt(from)
      view.dispatch({
        changes: { from: line.from, to: line.from, insert: prefix },
      })
    } else if (block) {
      const replacement = selected ? `\`\`\`\n${selected}\n\`\`\`` : block
      view.dispatch({
        changes: { from, to, insert: replacement },
      })
    }

    view.focus()
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => cmRef.current?.view?.state.doc.toString() ?? '',
      setContent: (md: string) => {
        const view = cmRef.current?.view
        if (view) {
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: md },
          })
        }
      },
      focus: () => cmRef.current?.view?.focus(),
      execCommand,
    }),
    [execCommand],
  )

  // Focus editor on mount
  useEffect(() => {
    const t = setTimeout(() => cmRef.current?.view?.focus(), 50)
    return () => clearTimeout(t)
  }, [])

  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    search(),
    EditorView.lineWrapping,
  ]

  const cmTheme = theme === 'dark' ? oneDark : undefined

  return (
    <div className={styles.editor}>
      <CodeMirror
        ref={cmRef}
        value={value}
        onChange={handleChange}
        extensions={extensions}
        theme={cmTheme}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          history: true,
          searchKeymap: true,
        }}
        className={styles.codemirror}
      />
    </div>
  )
})
