import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { deckOf, entryOf, hrefOf, quizHref, type Chapter, type Entry, type Topic } from '../content.ts'
import { Contents } from './Contents.tsx'

/** How deep a sub-chapter goes: one dot per sub-chapter of its strand, filled up to this one. The first one is the overview. */
export function Depth({ entry, light }: { entry: Entry; light?: boolean }) {
  const { t } = useTranslation()
  const label = entry.depth === 0 ? t('Overview') : t('Depth {{i}} of {{n}}', { i: entry.depth + 1, n: entry.of })
  return (
    <span className="depth" data-light={light || undefined} title={label}>
      <span aria-hidden="true">{Array.from({ length: entry.of }, (_, k) => <i key={k} data-on={k <= entry.depth || undefined} />)}</span>
      {label}
    </span>
  )
}

const useFocus = (key: string) => {
  const h1 = useRef<HTMLHeadingElement>(null)
  useEffect(() => { window.scrollTo({ top: 0 }); h1.current?.focus({ preventScroll: true }) }, [key])
  return h1
}

/** Topic page: every strand with its sub-chapters, from pictures to technical depth. */
export function TopicView({ topic }: { topic: Topic }) {
  const { t } = useTranslation()
  const h1 = useFocus(topic.id)
  return (
    <div className="page">
      <a className="crumb" href="#/">{t('All topics')}</a>
      <h1 ref={h1} tabIndex={-1}>{t(topic.title)}</h1>
      <p className="lead">{t(topic.blurb)}</p>
      <div className="strands" data-n={topic.strands.length}>
        {topic.strands.map(s => (
          <section key={s.id} aria-label={s.title ? t(s.title) : undefined}>
            {s.title && <h2 className="strand-h">{t(s.title)}</h2>}
            <ol className="subs">
              {s.chapters.map(c => {
                const e = entryOf(c)
                return (
                  <li key={c.id}>
                    <a className="sub-card" href={hrefOf(c)}>
                      <Depth entry={e} />
                      <strong>{t(c.title)}</strong>
                      <span>{t(c.blurb)}</span>
                      <small>{t('{{n}} slides', { n: deckOf(c).length })}</small>
                    </a>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Sub-chapter page: what it covers, then start the presentation, jump to a section or take the quiz. */
export function ChapterView({ chapter }: { chapter: Chapter }) {
  const { t } = useTranslation()
  const e = entryOf(chapter)
  const h1 = useFocus(hrefOf(chapter))
  return (
    <div className="page">
      <a className="crumb" href={`#/${e.topic.id}`}>{t(e.topic.title)}{e.strand.title ? ` · ${t(e.strand.title)}` : ''}</a>
      <div className="meta"><Depth entry={e} /></div>
      <h1 ref={h1} tabIndex={-1}>{t(chapter.title)}</h1>
      <p className="lead">{t(chapter.blurb)}</p>
      <div className="actions">
        <a className="btn" href={`${hrefOf(chapter)}/1`}>{t('Start presentation')}</a>
        <a className="btn ghost" href={quizHref(chapter)}>{t('Quiz')}</a>
        <span className="dim">{t('{{n}} slides', { n: deckOf(chapter).length })}</span>
      </div>
      <Contents chapter={chapter} />
    </div>
  )
}
