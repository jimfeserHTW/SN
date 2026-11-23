import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// e('Deutsch', 'English') registers one English text per German key. Two different English texts for the same key
// mean the shown one depends on load order (e.g. "Container" vs "container").
test('every German key has exactly one English text', () => {
  const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? files(join(dir, d.name)) : /\.tsx?$/.test(d.name) ? [join(dir, d.name)] : [])
  const seen = new Map<string, Set<string>>()
  for (const f of files('src')) for (const [, de, en] of readFileSync(f, 'utf8').matchAll(/\be\('((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'\)/g)) (seen.get(de) ?? seen.set(de, new Set()).get(de)!).add(en)
  assert.deepEqual([...seen].filter(([, en]) => en.size > 1).map(([de, en]) => `${de} → ${[...en].join(' | ')}`), [])
})
