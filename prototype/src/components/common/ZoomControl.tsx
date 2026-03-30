import { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import styles from './ZoomControl.module.css'

export function ZoomControl() {
  const [zoom, setZoom] = useState(100)

  const zoomIn = () => setZoom(z => Math.min(z + 10, 200))
  const zoomOut = () => setZoom(z => Math.max(z - 10, 50))
  const reset = () => setZoom(100)

  return (
    <div className={styles.zoom} style={{ '--content-zoom': `${zoom}%` } as React.CSSProperties}>
      <button className={styles.btn} onClick={zoomOut} title="Zoom Out">
        <ZoomOut size={14} strokeWidth={1.75} />
      </button>
      <button className={styles.level} onClick={reset} title="Reset to 100%">
        {zoom}%
      </button>
      <button className={styles.btn} onClick={zoomIn} title="Zoom In">
        <ZoomIn size={14} strokeWidth={1.75} />
      </button>
    </div>
  )
}
