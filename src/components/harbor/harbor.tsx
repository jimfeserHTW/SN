import type { CSSProperties, ReactNode } from 'react'
import { at } from '../Stack.tsx'
import { t } from '../../i18n.ts'
import './harbor.css'

// Drawing kit for the overview slides. Every part is a plain <g> inside an <Svg> diagram and builds in with --i.
// Containers keep one colour per service of the Mensa-App, on every slide.
export type Svc = 'frontend' | 'api' | 'db' | 'other'
const G = ({ i = 0, children, className = 'hb', ...rest }: { i?: number; children: ReactNode; className?: string; [k: string]: unknown }) =>
  <g className={className} style={at(i)} {...rest}>{children}</g>

/** A container. `open` shows what is packed inside, top to bottom. */
export function Box({ x, y, w = 120, h = 58, svc = 'api', label, i = 0, open, items, ghost, size = 15 }: {
  x: number; y: number; w?: number; h?: number; svc?: Svc; label?: string; i?: number; open?: boolean; items?: string[]; ghost?: boolean; size?: number
}) {
  const name = label ?? svc
  if (open) {
    const n = items?.length ?? 0, ih = Math.min(30, (h - 40 - (n - 1) * 6) / Math.max(n, 1))
    return (
      <G i={i} className="hb hb-ctr" data-svc={svc} data-open="">
        <rect className="body" x={x} y={y} width={w} height={h} rx={5} />
        <text className="head-t" x={x + 12} y={y + 22} fontSize={14}>{t(name)}</text>
        {items?.map((it, k) => (
          <g key={k}>
            <rect className="item" x={x + 10} y={y + 32 + k * (ih + 6)} width={w - 20} height={ih} rx={6} />
            <text className="item-t" x={x + w / 2} y={y + 32 + k * (ih + 6) + ih / 2 + 4.5} textAnchor="middle" fontSize={13}>{t(it)}</text>
          </g>
        ))}
      </G>
    )
  }
  const pw = Math.min(w - 20, Math.max(56, name.length * size * .62 + 18)), ph = size + 10
  return (
    <G i={i} className="hb hb-ctr" data-svc={svc} data-ghost={ghost || undefined}>
      <rect className="body" x={x} y={y} width={w} height={h} rx={4} />
      {!ghost && Array.from({ length: Math.floor((w - 12) / 12) }, (_, k) => <path key={k} className="rib" d={`M${x + 12 + k * 12} ${y + 5} V${y + h - 5}`} />)}
      {!ghost && name && <rect className="plate" x={x + w / 2 - pw / 2} y={y + h / 2 - ph / 2} width={pw} height={ph} rx={5} />}
      {name && <text className="plate-t" x={x + w / 2} y={y + h / 2 + size * .36} textAnchor="middle" fontSize={size}>{t(name)}</text>}
    </G>
  )
}

/** A sign with a title and an optional second line. w is fixed: check the slide in both languages. */
export function Tag({ x, y, w, label, sub, tone, i = 0, anchor = 'start', size = 15 }: {
  x: number; y: number; w: number; label: string; sub?: string; tone?: 'blue' | 'navy' | 'ok' | 'bad' | 'sky' | 'sand'; i?: number; anchor?: 'start' | 'middle'; size?: number
}) {
  const h = sub ? size + 30 : size + 16, left = anchor === 'middle' ? x - w / 2 : x
  return (
    <G i={i} className="hb hb-tag" data-tone={tone}>
      <rect x={left} y={y} width={w} height={h} rx={10} />
      <text className="t" x={left + w / 2} y={y + size + 5} textAnchor="middle" fontSize={size}>{t(label)}</text>
      {sub && <text className="s" x={left + w / 2} y={y + size + 23} textAnchor="middle" fontSize={12.5}>{t(sub)}</text>}
    </G>
  )
}
/** Dotted leader from a sign to the thing it names, ending in a dot. Route it through empty space only. */
export const Lead = ({ d, i = 0, end }: { d: string; i?: number; end: [number, number] }) =>
  <G i={i}><path className="hb-lead" d={d} /><circle className="hb-dot" cx={end[0]} cy={end[1]} r={3.5} /></G>

/** A person of the student team. */
export function Person({ x, y, s = 1, role = 'student', i = 0 }: { x: number; y: number; s?: number; role?: 'captain' | 'crew' | 'student' | 'grey'; i?: number }) {
  return (
    <G i={i}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path className="hb-cloth" data-tone={role === 'captain' ? undefined : role} d="M-14 40 C-14 22 -8 16 0 16 C8 16 14 22 14 40 Z" />
        <circle className="hb-skin" cx={0} cy={6} r={9} />
        {role === 'captain' && <path className="hb-fill" d="M-10 0 H10 V-3 C10 -9 -10 -9 -10 -3 Z" />}
        {role === 'crew' && <path className="hb-cloth" data-tone="crew" d="M-10 -1 C-10 -9 10 -9 10 -1 Z" />}
      </g>
    </G>
  )
}

/** An image, drawn as a plan sheet. */
export const Plan = ({ x, y, w = 64, h = 46, i = 0, label }: { x: number; y: number; w?: number; h?: number; i?: number; label?: string }) => (
  <G i={i}>
    <rect x={x} y={y} width={w} height={h} rx={4} fill="var(--sky)" stroke="var(--blue)" strokeWidth={2} />
    <path d={`M${x} ${y + h / 3} H${x + w} M${x} ${y + 2 * h / 3} H${x + w} M${x + w / 3} ${y} V${y + h} M${x + 2 * w / 3} ${y} V${y + h}`} stroke="var(--blue)" strokeOpacity=".25" strokeWidth={1.5} />
    <rect x={x + w * .22} y={y + h * .28} width={w * .56} height={h * .44} rx={2} fill="none" stroke="var(--blue)" strokeWidth={2} />
    {label && <text x={x + w / 2} y={y + h + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--blue-deep)">{t(label)}</text>}
  </G>
)
/** Clipboard with lines: a file such as a Dockerfile or compose.yaml. */
export const Sheet = ({ x, y, w = 50, h = 62, i = 0, lines = 4, tone = 'blue' }: { x: number; y: number; w?: number; h?: number; i?: number; lines?: number; tone?: 'blue' | 'sand' }) => (
  <G i={i}>
    <rect x={x} y={y} width={w} height={h} rx={5} fill={tone === 'sand' ? '#fff3d6' : '#fff'} stroke="var(--keel)" strokeWidth={2} />
    <rect x={x + w / 2 - 10} y={y - 5} width={20} height={10} rx={3} fill="var(--keel)" />
    {Array.from({ length: lines }, (_, k) => <path key={k} d={`M${x + 9} ${y + 18 + k * 10} H${x + w - 9 - (k % 2) * 10}`} stroke="var(--ink-3)" strokeWidth={2} strokeLinecap="round" />)}
  </G>
)
/** Concentric rings, outermost first: for layers of abstraction and of isolation. The core sits in the middle. */
export function Rings({ x, y, w, h, rings, core, i = 0, gap = 16, head = 34 }: {
  x: number; y: number; w: number; h: number; i?: number; gap?: number; head?: number
  rings: { label: string; sub?: string; bg?: string; stroke?: string; ink?: string }[]; core?: ReactNode
}) {
  return (
    <g>
      {rings.map((r, k) => {
        const rx = x + k * gap, ry = y + k * head, rw = w - 2 * k * gap, rh = h - k * (head + gap)
        return (
          <G key={k} i={i + k} style={{ ...at(i + k), '--rb': r.bg, '--rs': r.stroke, '--rt': r.ink } as never}>
            <rect className="hb-ring" x={rx} y={ry} width={rw} height={rh} rx={18} />
            <text className="hb-ring-t" x={rx + 16} y={ry + 22} fontSize={14}>{t(r.label)}</text>
            {r.sub && <text className="hb-ring-s" x={rx + rw - 16} y={ry + 22} fontSize={12.5} textAnchor="end">{t(r.sub)}</text>}
          </G>
        )
      })}
      {core}
    </g>
  )
}

/** Round status mark: ✓, ✗ or ?. */
export const Mark = ({ x, y, ok, bad, i = 0, r = 13 }: { x: number; y: number; ok?: boolean; bad?: boolean; i?: number; r?: number }) => (
  <G i={i} className="hb hb-mark">
    <circle cx={x} cy={y} r={r} fill={ok ? 'var(--ok)' : bad ? 'var(--bad)' : 'var(--ink-3)'} />
    <text x={x} y={y + r * .38} textAnchor="middle" fontSize={r * 1.1} fontWeight={700} fill="#fff">{ok ? '✓' : bad ? '✗' : '?'}</text>
  </G>
)

/** Builds in with the scene at step i. */
export const In = ({ i, children }: { i: number; children: ReactNode }) => <g className="hb" style={{ '--i': i } as CSSProperties}>{children}</g>
/** Plain translated text inside a scene. */
export const Txt = ({ x, y, children, size = 14, w = 600, fill = 'var(--ink-2)', anchor = 'start' }: { x: number; y: number; children: string; size?: number; w?: number; fill?: string; anchor?: 'start' | 'middle' | 'end' }) =>
  <text x={x} y={y} fontSize={size} fontWeight={w} fill={fill} textAnchor={anchor}>{t(children)}</text>
/** Arrow along a path, building in at step i. kind picks the colour (go, back, ok, bad, mute). */
export const Go = ({ d, i = 0, kind = 'go' }: { d: string; i?: number; kind?: 'go' | 'back' | 'ok' | 'bad' | 'mute' }) =>
  <In i={i}><path className="hb-arrow" data-k={kind} d={d} markerEnd={`url(#ah-${kind})`} /></In>
