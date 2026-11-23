import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Architecture, ImageContainer, Lifecycle, Levels, Limits, VmVsContainer, OwnOs, Where, Platforms, SystemMap, ApiCall, RunChain, AfterStart, Standards } from './diagrams.tsx'
import { CargoShip, BridgeCrew, Intercom, EngineRoom, NoVm, OtherWaters, Life } from './views.tsx'
import { LookInside, RunSteps } from './tech.tsx'
import { TechMap } from '../../components/harbor/techmap.tsx'

// Architektur: who does what. From the overview (client, daemon, kernel) down to dockerd, containerd and runc.
const topic: Topic = {
  id: 'architektur',
  title: e('Architektur', 'Architecture'),
  blurb: e('Wer bei Docker was tut: vom Befehl über den Daemon bis zum Kernel.', 'Who does what in Docker: from the command through the daemon down to the kernel.'),
  strands: [{
    id: 'main',
    chapters: [
      {
        id: 'an-bord', title: e('Wer was tut', 'Who does what'),
        blurb: e('Rechner, Client, Daemon und Kernel: die Teile von Docker im Überblick, und wie sie zusammenspielen.', 'Machine, client, daemon and kernel: the parts of Docker at a glance, and how they work together.'),
        pages: [
          { id: 'teile', title: e('Die Teile', 'The parts'), summary: e('Rechner, Client, API und Daemon.', 'Machine, client, API and daemon.'), slides: [
            { title: e('Ein Rechner mit Docker', 'A machine with Docker'), view: <CargoShip /> },
            { title: e('Client und Daemon', 'Client and daemon'), view: <BridgeCrew /> },
            { title: e('Die Docker-API', 'The Docker API'), view: <Intercom /> },
          ] },
          { id: 'maschine', title: e('Der Kernel', 'The kernel'), summary: e('Ein Kernel für alle Container, auf jedem Betriebssystem.', 'One kernel for all containers, on every operating system.'), slides: [
            { title: e('Ein Kernel für alle', 'One kernel for all'), view: <EngineRoom /> },
            { title: e('Kein Server, keine VM', 'Not a server, not a VM'), view: <NoVm /> },
            { title: e('Linux, macOS, Windows', 'Linux, macOS, Windows'), view: <OtherWaters /> },
          ] },
          { id: 'zusammen', title: e('Zusammenspiel', 'Working together'), summary: e('Das Leben eines Containers und das Bild bis hierher.', 'The life of a container and the picture so far.'), slides: [
            { title: e('Das Leben eines Containers', 'The life of a container'), view: <Life /> },
            { title: e('Systemkarte: wer was tut', 'System map: who does what'), view: <TechMap known={['container', 'images', 'registry', 'port', 'compose', 'net']} focus={['client', 'daemon']} /> },
          ] },
        ],
      },
      {
        id: 'bausteine', title: e('Die Bausteine von Docker', 'The building blocks of Docker'),
        blurb: e('Client, Daemon und Registry, Image und Container, der Lebenszyklus und der Aufbau eines Befehls.', 'Client, daemon and registry, image and container, the lifecycle and the anatomy of a command.'),
        pages: [
          { id: 'begriffe', title: 'Architektur und Begriffe', summary: 'Client, Daemon und Registry, Image und Container, Lebenszyklus, Aufbau eines Befehls.', slides: [
            { title: 'Die Architektur auf einen Blick', view: <Architecture /> },
            { title: 'Image, Container, Registry', view: <ImageContainer /> },
            { title: 'Lebenszyklus eines Containers', view: <Lifecycle /> },
            {
              title: 'Aufbau eines Docker-Befehls',
              visual: { kind: 'anatomy', rows: [
                [
                  { text: 'docker', label: 'Programm' }, { text: 'container', label: 'Objekt: worum es geht' }, { text: 'run', label: 'Aktion: was passiert' },
                  { text: '-d', label: 'Option: im Hintergrund' }, { text: '-p 8080:80', label: 'Option mit Wert: Port' }, { text: 'nginx:1.27', label: 'Argument: welches Image' },
                ],
                [{ text: 'docker', label: 'Programm' }, { text: 'ps', label: 'Kurzform: container ls' }, { text: '-a', label: 'Option: auch gestoppte' }],
              ] },
            },
            { title: e('In einen laufenden Container schauen', 'Looking into a running container'), view: <LookInside /> },
            { title: e('Was bei docker run passiert, in fünf Schritten', 'What happens on docker run, in five steps'), view: <RunSteps /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['container', 'images']} focus={['client', 'daemon', 'registry']} /> },
            ] },
        ],
      },
      {
        id: 'betriebssystem', title: e('Docker im Betriebssystem', 'Docker in the operating system'),
        blurb: e('Wo Docker zwischen Hardware und App sitzt, warum Container keinen eigenen Kernel haben und wie ein Befehl beim Daemon ankommt.', 'Where Docker sits between hardware and app, why containers have no kernel of their own and how a command reaches the daemon.'),
        pages: [
          { id: 'einordnung', title: e('Container und VMs', 'Containers and VMs'), summary: e('Die Ebenen der Virtualisierung und was ein Container mitbringt.', 'The levels of virtualization and what a container brings along.'), slides: [
            { title: 'Virtualisierung in drei Ebenen', view: <Levels /> },
            { title: 'VM gegen Container', view: <VmVsContainer /> },
            { title: 'Hat ein Container ein eigenes Betriebssystem?', view: <OwnOs /> },
          ] },
          { id: 'stack', title: e('Docker im Stack', 'Docker in the stack'), summary: e('Wo Docker liegt, auf jedem Betriebssystem, und wo seine Grenzen sind.', 'Where Docker sits, on every operating system, and where its limits are.'), slides: [
            { title: 'Wo Docker im Stack sitzt', view: <Where /> },
            { title: 'Docker auf Linux, macOS und Windows', view: <Platforms /> },
            { title: 'Grenzen und Abgrenzung', view: <Limits /> },
          ] },
          { id: 'teile', title: e('Die Teile im Zusammenspiel', 'The parts working together'), summary: e('Wie ein Befehl ankommt und alle Teile auf einem Rechner.', 'How a command arrives, and all parts on one machine.'), slides: [
            { title: 'Wie ein Befehl beim Daemon ankommt', view: <ApiCall /> },
            { title: 'Ein Rechner, alle Teile von Docker', view: <SystemMap /> },
          ] },
        ],
      },
      {
        id: 'kern', title: e('Docker im Kern', 'Docker at its core'),
        blurb: e('Von dockerd über containerd und runc bis zum Prozess, und die offenen Standards dahinter.', 'From dockerd through containerd and runc down to the process, and the open standards behind it.'),
        pages: [
          { id: 'start', title: 'Der Start im Detail', summary: 'Von dockerd bis zum Prozess, und die Standards dahinter.', slides: [
            { title: 'Von dockerd bis zum laufenden Prozess', view: <RunChain /> },
            { title: 'Was nach dem Start noch läuft', view: <AfterStart /> },
          ] },
          { id: 'standards', title: e('Standards und Alternativen', 'Standards and alternatives'), summary: e('Was Docker mit Podman, containerd und LXC gemeinsam hat.', 'What Docker has in common with Podman, containerd and LXC.'), slides: [
            { title: 'Andere Werkzeuge, gleiche Standards', view: <Standards /> },
            {
              title: 'Docker im Vergleich zu Alternativen',
              visual: { kind: 'matrix', legend: 'Je voller der Kreis, desto besser: stärker isoliert, sparsamer, schneller, größeres Ökosystem. Grobe Einordnung.', head: ['Option', 'Architektur', 'Isolation', 'Sparsam', 'Schnellstart', 'Einsatz', 'Ökosystem'], rows: [
                ['Docker', 'Zentraler Daemon (dockerd), läuft meist als root', '2', '3', '4', 'Standard für Entwicklung', '4'],
                ['Podman', 'Kein Daemon, rootless möglich', '3', '3', '4', 'Weitgehend Docker-kompatibel', '3'],
                ['containerd / CRI-O', 'Schlanker Daemon ohne Entwickler-Oberfläche', '2', '4', '4', 'Unter anderen Tools, containerd auch unter Docker', '2'],
                ['LXC / LXD', 'System-Container, LXD als Daemon', '3', '3', '3', 'Ganzes Linux-System wie eine leichte VM', '2'],
                ['Virtuelle Maschinen', 'Hypervisor, eigener Kernel je VM', '4', '1', '1', 'Volle Isolation, beliebiges Betriebssystem', '4'],
              ] },
            },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'ns', 'cgroups', 'overlay', 'net']} focus={['runtime']} /> },
            ] },
        ],
      },
    ],
  }],
}
export default topic
