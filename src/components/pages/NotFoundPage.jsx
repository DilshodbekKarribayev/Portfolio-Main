import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

function NotFoundPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 pb-20 pt-32 text-center md:px-7 lg:pt-36">
      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">404</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-100 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        This page does not exist or was moved. Use one of the links below to continue.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-900 transition hover:bg-white"
        >
          <Home size={14} />
          Back home
        </Link>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200 transition hover:border-zinc-500 hover:text-zinc-100"
        >
          <ArrowLeft size={14} />
          Open work
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage

