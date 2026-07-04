import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n/useI18n.js'

/**
 * Lightbox — fullscreen просмотр изображений с навигацией.
 *
 * Props:
 *   images    — массив { src, title }
 *   index     — текущий индекс (null = закрыт)
 *   onClose   — закрыть
 *   onChange  — сменить индекс
 */

const MotionDiv = motion.div

export default function Lightbox({ images, index, onClose, onChange }) {
  const { copy } = useI18n()
  const isOpen = index !== null && index !== undefined && index >= 0

  const goNext = useCallback(() => {
    if (!isOpen) return
    onChange((index + 1) % images.length)
  }, [index, images.length, onChange, isOpen])

  const goPrev = useCallback(() => {
    if (!isOpen) return
    onChange((index - 1 + images.length) % images.length)
  }, [index, images.length, onChange, isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, goNext, goPrev])

  const currentImage = isOpen ? images[index] : null

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={currentImage?.title || copy.lightbox.imagePreview}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            aria-label={copy.lightbox.close}
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <div className="absolute left-4 top-4 z-10 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300">
            {index + 1} / {images.length}
          </div>

          {/* Prev button */}
          {images.length > 1 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
              aria-label={copy.lightbox.previous}
            >
              <ChevronLeft size={18} />
            </button>
          ) : null}

          {/* Next button */}
          {images.length > 1 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
              aria-label={copy.lightbox.next}
            >
              <ChevronRight size={18} />
            </button>
          ) : null}

          {/* Image */}
          <MotionDiv
            key={currentImage?.src}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage?.src}
              alt={currentImage?.title || ''}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              draggable={false}
            />
            {currentImage?.title ? (
              <p className="mt-3 text-center text-sm font-semibold text-zinc-400">
                {currentImage.title}
              </p>
            ) : null}
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  )
}

