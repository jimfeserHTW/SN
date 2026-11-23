import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { activity, labAttempt, latestAt, load, quizAttempt, resetSlides, sawSlide, seenAt, type Me } from './me.ts'

const store = new Map<string, string>()
;(globalThis as any).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) }
beforeEach(() => store.clear())

test('activity counts only the window and scores quiz checks', () => {
  const now = 1_000_000_000_000, h = 3_600_000
  const m: Me = { slides: [], quiz: [], labs: [], fullscreen: false, log: [[now - h, 'q', 1], [now - 2 * h, 'q', 0], [now - 3 * h, 'l', 1], [now - 48 * h, 'q', 0]] }
  assert.deepEqual(activity(m, 24 * h, now), { exercises: 3, checks: 2, score: 0.5 })
  assert.deepEqual(activity(m, 7 * 24 * h, now), { exercises: 4, checks: 3, score: 1 / 3 })
  assert.equal(activity({ ...m, log: [] }, h, now).score, null)
})

test('slides stay complete when viewed again, until reset', () => {
  for (const n of [1, 2, 3]) sawSlide('a/b', n)
  sawSlide('a/b', 1) // looking again adds nothing
  assert.equal(load().slides.length, 3)
  assert.equal(seenAt(load())['a/b'].size, 3)
  resetSlides(['a/b'])
  assert.equal(seenAt(load())['a/b'].size, 0)
  sawSlide('a/b', 2)
  assert.deepEqual([...seenAt(load())['a/b']], [2])
})

test('every quiz and lab visit is its own attempt, the latest one counts', () => {
  const first = quizAttempt('a/b', 4)
  first(0, false); first(0, true); first(1, true)
  const second = quizAttempt('a/b', 4)
  second(0, true)
  const m = load()
  assert.equal(m.quiz.length, 2)
  assert.deepEqual({ ...m.quiz[0], at: 0 }, { deck: 'a/b', at: 0, total: 4, solved: [0, 1], checks: 3, correct: 2 })
  assert.deepEqual(latestAt(m).quiz['a/b'].solved, [0])
  quizAttempt('a/b', 4) // a visit without a check leaves no attempt
  assert.equal(load().quiz.length, 2)
  const lab = labAttempt('l1', 3)
  lab(1); lab(2); lab(2)
  assert.deepEqual(load().labs.map(l => l.done), [2])
  assert.equal(load().log.filter(([, k]) => k === 'l').length, 2)
})
