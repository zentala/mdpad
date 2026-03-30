import { Modal } from './Modal'
import { Logo } from './Logo'
import styles from './AboutModal.module.css'

interface AboutModalProps {
  onClose: () => void
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <Modal title="About mdpad" onClose={onClose}>
      <div className={styles.about}>
        <Logo size={48} className={styles.logo} />
        <h3 className={styles.name}>mdpad</h3>
        <p className={styles.version}>Version 0.1.0 (prototype)</p>
        <p className={styles.description}>
          Lightweight Markdown viewer for developers. Built with Tauri v2 + React + comrak.
        </p>
        <div className={styles.links}>
          <span className={styles.link}>github.com/zentala/mdpad</span>
          <span className={styles.link}>MIT License</span>
        </div>
        <div className={styles.stack}>
          <span className={styles.tag}>Tauri v2</span>
          <span className={styles.tag}>React</span>
          <span className={styles.tag}>TypeScript</span>
          <span className={styles.tag}>comrak</span>
          <span className={styles.tag}>Lucide</span>
        </div>
      </div>
    </Modal>
  )
}
