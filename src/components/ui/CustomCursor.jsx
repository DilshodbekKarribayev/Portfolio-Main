import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring, motion } from 'motion/react'

const MotionDiv = motion.div

/**
 * CustomCursor — оптимизированный.
 *
 * Использует motion values напрямую вместо useState,
 * чтобы не вызывать re-render React дерева на каждое движение мыши.
 */
export default function CustomCursor({ children }) {
  const [enabled, setEnabled] = useState(false)
  const isHoveringRef = useRef(false)
  const [isHovering, setIsHovering] = useState(false)

  // Motion values — обновляются без re-render
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring для плавности внешнего кольца
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const finePointerQuery = window.matchMedia('(pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncCapability = () => {
      setEnabled(finePointerQuery.matches && !reducedMotionQuery.matches)
    }

    syncCapability()
    finePointerQuery.addEventListener('change', syncCapability)
    reducedMotionQuery.addEventListener('change', syncCapability)

    return () => {
      finePointerQuery.removeEventListener('change', syncCapability)
      reducedMotionQuery.removeEventListener('change', syncCapability)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('cursor-none-active')
      return undefined
    }

    // Обновляем motion values напрямую — 0 re-renders
    const updateMousePosition = (event) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    const handleMouseOver = (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const isClickable =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null

      if (isClickable !== isHoveringRef.current) {
        isHoveringRef.current = isClickable
        setIsHovering(isClickable)
      }
    }

    document.body.classList.add('cursor-none-active')
    window.addEventListener('mousemove', updateMousePosition, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      document.body.classList.remove('cursor-none-active')
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled) return <>{children}</>

  return (
    <>
      {/* Dot — follows mouse instantly via motion values */}
      <MotionDiv
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{ scale: isHovering ? 0 : 1 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Ring — follows with spring delay */}
      <MotionDiv
        className="pointer-events-none fixed left-0 top-0 z-[99] h-8 w-8 rounded-full border border-white mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
      />
      {children}
    </>
  )
}
