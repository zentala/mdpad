/**
 * Export the current view as PDF using the browser's native print dialog.
 * Print styles in print.css handle hiding UI chrome and formatting content.
 */
export function exportPdf(): void {
  window.print()
}
