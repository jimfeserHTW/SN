import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deckOf, path, topics, type Entry } from '../content.ts'
import { QUIZZES } from '../quizzes.ts'
import { LABS, LAB_LEVELS } from '../labs.ts'
import { Share } from './Share.tsx'
import { activity, latestAt, load, resetSlides, seenAt, setFullscreen, type Me } from './me.ts'

const pct = (a: number, b: number) => b ? Math.round(a / b * 100) : 0
const sum = <T,>(xs: T[], f: (x: T) => number) => xs.reduce((a, x) => a + f(x), 0)
const keyOf = (e: Entry) => `${e.topic.id}/${e.chapter.id}`
const decks = path.map(e => ({ e, key: keyOf(e), slides: deckOf(e.chapter).length, tasks: QUIZZES[e.topic.id]?.[e.chapter.id]?.length ?? 0 }))
const BLUE = '#1d63ed', ORANGE = '#e8590c' // validated pair: dataviz validate_palette, light surface

/** The whole state at time t, as percentages: what the dashboard shows today and every point of the charts. */
function snapshot(m: Me, t = Infinity) {
  const seen = seenAt(m, t), { quiz, labs } = latestAt(m, t)
  const rows = decks.map(d => {
    const q = quiz[d.key]
    return { ...d, seen: Math.min(seen[d.key]?.size ?? 0, d.slides), solved: q ? Math.min(q.solved.length, d.tasks) : 0, correct: q?.correct ?? 0, checks: q?.checks ?? 0 }
  })
  const labRows = LABS.map(l => ({ l, done: Math.min(labs[l.id]?.done ?? 0, l.steps.length), of: l.steps.length }))
  const parts = [
    { done: sum(rows, r => r.seen), of: sum(rows, r => r.slides) },
    { done: sum(rows, r => r.solved), of: sum(rows, r => r.tasks) },
    { done: sum(labRows, l => l.done), of: sum(labRows, l => l.of) },
  ]
  const correct = (rs: typeof rows) => { const c = sum(rs, r => r.checks); return c ? pct(sum(rs, r => r.correct), c) : null }
  const topic = (id: string) => { const rs = rows.filter(r => r.e.topic.id === id); return { done: pct(sum(rs, r => r.seen + r.solved), sum(rs, r => r.slides + r.tasks)), correct: correct(rs) } }
  return { rows, labRows, parts, overall: Math.round(sum(parts, p => pct(p.done, p.of)) / parts.length), correct: correct(rows), topic }
}

/** Days from the first activity (at most 30 days back, at least 7) up to today. */
function days(m: Me, now = Date.now()) {
  const first = Math.min(now, ...m.slides.map(s => s[0]), ...m.quiz.map(q => q.at), ...m.labs.map(l => l.at))
  const today = new Date(now), start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const back = Math.min(29, Math.max(6, Math.ceil((start.getTime() - first) / 864e5)))
  return Array.from({ length: back + 1 }, (_, k) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() - back + k)
    return { date: d, end: k === back ? now : new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() - 1 }
  })
}

/** One horizontal progress bar with its count written next to it, so the value never depends on the bar alone. */
function Meter({ done, of, label, bare }: { done: number; of: number; label: string; bare?: boolean }) {
  const { t } = useTranslation()
  return (
    <div className="meter-row">
      <div className="meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={of} aria-valuenow={done}><span style={{ width: `${pct(done, of)}%` }} /></div>
      {!bare && <span className="meter-n">{of ? t('{{a}} of {{b}}', { a: done, b: of }) : '–'}</span>}
    </div>
  )
}

type Series = { name: string; color: string; values: (number | null)[] }
/** Percent over days: one axis 0–100 %, 2px lines, a dot on the latest value, crosshair and tooltip on hover. */
function LineChart({ labels, series, label, small }: { labels: string[]; series: Series[]; label: string; small?: boolean }) {
  const W = small ? 420 : 880, H = small ? 150 : 240, L = 44, R = 14, T = 12, B = 26
  const n = labels.length, step = (W - L - R) / Math.max(n - 1, 1)
  const x = (i: number) => L + i * step, y = (v: number) => T + (1 - v / 100) * (H - T - B)
  const [hover, setHover] = useState<number | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const move = (ev: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width * W
    setHover(Math.min(n - 1, Math.max(0, Math.round((px - L) / step))))
  }
  const line = (vs: (number | null)[]) => vs.map((v, i) => v === null ? '' : `${i && vs[i - 1] !== null ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ')
  const lastOf = (vs: (number | null)[]) => { for (let i = vs.length - 1; i >= 0; i--) if (vs[i] !== null) return i; return -1 }
  return (
    <div className="chart">
      <div className="legend" data-small={small || undefined}>{series.map(s => { const i = lastOf(s.values); return <span key={s.name}><i style={{ background: s.color }} />{s.name} <b>{i < 0 ? '–' : `${s.values[i]} %`}</b></span> })}</div>
      <div className="chart-plot">
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} onPointerMove={move} onPointerLeave={() => setHover(null)}>
          {[0, 50, 100].map(v => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="chart-grid" /><text x={L - 8} y={y(v) + 4} textAnchor="end" className="chart-ax">{v} %</text></g>)}
          {[0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i).map(i => <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} className="chart-ax">{labels[i]}</text>)}
          {series.map(s => <path key={s.name} d={line(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />)}
          {series.map(s => { const i = lastOf(s.values); return i < 0 ? null : <circle key={s.name} cx={x(i)} cy={y(s.values[i]!)} r={4} fill={s.color} stroke="#fff" strokeWidth={2} /> })}
          {hover !== null && <g>
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} className="chart-cross" />
            {series.map(s => s.values[hover] === null ? null : <circle key={s.name} cx={x(hover)} cy={y(s.values[hover]!)} r={5} fill={s.color} stroke="#fff" strokeWidth={2} />)}
          </g>}
          <rect x={L} y={0} width={W - L - R} height={H} fill="transparent" />
        </svg>
        {hover !== null && (
          <div className="chart-tip" style={{ left: `${x(hover) / W * 100}%` }} data-flip={hover > n / 2 || undefined}>
            <b>{labels[hover]}</b>
            {series.map(s => <span key={s.name}><i style={{ background: s.color }} />{s.name}: {s.values[hover] === null ? '–' : `${s.values[hover]} %`}</span>)}
          </div>
        )}
      </div>
    </div>
  )
}

/** The last attempts as small bars, newest on the right; each bar is how much of that attempt was solved. */
function Attempts({ tries }: { tries: { at: number; share: number; note: string }[] }) {
  const { i18n } = useTranslation()
  const last = tries.slice(-10)
  if (!last.length) return null
  return (
    <svg className="tries" viewBox={`0 0 ${last.length * 9} 28`} style={{ width: last.length * 9 }} role="img" aria-label={last.map(a => a.note).join('; ')}>
      {last.map((a, k) => {
        const h = Math.max(2, a.share * 24)
        return <rect key={a.at} x={k * 9} y={26 - h} width={7} height={h} rx={2} fill={k === last.length - 1 ? BLUE : '#9dbcf6'}>
          <title>{`${new Date(a.at).toLocaleString(i18n.language, { dateStyle: 'short', timeStyle: 'short' })}: ${a.note}`}</title>
        </rect>
      })}
    </svg>
  )
}

const WINDOWS: [string, number][] = [['Last 24 hours', 864e5], ['Last 7 days', 7 * 864e5], ['Last 30 days', 30 * 864e5]]

function Stats() {
  const { t, i18n } = useTranslation()
  const [m, setM] = useState(load)
  const now = snapshot(m)
  const timeline = days(m), snaps = timeline.map(d => snapshot(m, d.end))
  const labels = timeline.map(d => d.date.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' }))
  const reset = (keys: string[]) => { resetSlides(keys); setM(load()) }
  const quizTries = (key: string) => m.quiz.filter(q => q.deck === key)
  const labTries = (id: string) => m.labs.filter(l => l.lab === id)
  const avg = (xs: number[]) => xs.length ? Math.round(sum(xs, x => x) / xs.length * 100) : null
  const parts = [t('Slides seen'), t('Quiz: latest attempt'), t('Labs: latest attempt')]
  const done = t('Completed'), right = t('Answers correct')
  return (
    <>
      <section className="me-tiles" aria-label={t('Overview')}>
        <div className="me-tile me-hero">
          <small>{t('Learning progress')}</small>
          <strong>{now.overall} %</strong>
          <Meter done={now.overall} of={100} label={t('Learning progress')} bare />
        </div>
        {now.parts.map((p, k) => (
          <div key={parts[k]} className="me-tile">
            <small>{parts[k]}</small>
            <strong>{pct(p.done, p.of)} %</strong>
            <Meter done={p.done} of={p.of} label={parts[k]} />
          </div>
        ))}
      </section>

      <section>
        <h2>{t('Progress over time')}</h2>
        <LineChart labels={labels} label={t('Progress over time')} series={[
          { name: done, color: BLUE, values: snaps.map(s => s.overall) },
          { name: right, color: ORANGE, values: snaps.map(s => s.correct) },
        ]} />
        <details className="me-details">
          <summary>{t('Show as table')}</summary>
          <table className="me-plain">
            <thead><tr><th>{t('Day')}</th><th>{done}</th><th>{right}</th></tr></thead>
            <tbody>{snaps.map((s, k) => <tr key={k}><td>{labels[k]}</td><td>{s.overall} %</td><td>{s.correct === null ? '–' : `${s.correct} %`}</td></tr>)}</tbody>
          </table>
        </details>
      </section>

      <section>
        <h2>{t('Topics over time')}</h2>
        <div className="me-multiples">
          {topics.map(tp => (
            <div key={tp.id} className="me-tile">
              <h3>{t(tp.title)}</h3>
              <LineChart small labels={labels} label={t(tp.title)} series={[
                { name: done, color: BLUE, values: snaps.map(s => s.topic(tp.id).done) },
                { name: right, color: ORANGE, values: snaps.map(s => s.topic(tp.id).correct) },
              ]} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>{t('Activity')}</h2>
        <div className="me-tiles me-three">
          {WINDOWS.map(([label, ms]) => {
            const a = activity(m, ms)
            return (
              <div key={label} className="me-tile">
                <small>{t(label)}</small>
                <strong>{a.exercises}</strong>
                <span className="dim">{t('exercises')}</span>
                <span className="me-score">{t('Average score')}: <b>{a.score === null ? '–' : `${Math.round(a.score * 100)} %`}</b></span>
                {a.checks > 0 && <span className="dim">{t('from {{count}} quiz checks', { count: a.checks })}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div className="me-head">
          <h2>{t('Slide sets and quizzes')}</h2>
          <button type="button" className="link-btn" disabled={!now.rows.some(r => r.seen)} onClick={() => { if (confirm(t('Reset the progress of all slide sets?'))) reset(decks.map(d => d.key)) }}>{t('Reset all slide sets')}</button>
        </div>
        {topics.map(tp => (
          <div key={tp.id} className="me-group">
            <h3>{t(tp.title)}</h3>
            <div className="me-table" role="table" aria-label={t(tp.title)}>
              <div className="me-tr me-th" role="row"><span role="columnheader">{t('Sub-chapter')}</span><span role="columnheader">{t('Slides')}</span><span role="columnheader">{t('Quiz: latest attempt')}</span></div>
              {now.rows.filter(r => r.e.topic === tp).map(r => {
                const tries = quizTries(r.key), a = avg(tries.map(q => q.total ? q.solved.length / q.total : 0))
                return (
                  <div key={r.key} className="me-tr" role="row">
                    <span role="cell">{t(r.e.chapter.title)}</span>
                    <span role="cell" className="me-cell">
                      <Meter done={r.seen} of={r.slides} label={t('Slides')} />
                      <span className="me-sub">
                        {r.seen === r.slides ? <b className="me-done">✓ {t('completed')}</b> : null}
                        {r.seen > 0 && <button type="button" className="link-btn" onClick={() => reset([r.key])}>{t('Reset')}</button>}
                      </span>
                    </span>
                    <span role="cell" className="me-cell">
                      <Meter done={r.solved} of={r.tasks} label={t('Quiz: latest attempt')} />
                      {tries.length > 0 && <span className="me-sub">
                        <Attempts tries={tries.map(q => ({ at: q.at, share: q.total ? q.solved.length / q.total : 0, note: t('{{a}} of {{b}} solved, {{c}} % correct', { a: q.solved.length, b: q.total, c: pct(q.correct, q.checks) }) }))} />
                        <span className="dim">{t('Ø {{p}} % · {{count}} attempts', { p: a, count: tries.length })}</span>
                      </span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2>{t('nav.labs')}</h2>
        {LAB_LEVELS.map(lv => (
          <div key={lv.id} className="me-group">
            <h3>{t(lv.level)}</h3>
            <div className="me-table me-two" role="table" aria-label={t(lv.level)}>
              <div className="me-tr me-th" role="row"><span role="columnheader">Lab</span><span role="columnheader">{t('Latest attempt')}</span></div>
              {now.labRows.filter(x => x.l.level === lv.level).map(x => {
                const tries = labTries(x.l.id), a = avg(tries.map(l => l.total ? l.done / l.total : 0))
                return (
                  <div key={x.l.id} className="me-tr" role="row">
                    <a role="cell" href={`#/labs/${x.l.id}`}>{t(x.l.title)}</a>
                    <span role="cell" className="me-cell">
                      <Meter done={x.done} of={x.of} label={t('Latest attempt')} />
                      {tries.length > 0 && <span className="me-sub">
                        <Attempts tries={tries.map(l => ({ at: l.at, share: l.total ? l.done / l.total : 0, note: t('{{a}} of {{b}} steps', { a: l.done, b: l.total }) }))} />
                        <span className="dim">{t('Ø {{p}} % · {{count}} attempts', { p: a, count: tries.length })}</span>
                      </span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

/** Fullscreen needs a user gesture, so the switch asks the browser directly; leaving with Esc turns the setting off. */
function Settings() {
  const { t } = useTranslation()
  const [on, setOn] = useState(() => load().fullscreen)
  const [blocked, setBlocked] = useState(false)
  useEffect(() => {
    const sync = () => setOn(load().fullscreen)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  const toggle = async () => {
    setBlocked(false)
    if (on) {
      setFullscreen(false); setOn(false)
      if (document.fullscreenElement) await document.exitFullscreen()
      return
    }
    setFullscreen(true) // before the request: its fullscreenchange event already reads the setting
    try {
      await document.documentElement.requestFullscreen()
      setOn(true)
    } catch { setFullscreen(false); setBlocked(true) }
  }
  return (
    <section className="me-settings">
      <label className="me-switch">
        <span>
          <strong>{t('Fullscreen')}</strong>
          <span className="dim">{t('Shows the whole site in fullscreen, like an app of its own. Press Esc to leave it.')}</span>
        </span>
        <input type="checkbox" role="switch" checked={on} onChange={toggle} />
      </label>
      {blocked && <p className="q-retry" role="status">{t('Your browser does not allow fullscreen here.')}</p>}
    </section>
  )
}

/** #/me shows the statistics, #/me/settings the settings, #/me/share the QR codes. */
export function MeRoute({ id }: { id?: string }) {
  const { t } = useTranslation()
  const settings = id === 'settings', share = id === 'share'
  return (
    <div className="page me-page">
      <a className="crumb" href="#/me">{t('nav.me')}</a>
      <h1>{t(share ? 'Share StudyNothing' : settings ? 'Settings' : 'Statistics')}</h1>
      <p className="lead">{t(share ? 'Scan with your phone: the source code on GitHub, or the learning platform itself.' : 'Stored only in this browser. Clearing the site data deletes it.')}</p>
      {share ? <Share /> : settings ? <Settings /> : <Stats />}
    </div>
  )
}

/** On load: if fullscreen was switched on, browsers still need one click or key press before they allow it again. */
export function keepFullscreen() {
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) setFullscreen(false) })
  if (!load().fullscreen || !document.documentElement.requestFullscreen) return
  const go = () => { if (load().fullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}) }
  addEventListener('pointerdown', go, { once: true })
  addEventListener('keydown', go, { once: true })
}
