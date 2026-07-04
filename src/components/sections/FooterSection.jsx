import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Instagram, Linkedin, Send, Sparkles } from 'lucide-react'
import { staggerContainer, fadeUpChild } from '../../lib/animations'
import { useI18n } from '../../i18n/useI18n.js'

const MotionSection = motion.section
const MotionDiv = motion.div

const INITIAL_FORM = {
  name: '',
  email: '',
  message: '',
}

function buildContactMessage(values, labels) {
  return [
    labels.contactMessageTitle,
    '',
    `${labels.contactMessageName}: ${values.name}`,
    `${labels.contactMessageEmail}: ${values.email}`,
    '',
    `${labels.contactMessageMessage}:`,
    values.message,
  ].join('\n')
}

function isInternalRoute(href) {
  return typeof href === 'string' && href.startsWith('/')
}

function FooterSection() {
  const { copy, footerColumns, socialLinks } = useI18n()
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [statusText, setStatusText] = useState('')
  const [statusTone, setStatusTone] = useState('neutral')

  const contactEmail = useMemo(
    () => (socialLinks.email || '').replace('mailto:', ''),
    [socialLinks.email],
  )

  const validateForm = () => {
    const nextErrors = {}
    const trimmedName = formValues.name.trim()
    const trimmedEmail = formValues.email.trim()
    const trimmedMessage = formValues.message.trim()

    if (trimmedName.length < 2) nextErrors.name = copy.footer.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) nextErrors.email = copy.footer.errors.email
    if (trimmedMessage.length < 12) nextErrors.message = copy.footer.errors.message

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const updateField = (field) => (event) => {
    const value = event.target.value
    setFormValues((prev) => ({ ...prev, [field]: value }))
    setStatusText('')
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: omitted, ...rest } = prev
        void omitted
        return rest
      })
    }
  }

  const handleEmailSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) {
      setStatusTone('error')
      setStatusText(copy.footer.errors.required)
      return
    }

    const subject = `${copy.footer.mailSubjectPrefix} ${formValues.name.trim()}`
    const body = buildContactMessage({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      message: formValues.message.trim(),
    }, copy.footer)

    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
    setStatusTone('success')
    setStatusText(copy.footer.statuses.emailOpened)
  }

  const handleTelegramSubmit = () => {
    if (!validateForm()) {
      setStatusTone('error')
      setStatusText(copy.footer.errors.required)
      return
    }

    const body = buildContactMessage({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      message: formValues.message.trim(),
    }, copy.footer)

    const telegramBase = socialLinks.telegram || 'https://t.me/karribayev'
    const separator = telegramBase.includes('?') ? '&' : '?'
    window.open(`${telegramBase}${separator}text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer')
    setStatusTone('success')
    setStatusText(copy.footer.statuses.telegramOpened)
  }

  return (
    <MotionSection
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto flex w-full max-w-[1520px] flex-col justify-center px-4 py-16 pb-10 md:px-8 lg:py-24"
      id="contact"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <MotionDiv variants={fadeUpChild} className="mt-20 flex flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs font-semibold tracking-widest text-zinc-400">
          <Sparkles size={14} className="text-emerald-400" />
          {copy.footer.available}
        </div>
        <h2 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tighter text-zinc-100">
          {copy.footer.headlineLine1}
          <br />
          <span className="text-zinc-600">{copy.footer.headlineLine2}</span>
        </h2>
        <a
          href={`mailto:${contactEmail}`}
          className="group mt-12 flex items-center gap-3 rounded-full bg-zinc-100 px-8 py-4 text-base font-bold text-zinc-950 transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
        >
          {copy.footer.getInTouch}
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </a>
      </MotionDiv>

      <MotionDiv variants={fadeUpChild} className="mt-32 rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 shadow-2xl backdrop-blur-md md:p-14">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/45 p-5 md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">{copy.footer.contactFunnel}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-zinc-100">{copy.footer.formTitle}</h3>
            </div>
            <span className="rounded-full border border-zinc-700/80 bg-zinc-900/70 px-3 py-1 text-[11px] font-semibold text-zinc-400">
              {copy.footer.reply}
            </span>
          </div>

          <form className="grid gap-3 md:grid-cols-2" onSubmit={handleEmailSubmit}>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500" htmlFor="contact-name">
                {copy.footer.labels.name}
              </label>
              <input
                id="contact-name"
                type="text"
                value={formValues.name}
                onChange={updateField('name')}
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                placeholder={copy.footer.placeholders.name}
                autoComplete="name"
              />
              {errors.name ? <p className="mt-1 text-xs text-amber-300">{errors.name}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500" htmlFor="contact-email">
                {copy.footer.labels.email}
              </label>
              <input
                id="contact-email"
                type="email"
                value={formValues.email}
                onChange={updateField('email')}
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                placeholder={copy.footer.placeholders.email}
                autoComplete="email"
              />
              {errors.email ? <p className="mt-1 text-xs text-amber-300">{errors.email}</p> : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500" htmlFor="contact-message">
                {copy.footer.labels.message}
              </label>
              <textarea
                id="contact-message"
                value={formValues.message}
                onChange={updateField('message')}
                className="min-h-[120px] w-full rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                placeholder={copy.footer.placeholders.message}
              />
              {errors.message ? <p className="mt-1 text-xs text-amber-300">{errors.message}</p> : null}
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-900 transition hover:bg-white"
              >
                {copy.footer.sendEmail}
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={handleTelegramSubmit}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-200 transition hover:border-zinc-500 hover:text-zinc-100"
              >
                {copy.footer.sendTelegram}
                <Send size={14} />
              </button>
              {statusText ? (
                <p className={`text-xs font-semibold ${statusTone === 'success' ? 'text-emerald-300' : statusTone === 'error' ? 'text-amber-300' : 'text-zinc-500'}`}>
                  {statusText}
                </p>
              ) : (
                <p className="text-xs text-zinc-500">{copy.footer.emailLabel} {contactEmail}</p>
              )}
            </div>
          </form>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="pr-12 xl:border-r xl:border-zinc-800/60">
            <h3 className="text-3xl font-black tracking-tight text-zinc-100">DILIABLE</h3>
            <p className="mt-6 text-[0.95rem] leading-[1.8] text-zinc-400">
              {copy.footer.description}
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="xl:pl-4">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-widest text-zinc-500">{column.title}</p>
              <ul className="space-y-4 text-sm font-semibold text-zinc-300">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {isInternalRoute(link.href) ? (
                      <Link
                        to={link.href}
                        className="group flex w-fit items-center gap-2 transition-colors hover:text-white"
                      >
                        <ArrowRight size={12} className="text-zinc-700 transition-colors group-hover:text-amber-400" />
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="group flex w-fit items-center gap-2 transition-colors hover:text-white"
                      >
                        <ArrowRight size={12} className="text-zinc-700 transition-colors group-hover:text-amber-400" />
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-zinc-800/60 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] font-semibold tracking-wide text-zinc-500">{copy.footer.copyright} <span className="hidden sm:inline">{copy.footer.rights}</span></p>

          <div className="flex items-center gap-3">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100" aria-label="Telegram">
              <Send size={16} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </MotionDiv>
    </MotionSection>
  )
}

export default FooterSection


