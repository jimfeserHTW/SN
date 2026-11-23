import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { topics, hrefOf, firstOf } from '../content.ts'

const SCRIPT = '$ docker run -d -p 8080:8080 mensa-api:1.0\n3f9c0a1b7d2e4c58a6b1\n$ docker ps\nIMAGE          STATUS        PORTS\nmensa-api:1.0  Up 2 seconds  0.0.0.0:8080->8080/tcp'

function Demo() {
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState(reduced ? SCRIPT.length : 0)
  useEffect(() => {
    if (n >= SCRIPT.length) return
    const t = setTimeout(() => setN(n + 1), SCRIPT[n] === '\n' ? 350 : 32)
    return () => clearTimeout(t)
  }, [n])
  return (
    <div className="term hero-term" aria-hidden="true">
      <div className="term-bar"><span>terminal</span></div>
      <pre className="term-body">{SCRIPT.slice(0, n)}<span className="caret" /></pre>
    </div>
  )
}

export function Landing() {
  const { t } = useTranslation()
  return (
    <>
      <section className="hero">
        <div>
          <h1>{t('Docker, layer by layer.')}</h1>
          <p className="lead">{t('One introduction, then one topic after another: each starts simply and goes deeper step by step.')}</p>
          <div className="actions">
            <a className="btn" href={hrefOf(firstOf(topics[0]))}>{t('Start with the introduction')}</a>
            <a className="btn ghost" href="#topics">{t('See all topics')}</a>
          </div>
        </div>
        <Demo />
      </section>

      <section id="topics" className="bento" aria-label={t('Topics')}>
        {topics.map(tp => (
          <article className="tile" key={tp.id}>
            <a className="tile-h" href={`#/${tp.id}`}><h2>{t(tp.title)}</h2></a>
            <p>{t(tp.blurb)}</p>
            {tp.strands.map(s => (
              <div className="tile-strand" key={s.id}>
                {s.title && <small>{t(s.title)}</small>}
                <ol className="layers">
                  {s.chapters.map(c => <li key={c.id}><a href={hrefOf(c)}>{t(c.title)}</a></li>)}
                </ol>
              </div>
            ))}
          </article>
        ))}
      </section>
    </>
  )
}
