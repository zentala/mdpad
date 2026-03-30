/**
 * Remark plugin: transforms ==text== into <mark>text</mark>.
 *
 * Walks text nodes, splits on ==...== patterns, and emits inline
 * HTML nodes so rehype-raw can parse the resulting <mark> tags.
 */

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
}

const MARK_RE = /==(.+?)==/g

function visitText(node: MdNode) {
  if (!node.children) return
  const next: MdNode[] = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value) {
      next.push(...splitMark(child))
    } else {
      if (child.children) visitText(child)
      next.push(child)
    }
  }
  node.children = next
}

function splitMark(node: MdNode): MdNode[] {
  const text = node.value ?? ''
  MARK_RE.lastIndex = 0
  if (!MARK_RE.test(text)) return [node]

  MARK_RE.lastIndex = 0
  const parts: MdNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = MARK_RE.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) })
    }
    parts.push({ type: 'html', value: `<mark>${m[1]}</mark>` })
    last = MARK_RE.lastIndex
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) })
  }
  return parts
}

export function remarkMark() {
  return (tree: MdNode) => {
    visitText(tree)
  }
}
