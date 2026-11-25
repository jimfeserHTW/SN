import type { ReactNode } from 'react'
import { Svg, Take, Box as B } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Mark, In, Txt, Go } from '../../components/harbor/harbor.tsx'

// Overview slides of the first sub-chapter: what stays, what goes. Volume, bind mount and tmpfs, drawn where the data lives.
/** A disk store: a volume on the machine's disk. */
const Disk = ({ x, y, w, label, sub, i = 0 }: { x: number; y: number; w: number; label: string; sub?: string; i?: number }) => (
  <In i={i}>
    <path d={`M${x} ${y + 8} v36 a${w / 2} 8 0 0 0 ${w} 0 v-36`} fill="#e8f0fe" stroke="var(--blue)" strokeWidth={2} />
    <ellipse cx={x + w / 2} cy={y + 8} rx={w / 2} ry={8} fill="#f4f8ff" stroke="var(--blue)" strokeWidth={2} />
    <text x={x + w / 2} y={y + 34} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--blue-deep)">{label}</text>
    {sub && <text x={x + w / 2} y={y + 72} textAnchor="middle" fontSize={12.5} fill="var(--ink-2)">{sub}</text>}
  </In>
)
/** Memory: tmpfs lives in RAM. */
const Ram = ({ x, y, w, h, i = 0, dim }: { x: number; y: number; w: number; h: number; i?: number; dim?: boolean }) => (
  <g opacity={dim ? .3 : 1}><In i={i}>
    <rect x={x} y={y} width={w} height={h} rx={6} fill="#fff3d6" stroke="#c9a24f" strokeWidth={1.5} />
    {Array.from({ length: Math.floor(w / 16) }, (_, k) => <path key={k} d={`M${x + 10 + k * 16} ${y + h} v6`} stroke="#c9a24f" strokeWidth={2} />)}
  </In></g>
)

/* ── a volume: data stays when the container goes ── */
const hold: { title: string; sub: string; ghost?: boolean; tone?: 'ok' }[] = [
  { title: e('db schreibt ins Volume', 'db writes into the volume'), sub: e('die Mensa-Bewertungen', 'the canteen ratings') },
  { title: e('db wird entfernt', 'db is removed'), sub: 'docker compose down', ghost: true, tone: 'ok' },
  { title: e('neue db, alte Daten', 'new db, old data'), sub: 'docker compose up', tone: 'ok' },
]
export const Hold = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Drei Schritte: Daten im Volume, Container weg, neuer Container findet dieselben Daten', 'Three steps: data in the volume, container gone, a new container finds the same data')}>
      {hold.map((h, k) => {
        const x = 10 + k * 336
        return (
          <g key={k}>
            <In i={k}><rect x={x} y={10} width={310} height={300} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} /></In>
            <Box x={x + 95} y={100} w={120} h={60} svc="db" ghost={h.ghost} i={k} />
            <Disk x={x + 80} y={186} w={150} label={e('Volume dbdata', 'volume dbdata')} sub={e('auf der Festplatte', 'on the disk')} i={k} />
            {!h.ghost && <In i={k}><path d={`M${x + 155} 162 V184`} stroke="var(--blue)" strokeWidth={3} /></In>}
            <In i={k}><Txt x={x + 155} y={46} size={16} w={700} fill="var(--ink)" anchor="middle">{h.title}</Txt></In>
            <In i={k}><text x={x + 155} y={70} textAnchor="middle" fontSize={13} style={k ? { fontFamily: 'var(--mono)' } : undefined} fill="var(--ink-2)">{h.sub}</text></In>
            {h.tone && <Mark x={x + 280} y={290} ok i={k} r={14} />}
            {k < 2 && <Go d={`M${x + 314} 160 H${x + 332}`} i={k + 1} />}
          </g>
        )
      })}
    </Svg>
    <Take i={3} label={e('Achtung', 'Careful')} text={e('Erst docker compose down -v löscht auch das Volume. Dann sind die Daten weg.', 'Only docker compose down -v deletes the volume too. Then the data is gone.')} />
  </div>
)

/* ── what is inside the container leaves with it ── */
export const Inside = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Ein Container mit hochgeladenen Bildern, nach docker rm ist alles weg', 'A container with uploaded pictures, after docker rm everything is gone')}>
      <Box x={60} y={40} w={300} h={210} svc="api" label={e('Container api', 'Container api')} open items={['app.jar', e('Uploads: 12 Bilder', 'uploads: 12 pictures'), e('Logs von heute', 'today’s logs')]} i={0} />
      <Go d="M380 145 H600" i={1} />
      <In i={1}><text x={490} y={132} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>docker rm api</text></In>
      <Box x={630} y={40} w={300} h={210} svc="api" ghost label={e('kein Container mehr', 'no container any more')} i={2} />
      <Mark x={930} y={40} bad i={2} />
      <Tag x={180} y={276} w={640} label={e('Uploads und Logs sind mit dem Container gelöscht', 'Uploads and logs are deleted with the container')} tone="bad" i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Alles, was ein Container in sich selbst schreibt, gehört zu ihm. Was bleiben soll, muss außerhalb des Containers liegen.', 'Everything a container writes into itself belongs to it. Whatever should stay has to live outside the container.')} />
  </div>
)

/* ── a bind mount: a folder of your own machine inside the container ── */
export const PassThrough = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Ein Ordner auf dem Laptop ist per Bind Mount im Container eingebunden', 'A folder on the laptop is mounted into the container with a bind mount')}>
      <In i={0}><rect x={20} y={40} width={330} height={210} rx={16} fill="#fff" stroke="var(--keel)" strokeWidth={2} /><Txt x={40} y={70} size={15} w={700} fill="var(--ink)">{e('Dein Laptop', 'Your laptop')}</Txt></In>
      <In i={0}><Icon name="folder" x={140} y={100} s={90} /><Txt x={185} y={218} size={14} w={700} fill="var(--ink)" anchor="middle">./src</Txt></In>
      <In i={1}><rect x={350} y={120} width={300} height={50} rx={8} fill="#e8f0fe" stroke="var(--blue)" strokeWidth={2} /><text x={500} y={151} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--blue-deep)" style={{ fontFamily: 'var(--mono)' }}>./src → /app/src</text></In>
      <Go d="M355 108 H640" i={2} /><Go d="M645 182 H360" i={2} kind="back" />
      <In i={2}><Txt x={500} y={98} size={13} anchor="middle">{e('du speicherst', 'you save')}</Txt><Txt x={500} y={204} size={13} fill="var(--blue)" anchor="middle">{e('der Container schreibt', 'the container writes')}</Txt></In>
      <Box x={650} y={40} w={330} h={210} svc="frontend" label={e('Container frontend', 'Container frontend')} open items={[e('/app/src · dein Ordner, live', '/app/src · your folder, live'), e('node_modules · eigene', 'node_modules · its own')]} i={1} />
      <Tag x={160} y={276} w={680} label={e('Beim Entwickeln: Änderungen sofort im Container, ohne neu zu bauen', 'While developing: changes in the container at once, without rebuilding')} sub={e('der Ordner gehört dir, nicht Docker: er bleibt immer', 'the folder belongs to you, not Docker: it always stays')} tone="ok" i={3} />
    </Svg>
  </div>
)

/* ── tmpfs: data only in memory ── */
export const Scratch = () => (
  <div className="dg-col">
    <Svg w={1000} h={300} label={e('Ein tmpfs im Arbeitsspeicher des Containers ist nach dem Stoppen leer', 'A tmpfs in the container’s memory is empty after stopping')}>
      {[0, 1].map(k => (
        <g key={k}>
          <Box x={110 + k * 480} y={112} w={280} h={118} svc="api" i={k * 2} />
          <Ram x={150 + k * 480} y={24} w={200} h={62} i={k * 2} dim={k === 1} />
          <g opacity={k ? .3 : 1}><In i={k * 2}><Txt x={250 + k * 480} y={50} size={13} w={700} fill="#6b4a00" anchor="middle">{e('tmpfs im RAM', 'tmpfs in RAM')}</Txt><Txt x={250 + k * 480} y={70} size={12} fill="#6b4a00" anchor="middle">{e('Sitzungen, Cache', 'sessions, cache')}</Txt></In></g>
        </g>
      ))}
      <Go d="M400 170 H580" i={1} />
      <In i={1}><text x={490} y={158} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>docker stop</text></In>
      <Mark x={830} y={24} bad i={2} />
      <Tag x={110} y={250} w={780} label={e('tmpfs liegt im Arbeitsspeicher: schnell, nicht im Volume oder Image, weg beim Stoppen', 'tmpfs lives in memory: fast, not in a volume or image, gone when stopped')} tone="sand" i={3} />
    </Svg>
  </div>
)

/* ── which storage for what ── */
const kinds: { title: string; tech: string; use: string; life: string; tone: 'ok' | 'sand' | 'bad' | undefined; icon: ReactNode }[] = [
  { title: 'Volume', tech: e('von Docker verwaltet', 'managed by Docker'), use: e('Datenbank, Uploads', 'database, uploads'), life: e('bleibt, bis ihr es löscht', 'stays until you delete it'), tone: 'ok', icon: <Disk x={70} y={66} w={100} label="dbdata" /> },
  { title: 'Bind Mount', tech: e('Ordner vom Rechner', 'folder from the machine'), use: e('Quellcode beim Entwickeln', 'source code while developing'), life: e('liegt bei dir, bleibt immer', 'lives with you, always stays'), tone: 'ok', icon: <Icon name="folder" x={88} y={66} s={64} /> },
  { title: 'tmpfs', tech: e('nur im Arbeitsspeicher', 'only in memory'), use: e('Zwischenstände, Cache', 'scratch data, cache'), life: e('weg beim Stoppen', 'gone when stopped'), tone: 'sand', icon: <Ram x={70} y={74} w={100} h={40} /> },
  { title: e('Schreibschicht', 'Writable layer'), tech: e('im Container selbst', 'inside the container'), use: e('nichts, was ihr behalten wollt', 'nothing you want to keep'), life: e('weg mit docker rm', 'gone with docker rm'), tone: 'bad', icon: <Box x={64} y={70} w={112} h={46} svc="api" /> },
]
export const Which = () => (
  <div className="dg-col">
    <Svg w={1000} h={300} label={e('Vier Speicherorte und wofür sie gut sind', 'Four storage places and what they are good for')}>
      {kinds.map((k, j) => (
        <In key={k.title} i={j}>
          <g transform={`translate(${j * 250} 0)`}>
            <rect x={6} y={10} width={228} height={280} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
            <Txt x={120} y={46} size={17} w={700} fill="var(--ink)" anchor="middle">{k.title}</Txt>
            {k.icon}
            <Txt x={120} y={160} size={13} w={700} fill="var(--blue-deep)" anchor="middle">{k.tech}</Txt>
            <Txt x={120} y={196} size={13.5} fill="var(--ink)" anchor="middle">{k.use}</Txt>
            <rect x={24} y={226} width={192} height={42} rx={10} fill={k.tone === 'ok' ? '#e2f5ec' : k.tone === 'bad' ? '#fdecea' : '#fff3d6'} />
            <Txt x={120} y={252} size={12.5} w={700} fill={k.tone === 'ok' ? 'var(--ok)' : k.tone === 'bad' ? 'var(--bad)' : '#6b4a00'} anchor="middle">{k.life}</Txt>
          </g>
        </In>
      ))}
    </Svg>
    <Take i={4} label={e('Faustregel', 'Rule of thumb')} text={e('Daten gehören in ein Volume, euer Code in einen Bind Mount, Wegwerfdaten ins tmpfs. Im Container selbst bleibt nichts Wichtiges.', 'Data goes into a volume, your code into a bind mount, throwaway data into tmpfs. Nothing important stays inside the container itself.')} />
  </div>
)
