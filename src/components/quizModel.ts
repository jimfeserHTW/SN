// Quiz tasks as data, plus their grading. No React here, so tests can check every task directly.
import type { Block, Row } from './Stack.tsx'

export type Fig =
  | { kind: 'flow'; nodes: string[]; links?: string[] }
  | { kind: 'stack'; stacks: { title?: string; sub?: string; rows: Row[] }[] }
type Base = { q: string; why: string }
export type Task = Base & (
  | { kind: 'choice'; options: string[]; answer: number[] }
  /** `[[answer|other accepted spelling]]` marks a gap. Only for answers with one clear wording. */
  | { kind: 'gaps'; text: string; file?: string }
  | { kind: 'figure'; fig: Fig }
  /** `items` are in the right order. `swap` lists positions whose items may trade places. */
  | { kind: 'order'; items: string[]; inline?: boolean; code?: boolean; swap?: number[][] }
  | { kind: 'bugs'; file: string; lines: string[]; bad: number[] }
  | { kind: 'match'; pairs: [string, string][] }
)
export type Kind = Task['kind']
export type Answer = (number | string)[]
export type Grade = { ok: boolean; parts: boolean[] }

/** English next to the German source, registered with e(de, en). Older slides keep theirs in locales/en.ts and en-chapters.ts. */
export const QUIZ_EN: Record<string, string> = {}
// e() inside a component runs at render time, after i18n has copied QUIZ_EN: i18n.ts hands in a late registrar for those.
let late: ((de: string, en: string) => void) | undefined
export const onLateEnglish = (f: (de: string, en: string) => void) => { late = f }
export const e = (de: string, en: string) => { if (QUIZ_EN[de] !== en) { QUIZ_EN[de] = en; late?.(de, en) } return de }

export const choice = (q: string, options: string[], answer: number | number[], why: string): Task => ({ kind: 'choice', q, options, answer: [answer].flat(), why })
export const gaps = (q: string, text: string, why: string, file?: string): Task => ({ kind: 'gaps', q, text, file, why })
export const figure = (q: string, fig: Fig, why: string): Task => ({ kind: 'figure', q, fig, why })
export const flow = (nodes: string[], links?: string[]): Fig => ({ kind: 'flow', nodes, links })
export const stacks = (...s: { title?: string; sub?: string; rows: Row[] }[]): Fig => ({ kind: 'stack', stacks: s })
export const order = (q: string, items: string[], why: string, o: { inline?: boolean; code?: boolean; swap?: number[][] } = {}): Task => ({ kind: 'order', q, items, why, ...o })
/** Lines starting with `!!` are the faulty ones. */
export const bugs = (q: string, file: string, lines: string[], why: string): Task => ({ kind: 'bugs', q, file, why, lines: lines.map(l => l.replace(/^!!/, '')), bad: lines.flatMap((l, i) => l.startsWith('!!') ? [i] : []) })
export const match = (q: string, pairs: [string, string][], why: string): Task => ({ kind: 'match', q, pairs, why })

/** Odd entries are the accepted answers of a gap. */
export const splitGaps = (s: string) => s.split(/\[\[(.+?)\]\]/)
const gapsIn = (s: string) => splitGaps(s).filter((_, i) => i % 2 === 1)
const blocksOf = (r: Row): Block[] => (Array.isArray(r) ? r : [r]).flatMap(b => b && typeof b === 'object' && 'unit' in b ? [b, ...b.rows.flatMap(blocksOf)] : [b])
export function blanks(task: Task, tr: (s: string) => string = s => s): string[] {
  if (task.kind === 'gaps') return gapsIn(tr(task.text))
  if (task.kind !== 'figure') return []
  const f = task.fig
  if (f.kind === 'flow') return [...f.nodes, ...(f.links ?? [])].flatMap(s => gapsIn(tr(s)))
  return f.stacks.flatMap(s => s.rows.flatMap(blocksOf)).flatMap(b => b && typeof b === 'object' && 'blank' in b && b.blank ? [b.blank] : [])
}
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const accepted = (spec: string, value: string) => spec.split('|').some(a => norm(a) === norm(value))
const sameAs = (task: Extract<Task, { kind: 'order' }>, pos: number, item: number) => item === pos || !!task.swap?.some(g => g.includes(pos) && g.includes(item))

export function grade(task: Task, a: Answer, tr?: (s: string) => string): Grade {
  const all = (parts: boolean[]) => ({ ok: parts.every(Boolean), parts })
  switch (task.kind) {
    case 'choice': return all(task.options.map((_, i) => a.includes(i) === task.answer.includes(i)))
    case 'bugs': return all(task.lines.map((_, i) => a.includes(i) === task.bad.includes(i)))
    case 'order': return all(task.items.map((_, pos) => sameAs(task, pos, a[pos] as number)))
    case 'match': return all(task.pairs.map((_, i) => a[i] === i))
    default: return all(blanks(task, tr).map((spec, i) => accepted(spec, String(a[i] ?? ''))))
  }
}
export function solution(task: Task, tr?: (s: string) => string): Answer {
  switch (task.kind) {
    case 'choice': return task.answer
    case 'bugs': return task.bad
    case 'order': return task.items.map((_, i) => i)
    case 'match': return task.pairs.map((_, i) => i)
    default: return blanks(task, tr).map(s => s.split('|')[0])
  }
}
export function initial(task: Task, tr?: (s: string) => string, random = Math.random): Answer {
  switch (task.kind) {
    case 'choice': case 'bugs': return []
    case 'match': return task.pairs.map(() => -1)
    case 'order': {
      // never hand out an already solved order
      for (;;) {
        const p = task.items.map((_, i) => i)
        for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1));[p[i], p[j]] = [p[j], p[i]] }
        if (!grade(task, p).ok) return p
      }
    }
    default: return blanks(task, tr).map(() => '')
  }
}
export const moved = <T,>(list: T[], from: number, to: number) => { const l = [...list]; l.splice(to, 0, l.splice(from, 1)[0]); return l }
