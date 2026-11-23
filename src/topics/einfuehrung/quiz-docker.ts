import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'start': [
    choice(e('Warum läuft eine App oft nur „bei mir“?', 'Why does an app often only work “on my machine”?'), [
    e('Weil sie nutzt, was auf dem Rechner installiert ist, und jeder Rechner andere Versionen hat', 'Because it uses what is installed on the machine, and every machine has different versions'),
    e('Weil Quellcode auf jedem Rechner anders kompiliert wird', 'Because source code compiles differently on every machine'),
    e('Weil Programme nur auf einem Rechner gleichzeitig laufen dürfen', 'Because programs may only run on one machine at a time'),
  ], 0, e('Gleicher Code trifft auf andere Bibliotheken und Laufzeiten. Genau diese Umgebung verpackt Docker mit.', 'The same code meets different libraries and runtimes. Docker packs exactly this environment along with the app.')),
    match(e('Wie startet welcher Weg die App?', 'How does each way start the app?'), [
      ['java -jar', e('mit dem JDK, das auf dem Rechner installiert ist', 'with the JDK installed on the machine')],
      ['docker run', e('im Container, verwaltet vom Daemon dockerd', 'in a container, managed by the daemon dockerd')],
      ['podman run', e('im Container, ohne Daemon', 'in a container, without a daemon')],
      [e('VM', 'VM'), e('in einem eigenen Betriebssystem mit eigenem Kernel', 'in an operating system of its own with its own kernel')],
    ], e('Docker und Podman nutzen dieselben Images und den Kernel des Rechners. Nur die VM bootet einen eigenen Kernel.', 'Docker and Podman use the same images and the kernel of the machine. Only the VM boots a kernel of its own.')),
    choice(e('Was packt ihr in den Container der api? Mehrere Antworten sind richtig.', 'What do you pack into the container of the api? Several answers are correct.'), [
      'app.jar', 'JDK 21', e('Bibliotheken', 'Libraries'), e('Den Kernel', 'The kernel'),
    ], [0, 1, 2], e('Alles, was die App braucht, kommt hinein. Den Kernel stellt der Rechner, für alle Container gemeinsam.', 'Everything the app needs goes inside. The kernel is provided by the machine, shared by all containers.')),
    gaps(e('Ergänze die Lücken.', 'Fill in the gaps.'), e('Ohne Container nutzt die App, was auf dem [[Rechner|Host|Laptop]] installiert ist. Ein Container bringt sein eigenes [[JDK|Java]] mit. Nur den [[Kernel]] teilt er sich mit den anderen Containern.', 'Without a container the app uses what is installed on the [[machine|host|laptop]]. A container brings its own [[JDK|Java]]. Only the [[kernel]] is shared with the other containers.'),
      e('Darum läuft derselbe Container auf jedem Rechner gleich.', 'That is why the same container runs the same on every machine.')),
    figure(e('Ergänze, was Docker für Software macht.', 'Complete what Docker does for software.'), flow([e('App + JDK + Bibliotheken', 'app + JDK + libraries'), e('verpackt im [[Container]]', 'packed in a [[container]]'), e('läuft auf jedem Rechner mit [[Docker]]', 'runs on every machine with [[Docker]]')], [e('packen', 'pack'), e('starten', 'start')]),
      e('Der Inhalt ist egal, die Verpackung immer gleich: Docker startet jedes Image auf dieselbe Weise.', 'The contents do not matter, the packaging is always the same: Docker starts every image the same way.')),
    choice(e('Was steckt nicht in einem Image?', 'What is not inside an image?'), [
    e('Die App', 'The app'), e('Bibliotheken', 'Libraries'), e('Der Kernel des Hosts', 'The host kernel'), e('Die Laufzeitumgebung', 'The runtime'),
  ], 2, e('Container nutzen den Kernel des Host-Rechners. Das Image bringt nur alles darüber mit.', 'Containers use the kernel of the host. The image only brings everything above it.')),
    match(e('Was entspricht sich in Java und Docker?', 'What corresponds in Java and Docker?'), [
      [e('Klasse', 'class'), e('Image', 'image')],
      [e('Objekt', 'object'), e('Container', 'Container')],
      ['new', 'docker run'],
      ['Maven Central', 'Docker Hub'],
    ], e('Ein Image ist der Bauplan, ein Container ein laufendes Exemplar. Images liegen in einer Registry wie Bibliotheken in Maven Central.', 'An image is the blueprint, a container is a running instance. Images live in a registry like libraries in Maven Central.')),
    choice(e('Was ist ein laufender Container, verglichen mit java -jar app.jar?', 'What is a running container, compared with java -jar app.jar?'), [
      e('Ein eigener Server mit eigenem Betriebssystem', 'A server of its own with its own operating system'),
      e('Derselbe Prozess, nur mit eigener Umgebung und abgeschottet', 'The same process, only with its own environment and sealed off'),
      e('Eine virtuelle Maschine mit eigenem Kernel', 'A virtual machine with its own kernel'),
    ], 1, e('Ein Container fährt nicht hoch wie ein Server. Er ist ein Prozess auf dem Rechner, abgeschottet und mit eigenem JDK.', 'A container does not boot like a server. It is a process on the machine, sealed off and with its own JDK.')),
    order(e('Bringe die Befehle in die Reihenfolge, in der ihr sie braucht.', 'Put the commands in the order you need them.'), ['docker build -t mensa-api:1.0 .', 'docker run -d --name api mensa-api:1.0', 'docker stop api', 'docker rm api'],
      e('Erst das Image bauen, dann den Container starten, anhalten und zum Schluss entfernen.', 'First build the image, then start the container, stop it and finally remove it.'), { code: true }),
    gaps(e('Ergänze den Befehl: im Hintergrund, Rechner-Port 8080 auf Container-Port 8080.', 'Complete the command: in the background, machine port 8080 to container port 8080.'), 'docker [[run]] -[[d]] -[[p]] 8080:8080 --name api mensa-api:1.0\n',
      e('-d schickt den Container in den Hintergrund, -p leitet Port 8080 des Rechners an Port 8080 im Container weiter.', '-d sends the container to the background, -p forwards port 8080 of the machine to port 8080 in the container.'), 'terminal'),
  ],
}
export default quiz
