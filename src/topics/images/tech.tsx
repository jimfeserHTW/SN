import { Svg, Box, Arrow, Label, Take } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'

// Technical additions to Images ② and ③: the Dockerfile line by line, the build cache, multi-stage builds.

/* ── the Dockerfile line by line ── */
export const DockerfileLines = () => (
  <div className="dg-split">
    <Code title="Dockerfile" kind="file" lines={[
      { t: 'FROM eclipse-temurin:21-jre', chip: e('Basis-Image', 'base image'), n: 1 },
      { t: 'WORKDIR /app', chip: e('Arbeitsordner', 'working folder'), n: 2 },
      { t: 'COPY target/app.jar app.jar', chip: e('Datei hinein', 'file inside'), n: 3 },
      { t: 'RUN useradd -r mensa', chip: e('Befehl beim Bauen', 'command at build'), n: 4 },
      { t: 'USER mensa', chip: e('nicht als root', 'not as root'), n: 5 },
      { t: 'EXPOSE 8080', chip: e('nur ein Hinweis', 'just a hint'), n: 6 },
      { t: 'CMD ["java", "-jar", "app.jar"]', chip: e('Startbefehl', 'start command'), n: 7 },
    ]} />
    <Svg w={460} h={420} label={e('Welche Zeilen eine Schicht anlegen und welche nur Notizen sind', 'Which lines create a layer and which are only notes')}>
      {[[1, e('Schicht: Linux + JDK', 'layer: Linux + JDK'), 'kernel'], [3, e('Schicht: app.jar', 'layer: app.jar'), 'container'], [4, e('Schicht: neuer Benutzer', 'layer: new user'), 'libs']].map(([n, l, t], k) => (
        <Box key={n as number} i={k} x={20} y={330 - k * 76} w={300} h={62} t={t as 'kernel'} label={l as string} sub={e(`Zeile ${n}`, `line ${n}`)} size={15} />
      ))}
      <Box i={3} x={20} y={20} w={300} h={78} t="gone" label={e('Notizen im Image', 'notes in the image')} sub={e('Zeilen 2, 5, 6, 7: keine Dateien', 'lines 2, 5, 6, 7: no files')} size={15} />
      <Label i={4} x={340} y={270} anchor="start" size={13} weight={700}>{e('Dateien', 'files')}</Label>
      <Label i={4} x={340} y={64} anchor="start" size={13} weight={700}>{e('Einstellungen', 'Settings')}</Label>
      <Arrow i={4} d="M380 250 V120" kind="mute" />
    </Svg>
  </div>
)

/* ── the build cache: why the order of the lines matters ── */
const layer = (x: number, y: number, label: string, cached: boolean, i: number) => <Box i={i} x={x} y={y} w={420} h={50} t={cached ? 'ok' : 'bad'} label={label} sub={cached ? e('aus dem Cache', 'from the cache') : e('neu gebaut', 'rebuilt')} size={14} mono />
export const BuildCache = () => (
  <div className="dg-col">
    <Svg w={1000} h={340} label={e('Links ändert jede Code-Änderung den Download der Abhängigkeiten, rechts bleibt er im Cache', 'Left every code change redoes the dependency download, right it stays in the cache')}>
      <Label x={20} y={22} anchor="start" size={15} weight={700} tone="bad">{e('ungünstig: erst alles kopieren', 'unfavourable: copy everything first')}</Label>
      <Label x={540} y={22} anchor="start" size={15} weight={700} tone="ok">{e('günstig: erst die pom.xml', 'favourable: pom.xml first')}</Label>
      {layer(20, 40, 'FROM maven:3.9-eclipse-temurin-21', true, 0)}
      {layer(20, 100, 'COPY . .', false, 1)}
      {layer(20, 160, 'RUN mvn dependency:go-offline', false, 2)}
      {layer(20, 220, 'RUN mvn package', false, 3)}
      {layer(540, 40, 'FROM maven:3.9-eclipse-temurin-21', true, 0)}
      {layer(540, 100, 'COPY pom.xml .', true, 1)}
      {layer(540, 160, 'RUN mvn dependency:go-offline', true, 2)}
      {layer(540, 220, 'COPY src ./src  ·  RUN mvn package', false, 3)}
      <Label i={4} x={230} y={310} size={14} weight={700} tone="bad">{e('jede Code-Änderung: alles neu laden', 'every code change: download everything again')}</Label>
      <Label i={4} x={750} y={310} size={14} weight={700} tone="ok">{e('nur der Code wird neu gebaut', 'only the code is rebuilt')}</Label>
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Ändert sich eine Zeile, baut Docker sie und alle darunter neu. Was sich selten ändert, gehört deshalb nach oben.', 'When a line changes, Docker rebuilds it and every line below. What rarely changes therefore belongs at the top.')} />
  </div>
)

/* ── multi-stage: build with Maven, ship with a JRE ── */
export const MultiStage = () => (
  <div className="dg-col">
    <Code title="Dockerfile" kind="file" lines={[
      { t: 'FROM maven:3.9-eclipse-temurin-21 AS build', mark: 'a' },
      { t: 'WORKDIR /src', mark: 'a' },
      { t: 'COPY . .', mark: 'a' },
      { t: 'RUN mvn -q package', mark: 'a' },
      '',
      { t: 'FROM eclipse-temurin:21-jre', mark: 'b' },
      { t: 'COPY --from=build /src/target/app.jar /app.jar', mark: 'b', chip: e('nur das Ergebnis', 'only the result') },
      { t: 'CMD ["java", "-jar", "/app.jar"]', mark: 'b' },
    ]} />
    <Svg w={1000} h={250} label={e('Die Bau-Stufe ist groß und wird verworfen, ins fertige Image kommt nur die app.jar', 'The build stage is big and thrown away, only app.jar goes into the final image')}>
      <Box i={0} x={60} y={10} w={360} h={150} t="gone" label={e('Stufe build', 'stage build')} sub={e('Maven, JDK, Quellcode', 'Maven, JDK, source')} size={16} />
      <Box i={2} x={580} y={60} w={360} h={100} t="container" label={e('fertiges Image', 'final image')} sub={e('JRE + app.jar', 'JRE + app.jar')} size={16} />
      <Arrow i={1} d="M424 110 H576" label="app.jar" lx={500} ly={98} />
      <Label i={3} x={240} y={192} size={15} weight={700} tone="muted">{e('groß, wird verworfen', 'big, thrown away')}</Label>
      <Label i={3} x={760} y={192} size={15} weight={700} tone="ok">{e('klein, wird ausgeliefert', 'small, shipped')}</Label>
      <Label i={4} x={500} y={236} size={13}>{e('Für Vue genauso: mit Node bauen, mit nginx ausliefern', 'Same for Vue: build with Node, ship with nginx')}</Label>
    </Svg>
  </div>
)

/* ── tags and digests: a name that can move, a fingerprint that cannot ── */
export const TagsDigests = () => (
  <div className="dg-col">
    <Svg w={1000} h={300} label={e('Zwei Tags zeigen auf denselben Digest, später wandert latest weiter', 'Two tags point at the same digest, later latest moves on')}>
      <Box i={0} x={20} y={30} w={260} h={56} t="libs" label="mensa-api:1.1" sub={e('Tag: fest vergeben', 'tag: set once')} mono size={15} />
      <Box i={0} x={20} y={110} w={260} h={56} t="libs" label="mensa-api:latest" sub={e('Tag: kann wandern', 'tag: can move')} mono size={15} />
      <Box i={1} x={420} y={70} w={540} h={56} t="engine" label="sha256:9f2c…e41a" sub={e('Digest: Fingerabdruck des Inhalts', 'digest: fingerprint of the content')} mono size={15} />
      <Arrow i={1} d="M284 58 L416 92" /><Arrow i={1} d="M284 138 L416 104" />
      <Box i={2} x={420} y={200} w={540} h={56} t="gone" label="sha256:4b7d…0c19" sub={e('nächste Version: latest zeigt jetzt hierhin', 'next version: latest now points here')} mono size={15} />
      <Arrow i={2} d="M200 170 C200 228 300 228 416 228" kind="back" />
      <Label i={3} x={20} y={290} anchor="start" size={13}>{e('Wer ganz sicher sein will, zieht per Digest: mensa-api@sha256:9f2c…', 'To be completely sure, pull by digest: mensa-api@sha256:9f2c…')}</Label>
    </Svg>
    <Take i={4} label={e('Merke', 'Remember')} text={e('Ein Tag ist ein Name, der umgehängt werden kann. Der Digest ist der Inhalt selbst und ändert sich nie.', 'A tag is a name that can be moved. The digest is the content itself and never changes.')} />
  </div>
)

/* ── base image and .dockerignore: what belongs in the image ── */
export const LeanBase = () => (
  <div className="dg-split">
    <Code title=".dockerignore" kind="file" lines={[
      '.git', 'node_modules', 'target/classes', '*.log', '.env',
      { t: e('# nicht im Build-Kontext, nie im Image', '# not in the build context, never in the image'), k: 'note' },
    ]} />
    <Svg w={500} h={330} label={e('Drei Basis-Images für dieselbe App, von groß bis schlank', 'Three base images for the same app, from big to lean')}>
      {[['eclipse-temurin:21-jdk', e('mit Compiler: nur zum Bauen', 'with compiler: only for building'), 1], ['eclipse-temurin:21-jre', e('nur Laufzeit: guter Standard', 'runtime only: a good default'), .55], ['eclipse-temurin:21-jre-alpine', e('noch kleiner, andere C-Bibliothek', 'smaller still, different C library'), .4]].map(([n, s, w], k) => (
        <g key={n as string}>
          <Box i={k} x={0} y={10 + k * 106} w={500} h={56} t={k === 1 ? 'ok' : 'app'} label={n as string} sub={s as string} mono size={14} />
          <rect x={0} y={74 + k * 106} width={500 * (w as number)} height={12} rx={6} fill="var(--blue)" opacity={.55} />
        </g>
      ))}
    </Svg>
  </div>
)

/* ── an image as files: manifest, config, layers (OCI) ── */
export const ImageFiles = () => (
  <div className="dg-col">
    <Svg w={1000} h={300} label={e('Ein Image besteht aus einem Manifest, einer Konfiguration und Schicht-Archiven, alle über ihren Digest benannt', 'An image consists of a manifest, a config and layer archives, all named by their digest')}>
      <Box i={0} x={20} y={110} w={220} h={70} t="libs" label="mensa-api:1.1" sub={e('Tag zeigt auf …', 'tag points at …')} mono size={15} />
      <Box i={1} x={300} y={110} w={200} h={70} t="engine" label="Manifest" sub={e('Liste der Teile', 'list of parts')} />
      <Box i={2} x={580} y={20} w={400} h={64} t="app" label="Config" sub={e('CMD, ENV, USER, Ports, Verlauf', 'CMD, ENV, USER, ports, history')} />
      {[0, 1, 2].map(k => <Box key={k} i={3} x={580 + k * 136} y={130} w={128} h={56} t="kchip" label={e(`Schicht ${k + 1}`, `layer ${k + 1}`)} sub="tar.gz" size={14} />)}
      <Arrow i={1} d="M244 145 H296" /><Arrow i={2} d="M504 130 L576 60" /><Arrow i={3} d="M504 158 H576" />
      <Label i={4} x={500} y={250} size={14}>{e('Jedes Teil heißt nach seinem Fingerabdruck (sha256). Gleiche Teile liegen nur einmal da.', 'Every part is named by its fingerprint (sha256). Identical parts are stored only once.')}</Label>
      <Label i={4} x={500} y={280} size={13} tone="muted">{e('Dieses Format ist ein offener Standard (OCI): Podman, containerd und Kubernetes lesen es genauso.', 'This format is an open standard (OCI): Podman, containerd and Kubernetes read it the same way.')}</Label>
    </Svg>
  </div>
)

/* ── cleaning up: what takes space and how to get it back ── */
export const Prune = () => (
  <div className="dg-col">
    <Code title="Terminal" lines={[
      { t: 'docker system df', k: 'cmd', chip: e('was belegt Platz?', 'what takes space?') },
      'TYPE           TOTAL   ACTIVE   SIZE      RECLAIMABLE',
      'Images         14      3        4.1GB     3.2GB (78%)',
      'Containers     5       3        12MB      4MB (33%)',
      'Local Volumes  4       1        980MB     610MB (62%)',
      'Build Cache    61      0        2.3GB     2.3GB',
      { t: 'docker image prune', k: 'cmd', chip: e('Images ohne Tag', 'images without a tag') },
      { t: 'docker builder prune', k: 'cmd', chip: e('Build-Cache', 'build cache') },
      { t: 'docker system prune', k: 'cmd', chip: e('alles Ungenutzte, ohne Volumes', 'everything unused, no volumes') },
    ]} />
    <Take i={1} label={e('Achtung', 'Careful')} text={e('Volumes räumt erst docker volume prune oder system prune --volumes weg. Dann sind die Daten darin endgültig verloren.', 'Volumes are only removed by docker volume prune or system prune --volumes. Then the data inside is gone for good.')} />
  </div>
)
