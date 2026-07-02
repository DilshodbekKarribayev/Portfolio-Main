import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navItems } from '../../data/siteData'
import { publicAsset } from '../../lib/publicAsset'
import NavPill from '../ui/NavPill'
import Magnetic from '../ui/Magnetic'

const MotionNav = motion.nav
const HOME_SECTION = 'hero'

function HeaderNav() {
  const [visibleSection, setVisibleSection] = useState(HOME_SECTION)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const coreNavItems = navItems.filter((item) => item.id !== 'work')
  const hashId = location.hash.replace('#', '')
  const hasHashNavItem = coreNavItems.some((item) => item.id === hashId)
  const activeSection = location.pathname.startsWith('/work')
    ? 'work'
    : hasHashNavItem
      ? hashId
      : visibleSection

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setVisibleSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-42% 0px -42% 0px',
        threshold: [0.1, 0.35, 0.6],
      },
    )

    navItems.forEach((item) => {
      if (item.id === 'work') return
      const section = document.getElementById(item.id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [location.pathname])

  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id)
    if (!section) return

    const offset = window.innerWidth < 768 ? 84 : 112
    const top = section.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })

    setVisibleSection(id)
  }, [])

  const handleLogoClick = useCallback(() => {
    setMenuOpen(false)

    if (location.pathname !== '/') {
      navigate('/')
      return
    }

    scrollToSection(HOME_SECTION)
  }, [location.pathname, navigate, scrollToSection])

  const handleNavClick = useCallback((id) => {
    setMenuOpen(false)

    if (id === 'work') {
      navigate('/work')
      return
    }

    if (location.pathname !== '/') {
      navigate(id === HOME_SECTION ? '/' : `/#${id}`)
      return
    }

    scrollToSection(id)
  }, [location.pathname, navigate, scrollToSection])

  const handleWorkClick = useCallback(() => {
    setMenuOpen(false)
    navigate('/work')
  }, [navigate])

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'top-3' : 'top-5'}`}
    >
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 md:px-7">
        <button
          type="button"
          onClick={handleLogoClick}
          className="inline-flex items-center gap-2.5 rounded-full border border-zinc-700/80 bg-zinc-950/80 px-4 py-2 text-sm font-bold tracking-wide text-zinc-100 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <img src={publicAsset('/brand/diliable-mark.svg')} alt="" className="h-5 w-5 shrink-0" />
          <span className="tracking-[-0.02em]">DiliAble</span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-zinc-700/80 bg-zinc-950/80 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl md:flex">
          {coreNavItems.map((item) => (
            <Magnetic key={item.id}>
              <NavPill
                active={activeSection === item.id}
                onClick={() => handleNavClick(item.id)}
                isCurrent={activeSection === item.id}
              >
                {item.label}
              </NavPill>
            </Magnetic>
          ))}
          <Magnetic>
            <button
              type="button"
              onClick={handleWorkClick}
              className={`ml-2 rounded-full border px-4 py-2 text-xs tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${activeSection === 'work'
                ? 'border-zinc-300 bg-zinc-100 text-zinc-900'
                : 'border-amber-200/30 bg-amber-200/10 text-amber-100 hover:border-amber-200/50 hover:bg-amber-200/20'
                }`}
            >
              Work
            </button>
          </Magnetic>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/80 text-zinc-200 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:hidden"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <MotionNav
            key="mobile-nav"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mx-4 mt-3 rounded-3xl border border-zinc-700/80 bg-zinc-950/90 p-3 backdrop-blur-xl md:hidden"
          >
            <ul className="grid gap-2">
              {coreNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeSection === item.id
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-950/70 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100'
                      }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleWorkClick}
              className={`mt-3 inline-flex w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${activeSection === 'work'
                ? 'border-zinc-200 bg-zinc-100 text-zinc-900'
                : 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800'
                }`}
            >
              Work
            </button>
          </MotionNav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default HeaderNav
