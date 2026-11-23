import { at } from '../../components/Stack.tsx'
import { Svg, Box, Arrow, Label, Zone, Wire, Ctr, Num, Tick, Take, type BoxTone } from '../../components/Svg.tsx'
import { Code, type Line } from '../../components/Code.tsx'

// Detailed diagrams for the deeper sub-chapters of this topic. The overview sub-chapter draws with views.tsx.

/* ═══ Isolation ═══ */
/* The same two processes under two numbers. */
export const PidNs = () => (
  <div className="dg-col">
    <Svg w={1000} h={320} label="Dieselben Prozesse mit anderen Nummern: Host-Sicht und Sicht im Container">
      <Zone x={0} y={0} w={420} h={320} label="ps auf dem Host" />
      <Zone i={3} x={580} y={0} w={420} h={320} t="container" label="ps im Container frontend" />
      <Box i={1} x={24} y={44} w={372} h={50} t="host" label="PID 1 · systemd" size={15} />
      <Box i={1} x={24} y={106} w={372} h={50} t="engine" label="PID 812 · dockerd" size={15} />
      <Box i={2} x={24} y={168} w={372} h={50} t="libs" label="PID 4021 · nginx master" size={15} />
      <Box i={2} x={24} y={230} w={372} h={50} t="libs" label="PID 4030 · nginx worker" size={15} />
      <Box i={3} x={604} y={44} w={372} h={50} t="gone" label="systemd: nicht sichtbar" size={15} />
      <Box i={3} x={604} y={106} w={372} h={50} t="gone" label="dockerd: nicht sichtbar" size={15} />
      <Box i={4} x={604} y={168} w={372} h={50} t="libs" label="PID 1 · nginx master" size={15} />
      <Box i={4} x={604} y={230} w={372} h={50} t="libs" label="PID 7 · nginx worker" size={15} />
      <Arrow i={5} kind="back" both d="M398 193 H602" label="derselbe Prozess" lx={500} ly={182} />
      <Arrow i={5} kind="back" both d="M398 255 H602" label="derselbe Prozess" lx={500} ly={244} />
    </Svg>
    <Take i={6} label="Namespace" text="Der Kernel zeigt jedem Prozess nur seinen Ausschnitt. Für Netz, Dateien und Hostname funktioniert das genauso. Endet PID 1, endet der Container." />
  </div>
)

/* cgroups: memory as tanks with a fill line. Height = limit. */
const tanks: { n: string; lim: string; use: string; h: number; fill: number; bad?: boolean; x: number }[] = [
  { n: 'frontend', lim: '512 MB', use: '300 MB', h: 110, fill: .6, x: 30 },
  { n: 'db', lim: '2 GB', use: '1,4 GB', h: 200, fill: .7, x: 200 },
  { n: 'job', lim: '256 MB', use: 'will 400 MB', h: 70, fill: 1, bad: true, x: 370 },
]

const tankB = 262

export const Cgroups = () => (
  <div className="dg-col">
    <Svg w={1000} h={290} label="cgroups: Jeder Container hat eine Speichergrenze, beim Überschreiten beendet der Kernel den Prozess">
      <Zone x={0} y={0} w={1000} h={290} t="app" label="Arbeitsspeicher des Hosts · 8 GB" />
      {tanks.map((c, k) => {
        const top = tankB - c.h
        return (
          <g key={c.n}>
            <g className="sb" data-t={c.bad ? 'bad' : 'libs'} style={at(1 + k)}><rect x={c.x} y={tankB - c.h * c.fill} width={130} height={c.h * c.fill} rx={4} /></g>
            <g className="sa" data-k={c.bad ? 'bad' : 'go'} style={at(1 + k)}><path d={`M${c.x} ${top} V${tankB} H${c.x + 130} V${top}`} /><path d={`M${c.x - 8} ${top} H${c.x + 138}`} strokeDasharray="5 4" /></g>
            <Label i={1 + k} x={c.x + 65} y={top - 10} size={13} weight={700} tone={c.bad ? 'bad' : undefined}>{`Grenze ${c.lim}`}</Label>
            <Label i={1 + k} x={c.x + 65} y={tankB - 8} size={13} weight={600} tone={c.bad ? 'bad' : undefined}>{c.use}</Label>
            <Label i={1 + k} x={c.x + 65} y={280} size={14} weight={700}>{c.n}</Label>
          </g>
        )
      })}
      <Arrow i={4} kind="bad" d="M502 212 H566" n={1} nx={534} ny={190} />
      <Box i={4} x={570} y={176} w={180} h={72} t="kernel" label="OOM-Killer" sub="im Kernel" size={16} />
      <Arrow i={5} kind="bad" d="M752 212 H806" n={2} nx={779} ny={190} />
      <Box i={5} x={810} y={176} w={170} h={72} t="bad" label="Exit-Code 137" sub="128 + Signal 9" size={16} />
      <Arrow i={6} kind="back" d="M895 174 V100 H700" label="restart-Regel startet neu" lx={800} ly={90} />
      <Box i={6} x={570} y={70} w={128} h={56} t="engine" label="job" sub="neu gestartet" size={15} />

    </Svg>
    <Take i={7} label="Merke" text="Mit `--memory 512m` bekommt ein Container eine feste Grenze. Durchgesetzt wird sie vom Kernel, nicht von der Anwendung." />
  </div>
)

/* ═══ Alles zusammen ═══ */
/* Closing picture: every part of one command lands somewhere in the system. */
const sumLines: Line[] = [
  { t: 'docker run -d \\', k: 'cmd' },
  { t: '    --name frontend \\', k: 'cont', n: 1 },
  { t: '    -p 8080:80 \\', k: 'cont', n: 2 },
  { t: '    -v daten:/data \\', k: 'cont', n: 3 },
  { t: '    --memory 512m \\', k: 'cont', n: 4 },
  { t: '    nginx:1.27', k: 'cont', n: 5 },
  { t: '# ohne Option, immer dabei:', k: 'note' },
  { t: '# eigene Namespaces', k: 'note', n: 6 },
]

export const RunSummary = () => (
  <div className="dg-split">
    <Code title="Terminal" lines={sumLines} />
    <Svg w={620} h={480} label="Jede Option des Befehls und der Ort im System, an dem sie wirkt">
      <Zone x={0} y={0} w={620} h={480} t="app" label="Docker Host" />
      <Zone i={1} x={12} y={34} w={596} h={136} label="Userspace" />
      <Ctr i={2} x={150} y={60} w={330} h={98} name="Container frontend" />
      <Box i={2} x={166} y={92} w={298} h={54} t="libs" label="nginx" sub="sieht nur sich selbst" size={15} />
      <Num i={3} n={1} x={480} y={60} /><Num i={3} n={6} x={150} y={60} />
      <Zone i={4} x={12} y={180} w={596} h={132} t="kernel" label="Kernel" />
      <Box i={5} x={26} y={214} w={136} h={84} t="engine" label="NAT-Regel" sub="8080 → 80" size={14} />
      <Box i={5} x={172} y={214} w={136} h={84} t="kchip" label="cgroup" sub="Speichergrenze" size={14} />
      <Box i={5} x={318} y={214} w={136} h={84} t="kchip" label="Namespaces" sub="pid, net, mnt …" size={14} />
      <Box i={5} x={464} y={214} w={132} h={84} t="kchip" label="OverlayFS" sub="Layer zu /" size={14} />
      <Num i={6} n={2} x={148} y={228} /><Num i={6} n={4} x={294} y={228} /><Num i={6} n={6} x={440} y={228} /><Num i={6} n={5} x={582} y={228} />
      <Zone i={7} x={12} y={322} w={596} h={146} t="reg" label="Festplatte" />
      <Box i={8} x={26} y={356} w={270} h={98} label="volumes/daten/_data" sub="bleibt nach docker rm" size={14} mono />
      <Box i={8} x={326} y={356} w={270} h={98} label="overlay2/…" sub="Layer von nginx:1.27" size={14} mono />
      <Num i={9} n={3} x={282} y={370} /><Num i={9} n={5} x={582} y={370} />
      <Arrow i={9} d="M530 354 V302" /><Arrow i={9} d="M167 354 V162" />
    </Svg>
  </div>
)

const Seg = ({ x, y, w, t, i }: { x: number; y: number; w: number; t: BoxTone; i: number }) => <g className="sb" data-t={t} style={at(i)}><rect x={x} y={y} width={w} height={22} rx={6} /></g>

/* Limits are ceilings on a shared machine. */
const limLines: Line[] = [
  'services:', '  api:',
  { t: '    mem_limit: 512m', chip: 'höchstens 512 MB' },
  { t: '    cpus: 1.5', chip: 'höchstens 1,5 Kerne' },
  { t: '    pids_limit: 200', chip: 'höchstens 200 Prozesse' },
  { t: '    read_only: true', chip: 'Dateisystem nur lesen' },
  { t: '    tmpfs: [/tmp]', chip: 'schreibbar im RAM' },
  { t: '    cap_drop: [ALL]', chip: 'keine Sonderrechte' },
  '  db:',
  { t: '    mem_limit: 2g', chip: 'höchstens 2 GB' },
  { t: '    cpus: 2', chip: 'höchstens 2 Kerne' },
  '  cache:',
  { t: '    mem_limit: 256m', chip: 'höchstens 256 MB' },
]

const gb = 118

const mem: [string, number, number, string][] = [['api', .3, .5, '512 MB'], ['db', 1.4, 2, '2 GB'], ['cache', .1, .25, '256 MB']]

export const Limits = () => (
  <div className="dg-split">
    <Code kind="file" title="compose.yaml" lines={limLines} />
    <div className="dg-col">
      <Svg w={600} h={350} label="Speicher und CPU eines Hosts mit den Grenzen der Services">
        <Zone x={0} y={0} w={600} h={186} t="app" label="Arbeitsspeicher des Hosts · 4 GB" />
        {mem.map(([n, use, lim, txt], k) => {
          const y = 42 + k * 46
          return (
            <g key={n}>
              <Label i={1 + k} x={18} y={y + 22} anchor="start" size={14} weight={700}>{n}</Label>
              <Seg i={1 + k} x={80} y={y + 4} w={4 * gb} t="host" />
              <Seg i={1 + k} x={80} y={y + 4} w={use * gb} t="engine" />
              <g className="sa" data-k="bad" style={at(1 + k)}><path d={`M${80 + lim * gb} ${y - 2} V${y + 32}`} /></g>
              <Label i={1 + k} x={88 + lim * gb} y={y + 21} anchor="start" size={12} weight={600}>{`Grenze ${txt}`}</Label>
            </g>
          )
        })}
        <Zone i={4} x={0} y={200} w={600} h={150} t="app" label="CPU des Hosts · 4 Kerne" />
        {[0, 1, 2, 3].map(k => <g key={k} className="sb" data-t="host" style={at(4)}><rect x={80 + k * 118} y={238} width={112} height={96} rx={8} /></g>)}
        <Label i={5} x={18} y={262} anchor="start" size={14} weight={700}>api</Label><Label i={6} x={18} y={312} anchor="start" size={14} weight={700}>db</Label>
        <Seg i={5} x={80} y={246} w={1.5 * 118 - 3} t="engine" />
        <Seg i={6} x={80} y={298} w={2 * 118 - 6} t="kchip" />
      </Svg>
      <Take i={7} label="Wichtig" text="Ein Limit ist eine Obergrenze, keine Reservierung. Dieser Platz wird niemandem freigehalten." />
    </div>
  </div>
)

/* ═══ Isolation ═══ */
/* One kernel holds everything; namespaces decide which slice a process is shown. */
const nsX = [90, 396, 702]

const nsW = 290

const nsRows: [string, string, string, string][] = [
  ['pid', '1 systemd · 812 dockerd · …', '1 nginx · 7 nginx', '1 postgres'],
  ['net', 'eth0 192.168.1.20', 'eth0 172.17.0.2', 'eth0 172.17.0.3'],
  ['mnt', '/ = Ubuntu auf der Platte', '/ = Dateien aus nginx:1.27', '/ = Dateien aus postgres:18'],
  ['uts', 'Hostname server01', 'Hostname a3f9c2e1', 'Hostname 7c1e04bd'],
  ['ipc', 'Shared Memory des Hosts', 'eigener leerer Bereich', 'eigener leerer Bereich'],
]

const nsT = ['host', 'libs', 'reg'] as const

export const NsMap = () => (
  <div className="dg-col">
    <Svg w={1000} h={500} label="Ein Kernel hält alle Prozesse, Namespaces zeigen jedem Prozess nur seinen Ausschnitt">
      <Zone x={0} y={0} w={1000} h={136} label="USERSPACE · drei Prozesse stellen dieselbe Frage" />
      <Box i={1} x={nsX[0]} y={46} w={nsW} h={72} t="app" label="bash" sub="direkt auf dem Host" />
      <Box i={2} x={nsX[1]} y={46} w={nsW} h={72} t="container" label="nginx" sub="Container frontend" />
      <Box i={3} x={nsX[2]} y={46} w={nsW} h={72} t="container" label="postgres" sub="Container db" />
      <Zone i={4} x={0} y={166} w={1000} h={334} t="kernel" label="KERNEL · einer für alle" sub="jeder Prozess bekommt nur seine Spalte" />
      {nsX.map((x, k) => <Arrow key={x} i={1 + k} d={`M${x + nsW / 2} 120 V162`} label={k === 0 ? 'Was gibt es hier?' : undefined} lx={x + nsW / 2 + 12} ly={157} anchor="start" />)}
      {nsRows.map(([n, ...c], r) => (
        <g key={n}>
          <Box i={5 + r} x={14} y={204 + r * 40} w={68} h={34} t="kchip" label={n} size={13} mono />
          {c.map((v, k) => <Box key={k} i={5 + r} x={nsX[k]} y={204 + r * 40} w={nsW} h={34} t={nsT[k]} label={v} size={13} />)}
        </g>
      ))}
      <Box i={10} x={14} y={410} w={68} h={34} t="bad" label="user" size={13} mono />
      <Box i={10} x={nsX[0]} y={410} w={nsX[2] + nsW - nsX[0]} h={34} t="bad" label="UID 0 ist überall derselbe root: Standardmäßig ist dieser Namespace nicht aktiv" size={13} />
      <Box i={11} x={14} y={452} w={68} h={34} t="gone" label="kein NS" size={12} />
      <Box i={11} x={nsX[0]} y={452} w={nsX[2] + nsW - nsX[0]} h={34} t="app" label="Kernel-Version, Kernel-Module und Hardware: für alle gleich, nicht getrennt" size={13} />
    </Svg>
  </div>
)

/* cgroup limits are plain files that runc writes and the kernel enforces. */
const limits: [string, string, string, string, string][] = [
  ['--memory 512m', 'memory.max', '536870912', 'über 512 MB', 'OOM-Kill, Exit-Code 137'],
  ['--cpus 1.5', 'cpu.max', '150000 100000', '150 ms je 100 ms', 'danach wird gebremst'],
  ['--pids-limit 100', 'pids.max', '100', 'mehr als 100 Prozesse', 'fork() schlägt fehl'],
]

export const CgroupFiles = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label="Limits werden von runc in cgroup-Dateien geschrieben und vom Kernel durchgesetzt">
      <Zone x={0} y={0} w={1000} h={120} label="USERSPACE" />
      <Box i={1} x={20} y={40} w={620} h={62} t="hw" label="docker run --memory 512m --cpus 1.5 --pids-limit 100 nginx" size={13} mono />
      <Arrow i={2} d="M642 71 H756" />
      <Box i={2} x={760} y={40} w={220} h={62} t="kchip" label="runc" sub="schreibt die Werte" size={16} />
      <Arrow i={3} d="M870 104 V146" />
      <Zone i={3} x={0} y={150} w={1000} h={250} t="kernel" label="KERNEL · Limits sind Dateien" sub="/sys/fs/cgroup/system.slice/docker-e5f6….scope/" />
      {limits.map(([f, file, v, when, what], k) => (
        <g key={f}>
          <Box i={4 + k} x={20 + k * 330} y={190} w={300} h={84} t="kchip" label={f} sub={`${file} = ${v}`} size={15} mono />
          <Wire i={4 + k} d={`M${170 + k * 330} 276 V298`} />
          <Box i={4 + k} x={20 + k * 330} y={300} w={300} h={84} t="app" label={when} sub={what} size={15} />
        </g>
      ))}
    </Svg>
    <Take i={7} label="Kern" text="Docker überwacht die Grenzen nicht selbst. Es trägt sie einmal ein, ab dann setzt sie der Kernel durch." />
  </div>
)

/* The way of a system call through the protection layers. */
const gates: [string, string, number][] = [['seccomp', 'filtert Systemaufrufe', 300], ['Capabilities', '14 von 41 Rechten', 500], ['AppArmor / SELinux', 'Regeln für Pfade', 700]]

const lanes: { y: number; c: string; s: string; stop: number | null }[] = [
  { y: 130, c: 'open("/index.html")', s: 'Datei lesen', stop: null },
  { y: 210, c: 'bind(:80)', s: 'Port öffnen', stop: null },
  { y: 290, c: 'Netzgerät anlegen', s: 'braucht CAP_NET_ADMIN', stop: 1 },
  { y: 370, c: 'init_module()', s: 'Kernel-Modul laden', stop: 0 },
]

export const Gates = () => (
  <div className="dg-col">
    <Svg w={1000} h={420} label="Vier Systemaufrufe auf dem Weg vom Container zum Kernel durch drei Schutzschichten">
      <Ctr x={0} y={50} w={110} h={370} name="nginx" />
      <Label x={55} y={100} size={13} tone="muted">als root</Label><Label x={55} y={118} size={13} tone="muted">im Container</Label>
      {gates.map(([n, s, x], k) => (
        <g key={n}>
          <Zone i={1 + k} x={x} y={0} w={150} h={420} t="libs" />
          <Label i={1 + k} x={x + 75} y={26} size={k === 2 ? 13 : 15} weight={700}>{n}</Label>
          <Label i={1 + k} x={x + 75} y={46} size={12} tone="muted">{s}</Label>
        </g>
      ))}
      <Zone i={4} x={890} y={0} w={110} h={420} t="kernel" />
      <g className="sb" data-t="kernel" style={at(4)}><text x={945} y={214} textAnchor="middle" fontSize={17} fontWeight={700}>Kernel</text></g>
      {lanes.map((l, k) => {
        const i = 5 + k
        const end = l.stop === null ? 886 : gates[l.stop][2] + 75 - 14
        return (
          <g key={l.c}>
            <Arrow i={i} kind={l.stop === null ? 'ok' : 'bad'} d={`M112 ${l.y} H${end}`} />
            <Label i={i} x={120} y={l.y - 10} anchor="start" size={13} weight={700} mono>{l.c}</Label>
            <Label i={i} x={120} y={l.y + 20} anchor="start" size={13} tone="muted">{l.s}</Label>
            {l.stop !== null ? <Tick i={i} bad x={gates[l.stop][2] + 75} y={l.y} /> : <Tick i={i} ok x={868} y={l.y - 18} />}
          </g>
        )
      })}
    </Svg>
    <Take i={9} label="Merke" text="root im Container ist nicht allmächtig: Jeder Aufruf an den Kernel muss diese Schichten passieren." />
  </div>
)

/* Closing picture: every mechanism of one container, and the command that shows it on a real host. */
const proofLines: Line[] = [
  { t: '# Container frontend, PID 4021 auf dem Host', k: 'note' },
  { t: 'ls -l /proc/4021/ns', k: 'cmd', n: 1 },
  { t: 'cat /sys/fs/cgroup/…/memory.max', k: 'cmd', n: 2 },
  { t: 'mount | grep overlay', k: 'cmd', n: 3 },
  { t: 'iptables -t nat -L DOCKER', k: 'cmd', n: 4 },
  { t: 'ip link show type veth', k: 'cmd', n: 5 },
  { t: 'ps -ef --forest', k: 'cmd', n: 6 },
  { t: 'grep -E "Cap|Seccomp" /proc/4021/status', k: 'cmd', n: 7 },
]

const mech: [string, string, number][] = [['Namespaces', 'pid, net, mnt …', 1], ['cgroup', 'memory.max', 2], ['OverlayFS', 'Layer werden zu /', 3], ['NAT-Regel', '8080 → 80', 4], ['veth, Bridge', 'Kabel ins Netz', 5], ['Capabilities', 'und seccomp', 7]]

export const ProofMap = () => (
  <div className="dg-split">
    <Code title="Terminal auf dem Host" lines={proofLines} />
    <Svg w={620} h={480} label="Alle Mechanismen eines Containers und wo sie im System liegen">
      <Zone x={0} y={0} w={620} h={480} t="app" label="Docker Host" />
      <Zone i={1} x={12} y={34} w={596} h={150} label="Userspace" />
      <Box i={2} x={30} y={76} w={160} h={80} t="libs" label="shim" sub="Elternprozess" size={16} /><Num i={2} n={6} x={176} y={90} />
      <Arrow i={2} d="M192 116 H246" />
      <Ctr i={3} x={250} y={58} w={340} h={112} name="Container frontend" />
      <Box i={3} x={266} y={92} w={308} h={62} t="app" label="nginx" sub="PID 4021 auf dem Host" size={16} />
      <Zone i={4} x={12} y={196} w={596} h={272} t="kernel" label="KERNEL · das macht ihn zum Container" />
      {mech.map(([l, s, n], k) => {
        const x = 24 + (k % 3) * 192, y = 232 + Math.floor(k / 3) * 112
        return <g key={l}><Box i={5 + k} x={x} y={y} w={184} h={98} t="kchip" label={l} sub={s} size={15} /><Num i={5 + k} n={n} x={x + 168} y={y + 16} /></g>
      })}
      <Arrow i={5} d="M500 172 V228" />
    </Svg>
  </div>
)
