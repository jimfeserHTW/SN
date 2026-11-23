import { useTranslation } from 'react-i18next'
import { deckOf, hrefOf, type Chapter } from '../content.ts'

/** Table of contents read straight from the sub-chapter data: every section with all its slides, each linking to its slide. */
export function Contents({ chapter }: { chapter: Chapter }) {
  const { t } = useTranslation()
  const deck = deckOf(chapter) // same slides and order as the presentation, including the automatic learning path
  const href = hrefOf(chapter)
  return (
    <ol className="pagelist">
      {chapter.pages.map((p, i) => {
        const slides = deck.flatMap((d, k) => d.page === p ? [{ title: d.slide.title, n: k + 1 }] : [])
        return (
          <li key={p.id}>
            <a href={`${href}/${slides[0].n}`}>
              <span className="num">{i + 1}</span>
              <span><strong>{t(p.title)}</strong><span>{t(p.summary)}</span></span>
            </a>
            <ol className="slidelist">
              {slides.map(s => <li key={s.n}><a href={`${href}/${s.n}`}><span className="num">{s.n}</span>{t(s.title)}</a></li>)}
            </ol>
          </li>
        )
      })}
    </ol>
  )
}
