/**
 * Remark plugin: transforms ||text|| into <span class="spoiler">text</span>.
 *
 * Walks text nodes, splits on ||...|| patterns, and emits inline
 * HTML nodes so rehype-raw can parse the resulting spoiler spans.
 */

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
}

const SPOILER_RE = /\|\|(.+?)\|\|/g

function visitText(node: MdNode) {
  if (!node.children) return
  const next: MdNode[] = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value) {
      next.push(...splitSpoiler(child))
    } else {
      if (child.children) visitText(child)
      next.push(child)
    }
  }
  node.children = next
}

function splitSpoiler(node: MdNode): MdNode[] {
  const text = node.value ?? ''
  SPOILER_RE.lastIndex = 0
  if (!SPOILER_RE.test(text)) return [node]

  SPOILER_RE.lastIndex = 0
  const parts: MdNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = SPOILER_RE.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) })
    }
    parts.push({ type: 'html', value: `<span class="spoiler">${m[1]}</span>` })
    last = SPOILER_RE.lastIndex
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) })
  }
  return parts
}

export function remarkSpoiler() {
  return (tree: MdNode) => {
    visitText(tree)
  }
}
