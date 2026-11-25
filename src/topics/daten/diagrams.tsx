import { at } from '../../components/Stack.tsx'
import { Svg, Box, Arrow, Label, Ctr, Tick, Zone, Take, type BoxTone } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { t } from '../../i18n.ts'
import './diagrams.css'
import { e } from '../../components/quizModel.ts'

// Detailed diagrams for the deeper sub-chapters of this topic. The overview sub-chapter draws with views.tsx.

/* ── 9 · volumes: where the data lives, and what Compose creates and deletes ── */
type Cell = [0 | 1 | null, string]

const vol: { code: string; sub: string; up: Cell; down: Cell; downV: Cell }[] = [
  { code: 'dbdata:/var/lib/postgresql', sub: 'benanntes Volume, oben deklariert', up: [1, 'legt an'], down: [1, 'bleibt'], downV: [0, 'gelöscht'] },
  { code: './data:/var/lib/postgresql', sub: 'Bind-Mount: Ordner im Projekt', up: [1, 'Ordner, falls er fehlt'], down: [1, 'bleibt'], downV: [1, 'bleibt'] },
  { code: 'dbdata + external: true', sub: 'vorher von Hand angelegt', up: [0, 'Fehler, wenn es fehlt'], down: [1, 'bleibt'], downV: [1, 'bleibt'] },
  { code: 'dbdata:/var/lib/postgresql', sub: 'aber oben nicht deklariert', up: [0, 'Fehler: undefined volume'], down: [null, ''], downV: [null, ''] },
  { code: 'kein Eintrag', sub: 'Daten in der Schreibschicht', up: [null, 'nichts'], down: [0, 'weg*'], downV: [0, 'weg'] },
]

const mk = ([v, s]: Cell) => v === null ? <small>{s ? t(s) : '–'}</small> : <><span className="mk" data-m={v ? 'ok' : 'bad'}>{v ? '✓' : '✗'}</span><small>{t(s)}</small></>

export const Volumes = () => (
  <div className="c1-vol">
    <Svg w={520} h={470} label="Container mit Schreibschicht, Volume im Host-Dateisystem">
      <Box x={10} y={412} w={500} h={48} t="hw" label="Hardware · Festplatte" />
      <Box i={1} x={10} y={356} w={500} h={48} t="kernel" label="Host-Kernel · Linux" />
      <Box i={2} x={10} y={300} w={276} h={48} t="engine" label="Container Engine" />
      <g className="sb" data-t="host" style={at(2)}><rect x={300} y={56} width={210} height={292} rx={14} /></g>
      <Label i={2} x={405} y={80} size={14} weight={700}>Host-Dateisystem</Label>
      <Box i={3} x={314} y={130} w={182} h={64} t="reg" label="Volume dbdata" sub="/var/lib/docker/volumes" size={15} />
      <Box i={3} x={314} y={218} w={182} h={64} t="reg" label="Ordner ./data" sub="Bind-Mount im Projekt" size={15} />
      <Label i={3} x={405} y={318} size={13} tone="muted">gehört dem Host</Label>

      <Ctr i={4} x={10} y={56} w={276} h={236} name="Container db" />
      <Box i={4} x={24} y={90} w={248} h={44} label="Postgres" sub="schreibt nach /var/lib/postgresql" size={15} />
      <Box i={4} x={24} y={140} w={248} h={44} t="reg" label="/var/lib/postgresql" sub="Mount: zeigt nach draußen" size={15} />
      <Box i={4} x={24} y={190} w={248} h={44} t="host" label="Schreibschicht" sub="alle übrigen Änderungen" size={15} />
      <Box i={4} x={24} y={240} w={248} h={44} t="libs" label="Image-Schichten" sub="postgres:18 · nur lesen" size={15} />
      <Arrow i={5} d="M274 162 H310" />
      <Label i={6} x={148} y={44} size={14} weight={700} tone="bad">✗ weg bei down</Label>
      <Label i={6} x={405} y={44} size={14} weight={700} tone="ok">✓ bleibt bei down</Label>
    </Svg>
    <div className="c1-col">
      <table className="tbl vol-tbl" style={at(7)}>
        <thead><tr><th scope="col">{t('Eintrag unter volumes')}</th><th scope="col">up</th><th scope="col">down</th><th scope="col">down -v</th></tr></thead>
        <tbody>{vol.map((r, k) => (
          <tr key={k} style={at(8 + k)}><th scope="row"><code>{t(r.code)}</code><small>{t(r.sub)}</small></th><td>{mk(r.up)}</td><td>{mk(r.down)}</td><td>{mk(r.downV)}</td></tr>
        ))}</tbody>
      </table>
      <p className="legend" style={at(13)}>{t('* Images wie postgres legen dann ein anonymes Volume an: Es bleibt liegen, der neue Container findet es aber nicht wieder.')}</p>
      <p className="legend" style={at(13)}>{t(e('Unter Docker Desktop (macOS, Windows) liegt /var/lib/docker in der Linux-VM, nicht auf eurer eigenen Platte.', 'With Docker Desktop (macOS, Windows) /var/lib/docker lives inside the Linux VM, not on your own disk.'))}</p>
    </div>
  </div>
)

/* ═══ Daten ═══ */
/* Four paths that look like one file system, and the place each one really lives. */
const mX = [14, 262, 510, 772]

const mounts: { path: string; flag: string; where: string; sub: string; t: 'host' | 'reg' | 'libs' | 'hyper'; rm: boolean; boot: boolean }[] = [
  { path: '/etc, /var …', flag: 'ohne Angabe', where: 'Schreibschicht', sub: 'gehört zum Container', t: 'host', rm: false, boot: true },
  { path: '/data', flag: '-v daten:/data', where: 'Volume daten', sub: 'verwaltet von Docker', t: 'reg', rm: true, boot: true },
  { path: '/app', flag: '-v ./app:/app', where: 'Ordner ./app', sub: 'dein Projektordner', t: 'libs', rm: true, boot: true },
  { path: '/tmp/cache', flag: '--tmpfs /tmp/cache', where: 'tmpfs', sub: 'nur im RAM', t: 'hyper', rm: false, boot: false },
]

export const Mounts = () => (
  <div className="dg-col">
    <Svg w={1000} h={420} label="Vier Pfade im Container und wo ihre Daten wirklich liegen">
      <Ctr x={0} y={0} w={1000} h={104} name="Container frontend · von innen sieht alles aus wie ein Dateisystem" />
      <Zone i={2} x={0} y={186} w={750} h={234} t="app" label="Festplatte des Hosts" />
      <Zone i={2} x={760} y={186} w={240} h={234} t="app" label="Arbeitsspeicher" />
      {mounts.map((m, k) => {
        const x = mX[k], c = x + 108
        return (
          <g key={m.path}>
            <Box i={1} x={x} y={34} w={216} h={58} t="container" label={m.path} sub={m.flag} size={15} mono />
            <Arrow i={2} d={`M${c} 106 V182`} />
            <Box i={3} x={x} y={222} w={216} h={70} t={m.t} label={m.where} sub={m.sub} size={15} />
            <Tick i={4} ok={m.rm} bad={!m.rm} x={x + 16} y={330} />
            <Label i={4} x={x + 34} y={335} anchor="start" size={13} weight={600} tone={m.rm ? 'ok' : 'bad'}>{m.rm ? 'bleibt nach docker rm' : 'weg nach docker rm'}</Label>
            <Tick i={5} ok={m.boot} bad={!m.boot} x={x + 16} y={376} />
            <Label i={5} x={x + 34} y={381} anchor="start" size={13} weight={600} tone={m.boot ? 'ok' : 'bad'}>{m.boot ? 'bleibt nach Neustart' : 'weg nach Stopp'}</Label>
          </g>
        )
      })}
    </Svg>
  </div>
)

/* ═══ Daten ═══ */
/* What happens to the image's files when something is mounted over them. */
const vcase: { title: string; mount: string; msub: string; t: BoxTone; arrow: string; res: string; rsub: string; rt: BoxTone; kind: 'ok' | 'bad' }[] = [
  { title: 'Leeres Volume', mount: 'Volume daten', msub: 'noch leer', t: 'reg', arrow: 'Docker kopiert', res: 'index.html, style.css', rsub: 'Inhalt aus dem Image', rt: 'ok', kind: 'ok' },
  { title: 'Volume mit Daten', mount: 'Volume daten', msub: 'enthält alt.html', t: 'reg', arrow: 'nichts wird kopiert', res: 'alt.html', rsub: 'neue Image-Dateien fehlen', rt: 'reg', kind: 'ok' },
  { title: 'Bind-Mount', mount: './leer', msub: 'Ordner auf dem Host', t: 'libs', arrow: 'verdeckt das Image', res: 'leerer Ordner', rsub: 'die App findet nichts', rt: 'bad', kind: 'bad' },
]

export const VolumeInit = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label="Was mit den Dateien des Images passiert, wenn etwas über den Ordner gemountet wird">
      {vcase.map((c, k) => {
        const x = k * 345, m = x + 155
        return (
          <g key={c.title}>
            <Zone i={k * 4} x={x} y={0} w={310} h={400} t="app" label={c.title} />
            <Box i={k * 4} x={x + 20} y={40} w={270} h={72} t="libs" label="/app im Image" sub="index.html, style.css" size={15} />
            <Box i={k * 4 + 1} x={x + 20} y={160} w={270} h={72} t={c.t} label={c.mount} sub={c.msub} size={15} />
            <Label i={k * 4 + 1} x={m} y={143} size={13} weight={700}>darüber gemountet</Label>
            <Arrow i={k * 4 + 2} kind={c.kind} d={`M${m} 234 V296`} label={c.arrow} lx={m + 12} ly={270} anchor="start" />
            <Box i={k * 4 + 3} x={x + 20} y={300} w={270} h={80} t={c.rt} label={c.res} sub={c.rsub} size={15} />
          </g>
        )
      })}
    </Svg>
    <Take i={12} label="Folge" text="Ein Volume wird nur beim ersten Mal gefüllt. Eine neue Image-Version ändert seinen Inhalt nicht mehr." />
  </div>
)

/* The same project four times: what is still there after each command. */
const objs: ['crate' | 'network' | 'folder' | 'blueprint', string][] = [['crate', 'Container'], ['network', 'Netz'], ['folder', 'Volume'], ['blueprint', 'Image']]

type Fate = 'keep' | 'gone' | 'stop'

const cleanup: [string, Fate[], string?][] = [
  ['docker compose stop', ['stop', 'keep', 'keep', 'keep']],
  ['docker compose down', ['gone', 'gone', 'keep', 'keep']],
  ['docker compose down -v', ['gone', 'gone', 'gone', 'keep']],
  ['docker compose down --rmi local', ['gone', 'gone', 'keep', 'gone'], 'nur Images ohne eigenen Tag'],
]

const fateText: Record<Fate, string> = { keep: 'bleibt', gone: 'gelöscht', stop: 'gestoppt' }

export const Cleanup = () => (
  <div className="dg-col">
    <Svg w={1000} h={370} label="Was nach stop, down, down -v und down --rmi local vom Projekt noch da ist">
      {cleanup.map(([c, fate, note], p) => {
        const px = (p % 2) * 510, py = Math.floor(p / 2) * 190
        return (
          <g key={c}>
            <Zone i={p * 2} x={px} y={py} w={490} h={180} t="app" />
            <Label i={p * 2} x={px + 18} y={py + 28} anchor="start" size={14} weight={700} mono>{c}</Label>
            {objs.map(([ic, l], k) => {
              const x = px + 24 + k * 116, f = fate[k]
              return (
                <g key={l}>
                  <g className="sl" style={{ ...at(p * 2 + 1), opacity: f === 'gone' ? .22 : 1 }}><Icon name={ic} x={x + 10} y={py + 44} s={54} /></g>
                  {f !== 'stop' && <Tick i={p * 2 + 1} ok={f === 'keep'} bad={f === 'gone'} x={x + 66} y={py + 50} />}
                  <Label i={p * 2 + 1} x={x + 37} y={py + 124} size={13} weight={700}>{l}</Label>
                  <Label i={p * 2 + 1} x={x + 37} y={py + 143} size={13} tone={f === 'gone' ? 'bad' : f === 'keep' ? 'ok' : 'muted'}>{fateText[f]}</Label>
                </g>
              )
            })}
            {note && <Label i={p * 2 + 1} x={px + 472} y={py + 168} anchor="end" size={12} tone="muted">{note}</Label>}
          </g>
        )
      })}
    </Svg>
    <Take i={8} label="Sicher" text="Volumes mit `external: true` löscht auch `down -v` nie: Sie gehören nicht zum Projekt." />
  </div>
)
