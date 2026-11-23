import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deckOf, findEntry, path, topics } from './content.ts'
import { Header, Mark } from './components/Header.tsx'
import { LEGAL, LegalView, SOURCE, type LegalId } from './components/Legal.tsx'
import { Landing } from './components/Landing.tsx'
import { ChapterView, TopicView } from './components/Pages.tsx'
import { Presentation } from './components/Presentation.tsx'
import { LabsRoute } from './components/Labs.tsx'
import { QuizRoute } from './components/Quiz.tsx'
import { MeRoute } from './components/Me.tsx'
import { LABS, LAB_LEVELS } from './labs.ts'

// Hash routes keep the app working on GitHub Pages sub-paths without server rewrites:
//   #/                          landing
//   #/<topic>                   topic page with its sub-chapters
//   #/<topic>/<sub>             sub-chapter page
//   #/<topic>/<sub>/<n>         presentation, slide n (1-based)
//   #/quiz[/<topic>[/<sub>]]    quiz of a sub-chapter (default: the first one)
//   #/labs[/<level>|/<lab>]     labs, or the free Docker sandbox (#/labs/sandbox)
//   #/me[/settings]             my area: statistics, or settings
// Chapter ids before the topic structure. Old links land on the topic that now holds those slides.
const LEGACY: Record<string, string> = { basics: 'einfuehrung', 'einfuehrung-docker': 'einfuehrung', 'einfuehrung-compose': 'einfuehrung', 'deep-dive': 'architektur', 'compose-deep-dive': 'compose', 'docker-internals': 'architektur', 'compose-internals': 'compose' }
const parse = (hash: string) => {
  const [a, b, c] = hash.replace(/^#\/?/, '').split('/')
  const topic = topics.find(x => x.id === a)
  const entry = topic ? findEntry(a, b) : undefined
  const total = entry ? deckOf(entry.chapter).length : 0
  const slide = entry && /^\d+$/.test(c ?? '') ? Math.min(Math.max(Number(c), 1), total) - 1 : -1
  const legal = Object.hasOwn(LEGAL, a) ? a as LegalId : undefined
  return { topic, chapter: entry?.chapter, slide, legal, labs: a === 'labs', labId: a === 'labs' ? b : undefined, quiz: a === 'quiz' ? { topic: b, id: c } : undefined, me: a === 'me' ? b ?? 'stats' : undefined }
}

export default function App() {
  const { t: tr, i18n } = useTranslation()
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => {
      const old = LEGACY[location.hash.replace(/^#\/?/, '').split('/')[0]]
      if (old) location.replace(`#/${old}`)
      else setHash(location.hash)
    }
    on()
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  const { topic, chapter, slide, legal, labs, labId, quiz, me } = parse(hash)
  useEffect(() => {
    const labTitle = labId === 'sandbox' ? 'Docker sandbox' : LABS.find(l => l.id === labId)?.title ?? (LAB_LEVELS.find(l => l.id === labId) ?? LAB_LEVELS[0]).level
    const quizTitle = quiz && (findEntry(quiz.topic, quiz.id) ?? path.find(x => x.topic.id === quiz.topic) ?? path[0]).chapter.title
    const t = chapter && slide >= 0 ? tr(deckOf(chapter)[slide].slide.title) : chapter ? tr(chapter.title) : topic ? tr(topic.title) : legal ? tr(LEGAL[legal].title) : labs ? tr(labTitle) : quizTitle ? `${tr('nav.quiz')}: ${tr(quizTitle)}` : me ? `${tr('nav.me')}: ${tr(me === 'settings' ? 'Settings' : 'Statistics')}` : tr('title')
    document.title = `${t} – StudyNothing`
  }, [topic, chapter, slide, legal, labs, labId, quiz?.topic, quiz?.id, me, tr, i18n.language])

  if (chapter && slide >= 0) return <Presentation chapter={chapter} index={slide} />
  // App shell for every non-presentation page: sticky header on top, footer at the end of the page
  return (
    <div className="shell">
      <Header route={hash} topicId={topic?.id} />
      <main id="main">{chapter ? <ChapterView chapter={chapter} /> : topic ? <TopicView topic={topic} /> : legal ? <LegalView id={legal} /> : labs ? <LabsRoute id={labId} /> : quiz ? <QuizRoute topic={quiz.topic} id={quiz.id} /> : me ? <MeRoute key={me} id={me} /> : <Landing />}</main>
      <footer className="foot">
        <div className="foot-in">
          <a className="brand" href="#/" aria-label={tr('home')}><Mark />StudyNothing</a>
          <nav className="foot-nav" aria-label={tr('Legal')}>
            {(Object.keys(LEGAL) as LegalId[]).map(k => <a key={k} href={`#/${k}`}>{tr(LEGAL[k].title)}</a>)}
            <a href={SOURCE}>{tr('Source code')}</a>
          </nav>
          <p className="foot-note">{tr('footer')}</p>
        </div>
      </footer>
    </div>
  )
}
