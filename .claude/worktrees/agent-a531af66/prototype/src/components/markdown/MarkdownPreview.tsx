import { useState, createContext, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkGemoji from 'remark-gemoji'
import remarkMath from 'remark-math'
import { remarkMark } from '@/plugins/remarkMark'
import { remarkSupSub } from '@/plugins/remarkSupSub'
import { remarkWikilinks, WIKILINK_PREFIX } from '@/plugins/remarkWikilinks'
import { remarkInsert } from '@/plugins/remarkInsert'
import { remarkSpoiler } from '@/plugins/remarkSpoiler'
import { remarkMultilineBlockquote } from '@/plugins/remarkMultilineBlockquote'
import { defListHastHandlers, remarkDefinitionList } from 'remark-definition-list'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import rehypeSlug from 'rehype-slug'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import 'remark-github-blockquote-alert/alert.css'
import { useFrontmatter } from '@/hooks/useFrontmatter'
import { useShikiHighlighter } from '@/hooks/useShikiHighlighter'
import { useAppContext } from '@/providers/AppStateProvider'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import { MermaidBlock } from './MermaidBlock'
import { HeadingWithAnchor } from './HeadingWithAnchor'
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
  const { resolvedTheme } = useAppContext()
  const { highlight } = useShikiHighlighter(resolvedTheme)
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
          remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkGemoji, remarkMath, remarkAlert, remarkMark, remarkSupSub, remarkWikilinks, remarkInsert, remarkSpoiler, remarkMultilineBlockquote, remarkDefinitionList]}
          remarkRehypeOptions={{ handlers: { ...defListHastHandlers } }}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeSanitize, {
            ...defaultSchema,
            attributes: {
              ...defaultSchema.attributes,
              '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style', 'id'],
              a: [
                ...(defaultSchema.attributes?.['a'] ?? []),
                'title', 'dataFootnoteRef', 'dataFootnoteBackref',
                'ariaDescribedby', 'ariaLabel',
              ],
              section: [...(defaultSchema.attributes?.section ?? []), 'dataFootnotes'],
              li: [...(defaultSchema.attributes?.li ?? []), 'id'],
            },
            tagNames: [...(defaultSchema.tagNames ?? []), 'details', 'summary', 'mark', 'sup', 'sub', 'ins', 'dl', 'dt', 'dd', 'section'],
          }], [rehypeKatex, { throwOnError: false, errorColor: '#cc0000' }]]}
          components={{
            h1: (props) => <HeadingWithAnchor level={1} {...props} />,
            h2: (props) => <HeadingWithAnchor level={2} {...props} />,
            h3: (props) => <HeadingWithAnchor level={3} {...props} />,
            h4: (props) => <HeadingWithAnchor level={4} {...props} />,
            h5: (props) => <HeadingWithAnchor level={5} {...props} />,
            h6: (props) => <HeadingWithAnchor level={6} {...props} />,
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
            a: ({ children, href, ...props }) => {
              const isWikilink = href?.startsWith(WIKILINK_PREFIX)
              const isExternal = href?.startsWith('http')
              const isAnchor = href?.startsWith('#') && !isWikilink
              return (
                <a
                  className={isWikilink ? styles.wikilink : styles.link}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={e => {
                    if (isExternal) return
                    e.preventDefault()
                    if (isWikilink) {
                      const page = href!.replace(WIKILINK_PREFIX, '')
                      onNavigate?.(page)
                    } else if (isAnchor) {
                      const id = href!.slice(1)
                      const el = document.getElementById(id)
                        ?? document.getElementById(`user-content-${id}`)
                      el?.scrollIntoView({ behavior: 'smooth' })
                    } else if (href && onNavigate) {
                      onNavigate(href)
                    }
                  }}
                  {...props}
                >
                  {children}
                </a>
              )
            },
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
    }).catch(() => {})
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
