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
        <p className={styles.author}>
          Created by{' '}
          <a href="https://zentala.io" target="_blank" rel="noopener noreferrer">
            Pawe&#322; &#379;enta&#322;a
          </a>
        </p>
        <p className={styles.description}>
          Lightweight Markdown viewer for developers. Built with Tauri v2 + React + comrak.
        </p>
        <div className={styles.links}>
          <a
            className={styles.link}
            href="https://github.com/zentala/mdpad"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/zentala/mdpad
          </a>
          <a
            className={styles.link}
            href="https://mdpad.zentala.io/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </div>
        <div className={styles.stack}>
          <span className={styles.tag}>Markdown</span>
          <span className={styles.tag}>Desktop</span>
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
