import { motion } from 'motion/react'
import { skillset } from '../../data/siteData'
import { fadeUp } from '../../lib/animations'
import SkillChip from '../ui/SkillChip'
import SkillOrbCanvas from '../ui/SkillOrbCanvas'
import SplitReveal from '../ui/SplitReveal'

const MotionSection = motion.section

function SkillsSection() {
  return (
    <MotionSection
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative mx-auto flex w-full max-w-[1320px] items-center px-4 py-20 md:px-7 lg:py-28"
      id="skills"
    >
      <div className="mx-auto flex max-w-[960px] flex-col items-center text-center">
        <div className="mb-5 rounded-full border border-zinc-700/70 bg-zinc-950/50 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
          <SkillOrbCanvas size={250} className="mx-auto" />
        </div>

        <p className="section-subtitle mb-4">Core Stack</p>

        <h2 className="section-title text-zinc-100">
          <SplitReveal text="Tooling and craft" as="span" className="block" />
          <span className="font-script gradient-text">
            <SplitReveal text="behind every build" as="span" delay={0.15} />
          </span>
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {skillset.map((item) => (
            <SkillChip key={item.name} item={item} />
          ))}
        </div>
      </div>
    </MotionSection>
  )
}

export default SkillsSection


