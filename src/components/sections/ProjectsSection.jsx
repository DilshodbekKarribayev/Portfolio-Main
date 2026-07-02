import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Clapperboard, Monitor, Star } from 'lucide-react'
import { projects } from '../../data/siteData'
import TinyChip from '../ui/TinyChip'
import DevicesMockup from '../ui/DevicesMockup'

const colorAccents = {
  red: { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.22)', soft: 'rgba(239, 68, 68, 0.06)' },
  orange: { main: '#f97316', glow: 'rgba(249, 115, 22, 0.22)', soft: 'rgba(249, 115, 22, 0.06)' },
  blue: { main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.22)', soft: 'rgba(59, 130, 246, 0.06)' },
}

const DEVICE_LABELS = [
  { icon: Monitor, label: 'Desktop' },
]

const PROJECT_PROGRESS_STEPS = [
  { key: 'desktop', threshold: 1, label: 'Desktop view' },
]

const PIN_SCROLL_LENGTH_DESKTOP = '+=220%'
const PIN_SCROLL_LENGTH_MOBILE = '+=170%'

function getProjectProgressStep(progress) {
  return PROJECT_PROGRESS_STEPS.find((step) => progress < step.threshold)
    ?? PROJECT_PROGRESS_STEPS[PROJECT_PROGRESS_STEPS.length - 1]
}

function syncProjectProgress(progressRail, progress) {
  if (!progressRail) return

  const clampedProgress = Math.max(0, Math.min(progress, 1))
  const progressValue = progressRail.querySelector('[data-pj-progress-value]')
  const progressStep = progressRail.querySelector('[data-pj-progress-step]')
  const activeStep = getProjectProgressStep(clampedProgress)

  progressRail.style.setProperty('--pj-progress', clampedProgress.toFixed(3))
  progressRail.dataset.step = activeStep?.key ?? 'desktop'

  if (progressValue) {
    progressValue.textContent = `${Math.round(clampedProgress * 100)}%`
  }

  if (progressStep) {
    progressStep.textContent = activeStep?.label ?? 'Desktop view'
  }
}

function DevicePlaceholder({ title, label }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.12),transparent_45%),linear-gradient(160deg,#111827,#090d14)] text-center">
      <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
        {label}
      </span>
      <span className="mt-2 max-w-[85%] text-xs font-semibold text-zinc-300">
        {title}
      </span>
    </div>
  )
}

function DeviceFrameContent({ src, title, label }) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${title} ${label}`}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    )
  }

  return <DevicePlaceholder title={title} label={label} />
}

function ProjectIcon({ project }) {
  if (project.icon === 'clapperboard') {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-900/80 text-amber-300">
        <Clapperboard size={18} />
      </span>
    )
  }

  return <span>{project.emoji}</span>
}

function ProjectsSection() {
  const rootRef = useRef(null)
  const stageRefs = useRef([])
  const deviceRefs = useRef([])
  const indicatorRefs = useRef([])

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) return

      const buildTimeline = (stage, refs, indicators, pinScene) => {
        const mac = refs.mac
        const infoPanel = refs.infoPanel
        const glowOrb = refs.glowOrb
        const progressRail = refs.progressRail

        if (!mac) return

        gsap.set(mac, { autoAlpha: 0, scale: 0.88, y: 42, rotateY: -8 })

        if (glowOrb) gsap.set(glowOrb, { autoAlpha: 0, scale: 0.6 })
        if (infoPanel) gsap.set(infoPanel, { autoAlpha: 1, x: 0 })
        syncProjectProgress(progressRail, 0)
        if (indicators) {
          indicators.forEach((dot) => {
            if (dot) gsap.set(dot, { autoAlpha: 0.2 })
          })
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: pinScene ? 'top top' : 'top 75%',
            end: pinScene ? PIN_SCROLL_LENGTH_DESKTOP : PIN_SCROLL_LENGTH_MOBILE,
            scrub: 0.9,
            pin: pinScene,
            pinSpacing: pinScene,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => syncProjectProgress(progressRail, self.progress),
            onRefresh: (self) => syncProjectProgress(progressRail, self.progress),
          },
        })

        if (glowOrb) tl.to(glowOrb, { autoAlpha: 0.8, scale: 1, duration: 0.12, ease: 'power2.out' }, 0)

        tl.to(mac, {
          autoAlpha: 1,
          scale: 1,
          rotateY: 0,
          y: 0,
          duration: 0.18,
          ease: 'power3.out',
        }, 0.06)

        if (indicators?.[0]) {
          tl.to(indicators[0], { autoAlpha: 1, duration: 0.06 }, 0.12)
        }

        tl.to(mac, { scale: 1.02, duration: 0.2, ease: 'sine.inOut' }, 0.76)
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        stageRefs.current.forEach((stage, index) => {
          const refs = deviceRefs.current[index] ?? {}
          const dots = indicatorRefs.current[index] ?? []
          if (!stage) return
          buildTimeline(stage, refs, dots, true)
        })
      })

      mm.add('(max-width: 1023px)', () => {
        stageRefs.current.forEach((stage, index) => {
          const refs = deviceRefs.current[index] ?? {}
          const dots = indicatorRefs.current[index] ?? []
          if (!stage) return
          buildTimeline(stage, refs, dots, false)
        })
      })

      ScrollTrigger.refresh()

      return () => mm.revert()
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="mx-auto w-full max-w-[1440px] px-4 py-20 md:px-7 lg:py-28" id="work">
     

      <div className="space-y-10 lg:space-y-0">
        {projects.map((project, index) => {
          const optimizedDesktopPreview = project.gallery?.[0]?.src || project.deviceScreens?.desktop
          const screens = {
            desktop: { label: 'Desktop preview', src: optimizedDesktopPreview },
          }
          const accent = colorAccents[project.color] || colorAccents.orange
          const isExternal = project.href.startsWith('http') || project.href.startsWith('mailto:')
          const projectNumber = String(index + 1).padStart(2, '0')

          return (
            <article key={project.id}>
              <div
                ref={(el) => { stageRefs.current[index] = el }}
                className="pj-stage"
              >
                <div
                  ref={(el) => {
                    deviceRefs.current[index] = deviceRefs.current[index] || {}
                    deviceRefs.current[index].glowOrb = el
                  }}
                  className="pj-glow-orb"
                  style={{
                    background: `radial-gradient(circle, ${accent.glow}, ${accent.soft} 50%, transparent 72%)`,
                  }}
                />

                <div className="pj-split">
                  <div
                    className="pj-info"
                    ref={(el) => {
                      deviceRefs.current[index] = deviceRefs.current[index] || {}
                      deviceRefs.current[index].infoPanel = el
                    }}
                  >
                    <div className="pj-info-inner">
                      <div className="mb-6 flex items-center gap-3">
                        <span
                          className="pj-number-badge"
                          style={{ borderColor: accent.main, color: accent.main }}
                        >
                          {projectNumber}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                          / {String(projects.length).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="text-2xl leading-tight font-extrabold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl">
                        <span className="inline-flex items-center gap-3">
                          <ProjectIcon project={project} />
                          <span>{project.name}</span>
                        </span>
                      </h3>

                      <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                        {project.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-1.5">
                        {project.tags.map((tag) => (
                          <TinyChip key={tag}>{tag}</TinyChip>
                        ))}
                      </div>

                      <div className="mt-8 space-y-3">
                        {project.features.map((feature) => (
                          <p key={feature} className="flex items-start gap-2 text-sm leading-relaxed text-zinc-300">
                            <Star size={12} className="mt-1 shrink-0" style={{ color: accent.main }} />
                            <span>{feature}</span>
                          </p>
                        ))}
                      </div>

                      {isExternal ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-5 py-2.5 text-xs font-semibold tracking-[0.2em] text-zinc-200 uppercase transition hover:-translate-y-0.5 hover:border-zinc-500 hover:text-zinc-100"
                        >
                          {project.cta}
                          <ArrowUpRight size={12} />
                        </a>
                      ) : (
                        <Link
                          to={project.href}
                          className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/90 px-5 py-2.5 text-xs font-semibold tracking-[0.2em] text-zinc-200 uppercase transition hover:-translate-y-0.5 hover:border-zinc-500 hover:text-zinc-100"
                        >
                          {project.cta}
                          <ArrowUpRight size={12} />
                        </Link>
                      )}

                      <div className="pj-indicators mt-10">
                        {DEVICE_LABELS.map((d, di) => {
                          const Icon = d.icon
                          return (
                            <div
                              key={d.label}
                              ref={(el) => {
                                indicatorRefs.current[index] = indicatorRefs.current[index] || []
                                indicatorRefs.current[index][di] = el
                              }}
                              className="pj-indicator-dot"
                            >
                              <Icon size={13} />
                              <span>{d.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    ref={(el) => {
                      deviceRefs.current[index] = deviceRefs.current[index] || {}
                      deviceRefs.current[index].progressRail = el
                    }}
                    className="pj-progress-shell"
                    style={{
                      '--pj-accent': accent.main,
                      '--pj-accent-glow': accent.glow,
                    }}
                    aria-hidden="true"
                  >
                    <div className="pj-progress-panel">
                      <div className="pj-progress-meta">
                        <span className="pj-progress-label">Scroll</span>
                        <span className="pj-progress-value" data-pj-progress-value>00%</span>
                      </div>

                      <div className="pj-progress-track">
                        <span className="pj-progress-line" />
                        <span className="pj-progress-fill" />
                        <span className="pj-progress-knob" />
                        <span className="pj-progress-tick pj-progress-tick-top" />
                      </div>

                      <div className="pj-progress-status">
                        <span className="pj-progress-status-label">Current frame</span>
                        <span className="pj-progress-status-value" data-pj-progress-step>Desktop view</span>
                      </div>
                    </div>
                  </div>

                  <div className="pj-device-stage">
                    <div className="pj-watermark">{projectNumber}</div>

                    <div
                      ref={(el) => {
                        deviceRefs.current[index] = deviceRefs.current[index] || {}
                        deviceRefs.current[index].mac = el
                      }}
                      className="pj-device pj-device-center"
                    >
                      <DevicesMockup
                        device="macbook"
                        color="spacegray"
                        scale={0.72}
                      >
                        <DeviceFrameContent title={project.name} label={screens.desktop.label} src={screens.desktop.src} />
                      </DevicesMockup>
                    </div>

                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectsSection
