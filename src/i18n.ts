import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.ts'
import de from './locales/de.ts'
// content first: topic files register their English via e() before the resources are built
import './content.ts'
import { QUIZ_EN } from './quizzes.ts'
import { onLateEnglish } from './components/quizModel.ts'

// Keys are the source text itself (German content, English UI). A missing translation shows the key.
const saved = (() => { try { return localStorage.getItem('lang') } catch { return null } })()

i18n.use(initReactI18next).init({
  resources: { en: { translation: { ...en, ...QUIZ_EN } }, de: { translation: de } },
  lng: saved ?? (navigator.language.startsWith('de') ? 'de' : 'en'),
  fallbackLng: false,
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  // dev aid: window.__missing lists English gaps
  saveMissing: import.meta.env.DEV,
  saveMissingTo: 'current',
  missingKeyHandler: (lngs, _ns, key) => { if (lngs.includes('en')) ((window as any).__missing ??= new Set()).add(key) },
})

onLateEnglish((de, en) => i18n.addResource('en', 'translation', de, en))

const sync = (l: string) => {
  document.documentElement.lang = l
  try { localStorage.setItem('lang', l) } catch { /* storage blocked: language just won't persist */ }
}
sync(i18n.language)
i18n.on('languageChanged', sync)

/** Translate a source string; usable outside React components and in module-level helpers. */
export const t = (s: string, o: Record<string, unknown> = {}) => i18n.t(s, o) as string

export default i18n
