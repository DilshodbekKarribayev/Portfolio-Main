import { motion } from 'motion/react'
import { BriefcaseBusiness, CalendarDays, CheckCircle2, GraduationCap, MapPin } from 'lucide-react'
import { fadeUp } from '../../lib/animations'

const MotionSection = motion.section

const experienceTimeline = [
  {
    id: 'tuit',
    label: 'Foundation',
    organization: 'Tashkent University of Information Technologies, Urgench Branch',
    period: 'Apr 2024 - Jul 2025',
    location: 'Urgench, Uzbekistan',
    points: [
      'Worked on academic and practical web development tasks.',
      'Strengthened frontend development skills through hands-on projects.',
      'Built experience with modern web technologies, interface development, and project workflow.',
      'Improved practical knowledge of building responsive and functional web applications.',
    ],
  },
  {
    id: 'unusual',
    label: 'Current',
    organization: 'Unusual',
    period: 'Aug 2025 - Present',
    location: 'Uzbekistan',
    points: [
      'Currently working on real product tasks and frontend delivery.',
      'Continuing practical development of responsive interfaces and production workflows.',
    ],
  },
]

function BlogsSection() {
  return (
    <MotionSection
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto flex w-full max-w-[1320px] flex-col justify-center px-4 py-20 md:px-7 lg:py-28"
      id="experience"
    >
      <div className="mb-12 text-center">
        <p className="section-subtitle mb-4">Experience</p>
        <h2 className="section-title text-zinc-100">
          Career <span className="font-script gradient-text">timeline</span>
        </h2>
      </div>

      <article className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/45 backdrop-blur-sm">
        <div className="border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900/85 via-zinc-900/60 to-zinc-900/35 px-6 py-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-950/65 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <GraduationCap size={13} className="text-blue-300" />
            Experience
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Clear vertical history by months and years.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="relative pl-7 sm:pl-10">
            <div className="absolute bottom-2 left-[11px] top-2 w-[2px] rounded-full bg-gradient-to-b from-cyan-300/45 via-zinc-600/50 to-amber-300/45 sm:left-[15px]" />

            <div className="space-y-5">
              {experienceTimeline.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="relative rounded-2xl border border-zinc-800/70 bg-zinc-950/35 p-5"
                >
                  <span className="absolute left-[-23px] top-6 h-3 w-3 rounded-full border border-zinc-100/90 bg-zinc-100 shadow-[0_0_0_4px_rgba(14,165,233,0.14)] sm:left-[-28px]" />

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-zinc-700/80 bg-zinc-900/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                      {item.label}
                    </span>
                    {item.id === 'unusual' ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">
                        <BriefcaseBusiness size={12} />
                        Active
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-lg font-semibold leading-tight text-zinc-100 sm:text-xl">{item.organization}</h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-zinc-500" />
                      {item.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-zinc-500" />
                      {item.location}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {item.points.map((point) => (
                      <div key={point} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                        <p className="text-sm leading-[1.65] text-zinc-300">{point}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </MotionSection>
  )
}

export default BlogsSection
