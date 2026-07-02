import { useEffect, useRef } from 'react'

/**
 * CursorGlow — оптимизированный.
 *
 * Убран rAF loop. Обновляем позицию напрямую в mousemove через CSS transform.
 * Плавность достигается через CSS transition (GPU-accelerated).
 * Нагрузка: 0 JS между событиями мыши.
 */

const DEFAULT_COLOR = 'rgba(56, 189, 248, 0.06)'
const GLOW_SIZE = 500

const SECTION_COLORS = {
  hero: 'rgba(56, 189, 248, 0.06)',
  skills: 'rgba(167, 139, 250, 0.06)',
  about: 'rgba(245, 158, 11, 0.06)',
  contact: 'rgba(52, 211, 153, 0.06)',
  work: 'rgba(244, 114, 182, 0.06)',
  experience: 'rgba(251, 146, 60, 0.06)',
}

export default function CursorGlow() {
  const glowRef = useRef(null)
  const currentColor = useRef(DEFAULT_COLOR)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isFinePointer || reducedMotion) return

    const glow = glowRef.current
    if (!glow) return

    glow.style.width = `${GLOW_SIZE}px`
    glow.style.height = `${GLOW_SIZE}px`
    glow.style.background = `radial-gradient(circle, ${DEFAULT_COLOR} 0%, transparent 70%)`
    glow.style.transition = 'transform 0.3s ease-out, background 0.5s ease'

    const handleMouseMove = (e) => {
      // Прямое обновление — CSS transition делает плавность
      glow.style.transform = `translate(${e.clientX - GLOW_SIZE / 2}px, ${e.clientY - GLOW_SIZE / 2}px)`

      // Определяем секцию (throttled — только если цвет реально меняется)
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el) {
        const section = el.closest('[id]')
        const sectionId = section?.id || ''
        const newColor = SECTION_COLORS[sectionId] || DEFAULT_COLOR

        if (newColor !== currentColor.current) {
          currentColor.current = newColor
          glow.style.background = `radial-gradient(circle, ${newColor} 0%, transparent 70%)`
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[1] rounded-full"
      aria-hidden="true"
    />
  )
}
