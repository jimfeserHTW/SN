import { Svg, Take, Box as B, Zone, Arrow, Label, Wire } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Mark, In, Txt, Go, type Svc } from '../../components/harbor/harbor.tsx'

// Overview slides of the first sub-chapter: who does what, drawn as machines, programs and the kernel. Technical terms only.
const arrow = (d: string, i: number) => <Go d={d} i={i} />
const term = (x: number, y: number, w: number, cmd: string, i: number) => (
  <In i={i}>
    <rect x={x} y={y} width={w} height={60} rx={12} fill="var(--ink)" />
    <text x={x + 16} y={y + 37} fontSize={14} fill="#fff" style={{ fontFamily: 'var(--mono)' }}>{cmd}</text>
  </In>
)

/* ── one machine with Docker runs any container ── */
const five: [Svc, string | undefined][] = [['frontend', undefined], ['api', undefined], ['db', undefined], ['other', 'redis'], ['other', 'keycloak']]
export const CargoShip = () => (
  <div className="dg-col">
    <Svg w={1000} h={390} label={e('Ein Rechner mit Docker führt die Container der Mensa-App und fertige Container anderer aus, über der Docker Engine und dem Kernel', 'A machine with Docker runs the containers of the Mensa-App and ready-made ones, above the Docker Engine and the kernel')}>
      <Zone x={20} y={80} w={960} h={244} label={e('Dein Rechner', 'Your machine')} sub="Linux" />
      {five.map(([s, l], k) => <Box key={k} x={100 + k * 130} y={120} w={120} h={58} svc={s} label={l} size={14} i={k < 3 ? 1 : 2} />)}
      <B x={40} y={200} w={920} h={46} t="engine" label="Docker Engine" size={15} i={3} />
      <B x={40} y={258} w={920} h={46} t="kernel" label="Kernel" size={15} i={3} />
      <Tag x={40} y={0} w={300} label={e('Ein Rechner mit Docker …', 'A machine with Docker …')} sub={e('… führt Container aus', '… runs containers')} tone="blue" i={4} />
      <Lead d="M200 46 V76" end={[200, 80]} i={4} />
      <Tag x={372} y={0} w={300} label={e('jeden Container', 'any container')} sub={e('eure eigenen und fertige von anderen', 'your own and ready-made ones')} i={5} />
      <Lead d="M550 46 V116" end={[550, 118]} i={5} />
      <Tag x={704} y={0} w={256} label={e('startet, stoppt, entfernt', 'starts, stops, removes')} sub={e('auf euren Befehl', 'on your command')} i={6} />
      <Lead d="M840 46 V196" end={[840, 198]} i={6} />
      <Tag x={300} y={344} w={400} label={e('Laptop, Server, Cloud: überall dasselbe Prinzip', 'laptop, server, cloud: the same idea everywhere')} tone="sky" i={7} />
    </Svg>
  </div>
)

/* ── client and daemon ── */
export const BridgeCrew = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Der Befehl docker im Terminal gibt den Auftrag, der Daemon dockerd liest das Image und startet den Container', 'The docker command in the terminal gives the order, the daemon dockerd reads the image and starts the container')}>
      <Zone x={20} y={60} w={960} h={260} label={e('Dein Rechner', 'Your machine')} sub="Docker" />
      {term(40, 115, 260, '$ docker run api', 1)}
      <Arrow d="M304 145 H360" i={2} />
      <B x={364} y={115} w={200} h={60} t="engine" label="dockerd" sub={e('Daemon, im Hintergrund', 'daemon, in the background')} i={2} />
      <Arrow d="M464 178 V218" i={3} both />
      <B x={364} y={222} w={200} h={56} t="reg" label="Images" sub={e('auf der Festplatte', 'on the disk')} i={3} />
      <Arrow d="M568 145 H760" i={4} />
      <Label x={664} y={135} size={13} tone="muted" i={4}>{e('startet', 'starts')}</Label>
      <Box x={764} y={116} w={150} h={58} svc="api" i={4} />
      <Mark x={914} y={116} ok i={4} r={12} />
      <Tag x={40} y={0} w={260} label={e('1  docker: dein Befehl', '1  docker: your command')} sub={e('das Programm im Terminal', 'the program in the terminal')} tone="blue" i={1} />
      <Lead d="M170 46 V111" end={[170, 113]} i={1} />
      <Tag x={364} y={0} w={240} label={e('2  dockerd: die Arbeit', '2  dockerd: the work')} sub={e('läuft immer im Hintergrund', 'always runs in the background')} i={2} />
      <Lead d="M464 46 V111" end={[464, 113]} i={2} />
      <Tag x={740} y={0} w={200} label={e('3  Container läuft', '3  container runs')} tone="ok" i={4} />
      <Lead d="M840 46 V112" end={[840, 114]} i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Das Programm docker gibt nur den Auftrag. Die Arbeit macht der Daemon dockerd, der auf jedem Rechner mit Docker im Hintergrund läuft.', 'The program docker only gives the order. The work is done by the daemon dockerd, which runs in the background on every machine with Docker.')} />
  </div>
)

/* ── the Docker API: client and daemon talk over it, locally or from another machine ── */
export const Intercom = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Der Client spricht über die Docker-API mit dem Daemon. Ein Client auf einem anderen Rechner kann dieselbe API übers Netz nutzen.', 'The client talks to the daemon over the Docker API. A client on another machine can use the same API over the network.')}>
      <Zone x={20} y={60} w={270} h={260} label={e('Anderer Rechner', 'Another machine')} />
      <In i={4}><Icon name="laptop" x={124} y={100} s={60} /></In>
      {term(36, 196, 238, '$ docker -H server ps', 4)}
      <Zone x={320} y={60} w={660} h={260} label={e('Rechner mit Docker', 'Machine with Docker')} sub="server" />
      {term(340, 115, 190, '$ docker ps', 1)}
      <Arrow d="M534 145 H566" i={2} />
      <B x={570} y={115} w={170} h={60} t="ok" label={e('Docker-API', 'Docker API')} sub={e('REST über Socket', 'REST over a socket')} i={2} />
      <Arrow d="M744 145 H776" i={3} />
      <B x={780} y={115} w={180} h={60} t="engine" label="dockerd" sub="Daemon" i={3} />
      <Arrow d="M870 178 V218" i={3} />
      <Box x={800} y={222} w={140} h={56} svc="api" i={3} />
      <Arrow d="M278 226 C420 226 600 260 650 180" kind="back" i={4} />
      <Label x={470} y={268} size={13} tone="muted" i={4}>{e('übers Netz', 'over the network')}</Label>
      <Tag x={330} y={0} w={210} label={e('Client', 'Client')} sub={e('docker im Terminal', 'docker in the terminal')} i={1} />
      <Tag x={560} y={0} w={190} label={e('Docker-API', 'Docker API')} sub={e('die Schnittstelle', 'the interface')} tone="blue" i={2} />
      <Tag x={770} y={0} w={200} label="dockerd" sub={e('der Daemon', 'the daemon')} i={3} />
      <Tag x={30} y={0} w={250} label={e('Auch von außen', 'From outside too')} sub={e('ein Befehl für einen fernen Rechner', 'an order for a distant machine')} tone="sky" i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Client und Daemon sind zwei Programme, die über die Docker-API reden. Darum kann der Client auch auf einem anderen Rechner laufen als der Daemon.', 'Client and daemon are two programs that talk over the Docker API. That is why the client can also run on another machine than the daemon.')} />
  </div>
)

/* ── one kernel for all containers ── */
export const EngineRoom = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label={e('Vier Container auf einem Rechner, alle mit dem einen Linux-Kernel darunter verbunden', 'Four containers on one machine, all connected to the one Linux kernel below')}>
      <Zone x={20} y={70} w={960} h={290} label={e('Dein Rechner', 'Your machine')} sub="Linux" />
      {(['frontend', 'api', 'db', 'other'] as const).map((s, k) => (
        <g key={s}>
          <Box x={150 + k * 190} y={130} w={150} h={60} svc={s} label={s === 'other' ? 'redis' : undefined} i={1} />
          <Wire d={`M${225 + k * 190} 192 V266`} i={3} />
        </g>
      ))}
      <B x={40} y={266} w={920} h={74} t="kernel" label={e('Linux-Kernel', 'Linux kernel')} sub={e('verteilt Rechenzeit, Speicher und Netz an alle', 'shares out CPU time, memory and network to all')} i={2} />
      <Tag x={20} y={0} w={300} label={e('Ein Kernel für alle', 'One kernel for all')} sub={e('kein Container hat einen eigenen', 'no container has its own')} tone="blue" i={2} />
      <Lead d="M320 46 V262" end={[320, 264]} i={2} />
      <Tag x={350} y={0} w={300} label={e('Darum starten Container schnell', 'That is why containers start fast')} sub={e('der Kernel läuft schon', 'the kernel is already running')} i={4} />
      <Tag x={680} y={0} w={300} label={e('Linux-Container, Linux-Kernel', 'Linux containers, Linux kernel')} sub={e('der Kernel muss zu den Containern passen', 'the kernel must match the containers')} tone="sand" i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Container bringen keinen eigenen Kernel mit. Sie laufen alle auf dem einen Kernel des Rechners.', 'Containers bring no kernel of their own. They all run on the one kernel of the machine.')} />
  </div>
)

/* ── not a server, not a VM ── */
const trio = ['frontend', 'api', 'db'] as const
export const NoVm = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label={e('Links drei VMs mit je eigenem Betriebssystem über einem Hypervisor, rechts drei Container über der Docker Engine, beide auf dem Kernel des Rechners', 'Left three VMs each with its own operating system above a hypervisor, right three containers above the Docker Engine, both on the machine’s kernel')}>
      <Tag x={20} y={0} w={460} label={e('Virtuelle Maschinen', 'Virtual machines')} sub={e('jede App bekommt ein eigenes Betriebssystem', 'every app gets an operating system of its own')} tone="sky" />
      <Tag x={520} y={0} w={460} label="Container" sub={e('alle Apps teilen sich einen Kernel', 'all apps share one kernel')} tone="sky" i={3} />
      <Zone x={20} y={60} w={460} h={280} label={e('Rechner', 'Machine')} i={1} />
      {trio.map((s, k) => (
        <g key={s}>
          <Zone x={36 + k * 148} y={92} w={136} h={154} t="guest" label="VM" i={1} />
          <Box x={46 + k * 148} y={120} w={116} h={46} svc={s} size={13} i={2} />
          <B x={46 + k * 148} y={176} w={116} h={56} t="kernel" label={e('Gast-OS', 'Guest OS')} sub="+ Kernel" size={13} i={2} />
        </g>
      ))}
      <B x={36} y={256} w={428} h={30} t="hyper" label="Hypervisor" size={13} i={1} />
      <B x={36} y={294} w={428} h={34} t="kernel" label={e('Kernel des Rechners', 'Machine’s kernel')} size={13} i={1} />
      <Zone x={520} y={60} w={460} h={280} label={e('Rechner', 'Machine')} i={4} />
      {trio.map((s, k) => <Box key={s} x={548 + k * 144} y={186} w={130} h={56} svc={s} size={14} i={5} />)}
      <B x={536} y={256} w={428} h={30} t="engine" label="Docker Engine" size={13} i={4} />
      <B x={536} y={294} w={428} h={34} t="kernel" label={e('Kernel des Rechners', 'Machine’s kernel')} size={13} i={4} />
      <Tag x={60} y={356} w={380} label={e('startet in Minuten · braucht GB', 'starts in minutes · needs GB')} sub={e('jede VM bootet ein eigenes Betriebssystem', 'every VM boots its own operating system')} tone="sand" i={3} />
      <Tag x={560} y={356} w={380} label={e('startet in Sekunden · braucht MB', 'starts in seconds · needs MB')} sub={e('alle nutzen den einen Kernel', 'all use the one kernel')} tone="ok" i={6} />
    </Svg>
  </div>
)

/* ── the life of a container ── */
const life: { title: string; cmd: string; sub: string; svc?: boolean; dim?: boolean; ghost?: boolean }[] = [
  { title: e('angelegt', 'created'), cmd: 'docker create', sub: e('aus dem Image', 'from the image') },
  { title: e('laufend', 'running'), cmd: 'docker start', sub: e('der Prozess läuft', 'the process runs'), svc: true },
  { title: e('angehalten', 'stopped'), cmd: 'docker stop', sub: e('existiert noch, mit Dateien', 'still exists, with its files'), dim: true },
  { title: e('entfernt', 'removed'), cmd: 'docker rm', sub: e('weg, mit allen Änderungen', 'gone, with all changes'), ghost: true },
]
export const Life = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Vier Stationen: angelegt, laufend, angehalten, entfernt', 'Four stages: created, running, stopped, removed')}>
      {life.map((s, k) => {
        const x = 10 + k * 250
        return (
          <g key={s.title}>
            <In i={k}><rect x={x} y={20} width={226} height={230} rx={16} fill="#fff" stroke="var(--line)" strokeWidth={1.5} /></In>
            <g opacity={s.dim ? .45 : 1}><Box x={x + 48} y={100} w={130} h={58} svc="api" ghost={s.ghost} i={k} /></g>
            {s.svc && <In i={k}><circle cx={x + 172} cy={94} r={9} fill="var(--ok)" stroke="#fff" strokeWidth={2} /></In>}
            <In i={k}><Txt x={x + 113} y={204} size={17} w={700} fill="var(--ink)" anchor="middle">{s.title}</Txt><Txt x={x + 113} y={226} size={13} anchor="middle">{s.sub}</Txt></In>
            <In i={k}><text x={x + 113} y={282} textAnchor="middle" fontSize={14} style={{ fontFamily: "var(--mono)" }} fill="var(--ink-2)">{s.cmd}</text></In>
            {k < 3 && arrow(`M${x + 228} 129 H${x + 246}`, k + 1)}
          </g>
        )
      })}
      <Tag x={190} y={296} w={620} label={e('docker run = anlegen und gleich starten', 'docker run = create and start right away')} tone="blue" i={4} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Angehalten ist nicht gelöscht. Erst docker rm entfernt den Container. Das Image bleibt auf der Festplatte.', 'Stopped is not removed. Only docker rm removes the container. The image stays on the disk.')} />
  </div>
)

/* ── Linux, macOS and Windows: the platform slide, the only one with a Linux VM ── */
const os3 = [
  { x: 0, name: 'Linux', vm: '' },
  { x: 334, name: 'macOS', vm: 'Docker Desktop' },
  { x: 668, name: 'Windows', vm: 'WSL 2' },
]
export const OtherWaters = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label={e('Unter Linux laufen Container direkt auf dem Kernel, unter macOS und Windows in einer kleinen Linux-VM', 'On Linux containers run directly on the kernel, on macOS and Windows inside a small Linux VM')}>
      {os3.map((o, k) => (
        <g key={o.name}>
          <Zone x={o.x + 6} y={70} w={320} h={300} label={o.name} i={k * 2} />
          {o.vm ? (
            <>
              <Zone x={o.x + 22} y={104} w={288} h={156} t="guest" label={e('Linux-VM', 'Linux VM')} sub={o.vm} i={k * 2 + 1} />
              <Box x={o.x + 38} y={138} w={120} h={50} svc="api" size={13} i={k * 2 + 1} /><Box x={o.x + 174} y={138} w={120} h={50} svc="db" size={13} i={k * 2 + 1} />
              <B x={o.x + 38} y={200} w={256} h={44} t="kernel" label={e('Linux-Kernel', 'Linux kernel')} size={14} i={k * 2 + 1} />
              <B x={o.x + 22} y={270} w={288} h={28} t="hyper" label={e('Hypervisor des Betriebssystems', 'hypervisor of the OS')} size={12.5} i={k * 2 + 1} />
            </>
          ) : (
            <><Box x={o.x + 38} y={196} w={120} h={50} svc="api" size={13} i={1} /><Box x={o.x + 174} y={196} w={120} h={50} svc="db" size={13} i={1} /></>
          )}
          <B x={o.x + 22} y={308} w={288} h={44} t="kernel" label={e(`Kernel: ${o.name}`, `kernel: ${o.name}`)} size={14} i={k * 2} />
        </g>
      ))}
      <Tag x={10} y={0} w={312} label={e('Linux: direkt', 'Linux: directly')} sub={e('Container nutzen den Kernel des Rechners', 'containers use the machine’s kernel')} tone="ok" i={1} />
      <Tag x={344} y={0} w={312} label={e('macOS: über eine Linux-VM', 'macOS: via a Linux VM')} sub={e('der Kernel kommt aus der VM', 'the kernel comes from the VM')} tone="sand" i={3} />
      <Tag x={678} y={0} w={312} label={e('Windows: über eine Linux-VM', 'Windows: via a Linux VM')} sub={e('dasselbe Prinzip über WSL 2', 'the same idea via WSL 2')} tone="sand" i={5} />
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Linux-Container brauchen einen Linux-Kernel. Auf dem Mac und unter Windows bringt Docker dafür eine kleine Linux-VM mit, ihr merkt davon kaum etwas.', 'Linux containers need a Linux kernel. On a Mac and on Windows, Docker brings a small Linux VM for that, you hardly notice it.')} />
  </div>
)
