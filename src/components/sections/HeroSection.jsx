import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { Layers3, MapPin, RefreshCw } from 'lucide-react'
import { fadeUp } from '../../lib/animations'
import Particles from '../ui/Particles'
import { useI18n } from '../../i18n/useI18n.js'

const MotionSection = motion.section
const MotionH1 = motion.h1
const MotionDiv = motion.div
const RELOAD_COUNTER_KEY = 'diliable-reload-count'
let reloadCounterIncremented = false

function getStoredReloadCount() {
  try {
    const storedCount = window.localStorage.getItem(RELOAD_COUNTER_KEY)
    return Number.parseInt(storedCount || '0', 10) || 0
  } catch {
    return 0
  }
}

function getInitialReloadCount() {
  if (typeof window === 'undefined') return 0

  const currentCount = getStoredReloadCount()
  if (reloadCounterIncremented) return currentCount

  reloadCounterIncremented = true
  const nextCount = currentCount + 1

  try {
    window.localStorage.setItem(RELOAD_COUNTER_KEY, String(nextCount))
  } catch {
    return nextCount
  }

  return nextCount
}

function HeroSection() {
  const { copy } = useI18n()
  const sectionRef = useRef(null)
  const [reloadCount] = useState(getInitialReloadCount)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  return (
    <MotionSection
      ref={sectionRef}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="relative isolate min-h-screen w-full overflow-hidden"
      id="hero"
    >
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <Particles
          particleColors={['#38bdf8', '#a78bfa', '#f59e0b', '#22d3ee', '#f472b6', '#ffffff']}
          particleCount={140}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={120}
          moveParticlesOnHover={true}
          particleHoverFactor={0.6}
          alphaParticles={true}
          sizeRandomness={1.8}
          cameraDistance={18}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1320px] flex-col justify-between px-4 pb-12 pt-24 md:px-7">
        <div className="flex flex-1 flex-col items-center justify-center text-center">

          <MotionH1
            style={{ y: nameY, opacity: fadeOut }}
            className="hero-name leading-[0.84]"
          >
            DiliAble
          </MotionH1>

          <MotionDiv
            style={{ y: contentY, opacity: fadeOut }}
            className="flex flex-col items-center"
          >
            <p className="hero-owner mt-7 text-zinc-200">
              {copy.hero.owner}
            </p>
            <p
              className="hero-disciplines mt-4 text-zinc-500"
              aria-label={copy.hero.disciplinesAria}
            >
              {copy.hero.disciplines.map((item) => <span key={item}>{item}</span>)}
              {copy.hero.disciplinesLine}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/work"
                className="group inline-flex items-center justify-center rounded-full bg-zinc-100 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-950 shadow-[0_18px_45px_rgba(0,0,0,0.65)] transition hover:-translate-y-0.5 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                {copy.hero.viewWork}
                <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] text-zinc-100 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  {'->'}
                </span>
              </Link>
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/70 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-zinc-500 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                {copy.hero.getInTouch}
              </Link>
            </div>

            <div className="hero-reload-counter mt-7" aria-label={`${copy.hero.reloadCount} ${reloadCount}`}>
              <span className="hero-reload-icon" aria-hidden="true">
                <RefreshCw size={13} />
              </span>
              <span className="hero-reload-label">{copy.hero.reloadCount}</span>
              <span className="hero-reload-value">{String(reloadCount).padStart(3, '0')}</span>
            </div>
          </MotionDiv>
        </div>

        <div className="flex items-end justify-between text-[11px] uppercase tracking-wider text-zinc-400 sm:text-[13px]">
          <div>
            <MapPin size={14} className="mb-1.5 text-emerald-400" />
            <p className="font-semibold">{copy.hero.locationLine1}</p>
            <p className="text-zinc-600">{copy.hero.locationLine2}</p>
          </div>
          <div className="text-right">
            <Layers3 size={14} className="mb-1.5 ml-auto text-blue-400" />
            <p className="font-semibold">{copy.hero.roleLine1}</p>
            <p className="text-zinc-600">{copy.hero.roleLine2}</p>
          </div>
        </div>
      </div>
    </MotionSection>
  )
}

export default HeroSection


