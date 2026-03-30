import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeRaw from 'rehype-raw'
import 'remark-github-blockquote-alert/alert.css'
import { useFrontmatter } from '@/hooks/useFrontmatter'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import styles from './MarkdownPreview.module.css'

interface MarkdownPreviewProps {
  markdown: string
  editorMode: 'write' | 'code' | 'preview'
  onNavigate?: (path: string) => void
}

export function MarkdownPreview({ markdown, editorMode, onNavigate }: MarkdownPreviewProps) {
  const { data: frontmatter, content } = useFrontmatter(markdown)

  if (editorMode === 'code') {
    return (
      <div className={styles.sourceMode}>
        <pre className={styles.sourceCode}>{markdown}</pre>
      </div>
    )
  }

  return (
    <div className={styles.preview}>
      {frontmatter && <FrontmatterDisplay data={frontmatter} />}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkAlert]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children, ...props }) => <h1 id={slugify(children)} {...props}>{children}</h1>,
          h2: ({ children, ...props }) => <h2 id={slugify(children)} {...props}>{children}</h2>,
          h3: ({ children, ...props }) => <h3 id={slugify(children)} {...props}>{children}</h3>,
          h4: ({ children, ...props }) => <h4 id={slugify(children)} {...props}>{children}</h4>,
          pre: PreBlock,
          code: InlineCode,
          input: CheckboxInput,
          table: ({ children, ...props }) => (
            <div className={styles.tableWrapper}>
              <table {...props}>{children}</table>
            </div>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className={styles.blockquote} {...props}>{children}</blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a
              className={styles.link}
              href={href}
              onClick={e => {
                e.preventDefault()
                if (href && onNavigate && !href.startsWith('http')) {
                  onNavigate(href)
                }
              }}
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function PreBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)
  const child = Array.isArray(children) ? children[0] : children
  const codeProps = (child as React.ReactElement)?.props as { className?: string; children?: React.ReactNode } | undefined
  const className = codeProps?.className ?? ''
  const match = /language-(\w+)/.exec(className)
  const language = match?.[1]
  const codeText = String(codeProps?.children ?? '')

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language ?? 'text'}</span>
        <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre className={styles.codeContent} {...props}>
        <code className={className}>{codeProps?.children}</code>
      </pre>
    </div>
  )
}

function InlineCode({ children, className, ...props }: React.ComponentProps<'code'>) {
  if (className) return <code className={className} {...props}>{children}</code>
  return <code className={styles.inlineCode} {...props}>{children}</code>
}

function CheckboxInput(props: React.ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={props.checked}
      onChange={() => {}}
    />
  )
}

function slugify(children: React.ReactNode): string {
  const text = String(children)
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}
