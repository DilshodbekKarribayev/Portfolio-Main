import { useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  ImagePlus,
  Users,
} from 'lucide-react'
import { isVideoSource } from '../../lib/media'
import TinyChip from '../ui/TinyChip'
import Lightbox from '../ui/Lightbox'
import ProjectTitleIcon from '../ui/ProjectTitleIcon'
import { useI18n } from '../../i18n/useI18n.js'

function MetaCard({ icon, label, value }) {
  const Icon = icon

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-zinc-100">
        <Icon size={15} className="text-blue-300" />
        <span>{value}</span>
      </div>
    </div>
  )
}

function GalleryImageTile({ projectName, shot, eyebrow, title, description, labels, variant = 'grid', onClick }) {
  const [broken, setBroken] = useState(false)
  const imagePath = shot.src || shot.assetHint?.replace('/public', '')
  const isVideo = isVideoSource(imagePath)
  const showVideo = Boolean(imagePath) && !broken && isVideo
  const showImage = Boolean(imagePath) && !broken && !isVideo
  const canOpen = Boolean(onClick) && !isVideo
  const frameClassName = {
    hero: 'min-h-[320px] md:min-h-[430px]',
    device: 'min-h-[200px]',
    grid: 'min-h-[220px]',
  }[variant]

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-zinc-800/80 bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_86%_100%,rgba(245,158,11,0.12),transparent_32%),linear-gradient(160deg,rgba(13,17,24,0.92),rgba(7,10,15,0.96))] p-3 shadow-[0_28px_80px_-44px_rgba(0,0,0,0.9)] backdrop-blur-sm md:p-4 ${canOpen ? 'cursor-zoom-in' : ''}`}
      onClick={canOpen ? onClick : undefined}
      role={canOpen ? 'button' : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onKeyDown={canOpen ? (e) => { if (e.key === 'Enter') onClick() } : undefined}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_44%)]" />
      {(eyebrow || title || description) ? (
        <div className="relative z-10 mb-3 flex items-start justify-between gap-4 px-1">
          <div>
            {eyebrow ? (
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">{eyebrow}</p>
            ) : null}
            {title ? <p className="mt-2 text-sm font-semibold text-zinc-100">{title}</p> : null}
            {description ? <p className="mt-1 text-xs text-zinc-500">{description}</p> : null}
          </div>
          <span className="rounded-full border border-zinc-700/80 bg-zinc-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {shot.title}
          </span>
        </div>
      ) : null}

      {showVideo ? (
        <div className={`relative z-10 flex items-center justify-center overflow-hidden rounded-[22px] border border-white/6 bg-[#04070b] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-3 ${frameClassName}`}>
          <video
            src={imagePath}
            className="h-full w-full rounded-[18px] object-contain"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            onError={() => setBroken(true)}
          />
        </div>
      ) : showImage ? (
        <div className={`relative z-10 flex items-center justify-center overflow-hidden rounded-[22px] border border-white/6 bg-[#04070b] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-3 ${frameClassName}`}>
          <img
            src={imagePath}
            alt={`${projectName} - ${shot.title}`}
            className="h-full w-full rounded-[18px] object-contain transition duration-500 group-hover:scale-[1.01]"
            loading="lazy"
            onError={() => setBroken(true)}
          />
        </div>
      ) : (
        <div className="flex min-h-44 w-full flex-col items-center justify-center rounded-[22px] border border-white/6 bg-[radial-gradient(circle_at_30%_25%,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_75%_75%,rgba(249,115,22,0.16),transparent_50%),linear-gradient(160deg,#111827,#090d14)] px-4 py-8 text-center">
          <ImagePlus size={22} className="text-zinc-300" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">{labels.imagePlaceholder}</p>
          <p className="mt-2 text-[11px] text-zinc-500">{shot.assetHint || '/public/projects/.../image.webp'}</p>
        </div>
      )}
    </div>
  )
}

function WorkDetailPage() {
  const { copy, projects } = useI18n()
  const { projectId } = useParams()
  const project = projects.find((item) => item.id === projectId)
  const galleryItems = project?.gallery || []
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), [setLightboxIndex])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [setLightboxIndex])

  if (!project) {
    return (
      <section className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-28 text-center md:px-7 lg:pt-32">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">{copy.workDetail.projectNotFound}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-100">{copy.workDetail.noDetails}</h1>
        <Link
          to="/work"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 transition hover:border-zinc-500 hover:text-zinc-100"
        >
          <ArrowLeft size={14} />
          {copy.workDetail.backToWorkLower}
        </Link>
      </section>
    )
  }

  const deviceGalleryItems = [
    project.deviceScreens?.desktop
      ? { key: 'device-desktop', title: copy.workDetail.desktop, src: project.deviceScreens.desktop }
      : null,
  ].filter(Boolean)

  const allGallerySources = [...galleryItems]
  if (allGallerySources.length === 0) {
    allGallerySources.push(...deviceGalleryItems)
  }

  const featuredShot = allGallerySources[0]
  const usedSources = new Set(featuredShot ? [featuredShot.src || featuredShot.assetHint || featuredShot.key] : [])

  const showcaseShots = deviceGalleryItems.filter((shot) => {
    const shotKey = shot.src || shot.assetHint || shot.key
    if (usedSources.has(shotKey)) return false
    usedSources.add(shotKey)
    return true
  })

  const galleryGridShots = allGallerySources.filter((shot, index) => {
    if (index === 0) return false
    const shotKey = shot.src || shot.assetHint || shot.key
    if (usedSources.has(shotKey)) return false
    usedSources.add(shotKey)
    return true
  })

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-28 md:px-7 lg:pb-24 lg:pt-32" id="work">
      <Link
        to="/work"
        className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
      >
        <ArrowLeft size={13} />
        {copy.workDetail.backToWork}
      </Link>

      <div className="mt-8 rounded-3xl border border-zinc-800/80 bg-zinc-900/45 p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.7)] backdrop-blur-sm md:p-10">
        <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-500">{copy.workDetail.caseStudy}</p>
        <h1 className="mt-4 text-4xl font-black leading-[0.9] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
          <span className="inline-flex items-center gap-3">
            <ProjectTitleIcon project={project} size="lg" />
            <span>{project.name}</span>
          </span>
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
          {project.tagline}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetaCard icon={FolderKanban} label={copy.workDetail.type} value={project.projectType} />
          <MetaCard icon={CalendarDays} label={copy.workDetail.timeline} value={project.timeline} />
          <MetaCard icon={Users} label={copy.workDetail.role} value={project.role} />
          <MetaCard icon={CheckCircle2} label={copy.workDetail.status} value={copy.workDetail.active} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              {copy.workDetail.openProject}
            </a>
          ) : null}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              GitHub
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/35 p-6 md:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-100">{copy.workDetail.aboutProject}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{project.description}</p>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.problem}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{project.problem}</p>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.outcome}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{project.outcome}</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/35 p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.collaborators}</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-200">
              {project.collaborators.map((member) => (
                <li key={member.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                  <span className="font-semibold text-zinc-100">{member.name}</span>
                  <span className="ml-2 text-zinc-400">- {member.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/35 p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.techStack}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <TinyChip key={tag}>{tag}</TinyChip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/35 p-6 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.responsibilities}</h3>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-200">
            {project.responsibilities.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/35 p-6 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.developmentFlow}</h3>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-200">
            {project.process.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-300" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-zinc-800/80 bg-zinc-900/35 p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-zinc-800/70 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">{copy.workDetail.projectGallery}</h3>
            <p className="mt-3 max-w-2xl text-sm text-zinc-500">
              {copy.workDetail.galleryIntro}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {allGallerySources.length} {copy.workDetail.screens}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {copy.workDetail.desktopOnly}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {project.features.length} {copy.workDetail.highlights}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.22fr)_360px]">
          <div className="space-y-4">
            {featuredShot ? (
              <GalleryImageTile
                projectName={project.name}
                shot={featuredShot}
                eyebrow={copy.workDetail.featuredPreview}
                title={`${project.name} ${copy.workDetail.mainInterface}`}
                description={copy.workDetail.primaryView}
                labels={copy.workDetail}
                variant="hero"
                onClick={!isVideoSource(featuredShot.src) ? () => openLightbox(0) : undefined}
              />
            ) : null}

            {galleryGridShots.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {galleryGridShots.map((shot, index) => (
                  <GalleryImageTile
                    key={shot.key}
                    projectName={project.name}
                    shot={shot}
                    eyebrow={copy.workDetail.interfaceCapture}
                    title={`${copy.workDetail.screen} ${String(index + 2).padStart(2, '0')}`}
                    description={copy.workDetail.additionalUi}
                    labels={copy.workDetail}
                    variant="grid"
                    onClick={!isVideoSource(shot.src) ? () => openLightbox(index + 1) : undefined}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-zinc-800/80 bg-[radial-gradient(circle_at_10%_0%,rgba(59,130,246,0.12),transparent_35%),linear-gradient(160deg,rgba(13,17,24,0.92),rgba(7,10,15,0.96))] p-5 shadow-[0_28px_80px_-44px_rgba(0,0,0,0.9)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">{copy.workDetail.galleryNotes}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{copy.workDetail.shots}</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-zinc-100">{String(allGallerySources.length).padStart(2, '0')}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{copy.workDetail.devices}</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-zinc-100">{String(deviceGalleryItems.length).padStart(2, '0')}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{copy.workDetail.flow}</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-zinc-100">{String(project.process.length).padStart(2, '0')}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {project.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-start gap-3 rounded-2xl border border-zinc-800/70 bg-zinc-900/60 px-3 py-3 text-sm text-zinc-300">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-blue-300" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {showcaseShots.map((shot) => {
              const showcaseIdx = allGallerySources.findIndex((s) => (s.src || s.key) === (shot.src || shot.key))
              return (
                <GalleryImageTile
                  key={shot.key}
                  projectName={project.name}
                  shot={shot}
                  eyebrow={copy.workDetail.devicePreview}
                  title={`${shot.title} ${copy.workDetail.adaptation}`}
                  description={copy.workDetail.desktopPresentation}
                  labels={copy.workDetail}
                  variant="device"
                  onClick={showcaseIdx >= 0 ? () => openLightbox(showcaseIdx) : undefined}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={allGallerySources.filter((s) => s.src && !isVideoSource(s.src)).map((s) => ({ src: s.src, title: s.title }))}
        index={lightboxIndex}
        onClose={closeLightbox}
        onChange={setLightboxIndex}
      />
    </section>
  )
}

export default WorkDetailPage

