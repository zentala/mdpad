import { useState, useEffect, useCallback } from 'react'
import { Bold, Italic, Strikethrough, Code, Link } from 'lucide-react'
import styles from './FloatingToolbar.module.css'

/**
 * Floating toolbar that appears when text is selected in the content area.
 * Does NOT appear for selections in sidebar, outline, or other panels.
 */
export function FloatingToolbar() {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setVisible(false)
      return
    }

    // Only show for selections inside the markdown preview content
    const anchorNode = selection.anchorNode
    const contentArea = anchorNode?.parentElement?.closest('[class*="preview"]')
    if (!contentArea) {
      setVisible(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setPosition({
      top: rect.top - 44,
      left: rect.left + rect.width / 2,
    })
    setVisible(true)
  }, [])

  useEffect(() => {
    document.addEventListener('mouseup', handleSelectionChange)
    return () => document.removeEventListener('mouseup', handleSelectionChange)
  }, [handleSelectionChange])

  if (!visible) return null

  return (
    <div
      className={styles.floating}
      style={{ top: position.top, left: position.left }}
    >
      <Btn icon={<Bold size={14} />} title="Bold (Ctrl+B)" />
      <Btn icon={<Italic size={14} />} title="Italic (Ctrl+I)" />
      <Btn icon={<Strikethrough size={14} />} title="Strikethrough" />
      <Btn icon={<Code size={14} />} title="Inline Code" />
      <div className={styles.divider} />
      <Btn icon={<Link size={14} />} title="Link (Ctrl+K)" />
    </div>
  )
}

function Btn({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <button className={styles.btn} title={title}>{icon}</button>
}
