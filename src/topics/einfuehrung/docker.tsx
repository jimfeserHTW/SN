import type { ReactNode } from 'react'
import { Svg, Take, Box as B, Zone, Ctr, Arrow, Label, Tick } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Mark, Person, Plan, Sheet, In, Txt, Go } from '../../components/harbor/harbor.tsx'

// Einführung in Docker: the student team behind the Mensa-App. Technical terms only, drawn as abstract machines and containers.
const arrow = (d: string, i: number, kind: 'go' | 'back' = 'go') => <Go d={d} i={i} kind={kind} />

/* ── ① 1 · the project: one repo, four machines ── */
const team: { x: number; y: number; who: string; env: string; ok?: boolean; bad?: boolean; note: string; right?: boolean }[] = [
  { x: 20, y: 24, who: e('Lena · macOS', 'Lena · macOS'), env: 'JDK 21 · Node 22 · Postgres', ok: true, note: e('läuft', 'runs') },
  { x: 650, y: 24, who: e('Tim · Windows', 'Tim · Windows'), env: 'JDK 17 · Node 18', bad: true, note: e('Build bricht ab: JDK zu alt', 'build fails: JDK too old'), right: true },
  { x: 20, y: 312, who: e('Ali · Linux', 'Ali · Linux'), env: e('JDK 21 · Node 22 · keine DB', 'JDK 21 · Node 22 · no DB'), bad: true, note: e('startet, findet keine Datenbank', 'starts, finds no database') },
  { x: 650, y: 312, who: e('Server zur Abgabe', 'Server for the hand-in'), env: e('Version unbekannt', 'version unknown'), note: e('Demo-Tag: Läuft es dort?', 'Demo day: will it run there?'), right: true },
]
export const Project = () => (
  <div className="dg-col">
    <Svg w={1000} h={420} label={e('Ein Repo mit der Mensa-App, vier Rechner mit verschiedenen Versionen', 'One repo with the Mensa-App, four machines with different versions')}>
      <In i={0}>
        <rect x={370} y={128} width={260} height={164} rx={18} fill="#fff" stroke="var(--blue)" strokeWidth={2.5} />
        <Txt x={500} y={160} size={20} w={700} fill="var(--ink)" anchor="middle">Mensa-App</Txt>
        <Txt x={500} y={180} size={13} w={500} fill="var(--ink-3)" anchor="middle">{e('ein Repo, derselbe Code für alle', 'one repo, the same code for all')}</Txt>
        {([['Vue-Frontend', 'var(--svc-frontend)'], ['Spring-Boot-API', 'var(--svc-api)'], [e('Postgres-Datenbank', 'Postgres database'), 'var(--svc-db)']] as const).map(([l, c], k) => (
          <g key={l}><rect x={392} y={194 + k * 30} width={216} height={24} rx={7} fill={c} /><Txt x={500} y={211 + k * 30} size={13.5} w={700} fill="#fff" anchor="middle">{l}</Txt></g>
        ))}
      </In>
      {team.map((m, k) => {
        const tx = m.right ? m.x : m.x + 84, ix = m.right ? m.x + 262 : m.x
        return (
          <g key={m.who}>
            <In i={1 + k}><Icon name={k === 3 ? 'server' : 'laptop'} x={ix} y={m.y} s={64} /></In>
            <Tag x={tx} y={m.y + 4} w={250} label={m.who} sub={m.env} tone={m.ok ? 'ok' : m.bad ? 'bad' : undefined} i={1 + k} />
            <Mark x={m.right ? tx + 250 : tx} y={m.y + 4} ok={m.ok} bad={m.bad} i={1 + k} r={12} />
            <In i={1 + k}><Txt x={tx} y={m.y + 74} size={13.5} fill={m.ok ? 'var(--ok)' : m.bad ? 'var(--bad)' : 'var(--ink-2)'}>{m.note}</Txt></In>
          </g>
        )
      })}
      <Lead d="M370 160 L354 72" end={[354, 54]} i={5} />
      <Lead d="M630 160 L646 72" end={[646, 54]} i={5} />
      <Lead d="M370 262 L354 346" end={[354, 342]} i={5} />
      <Lead d="M630 262 L646 346" end={[646, 342]} i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Der Code ist überall gleich. Die Umgebung drumherum nicht: andere Versionen, fehlende Programme, andere Betriebssysteme.', 'The code is the same everywhere. The environment around it is not: other versions, missing programs, other operating systems.')} />
  </div>
)

/* ── ① 2 · works on my machine: the jar uses whatever JDK the machine has installed ── */
const machine = (x: number, who: string, os: string, jdk: string, ok: boolean, i: number) => (
  <>
    <Zone x={x} y={118} w={460} h={232} label={who} sub={os} i={i} />
    <B x={x + 120} y={156} w={220} h={50} t="app" label="java -jar app.jar" size={15} mono i={i} />
    <Arrow d={`M${x + 230} 208 V230`} i={i} />
    <Label x={x + 244} y={224} anchor="start" size={13} tone="muted" i={i}>{e('nutzt das installierte JDK', 'uses the installed JDK')}</Label>
    <B x={x + 120} y={234} w={220} h={50} t={ok ? 'ok' : 'bad'} label={jdk} sub={e('auf dem Rechner installiert', 'installed on the machine')} size={16} i={i + 1} />
    <B x={x + 16} y={296} w={428} h={40} t="kernel" label={e('Betriebssystem', 'Operating system')} size={14} i={i} />
  </>
)
export const Loose = () => (
  <div className="dg-col">
    <Svg w={1000} h={420} label={e('Dieselbe app.jar auf zwei Rechnern: Mit JDK 21 läuft sie, mit JDK 17 nicht', 'The same app.jar on two machines: it runs with JDK 21, not with JDK 17')}>
      <B x={380} y={0} w={240} h={56} t="app" label="app.jar" sub={e('aus dem Repo, bei beiden gleich', 'from the repo, the same for both')} size={16} />
      <Arrow d="M430 58 L250 112" i={1} />
      <Arrow d="M570 58 L750 112" i={3} />
      {machine(20, e('Lenas Laptop', 'Lena’s laptop'), 'macOS', 'JDK 21', true, 1)}
      {machine(520, e('Tims Laptop', 'Tim’s laptop'), 'Windows', 'JDK 17', false, 3)}
      <Tag x={120} y={366} w={260} label={e('✓ läuft', '✓ runs')} tone="ok" i={2} />
      <Tag x={560} y={366} w={380} label="UnsupportedClassVersionError" sub={e('mit JDK 21 gebaut, JDK 17 installiert', 'built with JDK 21, JDK 17 installed')} tone="bad" i={4} />
    </Svg>
    <Take i={5} label={e('Ursache', 'Cause')} text={e('Ohne Container nutzt die App, was auf dem Rechner gerade installiert ist. Und auf jedem Rechner ist etwas anderes installiert.', 'Without a container the app uses whatever is installed on the machine. And every machine has something else installed.')} />
  </div>
)

/* ── ① 3 · the idea: ship the app together with its environment ── */
const hosts = [e('Lena · macOS', 'Lena · macOS'), e('Tim · Windows', 'Tim · Windows'), e('Server · Linux', 'Server · Linux')]
const plain: [string, boolean][] = [['JDK 21', true], ['JDK 17', false], [e('kein JDK', 'no JDK'), false]]
export const Standard = () => (
  <div className="dg-col">
    <Svg w={1000} h={384} label={e('Links nur die App, die auf zwei von drei Rechnern scheitert. Rechts ein Image mit App und JDK, das auf allen drei Rechnern mit Docker läuft.', 'Left only the app, which fails on two of three machines. Right an image with app and JDK that runs on all three machines with Docker.')}>
      <Tag x={0} y={0} w={480} label={e('Ohne Docker: nur die App ausliefern', 'Without Docker: ship only the app')} sub={e('die Umgebung bringt jeder Rechner selbst mit', 'every machine brings its own environment')} tone="sky" />
      <Tag x={520} y={0} w={480} label={e('Mit Docker: App samt Umgebung ausliefern', 'With Docker: ship the app with its environment')} sub={e('ein Image, auf jedem Rechner gleich', 'one image, the same on every machine')} tone="sky" i={4} />
      <B x={150} y={110} w={180} h={56} t="app" label="app.jar" sub={e('nur der Code', 'only the code')} i={1} />
      <Ctr x={620} y={60} w={280} h={146} name="Image mensa-api" i={5} />
      <B x={640} y={90} w={240} h={32} t="app" label="app.jar" size={14} i={5} />
      <B x={640} y={128} w={240} h={32} t="libs" label="JDK 21" size={14} i={5} />
      <B x={640} y={166} w={240} h={32} t="libs" label={e('Bibliotheken', 'Libraries')} size={14} i={5} />
      {hosts.map((h, k) => {
        const lx = k * 162, rx = 520 + k * 162
        return (
          <g key={h}>
            <Arrow d={`M240 168 L${lx + 75} 236`} i={2} />
            <Zone x={lx} y={240} w={150} h={96} label={h} i={2} />
            <B x={lx + 12} y={276} w={126} h={46} t={plain[k][1] ? 'ok' : 'bad'} label={plain[k][0]} size={15} i={2} />
            <Tick x={lx + 75} y={362} ok={plain[k][1]} bad={!plain[k][1]} i={3} />
            <Arrow d={`M760 208 L${rx + 75} 236`} i={6} />
            <Zone x={rx} y={240} w={150} h={96} label={h} i={6} />
            <B x={rx + 12} y={276} w={126} h={46} t="engine" label="Docker" size={15} i={6} />
            <Tick x={rx + 75} y={362} ok i={7} />
          </g>
        )
      })}
    </Svg>
    <Take i={8} label={e('Die Idee', 'The idea')} text={e('Docker liefert nicht nur die App aus, sondern die App mit allem, was sie braucht. Auf dem Zielrechner muss nur Docker laufen.', 'Docker does not ship only the app, but the app with everything it needs. The target machine only has to run Docker.')} />
  </div>
)

/* ── ① 4 · what goes into the container, and what stays with the machine ── */
const inside = (x: number, name: string, items: [string, string, 'app' | 'libs'][], i: number) => (
  <>
    <Ctr x={x} y={36} w={290} h={244} name={name} i={i} />
    {items.map(([l, s, t], k) => <B key={l} x={x + 16} y={66 + k * 52} w={258} h={44} t={t} label={l} sub={s} size={15} i={i} />)}
  </>
)
export const Packed = () => (
  <div className="dg-col">
    <Svg w={1000} h={420} label={e('Zwei Container mit App, Laufzeit, Bibliotheken und Einstellungen. Darunter Docker Engine und der Kernel, den beide teilen.', 'Two containers with app, runtime, libraries and settings. Below them the Docker Engine and the kernel both share.')}>
      <Zone x={0} y={0} w={640} h={420} label={e('Dein Rechner', 'Your machine')} sub="Linux" />
      {inside(20, e('Container api', 'Container api'), [['app.jar', e('euer Code', 'your code'), 'app'], ['JDK 21', e('die Laufzeit', 'the runtime'), 'libs'], [e('Bibliotheken', 'Libraries'), e('z. B. libssl', 'e.g. libssl'), 'libs'], [e('Einstellungen', 'Settings'), e('Port, Profil', 'port, profile'), 'libs']], 1)}
      {inside(330, e('Container db', 'Container db'), [['Postgres 18', e('die Datenbank', 'the database'), 'app'], [e('Bibliotheken', 'Libraries'), e('z. B. glibc', 'e.g. glibc'), 'libs'], [e('Einstellungen', 'Settings'), e('Passwort, Port', 'password, port'), 'libs']], 2)}
      <B x={20} y={292} w={600} h={44} t="engine" label="Docker Engine" size={15} i={3} />
      <B x={20} y={348} w={600} h={56} t="kernel" label="Kernel" sub={e('einer für alle Container', 'one for all containers')} i={4} />
      <Tag x={670} y={120} w={320} label={e('Im Container', 'Inside the container')} sub={e('alles, was die App braucht', 'everything the app needs')} tone="ok" i={2} />
      <Lead d="M670 143 H628" end={[624, 143]} i={2} />
      <Tag x={670} y={354} w={320} label={e('Nicht im Container', 'Not in the container')} sub={e('der Kernel: gehört dem Rechner', 'the kernel: belongs to the machine')} tone="sand" i={4} />
      <Lead d="M670 376 H628" end={[624, 376]} i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Ein Container ist eure App plus ihre Umgebung, fest verpackt. Den Kern des Betriebssystems teilen sich alle Container eines Rechners.', 'A container is your app plus its environment, packed for good. All containers on a machine share the core of the operating system.')} />
  </div>
)

/* ── ① 5 · who uses Docker ── */
const crew: { role: 'student' | 'grey'; title: string; sub: string; prop: (x: number) => ReactNode }[] = [
  { role: 'student', title: e('Entwicklung', 'Development'), sub: e('baut die Images', 'builds the images'), prop: x => <Sheet x={x} y={196} w={38} h={46} /> },
  { role: 'grey', title: e('Tests und CI', 'Tests and CI'), sub: e('prüft jedes Image', 'checks every image'), prop: x => <Mark x={x + 18} y={220} ok r={16} /> },
  { role: 'student', title: e('Betrieb', 'Operations'), sub: e('startet Container auf Servern', 'runs containers on servers'), prop: x => <Icon name="server" x={x - 6} y={194} s={52} /> },
  { role: 'grey', title: e('Lehre und Teams', 'Teaching and teams'), sub: e('gleiche Umgebung für alle', 'the same environment for all'), prop: x => <Icon name="laptop" x={x - 6} y={194} s={52} /> },
]
export const Harbour = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Vier Stationen: Entwicklung, Tests, Betrieb, Lehre. Alle nutzen dasselbe Image.', 'Four stations: development, tests, operations, teaching. All use the same image.')}>
      {crew.map((c, k) => {
        const x = 14 + k * 248
        return (
          <g key={c.title}>
            <In i={k}><rect x={x} y={92} width={224} height={158} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} /></In>
            <Person x={x + 62} y={196} s={1.3} role={c.role} i={k} />
            <In i={k}>{c.prop(x + 128)}</In>
            <In i={k}><Txt x={x + 112} y={124} size={17} w={700} fill="var(--ink)" anchor="middle">{c.title}</Txt></In>
            <In i={k}><Txt x={x + 112} y={146} size={13} w={500} anchor="middle">{c.sub}</Txt></In>
            {k < 3 && arrow(`M${x + 228} 200 H${x + 244}`, k + 1)}
          </g>
        )
      })}
      <Tag x={180} y={20} w={640} label={e('Alle reichen dasselbe Image weiter', 'Everyone passes the same image along')} sub={e('niemand installiert die App von Hand neu', 'nobody reinstalls the app by hand')} tone="blue" i={4} />
      <Tag x={250} y={274} w={500} label={e('Kleine Teams, Unis und große Firmen arbeiten so', 'Small teams, universities and big companies work like this')} tone="sky" i={5} />
    </Svg>
  </div>
)

/* ── ② 1 · blueprint and container, like class and object ── */
export const ClassObject = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Klasse und Objekte in Java neben Image und Containern', 'Class and objects in Java next to image and containers')}>
      <Tag x={40} y={0} w={400} label="Java" sub={e('was ihr kennt', 'what you know')} tone="sky" />
      <Tag x={560} y={0} w={400} label="Docker" sub={e('was neu ist', 'what is new')} tone="sky" i={3} />
      <In i={1}><rect x={140} y={70} width={200} height={70} rx={12} fill="#fff" stroke="var(--keel)" strokeWidth={2} /><Txt x={240} y={102} size={16} w={700} fill="var(--ink)" anchor="middle">class Mensa</Txt><Txt x={240} y={124} size={13} anchor="middle">{e('der Bauplan', 'the blueprint')}</Txt></In>
      {[0, 1, 2].map(k => (
        <g key={k}>
          {arrow(`M${240 + (k - 1) * 40} 142 L${100 + k * 140} 208`, 2)}
          <In i={2}><rect x={40 + k * 140} y={212} width={120} height={52} rx={26} fill="var(--sky)" stroke="var(--blue)" strokeWidth={2} /><Txt x={100 + k * 140} y={243} size={14} w={700} fill="var(--ink)" anchor="middle">new Mensa()</Txt></In>
        </g>
      ))}
      <Plan x={700} y={70} w={120} h={70} i={4} />
      <In i={4}><Txt x={760} y={160} size={14} w={700} fill="var(--blue-deep)" anchor="middle">Image mensa-api:1.0</Txt></In>
      {[0, 1, 2].map(k => (
        <g key={k}>
          {arrow(`M${760 + (k - 1) * 40} 168 L${620 + k * 140} 208`, 5)}
          <Box x={562 + k * 140} y={212} w={116} h={52} svc="api" label="api" i={5} />
        </g>
      ))}
      <Tag x={60} y={296} w={260} label={e('Klasse  ≈  Image', 'class  ≈  image')} sub={e('der Bauplan, ändert sich nicht', 'the blueprint, never changes')} i={6} />
      <Tag x={370} y={296} w={260} label={e('Objekt  ≈  Container', 'object  ≈  container')} sub={e('ein laufendes Exemplar', 'one running instance')} i={7} />
      <Tag x={680} y={296} w={260} label={e('new  ≈  docker run', 'new  ≈  docker run')} sub={e('macht aus dem Plan ein Exemplar', 'turns the plan into an instance')} i={8} />
    </Svg>
  </div>
)

/* ── ② 2 · java -jar, Docker, Podman and a VM side by side: the core slide ── */
const cx = (k: number) => 290 + k * 178
type Val = 'ok' | 'bad' | string
const facts: [string, Val, Val, Val, Val][] = [
  [e('eigene Umgebung (JDK 21)', 'own environment (JDK 21)'), 'bad', 'ok', 'ok', 'ok'],
  [e('nutzt den Kernel des Rechners', 'uses the machine’s kernel'), 'ok', 'ok', 'ok', 'bad'],
  [e('Hintergrunddienst', 'Background service'), '–', 'dockerd', e('keiner', 'none'), 'Hypervisor'],
  [e('zusätzliche Startzeit', 'extra start-up time'), '–', '< 1 s', '< 1 s', e('OS bootet', 'OS boots')],
  [e('läuft überall gleich', 'runs the same everywhere'), 'bad', 'ok', 'ok', 'ok'],
]
const container = (x: number, i: number) => (
  <>
    <Ctr x={x} y={44} w={166} h={116} name="Container" i={i} />
    <B x={x + 10} y={72} w={146} h={36} t="app" label="app.jar" size={14} i={i} />
    <B x={x + 10} y={114} w={146} h={36} t="libs" label="JDK 21" size={14} i={i} />
  </>
)
export const JarVsContainer = () => (
  <div className="dg-col">
    <Svg w={1000} h={476} label={e('Vier Wege, die App zu starten: java -jar, docker run, podman run und eine VM, mit ihren Schichten und Eigenschaften', 'Four ways to start the app: java -jar, docker run, podman run and a VM, with their layers and properties')}>
      {['java -jar', 'docker run', 'podman run', e('VM', 'VM')].map((h, k) => <Tag key={h} x={cx(k)} y={0} w={166} label={h} size={14} tone="sky" i={k * 2} />)}
      <Label x={10} y={106} anchor="start" size={14} weight={700}>{e('App und Umgebung', 'App and environment')}</Label>
      <Label x={10} y={192} anchor="start" size={14} weight={700}>{e('dazwischen', 'in between')}</Label>
      <Label x={10} y={238} anchor="start" size={14} weight={700}>{e('ganz unten', 'at the bottom')}</Label>

      <Label x={cx(0) + 83} y={78} size={13} tone="muted">{e('direkt auf dem Rechner', 'directly on the machine')}</Label>
      <B x={cx(0)} y={104} w={166} h={50} t="app" label="app.jar" sub={e('ein Prozess', 'one process')} size={15} />
      <B x={cx(0)} y={168} w={166} h={38} t="libs" label={e('JDK 17 · installiert', 'JDK 17 · installed')} size={13} />

      {container(cx(1), 2)}
      <B x={cx(1)} y={168} w={166} h={38} t="engine" label="dockerd · Daemon" size={14} i={2} />
      {container(cx(2), 4)}
      <B x={cx(2)} y={168} w={166} h={38} t="gone" label={e('kein Daemon', 'no daemon')} size={14} i={4} />

      <Zone x={cx(3)} y={44} w={166} h={116} t="guest" label="VM" i={6} />
      <B x={cx(3) + 10} y={72} w={146} h={36} t="app" label="app.jar · JDK 21" size={13} i={6} />
      <B x={cx(3) + 10} y={114} w={146} h={36} t="kernel" label={e('eigener Kernel', 'own kernel')} size={14} i={6} />
      <B x={cx(3)} y={168} w={166} h={38} t="hyper" label="Hypervisor" size={14} i={6} />

      {[0, 1, 2, 3].map(k => <B key={k} x={cx(k)} y={214} w={166} h={38} t="kernel" label={e('Kernel des Rechners', 'Machine’s kernel')} size={13} i={k * 2} />)}

      {facts.map(([label, ...vals], r) => {
        const y = 272 + r * 40
        return (
          <g key={label}>
            {r % 2 === 0 && <rect x={0} y={y} width={1000} height={36} rx={8} fill="#fff" />}
            <Label x={10} y={y + 23} anchor="start" size={14} weight={700} i={8 + r}>{label}</Label>
            {vals.map((v, k) => v === 'ok' || v === 'bad'
              ? <Tick key={k} x={cx(k) + 83} y={y + 18} ok={v === 'ok'} bad={v === 'bad'} i={8 + r} />
              : <Label key={k} x={cx(k) + 83} y={y + 23} size={14} weight={700} mono={v === 'dockerd'} i={8 + r}>{v}</Label>)}
          </g>
        )
      })}
    </Svg>
    <Take i={13} label={e('Merke', 'Remember')} text={e('Docker und Podman starten dieselben Images als Prozess mit eigener Umgebung, Podman nur ohne Daemon. Eine VM bootet ein ganzes Betriebssystem mit eigenem Kernel: stärker getrennt, aber schwerer.', 'Docker and Podman start the same images as a process with its own environment, Podman just without a daemon. A VM boots a whole operating system with its own kernel: more strongly separated, but heavier.')} />
  </div>
)

/* ── ② 3 · the one commands slide ── */
export const Commands = () => (
  <div className="dg-col">
    <div className="dg-col">
      <Code title="Dockerfile" kind="file" lines={[
        { t: 'FROM eclipse-temurin:21-jre', chip: e('Linux mit JDK 21', 'Linux with JDK 21') },
        { t: 'COPY target/app.jar /app.jar', chip: e('eure App hinein', 'your app inside') },
        { t: 'EXPOSE 8080', chip: e('Port der App', 'port of the app') },
        { t: 'CMD ["java", "-jar", "/app.jar"]', chip: e('so startet sie', 'how it starts') },
      ]} />
      <Code title="Terminal" i={1} lines={[
        { t: 'docker build -t mensa-api:1.0 .', k: 'cmd', chip: e('Image bauen', 'build image') },
        { t: 'docker run -d -p 8080:8080 --name api mensa-api:1.0', k: 'cmd', chip: e('starten', 'start') },
        { t: 'docker stop api', k: 'cmd', chip: e('anhalten', 'stop') },
        { t: 'docker rm api', k: 'cmd', chip: e('entfernen', 'remove') },
      ]} />
    </div>
    <Svg w={1000} h={120} label={e('Was die Teile von docker run bedeuten', 'What the parts of docker run mean')}>
      {([['-d', e('im Hintergrund', 'in the background')], ['-p 8080:8080', e('Port: Rechner → Container', 'port: machine → container')], ['--name api', e('Name des Containers', 'name of the container')], ['mensa-api:1.0', e('welches Image', 'which image')]] as const).map(([c, l], k) => (
        <In key={c} i={2 + k}>
          <rect x={k * 250} y={10} width={236} height={86} rx={14} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
          <text x={k * 250 + 118} y={44} textAnchor="middle" fontSize={16} style={{ fontFamily: "var(--mono)" }} fontWeight={700} fill="var(--blue-deep)">{c}</text>
          <Txt x={k * 250 + 118} y={74} size={13} anchor="middle">{l}</Txt>
        </In>
      ))}
    </Svg>
  </div>
)
