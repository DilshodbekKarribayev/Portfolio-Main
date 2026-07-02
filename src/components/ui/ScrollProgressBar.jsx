import { useScroll, useSpring, motion } from 'motion/react'

/**
 * ScrollProgressBar
 *
 * Тонкая линия сверху страницы, показывает прогресс скролла.
 * Использует spring для плавности.
 */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[200] h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400"
      aria-hidden="true"
    />
  )
}

export default ScrollProgressBar
