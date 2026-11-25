import { Stack, at, ctr, vm, css, type Block } from '../../components/Stack.tsx'
import { Svg, Box, Arrow, Label, Zone, Wire, Ctr, Take } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { t } from '../../i18n.ts'
import { Code, type Line } from '../../components/Code.tsx'
import { Visuals } from '../../components/Visuals.tsx'
import './diagrams.css'
import { e } from '../../components/quizModel.ts'

// Detailed diagrams for the deeper sub-chapters of this topic. The overview sub-chapter draws with views.tsx.

/* ── 4 · three levels ── */
export const Levels = () => (
  <div className="c0-levels">
    <div className="trio">
      <Stack size="s" title="Ebene Anwendung" sub="Prozess-Virtualisierung" rows={[
        'hardware', 'kernel', 'hostApps', { part: 'runtime', sub: 'z. B. JVM, WildFly' },
        [{ unit: 'Prozess 1', kind: 'proc', rows: ['app'] }, { unit: 'Prozess 2', kind: 'proc', rows: ['app'] }],
      ]} boundary={4} />
      <Stack d={2} size="s" title="Ebene Betriebssystem" sub="OS-Virtualisierung" tag="Docker" rows={[
        'hardware', 'kernel', 'engine', [ctr(1), ctr(2)],
      ]} boundary={3} />
      <Stack d={4} size="s" title="Ebene Hardware" sub="System-Virtualisierung" rows={[
        'hardware', 'kernel', 'hypervisor', [vm(1), vm(2)],
      ]} boundary={3} />
    </div>
    <div className="axis" style={at(9)}>
      <span><b>{t('Grenze hoch')}</b> {t('Apps teilen sich fast alles')}</span>
      <i />
      <span><b>{t('Grenze tief')}</b> {t('Jede VM bringt sogar einen eigenen Kernel mit')}</span>
    </div>
  </div>
)

/* ── 9 · architecture: a request travels down to the kernel and the answer back up ── */
export const Architecture = () => (
  <Svg w={1000} h={510} label="Docker-Architektur: Nutzer, Client, Daemon, Kernel und Registry">
    <g className="sb" data-t="app" style={at(0)}><rect x={150} y={10} width={700} height={484} rx={22} /></g>
    <Label x={172} y={38} anchor="start" size={16} weight={700}>Docker Host · Linux-Rechner oder Server</Label>
    <g className="sb" data-t="host" style={at(0)}><rect x={165} y={52} width={670} height={260} rx={16} /></g>
    <Label x={180} y={76} anchor="start" size={13} weight={700} tone="muted">USERSPACE · PROGRAMME</Label>
    <Box i={5} x={165} y={332} w={670} h={78} t="kernel" label="Host-Kernel · Linux" sub="trennt die Container voneinander und teilt CPU und RAM zu" />
    <Box x={165} y={424} w={670} h={56} t="hw" label="Hardware · CPU · RAM · Speicher" />

    <g style={at(1)} className="sl"><Icon name="person" x={10} y={76} s={60} /></g>
    <Label x={40} y={156} weight={700} i={1}>Du</Label>
    <Box i={1} x={195} y={96} w={170} h={66} label="Client" sub="Kommandozeile, Desktop" />
    <Box i={2} x={420} y={96} w={190} h={66} t="engine" label="Docker Daemon" sub="steuert alles" />
    <Box i={3} x={665} y={96} w={150} h={66} t="libs" label="Lokale Images" sub="nur lesbare Vorlagen" />
    <g style={at(4)} className="sl"><Icon name="warehouse" x={890} y={70} s={80} /></g>
    <Label x={930} y={176} weight={700} i={4}>Registry</Label>
    <Label x={930} y={196} size={13} tone="muted" i={4}>z. B. Docker Hub</Label>
    <Box i={6} x={185} y={222} w={160} h={58} t="container" label="Container A" sub="isolierter Prozess" />
    <Box i={6} x={665} y={222} w={150} h={58} t="container" label="Container B" sub="isolierter Prozess" />

    <Arrow i={1} d="M76 106 H191" n={1} nx={110} ny={106} label="Auftrag" lx={110} ly={88} />
    <Arrow i={2} d="M367 116 H416" n={2} nx={391} ny={116} label="API" lx={391} ly={90} />
    <Arrow i={3} d="M612 129 H661" n={3} nx={636} ny={129} label="vorhanden?" lx={636} ly={90} />
    <Arrow i={4} d="M888 129 H819" n={4} nx={868} ny={129} label="herunterladen" lx={930} ly={222} />
    <Arrow i={5} d="M515 164 V328" n={5} nx={515} ny={196} label="Container anlegen" lx={499} ly={238} anchor="end" />
    <Label i={5} x={499} y={256} anchor="end" weight={600}>Ressourcen festlegen</Label>
    <Arrow i={6} kind="ok" d="M265 330 V284" n={6} nx={265} ny={297} label="laufen isoliert" lx={285} ly={302} anchor="start" />
    <Arrow i={6} kind="ok" d="M740 330 V284" />
    <Arrow i={7} kind="back" d="M416 146 H369" />
    <Arrow i={7} kind="back" d="M191 150 H76" n={7} nx={110} ny={150} label="Status &" lx={110} ly={182} />
    <Label i={7} x={110} y={198} weight={600}>Ausgabe</Label>
  </Svg>
)

/* ── 10 · image, container, registry ── */
export const ImageContainer = () => (
  <Svg w={1000} h={440} label="Registry als Ablage, Image als Vorlage, Container als laufende Exemplare">
    <g className="sl" style={at(0)}><Icon name="warehouse" x={30} y={70} s={160} /></g>
    <Label i={0} x={110} y={266} size={22} weight={700}>Registry</Label>
    <Label i={0} x={110} y={290} tone="muted">Lagerhaus für viele Images</Label>
    <Arrow i={1} d="M200 160 H300" label="herunterladen" lx={250} ly={145} />
    <g className="sl" style={at(2)}><Icon name="blueprint" x={310} y={70} s={160} /></g>
    <Label i={2} x={390} y={266} size={22} weight={700}>Image</Label>
    <Label i={2} x={390} y={290} tone="muted">Vorlage, nur lesbar</Label>
    <Label i={2} x={390} y={314} tone="blue" weight={700}>≈ Klasse</Label>
    {[0, 1, 2].map(k => (
      <g key={k}>
        <Arrow i={3 + k} d={`M480 ${150 + k * 10} C 580 ${150 + k * 10}, 590 ${70 + k * 120}, 686 ${70 + k * 120}`} label={`Start ${k + 1}`} lx={652} ly={k === 2 ? 336 : 54 + k * 120} />
        <g className="sl" style={at(3 + k)}><Icon name="crate" x={694} y={36 + k * 120} s={70} /></g>
        <Label i={3 + k} x={780} y={78 + k * 120} anchor="start" size={18} weight={700}>{`Container ${k + 1}`}</Label>
      </g>
    ))}
    <Label i={6} x={729} y={414} tone="blue" weight={700}>≈ Objekte</Label>
    <Label i={7} x={360} y={400} size={15} weight={600}>Jeder Start baut ein neues Objekt nach demselben Plan.</Label>
    <Label i={7} x={360} y={424} size={15} tone="muted">Das Image enthält keine Container und bleibt unverändert.</Label>
  </Svg>
)

/* ── 11 · lifecycle: one main path; branches leave it and end on their own. A restart ends at the right edge (↻). ── */
const main: [string, string, 'app' | 'libs' | 'engine' | 'host' | 'gone'][] = [['Bauanleitung', 'Dockerfile', 'app'], ['Image', '', 'libs'], ['Erstellt', '', 'app'], ['Läuft', '', 'engine'], ['Gestoppt', '', 'host'], ['Gelöscht', '', 'gone']]

const steps = ['bauen', 'erstellen', 'starten', 'stoppen', 'löschen']

export const Lifecycle = () => (
  <div>
    <Svg w={1000} h={490} label="Lebenszyklus: Normalfall mit Abzweigungen">
      {main.map(([l, sub, t], k) => <Box key={l} i={k} x={10 + k * 172} y={200} w={120} h={60} t={t} label={l} sub={sub || undefined} size={15} />)}
      {steps.map((l, k) => <Arrow key={l} i={k + 1} d={`M${132 + k * 172} 230 H${178 + k * 172}`} label={l} lx={155 + k * 172} ly={192} />)}

      <Box i={7} x={182} y={60} w={120} h={56} t="reg" label="Registry" size={15} />
      <Arrow i={7} kind="mute" d="M242 118 V196" label="oder herunterladen" lx={252} ly={162} anchor="start" />

      <Arrow i={8} kind="back" d="M758 198 V90 H866" label="wieder starten" lx={812} ly={80} />
      <Box i={8} x={870} y={60} w={120} h={60} t="engine" label="↻ Läuft" sub="neu gestartet" size={15} />

      <Arrow i={9} kind="bad" d="M600 262 V340 H636" label="Fehler" lx={608} ly={300} anchor="start" />
      <Box i={9} x={640} y={310} w={150} h={60} t="bad" label="Abgestürzt" sub="Fehlercode" size={15} />
      <Arrow i={10} kind="back" d="M792 340 H866" label="Neustart-Regel" lx={830} ly={302} />
      <Box i={10} x={870} y={310} w={120} h={60} t="engine" label="↻ Läuft" sub="neu gestartet" size={15} />

      <Arrow i={11} kind="ok" d="M560 262 V440 H636" label="Aufgabe erledigt" lx={568} ly={400} anchor="start" />
      <Box i={11} x={640} y={410} w={150} h={60} t="ok" label="Fertig" sub="Code 0" size={15} />
      <Arrow i={12} kind="ok" d="M792 440 H866" label="automatisch entfernen" lx={830} ly={402} />
      <Box i={12} x={870} y={410} w={120} h={60} t="gone" label="Gelöscht" size={15} />
    </Svg>
    <div className="dg-legend" style={at(13)}>
      <span><i />{t('Normalfall')}</span>
      <span><i style={css({ '--c': 'var(--bad)' })} />{t('Fehler')}</span>
      <span><i style={css({ '--c': 'var(--ok)' })} />{t('Einmal-Aufgabe')}</span>
      <span><i data-dash style={css({ '--c': 'var(--blue)' })} />{t('Neustart: ↻ hier beginnt es erneut')}</span>
      <span><i style={css({ '--c': 'var(--ink-3)' })} />{t('Image aus der Registry')}</span>
    </div>
  </div>
)

/* ── 13 · limits: what is separated, and what a kernel fault hits ── */
const iso: [string, string, 0 | 1, 0 | 1, 0 | 1][] = [
  ['Prozessliste', 'PID-Namespace', 0, 1, 1],
  ['Dateisystem', 'Mount-Namespace', 0, 1, 1],
  ['Netzwerk', 'Netz-Namespace', 0, 1, 1],
  ['Ressourcen-Limits', 'cgroups', 0, 1, 1],
  ['Kernel', 'geteilt', 0, 0, 1],
]

const mk = (v: 0 | 1) => <span className="mk" data-m={v ? 'ok' : 'bad'}>{v ? '✓' : '✗'}</span>

export const Limits = () => (
  <div className="c0-limits">
    <div className="iso" style={at(0)}>
      <div className="spectrum"><span>{t('leichtgewichtig')}</span><i /><span>{t('stark isoliert')}</span></div>
      <table className="tbl iso-tbl">
        <thead><tr><th scope="col">{t('Eigene …')}</th><th scope="col">{t('Prozess')}</th><th scope="col">Container</th><th scope="col">VM</th></tr></thead>
        <tbody>{iso.map(([q, how, p, c, v], k) => (
          <tr key={q} style={at(k + 1)}><th scope="row">{t(q)}</th><td>{mk(p)}</td><td>{mk(c)}<small>{t(how)}</small></td><td>{mk(v)}</td></tr>
        ))}</tbody>
      </table>
    </div>
    <div className="duo">
      <Stack d={6} size="s" title="Kernel-Fehler bei Containern" sub="trifft alle" rows={[
        'hardware', { part: 'kernel', sub: 'Linux · ⚡ Fehler', mark: 'bad' }, 'engine', [ctr(1, ['app'], 'bad'), ctr(2, ['app'], 'bad')],
      ]} />
      <Stack d={9} size="s" title="Kernel-Fehler in VM 1" sub="trifft nur VM 1" rows={[
        'hardware', 'kernel', { part: 'hypervisor', sub: 'für VMs' }, [vm(1, [{ part: 'guestKernel', sub: '⚡ Fehler', mark: 'bad' }, 'app'], 'bad'), vm(2, ['guestKernel', 'app'], 'ok')],
      ]} />
    </div>
  </div>
)

/* ── 5 · VM versus container ── */
export const VmVsContainer = () => (
  <div className="c2-vm">
    <div className="duo">
      <Stack size="s" title="Virtuelle Maschinen" sub="jede VM bootet ihren eigenen Kernel" rows={['hardware', 'kernel', 'hypervisor', [vm(1), vm(2), vm(3)]]} boundary={3} />
      <Stack d={3} size="s" title="Container" sub="alle teilen sich den Host-Kernel" rows={['hardware', 'kernel', 'engine', [ctr(1), ctr(2), ctr(3)]]} boundary={3} />
    </div>
    <div className="vis" style={css({ '--d': 8 })}>
      <Visuals v={{ kind: 'bars', legend: ['VM', 'Container'], rows: [{ label: 'Größe', a: 90, b: 15 }, { label: 'Startzeit', a: 85, b: 10 }] }} />
    </div>
  </div>
)

/* ── 6 · own operating system? ── */
const distro = (n: number, files: string): Block => ctr(n, [{ part: 'guestKernel', mark: 'gone', sub: 'gibt es nicht' }, { part: 'libs', label: files }, 'app'])

export const OwnOs = () => (
  <div className="c2-own">
    <Stack rows={['hardware', { part: 'kernel', sub: 'Linux · einer für alle Container', mark: 'focus' }, 'engine',
      [distro(1, 'Ubuntu-Dateien'), distro(2, 'Alpine-Dateien'), distro(3, 'Debian-Dateien')]]} boundary={3} />
    <div className="answer">
      <div style={at(5)}><span data-m="ok">✓</span><b>{t('Eigene Betriebssystem-Dateien')}</b><small>{t('Programme und Bibliotheken von Ubuntu, Alpine oder Debian')}</small></div>
      <div style={at(6)}><span data-m="bad">✗</span><b>{t('Eigener Kernel')}</b><small>{t('Alle Container nutzen den Kernel des Hosts')}</small></div>
    </div>
  </div>
)

/* ── 7 · where Docker sits ── */
export const Where = () => (
  <div className="c2-where">
    <Stack rows={['hardware', 'kernel', [{ part: 'engine', sub: 'Docker', w: 2 }, 'hostApps'], [ctr(1), ctr(2), null]]} roles={[
      { label: 'Betreiber', sub: 'stellt Rechner und Betriebssystem', from: 0, to: 1 },
      { label: 'Docker', sub: 'verwaltet Images und Container', from: 2, to: 2 },
      { label: 'Entwickler', sub: 'liefert, was im Container steckt', from: 3, to: 3 },
    ]} />
  </div>
)

/* ── 8 · Linux, macOS, Windows: inside the VM it is the same stack as on Linux ── */
const linuxVm = (sub: string): Block => ({ unit: 'Linux-VM', kind: 'vm', sub, rows: [{ part: 'guestKernel', sub: 'Linux', mark: 'focus' }, 'engine', [ctr(1, ['app']), ctr(2, ['app'])]] })

export const Platforms = () => (
  <div className="trio c2-plat">
    <Stack size="s" title="Linux" sub="wie auf allen anderen Folien" rows={[
      'hardware', { part: 'kernel', sub: 'Linux', mark: 'focus' }, 'engine', [ctr(1, ['app']), ctr(2, ['app'])],
    ]} />
    <Stack d={2} size="s" title="macOS" sub="Eine Engine startet eine Linux-VM" rows={[
      'hardware', { part: 'kernel', sub: 'macOS: kein Linux' }, { part: 'hypervisor', sub: 'von macOS' }, linuxVm('z. B. Docker Desktop, Colima'),
    ]} />
    <Stack d={4} size="s" title="Windows" sub={e('Linux-Container in einer Linux-VM, Windows-Container direkt', 'Linux containers in a Linux VM, Windows containers directly')} rows={[
      'hardware', { part: 'kernel', sub: 'Windows: kein Linux' }, { part: 'hypervisor', sub: 'von Windows' }, linuxVm(e('Docker Desktop, VM über WSL 2', 'Docker Desktop, VM via WSL 2')),
    ]} />
  </div>
)

// The running example of this sub-chapter: one command, followed through the whole system.
/* ═══ Docker im System ═══ */
/* The whole machine on one slide, at the level of this sub-chapter: who runs, what the kernel adds, what lies on disk. */
export const SystemMap = () => (
  <div className="dg-col">
    <Svg w={1000} h={470} label="Ein Docker-Host: Programme im Userspace, Mechanismen im Kernel, Daten auf der Festplatte">
      <Zone x={0} y={0} w={1000} h={470} t="app" label="Docker Host · ein Linux-Rechner" />
      <Zone x={14} y={34} w={972} h={170} label="USERSPACE · hier laufen Programme" />
      <Box i={1} x={40} y={86} w={170} h={72} label="docker" sub="dein Befehl" size={17} />
      <Box i={2} x={290} y={86} w={210} h={72} t="engine" label="dockerd" sub="verwaltet alles" size={17} />
      <Arrow i={2} d="M212 122 H286" label="Auftrag" lx={249} ly={110} />
      <Zone i={3} x={580} y={46} w={390} h={146} t="app" label="Container" />
      <Box i={3} x={596} y={80} w={172} h={96} t="container" label="nginx" sub="frontend" size={17} />
      <Box i={3} x={782} y={80} w={172} h={96} t="container" label="postgres" sub="db" size={17} />
      <Arrow i={3} d="M502 122 H576" label="startet" lx={539} ly={110} />
      <Zone i={4} x={14} y={214} w={972} h={116} t="kernel" label="KERNEL · hier entsteht die Isolation" />
      {([['Namespaces', 'wer was sieht'], ['cgroups', 'wer wie viel darf'], ['OverlayFS', 'Dateisystem aus Layern'], ['Netzwerk', 'Bridge und Ports']] as const).map(([l, s], k) => (
        <Box key={l} i={4} x={24 + k * 238} y={248} w={226} h={70} t="kchip" label={l} sub={s} size={15} />
      ))}
      <Arrow i={5} d="M850 194 V244" />
      <Zone i={6} x={14} y={340} w={972} h={118} t="reg" label="FESTPLATTE · bleibt nach einem Neustart" />
      {([['Images', 'Layer, nur lesbar'], ['Container', 'Schreibschicht und Logs'], ['Volumes', 'deine Daten']] as const).map(([l, s], k) => (
        <Box key={l} i={6} x={24 + k * 320} y={374} w={312} h={70} label={l} sub={s} size={16} />
      ))}
      <Arrow i={7} d="M494 160 V370" label="speichert" lx={484} ly={190} anchor="end" />
    </Svg>
    <Take i={8} label="Merke" text="`docker` gibt nur den Auftrag. `dockerd` führt ihn aus, und die eigentliche Isolation macht der Linux-Kernel." />
  </div>
)

/* How a typed command reaches the daemon. */
const apiLines: Line[] = [
  { t: 'docker run -d --name frontend nginx:1.27', k: 'cmd' },
  { t: '# der Client übersetzt das in HTTP-Anfragen:', k: 'note' },
  { t: 'POST /containers/create?name=frontend', n: 1 },
  { t: '  { "Image": "nginx:1.27", … }' },
  { t: '← 201 { "Id": "e5f6…" }', k: 'ok' },
  { t: 'POST /containers/e5f6…/start', n: 2 },
  { t: '← 204', k: 'ok' },
  { t: '# dieselbe Anfrage geht auch von Hand:', k: 'note' },
  { t: 'curl --unix-socket /var/run/docker.sock \\', k: 'cmd' },
  { t: '    http://localhost/containers/json', k: 'cont' },
]

export const ApiCall = () => (
  <div className="dg-split">
    <Code title="Terminal" lines={apiLines} />
    <div className="dg-col">
      <Svg w={600} h={440} label="Der Client spricht über die Socket-Datei mit dem Daemon">
        <Zone x={0} y={0} w={600} h={440} label="Host-Rechner" />
        <Box i={1} x={30} y={44} w={230} h={70} label="docker" sub="Client, endet nach dem Befehl" size={18} />
        <Box i={1} x={340} y={44} w={230} h={70} t="gone" label="Compose, Desktop, SDKs" sub="dieselbe Schnittstelle" size={15} />
        <Box i={2} x={30} y={190} w={540} h={70} t="reg" label="/var/run/docker.sock" sub="eine Datei als Tür: nur root und Gruppe docker dürfen hinein" size={17} mono />
        <Box i={4} x={30} y={330} w={540} h={80} t="engine" label="dockerd" sub="läuft dauerhaft im Hintergrund, als root" size={20} />
        <Arrow i={2} d="M110 116 V186" n={1} nx={110} ny={150} label="Anfragen" lx={130} ly={155} anchor="start" />
        <Arrow i={2} kind="mute" d="M455 116 V186" />
        <Arrow i={3} d="M110 262 V326" n={2} nx={110} ny={294} label="weitergereicht" lx={130} ly={299} anchor="start" />
        <Arrow i={5} kind="back" d="M470 328 V264" label="Antwort" lx={458} ly={299} anchor="end" />
      </Svg>
      <Take i={6} label="Achtung" text="Wer an den Socket kommt, steuert einen root-Prozess. Mitglied der Gruppe `docker` zu sein, ist praktisch root." />
    </div>
  </div>
)

/* ═══ Der Start im Detail ═══ */
/* From dockerd down to the running process. */
export const RunChain = () => (
  <div className="dg-col">
    <Svg w={1000} h={470} label="Von dockerd über containerd, shim und runc zum Kernel und zum laufenden Prozess">
      <Zone x={0} y={0} w={1000} h={316} label="USERSPACE" />
      <Box i={0} x={20} y={46} w={160} h={72} t="engine" label="dockerd" sub="prüft, plant Netz" size={16} />
      <Box i={2} x={235} y={46} w={160} h={72} t="runtime" label="containerd" sub="bereitet Bundle vor" size={16} />
      <Box i={4} x={450} y={46} w={160} h={72} t="libs" label="shim" sub="wird Elternprozess" size={16} />
      <Box i={6} x={665} y={46} w={160} h={72} t="kchip" label="runc" sub="baut den Container" size={16} />
      <Arrow i={1} d="M182 92 H231" n={1} nx={207} ny={66} />
      <Arrow i={3} d="M397 92 H446" n={2} nx={421} ny={66} />
      <Arrow i={5} d="M612 92 H661" n={3} nx={636} ny={66} />
      <Box i={2} x={20} y={196} w={200} h={72} t="reg" label="Bundle" sub="config.json + Dateisystem" size={16} />
      <Arrow i={3} kind="mute" d="M300 120 C 300 170, 260 200, 224 216" />
      <Arrow i={7} kind="mute" d="M120 270 V296 H735 V122" label="liest" lx={420} ly={290} />
      <Ctr i={10} x={300} y={170} w={290} h={106} name="Container frontend" />
      <Box i={10} x={316} y={204} w={258} h={58} t="app" label="nginx" sub="PID 1 im Container" size={16} />
      <Arrow i={11} kind="back" both d="M530 120 V166" label="stdin, stdout, Exit-Code" lx={542} ly={150} anchor="start" />
      <Arrow i={8} d="M790 120 V326" n={4} nx={790} ny={165} label="Systemaufrufe" lx={808} ly={160} anchor="start" />
      <Label i={12} x={808} y={180} anchor="start" size={13} tone="muted">danach endet runc</Label>

      <Zone i={8} x={0} y={330} w={1000} h={140} t="kernel" label="KERNEL · macht aus einem Prozess einen Container" />
      {([['clone()', 'neue Namespaces'], ['cgroup-Dateien', 'Limits eintragen'], ['mount, pivot_root', 'Image wird zu /'], ['seccomp, Caps', 'Rechte kürzen'], ['execve()', 'nginx starten']] as const).map(([l, s], k) => (
        <Box key={l} i={9} x={16 + k * 196} y={366} w={184} h={88} t="kchip" label={l} sub={s} size={14} mono />
      ))}
      <Arrow i={10} kind="ok" d="M892 364 V240 H594" n={5} nx={660} ny={240} label="Prozess läuft" lx={850} ly={230} />
    </Svg>
  </div>
)

/* What is still running afterwards. */
export const AfterStart = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label="Prozessbaum nach dem Start: systemd, dockerd, containerd, je Container ein shim">
      <Box x={0} y={170} w={140} h={64} t="host" label="systemd" sub="PID 1 des Hosts" size={16} />
      <Box i={1} x={220} y={20} w={170} h={60} t="engine" label="dockerd" sub="API, Images, Netze" size={16} />
      <Box i={1} x={220} y={100} w={170} h={60} t="runtime" label="containerd" sub="Container verwalten" size={16} />
      <Box i={2} x={220} y={210} w={170} h={60} t="libs" label="shim" sub="für frontend" size={16} />
      <Box i={2} x={220} y={320} w={170} h={60} t="libs" label="shim" sub="für db" size={16} />
      {[50, 130, 240, 350].map((y, k) => <Wire key={y} i={k < 2 ? 1 : 2} d={`M142 202 H180 V${y} H218`} />)}
      <Ctr i={3} x={470} y={186} w={510} h={104} name="Container frontend" />
      <Box i={3} x={486} y={220} w={220} h={56} t="app" label="nginx" sub="master" size={15} />
      <Box i={3} x={744} y={220} w={220} h={56} t="app" label="nginx" sub="worker" size={15} />
      <Wire i={3} d="M708 248 H742" />
      <Ctr i={4} x={470} y={302} w={510} h={100} name="Container db" />
      <Box i={4} x={486} y={336} w={220} h={54} t="app" label="postgres" size={15} />
      <Arrow i={3} d="M392 240 H482" /><Arrow i={4} d="M392 350 H482" />
      <Box i={5} x={744} y={70} w={236} h={60} t="gone" label="runc" sub="hat sich längst beendet" size={16} />
      <Label i={6} x={470} y={46} anchor="start" size={14} weight={700}>Fällt dockerd aus:</Label>
      <Label i={6} x={470} y={66} anchor="start" size={13} tone="muted">docker-Befehle gehen nicht mehr.</Label>
      <Label i={6} x={470} y={106} anchor="start" size={14} weight={700}>Der shim hält den Container:</Label>
      <Label i={6} x={470} y={126} anchor="start" size={13} tone="muted">unabhängig von den Diensten darüber.</Label>
    </Svg>
    <Take i={7} label="Praxis" text="Mit `live-restore` in `daemon.json` laufen Container weiter, während dockerd neu startet oder aktualisiert wird." />
  </div>
)

/* Different tools, same standards: bands run across all columns. */
const toolX = [150, 435, 720]

const tools: { n: string; rows: [string, string, 'app' | 'engine' | 'runtime' | 'gone'][]; run: string }[] = [
  { n: 'Docker', rows: [['docker', 'Client', 'app'], ['dockerd', 'Daemon', 'engine'], ['containerd', 'Verwalter', 'runtime']], run: 'runc' },
  { n: 'Podman', rows: [['podman', 'Client', 'app'], ['kein Daemon', 'läuft als dein Prozess', 'gone'], ['conmon', 'überwacht', 'runtime']], run: 'crun' },
  { n: 'Kubernetes', rows: [['kubectl', 'Client', 'app'], ['API-Server, kubelet', 'steuern die Rechner', 'engine'], ['containerd, CRI-O', 'über CRI', 'runtime']], run: 'runc' },
]

export const Standards = () => (
  <div className="dg-col">
    <Svg w={1000} h={470} label="Docker, Podman und Kubernetes unterscheiden sich oben und nutzen unten dieselben OCI-Standards">
      {tools.map((c, k) => (
        <g key={c.n}>
          <Label i={k} x={toolX[k] + 130} y={18} size={17} weight={700} tone="blue">{c.n}</Label>
          {c.rows.map(([l, s, t], r) => <Box key={l} i={k} x={toolX[k]} y={32 + r * 62} w={260} h={54} t={t} label={l} sub={s} size={15} />)}
          <Arrow i={3} d={`M${toolX[k] + 130} 212 V227`} />
          <Arrow i={4} d={`M${toolX[k] + 130} 264 V283`} />
          <Box i={4} x={toolX[k]} y={286} w={260} h={46} t="kchip" label={c.run} size={15} mono />
        </g>
      ))}
      <Label i={3} x={0} y={70} anchor="start" size={14} weight={700}>Oben</Label><Label i={3} x={0} y={90} anchor="start" size={13} tone="muted">verschieden</Label>
      <Label i={3} x={0} y={243} anchor="start" size={14} weight={700}>Darunter</Label><Label i={3} x={0} y={261} anchor="start" size={13} tone="muted">gemeinsam</Label>
      <Box i={3} x={150} y={230} w={830} h={32} t="reg" label="OCI Runtime Spec · so wird ein Container gestartet" size={14} />
      <Box i={5} x={150} y={352} w={830} h={40} t="libs" label="OCI Image Spec · dasselbe Image läuft in allen drei" size={15} />
      <Box i={6} x={150} y={402} w={830} h={40} t="reg" label="OCI Distribution Spec · dieselben Registries" size={15} />
      <g className="sl" style={at(5)}><Icon name="blueprint" x={60} y={350} s={44} /></g>
      <g className="sl" style={at(6)}><Icon name="warehouse" x={60} y={400} s={44} /></g>
    </Svg>
  </div>
)
