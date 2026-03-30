import { useState, useEffect } from 'react'
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

let highlighterPromise: Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> | null = null

const SUPPORTED_LANGS: BundledLanguage[] = [
  'typescript', 'javascript', 'rust', 'bash', 'json', 'css',
  'yaml', 'python', 'go', 'sql', 'html', 'markdown', 'tsx',
  'jsx', 'toml', 'xml', 'diff',
]

async function getHighlighter() {
  if (!highlighterPromise) {
    const { createHighlighter } = await import('shiki')
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: SUPPORTED_LANGS,
    })
  }
  return highlighterPromise
}

/**
 * Returns a function that highlights code with Shiki.
 * Loads highlighter lazily on first use.
 */
export function useShikiHighlighter(theme: 'dark' | 'light' | 'sepia') {
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<BundledLanguage, BundledTheme> | null>(null)

  useEffect(() => {
    getHighlighter().then(setHighlighter)
  }, [])

  const highlight = (code: string, lang: string): string | null => {
    if (!highlighter) return null
    const shikiTheme = theme === 'dark' ? 'github-dark' : 'github-light'
    const validLang = SUPPORTED_LANGS.includes(lang as BundledLanguage) ? lang : undefined
    if (!validLang) return null

    try {
      return highlighter.codeToHtml(code, { lang: validLang, theme: shikiTheme })
    } catch {
      return null
    }
  }

  return { highlight, ready: !!highlighter }
}
