// Assembles the topics. Each topic lives in src/topics/<topic>/, shared shapes in components/types.ts.
// Plan and rules: docker-lernplattform-inhaltsplan.md. Theory only: no labs or quizzes inside slides.
import { createElement } from 'react'
import type { Chapter, Page, Slide, Strand, Topic } from './components/types.ts'
import { Progress } from './components/Progress.tsx'
import einfuehrung from './topics/einfuehrung/index.tsx'
import architektur from './topics/architektur/index.tsx'
import images from './topics/images/index.tsx'
import daten from './topics/daten/index.tsx'
import netzwerk from './topics/netzwerk/index.tsx'
import isolation from './topics/isolation/index.tsx'
import compose from './topics/compose/index.tsx'
import absturz from './topics/absturz/index.tsx'

export * from './components/types.ts'

export const topics: Topic[] = [einfuehrung, architektur, images, daten, netzwerk, isolation, compose, absturz]

/** One sub-chapter at its place: topic, strand, and depth inside the strand (0 = overview). */
export type Entry = { topic: Topic; strand: Strand; chapter: Chapter; depth: number; of: number }
/** Every sub-chapter in reading order. The last slide of one leads to the next. */
export const path: Entry[] = topics.flatMap(topic => topic.strands.flatMap(strand => strand.chapters.map((chapter, depth) => ({ topic, strand, chapter, depth, of: strand.chapters.length }))))
const byChapter = new Map(path.map(e => [e.chapter, e]))
export const entryOf = (c: Chapter) => byChapter.get(c)!
export const nextOf = (c: Chapter): Entry | undefined => path[path.indexOf(entryOf(c)) + 1]
export const findEntry = (topicId?: string, chapterId?: string) => path.find(e => e.topic.id === topicId && e.chapter.id === chapterId)
/** Sub-chapter page; add /n for slide n (1-based). */
export const hrefOf = (c: Chapter) => `#/${entryOf(c).topic.id}/${c.id}`
export const quizHref = (c: Chapter) => `#/quiz/${entryOf(c).topic.id}/${c.id}`
export const firstOf = (t: Topic) => t.strands[0].chapters[0]

/** All slides of a sub-chapter in playing order, each with the section it belongs to.
 *  Every deck opens with the learning path (built from `topics`, part of the first section), so no sub-chapter has to add it.
 *  A section that starts a part (`part`) gets the learning path again, showing that part as the current stop. */
export const deckOf = (c: Chapter): { page: Page; slide: Slide }[] => c.pages.flatMap((page, k) => [
  ...(k === 0 || page.part ? [{ page, slide: { title: 'Lernpfad: Wo stehen wir?', view: createElement(Progress, { current: entryOf(c), part: page.part ? page : undefined }) } }] : []),
  ...page.slides.map(slide => ({ page, slide })),
])
/** Link that opens the presentation at the first slide of a section. */
export const slideHref = (c: Chapter, p: Page) => `${hrefOf(c)}/${deckOf(c).findIndex(d => d.page === p) + 1}`
