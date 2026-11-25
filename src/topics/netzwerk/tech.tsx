import { Svg, Box, Arrow, Label, Zone, Tick, Take } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'
import { Code } from '../../components/Code.tsx'

// Technical addition to Netzwerk ②: a server that only listens on localhost inside the container.
const row = (y: number, ok: boolean, listen: string, i: number) => (
  <g>
    <Zone i={i} x={330} y={y} w={640} h={130} t="container" label="Container frontend" sub={e('Vite-Dev-Server', 'Vite dev server')} />
    <Box i={i} x={350} y={y + 42} w={180} h={64} t="kchip" label="eth0" sub="172.18.0.2" mono />
    <Box i={i} x={560} y={y + 42} w={170} h={64} t="libs" label="lo" sub="127.0.0.1" mono />
    <Box i={i} x={760} y={y + 42} w={190} h={64} t={ok ? 'ok' : 'bad'} label={listen} sub={ok ? e('lauscht überall', 'listens everywhere') : e('lauscht nur auf lo', 'listens on lo only')} size={14} mono />
    <Arrow i={i + 1} d={`M200 ${y + 74} H346`} kind={ok ? 'ok' : 'bad'} label="-p 5173:5173" lx={272} ly={y + 62} />
    <Tick i={i + 1} x={540} y={y + 30} ok={ok} bad={!ok} />
  </g>
)
export const ListenAddress = () => (
  <div className="dg-col">
    <Svg w={1000} h={322} label={e('Oben lauscht der Dev-Server nur auf localhost und ist von außen nicht erreichbar, unten auf 0.0.0.0', 'Top: the dev server listens only on localhost and cannot be reached from outside, bottom: on 0.0.0.0')}>
      <Box x={20} y={42} w={170} h={64} t="host" label={e('Browser', 'Browser')} sub="localhost:5173" />
      <Box i={2} x={20} y={192} w={170} h={64} t="host" label={e('Browser', 'Browser')} sub="localhost:5173" />
      {row(10, false, 'vite', 0)}
      {row(160, true, 'vite --host', 2)}
      <Label i={4} x={20} y={314} anchor="start" size={13}>{e('Die Weiterleitung kommt über eth0 an. Wer nur auf lo lauscht, hört sie nicht.', 'Forwarding arrives via eth0. Whoever listens on lo only does not hear it.')}</Label>
    </Svg>
    <Take i={5} label={e('Typischer Fehler', 'Typical mistake')} text={e('Der Container läuft, der Port ist veröffentlicht, trotzdem keine Antwort: Die App lauscht nur auf localhost. Spring Boot lauscht schon überall, Vite braucht --host.', 'The container runs, the port is published, still no answer: the app only listens on localhost. Spring Boot already listens everywhere, Vite needs --host.')} />
  </div>
)

/* ── docker network create: names only work in your own networks ── */
export const NetCreate = () => (
  <div className="dg-col">
  <div className="dg-split">
    <Code title="Terminal" lines={[
      { t: e('# 1  ohne Angabe: Standard-Netz bridge', '# 1  without option: default network bridge'), k: 'note' },
      { t: 'docker run -d --name web nginx:1.27', k: 'cmd' },
      { t: 'docker run --rm alpine ping -c1 web', k: 'cmd' },
      { t: "ping: bad address 'web'", k: 'bad' },
      { t: e('# 2  eigenes Netz anlegen, beide hinein', '# 2  create your own network, both inside'), k: 'note' },
      { t: 'docker network create mensa', k: 'cmd' },
      { t: 'docker network connect mensa web', k: 'cmd' },
      { t: 'docker run --rm --network mensa \\', k: 'cmd' },
      { t: '  alpine ping -c1 web', k: 'cont' },
      { t: '64 bytes from 172.20.0.2: seq=0', k: 'ok' },
    ]} />
    <Svg w={500} h={390} label={e('Im Standard-Netz bridge gibt es keine Namen, nur IPs. In einem eigenen Netz löst der eingebaute DNS den Namen web auf.', 'In the default network bridge there are no names, only IPs. In your own network the built-in DNS resolves the name web.')}>
      <Zone x={0} y={0} w={500} h={170} t="host" label={e('Standard-Netz bridge', 'Default network bridge')} sub="docker0" />
      <Box x={20} y={50} w={150} h={56} t="container" label="alpine" size={15} />
      <Box x={330} y={50} w={150} h={56} t="container" label="web" size={15} />
      <Arrow d="M172 78 H326" kind="bad" label={e('„web“?', '“web”?')} lx={249} ly={68} />
      <Tick x={249} y={100} bad />
      <Label x={250} y={148} size={13} tone="bad">{e('kein DNS: nur über die IP erreichbar', 'no DNS: reachable by IP only')}</Label>
      <Zone i={2} x={0} y={200} w={500} h={190} t="ok" label={e('eigenes Netz mensa', 'own network mensa')} sub="docker network create" />
      <Box i={2} x={20} y={250} w={150} h={56} t="container" label="alpine" size={15} />
      <Box i={2} x={330} y={250} w={150} h={56} t="container" label="web" size={15} />
      <Box i={3} x={150} y={326} w={200} h={46} t="engine" label={e('eingebauter DNS', 'built-in DNS')} sub="web → 172.20.0.2" size={14} />
      <Arrow i={3} d="M172 278 H326" kind="ok" />
      <Tick i={3} x={249} y={262} ok />
    </Svg>
  </div>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Namen auflösen kann Docker nur in eigenen Netzen. Mit docker run legt ihr sie mit docker network create an. Compose macht das selbst: Es legt für jedes Projekt das Netz <projekt>_default an.', 'Docker can only resolve names in your own networks. With docker run you create them with docker network create. Compose does it by itself: it creates the network <project>_default for every project.')} />
  </div>
)
