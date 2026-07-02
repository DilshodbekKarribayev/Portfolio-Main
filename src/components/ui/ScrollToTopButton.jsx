import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'

const MotionButton = motion.button

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible ? (
        <MotionButton
          key="scroll-to-top"
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-5 right-5 z-[115] inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/88 text-zinc-200 shadow-[0_16px_36px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-zinc-500 hover:text-white"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </MotionButton>
      ) : null}
    </AnimatePresence>
  )
}

export default ScrollToTopButton

