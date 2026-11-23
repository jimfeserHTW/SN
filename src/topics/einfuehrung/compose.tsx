import type { ReactNode } from 'react'
import { Svg, Take, Num, Box as B, Zone, Ctr, Arrow, Label, Wire, Tick } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Mark, Sheet, In, Txt, Go, type Svc } from '../../components/harbor/harbor.tsx'

// Einführung in Docker Compose: the Mensa-App needs three containers on ONE machine.
// Technical terms, abstract graphics. Compose runs one machine, never a cluster. Only the last slide shows commands.
const trio: [Svc, number][] = [['frontend', 110], ['api', 420], ['db', 730]]
const host = (y: number, h: number, i = 0) => <Zone x={20} y={y} w={960} h={h} label={e('Dein Rechner', 'Your machine')} sub="Docker" i={i} />

/* ── ① 1 · the app grows: three containers that need each other ── */
export const Grows = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Drei Container der Mensa-App auf einem Rechner, jeder mit eigenen Bedürfnissen', 'Three containers of the Mensa-App on one machine, each with needs of its own')}>
      {host(170, 150)}
      {trio.map(([s, x], k) => <Box key={s} x={x + 5} y={222} w={150} h={60} svc={s} i={1 + k} />)}
      <Go d="M269 252 H421" i={4} /><Go d="M579 252 H731" i={4} />
      <In i={4}><Txt x={345} y={240} size={12.5} anchor="middle">{e('ruft', 'calls')}</Txt><Txt x={655} y={240} size={12.5} anchor="middle">{e('liest und schreibt', 'reads and writes')}</Txt></In>
      <Tag x={75} y={40} w={230} label="Vue-Frontend" sub={e('Port 8080 nach außen', 'port 8080 to the outside')} i={1} />
      <Tag x={385} y={40} w={230} label="Spring-Boot-API" sub={e('braucht DB_HOST und Passwort', 'needs DB_HOST and a password')} i={2} />
      <Tag x={695} y={40} w={230} label="Postgres" sub={e('braucht Passwort und ein Volume', 'needs a password and a volume')} i={3} />
      <Lead d="M190 86 V218" end={[190, 220]} i={1} /><Lead d="M500 86 V218" end={[500, 220]} i={2} /><Lead d="M810 86 V218" end={[810, 220]} i={3} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Eine App, drei Container. Jeder braucht seine Einstellungen, und alle müssen einander finden.', 'One app, three containers. Each needs its settings, and they all have to find each other.')} />
  </div>
)

/* ── ① 2 · three containers by hand ── */
const runs = [
  'docker run -d --name api -e DB_HOST=db -e DB_PASSWORD=geheim mensa-api:1.0',
  'docker run -d --name frontend mensa-frontend:1.0',
  'docker run -d --name db -e POSTGRES_PASSWORD=geheim -v dbdata:/var/lib/postgresql postgres:18',
]
const fails: [Svc, number, string, string, 'bad' | 'sand'][] = [
  ['api', 110, e('startet zuerst', 'starts first'), e('findet keine Datenbank', 'finds no database'), 'bad'],
  ['frontend', 420, e('-p vergessen', '-p forgotten'), e('von außen nicht erreichbar', 'unreachable from outside'), 'bad'],
  ['db', 730, e('startet zuletzt', 'starts last'), e('und kein gemeinsames Netz', 'and no shared network'), 'sand'],
]
export const ByHand = () => (
  <div className="dg-col">
    <Svg w={1000} h={372} label={e('Drei lange docker-run-Befehle von Hand. Die Container starten in falscher Reihenfolge, ohne Port und ohne gemeinsames Netz.', 'Three long docker run commands by hand. The containers start in the wrong order, without a port and without a shared network.')}>
      <In i={0}>
        <rect x={20} y={0} width={960} height={130} rx={14} fill="var(--ink)" />
        <Txt x={40} y={24} size={12.5} w={700} fill="#9fb0c8">Terminal</Txt>
      </In>
      {runs.map((r, k) => (
        <In key={k} i={1 + k}>
          <Num n={k + 1} x={52} y={48 + k * 30} />
          <text x={74} y={53 + k * 30} fontSize={13.5} fill="#fff" style={{ fontFamily: 'var(--mono)' }}>{r}</text>
        </In>
      ))}
      <Arrow d="M500 134 V168" i={1} />
      {host(172, 196, 1)}
      {fails.map(([s, x, l, sub, tone], k) => (
        <g key={s}>
          <Box x={x + 5} y={210} w={150} h={60} svc={s} i={1 + k} />
          <Num n={k + 1} x={x + 5} y={210} i={1 + k} />
          <Mark x={x + 155} y={210} bad={tone === 'bad'} i={1 + k} />
          <Tag x={x - 35} y={300} w={230} label={l} sub={sub} tone={tone} i={1 + k} />
        </g>
      ))}
    </Svg>
    <Take i={5} label={e('Ursache', 'Cause')} text={e('Jeder Container wird einzeln von Hand gestartet. Reihenfolge, Namen, Ports und Netz müssen bei jedem Start stimmen, bei jedem im Team.', 'Every container is started by hand, one by one. Order, names, ports and network have to be right at every start, for everyone in the team.')} />
  </div>
)

/* ── ① 3 · compose.yaml: one file for all three containers ── */
const planRows: [Svc, string][] = [
  ['frontend', e('Port 8080 nach außen', 'port 8080 to the outside')],
  ['api', e('DB_HOST = db · wartet auf db', 'DB_HOST = db · waits for db')],
  ['db', e('Volume für die Daten', 'a volume for the data')],
]
const File = ({ x, y, i = 0 }: { x: number; y: number; i?: number }) => (
  <g>
    <In i={i}>
      <rect x={x} y={y} width={340} height={250} rx={14} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} />
      <text x={x + 22} y={y + 42} fontSize={18} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>compose.yaml</text>
      <Txt x={x + 318} y={y + 42} size={13} fill="#8a6a20" anchor="end">{e('im Repo', 'in the repo')}</Txt>
    </In>
    {planRows.map(([s, note], k) => (
      <In key={s} i={i + 1 + k}>
        <rect x={x + 18} y={y + 62 + k * 60} width={304} height={50} rx={9} fill="#fff" stroke="var(--land-d)" strokeWidth={1.5} />
        <rect x={x + 28} y={y + 72 + k * 60} width={84} height={30} rx={6} fill={`var(--svc-${s})`} />
        <Txt x={x + 70} y={y + 92 + k * 60} size={13.5} w={700} fill="#fff" anchor="middle">{s}</Txt>
        <Txt x={x + 122} y={y + 92 + k * 60} size={12.5}>{note}</Txt>
      </In>
    ))}
  </g>
)
export const LoadingPlan = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Eine compose.yaml beschreibt alle drei Container. Ein Befehl, und alle laufen verbunden auf dem Rechner.', 'One compose.yaml describes all three containers. One command, and all of them run connected on the machine.')}>
      <File x={20} y={40} />
      <Arrow d="M366 165 H446" i={4} />
      <Label x={406} y={150} size={12.5} mono weight={700} i={4}>compose up</Label>
      <Zone x={450} y={110} w={530} h={200} label={e('Dein Rechner', 'Your machine')} sub="Docker" i={5} />
      {(['frontend', 'api', 'db'] as Svc[]).map((s, k) => (
        <g key={s}>
          <Box x={476 + k * 168} y={160} w={140} h={54} svc={s} size={14} i={5} />
          <Wire d={`M${546 + k * 168} 216 V254`} i={6} />
        </g>
      ))}
      <B x={476} y={254} w={476} h={40} t="libs" label={e('gemeinsames Netz', 'shared network')} size={14} i={6} />
      <Tag x={470} y={20} w={490} label={e('alle gestartet, richtig verbunden', 'all started, wired up right')} sub={e('in der richtigen Reihenfolge, mit Port und Volume', 'in the right order, with port and volume')} tone="ok" i={7} />
    </Svg>
    <Take i={8} label={e('Merke', 'Remember')} text={e('Was ihr sonst bei jedem Start von Hand eintippt, steht einmal in der compose.yaml. Compose liest sie und startet alles richtig.', 'What you would otherwise type by hand at every start is written once in compose.yaml. Compose reads it and starts everything right.')} />
  </div>
)

/* ── ① 4 · one compose.yaml for the whole team ── */
const machines: { x: number; y: number; name: string }[] = [
  { x: 10, y: 30, name: e('Lena · macOS', 'Lena · macOS') }, { x: 650, y: 30, name: e('Tim · Windows', 'Tim · Windows') },
  { x: 10, y: 240, name: e('Ali · Linux', 'Ali · Linux') }, { x: 650, y: 240, name: e('Server · Linux', 'Server · Linux') },
]
export const Team = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label={e('Eine compose.yaml im Repo, vier Rechner mit denselben drei Containern', 'One compose.yaml in the repo, four machines with the same three containers')}>
      {machines.map((m, k) => (
        <g key={m.name}>
          <Zone x={m.x} y={m.y} w={340} h={110} label={m.name} i={k + 1} />
          {(['frontend', 'api', 'db'] as Svc[]).map((v, j) => <Box key={v} x={m.x + 28 + j * 98} y={m.y + 46} w={88} h={44} svc={v} size={13} i={k + 1} />)}
          <Mark x={m.x + 316} y={m.y + 20} ok i={k + 1} r={12} />
        </g>
      ))}
      <In i={0}>
        <rect x={420} y={110} width={160} height={150} rx={12} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} />
        <text x={500} y={150} fontSize={15} fontWeight={700} fill="var(--ink)" textAnchor="middle" style={{ fontFamily: 'var(--mono)' }}>compose.yaml</text>
        <Txt x={500} y={172} size={12.5} fill="#8a6a20" anchor="middle">{e('im Git-Repo', 'in the Git repo')}</Txt>
        {[0, 1, 2].map(k => <rect key={k} x={442} y={188 + k * 20} width={116} height={12} rx={4} fill={`var(--svc-${(['frontend', 'api', 'db'] as const)[k]})`} />)}
      </In>
      <Go d="M418 150 L354 120" i={1} /><Go d="M582 150 L646 120" i={2} />
      <Go d="M418 230 L354 260" i={3} /><Go d="M582 230 L646 260" i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Die compose.yaml liegt mit dem Code im Repo. Wer sie hat, bekommt mit einem Befehl dieselben drei Container, auf dem Laptop wie auf dem Server.', 'compose.yaml lives in the repo with the code. Whoever has it gets the same three containers with one command, on a laptop as on the server.')} />
  </div>
)

/* ── ① 5 · what Compose is for: one machine yes, a cluster no ── */
const cluster: [number, number, Svc, Svc][] = [[530, 90, 'api', 'db'], [760, 90, 'frontend', 'api'], [530, 200, 'db', 'frontend'], [760, 200, 'api', 'db']]
export const OneShip = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label={e('Links ein Rechner mit compose.yaml und drei Containern, rechts ein Cluster aus vier Rechnern, für den Compose nicht gedacht ist', 'Left one machine with compose.yaml and three containers, right a cluster of four machines Compose is not meant for')}>
      <Tag x={20} y={0} w={460} label={e('Dafür ist Compose da', 'What Compose is for')} sub={e('ein Rechner: Laptop, Testserver, kleiner Server', 'one machine: laptop, test server, small server')} tone="ok" />
      <Tag x={520} y={0} w={460} label={e('Dafür nicht', 'What it is not for')} sub={e('viele Rechner gemeinsam steuern', 'steering many machines together')} tone="sand" i={3} />
      <Zone x={20} y={90} w={460} h={206} label={e('ein Rechner', 'one machine')} i={1} />
      <Sheet x={62} y={156} w={44} h={54} lines={4} tone="sand" i={2} />
      <Label x={84} y={236} size={12} mono weight={700} i={2}>compose.yaml</Label>
      {(['frontend', 'api', 'db'] as Svc[]).map((s, k) => <Box key={s} x={150 + k * 106} y={166} w={96} h={54} svc={s} size={14} i={2} />)}
      <Tick x={450} y={112} ok i={2} />
      {cluster.map(([x, y, a, b], k) => (
        <g key={k}>
          <Zone x={x} y={y} w={210} h={96} label={e(`Rechner ${k + 1}`, `Machine ${k + 1}`)} i={4} />
          <Box x={x + 16} y={y + 40} w={84} h={40} svc={a} size={13} i={4} />
          <Box x={x + 110} y={y + 40} w={84} h={40} svc={b} size={13} i={4} />
        </g>
      ))}
      <Tag x={530} y={312} w={440} label={e('dafür gibt es Kubernetes oder Docker Swarm', 'for that there is Kubernetes or Docker Swarm')} tone="sand" i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Compose startet alle Container einer App auf einem Rechner. Für eure Entwicklung und für Projekte ist das genau richtig.', 'Compose starts all containers of an app on one machine. For your development and for projects that is exactly right.')} />
  </div>
)

/* ── ② 1 · names instead of ports: every service is reachable under its name, db instead of localhost:5432 ── */
export const Phone = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} top={56} label={e('Drei Container im gemeinsamen Netz, jeder unter seinem Namen erreichbar. Die api erreicht die Datenbank über den Namen db statt über localhost:5432. localhost zeigt in der api auf die api selbst.', 'Three containers in the shared network, each reachable under its name. The api reaches the database by the name db instead of localhost:5432. Inside the api, localhost points at the api itself.')}>
      {host(150, 250)}
      {trio.map(([s, x], k) => (
        <g key={s}>
          <Box x={x + 5} y={206} w={150} h={60} svc={s} i={1 + k} />
          <Wire d={`M${x + 80} 268 V336`} i={1} />
          <In i={1}>
            <rect x={x + 20} y={286} width={120} height={30} rx={8} fill="#fff" stroke="var(--blue)" strokeWidth={2} />
            <text x={x + 80} y={306} fontSize={15} fontWeight={700} textAnchor="middle" fill="var(--blue-deep)" style={{ fontFamily: 'var(--mono)' }}>{s}</text>
          </In>
        </g>
      ))}
      <B x={60} y={336} w={880} h={46} t="libs" label={e('gemeinsames Netz: jeder Service ist unter seinem Namen erreichbar', 'shared network: every service is reachable under its name')} size={15} i={1} />
      <Arrow d="M579 236 H731" kind="ok" i={2} />
      <Label x={655} y={226} size={15} weight={700} mono tone="ok" i={2}>db</Label>
      <Arrow d="M470 204 C440 150 560 150 530 202" kind="bad" i={3} />
      <Tag x={20} y={56} w={300} label={e('Service-Name = Adresse', 'service name = address')} sub={e('Docker löst den Namen zum Container auf', 'Docker resolves the name to the container')} tone="sky" i={1} />
      <Lead d="M290 102 V301 H256" end={[252, 301]} i={1} />
      <Tag x={350} y={56} w={300} label={e('localhost = ich selbst', 'localhost = myself')} sub={e('in der api heißt das: die api', 'inside the api that means: the api')} tone="bad" i={3} />
      <Lead d="M500 102 V158" end={[500, 162]} i={3} />
      <Tag x={680} y={56} w={300} label="DB_HOST = db" sub={e('statt localhost:5432', 'instead of localhost:5432')} tone="ok" i={2} />
      <Lead d="M890 102 V202" end={[890, 204]} i={2} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Auf dem Laptop lief die Datenbank unter localhost:5432. Im Container zeigt localhost auf die api selbst. Stattdessen hat jeder Service einen Namen, und die api schreibt einfach db.', 'On the laptop the database ran at localhost:5432. In a container localhost points at the api itself. Instead every service has a name, and the api simply writes db.')} />
  </div>
)

/* ── ② 3 · started is not ready ── */
const lane = (y: number, label: string, i: number, bars: ReactNode) => (
  <g>
    <In i={i}><Txt x={20} y={y + 24} size={15} w={700} fill="var(--ink)">{label}</Txt></In>
    {bars}
  </g>
)
const bar = (x: number, y: number, w: number, svc: Svc, text: string, i: number, tone?: 'light') => (
  <In i={i}>
    <rect x={x} y={y} width={w} height={36} rx={8} fill={tone ? `color-mix(in srgb, var(--svc-${svc}) 25%, #fff)` : `var(--svc-${svc})`} stroke={`var(--svc-${svc})`} strokeWidth={1.5} />
    <Txt x={x + 12} y={y + 23} size={13} w={700} fill={tone ? `var(--svc-${svc}-d)` : '#fff'}>{text}</Txt>
  </In>
)
export const Order = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label={e('Zeitleisten: Ohne Warten stürzt die api ab, mit Healthcheck startet sie erst, wenn die Datenbank bereit ist', 'Timelines: without waiting the api crashes, with a healthcheck it starts only once the database is ready')}>
      <Tag x={20} y={0} w={960} label={e('ohne Warten: nur die Reihenfolge', 'without waiting: just the order')} tone="sand" />
      {lane(60, 'db', 1, <>{bar(160, 60, 260, 'db', e('fährt hoch …', 'starting up …'), 1, 'light')}{bar(424, 60, 520, 'db', e('bereit', 'ready'), 2)}</>)}
      {lane(106, 'api', 2, <>{bar(200, 106, 150, 'api', e('startet', 'starts'), 2)}</>)}
      <Mark x={366} y={124} bad i={2} r={13} />
      <In i={2}><Txt x={386} y={130} size={13.5} w={700} fill="var(--bad)">{e('Connection refused: db noch nicht bereit', 'Connection refused: db not ready yet')}</Txt></In>
      <Tag x={20} y={176} w={960} label={e('mit Healthcheck: Compose prüft db, bis sie „healthy“ meldet', 'with a healthcheck: Compose checks db until it reports “healthy”')} tone="ok" i={3} />
      {lane(236, 'db', 3, <>{bar(160, 236, 260, 'db', e('fährt hoch …', 'starting up …'), 3, 'light')}{bar(424, 236, 520, 'db', 'healthy', 4)}</>)}
      {lane(282, 'api', 4, <>{bar(440, 282, 504, 'api', e('startet erst jetzt', 'starts only now'), 5)}</>)}
      <Mark x={930} y={300} ok i={5} r={13} />
      {[0, 1, 2].map(k => <In key={k} i={3}><path d={`M${220 + k * 70} 230 v6`} stroke="var(--ink-3)" strokeWidth={2} /><Txt x={220 + k * 70} y={226} size={12} fill="var(--ink-3)" anchor="middle">{e('prüft', 'check')}</Txt></In>)}
      <In i={3}><path d="M140 350 H960" stroke="var(--ink-3)" strokeWidth={2} markerEnd="url(#ah-mute)" /><Txt x={960} y={378} size={13} fill="var(--ink-3)" anchor="end">{e('Zeit', 'time')}</Txt></In>
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Gestartet ist nicht bereit. Erst wenn der Healthcheck der Datenbank „healthy“ meldet, startet die api.', 'Started is not ready. Only when the database’s healthcheck reports “healthy” does the api start.')} />
  </div>
)

/* ── ② 5 · the one commands slide: what each command leaves behind ── */
const cleanup: [string, string, ('ok' | 'bad')[], 'ok' | 'bad' | undefined][] = [
  ['up -d', e('legt Netz, Volume und Container an und startet sie', 'creates network, volume and containers and starts them'), ['ok', 'ok', 'ok'], 'ok'],
  ['down', e('Container und Netz weg, Volume bleibt: nach up ist alles da', 'containers and network gone, volume stays: after up all is back'), ['bad', 'bad', 'ok'], undefined],
  ['down -v', e('löscht auch das Volume: alle gesammelten Daten sind weg', 'deletes the volume too: all collected data is gone'), ['bad', 'bad', 'bad'], 'bad'],
]
export const Commands = () => (
  <div className="dg-split">
    <Code title="compose.yaml" kind="file" lines={[
      'services:',
      '  frontend:',
      '    image: mensa-frontend:1.0',
      { t: '    ports: ["8080:80"]', chip: 'Port' },
      '  api:',
      '    image: mensa-api:1.0',
      { t: '    environment:', chip: e('Umgebungsvariablen', 'environment variables') },
      '      DB_HOST: db',
      { t: '    depends_on: [db]', chip: e('Reihenfolge', 'Order') },
      '  db:',
      '    image: postgres:18',
      '    environment:',
      '      POSTGRES_PASSWORD: geheim',
      { t: '    volumes: [dbdata:/var/lib/postgresql]', chip: 'Volume' },
      'volumes:',
      '  dbdata:',
    ]} />
    <div className="dg-col">
      <Code title="Terminal" i={1} lines={[
        { t: 'docker compose up -d', k: 'cmd' },
        { t: 'docker compose down', k: 'cmd' },
        { t: 'docker compose down -v', k: 'cmd' },
      ]} />
      <Svg w={500} h={306} label={e('Was nach jedem Befehl noch da ist: Container, Netz und Volume', 'What is still there after each command: containers, network and volume')}>
        {['Container', e('Netz', 'Network'), 'Volume'].map((h, j) => <Label key={h} x={300 + j * 74} y={18} size={12.5} weight={700}>{h}</Label>)}
        {cleanup.map(([c, l, marks, tone], k) => (
          <In key={c} i={2 + k}>
            <rect x={0} y={30 + k * 92} width={500} height={82} rx={14} fill={tone === 'ok' ? '#e2f5ec' : tone === 'bad' ? '#fdecea' : '#fff'} stroke={tone === 'ok' ? 'var(--ok)' : tone === 'bad' ? 'var(--bad)' : 'var(--line)'} strokeWidth={1.5} />
            <text x={20} y={30 + k * 92 + 34} fontSize={18} style={{ fontFamily: 'var(--mono)' }} fontWeight={700} fill="var(--ink)">{c}</text>
            {marks.map((m, j) => <Tick key={j} x={300 + j * 74} y={30 + k * 92 + 28} ok={m === 'ok'} bad={m === 'bad'} i={2 + k} />)}
            <Txt x={20} y={30 + k * 92 + 64} size={13}>{l}</Txt>
          </In>
        ))}
      </Svg>
    </div>
  </div>
)
