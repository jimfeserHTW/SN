import { Svg, Box, Arrow, Label, Zone, Take } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'

// Technical additions to Architektur ②: looking into a running container, and docker run in five steps.

/* ── looking into a running container: logs, exec, inspect ── */
export const LookInside = () => (
  <div className="dg-split">
    <Code title="Terminal" lines={[
      { t: 'docker logs -f api', k: 'cmd', n: 1 },
      'Started MensaApplication in 3.1 seconds',
      { t: 'docker exec -it api sh', k: 'cmd', n: 2 },
      e('/ $ ls /app.jar   # im Container', '/ $ ls /app.jar   # inside the container'),
      { t: 'docker inspect api', k: 'cmd', n: 3 },
      '"IPAddress": "172.18.0.3", "Image": "mensa-api:1.0"',
    ]} />
    <div className="dg-col">
      <Svg w={520} h={360} label={e('Wohin die drei Befehle schauen: Ausgabe des Prozesses, ein neuer Prozess im Container, Daten von dockerd', 'Where the three commands look: output of the process, a new process in the container, data from dockerd')}>
        <Zone x={0} y={0} w={520} h={360} label={e('Host', 'Host')} />
        <Zone i={1} x={20} y={40} w={300} h={220} t="container" label="Container api" />
        <Box i={1} x={40} y={80} w={260} h={56} label="java -jar /app.jar" sub={e('PID 1, schreibt nach stdout', 'PID 1, writes to stdout')} size={15} />
        <Box i={2} x={40} y={180} w={260} h={56} t="libs" label="sh" sub={e('neuer Prozess, gleiche Wände', 'new process, same walls')} size={15} />
        <Box i={3} x={350} y={180} w={150} h={56} t="engine" label="dockerd" sub={e('kennt alle Daten', 'knows all data')} size={15} />
        <Arrow i={1} d="M300 108 H420 V170" n={1} nx={360} ny={108} kind="go" />
        <Arrow i={2} d="M420 290 H170 V242" n={2} nx={300} ny={290} kind="back" />
        <Arrow i={3} d="M500 236 V318 H470" n={3} nx={500} ny={278} kind="mute" />
        <Label i={3} x={330} y={340} anchor="end" size={13}>{e('Netz, Mounts, Image, Status', 'network, mounts, image, status')}</Label>
      </Svg>
      <Take i={4} label={e('Merke', 'Remember')} text={e('logs zeigt, was der Prozess ausgibt. exec startet einen zweiten Prozess hinter denselben Wänden. inspect fragt dockerd nach allem, was er weiß.', 'logs shows what the process prints. exec starts a second process behind the same walls. inspect asks dockerd for everything it knows.')} />
    </div>
  </div>
)

/* ── what happens on docker run, in five steps ── */
export const RunSteps = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label={e('docker run in fünf Schritten: Auftrag, Image holen, Container anlegen, Netz und Port, Prozess starten', 'docker run in five steps: order, fetch the image, create the container, network and port, start the process')}>
      <Zone x={0} y={0} w={760} h={400} label={e('Host · ein Linux-Rechner', 'Host · a Linux machine')} />
      <Box i={0} x={20} y={50} w={180} h={64} label="docker run" sub={e('dein Befehl', 'your command')} size={16} mono />
      <Box i={1} x={300} y={50} w={200} h={64} t="engine" label="dockerd" sub={e('nimmt den Auftrag an', 'takes the order')} />
      <Box i={2} x={800} y={50} w={180} h={64} t="reg" label="Registry" sub={e('nur wenn das Image fehlt', 'only if the image is missing')} size={15} />
      <Box i={2} x={560} y={50} w={180} h={64} t="libs" label={e('Images', 'Images')} sub={e('lokal auf der Platte', 'local on disk')} />
      <Box i={3} x={300} y={190} w={200} h={64} t="container" label={e('Container', 'Container')} sub={e('mit eigener Schreibschicht', 'with its own writable layer')} size={16} />
      <Box i={4} x={560} y={190} w={180} h={64} t="kchip" label={e('Netz und Port', 'network and port')} sub="-p 8080:8080" />
      <Box i={5} x={300} y={310} w={200} h={64} t="ok" label={e('Prozess läuft', 'process runs')} sub="java -jar /app.jar" />
      <Arrow i={1} d="M204 82 H296" n={1} nx={250} ny={82} />
      <Arrow i={2} d="M504 82 H556" n={2} nx={530} ny={60} />
      <Arrow i={2} d="M796 82 H744" kind="back" />
      <Arrow i={3} d="M400 118 V186" n={3} nx={400} ny={152} />
      <Arrow i={4} d="M504 222 H556" n={4} nx={530} ny={200} />
      <Arrow i={5} d="M400 258 V306" n={5} nx={400} ny={282} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Ein Befehl, fünf Schritte: Auftrag, Image bereitstellen, Container anlegen, Netz und Port verdrahten, Prozess starten.', 'One command, five steps: order, provide the image, create the container, wire network and port, start the process.')} />
  </div>
)
