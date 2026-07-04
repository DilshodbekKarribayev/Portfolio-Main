import {
  LANGUAGES,
  getCopy,
  getLocale,
  getSupportedLanguage,
  localizeProjects,
  localizeSkillset,
} from './i18nData'
import {
  projects as baseProjects,
  skillset as baseSkillset,
  socialLinks,
} from '../data/siteData'
import { createContext } from 'react'

export const STORAGE_KEY = 'diliable-language'

function readInitialLanguage() {
  if (typeof window === 'undefined') return 'en'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return getSupportedLanguage(stored)
  } catch {
    // Ignore storage access errors.
  }

  const browserLanguage = window.navigator?.language?.toLowerCase() || ''
  return browserLanguage.startsWith('uz') ? 'uz' : 'en'
}

export const defaultLanguage = readInitialLanguage()

export const baseLanguageData = {
  baseProjects,
  baseSkillset,
  socialLinks,
}

export const defaultLanguageValue = {
  language: defaultLanguage,
  setLanguage: () => {},
  languages: LANGUAGES,
  locale: getLocale(defaultLanguage),
  copy: getCopy(defaultLanguage),
  navItems: getCopy(defaultLanguage).navItems,
  footerColumns: getCopy(defaultLanguage).footerColumns,
  projects: localizeProjects(baseProjects, defaultLanguage),
  skillset: localizeSkillset(baseSkillset, defaultLanguage),
  socialLinks,
}

export const LanguageContext = createContext(defaultLanguageValue)
