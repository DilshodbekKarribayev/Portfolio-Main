import { useRef, useEffect, useState } from 'react'

/**
 * ScrollRevealStatement — лёгкая версия.
 *
 * Вместо 22 useTransform хуков (per-frame) используем
 * один IntersectionObserver + CSS transitions.
 * Нагрузка: 0 вычислений при скролле, только одно событие при входе в viewport.
 */

const PHRASE = [
  { text: 'I', highlight: false },
  { text: 'turn', highlight: false },
  { text: 'complex', highlight: true },
  { text: 'ideas', highlight: true },
  { text: 'into', highlight: false },
  { text: 'fast,', highlight: false },
  { text: 'beautiful,', highlight: true },
  { text: 'and', highlight: false },
  { text: 'production-ready', highlight: true },
  { text: 'all', highlight: false },
  { text: 'products.', highlight: false },
]

function ScrollRevealStatement() {
  const sectionRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1320px] px-4 py-28 md:px-7 lg:py-40"
      aria-label="Statement"
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent md:inset-x-7" />

      <p className="section-subtitle mb-8 text-center">The approach</p>

      <p
        className="mx-auto max-w-[900px] text-center text-[clamp(1.6rem,4.2vw,3.6rem)] font-extrabold leading-[1.18] tracking-tight"
        aria-label="I turn complex ideas into fast, beautiful, and production-ready web products."
      >
        {PHRASE.map((word, i) => (
          <span
            key={i}
            className="mr-[0.28em] inline-block last:mr-0 transition-all duration-700 ease-out"
            style={{
              transitionDelay: revealed ? `${i * 80}ms` : '0ms',
              opacity: revealed ? 1 : 0.08,
              transform: revealed ? 'translateY(0)' : 'translateY(12px)',
              color: revealed
                ? word.highlight
                  ? 'rgb(253, 230, 138)'
                  : 'rgb(244, 244, 245)'
                : 'rgba(161, 161, 170, 0.1)',
            }}
          >
            {word.text}
          </span>
        ))}
      </p>

      <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent md:inset-x-7" />
    </section>
  )
}

export default ScrollRevealStatement
