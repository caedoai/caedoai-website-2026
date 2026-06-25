import { useEffect, useRef } from 'react'
import styles from './EmbedModal.module.css'

export default function EmbedModal({ embedUrl, onClose, title }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <iframe
          src={embedUrl}
          className={styles.embedFrame}
          frameBorder="0"
          title={title || 'Embedded content'}
        />
      </div>
    </div>
  )
}
