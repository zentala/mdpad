/**
 * PreBlock — renders fenced code blocks with Shiki highlighting,
 * optional Mermaid diagram rendering, and copy-to-clipboard.
 */
import { useState, useContext, createContext } from 'react'
import { MermaidBlock } from './MermaidBlock'
import styles from './MarkdownPreview.module.css'

/** Context to pass Shiki highlighter and renderMermaid setting to code blocks */
export interface PreBlockCtx {
  highlight: ((code: string, lang: string) => string | null) | null
  renderMermaid: boolean
}

export const PreBlockContext = createContext<PreBlockCtx>({
  highlight: null,
  renderMermaid: true,
})

export function PreBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)
  const { highlight, renderMermaid } = useContext(PreBlockContext)
  const child = Array.isArray(children) ? children[0] : children
  const codeProps = (child as React.ReactElement)?.props as
    | { className?: string; children?: React.ReactNode }
    | undefined
  const className = codeProps?.className ?? ''
  const match = /language-(\w+)/.exec(className)
  const language = match?.[1]
  const codeText = String(codeProps?.children ?? '').replace(/\n$/, '')

  const handleCopy = () => {
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => {})
  }

  // Mermaid diagrams (only when setting enabled)
  if (language === 'mermaid' && renderMermaid) {
    return <MermaidBlock code={codeText} />
  }

  // Try Shiki highlighting
  const highlightedHtml = language && highlight ? highlight(codeText, language) : null

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language ?? 'text'}</span>
        <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      {highlightedHtml ? (
        <div className={styles.codeContent} dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      ) : (
        <pre className={styles.codeContent} {...props}>
          <code className={className}>{codeProps?.children}</code>
        </pre>
      )}
    </div>
  )
}

export function InlineCode({ children, className, ...props }: React.ComponentProps<'code'>) {
  if (className)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  return (
    <code className={styles.inlineCode} {...props}>
      {children}
    </code>
  )
}

export function CheckboxInput(props: React.ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={props.checked}
      onChange={() => {}}
    />
  )
}
