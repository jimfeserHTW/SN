import type { ReactElement } from 'react'
import { Svg, Take, Box as B, Arrow, Zone } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Mark, In, Txt } from '../../components/harbor/harbor.tsx'
import './views.css'

// How to break Docker: typical ways a container dies, each with its preconditions, the likely exit code and the fix.
// The charts loop (views.css): start, grow, crash, hold the crash for 5 s, start again. Without motion they show the crash.

const star = (cx: number, cy: number, r = 15) =>
  Array.from({ length: 16 }, (_, k) => { const a = k * Math.PI / 8, q = k % 2 ? r * .45 : r; return `${(cx + q * Math.cos(a)).toFixed(1)},${(cy + q * Math.sin(a)).toFixed(1)}` }).join(' ')

const Pill = ({ x, y, label, ok }: { x: number; y: number; label: string; ok?: boolean }) => {
  const w = label.length * 8 + 26
  return <g><rect x={x - w} y={y} width={w} height={26} rx={13} fill={ok ? '#e2f5ec' : '#fdecea'} stroke={ok ? 'var(--ok)' : 'var(--bad)'} strokeWidth={1.5} /><Txt x={x - w / 2} y={y + 18} size={13} w={700} fill={ok ? 'var(--ok)' : 'var(--bad)'} anchor="middle">{label}</Txt></g>
}

/** A usage curve over time that runs into a limit. fast: 3 s growth, slow: 11 s growth, then 5 s crash. */
function Run({ x, y, w = 390, h = 170, d, end, limitY, limit, axis, time, speed, up, down, boom, ghost, boomRight, lines = [] }: {
  x: number; y: number; w?: number; h?: number; d: string; end: [number, number]; limitY: number; limit: string; axis: string; time: string
  speed: 'fast' | 'slow'; up: string; down: string; boom: string; ghost?: string; boomRight?: boolean; lines?: { d: string; color: string }[]
}) {
  return (
    <g className="cr" data-speed={speed} transform={`translate(${x} ${y})`}>
      <path d={`M0 -6 V${h} H${w}`} fill="none" stroke="var(--ink-3)" strokeWidth={1.5} />
      <Txt x={0} y={-14} size={12.5} fill="var(--ink-3)">{axis}</Txt>
      <Txt x={w} y={h + 22} size={12.5} fill="var(--ink-3)" anchor="end">{time}</Txt>
      <path d={`M0 ${limitY} H${w}`} stroke="var(--bad)" strokeWidth={2} strokeDasharray="7 5" />
      <Txt x={8} y={limitY - 8} size={12.5} w={700} fill="var(--bad)">{limit}</Txt>
      {lines.map(l => <path key={l.d} className="cr-line" d={l.d} pathLength={1} style={{ stroke: l.color, strokeWidth: 2.2 }} />)}
      <path className="cr-line" d={d} pathLength={1} />
      <g className="cr-dead">
        {ghost && <path d={ghost} fill="none" stroke="var(--ink-3)" strokeWidth={2} strokeDasharray="4 5" />}
        <polygon points={star(...end)} fill="var(--bad)" />
        {boomRight ? <Txt x={end[0] + 20} y={end[1] + 26} size={13} w={700} fill="var(--bad)">{boom}</Txt> : <Txt x={end[0] - 20} y={end[1] - 12} size={13} w={700} fill="var(--bad)" anchor="end">{boom}</Txt>}
      </g>
      <g className="cr-up"><Pill x={w} y={-44} label={up} ok /></g>
      <g className="cr-dead"><Pill x={w} y={-44} label={down} /></g>
    </g>
  )
}

/** Case 2 in MB over the chart width: the app stays level (the GC keeps up), the overhead the kernel books on the
 *  container grows and flattens, and their sum is what the limit sees. All three end where the sum crosses 700 MB. */
const oom2 = (() => {
  const Y = (mb: number) => +(170 - mb * 130 / 700).toFixed(1) // 0 MB at y 170, 700 MB (limit) at y 40
  const app = (x: number) => x <= 50 ? 420 * (1 - (1 - x / 50) ** 2) : ((x - 50) % 22 === 16 ? 470 : 420) // sawtooth: only its vertices are sampled
  const over = (x: number) => 260 * (1 - Math.exp(-x / 130))
  const xs = [...Array.from({ length: 11 }, (_, k) => k * 5)]
  for (let x0 = 50; x0 < 392; x0 += 22) xs.push(x0 + 16, x0 + 22)
  const pts: [number, number, number][] = []
  for (const x of xs) {
    const a = app(x), o = over(x), prev = pts.at(-1)
    if (prev && a + o >= 700) { const f = (700 - prev[1] - prev[2]) / (a + o - prev[1] - prev[2]), xc = prev[0] + f * (x - prev[0]); pts.push([xc, prev[1] + f * (a - prev[1]), prev[2] + f * (o - prev[2])]); break }
    pts.push([x, a, o])
  }
  const path = (f: (p: [number, number, number]) => number) => 'M' + pts.map(p => `${p[0].toFixed(1)} ${Y(f(p))}`).join(' L')
  const last = pts.at(-1)!
  return { app: path(p => p[1]), over: path(p => p[2]), sum: path(p => p[1] + p[2]), end: [+last[0].toFixed(1), 40] as [number, number] }
})()

/* ── 1 · memory: the OOM kill ── */
export const Oom = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label={e('Zwei Speicherkurven laufen in ihr Limit: Spring Boot in 250 MB stirbt beim Start, in 700 MB nach Stunden', 'Two memory curves run into their limit: Spring Boot in 250 MB dies at start, in 700 MB after hours')}>
      <Tag x={20} y={0} w={470} label={e('Fall 1: Das Limit ist kleiner als der Start', 'Case 1: the limit is smaller than the start')} sub={e('Spring Boot in einem Container mit 250 MB', 'Spring Boot in a container with 250 MB')} tone="sand" />
      <Tag x={510} y={0} w={470} label={e('Fall 2: Der Speicher wächst im Betrieb', 'Case 2: memory grows while running')} sub={e('Spring Boot mit 700 MB, viel Last über Stunden', 'Spring Boot with 700 MB, heavy load for hours')} tone="sand" i={2} />
      <In i={1}>
        <rect x={20} y={58} width={470} height={272} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
        <Run x={70} y={116} d="M0 170 C40 160 70 120 120 70" end={[120, 70]} limitY={70} limit="250 MB" axis={e('Speicher', 'Memory')} time={e('Zeit: Sekunden', 'time: seconds')}
          speed="fast" up="Up" down="Exited (137)" boom={e('OOM-Kill', 'OOM kill')} boomRight ghost="M120 70 C150 40 175 26 210 20" />
        <Txt x={250} y={232} size={13}>{e('Klassen laden, Kontext aufbauen:', 'loading classes, building the context:')}</Txt>
        <Txt x={250} y={250} size={13}>{e('braucht beim Start ca. 350 MB', 'needs about 350 MB at start')}</Txt>
      </In>
      <In i={3}>
        <rect x={510} y={58} width={470} height={272} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
        <Run x={560} y={116} d={oom2.sum} end={oom2.end} limitY={40} limit="700 MB" axis={e('Speicher', 'Memory')} time={e('Zeit: Stunden', 'time: hours')}
          speed="slow" up="Up" down="Exited (137)" boom={e('OOM-Kill', 'OOM kill')} lines={[{ d: oom2.app, color: 'var(--blue)' }, { d: oom2.over, color: '#8e6bd8' }]} />
        <Txt x={665} y={196} size={12.5} w={700} fill="var(--svc-api)">{e('Summe: das zählt fürs Limit', 'Sum: this is what the limit counts')}</Txt>
        <Txt x={600} y={224} size={12.5} w={700} fill="var(--blue)">{e('Spring Boot: der GC hält es stabil', 'Spring Boot: the GC keeps it level')}</Txt>
        <Txt x={740} y={266} size={12.5} w={700} fill="#8e6bd8">{e('Container-Overhead: kommt von', 'Container overhead: added by')}</Txt>
        <Txt x={740} y={281} size={12.5} w={700} fill="#8e6bd8">{e('selbst dazu, flacht dann ab', 'itself, then flattens')}</Txt>
      </In>
      <Tag x={20} y={350} w={960} label={e('Ergebnis in beiden Fällen: der Kernel beendet den Prozess hart, Exit-Code 137', 'Result in both cases: the kernel kills the process hard, exit code 137')} sub={e('137 = 128 + Signal 9 (SIGKILL) · docker ps -a: Exited (137) · docker inspect: OOMKilled: true', '137 = 128 + signal 9 (SIGKILL) · docker ps -a: Exited (137) · docker inspect: OOMKilled: true')} tone="bad" i={4} />
    </Svg>
    <Take i={5} label={e('Vorbeugen', 'Prevent it')} text={e('Spitze mit docker stats messen und das Limit darüber legen. Der JVM sagen, wie viel Heap sie nehmen darf (-XX:MaxRAMPercentage=75), damit Platz für Metaspace, Threads und den Container-Overhead bleibt (Speicher, den der Kernel dem Container anrechnet: Netz-Puffer, Dateisystem-Verwaltung, tmpfs). Stoppt sich die JVM vorher selbst (OutOfMemoryError), endet der Container stattdessen mit Exit-Code 1.', 'Measure the peak with docker stats and put the limit above it. Tell the JVM how much heap it may take (-XX:MaxRAMPercentage=75) so room stays for metaspace, threads and the container overhead (memory the kernel charges to the container: network buffers, file system bookkeeping, tmpfs). If the JVM stops itself first (OutOfMemoryError), the container ends with exit code 1 instead.')} />
  </div>
)

/* ── shared: a red card with an exit code ── */
const card = (x: number, y: number, w: number, h: number, code: string, title: string, lines: string[], msg?: string) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={14} fill="#fdecea" stroke="var(--bad)" strokeWidth={1.5} />
    <text x={x + 18} y={y + 42} fontSize={32} fontWeight={800} fill="var(--bad)" style={{ fontFamily: 'var(--mono)' }}>{code}</text>
    <Txt x={x + 18} y={y + 70} size={14.5} w={700} fill="var(--ink)">{title}</Txt>
    {lines.map((l, k) => <Txt key={k} x={x + 18} y={y + 94 + k * 19} size={13}>{l}</Txt>)}
    {msg && <><rect x={x + 10} y={y + h - 40} width={w - 20} height={30} rx={7} fill="#fff" /><text x={x + 20} y={y + h - 20} fontSize={12} fill="var(--ink-2)" style={{ fontFamily: 'var(--mono)' }}>{msg}</text></>}
  </g>
)

/* ── 2 · it never starts: 125, 126, 127 ── */
export const NoStart = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label={e('docker run scheitert an drei Stellen: in der Engine (125), beim Ausführen (126) oder beim Finden des Befehls (127)', 'docker run fails at three places: in the engine (125), when executing (126) or when finding the command (127)')}>
      <B x={20} y={40} w={180} h={60} t="host" label="docker run" mono i={0} />
      <B x={260} y={40} w={230} h={60} t="engine" label="Docker Engine" sub={e('Container anlegen, Port binden', 'create container, bind port')} i={0} />
      <B x={550} y={40} w={230} h={60} t="container" label={e('Prozess starten', 'Start the process')} sub="ENTRYPOINT / CMD" i={1} />
      <B x={840} y={40} w={140} h={60} t="ok" label={e('App läuft', 'App runs')} i={1} />
      <Arrow d="M200 70 H254" i={0} /><Arrow d="M490 70 H544" i={1} /><Arrow d="M780 70 H834" i={1} />
      <Arrow d="M375 100 V162" kind="bad" i={2} /><Arrow d="M625 100 V162" kind="bad" i={3} /><Arrow d="M740 100 V130 H870 V162" kind="bad" i={4} />
      <In i={2}>{card(260, 168, 230, 200, '125', e('Docker selbst scheitert', 'Docker itself fails'), [e('Wenn: Port schon belegt', 'If: port already taken'), e('oder eine Option falsch', 'or an option is wrong')], 'port is already allocated')}</In>
      <In i={3}>{card(510, 168, 230, 200, '126', e('Nicht ausführbar', 'Not executable'), [e('Wenn: start.sh ohne', 'If: start.sh without'), 'chmod +x'], 'permission denied')}</In>
      <In i={4}>{card(760, 168, 220, 200, '127', e('Nicht gefunden', 'Not found'), [e('Wenn: Tippfehler im CMD', 'If: typo in CMD'), e('oder bash fehlt (Alpine)', 'or bash is missing (Alpine)')], 'executable file not found')}</In>
      <Tag x={20} y={168} w={210} label={e('Die App läuft nie', 'The app never runs')} sub={e('kein einziges Log der App', 'not a single app log')} tone="sand" i={5} />
    </Svg>
    <Take i={6} label={e('Vorbeugen', 'Prevent it')} text={e('Bei 125 zeigt docker run die Ursache direkt an: freien Port wählen (docker ps zeigt, wer ihn hat). Bei 126 und 127 das Image öffnen (docker run -it --entrypoint sh image) und prüfen, ob der Befehl existiert und ausführbar ist.', 'With 125 docker run shows the cause right away: pick a free port (docker ps shows who has it). With 126 and 127 open the image (docker run -it --entrypoint sh image) and check that the command exists and is executable.')} />
  </div>
)

/* ── 3 · the app gives up: the database is not ready yet ── */
const X0 = 180, S = 76 // time axis: x of 0 s, px per second
const lane = (y: number, from: number, to: number, fill: string, stroke: string, label?: string) => (
  <g><rect x={X0 + from * S} y={y} width={(to - from) * S} height={44} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
    {label && <Txt x={X0 + from * S + 12} y={y + 27} size={13} w={700} fill="var(--ink)">{label}</Txt>}</g>
)
const fail = (y: number, s: number) => <polygon points={star(X0 + s * S, y + 22, 13)} fill="var(--bad)" />
export const NotReady = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Die api startet vor der Datenbank, bekommt Connection refused und beendet sich mit Exit-Code 1', 'The api starts before the database, gets connection refused and ends with exit code 1')}>
      <Box x={40} y={30} w={110} h={44} svc="db" i={0} />
      <Box x={40} y={110} w={110} h={44} svc="api" i={1} /><In i={1}><Txt x={95} y={172} size={12} anchor="middle" fill="var(--ink-3)">restart: no</Txt></In>
      <Box x={40} y={200} w={110} h={44} svc="api" i={3} /><In i={3}><Txt x={95} y={262} size={12} anchor="middle" fill="var(--ink-3)">restart: on-failure</Txt></In>
      <In i={0}>{lane(30, 0, 5, '#fff3d6', '#e6c27a', e('Postgres startet', 'Postgres starting'))}{lane(30, 5, 10, '#e2f5ec', 'var(--ok)', e('bereit: nimmt Verbindungen an', 'ready: accepts connections'))}</In>
      <In i={1}>{lane(110, .5, 2, '#e8f0ff', 'var(--svc-api)', e('Start', 'Start'))}{fail(110, 2)}
        <path d={`M${X0 + 2.2 * S} 132 H${X0 + 10 * S}`} stroke="var(--ink-3)" strokeWidth={2} strokeDasharray="5 5" /></In>
      <In i={2}><rect x={X0 + 2.6 * S} y={116} width={370} height={32} rx={8} fill="#fff" /><Txt x={X0 + 2.7 * S} y={137} size={13} w={700} fill="var(--bad)">{e('Connection refused: db:5432 → Exit-Code 1, bleibt aus', 'connection refused: db:5432 → exit code 1, stays off')}</Txt></In>
      <In i={3}>{lane(200, .5, 2, '#e8f0ff', 'var(--svc-api)')}{fail(200, 2)}{lane(200, 2.5, 4, '#e8f0ff', 'var(--svc-api)')}{fail(200, 4)}
        {lane(200, 4.5, 10, '#e2f5ec', 'var(--ok)', e('3. Versuch: db ist bereit, verbunden', '3rd try: db is ready, connected'))}<Mark x={X0 + 10 * S - 20} y={222} ok r={11} i={3} /></In>
      <In i={0}>
        <path d={`M${X0} 290 H${X0 + 10 * S}`} stroke="var(--ink-3)" strokeWidth={1.5} />
        {[0, 2, 4, 6, 8, 10].map(s => <g key={s}><path d={`M${X0 + s * S} 286 V294`} stroke="var(--ink-3)" strokeWidth={1.5} /><text x={X0 + s * S} y={312} fontSize={12.5} textAnchor="middle" fill="var(--ink-3)">{s} s</text></g>)}
        <g className="cr-now"><path d={`M${X0} 22 V294`} stroke="var(--blue)" strokeWidth={2} /></g>
      </In>
    </Svg>
    <Take i={4} label={e('Vorbeugen', 'Prevent it')} text={e('depends_on allein wartet nur, bis der db-Container läuft, nicht bis Postgres bereit ist. Mit healthcheck in der db (pg_isready) und depends_on: condition: service_healthy startet die api erst, wenn Verbindungen klappen.', 'depends_on alone only waits until the db container runs, not until Postgres is ready. With a healthcheck in the db (pg_isready) and depends_on: condition: service_healthy the api only starts once connections work.')} />
  </div>
)

/* ── 4 · the disk fills up: logs and leftovers grow with every deploy ── */
const steps = (() => { let s = 'M0 160', x = 0, y = 160; for (let k = 0; k < 9; k++) { s += ` L${x + 34} ${y - 4} L${x + 42} ${y - 15}`; x += 42; y -= 15 } return s })()
const piles: [string, string, string, number][] = [
  [e('Logs (*-json.log)', 'Logs (*-json.log)'), 'logging: max-size: 10m', '#f4b183', 80],
  [e('Alte Images (<none>)', 'Old images (<none>)'), 'docker image prune', '#9dc3e6', 60],
  [e('Alter Build-Cache', 'Old build cache'), 'docker builder prune', '#b4a7d6', 60],
  [e('Anonyme Volumes', 'Anonymous volumes'), 'docker volume prune', '#a9d18e', 60],
]
export const DiskFull = () => {
  let y = 70
  const stack: ReactElement[] = piles.map(([what, fix, color, h], k) => {
    const top = y; y += h
    return (
      <In key={k} i={2 + k * .5}>
        <rect x={540} y={top} width={64} height={h} fill={color} stroke="#fff" strokeWidth={2} />
        <Txt x={630} y={top + h / 2 - 3} size={14} w={700} fill="var(--ink)">{what}</Txt>
        <text x={630} y={top + h / 2 + 16} fontSize={12.5} fill="var(--ink-2)" style={{ fontFamily: 'var(--mono)' }}>{fix}</text>
      </In>
    )
  })
  return (
    <div className="dg-col">
      <Svg w={1000} h={400} label={e('Mit jedem Build und jeder Logzeile füllt sich die Platte, bis die Datenbank nicht mehr schreiben kann', 'With every build and every log line the disk fills until the database can no longer write')}>
        <Tag x={20} y={0} w={470} label={e('Mit jedem Deploy bleibt etwas liegen', 'Every deploy leaves something behind')} sub={e('compose up --build, Logs ohne Rotation', 'compose up --build, logs without rotation')} tone="sand" />
        <In i={1}>
          <rect x={20} y={58} width={470} height={272} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />
          <Run x={70} y={116} d={steps} end={[378, 25]} limitY={25} limit={e('Platte voll', 'Disk full')} axis={e('Platte belegt', 'Disk used')} time={e('Zeit: Wochen', 'time: weeks')}
            speed="slow" up={e('db: läuft', 'db: running')} down={e('db: Fehler', 'db: error')} boom="no space left on device" />
        </In>
        <Tag x={520} y={0} w={460} label={e('Was in /var/lib/docker wächst', 'What grows in /var/lib/docker')} sub={e('anzeigen mit docker system df', 'show with docker system df')} tone="sky" i={2} />
        {stack}
        <Tag x={20} y={350} w={960} label={e('Ergebnis: Schreiben schlägt fehl, no space left on device', 'Result: writing fails, no space left on device')} sub={e('kein fester Exit-Code: die db stürzt ab oder nimmt nichts mehr an, und es trifft alle Container auf dem Rechner', 'no fixed exit code: the db crashes or accepts nothing, and it hits every container on the machine')} tone="bad" i={4} />
      </Svg>
      <Take i={5} label={e('Vorbeugen', 'Prevent it')} text={e('Logs begrenzen (logging: max-size und max-file in compose.yaml) und alte Reste regelmäßig aufräumen. docker system df zeigt, wo der Platz hingeht.', 'Limit logs (logging: max-size and max-file in compose.yaml) and clean up old leftovers regularly. docker system df shows where the space goes.')} />
    </div>
  )
}

/* ── 5 · docker stop takes 10 seconds and ends with 137 ── */
const proc = (x: number, y: number, w: number, pid: string, name: string, tone: 'ok' | 'bad' | 'plain') => (
  <g><rect x={x} y={y} width={w} height={40} rx={9} fill={tone === 'ok' ? '#e2f5ec' : tone === 'bad' ? '#fdecea' : '#fff'} stroke={tone === 'ok' ? 'var(--ok)' : tone === 'bad' ? 'var(--bad)' : 'var(--line)'} strokeWidth={1.5} />
    <text x={x + 16} y={y + 26} fontSize={14} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{pid}</text>
    <text x={x + 90} y={y + 26} fontSize={14} fill="var(--ink-2)" style={{ fontFamily: 'var(--mono)' }}>{name}</text></g>
)
export const Stop = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label={e('Ohne exec bleibt die Shell PID 1, ignoriert SIGTERM und wird nach 10 Sekunden hart beendet: Exit-Code 137 ohne OOM', 'Without exec the shell stays PID 1, ignores SIGTERM and is killed hard after 10 seconds: exit code 137 without OOM')}>
      <Tag x={20} y={0} w={460} label={e('start.sh ohne exec', 'start.sh without exec')} sub="java -jar app.jar" tone="sand" />
      <Tag x={520} y={0} w={460} label={e('start.sh mit exec', 'start.sh with exec')} sub="exec java -jar app.jar" tone="ok" i={4} />
      <B x={40} y={66} w={170} h={44} t="host" label="docker stop" mono size={15} i={1} />
      <Zone x={20} y={150} w={460} h={140} t="container" label={e('Container api', 'Container api')} i={1} />
      <In i={1}>{proc(40, 182, 420, 'PID 1', 'sh start.sh', 'bad')}{proc(80, 234, 380, 'PID 7', 'java -jar app.jar', 'plain')}</In>
      <Arrow d="M180 110 V178" n={1} nx={180} ny={128} label="SIGTERM" lx={198} ly={133} anchor="start" i={2} />
      <In i={2}><Txt x={300} y={207} size={13} w={700} fill="var(--bad)">{e('leitet nicht weiter', 'does not pass it on')}</Txt></In>
      <Arrow d="M210 88 H430 V178" kind="bad" n={2} nx={430} ny={130} label={e('SIGKILL nach 10 s', 'SIGKILL after 10 s')} lx={320} ly={80} i={3} />
      <Tag x={20} y={310} w={460} label={e('Exit-Code 137 · OOMKilled: false', 'exit code 137 · OOMKilled: false')} sub={e('hart beendet, offene Anfragen brechen ab', 'killed hard, open requests break off')} tone="bad" i={3} />
      <B x={540} y={66} w={170} h={44} t="host" label="docker stop" mono size={15} i={4} />
      <Zone x={520} y={150} w={460} h={140} t="container" label={e('Container api', 'Container api')} i={4} />
      <In i={4}>{proc(540, 182, 420, 'PID 1', 'java -jar app.jar', 'ok')}</In>
      <Arrow d="M680 110 V178" kind="ok" n={1} nx={680} ny={128} label="SIGTERM" lx={698} ly={133} anchor="start" i={5} />
      <In i={5}><Txt x={560} y={256} size={13} w={700} fill="var(--ok)">{e('Spring fährt sauber herunter', 'Spring shuts down cleanly')}</Txt></In>
      <Tag x={520} y={310} w={460} label={e('Exit-Code 143', 'exit code 143')} sub={e('143 = 128 + Signal 15 (SIGTERM), sauber gestoppt', '143 = 128 + signal 15 (SIGTERM), stopped cleanly')} tone="ok" i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('137 heißt nur: SIGKILL. Steht in docker inspect OOMKilled: false, war es kein Speicherproblem, sondern ein Stopp, auf den die App nicht reagiert hat. Lösung: exec im Skript oder die Exec-Form im Dockerfile (CMD ["java", "-jar", "app.jar"]).', '137 only means: SIGKILL. If docker inspect says OOMKilled: false, it was no memory problem but a stop the app did not react to. Fix: exec in the script or the exec form in the Dockerfile (CMD ["java", "-jar", "app.jar"]).')} />
  </div>
)

/* ── 6 · exit codes at a glance ── */
const zones: [number, number, string, string, string][] = [
  [20, 150, '0', e('sauber', 'clean'), 'var(--ok)'],
  [180, 220, '1 – 124', e('die App selbst', 'the app itself'), 'var(--svc-api)'],
  [410, 230, '125 – 127', e('Docker / Befehl', 'Docker / command'), '#b9770e'],
  [650, 330, '128 + n', e('Signal n beendet den Prozess', 'signal n ends the process'), 'var(--bad)'],
]
const code = (x: number, y: number, w: number, c: string, lines: string[], color: string, h = 66) => (
  <g><rect x={x} y={y} width={w} height={h} rx={12} fill="#fff" stroke={color} strokeWidth={1.8} />
    <text x={x + 14} y={y + 41} fontSize={26} fontWeight={800} fill={color} style={{ fontFamily: 'var(--mono)' }}>{c}</text>
    {lines.map((l, k) => <Txt key={k} x={x + 14 + c.length * 17 + 10} y={y + 38 + k * 18 - (lines.length - 1) * 9} size={13}>{l}</Txt>)}</g>
)
export const Codes = () => (
  <div className="dg-col">
    <Svg w={1000} h={300} label={e('Exit-Codes nach Bereich: 0 sauber, 1 bis 124 die App, 125 bis 127 Docker oder der Befehl, ab 128 ein Signal', 'Exit codes by range: 0 clean, 1 to 124 the app, 125 to 127 Docker or the command, from 128 a signal')}>
      {zones.map(([x, w, c, l, color], k) => (
        <In key={c} i={k}>
          <rect x={x} y={0} width={w} height={56} rx={12} fill={`color-mix(in srgb, ${color} 14%, #fff)`} stroke={color} strokeWidth={1.8} />
          <text x={x + w / 2} y={24} fontSize={16} fontWeight={800} textAnchor="middle" fill={color} style={{ fontFamily: 'var(--mono)' }}>{c}</text>
          <Txt x={x + w / 2} y={44} size={12.5} anchor="middle">{l}</Txt>
        </In>
      ))}
      <In i={0}>{code(20, 76, 150, '0', [e('fertig ohne', 'done without'), e('Fehler', 'error')], 'var(--ok)', 120)}
        <Txt x={34} y={162} size={12} fill="var(--ink-3)">{e('auch: App lief im', 'also: app ran in')}</Txt><Txt x={34} y={178} size={12} fill="var(--ink-3)">{e('Hintergrund (&)', 'the background (&)')}</Txt></In>
      <In i={1}>{code(180, 76, 220, '1', [e('Exception beim', 'exception at'), e('Start oder Betrieb', 'start or run time')], 'var(--svc-api)', 120)}
        <Txt x={194} y={162} size={12} fill="var(--ink-3)">{e('z. B. DB nicht erreichbar,', 'e.g. DB unreachable,')}</Txt><Txt x={194} y={178} size={12} fill="var(--ink-3)">OutOfMemoryError</Txt></In>
      <In i={2}>{code(410, 76, 230, '125', [e('docker run scheitert', 'docker run fails')], '#b9770e')}{code(410, 152, 230, '126', [e('nicht ausführbar', 'not executable')], '#b9770e')}{code(410, 228, 230, '127', [e('nicht gefunden', 'not found')], '#b9770e')}</In>
      <In i={3}>{code(650, 76, 330, '137', ['SIGKILL (9)', e('OOM-Kill oder stop nach 10 s', 'OOM kill or stop after 10 s')], 'var(--bad)')}
        {code(650, 152, 330, '139', ['SIGSEGV (11)', e('Speicherzugriffsfehler', 'segmentation fault')], 'var(--bad)')}
        {code(650, 228, 330, '143', ['SIGTERM (15)', e('sauber gestoppt', 'stopped cleanly')], 'var(--bad)')}</In>
    </Svg>
    <Take i={4} label={e('Nachsehen', 'Where to look')} text={e('docker ps -a zeigt den Code (Exited (137)), docker inspect zeigt State.ExitCode und State.OOMKilled, docker logs die letzte Meldung der App. Der Code verrät, wer aufgehört hat, die Logs verraten, warum. Ausnahme 255: kein Signal, sondern ein Prozess, der gar nicht erst starten konnte.', 'docker ps -a shows the code (Exited (137)), docker inspect shows State.ExitCode and State.OOMKilled, docker logs the app’s last message. The code tells who stopped, the logs tell why. Exception 255: not a signal, but a process that could not start at all.')} />
  </div>
)

/* ── 7 · the file is there, it still does not start: line endings and CPU architecture ── */
const trap = (x: number, title: string, sub: string, i: number, body: ReactElement, log: string, fix: string) => (
  <g>
    <Tag x={x} y={0} w={470} label={title} sub={sub} tone="sand" i={i} />
    <In i={i + 1}><rect x={x} y={58} width={470} height={200} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} />{body}
      <rect x={x + 16} y={206} width={438} height={36} rx={8} fill="#fdecea" /><text x={x + 30} y={229} fontSize={13} fill="var(--bad)" style={{ fontFamily: 'var(--mono)' }}>{log}</text></In>
    <In i={i + 2}><Txt x={x + 4} y={284} size={13} w={700} fill="var(--ok)">{fix}</Txt></In>
  </g>
)
export const Traps = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Zwei Container starten nicht, obwohl die Datei da ist: Windows-Zeilenenden im Skript und ein Image für die falsche CPU', 'Two containers do not start although the file is there: Windows line endings in the script and an image for the wrong CPU')}>
      {trap(20, e('Windows-Zeilenenden in start.sh', 'Windows line endings in start.sh'), e('Skript unter Windows gespeichert oder ausgecheckt', 'script saved or checked out on Windows'), 0, <>
        <text x={44} y={98} fontSize={15} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>#!/bin/sh<tspan fill="var(--bad)" fontWeight={800}>{'\\r'}</tspan><tspan fill="var(--ink-3)">{'\\n'}</tspan></text>
        <text x={44} y={124} fontSize={15} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>exec java -jar /app.jar<tspan fill="var(--bad)" fontWeight={800}>{'\\r'}</tspan><tspan fill="var(--ink-3)">{'\\n'}</tspan></text>
        <Txt x={44} y={160} size={13}>{e('Der Kernel sucht den Interpreter „/bin/sh\\r“.', 'The kernel looks for the interpreter “/bin/sh\\r”.')}</Txt>
        <Txt x={44} y={180} size={13}>{e('Den gibt es nicht, obwohl start.sh da ist.', 'It does not exist, although start.sh is there.')}</Txt>
      </>, 'exec ./start.sh: no such file or directory', e('Lösung: *.sh text eol=lf in .gitattributes', 'Fix: *.sh text eol=lf in .gitattributes'))}
      {trap(510, e('Image für die falsche CPU', 'Image for the wrong CPU'), e('auf dem Mac (arm64) gebaut, Server ist amd64', 'built on a Mac (arm64), the server is amd64'), 3, <>
        <rect x={534} y={80} width={190} height={50} rx={10} fill="color-mix(in srgb, var(--blue) 12%, #fff)" stroke="var(--blue)" />
        <Txt x={629} y={102} size={13} w={700} fill="var(--ink)" anchor="middle">{e('Image: linux/arm64', 'image: linux/arm64')}</Txt><Txt x={629} y={120} size={12} anchor="middle">{e('JRE als ARM-Maschinencode', 'JRE as ARM machine code')}</Txt>
        <path d="M728 105 H786" stroke="var(--bad)" strokeWidth={2.5} markerEnd="url(#ah-bad)" />
        <rect x={790} y={80} width={170} height={50} rx={10} fill="#fdecea" stroke="var(--bad)" />
        <Txt x={875} y={102} size={13} w={700} fill="var(--ink)" anchor="middle">{e('CPU: amd64', 'CPU: amd64')}</Txt><Txt x={875} y={120} size={12} anchor="middle">{e('versteht ARM nicht', 'does not understand ARM')}</Txt>
        <Txt x={534} y={170} size={13}>{e('Die app.jar wäre egal, aber Java und schon das', 'The app.jar would not matter, but Java and even the')}</Txt>
        <Txt x={534} y={190} size={13}>{e('Start-Skript des Images laufen nur auf einer CPU.', 'start script of the image run on one CPU only.')}</Txt>
      </>, 'exec /__cacert_entrypoint.sh: exec format error', e('Lösung: build --platform linux/amd64', 'Fix: build --platform linux/amd64'))}
      <Tag x={20} y={306} w={960} label={e('Beide enden sofort mit Exit-Code 255', 'Both end at once with exit code 255')} sub={e('255 heißt hier: Der Prozess konnte nicht gestartet werden. Was genau, steht in docker logs.', '255 means here: the process could not be started. What exactly is in docker logs.')} tone="bad" i={6} />
    </Svg>
  </div>
)

/* ── 8 · unhealthy is not a crash: nobody restarts it ── */
const H0 = 160, HS = 80 // time axis: x of 0 min, px per minute
export const Unhealthy = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Die api hängt, der Healthcheck schlägt fehl, der Container bleibt trotzdem laufen und wird nicht neu gestartet', 'The api hangs, the healthcheck fails, the container keeps running anyway and is not restarted')}>
      <In i={0}><Txt x={0} y={46} size={14} w={700} fill="var(--ink)">Healthcheck</Txt>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => <Mark key={k} x={H0 + 40 + k * HS} y={40} ok={k < 4} bad={k >= 4} r={11} i={0} />)}</In>
      <In i={1}><Txt x={0} y={108} size={14} w={700} fill="var(--ink)">{e('Prozess', 'Process')}</Txt>
        {lane2(84, 0, 4, '#e8f0ff', 'var(--svc-api)', e('beantwortet Anfragen', 'answers requests'))}{lane2(84, 4, 10, '#fff3d6', '#e6c27a', e('hängt: DB-Pool leer, Anfragen laufen in Timeouts', 'hangs: DB pool empty, requests time out'))}</In>
      <In i={2}><Txt x={0} y={168} size={14} w={700} fill="var(--ink)">docker ps</Txt>
        {lane2(144, 0, 4, '#e2f5ec', 'var(--ok)', 'Up (healthy)')}{lane2(144, 4, 10, '#fdecea', 'var(--bad)', e('Up (unhealthy) · bleibt so', 'Up (unhealthy) · stays like this'))}</In>
      <In i={3}><Txt x={0} y={228} size={14} w={700} fill="var(--ink)">restart</Txt>
        {lane2(204, 0, 10, '#fff', 'var(--line)', e('unless-stopped greift nicht: der Prozess ist nicht beendet', 'unless-stopped does not act: the process has not ended'))}</In>
      <In i={0}><path d={`M${H0} 270 H${H0 + 10 * HS}`} stroke="var(--ink-3)" strokeWidth={1.5} />
        {[0, 2, 4, 6, 8, 10].map(m => <text key={m} x={H0 + m * HS} y={290} fontSize={12.5} textAnchor="middle" fill="var(--ink-3)">{m} min</text>)}</In>
      <Tag x={0} y={304} w={480} label={e('Kein Absturz, kein Exit-Code', 'No crash, no exit code')} sub={e('Docker und Compose melden unhealthy nur', 'Docker and Compose only report unhealthy')} tone="bad" i={4} />
      <Tag x={500} y={304} w={500} label={e('Neu gestartet wird erst, wenn der Prozess endet', 'A restart only happens once the process ends')} sub={e('oder ein Orchestrator wie Swarm reagiert auf unhealthy', 'or an orchestrator like Swarm reacts to unhealthy')} tone="sand" i={4} />
    </Svg>
    <Take i={5} label={e('Vorbeugen', 'Prevent it')} text={e('Die App soll sich bei einem Fehler, aus dem sie nicht mehr herauskommt, selbst beenden, dann greift die Neustart-Regel. Kubernetes nutzt eigene Liveness-Probes statt des HEALTHCHECK. Und: unhealthy überwachen, damit es jemand merkt.', 'The app should end itself on an error it cannot recover from, then the restart policy acts. Kubernetes uses its own liveness probes instead of HEALTHCHECK. And: monitor unhealthy so someone notices.')} />
  </div>
)
const lane2 = (y: number, from: number, to: number, fill: string, stroke: string, label: string) => (
  <g><rect x={H0 + from * HS} y={y} width={(to - from) * HS - 4} height={36} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
    <Txt x={H0 + from * HS + 12} y={y + 23} size={13} w={700} fill="var(--ink)">{label}</Txt></g>
)
