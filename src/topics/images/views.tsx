import type { ReactNode } from 'react'
import { Svg, Take, Zone } from '../../components/Svg.tsx'
import { Icon } from '../../components/Icons.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Lead, Plan, In, Txt, Go } from '../../components/harbor/harbor.tsx'

// Overview slides of the first sub-chapter: image, layers, Dockerfile, tags and registry. Technical terms only.
const arrow = (d: string, i: number, kind: 'go' | 'back' = 'go') => <Go d={d} i={i} kind={kind} />

/* ── what Docker is used for ── */
const uses: { svc: 'api' | 'db' | 'other' | 'frontend'; label: string; title: string; sub: string }[] = [
  { svc: 'api', label: 'api', title: e('eigene Apps ausliefern', 'ship your own apps'), sub: e('wie eure Mensa-API', 'like your Mensa API') },
  { svc: 'db', label: 'postgres', title: e('Dienste ausprobieren', 'try out services'), sub: e('Datenbank ohne Installation', 'a database without installing') },
  { svc: 'other', label: 'maven', title: e('Werkzeuge festnageln', 'pin your tools'), sub: e('immer dieselbe Version', 'always the same version') },
  { svc: 'frontend', label: 'tests', title: e('in CI testen', 'test in CI'), sub: e('jeder Lauf startet frisch', 'every run starts fresh') },
]
export const Uses = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Vier Container auf einem Rechner, jeder steht für einen Einsatzzweck', 'Four containers on one machine, each standing for one use')}>
      <Zone x={20} y={150} w={960} h={160} label={e('Dein Rechner', 'Your machine')} sub="Docker" />
      {uses.map((u, k) => (
        <g key={u.label}>
          <Box x={170 + k * 196} y={226} w={150} h={58} svc={u.svc} label={u.label} i={k + 1} />
          <Tag x={154 + k * 196} y={44} w={182} label={u.title} sub={u.sub} i={k + 1} />
          <Lead d={`M${245 + k * 196} 90 V222`} end={[245 + k * 196, 224]} i={k + 1} />
        </g>
      ))}
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Docker verpackt nicht nur eure App. Jede Software, die ihr braucht, kommt als fertiger Container auf den Rechner.', 'Docker does not only pack your app. Any software you need comes onto the machine as a ready-made container.')} />
  </div>
)

/* ── from Dockerfile to image ── */
const steps = [e('1  Nimm ein Linux mit JDK 21', '1  Take a Linux with JDK 21'), e('2  Lege app.jar hinein', '2  Put app.jar inside'), e('3  Merke dir Port 8080', '3  Note port 8080'), e('4  Start: java -jar app.jar', '4  Start: java -jar app.jar')]
export const PackingList = () => (
  <div className="dg-col">
    <Svg w={1000} h={330} label={e('Ein Dockerfile wird Zeile für Zeile zu einem Image gebaut', 'A Dockerfile is built into an image line by line')}>
      <In i={0}>
        <rect x={20} y={20} width={380} height={250} rx={14} fill="#fff" stroke="var(--keel)" strokeWidth={2} />
        <rect x={170} y={10} width={80} height={20} rx={5} fill="var(--keel)" />
        <text x={44} y={66} fontSize={18} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>Dockerfile</text>
      </In>
      {steps.map((s, k) => <In key={s} i={1 + k}><rect x={40} y={86 + k * 44} width={340} height={36} rx={8} fill="var(--paper)" /><Txt x={56} y={109 + k * 44} size={15} fill="var(--ink)">{s}</Txt></In>)}
      {arrow('M410 145 H556', 5)}
      <In i={5}><Txt x={483} y={130} size={15} w={700} fill="var(--ink)" anchor="middle">{e('bauen', 'build')}</Txt><Txt x={483} y={170} size={13} anchor="middle">docker build</Txt></In>
      <Plan x={590} y={70} w={150} h={100} i={6} />
      <Tag x={760} y={74} w={220} label="Image" sub="mensa-api:1.0" tone="blue" i={6} />
      <Tag x={590} y={200} w={390} label={e('Jede Zeile wird zu einer Schicht im Image', 'Every line becomes a layer in the image')} sub={e('Mehr dazu im Thema Images', 'More on this in the topic Images')} i={7} />
    </Svg>
    <Take i={8} label={e('Merke', 'Remember')} text={e('Das Dockerfile schreibt ihr einmal. Daraus baut Docker ein Image, aus dem beliebig viele gleiche Container entstehen.', 'You write the Dockerfile once. Docker builds an image from it, and any number of identical containers come from that.')} />
  </div>
)

/* ── registry and local images ── */
export const Warehouses = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Images kommen aus der Registry in die lokalen Images auf dem Rechner und zurück', 'Images come from the registry into the local images on the machine and back')}>
      <Zone x={20} y={80} w={300} h={240} t="reg" label="Registry" sub="Docker Hub" i={1} />
      <In i={1}><Icon name="server" x={50} y={130} s={70} /></In>
      <Plan x={150} y={140} w={58} h={52} i={1} /><Plan x={220} y={140} w={58} h={52} i={1} />
      <Zone x={420} y={80} w={560} h={240} label={e('Dein Rechner', 'Your machine')} sub="Docker" i={2} />
      <In i={3}><rect x={460} y={180} width={150} height={74} rx={6} fill="#fff" stroke="var(--keel)" strokeWidth={2} /></In>
      <Plan x={472} y={190} w={58} h={52} i={3} /><Plan x={542} y={190} w={58} h={52} i={3} />
      <Box x={700} y={189} w={120} h={56} svc="api" i={5} />
      <Go d="M300 150 C380 130 420 150 470 176" i={4} />
      <In i={4}><Txt x={370} y={122} size={14} w={700} fill="var(--ink)" anchor="middle">pull</Txt></In>
      <Go d="M456 236 H300" i={6} kind="back" />
      <In i={6}><Txt x={370} y={260} size={14} w={700} fill="var(--blue)" anchor="middle">push</Txt></In>
      <Go d="M614 217 H696" i={5} />
      <Tag x={440} y={0} w={240} label={e('lokale Images', 'local images')} sub={e('auf deinem Rechner', 'on your machine')} tone="sky" i={3} />
      <Lead d="M560 46 V176" end={[560, 178]} i={3} />
      <Tag x={700} y={0} w={280} label={e('Container startet', 'container starts')} sub={e('immer aus einem lokalen Image', 'always from a local image')} tone="ok" i={5} />
      <Lead d="M760 46 V185" end={[760, 187]} i={5} />
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Fehlt ein Image auf dem Rechner, holt Docker es aus der Registry. Eigene Images teilt ihr so mit dem Team und dem Server.', 'If an image is missing on the machine, Docker fetches it from the registry. That is also how you share your own images with the team and the server.')} />
  </div>
)

/* ── an image never changes: containers write into their own layer ── */
const Note = ({ x, y, i, text }: { x: number; y: number; i: number; text: string }) => (
  <In i={i}><rect x={x - 10} y={y} width={110} height={40} rx={6} fill="color-mix(in srgb, var(--svc-api) 12%, #fff)" stroke="var(--svc-api)" strokeWidth={1.5} strokeDasharray="5 4" /><Txt x={x + 45} y={y + 25} size={12.5} w={700} fill="var(--svc-api-d)" anchor="middle">{text}</Txt></In>
)
export const Sealed = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label={e('Ein nur lesbares Image, drei Container mit je einer eigenen Schreibschicht', 'A read-only image, three containers each with a writable layer of its own')}>
      <Plan x={420} y={20} w={160} h={100} i={0} />
      <In i={0}><circle cx={572} cy={110} r={18} fill="var(--bad)" stroke="#fff" strokeWidth={3} /><Txt x={572} y={115} size={13} w={700} fill="#fff" anchor="middle">✓</Txt></In>
      {[0, 1, 2].map(k => (
        <g key={k}>
          <Go d={`M${500 + (k - 1) * 40} 126 L${235 + k * 265} 214`} i={1} />
          <Box x={170 + k * 265} y={220} w={130} h={60} svc="api" i={1} />
          <Note x={190 + k * 265} y={290} i={2 + k} text={(['Log: 3 MB', 'tmp/cache', e('nichts', 'nothing')] as string[])[k]} />
        </g>
      ))}
      <Tag x={620} y={30} w={330} label={e('Image: nur lesbar', 'Image: read-only')} sub={e('alle Container lesen dasselbe Image', 'all containers read the same image')} tone="blue" i={0} />
      <Tag x={30} y={30} w={330} label={e('Jeder schreibt in eine eigene Schicht', 'Each writes into a layer of its own')} sub={e('die Schreibschicht wird mit dem Container gelöscht', 'the writable layer is deleted with the container')} tone="sand" i={2} />
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Ein Image ändert sich nie. Was ein Container schreibt, landet in seiner eigenen Schreibschicht und ist mit docker rm weg.', 'An image never changes. Whatever a container writes ends up in its own writable layer and is gone with docker rm.')} />
  </div>
)

/* ── layer by layer: one line of the Dockerfile, one layer ── */
const layers: [string, string, string][] = [
  ['FROM eclipse-temurin:21-jre', e('Schicht 1 · Linux-Basis mit JDK 21', 'layer 1 · Linux base with JDK 21'), 'var(--c-kernel)'],
  ['COPY target/app.jar /app.jar', e('Schicht 2 · eure app.jar', 'layer 2 · your app.jar'), 'var(--svc-api)'],
  ['CMD ["java", "-jar", "/app.jar"]', e('Metadaten: so wird gestartet', 'metadata: how to start'), 'var(--ink-3)'],
]
export const Layers = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Jede Zeile des Dockerfiles wird zu einer Schicht im Image', 'Every line of the Dockerfile becomes a layer in the image')}>
      <Tag x={20} y={0} w={420} label="Dockerfile" sub={e('die Bauanleitung', 'the build instructions')} tone="sky" />
      <Tag x={540} y={0} w={440} label={e('Image aus Schichten', 'Image made of layers')} sub="mensa-api:1.0" tone="sky" i={3} />
      {layers.map(([code, label, color], k) => {
        const y = 240 - k * 84
        return (
          <g key={code}>
            <In i={1 + k}><rect x={20} y={y} width={420} height={56} rx={10} fill="#fff" stroke="var(--line)" strokeWidth={1.5} /><text x={40} y={y + 34} fontSize={14} style={{ fontFamily: "var(--mono)" }} fill="var(--ink)">{code}</text></In>
            <Go d={`M444 ${y + 28} H536`} i={1 + k} />
            <In i={1 + k}><path d={`M560 ${y + 8} H960 L980 ${y + 28} L960 ${y + 48} H560 L540 ${y + 28} Z`} fill={k === 2 ? '#fff' : `color-mix(in srgb, ${color} 18%, #fff)`} stroke={color} strokeWidth={2} strokeDasharray={k === 2 ? '6 5' : undefined} /><Txt x={760} y={y + 33} size={15} w={700} fill="var(--ink)" anchor="middle">{label}</Txt></In>
          </g>
        )
      })}
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Ein Image ist ein Stapel aus Schichten, unten die Basis, oben eure App. Jede Schicht kommt aus einer Zeile des Dockerfiles.', 'An image is a stack of layers, the base at the bottom, your app on top. Each layer comes from one line of the Dockerfile.')} />
  </div>
)

/* ── tags: name and version ── */
export const Labels = () => (
  <div className="dg-col">
    <Svg w={1000} h={360} label={e('Drei Images mit Tags, der Tag latest zeigt auf Version 1.1', 'Three images with tags, the tag latest points to version 1.1')}>
      {(['1.0', '1.1', '1.2-beta'] as const).map((v, k) => (
        <g key={v}>
          <Plan x={120 + k * 280} y={150} w={140} h={90} i={k} />
          <In i={k}><rect x={88 + k * 280} y={252} width={204} height={34} rx={8} fill="#fff" stroke="var(--keel)" strokeWidth={2} /><text x={190 + k * 280} y={275} textAnchor="middle" fontSize={15} style={{ fontFamily: "var(--mono)" }} fontWeight={700} fill="var(--ink)">{`mensa-api:${v}`}</text></In>
        </g>
      ))}
      <In i={3}><rect x={400} y={90} width={140} height={36} rx={8} fill="#ffe28a" stroke="#8a6a20" strokeWidth={2} /><text x={470} y={114} textAnchor="middle" fontSize={15} style={{ fontFamily: "var(--mono)" }} fontWeight={700} fill="#6b4a00">latest</text></In>
      <Go d="M470 134 V146" i={3} />
      <Tag x={40} y={20} w={420} label={e('Name : Version', 'name : version')} sub={e('der Tag, an dem ihr das Image erkennt', 'the tag you recognise the image by')} i={0} />
      <Tag x={560} y={20} w={400} label={e('latest heißt nicht „neuestes“', 'latest does not mean “newest”')} sub={e('nur der Standard-Tag, wer ihn setzt, entscheidet', 'just the default tag, whoever sets it decides')} tone="sand" i={3} />
      <Tag x={180} y={306} w={640} label={e('Für Abgabe und Server: immer eine feste Version, z. B. mensa-api:1.1', 'For hand-in and server: always a fixed version, e.g. mensa-api:1.1')} tone="ok" i={4} />
    </Svg>
  </div>
)

/* ── the same layers only once: an update ships only what changed ── */
export const Shared = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Zwei Versionen teilen sich die Basis-Schicht, nur die App-Schicht ist neu', 'Two versions share the base layer, only the app layer is new')}>
      <In i={0}><rect x={140} y={230} width={720} height={56} rx={10} fill="color-mix(in srgb, var(--c-kernel) 18%, #fff)" stroke="var(--c-kernel)" strokeWidth={2} /><Txt x={500} y={264} size={15} w={700} fill="var(--ink)" anchor="middle">{e('Schichten der Basis · Linux mit JDK 21 · rund 95 MB · nur einmal auf dem Rechner', 'base layers · Linux with JDK 21 · about 95 MB · only once on the machine')}</Txt></In>
      <In i={1}><rect x={140} y={150} width={340} height={56} rx={10} fill="color-mix(in srgb, var(--svc-api) 18%, #fff)" stroke="var(--svc-api)" strokeWidth={2} /><Txt x={310} y={184} size={15} w={700} fill="var(--ink)" anchor="middle">{e('app.jar 1.0 · 40 MB', 'app.jar 1.0 · 40 MB')}</Txt></In>
      <In i={2}><rect x={520} y={150} width={340} height={56} rx={10} fill="color-mix(in srgb, var(--svc-api) 18%, #fff)" stroke="var(--svc-api)" strokeWidth={2} strokeDasharray="7 5" /><Txt x={690} y={184} size={15} w={700} fill="var(--ink)" anchor="middle">{e('app.jar 1.1 · 40 MB · neu', 'app.jar 1.1 · 40 MB · new')}</Txt></In>
      <Tag x={140} y={60} w={340} label="mensa-api:1.0" sub={e('schon auf dem Rechner', 'already on the machine')} i={1} />
      <Tag x={520} y={60} w={340} label="mensa-api:1.1" sub={e('nur die neue Schicht wird geholt', 'only the new layer is fetched')} tone="ok" i={2} />
      <Lead d="M310 106 V146" end={[310, 148]} i={1} /><Lead d="M690 106 V146" end={[690, 148]} i={2} />
      <Tag x={250} y={302} w={500} label={e('Update: 40 MB statt 135 MB', 'Update: 40 MB instead of 135 MB')} sub={e('Größen beim Herunterladen, gerundet', 'download sizes, rounded')} tone="blue" i={3} />
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Schichten, die schon auf dem Rechner liegen, holt Docker nicht noch einmal. Darum sind Updates klein und viele Container brauchen wenig Platz.', 'Docker does not fetch layers that are already on the machine. That is why updates are small and many containers need little space.')} />
  </div>
)
