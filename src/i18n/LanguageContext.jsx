import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LANGUAGES,
  getCopy,
  getLocale,
  getSupportedLanguage,
  localizeProjects,
  localizeSkillset,
} from './i18nData'
import { LanguageContext, STORAGE_KEY, baseLanguageData, defaultLanguage } from './languageCore'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(defaultLanguage)

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(getSupportedLanguage(nextLanguage))
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Ignore storage write errors.
    }
  }, [language, setLanguage])

  const value = useMemo(() => {
    const copy = getCopy(language)
    const { baseProjects, baseSkillset, socialLinks } = baseLanguageData

    return {
      language,
      setLanguage,
      languages: LANGUAGES,
      locale: getLocale(language),
      copy,
      navItems: copy.navItems,
      footerColumns: copy.footerColumns,
      projects: localizeProjects(baseProjects, language),
      skillset: localizeSkillset(baseSkillset, language),
      socialLinks,
    }
  }, [language, setLanguage])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
