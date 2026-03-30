import { ZoomIn, ZoomOut } from 'lucide-react'
import { useAppContext } from '@/providers/AppStateProvider'
import styles from './ZoomControl.module.css'

export function ZoomControl() {
  const { state, dispatch } = useAppContext()
  const zoom = state.zoom

  const zoomIn = () => dispatch({ type: 'SET_ZOOM', zoom: zoom + 10 })
  const zoomOut = () => dispatch({ type: 'SET_ZOOM', zoom: zoom - 10 })
  const reset = () => dispatch({ type: 'SET_ZOOM', zoom: 100 })

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
