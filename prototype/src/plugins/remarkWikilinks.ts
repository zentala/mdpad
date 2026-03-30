/**
 * Remark plugin: transforms [[page]] and [[label|page]] into wiki-links.
 *
 * Walks text nodes, splits on [[...]] patterns, and emits inline
 * HTML anchor nodes so rehype-raw can parse the resulting <a> tags.
 */

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
}

const WIKI_RE = /\[\[([^\]]+?)\]\]/g

/** Prefix used in wiki-link hrefs — shared with MarkdownPreview link handler */
export const WIKILINK_PREFIX = '#wikilink-'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function visitText(node: MdNode) {
  if (!node.children) return
  const next: MdNode[] = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value) {
      next.push(...splitWikilinks(child))
    } else {
      if (child.children) visitText(child)
      next.push(child)
    }
  }
  node.children = next
}

function splitWikilinks(node: MdNode): MdNode[] {
  const text = node.value ?? ''
  WIKI_RE.lastIndex = 0
  if (!WIKI_RE.test(text)) return [node]

  WIKI_RE.lastIndex = 0
  const parts: MdNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = WIKI_RE.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) })
    const inner = m[1]
    const pipeIdx = inner.indexOf('|')
    const page = pipeIdx >= 0 ? inner.slice(pipeIdx + 1).trim() : inner.trim()
    const label = pipeIdx >= 0 ? inner.slice(0, pipeIdx).trim() : page
    const href = `${WIKILINK_PREFIX}${page.replace(/\s+/g, '-').toLowerCase()}`
    const title = `Wiki-link: ${esc(page)}.md (navigation requires Tauri backend)`
    parts.push({
      type: 'html',
      value: `<a href="${esc(href)}" class="wikilink" title="${title}">${esc(label)}</a>`,
    })
    last = WIKI_RE.lastIndex
  }

  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

export function remarkWikilinks() {
  return (tree: MdNode) => {
    visitText(tree)
  }
}
