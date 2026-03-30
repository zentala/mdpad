/**
 * ImageLightbox — full-screen overlay for previewing images from markdown content.
 * Supports close via click-outside, Escape key, and X button. Zoom in/out controls.
 */
import { useState, useEffect, useCallback } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import styles from './ImageLightbox.module.css'

interface ImageLightboxProps {
  src: string
  alt?: string
  onClose: () => void
}

const ZOOM_STEP = 0.25
const ZOOM_MIN = 0.5
const ZOOM_MAX = 3

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, handleZoomIn, handleZoomOut])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.controls} onClick={e => e.stopPropagation()}>
        <button className={styles.controlBtn} onClick={handleZoomOut} title="Zoom Out (-)">
          <ZoomOut size={18} />
        </button>
        <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
        <button className={styles.controlBtn} onClick={handleZoomIn} title="Zoom In (+)">
          <ZoomIn size={18} />
        </button>
        <button className={styles.controlBtn} onClick={onClose} title="Close (Esc)">
          <X size={18} />
        </button>
      </div>
      <div className={styles.imageContainer} onClick={e => e.stopPropagation()}>
        <img
          className={styles.image}
          src={src}
          alt={alt ?? ''}
          style={{ transform: `scale(${zoom})` }}
          draggable={false}
        />
      </div>
    </div>
  )
}
