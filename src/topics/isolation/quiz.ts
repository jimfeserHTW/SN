import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'waende': [
    match(e('Was regelt was?', 'What controls what?'), [
      ['Namespaces', e('was ein Container sieht', 'what a container sees')],
      ['cgroups', e('wie viel er verbrauchen darf', 'how much it may use')],
      ['OOM-Kill', e('Ende bei zu viel Speicher', 'the end on too much memory')],
      ['Capabilities', e('was er tun darf', 'what it may do')],
    ], e('Sicht und Verbrauch sind zwei getrennte Fragen. Dazu kommen die Rechte, die ein Prozess hat.', 'View and consumption are two separate questions. On top come the rights a process has.')),
    choice(e('Ein Container endet mit Exit-Code 137. Was ist die wahrscheinlichste Ursache?', 'A container ends with exit code 137. What is the most likely cause?'), [
      e('Ein Tippfehler im Image-Namen', 'A typo in the image name'), e('Er hat sein Speicher-Limit überschritten', 'It went over its memory limit'), e('Das Netz war nicht erreichbar', 'The network was unreachable'),
    ], 1, e('137 heißt: Der Prozess wurde hart beendet, meist weil er sein Speicher-Limit überschritten hat.', '137 means: the process was killed hard, usually because it went over its memory limit.')),
    choice(e('Der Java-Prozess der api hat im Container die Nummer 1. Welche Nummer hat er auf dem Rechner?', 'The Java process of the api has number 1 in the container. Which number does it have on the machine?'), [
      e('Auch 1', 'Also 1'), e('Eine andere, z. B. 4711', 'A different one, e.g. 4711'), e('Keine, er ist auf dem Rechner unsichtbar', 'None, it is invisible on the machine'),
    ], 1, e('Derselbe Prozess, zwei PIDs: Der PID-Namespace gibt ihm drinnen eine eigene Zählung.', 'The same process, two PIDs: the PID namespace gives it its own numbering inside.')),
    choice(e('Warum sind Container schwächer getrennt als VMs?', 'Why are containers separated less strongly than VMs?'), [
      e('Weil sie sich einen Kernel teilen', 'Because they share one kernel'), e('Weil sie kein eigenes Dateisystem haben', 'Because they have no file system of their own'), e('Weil sie immer als root laufen', 'Because they always run as root'),
    ], 0, e('Alle Container fahren mit derselben Maschine. Ein Fehler im Kernel trifft alle, bei VMs nur eine.', 'All containers run on the same engine. A fault in the kernel hits all of them, with VMs only one.')),
  ],
  'trennung': [
    choice('Welche PID hat nginx, wenn es als Hauptprozess im Container läuft?', ['Im Container 1, auf dem Host eine andere Nummer', 'Überall 1', 'Im Container keine, nur auf dem Host'], 0, 'Der PID-Namespace gibt demselben Prozess eine zweite Nummer.'),
    match('Welcher Kernel-Mechanismus ist zuständig?', [['Namespaces', 'Was ein Prozess sehen kann'], ['cgroups', 'Wie viel ein Prozess verbrauchen darf'], ['OverlayFS', 'Fügt Layer zu einem Dateisystem zusammen']], 'Container sind normale Prozesse, die diese Mechanismen kombinieren.'),
    figure('Welche Bausteine trennen einen Container vom Rest des Systems?', flow(['Prozess im Container', 'sieht wenig durch [[Namespaces|Namespace]]', 'verbraucht begrenzt durch [[cgroups|cgroup|Control Groups]]'], ['Sicht', 'Grenze']), 'Sicht und Verbrauch sind zwei getrennte Fragen.'),
  ],
  'kernel': [
    match('Was trennt welcher Namespace?', [['pid', 'Prozessnummern'], ['net', 'Netzgeräte und Adressen'], ['mnt', 'Sicht auf das Dateisystem'], ['uts', 'Hostname'], ['ipc', 'Shared Memory']], 'Ein Kernel, aber je Namespace eine eigene Sicht.'),
    gaps('Was passiert beim Überschreiten des Speicherlimits?', 'Das Limit steht in der cgroup-Datei [[memory.max]]. Wird es überschritten, beendet der [[OOM-Killer|OOM|OOM Killer]] den Prozess, und der Container endet mit Exit-Code [[137]].', '137 ist 128 plus Signal 9 (SIGKILL).'),
    match('Welche Schutzschicht prüft was?', [['Capabilities', 'Einzelne Root-Rechte wie CAP_NET_ADMIN'], ['seccomp', 'Erlaubte Systemaufrufe'], ['AppArmor / SELinux', 'Regeln für Pfade und Zugriffe']], 'Die Schichten greifen nacheinander, jede kann einen Zugriff ablehnen.'),
    bugs('Dieser Container soll abgesichert laufen. Welche Optionen widersprechen dem?', 'terminal', ['docker run -d \\', '  --cap-drop ALL \\', '!!  --privileged \\', '  --read-only \\', '  --pids-limit 100 \\', '!!  --security-opt seccomp=unconfined \\', '  nginx:1.27'], '`--privileged` gibt fast alle Rechte zurück, und `unconfined` schaltet den Systemaufruf-Filter ab.'),
  ],
  'luecken': [
    match(e('Welche Maßnahme stoppt welchen Schritt eines Angriffs?', 'Which measure stops which step of an attack?'), [
      [e('Passwort als Secret-Datei', 'password as a secret file'), e('Passwort aus Umgebungsvariablen lesen', 'reading the password from environment variables')],
      [e('db nur im Netz backend', 'db only in the network backend'), e('die Datenbank aus der api heraus kopieren', 'copying the database from outside the backend')],
      [e('Limits für CPU', 'CPU limits'), e('alle mit einem Miner ausbremsen', 'slowing everyone down with a miner')],
      [e('USER statt root, kein docker.sock', 'USER instead of root, no docker.sock'), e('den ganzen Rechner übernehmen', 'taking over the whole machine')],
    ], e('Die Lücke öffnet die Tür, eure Einstellungen bestimmen, wie weit ein Angreifer kommt.', 'The vulnerability opens the door, your settings decide how far an attacker gets.')),
    choice(e('Was macht ein Scanner wie docker scout oder Trivy?', 'What does a scanner like docker scout or Trivy do?'), [
      e('Er testet die App mit Angriffen', 'It tests the app with attacks'), e('Er vergleicht die Paketversionen im Image mit bekannten Lücken (CVEs)', 'It compares the package versions in the image with known vulnerabilities (CVEs)'), e('Er repariert die Lücken automatisch', 'It repairs the holes automatically'),
    ], 1, e('Ein Scanner vergleicht Versionen. Er findet nur bekannte Lücken in Paketen, die er erkennt.', 'A scanner compares versions. It only finds known holes in packages it recognises.')),
    choice(e('Ein Image hatte beim Bauen keine bekannte Lücke. Drei Monate später zeigt der Scan zwei kritische. Warum?', 'An image had no known vulnerability when built. Three months later the scan shows two critical ones. Why?'), [
      e('Jemand hat das Image verändert', 'Someone changed the image'), e('Inzwischen wurden neue Lücken in den enthaltenen Paketen bekannt', 'New vulnerabilities in the packages inside have become known meanwhile'), e('Der Scanner ist kaputt', 'The scanner is broken'),
    ], 1, e('Ein Image altert, auch ohne Änderung. Deshalb regelmäßig mit aktuellem Basis-Image neu bauen und scannen.', 'An image ages even without changes. So rebuild regularly with a current base image and scan.')),
  ],
}
export default quiz
