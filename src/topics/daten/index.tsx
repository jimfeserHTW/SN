import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Volumes, Mounts, VolumeInit, Cleanup } from './diagrams.tsx'
import { Inside, Hold, PassThrough, Scratch, Which } from './views.tsx'
import { TechMap } from '../../components/harbor/techmap.tsx'
import { Backup, Owners } from './tech.tsx'

// Daten und Speicher: what a container loses and what it keeps. Volumes live on the same machine ("on board").
const topic: Topic = {
  id: 'daten',
  title: e('Daten und Speicher', 'Data and storage'),
  blurb: e('Was beim Löschen eines Containers verloren geht, was bleibt und wo es liegt.', 'What is lost when a container is deleted, what stays and where it lives.'),
  strands: [{
    id: 'main',
    chapters: [
      {
        id: 'bleibt-geht', title: e('Was bleibt, was geht', 'What stays, what goes'),
        blurb: e('Was ein Container mitnimmt, wenn er geht, und die drei Orte, an denen Daten sicher sind oder bewusst flüchtig.', 'What a container takes along when it goes, and the three places where data is safe or deliberately short-lived.'),
        pages: [
          { id: 'problem', title: e('Das Problem', 'The problem'), summary: e('Was im Container liegt, ist mit ihm weg.', 'What lies in the container is gone with it.'), slides: [
            { title: e('Was im Container liegt, ist mit ihm weg', 'What is in the container is gone with it'), view: <Inside /> },
          ] },
          { id: 'orte', title: e('Drei Orte für Daten', 'Three places for data'), summary: e('Volume, Bind Mount und tmpfs.', 'Volume, bind mount and tmpfs.'), slides: [
            { title: e('Volume: Daten bleiben', 'Volume: data stays'), view: <Hold /> },
            { title: e('Bind Mount: dein Ordner im Container', 'Bind mount: your folder in the container'), view: <PassThrough /> },
            { title: e('tmpfs: nur im Arbeitsspeicher', 'tmpfs: only in memory'), view: <Scratch /> },
          ] },
          { id: 'wahl', title: e('Die richtige Wahl', 'The right choice'), summary: e('Welcher Ort wofür, und das Bild bis hierher.', 'Which place for what, and the picture so far.'), slides: [
            { title: e('Welcher Speicher wofür', 'Which storage for what'), view: <Which /> },
            { title: e('Systemkarte: Volumes', 'System map: volumes'), view: <TechMap known={['container', 'images', 'registry', 'client', 'daemon', 'port', 'compose', 'net']} focus={['volumes']} /> },
          ] },
        ],
      },
      {
        id: 'volumes', title: e('Volumes und Mounts im Einsatz', 'Volumes and mounts in practice'),
        blurb: e('Volumes, Bind Mounts und tmpfs, was beim Mounten passiert und was welcher Befehl löscht.', 'Volumes, bind mounts and tmpfs, what happens on mount and what each command deletes.'),
        pages: [
          { id: 'orte', title: e('Wo Daten liegen', 'Where data lives'), summary: e('Volumes und die vier Speicherorte eines Containers.', 'Volumes and the four storage locations of a container.'), slides: [
            { title: 'Volumes: Daten überleben den Container', view: <Volumes /> },
            { title: 'Vier Speicherorte, ein Dateisystem', view: <Mounts /> },
          ] },
          { id: 'lebensdauer', title: e('Wie lange Daten leben', 'How long data lives'), summary: e('Was beim Mounten passiert und was beim Aufräumen bleibt.', 'What happens on mount and what stays after cleanup.'), slides: [
            { title: 'Was mit den Dateien im Image passiert', view: <VolumeInit /> },
            { title: 'Was welcher Befehl löscht', view: <Cleanup /> },
            { title: e('Sichern und umziehen', 'Backing up and moving'), view: <Backup /> },
            { title: e('Rechte und Besitzer', 'Permissions and owners'), view: <Owners /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'overlay', 'layers']} focus={['volumes']} /> },
            ] },
        ],
      },
    ],
  }],
}
export default topic
