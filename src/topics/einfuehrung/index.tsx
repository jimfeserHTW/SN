import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Project, Loose, Standard, Packed, Harbour, ClassObject, JarVsContainer, Commands as DockerCommands } from './docker.tsx'
import { Grows, ByHand, LoadingPlan, Team, Phone, Order, OneShip, Commands as ComposeCommands } from './compose.tsx'
import { Published } from '../netzwerk/views.tsx'

// Einführung in Docker und Docker Compose: one deck in two parts, for students who know Spring Boot and Vue but not Docker.
// Each part opens with the learning path (`part`), so the reader sees when the Compose part starts. One commands slide per part.
const topic: Topic = {
  id: 'einfuehrung',
  title: e('Einführung in Docker und Docker Compose', 'Introduction to Docker and Docker Compose'),
  blurb: e('Warum es Docker gibt, wie es grob funktioniert, und wie Docker Compose mehrere Container mit einer Datei startet.', 'Why Docker exists, roughly how it works, and how Docker Compose starts several containers with one file.'),
  strands: [{
    id: 'main',
    chapters: [{
      id: 'start', title: e('Was ist Docker und Docker Compose?', 'What are Docker and Docker Compose?'),
      blurb: e('Das Problem „Bei mir läuft’s“, die Idee hinter Containern und der Vergleich mit java -jar, Podman und VM. Dann drei Container mit einer compose.yaml: wie sie einander finden, wer zuerst startet und wofür Compose gedacht ist.', 'The “works on my machine” problem, the idea behind containers and the comparison with java -jar, Podman and VM. Then three containers with one compose.yaml: how they find each other, who starts first and what Compose is meant for.'),
      pages: [
        { id: 'problem', part: e('Was ist Docker?', 'What is Docker?'), title: e('Das Problem', 'The problem'), summary: e('Ein Projekt, vier Rechner, und die App läuft nur bei einem.', 'One project, four machines, and the app only runs on one.'), slides: [
          { title: e('Euer Projekt: die Mensa‑App', 'Your project: the Mensa‑App'), view: <Project /> },
          { title: e('„Bei mir läuft’s“', '“Works on my machine”'), view: <Loose /> },
        ] },
        { id: 'idee', title: e('Die Idee', 'The idea'), summary: e('App und Umgebung als ein Paket, was hineinkommt und wer es nutzt.', 'App and environment as one package, what goes inside and who uses it.'), slides: [
          { title: e('Die Idee: App samt Umgebung ausliefern', 'The idea: ship the app with its environment'), view: <Standard /> },
          { title: e('Was in den Container kommt', 'What goes into the container'), view: <Packed /> },
          { title: e('Wer Docker nutzt', 'Who uses Docker'), view: <Harbour /> },
        ] },
        { id: 'wie', title: e('Wie es grob funktioniert', 'How it roughly works'), summary: e('Image und Container, der Vergleich mit java -jar, Podman und VM, und die Befehle.', 'Image and container, the comparison with java -jar, Podman and VM, and the commands.'), slides: [
          { title: e('Image und Container: wie Klasse und Objekt', 'Image and container: like class and object'), view: <ClassObject /> },
          { title: e('java -jar, Docker, Podman oder VM?', 'java -jar, Docker, Podman or VM?'), view: <JarVsContainer /> },
          { title: e('Die Befehle', 'The commands'), view: <DockerCommands /> },
        ] },
        { id: 'compose-problem', part: e('Was ist Docker Compose?', 'What is Docker Compose?'), title: e('Mehrere Container', 'Several containers'), summary: e('Die Mensa-App braucht drei Container, und von Hand geht das schief.', 'The Mensa-App needs three containers, and by hand that goes wrong.'), slides: [
          { title: e('Die Mensa‑App wächst', 'The Mensa‑App grows'), view: <Grows /> },
          { title: e('Drei Container von Hand', 'Three containers by hand'), view: <ByHand /> },
        ] },
        { id: 'compose-idee', title: e('Eine Datei für alles', 'One file for everything'), summary: e('Eine Datei für das ganze Team, und wie die Container zusammenfinden.', 'One file for the whole team, and how the containers find each other.'), slides: [
          { title: e('compose.yaml: eine Datei für alles', 'compose.yaml: one file for everything'), view: <LoadingPlan /> },
          { title: e('Eine Datei für das ganze Team', 'One file for the whole team'), view: <Team /> },
          { title: e('Namen statt Ports', 'Names instead of ports'), view: <Phone /> },
          { title: e('Ports: nur ein Weg von außen hinein', 'Ports: only one way in from outside'), view: <Published /> },
          { title: e('Gestartet ist nicht bereit', 'Started is not ready'), view: <Order /> },
        ] },
        { id: 'einordnung', title: e('Einordnung und Befehle', 'Where it fits and commands'), summary: e('Ein Rechner ja, ein Cluster nein, und die Befehle.', 'One machine yes, a cluster no, and the commands.'), slides: [
          { title: e('Ein Rechner, kein Cluster', 'One machine, not a cluster'), view: <OneShip /> },
          { title: e('Die Befehle von Compose', 'The Compose commands'), view: <ComposeCommands /> },
        ] },
      ],
    }],
  }],
}
export default topic
