import { at, css } from '../../components/Stack.tsx'
import { Svg, Box, Arrow, Label, Wire, Ctr, Num, Tick, Zone, Take } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { Code, type Line } from '../../components/Code.tsx'
import { t } from '../../i18n.ts'
import './diagrams.css'

// Detailed diagrams for the deeper sub-chapters of this topic. The overview sub-chapter draws with views.tsx.


/* ── 5 · ports: the outside view. The host machine opens a port and forwards it to a container port. ── */
const Anat = ({ parts, d }: { parts: [string, string][]; d: number }) => (
  <div className="anatomy c1-center" style={css({ '--d': d })}>
    <div className="row">{parts.map(([c, l], k) => <div className="part" key={k} style={at(k)}><code>{c}</code><i /><span>{t(l)}</span></div>)}</div>
  </div>
)

export const Ports = () => (
  <div className="c1-ports">
    <Svg w={1000} h={440} label="Der Host-Rechner öffnet Port 8080 und leitet ihn an Port 8080 im Container weiter">
      <g className="sb" data-t="host" style={at(0)}><rect x={150} y={10} width={840} height={420} rx={22} /></g>
      <Label x={172} y={40} anchor="start" size={16} weight={700}>Host-Rechner · IP 192.168.1.20</Label>
      <Label x={450} y={68} size={14} weight={700} tone="blue">Sicht von außen</Label>
      <Label x={788} y={68} size={14} weight={700} tone="blue">Sicht im Container</Label>

      <g className="sb" data-t="kernel" style={at(1)}>
        <rect x={400} y={84} width={100} height={330} rx={14} />
        <text x={450} y={108} textAnchor="middle" fontSize={13} fontWeight={700}>{t('Ports des')}</text>
        <text x={450} y={124} textAnchor="middle" fontSize={13} fontWeight={700}>{t('Host-Rechners')}</text>
      </g>
      <Box i={2} x={410} y={146} w={80} h={50} t="engine" label="8080" sub="offen" size={16} />
      <Box i={2} x={410} y={306} w={80} h={50} t="gone" label="5432" sub="zu" size={16} />

      <g className="sl" style={at(3)}><Icon name="browser" x={190} y={110} s={70} /></g>
      <Label i={3} x={225} y={200} weight={700}>Browser</Label>
      <Label i={3} x={225} y={218} size={13} tone="muted">auf dem Host</Label>
      <Arrow i={3} d="M266 150 H406" label="localhost:8080" lx={336} ly={138} />
      <g className="sl" style={at(4)}><Icon name="laptop" x={16} y={250} s={64} /></g>
      <Label i={4} x={6} y={336} anchor="start" weight={700}>anderer Rechner</Label>
      <Label i={4} x={6} y={354} anchor="start" size={13} tone="muted">192.168.1.20:8080</Label>
      <Arrow i={4} d="M84 272 C 220 272, 320 196, 406 180" />
      <Arrow i={8} kind="bad" d="M84 300 C 240 310, 320 331, 406 331" />
      <Label i={8} x={290} y={360} size={14} weight={700} tone="bad">192.168.1.20:5432 ✗</Label>
      <Label i={8} x={290} y={378} size={13} tone="bad">kein ports-Eintrag: keine Tür</Label>

      <g className="sb" data-t="gone" style={at(5)}><rect x={598} y={84} width={380} height={330} rx={18} /></g>
      <Label i={5} x={788} y={404} size={13} tone="muted">internes Netz: von außen unsichtbar</Label>
      <Ctr i={5} x={614} y={100} w={348} h={124} name="Container api" />
      <Box i={5} x={628} y={140} w={110} h={66} t="libs" label=":8080" sub="Container-Port" />
      <Box i={5} x={750} y={140} w={196} h={66} label="Spring Boot" sub="lauscht auf Port 8080" />
      <Ctr i={7} x={614} y={250} w={348} h={124} name="Container db" />
      <Box i={7} x={628} y={290} w={110} h={66} t="libs" label=":5432" sub="Container-Port" />
      <Box i={7} x={750} y={290} w={196} h={66} label="Postgres" sub="lauscht auf Port 5432" />
      <Arrow i={6} d="M494 172 H624" />
      <Label i={6} x={546} y={160} size={13} weight={600}>leitet weiter</Label>
    </Svg>
    <Anat d={10} parts={[['8080', 'Port am Host-Rechner'], [':', 'leitet weiter an'], ['80', 'Port im Container']]} />
  </div>
)

/* ── 6 · networks: the inside view. Containers reach each other by service name and container port. ── */
const fileNet: Line[] = [
  'services:',
  '  frontend:',
  '    image: nginx:1.27',
  '    networks: [web]',
  '  api:',
  '    image: mensa-api:1.0',
  '    environment:',
  { t: '      DB_HOST: db', n: 1 },
  '    networks: [web, backend]',
  '  db:',
  '    image: postgres:18',
  { t: '    # kein ports: nur intern erreichbar', k: 'note' },
  '    networks: [backend]',
  'networks:',
  '  web: { driver: bridge }',
  '  backend: { driver: bridge }',
]

/** A network as a cable everyone plugs into, its name written on it. */
const Bus = ({ x, w, y, name, tx }: { x: number; w: number; y: number; name: string; tx: number }) => (
  <g className="sb" data-t="kchip" style={at(1)}>
    <rect x={x} y={y} width={w} height={24} rx={12} />
    <text x={tx} y={y + 17} fontSize={13} fontWeight={700}>{t(name)}</text>
  </g>
)

const dns: [string, string, boolean][] = [['frontend', '172.18.0.2', false], ['api', '172.18.0.3 · 172.19.0.2', false], ['db', '172.19.0.3', true]]

export const Networks = () => (
  <div className="c1-net">
    <div className="c1-col">
      <Code kind="file" title="compose.yaml" lines={fileNet} />
      <p className="cause" style={at(3)}><b>{t('Name = Adresse')}</b> {t('Ohne')} <code>networks:</code> {t('hängen alle an einem Netz')} <code>mensa_default</code>.</p>
    </div>
    <div className="c1-col">
      <Svg w={600} h={500} label="Die Engine führt eine Namensliste: api fragt nach db, bekommt die IP und verbindet sich direkt mit Port 5432">
        <g className="sb" data-t="host" style={at(0)}><rect x={0} y={0} width={600} height={500} rx={20} /></g>
        <Label x={20} y={28} anchor="start" size={15} weight={700}>Host-Rechner · Sicht der Container</Label>

        <Box i={1} x={30} y={46} w={150} h={64} t="container" label="frontend" sub="172.18.0.2" />
        <Box i={1} x={225} y={46} w={150} h={64} t="container" label="api" sub="fragt nach „db“" />
        <Box i={1} x={420} y={46} w={150} h={64} t="container" label="db" sub="lauscht auf :5432" />
        <Bus x={20} w={280} y={146} name="Netz web" tx={36} />
        <Bus x={336} w={244} y={190} name="Netz backend" tx={380} />
        <Wire i={1} d="M105 110 V146" /><Wire i={1} d="M262 110 V146" /><Wire i={1} d="M350 110 V190" /><Wire i={1} d="M495 110 V190" />

        <g className="sb" data-t="engine" style={at(2)}>
          <rect x={20} y={296} width={560} height={186} rx={16} />
          <text x={40} y={326} fontSize={16} fontWeight={700}>{t('Docker Engine · eingebauter DNS')}</text>
          <text x={40} y={346} fontSize={13} className="sb-sub">{t('jeder Container fragt hier: „Service-Name → IP“')}</text>
        </g>
        {dns.map(([n, ip, on], k) => <Box key={n} i={2} x={40} y={362 + k * 36} w={520} h={30} t={on ? 'ok' : 'app'} label={`${n}  →  ${ip}`} size={14} />)}

        <Arrow i={3} kind="back" d="M318 112 V292" both />
        <Num i={3} n={1} x={296} y={232} />
        <Label i={3} x={280} y={237} anchor="end" size={13} weight={600}>fragt: wer ist „db“?</Label>
        <Num i={4} n={2} x={296} y={266} />
        <Label i={4} x={280} y={271} anchor="end" size={13} weight={600}>Antwort: 172.19.0.3</Label>
        <Arrow i={5} kind="ok" d="M375 90 H416" />
        <Num i={5} n={3} x={397} y={62} />
        <Num i={5} n={3} x={340} y={246} />
        <Label i={5} x={358} y={251} anchor="start" size={13} weight={700} tone="ok">verbindet direkt 172.19.0.3:5432</Label>
      </Svg>
      <p className="cause" style={at(6)}><b>{t('Nicht erreichbar')}</b><code>localhost:5432</code> {t('in api zeigt auf api selbst. frontend kennt db nicht: kein gemeinsames Netz.')}</p>
    </div>
  </div>
)

/* ═══ Netzwerk ═══ */
/* Three network modes side by side: same container, different cabling. */
export const NetModes = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label="Netzwerk-Modi bridge, host und none im Vergleich">
      {([['bridge', 'Standard: eigenes Netz', 0], ['host', 'kein eigenes Netz', 345], ['none', 'gar kein Netz', 690]] as const).map(([n, s, x], k) => (
        <g key={n}>
          <Zone i={k * 3} x={x} y={0} w={310} h={400} label={`--network ${n}`} />
          <Label i={k * 3} x={x + 16} y={44} anchor="start" size={13} tone="muted">{s}</Label>
          <Box i={k * 3} x={x + 20} y={340} w={270} h={44} t="hw" label="eth0 des Hosts · 192.168.1.20" size={13} />
        </g>
      ))}
      <Ctr i={1} x={20} y={62} w={270} h={110} name="Container" />
      <Box i={1} x={36} y={96} w={238} h={60} t="libs" label="eth0" sub="172.17.0.2 · eigene Ports" size={15} />
      <Box i={2} x={20} y={222} w={270} h={60} t="kernel" label="Bridge docker0 + NAT" sub="übersetzt die Adressen" size={15} />
      <Arrow i={2} both d="M155 174 V218" /><Arrow i={2} both d="M155 284 V336" />

      <g className="sb" data-t="gone" style={at(4)}><rect x={365} y={62} width={270} height={110} rx={14} /><text x={379} y={84} fontSize={14} fontWeight={700}>{t('Container · Netz offen')}</text></g>
      <Box i={4} x={381} y={96} w={238} h={60} t="app" label="nginx" sub="lauscht direkt auf :80" size={15} />
      <Arrow i={5} kind="ok" both d="M500 158 V336" label="ohne Umweg," lx={512} ly={240} anchor="start" />
      <Label i={5} x={512} y={258} anchor="start" weight={600}>kein -p nötig</Label>

      <Ctr i={7} x={710} y={62} w={270} h={110} name="Container" />
      <Box i={7} x={726} y={96} w={238} h={60} t="libs" label="lo" sub="nur 127.0.0.1" size={15} />
      <Wire i={8} k="bad" d="M845 174 V336" /><Tick i={8} bad x={845} y={255} />
    </Svg>
    <Take i={9} label="Standard" text="Ohne Angabe nutzt ein Container `bridge`: Er hat ein eigenes Netz und ist von außen nur über `-p` erreichbar." />
  </div>
)

/* ═══ Netze ═══ */
/* Four ways to publish a port: one door from the network above, one from this machine below. */
const doors: { key: string; k: string; s: string; eth: boolean; lo: boolean; net: boolean }[] = [
  { key: 'ports:', k: '"8080:8080"', s: 'für alle offen', eth: true, lo: true, net: true },
  { key: 'ports:', k: '"127.0.0.1:8081:8080"', s: 'nur von diesem Rechner', eth: false, lo: true, net: true },
  { key: 'expose:', k: '["8080"]', s: 'kein Port am Host', eth: false, lo: false, net: true },
  { key: 'network_mode:', k: 'host', s: 'direkt im Netz des Hosts', eth: true, lo: true, net: false },
]

export const Doors = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label="Vier Arten, einen Port zu veröffentlichen, und wer jeweils durchkommt">
      <g className="sl" style={at(0)}><Icon name="laptop" x={14} y={28} s={66} /></g>
      <Label x={47} y={112} weight={700} size={13}>anderer</Label><Label x={47} y={130} weight={700} size={13}>Rechner</Label>
      <Zone x={110} y={0} w={890} h={410} label="Host-Rechner" />
      <Box i={1} x={130} y={36} w={850} h={46} t="hw" label="eth0 · 192.168.1.20 · Zugang aus dem Netz" size={15} />
      <Arrow i={1} d="M84 59 H126" />
      <Box i={2} x={130} y={346} w={850} h={46} t="kchip" label="lo · 127.0.0.1 · Zugang nur von diesem Rechner" size={15} />
      {doors.map((d, k) => {
        const x = 130 + k * 215, c = x + 102, i = 3 + k
        return (
          <g key={d.k}>
            <g className="sb" data-t="container" style={at(i)}><rect x={x} y={150} width={205} height={130} rx={14} /></g>
            <Label i={i} x={c} y={172} size={12} tone="muted" mono>{d.key}</Label>
            <Label i={i} x={c} y={192} size={13} weight={700} mono>{d.k}</Label>
            <Label i={i} x={c} y={216} size={13} tone="muted">{d.s}</Label>
            <Tick i={i} ok={d.net} bad={!d.net} x={x + 24} y={254} />
            <Label i={i} x={x + 42} y={259} anchor="start" size={13} weight={600}>{d.net ? 'andere Container' : 'kein Container-Netz'}</Label>
            {d.eth && <Arrow i={i} kind="ok" d={`M${c} 84 V146`} />}
            <Tick i={i} ok={d.eth} bad={!d.eth} x={c} y={114} />
            {d.lo && <Arrow i={i} kind="ok" d={`M${c} 344 V284`} />}
            <Tick i={i} ok={d.lo} bad={!d.lo} x={c} y={314} />
          </g>
        )
      })}
    </Svg>
    <Take i={7} label="Achtung" text="`ports` ohne IP ist aus dem ganzen Netz erreichbar. Docker setzt eigene Firewall-Regeln, die Werkzeuge wie `ufw` nicht sehen." />
  </div>
)

/* Bridge network: the actual cabling inside the host. */
export const NetBridge = () => (
  <div className="dg-col">
    <Svg w={1000} h={450} label="Container-Netzwerk: eth0 im Container, veth-Paar, Bridge docker0, NAT, eth0 des Hosts">
      <Zone x={0} y={0} w={850} h={450} label="Host-Rechner" />
      {([['frontend', 56, '172.17.0.2'], ['db', 226, '172.17.0.3']] as const).map(([n, y, ip], k) => (
        <g key={n}>
          <Ctr i={1} x={20} y={y} w={200} h={130} name={`Container ${n}`} />
          <Box i={1} x={36} y={y + 40} w={168} h={70} t="libs" label="eth0" sub={ip} size={16} />
          <Box i={2} x={276} y={y + 55} w={90} h={40} t="kchip" label={`veth${k + 1}`} size={14} />
          <Wire i={2} k="go" d={`M206 ${y + 75} H274`} />
          <Wire i={3} k="go" d={`M368 ${y + 75} H424`} />
        </g>
      ))}
      <Box i={3} x={426} y={100} w={110} h={232} t="kernel" label="docker0" sub="172.17.0.1" size={16} />
      <Box i={4} x={600} y={186} w={100} h={60} t="engine" label="NAT" sub="iptables" size={16} />
      <Box i={5} x={740} y={186} w={96} h={60} t="hw" label="eth0" sub="Host" size={16} />
      <Box i={6} x={905} y={186} w={95} h={60} t="reg" label="Internet" size={15} />
      <Arrow i={4} d="M538 216 H596" n={2} nx={567} ny={196} />
      <Arrow i={5} d="M702 216 H736" />
      <Arrow i={6} d="M838 216 H901" n={3} nx={870} ny={196} />
      <Num i={3} n={1} x={245} y={131} />
      <Label i={3} x={321} y={100} size={13} weight={600}>Paket nach außen</Label>
      <Arrow i={7} kind="ok" both d="M400 135 V297" />
      <Label i={7} x={392} y={208} anchor="end" size={13} weight={700} tone="ok">frontend ↔ db</Label>
      <Label i={7} x={392} y={226} anchor="end" size={13} tone="ok">über die Bridge</Label>
      <Label i={8} x={425} y={398} size={14} weight={600}>Ein veth-Paar ist ein virtuelles Kabel: ein Ende im Container, das andere an der Bridge.</Label>
      <Label i={8} x={425} y={420} size={13} tone="muted">Ausgehend tauscht NAT die Container-Adresse gegen die Adresse des Hosts.</Label>
    </Svg>
  </div>
)

/* A port mapping, following one packet and what changes in its header. */
const Pkt = ({ x, y, w, from, to, hot, i }: { x: number; y: number; w: number; from: string; to: string; hot: 'from' | 'to' | null; i: number }) => (
  <g>
    <Zone i={i} x={x} y={y} w={w} h={62} t="app" />
    <Label i={i} x={x + 12} y={y + 25} anchor="start" size={13} mono weight={hot === 'from' ? 700 : 500} tone={hot === 'from' ? 'blue' : undefined}>{t('von {{a}}', { a: from })}</Label>
    <Label i={i} x={x + 12} y={y + 47} anchor="start" size={13} mono weight={hot === 'to' ? 700 : 500} tone={hot === 'to' ? 'blue' : undefined}>{t('an  {{a}}', { a: to })}</Label>
  </g>
)

export const PortPath = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label="Ein Paket auf dem Weg durch -p 8080:80, hin und zurück">
      <Zone x={180} y={0} w={820} h={410} label="Host-Rechner · 192.168.1.20" />
      <Label x={20} y={50} anchor="start" size={14} weight={700} tone="blue">Hinweg</Label>
      <Label x={20} y={360} anchor="start" size={14} weight={700} tone="blue">Rückweg</Label>
      <g className="sl" style={at(0)}><Icon name="laptop" x={40} y={160} s={70} /></g>
      <Label x={75} y={250} weight={700}>Client</Label><Label x={75} y={268} size={13} tone="muted">203.0.113.9</Label>
      <Box i={1} x={220} y={170} w={120} h={70} t="hw" label="eth0" sub=":8080" size={16} />
      <Box i={2} x={420} y={170} w={150} h={70} t="engine" label="NAT-Regel" sub="DNAT, merkt sich alles" size={15} />
      <Box i={4} x={640} y={170} w={110} h={70} t="kernel" label="docker0" sub="Bridge" size={15} />
      <Ctr i={4} x={810} y={150} w={170} h={110} name="Container frontend" />
      <Box i={4} x={826} y={184} w={138} h={60} t="libs" label="nginx" sub="172.17.0.2:80" size={15} />
      <Arrow i={1} d="M116 190 H216" /><Arrow i={2} d="M342 190 H416" /><Arrow i={3} d="M572 190 H636" /><Arrow i={4} d="M752 190 H822" />
      <Arrow i={6} kind="back" d="M822 224 H754" /><Arrow i={6} kind="back" d="M636 224 H574" /><Arrow i={7} kind="back" d="M416 224 H344" /><Arrow i={7} kind="back" d="M216 224 H116" />
      <Pkt i={1} x={200} y={60} w={290} from="203.0.113.9:51000" to="192.168.1.20:8080" hot={null} />
      <Pkt i={3} x={560} y={60} w={290} from="203.0.113.9:51000" to="172.17.0.2:80" hot="to" />
      <Num i={3} n={1} x={525} y={91} />
      <Pkt i={6} x={560} y={300} w={290} from="172.17.0.2:80" to="203.0.113.9:51000" hot={null} />
      <Pkt i={7} x={200} y={300} w={290} from="192.168.1.20:8080" to="203.0.113.9:51000" hot="from" />
      <Num i={7} n={2} x={525} y={331} />
      <Wire i={3} d="M495 124 V166" /><Wire i={7} d="M495 244 V298" />
    </Svg>
    <Take i={8} label="Kern" text="`-p 8080:80` startet keinen Weiterleiter im Container, sondern legt eine Regel im Kernel an: 1 tauscht das Ziel, 2 tauscht die Antwort zurück." />
  </div>
)


/* ═══ Netz und Skalierung ═══ */
/* What Compose networks really are: one bridge each, a DNS in the engine, a rule between them. */
export const NetKernel = () => (
  <div className="dg-col">
    <Svg w={1000} h={470} label="Compose-Netze im Host: je Netz eine Bridge, eingebauter DNS, Trennung und Weg nach außen">
      <Zone x={0} y={0} w={1000} h={470} label="Host-Rechner" />
      <Box i={1} x={60} y={40} w={200} h={72} t="container" label="frontend" sub="ein Netz" />
      <Box i={1} x={340} y={40} w={200} h={72} t="container" label="api" sub="zwei Netze" />
      <Box i={1} x={640} y={40} w={200} h={72} t="container" label="db" sub="ein Netz" />
      <g className="sb" data-t="kchip" style={at(2)}><rect x={20} y={166} width={390} height={28} rx={14} /><text x={36} y={185} fontSize={13} fontWeight={700}>Bridge web · 172.18.0.0/16</text></g>
      <g className="sb" data-t="kchip" style={at(2)}><rect x={490} y={166} width={390} height={28} rx={14} /><text x={560} y={185} fontSize={13} fontWeight={700}>Bridge backend · 172.19.0.0/16</text></g>
      <Wire i={2} d="M160 114 V164" /><Wire i={2} d="M375 114 V164" /><Wire i={2} d="M515 114 V164" /><Wire i={2} d="M740 114 V164" />
      <Tick i={3} bad x={428} y={180} /><Label i={3} x={428} y={156} size={12} weight={700} tone="bad">getrennt</Label>
      <Arrow i={4} d="M100 196 V226" />
      <Box i={4} x={40} y={230} w={120} h={46} t="engine" label="NAT" size={15} />
      <Arrow i={4} d="M162 253 H196" />
      <Box i={4} x={200} y={230} w={90} h={46} t="hw" label="eth0" size={15} />
      <Arrow i={4} d="M292 253 H326" />
      <Box i={4} x={330} y={230} w={100} h={46} t="reg" label="Internet" size={14} />
      <Tick i={5} bad x={640} y={232} /><Label i={5} x={658} y={229} anchor="start" size={13} weight={700} tone="bad">internal: true</Label><Label i={5} x={658} y={247} anchor="start" size={13} tone="bad">kein Weg nach außen</Label>
      <Zone i={6} x={20} y={300} w={960} h={154} t="engine" label="Docker Engine · eingebauter DNS unter 127.0.0.11" />
      {([['frontend', '172.18.0.2', 'app'], ['api', '172.18.0.3 · 172.19.0.2', 'app'], ['db', '172.19.0.3', 'ok']] as const).map(([n, ip, t], k) => <Box key={n} i={6} x={500} y={332 + k * 38} w={460} h={32} t={t} label={`${n}  →  ${ip}`} size={14} />)}
      <Box i={7} x={40} y={342} w={420} h={92} t="app" label="Antwort passt zum Netz" sub="api bekommt für db die backend-Adresse" size={14} />
      <Arrow i={7} kind="back" both d="M462 114 V296" label="wer ist db?" lx={474} ly={268} anchor="start" />
    </Svg>
  </div>
)

/* Scaling: one name, many containers, and what collides. */
export const Scale = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label="Drei Container eines Service hinter einem DNS-Namen und die Einstellungen, die dabei kollidieren">
      <Box x={0} y={114} w={150} h={72} t="container" label="frontend" sub="fragt nach api" />
      <Box i={1} x={220} y={0} w={260} h={70} t="engine" label="DNS: api" sub="172.18.0.3 · .4 · .5" size={16} />
      <Arrow i={1} both kind="back" d="M75 112 V35 H216" n={1} nx={150} ny={35} />
      {[0, 1, 2].map(k => <g key={k}>
        <Box i={2 + k} x={700} y={10 + k * 88} w={300} h={70} t="container" label={`mensa-api-${k + 1}`} sub={`172.18.0.${3 + k}`} size={15} mono />
        <Arrow i={2 + k} d={`M152 150 C 520 150, 560 ${45 + k * 88}, 696 ${45 + k * 88}`} />
      </g>)}
      <Num i={3} n={2} x={300} y={150} />
      <Label i={3} x={300} y={128} size={13} weight={600}>verteilt sich auf alle</Label>
      <Label i={5} x={0} y={296} anchor="start" size={15} weight={700}>Was beim Skalieren kollidiert</Label>
      <Box i={5} x={0} y={310} w={320} h={84} t="bad" label='ports: "8080:8080"' sub="Host-Port gibt es nur einmal" size={14} mono />
      <Box i={6} x={340} y={310} w={320} h={84} t="bad" label="container_name: api" sub="Name gibt es nur einmal" size={14} mono />
      <Box i={7} x={680} y={310} w={320} h={84} t="ok" label="Proxy davor, kein Host-Port" sub="so skaliert es sauber" size={15} />
    </Svg>
  </div>
)
