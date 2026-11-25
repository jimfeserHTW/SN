import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'an-bord': [
    figure(e('Wer macht was?', 'Who does what?'), flow([e('[[docker|Docker CLI|Client]] gibt den Befehl', '[[docker|Docker CLI|client]] gives the order'), e('[[Docker Engine|Engine|Daemon|dockerd]] führt aus', '[[Docker Engine|engine|daemon|dockerd]] carries it out'), e('der Container läuft', 'the container runs')], [e('Auftrag', 'order'), e('startet', 'starts')]),
      e('Der Client gibt nur den Auftrag. Die Arbeit macht der Daemon, die Docker Engine.', 'The client only gives the order. The work is done by the daemon, the Docker Engine.')),
    match(e('Was gehört zusammen?', 'What belongs together?'), [
      [e('Client', 'Client'), e('docker, das Programm im Terminal', 'docker, the program in the terminal')],
      [e('Docker-API', 'Docker API'), e('die Schnittstelle zwischen Client und Daemon', 'the interface between client and daemon')],
      [e('Daemon', 'Daemon'), e('dockerd, macht die Arbeit im Hintergrund', 'dockerd, does the work in the background')],
      ['Kernel', e('teilen sich alle Container', 'shared by all containers')],
    ], e('Client und Daemon sind zwei Programme, die über die Docker-API reden. Die Arbeit macht dockerd, mit dem Kernel des Rechners.', 'Client and daemon are two programs that talk over the Docker API. The work is done by dockerd, with the kernel of the machine.')),
    choice(e('Warum braucht Docker auf dem Mac eine kleine Linux-VM?', 'Why does Docker need a small Linux VM on a Mac?'), [
      e('Weil Linux-Container einen Linux-Kernel brauchen', 'Because Linux containers need a Linux kernel'),
      e('Weil macOS keine Programme im Hintergrund erlaubt', 'Because macOS allows no background programs'),
      e('Weil jeder Container eine eigene VM bekommt', 'Because every container gets a VM of its own'),
    ], 0, e('Container teilen sich den Kernel. Auf dem Mac gibt es keinen Linux-Kernel, also bringt Docker Desktop einen in einer VM mit.', 'Containers share the kernel. A Mac has no Linux kernel, so Docker Desktop brings one in a VM.')),
    order(e('Wie lebt ein Container? Sortiere.', 'How does a container live? Sort.'), [e('anlegen', 'create'), e('starten', 'start'), e('anhalten', 'stop'), e('entfernen', 'remove')],
      e('Gestoppt ist nicht gelöscht. Erst docker rm entfernt den Container.', 'Stopped is not removed. Only docker rm removes the container.')),
  ],
  'betriebssystem': [
    figure(e('Ergänze die zwei fehlenden Schichten unter den Containern.', 'Fill in the two missing layers below the containers.'), stacks({
    title: 'Container',
    rows: ['hardware', { part: 'kernel', blank: 'Host-Kernel|Kernel|Host Kernel|Hostkernel' }, { part: 'engine', blank: 'Container Engine|Engine|Docker Engine|Container-Engine|Docker' }, [{ unit: 'Container 1', kind: 'container', rows: ['libs', 'app'] }, { unit: 'Container 2', kind: 'container', rows: ['libs', 'app'] }]],
  }), e('Alle Container laufen nebeneinander auf der Engine und teilen sich den Kernel des Hosts.', 'All containers run side by side on the engine and share the kernel of the host.')),
    figure(e('Was fehlt in diesem Aufbau einer virtuellen Maschine?', 'What is missing in this virtual machine setup?'), stacks({
    title: 'VM',
    rows: ['hardware', 'kernel', { part: 'hypervisor', blank: 'Hypervisor', sub: '' }, [{ unit: 'VM 1', kind: 'vm', rows: [{ part: 'guestKernel', blank: 'Gast-Kernel|Gastkernel|Guest kernel|Guest-Kernel' }, 'libs', 'app'] }]],
  }), e('Der Hypervisor vermittelt die Hardware an die VMs, und jede VM bringt ihren eigenen Gast-Kernel mit.', 'The hypervisor hands the hardware to the VMs, and every VM brings its own guest kernel.')),
    choice(e('Welche Aussagen über Container und VMs stimmen?', 'Which statements about containers and VMs are true?'), [
    e('Container teilen sich den Kernel des Hosts', 'Containers share the kernel of the host'),
    e('Jede VM hat einen eigenen Kernel', 'Every VM has its own kernel'),
    e('Jeder Container bootet einen eigenen Kernel', 'Every container boots its own kernel'),
    e('VMs sind stärker voneinander isoliert', 'VMs are more strongly isolated from each other'),
  ], [0, 1, 3], e('Container sind leichtgewichtig, weil sie keinen eigenen Kernel starten. Dafür isolieren VMs stärker.', 'Containers are lightweight because they start no kernel of their own. In exchange, VMs isolate more strongly.')),
    choice('Hat ein Ubuntu-Container ein eigenes Betriebssystem?', ['Ja, mit eigenem Ubuntu-Kernel', 'Nur die Programme und Bibliotheken von Ubuntu, der Kernel kommt vom Host', 'Nein, im Container gibt es keine Dateien'], 1, 'Das Image liefert die Dateien einer Distribution. Alle Container nutzen denselben Kernel des Hosts.'),
    figure('macOS hat keinen Linux-Kernel. Welcher Kernel läuft deshalb in der VM?', stacks({
    title: 'Docker Desktop auf macOS',
    rows: ['hardware', { part: 'kernel', label: 'macOS', sub: 'kein Linux' }, { part: 'hypervisor', sub: '' }, [{ unit: 'VM', kind: 'vm', rows: [{ part: 'guestKernel', blank: 'Linux|Linux-Kernel|Linux Kernel' }, 'engine', [{ unit: 'Container 1', kind: 'container', rows: ['app'] }, { unit: 'Container 2', kind: 'container', rows: ['app'] }]] }]],
  }), 'Linux-Container brauchen einen Linux-Kernel. Docker Desktop bringt ihn in einer kleinen VM mit.'),
    order('Wie kommt `docker run` beim Daemon an? Sortiere die Schritte.', ['Die CLI übersetzt den Befehl in API-Anfragen', 'Die Anfrage geht über /var/run/docker.sock', 'POST /containers/create legt den Container an', 'POST /containers/<id>/start startet ihn'], 'Die CLI ist nur ein HTTP-Client. Anlegen und Starten sind zwei getrennte API-Aufrufe.'),
  ],
  'bausteine': [
    figure(e('Wer macht hier was? Ergänze die beiden Bausteine der Docker-Architektur.', 'Who does what here? Fill in the two building blocks of the Docker architecture.'), flow(
    [e('docker (Client)', 'docker (client)'), e('[[Daemon|dockerd|Docker Daemon|Docker-Daemon]] verwaltet Images und Container', '[[Daemon|dockerd|Docker Daemon]] manages images and containers'), e('[[Registry|Docker Registry|Docker-Registry]] z. B. Docker Hub', '[[Registry|Docker Registry]] e.g. Docker Hub')],
    [e('sendet den Befehl', 'sends the command'), e('lädt Images herunter', 'downloads images')],
  ), e('Der Client nimmt nur den Befehl an. Die Arbeit macht der Daemon, die Images kommen aus der Registry.', 'The client only takes the command. The daemon does the work, and images come from the registry.')),
    match(e('Ordne jedem Begriff seine Rolle zu.', 'Match each term with its role.'), [
    ['Image', e('Vorlage, nur lesbar', 'template, read-only')],
    ['Container', e('Laufende Instanz eines Images', 'Running instance of an image')],
    ['Registry', e('Lager für viele Images', 'Warehouse for many images')],
  ], e('Wie Klasse und Objekt: Aus einem Image entstehen beliebig viele Container.', 'Like class and object: one image can create any number of containers.')),
    order(e('Bringe die Befehle in die Reihenfolge des Lebenszyklus.', 'Put the commands into lifecycle order.'), ['docker pull nginx', 'docker create --name frontend nginx', 'docker start frontend', 'docker stop frontend', 'docker rm frontend', 'docker rmi nginx'],
    e('Erst das Image holen, daraus einen Container anlegen, starten, stoppen, löschen und zuletzt das Image entfernen.', 'First get the image, create a container, start, stop, remove it, and finally remove the image.'), { code: true }),
    order(e('Ziehe die Teile zu einem gültigen Befehl zusammen: nginx im Hintergrund, Port 8080 außen auf 80 innen.', 'Drag the parts into a valid command: nginx in the background, outside port 8080 to inside 80.'), ['docker', 'container', 'run', '-d', '-p 8080:80', 'nginx'],
    e('Aufbau: Programm, Objekt, Aktion, Optionen, Argument. Die beiden Optionen dürfen tauschen.', 'Structure: program, object, action, options, argument. The two options may swap.'), { inline: true, swap: [[3, 4]] }),
    gaps(e('Ergänze die fehlenden Befehlsteile.', 'Fill in the missing command parts.'), e('Laufende Container zeigt docker [[ps]]. Mit dem Flag -[[a]] erscheinen auch gestoppte. Die Ausgabe eines Containers zeigt docker [[logs]] frontend.', 'Running containers are shown by docker [[ps]]. With the flag -[[a]], stopped ones appear too. The output of a container is shown by docker [[logs]] frontend.'),
    e('`ps` ist die Kurzform von `container ls`.', '`ps` is the short form of `container ls`.')),
    bugs(e('Zwei dieser Befehle können so nicht funktionieren. Markiere sie.', 'Two of these commands cannot work like this. Mark them.'), 'terminal', ['docker pull nginx:1.27', '!!docker nginx run -d', 'docker run -d --name frontend nginx:1.27', 'docker ps -a', '!!docker rm'],
    e('Die Aktion steht vor dem Image, und `docker rm` braucht einen Container als Argument.', 'The action comes before the image, and `docker rm` needs a container as argument.')),
    gaps('Ergänze die Optionen.', 'docker run -d \\\n  --[[name]] frontend \\\n  -[[p]] 8080:80 \\\n  -[[v]] daten:/data \\\n  --[[memory]] 512m \\\n  nginx:1.27\n', 'Jede Option berührt ein anderes Teilsystem: Name, Portweiterleitung, Mount und cgroup-Limit.', 'terminal'),
    order('Baue den Befehl aus den Teilen.', ['docker', 'run', '-d', '--name frontend', '-p 8080:80', '-v daten:/data', 'nginx:1.27'], 'Optionen stehen zwischen `run` und dem Image, ihre Reihenfolge ist frei.', { inline: true, swap: [[2, 3, 4, 5]] }),
  ],
  'kern': [
    choice(e('Was kennzeichnet Podman im Vergleich zu Docker?', 'What characterizes Podman compared to Docker?'), [
    e('Es ist eine vollständige virtuelle Maschine', 'It is a full virtual machine'),
    e('Es kommt ohne zentralen Daemon aus und läuft auch rootless', 'It works without a central daemon and can also run rootless'),
    e('Es kann keine Docker-Images starten', 'It cannot run Docker images'),
  ], 1, e('Podman ist weitgehend Docker-kompatibel, braucht aber keinen dauerhaft laufenden Daemon.', 'Podman is largely Docker-compatible but needs no permanently running daemon.')),
    order('Wer ruft wen beim Start eines Containers?', ['dockerd', 'containerd', 'containerd-shim', 'runc', 'Dein Prozess'], 'Jede Ebene gibt die Arbeit nach unten weiter, am Ende ersetzt sich runc durch den Prozess.', { code: true }),
    order('Was erledigt runc der Reihe nach?', ['Neue Namespaces anlegen', 'Limits in die cgroup-Dateien eintragen', 'Mounts einrichten und mit pivot_root das Image zu / machen', 'Rechte kürzen', 'Zielprogramm mit exec starten'], 'Die Rechte werden zuletzt gekürzt, denn die Schritte davor brauchen sie noch.'),
    choice('Welcher Prozess bleibt nach dem Start als Elternprozess des Containers?', ['runc', 'containerd-shim', 'docker'], 1, 'runc endet nach dem Start. Der shim hält den Container und seine Ein- und Ausgaben.'),
    choice('Warum laufen Docker-Images auch unter Podman oder containerd?', ['Weil alle denselben Quellcode verwenden', 'Weil Image-Format und Runtime durch OCI-Standards festgelegt sind', 'Weil Images in Wirklichkeit VMs sind'], 1, 'Die OCI-Standards trennen das Format von den Werkzeugen.'),
  ],
}
export default quiz
