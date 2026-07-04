import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import {
  ArrowUpRight,
  CircleDot,
  Github,
  Linkedin,
  MapPin,
  Twitter,
} from 'lucide-react'
import { fadeUp } from '../../lib/animations'
import { publicAsset } from '../../lib/publicAsset'
import { socialLinks } from '../../data/siteData'
import TinyChip from '../ui/TinyChip'
import TiltCard from '../ui/TiltCard'
import { Globe } from '../ui/globe'
import DevicesMockup from '../ui/DevicesMockup'
import { useI18n } from '../../i18n/useI18n.js'
// To add your own images, place them in public/projects/ and reference them below:
const project1Phone = publicAsset('/projects/exam-morse.png')
const project2Phone = publicAsset('/projects/teacher-urdu.png')
const project3Phone = publicAsset('/projects/catelniom.png')

const MotionSection = motion.section
const MotionDiv = motion.div
const EMAIL = 'diliable004@gmail.com'

function languageUsesAmPm(locale) {
  return locale === 'en-US'
}

function ProjectPhoneScreen({ src, alt, label }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.14),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.12),transparent_45%),linear-gradient(165deg,#111827,#0a0f1a)]">
      <img src={src} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/42 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
        {label}
      </span>
    </div>
  )
}

function TopCardsSection() {
  const { copy, locale } = useI18n()
  const [copyToast, setCopyToast] = useState('')
  const [now, setNow] = useState(() => new Date())
  const runeCardRef = useRef(null)
  const runeInView = useInView(runeCardRef, { once: true, amount: 0.28 })

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!copyToast) return undefined
    const toastTimer = window.setTimeout(() => setCopyToast(''), 2200)
    return () => window.clearTimeout(toastTimer)
  }, [copyToast])

  const fallbackCopy = useCallback((value) => {
    const textArea = document.createElement('textarea')
    textArea.value = value
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const copied = document.execCommand('copy')
    document.body.removeChild(textArea)
    return copied
  }, [])

  const copyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL)
      } else {
        const copied = fallbackCopy(EMAIL)
        if (!copied) throw new Error('Clipboard is not available')
      }
      setCopyToast(copy.topCards.copySuccess)
    } catch {
      setCopyToast(copy.topCards.copyError)
    }
  }, [copy.topCards.copyError, copy.topCards.copySuccess, fallbackCopy])

  return (
    <MotionSection
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="relative mx-auto flex w-full max-w-[1320px] flex-col justify-center px-4 py-20 md:px-7 lg:py-28"
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_1.35fr_1fr]">
        <TiltCard className="glass-card flex flex-col items-center py-8 text-center" intensity={6}>
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900">
            <img
              src={publicAsset('/brand/diliable-mark.svg')}
              alt={copy.topCards.logoAlt}
              className="h-14 w-14 object-contain"
              loading="eager"
            />
          </div>
          <h2 className="text-3xl font-extrabold leading-none tracking-tight">
            DiliAble
          </h2>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{copy.topCards.role}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-zinc-600">
            {copy.topCards.locationTime} | {new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: languageUsesAmPm(locale) }).format(now)}
          </p>

          <div className="mt-6 w-full border-t border-zinc-800 pt-5">
            <div className="flex justify-center gap-4 text-zinc-500">
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="GitHub">
                <Github size={14} />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="footer-icon" aria-label="X">
                <Twitter size={14} />
              </a>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="glass-card relative overflow-hidden py-7" intensity={5}>
          <div className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_0%,transparent_50%)]" />
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.34em] text-zinc-500">{copy.topCards.detail}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">{copy.topCards.philosophy}</p>
          </div>
          <h3 className="text-[2.2rem] font-extrabold leading-[0.92] tracking-tight sm:text-[2.8rem]">{copy.topCards.interfaces}</h3>
          <p className="font-script text-[2rem] leading-[0.95] text-zinc-300 sm:text-[2.7rem]">{copy.topCards.feel}</p>
          <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-zinc-500">
            {copy.topCards.interfaceText}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {copy.topCards.chips.map((chip) => <TinyChip key={chip}>{chip}</TinyChip>)}
          </div>
          <div className="mt-4 max-w-[320px] rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4">
            <p className="text-[13px] font-semibold text-zinc-300">{copy.topCards.microTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
              {copy.topCards.microText}
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-10 -bottom-1 h-24 rounded-t-full border border-zinc-800/60 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        </TiltCard>

        <TiltCard className="glass-card relative flex flex-col py-7" intensity={6}>
          {/* Subtle inner glow */}
          <div className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_50%)]" />
          <div className="mb-5 flex items-center justify-between">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 text-zinc-500">
              <CircleDot size={12} />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] text-zinc-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {copy.topCards.available}
            </span>
          </div>
          <h3 className="text-[1.7rem] font-extrabold leading-[1] tracking-tight">
            {copy.topCards.buildLine1}
            <br />{copy.topCards.buildLine2}
          </h3>
          <p className="font-script text-[1.5rem] leading-none text-zinc-400">{copy.topCards.works}</p>

          <div className="my-4 h-px bg-zinc-800" />

          <button
            type="button"
            onClick={copyEmail}
            className="cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <p className="font-script text-[1.4rem] text-zinc-100 transition hover:text-amber-300">{EMAIL}</p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-zinc-600">{copy.topCards.tapToCopy}</p>
          </button>

          <a
            href={socialLinks.email}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-900 transition hover:bg-white hover:shadow-lg hover:shadow-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {copy.topCards.connectNow} <ArrowUpRight size={12} />
          </a>
        </TiltCard>
      </div>

      <div className="relative mt-14 grid gap-6 lg:mt-16 lg:grid-cols-2">
        <article className="glass-card relative min-h-[340px] overflow-hidden sm:min-h-[380px]">
          <div className="pointer-events-none absolute -right-1/4 -top-1/4 h-[150%] w-[150%] bg-[radial-gradient(circle_at_70%_30%,rgba(217,70,239,0.03)_0%,transparent_60%)]" />
          <div className="pointer-events-none absolute -left-1/4 -top-1/4 h-[150%] w-[150%] bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.03)_0%,transparent_60%)]" />
          <p className="text-[10px] uppercase tracking-[0.33em] text-zinc-500">{copy.topCards.availableGlobally}</p>
          <h3 className="mt-2 max-w-[260px] text-[1.6rem] font-bold leading-tight">
            {copy.topCards.adaptable}
          </h3>
          <div className="absolute inset-x-0 bottom-0 z-[1] flex justify-center">
            <Globe className="translate-y-[10%] opacity-100" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-zinc-950/85 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.18),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] border border-zinc-800/50" />
          <div className="relative z-[4] mt-3">
            <span className="inline-flex rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              {copy.topCards.asyncCollaboration}
            </span>
          </div>
          <div className="absolute right-5 bottom-5 z-[4] flex items-center gap-2 text-[13px] text-zinc-500">
            <MapPin size={14} />
            <span className="uppercase tracking-wider">{copy.topCards.remote}</span>
            <span className="font-semibold text-zinc-300">{copy.hero.locationLine2}</span>
          </div>
        </article>

        <article ref={runeCardRef} className="rune-card group glass-card relative min-h-[420px] overflow-hidden sm:min-h-[500px]">
          <div className="rune-ambient rune-ambient-a" />
          <div className="rune-ambient rune-ambient-b" />
          <div className="rune-specular" />
          <div className="rune-side-glow rune-side-glow-left" />
          <div className="rune-side-glow rune-side-glow-right" />
          <div className="rune-orbit rune-orbit-outer" />
          <div className="rune-orbit rune-orbit-inner" />

          <div className="relative mx-auto mt-6 h-[370px] w-full max-w-[560px] sm:mt-3 sm:h-[440px]">
            <div className="rune-label-row">
              <span className="rune-project-label rune-project-label-left">Exam Morse</span>
              <span className="rune-project-label rune-project-label-main">Teacher Urdu</span>
              <span className="rune-project-label rune-project-label-right">Catelnium</span>
            </div>

            <div className="rune-fan">
              <div className="rune-phone rune-phone-left">
                <MotionDiv
                  initial={{ y: 125, opacity: 0 }}
                  animate={runeInView ? { y: 0, opacity: 1 } : { y: 125, opacity: 0 }}
                  transition={{ duration: 0.78, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DevicesMockup
                    device="iphone"
                    scale={0.4}
                    color="black"
                  >
                    <ProjectPhoneScreen src={project1Phone} alt={copy.topCards.projectAlt.exammorse} label="Exam Morse" />
                  </DevicesMockup>
                </MotionDiv>
              </div>

              <div className="rune-phone rune-phone-right">
                <MotionDiv
                  initial={{ y: 125, opacity: 0 }}
                  animate={runeInView ? { y: 0, opacity: 1 } : { y: 125, opacity: 0 }}
                  transition={{ duration: 0.78, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DevicesMockup
                    device="iphone"
                    scale={0.4}
                    color="black"
                  >
                    <ProjectPhoneScreen src={project3Phone} alt={copy.topCards.projectAlt.catelnium} label="Catelnium" />
                  </DevicesMockup>
                </MotionDiv>
              </div>

              <div className="rune-phone rune-phone-main">
                <MotionDiv
                  initial={{ y: 150, opacity: 0, scale: 0.95 }}
                  animate={runeInView ? { y: 0, opacity: 1, scale: 1 } : { y: 150, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.86, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DevicesMockup
                    device="iphone"
                    scale={0.52}
                    color="black"
                  >
                    <ProjectPhoneScreen src={project2Phone} alt={copy.topCards.projectAlt.teacherurdu} label="Teacher Urdu" />
                  </DevicesMockup>
                </MotionDiv>
              </div>
            </div>
          </div>
        </article>
      </div>

      {copyToast ? <div className="toast">{copyToast}</div> : null}
    </MotionSection>
  )
}

export default TopCardsSection






