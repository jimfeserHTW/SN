import type { ReactNode } from 'react'
import { Svg, Take, Num, Box as B, Zone, Label } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Mark, Person, Sheet, Plan, In, Txt, Go, type Svc } from '../../components/harbor/harbor.tsx'

// Overview slides of the first sub-chapters: what compose.yaml describes and what Compose does with it. Technical terms only.
const trio: [Svc, number][] = [['frontend', 190], ['api', 420], ['db', 650]]

/* ── one command instead of many: Compose works through compose.yaml ── */
const steps = [
  e('compose.yaml lesen', 'read compose.yaml'), e('Netz anlegen', 'create the network'), e('db starten', 'start db'),
  e('api starten', 'start api'), e('frontend starten', 'start frontend'), e('Port 8080 veröffentlichen', 'publish port 8080'),
]
export const Crew = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Compose arbeitet die compose.yaml in sechs Schritten ab', 'Compose works through compose.yaml in six steps')}>
      {steps.map((s, k) => (
        <In key={s} i={k}>
          <rect x={10} y={20 + k * 54} width={240} height={44} rx={10} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
          <Txt x={60} y={47 + k * 54} size={15} w={600} fill="var(--ink)">{s}</Txt>
        </In>
      ))}
      {steps.map((_, k) => <Num key={k} n={k + 1} x={34} y={42 + k * 54} i={k} />)}
      <Zone x={300} y={100} w={680} h={240} label={e('Dein Rechner', 'Your machine')} sub="Docker" />
      <Sheet x={336} y={146} w={40} h={50} lines={3} tone="sand" i={0} /><Num n={1} x={392} y={150} i={0} />
      <Label x={356} y={216} size={11.5} mono weight={700} i={0}>compose.yaml</Label>
      <In i={1}><path d="M531 226 V206 H905 V226 M718 206 V226" stroke="var(--blue)" strokeWidth={2.5} fill="none" /></In><Num n={2} x={718} y={206} i={1} />
      <Box x={846} y={226} w={118} h={58} svc="db" size={14} i={2} /><Num n={3} x={964} y={226} i={2} />
      <Box x={659} y={226} w={118} h={58} svc="api" size={14} i={3} /><Num n={4} x={777} y={226} i={3} />
      <Box x={472} y={226} w={118} h={58} svc="frontend" size={14} i={4} /><Num n={5} x={590} y={226} i={4} />
      <B x={268} y={238} w={84} h={36} t="ok" label=":8080" mono size={14} i={5} /><Num n={6} x={352} y={238} i={5} />
      <Go d="M356 256 H466" i={5} kind="ok" />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Ihr gebt einen Befehl. Compose startet alles laut compose.yaml, die Datenbank zuerst, und veröffentlicht am Ende den Port.', 'You give one command. Compose starts everything as compose.yaml says, the database first, and finally publishes the port.')} />
  </div>
)

/* ── the project name as a label ── */
export const Sticker = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Drei Container tragen das Label mensa, ein vierter gehört zu einem anderen Projekt', 'Three containers carry the label mensa, a fourth belongs to another project')}>
      <Zone x={20} y={140} w={960} h={190} label={e('Dein Rechner', 'Your machine')} sub="Docker" />
      <In i={1}><rect x={174} y={184} width={540} height={106} rx={14} fill="none" stroke="var(--blue)" strokeWidth={2.5} strokeDasharray="8 6" /></In>
      {trio.map(([s, x], k) => (
        <g key={s}>
          <Box x={x} y={220} w={150} h={60} svc={s} i={1} />
          <In i={1}><path d={`M${x + 35} 212 V220`} stroke="#8a6a20" strokeWidth={1.5} /><rect x={x + 6} y={192} width={58} height={20} rx={4} fill="#ffe28a" stroke="#8a6a20" strokeWidth={1.5} /><Txt x={x + 35} y={207} size={12} w={700} fill="#6b4a00" anchor="middle">mensa</Txt></In>
          <In i={2}><text x={x + 75} y={306} textAnchor="middle" fontSize={13} style={{ fontFamily: "var(--mono)" }} fill="var(--ink-2)">{`mensa-${s}-1`}</text></In>
        </g>
      ))}
      <Box x={790} y={220} w={150} h={60} svc="other" label={e('übung', 'exercise')} i={3} />
      <In i={3}><path d="M825 212 V220" stroke="var(--ink-3)" strokeWidth={1.5} /><rect x={796} y={192} width={58} height={20} rx={4} fill="#fff" stroke="var(--ink-3)" strokeWidth={1.5} /><Txt x={825} y={207} size={12} w={700} fill="var(--ink-3)" anchor="middle">blatt3</Txt></In>
      <Tag x={174} y={40} w={540} label={e('Projekt mensa: alles mit diesem Label', 'Project mensa: everything with this label')} sub={e('der Projektname steht an jedem Container, Netz und Volume', 'the project name is on every container, network and volume')} tone="blue" i={1} />
      <Lead d="M444 86 V180" end={[444, 182]} i={1} />
      <Tag x={740} y={110} w={240} label={e('fremder Container', 'someone else’s container')} sub={e('Compose lässt ihn in Ruhe', 'Compose leaves it alone')} i={3} />
      <Lead d="M890 156 V214" end={[890, 218]} i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Compose erkennt seine Container am Label mit dem Projektnamen. Darum räumt es beim Aufräumen nur das eigene Projekt weg.', 'Compose recognises its containers by the label with the project name. That is why it only clears away its own project when cleaning up.')} />
  </div>
)

/* ── environment variables: settings from outside ── */
const Waybill = ({ x, y, lines, title, i }: { x: number; y: number; lines: string[]; title: string; i: number }) => (
  <In i={i}>
    <rect x={x} y={y} width={230} height={40 + lines.length * 26} rx={10} fill="#fff3d6" stroke="#c9a24f" strokeWidth={2} />
    <Txt x={x + 16} y={y + 26} size={14} w={700} fill="#6b4a00">{title}</Txt>
    {lines.map((l, k) => <text key={l} x={x + 16} y={y + 52 + k * 26} fontSize={14} style={{ fontFamily: "var(--mono)" }} fill="var(--ink)">{l}</text>)}
  </In>
)
export const Waybills = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label={e('Derselbe Container api mit zwei verschiedenen Umgebungsvariablen, für den Laptop und für den Server', 'The same api container with two different sets of environment variables, for the laptop and for the server')}>
      <Tag x={20} y={0} w={460} label={e('auf dem Laptop', 'on the laptop')} tone="sky" />
      <Tag x={520} y={0} w={460} label={e('auf dem Server', 'on the server')} tone="sky" i={3} />
      <Box x={40} y={120} w={170} h={80} svc="api" label="mensa-api:1.0" size={14} i={1} />
      <Waybill x={240} y={90} title="environment" lines={['DB_HOST=db', 'DB_USER=mensa', 'DB_PASSWORD=geheim']} i={2} />
      <Go d="M236 160 H214" i={2} />
      <Box x={540} y={120} w={170} h={80} svc="api" label="mensa-api:1.0" size={14} i={4} />
      <Waybill x={740} y={90} title="environment" lines={['DB_HOST=db', 'DB_USER=mensa', 'DB_PASSWORD=x7!Qe…']} i={5} />
      <Go d="M736 160 H714" i={5} />
      <Tag x={60} y={270} w={880} label={e('Gleiches Image, andere Umgebungsvariablen', 'Same image, different environment variables')} sub={e('Spring Boot liest die Werte beim Start: DB_HOST wird zu db', 'Spring Boot reads the values at start: DB_HOST becomes db')} tone="ok" i={6} />
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Einstellungen gebt ihr von außen als Umgebungsvariablen mit, in der compose.yaml unter environment. Das Image bleibt überall dasselbe.', 'You pass settings in from outside as environment variables, in compose.yaml under environment. The image stays the same everywhere.')} />
  </div>
)

/* ── a service describes one container ── */
const svcRows: [string, string, string][] = [
  ['image: mensa-api:1.0', e('welches Image', 'which image'), 'var(--blue)'],
  ['environment: …', e('Umgebungsvariablen', 'environment variables'), '#c9a24f'],
  ['ports: ["8081:8080"]', e('Port nach außen', 'port to the outside'), 'var(--ok)'],
  ['volumes: [uploads:/data]', e('Volume für Daten', 'volume for data'), 'var(--svc-db)'],
  ['depends_on: [db]', e('startet erst nach db', 'starts only after db'), 'var(--ink-3)'],
]
export const ServiceCard = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Die Zeilen eines Service in der compose.yaml und was sie am Container bewirken', 'The lines of a service in compose.yaml and what they do to the container')}>
      <In i={0}><rect x={20} y={20} width={400} height={300} rx={14} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} /><text x={44} y={56} fontSize={16} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>api:</text></In>
      {svcRows.map(([code, what, c], k) => (
        <g key={code}>
          <In i={1 + k}><rect x={40} y={74 + k * 48} width={360} height={38} rx={8} fill="#fff" stroke={c} strokeWidth={2} /><text x={56} y={98 + k * 48} fontSize={13.5} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{code}</text></In>
          <Go d={`M404 ${93 + k * 48} H540`} i={1 + k} />
          <In i={1 + k}><rect x={546} y={74 + k * 48} width={250} height={38} rx={19} fill={`color-mix(in srgb, ${c} 14%, #fff)`} stroke={c} strokeWidth={1.5} /><Txt x={671} y={98 + k * 48} size={13.5} w={700} fill="var(--ink)" anchor="middle">{what}</Txt></In>
        </g>
      ))}
      <Box x={830} y={130} w={150} h={110} svc="api" i={6} />
      <Lead d="M800 170 H826" end={[828, 170]} i={6} />
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Ein Service ist die Beschreibung eines Containers: Image, Umgebungsvariablen, Ports, Volumes und auf wen er wartet.', 'A service is the description of one container: image, environment variables, ports, volumes and whom it waits for.')} />
  </div>
)

/* ── where values come from: the shell beats .env beats the default ── */
export const Sources = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Drei Quellen für einen Platzhalter: Variable in der Shell, .env und Standardwert in der compose.yaml', 'Three sources for one placeholder: a variable in the shell, .env and a default in compose.yaml')}>
      <In i={0}><rect x={330} y={130} width={340} height={70} rx={12} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} /><text x={500} y={172} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{'image: mensa-api:${TAG:-1.0}'}</text></In>
      {[
        { x: 20, n: 1, title: e('1  Variable in der Shell', '1  Variable in the shell'), code: 'TAG=1.2 docker compose up', tone: 'ok' as const },
        { x: 360, n: 2, title: e('2  .env im Projekt', '2  .env in the project'), code: 'TAG=1.1', tone: undefined },
        { x: 700, n: 3, title: e('3  Standard in der compose.yaml', '3  Default in compose.yaml'), code: ':-1.0', tone: undefined },
      ].map(s => (
        <g key={s.n}>
          <Tag x={s.x} y={14} w={280} label={s.title} tone={s.tone} i={s.n} />
          <In i={s.n}><text x={s.x + 140} y={78} textAnchor="middle" fontSize={14} fill="var(--ink-2)" style={{ fontFamily: 'var(--mono)' }}>{s.code}</text></In>
          <Go d={`M${s.x + 140} 90 L${s.n === 1 ? 420 : s.n === 2 ? 500 : 580} 126`} i={s.n} kind={s.n === 1 ? 'ok' : 'mute'} />
        </g>
      ))}
      <Go d="M500 204 V246" i={4} kind="ok" />
      <Box x={410} y={250} w={180} h={64} svc="api" label="mensa-api:1.2" size={14} i={4} />
      <Tag x={640} y={258} w={320} label={e('Die Shell gewinnt', 'The shell wins')} sub={e('dann die .env, zuletzt der Standard', 'then the .env, the default last')} tone="ok" i={4} />
    </Svg>
  </div>
)

/* ── one base file, two environments: compose.yaml plus an override ── */
const Sheetlet = ({ x, y, title, lines, tone, i }: { x: number; y: number; title: string; lines: string[]; tone: string; i: number }) => (
  <In i={i}>
    <rect x={x} y={y} width={220} height={36 + lines.length * 22} rx={10} fill={tone} stroke="var(--keel)" strokeWidth={1.5} />
    <Txt x={x + 14} y={y + 24} size={14} w={700} fill="var(--ink)">{title}</Txt>
    {lines.map((l, k) => <Txt key={l} x={x + 14} y={y + 46 + k * 22} size={12.5}>{l}</Txt>)}
  </In>
)
export const TwoTrips = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Eine compose.yaml plus Override-Datei für den Laptop oder für den Server', 'One compose.yaml plus an override file for the laptop or for the server')}>
      <Sheetlet x={390} y={20} title="compose.yaml" lines={['frontend, api, db', e('Netze, Volumes', 'networks, volumes')]} tone="#fff3d6" i={0} />
      <Sheetlet x={60} y={150} title={e('+ Override Laptop', '+ override laptop')} lines={[e('Quellcode als Bind Mount', 'source code as a bind mount'), e('Debug-Port öffnen', 'open a debug port')]} tone="#e2f5ec" i={1} />
      <Sheetlet x={720} y={150} title={e('+ Override Server', '+ override server')} lines={[e('feste Versionen', 'fixed versions'), e('Neustart bei Absturz', 'restart on crash')]} tone="#dce9ff" i={2} />
      <Go d="M450 100 L280 146" i={1} /><Go d="M550 100 L720 146" i={2} />
      <Tag x={60} y={270} w={220} label="Laptop" sub="compose.override.yaml" tone="ok" i={1} />
      <Tag x={720} y={270} w={220} label="Server" sub="compose.prod.yaml" tone="blue" i={2} />
      <Tag x={330} y={180} w={340} label={e('Gleiche Teile stehen nur einmal da', 'Shared parts appear only once')} sub={e('die Override-Datei ergänzt oder überschreibt', 'the override file adds or overrides')} i={3} />
    </Svg>
  </div>
)

/* ── secrets instead of open passwords ── */
export const Envelope = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Links ein Passwort als Umgebungsvariable, das jeder lesen kann, rechts ein Secret nur für die db', 'Left a password as an environment variable anyone can read, right a secret only for the db')}>
      <Tag x={20} y={0} w={460} label={e('Umgebungsvariable: offen lesbar', 'Environment variable: readable by all')} sub="environment" tone="sand" />
      <Tag x={520} y={0} w={460} label={e('Secret: nur für die db', 'Secret: only for the db')} sub="secrets" tone="ok" i={2} />
      <Box x={60} y={110} w={170} h={80} svc="db" i={1} />
      <In i={1}><rect x={250} y={100} width={210} height={56} rx={8} fill="#fff3d6" stroke="#c9a24f" strokeWidth={2} /><text x={266} y={134} fontSize={13.5} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>PASSWORD=geheim</text></In>
      {[0, 1].map(k => <g key={k}><Person x={290 + k * 80} y={200} role="grey" i={1} />{k === 0 && <In i={1}><ellipse cx={330} cy={196} rx={14} ry={8} fill="#fff" stroke="var(--bad)" strokeWidth={2} /><circle cx={330} cy={196} r={3.5} fill="var(--bad)" /></In>}</g>)}
      <Tag x={60} y={270} w={400} label={e('Jeder mit Zugang sieht es', 'Anyone with access sees it')} sub="docker inspect · ps · Logs" tone="bad" i={1} />
      <Box x={560} y={110} w={170} h={80} svc="db" i={3} />
      <In i={3}><path d="M760 110 h180 v100 h-180 z M760 110 l90 56 l90 -56" fill="#fff" stroke="var(--keel)" strokeWidth={2} strokeLinejoin="round" /><circle cx={850} cy={170} r={14} fill="var(--bad)" stroke="#fff" strokeWidth={2} /></In>
      <Go d="M756 160 H736" i={3} />
      <Tag x={560} y={270} w={400} label={e('Nur die db kann es lesen', 'Only the db can read it')} sub={e('als Datei unter /run/secrets', 'as a file under /run/secrets')} tone="ok" i={3} />
    </Svg>
  </div>
)

/* ── containers only on demand: profiles ── */
export const OnDemand = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Ohne Profil starten drei Container, mit Profil debug zusätzlich adminer', 'Without a profile three containers start, with the profile debug adminer as well')}>
      {[0, 1].map(k => (
        <g key={k}>
          <Zone x={20 + k * 500} y={130} w={460} h={130} label={e('Dein Rechner', 'Your machine')} i={k * 2} />
          {(['frontend', 'api', 'db'] as Svc[]).map((s, j) => <Box key={s} x={120 + k * 500 + j * 88} y={172} w={82} h={50} svc={s} size={13} i={k * 2} />)}
          {k === 1 && <Box x={384 + 500} y={172} w={82} h={50} svc="other" label="adminer" size={13} i={3} />}
          {k === 0 && <Box x={384} y={172} w={82} h={50} svc="other" label="adminer" size={13} ghost i={1} />}
        </g>
      ))}
      <Tag x={20} y={20} w={460} label="docker compose up" sub={e('adminer startet nicht', 'adminer does not start')} tone="sky" i={0} />
      <Tag x={520} y={20} w={460} label="docker compose --profile debug up" sub={e('jetzt kommt adminer mit', 'now adminer comes along')} tone="ok" i={2} />
      <Tag x={790} y={270} w={190} label={e('Profil debug', 'profile debug')} tone="sand" i={3} />
      <Lead d="M925 270 V226" end={[925, 224]} i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Hilfscontainer wie ein Datenbank-Werkzeug stehen in der compose.yaml, starten aber nur, wenn ihr ihr Profil nennt.', 'Helper containers like a database tool are in compose.yaml, but only start when you name their profile.')} />
  </div>
)

/* ── compare desired and actual state: up only replaces what changed ── */
const cmp: [Svc, string, string, boolean][] = [['frontend', '1.0', '1.0', true], ['api', '1.1', '1.0', false], ['db', '18', '18', true]]
export const Compare = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Compose vergleicht compose.yaml und laufende Container: nur die api hat eine neue Version und wird ersetzt', 'Compose compares compose.yaml and running containers: only the api has a new version and is replaced')}>
      <Tag x={20} y={0} w={300} label={e('Soll: compose.yaml', 'desired: compose.yaml')} tone="sand" />
      <Tag x={350} y={0} w={300} label={e('Ist: läuft gerade', 'actual: running now')} tone="sky" i={1} />
      <Tag x={680} y={0} w={300} label={e('Ergebnis', 'Result')} i={2} />
      {cmp.map(([s, want, have, same], k) => (
        <g key={s}>
          <In i={0}><rect x={20} y={64 + k * 86} width={300} height={66} rx={12} fill="#fff3d6" stroke="#c9a24f" strokeWidth={1.5} /><text x={170} y={104 + k * 86} textAnchor="middle" fontSize={15} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{`${s}  ${want}`}</text></In>
          <Box x={410} y={68 + k * 86} w={180} h={58} svc={s} label={`${s} ${have}`} size={14} i={1} />
          <Go d={`M326 ${97 + k * 86} H404`} i={1} kind="mute" />
          <Go d={`M596 ${97 + k * 86} H674`} i={2} kind={same ? 'ok' : 'back'} />
          <Tag x={680} y={74 + k * 86} w={300} label={same ? e('gleich: bleibt stehen', 'same: stays') : e('anders: wird ersetzt', 'different: replaced')} tone={same ? 'ok' : 'blue'} i={2} />
        </g>
      ))}
    </Svg>
    <Take i={3} label={e('Merke', 'Remember')} text={e('up vergleicht Soll und Ist. Nur was sich geändert hat, wird neu erstellt. Was ein ersetzter Container in sich selbst hatte, ist dabei weg.', 'up compares desired and actual state. Only what has changed is recreated. Whatever a replaced container had inside itself is gone in the process.')} />
  </div>
)

/* ── when a container breaks down: restart rules ── */
export const Restart = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Ohne Regel bleibt die abgestürzte api aus, mit Neustart-Regel startet Docker sie neu', 'Without a rule the crashed api stays down, with a restart rule Docker starts it again')}>
      {[0, 1].map(k => (
        <g key={k}>
          <In i={k * 2}><rect x={20} y={20 + k * 150} width={960} height={130} rx={14} fill="#fff" stroke="var(--line)" strokeWidth={1.5} /></In>
          <Txt x={44} y={52 + k * 150} size={15} w={700} fill="var(--ink)">{k ? 'restart: unless-stopped' : e('ohne Regel', 'without a rule')}</Txt>
          <Box x={60} y={68 + k * 150} w={130} h={58} svc="api" i={k * 2} />
          <Go d={`M196 ${97 + k * 150} H276`} i={k * 2} kind="bad" />
          <In i={k * 2}><Txt x={236} y={86 + k * 150} size={13} w={700} fill="var(--bad)" anchor="middle">{e('Absturz', 'crash')}</Txt></In>
          <Box x={282} y={68 + k * 150} w={130} h={58} svc="api" ghost i={k * 2} />
          {k === 0 ? <><Mark x={460} y={97} bad i={1} r={14} /><Tag x={500} y={74} w={460} label={e('bleibt aus, bis jemand nachsieht', 'stays down until someone checks')} tone="bad" i={1} /></> : <>
            <Go d={`M418 ${97 + 150} H580`} i={3} kind="ok" />
            <Label x={499} y={237} size={12.5} weight={700} tone="ok" i={3}>{e('Docker startet neu', 'Docker restarts')}</Label>
            <Box x={586} y={218} w={130} h={58} svc="api" i={3} />
            <Mark x={716} y={218} ok i={3} r={12} />
            <Tag x={740} y={210} w={220} label={e('wieder da', 'back again')} sub={e('außer nach stop', 'except after stop')} tone="ok" i={3} />
          </>}
        </g>
      ))}
    </Svg>
  </div>
)

/* ── the logs: every container writes into them ── */
const logs: [Svc, string][] = [['db', 'database system is ready to accept connections'], ['api', 'Started MensaApplication in 3.1 seconds'], ['frontend', 'GET /speiseplan 200'], ['api', 'GET /api/gerichte 200'], ['api', 'ERROR Connection reset by db']]
export const Logbook = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Die Logs aller drei Container an einer Stelle, nach Farbe sortiert', 'The logs of all three containers in one place, coloured by service')}>
      <In i={0}><rect x={20} y={10} width={960} height={250} rx={14} fill="#fffdf4" stroke="var(--keel)" strokeWidth={2} /><Txt x={44} y={42} size={16} w={700} fill="var(--ink)">{e('Logs der Mensa-App', 'Logs of the Mensa-App')}</Txt><text x={956} y={42} textAnchor="end" fontSize={13} fill="var(--ink-3)" style={{ fontFamily: 'var(--mono)' }}>docker compose logs</text></In>
      {logs.map(([s, l], k) => (
        <In key={k} i={1 + k}>
          <rect x={44} y={60 + k * 38} width={100} height={28} rx={6} fill={`var(--svc-${s})`} /><Txt x={94} y={79 + k * 38} size={13} w={700} fill="#fff" anchor="middle">{s}</Txt>
          <text x={160} y={79 + k * 38} fontSize={14} fill={l.startsWith('ERROR') ? 'var(--bad)' : 'var(--ink)'} style={{ fontFamily: 'var(--mono)' }}>{l}</text>
        </In>
      ))}
      <Tag x={140} y={280} w={720} label={e('Jeder Container schreibt Logs, ihr lest alles an einer Stelle', 'Every container writes logs, you read everything in one place')} sub={e('erst in die Logs schauen, dann raten', 'look at the logs first, then guess')} tone="blue" i={6} />
    </Svg>
  </div>
)

/* ── changes in the container at once: compose watch ── */
export const LiveSync = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Eine geänderte Datei wandert sofort in den laufenden Container, eine geänderte Abhängigkeit führt zu einem neuen Image', 'A changed file moves into the running container at once, a changed dependency leads to a new image')}>
      <In i={0}><rect x={20} y={40} width={260} height={250} rx={16} fill="#fff" stroke="var(--keel)" strokeWidth={2} /><Txt x={40} y={70} size={15} w={700} fill="var(--ink)">{e('Dein Laptop', 'Your laptop')}</Txt></In>
      {[['src/App.vue', 110, 'var(--ok)'], ['package.json', 200, 'var(--c-hyper)']].map(([f, y, c]) => (
        <In key={f as string} i={1}><rect x={44} y={y as number} width={212} height={50} rx={10} fill="var(--paper)" stroke={c as string} strokeWidth={2} /><text x={150} y={(y as number) + 31} textAnchor="middle" fontSize={14} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{f as string}</text></In>
      ))}
      <B x={430} y={118} w={130} h={56} t="engine" label="compose watch" size={14} mono i={1} />
      <Go d="M262 135 H426" i={2} kind="ok" /><Go d="M564 160 H690" i={2} kind="ok" />
      <In i={2}><Txt x={346} y={124} size={13} w={700} fill="var(--ok)" anchor="middle">{e('gespeichert', 'saved')}</Txt><Txt x={626} y={150} size={13} w={700} fill="var(--ok)" anchor="middle">{e('sofort kopiert', 'copied at once')}</Txt></In>
      <Box x={700} y={130} w={260} h={80} svc="frontend" label={e('frontend läuft weiter', 'frontend keeps running')} size={14} i={2} />
      <Go d="M262 225 H690" i={3} kind="back" />
      <In i={3}><Txt x={476} y={250} size={13} w={700} fill="var(--c-hyper)" anchor="middle">{e('neue Abhängigkeit: Image neu bauen', 'new dependency: rebuild the image')}</Txt></In>
      <Plan x={760} y={236} w={84} h={56} i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Beim Entwickeln kopiert compose watch geänderte Dateien sofort in den Container. Nur wenn sich Abhängigkeiten ändern, baut es das Image neu.', 'While developing, compose watch copies changed files into the container at once. Only when dependencies change does it rebuild the image.')} />
  </div>
)
