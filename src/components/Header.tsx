import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { topics, hrefOf, quizHref, type Chapter } from '../content.ts'
import { LAB_LEVELS } from '../labs.ts'

export const Mark = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <rect x="3" y="17" width="12" height="12" rx="3" fill="var(--blue)" />
    <rect x="17" y="17" width="12" height="12" rx="3" fill="#6EA0FF" />
    <rect x="10" y="3" width="12" height="12" rx="3" fill="var(--ink)" />
  </svg>
)

const href = (c: string) => `#/${c}`
type Menu = 'theory' | 'labs' | 'quiz' | 'me'
const LANGS = ['en', 'de'] as const

/** Global bar: hover or focus Theory, Labs or Quiz to open its menu while the page behind softens, like apple.com. */
export function Header({ route, topicId }: { route: string; topicId?: string }) {
  const { t, i18n } = useTranslation()
  const [menu, setMenu] = useState<Menu | null>(null)
  const [sheet, setSheet] = useState(false)
  const timer = useRef(0)
  const show = (m: Menu) => { clearTimeout(timer.current); timer.current = window.setTimeout(() => setMenu(m), 90) }
  const hide = () => { clearTimeout(timer.current); setMenu(null) }
  const meLinks = [{ id: 'stats', href: href('me'), label: t('Statistics') }, { id: 'settings', href: href('me/settings'), label: t('Settings') }]
  const labLinks = [...LAB_LEVELS.map(l => ({ id: l.id, href: href(`labs/${l.id}`), label: t(l.level) })), { id: 'sandbox', href: href('labs/sandbox'), label: t('Docker sandbox') }]
  // Theory and quiz share one map: every topic with its sub-chapters, strand by strand.
  const topicMap = (to: 'theory' | 'quiz') => {
    const sub = (c: Chapter) => to === 'theory' ? hrefOf(c) : quizHref(c)
    return (
      <div className="mega-topics" key={to}>
        {topics.map(tp => (
          <div key={tp.id}>
            <a className="mega-topic" href={to === 'theory' ? href(tp.id) : href(`quiz/${tp.id}`)}>{t(tp.title)}</a>
            {tp.strands.map(s => (
              <ul key={s.id}>
                {s.title && <li className="mega-strand">{t(s.title)}</li>}
                {s.chapters.map(c => <li key={c.id}><a href={sub(c)}>{t(c.title)}</a></li>)}
              </ul>
            ))}
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => { hide(); setSheet(false) }, [route])
  useEffect(() => { document.body.style.overflow = sheet ? 'hidden' : '' }, [sheet])

  return (
    <div className="chrome" onMouseLeave={hide} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) hide() }} onKeyDown={e => { if (e.key === 'Escape') { hide(); setSheet(false) } }}>
      {(menu || sheet) && <div className="scrim" onClick={() => { hide(); setSheet(false) }} onMouseEnter={hide} aria-hidden="true" />}
      <header className="bar">
        <div className="bar-in">
          <a className="brand" href="#/" aria-label={t('home')} onMouseEnter={hide}><Mark /><span aria-hidden="true">S<span className="grow">tudy</span>N<span className="grow">othing</span></span></a>
          <nav className="nav" aria-label={t('nav.label')}>
            <a href={href(topics[0].id)} aria-current={topicId ? 'page' : undefined} aria-expanded={menu === 'theory'} data-open={menu === 'theory'}
              onMouseEnter={() => show('theory')} onFocus={() => show('theory')}>{t('nav.theory')}</a>
            <a href={href('labs')} aria-current={route.startsWith('#/labs') ? 'page' : undefined} aria-expanded={menu === 'labs'} data-open={menu === 'labs'}
              onMouseEnter={() => show('labs')} onFocus={() => show('labs')}>{t('nav.labs')}</a>
            <a href={href('quiz')} aria-current={route.startsWith('#/quiz') ? 'page' : undefined} aria-expanded={menu === 'quiz'} data-open={menu === 'quiz'}
              onMouseEnter={() => show('quiz')} onFocus={() => show('quiz')}>{t('nav.quiz')}</a>
            <a href={href('me')} aria-current={route.startsWith('#/me') ? 'page' : undefined} aria-expanded={menu === 'me'} data-open={menu === 'me'}
              onMouseEnter={() => show('me')} onFocus={() => show('me')}>{t('nav.me')}</a>
          </nav>
          <div className="lang" role="group" aria-label={t('lang')} onMouseEnter={hide}>
            {LANGS.map(l => <button key={l} type="button" aria-pressed={i18n.resolvedLanguage === l} onClick={() => i18n.changeLanguage(l)}>{l.toUpperCase()}</button>)}
          </div>
          <button className="burger" aria-expanded={sheet} aria-label={sheet ? t('closeMenu') : t('openMenu')} onClick={() => setSheet(!sheet)}><i /><i /></button>
        </div>
      </header>

      {menu && (
        <div className="mega">
          <div className="mega-in">
            <div className="mega-side">
              <small>{t(`nav.${menu}`)}</small>
              <p>{t(`${menu}.blurb`)}</p>
            </div>
            {menu === 'labs' || menu === 'me'
              ? <ul className="mega-links" key={menu}>{(menu === 'me' ? meLinks : labLinks).map(l => <li key={l.id}><a href={l.href}>{l.label}</a></li>)}</ul>
              : topicMap(menu)}
          </div>
        </div>
      )}

      {sheet && (
        <nav className="sheet" aria-label={t('nav.label')}>
          <div>
            <span className="sheet-h">{t('nav.theory')}</span>
            {topics.map(tp => <a key={tp.id} className="sheet-l" href={href(tp.id)}>{t(tp.title)}</a>)}
          </div>
          <div>
            <a className="sheet-h" href={href('labs')}>{t('nav.labs')}</a>
            {labLinks.map(l => <a key={l.id} className="sheet-l" href={l.href}>{l.label}</a>)}
          </div>
          <div>
            <a className="sheet-h" href={href('quiz')}>{t('nav.quiz')}</a>
            {topics.map(tp => <a key={tp.id} className="sheet-l" href={href(`quiz/${tp.id}`)}>{t(tp.title)}</a>)}
          </div>
          <div>
            <a className="sheet-h" href={href('me')}>{t('nav.me')}</a>
            {meLinks.map(l => <a key={l.id} className="sheet-l" href={l.href}>{l.label}</a>)}
          </div>
        </nav>
      )}
    </div>
  )
}
