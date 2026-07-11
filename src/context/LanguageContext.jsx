import { createContext, useContext, useEffect, useState } from 'react'
import { translations, LANGS } from '../i18n/translations'

const LanguageContext = createContext()
const CODES = LANGS.map((l) => l.code)
const DEFAULT_LANG = 'ru' // site opens in Russian

function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('gab-lang')
    return CODES.includes(saved) ? saved : DEFAULT_LANG
  })

  useEffect(() => {
    localStorage.setItem('gab-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (code) => { if (CODES.includes(code)) setLangState(code) }

  /* Translate a UI key. Supports {var} interpolation and an optional
     string fallback (2nd arg as string) when the key is missing. */
  const t = (key, vars) => {
    let val = resolve(translations[lang], key)
    if (val == null) val = resolve(translations.en, key)
    if (val == null) return typeof vars === 'string' ? vars : key
    if (vars && typeof vars === 'object') {
      val = String(val).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''))
    }
    return val
  }

  /* Localize a DATA field that may be a plain string or a
     { ru, en, uz } object (e.g. product/category names from the API). */
  const tl = (field) => {
    if (field == null) return ''
    if (typeof field === 'string') return field
    return field[lang] ?? field.en ?? field.ru ?? Object.values(field)[0] ?? ''
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tl, langs: LANGS }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LanguageContext)
