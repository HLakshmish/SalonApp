import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, translations } from './translations'

const STORAGE_KEY = 'salonAppLanguage'
const DEFAULT_LANGUAGE = 'en'

const LanguageContext = createContext(null)

function interpolate(text, params = {}) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    text,
  )
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.some((lang) => lang.code === stored) ? stored : DEFAULT_LANGUAGE
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (code) => {
    if (LANGUAGES.some((lang) => lang.code === code)) {
      setLanguageState(code)
    }
  }

  const t = (key, params) => {
    const text = translations[language]?.[key] ?? translations.en[key] ?? key
    return interpolate(text, params)
  }

  const value = useMemo(() => ({ language, setLanguage, t, languages: LANGUAGES }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation()

  return (
    <div className="language-switcher">
      <label className="language-switcher-label" htmlFor="language-select">
        {t('language')}
      </label>
      <select
        id="language-select"
        className="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t('language')}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  )
}
