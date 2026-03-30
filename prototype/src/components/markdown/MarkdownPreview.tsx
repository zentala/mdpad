import { useState, createContext, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import 'remark-github-blockquote-alert/alert.css'
import { useFrontmatter } from '@/hooks/useFrontmatter'
import { useShikiHighlighter } from '@/hooks/useShikiHighlighter'
import { useAppContext } from '@/providers/AppStateProvider'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import { MermaidBlock } from './MermaidBlock'
import { ImageLightbox } from '@/components/common/ImageLightbox'
import styles from './MarkdownPreview.module.css'

interface MarkdownPreviewProps {
  markdown: string
  editorMode: 'write' | 'code' | 'preview'
  onNavigate?: (path: string) => void
}

/** Context to pass Shiki highlighter to code blocks */
const HighlightCtx = createContext<((code: string, lang: string) => string | null) | null>(null)

export function MarkdownPreview({ markdown, editorMode, onNavigate }: MarkdownPreviewProps) {
  const { data: frontmatter, content } = useFrontmatter(markdown)
  const { state } = useAppContext()
  const { highlight } = useShikiHighlighter(state.theme)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  if (editorMode === 'code') {
    return (
      <div className={styles.sourceMode}>
        <pre className={styles.sourceCode}>{markdown}</pre>
      </div>
    )
  }

  return (
    <HighlightCtx.Provider value={highlight}>
      <div className={styles.preview}>
        {frontmatter && <FrontmatterDisplay data={frontmatter} />}
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkAlert]}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, {
            ...defaultSchema,
            attributes: { ...defaultSchema.attributes, '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style'] },
            tagNames: [...(defaultSchema.tagNames ?? []), 'details', 'summary'],
          }]]}
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
            img: ({ src, alt, ...props }) => (
              <img
                className={styles.clickableImage}
                src={src}
                alt={alt ?? ''}
                onClick={() => src && setLightboxSrc(src)}
                {...props}
              />
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
        {lightboxSrc && (
          <ImageLightbox
            src={lightboxSrc}
            onClose={() => setLightboxSrc(null)}
          />
        )}
      </div>
    </HighlightCtx.Provider>
  )
}

function PreBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)
  const highlight = useContext(HighlightCtx)
  const child = Array.isArray(children) ? children[0] : children
  const codeProps = (child as React.ReactElement)?.props as { className?: string; children?: React.ReactNode } | undefined
  const className = codeProps?.className ?? ''
  const match = /language-(\w+)/.exec(className)
  const language = match?.[1]
  const codeText = String(codeProps?.children ?? '').replace(/\n$/, '')

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Mermaid diagrams
  if (language === 'mermaid') {
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
        <div
          className={styles.codeContent}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className={styles.codeContent} {...props}>
          <code className={className}>{codeProps?.children}</code>
        </pre>
      )}
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
