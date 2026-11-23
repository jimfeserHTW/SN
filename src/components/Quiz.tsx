import { useEffect, useRef, useState, type ReactNode } from 'react'
import { quizAttempt } from './me.ts'
import { useTranslation } from 'react-i18next'
import { entryOf, findEntry, nextOf, path, quizHref, type Chapter } from '../content.ts'
import { Depth } from './Pages.tsx'
import { QUIZZES } from '../quizzes.ts'
import { blanks, grade, initial, moved, solution, splitGaps, type Answer, type Grade, type Kind, type Task } from './quizModel.ts'
import { Stack } from './Stack.tsx'
import { rich } from './Visuals.tsx'

const KIND: Record<Kind, string> = { choice: 'Multiple choice', gaps: 'Fill in the gaps', figure: 'Complete the diagram', order: 'Put in order', bugs: 'Find the errors', match: 'Match' }
type Ctl = { answer: Answer; result: Grade | null; locked: boolean; change: (f: (a: Answer) => Answer) => void }
const stateOf = (result: Grade | null, i: number) => result ? (result.parts[i] ? 'right' : 'wrong') : ''

function Gap({ spec, i, b }: { spec: string; i: number; b: Ctl }) {
  const { t } = useTranslation()
  const longest = Math.max(...spec.split('|').map(s => s.length), 4)
  return <input className="q-gap" style={{ width: `${Math.min(longest + 3, 24)}ch` }} aria-label={t('Gap {{n}}', { n: i + 1 })} data-state={stateOf(b.result, i)} value={String(b.answer[i] ?? '')} readOnly={b.locked} autoComplete="off" autoCapitalize="off" spellCheck={false}
    onChange={e => { const v = e.target.value; b.change(a => a.map((x, k) => k === i ? v : x)) }} />
}

function Gaps({ task, b }: { task: Extract<Task, { kind: 'gaps' }>; b: Ctl }) {
  const { t } = useTranslation()
  let n = 0
  const parts = splitGaps(t(task.text)).map((p, i) => i % 2 ? <Gap key={i} spec={p} i={n++} b={b} /> : p)
  return task.file ? <div className="q-code"><div className="q-file">{task.file}</div><pre>{parts}</pre></div> : <p className="q-text">{parts}</p>
}

function Figure({ task, b }: { task: Extract<Task, { kind: 'figure' }>; b: Ctl }) {
  const { t } = useTranslation()
  const specs = blanks(task, t), f = task.fig
  const slot = (spec: string) => <Gap spec={spec} i={specs.indexOf(spec)} b={b} />
  if (f.kind === 'stack') return <div className="q-stacks">{f.stacks.map((s, i) => <Stack key={i} {...s} size="s" blank={slot} />)}</div>
  const text = (s: string) => splitGaps(t(s)).map((p, i) => i % 2 ? <span key={i}>{slot(p)}</span> : p)
  return (
    <div className="q-flow">
      {f.nodes.map((n, i) => (
        <div className="q-flow-part" key={i}>
          <div className="q-node">{text(n)}</div>
          {i < f.nodes.length - 1 && <div className="q-link"><span>{f.links?.[i] && text(f.links[i])}</span><i aria-hidden="true">↓</i></div>}
        </div>
      ))}
    </div>
  )
}

/** Drag with mouse or finger; the arrow buttons do the same by keyboard. */
function Order({ task, b }: { task: Extract<Task, { kind: 'order' }>; b: Ctl }) {
  const { t } = useTranslation()
  const root = useRef<HTMLOListElement>(null)
  const [dragged, setDragged] = useState<number | null>(null)
  const shift = (from: number, to: number) => b.change(a => moved(a, from, to))
  const start = (e: React.PointerEvent, pos: number) => {
    if (b.locked || (e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    let cur = pos
    setDragged(b.answer[pos] as number)
    const move = (ev: PointerEvent) => {
      const over = document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLElement>('[data-pos]')
      if (!over || !root.current?.contains(over)) return
      const to = Number(over.dataset.pos)
      if (to !== cur) { shift(cur, to); cur = to }
    }
    const end = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', end); removeEventListener('pointercancel', end); setDragged(null) }
    addEventListener('pointermove', move); addEventListener('pointerup', end); addEventListener('pointercancel', end)
  }
  const [back, forward] = task.inline ? ['←', '→'] : ['↑', '↓']
  return (
    <ol className="q-order" data-inline={!!task.inline} data-code={!!(task.code || task.inline)} ref={root}>
      {b.answer.map((item, pos) => {
        const text = task.items[item as number], label = t(text).replaceAll('`', '')
        return (
          <li key={item as number} data-pos={pos} data-state={stateOf(b.result, pos)} data-dragged={dragged === item} onPointerDown={e => start(e, pos)}>
            <span>{task.code || task.inline ? label : rich(text)}</span>
            {!b.locked && <span className="q-arrows">
              <button type="button" disabled={pos === 0} aria-label={t('Move earlier: {{item}}', { item: label })} onClick={() => shift(pos, pos - 1)}>{back}</button>
              <button type="button" disabled={pos === b.answer.length - 1} aria-label={t('Move later: {{item}}', { item: label })} onClick={() => shift(pos, pos + 1)}>{forward}</button>
            </span>}
          </li>
        )
      })}
    </ol>
  )
}

const toggle = (a: Answer, i: number) => a.includes(i) ? a.filter(x => x !== i) : [...a, i]

function Body({ task, b }: { task: Task; b: Ctl }) {
  const { t } = useTranslation()
  switch (task.kind) {
    case 'choice': {
      const many = task.answer.length > 1
      return (
        <div className="options" role="group" aria-label={t('Answers')}>
          {task.options.map((o, i) => {
            const picked = b.answer.includes(i)
            return <button key={o} type="button" className="option" disabled={b.locked && !picked} aria-pressed={picked} data-picked={picked} data-state={picked ? stateOf(b.result, i) : ''} onClick={() => b.change(a => many ? toggle(a, i) : [i])}>{rich(o)}</button>
          })}
        </div>
      )
    }
    case 'bugs': return (
      <div className="q-code">
        <div className="q-file">{task.file}</div>
        <div className="q-lines" role="group" aria-label={t('Lines')}>
          {task.lines.map((l, i) => {
            const picked = b.answer.includes(i)
            return <button key={i} type="button" disabled={b.locked} aria-pressed={picked} data-picked={picked} data-state={picked ? stateOf(b.result, i) : ''} onClick={() => b.change(a => toggle(a, i))}><span aria-hidden="true">{i + 1}</span><code>{t(l) || ' '}</code></button>
          })}
        </div>
      </div>
    )
    case 'match': {
      const options = task.pairs.map(([, r], i) => ({ i, r: t(r) })).sort((x, y) => x.r.localeCompare(y.r))
      return (
        <div className="q-match">
          {task.pairs.map(([l], i) => (
            <label key={l} data-state={b.answer[i] === -1 ? '' : stateOf(b.result, i)}>
              <strong>{t(l)}</strong>
              <select value={String(b.answer[i])} disabled={b.locked} onChange={e => { const v = Number(e.target.value); b.change(a => a.map((x, k) => k === i ? v : x)) }}>
                <option value="-1">{t('Choose…')}</option>
                {options.map(o => <option key={o.i} value={o.i}>{o.r}</option>)}
              </select>
            </label>
          ))}
        </div>
      )
    }
    case 'order': return <Order task={task} b={b} />
    case 'gaps': return <Gaps task={task} b={b} />
    case 'figure': return <Figure task={task} b={b} />
  }
}

function TaskCard({ task, n, record, onSolved }: { task: Task; n: number; record: (task: number, ok: boolean) => void; onSolved: () => void }) {
  const { t } = useTranslation()
  const [answer, setAnswer] = useState(() => initial(task, t))
  const [result, setResult] = useState<Grade | null>(null)
  const [shown, setShown] = useState(false)
  const solved = !!result?.ok
  const locked = solved || shown
  const change = (f: (a: Answer) => Answer) => { if (!locked) { setAnswer(f); setResult(null) } }
  const check = () => { const g = grade(task, answer, t); setResult(g); record(n - 1, g.ok); if (g.ok) onSolved() }
  const reveal = () => { setAnswer(solution(task, t)); setResult(null); setShown(true) }
  const empty = (task.kind === 'choice' || task.kind === 'bugs') && !answer.length
  const note: ReactNode = task.kind === 'choice' && task.answer.length > 1 ? t('Several answers are correct.') : task.kind === 'bugs' ? t('Lines to mark: {{n}}', { n: task.bad.length }) : task.kind === 'order' ? t('Drag the elements or use the arrows.') : null
  return (
    <article className="q-card" data-solved={solved}>
      <p className="q-kind">{n}. {t(KIND[task.kind])}</p>
      <h2>{rich(task.q)}</h2>
      {note && <p className="dim">{note}</p>}
      <Body task={task} b={{ answer, result, locked, change }} />
      {!locked && <div className="q-actions">
        <button type="button" className="btn" disabled={empty} onClick={check}>{t('Check')}</button>
        {result && <button type="button" className="link-btn" onClick={reveal}>{t('Show solution')}</button>}
      </div>}
      <div role="status">
        {result && !solved && <p className="q-retry">{t('Not quite yet. Change your answer and check again.')}</p>}
        {locked && <div className="why"><div><strong>{t(solved ? 'Correct.' : 'Solution:')} </strong>{rich(task.why)}</div></div>}
      </div>
    </article>
  )
}

function ChapterQuiz({ chapter }: { chapter: Chapter }) {
  const { t } = useTranslation()
  const e = entryOf(chapter)
  const tasks = QUIZZES[e.topic.id]?.[chapter.id] ?? [], next = nextOf(chapter)?.chapter
  const [solved, setSolved] = useState(0)
  const [record] = useState(() => quizAttempt(`${e.topic.id}/${chapter.id}`, tasks.length)) // one attempt per visit
  const h1 = useRef<HTMLHeadingElement>(null)
  useEffect(() => { h1.current?.focus() }, [])
  return (
    <div className="page quiz-page">
      <a className="crumb" href={`#/${e.topic.id}`}>{t(e.topic.title)}{e.strand.title ? ` · ${t(e.strand.title)}` : ''}</a>
      <div className="meta"><Depth entry={e} /></div>
      <h1 ref={h1} tabIndex={-1}>{t(chapter.title)}</h1>
      <p className="quiz-score" role="status"><strong>{solved}</strong> {t('of {{n}} tasks solved', { n: tasks.length })}</p>
      {tasks.map((task, k) => <TaskCard key={k} task={task} n={k + 1} record={record} onSolved={() => setSolved(s => s + 1)} />)}
      <a className="btn lab-next" href={next ? quizHref(next) : '#/labs'}>{next ? t('Next quiz: {{title}}', { title: t(next.title) }) : t('nav.labs')}</a>
    </div>
  )
}

/** #/quiz opens the first sub-chapter, #/quiz/<topic> the first of a topic, #/quiz/<topic>/<sub-chapter> any other. */
export function QuizRoute({ topic, id }: { topic?: string; id?: string }) {
  const e = findEntry(topic, id) ?? path.find(x => x.topic.id === topic) ?? path[0]
  return <ChapterQuiz key={`${e.topic.id}/${e.chapter.id}`} chapter={e.chapter} />
}
