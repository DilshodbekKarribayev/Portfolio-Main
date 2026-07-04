import { useContext } from 'react'
import { LanguageContext } from './languageCore'

export function useI18n() {
  return useContext(LanguageContext)
}
