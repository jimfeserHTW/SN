import type { ReactNode } from 'react'
import { t } from '../../i18n.ts'
import { Svg, Take, Box as B, Zone, Ctr, Arrow, Label, Wire, Tick } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'
import { Tag, Mark, In, Txt, Go } from '../../components/harbor/harbor.tsx'

// Einführung in Docker: the student team behind the Mensa-App. Technical terms only, drawn as abstract machines and containers.
const arrow = (d: string, i: number, kind: 'go' | 'back' = 'go') => <Go d={d} i={i} kind={kind} />

/* ── ① 1 + 2 share one scene: the same repo, the same three machines, the same terminals. Only the layers change. ── */
const col = (k: number) => 170 + k * 280
const mono = { fontFamily: 'var(--mono)', fontVariantLigatures: 'none' }
const who = [e('Lenas Laptop', 'Lena’s laptop'), e('Tims Laptop', 'Tim’s laptop'), e('Abgabe-Server', 'Hand-in server')]
const oses = ['macOS', 'Windows', 'Linux']
const chip = (x: number, w: number, label: string, fill: string, stroke: string, ink: string) => (
  <><rect x={x} y={40} width={w} height={38} rx={8} fill={fill} stroke={stroke} strokeWidth={2} /><Txt x={x + w / 2} y={64} size={14} w={700} fill={ink} anchor="middle">{label}</Txt></>
)
/** The Git repo at the top and the three `git clone` arrows. With `dockerfile`, the box widens for backend/Dockerfile (built in at step di). */
const Repo = ({ dockerfile, di = 1 }: { dockerfile?: boolean; di?: number }) => {
  const [x, w] = dockerfile ? [310, 540] : [380, 400]
  return (
    <>
      <In i={0}>
        <rect x={x} y={0} width={w} height={92} rx={14} fill="#fff" stroke="var(--keel)" strokeWidth={2} />
        <Txt x={x + 16} y={25} size={15} w={700} fill="var(--ink)">{e('Git-Repo · mensa-app', 'Git repo · mensa-app')}</Txt>
        <Txt x={x + w - 16} y={25} size={13} fill="var(--ink-3)" anchor="end">{e('derselbe Commit', 'the same commit')}</Txt>
        {chip(x + 16, dockerfile ? 140 : 178, 'frontend/ · Vue', '#fff', 'var(--svc-frontend)', 'var(--svc-frontend-d)')}
        {chip(dockerfile ? 478 : 586, dockerfile ? 186 : 178, 'backend/ · Spring Boot', 'var(--svc-api)', 'var(--svc-api)', '#fff')}
      </In>
      {dockerfile && <In i={di}>{chip(676, 158, 'backend/Dockerfile', '#fff', 'var(--blue)', 'var(--blue-deep)')}</In>}
      {who.map((_, k) => <Go key={k} d={`M${500 + k * 80} 98 L${col(k) + 130} 132`} i={di} />)}
      <Label x={598} y={122} anchor="start" size={13} mono weight={700} i={di}>git clone</Label>
    </>
  )
}
const machine = (k: number, h: number, i: number) => (
  <In i={i}>
    <rect x={col(k)} y={142} width={260} height={h} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
    <Txt x={col(k) + 16} y={166} size={14} w={700} fill="var(--ink-2)">{who[k]}</Txt>
  </In>
)
/** Dark terminal strip under machine k: prompt, result (green or red), detail. */
const term = (k: number, [cmd, res, detail]: string[], ok: boolean, i: number, size = 12.5) => (
  <>
    <In i={i}>
      <rect x={col(k)} y={384} width={260} height={76} rx={10} fill="#0f1b2d" />
      <text x={col(k) + 12} y={406} fontSize={size} fill="#94a3b8" style={mono}>{cmd}</text>
      <text x={col(k) + 12} y={428} fontSize={size} fontWeight={700} fill={ok ? '#4ade80' : '#fca5a5'} style={mono}>{res}</text>
      <text x={col(k) + 12} y={448} fontSize={12} fill="#cbd5e1" style={mono}>{detail}</text>
    </In>
    <Mark x={col(k) + 238} y={424} ok={ok} bad={!ok} r={10} i={i} />
  </>
)
/** Dashed divider across all machines with the two gutter labels. */
const divide = (y: number, top: [string, string], bottom: [string, string], i: number) => (
  <In i={i}>
    <path d={`M0 ${y} H990`} stroke="var(--ink-2)" strokeWidth={2} strokeDasharray="7 5" fill="none" />
    <Txt x={0} y={y - 42} size={14} w={700} fill="var(--ink)">{top[0]}</Txt>
    <Txt x={0} y={y - 24} size={12.5} fill="var(--ink-3)">{top[1]}</Txt>
    <Txt x={0} y={y + 34} size={14} w={700} fill="var(--ink)">{bottom[0]}</Txt>
    <Txt x={0} y={y + 52} size={12.5} fill="var(--ink-3)">{bottom[1]}</Txt>
  </In>
)

/* ── ① 1 · works on my machine: everyone clones the same commit and builds locally, only the installed JDK differs ── */
const jdks: { jdk: string; sub: string; t: 'ok' | 'bad' | 'gone'; out: string[] }[] = [
  { jdk: 'JDK 21', sub: e('installiert', 'installed'), t: 'ok', out: ['$ ./mvnw spring-boot:run', 'BUILD SUCCESS', 'Started MensaApplication'] },
  { jdk: 'JDK 17', sub: e('installiert · zu alt', 'installed · too old'), t: 'bad', out: ['$ ./mvnw spring-boot:run', 'BUILD FAILURE', 'release version 21 not supported'] },
  { jdk: e('kein JDK', 'no JDK'), sub: e('nicht installiert', 'not installed'), t: 'gone', out: ['$ ./mvnw spring-boot:run', 'Error: JAVA_HOME is not', 'defined correctly.'] },
]
export const WorksForMe = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} top={136} label={e('Drei Rechner klonen dasselbe Repo und bauen das Backend mit ./mvnw. Mit JDK 21 läuft es, mit JDK 17 bricht der Build ab, ohne JDK startet Maven gar nicht.', 'Three machines clone the same repo and build the backend with ./mvnw. With JDK 21 it runs, with JDK 17 the build fails, without a JDK Maven does not even start.')}>
      {jdks.map((m, k) => (
        <g key={k}>
          {machine(k, 226, 1)}
          <B x={col(k) + 12} y={180} w={236} h={48} t="app" label={e('Quellcode + pom.xml', 'Source code + pom.xml')} sub={e('verlangt Java 21', 'requires Java 21')} size={15} i={1} />
          <B x={col(k) + 12} y={256} w={236} h={48} t={m.t} label={m.jdk} sub={m.sub} size={15} i={2} />
          <B x={col(k) + 12} y={314} w={236} h={40} t="kernel" label={oses[k]} size={14} i={1} />
          {term(k, m.out, m.t === 'ok', 3 + k)}
        </g>
      ))}
      {divide(242, [e('im Repo', 'in the repo'), e('bei allen gleich', 'the same for all')], [e('auf dem Rechner', 'on the machine'), e('bei jedem anders', 'different for each')], 6)}
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Im Repo ist der Code für alle gleich. Das JDK darunter installiert jeder selbst – und überall ist es ein anderes.', 'In the repo the code is the same for everyone. The JDK below it is installed by each person – and it differs everywhere.')} />
  </div>
)

/* ── ① 2 · with Docker: the Dockerfile puts the JDK into the image, so the machine only needs Docker ── */
const engines = [e('Docker Desktop · Linux-VM', 'Docker Desktop · Linux VM'), e('Docker Desktop · Linux-VM', 'Docker Desktop · Linux VM'), 'Docker Engine']
const built = ['$ docker build -t mensa-backend .', '[+] Building (9/9) FINISHED', '=> naming to …/mensa-backend']
export const Recipe = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} top={136} label={e('Dasselbe Repo, jetzt mit einem Dockerfile im Backend. Jeder Rechner baut daraus ein Image mit app.jar und JDK 21. Auf dem Rechner bleiben nur Docker und das Betriebssystem.', 'The same repo, now with a Dockerfile in the backend. Every machine builds an image with app.jar and JDK 21 from it. Only Docker and the operating system stay on the machine.')}>
      {who.map((_, k) => (
        <g key={k}>
          {machine(k, 234, 2)}
          <B x={col(k) + 12} y={310} w={236} h={26} t="engine" label={engines[k]} size={13} i={2} />
          <B x={col(k) + 12} y={344} w={236} h={24} t="kernel" label={oses[k]} size={13} i={2} />
          {term(k, built, true, 3 + k, 11.5)}
          <Ctr x={col(k) + 10} y={176} w={240} h={114} name="Image mensa-backend" i={6} />
          <B x={col(k) + 20} y={210} w={220} h={30} t="app" label={e('app.jar · im Image gebaut', 'app.jar · built in the image')} size={13.5} i={6} />
          <B x={col(k) + 20} y={250} w={220} h={30} t="libs" label="JDK 21 · Linux-Basis" size={13.5} i={6} />
        </g>
      ))}
      {divide(300, [e('im Image', 'in the image'), e('laut Dockerfile', 'as the Dockerfile says')], [e('auf dem Rechner', 'on the machine'), e('nur noch Docker', 'only Docker')], 7)}
    </Svg>
    <Take i={8} label={e('Merke', 'Remember')} text={e('Das Dockerfile legt fest, was ins Image kommt – auch das JDK 21, das Docker beim Bauen lädt. Auf dem Rechner muss nur noch Docker laufen.', 'The Dockerfile decides what goes into the image – including JDK 21, which Docker downloads while building. The machine only has to run Docker.')} />
  </div>
)

/* ── ① 3 · build, then run: Dockerfile → image → containers, next to the Java steps students know ── */
// Same lines as on the commands slide: the image builds the jar itself, so no JDK is needed on the machine.
const dockerfile = ['FROM maven:3.9-eclipse-temurin-21', 'WORKDIR /app', 'COPY . .', 'RUN mvn -q package -DskipTests', 'RUN cp target/*.jar app.jar', 'EXPOSE 80', 'CMD ["java", "-jar", "app.jar"]']
const running = ['backend', 'backend-test']
export const BuildRun = () => (
  <div className="dg-col">
    <Svg w={1000} h={260} label={e('Das Dockerfile wird mit docker build zum Image mensa-backend. docker run startet daraus zwei Container. Darunter die Java-Entsprechung: Mensa.java, javac, Mensa.class, new, Objekte.', 'The Dockerfile becomes the image mensa-backend with docker build. docker run starts two containers from it. Below the Java equivalent: Mensa.java, javac, Mensa.class, new, objects.')}>
      <In i={0}>
        <rect x={0} y={0} width={290} height={196} rx={14} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} />
        <text x={16} y={26} fontSize={15} fontWeight={700} fill="var(--ink)" style={mono}>Dockerfile</text>
        <Txt x={274} y={26} size={12.5} fill="#8a6a20" anchor="end">{e('das Rezept', 'the recipe')}</Txt>
        {dockerfile.map((l, k) => <text key={k} x={16} y={56 + k * 20} fontSize={12} fill="var(--ink)" style={mono}>{l}</text>)}
      </In>
      <Arrow d="M296 98 H388" i={1} />
      <In i={1}><text x={342} y={86} fontSize={11.5} fontWeight={700} fill="var(--ink-2)" textAnchor="middle" style={mono}>docker build</text></In>
      <Ctr x={396} y={0} w={220} h={196} name="Image mensa-backend" i={1} />
      <B x={410} y={36} w={192} h={40} t="app" label="app.jar" size={14} i={1} />
      <B x={410} y={84} w={192} h={40} t="libs" label="JDK 21 · Maven" size={14} i={1} />
      <B x={410} y={132} w={192} h={40} t="libs" label="Linux-Basis" size={14} i={1} />
      <Arrow d="M622 76 L706 46" i={2} /><Arrow d="M622 120 L706 150" i={2} />
      <In i={2}><text x={666} y={102} fontSize={11.5} fontWeight={700} fill="var(--ink-2)" textAnchor="middle" style={mono}>docker run</text></In>
      {running.map((n, k) => (
        <In key={n} i={2}>
          <rect x={716} y={k * 108} width={284} height={88} rx={12} fill="#fff" stroke="var(--svc-api)" strokeWidth={2.5} />
          <Txt x={730} y={k * 108 + 22} size={14} w={700} fill="var(--svc-api-d)">{`Container ${n}`}</Txt>
          <circle cx={928} cy={k * 108 + 17} r={5} fill="var(--ok)" />
          <Txt x={984} y={k * 108 + 22} size={12.5} w={700} fill="var(--ok)" anchor="end">{e('läuft', 'running')}</Txt>
          <text x={744} y={k * 108 + 60} fontSize={13} fill="var(--ink)" style={mono}>java -jar app.jar</text>
          <rect x={730} y={k * 108 + 36} width={256} height={38} rx={8} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        </In>
      ))}
      <Tag x={0} y={222} w={290} label={e('≈ Mensa.java · Quellcode', '≈ Mensa.java · source code')} tone="sky" size={14} i={3} />
      <Tag x={396} y={222} w={220} label={e('≈ Mensa.class · fest', '≈ Mensa.class · fixed')} tone="sky" size={14} i={3} />
      <Tag x={716} y={222} w={284} label={e('≈ new Mensa() · Objekte', '≈ new Mensa() · objects')} tone="sky" size={14} i={3} />
      <Label x={343} y={242} size={12} weight={700} mono tone="muted" i={3}>≈ javac</Label>
      <Label x={667} y={242} size={12} weight={700} mono tone="muted" i={3}>≈ new</Label>
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('`docker build` macht aus dem Dockerfile ein Image – wie javac aus Java-Code eine .class. `docker run` startet daraus Container – wie new Objekte.', '`docker build` turns the Dockerfile into an image – like javac turns Java code into a .class. `docker run` starts containers from it – like new creates objects.')} />
  </div>
)

/* ── ② 1 · what a container is: four separate walls around one process, each its own kernel mechanism ── */
const px = (k: number) => 30 + k * 240
const panel = (k: number, title: string, sub: string, how: string, body: ReactNode) => (
  <g key={k}>
    <In i={1 + k}>
      <rect x={px(k)} y={66} width={220} height={258} rx={12} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
      <Txt x={px(k) + 14} y={92} size={15} w={700} fill="var(--ink)">{title}</Txt>
      <Txt x={px(k) + 14} y={112} size={12.5} fill="var(--ink-3)">{sub}</Txt>
      {body}
    </In>
    <B x={px(k) + 10} y={280} w={200} h={34} t="kchip" label={how} size={13} i={1 + k} />
    <Wire d={`M${px(k) + 110} 314 V350`} i={5} />
  </g>
)
const code = (x: number, y: number, s: string, fill = 'var(--ink)') => <text x={x} y={y} fontSize={13} fill={fill} style={mono}>{s}</text>
export const Inside = () => (
  <div className="dg-col">
    <Svg w={1000} h={448} label={e('Ein Container ist ein Prozess mit vier getrennten Wänden. Dateien: ein eigenes Verzeichnis aus dem Image, per Mount-Namespace. Name und Netz: eigener Hostname und eigene Netzkarte im Docker-Netz, per UTS- und Network-Namespace. Prozesse: im Container PID 1, auf dem Host PID 4711, per PID-Namespace. Ressourcen: höchstens ein CPU-Kern und 512 MB, per cgroups. Die Docker Engine legt alle vier um den Prozess, der Linux-Kernel setzt sie um.', 'A container is a process with four separate walls. Files: a directory of its own from the image, via the mount namespace. Name and network: its own host name and network card in the Docker network, via UTS and network namespaces. Processes: PID 1 inside the container, PID 4711 on the host, via the PID namespace. Resources: at most one CPU core and 512 MB, via cgroups. The Docker Engine puts all four around the process, the Linux kernel enforces them.')}>
      <In i={0}>
        <rect x={0} y={0} width={1000} height={446} rx={16} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
        <Txt x={16} y={23} size={14} w={700} fill="var(--ink-2)">{e('Dein Rechner', 'Your machine')}</Txt>
      </In>
      <Ctr x={16} y={32} w={968} h={304} name={e('Container backend = ein Prozess (java -jar app.jar) mit vier getrennten Wänden', 'Container backend = one process (java -jar app.jar) with four separate walls')} i={0} />
      {panel(0, e('Dateisystem', 'File system'), e('kommt aus dem Image', 'comes from the image'), 'Mount-Namespace', <>
        {code(px(0) + 16, 144, '/')}{code(px(0) + 16, 166, '├ app/app.jar')}{code(px(0) + 16, 188, '├ opt/java   JDK 21')}{code(px(0) + 16, 210, '├ etc/')}{code(px(0) + 16, 232, '└ bin/')}
        <Txt x={px(0) + 16} y={262} size={12} fill="var(--ink-3)">{e('Host-Dateien sieht er nicht', 'host files stay invisible')}</Txt>
      </>)}
      {panel(1, e('Name und Netz', 'Name and network'), e('eigene Identität im Docker-Netz', 'own identity in the Docker network'), 'UTS- + Network-NS', <>
        {code(px(1) + 16, 144, 'hostname: backend')}{code(px(1) + 16, 172, 'eth0: 172.18.0.3')}{code(px(1) + 16, 200, t(e('localhost = er selbst', 'localhost = itself')))}
        <rect x={px(1) + 16} y={218} width={188} height={30} rx={8} fill="#f7faff" stroke="var(--blue)" strokeDasharray="5 4" strokeWidth={1.5} />
        <Txt x={px(1) + 110} y={238} size={12.5} w={700} fill="var(--blue-deep)" anchor="middle">{e('steckt im Docker-Netz', 'plugged into the Docker network')}</Txt>
      </>)}
      {panel(2, e('Prozessliste', 'Process list'), e('sieht nur sich selbst', 'sees only itself'), 'PID-Namespace', <>
        <Txt x={px(2) + 16} y={144} size={12} w={700} fill="var(--ink-3)">{e('im Container', 'in the container')}</Txt>
        <Txt x={px(2) + 124} y={144} size={12} w={700} fill="var(--ink-3)">{e('auf dem Host', 'on the host')}</Txt>
        <rect x={px(2) + 10} y={154} width={200} height={30} rx={6} fill="#e2f5ec" />
        {code(px(2) + 16, 174, 'PID 1 java', 'var(--ok)')}{code(px(2) + 124, 174, 'PID 4711')}
        {code(px(2) + 16, 206, '–', 'var(--ink-3)')}{code(px(2) + 124, 206, 'PID 1 init', 'var(--ink-3)')}
        {code(px(2) + 16, 230, '–', 'var(--ink-3)')}{code(px(2) + 124, 230, 'PID 812 …', 'var(--ink-3)')}
        <Txt x={px(2) + 16} y={262} size={12} fill="var(--ink-3)">{e('derselbe Prozess, zwei Nummern', 'same process, two numbers')}</Txt>
      </>)}
      {panel(3, e('Ressourcen', 'Resources'), e('Grenzen, keine eigene Sicht', 'limits, not a view'), 'cgroups', <>
        {([[e('CPU ≤ 1 Kern', 'CPU ≤ 1 core'), 0.25], [e('RAM ≤ 512 MB', 'RAM ≤ 512 MB'), 0.4]] as const).map(([l, f], j) => (
          <g key={j}>
            <Txt x={px(3) + 16} y={148 + j * 52} size={13} w={700} fill="var(--ink)">{l}</Txt>
            <rect x={px(3) + 16} y={158 + j * 52} width={188} height={12} rx={6} fill="#e3e8f0" />
            <rect x={px(3) + 16} y={158 + j * 52} width={188 * f} height={12} rx={6} fill="var(--blue)" />
          </g>
        ))}
        <Txt x={px(3) + 16} y={262} size={12} fill="var(--ink-3)">{e('mehr gibt der Kernel nicht her', 'the kernel gives no more')}</Txt>
      </>)}
      <B x={16} y={350} w={968} h={40} t="engine" label={e('Docker Engine (dockerd) · bündelt die vier Wände unter einem Namen', 'Docker Engine (dockerd) · bundles the four walls under one name')} size={14} i={5} />
      <B x={16} y={398} w={968} h={40} t="kernel" label={e('Linux-Kernel · setzt jede Wand einzeln um, für alle Container derselbe', 'Linux kernel · enforces each wall separately, the same for all containers')} size={14} i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('„Container“ ist kein eigenes Ding im Kernel, sondern ein Bündel getrennter Wände um einen normalen Prozess: Dateisystem (Mount-Namespace), Name und Netz (UTS- und Network-Namespace), Prozessliste (PID-Namespace) und Ressourcen (cgroups). Weil die Docker Engine alle vier zusammen anlegt, hält der Prozess sich für ein eigenes System.', '“Container” is not a thing of its own in the kernel but a bundle of separate walls around a normal process: file system (mount namespace), name and network (UTS and network namespaces), process list (PID namespace) and resources (cgroups). Because the Docker Engine sets up all four together, the process believes it is a system of its own.')} />
  </div>
)

/* ── ② 2 · java -jar, docker run, podman run and a VM side by side, with what really differs ── */
const cx = (k: number) => 290 + k * 178
type Val = 'ok' | 'bad' | string
const facts: [string, Val, Val, Val, Val][] = [
  [e('eigene Umgebung (JDK 21)', 'own environment (JDK 21)'), 'bad', 'ok', 'ok', 'ok'],
  [e('nutzt den Kernel des Rechners', 'uses the machine’s kernel'), 'ok', 'ok', 'ok', 'bad'],
  [e('Hintergrunddienst', 'Background service'), '–', 'dockerd', e('keiner', 'none'), 'Hypervisor'],
  [e('zusätzliche Startzeit', 'extra start-up time'), '–', '< 1 s', '< 1 s', e('OS bootet', 'OS boots')],
  [e('läuft überall gleich', 'runs the same everywhere'), 'bad', 'ok', 'ok', 'ok'],
]
const boxed = (x: number, i: number) => (
  <>
    <Ctr x={x} y={44} w={166} h={116} name="Container" i={i} />
    <B x={x + 10} y={72} w={146} h={36} t="app" label="app.jar" size={14} i={i} />
    <B x={x + 10} y={114} w={146} h={36} t="libs" label="JDK 21 · Linux" size={13} i={i} />
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
      {boxed(cx(1), 2)}
      <B x={cx(1)} y={168} w={166} h={38} t="engine" label={e('Docker Engine · dockerd', 'Docker Engine · dockerd')} size={12.5} i={2} />
      {boxed(cx(2), 4)}
      <B x={cx(2)} y={168} w={166} h={38} t="gone" label={e('nichts, kein Daemon', 'nothing, no daemon')} size={12} i={4} />
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
    <Take i={13} label={e('Merke', 'Remember')} text={e('Docker und Podman starten dieselben Images als Prozess auf dem Kernel des Rechners. Bei Docker sitzt die Docker Engine (dockerd) dazwischen, Podman kommt ohne Hintergrunddienst aus. Eine VM bootet ein eigenes Betriebssystem: stärker getrennt, aber schwerer.', 'Docker and Podman start the same images as a process on the machine’s kernel. With Docker the Docker Engine (dockerd) sits in between, Podman does without a background service. A VM boots an operating system of its own: more strongly separated, but heavier.')} />
  </div>
)

/* ── ③ 1 · where images come from: Docker Hub is to images what Maven Central is to libraries ── */
type Chip = [string, boolean?]
const chipRow = (x: number, y: number, chips: Chip[]) => {
  let cx0 = x
  return chips.map(([l, own]) => {
    const w = l.length * 7.2 + 16, at = cx0
    cx0 += w + 8
    return (
      <g key={l}>
        <rect x={at} y={y} width={w} height={26} rx={7} fill={own ? 'var(--svc-api)' : '#fff'} stroke={own ? 'var(--svc-api)' : 'var(--blue)'} strokeWidth={1.5} />
        <text x={at + w / 2} y={y + 17} fontSize={12} fontWeight={700} fill={own ? '#fff' : 'var(--blue-deep)'} textAnchor="middle" style={mono}>{l}</text>
      </g>
    )
  })
}
const source = (x: number, i: number, file: string, lines: string[], hub: string, hubSub: string, hubChips: Chip[], local: string, localChips: Chip[][]) => (
  <>
    <In i={i}>
      <rect x={x} y={0} width={460} height={76} rx={12} fill="#fff3d6" stroke="var(--keel)" strokeWidth={2} />
      <text x={x + 16} y={24} fontSize={14} fontWeight={700} fill="var(--ink)" style={mono}>{file}</text>
      {lines.map((l, k) => <text key={k} x={x + 16} y={46 + k * 20} fontSize={12.5} fill="var(--ink)" style={mono}>{l}</text>)}
    </In>
    <Arrow d={`M${x + 230} 80 V108`} i={i + 1} />
    <Label x={x + 242} y={99} anchor="start" size={12.5} tone="muted" i={i + 1}>{e('fragt an', 'asks for')}</Label>
    <In i={i + 1}>
      <rect x={x} y={116} width={460} height={96} rx={18} fill="#eef4ff" stroke="var(--blue-deep)" strokeWidth={2} />
      <Icon name="warehouse" x={x + 14} y={124} s={40} />
      <Txt x={x + 64} y={142} size={15} w={700} fill="var(--ink)">{hub}</Txt>
      <Txt x={x + 64} y={160} size={12.5} fill="var(--ink-3)">{hubSub}</Txt>
      {chipRow(x + 14, 176, hubChips)}
    </In>
    <Arrow d={`M${x + 230} 216 V244`} i={i + 2} />
    <Label x={x + 242} y={235} anchor="start" size={12.5} tone="muted" i={i + 2}>{e('lädt herunter', 'downloads')}</Label>
    <In i={i + 2}>
      <rect x={x} y={250} width={460} height={108} rx={14} fill="var(--c-host)" stroke="#c3cddb" strokeWidth={1.5} />
      <Txt x={x + 16} y={273} size={14} w={700} fill="var(--ink-2)">{local}</Txt>
      {localChips.map((row, k) => <g key={k}>{chipRow(x + 14, 286 + k * 34, row)}</g>)}
    </In>
  </>
)
export const Registry = () => (
  <div className="dg-col">
    <Svg w={1000} h={362} label={e('Links Java: pom.xml fragt Maven Central an, Bibliotheken landen in ~/.m2. Rechts Docker: Dockerfile und compose.yaml fragen Docker Hub an, Images landen lokal. mensa-backend baust du selbst.', 'Left Java: pom.xml asks Maven Central, libraries land in ~/.m2. Right Docker: Dockerfile and compose.yaml ask Docker Hub, images land locally. You build mensa-backend yourselves.')}>
      {source(0, 0, 'pom.xml', ['<artifactId>spring-boot-starter-web</artifactId>', '<artifactId>postgresql</artifactId>'], 'Maven Central', e('öffentliches Lager für Bibliotheken', 'public store for libraries'), [['spring-boot-starter-web'], ['postgresql']], e('Dein Rechner · ~/.m2', 'Your machine · ~/.m2'), [[['spring-boot-starter-web-3.4.1.jar']], [['postgresql-42.7.4.jar']]])}
      {source(540, 3, 'Dockerfile · compose.yaml', ['FROM maven:3.9-eclipse-temurin-21', 'image: postgres:18'], 'Docker Hub', e('öffentliches Lager für Images', 'public store for images'), [['maven:3.9-eclipse-temurin-21'], ['postgres:18']], e('Dein Rechner · lokale Images', 'Your machine · local images'), [[['maven:3.9-eclipse-temurin-21'], ['postgres:18']], [[e('mensa-backend · selbst gebaut', 'mensa-backend · built yourselves'), true]]])}
      <In i={4}><Txt x={500} y={176} size={34} w={700} fill="var(--ink-3)" anchor="middle">≈</Txt></In>
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Docker Hub ist für Images, was Maven Central für Bibliotheken ist: `FROM` und `image:` laden fertige Images herunter. Dein eigenes Image baust du selbst.', 'Docker Hub is to images what Maven Central is to libraries: `FROM` and `image:` download ready images. You build your own image yourselves.')} />
  </div>
)

/* ── ② 3 · the one commands slide ── */
export const Commands = () => (
  <div className="dg-col">
    <div className="dg-col">
      <Code title="Dockerfile" kind="file" lines={[
        { t: 'FROM maven:3.9-eclipse-temurin-21', chip: e('Linux mit JDK 21 und Maven', 'Linux with JDK 21 and Maven') },
        { t: 'WORKDIR /app', chip: e('Arbeitsordner im Image', 'working folder in the image') },
        { t: 'COPY . .', chip: e('dein Quellcode hinein', 'your source code inside') },
        { t: 'RUN mvn -q package -DskipTests', chip: e('im Image bauen', 'build in the image') },
        { t: 'RUN cp target/*.jar app.jar', chip: e('Jar umbenennen', 'rename the jar') },
        { t: 'EXPOSE 80', chip: e('Port der App', 'port of the app') },
        { t: 'CMD ["java", "-jar", "app.jar"]', chip: e('so startet sie', 'how it starts') },
      ]} />
      <Code title="Terminal" i={1} lines={[
        { t: 'docker pull postgres:18', k: 'cmd', chip: e('Image herunterladen', 'download image') },
        { t: 'docker build -t mensa-backend:1.0 .', k: 'cmd', chip: e('Image bauen', 'build image') },
        { t: 'docker run -d -p 80:80 --name backend mensa-backend:1.0', k: 'cmd', chip: e('starten', 'start') },
        { t: 'docker ps', k: 'cmd', chip: e('laufende Container anzeigen', 'show running containers') },
        { t: 'docker logs backend', k: 'cmd', chip: e('Ausgaben lesen', 'read the output') },
        { t: 'docker stop backend', k: 'cmd', chip: e('anhalten', 'stop') },
        { t: 'docker rm backend', k: 'cmd', chip: e('entfernen', 'remove') },
      ]} />
    </div>
    <Svg w={1000} h={120} label={e('Was die Teile von docker run bedeuten', 'What the parts of docker run mean')}>
      {([['-d', e('im Hintergrund', 'in the background')], ['-p 80:80', e('Host-Port → Container-Port', 'host port → container port')], ['--name backend', e('Name des Containers', 'name of the container')], ['mensa-backend:1.0', e('welches Image', 'which image')]] as const).map(([c, l], k) => (
        <In key={c} i={2 + k}>
          <rect x={k * 250} y={10} width={236} height={86} rx={14} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
          <text x={k * 250 + 118} y={44} textAnchor="middle" fontSize={16} style={{ fontFamily: "var(--mono)" }} fontWeight={700} fill="var(--blue-deep)">{c}</text>
          <Txt x={k * 250 + 118} y={74} size={13} anchor="middle">{l}</Txt>
        </In>
      ))}
    </Svg>
  </div>
)
