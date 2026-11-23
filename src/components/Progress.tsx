import { at } from './Stack.tsx'
import { t } from '../i18n.ts'
import { topics, type Entry, type Page } from '../content.ts'

/** Learning path: every topic as a stop (the introduction in green), then the sub-chapters of the current topic, strand by strand.
 *  A deck in parts (the introduction: Docker, then Compose) lists its parts instead, with `part` as the current one.
 *  Everything up to the current stop is drawn solid. */
export function Progress({ current, part }: { current: Entry; part?: Page }) {
  const here = topics.indexOf(current.topic)
  const parts = current.chapter.pages.filter(p => p.part), partAt = part ? parts.indexOf(part) : -1
  return (
    <div className="lp">
      <ol className="path">
        {topics.map((tp, k) => (
          <li key={tp.id} style={at(k)} data-tier={k === 0 ? 'intro' : 'topic'} data-on={k === here || undefined} data-done={k <= here || undefined}>
            <i />
            <span>{t(tp.title)}</span>
          </li>
        ))}
      </ol>
      <div className="lp-topic" style={at(topics.length)}>
        <b>{t(current.topic.title)}</b>
        {parts.length > 1 ? (
          <div className="lp-strand"><ol>
            {parts.map((p, d) => <li key={p.id} data-on={d === partAt || undefined} data-done={d <= partAt || undefined}><i>{d + 1}</i><span>{t(p.part!)}</span></li>)}
          </ol></div>
        ) : current.topic.strands.map(s => (
          <div className="lp-strand" key={s.id}>
            {s.title && <small>{t(s.title)}</small>}
            <ol>
              {s.chapters.map((c, d) => {
                const on = c === current.chapter, done = s === current.strand && d <= current.depth
                return <li key={c.id} data-on={on || undefined} data-done={done || undefined}><i>{d + 1}</i><span>{t(c.title)}</span></li>
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
