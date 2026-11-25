import type { ReactNode } from 'react'
import { Svg, Take, Num, Box as B, Zone, Arrow, Label, Wire, Tick } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { Icon } from '../../components/Icons.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Mark, Sheet, In, Txt, Go, type Svc } from '../../components/harbor/harbor.tsx'

// Einführung in Docker Compose: the Mensa-App needs three containers on ONE machine.
// Technical terms, abstract graphics. Compose runs one machine, never a cluster. Only the last slide shows commands.

// The colour key of the backend is still 'api' in the drawing kit; in the intro the service is called backend.
const name = (s: Svc) => (s === 'api' ? 'backend' : s)

/* ── ① 1 · three containers by hand: what is missing sits in the command line and where it breaks ── */
const mono = { fontFamily: 'var(--mono)', fontVariantLigatures: 'none', whiteSpace: 'pre' } as const
const runs: [string, string[]][] = [
  ['docker run -d --name backend -e DB_HOST=db mensa-backend', ['--network ?']],
  ['docker run -d --name frontend mensa-frontend', ['-p 8080:80 ?', '--network ?']],
  ['docker run -d --name db -e POSTGRES_PASSWORD=geheim -v dbdata:/var/lib/postgresql postgres:18', ['--network ?']],
]
// services left to right, with their start order (backend was typed first)
const started: [Svc, string, number, number][] = [['frontend', 'frontend', 180, 2], ['api', 'backend', 480, 1], ['db', 'db', 780, 3]]
const broken = (x1: number, x2: number, i: number, label?: string) => (
  <>
    <In i={i}><path d={`M${x1} 258 H${x2}`} stroke="var(--bad)" strokeWidth={2.4} strokeDasharray="7 5" fill="none" markerEnd="url(#ah-bad)" /></In>
    <Mark x={(x1 + x2) / 2 + (label ? 0 : 20)} y={236} bad r={10} i={i} />
    {label && <In i={i}><Txt x={(x1 + x2) / 2} y={282} size={12} w={700} fill="var(--bad)" anchor="middle">{label}</Txt></In>}
  </>
)
export const ByHand = () => (
  <div className="dg-col">
    <Svg w={1000} h={372} label={e('Drei docker-run-Befehle von Hand. Es fehlen ein gemeinsames Netz und der Port für das frontend, und das backend startet vor der Datenbank.', 'Three docker run commands by hand. A shared network and the port for the frontend are missing, and the backend starts before the database.')}>
      <In i={0}>
        <rect x={0} y={0} width={1000} height={142} rx={14} fill="var(--ink)" />
        <Txt x={20} y={24} size={12.5} w={700} fill="#9fb0c8">Terminal</Txt>
        <Txt x={980} y={24} size={12.5} fill="#9fb0c8" anchor="end">{e('von Hand, bei jedem Start, bei jedem im Team', 'by hand, at every start, for everyone in the team')}</Txt>
      </In>
      {runs.map(([cmd, miss], k) => {
        const y = 54 + k * 34
        let x = 52 + cmd.length * 8.1 + 14
        return (
          <g key={k}>
            <Num n={k + 1} x={30} y={y - 5} i={1 + k} />
            <In i={1 + k}>
              <text x={52} y={y} fontSize={13.5} fill="#fff" style={mono}>{cmd}</text>
              {miss.map(m => {
                const w = m.length * 7.5 + 20, cx = x
                x += w + 8
                return (
                  <g key={m}>
                    <rect x={cx} y={y - 17} width={w} height={24} rx={6} fill="rgba(192, 57, 43, .22)" stroke="#fca5a5" strokeWidth={1.5} strokeDasharray="4 3" />
                    <text x={cx + w / 2} y={y} fontSize={12.5} fontWeight={700} fill="#fca5a5" textAnchor="middle" style={mono}>{m}</text>
                  </g>
                )
              })}
            </In>
          </g>
        )
      })}
      <In i={1}>
        <rect x={120} y={170} width={880} height={196} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
        <Txt x={136} y={193} size={14} w={700} fill="var(--ink-2)">{e('Dein Rechner', 'Your machine')}</Txt>
        <Txt x={984} y={193} size={13} fill="var(--ink-3)" anchor="end">Docker</Txt>
        <Icon name="browser" x={18} y={226} s={56} />
        <Txt x={46} y={302} size={13} w={700} anchor="middle">Browser</Txt>
      </In>
      {started.map(([s, label, x, n]) => (
        <g key={s}>
          <Num n={n} x={x + 85} y={208} i={n} />
          <Box x={x} y={228} w={170} h={60} svc={s} label={label} i={n} />
        </g>
      ))}
      {broken(82, 171, 4)}
      {broken(356, 471, 4, e('Name unbekannt', 'name unknown'))}
      {broken(656, 771, 4, e('Name unbekannt', 'name unknown'))}
      <Tag x={150} y={304} w={230} label={e('kein -p 8080:80', 'no -p 8080:80')} sub={e('der Browser erreicht es nicht', 'the browser cannot reach it')} tone="bad" i={5} />
      <Tag x={450} y={304} w={230} label="UnknownHostException: db" sub={e('kein gemeinsames Netz', 'no shared network')} tone="bad" i={5} />
      <Tag x={750} y={304} w={230} label={e('startet als Letztes', 'starts last')} sub={e('das backend hat nicht gewartet', 'the backend did not wait')} tone="sand" i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Drei Befehle, drei Fehlerquellen: Netz, Port und Reihenfolge müssen bei jedem Start und bei jedem im Team stimmen.', 'Three commands, three sources of error: network, port and order have to be right at every start and for everyone in the team.')} />
  </div>
)

/* ── ① 2 · one compose.yaml for the whole team: each failure of the slide before is solved in one line ── */
const yaml: [string, string?][] = [
  ['services:'], ['  frontend:'], ['    build: ./frontend   # selbst bauen'], ['    ports: ["8080:80"]', e('✓ Port', '✓ port')],
  ['  backend:'], ['    build: ./backend    # selbst bauen'], ['    environment:'], ['      DB_HOST: db'], ['    depends_on: [db]', e('✓ Reihenfolge', '✓ order')],
  ['  db:'], ['    image: postgres:18  # vom Docker Hub'], ['    expose: ["5432"]      # nur im Netz'], ['    volumes: [dbdata:/var/lib/postgresql]'], ['volumes: { dbdata: }'],
]
// e() hands back the German text; w must fit the longer of both languages
const pill = (x: number, y: number, label: string, i: number, w = label.length * 7.4 + 22) => {
  return <In i={i}><rect x={x - w} y={y - 15} width={w} height={22} rx={11} fill="#e2f5ec" stroke="var(--ok)" strokeWidth={1.5} /><Txt x={x - w / 2} y={y + 1} size={12.5} w={700} fill="var(--ok)" anchor="middle">{label}</Txt></In>
}
const team = [e('Lenas Laptop · macOS', 'Lena’s laptop · macOS'), e('Tims Laptop · Windows', 'Tim’s laptop · Windows'), e('Abgabe-Server · Linux', 'Hand-in server · Linux')]
export const ComposeFile = () => (
  <div className="dg-col">
    <Svg w={1000} h={372} label={e('Links die compose.yaml mit Port, Startreihenfolge und automatischem Netz. Rechts drei Rechner, die mit docker compose up dieselben drei verbundenen Container starten.', 'Left the compose.yaml with port, start order and automatic network. Right three machines that start the same three connected containers with docker compose up.')}>
      <In i={0}>
        <rect x={0} y={0} width={400} height={368} rx={14} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} />
        <text x={16} y={28} fontSize={16} fontWeight={700} fill="var(--ink)" style={mono}>compose.yaml</text>
        <Txt x={384} y={28} size={13} fill="#8a6a20" anchor="end">{e('im Repo', 'in the repo')}</Txt>
        {yaml.map(([l], k) => {
          const [code, note] = l.split('#')
          return <text key={k} x={16} y={58 + k * 20} fontSize={13} fill="var(--ink)" style={mono}>{code}{note && <tspan fill="#8a6a20">#{note}</tspan>}</text>
        })}
      </In>
      {yaml.map(([, fix], k) => fix && pill(388, 58 + k * 20, fix, k < 5 ? 1 : 2))}
      <In i={3}>
        <path d="M16 330 H384" stroke="#e6c27a" strokeWidth={1.5} />
      </In>
      {pill(108, 353, e('✓ Netz', '✓ network'), 3, 92)}
      <In i={3}><Txt x={118} y={354} size={12.5} fill="#8a6a20">{e('kein Eintrag nötig: legt Compose an', 'no entry needed: Compose creates it')}</Txt></In>
      {team.map((host, k) => {
        const y = k * 118
        return (
          <g key={k}>
            <Go d={`M408 168 L462 ${y + 50}`} i={4} />
            <In i={4 + k}>
              <rect x={470} y={y} width={530} height={100} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
              <Txt x={486} y={y + 23} size={14} w={700} fill="var(--ink-2)">{host}</Txt>
              <text x={984} y={y + 23} fontSize={12.5} fill="var(--ink-3)" textAnchor="end" style={mono}>$ docker compose up</text>
            </In>
            {(['frontend', 'api', 'db'] as Svc[]).map((s, j) => <Box key={s} x={500 + j * 168} y={y + 40} w={136} h={44} svc={s} label={name(s)} size={14} i={4 + k} />)}
            <Wire d={`M636 ${y + 62} H668`} k="ok" i={4 + k} />
            <Wire d={`M804 ${y + 62} H836`} k="ok" i={4 + k} />
          </g>
        )
      })}
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Netz, Port und Reihenfolge stehen einmal in der compose.yaml im Repo. Jeder im Team startet mit `docker compose up` dieselben drei Container.', 'Network, port and order are written once in the compose.yaml in the repo. Everyone in the team starts the same three containers with `docker compose up`.')} />
  </div>
)


/* ── ② 5 · data stays in a volume: down removes the container, the volume survives until down -v ── */
const stage = [160, 440, 720]
const dbFrame = (x: number, y: number, h: number, i: number, ghost?: boolean) => (
  <In i={i}>
    <rect x={x} y={y} width={220} height={h} rx={12} fill={ghost ? 'none' : '#fff'} stroke={ghost ? 'var(--ink-3)' : 'var(--svc-db)'} strokeWidth={ghost ? 1.5 : 2.5} strokeDasharray={ghost ? '6 5' : undefined} />
    {ghost
      ? <Txt x={x + 110} y={y + h / 2 + 5} size={13} w={700} fill="var(--ink-3)" anchor="middle">{e('Container entfernt', 'container removed')}</Txt>
      : <Txt x={x + 14} y={y + 22} size={14} w={700} fill="var(--svc-db-d)">Container db</Txt>}
  </In>
)
const cylinder = (cx: number, i: number) => (
  <In i={i}>
    <path d={`M${cx - 70} 284 V326 A70 9 0 0 0 ${cx + 70} 326 V284`} fill="#efeaff" stroke="var(--svc-db)" strokeWidth={2} />
    <ellipse cx={cx} cy={284} rx={70} ry={9} fill="#f6f3ff" stroke="var(--svc-db)" strokeWidth={2} />
    <Txt x={cx} y={314} size={13} w={700} fill="var(--svc-db-d)" anchor="middle">Volume dbdata</Txt>
  </In>
)
export const Volumes = () => (
  <div className="dg-col">
    <Svg w={1000} h={372} label={e('Oben ohne Volume: nach docker compose down sind Container und Daten weg, nach up ist die Datenbank leer. Unten mit Volume dbdata: der Container verschwindet, das Volume bleibt, nach up sind die Daten wieder da.', 'Top without a volume: after docker compose down container and data are gone, after up the database is empty. Bottom with the volume dbdata: the container disappears, the volume stays, after up the data is back.')}>
      <Label x={270} y={18} size={13} weight={700} i={0}>{e('läuft', 'running')}</Label>
      <Label x={550} y={18} size={13} weight={700} mono i={0}>docker compose down</Label>
      <Label x={830} y={18} size={13} weight={700} mono i={0}>docker compose up</Label>
      <In i={0}>
        <Txt x={0} y={86} size={14} w={700} fill="var(--ink)">{e('ohne Volume', 'without a volume')}</Txt>
        <Txt x={0} y={104} size={12.5} fill="var(--ink-3)">{e('Daten im Container', 'data in the container')}</Txt>
        <Txt x={0} y={226} size={14} w={700} fill="var(--ink)">{e('mit Volume', 'with a volume')}</Txt>
        <Txt x={0} y={244} size={12.5} fill="var(--ink-3)">{e('Daten im Volume', 'data in the volume')}</Txt>
      </In>

      {dbFrame(stage[0], 44, 90, 1)}
      <B x={stage[0] + 14} y={80} w={192} h={38} t="libs" label={e('Daten: Speiseplan', 'data: menu')} size={13.5} i={1} />
      <Go d="M384 89 H436" i={2} />
      {dbFrame(stage[1], 44, 90, 2, true)}
      <Go d="M664 89 H716" i={3} />
      {dbFrame(stage[2], 44, 90, 3)}
      <B x={stage[2] + 14} y={80} w={192} h={38} t="gone" label={e('leer – Daten weg', 'empty – data gone')} size={13.5} i={3} />
      <Mark x={stage[2] + 190} y={64} bad r={9} i={3} />

      {dbFrame(stage[0], 170, 80, 4)}
      <B x={stage[0] + 14} y={204} w={192} h={32} t="gone" label="/var/lib/postgresql" size={12.5} mono i={4} />
      <Wire d={`M${stage[0] + 110} 252 V274`} i={4} />
      {cylinder(stage[0] + 110, 4)}
      <Go d="M384 210 H436" i={5} />
      {dbFrame(stage[1], 170, 80, 5, true)}
      {cylinder(stage[1] + 110, 5)}
      <Mark x={stage[1] + 200} y={305} ok r={9} i={5} />
      <Go d="M664 210 H716" i={6} />
      {dbFrame(stage[2], 170, 80, 6)}
      <B x={stage[2] + 14} y={204} w={192} h={32} t="gone" label="/var/lib/postgresql" size={12.5} mono i={6} />
      <Wire d={`M${stage[2] + 110} 252 V274`} i={6} />
      {cylinder(stage[2] + 110, 6)}
      <Mark x={stage[2] + 200} y={305} ok r={9} i={6} />
      <Label x={550} y={362} size={12.5} weight={700} tone="bad" i={7}>{e('docker compose down -v löscht auch das Volume – dann sind die Daten weg', 'docker compose down -v deletes the volume too – then the data is gone')}</Label>
    </Svg>
    <Take i={8} label={e('Merke', 'Remember')} text={e('Was ein Container selbst speichert, verschwindet mit ihm. Daten im Volume liegen außerhalb und überstehen down und up – erst `down -v` löscht sie.', 'What a container stores itself disappears with it. Data in a volume lives outside and survives down and up – only `down -v` deletes it.')} />
  </div>
)


/* ── ② 1 · db instead of localhost: the host changes, the port stays ── */
const zoneBox = (x: number, w: number, label: string, sub: string, i: number) => (
  <In i={i}>
    <rect x={x} y={0} width={w} height={310} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
    <Txt x={x + 16} y={23} size={14} w={700} fill="var(--ink-2)">{label}</Txt>
    <Txt x={x + w - 16} y={23} size={13} fill="var(--ink-3)" anchor="end">{sub}</Txt>
  </In>
)
const ctrFrame = (x: number, w: number, svc: Svc, name: string, i: number) => (
  <In i={i}>
    <rect x={x} y={44} width={w} height={180} rx={12} fill="#fff" stroke={`var(--svc-${svc})`} strokeWidth={2.5} />
    <Txt x={x + 14} y={66} size={14} w={700} fill={`var(--svc-${svc}-d)`}>{name}</Txt>
  </In>
)
/** JDBC URL with the host highlighted; the port is drawn the same in both. */
const jdbc = (x: number, host: string, i: number) => (
  <In i={i}>
    <rect x={x} y={324} width={400} height={40} rx={10} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
    <text x={x + 200} y={349} fontSize={14} textAnchor="middle" style={mono}>
      <tspan fill="var(--ink-3)">jdbc:postgresql://</tspan><tspan fill="var(--ok)" fontWeight={700}>{host}</tspan><tspan fill="var(--blue-deep)" fontWeight={700}>:5432</tspan><tspan fill="var(--ink-3)">/mensa</tspan>
    </text>
  </In>
)
export const DbNotLocalhost = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label={e('Links auf dem Laptop: Backend und Postgres laufen auf demselben Rechner, localhost:5432 trifft die Datenbank. Rechts mit Compose: localhost:5432 endet im Container backend selbst, dort lauscht nichts. db:5432 führt über das gemeinsame Netz zum Container db.', 'Left on the laptop: backend and Postgres run on the same machine, localhost:5432 hits the database. Right with Compose: localhost:5432 ends in the backend container itself, nothing listens there. db:5432 leads through the shared network to the db container.')}>
      {zoneBox(0, 400, e('Dein Laptop', 'Your laptop'), e('ohne Docker', 'without Docker'), 0)}
      <B x={24} y={60} w={352} h={54} t="app" label="java -jar app.jar" sub="Spring-Boot-Backend" size={15} i={0} />
      <B x={24} y={196} w={352} h={54} t="app" label="Postgres" sub={e('installiert, lauscht auf :5432', 'installed, listens on :5432')} size={15} i={0} />
      <Arrow d="M200 118 V190" kind="ok" i={0} />
      <Label x={214} y={159} anchor="start" size={14} weight={700} mono tone="ok" i={0}>localhost:5432</Label>
      <Mark x={352} y={154} ok r={9} i={0} />
      <In i={0}><Txt x={200} y={286} size={12.5} fill="var(--ink-3)" anchor="middle">{e('beide auf demselben Rechner', 'both on the same machine')}</Txt></In>
      {jdbc(0, 'localhost', 1)}

      {zoneBox(440, 560, e('Dein Rechner', 'Your machine'), 'Docker Compose', 2)}
      {ctrFrame(466, 210, 'api', e('Container backend', 'Container backend'), 2)}
      {ctrFrame(776, 200, 'db', e('Container db', 'Container db'), 2)}
      <B x={480} y={76} w={182} h={40} t="app" label="app.jar" size={15} i={2} />
      <B x={790} y={76} w={172} h={40} t="app" label="Postgres :5432" size={15} i={2} />
      <In i={2}><Txt x={876} y={180} size={12.5} fill="var(--ink-3)" anchor="middle">{e('im Netz erreichbar als db', 'reachable in the network as db')}</Txt></In>
      <Wire d="M571 224 V256" i={2} /><Wire d="M876 224 V256" i={2} />
      <B x={466} y={256} w={510} h={36} t="libs" label={e('gemeinsames Netz: Service-Name = Hostname', 'shared network: service name = host name')} size={13.5} i={2} />

      <Arrow d="M520 120 V164" kind="bad" i={3} />
      <Label x={534} y={147} anchor="start" size={12.5} weight={700} mono tone="bad" i={3}>localhost:5432</Label>
      <B x={480} y={170} w={182} h={40} t="bad" label="Connection refused" size={13.5} i={3} />
      <Arrow d="M664 96 H780" kind="ok" i={4} />
      <Label x={721} y={86} size={14} weight={700} mono tone="ok" i={4}>db:5432</Label>
      <Mark x={721} y={118} ok r={9} i={4} />
      {jdbc(520, 'db', 5)}
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Im Container zeigt localhost auf den Container selbst. Die Datenbank erreicht das Backend über ihren Service-Namen: `db:5432` statt `localhost:5432` – nur der Host ändert sich, der Port bleibt.', 'Inside a container localhost points at the container itself. The backend reaches the database by its service name: `db:5432` instead of `localhost:5432` – only the host changes, the port stays.')} />
  </div>
)


/* ── ② 2 · two port worlds: host ports the operating system (and the browser) knows, container ports only Docker knows ── */
const hostCol: [Svc, string, string, boolean][] = [['frontend', 'frontend', 'frontend:80', true], ['api', 'backend', 'backend:8080', false], ['db', 'db', 'db:5432', false]]
const hx = (k: number) => 230 + k * 250
export const HostPorts = () => (
  <div className="dg-col">
    <Svg w={1000} h={336} label={e('Außen der Rechner mit seinen Host-Ports, innen das Docker-Netz mit den Container-Ports. Nur frontend hat den Host-Port 8080, den der Browser als localhost:8080 erreicht. backend:8080 und db:5432 kennt nur Docker.', 'Outside the machine with its host ports, inside the Docker network with the container ports. Only frontend has host port 8080, which the browser reaches as localhost:8080. backend:8080 and db:5432 are known only to Docker.')}>
      <In i={0}>
        <rect x={170} y={0} width={830} height={330} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
        <Txt x={186} y={23} size={14} w={700} fill="var(--ink-2)">{e('Dein Rechner', 'Your machine')}</Txt>
        <Txt x={984} y={23} size={13} w={700} fill="var(--ok)" anchor="end">{e('Host-Ports: kennt das Betriebssystem', 'host ports: the operating system knows them')}</Txt>
        <rect x={200} y={140} width={750} height={170} rx={14} fill="#f7faff" stroke="var(--blue)" strokeWidth={1.5} strokeDasharray="6 4" />
        <Txt x={216} y={162} size={14} w={700} fill="var(--ink-2)">{e('Docker-Netz', 'Docker network')}</Txt>
        <Txt x={934} y={162} size={13} w={700} fill="var(--blue-deep)" anchor="end">{e('Container-Ports: kennt nur Docker', 'container ports: only Docker knows them')}</Txt>
      </In>
      {hostCol.map(([s, label, cport, open], k) => (
        <g key={s}>
          {open
            ? <B x={hx(k) + 20} y={58} w={150} h={34} t="ok" label=":8080" size={15} mono i={1} />
            : <B x={hx(k) + 20} y={58} w={150} h={34} t="gone" label={e('kein Host-Port', 'no host port')} size={13} i={1} />}
          <Box x={hx(k)} y={190} w={190} h={56} svc={s} label={label} i={2} />
          <In i={2}>
            <rect x={hx(k) + 20} y={262} width={150} height={30} rx={8} fill="#dce9ff" stroke="var(--blue)" strokeWidth={1.5} />
            <text x={hx(k) + 95} y={282} fontSize={13.5} fontWeight={700} fill="var(--blue-deep)" textAnchor="middle" style={mono}>{cport}</text>
          </In>
        </g>
      ))}
      <Go d="M424 218 H474" i={2} /><Go d="M674 218 H724" i={2} />
      <Arrow d="M325 96 V181" kind="ok" i={3} />
      <Label x={335} y={128} anchor="start" size={13} weight={700} mono tone="ok" i={3}>ports: 8080:80</Label>
      <In i={4}><Icon name="browser" x={40} y={48} s={56} /><Txt x={68} y={124} size={13} w={700} anchor="middle">Browser</Txt></In>
      <Arrow d="M100 76 H242" kind="ok" i={4} />
      <Label x={10} y={164} anchor="start" size={13} weight={700} mono tone="ok" i={5}>localhost:8080</Label>
      <Mark x={150} y={160} ok r={9} i={5} />
      <Label x={10} y={194} anchor="start" size={13} weight={700} mono tone="bad" i={6}>localhost:5432</Label>
      <Mark x={150} y={190} bad r={9} i={6} />
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Der Browser erreicht nur Host-Ports – hier `localhost:8080`. Container-Ports wie `backend:8080` und `db:5432` kennt nur Docker. `ports: "8080:80"` verbindet beide: Host-Port links, Container-Port rechts.', 'The browser only reaches host ports – here `localhost:8080`. Container ports like `backend:8080` and `db:5432` are known only to Docker. `ports: "8080:80"` connects both: host port left, container port right.')} />
  </div>
)


/* ── ② 3 · Vue runs in the browser: its API calls go through the frontend's nginx to backend:8080 ── */
export const ApiProxy = () => (
  <div className="dg-col">
    <Svg w={1000} h={404} label={e('Die Vue-App läuft im Browser. fetch(/api/meals) geht an localhost:8080, nginx im Container frontend leitet /api/ an backend:8080 weiter, das backend fragt db:5432. fetch an http://backend:8080 scheitert im Browser, weil nur das Docker-Netz den Namen backend kennt.', 'The Vue app runs in the browser. fetch(/api/meals) goes to localhost:8080, nginx in the frontend container forwards /api/ to backend:8080, the backend asks db:5432. fetch to http://backend:8080 fails in the browser because only the Docker network knows the name backend.')}>
      <In i={0}>
        <rect x={290} y={0} width={710} height={400} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
        <Txt x={306} y={23} size={14} w={700} fill="var(--ink-2)">{e('Dein Rechner', 'Your machine')}</Txt>
        <rect x={430} y={40} width={554} height={340} rx={14} fill="#f7faff" stroke="var(--blue)" strokeWidth={1.5} strokeDasharray="6 4" />
        <Txt x={446} y={62} size={14} w={700} fill="var(--ink-2)">{e('Docker-Netz', 'Docker network')}</Txt>
        <rect x={450} y={80} width={250} height={124} rx={12} fill="#fff" stroke="var(--svc-frontend)" strokeWidth={2.5} />
        <Txt x={464} y={102} size={14} w={700} fill="var(--svc-frontend-d)">{e('Container frontend · nginx', 'Container frontend · nginx')}</Txt>
      </In>
      <B x={462} y={112} w={226} h={34} t="app" label={e('/ → Vue-App (HTML, JS)', '/ → Vue app (HTML, JS)')} size={12.5} i={0} />
      <B x={462} y={156} w={226} h={34} t="libs" label="/api/ → backend:8080" size={12.5} mono i={0} />
      <Box x={760} y={112} w={200} h={56} svc="api" label="backend:8080" size={14} i={0} />
      <Box x={760} y={272} w={200} h={56} svc="db" label="db:5432" size={14} i={0} />
      <B x={310} y={140} w={96} h={34} t="ok" label=":8080" size={14} mono i={0} />

      <In i={1}>
        <rect x={0} y={40} width={250} height={320} rx={12} fill="#fff" stroke="var(--ink-3)" strokeWidth={1.5} />
        <path d="M0 68 H250" stroke="var(--line)" strokeWidth={1.5} />
        <circle cx={16} cy={54} r={4} fill="#c3cddb" /><circle cx={30} cy={54} r={4} fill="#c3cddb" />
        <text x={46} y={59} fontSize={12} fill="var(--ink-3)" style={mono}>localhost:8080</text>
        <Txt x={16} y={100} size={15} w={700} fill="var(--ink)">{e('Vue-App', 'Vue app')}</Txt>
        <Txt x={16} y={118} size={12.5} fill="var(--ink-3)">{e('vom frontend geladen, läuft hier', 'loaded from frontend, runs here')}</Txt>
      </In>
      <In i={2}>
        <rect x={12} y={140} width={226} height={34} rx={8} fill="#e2f5ec" stroke="var(--ok)" strokeWidth={1.5} />
        <text x={24} y={162} fontSize={12} fontWeight={700} fill="var(--ok)" style={mono}>fetch('/api/meals')</text>
      </In>
      <Mark x={220} y={157} ok r={9} i={2} />
      <Num n={1} x={272} y={133} i={2} />
      <Arrow d="M242 157 H302" kind="ok" i={2} />
      <Arrow d="M410 157 H442" kind="ok" i={2} />
      <Num n={2} x={730} y={192} i={3} />
      <Arrow d="M692 173 L752 146" kind="ok" i={3} />
      <Arrow d="M860 172 V264" kind="ok" i={3} />

      <In i={4}>
        <rect x={12} y={220} width={226} height={34} rx={8} fill="#fdecea" stroke="var(--bad)" strokeWidth={1.5} />
        <text x={18} y={242} fontSize={11.5} fontWeight={700} fill="var(--bad)" style={mono}>fetch('http://backend:8080/…')</text>
        <text x={16} y={280} fontSize={11.5} fontWeight={700} fill="var(--bad)" style={mono}>ERR_NAME_NOT_RESOLVED</text>
        <Txt x={16} y={302} size={12} fill="var(--ink-3)">{e('backend kennt nur das Docker-Netz', 'only the Docker network knows backend')}</Txt>
      </In>
      <Mark x={270} y={237} bad r={9} i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Die Vue-App läuft im Browser, nicht im Container. Sie ruft `/api/…` beim frontend auf, nginx leitet an `backend:8080` weiter – den Namen backend kennt der Browser nicht.', 'The Vue app runs in the browser, not in the container. It calls `/api/…` on the frontend, nginx forwards to `backend:8080` – the browser does not know the name backend.')} />
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
    <Svg w={1000} h={400} label={e('Zeitleisten: Ohne Warten stürzt das backend ab, mit Healthcheck startet es erst, wenn die Datenbank bereit ist', 'Timelines: without waiting the backend crashes, with a healthcheck it starts only once the database is ready')}>
      <Tag x={20} y={0} w={960} label={e('nur depends_on: wartet auf den Start der db, nicht darauf, dass sie bereit ist', 'only depends_on: waits for db to start, not for it to be ready')} tone="sand" />
      {lane(60, 'db', 1, <>{bar(160, 60, 260, 'db', e('fährt hoch …', 'starting up …'), 1, 'light')}{bar(424, 60, 520, 'db', e('bereit', 'ready'), 2)}</>)}
      {lane(106, 'backend', 2, <>{bar(200, 106, 150, 'api', e('startet', 'starts'), 2)}</>)}
      <Mark x={366} y={124} bad i={2} r={13} />
      <In i={2}><Txt x={386} y={130} size={13.5} w={700} fill="var(--bad)">{e('Connection refused: db noch nicht bereit', 'Connection refused: db not ready yet')}</Txt></In>
      <Tag x={20} y={176} w={960} label={e('mit Healthcheck und condition: service_healthy: Compose wartet auf „healthy“', 'with a healthcheck and condition: service_healthy: Compose waits for “healthy”')} tone="ok" i={3} />
      {lane(236, 'db', 3, <>{bar(160, 236, 260, 'db', e('fährt hoch …', 'starting up …'), 3, 'light')}{bar(424, 236, 520, 'db', 'healthy', 4)}</>)}
      {lane(282, 'backend', 4, <>{bar(440, 282, 504, 'api', e('startet erst jetzt', 'starts only now'), 5)}</>)}
      <Mark x={930} y={300} ok i={5} r={13} />
      {[0, 1, 2].map(k => <In key={k} i={3}><path d={`M${220 + k * 70} 230 v6`} stroke="var(--ink-3)" strokeWidth={2} /><Txt x={220 + k * 70} y={226} size={12} fill="var(--ink-3)" anchor="middle">{e('prüft', 'check')}</Txt></In>)}
      <In i={3}><path d="M140 350 H960" stroke="var(--ink-3)" strokeWidth={2} markerEnd="url(#ah-mute)" /><Txt x={960} y={378} size={13} fill="var(--ink-3)" anchor="end">{e('Zeit', 'time')}</Txt></In>
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Gestartet ist nicht bereit. Erst wenn der Healthcheck der Datenbank „healthy“ meldet, startet das backend.', 'Started is not ready. Only when the database’s healthcheck reports “healthy” does the backend start.')} />
  </div>
)

/* ── ② 5 · the one commands slide: what each command leaves behind ── */
const cleanup: [string, string, ('ok' | 'bad')[], 'ok' | 'bad' | undefined][] = [
  ['up -d', e('baut fehlende Images, legt Netz, Volume und Container an', 'builds missing images, creates network, volume and containers'), ['ok', 'ok', 'ok'], 'ok'],
  ['down', e('Container und Netz weg, Volume bleibt: nach up ist alles da', 'containers and network gone, volume stays: after up all is back'), ['bad', 'bad', 'ok'], undefined],
  ['down -v', e('löscht auch das Volume: alle gesammelten Daten sind weg', 'deletes the volume too: all collected data is gone'), ['bad', 'bad', 'bad'], 'bad'],
]
export const Commands = () => (
  <div className="dg-split">
    <Code title="compose.yaml" kind="file" lines={[
      'services:',
      '  frontend:',
      { t: '    build:', chip: e('Dockerfile statt fertigem Image', 'Dockerfile instead of a ready image') },
      '      context: ./frontend',
      '      dockerfile: Dockerfile',
      { t: '    ports: ["8080:80"]', chip: 'Port' },
      '  backend:',
      '    build:',
      '      context: ./backend',
      '      dockerfile: Dockerfile',
      { t: '    environment:', chip: e('Umgebungsvariablen', 'environment variables') },
      '      DB_HOST: db',
      { t: '    depends_on:', chip: e('wartet auf healthy', 'waits for healthy') },
      '      db: { condition: service_healthy }',
      '  db:',
      '    image: postgres:18',
      { t: '    expose: ["5432"]', chip: e('Port nur im Netz', 'port only in the network') },
      '    environment:',
      '      POSTGRES_PASSWORD: geheim',
      '    volumes: [dbdata:/var/lib/postgresql]',
      { t: '    healthcheck:', chip: 'Healthcheck' },
      '      test: pg_isready -U postgres',
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
