import { useState, type ReactNode } from 'react'
import { Svg, Box as B, Take } from '../../components/Svg.tsx'
import { Icon, type IconName } from '../../components/Icons.tsx'
import { e } from '../../components/quizModel.ts'
import { Box } from '../../components/harbor/harbor.tsx'
import { t } from '../../i18n.ts'

// Own slides of the intro: the app's palette (blue, navy, service colours), no gradients.
// Scenes with steps take `step` and stay mounted: shared parts keep their place, changes fade (.tr) or recolour (.tr-fill).
const mono = { fontFamily: 'var(--mono)', fontVariantLigatures: 'none', whiteSpace: 'pre' } as const
type SayProps = { x: number; y: number; size: number; children: string; w?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; code?: boolean; caps?: boolean }
/** Translated text; `caps` gives spaced small caps, `code` the mono font. The fill fades when it changes. */
const Say = ({ x, y, size, children, w = 700, fill = 'var(--ink)', anchor = 'start', code, caps }: SayProps) => (
  <text className="tr-fill" x={x} y={y} fontSize={size} fontWeight={w} textAnchor={anchor} letterSpacing={caps ? size * 0.2 : undefined} style={{ fill, ...(code ? mono : {}) }}>
    {caps ? t(children).toUpperCase() : t(children)}
  </text>
)
/** Shown or hidden with a fade; stays mounted so it never flashes in again. */
const Fade = ({ on, delay = 0, children }: { on: boolean; delay?: number; children: ReactNode }) => (
  <g className="tr" style={{ opacity: on ? 1 : 0, transitionDelay: on ? `${delay}ms` : '0ms' }} aria-hidden={!on || undefined}>{children}</g>
)
const wrap = (text: string, max: number) => text.split(' ').reduce<string[]>((lines, w) => {
  const last = lines[lines.length - 1]
  if (last !== undefined && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w
  else lines.push(w)
  return lines
}, [])

/* ── generic line icons (no logos) ── */
type Glyph = 'shop' | 'play' | 'bank' | 'cap'
const glyph = (g: Glyph, cx: number, cy: number, s = 1) => {
  const k = (d: number) => d * s
  const p = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 4.5 * s, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (g === 'shop') return <g><path {...p} d={`M${cx - k(40)} ${cy - k(28)} H${cx - k(28)} L${cx - k(16)} ${cy + k(14)} H${cx + k(26)} L${cx + k(36)} ${cy - k(16)} H${cx - k(22)}`} /><circle {...p} cx={cx - k(12)} cy={cy + k(28)} r={k(6)} /><circle {...p} cx={cx + k(22)} cy={cy + k(28)} r={k(6)} /></g>
  if (g === 'play') return <g><rect {...p} x={cx - k(40)} y={cy - k(30)} width={k(80)} height={k(56)} rx={k(10)} /><path d={`M${cx - k(8)} ${cy - k(14)} L${cx + k(14)} ${cy - k(2)} L${cx - k(8)} ${cy + k(10)}Z`} fill="var(--ink)" /><path {...p} d={`M${cx - k(16)} ${cy + k(40)} H${cx + k(16)}`} /></g>
  if (g === 'bank') return <g><path {...p} d={`M${cx - k(42)} ${cy - k(14)} L${cx} ${cy - k(38)} L${cx + k(42)} ${cy - k(14)} Z`} />{[-26, -9, 9, 26].map(d => <path key={d} {...p} d={`M${cx + k(d)} ${cy - k(6)} V${cy + k(22)}`} />)}<path {...p} d={`M${cx - k(44)} ${cy + k(32)} H${cx + k(44)}`} /></g>
  return <g><path {...p} d={`M${cx} ${cy - k(30)} L${cx + k(46)} ${cy - k(12)} L${cx} ${cy + k(6)} L${cx - k(46)} ${cy - k(12)} Z`} /><path {...p} d={`M${cx - k(26)} ${cy - k(2)} V${cy + k(20)} Q${cx} ${cy + k(34)} ${cx + k(26)} ${cy + k(20)} V${cy - k(2)}`} /><path {...p} d={`M${cx + k(40)} ${cy - k(10)} V${cy + k(18)}`} /></g>
}

/* ── Opening: four services you know; step 2 opens the server room below them ── */
const services: [Glyph, string, string][] = [
  ['shop', e('Online-Shop', 'Online shop'), e('bestellen', 'ordering')], ['play', e('Streaming', 'Streaming'), e('Serien schauen', 'watching series')],
  ['bank', e('Online-Banking', 'Online banking'), e('überweisen', 'transferring money')], ['cap', e('Uni-Portal', 'University portal'), e('Noten abrufen', 'checking grades')],
]
export const Hook = ({ step }: { step: number }) => (
  <Svg w={1000} h={370} label={e('Vier Dienste, die du täglich nutzt. Auf ihren Servern laufen sie als mehrere Container.', 'Four services you use daily. On their servers they run as several containers.')}>
    {services.map(([g, name, sub], k) => {
      const x = k * 250
      return (
        <g key={g}>
          <rect x={x} y={0} width={230} height={110} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
          {glyph(g, x + 52, 55, 0.62)}
          <Say x={x + 88} y={50} size={15}>{name}</Say>
          <Say x={x + 88} y={74} size={13} w={500} fill="var(--ink-3)">{sub}</Say>
          <path d={`M${x + 115} 114 V144`} stroke="var(--ink-3)" strokeWidth={2} strokeDasharray="4 4" />
        </g>
      )
    })}
    <rect x={0} y={150} width={980} height={210} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
    <Say x={16} y={173} size={14} fill="var(--ink-2)">{e('Server der Anbieter', 'The providers’ servers')}</Say>
    <Fade on={step === 0}>
      <Say x={490} y={276} size={64} anchor="middle" fill="var(--ink-3)">?</Say>
      <Say x={490} y={318} size={18} w={500} anchor="middle" fill="var(--ink-3)">{e('Was läuft hier?', 'What runs here?')}</Say>
    </Fade>
    <Fade on={step >= 1}>
      {services.map(([g], k) => (
        <Fade key={g} on={step >= 1} delay={k * 140}>
          {(['frontend', 'api', 'db'] as const).map((s, j) => <Box key={s} x={k * 250 + 10 + j * 73} y={196} w={64} h={40} svc={s} label={['web', 'app', 'db'][j]} size={12} />)}
        </Fade>
      ))}
      <Say x={490} y={296} size={20} anchor="middle">{e('Jeder Dienst besteht aus mehreren Containern.', 'Every service consists of several containers.')}</Say>
      <Say x={490} y={328} size={16} w={500} anchor="middle" fill="var(--ink-2)">{e('Docker baut und startet sie, Docker Compose hält sie zusammen.', 'Docker builds and starts them, Docker Compose keeps them together.')}</Say>
    </Fade>
  </Svg>
)

/* ── Agenda once: four stops, Compose builds on Docker ── */
const stops: [string, string, string][] = [
  [e('Problem', 'Problem'), e('Warum läuft Software', 'Why does software not run'), e('nicht überall gleich?', 'the same everywhere?')],
  ['Docker', e('Wie verpackt man', 'How do you package'), e('eine Anwendung?', 'an application?')],
  ['Docker Compose', e('Wie startet man mehrere', 'How do you start several'), e('Teile zusammen?', 'parts together?')],
  [e('Einordnung', 'Where it fits'), e('Wann lohnt es sich,', 'When is it worth it,'), e('und wann nicht?', 'and when not?')],
]
export const Route = () => (
  <Svg w={1000} h={190} label={e('Agenda: Problem, Docker, Docker Compose, Einordnung', 'Agenda: problem, Docker, Docker Compose, where it fits')}>
    {stops.slice(1).map((_, k) => <path key={k} d={`M${125 + k * 250 + 26} 60 H${125 + (k + 1) * 250 - 26}`} stroke="#c3cddb" strokeWidth={4} strokeLinecap="round" />)}
    {stops.map(([name, a, b], k) => {
      const x = 125 + k * 250
      return (
        <g key={k}>
          <circle cx={x} cy={60} r={22} fill="#fff" stroke={k === 2 ? 'var(--ink)' : 'var(--blue)'} strokeWidth={3} />
          <Say x={x} y={67} size={18} anchor="middle" fill={k === 2 ? 'var(--ink)' : 'var(--blue)'}>{String(k + 1)}</Say>
          <Say x={x} y={118} size={20} anchor="middle">{name}</Say>
          <Say x={x} y={144} size={14} w={500} anchor="middle" fill="var(--ink-3)">{a}</Say>
          <Say x={x} y={164} size={14} w={500} anchor="middle" fill="var(--ink-3)">{b}</Say>
        </g>
      )
    })}
    <Say x={625} y={14} size={12} anchor="middle" fill="var(--ink-3)" caps>{e('baut auf Docker auf', 'builds on Docker')}</Say>
  </Svg>
)

/* ── The group chat: the story opens and closes the deck. Messages appear one per step. ── */
type Msg = [string, string, boolean?]
export const Chat = ({ step, msgs, tail, head }: { step: number; msgs: Msg[]; tail?: ReactNode; head: string }) => (
  <Svg w={1000} h={380} label={msgs.map(([w, m]) => `${w}: ${t(m)}`).join(' ')}>
    <Say x={0} y={16} size={13} fill="var(--ink-3)" caps>{head}</Say>
    {msgs.map(([who, text, right], k) => {
      const w = t(text).length * 11.2 + 56, x = right ? 1000 - w : 0, y = 34 + k * 84
      return (
        <Fade key={k} on={step >= k}>
          <rect x={x} y={y} width={w} height={68} rx={18} fill={right ? 'var(--blue)' : '#fff'} stroke={right ? 'none' : '#d8dfea'} strokeWidth={1.5} />
          <Say x={x + 24} y={y + 24} size={13} fill={right ? '#dbe7ff' : 'var(--ink-3)'}>{who}</Say>
          <Say x={x + 24} y={y + 52} size={21} w={500} fill={right ? '#fff' : 'var(--ink)'}>{text}</Say>
        </Fade>
      )
    })}
    <Fade on={step >= msgs.length}>{tail}</Fade>
  </Svg>
)

/* ── What happens at docker run: client, daemon, registry, one step at a time ── */
const runSteps = [
  e('Du tippst den Befehl, der Client gibt ihn an den Docker-Daemon weiter.', 'You type the command, the client hands it to the Docker daemon.'),
  e('Fehlt das Image lokal, lädt der Daemon es aus der Registry, wie Maven eine Bibliothek.', 'If the image is missing locally, the daemon downloads it from the registry, like Maven a library.'),
  e('Der Daemon erstellt aus dem Image den Container und startet ihn.', 'The daemon creates the container from the image and starts it.'),
]
export const RunFlow = ({ step }: { step: number }) => (
  <Svg w={1000} h={330} label={t(runSteps[step])}>
    <rect x={0} y={0} width={280} height={110} rx={14} fill="#0f1b2d" />
    <Say x={20} y={30} size={13} fill="#9fb0c8" caps>{e('Client · dein Terminal', 'Client · your terminal')}</Say>
    <text x={20} y={74} fontSize={17} fill="#e2e8f0" style={mono}>$ docker run postgres:18</text>
    <rect className="tr-fill" x={360} y={0} width={280} height={110} rx={14} style={{ fill: 'var(--c-engine)' }} />
    <Say x={380} y={42} size={20} fill="#fff">{e('Docker-Daemon', 'Docker daemon')}</Say>
    <Say x={380} y={70} size={14} w={500} fill="#dbe7ff">{e('dockerd · erledigt die Arbeit', 'dockerd · does the work')}</Say>
    <rect x={720} y={0} width={280} height={110} rx={14} fill="#fff3d6" stroke="#e6c27a" strokeWidth={1.5} />
    <Say x={740} y={42} size={20} fill="#6b4a00">Registry</Say>
    <Say x={740} y={70} size={14} w={500} fill="#8a6a20">{e('Lager für Images, z. B. Docker Hub', 'store for images, e.g. Docker Hub')}</Say>
    <path d="M284 55 H352" stroke="var(--ink-2)" strokeWidth={2.4} markerEnd="url(#ah-go)" />
    <Fade on={step >= 1}>
      <path d="M644 40 H712" stroke="var(--ink-2)" strokeWidth={2.4} markerEnd="url(#ah-go)" />
      <path d="M712 72 H648" stroke="var(--blue)" strokeWidth={2.4} strokeDasharray="7 5" markerEnd="url(#ah-back)" />
      <B x={380} y={150} w={240} h={46} t="libs" label={e('Image postgres:18 · jetzt lokal', 'image postgres:18 · now local')} size={14} />
      <path d="M500 114 V144" stroke="var(--ink-3)" strokeWidth={2} />
    </Fade>
    <Fade on={step >= 2}>
      <path d="M500 200 V226" stroke="var(--ink-2)" strokeWidth={2.4} markerEnd="url(#ah-go)" />
      <Box x={420} y={232} w={160} h={50} svc="db" label={e('Container db', 'Container db')} size={13} />
      <Say x={596} y={263} size={14} fill="var(--ok)">{e('läuft', 'running')}</Say>
    </Fade>
    <g key={step} className="tr-in"><Say x={0} y={318} size={18} w={500} fill="var(--ink-2)">{runSteps[step]}</Say></g>
  </Svg>
)

/* ── Quick check: image or container? One answer per step ── */
const checks: [string, boolean][] = [
  [e('Entsteht beim Ausführen von docker build', 'Is created when you run docker build'), false],
  [e('Beantwortet gerade die Anfragen an dein Backend', 'Is answering the requests to your backend right now'), true],
  [e('Liegt zum Herunterladen auf Docker Hub', 'Lies on Docker Hub, ready to download'), false],
  [e('Läuft dreimal parallel, aus derselben Vorlage', 'Runs three times in parallel, from the same template'), true],
]
export const ImageOrContainer = () => {
  const [pick, setPick] = useState<(boolean | undefined)[]>(checks.map(() => undefined))
  const [done, setDone] = useState(false)
  return (
    <div className="dg-col">
      <Svg w={1000} h={320} label={e('Kurzer Check: Image oder Container?', 'Quick check: image or container?')}>
        {checks.map(([text, ctr], k) => {
          const y = k * 70
          return (
            <g key={k}>
              <rect x={0} y={y} width={620} height={58} rx={12} fill="#fff" stroke="#e3e8f0" strokeWidth={1} />
              <Say x={20} y={y + 36} size={18} w={500}>{text}</Say>
              {[false, true].map(c => {
                const x = c ? 820 : 640, on = pick[k] === c, ok = done && c === ctr, bad = done && on && c !== ctr
                return (
                  <g key={String(c)} style={{ cursor: done ? 'default' : 'pointer' }} onClick={() => !done && setPick(p => p.map((v, j) => j === k ? c : v))}>
                    <rect className="tr-fill" x={x} y={y} width={170} height={58} rx={12} strokeWidth={on || ok ? 2.5 : 1.5}
                      style={{ fill: ok ? '#e2f5ec' : bad ? '#fdecea' : on ? '#eef4ff' : '#fff', stroke: ok ? 'var(--ok)' : bad ? 'var(--bad)' : on ? 'var(--blue)' : '#d8dfea' }} />
                    <Say x={x + 85} y={y + 36} size={18} anchor="middle" fill={ok ? 'var(--ok)' : bad ? 'var(--bad)' : 'var(--ink)'}>{c ? 'Container' : 'Image'}</Say>
                  </g>
                )
              })}
            </g>
          )
        })}
        {done && <g className="tr-in"><Say x={500} y={310} size={20} anchor="middle" fill="var(--blue-deep)">{e('Image = Vorlage · Container = laufende Instanz davon', 'Image = template · container = a running instance of it')}</Say></g>}
      </Svg>
      <Check done={done} onCheck={() => setDone(true)} onReset={() => { setPick(checks.map(() => undefined)); setDone(false) }} />
    </div>
  )
}

/* ── Estimate: how common is Docker? Bars instead of cards; the answer grows in on the next step ── */
export const Estimate = () => {
  const [sel, setSel] = useState<number>()
  const [done, setDone] = useState(false)
  const opts = [['A', 19], ['B', 39], ['C', 59.1]] as const
  return (
    <div className="dg-col">
      <Svg w={1000} h={330} label={e('Schätzfrage: Wie viel Prozent der Befragten haben im letzten Jahr viel mit Docker gearbeitet?', 'Estimate: what share of respondents worked a lot with Docker last year?')}>
        <Say x={0} y={26} size={22}>{e('Wie viel Prozent der Entwickler:innen haben im letzten Jahr', 'What share of developers worked a lot with')}</Say>
        <Say x={0} y={56} size={22}>{e('viel mit Docker oder Docker Compose gearbeitet?', 'Docker or Docker Compose last year?')}</Say>
        {opts.map(([l, v], k) => {
          const y = 90 + k * 56, hit = done && l === 'C', on = sel === k
          return (
            <g key={l} style={{ cursor: done ? 'default' : 'pointer' }} onClick={() => !done && setSel(k)}>
              <rect className="tr-fill" x={0} y={y} width={1000} height={48} rx={10} strokeWidth={on ? 2 : 1} style={{ fill: on ? '#eef4ff' : '#fff', stroke: on ? 'var(--blue)' : '#e3e8f0' }} />
              <Say x={16} y={y + 31} size={20}>{l}</Say>
              <rect x={56} y={y + 10} width={700} height={28} rx={8} fill="#eef2f7" />
              <rect className="tr" x={59} y={y + 13} width={done ? 700 * v / 100 - 6 : 0} height={22} rx={6} fill={hit ? 'var(--blue)' : '#c3cddb'} style={{ transition: 'width .8s cubic-bezier(.2,.7,.2,1)' }} />
              <Say x={776} y={y + 31} size={18} fill={hit ? 'var(--blue-deep)' : 'var(--ink-3)'}>{done && l === 'C' ? '59,1 %' : e(`rund ${v} %`, `about ${v} %`)}</Say>
            </g>
          )
        })}
        <Fade on={done}>
          <Say x={0} y={282} size={18}>{e('Platz 1 bei den Cloud-Werkzeugen, Kubernetes folgt mit 26,0 %.', 'Number 1 among cloud tools, Kubernetes follows with 26.0 %.')}</Say>
          <Say x={0} y={310} size={13} w={500} fill="var(--ink-3)">{e('Quelle: Stack Overflow Developer Survey 2026', 'Source: Stack Overflow Developer Survey 2026')}</Say>
        </Fade>
      </Svg>
      <Check done={done} onCheck={() => sel !== undefined && setDone(true)} onReset={() => { setSel(undefined); setDone(false) }} />
    </div>
  )
}

/* ── Who uses Docker, and why: the highlight moves from role to role ── */
const roles: [IconName | 'cap', string, string, string, string][] = [
  ['laptop', e('Entwicklung', 'Development'), e('baut die App', 'builds the app'), e('Neu im Projekt? Repo klonen, ein Befehl, läuft.', 'New to the project? Clone the repo, one command, it runs.'), e('Niemand installiert JDK, Node und Postgres von Hand.', 'Nobody installs JDK, Node and Postgres by hand.')],
  ['check', e('Tests und CI', 'Tests and CI'), e('prüft jede Änderung', 'checks every change'), e('Jeder Test läuft im selben Image wie bei dir.', 'Every test runs in the same image as on your machine.'), e('Kein „auf dem CI-Server ist Java anders“ mehr.', 'No more “Java is different on the CI server”.')],
  ['server', e('Betrieb', 'Operations'), e('bringt die App auf Server', 'puts the app on servers'), e('Auf den Server kommt genau das getestete Image.', 'Exactly the tested image goes onto the server.'), e('Ein Update ist ein neues Image, das alte bleibt als Rückweg.', 'An update is a new image, the old one stays as a way back.')],
  ['cap', e('Lehre und Abgabe', 'Teaching and hand-in'), e('prüft Projekte', 'checks projects'), e('Deine Abgabe startet beim Tutor mit einem Befehl.', 'Your hand-in starts on the tutor’s machine with one command.'), e('Sie läuft dort genauso wie bei dir.', 'It runs there just as it does on yours.')],
]
export const Roles = ({ focus }: { focus: number }) => (
  <Svg w={1000} h={344} label={`${t(roles[focus][1])}: ${t(roles[focus][3])} ${t(roles[focus][4])}`}>
    {roles.map(([icon, name, sub], k) => {
      const x = k * 250, on = k === focus
      return (
        <g key={k}>
          <rect className="tr-fill" x={x} y={0} width={230} height={150} rx={16} style={{ fill: on ? 'var(--blue)' : '#fff', stroke: on ? 'var(--blue)' : '#d8dfea' }} strokeWidth={1.5} />
          <circle cx={x + 115} cy={48} r={30} fill="#fff" stroke="#d8dfea" strokeWidth={1.5} />
          {icon === 'cap' ? glyph('cap', x + 115, 52, 0.42) : <Icon name={icon} x={x + 97} y={30} s={36} />}
          <Say x={x + 115} y={106} size={20} anchor="middle" fill={on ? '#fff' : 'var(--ink)'}>{name}</Say>
          <Say x={x + 115} y={130} size={14} w={500} anchor="middle" fill={on ? '#dbe7ff' : 'var(--ink-3)'}>{sub}</Say>
        </g>
      )
    })}
    <path d="M0 190 H322 M658 190 H980" stroke="var(--blue)" strokeWidth={2} strokeDasharray="6 5" />
    <rect x={330} y={176} width={320} height={28} rx={14} fill="var(--paper)" stroke="var(--blue)" strokeWidth={1.5} />
    <Say x={490} y={195} size={14} anchor="middle" fill="var(--blue-deep)">{e('dasselbe Image an jeder Station', 'the same image at every station')}</Say>
    <g key={focus} className="tr-in">
      <Say x={0} y={252} size={14} fill="var(--blue)" caps>{e('Warum?', 'Why?')}</Say>
      <Say x={0} y={292} size={26}>{roles[focus][3]}</Say>
      <Say x={0} y={330} size={22} w={500} fill="var(--ink-2)">{roles[focus][4]}</Say>
    </g>
  </Svg>
)

/* ── What you have to look after on every machine: without and with Docker ── */
export const Effort = ({ docker }: { docker?: boolean }) => {
  const chips = docker ? ['Docker'] : ['JDK 21', 'Maven', 'Node 22', 'Postgres 18']
  let x = 110
  return (
    <Svg w={1000} h={118} label={`${t(e('Zu pflegen, auf jedem Gerät', 'To look after, on every machine'))}: ${chips.join(', ')}`}>
      <circle cx={42} cy={56} r={40} fill={docker ? 'var(--ok)' : 'var(--ink)'} />
      <Say x={42} y={70} size={40} anchor="middle" fill="#fff">{`${chips.length}×`}</Say>
      <Say x={110} y={16} size={13} fill="var(--ink-3)" caps>{e('Zu pflegen, auf jedem Gerät', 'To look after, on every machine')}</Say>
      {chips.map(c => {
        const w = c.length * 10.4 + 30, at = x
        x += w + 10
        return <g key={c}><rect x={at} y={30} width={w} height={36} rx={8} fill={docker ? 'var(--c-engine)' : '#fff'} stroke={docker ? 'none' : '#c3cddb'} strokeWidth={1.5} /><Say x={at + w / 2} y={54} size={16} anchor="middle" fill={docker ? '#fff' : 'var(--ink)'}>{c}</Say></g>
      })}
      <Say x={110} y={100} size={16} w={500} fill="var(--ink-2)">{docker
        ? e('Welche Version gilt, steht im Dockerfile und damit im Repo. Ein Update ist eine geänderte Zeile.', 'Which version applies is written in the Dockerfile, so in the repo. An update is one changed line.')
        : e('Zwei Projekte, zwei JDKs? JAVA_HOME umstellen, .env pflegen, jedes Update auf jedem Gerät.', 'Two projects, two JDKs? Switch JAVA_HOME, keep .env up to date, every update on every machine.')}</Say>
    </Svg>
  )
}

/* ── How containers came about: four stacks side by side, the current one in focus ── */
const eras: [string, string, string][] = [
  [e('1990er', '1990s'), e('Von Hand', 'By hand'), e('jede Installation ein Unikat', 'every installation one of a kind')],
  [e('2000er', '2000s'), e('Virtuelle Maschine', 'Virtual machine'), e('sicher getrennt, aber schwer', 'well separated, but heavy')],
  ['2013', 'Docker', e('leicht, startet in Sekunden', 'light, starts in seconds')],
  ['2014', 'Docker Compose', e('mehrere Container, eine Datei', 'several containers, one file')],
]
const trio = (x: number) => (['frontend', 'api', 'db'] as const).map((s, j) => <Box key={s} x={x + j * 80} y={210} w={70} h={40} svc={s} label={['web', 'app', 'db'][j]} size={12} />)
export const Evolution = ({ step }: { step: number }) => (
  <Svg w={1000} h={372} label={e('Vier Stapel nebeneinander: von Hand eingerichteter Server, virtuelle Maschinen, Docker-Container, Docker Compose', 'Four stacks side by side: a server set up by hand, virtual machines, Docker containers, Docker Compose')}>
    {eras.map(([year, name, note], k) => {
      const x = k * 250, on = step > 3 || step === k
      return (
        <g key={k} className="tr" style={{ opacity: on ? 1 : 0.28 }}>
          <Say x={x} y={22} size={13} fill="var(--ink-3)" caps>{year}</Say>
          <Say x={x} y={52} size={22}>{name}</Say>
          <B x={x} y={300} w={230} h={30} t="hw" label={e('Server', 'Server')} size={13} />
          <B x={x} y={258} w={230} h={34} t="kernel" label={k < 2 ? e('Betriebssystem', 'Operating system') : 'Linux-Kernel'} size={13} />
          {k === 0 && <><B x={x} y={216} w={230} h={34} t="reg" label={e('Java, Postgres … von Hand', 'Java, Postgres … by hand')} size={12.5} /><B x={x} y={174} w={230} h={34} t="app" label="App" size={13} /></>}
          {k === 1 && <>
            <B x={x} y={220} w={230} h={30} t="hyper" label="Hypervisor" size={13} />
            {[0, 1].map(v => <g key={v}><rect x={x + v * 120} y={126} width={110} height={86} rx={12} fill="var(--c-guest)" /><B x={x + v * 120 + 6} y={140} w={98} h={28} t="app" label="App" size={12} /><B x={x + v * 120 + 6} y={176} w={98} h={28} t="kernel" label={e('Gast-OS', 'Guest OS')} size={11.5} /></g>)}
          </>}
          {k >= 2 && trio(x)}
          {k === 2 && <B x={x} y={168} w={230} h={30} t="engine" label={e('docker run, je Container von Hand', 'docker run, each container by hand')} size={12.5} />}
          {k === 3 && <><rect x={x} y={168} width={230} height={30} rx={8} fill="#fff3d6" stroke="#e6c27a" strokeWidth={1.5} /><text x={x + 115} y={188} fontSize={12.5} fontWeight={700} fill="var(--ink)" textAnchor="middle" style={mono}>{t(e('compose.yaml startet alle', 'compose.yaml starts all'))}</text></>}
          <Say x={x} y={360} size={14} w={500} fill="var(--ink-2)">{note}</Say>
        </g>
      )
    })}
  </Svg>
)

/* ── Ask yourself: a command on the left, the question it raises on the right ── */
export const Ask = ({ cmd, lines }: { cmd: string; lines: string[] }) => (
  <Svg w={1000} h={190} label={`${cmd}. ${lines.map(l => t(l)).join(' ')}`}>
    <rect x={0} y={20} width={470} height={110} rx={14} fill="#0f1b2d" />
    <text x={24} y={84} fontSize={20} fill="#e2e8f0" style={mono}><tspan fill="#94a3b8">$ </tspan>{cmd}</text>
    <Say x={520} y={34} size={13} fill="var(--blue)" caps>{e('Stell dir die Frage', 'Ask yourself')}</Say>
    {lines.map((l, k) => <Say key={k} x={520} y={76 + k * 36} size={26}>{l}</Say>)}
  </Svg>
)

/* ── Three commands by hand: the same containers start, fail, and finally run with one Compose command ── */
const lines: [string, string][] = [
  ['docker run -d --name backend -e DB_HOST=db mensa-backend', e('kein --network und vor der db gestartet', 'no --network, and started before db')],
  ['docker run -d --name frontend mensa-frontend', e('kein -p 8080:80', 'no -p 8080:80')],
  ['docker run -d --name db -e POSTGRES_PASSWORD=geheim postgres:18', e('kein -v: Daten nicht dauerhaft', 'no -v: data not lasting')],
]
const fold = { transformOrigin: '500px 100px', transformBox: 'view-box' } as const
const foot = [
  e('3 Befehle von Hand. Sie sehen richtig aus, oder?', '3 commands by hand. They look right, don’t they?'),
  e('Jeder Befehl hat eine Lücke, und jede Lücke lässt einen Container scheitern.', 'Every command has a gap, and every gap makes a container fail.'),
  e('1 Befehl: Netz, Reihenfolge, Ports und Volume stehen in der compose.yaml.', '1 command: network, order, ports and volume are in the compose.yaml.'),
]
// containers left to right with the status they show in each step
const crew: ['frontend' | 'api' | 'db', string, string][] = [
  ['frontend', 'frontend', e('✗ von außen nicht erreichbar', '✗ unreachable from outside')],
  ['api', 'backend', e('✗ findet db nicht', '✗ cannot find db')],
  ['db', 'db', e('✗ Daten gehen verloren', '✗ data gets lost')],
]
export const Manual = ({ step }: { step: number }) => {
  const color = step === 0 ? 'var(--ink-3)' : step === 1 ? 'var(--bad)' : 'var(--ok)'
  return (
    <Svg w={1000} h={440} label={t(foot[step])}>
      <rect x={0} y={0} width={1000} height={200} rx={14} fill="#0f1b2d" />
      <text x={20} y={26} fontSize={12.5} fontWeight={700} fill="#9fb0c8">Terminal</text>
      <g className="tr" style={{ ...fold, opacity: step === 2 ? 0 : 1, transform: step === 2 ? 'scale(0.04)' : 'none' }}>
        {lines.map(([cmd, err], k) => (
          <g key={k}>
            <text x={20} y={58 + k * 50} fontSize={14} fill="#e2e8f0" style={mono}>{`$ ${cmd}`}</text>
            <Fade on={step >= 1} delay={k * 160}><Say x={40} y={78 + k * 50} size={13} w={600} fill="#fca5a5">{`✗ ${t(err)}`}</Say></Fade>
          </g>
        ))}
      </g>
      <g className="tr" style={{ ...fold, opacity: step === 2 ? 1 : 0, transform: step === 2 ? 'none' : 'scale(0.04)', transitionDelay: step === 2 ? '450ms' : '0ms' }}>
        <text x={500} y={66} fontSize={26} fontWeight={700} fill="#fff" textAnchor="middle" style={mono}>$ docker compose up -d</text>
        {['✔ Network mensa_default       Created', '✔ Container mensa-db-1        Healthy', '✔ Container mensa-backend-1   Started', '✔ Container mensa-frontend-1  Started'].map((l, k) => (
          <text key={k} x={320} y={102 + k * 24} fontSize={14} fill="#86efac" style={mono}>{l}</text>
        ))}
      </g>
      <rect x={0} y={218} width={1000} height={180} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
      <Say x={16} y={241} size={14} fill="var(--ink-2)">{e('Dein Rechner', 'Your machine')}</Say>
      <Icon name="browser" x={20} y={278} s={52} />
      {[[78, 196], [380, 446], [630, 696]].map(([x1, x2], k) => (
        <path key={k} className="tr-fill" d={`M${x1} 306 H${x2}`} strokeWidth={2.5} fill="none" strokeDasharray={step === 2 ? undefined : '7 5'} style={{ stroke: color }} />
      ))}
      {crew.map(([svc, name, fail], k) => {
        const x = 200 + k * 250
        return (
          <g key={svc}>
            <g className="tr" style={{ opacity: step === 1 ? 0.55 : 1 }}><Box x={x} y={278} w={180} h={56} svc={svc} label={name} size={15} /></g>
            <circle className="tr-fill" cx={x + 180 - 4} cy={282} r={11} style={{ fill: step === 2 ? 'var(--ok)' : step === 1 ? 'var(--bad)' : 'var(--ink-3)' }} />
            <g key={step} className="tr-in">
              <Say x={x + 90} y={364} size={14} anchor="middle" fill={color}>{step === 0 ? e('startet …', 'starting …') : step === 1 ? fail : e('✓ läuft, verbunden', '✓ running, connected')}</Say>
            </g>
          </g>
        )
      })}
      <g key={`f${step}`} className="tr-in"><Say x={0} y={428} size={18}>{foot[step]}</Say></g>
    </Svg>
  )
}

/* ── Quiz: the question on a dark card, the options as a list; the answer lights up on the next step ── */
type Way = 'jar' | 'ctr' | 'vm'
export type Option = { label: string; icon?: Way; code?: boolean }
const wayIcon = (w: Way, cx: number, cy: number, s = 1) => {
  const k = (d: number) => d * s
  if (w === 'jar') return <g><rect x={cx - k(46)} y={cy - k(32)} width={k(92)} height={k(64)} rx={k(10)} fill="#0f1b2d" /><text x={cx - k(30)} y={cy + k(9)} fontSize={k(26)} fontWeight={700} fill="#4ade80" style={mono}>&gt;_</text></g>
  if (w === 'ctr') return <g><rect x={cx - k(54)} y={cy - k(32)} width={k(108)} height={k(64)} rx={k(6)} fill="#1d63ed" />{[1, 2, 3, 4, 5, 6, 7].map(r => <path key={r} d={`M${cx - k(54) + k(r * 13.5)} ${cy - k(26)} V${cy + k(26)}`} stroke="rgba(255,255,255,.3)" strokeWidth={k(2.5)} />)}</g>
  return <g><rect x={cx - k(50)} y={cy - k(34)} width={k(100)} height={k(62)} rx={k(8)} fill="none" stroke="var(--ink)" strokeWidth={k(4)} /><rect x={cx - k(32)} y={cy - k(20)} width={k(64)} height={k(34)} rx={k(4)} fill="#c4b5fd" /></g>
}
export const ways: Option[] = [{ label: 'java -jar', icon: 'jar' }, { label: 'Container', icon: 'ctr' }, { label: e('Virtuelle Maschine', 'Virtual machine'), icon: 'vm' }]
/** A check button under an interactive scene. */
const Check = ({ done, onCheck, onReset }: { done: boolean; onCheck: () => void; onReset: () => void }) => (
  <button type="button" className="quiz-check" onClick={done ? onReset : onCheck}>{t(done ? e('Nochmal', 'Try again') : e('Prüfen', 'Check'))}</button>
)
export const Quiz = ({ n, of, question, options, pick, why }: { n: number; of: number; question: string; options: Option[]; pick: number; why: string }) => {
  const [sel, setSel] = useState<number>()
  const [done, setDone] = useState(false)
  const right = done && sel === pick
  return (
    <div className="dg-col">
      <Svg w={1000} h={290} label={t(question)}>
        <rect x={0} y={0} width={380} height={238} rx={18} fill="var(--ink)" />
        <Say x={28} y={40} size={13} fill="#9fb0c8" caps>{`${t(e('Frage', 'Question'))} ${n}/${of}`}</Say>
        {wrap(t(question), 24).map((l, k) => <Say key={k} x={28} y={86 + k * 34} size={24} fill="#fff">{l}</Say>)}
        {options.map(({ label, icon, code }, k) => {
          const y = k * 84, chosen = sel === k, ok = done && k === pick, bad = done && chosen && k !== pick
          return (
            <g key={k} style={{ cursor: done ? 'default' : 'pointer' }} onClick={() => !done && setSel(k)}>
              <rect className="tr-fill" x={420} y={y} width={580} height={70} rx={14} strokeWidth={chosen || ok ? 2.5 : 1.5}
                style={{ fill: ok ? '#e2f5ec' : bad ? '#fdecea' : chosen ? '#eef4ff' : '#fff', stroke: ok ? 'var(--ok)' : bad ? 'var(--bad)' : chosen ? 'var(--blue)' : '#d8dfea' }} />
              <circle className="tr-fill" cx={452} cy={y + 35} r={11} strokeWidth={2} style={{ fill: chosen ? (bad ? 'var(--bad)' : ok ? 'var(--ok)' : 'var(--blue)') : '#fff', stroke: chosen ? 'transparent' : 'var(--ink-3)' }} />
              {icon && wayIcon(icon, 510, y + 35, 0.45)}
              <Say x={icon ? 560 : 480} y={y + 43} size={code ? 21 : 20} code={code}>{label}</Say>
            </g>
          )
        })}
        {done
          ? <g className="tr-in">{wrap(`${t(right ? e('Richtig.', 'Correct.') : e('Nicht ganz.', 'Not quite.'))} ${t(why)}`, 66).map((l, k) => <Say key={k} x={420} y={268 + k * 22} size={16} w={500} fill={right ? 'var(--ok)' : 'var(--bad)'}>{l}</Say>)}</g>
          : <Say x={420} y={268} size={16} w={500} fill="var(--ink-3)">{e('Wähle eine Antwort und prüfe sie.', 'Pick an answer and check it.')}</Say>}
      </Svg>
      <Check done={done} onCheck={() => sel !== undefined && setDone(true)} onReset={() => { setSel(undefined); setDone(false) }} />
    </div>
  )
}

/* ── compose.yaml, one key at a time: the highlight moves, the file stays ── */
const yaml: [string, number][] = [
  ['services:', 0], ['  frontend:', 0], ['    build: ./frontend', 0], ['    ports: ["8080:80"]', 1],
  ['  backend:', 0], ['    build: ./backend', 0], ['    environment:', 2], ['      DB_HOST: db', 2], ['    depends_on: [db]', 3],
  ['  db:', 0], ['    image: postgres:18', 0], ['    expose: ["5432"]', 1], ['    environment:', 2], ['      POSTGRES_PASSWORD: geheim', 2], ['    volumes: [dbdata:/var/lib/postgresql]', 4],
  ['volumes: { dbdata: }', 4],
]
const runs = yaml.reduce<{ sec: number; from: number; len: number }[]>((acc, [, sec], k) => {
  const last = acc[acc.length - 1]
  if (last && last.sec === sec && last.from + last.len === k) last.len++
  else acc.push({ sec, from: k, len: 1 })
  return acc
}, [])
const keys: [string, string, [string, string]][] = [
  ['services', e('die Container', 'the containers'), [e('Ein Eintrag pro Container: mit build:', 'One entry per container: built yourself'), e('selbst gebaut, mit image: geladen.', 'with build:, downloaded with image:.')]],
  ['ports', e('Ports, außen und innen', 'ports, outside and inside'), [e('ports 8080:80: Host-Port → Container-Port.', 'ports 8080:80: host port → container port.'), e('expose 5432: Port nur im Docker-Netz.', 'expose 5432: port only in the Docker network.')]],
  ['environment', e('Einstellungen', 'Settings'), [e('Einstellungen als Umgebungsvariablen,', 'Settings as environment variables,'), e('zum Beispiel DB_HOST = db.', 'for example DB_HOST = db.')]],
  ['depends_on', e('Reihenfolge', 'order'), [e('Startreihenfolge: erst db,', 'Start order: first db,'), e('dann backend.', 'then backend.')]],
  ['volumes', e('Daten, die bleiben', 'data that stays'), [e('Daten liegen außerhalb des Containers', 'Data lives outside the container'), e('und überleben down und up.', 'and survives down and up.')]],
]
export const Anatomy = ({ focus }: { focus: number }) => (
  <Svg w={1000} h={376} label={`compose.yaml: ${keys[focus][0]}. ${t(keys[focus][2][0])} ${t(keys[focus][2][1])}`}>
    <rect x={0} y={0} width={440} height={372} rx={14} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} />
    <text x={16} y={26} fontSize={15} fontWeight={700} fill="var(--ink)" style={mono}>compose.yaml</text>
    {runs.map((r, k) => <rect key={k} className="tr" x={8} y={56 + r.from * 20 - 15} width={424} height={r.len * 20} rx={4} fill="#dbe7ff" style={{ opacity: r.sec === focus ? 1 : 0 }} />)}
    {yaml.map(([l, sec], k) => <text key={k} className="tr-fill" x={16} y={56 + k * 20} fontSize={13.5} fontWeight={sec === focus ? 700 : 400} style={{ fill: sec === focus ? 'var(--ink)' : '#a7b1bf', ...mono }}>{l}</text>)}
    {keys.map(([key, short], k) => (
      <g key={key}>
        <circle className="tr-fill" cx={492} cy={30 + k * 34} r={7} style={{ fill: k === focus ? 'var(--blue)' : '#c3cddb' }} />
        <Say x={510} y={36 + k * 34} size={17} code fill={k === focus ? 'var(--blue-deep)' : 'var(--ink-3)'}>{key}</Say>
        <Say x={680} y={36 + k * 34} size={14} w={500} fill={k === focus ? 'var(--ink-2)' : '#a7b1bf'}>{short}</Say>
      </g>
    ))}
    <g key={focus} className="tr-in">
      <Say x={480} y={240} size={30} code fill="var(--blue-deep)">{keys[focus][0]}</Say>
      <Say x={480} y={284} size={20} w={500} fill="var(--ink-2)">{keys[focus][2][0]}</Say>
      <Say x={480} y={314} size={20} w={500} fill="var(--ink-2)">{keys[focus][2][1]}</Say>
    </g>
  </Svg>
)

/* ── What a container really is: one process, walled in by the kernel ── */
const why: [string, string][] = [
  [e('Für den Kernel sind beide nur Prozesse.', 'To the kernel both are just processes.'), e('Kein eigenes Betriebssystem, kein eigener Kernel im Container.', 'No operating system and no kernel of its own in the container.')],
  [e('Namespaces: Der Kernel gibt ihm eine eigene Sicht.', 'Namespaces: the kernel gives it a view of its own.'), e('Eigene Dateien, eigenes Netz mit eigenem localhost, nur die eigenen Prozesse.', 'Own files, own network with its own localhost, only its own processes.')],
  [e('cgroups: Der Kernel setzt ihm Grenzen.', 'cgroups: the kernel sets it limits.'), e('Zum Beispiel höchstens ein CPU-Kern und 512 MB Arbeitsspeicher.', 'For example at most one CPU core and 512 MB of memory.')],
  [e('Seine Dateien kommen aus dem Image.', 'Its files come from the image.'), e('Das Image wird sein Wurzelverzeichnis /, mehr Dateien sieht er nicht.', 'The image becomes its root directory /, it sees no other files.')],
]
export const Walls = ({ step }: { step: number }) => (
  <div className="dg-col">
    <Svg w={1000} h={424} label={`${t(why[step][0])} ${t(why[step][1])}`}>
      <g key={step} className="tr-in">
        <Say x={0} y={24} size={22}>{why[step][0]}</Say>
        <Say x={0} y={54} size={17} w={500} fill="var(--ink-2)">{why[step][1]}</Say>
      </g>
      <rect x={0} y={84} width={1000} height={336} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
      <Say x={16} y={107} size={14} fill="var(--ink-2)">{e('Dein Rechner · Linux', 'Your machine · Linux')}</Say>
      <Fade on={step >= 1}><B x={40} y={240} w={280} h={34} t="reg" label={e('sieht den ganzen Rechner', 'sees the whole machine')} size={13.5} /></Fade>
      <B x={40} y={290} w={280} h={46} t="app" label="java -jar app.jar" size={15} mono />
      <path d="M180 336 V358" stroke="var(--ink-3)" strokeWidth={2} />
      <rect className="tr" x={400} y={116} width={560} height={234} rx={16} fill="#fff" stroke="var(--blue)" strokeWidth={2.5} strokeDasharray="8 5" style={{ opacity: step >= 1 ? 1 : 0 }} />
      <Fade on={step >= 1}>
        <Say x={416} y={140} size={14} fill="var(--blue-deep)">Container backend</Say>
        {[e('Dateien: nur /', 'Files: only /'), e('Netz: eigene IP', 'Network: own IP'), e('Prozesse: nur PID 1', 'Processes: only PID 1')].map((l, k) => <B key={k} x={416 + k * 180} y={150} w={170} h={30} t="libs" label={l} size={12.5} />)}
        <Say x={416} y={198} size={12} fill="var(--blue)" caps>{e('Namespaces · eigene Sicht', 'Namespaces · own view')}</Say>
      </Fade>
      <Fade on={step >= 2}>
        {([[e('CPU ≤ 1 Kern', 'CPU ≤ 1 core'), 0.25], [e('RAM ≤ 512 MB', 'RAM ≤ 512 MB'), 0.4]] as const).map(([l, f], k) => (
          <g key={k}>
            <Say x={416 + k * 280} y={222} size={13}>{l}</Say>
            <rect x={416 + k * 280} y={230} width={250} height={10} rx={5} fill="#e3e8f0" />
            <rect x={418 + k * 280} y={232} width={250 * f - 4} height={6} rx={3} fill="var(--blue)" />
          </g>
        ))}
        <Say x={416} y={258} size={12} fill="var(--blue)" caps>{e('cgroups · eigene Grenzen', 'cgroups · own limits')}</Say>
      </Fade>
      <Fade on={step >= 3}>
        {['app.jar', 'JDK 21', e('Linux-Basis', 'Linux base')].map((l, k) => <B key={k} x={416} y={272 + k * 24} w={130} h={20} t="libs" label={l} size={11} />)}
      </Fade>
      <B x={560} y={290} w={280} h={46} t="app" label="java -jar app.jar" size={15} mono />
      <path d="M700 350 V358" stroke="var(--ink-3)" strokeWidth={2} />
      <B x={16} y={360} w={968} h={48} t="kernel" label="Linux-Kernel" sub={step === 0 ? e('führt beide als ganz normale Prozesse aus', 'runs both as perfectly normal processes') : e('Namespaces und cgroups sind Funktionen des Kernels', 'namespaces and cgroups are features of the kernel')} size={15} />
    </Svg>
    <Take i={1} label={e('Merke', 'Remember')} text={e('Ein Container ist ein normaler Prozess, den der Linux-Kernel abschottet: Namespaces bestimmen, was er sieht, cgroups, wie viel er verbraucht, und das Image liefert seine Dateien.', 'A container is a normal process that the Linux kernel walls in: namespaces decide what it sees, cgroups how much it may use, and the image supplies its files.')} />
  </div>
)

/* ── When Docker fits: situations with a verdict, like a decision table ── */
const fits: [string, 'ok' | 'sand' | 'bad', string, string][] = [
  [e('Team mit macOS, Windows und Linux', 'Team on macOS, Windows and Linux'), 'ok', e('passt gut', 'fits well'), e('gleiche Umgebung überall', 'the same environment everywhere')],
  [e('App aus Frontend, Backend und DB', 'App of frontend, backend and DB'), 'ok', e('passt gut', 'fits well'), e('eine compose.yaml für alles', 'one compose.yaml for everything')],
  [e('Abgabe oder Demo auf einem Server', 'Hand-in or demo on one server'), 'ok', e('passt gut', 'fits well'), e('dasselbe Image wie lokal', 'the same image as locally')],
  [e('Docker auf macOS oder Windows', 'Docker on macOS or Windows'), 'sand', e('mit Haken', 'with a catch'), e('läuft in einer Linux-VM', 'runs in a Linux VM')],
  [e('Daten der Datenbank', 'Data of the database'), 'sand', e('mit Haken', 'with a catch'), e('dauerhaft nur mit Volume', 'lasting only with a volume')],
  [e('Viele Server, automatisch skaliert', 'Many servers, scaled automatically'), 'bad', e('nicht mit Compose', 'not with Compose'), e('dafür gibt es Kubernetes', 'that is what Kubernetes is for')],
  [e('Native iPhone-App bauen', 'Building a native iPhone app'), 'bad', e('nein', 'no'), e('braucht macOS mit Xcode', 'needs macOS with Xcode')],
]
const tone = { ok: ['#e2f5ec', 'var(--ok)'], sand: ['#fff3d6', '#8a6a20'], bad: ['#fdecea', 'var(--bad)'] }
export const Fit = () => (
  <Svg w={1000} h={420} label={e('Wann Docker passt: sieben Situationen mit Urteil und Grund', 'When Docker fits: six situations with verdict and reason')}>
    {([[e('Situation', 'Situation'), 0], [e('Docker?', 'Docker?'), 560], [e('Warum', 'Why'), 740]] as const).map(([l, x]) => <Say key={x} x={x + 16} y={16} size={12} fill="var(--ink-3)" caps>{l}</Say>)}
    {fits.map(([sit, k, verdict, reason], r) => {
      const y = 30 + r * 55
      return (
        <g key={r}>
          <rect x={0} y={y} width={1000} height={47} rx={10} fill="#fff" stroke="#e3e8f0" strokeWidth={1} />
          <Say x={16} y={y + 30} size={17}>{sit}</Say>
          <rect x={570} y={y + 9} width={150} height={29} rx={14.5} fill={tone[k][0]} />
          <Say x={645} y={y + 29} size={14} anchor="middle" fill={tone[k][1]}>{verdict}</Say>
          <Say x={756} y={y + 30} size={15} w={500} fill="var(--ink-2)">{reason}</Say>
        </g>
      )
    })}
  </Svg>
)

/* ── Closing: from the repo to the running project, in one command ── */
export const Wrap = () => (
  <Svg w={1000} h={300} label={e('Dockerfile und compose.yaml im Repo, docker compose up, und das ganze Projekt läuft.', 'Dockerfile and compose.yaml in the repo, docker compose up, and the whole project runs.')}>
    <rect x={0} y={20} width={300} height={150} rx={14} fill="#fff" stroke="var(--keel)" strokeWidth={2} />
    <Say x={16} y={46} size={15}>{e('Git-Repo · mensa-app', 'Git repo · mensa-app')}</Say>
    {['Dockerfile', 'compose.yaml'].map((f, k) => <g key={f}><rect x={16} y={62 + k * 48} width={268} height={38} rx={8} fill="#fff3d6" stroke="#e6c27a" strokeWidth={1.5} /><text x={150} y={87 + k * 48} fontSize={15} fontWeight={700} fill="var(--ink)" textAnchor="middle" style={mono}>{f}</text></g>)}
    <path d="M306 95 H396" stroke="var(--ink-2)" strokeWidth={2.4} markerEnd="url(#ah-go)" />
    <rect x={404} y={70} width={210} height={50} rx={10} fill="#0f1b2d" />
    <text x={509} y={101} fontSize={15} fill="#e2e8f0" textAnchor="middle" style={mono}>docker compose up</text>
    <path d="M620 95 H676" stroke="var(--ink-2)" strokeWidth={2.4} markerEnd="url(#ah-go)" />
    <rect x={684} y={20} width={316} height={150} rx={14} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
    <Say x={700} y={44} size={14} fill="var(--ink-2)">{e('jeder Rechner', 'every machine')}</Say>
    {(['frontend', 'api', 'db'] as const).map((s, j) => <Box key={s} x={700 + j * 96} y={70} w={88} h={48} svc={s} label={s === 'api' ? 'backend' : s} size={12.5} />)}
    <path d="M788 94 H796 M884 94 H892" stroke="var(--ok)" strokeWidth={2.5} />
    <Say x={842} y={152} size={14} anchor="middle" fill="var(--ok)">{e('läuft, verbunden', 'running, connected')}</Say>
    <Say x={500} y={232} size={26} anchor="middle">{e('Dockerfile und compose.yaml im Repo:', 'Dockerfile and compose.yaml in the repo:')}</Say>
    <Say x={500} y={272} size={26} anchor="middle" fill="var(--blue)">{e('das ganze Projekt startet überall mit einem Befehl.', 'the whole project starts everywhere with one command.')}</Say>
  </Svg>
)

/** The three ideas to take away, under the closing chat. */
export const Summary = () => (
  <g>
    {([['Dockerfile', e('beschreibt die Umgebung', 'describes the environment')], [e('Image und Container', 'Image and container'), e('Vorlage und laufende Instanz', 'template and running instance')], ['Compose', e('startet alles zusammen', 'starts everything together')]] as const).map(([h, sub], k) => (
      <g key={k}>
        <rect x={k * 340} y={300} width={320} height={64} rx={12} fill="#fff3d6" stroke="#e6c27a" strokeWidth={1.5} />
        <Say x={k * 340 + 160} y={327} size={18} anchor="middle">{h}</Say>
        <Say x={k * 340 + 160} y={351} size={14} w={500} anchor="middle" fill="#8a6a20">{sub}</Say>
      </g>
    ))}
  </g>
)

/** The question under the opening chat. */
export const Familiar = () => <Say x={500} y={340} size={34} anchor="middle" fill="var(--blue)">{e('Kennst du das?', 'Sound familiar?')}</Say>
