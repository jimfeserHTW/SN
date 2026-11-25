import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'bauplan': [
    choice(e('Ein Container schreibt eine Logdatei. Wo landet sie?', 'A container writes a log file. Where does it end up?'), [
      e('Im Image, für alle Container', 'In the image, for all containers'), e('In der eigenen Schreibschicht des Containers', 'In the container’s own writable layer'), e('Nirgends, Container können nicht schreiben', 'Nowhere, containers cannot write'),
    ], 1, e('Das Image bleibt nur lesbar. Jeder Container schreibt in seine eigene Schicht, die mit docker rm verschwindet.', 'The image stays read-only. Each container writes into its own layer, which disappears with docker rm.')),
    order(e('Von unten nach oben: Wie ist das Image der api geschichtet?', 'From bottom to top: how is the api image layered?'), [e('Linux-Basis mit Java 21 (JRE)', 'Linux base with Java 21 (JRE)'), 'app.jar', e('Startbefehl als Metadaten', 'start command as metadata')],
      e('FROM und COPY legen Schichten übereinander, die Basis liegt unten. CMD ist keine Schicht, sondern ein Eintrag in den Metadaten.', 'FROM and COPY stack layers on top of each other, the base at the bottom. CMD is not a layer but an entry in the metadata.')),
    choice(e('Was bedeutet der Tag latest?', 'What does the tag latest mean?'), [
      e('Immer die neueste Version', 'Always the newest version'), e('Nur der Standard-Tag, wenn keine Version angegeben ist', 'Only the default tag when no version is given'), e('Eine geprüfte, stabile Version', 'A tested, stable version'),
    ], 1, e('latest ist ein ganz normaler Tag. Wer ihn vergibt, entscheidet, worauf er zeigt. Für Abgaben besser eine feste Version.', 'latest is an ordinary tag. Whoever sets it decides what it points to. For hand-ins, better use a fixed version.')),
    match(e('Was gehört zusammen?', 'What belongs together?'), [
      ['Dockerfile', e('die Bauanleitung', 'the build instructions')], ['Image', e('nur lesbare Vorlage für Container', 'read-only template for containers')], ['Registry', e('teilt Images, z. B. Docker Hub', 'shares images, e.g. Docker Hub')], [e('lokale Images', 'local images'), e('daraus starten Container', 'containers start from these')],
    ], e('Aus dem Dockerfile baut ihr das Image, es liegt lokal auf dem Rechner und wird über eine Registry geteilt.', 'From the Dockerfile you build the image, it lives locally on the machine and is shared through a registry.')),
  ],
  'holen-bauen': [
    order(e('Bringe die Schritte in die richtige Reihenfolge, um ein lokales Image auf den Server zu bringen.', 'Put the steps in order to get a local image onto the server.'), ['docker tag mensa-api:1.1 ghcr.io/team/mensa-api:1.1', 'docker login ghcr.io', 'docker push ghcr.io/team/mensa-api:1.1', 'docker pull ghcr.io/team/mensa-api:1.1'],
      e('Erst den Namen mit Registry vergeben, dann anmelden, hochladen und auf dem Server holen.', 'First give the name with the registry, then log in, upload and fetch it on the server.'), { code: true, swap: [[0, 1]] }),
    choice(e('Ein auf dem Mac mit Apple-Chip gebautes Image endet auf dem Server sofort mit „exec format error“. Warum?', 'An image built on a Mac with an Apple chip ends on the server at once with “exec format error”. Why?'), [
      e('Die app.jar ist beschädigt', 'The app.jar is broken'), e('Das Image enthält Maschinencode für arm64, der Server hat eine amd64-CPU', 'The image contains machine code for arm64, the server has an amd64 CPU'), e('Der Server hat zu wenig Speicher', 'The server has too little memory'),
    ], 1, e('Java und das Basis-Image sind Maschinencode für eine CPU. Abhilfe: docker buildx build --platform linux/amd64.', 'Java and the base image are machine code for one CPU. Fix: docker buildx build --platform linux/amd64.')),
    choice(e('docker build -t mensa-api:1.0 . – wofür steht der Punkt am Ende?', 'docker build -t mensa-api:1.0 . – what does the dot at the end stand for?'), [
      e('Für den Ordner, der an den Daemon geschickt wird', 'For the folder that is sent to the daemon'), e('Für das Ende des Befehls', 'For the end of the command'), e('Für die neueste Version', 'For the newest version'),
    ], 0, e('Der Punkt ist der Build-Kontext: dieser Ordner geht an dockerd, nur daraus kann COPY Dateien holen.', 'The dot is the build context: this folder is sent to dockerd, COPY can only take files from it.')),
    order('Was passiert bei `docker pull`?', ['Manifest des Tags holen', 'Vorhandene Layer erkennen (Already exists)', 'Fehlende Layer herunterladen', 'Layer prüfen und entpacken'], 'Das Manifest nennt die Layer. Nur fehlende werden geladen und danach für OverlayFS entpackt.'),
    bugs('Dieses Dockerfile enthält zwei Fehler. Markiere die Zeilen.', 'Dockerfile', ['FROM node:22-alpine', 'WORKDIR /app', '!!COPY package.json', 'RUN npm install', 'COPY . .', '!!EXPOSE: 3000', 'CMD ["node", "server.js"]'], '`COPY` braucht ein Ziel, und Anweisungen stehen ohne Doppelpunkt.'),
  ],
  'schichten': [
    choice(e('Zehn Container laufen aus demselben Image. Wie oft liegen dessen Schichten auf der Platte?', 'Ten containers run from the same image. How often are its layers stored on disk?'), [
      e('Zehnmal, für jeden Container einmal', 'Ten times, once per container'), e('Einmal, dazu je eine kleine Schreibschicht pro Container', 'Once, plus one small writable layer per container'), e('Gar nicht, sie liegen nur im RAM', 'Not at all, they are only in RAM'),
    ], 1, e('Die Schichten sind nur lesbar und werden geteilt. Jeder Container bekommt nur seine eigene, dünne Schreibschicht.', 'The layers are read-only and shared. Each container only gets its own thin writable layer.')),
    gaps('Ergänze die Begriffe aus dem Dateisystem eines Containers.', 'Image-Layer sind nur [[lesbar]]. Jeder Container bekommt eine eigene [[Schreibschicht]]. Ändert er eine Datei aus dem Image, wird sie zuerst dorthin kopiert. Das heißt [[Copy-on-Write|CoW|Copy on Write]].', 'Deshalb bleibt das Image unverändert und kann von vielen Containern geteilt werden.'),
    choice('Ein Container löscht eine Datei, die aus dem Image stammt. Was passiert?', ['Sie verschwindet aus dem Image-Layer', 'Die Schreibschicht verdeckt sie mit einer Löschmarkierung', 'Der Befehl schlägt immer fehl'], 1, 'Layer bleiben unverändert. Die Datei ist nur im Container nicht mehr sichtbar, das Image wird nicht kleiner.'),
  ],
  'festplatte': [
    choice(e('Unter welchem Ordner legt Docker auf Linux Images, Container und Volumes ab?', 'Under which folder does Docker on Linux store images, containers and volumes?'), ['/var/lib/docker', '/etc/docker', '/home/docker'], 0,
      e('Alles, was dockerd verwaltet, liegt unter /var/lib/docker. In /etc/docker steht nur die Konfiguration.', 'Everything dockerd manages lives under /var/lib/docker. /etc/docker only holds the configuration.')),
    match('Was liegt wo unter /var/lib/docker?', [['overlay2/<id>/diff', 'Dateien eines Layers'], ['containers/<id>/config.v2.json', 'Konfiguration des Containers'], ['containers/<id>/<id>-json.log', 'Alles, was docker logs zeigt'], ['volumes/daten/_data', 'Inhalt eines Volumes']], 'Docker verwaltet alles als gewöhnliche Dateien und Ordner.'),
    figure('Welche Ordner setzt OverlayFS zusammen?', flow(['[[lowerdir]]: Image-Layer', '[[upperdir]]: Schreibschicht', '[[merged]]: Sicht im Container'], ['darüber', 'ergibt']), 'Der Container sieht nur `merged`, Schreibzugriffe landen in `upperdir`.'),
  ],
}
export default quiz
