/**
 * VisualEditor — Milkdown WYSIWYG editor for Visual mode.
 *
 * Lazy-loaded via React.lazy to keep Preview mode lightweight.
 * Exposes EditorRef interface for toolbar command integration.
 */
import { useEffect, useRef, useCallback, forwardRef } from 'react'
import { Editor, rootCtx, defaultValueCtx, editorViewCtx } from '@milkdown/core'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import {
  commonmark,
  toggleStrongCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  createCodeBlockCommand,
} from '@milkdown/preset-commonmark'
import { gfm, toggleStrikethroughCommand } from '@milkdown/preset-gfm'
import { history, undoCommand, redoCommand } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { callCommand } from '@milkdown/utils'
import { getMarkdown } from '@milkdown/utils'
import type { EditorRef, EditorCommand } from '@/types'
import styles from './VisualEditor.module.css'

interface VisualEditorInnerProps {
  value: string
  onChange: (md: string) => void
  onEditorReady?: (ref: EditorRef) => void
}

/** Maps EditorCommand to Milkdown command calls */
function useMilkdownCommands(editorInstance: ReturnType<typeof useEditor>['get']): EditorRef {
  const execCommand = useCallback(
    (cmd: EditorCommand) => {
      const editor = editorInstance()
      if (!editor) return

      switch (cmd) {
        case 'bold':
          editor.action(callCommand(toggleStrongCommand.key))
          break
        case 'italic':
          editor.action(callCommand(toggleEmphasisCommand.key))
          break
        case 'strikethrough':
          editor.action(callCommand(toggleStrikethroughCommand.key))
          break
        case 'code':
          editor.action(callCommand(toggleInlineCodeCommand.key))
          break
        case 'heading1':
          editor.action(callCommand(wrapInHeadingCommand.key, 1))
          break
        case 'heading2':
          editor.action(callCommand(wrapInHeadingCommand.key, 2))
          break
        case 'heading3':
          editor.action(callCommand(wrapInHeadingCommand.key, 3))
          break
        case 'bulletList':
          editor.action(callCommand(wrapInBulletListCommand.key))
          break
        case 'orderedList':
          editor.action(callCommand(wrapInOrderedListCommand.key))
          break
        case 'blockquote':
          editor.action(callCommand(wrapInBlockquoteCommand.key))
          break
        case 'codeBlock':
          editor.action(callCommand(createCodeBlockCommand.key))
          break
        case 'undo':
          editor.action(callCommand(undoCommand.key))
          break
        case 'redo':
          editor.action(callCommand(redoCommand.key))
          break
        default:
          break
      }
    },
    [editorInstance],
  )

  return {
    getContent: () => {
      const editor = editorInstance()
      if (!editor) return ''
      return editor.action(getMarkdown())
    },
    setContent: (md: string) => {
      const editor = editorInstance()
      if (!editor) return
      editor.action(ctx => {
        const view = ctx.get(editorViewCtx)
        const { tr } = view.state
        tr.replaceWith(0, view.state.doc.content.size, view.state.schema.nodeFromJSON(
          // Re-parse by destroying and recreating — simplest approach
          { type: 'doc', content: [] },
        ))
        view.dispatch(tr)
      })
      // Re-init is simpler — mode switch will re-mount anyway
    },
    insertAtCursor: (text: string) => {
      const editor = editorInstance()
      if (!editor) return
      editor.action(ctx => {
        const view = ctx.get(editorViewCtx)
        const { from } = view.state.selection
        view.dispatch(view.state.tr.insertText(text, from))
        view.focus()
      })
    },
    focus: () => {
      const editor = editorInstance()
      if (!editor) return
      editor.action(ctx => {
        const view = ctx.get(editorViewCtx)
        view.focus()
      })
    },
    execCommand,
  }
}

function VisualEditorInner({ value, onChange, onEditorReady }: VisualEditorInnerProps) {
  const editorRef = useRef(false)

  const { get, loading } = useEditor(root => {
    return Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, value)
        ctx.get(listenerCtx).markdownUpdated((_ctx, md) => {
          onChange(md)
        })
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
  })

  const commands = useMilkdownCommands(get)

  useEffect(() => {
    if (!loading && !editorRef.current) {
      editorRef.current = true
      onEditorReady?.(commands)
    }
  }, [loading, commands, onEditorReady])

  return <Milkdown />
}

interface VisualEditorProps {
  value: string
  onChange: (md: string) => void
  theme: 'dark' | 'light' | 'sepia'
}

export const VisualEditor = forwardRef<EditorRef, VisualEditorProps>(function VisualEditor(
  { value, onChange, theme },
  ref,
) {
  const editorRefCallback = useCallback(
    (editorCommands: EditorRef) => {
      if (typeof ref === 'function') {
        ref(editorCommands)
      } else if (ref) {
        ref.current = editorCommands
      }
    },
    [ref],
  )

  return (
    <div className={styles.editor} data-theme={theme}>
      <MilkdownProvider>
        <VisualEditorInner value={value} onChange={onChange} onEditorReady={editorRefCallback} />
      </MilkdownProvider>
    </div>
  )
})
