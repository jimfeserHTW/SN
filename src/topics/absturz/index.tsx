import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Oom, NoStart, NotReady, DiskFull, Stop, Codes, Traps, Unhealthy } from './views.tsx'

// How to break Docker: the last topic. Each slide is one way a container dies: preconditions, likely exit code, prevention.
const topic: Topic = {
  id: 'absturz',
  title: e('Wie man Docker kaputt macht', 'How to break Docker'),
  blurb: e('Wie ein Container stirbt: welche Voraussetzungen zu welchem Absturz und Exit-Code führen, und wie man es verhindert.', 'How a container dies: which preconditions lead to which crash and exit code, and how to prevent it.'),
  strands: [{
    id: 'main',
    chapters: [{
      id: 'sterben', title: e('Wie ein Container stirbt', 'How a container dies'),
      blurb: e('OOM-Kill, Start-Fehler, Zeilenenden und CPU-Architektur, eine nicht bereite Datenbank, volle Platte, harter Stopp, unhealthy und die Exit-Codes dazu.', 'OOM kill, start errors, line endings and CPU architecture, a database that is not ready, a full disk, a hard stop, unhealthy and their exit codes.'),
      pages: [
        { id: 'speicher', title: e('Speicher', 'Memory'), summary: e('Der OOM-Kill: zu klein zum Starten oder langsam vollgelaufen.', 'The OOM kill: too small to start or slowly filled up.'), slides: [
          { title: e('Speicher voll: der OOM-Kill', 'Memory full: the OOM kill'), view: <Oom /> },
        ] },
        { id: 'start', title: e('Start', 'Start'), summary: e('Der Container startet nie, oder die App gibt sofort auf.', 'The container never starts, or the app gives up at once.'), slides: [
          { title: e('Startet gar nicht: 125, 126, 127', 'Never starts: 125, 126, 127'), view: <NoStart /> },
          { title: e('Startet nicht, obwohl die Datei da ist', 'Does not start although the file is there'), view: <Traps /> },
          { title: e('Datenbank noch nicht bereit', 'Database not ready yet'), view: <NotReady /> },
        ] },
        { id: 'betrieb', title: e('Betrieb und Stopp', 'Running and stopping'), summary: e('Volle Platte und ein Stopp, auf den die App nicht hört.', 'A full disk and a stop the app does not listen to.'), slides: [
          { title: e('Platte voll: Logs und Reste wachsen mit', 'Disk full: logs and leftovers keep growing'), view: <DiskFull /> },
          { title: e('docker stop endet mit 137', 'docker stop ends with 137'), view: <Stop /> },
          { title: e('unhealthy ist kein Absturz', 'unhealthy is not a crash'), view: <Unhealthy /> },
        ] },
        { id: 'codes', title: e('Exit-Codes', 'Exit codes'), summary: e('Welcher Bereich wofür steht und wo man nachsieht.', 'Which range stands for what and where to look.'), slides: [
          { title: e('Exit-Codes einordnen', 'Placing exit codes'), view: <Codes /> },
        ] },
      ],
    }],
  }],
}
export default topic
