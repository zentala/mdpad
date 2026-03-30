/**
 * Multiline blockquote preprocessing.
 *
 * The `>>>` fence syntax cannot be handled as a remark AST plugin because
 * the markdown parser consumes leading `>` characters as nested blockquotes
 * before any remark plugin runs. Instead we preprocess the raw markdown
 * string, replacing `>>> ... >>>` fenced regions with HTML blockquote tags
 * that pass through via rehype-raw.
 */

const FENCE = '>>>'

/**
 * Replace `>>> ... >>>` fenced blocks in raw markdown with
 * `<blockquote class="multiline-blockquote">` HTML so the standard
 * markdown parser leaves them alone.
 *
 * @param md - raw markdown string
 * @returns markdown with multiline blockquote fences replaced by HTML
 */
export function preprocessMultilineBlockquotes(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inside = false

  for (const line of lines) {
    if (line.trim() === FENCE) {
      if (!inside) {
        out.push('<blockquote class="multiline-blockquote">')
        inside = true
      } else {
        out.push('</blockquote>')
        inside = false
      }
      continue
    }
    out.push(line)
  }

  // If the closing fence was missing, close gracefully
  if (inside) {
    out.push('</blockquote>')
  }

  return out.join('\n')
}
