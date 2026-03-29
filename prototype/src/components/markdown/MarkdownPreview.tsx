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
          code: CodeBlock,
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

function CodeBlock({ children, className, ...props }: React.ComponentProps<'code'>) {
  const match = /language-(\w+)/.exec(className ?? '')
  const language = match?.[1]
  const isInline = !className

  if (isInline) {
    return <code className={styles.inlineCode} {...props}>{children}</code>
  }

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language ?? 'text'}</span>
        <button
          className={styles.copyBtn}
          onClick={() => navigator.clipboard.writeText(String(children))}
        >
          copy
        </button>
      </div>
      <pre className={styles.codeContent}>
        <code className={className} {...props}>{children}</code>
      </pre>
    </div>
  )
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
