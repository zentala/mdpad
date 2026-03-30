import { useState, useEffect, useId } from 'react'
import { useAppContext } from '@/providers/AppStateProvider'
import styles from './MermaidBlock.module.css'

interface MermaidBlockProps {
  code: string
}

let mermaidModule: typeof import('mermaid') | null = null
let currentTheme = ''

export function MermaidBlock({ code }: MermaidBlockProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { resolvedTheme } = useAppContext()
  const id = useId().replace(/:/g, '_')

  const mermaidTheme = resolvedTheme === 'dark' ? 'dark' : 'default'

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        if (!mermaidModule) {
          mermaidModule = await import('mermaid')
        }

        if (currentTheme !== mermaidTheme) {
          mermaidModule.default.initialize({
            startOnLoad: false,
            theme: mermaidTheme,
            securityLevel: 'loose',
          })
          currentTheme = mermaidTheme
        }

        const { svg: rendered } = await mermaidModule.default.render(`mermaid${id}`, code.trim())
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Invalid diagram')
          setSvg(null)
          setLoading(false)
        }
      }
    }

    setLoading(true)
    render()
    return () => {
      cancelled = true
    }
  }, [code, id, mermaidTheme])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading diagram...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorLabel}>Mermaid Error</span>
          <pre className={styles.errorText}>{error}</pre>
        </div>
      </div>
    )
  }

  if (!svg) return null

  return (
    <div className={styles.container}>
      <div className={styles.diagram} dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}
