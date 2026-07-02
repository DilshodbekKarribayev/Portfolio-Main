function SkillChip({ item }) {
  const Icon = item.icon

  return (
    <div className="group relative flex items-center gap-3 rounded-full border border-zinc-700/60 bg-zinc-900/50 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-800/80 hover:shadow-lg">
      <div 
        className="flex mb-0 h-7 w-7 items-center justify-center rounded-full bg-zinc-950/80 shadow-inner transition-colors duration-300"
        style={{ color: item.color, boxShadow: `inset 0 0 10px ${item.color}20` }}
      >
        <Icon size={14} strokeWidth={2.5} />
      </div>
      <span className="text-[13px] font-semibold tracking-wide text-zinc-300 transition-colors duration-300 group-hover:text-zinc-100">
        {item.name}
      </span>
    </div>
  )
}

export default SkillChip
