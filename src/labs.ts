// The lab course. Help shrinks with each level: one gap per command, then command skeletons, then goals with hints, then whole stacks.
// Task wording follows the same curve: Beginner and Intermediate mark command parts in `backticks`, Advanced leaves them unmarked, Expert only paraphrases them.
// Practice only: theory stays in src/topics/. Steps are checked against the simulated Docker daemon, never against the exact command typed.
import type { Container, Daemon } from './components/docker/engine/daemon.ts'
import type { Terminal } from './components/docker/engine/cli.ts'
import type { Goal } from './components/types.ts'

export const BLANK = '___'
export type LabCheck = { d: Daemon; file(name: string): string; ran(re: RegExp): boolean; saw(re: RegExp): boolean }
/** `cmd` is put into the terminal with gaps to fill in. */
export type LabStep = Goal<LabCheck> & { cmd?: string; hint?: string }
export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type Lab = { id: string; level: Level; title: string; blurb: string; containers: number; files?: Record<string, string>; steps: LabStep[] }
/** Each level is its own page, #/labs/<id>. The first one is the landing page of the labs. */
export const LAB_LEVELS: { id: string; level: Lab['level']; help: string }[] = [
  { id: 'beginner', level: 'Beginner', help: 'Commands are prepared, you fill in one gap.' },
  { id: 'intermediate', level: 'Intermediate', help: 'Command skeletons with several gaps.' },
  { id: 'advanced', level: 'Advanced', help: 'Goals and hints, you write the commands.' },
  { id: 'expert', level: 'Expert', help: 'Whole stacks with several containers.' },
]

/** Steps complete in order. `ran` and `saw` only count what happened since the step became active. */
export class LabRun {
  step = 0
  private cmds: string[] = []
  private out = ''
  private readonly steps: LabStep[]
  constructor(steps: LabStep[]) { this.steps = steps }
  typed(cmd: string) { this.cmds.push(cmd) }
  printed(text: string) { this.out = (this.out + text).slice(-20000) }
  check(term: Pick<Terminal, 'd' | 'read'>) {
    const x: LabCheck = { d: term.d, file: n => term.read(n), ran: re => this.cmds.some(c => re.test(c)), saw: re => re.test(this.out) }
    while (this.step < this.steps.length && this.steps[this.step].test(x)) { this.step++; this.cmds = []; this.out = '' }
    return this.step
  }
}

const all = (x: LabCheck) => [...x.d.containers.values()]
const box = (x: LabCheck, name: string) => all(x).find(c => c.name === name)
const up = (x: LabCheck, name: string) => box(x, name)?.status === 'running'
const gone = (x: LabCheck, name: string) => !box(x, name)
const publishes = (c: Container | undefined, host: number, port: number) => !!c?.bound.some(b => b.host === host && b.port === port)
const mounts = (c: Container | undefined, volume: string) => !!c?.mountSpecs.some(m => m.type === 'volume' && m.source === volume)
const service = (x: LabCheck, name: string) => all(x).filter(c => c.labels['com.docker.compose.service'] === name && c.status === 'running')
const NGINX_PAGE = /Welcome to nginx/
const PG_DATA = '/var/lib/postgresql/data'

export const LABS: Lab[] = [
  {
    id: 'first-container', level: 'Beginner', title: 'Dein erster Container', blurb: 'Starten, ansehen, wegräumen: der Lebenslauf eines Containers.', containers: 1,
    steps: [
      { label: 'Starte das Image `hello-world` als Container `hallo`.', cmd: `docker run --name hallo ${BLANK}`, test: x => box(x, 'hallo')?.status === 'exited' && box(x, 'hallo')?.exitCode === 0 },
      { label: 'Der Container hat sich beendet. Zeige mit dem Flag `-a` auch beendete Container an.', cmd: `docker ps ${BLANK}`, test: x => x.ran(/\b(ps|ls)\b.*(\s-\w*a|--all)/) },
      { label: 'Lösche den Container `hallo` mit dem Befehl `rm`.', cmd: `docker ${BLANK} hallo`, test: x => gone(x, 'hallo') },
    ],
  },
  {
    id: 'first-web-server', level: 'Beginner', title: 'Ein Webserver im Container', blurb: 'Ein Dienst läuft im Hintergrund und wird über einen Port erreichbar.', containers: 1,
    steps: [
      { label: 'nginx lauscht im Container auf Port `80`. Veröffentliche ihn auf Host-Port `8080`.', cmd: `docker run -d --name web -p 8080:${BLANK} nginx:alpine`, hint: 'Falscher Port? Entferne den Container mit `docker rm -f web` und starte neu.', test: x => up(x, 'web') && publishes(box(x, 'web'), 8080, 80) },
      { label: 'Rufe die Seite über den Host-Port `8080` ab.', cmd: `curl localhost:${BLANK}`, test: x => x.saw(NGINX_PAGE) },
      { label: 'Halte den Container `web` mit dem Befehl `stop` an.', cmd: `docker ${BLANK} web`, test: x => box(x, 'web')?.status === 'exited' },
      { label: 'Lösche den gestoppten Container `web`.', cmd: `docker rm ${BLANK}`, test: x => gone(x, 'web') },
    ],
  },
  {
    id: 'look-inside', level: 'Intermediate', title: 'In den Container schauen', blurb: 'Logs lesen, Befehle im laufenden Container ausführen und sehen, was beim Löschen verloren geht.', containers: 1,
    steps: [
      { label: 'Starte `nginx:alpine` als Container `shop` auf Host-Port `8081`.', cmd: `docker run -d --name ${BLANK} -p ${BLANK}:80 nginx:alpine`, test: x => up(x, 'shop') && publishes(box(x, 'shop'), 8081, 80) },
      { label: 'Rufe `localhost:8081` ab, damit eine Anfrage im Log landet.', cmd: `curl ${BLANK}`, test: x => x.saw(NGINX_PAGE) },
      { label: 'Zeige die `logs` von `shop` und finde deine Anfrage.', cmd: `docker ${BLANK} shop`, test: x => x.saw(/"GET \/ HTTP/) },
      { label: 'Überschreibe `index.html` im laufenden Container mit dem Text `Hallo`.', cmd: `docker exec shop sh -c "echo ${BLANK} > /usr/share/nginx/html/index.html"`, test: x => x.ran(/\bexec\s+shop\b/) },
      { label: 'Rufe `localhost:8081` erneut ab und prüfe die Änderung.', cmd: `curl localhost:${BLANK}`, test: x => x.saw(/hallo/i) },
      { label: 'Entferne `shop` mit `-f`, obwohl er noch läuft. Deine Änderung verschwindet mit ihm.', cmd: `docker rm ${BLANK} shop`, test: x => gone(x, 'shop') },
    ],
  },
  {
    id: 'own-image', level: 'Intermediate', title: 'Dein eigenes Image', blurb: 'Vom Dockerfile über den Build bis zum laufenden Container.', containers: 1,
    files: { Dockerfile: `FROM ${BLANK}\nCOPY ${BLANK} /usr/share/nginx/html/index.html\nEXPOSE 80\n`, 'index.html': '<h1>Mein eigenes Image</h1>\n' },
    steps: [
      { label: 'Ergänze im Dockerfile das Basis-Image `nginx:alpine` und die Quelldatei `index.html`.', test: x => /^FROM\s+nginx:alpine\s*$/m.test(x.file('Dockerfile')) && /^COPY\s+(\.\/)?index\.html\s/m.test(x.file('Dockerfile')) },
      { label: 'Baue daraus das Image `meine-seite`.', cmd: `docker build -t ${BLANK} .`, test: x => !!x.d.findImage('meine-seite') },
      { label: 'Starte das Image `meine-seite` als Container `seite` und veröffentliche `8080:80`.', cmd: `docker run -d --name seite -p ${BLANK} ${BLANK}`, test: x => up(x, 'seite') && box(x, 'seite')?.image.startsWith('meine-seite') === true && publishes(box(x, 'seite'), 8080, 80) },
      { label: 'Rufe `localhost:8080` ab. Dort steht jetzt deine eigene Seite.', cmd: `curl ${BLANK}`, test: x => x.saw(/<h1>/) && !x.saw(NGINX_PAGE) },
    ],
  },
  {
    id: 'volumes', level: 'Intermediate', title: 'Daten überleben den Container', blurb: 'Zwei Wegwerf-Container teilen sich ein Volume.', containers: 2,
    steps: [
      { label: 'Lege mit `create` das Volume `notizen` an.', cmd: `docker volume ${BLANK} notizen`, test: x => x.d.volumes.has('notizen') },
      { label: 'Binde `notizen` in einem Wegwerf-Container ein und schreibe eine Datei hinein.', cmd: `docker run --rm -v ${BLANK}:/data alpine sh -c "echo merken > /data/n.txt"`, test: x => [...(x.d.volumes.get('notizen')?.tree.keys() ?? [])].some(k => k.endsWith('n.txt')) },
      { label: 'Lies die Datei mit `cat` in einem zweiten, neuen Container wieder aus.', cmd: `docker run --rm -v notizen:/data alpine ${BLANK} /data/n.txt`, test: x => x.saw(/merken/) },
    ],
  },
  {
    id: 'network', level: 'Advanced', title: 'Container im eigenen Netz', blurb: 'Ohne Vorlage: Dienste finden sich über ihren Namen, ganz ohne veröffentlichte Ports.', containers: 3,
    steps: [
      { label: 'Erstelle das Netzwerk appnet.', hint: 'docker network create', test: x => x.d.networks.has('appnet') },
      { label: 'Starte nginx:alpine als web in appnet, ohne Port zu veröffentlichen.', hint: 'docker run -d mit --name und --network', test: x => up(x, 'web') && !!box(x, 'web')?.nets.has('appnet') && !box(x, 'web')?.bound.length },
      { label: 'Starte redis:alpine als cache im selben Netz.', hint: 'Gleiches Muster wie bei web.', test: x => up(x, 'cache') && !!box(x, 'cache')?.nets.has('appnet') },
      { label: 'Rufe http://web aus einem Wegwerf-Container in appnet ab.', hint: 'alpine bringt wget mit: wget -qO- http://web', test: x => x.saw(NGINX_PAGE) },
      { label: 'Zeige mit network inspect, dass web und cache in appnet hängen.', hint: 'docker network inspect appnet', test: x => x.saw(/"Name": "web"/) && x.saw(/"Name": "cache"/) },
    ],
  },
  {
    id: 'database', level: 'Advanced', title: 'Eine Datenbank, die bleibt', blurb: 'Postgres konfigurieren, den Container ersetzen und die Daten behalten.', containers: 2,
    steps: [
      { label: `Starte postgres:16-alpine als db mit Passwort und dem Volume pgdata unter ${PG_DATA}.`, hint: 'Ohne POSTGRES_PASSWORD beendet sich der Container. docker logs db nennt den Grund.', test: x => up(x, 'db') && mounts(box(x, 'db'), 'pgdata') },
      { label: 'Warte, bis die Datenbank Verbindungen annimmt.', hint: 'docker exec db pg_isready', test: x => x.saw(/accepting connections/) },
      { label: 'Lege eine Tabelle an und speichere den Wert gerettet.', hint: `docker exec db psql -U postgres -c "create table t (name text); insert into t values ('gerettet')"`, test: x => x.ran(/gerettet/) && x.saw(/INSERT/) },
      { label: 'Lösche den Container db samt laufendem Prozess.', hint: 'docker rm -f', test: x => gone(x, 'db') },
      { label: 'Starte einen neuen Container db mit demselben Volume.', hint: 'Derselbe Befehl wie am Anfang.', test: x => up(x, 'db') && mounts(box(x, 'db'), 'pgdata') },
      { label: 'Lies den Wert aus der Tabelle. Er hat den Container überlebt.', hint: 'psql mit select * from t', test: x => x.saw(/gerettet/) },
    ],
  },
  {
    id: 'compose-stack', level: 'Expert', title: 'Eine Anwendung aus drei Diensten', blurb: 'Du beschreibst die ganze Anwendung selbst in der Projektdatei, mit Reihenfolge, Bereitschaftsprüfung und dauerhaftem Speicher.', containers: 3,
    files: { 'compose.yml': 'services:\n' },
    steps: [
      { label: 'Beschreibe in der Projektdatei drei Dienste: web liefert Seiten mit nginx aus und ist von außen unter 8080 erreichbar, cache ist ein Redis, db ein Postgres 16 mit Passwort und dauerhaftem Speicher namens pgdata. Bringe dann alles zum Laufen.', hint: 'Benannter Speicher muss zusätzlich am Ende der Datei deklariert werden.', test: x => service(x, 'web').length === 1 && service(x, 'cache').length === 1 && service(x, 'db').length === 1 && publishes(service(x, 'web')[0], 8080, 80) && service(x, 'db')[0].mountSpecs.some(m => m.source.endsWith('pgdata')) },
      { label: 'db soll regelmäßig melden, ob die Datenbank Verbindungen annimmt. web darf erst hochfahren, wenn diese Prüfung bestanden ist.', hint: 'Postgres bringt ein kleines Prüfprogramm mit. Trage die Abhängigkeit bei web ein und wende die Datei danach erneut an.', test: x => service(x, 'db')[0]?.health?.status === 'healthy' && /service_healthy/.test(x.file('compose.yml')) && service(x, 'web').length === 1 },
      { label: 'Rufe die Seite von web vom eigenen Rechner aus ab.', hint: 'Rufe die Adresse mit dem Terminal-Werkzeug für Webseiten vom eigenen Rechner aus ab.', test: x => x.saw(NGINX_PAGE) },
      { label: 'Prüfe aus web heraus, ob db unter seinem Namen antwortet.', hint: 'Schicke von innen ein einzelnes Testpaket an db.', test: x => x.saw(/64 bytes from/) },
      { label: 'Räume alle laufenden Teile der Anwendung weg, aber behalte die gespeicherten Daten.', hint: 'Der Befehl, der alles abbaut, löscht den Speicher nur auf ausdrücklichen Wunsch.', test: x => !all(x).length && [...x.d.volumes.keys()].some(v => v.endsWith('pgdata')) },
    ],
  },
  {
    id: 'broken-stack', level: 'Expert', title: 'Eine kaputte Anwendung reparieren', blurb: 'Fünf Instanzen sollen laufen. Die Projektdatei enthält mehrere Fehler, die Meldungen führen dich hin.', containers: 5,
    files: { 'compose.yml': 'services:\n  lb:\n    image: nginx:alpine\n    ports:\n      - "8080:80"\n    depends_on:\n      - api\n  api:\n    imgae: nginx:alpine\n    ports:\n      - "8080:80"\n  db:\n    image: postgres:16-alpine\n' },
    steps: [
      { label: 'Bringe die Anwendung zum Laufen und behebe die Fehler, bis db dauerhaft läuft.', hint: 'Lies, was der erste Versuch meldet, und danach die Ausgabe von db.', test: x => service(x, 'db').length === 1 && /POSTGRES_(PASSWORD|HOST_AUTH_METHOD)/.test(x.file('compose.yml')) },
      { label: 'Lass drei Instanzen von api gleichzeitig laufen. Keine davon darf von außen direkt erreichbar sein.', hint: 'Die Anzahl der Instanzen lässt sich beim Hochfahren als Option angeben.', test: x => service(x, 'api').length === 3 && service(x, 'api').every(c => !c.bound.length) },
      { label: 'Prüfe, dass lb von außen unter 8080 antwortet.', hint: 'Rufe die Adresse vom eigenen Rechner aus ab.', test: x => service(x, 'lb').length === 1 && x.saw(NGINX_PAGE) },
      { label: 'Prüfe aus lb heraus, ob api unter seinem Namen antwortet.', hint: 'Schicke von innen ein einzelnes Testpaket an api.', test: x => x.saw(/64 bytes from/) },
    ],
  },
]
