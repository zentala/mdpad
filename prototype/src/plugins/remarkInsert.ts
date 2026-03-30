/**
 * Remark plugin: transforms ++text++ into <ins>text</ins>.
 *
 * Walks text nodes, splits on ++...++ patterns, and emits inline
 * HTML nodes so rehype-raw can parse the resulting <ins> tags.
 */

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
}

const INSERT_RE = /\+\+(.+?)\+\+/g

function visitText(node: MdNode) {
  if (!node.children) return
  const next: MdNode[] = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value) {
      next.push(...splitInsert(child))
    } else {
      if (child.children) visitText(child)
      next.push(child)
    }
  }
  node.children = next
}

function splitInsert(node: MdNode): MdNode[] {
  const text = node.value ?? ''
  INSERT_RE.lastIndex = 0
  if (!INSERT_RE.test(text)) return [node]

  INSERT_RE.lastIndex = 0
  const parts: MdNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = INSERT_RE.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) })
    }
    parts.push({ type: 'html', value: `<ins>${m[1]}</ins>` })
    last = INSERT_RE.lastIndex
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) })
  }
  return parts
}

export function remarkInsert() {
  return (tree: MdNode) => {
    visitText(tree)
  }
}
