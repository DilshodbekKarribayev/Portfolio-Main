import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { fadeUp } from '../../lib/animations'
import { useI18n } from '../../i18n/useI18n.js'

const MotionSection = motion.section

function MarqueeRibbon() {
  const { copy } = useI18n()
  const words = [
    ...copy.marqueeWords,
    ...copy.marqueeWords,
    ...copy.marqueeWords,
    ...copy.marqueeWords,
  ]

  return (
    <MotionSection
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="relative mx-auto flex w-full items-center overflow-hidden py-14 lg:py-20"
    >
      <div className="w-full -rotate-2 scale-105 border-y border-zinc-800/60 bg-zinc-950/80 py-4 shadow-2xl backdrop-blur-md">
        <div className="marquee-track flex w-max">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="mx-6 flex items-center gap-6 text-[13px] font-bold uppercase tracking-[0.14em] text-zinc-400"
            >
              {word}
              <Sparkles size={14} className="text-zinc-600" />
            </span>
          ))}
        </div>
      </div>
    </MotionSection>
  )
}

export default MarqueeRibbon




