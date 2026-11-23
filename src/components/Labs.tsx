import { useEffect, useRef, useState } from 'react'
import { labAttempt } from './me.ts'
import { useTranslation } from 'react-i18next'
import { BLANK, LABS, LAB_LEVELS, LabRun, type Lab } from '../labs.ts'
import { Terminal, mergeChunks, type Chunk } from './docker/engine/cli.ts'
import type { Container, Daemon } from './docker/engine/daemon.ts'
import { alive, portsText, statusText } from './docker/engine/util.ts'

/** Tab indents in a code editor. Esc, then Tab leaves it, so keyboard users are never trapped. */
function indentKey(e: React.KeyboardEvent<HTMLTextAreaElement>, esc: { current: boolean }, text: string, set: (s: string) => void) {
  if (e.key === 'Escape') { esc.current = true; return }
  if (e.key !== 'Tab' || e.shiftKey) { esc.current = false; return }
  if (esc.current) { esc.current = false; return }
  e.preventDefault()
  const t = e.currentTarget, a = t.selectionStart
  set(text.slice(0, a) + '  ' + text.slice(t.selectionEnd))
  requestAnimationFrame(() => t.setSelectionRange(a + 2, a + 2))
}

const SANDBOX_FILES: Record<string, string> = {
  'index.html': '<!doctype html>\n<html lang="de">\n  <head><title>Meine Seite</title></head>\n  <body>\n    <h1>Hallo aus dem Container!</h1>\n  </body>\n</html>\n',
  Dockerfile: 'FROM nginx:alpine\nCOPY index.html /usr/share/nginx/html/index.html\nEXPOSE 80\n',
  'compose.yml': 'services:\n  web:\n    build: .\n    ports:\n      - "8080:80"\n',
}
const NO_FILES: Record<string, string> = {}
type TermLine = Chunk & { cmd?: boolean }
type Box = { id: string; name: string; image: string; state: Container['status']; status: string; ports: string }

const snapshot = (d: Daemon): Box[] => [...d.containers.values()].map(c => ({ id: c.id, name: c.name, image: c.image, state: c.status, status: statusText(c, d.clock()), ports: alive(c) ? portsText(c) : '' }))

/** Moves focus to the new page, which also brings its top into view after a hash navigation. */
function Title({ text }: { text: string }) {
  const h1 = useRef<HTMLHeadingElement>(null)
  useEffect(() => { h1.current?.focus() }, [])
  return <h1 ref={h1} tabIndex={-1}>{text}</h1>
}

function Containers({ boxes, wide }: { boxes: Box[]; wide: boolean }) {
  const { t } = useTranslation()
  const running = boxes.filter(b => b.state === 'running').length
  return (
    <section className={wide ? 'boxes wide' : 'boxes'} aria-label={t('Containers')}>
      <p className="boxes-count" role="status"><strong>{running}</strong> <span>{t('of {{n}} containers running', { n: boxes.length })}</span></p>
      {boxes.length === 0 ? <p className="dim">{t('No containers yet.')}</p> : (
        <ul>
          {boxes.map(b => (
            <li key={b.id} data-state={b.state}>
              <strong>{b.name}</strong>
              <span>{b.image}</span>
              <span className="box-status">{b.status}</span>
              {b.ports && <span>{b.ports}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** Task text: parts in `backticks` are what the learner types into the command. */
const Marked = ({ text }: { text: string }) => <>{text.split('`').map((part, i) => i % 2 ? <code key={i} className="cmd-word">{part}</code> : part)}</>

function Steps({ lab, step, insert }: { lab: Lab; step: number; insert: (cmd: string) => void }) {
  const { t } = useTranslation()
  const next = LABS[LABS.indexOf(lab) + 1]
  return (
    <section className="goals lab-steps" aria-label={t('Tasks')}>
      <h3>{t('{{done}} of {{n}} done', { done: step, n: lab.steps.length })}</h3>
      <ul>
        {lab.steps.map((s, i) => (
          <li key={s.label} data-done={i < step} data-active={i === step} aria-current={i === step ? 'step' : undefined}>
            <span aria-hidden="true">{i < step ? '✓' : i + 1}</span>
            <div>
              <Marked text={t(s.label)} />{i < step && <span className="sr"> ({t('done')})</span>}
              {i === step && s.cmd && <button type="button" className="lab-cmd" onClick={() => insert(s.cmd!)} aria-label={t('Insert command: {{cmd}}', { cmd: s.cmd })}><code>{s.cmd}</code></button>}
              {i === step && s.hint && <details><summary>{t('Hint')}</summary><Marked text={t(s.hint)} /></details>}
            </div>
          </li>
        ))}
      </ul>
      {step === lab.steps.length && (
        <div className="lab-done" role="status">
          <strong>{t('Lab complete')}</strong>
          <a className="btn" href={`#/labs/${next?.id ?? 'sandbox'}`}>{next ? t('Next lab: {{title}}', { title: t(next.title) }) : t('Docker sandbox')}</a>
        </div>
      )}
    </section>
  )
}

/** Editor, terminal connected to the simulated Docker daemon and the live container list; with a lab also its tasks. */
function Workbench({ files, lab }: { files: Record<string, string>; lab?: Lab }) {
  const { t } = useTranslation()
  const tabs = Object.keys(files)
  const firstCmd = lab?.steps[0].cmd ?? ''
  const engine = useRef<Terminal>(null)
  engine.current ??= new Terminal(files)
  const labRun = useRef<LabRun>(null)
  labRun.current ??= new LabRun(lab?.steps ?? [])
  const [text, setText] = useState(files)
  const [tab, setTab] = useState(tabs[0])
  const [log, setLog] = useState<TermLine[]>([])
  const [value, setValue] = useState(firstCmd)
  const [busy, setBusy] = useState(false)
  const [redrawing, setRedrawing] = useState(false)
  const [prompt, setPrompt] = useState('$ ')
  const [history, setHistory] = useState<string[]>([])
  const [hist, setHist] = useState(-1)
  const [boxes, setBoxes] = useState<Box[]>([])
  const [step, setStep] = useState(0)
  const esc = useRef(false)
  const body = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const sync = () => {
    const term = engine.current!, out = term.tick(), run = labRun.current!
    if (out.length) setLog(l => mergeChunks<TermLine>(l, out).slice(-4000)) // keeps very chatty containers from slowing the page down
    setRedrawing(out.some(c => c.live !== undefined)) // progress displays redraw constantly: screen readers wait for the result
    setBusy(term.busy)
    setPrompt(term.prompt)
    // commands can change project files too (echo > index.html, docker cp)
    setText(f => tabs.every(n => f[n] === term.read(n)) ? f : Object.fromEntries(tabs.map(n => [n, term.read(n)])))
    const next = snapshot(term.d)
    setBoxes(b => JSON.stringify(b) === JSON.stringify(next) ? b : next)
    run.printed(out.map(c => c.text).join(''))
    if (lab && !term.busy) setStep(run.check(term)) // at the prompt, so a step's output never counts for the next one
  }
  // Containers keep running while you type, so the terminal follows them on a timer.
  useEffect(() => { const id = setInterval(sync, 120); return () => clearInterval(id) }, [])
  useEffect(() => { const b = body.current; if (b) b.scrollTop = b.scrollHeight }, [log, prompt])
  const [record] = useState(() => lab && labAttempt(lab.id, lab.steps.length)) // one attempt per visit
  useEffect(() => { if (record && step > 0) record(step) }, [step])

  const selectBlank = (from = 0) => {
    const el = input.current, i = el ? el.value.indexOf(BLANK, from) : -1
    if (i >= 0) el!.setSelectionRange(i, i + BLANK.length)
    return i >= 0
  }
  // The next prepared command appears by itself, unless the learner is already typing.
  useEffect(() => {
    const cmd = lab?.steps[step]?.cmd
    if (!cmd) return
    setValue(v => v.trim() ? v : cmd)
    requestAnimationFrame(() => { if (document.activeElement === input.current) selectBlank() })
  }, [step])
  const insert = (cmd: string) => { setValue(cmd); requestAnimationFrame(() => { input.current?.focus(); selectBlank() }) }

  const edit = (s: string) => { engine.current!.write(tab, s); setText(f => ({ ...f, [tab]: s })) }
  const submit = () => {
    const term = engine.current!, cmd = value
    if (term.busy) return
    if (cmd.includes(BLANK)) { selectBlank(); return }
    setValue(''); setHist(-1)
    setLog(l => [...l, { text: prompt + cmd + '\n', err: false, cmd: true }])
    if (cmd.trim()) { setHistory(h => [...h, cmd]); labRun.current!.typed(cmd) }
    if (cmd.trim() === 'clear') { setLog([]); return }
    term.input(cmd)
    sync()
  }
  const interrupt = () => { engine.current!.interrupt(); sync() }
  const reset = () => {
    engine.current = new Terminal(files); labRun.current = new LabRun(lab?.steps ?? [])
    setText(files); setLog([]); setValue(firstCmd); setHistory([]); setHist(-1); setBusy(false); setPrompt('$ '); setBoxes([]); setStep(0)
  }
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === 'c') { e.preventDefault(); interrupt(); return }
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); setLog([]); return }
    // Tab walks through the gaps; after the last one it leaves the terminal as usual.
    if (e.key === 'Tab' && !e.shiftKey && selectBlank(e.currentTarget.selectionEnd ?? 0)) { e.preventDefault(); return }
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); const h = Math.min(hist + 1, history.length - 1); setHist(h); setValue(history[history.length - 1 - h]) }
    if (e.key === 'ArrowDown') { e.preventDefault(); const h = Math.max(hist - 1, -1); setHist(h); setValue(h < 0 ? '' : history[history.length - 1 - h]) }
  }

  const editor = tabs.length > 0 && (
    <div className="editor">
      <div className="term-bar sandbox-tabs" role="tablist" aria-label={t('Project files')}>
        {tabs.map(n => <button key={n} role="tab" aria-selected={tab === n} onClick={() => setTab(n)}>{n}</button>)}
      </div>
      <textarea aria-label={tab} value={text[tab]} onChange={e => edit(e.target.value)} onKeyDown={e => indentKey(e, esc, text[tab], edit)} spellCheck={false} />
      <div className="actions"><small>{t('Esc, then Tab leaves the editor.')}</small></div>
    </div>
  )
  return (
    <div className="sandbox">
      {lab ? <Steps lab={lab} step={step} insert={insert} /> : editor}
      <div className="term" onClick={e => { if (e.target !== input.current && !getSelection()?.toString()) { input.current?.focus(); selectBlank() } }}>
        <div className="term-bar">
          <span>{t('Terminal')}</span>
          <span className="sandbox-tools">
            {busy && <button className="link-btn" onClick={interrupt}>{t('Stop (Ctrl+C)')}</button>}
            <button className="link-btn" onClick={reset}>{t('Reset')}</button>
          </span>
        </div>
        <div className="term-body" ref={body} role="log" aria-live="polite" aria-busy={redrawing}>
          {log.length === 0 && <div className="dim">{t(lab ? 'Type help for a list of commands.' : 'Try: docker compose up -d --build, then curl localhost:8080. Type help for more.')}</div>}
          <pre>{log.map((l, i) => <span key={i} className={l.cmd ? 'term-cmd' : l.err ? 'term-err' : undefined}>{l.text}</span>)}</pre>
          {/* stays mounted while a command runs, so focus and Ctrl+C keep working */}
          <form onSubmit={e => { e.preventDefault(); submit() }} className="term-line">
            <span className="ps" aria-hidden="true">{busy ? '' : prompt.trim()}</span>
            <input ref={input} aria-label={t('Command')} value={value} readOnly={busy} onChange={e => setValue(e.target.value)} onKeyDown={onKey} onFocus={() => selectBlank()} autoComplete="off" autoCapitalize="off" spellCheck={false} />
          </form>
        </div>
      </div>
      {lab && editor}
      <Containers boxes={boxes} wide={!lab || !tabs.length} />
    </div>
  )
}

function LabLevel({ current }: { current: typeof LAB_LEVELS[number] }) {
  const { t } = useTranslation()
  const index = LAB_LEVELS.indexOf(current), next = LAB_LEVELS[index + 1]
  return (
    <div className="page sandbox-page">
      <div className="meta"><span className="level">{t('Level {{i}} of {{n}}', { i: index + 1, n: LAB_LEVELS.length })}</span></div>
      <Title text={t(current.level)} />
      <p className="lead">{t(current.help)}</p>
      <ul className="lab-list">
        {LABS.filter(l => l.level === current.level).map(l => (
          <li key={l.id}>
            <a href={`#/labs/${l.id}`}>
              <span className="lab-n">{LABS.indexOf(l) + 1}</span>
              <strong>{t(l.title)}</strong>
              <span>{t(l.blurb)}</span>
              <span className="lab-boxes" role="img" aria-label={t('{{n}} containers', { n: l.containers })}>{Array.from({ length: l.containers }, (_, i) => <i key={i} />)}</span>
            </a>
          </li>
        ))}
      </ul>
      <a className="btn lab-next" href={`#/labs/${next?.id ?? 'sandbox'}`}>{next ? t('Next level: {{level}}', { level: t(next.level) }) : t('Docker sandbox')}</a>
    </div>
  )
}

/** #/labs opens the first level, #/labs/<level> any level, #/labs/<lab> one lab, #/labs/sandbox the free playground. */
export function LabsRoute({ id }: { id?: string }) {
  const { t } = useTranslation()
  const lab = LABS.find(l => l.id === id)
  const localized = (files: Record<string, string>) => Object.fromEntries(Object.entries(files).map(([name, text]) => [name, t(text)]))
  if (id === 'sandbox') return (
    <div className="page sandbox-page">
      <a className="crumb" href="#/labs">{t('nav.labs')}</a>
      <Title text={t('Docker sandbox')} />
      <p className="lead">{t('Edit the three files and start them in the terminal. Everything runs simulated in your browser.')}</p>
      <Workbench files={localized(SANDBOX_FILES)} />
    </div>
  )
  if (!lab) { const level = LAB_LEVELS.find(l => l.id === id) ?? LAB_LEVELS[0]; return <LabLevel key={level.id} current={level} /> }
  const home = LAB_LEVELS.find(l => l.level === lab.level)!
  return (
    <div className="page sandbox-page" key={lab.id}>
      <a className="crumb" href={`#/labs/${home.id}`}>{t('nav.labs')} · {t(lab.level)}</a>
      <Title text={t(lab.title)} />
      <p className="lead">{t(lab.blurb)}</p>
      <Workbench files={localized(lab.files ?? NO_FILES)} lab={lab} />
    </div>
  )
}
