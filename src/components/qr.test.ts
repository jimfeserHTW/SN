import test from 'node:test'
import assert from 'node:assert/strict'
import { qr } from './qr.ts'

// The real check is a scan; this guards the structure: size per version, finder patterns, both format-info copies agree.
test('qr: size, finder patterns and format info', () => {
  for (const [text, size] of [['https://github.com/jimfeserHTW/SN', 29], ['https://jimfeserhtw.github.io/SN/', 29], ['x'.repeat(100), 41], ['x'.repeat(150), 49]] as const) {
    const m = qr(text)
    assert.equal(m.length, size, text)
    for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
      assert.ok(m[cy][cx] && !m[cy][cx - 2] && m[cy][cx - 3], 'finder at ' + cx + ',' + cy)
    }
    const a = [0, 1, 2, 3, 4, 5, 7, 8].map(y => m[y][8]).concat([7, 5, 4, 3, 2, 1, 0].map(x => m[8][x]))
    const b = [...Array(8)].map((_, i) => m[8][size - 1 - i]).concat([...Array(7)].map((_, i) => m[size - 7 + i][8]))
    assert.deepEqual(a, b, 'format copies')
  }
  assert.throws(() => qr('x'.repeat(200)))
})
