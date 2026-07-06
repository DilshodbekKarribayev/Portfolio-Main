import { BookOpen, Bot, BusFront, Cpu, Flame, Globe2, ShieldCheck } from 'lucide-react'

const iconMap = {
  web: {
    label: 'Web project',
    className: 'text-sky-300 border-sky-400/25 bg-sky-400/10',
    render: () => <Globe2 size={20} />,
  },
  robot: {
    label: 'Robotics project',
    className: 'text-red-300 border-red-400/25 bg-red-400/10',
    render: () => <Bot size={20} />,
  },
  photoshop: {
    label: 'Photoshop project',
    className: 'text-[#31a8ff] border-[#31a8ff]/30 bg-[#001e36]',
    render: () => <span className="text-[13px] font-black tracking-[-0.01em]">Ps</span>,
  },
  coreldraw: {
    label: 'CorelDRAW project',
    className: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
    render: () => <span className="text-[11px] font-black tracking-[-0.02em]">CDR</span>,
  },
  catalog: {
    label: 'Catalog project',
    className: 'text-amber-200 border-amber-300/30 bg-amber-300/10',
    render: () => <BookOpen size={20} />,
  },
  iot: {
    label: 'IoT project',
    className: 'text-orange-300 border-orange-400/25 bg-orange-400/10',
    render: () => <Cpu size={20} />,
  },
  security: {
    label: 'Security project',
    className: 'text-blue-300 border-blue-400/25 bg-blue-400/10',
    render: () => <ShieldCheck size={20} />,
  },
  transit: {
    label: 'Transit project',
    className: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10',
    render: () => <BusFront size={20} />,
  },
  safety: {
    label: 'Safety project',
    className: 'text-red-300 border-red-400/25 bg-red-400/10',
    render: () => <Flame size={20} />,
  },
}

function ProjectTitleIcon({ project, size = 'md' }) {
  const icon = iconMap[project.icon] ?? iconMap.web
  const boxSize = size === 'lg' ? 'h-10 w-10 rounded-xl' : 'h-9 w-9 rounded-xl'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border ${boxSize} ${icon.className}`}
      aria-label={icon.label}
      title={icon.label}
    >
      {icon.render()}
    </span>
  )
}

export default ProjectTitleIcon
