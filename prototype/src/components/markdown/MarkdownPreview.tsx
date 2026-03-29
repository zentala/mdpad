import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useFrontmatter } from '@/hooks/useFrontmatter'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import styles from './MarkdownPreview.module.css'

interface MarkdownPreviewProps {
  markdown: string
  editorMode: 'preview' | 'source' | 'reading'
}

export function MarkdownPreview({ markdown, editorMode }: MarkdownPreviewProps) {
  const { data: frontmatter, content } = useFrontmatter(markdown)

  if (editorMode === 'source') {
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
        remarkPlugins={[remarkGfm]}
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
                if (href) console.log('Navigate to:', href)
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
  const child = Array.isArray(children) ? children[0] : children
  const codeProps = (child as React.ReactElement)?.props as { className?: string; children?: React.ReactNode } | undefined
  const className = codeProps?.className ?? ''
  const match = /language-(\w+)/.exec(className)
  const language = match?.[1]
  const codeText = String(codeProps?.children ?? '')

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language ?? 'text'}</span>
        <button
          className={styles.copyBtn}
          onClick={() => navigator.clipboard.writeText(codeText)}
        >
          copy
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
