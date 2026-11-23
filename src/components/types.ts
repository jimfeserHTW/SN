// Shared shapes for all topics. Topic content lives in src/topics/<topic>/.
import type { ReactNode } from 'react'

// Goal: a checkable lab step.
export type Goal<T> = { label: string; test: (x: T) => boolean }

// Building blocks. Each builds itself in reading order. In table cells, `code` is rendered as code.
export type Tone = 'plain' | 'blue' | 'navy' | 'sky' | 'muted' | 'warn'
export type NodeD = { label: string; sub?: string; items?: string[]; tone?: Tone }
export type Visual =
  | { kind: 'flow'; dir?: 'row' | 'col'; nodes: NodeD[]; links?: string[] }
  | { kind: 'tree'; root: NodeD; link?: string; children: NodeD[] }
  | { kind: 'stack'; columns: { title?: string; layers: { label: string; tone?: Tone; note?: string }[] }[] }
  | { kind: 'anatomy'; rows: { text: string; label: string }[][] }
  | { kind: 'code'; file?: string; lines: { text: string; note?: string }[] }
  | { kind: 'cards'; items: { title: string; text: string }[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'mindmap'; root: string; branches: { label: string; leaves: string[] }[] }
  | { kind: 'matrix'; head: string[]; rows: string[][]; legend?: string } // cells '0'..'4' become Harvey balls
  | { kind: 'bars'; legend: [string, string]; rows: { label: string; a: number; b: number }[] } // relative size, 0..100

/** A slide shows generic visuals, or its own chapter-specific diagram (`view`). */
export type Slide = { title: string; visual?: Visual | Visual[]; view?: ReactNode }
/** `part`: this section starts a new part of the deck (e.g. Docker, then Compose); the learning path is shown again before it. */
export type Page = { id: string; title: string; summary: string; slides: Slide[]; part?: string }
/** A sub-chapter: one presentation with its own quiz. Its depth comes from its place in the strand. */
export type Chapter = { id: string; title: string; blurb: string; pages: Page[] }
/** A line of sub-chapters inside a topic, from abstract to technical. Most topics have one untitled strand. */
export type Strand = { id: string; title?: string; chapters: Chapter[] }
/** A topic chapter, e.g. Architektur. Its first sub-chapter (per strand) is the overview. */
export type Topic = { id: string; title: string; blurb: string; strands: Strand[] }

export const flow = (nodes: NodeD[], links: string[] = []): Visual => ({ kind: 'flow', nodes, links })
