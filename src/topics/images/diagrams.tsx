import { at } from '../../components/Stack.tsx'
import { Svg, Box, Arrow, Label, Zone, Wire, Ctr, Tick, Take } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'
import { Icon } from '../../components/Icons.tsx'

// Detailed diagrams for the deeper sub-chapters of this topic. The overview sub-chapter draws with views.tsx.

/* ═══ Images ═══ */
/* docker pull: from the registry into the local store. */
export const Pull = () => (
  <div className="dg-col">
    <Svg w={1000} h={440} label="docker pull: Tag, Manifest, Layer, Prüfung und Ablage auf dem Host">
      <Zone x={0} y={0} w={440} h={440} t="reg" label="Registry · z. B. Docker Hub" />
      <g className="sl" style={at(0)}><Icon name="warehouse" x={362} y={8} s={60} /></g>
      <Box i={1} x={20} y={70} w={150} h={50} label="nginx:1.27" sub="Tag" size={15} mono />
      <Box i={2} x={20} y={160} w={190} h={78} label="Index" sub="eine Variante je Plattform" size={16} />
      <Box i={3} x={20} y={280} w={190} h={78} t="libs" label="Manifest" sub="linux/arm64, sha256:9c1…" size={16} />
      <Arrow i={2} d="M95 122 V156" />
      <Arrow i={3} d="M115 240 V276" label="passt zu mir" lx={127} ly={263} anchor="start" />
      <Box i={4} x={270} y={106} w={150} h={46} t="libs" label="Config" sub="CMD, ENV, Ports" size={14} />
      {['Layer 3', 'Layer 2', 'Layer 1'].map((l, k) => <Box key={l} i={4} x={270} y={176 + k * 62} w={150} h={50} t="app" label={l} sub={['sha256:c92…', 'sha256:7b1…', 'sha256:a3f…'][k]} size={14} />)}
      <Wire i={4} d="M212 319 H242 V129 H268" /><Wire i={4} d="M242 201 H268" /><Wire i={4} d="M242 263 H268" /><Wire i={4} d="M242 319 V325 H268" />

      <Zone i={5} x={560} y={0} w={440} h={440} label="Dein Host" />
      <Box i={5} x={580} y={44} w={400} h={60} t="engine" label="dockerd" sub="vergleicht die Digests mit dem, was schon da ist" size={17} />
      <Zone i={6} x={580} y={124} w={400} h={296} t="app" label="Lokaler Speicher auf der Platte" />
      <Box i={7} x={600} y={176} w={190} h={50} t="ok" label="Layer 3" sub="geladen, geprüft" size={14} />
      <Box i={7} x={600} y={238} w={190} h={50} t="ok" label="Layer 2" sub="geladen, geprüft" size={14} />
      <Box i={6} x={600} y={300} w={190} h={50} t="host" label="Layer 1" sub="war schon da" size={14} />
      <Label i={7} x={806} y={206} anchor="start" size={13} mono>Pull complete</Label>
      <Label i={7} x={806} y={268} anchor="start" size={13} mono>Pull complete</Label>
      <Label i={6} x={806} y={330} anchor="start" size={13} mono>Already exists</Label>
      <Label i={8} x={780} y={396} size={13} tone="muted">entpackt: bereit für OverlayFS</Label>

      <Arrow i={2} kind="back" d="M578 66 H500 V95 H174" n={1} nx={500} ny={80} label="Tag auflösen" lx={500} ly={58} />
      <Arrow i={7} d="M422 201 H596" n={2} nx={500} ny={201} label="fehlt: laden" lx={500} ly={183} />
      <Arrow i={7} d="M422 263 H596" />
      <Wire i={6} k="ok" d="M422 325 H470" /><Label i={6} x={510} y={330} size={13} weight={700} tone="ok">gespart</Label>
    </Svg>
    <Take i={9} label="Digest" text="Jedes Teil heißt nach der Prüfsumme seines Inhalts. Deshalb erkennt Docker gleiche Layer und jede Veränderung beim Download." />
  </div>
)

/* OverlayFS: which layer provides which file. */
const oCols = ['bin/sh', 'etc/nginx.conf', 'html/index.html', 'tmp/cache']

const oX = (k: number) => 250 + k * 188

const oRows: { y: number; title: string; sub: string; t: 'engine' | 'libs'; cells: (string | null)[]; win: number[] }[] = [
  { y: 130, title: 'Schreibschicht', sub: 'lesen und schreiben', t: 'engine', cells: [null, 'nginx.conf v2', null, 'cache'], win: [1, 3] },
  { y: 222, title: 'Layer 3', sub: 'COPY index.html', t: 'libs', cells: [null, null, 'deine Seite', null], win: [2] },
  { y: 286, title: 'Layer 2', sub: 'RUN apt install nginx', t: 'libs', cells: [null, 'nginx.conf v1', 'Standardseite', null], win: [] },
  { y: 350, title: 'Layer 1', sub: 'FROM debian', t: 'libs', cells: ['sh', null, null, null], win: [0] },
]

export const Overlay = () => (
  <div className="dg-col">
    <Svg w={1000} h={410} label="OverlayFS: Der Container sieht je Datei die oberste Schicht, die sie enthält">
      {oCols.map((c, k) => <Label key={c} x={oX(k) + 85} y={16} size={13} weight={700} mono>{c}</Label>)}
      <Box i={7} x={0} y={30} w={225} h={56} t="container" label="Sicht im Container" sub="alles als ein Dateisystem" size={15} />
      {['sh', 'nginx.conf v2', 'deine Seite', 'cache'].map((c, k) => <Box key={c} i={7} x={oX(k)} y={30} w={170} h={56} t="container" label={c} size={15} />)}
      {oRows.map((r, n) => {
        const i = 3 - n + 1
        return (
          <g key={r.title}>
            <Box i={i} x={0} y={r.y} w={225} h={54} t={r.t} label={r.title} sub={r.sub} size={15} />
            {r.cells.map((c, k) => c && <Box key={k} i={i} x={oX(k)} y={r.y} w={170} h={54} t={r.win.includes(k) ? (n ? 'libs' : 'engine') : 'gone'} label={c} size={14} />)}
            {r.win.map(k => <Arrow key={k} i={6} kind="ok" d={`M${oX(k) + 85} ${r.y - 2} V90`} />)}
          </g>
        )
      })}
      <g className="sa" data-k="mute" style={at(5)}><path d="M0 203 H1000" strokeDasharray="5 5" /></g>
      <Label i={5} x={0} y={198} anchor="start" size={12} weight={700} tone="muted">▲ gehört nur diesem Container</Label>
      <Label i={5} x={0} y={217} anchor="start" size={12} weight={700} tone="muted">▼ gehört zum Image, nur lesbar</Label>
    </Svg>
    <Take i={8} label="Regel" text="Für jede Datei gewinnt die oberste Schicht. Gestrichelte Versionen sind noch da, aber verdeckt." />
  </div>
)

/* Copy-on-write: the three things a container can do to a file. */
const cowRows = [['Sicht im Container', 54], ['Schreibschicht', 160], ['Image-Layer', 266]] as const

const cowX = (k: number) => 170 + k * 280

export const CopyOnWrite = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label="Lesen, Ändern und Löschen einer Datei im Container">
      {cowRows.map(([l, y], k) => <Label key={l} i={k} x={0} y={y + 32} anchor="start" size={15} weight={700}>{l}</Label>)}
      {['Lesen', 'Ändern', 'Löschen'].map((l, k) => <g key={l}><Zone i={k * 3} x={cowX(k) - 14} y={0} w={268} h={346} t="app" /><Label i={k * 3} x={cowX(k) + 120} y={30} size={17} weight={700} tone="blue">{l}</Label></g>)}

      <Box i={1} x={cowX(0)} y={54} w={240} h={52} t="container" label="nginx.conf v1" size={15} />
      <Box i={1} x={cowX(0) + 56} y={160} w={184} h={52} t="gone" label="leer" size={14} />
      <Box i={1} x={cowX(0)} y={266} w={240} h={52} t="libs" label="nginx.conf v1" size={15} />
      <Arrow i={2} kind="ok" d={`M${cowX(0) + 26} 264 V110`} />
      <Label i={2} x={cowX(0) + 40} y={139} anchor="start" size={13} tone="muted">gelesen, nichts kopiert</Label>

      <Box i={4} x={cowX(1)} y={54} w={240} h={52} t="container" label="nginx.conf v2" size={15} />
      <Box i={4} x={cowX(1)} y={160} w={240} h={52} t="engine" label="nginx.conf v2" size={15} />
      <Box i={4} x={cowX(1)} y={266} w={240} h={52} t="gone" label="nginx.conf v1" size={15} />
      <Arrow i={5} d={`M${cowX(1) + 40} 264 V216`} n={1} nx={cowX(1) + 40} ny={240} label="erst hochkopieren" lx={cowX(1) + 60} ly={245} anchor="start" />
      <Arrow i={6} kind="ok" d={`M${cowX(1) + 40} 158 V110`} n={2} nx={cowX(1) + 40} ny={134} label="dann ändern" lx={cowX(1) + 60} ly={139} anchor="start" />

      <Box i={7} x={cowX(2)} y={54} w={240} h={52} t="bad" label="Datei fehlt" size={15} />
      <Box i={7} x={cowX(2)} y={160} w={240} h={52} t="reg" label="Whiteout-Marke" size={15} />
      <Box i={7} x={cowX(2)} y={266} w={240} h={52} t="gone" label="nginx.conf v1" size={15} />
      <Arrow i={8} kind="bad" d={`M${cowX(2) + 40} 158 V110`} label="verdeckt die Datei" lx={cowX(2) + 58} ly={139} anchor="start" />
      <Label i={8} x={cowX(2) + 120} y={245} size={13} tone="muted">liegt weiter im Image</Label>
    </Svg>
    <Take i={9} label="Folge" text="Das Image ändert sich nie. Darum macht Löschen in einem späteren Layer ein Image auch nicht kleiner." />
  </div>
)

/* Shared layers: the width of a bar shows who uses it. */
const barScale = 1.7

const barX = (mb: number) => 240 + mb * barScale

export const SharedLayers = () => (
  <div className="dg-col">
    <Svg w={1000} h={450} label="Drei Container teilen sich Layer auf der Platte, jeder hat nur eine eigene dünne Schreibschicht">
      {([['frontend-1', 20], ['frontend-2', 280], ['job', 540]] as const).map(([n, x]) => <Ctr key={n} i={3} x={x} y={0} w={240} h={84} name={`Container ${n}`} />)}
      {[20, 280, 540].map((x, k) => <Box key={x} i={3} x={x + 12} y={32} w={216} h={42} t="engine" label="Schreibschicht" sub={undefined} size={14} />)}
      <Box i={2} x={20} y={96} w={500} h={50} t="libs" label="nginx-Layer · 65 MB" sub="von frontend-1 und frontend-2 gemeinsam genutzt" size={15} />
      <Box i={2} x={540} y={96} w={240} h={50} t="libs" label="Python-Layer · 20 MB" sub="nur job" size={15} />
      <Box i={1} x={20} y={156} w={760} h={50} t="kchip" label="debian-Layer · 75 MB" sub="alle drei nutzen dieselben Dateien auf der Platte" size={15} />
      <Label i={4} x={800} y={58} anchor="start" size={14} weight={700}>je Container eigen</Label>
      <Label i={4} x={800} y={76} anchor="start" size={13} tone="muted">wenige KB bis MB</Label>
      <Label i={4} x={800} y={150} anchor="start" size={14} weight={700}>nur einmal gespeichert</Label>
      <Label i={4} x={800} y={168} anchor="start" size={13} tone="muted">nur lesbar, also sicher teilbar</Label>

      <Label i={5} x={0} y={262} anchor="start" size={16} weight={700}>Platzbedarf auf der Festplatte</Label>
      <Label i={5} x={0} y={306} anchor="start" size={14} weight={600}>Jeder mit eigener Kopie</Label>
      {([[0, 140, 'frontend-1'], [140, 140, 'frontend-2'], [280, 95, 'job']] as const).map(([a, w, l]) => <Box key={l} i={6} x={barX(a)} y={282} w={w * barScale - 3} h={44} t="bad" label={l} size={14} />)}
      <Label i={6} x={barX(375) + 8} y={310} anchor="start" size={15} weight={700} tone="bad">375 MB</Label>
      <Label i={7} x={0} y={372} anchor="start" size={14} weight={600}>Mit geteilten Layern</Label>
      {([[0, 75, 'debian', 'kchip'], [75, 65, 'nginx', 'libs'], [140, 20, '', 'libs']] as const).map(([a, w, l, t]) => <Box key={a} i={7} x={barX(a)} y={348} w={w * barScale - 3} h={44} t={t} label={l} size={14} />)}
      <Label i={7} x={barX(160) + 8} y={376} anchor="start" size={15} weight={700} tone="ok">160 MB</Label>
      <Label i={7} x={barX(140) + 18} y={410} size={13} tone="muted">Python</Label>
    </Svg>
    <Take i={8} label="Darum" text="startet ein zweiter Container in Millisekunden und kostet kaum Platz: Es kommt nur eine leere Schreibschicht dazu." />
  </div>
)

/* build: from a folder to an image to a container. */
export const BuildFlow = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label="build: Der Ordner geht als Kontext zu BuildKit, Stufen werden gebaut, das Ergebnis wird zum Image">
      <Zone x={0} y={0} w={220} h={300} t="reg" label="Ordner ./frontend" />
      {['src/', 'package.json', 'Dockerfile'].map((f, k) => <Box key={f} x={14} y={40 + k * 52} w={192} h={44} label={f} size={14} mono />)}
      <Box i={1} x={14} y={196} w={192} h={56} t="gone" label="node_modules/" sub="per .dockerignore raus" size={14} mono />
      <Arrow i={2} d="M222 120 H276" label="Kontext" lx={249} ly={108} />
      <Zone i={2} x={280} y={0} w={440} h={400} label="BuildKit · im Docker-Daemon" />
      <Zone i={3} x={296} y={36} w={200} h={200} t="app" label="Stufe build" />
      {['FROM node:22', 'RUN npm ci', 'RUN npm run build'].map((l, k) => <Box key={l} i={3} x={308} y={72 + k * 52} w={176} h={44} t="libs" label={l} size={13} mono />)}
      <Zone i={5} x={510} y={36} w={196} h={200} t="app" label="Stufe runtime" />
      {['FROM nginx', 'COPY --from=build'].map((l, k) => <Box key={l} i={5} x={520} y={72 + k * 52} w={176} h={44} t={k ? 'engine' : 'libs'} label={l} size={13} mono />)}
      <Arrow i={4} d="M486 198 C 500 198, 500 150, 516 146" />
      <Box i={2} x={296} y={254} w={200} h={60} t="reg" label="args: NODE_ENV" sub="nur beim Bauen" size={14} mono />
      <Arrow i={3} d="M396 252 V240" />
      <Box i={6} x={510} y={254} w={196} h={60} t="gone" label="Stufe debug" sub="wird nicht gebaut" size={14} />
      <Label i={6} x={500} y={352} size={14} weight={700} tone="blue">target: runtime · hier ist Schluss</Label>
      <Arrow i={7} d="M708 120 H756" />
      <Box i={7} x={760} y={84} w={240} h={76} t="libs" label="mensa-frontend:1.4" sub="fertiges Image" size={15} mono />
      <Arrow i={8} d="M880 162 V216" label="startet" lx={892} ly={194} anchor="start" />
      <Box i={8} x={760} y={220} w={240} h={70} t="container" label={e('Container frontend', 'Container frontend')} sub="ohne node, ohne Quellcode" size={15} />
    </Svg>
  </div>
)

/* ═══ Dateien und Netz ═══ */
/* Every object you know, and the folder it really is. */
const dRows: { y: number; p: string; s: string; keep: boolean }[] = [
  { y: 60, p: 'overlay2/a3f…/diff', s: 'Dateien eines Image-Layers', keep: true },
  { y: 164, p: 'overlay2/7c1…/diff', s: 'Schreibschicht von frontend', keep: false },
  { y: 216, p: 'containers/e5f…/config.v2.json', s: 'Konfiguration des Containers', keep: false },
  { y: 268, p: 'containers/e5f…/e5f…-json.log', s: 'alles, was docker logs zeigt', keep: false },
  { y: 372, p: 'volumes/daten/_data', s: 'der Inhalt des Volumes', keep: true },
]

export const DiskMap = () => (
  <div className="dg-col">
    <Svg w={1000} h={450} label="Image, Container und Volume und die Ordner, in denen sie auf der Platte liegen">
      <g className="sl" style={at(1)}><Icon name="blueprint" x={14} y={44} s={64} /></g>
      <Label i={1} x={90} y={72} anchor="start" size={17} weight={700}>Image</Label><Label i={1} x={90} y={92} anchor="start" size={13} tone="muted">nginx:1.27</Label>
      <g className="sl" style={at(2)}><Icon name="crate" x={14} y={188} s={64} /></g>
      <Label i={2} x={90} y={216} anchor="start" size={17} weight={700}>Container</Label><Label i={2} x={90} y={236} anchor="start" size={13} tone="muted">frontend</Label>
      <g className="sl" style={at(3)}><Icon name="folder" x={14} y={358} s={64} /></g>
      <Label i={3} x={90} y={386} anchor="start" size={17} weight={700}>Volume</Label><Label i={3} x={90} y={406} anchor="start" size={13} tone="muted">daten</Label>

      <Zone x={250} y={0} w={750} h={450} t="reg" label="Festplatte · /var/lib/docker/" sub="nach docker rm frontend" />
      {dRows.map((r, k) => {
        const i = k === 0 ? 1 : k === 4 ? 3 : 2
        return (
          <g key={r.p}>
            <Box i={i} x={270} y={r.y} w={520} h={48} label={r.p} sub={r.s} size={14} mono />
            <Tick i={i + 3} x={830} y={r.y + 23} ok={r.keep} bad={!r.keep} />
            <Label i={i + 3} x={850} y={r.y + 28} anchor="start" size={14} weight={700} tone={r.keep ? 'ok' : 'bad'}>{r.keep ? 'bleibt' : 'gelöscht'}</Label>
          </g>
        )
      })}
      <Arrow i={1} d="M170 74 C 210 74, 230 83, 266 83" />
      <Arrow i={2} d="M170 214 C 215 214, 225 187, 266 187" />
      <Arrow i={2} d="M170 220 C 215 220, 225 239, 266 239" />
      <Arrow i={2} d="M170 226 C 205 240, 225 291, 266 291" />
      <Arrow i={3} d="M170 392 C 210 392, 230 395, 266 395" />
    </Svg>
    <Take i={7} label="Hinweis" text="Neuere Installationen mit containerd-Image-Store legen Image-Layer unter `/var/lib/containerd` ab. Das Prinzip bleibt gleich." />
  </div>
)
