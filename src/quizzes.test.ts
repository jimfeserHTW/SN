import test from 'node:test'
import assert from 'node:assert/strict'
import { blanks, grade, initial, moved, solution, type Task } from './components/quizModel.ts'
import locale from './locales/en.ts'
import { QUIZZES, QUIZ_EN } from './quizzes.ts'

const de = (s: string) => s, en = (s: string) => QUIZ_EN[s] ?? locale[s] ?? s
const chapters = Object.entries(QUIZZES).flatMap(([topic, subs]) => Object.entries(subs).map(([id, tasks]) => ({ id: `${topic}/${id}`, tasks })))
const all = chapters.flatMap(({ id, tasks }) => tasks.map(task => ({ id, task })))

test('every sub-chapter has a bundle of at least three tasks, mixing kinds', () => {
  assert.equal(Object.keys(QUIZZES).length, 7)
  for (const { id, tasks } of chapters) {
    assert.ok(tasks.length >= 3, `${id} has ${tasks.length} tasks`)
    assert.ok(new Set(tasks.map(t => t.kind)).size >= 2, `${id} uses one kind only`)
  }
})

test('every solution is accepted and the starting state is not', () => {
  for (const { task } of all) for (const tr of [de, en]) {
    assert.equal(grade(task, solution(task, tr), tr).ok, true, task.q)
    assert.equal(grade(task, initial(task, tr), tr).ok, false, task.q)
  }
})

test('tasks are well formed', () => {
  for (const { task: t } of all) {
    assert.ok(t.q && t.why, 'question and explanation')
    assert.doesNotMatch(t.q + t.why, /\*\*|\{\{/)
    if (t.kind === 'choice') assert.ok(t.answer.length && t.answer.every(a => t.options[a]), t.q)
    if (t.kind === 'bugs') assert.ok(t.bad.length && t.bad.length < t.lines.length, t.q)
    if (t.kind === 'match') assert.equal(new Set(t.pairs.map(p => p[1])).size, t.pairs.length, t.q)
    if (t.kind === 'order') assert.equal(new Set(t.items).size, t.items.length, t.q)
    if (t.kind === 'gaps' || t.kind === 'figure') assert.ok(blanks(t).length, t.q)
    // prose is split at the gaps, so a code span could not cross one
    if (t.kind === 'gaps' && !t.file) assert.doesNotMatch(t.text, /`/, t.q)
    // figures find their input by the answer text
    if (t.kind === 'figure') assert.equal(new Set(blanks(t)).size, blanks(t).length, t.q)
  }
})

test('every chapter is fully translated, with the same gaps', () => {
  const GERMAN = /[äöüß]|\b(der|das|und|nicht|ein|eine|einen|mit|von|für|wird|ist|im|auf|nur|oder|wie)\b/i
  const texts = (t: Task): string[] => [t.q, t.why, ...(t.kind === 'choice' ? t.options : t.kind === 'match' ? t.pairs.flat() : t.kind === 'order' && !t.code && !t.inline ? t.items : t.kind === 'gaps' && !t.file ? [t.text] : t.kind === 'figure' && t.fig.kind === 'flow' ? [...t.fig.nodes, ...(t.fig.links ?? [])] : [])]
  for (const { task } of all) {
    for (const s of texts(task)) assert.doesNotMatch(en(s), GERMAN, `still German: ${s}`)
    assert.equal(blanks(task, en).length, blanks(task).length, task.q)
  }
})

test('grading: spelling variants, swappable positions, exact bug marks', () => {
  const g: Task = { kind: 'gaps', q: 'q', why: 'w', text: 'a [[Copy-on-Write|CoW]] b' }
  assert.equal(grade(g, ['  cow ']).ok, true)
  assert.equal(grade(g, ['copy']).ok, false)
  const o: Task = { kind: 'order', q: 'q', why: 'w', items: ['a', 'b', 'c'], swap: [[1, 2]] }
  assert.equal(grade(o, [0, 2, 1]).ok, true)
  assert.equal(grade(o, [1, 0, 2]).ok, false)
  const b: Task = { kind: 'bugs', q: 'q', why: 'w', file: 'f', lines: ['a', 'b', 'c'], bad: [1] }
  assert.equal(grade(b, [1]).ok, true)
  assert.equal(grade(b, [0, 1, 2]).ok, false, 'marking everything is not a solution')
  assert.deepEqual(moved([0, 1, 2], 0, 2), [1, 2, 0])
})
