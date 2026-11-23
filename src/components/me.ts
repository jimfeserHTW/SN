// "Mein Bereich": learning progress and settings. Stored only in this browser's localStorage (key "me"),
// so it survives closing the page but is gone after clearing site data. Nothing leaves the device.
// Everything is kept as timestamped events, so any day's state can be replayed for the charts.

/** One quiz visit in which at least one task was checked. */
export type QuizTry = { deck: string; at: number; total: number; solved: number[]; checks: number; correct: number }
/** One lab visit in which at least one step was finished. */
export type LabTry = { lab: string; at: number; total: number; done: number }
export type Me = {
  /** [time, "topic/chapter", slide (1-based)]: first view of a slide since the last reset; slide 0 marks a reset */
  slides: [number, string, number][]
  quiz: QuizTry[]
  labs: LabTry[]
  /** every quiz check and every finished lab step: [time, kind, correct] */
  log: [number, 'q' | 'l', 0 | 1][]
  fullscreen: boolean
}
const KEY = 'me'
const empty = (): Me => ({ slides: [], quiz: [], labs: [], log: [], fullscreen: false })

export const load = (): Me => {
  try {
    const m = { ...empty(), ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
    return Array.isArray(m.slides) && Array.isArray(m.quiz) && Array.isArray(m.labs) ? m : { ...empty(), fullscreen: !!m.fullscreen } // an older shape: start fresh
  } catch { return empty() }
}
const edit = (f: (m: Me) => void) => {
  const m = load()
  f(m)
  m.log = m.log.slice(-5000) // shortcut: caps storage; only the 30-day window reads it, raise the cap if heavy users lose old entries
  m.quiz = m.quiz.slice(-2000)
  m.labs = m.labs.slice(-2000)
  try { localStorage.setItem(KEY, JSON.stringify(m)) } catch { /* storage blocked or full: progress just isn't kept */ }
}

/** Slides seen per deck at time t: every slide viewed since that deck's last reset. */
export function seenAt(m: Me, t = Infinity) {
  const seen: Record<string, Set<number>> = {}
  for (const [at, deck, n] of m.slides) if (at <= t) { if (n === 0) seen[deck] = new Set(); else (seen[deck] ??= new Set()).add(n) }
  return seen
}
/** The latest attempt per quiz deck and per lab that had started by time t. */
export function latestAt(m: Me, t = Infinity) {
  const quiz: Record<string, QuizTry> = {}, labs: Record<string, LabTry> = {}
  for (const q of m.quiz) if (q.at <= t && (quiz[q.deck]?.at ?? -1) <= q.at) quiz[q.deck] = q
  for (const l of m.labs) if (l.at <= t && (labs[l.lab]?.at ?? -1) <= l.at) labs[l.lab] = l
  return { quiz, labs }
}

export const sawSlide = (deck: string, n: number) => edit(m => { if (!seenAt(m)[deck]?.has(n)) m.slides.push([Date.now(), deck, n]) })
/** Slides stay complete until reset here; quizzes and labs start a new attempt on every visit instead. */
export const resetSlides = (decks: string[]) => edit(m => { const now = Date.now(); for (const d of decks) m.slides.push([now, d, 0]) })

/** Call once per quiz visit; the attempt is only stored once a task is checked. */
export function quizAttempt(deck: string, total: number) {
  let at = 0
  return (task: number, ok: boolean) => edit(m => {
    if (!at) { at = Date.now(); while (m.quiz.some(q => q.deck === deck && q.at === at)) at++; m.quiz.push({ deck, at, total, solved: [], checks: 0, correct: 0 }) }
    const a = m.quiz.find(q => q.deck === deck && q.at === at)
    if (a) { a.checks++; if (ok) { a.correct++; if (!a.solved.includes(task)) a.solved.push(task) } }
    m.log.push([Date.now(), 'q', ok ? 1 : 0])
  })
}
/** Call once per lab visit; the attempt is only stored once a step is finished. */
export function labAttempt(lab: string, total: number) {
  let at = 0
  return (done: number) => edit(m => {
    if (!at) { at = Date.now(); while (m.labs.some(l => l.lab === lab && l.at === at)) at++; m.labs.push({ lab, at, total, done: 0 }) }
    const a = m.labs.find(l => l.lab === lab && l.at === at)
    if (a && done > a.done) { a.done = done; m.log.push([Date.now(), 'l', 1]) }
  })
}
export const setFullscreen = (on: boolean) => edit(m => { m.fullscreen = on })

/** Exercises (quiz checks + lab steps) and the share of correct quiz checks within the last `ms` milliseconds. */
export function activity(m: Me, ms: number, now = Date.now()) {
  const recent = m.log.filter(([at]) => now - at <= ms)
  const quiz = recent.filter(([, k]) => k === 'q')
  return { exercises: recent.length, checks: quiz.length, score: quiz.length ? quiz.filter(([, , ok]) => ok).length / quiz.length : null }
}
