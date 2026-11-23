import type { ReactNode } from 'react'
import { at } from './Stack.tsx'
import { t as tr } from '../i18n.ts'

// Building blocks for hand-drawn diagrams. Boxes share their colours (data-t) with the Stack blocks.
export type BoxTone = 'hw' | 'kernel' | 'kchip' | 'guest' | 'hyper' | 'engine' | 'host' | 'runtime' | 'libs' | 'app' | 'reg' | 'container' | 'ok' | 'bad' | 'gone'
export type ArrowKind = 'go' | 'back' | 'bad' | 'ok' | 'mute'
const kinds: ArrowKind[] = ['go', 'back', 'bad', 'ok', 'mute']

/** `top` crops empty space above a scene without moving its coordinates. */
export function Svg({ w, h, label, children, top = 0 }: { w: number; h: number; label: string; children: ReactNode; top?: number }) {
  return (
    <svg className="dgm" viewBox={`0 ${top} ${w} ${h}`} role="img" aria-label={tr(label)}>
      <defs>
        {kinds.map(k => (
          <marker key={k} id={`ah-${k}`} className={`ah ah-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" />
          </marker>
        ))}
      </defs>
      {children}
    </svg>
  )
}

export function Box({ x, y, w, h, t = 'app', label, sub, i = 0, size = 17, mono }: { x: number; y: number; w: number; h: number; t?: BoxTone; label: string; sub?: string; i?: number; size?: number; mono?: boolean }) {
  const cy = y + h / 2
  return (
    <g className="sb" data-t={t} style={at(i)}>
      <rect x={x} y={y} width={w} height={h} rx={12} />
      <text x={x + w / 2} y={sub ? cy - 4 : cy + size / 3} textAnchor="middle" fontSize={size} fontWeight={700} style={mono ? { fontFamily: 'var(--mono)' } : undefined}>{tr(label)}</text>
      {sub && <text x={x + w / 2} y={cy + 16} textAnchor="middle" fontSize={13} className="sb-sub">{tr(sub)}</text>}
    </g>
  )
}

/** Arrow along a path, with an optional step number (n at nx,ny) and label (at lx,ly). */
export function Arrow({ d, kind = 'go', n, nx = 0, ny = 0, label, lx = 0, ly = 0, anchor = 'middle', i = 0, both }: {
  d: string; kind?: ArrowKind; n?: number; nx?: number; ny?: number; label?: string; lx?: number; ly?: number; anchor?: 'start' | 'middle' | 'end'; i?: number; both?: boolean
}) {
  return (
    <g className="sa" data-k={kind} style={at(i)}>
      <path d={d} markerEnd={`url(#ah-${kind})`} markerStart={both ? `url(#ah-${kind})` : undefined} />
      {n !== undefined && <g className="sa-n"><circle cx={nx} cy={ny} r={13} /><text x={nx} y={ny + 5} textAnchor="middle">{n}</text></g>}
      {label && <text className="sa-l" x={lx} y={ly} textAnchor={anchor}>{tr(label)}</text>}
    </g>
  )
}

/** Free text inside a diagram, building in with the rest. */
export const Label = ({ x, y, children, i = 0, size = 14, weight = 500, anchor = 'middle', tone, mono }: { x: number; y: number; children: ReactNode; i?: number; size?: number; weight?: number; anchor?: 'start' | 'middle' | 'end'; tone?: 'muted' | 'bad' | 'ok' | 'blue'; mono?: boolean }) => (
  <text className="sl" data-tone={tone} x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} style={{ ...at(i), ...(mono ? { fontFamily: 'var(--mono)' } : {}) }}>{typeof children === 'string' ? tr(children) : children}</text>
)

/** A place in the system (host, kernel, disk …): a filled area with its name in the top corner. */
export const Zone = ({ x, y, w, h, t = 'host', label, sub, i = 0 }: { x: number; y: number; w: number; h: number; t?: BoxTone; label?: string; sub?: string; i?: number }) => (
  <g className="sb" data-t={t} style={at(i)}>
    <rect x={x} y={y} width={w} height={h} rx={16} />
    {label && <text x={x + 16} y={y + 23} fontSize={14} fontWeight={700}>{tr(label)}</text>}
    {sub && <text x={x + w - 16} y={y + 23} fontSize={13} textAnchor="end" className="sb-sub">{tr(sub)}</text>}
  </g>
)
/** Line without arrow head: a cable between two parts. */
export const Wire = ({ d, i = 0, k = 'mute' }: { d: string; i?: number; k?: ArrowKind }) => <g className="sa" data-k={k} style={at(i)}><path d={d} /></g>
/** Container outline with its name, children drawn inside. */
export const Ctr = ({ x, y, w, h, name, i = 0 }: { x: number; y: number; w: number; h: number; name: string; i?: number }) => (
  <g className="sb" data-t="container" style={at(i)}>
    <rect x={x} y={y} width={w} height={h} rx={14} />
    <text x={x + 14} y={y + 22} fontSize={14} fontWeight={700}>{tr(name)}</text>
  </g>
)
/** Numbered badge inside an SVG, matches the badges in a Code panel. */
export const Num = ({ n, x, y, i = 0 }: { n: number; x: number; y: number; i?: number }) => (
  <g className="sl num" style={at(i)}><circle cx={x} cy={y} r={12} /><text x={x} y={y + 5} textAnchor="middle">{n}</text></g>
)
/** Round ✓ / ✗ mark. */
export const Tick = ({ x, y, ok, bad, i = 0 }: { x: number; y: number; ok?: boolean; bad?: boolean; i?: number }) => (
  <g className="sl tick" data-ok={ok || undefined} data-bad={bad || undefined} style={at(i)}><circle cx={x} cy={y} r={11} /><text x={x} y={y + 5} textAnchor="middle">{ok ? '✓' : '✗'}</text></g>
)
/** The one sentence a slide should leave behind. `code` in backticks. */
export const Take = ({ label, text, i = 0 }: { label: string; text: string; i?: number }) => (
  <p className="cause" style={at(i)}><b>{tr(label)}</b> {tr(text).split('`').map((p, k) => (k % 2 ? <code key={k}>{p}</code> : p))}</p>
)
