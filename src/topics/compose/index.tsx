import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Anatomy, Variables, Merge, StartOrder, Everyday, Pitfalls, UpFlow, ServiceMap, StartCommand, RestartGrid, Health, DependsGantt, VarWinner, Secrets, Profiles, Watch, DebugPath, Summary, Interp, MergeRules, Anchors, FileWays, ProjectLabels, Recreate, BigProject } from './diagrams.tsx'
import { ServiceCard, Waybills, Sources, TwoTrips, Envelope, OnDemand, Crew, Sticker, Compare, Restart, Logbook, LiveSync } from './views.tsx'
import { SpringEnv, Deploy, ConfigView } from './tech.tsx'

const known = ['container', 'images', 'registry', 'client', 'daemon', 'port', 'net', 'volumes', 'ns', 'cgroups'] as const
import { TechMap } from '../../components/harbor/techmap.tsx'

// Docker Compose in depth, in two parallel strands. Both only need the Compose introduction.
const topic: Topic = {
  id: 'compose',
  title: e('Docker Compose', 'Docker Compose'),
  blurb: e('Compose im Detail, in zwei Strängen: wie man ein Projekt beschreibt und wie man es betreibt.', 'Compose in depth, in two strands: how to describe a project and how to run it.'),
  strands: [
    {
      id: 'konfiguration', title: e('Konfiguration', 'Configuration'),
      chapters: [
        {
          id: 'ladeplan', title: e('Die compose.yaml im Detail', 'compose.yaml in detail'),
          blurb: e('Was ein Service beschreibt, woher Werte kommen, Override-Dateien für Laptop und Server, Secrets und Container bei Bedarf.', 'What a service describes, where values come from, override files for laptop and server, secrets and containers on demand.'),
          pages: [
            { id: 'service', title: e('Ein Service', 'One service'), summary: e('Die Zeilen eines Service und die Umgebungsvariablen.', 'The lines of a service and the environment variables.'), slides: [
              { title: e('Ein Service beschreibt einen Container', 'A service describes one container'), view: <ServiceCard /> },
              { title: e('Umgebungsvariablen: Einstellungen von außen', 'Environment variables: settings from outside'), view: <Waybills /> },
              { title: e('Woher die Werte kommen', 'Where the values come from'), view: <Sources /> },
            ] },
            { id: 'varianten', title: e('Varianten', 'Variants'), summary: e('Override-Dateien, Secrets und Profile.', 'Override files, secrets and profiles.'), slides: [
              { title: e('Eine compose.yaml, zwei Umgebungen', 'One compose.yaml, two environments'), view: <TwoTrips /> },
              { title: e('Secrets statt offener Passwörter', 'Secrets instead of open passwords'), view: <Envelope /> },
              { title: e('Container nur bei Bedarf', 'Containers only on demand'), view: <OnDemand /> },
              { title: e('Systemkarte: compose.yaml', 'System map: compose.yaml'), view: <TechMap known={[...known]} focus={['compose']} /> },
            ] },
          ],
        },
        {
          id: 'datei', title: 'Die Compose-Datei',
          blurb: e('Aufbau der Datei, woher Werte kommen und was jeder Schlüssel im Container bewirkt.', 'The structure of the file, where values come from and what each key does in the container.'),
          pages: [
            { id: 'datei', title: e('Die Datei', 'The file'), summary: e('Aufbau, Variablen und getrennte Konfiguration.', 'Structure, variables and separate configuration.'), slides: [
              { title: 'Die Compose-Datei', view: <Anatomy /> },
              { title: 'Variablen: woher sie kommen, wo sie landen', view: <Variables /> },
              { title: 'Konfiguration trennen', view: <Merge /> },
            ] },
            { id: 'service', title: 'Ein Service im Detail', summary: 'Was die Schlüssel eines Service im Container verändern.', slides: [
              { title: 'Vom Schlüssel zum Container', view: <ServiceMap /> },
              { title: 'Wie der Startbefehl entsteht', view: <StartCommand /> },
              { title: e('Spring Boot über Umgebungsvariablen', 'Spring Boot via environment variables'), view: <SpringEnv /> },
              { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'net', 'port', 'volumes']} focus={['compose']} /> },
            ] },
          ],
        },
        {
          id: 'werte', title: e('Werte, Geheimnisse, Profile', 'Values, secrets, profiles'),
          blurb: e('Welcher Wert gewinnt, alle Platzhalter, Passwörter als Secret und Services bei Bedarf.', 'Which value wins, every placeholder, passwords as secrets and services on demand.'),
          pages: [
            { id: 'werte', title: e('Werte', 'Values'), summary: e('Rangfolge und Platzhalter.', 'Precedence and placeholders.'), slides: [
              { title: 'Welcher Wert gewinnt?', view: <VarWinner /> },
              { title: 'Platzhalter-Schreibweisen', view: <Interp /> },
            ] },
            { id: 'geheim', title: e('Geheimnisse und Profile', 'Secrets and profiles'), summary: e('Passwörter sicher übergeben, Services nur bei Bedarf.', 'Passing passwords safely, services only on demand.'), slides: [
              { title: 'Passwörter: Variable oder Secret?', view: <Secrets /> },
              { title: 'Profile: Services bei Bedarf', view: <Profiles /> },
              { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'net', 'port', 'volumes']} focus={['compose']} /> },
            ] },
          ],
        },
        {
          id: 'gross', title: e('Große Projekte konfigurieren', 'Configuring large projects'),
          blurb: e('Mehrere Dateien zusammenführen, Wiederholung vermeiden und ein Produktionsprojekt im Ganzen.', 'Merging several files, avoiding repetition and a production project as a whole.'),
          pages: [
            { id: 'dateien', title: 'Große Projekte strukturieren', summary: 'Wiederverwendung und mehrere Dateien.', slides: [
              { title: 'Regeln beim Zusammenführen', view: <MergeRules /> },
              { title: 'Wiederholung vermeiden mit Ankern', view: <Anchors /> },
              { title: 'Drei Wege, Dateien zu verbinden', view: <FileWays /> },
            ] },
            { id: 'gesamt', title: 'Alles zusammen', summary: 'Ein Produktionsprojekt mit allen Techniken.', slides: [
              { title: 'Ein großes Projekt auf einen Blick', view: <BigProject /> },
            ] },
          ],
        },
      ],
    },
    {
      id: 'betrieb', title: e('Betrieb', 'Operations'),
      chapters: [
        {
          id: 'mannschaft', title: e('Compose bei der Arbeit', 'Compose at work'),
          blurb: e('Wie Compose die compose.yaml abarbeitet, seine Container erkennt, Soll und Ist vergleicht, Ausfälle behandelt, Logs sammelt und Änderungen nachreicht.', 'How Compose works through compose.yaml, recognises its containers, compares desired and actual state, handles breakdowns, collects logs and passes on changes.'),
          pages: [
            { id: 'plan', title: e('Abarbeiten', 'Working through'), summary: e('Abarbeiten, erkennen, vergleichen.', 'Working through, recognising, comparing.'), slides: [
              { title: e('Ein Befehl statt vieler', 'One command instead of many'), view: <Crew /> },
              { title: e('Der Projektname als Label', 'The project name as a label'), view: <Sticker /> },
              { title: e('Soll und Ist vergleichen', 'Comparing desired and actual state'), view: <Compare /> },
            ] },
            { id: 'alltag', title: e('Im Alltag', 'Day to day'), summary: e('Ausfälle, die Logs und Änderungen beim Entwickeln.', 'Breakdowns, the logs and changes while developing.'), slides: [
              { title: e('Wenn ein Container ausfällt', 'When a container breaks down'), view: <Restart /> },
              { title: e('In die Logs schauen', 'Looking at the logs'), view: <Logbook /> },
              { title: e('Änderungen sofort im Container', 'Changes in the container at once'), view: <LiveSync /> },
              { title: e('Systemkarte: Compose und Daemon', 'System map: Compose and the daemon'), view: <TechMap known={[...known]} focus={['compose', 'daemon']} /> },
            ] },
          ],
        },
        {
          id: 'arbeiten', title: 'Arbeiten mit Compose',
          blurb: e('Die Befehle im Alltag, was up tut, wann ein Service bereit ist und typische Stolpersteine.', 'The everyday commands, what up does, when a service is ready and typical pitfalls.'),
          pages: [
            { id: 'alltag', title: e('Der Alltag', 'Everyday work'), summary: e('Die Befehle und was hinter up steckt.', 'The commands and what is behind up.'), slides: [
              { title: 'Der Alltag mit Compose', view: <Everyday /> },
              { title: 'Was bei docker compose up passiert', view: <UpFlow /> },
            ] },
            { id: 'start', title: 'Start und Reihenfolge', summary: 'Wann ein Service bereit ist und wer auf wen wartet.', slides: [
              { title: 'Startreihenfolge: gestartet ist nicht bereit', view: <StartOrder /> },
              { title: 'Healthcheck: Wann ist ein Service bereit?', view: <Health /> },
              { title: 'Wer wartet auf wen?', view: <DependsGantt /> },
              { title: 'Typische Stolpersteine', view: <Pitfalls /> },
              { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'container', 'images', 'registry', 'net', 'port', 'volumes']} focus={['compose', 'daemon']} /> },
            ] },
          ],
        },
        {
          id: 'betreiben', title: e('Betreiben und Fehler finden', 'Running and troubleshooting'),
          blurb: e('Neustart-Regeln, Entwickeln mit Watch, Fehler systematisch finden und das ganze Projekt.', 'Restart policies, developing with watch, finding errors systematically and the whole project.'),
          pages: [
            { id: 'betrieb', title: 'Arbeiten mit Compose', summary: 'Entwickeln, Fehler finden und der Gesamtblick.', slides: [
              { title: 'Neustart-Regeln im Vergleich', view: <RestartGrid /> },
              { title: 'Entwickeln mit Compose Watch', view: <Watch /> },
              { title: 'Fehler systematisch finden', view: <DebugPath /> },
              { title: e('Vom Laptop auf den Server', 'From laptop to server'), view: <Deploy /> },
              { title: 'Das ganze Projekt auf einen Blick', view: <Summary /> },
            ] },
          ],
        },
        {
          id: 'intern', title: 'Wie Compose intern arbeitet',
          blurb: 'Etiketten als Gedächtnis und der Vergleich von Soll und Ist.',
          pages: [
            { id: 'interna', title: 'Wie Compose intern arbeitet', summary: 'Etiketten als Gedächtnis und der Vergleich von Soll und Ist.', slides: [
              { title: 'Woran Compose sein Projekt erkennt', view: <ProjectLabels /> },
              { title: 'Wann up einen Container ersetzt', view: <Recreate /> },
              { title: e('docker compose config: was Compose wirklich liest', 'docker compose config: what Compose really reads'), view: <ConfigView /> },
              { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'net', 'port', 'volumes', 'compose']} focus={['layers']} /> },
            ] },
          ],
        },
      ],
    },
  ],
}
export default topic
