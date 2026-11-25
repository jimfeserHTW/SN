import { at, css } from '../../components/Stack.tsx'
import { Svg, Box, Arrow, Label, Wire, Ctr, Num, Tick, Zone, Take, type BoxTone } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'
import { Icon, IconSvg } from '../../components/Icons.tsx'
import { Code, type Line } from '../../components/Code.tsx'
import { Visuals } from '../../components/Visuals.tsx'
import { t } from '../../i18n.ts'
import './diagrams.css'

// Detailed diagrams for the deeper sub-chapters of this topic. The overview sub-chapter draws with views.tsx.

/* ── 4 · anatomy in one file: bright = nearly always needed, darker = only when needed ── */
const fileAll: Line[] = [
  { t: 'name: mensa', dim: true },
  'services:',
  '  api:',
  '    image: mensa-api:1.0',
  { t: '    build: ./api', dim: true },
  '    ports:',
  '      - "8080:8080"',
  '    environment:',
  '      DB_HOST: db',
  '      DB_USER: postgres',
  '      DB_PASSWORD: geheim',
  '    volumes:',
  '      - uploads:/app/uploads',
  '    depends_on: [db]',
  { t: '    restart: unless-stopped', dim: true },
  '  db:',
  '    image: postgres:18',
  '    environment:',
  '      POSTGRES_PASSWORD: geheim',
  '      POSTGRES_DB: mensa',
  '    volumes:',
  '      - dbdata:/var/lib/postgresql',
  { t: '    healthcheck:', dim: true },
  { t: '      test: pg_isready -U postgres', dim: true },
  { t: 'networks:', dim: true },
  { t: '  default: { driver: bridge }', dim: true },
  'volumes:',
  '  uploads: { driver: local }',
  '  dbdata: { driver: local }',
]

export const Anatomy = () => (
  <div className="c1-anat">
    <Code kind="file" title="compose.yaml" lines={fileAll} groups={[
      { from: 0, n: 1, label: 'Projektname' },
      { from: 2, n: 13, label: 'Service api' },
      { from: 15, n: 9, label: 'Service db' },
      { from: 24, n: 2, label: 'Netze' },
      { from: 26, n: 3, label: 'Volumes' },
    ]} />
    <div className="c1-legend" style={at(5)}>
      <span><b className="lg-on">{t('hell')}</b> {t('fast immer gebraucht')}</span>
      <span><b className="lg-off">{t('dunkel')}</b> {t('nur bei Bedarf')}</span>
    </div>
  </div>
)

/* ── 7 · variables: where they come from, where they end up, and who can read them ── */
const band = (y: number, t: string, title: string, sub: string, i: number) => (
  <g key={title}>
    <g className="sb" data-t={t} style={at(i)}><rect x={0} y={y} width={1000} height={96} rx={16} /></g>
    <Label i={i} x={18} y={y + 42} anchor="start" size={16} weight={700}>{title}</Label>
    <Label i={i} x={18} y={y + 62} anchor="start" size={13} tone="muted">{sub}</Label>
  </g>
)

const col = [200, 395, 590]

const W = 175

const mid = (k: number) => col[k] + W / 2

const Who = ({ y, a, b, tone, i }: { y: number; a: string; b: string; tone?: 'bad' | 'ok'; i: number }) => <>
  <Label i={i} x={800} y={y + 42} anchor="start" size={14} weight={700} tone={tone}>{a}</Label>
  <Label i={i} x={800} y={y + 62} anchor="start" size={13} tone={tone ?? 'muted'}>{b}</Label>
</>

export const Variables = () => (
  <div className="c1-vars">
    <Svg w={1000} h={494} top={-24} label="Variablen: vom Rechner über compose.yaml und Dockerfile in Image und Container, und wer sie lesen kann">
      <Label x={800} y={-8} anchor="start" size={13} weight={700} tone="blue">Wer kann den Wert lesen?</Label>
      {band(0, 'host', 'Dein Rechner', 'beim Start gelesen', 0)}
      {band(122, 'app', 'Konfiguration', 'Dateien im Projekt', 2)}
      {band(244, 'libs', 'Image', 'gebacken, reist mit', 4)}
      {band(366, 'container', 'Container', 'weg nach down', 6)}
      <g className="sa" data-k="mute" style={at(0)}><path d="M784 8 V 454" strokeDasharray="4 6" /></g>

      <Box i={1} x={col[0]} y={19} w={W} h={58} label=".env" sub="DB_PASSWORD=geheim" />
      <Box i={1} x={col[1]} y={19} w={W} h={58} label="Shell" sub="export DB_PASSWORD=…" />
      <Label i={1} x={col[2] + 4} y={44} anchor="start" size={13} tone="muted">Shell gewinnt gegen .env.</Label>
      <Label i={1} x={col[2] + 4} y={62} anchor="start" size={13} tone="muted">.env selbst bleibt hier.</Label>
      <Who i={1} y={0} a="nur du" b="auf deinem Rechner" />

      <Box i={3} x={col[0]} y={141} w={col[1] + W - col[0]} h={58} t="libs" label="environment:" sub="POSTGRES_PASSWORD: ${DB_PASSWORD}" />
      <Box i={3} x={col[2]} y={141} w={W} h={58} t="libs" label="Dockerfile" sub="zwei ENV-Zeilen" size={15} />
      <Arrow i={3} d={`M${mid(0)} 78 V 137`} />
      <Arrow i={3} d={`M${mid(1)} 78 V 137`} label="setzt den Wert ein" lx={mid(1) + 10} ly={112} anchor="start" />
      <Who i={3} y={122} a="im Git" b="nur ${…}, aber ENV offen" />

      <Box i={5} x={col[1]} y={263} w={W} h={58} label="ENV APP_ENV=prod" sub="harmlos" size={15} />
      <Box i={5} x={col[2]} y={263} w={W} h={58} t="bad" label="ENV DB_PASSWORD" sub="Geheimnis im Image ✗" size={15} />
      <Arrow i={5} d={`M${mid(2)} 200 V 231 H ${mid(1)} V 259`} />
      <Arrow i={5} d={`M${mid(2)} 200 V 259`} />
      <Label i={5} x={mid(0) + 10} y={288} anchor="start" size={13} weight={600}>am Image</Label>
      <Label i={5} x={mid(0) + 10} y={304} anchor="start" size={13} weight={600}>vorbei</Label>
      <Who i={5} y={244} tone="bad" a="jeder mit dem Image" b="Registry, image inspect" />

      <Box i={7} x={col[0]} y={385} w={W} h={58} t="ok" label="POSTGRES_PASSWORD" sub="aus environment" size={13} />
      <Box i={7} x={col[1]} y={385} w={W} h={58} t="libs" label="APP_ENV=prod" sub="vom Image geerbt" size={15} />
      <Box i={7} x={col[2]} y={385} w={W} h={58} t="bad" label="DB_PASSWORD" sub="vom Image geerbt" size={15} />
      <Arrow i={7} d={`M${mid(0)} 200 V 381`} />
      <Arrow i={7} d={`M${mid(1)} 322 V 381`} />
      <Arrow i={7} d={`M${mid(2)} 322 V 381`} />
      <Who i={7} y={366} tone="ok" a="nur dieser Host" b="solange er läuft" />
    </Svg>
    <p className="cause" style={at(8)}><b>{t('Warum sicherer?')}</b> {t('Ein Wert aus')} <code>environment</code> {t('lebt nur im laufenden Container auf diesem Rechner. Ein')} <code>ENV</code> {t('steckt im Image und reist mit jeder Kopie in die Registry.')}</p>
  </div>
)

/* ── 10 · start order: the same start, twice, on one time axis ── */
const T0 = 210, READY = 600, X1 = 980

const Bar = ({ x, w, y, t, label, i }: { x: number; w: number; y: number; t: 'host' | 'ok' | 'app'; label: string; i: number }) => (
  <Box i={i} x={x} y={y} w={w} h={34} t={t} label={label} size={14} />
)

const Lane = ({ y, name, i }: { y: number; name: string; i: number }) => <Label i={i} x={190} y={y + 22} anchor="end" size={15} weight={700}>{name}</Label>

const dbLane = (y: number, i: number) => <>
  <Lane y={y} name="db" i={i} />
  <Bar i={i} x={T0} w={READY - T0} y={y} t="host" label="gestartet, richtet die Datenbank ein …" />
  <Bar i={i} x={READY} w={X1 - READY} y={y} t="ok" label="bereit" />
</>

export const StartOrder = () => (
  <div className="c1-order">
    <Svg w={1000} h={364} label="Zeitstrahl: nur depends_on gegen depends_on mit healthcheck">
      <Label x={0} y={20} anchor="start" size={16} weight={700}>Nur depends_on</Label>
      <Label x={0} y={38} anchor="start" size={13} tone="muted">wartet auf „gestartet“</Label>
      {dbLane(50, 0)}
      <Lane y={92} name="api" i={1} />
      <Bar i={1} x={T0 + 30} w={150} y={92} t="app" label="startet, verbindet" />
      <Tick i={2} bad x={T0 + 196} y={109} />
      <Label i={2} x={T0 + 216} y={114} anchor="start" size={14} weight={700} tone="bad">Verbindung abgelehnt</Label>

      <Label i={3} x={0} y={178} anchor="start" size={16} weight={700}>Mit healthcheck</Label>
      <Label i={3} x={0} y={196} anchor="start" size={13} tone="muted">wartet auf „gesund“</Label>
      {dbLane(208, 3)}
      <Lane y={250} name="healthcheck" i={4} />
      {[0, 1, 2].map(k => <Tick key={k} i={4} x={300 + k * 120} y={267} />)}
      <Tick i={5} ok x={660} y={267} />
      <Label i={5} x={676} y={272} anchor="start" size={13} weight={700} tone="ok">healthy</Label>
      <Lane y={292} name="api" i={6} />
      <Wire i={6} k="back" d={`M${T0 + 30} 309 H654`} />
      <Label i={6} x={430} y={302} size={13} weight={600} tone="blue">wartet</Label>
      <Bar i={6} x={660} w={X1 - 660} y={292} t="ok" label="startet, verbindet ✓" />

      <g className="sa" data-k="mute" style={at(7)}><path d={`M${READY} 44 V 336`} strokeDasharray="5 5" /></g>
      <Label i={7} x={READY} y={30} size={13} weight={700}>db wirklich bereit</Label>
      <Arrow i={7} kind="mute" d={`M${T0} 352 H${X1}`} label="Zeit" lx={T0 - 12} ly={357} anchor="end" />
    </Svg>
    <Code kind="file" title="compose.yaml" d={9} lines={[
      '  db:',
      { t: '    healthcheck:', chip: 'Wann ist db „bereit“?' },
      { t: '      test: pg_isready -U postgres', chip: 'Befehl im Container: Erfolg = gesund' },
      { t: '      interval: 5s', chip: 'alle 5 Sekunden prüfen' },
      '  api:',
      '    depends_on:',
      { t: '      db: { condition: service_healthy }', chip: 'warten, bis „gesund“' },
    ]} />
  </div>
)

/* ── 11 · everyday commands, in the order of a working day ── */
type Cmd = { c: string; note: string; dim?: boolean; bad?: boolean }

const days: { title: string; cmds: Cmd[] }[] = [
  { title: 'Starten', cmds: [
    { c: 'up -d', note: 'alles im Hintergrund starten' },
    { c: 'up', note: 'im Vordergrund, Logs laufen mit' },
    { c: 'up -d --build', note: 'Images vorher neu bauen' },
    { c: 'up -d api', note: 'nur api (und was es braucht)' },
    { c: 'pull', note: 'neue Image-Versionen holen', dim: true },
  ] },
  { title: 'Ansehen', cmds: [
    { c: 'ps', note: 'laufende Services, Ports, Status' },
    { c: 'ps -a', note: 'auch beendete Container' },
    { c: 'config', note: 'fertige Datei, Variablen eingesetzt' },
    { c: 'ls', note: 'alle Compose-Projekte', dim: true },
    { c: 'top', note: 'Prozesse in den Containern', dim: true },
  ] },
  { title: 'Logs', cmds: [
    { c: 'logs', note: 'alle Services gemischt' },
    { c: 'logs api', note: 'nur ein Service' },
    { c: 'logs -f api', note: 'live verfolgen (Strg+C beendet)' },
    { c: 'logs --tail 50 api', note: 'nur die letzten 50 Zeilen' },
    { c: 'logs -t --since 10m db', note: 'mit Zeit, letzte 10 Minuten', dim: true },
  ] },
  { title: 'Hineinschauen', cmds: [
    { c: 'exec db sh', note: 'Shell im laufenden Container' },
    { c: 'exec db pg_isready', note: 'Befehl direkt im Container' },
    { c: 'run --rm api sh', note: 'neuer Wegwerf-Container', dim: true },
    { c: 'port api 8080', note: 'welcher Host-Port gehört dazu?', dim: true },
  ] },
  { title: 'Stoppen', cmds: [
    { c: 'stop', note: 'stoppen, Container bleiben' },
    { c: 'start', note: 'gestoppte wieder starten' },
    { c: 'restart api', note: 'einen Service neu starten' },
  ] },
  { title: 'Aufräumen', cmds: [
    { c: 'down', note: 'Container und Netz löschen' },
    { c: 'down -v', note: 'auch Volumes: Daten weg!', bad: true },
    { c: 'down --rmi local', note: 'auch selbst gebaute Images', dim: true },
  ] },
]

export const Everyday = () => (
  <div className="c1-days">
    <div className="days">
      {days.map((g, k) => (
        <section className="day" key={g.title} style={at(k)}>
          <h3><span>{k + 1}</span>{t(g.title)}</h3>
          <ul>{g.cmds.map(c => (
            <li key={c.c} data-dim={c.dim || undefined} data-bad={c.bad || undefined}><code><i>docker compose</i> {c.c}</code><small>{t(c.note)}</small></li>
          ))}</ul>
        </section>
      ))}
    </div>
    <p className="cause" style={at(6)}><b>{t('Alt')}</b><code>docker-compose</code> {t('mit Bindestrich ist Version 1 und seit 2023 eingestellt. Heute heißt es')} <code>docker compose</code>.</p>
  </div>
)

/* ── 12 · several files: how Compose merges them, then which files make which environment ── */
const base: Line[] = ['services:', '  api:', '    image: mensa-api:1.0', '    ports: ["8080:8080"]', '    environment:', '      DEBUG: "0"']

const over: Line[] = ['services:', '  api:', '    build: .', '    volumes: ["./src:/app"]', '    environment:', '      DEBUG: "1"']

const merged: Line[] = [
  'services:', '  api:',
  { t: '    image: mensa-api:1.0', mark: 'a', chip: '1' },
  { t: '    build: .', mark: 'b', chip: '2' },
  { t: '    ports: ["8080:8080"]', mark: 'a', chip: '1' },
  { t: '    volumes: ["./src:/app"]', mark: 'b', chip: '2' },
  '    environment:',
  { t: '      DEBUG: "0"', mark: 'x', chip: '1' },
  { t: '      DEBUG: "1"', mark: 'b', chip: '2 gewinnt' },
]

const files: [string, string, boolean][] = [
  ['compose.yaml', '1 · immer', true], ['compose.override.yaml', '2 · automatisch', true], ['compose.prod.yaml', 'nur mit -f', false], ['.env', 'Werte für ${…}', false],
]

export const Merge = () => (
  <div className="c1-merge">
    <div className="mrg">
      <div className="tree" style={at(0)}>
        <div className="tree-root"><IconSvg name="folder" size={30} /><b>mensa/</b></div>
        <ul>{files.map(([f, s, on]) => <li key={f} data-on={on || undefined}><code>{f}</code><small>{t(s)}</small></li>)}</ul>
        <small className="tree-cmd"><code>docker compose up</code> {t('liest 1 und 2 von selbst')}</small>
      </div>
      <Code kind="file" title="compose.yaml" lines={base} i={1} />
      <span className="op" style={at(2)}>+</span>
      <Code kind="file" title="compose.override.yaml" lines={over} i={2} />
      <span className="op" style={at(3)}>=</span>
      <Code kind="file" title="Ergebnis: compose config" lines={merged} i={3} />
    </div>
    <div className="rules" style={at(5)}>
      <span><b>{t('Gleicher Name')}</b> {t('wird zusammengeführt: beide Dateien meinen denselben Service api.')}</span>
      <span><b>{t('Einzelwert')}</b> {t('wie DEBUG: Die spätere Datei gewinnt.')}</span>
      <span><b>{t('Neue Schlüssel')}</b> {t('wie build und volumes kommen dazu.')}</span>
    </div>
    <Visuals d={7} v={{ kind: 'stack', columns: [
      { title: 'Entwicklung · docker compose up', layers: [
        { label: 'compose.yaml', tone: 'navy', note: 'Basis' }, { label: 'compose.override.yaml', tone: 'blue', note: 'wird automatisch gelesen' },
        { label: '.env', tone: 'sky', note: 'Dev-Werte' }, { label: 'Ergebnis: Dev-Umgebung' },
      ] },
      { title: e('Produktion · compose -f compose.yaml -f compose.prod.yaml up', 'Production · compose -f compose.yaml -f compose.prod.yaml up'), layers: [
        { label: 'compose.yaml', tone: 'navy', note: 'Basis' }, { label: 'compose.prod.yaml', tone: 'blue', note: 'mit -f angegeben' },
        { label: '.env', tone: 'sky', note: 'Prod-Werte, nicht im Git' }, { label: 'Ergebnis: Prod-Umgebung' },
      ] },
    ] }} />
  </div>
)

/* ── 13 · pitfalls ── */
export const Pitfalls = () => (
  <div className="c1-trap">
    <Visuals v={{ kind: 'table', head: ['Fehlerbild', 'Ursache', 'Lösung'], rows: [
      ['„port is already allocated“', 'Der Host-Port ist schon belegt', 'Linken Port ändern: `"8081:8080"`'],
      ['Datenbank nach Neustart leer', '`down -v` löscht Volumes, oder es gab gar keins', 'Benanntes Volume, ohne `-v` aufräumen'],
      ['api: „Connection refused“', '„gestartet“ ist nicht „bereit“', '`healthcheck` und `service_healthy`'],
      ['DB unter `localhost` nicht erreichbar', '`localhost` ist der Container selbst', 'Service-Namen nutzen: `db:5432`'],
      ['Variable aus `.env` fehlt im Container', '`.env` füllt nur `${…}` in der Datei', 'Unter `environment:` oder `env_file:` eintragen'],
      ['Änderung wirkt nicht', 'Container laufen mit alter Konfiguration oder altem Image', '`up -d` erneut, bei Code-Änderung `up -d --build`'],
      ['Ordner im Container plötzlich leer', 'Ein Bind-Mount überdeckt die Dateien aus dem Image', 'Anderen Zielordner wählen oder nur einen Unterordner mounten'],
      ['„yaml: … cannot start any token“', 'Tabulator oder falsche Einrückung', 'Nur Leerzeichen, `docker compose config` prüft die Datei'],
      ['„docker-compose: command not found“', 'Alte Version 1 mit Bindestrich', '`docker compose` mit Leerzeichen'],
    ] }} />
  </div>
)

/* ═══ Projekt ═══ */
/* What `up` does, and where each step runs. */
export const UpFlow = () => (
  <div className="dg-col">
    <Svg w={1000} h={430} label="docker compose up: Compose liest den Projektordner und beauftragt den Docker Daemon">
      <Zone x={0} y={0} w={240} h={230} t="reg" label="Projektordner mensa/" />
      {([['compose.yaml', 'die Beschreibung'], ['compose.override.yaml', 'Ergänzung'], ['.env', 'Werte für ${…}']] as const).map(([f, s], k) => <Box key={f} i={0} x={14} y={38 + k * 62} w={212} h={54} label={f} sub={s} size={13} mono />)}
      <Box i={1} x={0} y={320} w={240} h={56} t="hw" label="docker compose up -d" size={13} mono />
      <Zone i={1} x={300} y={60} w={210} h={230} t="app" label="Compose" sub="dein Rechner" />
      {['Dateien mischen', '${…} einsetzen', 'Plan berechnen'].map((l, k) => <g key={l}><Box i={2 + k} x={330} y={100 + k * 58} w={166} h={46} t="libs" label={l} size={14} /><Num i={2 + k} n={k + 1} x={330} y={100 + k * 58} /></g>)}
      <Arrow i={2} d="M242 130 H296" label="liest" lx={268} ly={118} />
      <Arrow i={1} d="M242 348 H405 V294" />
      <Zone i={5} x={570} y={0} w={430} h={430} label="Docker Host" />
      <Box i={5} x={590} y={40} w={390} h={56} t="engine" label="dockerd" sub="legt alles der Reihe nach an" size={17} />
      <Arrow i={5} d="M512 76 H586" label="API" lx={540} ly={64} />
      <Wire i={6} d="M612 98 V342" />
      {([['Netz mensa_default', 'kchip'], ['Volume mensa_dbdata', 'reg'], ['Container mensa-db-1', 'container'], ['Container mensa-api-1', 'container']] as const).map(([l, t], k) => (
        <g key={l}><Box i={6 + k} x={640} y={116 + k * 62} w={340} h={52} t={t} label={l} size={15} /><Num i={6 + k} n={k + 1} x={612} y={142 + k * 62} /></g>
      ))}
      <Label i={10} x={785} y={400} size={13} tone="muted">laufen weiter, wenn Compose längst beendet ist</Label>
    </Svg>
    <Take i={11} label="Merke" text="Compose ist kein Dienst, sondern ein Client: Es rechnet kurz, gibt Aufträge an dockerd und beendet sich." />
  </div>
)

/* ═══ Service ═══ */
/* Every key of a service changes one concrete part of the container. */
const svcLines: Line[] = [
  'services:', '  api:',
  { t: '    image: mensa-api:1.0', n: 1 },
  { t: '    command: ["java", "-jar", "app.jar"]', n: 2 },
  { t: '    user: "10001:10001"', n: 3 },
  { t: '    working_dir: /app', n: 3 },
  '    environment:',
  { t: '      DB_HOST: db', n: 4 },
  '    volumes:',
  { t: '      - uploads:/app/uploads', n: 5 },
  '    ports:',
  { t: '      - "8080:8080"', n: 6 },
  { t: '    networks: [web]', n: 7 },
]

export const ServiceMap = () => (
  <div className="dg-split">
    <Code kind="file" title="compose.yaml" lines={svcLines} />
    <Svg w={620} h={470} label="Jeder Schlüssel eines Service und der Teil des Containers, den er bestimmt">
      <Zone x={0} y={0} w={620} h={470} label="Host-Rechner" />
      <Box i={1} x={12} y={130} w={76} h={56} t="engine" label="8080" size={16} />
      <Num i={1} n={6} x={12} y={130} />
      <Ctr i={2} x={120} y={40} w={350} h={320} name="Container api" />
      <Box i={3} x={136} y={74} w={318} h={56} t="app" label={e('Prozess: java -jar app.jar', 'Process: java -jar app.jar')} sub="PID 1" size={15} /><Num i={3} n={2} x={454} y={74} />
      <Box i={4} x={136} y={140} w={318} h={50} t="app" label={e('Benutzer 10001 · Ordner /app', 'User 10001 · folder /app')} size={14} /><Num i={4} n={3} x={454} y={140} />
      <Box i={5} x={136} y={200} w={318} h={44} t="host" label="DB_HOST=db" size={14} mono /><Num i={5} n={4} x={454} y={200} />
      <Box i={6} x={136} y={254} w={200} h={90} t="libs" label="Image-Layer" sub="mensa-api:1.0" size={15} /><Num i={6} n={1} x={136} y={254} />
      <Box i={7} x={346} y={254} w={108} h={90} t="reg" label="/app/uploads" sub="Mount" size={12} />
      <Box i={7} x={500} y={254} w={106} h={90} t="reg" label="uploads" sub="Volume" size={14} /><Num i={7} n={5} x={606} y={254} />
      <Arrow i={7} both d="M456 299 H496" />
      <Arrow i={1} d="M90 158 H132" />
      <Box i={8} x={120} y={398} w={350} h={44} t="kchip" label="Netz web" size={15} /><Num i={8} n={7} x={470} y={398} />
      <Wire i={8} d="M295 362 V396" />
    </Svg>
  </div>
)

/* How the start command is assembled from two slots. */
const cmdRows: { title: string; sub: string; e: [string, BoxTone]; c: [string, BoxTone]; r: string; y: number }[] = [
  { title: 'Nur das Image', sub: 'Compose ändert nichts', e: ['/entry.sh', 'libs'], c: ['nginx -g "daemon off;"', 'libs'], r: '/entry.sh nginx -g …', y: 44 },
  { title: 'command:', sub: 'ersetzt nur CMD', e: ['/entry.sh', 'libs'], c: ['nginx -t', 'engine'], r: '/entry.sh nginx -t', y: 144 },
  { title: 'entrypoint:', sub: 'ersetzt ihn, leert CMD', e: ['/init.sh', 'engine'], c: ['geleert', 'gone'], r: '/init.sh', y: 244 },
]

export const StartCommand = () => (
  <div className="dg-col">
    <Svg w={1000} h={320} label="Der Startbefehl entsteht aus ENTRYPOINT und CMD, Compose kann beide Teile ersetzen">
      <Label x={315} y={22} weight={700} size={15} mono>ENTRYPOINT</Label><Label x={560} y={22} weight={700} size={15} mono>CMD</Label><Label x={845} y={22} weight={700} size={15}>PID 1 im Container</Label>
      {cmdRows.map((r, k) => (
        <g key={r.title}>
          <Label i={k * 3} x={0} y={r.y + 28} anchor="start" size={15} weight={700} mono={k > 0}>{r.title}</Label>
          <Label i={k * 3} x={0} y={r.y + 48} anchor="start" size={13} tone="muted">{r.sub}</Label>
          <Box i={k * 3} x={200} y={r.y} w={230} h={66} t={r.e[1]} label={r.e[0]} size={15} mono />
          <Label i={k * 3} x={442} y={r.y + 39} size={20} weight={700}>+</Label>
          <Box i={k * 3 + 1} x={455} y={r.y} w={210} h={66} t={r.c[1]} label={r.c[0]} size={14} mono />
          <Arrow i={k * 3 + 2} d={`M667 ${r.y + 33} H696`} />
          <Box i={k * 3 + 2} x={700} y={r.y} w={300} h={66} t="container" label={r.r} size={15} mono />
        </g>
      ))}
    </Svg>
    <Take i={9} label="Falle" text="Wer `entrypoint` setzt, verliert auch das `CMD` aus dem Image. Es muss dann in `command` neu angegeben werden." />
  </div>
)

/* Restart policies: one small timeline per policy and event. */
const events = ['Absturz', 'Ende mit Code 0', 'stop von Hand', 'Daemon startet neu', 'stop, dann Daemon neu']

const marks = ['⚡', '0', '■', '↺', '■↺']

const policies: [string, number[]][] = [['no', [0, 0, 0, 0, 0]], ['on-failure', [1, 0, 0, 0, 0]], ['always', [1, 1, 0, 1, 1]], ['unless-stopped', [1, 1, 0, 1, 0]]]

const evX = (k: number) => 170 + k * 167

const Seg = ({ x, y, w, t, i }: { x: number; y: number; w: number; t: BoxTone; i: number }) => <g className="sb" data-t={t} style={at(i)}><rect x={x} y={y} width={w} height={22} rx={6} /></g>

export const RestartGrid = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label="Vier Neustart-Regeln und ihr Verhalten bei fünf Ereignissen">
      {events.map((e, k) => <Label key={e} x={evX(k) + 75} y={k > 2 ? 18 : 28} size={13} weight={700}>{k > 2 ? t(e).split(' ').slice(0, Math.ceil(t(e).split(' ').length / 2)).join(' ') : e}</Label>)}
      {events.map((e, k) => k > 2 && <Label key={e} x={evX(k) + 75} y={36} size={13} weight={700}>{t(e).split(' ').slice(Math.ceil(t(e).split(' ').length / 2)).join(' ')}</Label>)}
      {policies.map(([p, v], r) => {
        const y = 62 + r * 78
        return (
          <g key={p}>
            <Zone i={r} x={160} y={y - 6} w={840} h={66} t="app" />
            <Label i={r} x={150} y={y + 30} anchor="end" size={13} weight={700} mono>{p}</Label>
            {v.map((on, k) => (
              <g key={k}>
                <Seg i={r} x={evX(k)} y={y + 16} w={46} t="engine" />
                <Label i={r} x={evX(k) + 66} y={y + 33} size={15} weight={700}>{marks[k]}</Label>
                <Seg i={r + 1} x={evX(k) + 88} y={y + 16} w={58} t={on ? 'ok' : 'gone'} />
                {on ? <Label i={r + 1} x={evX(k) + 117} y={y + 10} size={12} weight={700} tone="ok">↻ läuft</Label> : <Label i={r + 1} x={evX(k) + 117} y={y + 10} size={12} tone="muted">aus</Label>}
              </g>
            ))}
          </g>
        )
      })}
    </Svg>
    <Take i={5} label="Wahl" text="Für Dienste passt meist `unless-stopped`: Sie kommen nach Absturz und Neustart wieder, aber nicht, wenn du sie bewusst gestoppt hast." />
  </div>
)

/* ═══ Start ═══ */
/* A healthcheck over time, and who actually runs it. */
export const Health = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label="Healthcheck im Zeitverlauf: Anlaufzeit, Prüfungen, Zustände und wer die Prüfung ausführt">
      <g className="sb" data-t="reg" style={at(0)}><rect x={130} y={36} width={250} height={116} rx={10} /></g>
      <Label x={255} y={56} size={13} weight={700}>start_period: Fehler zählen nicht</Label>
      <Label i={1} x={120} y={106} anchor="end" size={14} weight={700}>Prüfung</Label>
      {[170, 250, 330].map(x => <Tick key={x} i={1} x={x} y={100} />)}
      {[430, 510].map(x => <Tick key={x} i={2} ok x={x} y={100} />)}
      <Label i={3} x={600} y={106} size={18} weight={700} tone="muted">…</Label>
      {[690, 770, 850].map(x => <Tick key={x} i={3} bad x={x} y={100} />)}
      <Arrow i={2} both d="M434 76 H506" /><Label i={2} x={470} y={64} size={13} weight={700}>interval</Label>
      <Arrow i={3} both kind="bad" d="M690 128 H850" /><Label i={3} x={770} y={146} size={13} weight={700} tone="bad">retries: 3 Fehler in Folge</Label>
      <Label i={4} x={120} y={186} anchor="end" size={14} weight={700}>Zustand</Label>
      <Box i={1} x={130} y={160} w={296} h={40} t="host" label="starting" size={14} mono />
      <Box i={2} x={430} y={160} w={420} h={40} t="ok" label="healthy" size={14} mono />
      <Box i={3} x={854} y={160} w={146} h={40} t="bad" label="unhealthy" size={14} mono />
      <Box i={5} x={130} y={262} w={210} h={80} t="engine" label="dockerd" sub="startet jede Prüfung" size={17} />
      <Arrow i={5} d="M342 288 H496" label="führt im Container aus" lx={420} ly={276} />
      <Arrow i={6} kind="back" d="M496 320 H344" label="Exit-Code 0 oder 1" lx={420} ly={340} />
      <Ctr i={5} x={500} y={230} w={340} h={130} name="Container db" />
      <Box i={5} x={516} y={264} w={308} h={80} t="app" label="pg_isready" sub="der Befehl aus test:" size={15} mono />
    </Svg>
  </div>
)

/* The whole start order of the project on one time axis. */
const lanesY: Record<string, number> = { db: 44, migrate: 114, api: 184, frontend: 254 }

export const DependsGantt = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label="Startreihenfolge mit drei Bedingungen und umgekehrte Reihenfolge beim Stoppen">
      {Object.entries(lanesY).map(([n, y], k) => <Label key={n} i={k * 2} x={100} y={y + 25} anchor="end" size={15} weight={700}>{n}</Label>)}
      <Box i={0} x={120} y={44} w={220} h={38} t="host" label="startet" size={14} />
      <Box i={1} x={340} y={44} w={560} h={38} t="ok" label="healthy" size={14} />
      <Box i={2} x={370} y={114} w={130} h={38} t="reg" label="Migration" size={14} />
      <Tick i={3} ok x={516} y={133} /><Label i={3} x={534} y={138} anchor="start" size={13} weight={700} tone="ok">Exit 0</Label>
      <Box i={4} x={540} y={184} w={320} h={38} t="engine" label="läuft" size={14} />
      <Box i={6} x={590} y={254} w={230} h={38} t="engine" label="läuft" size={14} />
      <Arrow i={2} d="M345 84 V133 H366" /><Label i={2} x={336} y={118} anchor="end" size={13} weight={600} mono>service_healthy</Label>
      <Arrow i={4} d="M516 146 V203 H536" /><Label i={4} x={506} y={190} anchor="end" size={13} weight={600} mono>service_completed_successfully</Label>
      <Arrow i={6} d="M560 224 V273 H586" /><Label i={6} x={550} y={258} anchor="end" size={13} weight={600} mono>service_started</Label>
      <Num i={7} n={1} x={820} y={273} /><Num i={7} n={2} x={860} y={203} /><Num i={7} n={3} x={900} y={63} />
      <Label i={7} x={1000} y={24} anchor="end" size={13} weight={700} tone="blue">down: umgekehrte Reihenfolge</Label>
      <Arrow i={0} kind="mute" d="M120 322 H990" /><Label x={100} y={327} anchor="end" size={13} tone="muted">Zeit</Label>
    </Svg>
    <Take i={8} label="Muster" text="Einmal-Aufgaben wie Migrationen laufen als eigener Service. `api` startet erst, wenn sie erfolgreich beendet sind." />
  </div>
)

/* ═══ Konfiguration ═══ */
/* Two different ladders feed two different targets. */
const Ladder = ({ x, cards, i }: { x: number; cards: [string, BoxTone][]; i: number }) => <>
  {cards.map(([l, t], k) => <Box key={l} i={i + k} x={x + k * 16} y={46 + k * 58} w={300} h={50} t={t} label={l} size={13} mono />)}
</>

export const VarWinner = () => (
  <div className="dg-col">
    <Svg w={1000} h={320} label="Zwei Rangfolgen: Variablen im Container und Platzhalter in der Compose-Datei">
      <Label x={0} y={22} anchor="start" size={16} weight={700}>Variable im Container</Label>
      <Label x={0} y={300} anchor="start" size={13} tone="muted">oben gewinnt, gilt zur Laufzeit</Label>
      <Ladder x={0} i={0} cards={[['run -e MODE=test', 'engine'], ['environment: prod', 'gone'], ['env_file: stage', 'gone'], ['ENV im Image: dev', 'gone']]} />
      <Arrow i={4} kind="ok" d="M302 71 H346" />
      <Ctr i={4} x={350} y={36} w={130} h={72} name="Container" /><Label i={4} x={415} y={92} size={13} weight={700} mono>MODE=test</Label>
      <Label i={5} x={530} y={22} anchor="start" size={16} weight={700}>Platzhalter in compose.yaml</Label>
      <Label i={5} x={530} y={300} anchor="start" size={13} tone="muted">oben gewinnt, gilt beim Einlesen</Label>
      <Ladder x={530} i={5} cards={[['Shell: TAG=1.5', 'engine'], ['.env: TAG=1.4', 'gone'], ['${TAG:-latest}', 'gone']]} />
      <Arrow i={8} kind="ok" d="M832 71 H866" />
      <Box i={8} x={870} y={36} w={130} h={72} t="libs" label="mensa-api:1.5" sub="image:" size={14} mono />
    </Svg>
    <Take i={9} label="Falle" text="`.env` wirkt nur rechts: Es füllt `${…}` in der Datei. In den Container kommt ein Wert erst über `environment` oder `env_file`." />
  </div>
)

/* Where a password can be read from: variable versus secret file. */
export const Secrets = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label="Passwort als Variable ist an vielen Stellen lesbar, als Secret liegt es nur als Datei im Container">
      <Zone x={0} y={0} w={480} h={400} t="bad" label="Als Variable" />
      <Ctr i={1} x={20} y={40} w={440} h={100} name="Container db" />
      <Box i={1} x={36} y={72} w={408} h={54} t="bad" label="POSTGRES_PASSWORD=geheim" size={14} mono />
      {([['docker inspect', 'jeder mit Docker-Zugriff', 20], ['/proc/1/environ', 'im Container', 170], ['Kindprozesse', 'erben alles, auch Logs', 320]] as const).map(([l, s, x], k) => (
        <g key={l}><Arrow i={2 + k} kind="bad" d={`M${x + 70} 142 V246`} /><Box i={2 + k} x={x} y={250} w={140} h={84} label={l} sub={k === 2 ? 'erben alles' : k ? 'im Container' : 'mit Docker-Zugriff'} size={13} mono={k < 2} /></g>
      ))}
      <Label i={5} x={240} y={370} size={14} weight={700} tone="bad">Der Wert liegt an vielen Stellen offen</Label>

      <Zone i={6} x={520} y={0} w={480} h={400} t="ok" label="Als Secret" />
      <Box i={6} x={540} y={40} w={440} h={60} label="./secrets/db_pw.txt" sub="auf dem Host, nicht im Git" size={14} mono />
      <Arrow i={7} kind="ok" d="M760 102 V166" label="als Datei eingehängt" lx={772} ly={140} anchor="start" />
      <Ctr i={7} x={540} y={170} w={440} h={150} name="Container db" />
      <Box i={7} x={556} y={202} w={408} h={46} t="ok" label="/run/secrets/db_pw" size={14} mono />
      <Box i={8} x={556} y={258} w={408} h={46} t="host" label="POSTGRES_PASSWORD_FILE=/run/secrets/db_pw" size={12} mono />
      <Label i={9} x={760} y={350} size={14} weight={700} tone="ok">docker inspect zeigt nur den Pfad</Label>
      <Label i={9} x={760} y={372} size={13} tone="muted">Das Image muss _FILE-Variablen unterstützen</Label>
    </Svg>
  </div>
)

/* Profiles switch services on and off. */
const svcP: [string, string | null, boolean, boolean][] = [['frontend', null, true, true], ['api', null, true, true], ['db', null, true, true], ['adminer', 'debug', false, true], ['backup', 'ops', false, false]]

export const Profiles = () => (
  <Svg w={1000} h={350} label="Profile: Ohne Angabe laufen nur die normalen Services, mit --profile kommen weitere dazu">
    {(['docker compose up', 'docker compose --profile debug up'] as const).map((c, p) => {
      const x = p * 515
      return (
        <g key={c}>
          <Zone i={p * 3} x={x} y={0} w={485} h={350} t="app" />
          <Label i={p * 3} x={x + 18} y={30} anchor="start" size={14} weight={700} mono>{c}</Label>
          {svcP.map(([n, prof, a, b], k) => {
            const on = p ? b : a
            return <Box key={n} i={p * 3 + 1} x={x + 18 + (k % 3) * 152} y={56 + Math.floor(k / 3) * 140} w={144} h={120} t={on ? 'container' : 'gone'} label={n} sub={prof ? `Profil ${prof}` : 'immer dabei'} size={15} />
          })}
        </g>
      )
    })}
  </Svg>
)

/* ═══ Betrieb ═══ */
/* Compose Watch: a saved file takes one of three ways into the running service. */
const watch: { f: string; a: string; y: number }[] = [{ f: 'src/app.js', a: 'sync', y: 50 }, { f: 'nginx.conf', a: 'sync+restart', y: 160 }, { f: 'package.json', a: 'rebuild', y: 270 }]

export const Watch = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label="Compose Watch: Je nach Datei wird synchronisiert, neu gestartet oder neu gebaut">
      <Zone x={0} y={0} w={220} h={350} t="reg" label="Projektordner" />
      {watch.map((w, k) => (
        <g key={w.f}>
          <Box i={k * 2} x={14} y={w.y} w={192} h={60} label={w.f} sub="gespeichert" size={14} mono />
          <Arrow i={k * 2} d={`M208 ${w.y + 30} H266`} />
          <Box i={k * 2} x={270} y={w.y + 6} w={160} h={48} t="kchip" label={w.a} size={14} mono />
        </g>
      ))}
      <Zone i={1} x={640} y={0} w={360} h={240} label="Container api läuft" />
      <Arrow i={1} kind="ok" d="M432 80 H656" />
      <Box i={1} x={660} y={48} w={320} h={64} t="ok" label="Datei ausgetauscht" sub="Prozess läuft einfach weiter" size={15} />
      <Arrow i={3} d="M432 190 H656" />
      <Box i={3} x={660} y={158} w={320} h={64} t="reg" label="Datei neu, Prozess ↻" sub="derselbe Container startet neu" size={15} />
      <Arrow i={5} d="M432 300 H486" />
      <g className="sl" style={at(5)}><Icon name="blueprint" x={490} y={274} s={52} /></g>
      <Label i={5} x={516} y={342} size={13} weight={600}>neues Image</Label>
      <Arrow i={5} d="M546 300 H636" />
      <Box i={5} x={640} y={268} w={360} h={64} t="container" label="neuer Container" sub="ersetzt den alten" size={15} />
    </Svg>
    <Take i={7} label="Kosten" text="Von oben nach unten wird es langsamer: Wähle für jeden Pfad die kleinste Aktion, die noch reicht." />
  </div>
)

/* Troubleshooting: walk the way of the service, each stop has its symptom and its command. */
const dbg: [string, string, string, string][] = [
  ['Datei', 'Stimmt die fertige Datei?', 'Variable fehlt, YAML-Fehler', 'compose config'],
  ['Start', 'Warum endet der Prozess?', 'Exited, Restarting', 'compose logs api'],
  ['Netz', 'Wird der Name gefunden?', 'Connection refused', 'exec api getent hosts db'],
  ['Ressourcen', 'Ist die Grenze erreicht?', 'Exit 137, sehr langsam', 'docker stats'],
  ['Daten', 'Ist es das richtige Volume?', 'Tabellen sind leer', 'volume ls, inspect'],
]

export const DebugPath = () => (
  <Svg w={1000} h={410} label="Fehlersuche entlang des Wegs von der Datei über Container und Netz bis zu den Daten">
    <Zone x={0} y={0} w={1000} h={178} label="Der Weg deines Service" />
    {([['file', 'compose.yaml', 70], ['crate', 'api', 300], ['crate', 'db', 610], ['folder', 'Volume', 860]] as const).map(([ic, l, x], k) => (
      <g key={l}><g className="sl" style={at(k)}><Icon name={ic} x={x} y={40} s={76} /></g><Label i={k} x={x + 38} y={146} size={14} weight={700}>{l}</Label></g>
    ))}
    <Arrow i={1} d="M152 78 H292" /><Num i={1} n={1} x={146} y={48} /><Num i={1} n={2} x={376} y={46} />
    <Arrow i={2} d="M382 78 H602" label="über das Netz" lx={492} ly={56} /><Num i={2} n={3} x={492} y={78} />
    <Arrow i={3} both d="M692 78 H852" /><Num i={2} n={4} x={686} y={46} /><Num i={3} n={5} x={936} y={46} />
    {dbg.map(([s, q, sym, cmd], k) => {
      const x = k * 202 + 2
      return (
        <g key={s}>
          <Zone i={4 + k} x={x} y={192} w={190} h={216} t="app" />
          <Num i={4 + k} n={k + 1} x={x + 22} y={216} />
          <Label i={4 + k} x={x + 42} y={221} anchor="start" size={15} weight={700}>{s}</Label>
          <Label i={4 + k} x={x + 95} y={262} size={12} weight={600}>{q}</Label>
          <Label i={4 + k} x={x + 95} y={304} size={12} weight={700} tone="bad">{sym}</Label>
          <Box i={4 + k} x={x + 10} y={336} w={170} h={56} t="hw" label={cmd} size={k === 2 ? 11 : 12} mono />
        </g>
      )
    })}
  </Svg>
)

/* Closing picture: the whole project, each number one topic of this sub-chapter. */
const allLines: Line[] = [
  { t: 'name: mensa', n: 1 }, 'services:',
  '  frontend:',
  { t: '    ports: ["8080:80"]', n: 2 }, { t: '    networks: [web]', n: 3 },
  '  api:',
  { t: '    build: ./api', n: 4 }, { t: '    restart: unless-stopped', n: 5 },
  { t: '    depends_on: { db: …healthy }', n: 6 }, '    networks: [web, backend]',
  '  db:', '    image: postgres:18',
  { t: '    healthcheck: { … }', n: 6 }, { t: '    mem_limit: 2g', n: 7 },
  { t: '    volumes: [dbdata:/var/lib/postgresql]', n: 8 }, { t: '    secrets: [db_pw]', n: 9 },
  '  adminer:', { t: '    profiles: [debug]', n: 10 },
]

export const Summary = () => (
  <div className="dg-split">
    <Code kind="file" title="compose.yaml" lines={allLines} />
    <Svg w={620} h={490} label="Das laufende Projekt mensa mit allen Themen dieses Kapitels">
      <Zone x={0} y={0} w={620} h={490} label="Host · Projekt mensa" /><Num i={1} n={1} x={192} y={18} />
      <Box i={1} x={14} y={56} w={66} h={50} t="engine" label=":8080" size={15} /><Num i={1} n={2} x={14} y={56} />
      <Box i={2} x={120} y={44} w={130} h={74} t="container" label="frontend" sub="nginx" />
      <Box i={3} x={290} y={44} w={140} h={74} t="container" label="api" sub="selbst gebaut" /><Num i={3} n={4} x={430} y={44} /><Num i={3} n={5} x={290} y={44} />
      <Box i={4} x={465} y={44} w={140} h={74} t="container" label="db" sub="healthy" /><Num i={4} n={7} x={605} y={44} />
      <Box i={9} x={100} y={290} w={140} h={60} t="gone" label="adminer" sub="nur mit debug" size={14} /><Num i={9} n={10} x={240} y={290} />
      <Arrow i={1} d="M82 81 H116" />
      <Arrow i={5} kind="back" d="M465 100 H434" /><Num i={5} n={6} x={448} y={142} />
      <g className="sb" data-t="kchip" style={at(5)}><rect x={100} y={166} width={285} height={26} rx={13} /><text x={114} y={184} fontSize={13} fontWeight={700}>web</text></g>
      <g className="sb" data-t="kchip" style={at(5)}><rect x={400} y={166} width={170} height={26} rx={13} /><text x={456} y={184} fontSize={13} fontWeight={700}>backend</text></g>
      <Num i={5} n={3} x={372} y={179} />
      <Wire i={5} d="M185 120 V164" /><Wire i={5} d="M330 120 V164" /><Wire i={5} d="M415 120 V164" /><Wire i={5} d="M535 120 V164" />
      <Box i={6} x={290} y={272} w={150} h={64} t="reg" label="Volume dbdata" sub="überlebt down" size={14} /><Num i={6} n={8} x={440} y={272} />
      <Arrow i={6} d="M590 120 V304 H444" />
      <Arrow i={7} d="M590 304 V388 H444" />
      <Box i={7} x={290} y={356} w={150} h={64} t="reg" label="Secret db_pw" sub="als Datei" size={14} /><Num i={7} n={9} x={440} y={356} />
      <Box i={8} x={14} y={430} w={592} h={46} t="engine" label="dockerd führt aus, Compose hat nur den Plan geliefert" size={14} />
    </Svg>
  </div>
)

/* ═══ Konfiguration ═══ */
/* One concrete line, image: mensa-api:…, and what each placeholder makes of it. */
const states = ['TAG=1.5', 'TAG=', 'TAG fehlt']

const bad = 'mensa-api: (ungültig)'

const forms: [string, [string, BoxTone][]][] = [
  ['mensa-api:${TAG}', [['mensa-api:1.5', 'ok'], [bad, 'reg'], [bad + ' !', 'reg']]],
  ['mensa-api:${TAG:-latest}', [['mensa-api:1.5', 'ok'], ['mensa-api:latest', 'libs'], ['mensa-api:latest', 'libs']]],
  ['mensa-api:${TAG-latest}', [['mensa-api:1.5', 'ok'], [bad, 'reg'], ['mensa-api:latest', 'libs']]],
  ['mensa-api:${TAG:?fehlt}', [['mensa-api:1.5', 'ok'], ['Abbruch', 'bad'], ['Abbruch', 'bad']]],
  ['mensa-api:${TAG?fehlt}', [['mensa-api:1.5', 'ok'], [bad, 'reg'], ['Abbruch', 'bad']]],
  ['mensa-api:${TAG:+neu}', [['mensa-api:neu', 'libs'], [bad, 'reg'], [bad, 'reg']]],
]

export const Interp = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label="Ergebnis jeder Platzhalter-Schreibweise für gesetzte, leere und fehlende Variablen">
      <Label x={0} y={22} anchor="start" size={15} weight={700} mono>image:</Label>
      {states.map((s, k) => <Label key={s} x={425 + k * 225} y={22} size={15} weight={700} mono>{s}</Label>)}
      {forms.map(([f, c], r) => (
        <g key={f}>
          <Box i={r} x={0} y={38 + r * 56} w={290} h={46} t="kchip" label={f} size={15} mono />
          {c.map(([l, t], k) => <Box key={k} i={r} x={325 + k * 225} y={38 + r * 56} w={200} h={46} t={t} label={l} size={14} mono />)}
        </g>
      ))}
    </Svg>
    <Take i={6} label="Regel" text="Mit Doppelpunkt zählt eine leere Variable wie eine fehlende. Das `!` steht für eine zusätzliche Warnung." />
  </div>
)

/* Merge rules on one real file pair: blue comes from file 1, yellow from file 2. */
const mergeA: Line[] = ['services:', '  frontend:', '    image: mensa-frontend:1', '    environment:', '      A: "1"', '      B: "1"', '    ports: ["80:80"]', '    volumes: ["./src:/app"]', '    dns: [1.1.1.1]']

const mergeB: Line[] = ['services:', '  frontend:', '    image: mensa-frontend:2', '    environment:', '      B: "2"', '      C: "3"', '    ports: ["443:443"]', '    volumes: !reset []', '    dns: !override [8.8.8.8]']

const mergeR: Line[] = [
  'services:', '  frontend:',
  { t: '    image: mensa-frontend:2', mark: 'b', chip: 'ersetzt' },
  '    environment:',
  { t: '      A: "1"', mark: 'a', chip: 'bleibt' },
  { t: '      B: "2"', mark: 'b', chip: 'ersetzt' },
  { t: '      C: "3"', mark: 'b', chip: 'neu' },
  '    ports:',
  { t: '      - "80:80"', mark: 'a' },
  { t: '      - "443:443"', mark: 'b', chip: 'angehängt' },
  { t: '    volumes: []', mark: 'b', chip: 'geleert' },
  { t: '    dns: [8.8.8.8]', mark: 'b', chip: 'ersetzt' },
]

export const MergeRules = () => (
  <div className="dg-col">
    <div className="dg-merge">
      <Code kind="file" title="compose.yaml" lines={mergeA} />
      <span className="dg-op" style={at(1)}>+</span>
      <Code kind="file" title="compose.override.yaml" lines={mergeB} i={1} />
      <span className="dg-op" style={at(2)}>=</span>
      <Code kind="file" title="docker compose config" lines={mergeR} i={2} />
    </div>
    <Take i={4} label="Regel" text="Einzelwerte ersetzt die spätere Datei, Schlüssel werden gemischt, Listen angehängt. Mit `!reset` und `!override` änderst du das gezielt." />
  </div>
)

/* Three ways to combine files, drawn as what they do to the project. */
export const FileWays = () => (
  <Svg w={1000} h={430} label="Drei Wege, Compose-Dateien zu verbinden: -f, extends und include">
    <Zone x={0} y={0} w={310} h={430} t="app" label="-f: übereinanderlegen" />
    <Box i={0} x={20} y={44} w={250} h={54} t="libs" label="compose.yaml" size={14} mono />
    <Box i={1} x={40} y={106} w={250} h={54} t="reg" label="compose.prod.yaml" size={14} mono />
    <Arrow i={2} d="M155 162 V222" label="mischen" lx={167} ly={198} anchor="start" />
    <Box i={2} x={20} y={226} w={270} h={70} t="container" label="ein Service api" sub="mit Werten aus beiden" size={15} />
    <Label i={2} x={155} y={350} size={12} mono>compose -f a.yaml -f b.yaml up</Label>
    <Label i={2} x={155} y={376} size={13} tone="muted">für Umgebungen: dev, prod</Label>

    <Zone i={3} x={345} y={0} w={310} h={430} t="app" label="extends: erben" />
    <Box i={3} x={365} y={44} w={270} h={72} t="libs" label="base-api" sub="in common.yaml" size={15} />
    <Arrow i={4} d="M430 118 V222" /><Arrow i={4} d="M570 118 V222" /><Label i={4} x={500} y={172} size={13} weight={600}>erben</Label>
    <Box i={4} x={365} y={226} w={128} h={70} t="container" label="api" sub="+ eigene Ports" size={14} />
    <Box i={4} x={507} y={226} w={128} h={70} t="container" label="worker" sub="+ command" size={14} />
    <Label i={4} x={500} y={350} size={13} mono>extends: {'{ file, service }'}</Label>
    <Label i={4} x={500} y={376} size={13} tone="muted">für gleiche Services</Label>

    <Zone i={5} x={690} y={0} w={310} h={430} t="app" label="include: einbinden" />
    <Zone i={5} x={710} y={44} w={270} h={120} t="reg" label="infra/compose.yaml" />
    <Box i={5} x={724} y={84} w={116} h={60} label="db" sub="eigene Pfade" size={14} /><Box i={5} x={850} y={84} w={116} h={60} label="cache" size={14} />
    <Arrow i={6} d="M845 166 V222" label="kommt dazu" lx={857} ly={198} anchor="start" />
    <Zone i={6} x={710} y={226} w={270} h={92} t="container" label="dein Projekt" />
    <Box i={6} x={724} y={258} w={76} h={48} label="api" size={13} /><Box i={6} x={806} y={258} w={76} h={48} t="reg" label="db" size={13} /><Box i={6} x={888} y={258} w={78} h={48} t="reg" label="cache" size={13} />
    <Label i={6} x={845} y={350} size={13} mono>include: [infra/compose.yaml]</Label>
    <Label i={6} x={845} y={376} size={13} tone="muted">für fertige Teilprojekte</Label>
  </Svg>
)

/* YAML anchors: the block is written once and appears twice. */
const anchorFile: Line[] = [
  { t: 'x-common: &common', chip: 'Vorlage, von Compose ignoriert', mark: 'a' },
  { t: '  restart: unless-stopped', mark: 'a' },
  { t: '  logging: { driver: local }', mark: 'a' },
  'services:', '  api:',
  { t: '    <<: *common', chip: 'hier einfügen', mark: 'b' },
  '    image: mensa-api:1.0', '  db:',
  { t: '    <<: *common', chip: 'hier einfügen', mark: 'b' },
  '    image: postgres:18',
]

const anchorResult: Line[] = [
  'services:', '  api:', '    image: mensa-api:1.0',
  { t: '    restart: unless-stopped', mark: 'a' }, { t: '    logging: { driver: local }', mark: 'a' },
  '  db:', '    image: postgres:18',
  { t: '    restart: unless-stopped', mark: 'a' }, { t: '    logging: { driver: local }', mark: 'a' },
]

export const Anchors = () => (
  <div className="dg-col">
    <div className="duo" style={css({ alignItems: 'start' })}>
      <Code kind="file" title="compose.yaml" lines={anchorFile} />
      <Code kind="file" title="Ergebnis: docker compose config" lines={anchorResult} i={2} />
    </div>
    <Take i={5} label="Prüfen" text="`docker compose config` zeigt immer die fertige Datei, nach Ankern, Merge und Variablen." />
  </div>
)

/* ═══ Interna ═══ */
/* Compose keeps no database: the state is written on the objects themselves. */
const proj = (name: string, y: number, i: number, sep: string) => (
  <g>
    <Zone i={i} x={14} y={y} w={612} h={122} t="app" label={`Projekt ${name}`} />
    {([[`${name}-web-1`, 'Container', 'container'], [`${name}-db-1`, 'Container', 'container'], [`${name}${sep}default`, 'Netz', 'kchip'], [`${name}${sep}dbdata`, 'Volume', 'reg']] as const).map(([l, s, t], k) => (
      <Box key={l} i={i} x={28 + k * 148} y={y + 40} w={140} h={66} t={t} label={l} sub={s} size={13} mono />
    ))}
  </g>
)

export const ProjectLabels = () => (
  <div className="dg-col">
    <Svg w={1000} h={420} label="Zwei Projekte auf einem Host, getrennt über Namen und Etiketten">
      <Zone x={0} y={0} w={640} h={420} label="Docker Host · dieselbe Datei, zweimal gestartet" />
      {proj('mensa', 36, 1, '_')}{proj('test', 170, 2, '_')}
      <Box i={3} x={14} y={320} w={270} h={56} t="hw" label="docker compose ps" size={14} mono />
      <Label i={3} x={300} y={344} anchor="start" size={14} weight={600}>fragt dockerd nach allen Containern</Label>
      <Label i={3} x={300} y={364} anchor="start" size={13} tone="muted">mit dem Etikett project=mensa</Label>
      <Zone i={4} x={670} y={0} w={330} h={176} t="reg" label="Etiketten an mensa-api-1" />
      {['project=mensa', 'service=api', 'container-number=1', 'config-hash=a1b2…'].map((l, k) => <Label key={l} i={4} x={688} y={58 + k * 27} anchor="start" size={14} mono weight={600}>{l}</Label>)}
      <Arrow i={4} kind="mute" d="M628 96 H666" />
      <Label i={4} x={688} y={162} anchor="start" size={12} tone="muted">alle mit Präfix com.docker.compose.</Label>
      <Zone i={5} x={670} y={190} w={330} h={230} t="app" label="Woher der Name kommt" sub="stärkste oben" />
      {([['-p mensa', 'engine'], ['COMPOSE_PROJECT_NAME', 'kchip'], ['name: mensa', 'libs'], ['Ordner mensa/', 'host']] as const).map(([l, t], k) => <Box key={l} i={6 + k} x={686} y={226 + k * 46} w={298} h={40} t={t} label={l} size={14} mono />)}
    </Svg>
    <Take i={10} label="Kern" text="Compose hat keine eigene Datenbank. Was zu einem Projekt gehört, steht als Etikett an den Objekten. Mit `-p test` läuft dieselbe Datei getrennt daneben." />
  </div>
)

/* What `up` compares, service by service. */
const rec: { n: string; want: string; have: string; eq: boolean; res: string; t: BoxTone }[] = [
  { n: 'db', want: 'Hash a1b2 · Image 7f3', have: 'Hash a1b2 · Image 7f3', eq: true, res: 'bleibt, läuft weiter', t: 'ok' },
  { n: 'api', want: 'Hash c3d4 · Image 2e9', have: 'Hash 9f00 · Image 2e9', eq: false, res: 'Konfiguration neu: ersetzen', t: 'reg' },
  { n: 'frontend', want: 'Hash 5a6b · Image d41', have: 'Hash 5a6b · Image 0c8', eq: false, res: 'Image neu: ersetzen', t: 'reg' },
]

export const Recreate = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label="docker compose up vergleicht Soll und Ist und ersetzt nur geänderte Container">
      <Label x={250} y={20} size={14} weight={700}>Soll: aus den Dateien</Label><Label x={560} y={20} size={14} weight={700}>Ist: Etikett am Container</Label><Label x={850} y={20} size={14} weight={700}>Was up tut</Label>
      {rec.map((r, k) => {
        const y = 36 + k * 68
        return (
          <g key={r.n}>
            <Label i={k * 2} x={0} y={y + 32} anchor="start" size={16} weight={700}>{r.n}</Label>
            <Box i={k * 2} x={100} y={y} w={300} h={54} t="libs" label={r.want} size={13} mono />
            <Label i={k * 2} x={405} y={y + 34} size={20} weight={700} tone={r.eq ? 'ok' : 'bad'}>{r.eq ? '=' : '≠'}</Label>
            <Box i={k * 2} x={415} y={y} w={300} h={54} t="host" label={r.have} size={13} mono />
            <Arrow i={k * 2 + 1} d={`M717 ${y + 27} H741`} />
            <Box i={k * 2 + 1} x={745} y={y} w={255} h={54} t={r.t} label={r.res} size={14} />
          </g>
        )
      })}
      <Zone i={6} x={0} y={254} w={1000} h={156} t="app" label="Ersetzen heißt" />
      <Box i={7} x={30} y={294} w={200} h={64} t="gone" label="alter Container" sub="gestoppt, gelöscht" size={15} />
      <Arrow i={8} d="M232 326 H306" />
      <Box i={8} x={310} y={294} w={200} h={64} t="container" label="neuer Container" sub="gleicher Name" size={15} />
      <Box i={9} x={700} y={294} w={270} h={64} t="reg" label="Volume dbdata" sub="bleibt angeschlossen" size={15} />
      <Arrow i={9} kind="ok" both d="M512 326 H696" label="übernimmt" lx={604} ly={314} />
      <Label i={9} x={500} y={392} size={13} tone="muted">Alles in der Schreibschicht geht dabei verloren, Volumes nicht.</Label>
    </Svg>
  </div>
)

/* ═══ Alles zusammen ═══ */
/* Closing picture: one production project that uses every technique of this sub-chapter. */
const bigFile: Line[] = [
  'include:',
  { t: '  - infra/compose.yaml', n: 1 },
  { t: 'x-common: &common', n: 2 },
  '  restart: unless-stopped',
  'services:', '  frontend:',
  '    <<: *common',
  { t: '    ports: ["${PORT:?fehlt}:80"]', n: 3 },
  '  api:',
  { t: '    extends:', n: 4 },
  '      { file: common.yaml, service: base }',
]

const bigCmd: Line[] = [
  { t: 'docker compose -p mensa-prod \\', k: 'cmd', n: 5 },
  { t: '    -f compose.yaml -f compose.prod.yaml \\', k: 'cont', n: 6 },
  { t: '    up -d --scale api=3', k: 'cont', n: 7 },
]

export const BigProject = () => (
  <div className="dg-split">
    <div className="dg-col">
      <Code kind="file" title="compose.yaml" lines={bigFile} />
      <Code title="Terminal" lines={bigCmd} i={2} />
    </div>
    <Svg w={620} h={470} label="Ein Produktionsprojekt, das alle Techniken dieses Kapitels nutzt">
      <Zone x={0} y={0} w={620} h={470} label="Host · Projekt mensa-prod" /><Num i={1} n={5} x={236} y={18} />
      <Box i={1} x={14} y={70} w={66} h={50} t="engine" label=":80" size={15} /><Num i={1} n={3} x={14} y={70} />
      <Arrow i={1} d="M82 95 H116" />
      <Box i={2} x={120} y={56} w={130} h={78} t="container" label="frontend" sub="nginx" /><Num i={2} n={2} x={250} y={56} />
      {[0, 1, 2].map(k => <Box key={k} i={3} x={310} y={44 + k * 50} w={150} h={44} t="container" label={`api-${k + 1}`} size={14} mono />)}
      <Num i={3} n={4} x={460} y={44} /><Num i={3} n={7} x={460} y={144} />
      <Arrow i={3} d="M252 95 H306" />
      <g className="sb" data-t="kchip" style={at(4)}><rect x={100} y={206} width={300} height={26} rx={13} /><text x={114} y={224} fontSize={13} fontWeight={700}>web</text></g>
      <g className="sb" data-t="kchip" style={at(4)}><rect x={420} y={206} width={185} height={26} rx={13} /><text x={500} y={224} fontSize={13} fontWeight={700}>backend</text></g>
      <Wire i={4} d="M185 136 V204" /><Wire i={4} d="M350 190 V204" /><Wire i={4} d="M440 190 V204" />
      <Zone i={5} x={290} y={300} w={316} h={110} t="reg" label="include" />
      <Box i={5} x={304} y={336} w={140} h={60} t="container" label="db" size={15} /><Box i={5} x={452} y={336} w={140} h={60} t="container" label="cache" size={15} />
      <Num i={5} n={1} x={606} y={300} />
      <Wire i={5} d="M430 234 V334" /><Wire i={5} d="M522 234 V334" />
      <Box i={6} x={14} y={300} w={250} h={110} t="reg" label="compose.prod.yaml" sub="überschreibt Werte für alle" size={14} mono /><Num i={6} n={6} x={264} y={300} />
      <Box i={7} x={14} y={424} w={592} h={34} t="engine" label="Etiketten halten alles als ein Projekt zusammen" size={13} />
    </Svg>
  </div>
)
