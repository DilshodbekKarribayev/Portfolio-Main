import { motion } from 'motion/react'
import { Quote } from 'lucide-react'
import { testimonials } from '../../data/siteData'
import { fadeUp, staggerContainer, fadeUpChild } from '../../lib/animations'
import { useI18n } from '../../i18n/useI18n.js'

const MotionSection = motion.section
const MotionDiv = motion.div

const initialsFromName = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

function TestimonialCard({ t }) {
  return (
    <MotionDiv
      variants={fadeUpChild}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-white/[0.02]"
    >
      <div className="absolute -right-6 -top-6 text-zinc-800/50 transition-colors duration-500 group-hover:text-zinc-700/50">
        <Quote size={80} strokeWidth={1} />
      </div>

      <p className="relative z-10 text-[1.05rem] leading-[1.7] text-zinc-300">
        "{t.quote}"
      </p>

      <div className="relative z-10 mt-10 flex items-center gap-4 border-t border-zinc-800/60 pt-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 text-xs font-bold tracking-wide text-zinc-300">
          {initialsFromName(t.name)}
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide text-zinc-100">{t.name}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.title}</p>
        </div>
      </div>
    </MotionDiv>
  )
}

function TestimonialsSection() {
  const { copy } = useI18n()

  if (!testimonials.length) return null

  return (
    <MotionSection
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="mx-auto flex w-full max-w-[1320px] flex-col justify-center px-4 py-20 md:px-7 lg:py-28"
      id="testimonials"
    >
      <MotionDiv variants={fadeUp} className="mb-14 text-center">
        <p className="section-subtitle mb-4">{copy.testimonials.subtitle}</p>
        <h2 className="section-title text-zinc-100">
          {copy.testimonials.titleMain}{' '}
          <span className="font-script gradient-text">{copy.testimonials.titleAccent}</span>
        </h2>
      </MotionDiv>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>
    </MotionSection>
  )
}

export default TestimonialsSection


