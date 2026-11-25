// Minimal QR code encoder (ISO 18004): byte mode, error correction level M, versions 1–9 (up to 180 bytes).
// After Nayuki's qrcodegen. Returns the module matrix, true = dark. No dependency for two share links.
const ECC = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22] // EC codewords per block, level M
const BLOCKS = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5] // EC blocks, level M

const rawModules = (v: number) => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36 } return r }
const dataCodewords = (v: number) => Math.floor(rawModules(v) / 8) - ECC[v] * BLOCKS[v]
const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0

// Reed–Solomon over GF(256), polynomial 0x11D
const mul = (x: number, y: number) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x } return z }
const divisor = (deg: number) => {
  const r = Array(deg).fill(0); r[deg - 1] = 1; let root = 1
  for (let i = 0; i < deg; i++) { for (let j = 0; j < deg; j++) { r[j] = mul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1] } root = mul(root, 2) }
  return r
}
const remainder = (data: number[], div: number[]) => {
  const r = div.map(() => 0)
  for (const b of data) { const f = b ^ r.shift()!; r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f) }) }
  return r
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0, (_, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
  (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0,
]

export function qr(text: string): boolean[][] {
  const bytes = [...new TextEncoder().encode(text)]
  let ver = 1
  while (ver <= 9 && 12 + bytes.length * 8 > dataCodewords(ver) * 8) ver++
  if (ver > 9) throw new Error('qr: text too long')

  // data bits: mode 0100, 8-bit length, bytes, terminator, padding
  const bits: number[] = [], put = (v: number, n: number) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1) }
  put(4, 4); put(bytes.length, 8); bytes.forEach(b => put(b, 8))
  const cap = dataCodewords(ver) * 8
  put(0, Math.min(4, cap - bits.length)); put(0, (8 - bits.length % 8) % 8)
  for (let p = 0xec; bits.length < cap; p ^= 0xec ^ 0x11) put(p, 8)
  const data = Array.from({ length: bits.length / 8 }, (_, i) => bits.slice(i * 8, i * 8 + 8).reduce((a, b) => a * 2 + b, 0))

  // split into blocks, add error correction, interleave
  const nb = BLOCKS[ver], ecl = ECC[ver], raw = Math.floor(rawModules(ver) / 8), short = nb - raw % nb, shortLen = Math.floor(raw / nb), div = divisor(ecl)
  const blocks: number[][] = []
  for (let i = 0, k = 0; i < nb; i++) {
    const dat = data.slice(k, k + shortLen - ecl + (i < short ? 0 : 1)); k += dat.length
    const ec = remainder(dat, div); if (i < short) dat.push(0)
    blocks.push([...dat, ...ec])
  }
  const words: number[] = []
  for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - ecl || j >= short) words.push(b[i]) })

  // function patterns
  const size = ver * 4 + 17
  const mod = Array.from({ length: size }, () => Array(size).fill(false)), fn = mod.map(r => r.map(() => false))
  const set = (x: number, y: number, d: boolean) => { mod[y][x] = d; fn[y][x] = true }
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0) }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]])
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy))
      if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4)
    }
  if (ver > 1) {
    const n = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2, pos = [6]
    for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p)
    for (const ax of pos) for (const ay of pos) {
      if ((ax === 6 && ay === 6) || (ax === 6 && ay === size - 7) || (ax === size - 7 && ay === 6)) continue
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }
  }
  const format = (mask: number) => {
    const d = mask; let r = d // level M = 00
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537)
    const b = ((d << 10) | r) ^ 0x5412
    for (let i = 0; i <= 5; i++) set(8, i, bit(b, i))
    set(8, 7, bit(b, 6)); set(8, 8, bit(b, 7)); set(7, 8, bit(b, 8))
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(b, i))
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(b, i))
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(b, i))
    set(8, size - 8, true)
  }
  format(0)
  if (ver >= 7) {
    let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25)
    const b = (ver << 12) | r
    for (let i = 0; i < 18; i++) { const a = size - 11 + i % 3, c = Math.floor(i / 3); set(a, c, bit(b, i)); set(c, a, bit(b, i)) }
  }

  // codewords in the zigzag order
  let i = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
      const x = right - j, y = ((right + 1) & 2) === 0 ? size - 1 - v : v
      if (!fn[y][x] && i < words.length * 8) { mod[y][x] = bit(words[i >>> 3], 7 - (i & 7)); i++ }
    }
  }

  // try every mask, keep the one with the lowest penalty
  const flip = (m: number) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x] }
  let best = 0, low = Infinity
  for (let m = 0; m < 8; m++) { flip(m); format(m); const p = penalty(mod); if (p < low) { low = p; best = m } flip(m) }
  flip(best); format(best)
  return mod
}

// shortcut: simplified penalty (runs, 2×2 blocks, finder-like patterns, balance); any mask scans, this only picks a good one.
function penalty(m: boolean[][]) {
  const n = m.length, cols = m.map((_, x) => m.map(r => r[x])), F = /10111010000|00001011101/g
  let p = 0, dark = 0
  for (const line of [...m, ...cols]) {
    for (let i = 0, run = 1; i < n; i++) { if (i + 1 < n && line[i + 1] === line[i]) run++; else { if (run >= 5) p += run - 2; run = 1 } }
    p += 40 * (line.map(Number).join('').match(F)?.length ?? 0)
  }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (m[y][x]) dark++
    if (x < n - 1 && y < n - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3
  }
  return p + Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10
}
