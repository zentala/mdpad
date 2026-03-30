/**
 * Remark plugin: transforms ^text^ into <sup> and ~text~ into <sub>.
 *
 * Single ~text~ → <sub>text</sub> (subscript)
 * Double ~~text~~ is left alone (GFM strikethrough, handled by remark-gfm).
 * ^text^ → <sup>text</sup> (superscript)
 */

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
}

// Match ^text^ for superscript, or single ~text~ for subscript (not ~~)
const SUP_RE = /\^(.+?)\^/g
const SUB_RE = /(?<![~])~(?!~)(.+?)~(?!~)/g

function visitText(node: MdNode) {
  if (!node.children) return
  const next: MdNode[] = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value) {
      next.push(...splitSupSub(child))
    } else {
      if (child.children) visitText(child)
      next.push(child)
    }
  }
  node.children = next
}

function splitSupSub(node: MdNode): MdNode[] {
  let text = node.value ?? ''

  // First pass: replace ^text^ with placeholder, collect results
  const pieces: MdNode[] = []
  let combined = text
    .replace(SUP_RE, '\x00SUP:$1\x00')
    .replace(SUB_RE, '\x00SUB:$1\x00')

  if (combined === text) return [node]

  for (const part of combined.split('\x00')) {
    if (!part) continue
    if (part.startsWith('SUP:')) {
      pieces.push({ type: 'html', value: `<sup>${part.slice(4)}</sup>` })
    } else if (part.startsWith('SUB:')) {
      pieces.push({ type: 'html', value: `<sub>${part.slice(4)}</sub>` })
    } else {
      pieces.push({ type: 'text', value: part })
    }
  }
  return pieces
}

export function remarkSupSub() {
  return (tree: MdNode) => { visitText(tree) }
}
