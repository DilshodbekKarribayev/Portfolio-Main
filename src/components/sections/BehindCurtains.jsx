import { useMemo, useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness, Github, Linkedin, Music, GitBranch, Pause, Play } from 'lucide-react'
import { socialLinks } from '../../data/siteData'
import { fadeUp, staggerContainer, fadeUpChild } from '../../lib/animations'
import { useI18n } from '../../i18n/useI18n.js'

const MotionSection = motion.section
const MotionDiv = motion.div
const MotionLink = motion(Link)

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'XayrulloWeb'
const GITHUB_PUSH_CACHE_KEY = `github-latest-push-${GITHUB_USERNAME}`
const GITHUB_PUSH_CACHE_TTL = 1000 * 60 * 15

function getRelativeTimeLabel(date, labels) {
  const diffMs = Date.now() - date.getTime()
  const totalMinutes = Math.max(1, Math.floor(diffMs / 60000))

  if (totalMinutes < 60) return `${totalMinutes}${labels.minute.startsWith('m') ? '' : ' '}${labels.minute}`
  const hours = Math.floor(totalMinutes / 60)
  if (hours < 24) return `${hours}${labels.hour.startsWith('h') ? '' : ' '}${labels.hour}`
  const days = Math.floor(hours / 24)
  return `${days}${labels.day.startsWith('d') ? '' : ' '}${labels.day}`
}

function extractLatestPush(events) {
  const pushEvent = events.find(
    (event) =>
      event?.type === 'PushEvent' &&
      Array.isArray(event?.payload?.commits) &&
      event.payload.commits.length > 0,
  )

  if (!pushEvent) return null

  const commit = pushEvent.payload.commits[pushEvent.payload.commits.length - 1]
  const repoFullName = pushEvent?.repo?.name || ''
  const repo = repoFullName.split('/')[1] || repoFullName || 'repository'
  const message = (commit?.message || 'Updated repository').split('\n')[0]
  const commitUrl =
    commit?.sha && repoFullName
      ? `https://github.com/${repoFullName}/commit/${commit.sha}`
      : `https://github.com/${repoFullName}`

  return {
    message,
    repo,
    repoFullName,
    pushedAt: pushEvent.created_at,
    commitUrl,
  }
}

function extractLatestPushFromRepo(repo, commit) {
  const repoFullName = repo?.full_name || ''
  const repoName = repo?.name || repoFullName || 'repository'
  const message = (commit?.commit?.message || 'Updated repository').split('\n')[0]
  const pushedAt = commit?.commit?.author?.date || repo?.pushed_at || new Date().toISOString()
  const commitUrl =
    commit?.html_url || (repoFullName ? `https://github.com/${repoFullName}` : socialLinks.github)

  return {
    message,
    repo: repoName,
    repoFullName,
    pushedAt,
    commitUrl,
  }
}

function BehindCurtains() {
  const { copy, locale } = useI18n()
  const shouldReduceMotion = useReducedMotion()
  const audioRef = useRef(null)
  const fallbackPush = useMemo(() => ({
    ...copy.behind.fallbackPush,
    pushedAt: '2026-03-10T09:15:00+05:30',
    commitUrl: socialLinks.github,
  }), [copy.behind.fallbackPush])
  const [latestPush, setLatestPush] = useState(fallbackPush)
  const [isTrackPlaying, setIsTrackPlaying] = useState(false)
  const [trackProgress, setTrackProgress] = useState(0)
  const [trackError, setTrackError] = useState(false)
  const [trackSrc, setTrackSrc] = useState('')
  const [isTrackLoading, setIsTrackLoading] = useState(false)
  const [relativeLabel, setRelativeLabel] = useState(() =>
    getRelativeTimeLabel(new Date(fallbackPush.pushedAt), copy.behind.relative),
  )

  useEffect(() => {
    const controller = new AbortController()

    const fetchLatestPush = async () => {
      try {
        const cachedPayload = window.localStorage.getItem(GITHUB_PUSH_CACHE_KEY)
        if (cachedPayload) {
          const parsedCache = JSON.parse(cachedPayload)
          const cachedAt = Number(parsedCache?.cachedAt)
          const cachedPush = parsedCache?.data
          if (cachedAt && cachedPush && (Date.now() - cachedAt) < GITHUB_PUSH_CACHE_TTL) {
            setLatestPush(cachedPush)
            return
          }
        }
      } catch {
        // Ignore localStorage errors and continue with network fetch.
      }

      const fetchJson = async (url) => {
        try {
          const response = await fetch(url, {
            headers: { Accept: 'application/vnd.github+json' },
            signal: controller.signal,
            cache: 'no-store',
          })

          if (!response.ok) return null
          return await response.json()
        } catch {
          return null
        }
      }

      const events = await fetchJson(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
      )
      if (Array.isArray(events)) {
        const parsedFromEvents = extractLatestPush(events)
        if (parsedFromEvents) {
          setLatestPush(parsedFromEvents)
          try {
            window.localStorage.setItem(
              GITHUB_PUSH_CACHE_KEY,
              JSON.stringify({ cachedAt: Date.now(), data: parsedFromEvents }),
            )
          } catch {
            // Ignore cache write errors.
          }
          return
        }
      }

      const repos = await fetchJson(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5&type=owner`,
      )
      if (!Array.isArray(repos) || repos.length === 0) return

      const latestRepo = repos.find((repo) => !repo.fork) || repos[0]
      if (!latestRepo?.full_name) return

      const commits = await fetchJson(
        `https://api.github.com/repos/${latestRepo.full_name}/commits?per_page=1`,
      )
      if (!Array.isArray(commits) || commits.length === 0) {
        const parsedFromRepo = extractLatestPushFromRepo(latestRepo, null)
        setLatestPush(parsedFromRepo)
        try {
          window.localStorage.setItem(
            GITHUB_PUSH_CACHE_KEY,
            JSON.stringify({ cachedAt: Date.now(), data: parsedFromRepo }),
          )
        } catch {
          // Ignore cache write errors.
        }
        return
      }

      const parsedFromCommit = extractLatestPushFromRepo(latestRepo, commits[0])
      setLatestPush(parsedFromCommit)
      try {
        window.localStorage.setItem(
          GITHUB_PUSH_CACHE_KEY,
          JSON.stringify({ cachedAt: Date.now(), data: parsedFromCommit }),
        )
      } catch {
        // Ignore cache write errors.
      }
    }

    fetchLatestPush()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const refreshRelativeLabel = () => {
      setRelativeLabel(getRelativeTimeLabel(new Date(latestPush.pushedAt), copy.behind.relative))
    }

    refreshRelativeLabel()
    const timer = window.setInterval(refreshRelativeLabel, 60000)
    return () => window.clearInterval(timer)
  }, [copy.behind.relative, latestPush.pushedAt])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const handleTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) {
        setTrackProgress(0)
        return
      }
      setTrackProgress((audio.currentTime / audio.duration) * 100)
    }

    const handlePlay = () => setIsTrackPlaying(true)
    const handlePause = () => setIsTrackPlaying(false)
    const handleEnded = () => {
      setIsTrackPlaying(false)
      setTrackProgress(0)
      audio.currentTime = 0
    }
    const handleError = () => {
      setTrackError(true)
      setIsTrackPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const ensureTrackSource = async () => {
    if (trackSrc) return trackSrc

    setIsTrackLoading(true)
    try {
      const module = await import('../../assets/mp3/8-milya.mp3')
      const resolvedSrc = module?.default || ''
      if (!resolvedSrc) return null
      setTrackSrc(resolvedSrc)
      return resolvedSrc
    } catch {
      return null
    } finally {
      setIsTrackLoading(false)
    }
  }

  const toggleTrackPlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      setTrackError(false)
      const resolvedSrc = await ensureTrackSource()
      if (!resolvedSrc) {
        setTrackError(true)
        return
      }

      if (!audio.src || !audio.src.endsWith('8-milya.mp3')) {
        audio.src = resolvedSrc
      }

      try {
        await audio.play()
      } catch {
        setIsTrackPlaying(false)
      }
      return
    }

    audio.pause()
  }

  const latestPushDate = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(latestPush.pushedAt)),
    [latestPush.pushedAt, locale],
  )

  return (
    <MotionSection
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto flex w-full max-w-[1320px] flex-col justify-center px-4 py-20 md:px-7 lg:py-28"
    >
      <MotionDiv variants={fadeUp} className="mb-14 text-center">
        <p className="section-subtitle mb-4">{copy.behind.subtitle}</p>
        <h2 className="section-title text-zinc-100">
          {copy.behind.titleLine1}
          <br />
          <span className="font-script gradient-text">{copy.behind.titleLine2}</span>
        </h2>
      </MotionDiv>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* GitHub Widget */}
        <MotionDiv variants={fadeUpChild} className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
                <GitBranch size={18} className="text-zinc-300" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-100">{GITHUB_USERNAME}</h3>
            </div>
            <Github size={24} className="text-zinc-700 transition-colors group-hover:text-zinc-500" />
          </div>

          <div className="mb-8 flex-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{copy.behind.latestPush}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {relativeLabel}
              </span>
            </div>
            <a
              href={latestPush.commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] leading-[1.6] text-zinc-300 transition-colors hover:text-zinc-100"
            >
              {latestPush.message}
            </a>
            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              {copy.behind.repo}{' '}
              <a
                href={`https://github.com/${latestPush.repoFullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                {latestPush.repo}
              </a>
              <br />
              {copy.behind.updated} {latestPushDate}
            </p>
          </div>

          <div className="flex items-center gap-4 border-t border-zinc-800/60 pt-6">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
          </div>
        </MotionDiv>

        {/* Current Focus Widget */}
        <MotionDiv variants={fadeUpChild} className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:shadow-2xl">
          <div>
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
              <BriefcaseBusiness size={18} className="text-zinc-300" />
            </div>
            <h3 className="text-[2rem] font-black leading-[1.1] tracking-tight text-zinc-100">
              {copy.behind.current}
              <br />
              <span className="font-script gradient-text">{copy.behind.focus}</span>
            </h3>
            <p className="mt-4 text-[0.95rem] text-zinc-400">
              {copy.behind.focusText}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/35 px-3 py-1 text-[11px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {copy.behind.activeNow}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-zinc-800/60 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['React', 'TypeScript', 'Node'].map((label, index) => (
                  <motion.div
                    key={label}
                    className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300"
                    initial={{ y: 8, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: index * 0.08 }}
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { y: [0, -2, 0] }
                    }
                  >
                    {label}
                  </motion.div>
                ))}
              </div>
              <motion.span
                className="text-xs font-semibold tracking-wide text-zinc-500"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: [0.55, 1, 0.55] }
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Aug 2025 - Present
              </motion.span>
            </div>
            <MotionLink
              to="/work"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-zinc-100 px-5 text-xs font-bold text-zinc-900 transition-colors hover:bg-white"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              {copy.behind.viewWork}
              <ArrowUpRight size={14} />
            </MotionLink>
          </div>
        </MotionDiv>

        {/* Music Widget */}
        <MotionDiv variants={fadeUpChild} className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:shadow-2xl">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-[80px] transition-all duration-700 group-hover:bg-emerald-500/20" />
          <audio ref={audioRef} preload="none" src={trackSrc || undefined} />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/50 text-emerald-400">
                  <Music size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{copy.behind.nowPlaying}</h3>
                <div className="flex items-end gap-1.5">
                  {[16, 24, 12, 20].map((h, i) => (
                    <motion.span
                      key={h + i}
                      className="w-1 rounded-full bg-emerald-400/80"
                      style={{ height: 6 }}
                      animate={
                        shouldReduceMotion || !isTrackPlaying
                          ? undefined
                          : { height: [6, h, 8, Math.max(10, h - 4), 6], opacity: [0.55, 1, 0.65] }
                      }
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-lg font-bold tracking-tight text-zinc-100">8 Milya</p>
                <p className="text-sm text-zinc-400">Miyagi & Endshpil</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 pt-2">{copy.behind.trackHighlight}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {!isTrackPlaying ? (
                  <button
                    type="button"
                    onClick={toggleTrackPlayback}
                    disabled={isTrackLoading}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    <Play size={14} />
                    {isTrackLoading ? copy.behind.loading : copy.behind.play}
                  </button>
                ) : null}
                <span className="inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-900/70 px-3.5 py-1.5 text-xs font-semibold text-zinc-400">
                  {copy.behind.localMp3Mode}
                </span>
              </div>
              {trackError ? (
                <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-amber-300">
                  {copy.behind.audioError}
                </p>
              ) : null}

              <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                {copy.behind.animationNote}
              </p>
              </div>

            <div className="mt-10 flex justify-end">
              <motion.div
                className="relative h-28 w-28"
                animate={shouldReduceMotion || !isTrackPlaying ? undefined : { rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <motion.div
                  className="absolute -inset-1 rounded-full border border-emerald-300/20"
                  animate={shouldReduceMotion || !isTrackPlaying ? undefined : { scale: [1, 1.08, 1], opacity: [0.2, 0.55, 0.2] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 rounded-full border border-zinc-700 bg-zinc-900 shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
                <div className="absolute inset-[6px] rounded-full border border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-950" />
                <div className="absolute inset-[30px] rounded-full bg-emerald-900/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full border-2 border-zinc-600 bg-zinc-950" />
                </div>
              </motion.div>
            </div>

            <div className="mt-5">
              <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                  animate={{ width: `${Math.max(0, Math.min(100, trackProgress))}%` }}
                  transition={{ duration: 0.18, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
      {isTrackPlaying ? (
        <button
          type="button"
          onClick={toggleTrackPlayback}
          className="fixed bottom-5 right-20 z-[110] inline-flex items-center gap-2 rounded-full border border-emerald-500/45 bg-zinc-950/90 px-4 py-2 text-xs font-semibold text-emerald-300 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-zinc-900"
        >
          <Pause size={14} />
          {copy.behind.pauseTrack}
        </button>
      ) : null}
    </MotionSection>
  )
}

export default BehindCurtains

