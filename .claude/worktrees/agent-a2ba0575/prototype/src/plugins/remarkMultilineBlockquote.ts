/**
 * Remark plugin: transforms >>> ... >>> fenced blocks into
 * <blockquote class="multiline-blockquote">.
 *
 * Works at the raw text level before the tree is built:
 * replaces >>> fences with HTML blockquote tags.
 */

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
}

function visitNodes(node: MdNode) {
  if (!node.children) return
  const next: MdNode[] = []
  let inside = false

  for (const child of node.children) {
    if (child.type === 'paragraph' && child.children?.length === 1) {
      const text = child.children[0]
      if (text.type === 'text' && text.value?.trim() === '>>>') {
        if (!inside) {
          next.push({ type: 'html', value: '<blockquote class="multiline-blockquote">' })
          inside = true
        } else {
          next.push({ type: 'html', value: '</blockquote>' })
          inside = false
        }
        continue
      }
    }
    if (child.children) visitNodes(child)
    next.push(child)
  }

  if (inside) {
    next.push({ type: 'html', value: '</blockquote>' })
  }

  node.children = next
}

export function remarkMultilineBlockquote() {
  return (tree: MdNode) => { visitNodes(tree) }
}
