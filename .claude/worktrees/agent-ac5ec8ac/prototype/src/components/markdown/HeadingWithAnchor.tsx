import { useState } from 'react'
import { Link } from 'lucide-react'
import styles from './HeadingWithAnchor.module.css'

interface HeadingWithAnchorProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children?: React.ReactNode
}

export function HeadingWithAnchor({ level, children, id, ...props }: HeadingWithAnchorProps) {
  const [copied, setCopied] = useState(false)
  const Tag = `h${level}` as const

  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!id) return
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <Tag id={id} className={styles.heading} {...props}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          className={styles.anchorLink}
          onClick={handleAnchorClick}
          aria-label={`Link to ${id}`}
        >
          {copied ? (
            <span className={styles.toast}>Copied!</span>
          ) : (
            <Link size={level <= 2 ? 18 : 14} />
          )}
        </a>
      )}
    </Tag>
  )
}
