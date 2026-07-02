function NavPill({ active = false, children, onClick, isCurrent = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isCurrent ? 'page' : undefined}
      className={`rounded-full border px-4 py-2 text-xs tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${active
          ? 'border-zinc-300 bg-zinc-100 text-zinc-950'
          : 'border-zinc-800 bg-zinc-950/65 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
        }`}
    >
      {children}
    </button>
  )
}

export default NavPill
