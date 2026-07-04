import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Code2, Cpu, Zap, Linkedin, Github, Twitter } from 'lucide-react'
import { fadeUp, staggerContainer, fadeUpChild } from '../../lib/animations'
import { publicAsset } from '../../lib/publicAsset'
import ProfileCard from '../ui/ProfileCard'
import SplitReveal from '../ui/SplitReveal'
import { useI18n } from '../../i18n/useI18n.js'
// Place your avatar image in public/brand/ and reference it like '/brand/avatar.jpg'

const MotionSection = motion.section
const MotionDiv = motion.div

function AboutSection() {
  const { copy, socialLinks } = useI18n()

  const handleProfileContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.location.href = socialLinks.email
  }

  return (
    <MotionSection
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      className="mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 py-24 md:px-7 lg:py-32"
      id="about"
    >
      <MotionDiv variants={fadeUp} className="mb-10 w-full text-center lg:mb-14">
        <p className="section-subtitle mb-4">{copy.about.subtitle}</p>
        <h2 className="section-title text-zinc-100">
          <SplitReveal text={copy.about.titleLine1} as="span" className="block" />
          <span className="font-script gradient-text">
            <SplitReveal text={copy.about.titleLine2} as="span" delay={0.12} />
          </span>
        </h2>
      </MotionDiv>

      <div className="grid w-full gap-6 lg:grid-cols-12 lg:grid-rows-[minmax(420px,auto)_auto]">
        <MotionDiv
          variants={fadeUpChild}
          className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-sm sm:p-12 lg:col-span-8 lg:row-span-2"
        >
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px] transition-all duration-700 group-hover:bg-blue-500/20" />
          <div className="absolute -bottom-20 right-[-8%] h-52 w-52 rounded-full bg-amber-500/10 blur-[100px]" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {copy.about.available}
            </div>

            <div className="space-y-6 text-[1rem] leading-[1.78] text-zinc-400 md:text-[1.06rem]">
              {copy.aboutText.paragraphs.map((p, i) => (
                <p key={i} className="max-w-[64ch]">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-zinc-800/60 pt-8">
            <div className="flex items-center gap-4 text-zinc-500">
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-600 hover:text-zinc-200" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-600 hover:text-zinc-200" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-600 hover:text-zinc-200" aria-label="X">
                <Twitter size={18} />
              </a>
            </div>

            <Link
              to="/#contact"
              className="group/btn flex items-center gap-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 transition-all hover:bg-white"
            >
              {copy.about.cta}
              <ArrowUpRight size={16} className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </MotionDiv>

        <MotionDiv
          variants={fadeUpChild}
          className="group relative col-span-1 overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 lg:col-span-4"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent z-10" />
          <div className="absolute -top-8 right-[-12%] h-40 w-40 rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="relative flex min-h-[300px] h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(245,158,11,0.12),transparent_45%),linear-gradient(160deg,#121826,#090c12)] px-5 py-8">
            <div className="relative z-20 w-full max-w-[320px]">
              <ProfileCard
                name="Dilshodbek Karribayev"
                title=""
                handle="karribayev_004"
                status={copy.about.profileStatus}
                contactText={copy.about.contactMe}
                avatarUrl={publicAsset('/portfolioPhoto.jpg')}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={handleProfileContact}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                iconUrl={publicAsset('/assets/demo/iconpattern.svg')}
                behindGlowEnabled={true}
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
              />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 z-20">
            <p className="text-sm font-bold tracking-wide text-zinc-100">DILIABLE</p>
            <p className="text-xs text-zinc-400">{copy.about.role}</p>
          </div>
        </MotionDiv>

        <MotionDiv
          variants={fadeUpChild}
          className="col-span-1 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-sm lg:col-span-4"
        >
          <div className="grid grid-cols-3 gap-4 divide-x divide-zinc-800/60 text-center">
            <div className="flex flex-col items-center gap-2">
              <Code2 size={24} className="text-emerald-400" strokeWidth={1.5} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{copy.about.traits[0]}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Cpu size={24} className="text-blue-400" strokeWidth={1.5} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{copy.about.traits[1]}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap size={24} className="text-amber-400" strokeWidth={1.5} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{copy.about.traits[2]}</span>
            </div>
          </div>
        </MotionDiv>
      </div>
    </MotionSection>
  )
}

export default AboutSection


