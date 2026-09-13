/**
 * Clipboard helpers shared by the editor engines (CodeMirror, Milkdown).
 *
 * The async Clipboard API only works in a secure context (https or localhost);
 * over plain http (e.g. the http://*.internal dev demo) `navigator.clipboard`
 * is undefined. These helpers report that cleanly so callers can fall back to
 * focusing the editor for a native Ctrl+V / Ctrl+X, rather than throwing.
 */

/** Read clipboard text, or `null` when the Clipboard API is unavailable or denied. */
export async function readClipboardText(): Promise<string | null> {
  if (!navigator.clipboard?.readText) return null
  try {
    return await navigator.clipboard.readText()
  } catch {
    return null
  }
}

/** Write text to the clipboard; returns `false` when unavailable or denied. */
export async function writeClipboardText(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
