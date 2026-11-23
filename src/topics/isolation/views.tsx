import type { ReactNode } from 'react'
import { Svg, Take, Box as B, Zone } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Mark, Rings, In, Txt, Go, type Svc } from '../../components/harbor/harbor.tsx'

// Isolation, overview sub-chapter: namespaces, limits (cgroups), the OOM kill and capabilities. Technical terms only.
const eye = (x: number, y: number, i: number) => <In i={i}><ellipse cx={x} cy={y} rx={22} ry={13} fill="#fff" stroke="var(--bad)" strokeWidth={2.5} /><circle cx={x} cy={y} r={6} fill="var(--bad)" /></In>
const bolt = (x: number, y: number, i: number, s = 1) => <In i={i}><path transform={`translate(${x} ${y}) scale(${s})`} d="M10 0 L0 22 H9 L5 40 L22 14 H12 L18 0 Z" fill="#ffd166" stroke="#b9770e" strokeWidth={2} strokeLinejoin="round" /></In>

/* ── many containers, one machine: why they must be separated ── */
export const Crowd = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Ohne Trennung späht ein fremder Container in die Datenbank, die api nimmt sich den ganzen Speicher', 'Without separation a foreign container peeks into the database, the api takes all the memory')}>
      <Zone x={20} y={110} w={960} h={220} label="Server" sub="Docker" />
      <Box x={180} y={210} w={150} h={60} svc="frontend" i={0} /><Box x={360} y={210} w={150} h={60} svc="api" i={0} /><Box x={540} y={210} w={150} h={60} svc="db" i={0} /><Box x={720} y={210} w={150} h={60} svc="other" label={e('fremdes Projekt', 'other project')} size={13} i={0} />
      {eye(705, 186, 1)}<Go d="M684 192 C660 180 640 182 622 200" i={1} kind="bad" />
      {bolt(398, 130, 2, 1.6)}{bolt(450, 140, 2, 1.2)}
      <Tag x={40} y={30} w={420} label={e('Ohne Grenzen nimmt sich einer alles', 'Without limits one takes everything')} sub={e('die api frisst Speicher, die anderen stehen still', 'the api eats memory, the others stall')} tone="bad" i={2} />
      <Tag x={540} y={30} w={420} label={e('Ohne Abschottung sieht jeder alles', 'Without isolation everyone sees everything')} sub={e('ein fremder Container liest Passwörter der db', 'a foreign container reads the db’s passwords')} tone="bad" i={1} />
      <Lead d="M750 76 V170" end={[750, 172]} i={1} />
    </Svg>
    <Take i={3} label={e('Darum', 'That is why')} text={e('Auf einem Rechner braucht jeder Container eine Abschottung, die regelt, was er sieht, und ein Limit, das regelt, wie viel er verbraucht.', 'On one machine every container needs isolation that controls what it sees, and a limit that controls how much it uses.')} />
  </div>
)

/* ── privacy screens: every container thinks it is alone ── */
const procs: [string, string, boolean][] = [['1', 'systemd', false], ['812', 'dockerd', false], ['4711', 'java  (api)', true], ['4802', 'postgres  (db)', false], ['4890', 'nginx  (frontend)', false]]
export const Privacy = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Der Container sieht nur sich selbst, der Rechner sieht alle Prozesse', 'The container sees only itself, the machine sees every process')}>
      <Tag x={20} y={0} w={460} label={e('Blick aus dem Container api', 'View from inside container api')} tone="sky" />
      <Tag x={520} y={0} w={460} label={e('Blick vom Rechner', 'View from the machine')} sub={e('der ganze Rechner', 'the whole machine')} tone="sky" i={2} />
      <In i={1}><Rings x={20} y={52} w={460} h={270} rings={[{ label: e('Container api', 'Container api'), sub: e('eigene Namespaces', 'its own namespaces'), bg: 'color-mix(in srgb, var(--svc-api) 10%, #fff)', stroke: 'var(--svc-api)', ink: 'var(--svc-api-d)' }]} core={
        <g>{[[e('Prozesse', 'processes'), 'PID 1  java'], [e('Dateien', 'files'), e('nur aus dem Image', 'only from the image')], [e('Netz', 'Network'), e('nur die eigene IP', 'only its own IP')], [e('Name', 'name'), e('eigener Rechnername', 'its own host name')]].map(([a, b], k) => (
          <g key={a}><rect x={44} y={100 + k * 52} width={412} height={42} rx={10} fill="#fff" stroke="var(--line)" strokeWidth={1.5} /><Txt x={64} y={127 + k * 52} size={14} w={700} fill="var(--ink)">{a}</Txt><Txt x={190} y={127 + k * 52} size={14}>{b}</Txt></g>
        ))}</g>} /></In>
      {procs.map(([pid, name, hot], k) => (
        <In key={pid} i={3 + (hot ? 1 : 0)}>
          <rect x={520} y={60 + k * 52} width={460} height={42} rx={10} fill={hot ? '#fdecea' : '#fff'} stroke={hot ? 'var(--bad)' : 'var(--line)'} strokeWidth={hot ? 2 : 1.5} />
          <text x={544} y={87 + k * 52} fontSize={14} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{pid}</text>
          <text x={624} y={87 + k * 52} fontSize={14} fill="var(--ink-2)" style={{ fontFamily: 'var(--mono)', whiteSpace: 'pre' }}>{name}</text>
        </In>
      ))}
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Derselbe Java-Prozess hat zwei PIDs: drinnen 1, auf dem Rechner 4711. Der Container sieht nur, was in seinen Namespaces liegt.', 'The same Java process has two PIDs: 1 inside, 4711 on the machine. The container only sees what lies in its namespaces.')} />
  </div>
)

/* ── limits: CPU and memory per container (cgroups) ── */
const rations: [Svc, string, number, number, string][] = [['frontend', '0,5 CPU · 128 MB', .5, .125, ''], ['api', '1 CPU · 768 MB', 1, .75, ''], ['db', '1 CPU · 1 GB', 1, 1, '']]
const meter = (y: number, svc: Svc, label: string, use: number, limit: number, i: number, over?: boolean) => (
  <In i={i}>
    <rect x={280} y={y} width={500} height={34} rx={8} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
    <rect x={282} y={y + 2} width={Math.min(use, 1.2) * 480} height={30} rx={7} fill={over ? 'var(--bad)' : `var(--svc-${svc})`} opacity={over ? .9 : .75} />
    <path d={`M${280 + limit * 480} ${y - 6} V${y + 40}`} stroke="var(--keel)" strokeWidth={3} />
    <Txt x={260} y={y + 23} size={13} w={700} fill="var(--ink)" anchor="end">{label}</Txt>
  </In>
)
export const Rations = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Jeder Container bekommt ein festes Limit an Rechenzeit und Speicher', 'Every container gets a fixed limit of CPU and memory')}>
      <In i={0}><rect x={20} y={20} width={960} height={240} rx={16} fill="#fff" stroke="var(--keel)" strokeWidth={2} /><Txt x={44} y={52} size={16} w={700} fill="var(--ink)">{e('Limits pro Container (cgroups)', 'Limits per container (cgroups)')}</Txt><Txt x={956} y={52} size={13} fill="var(--ink-3)" anchor="end">{e('Strich = Limit', 'line = limit')}</Txt></In>
      {rations.map(([s, l, , lim], k) => <g key={s}>{meter(80 + k * 56, s, s, lim * .7, lim, 1 + k)}<In i={1 + k}><Txt x={800} y={103 + k * 56} size={12.5} w={600}>{l}</Txt></In></g>)}
      <In i={4}><Txt x={44} y={244} size={13}>{e('Speicher: ein voller Balken wäre der ganze Rechner', 'Memory: a full bar would be the whole machine')}</Txt></In>
      <Tag x={120} y={276} w={760} label={e('Das Limit legt ihr fest, der Kernel sorgt dafür, dass es eingehalten wird', 'You set the limit, the kernel makes sure it is kept')} sub={e('ohne Limit darf ein Container alles nehmen', 'without a limit a container may take everything')} tone="blue" i={4} />
    </Svg>
  </div>
)

/* ── over the limit: the OOM kill ── */
export const Fuse = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Die api überschreitet ihr Speicher-Limit, der Kernel beendet nur die api', 'The api exceeds its memory limit, the kernel stops only the api')}>
      <In i={0}><rect x={20} y={20} width={960} height={200} rx={16} fill="#fff" stroke="var(--keel)" strokeWidth={2} /></In>
      {meter(50, 'frontend', 'frontend', .09, .125, 0)}
      {meter(106, 'api', 'api', .86, .75, 1, true)}
      {meter(162, 'db', 'db', .7, 1, 0)}
      <Mark x={940} y={67} ok i={2} r={12} /><Mark x={940} y={179} ok i={2} r={12} />
      <Mark x={940} y={123} bad i={2} r={12} />
      <Tag x={40} y={240} w={440} label={e('Limit überschritten: nur die api wird beendet', 'Limit exceeded: only the api is stopped')} sub={e('Exit-Code 137 · OOMKilled', 'exit code 137 · OOMKilled')} tone="bad" i={2} />
      <Tag x={520} y={240} w={440} label={e('Spring Boot: nicht nur der Heap zählt', 'Spring Boot: not only the heap counts')} sub={e('Threads, Metaspace und Puffer brauchen auch Speicher', 'threads, metaspace and buffers need memory too')} tone="sand" i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Wer über sein Limit will, wird beendet, die anderen laufen weiter. Exit-Code 137 heißt fast immer: Speicher-Limit zu klein.', 'Whoever wants more than the limit is stopped, the others keep running. Exit code 137 almost always means: memory limit too small.')} />
  </div>
)

/* ── capabilities: which rights a container gets ── */
const doors: [string, boolean][] = [
  [e('eigene Dateien ändern', 'change its own files'), true], [e('eigenes Netz nutzen', 'use its own network'), true], [e('eigene Prozesse starten', 'start its own processes'), true],
  [e('Kernel-Module laden', 'load kernel modules'), false], [e('die Systemuhr stellen', 'set the system clock'), false], [e('fremde Container öffnen', 'open other containers'), false],
]
export const Rules = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Ein Container bekommt einige Rechte, andere bleiben gesperrt', 'A container gets some rights, others stay locked')}>
      <Box x={40} y={100} w={220} h={120} svc="api" i={0} />
      <Tag x={40} y={30} w={220} label={e('Rechte (Capabilities)', 'Rights (capabilities)')} sub={e('was die api darf', 'what the api may do')} tone="blue" i={0} />
      {doors.map(([d, ok], k) => {
        const x = 330 + (k % 3) * 220, y = ok ? 40 : 170
        return (
          <In key={d} i={ok ? 1 : 2}>
            <rect x={x} y={y} width={200} height={110} rx={14} fill={ok ? '#e2f5ec' : '#fdecea'} stroke={ok ? 'var(--ok)' : 'var(--bad)'} strokeWidth={1.5} />
            {ok ? <path d={`M${x + 100 - 16} ${y + 38} a10 10 0 1 1 1 0 M${x + 100 - 6} ${y + 38} h30 m-8 0 v8 m-8 -8 v6`} fill="none" stroke="var(--ok)" strokeWidth={2.5} strokeLinecap="round" />
              : <g><rect x={x + 88} y={y + 30} width={24} height={18} rx={3} fill="var(--bad)" /><path d={`M${x + 93} ${y + 30} v-6 a7 7 0 0 1 14 0 v6`} fill="none" stroke="var(--bad)" strokeWidth={2.5} /></g>}
            <Txt x={x + 100} y={y + 80} size={13.5} w={700} fill={ok ? 'var(--ok)' : 'var(--bad)'} anchor="middle">{d}</Txt>
          </In>
        )
      })}
      <Go d="M264 160 H322" i={1} />
    </Svg>
    <Take i={3} label={e('Merke', 'Remember')} text={e('Selbst wer im Container root ist, bekommt nur diese Rechte. Noch sicherer: die App gar nicht als root starten.', 'Even root inside the container only gets these rights. Safer still: do not start the app as root at all.')} />
  </div>
)

/* ── weaker separation than a VM: one shared kernel ── */
const trio = ['frontend', 'api', 'db'] as const
export const Walls = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Bei VMs trifft ein Kernel-Fehler nur eine VM, bei Containern trifft ein Fehler im gemeinsamen Kernel alle', 'With VMs a kernel fault hits only one VM, with containers a fault in the shared kernel hits all')}>
      <Tag x={20} y={0} w={460} label={e('VM: eigener Kernel', 'VM: a kernel of its own')} sub={e('ein Fehler trifft nur diese VM', 'a fault only hits that VM')} tone="ok" />
      <Tag x={520} y={0} w={460} label={e('Container: gemeinsamer Kernel', 'Container: a shared kernel')} sub={e('ein Fehler im Kernel trifft alle', 'a fault in the kernel hits all')} tone="sand" i={3} />
      <Zone x={20} y={60} w={460} h={290} label={e('Rechner', 'Machine')} i={1} />
      {trio.map((s, k) => (
        <g key={s}>
          <Zone x={36 + k * 148} y={110} w={136} h={146} t="guest" label="VM" i={1} />
          <Box x={46 + k * 148} y={138} w={116} h={46} svc={s} size={13} i={1} />
          <B x={46 + k * 148} y={194} w={116} h={50} t="kernel" label="Kernel" size={13} i={1} />
          <Mark x={160 + k * 148} y={110} ok={k > 0} bad={k === 0} i={2} r={11} />
        </g>
      ))}
      {bolt(140, 196, 2)}
      <B x={36} y={266} w={428} h={30} t="hyper" label="Hypervisor" size={13} i={1} />
      <B x={36} y={304} w={428} h={34} t="kernel" label={e('Kernel des Rechners', 'Machine’s kernel')} size={13} i={1} />
      <Zone x={520} y={60} w={460} h={290} label={e('Rechner', 'Machine')} i={4} />
      {trio.map((s, k) => <g key={s}><Box x={548 + k * 144} y={190} w={130} h={56} svc={s} size={14} i={4} /><Mark x={672 + k * 144} y={190} bad i={5} r={11} /></g>)}
      <B x={536} y={266} w={428} h={30} t="engine" label="Docker Engine" size={13} i={4} />
      <B x={536} y={304} w={428} h={34} t="kernel" label={e('ein Kernel für alle', 'one kernel for all')} size={13} i={4} />
      {bolt(760, 300, 5)}
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Container sind gut getrennt, aber nicht so stark wie VMs. Für fremden, nicht vertrauenswürdigen Code nimmt man lieber eigene VMs.', 'Containers are well separated, but not as strongly as VMs. For foreign, untrusted code you would rather use VMs of their own.')} />
  </div>
)
