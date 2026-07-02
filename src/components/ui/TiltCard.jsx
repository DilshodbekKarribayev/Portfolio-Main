import { useRef, useCallback } from 'react'

/**
 * TiltCard — 3D tilt эффект при hover.
 *
 * Чистый DOM manipulation без React state/re-render.
 * Использует CSS transform + transition для плавности.
 * На мобильных отключён (pointer: coarse).
 */
export default function TiltCard({ children, className = '', intensity = 8, glare = true }) {
  const cardRef = useRef(null)
  const glareRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`

    if (glare && glareRef.current) {
      const percentX = (x / rect.width) * 100
      const percentY = (y / rect.height) * 100
      glareRef.current.style.opacity = '1'
      glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
    }
  }, [intensity, glare])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }, [glare])

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out',
      }}
    >
      {children}
      {glare ? (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] opacity-0 transition-opacity duration-300"
          aria-hidden="true"
        />
      ) : null}
    </div>
  )
}
