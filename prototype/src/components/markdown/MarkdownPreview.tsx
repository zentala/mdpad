import { useState, useMemo, useEffect, lazy, Suspense } from 'react'
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
import { preprocessMultilineBlockquotes } from '@/plugins/remarkMultilineBlockquote'
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
import { useSettingsContext } from '@/providers/SettingsProvider'
import { FrontmatterDisplay } from './FrontmatterDisplay'
import { HeadingWithAnchor } from './HeadingWithAnchor'
import { PreBlock, InlineCode, CheckboxInput, PreBlockContext } from './PreBlock'
import type { PreBlockCtx } from './PreBlock'
import { ImageLightbox } from '@/components/common/ImageLightbox'
import type { EditorRef } from '@/types'
import styles from './MarkdownPreview.module.css'

const LazyCodeEditor = lazy(() => import('./CodeEditor').then(m => ({ default: m.CodeEditor })))
const LazyVisualEditor = lazy(() =>
  import('./VisualEditor').then(m => ({ default: m.VisualEditor })),
)

interface MarkdownPreviewProps {
  markdown: string
  editorMode: 'write' | 'code' | 'preview'
  onNavigate?: (path: string) => void
  onContentChange?: (content: string) => void
}

export function MarkdownPreview({
  markdown,
  editorMode,
  onNavigate,
  onContentChange,
}: MarkdownPreviewProps) {
  const { data: frontmatter, content: rawContent } = useFrontmatter(markdown)
  const content = useMemo(() => preprocessMultilineBlockquotes(rawContent), [rawContent])
  const { resolvedTheme, editorRef } = useAppContext()
  const { settings } = useSettingsContext()
  const { highlight } = useShikiHighlighter(resolvedTheme)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  type RMProps = React.ComponentProps<typeof ReactMarkdown>

  const preBlockCtx = useMemo<PreBlockCtx>(
    () => ({ highlight, renderMermaid: settings.renderMermaid }),
    [highlight, settings.renderMermaid],
  )

  const remarkPlugins = useMemo(() => {
    const plugins: RMProps['remarkPlugins'] = [
      [remarkGfm, { singleTilde: false }],
      remarkGemoji,
      remarkAlert,
      remarkMark,
      remarkSupSub,
      remarkWikilinks,
      remarkInsert,
      remarkSpoiler,
      remarkDefinitionList,
    ]
    if (settings.renderMath) plugins.splice(2, 0, remarkMath)
    return plugins
  }, [settings.renderMath])

  const rehypePlugins = useMemo(() => {
    const plugins: RMProps['rehypePlugins'] = [
      rehypeRaw,
      rehypeSlug,
      [
        rehypeSanitize,
        {
          ...defaultSchema,
          attributes: {
            ...defaultSchema.attributes,
            '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style', 'id'],
            a: [
              ...(defaultSchema.attributes?.['a'] ?? []),
              'title',
              'dataFootnoteRef',
              'dataFootnoteBackref',
              'ariaDescribedby',
              'ariaLabel',
            ],
            section: [...(defaultSchema.attributes?.section ?? []), 'dataFootnotes'],
            li: [...(defaultSchema.attributes?.li ?? []), 'id'],
          },
          tagNames: [
            ...(defaultSchema.tagNames ?? []),
            'details',
            'summary',
            'mark',
            'sup',
            'sub',
            'ins',
            'dl',
            'dt',
            'dd',
            'section',
          ],
        },
      ],
    ]
    if (settings.renderMath) {
      plugins.push([rehypeKatex, { throwOnError: false, errorColor: '#cc0000' }])
    }
    return plugins
  }, [settings.renderMath])

  // Wire editorRef to CodeEditor when in code mode
  const codeEditorRef = (ref: EditorRef | null) => {
    if (editorRef) {
      editorRef.current = ref
    }
  }

  // Clear editorRef when leaving editor modes
  useEffect(() => {
    if (editorMode === 'preview' && editorRef) {
      editorRef.current = null
    }
  }, [editorMode, editorRef])

  if (editorMode === 'code') {
    return (
      <Suspense
        fallback={
          <div className={styles.sourceMode}>
            <pre className={styles.sourceCode}>{markdown}</pre>
          </div>
        }
      >
        <LazyCodeEditor
          ref={codeEditorRef}
          value={markdown}
          onChange={onContentChange ?? (() => {})}
          theme={resolvedTheme === 'sepia' ? 'light' : resolvedTheme}
        />
      </Suspense>
    )
  }

  // Visual WYSIWYG editor (write mode) — uses Milkdown
  if (editorMode === 'write') {
    const visualEditorRef = (ref: EditorRef | null) => {
      if (editorRef) editorRef.current = ref
    }
    return (
      <Suspense
        fallback={
          <div className={styles.preview}>
            <p style={{ color: 'var(--text-muted)' }}>Loading visual editor...</p>
          </div>
        }
      >
        <LazyVisualEditor
          ref={visualEditorRef}
          value={markdown}
          onChange={onContentChange ?? (() => {})}
          theme={resolvedTheme === 'sepia' ? 'light' : resolvedTheme}
        />
      </Suspense>
    )
  }

  const previewStyle = settings.wordWrap
    ? { wordWrap: 'break-word' as const, overflowWrap: 'break-word' as const }
    : undefined

  return (
    <PreBlockContext.Provider value={preBlockCtx}>
      <div className={styles.preview} style={previewStyle}>
        {frontmatter && <FrontmatterDisplay data={frontmatter} />}
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          remarkRehypeOptions={{ handlers: { ...defListHastHandlers } }}
          rehypePlugins={rehypePlugins}
          components={{
            h1: props => <HeadingWithAnchor level={1} {...props} />,
            h2: props => <HeadingWithAnchor level={2} {...props} />,
            h3: props => <HeadingWithAnchor level={3} {...props} />,
            h4: props => <HeadingWithAnchor level={4} {...props} />,
            h5: props => <HeadingWithAnchor level={5} {...props} />,
            h6: props => <HeadingWithAnchor level={6} {...props} />,
            pre: PreBlock,
            code: InlineCode,
            input: CheckboxInput,
            table: ({ children, ...props }) => (
              <div className={styles.tableWrapper}>
                <table {...props}>{children}</table>
              </div>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote className={styles.blockquote} {...props}>
                {children}
              </blockquote>
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
                      const el =
                        document.getElementById(id) ?? document.getElementById(`user-content-${id}`)
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
        {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      </div>
    </PreBlockContext.Provider>
  )
}
