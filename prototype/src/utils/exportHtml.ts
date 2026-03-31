/**
 * Export the current markdown preview as a standalone HTML file.
 * Captures the rendered preview DOM, wraps it with theme CSS variables,
 * and triggers a browser download.
 */
export function exportHtml(filename: string, htmlContent: string, themeStyles: string): void {
  const doc = buildHtmlDocument(filename, htmlContent, themeStyles)
  downloadFile(`${sanitizeFilename(filename)}.html`, doc, 'text/html')
}

/** Build a self-contained HTML document string with embedded styles. */
function buildHtmlDocument(title: string, body: string, themeStyles: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
${themeStyles}

body {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
}
  </style>
</head>
<body>
${body}
</body>
</html>`
}

/** Trigger a file download in the browser via a temporary anchor element. */
function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()

  // Cleanup after a short delay to ensure download starts
  setTimeout(() => {
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }, 100)
}

/** Strip characters unsafe for filenames. */
function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\.md$/i, '')
}

/** Escape HTML special characters to prevent injection. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
