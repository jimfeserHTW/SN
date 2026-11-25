import { Svg, Take, Box as B, Zone, Arrow, Label, Wire } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Mark, In, Txt, Go, type Svc } from '../../components/harbor/harbor.tsx'

// Overview slides of the first sub-chapter: own IPs, ports, DNS, separate networks and the way back to the host. Technical terms only.
const host = (y: number, h: number, i = 0) => <Zone x={20} y={y} w={960} h={h} label={e('Dein Rechner', 'Your machine')} sub="Docker" i={i} />
const plate = (x: number, y: number, text: string, i: number) => <In i={i}><rect x={x - 54} y={y} width={108} height={24} rx={6} fill="#fff" stroke="var(--blue)" strokeWidth={1.5} /><text x={x} y={y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--blue-deep)" style={{ fontFamily: 'var(--mono)' }}>{text}</text></In>

/* ── every container has its own IP ── */
export const OwnLine = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Jeder Container hat eine eigene IP im Bridge-Netz, der Rechner eine andere', 'Every container has its own IP in the bridge network, the machine a different one')}>
      {host(70, 270)}
      {plate(115, 110, '192.168.1.20', 4)}
      {(['frontend', 'api', 'db'] as const).map((s, k) => (
        <g key={s}>
          {plate(305 + k * 220, 146, `172.18.0.${2 + k}`, 1 + k)}
          <Box x={230 + k * 220} y={180} w={150} h={60} svc={s} i={1 + k} />
          <Wire d={`M${305 + k * 220} 242 V290`} i={4} />
        </g>
      ))}
      <B x={200} y={290} w={640} h={36} t="libs" label={e('Bridge-Netz · 172.18.0.0/16', 'bridge network · 172.18.0.0/16')} size={14} i={4} />
      <Tag x={230} y={0} w={590} label={e('Jeder Container: eigene IP', 'Every container: its own IP')} sub={e('sein eigener Netzwerk-Namespace, getrennt vom Rest', 'its own network namespace, separate from the rest')} tone="blue" i={1} />
      <Tag x={20} y={0} w={190} label={e('Der Rechner', 'The machine')} sub={e('hat eine andere IP', 'has a different IP')} tone="sky" i={4} />
      <Lead d="M115 46 V106" end={[115, 108]} i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Anders als bei java -jar hat ein Container sein eigenes Netz mit eigener IP. Von außen kommt man nur über einen veröffentlichten Port hinein.', 'Unlike with java -jar, a container has its own network with its own IP. From outside you only get in through a published port.')} />
  </div>
)

/* ── host ports: the outside port is yours to choose, but only once ── */
export const Numbers = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Zwei Host-Ports 8080 und 8081, ein dritter Container will 8080 noch einmal', 'Two host ports 8080 and 8081, a third container wants 8080 again')}>
      {host(160, 170)}
      <Box x={290} y={220} w={140} h={60} svc="frontend" i={1} /><Box x={470} y={220} w={140} h={60} svc="api" i={2} /><Box x={650} y={220} w={140} h={60} svc="other" label={e('zweites frontend', 'second frontend')} size={13} i={3} />
      {[[8080, 360, 1], [8081, 540, 2]].map(([n, x, i]) => (
        <g key={n}>
          <In i={i}><rect x={x - 40} y={146} width={80} height={28} rx={7} fill="var(--ok)" /><text x={x} y={165} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff" style={{ fontFamily: 'var(--mono)' }}>{n}</text></In>
          <In i={i}><path d={`M${x} 174 V216`} stroke="var(--ok)" strokeWidth={2.5} /></In>
        </g>
      ))}
      <In i={3}><rect x={680} y={146} width={80} height={28} rx={7} fill="var(--bad)" /><text x={720} y={165} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff" style={{ fontFamily: 'var(--mono)' }}>8080</text></In>
      <Mark x={772} y={146} bad i={3} r={12} />
      <Tag x={20} y={0} w={300} label={e('8080 → frontend, drinnen 80', '8080 → frontend, inside 80')} sub='ports: ["8080:80"]' tone="ok" i={1} />
      <Tag x={340} y={0} w={300} label={e('8081 → api, drinnen 8080', '8081 → api, inside 8080')} sub='ports: ["8081:8080"]' tone="ok" i={2} />
      <Tag x={660} y={0} w={300} label={e('8080 ist schon vergeben', '8080 is already taken')} sub="port is already allocated" tone="bad" i={3} />
      <Lead d="M170 46 V100 H360 V142" end={[360, 144]} i={1} /><Lead d="M490 46 V100 H540 V142" end={[540, 144]} i={2} /><Lead d="M810 46 V100 H720 V142" end={[720, 144]} i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Den Port außen sucht ihr aus, den drinnen bestimmt die App. Jeden Port außen gibt es pro Rechner nur einmal.', 'You choose the outside port, the app decides the inside one. Each outside port exists only once per machine.')} />
  </div>
)

/* ── Docker's built-in DNS: names instead of IPs ── */
export const PhoneBook = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label={e('Die api fragt den DNS von Docker nach db, bekommt die IP und verbindet sich direkt', 'The api asks Docker’s DNS for db, gets the IP and connects directly')}>
      {host(80, 270)}
      <In i={1}><rect x={50} y={130} width={250} height={130} rx={12} fill="#fff" stroke="var(--blue)" strokeWidth={2} /><Txt x={175} y={156} size={14} w={700} fill="var(--ink)" anchor="middle">{e('DNS von Docker', 'Docker’s DNS')}</Txt>
        {[['frontend', '172.18.0.2'], ['api', '172.18.0.3'], ['db', '172.18.0.4']].map(([n, ip], k) => <g key={n}><text x={70} y={184 + k * 24} fontSize={13} fill={n === 'db' ? 'var(--ok)' : 'var(--ink-2)'} fontWeight={n === 'db' ? 700 : 400} style={{ fontFamily: 'var(--mono)' }}>{n}</text><text x={170} y={184 + k * 24} fontSize={13} fill={n === 'db' ? 'var(--ok)' : 'var(--ink-2)'} fontWeight={n === 'db' ? 700 : 400} style={{ fontFamily: 'var(--mono)' }}>{ip}</text></g>)}</In>
      <Box x={400} y={180} w={150} h={60} svc="api" i={0} /><Box x={770} y={180} w={150} h={60} svc="db" i={3} />
      <Go d="M396 198 H306" i={1} />
      <Go d="M306 224 H396" i={2} kind="back" />
      <Go d="M554 210 H766" i={3} kind="ok" />
      <Tag x={360} y={0} w={290} label={e('1  „Wer ist db?“', '1  “Who is db?”')} sub={e('die api fragt nach dem Namen', 'the api asks for the name')} i={1} />
      <Tag x={680} y={0} w={290} label={e('2  „172.18.0.4“  3  verbinden', '2  “172.18.0.4”  3  connect')} sub={e('danach direkt verbunden', 'then connected directly')} tone="ok" i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Niemand merkt sich IPs. Docker hat einen eingebauten DNS, also verbindet sich die api einfach mit „db“.', 'Nobody remembers IPs. Docker has a built-in DNS, so the api simply connects to “db”.')} />
  </div>
)

/* ── separate networks: the frontend cannot see the database ── */
export const Zones = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Zwei Netze: web verbindet frontend und api, backend verbindet api und db', 'Two networks: web connects frontend and api, backend connects api and db')}>
      {host(100, 230)}
      <Box x={170} y={230} w={150} h={60} svc="frontend" i={0} /><Box x={425} y={230} w={150} h={60} svc="api" i={0} /><Box x={680} y={230} w={150} h={60} svc="db" i={0} />
      <In i={1}><path d="M245 226 V190 H470 V226" stroke="var(--svc-frontend)" strokeWidth={4} fill="none" /><rect x={302} y={176} width={110} height={26} rx={7} fill="var(--svc-frontend)" /><Txt x={357} y={194} size={13} w={700} fill="#fff" anchor="middle">{e('Netz web', 'network web')}</Txt></In>
      <In i={2}><path d="M530 226 V150 H755 V226" stroke="var(--svc-db)" strokeWidth={4} fill="none" /><rect x={586} y={136} width={120} height={26} rx={7} fill="var(--svc-db)" /><Txt x={646} y={154} size={13} w={700} fill="#fff" anchor="middle">{e('Netz backend', 'network backend')}</Txt></In>
      <Tag x={40} y={0} w={290} label={e('frontend: nur im Netz web', 'frontend: only in web')} sub={e('erreicht die api, nicht die db', 'reaches the api, not the db')} i={1} />
      <Tag x={355} y={0} w={290} label={e('api: in beiden Netzen', 'api: in both networks')} sub={e('vermittelt zwischen vorne und hinten', 'connects front and back')} tone="blue" i={2} />
      <Tag x={670} y={0} w={290} label={e('db: nur im Netz backend', 'db: only in backend')} sub={e('für das frontend unsichtbar', 'invisible to the frontend')} tone="ok" i={2} />
    </Svg>
  </div>
)

/* ── from the container to your own machine ── */
export const HostCall = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Die api erreicht über host.docker.internal ein Programm, das direkt auf dem Rechner läuft', 'Via host.docker.internal the api reaches a program running directly on the machine')}>
      <Zone x={20} y={80} w={960} h={240} label={e('Dein Rechner', 'Your machine')} />
      <In i={0}><Icon name="laptop" x={70} y={124} s={50} /></In>
      <B x={60} y={190} w={240} h={64} t="app" label="Postgres" sub={e('direkt installiert · :5432', 'installed directly · :5432')} i={0} />
      <Zone x={500} y={130} w={460} h={170} t="host" label="Docker" i={1} />
      <Box x={660} y={190} w={150} h={60} svc="api" i={1} />
      <Arrow d="M656 222 H304" kind="back" i={2} />
      <Label x={480} y={210} size={14} weight={700} mono tone="blue" i={2}>host.docker.internal</Label>
      <Tag x={20} y={0} w={330} label={e('Auf deinem Rechner läuft etwas', 'Something runs on your machine')} sub={e('z. B. Postgres, nicht im Container', 'e.g. Postgres, not in a container')} i={0} />
      <Tag x={380} y={0} w={290} label={e('Der Container ruft den Rechner', 'The container calls the machine')} sub={e('über einen festen Namen', 'via a fixed name')} tone="blue" i={2} />
      <Tag x={700} y={0} w={280} label={e('Unter Linux: freischalten', 'On Linux: switch it on')} sub="host.docker.internal:host-gateway" tone="sand" i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('localhost bleibt im Container. Wer den eigenen Rechner erreichen will, nutzt host.docker.internal. Unter Linux muss das Programm dafür auch auf der Docker-Bridge lauschen, nicht nur auf localhost: bei Postgres listen_addresses und ein Eintrag in pg_hba.conf.', 'localhost stays inside the container. To reach your own machine, use host.docker.internal. On Linux the program must then also listen on the Docker bridge, not only on localhost: for Postgres listen_addresses and an entry in pg_hba.conf.')} />
  </div>
)
