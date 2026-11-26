import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { WorksForMe, Recipe, BuildRun, Inside, JarVsContainer, Commands as DockerCommands } from './docker.tsx'
import { ComposeFile, Network, Order, Volumes, Commands as ComposeCommands } from './compose.tsx'
import { Route, Roles, Effort, Evolution, Manual, Anatomy, Fit, Chat, RunFlow, ImageOrContainer, Estimate, Summary, Familiar } from './talk.tsx'
import { Stepper } from '../../components/Steps.tsx'

// Einführung in Docker und Docker Compose: 17 slides, Docker first, then Compose.
// One topic per slide; anything that unfolds (timeline, compose keys) is a step inside the slide.
// Each part opens with the learning path (`part`), so the reader sees when the Compose part starts. One commands slide per part.
const topic: Topic = {
  id: 'einfuehrung',
  title: e('Einführung in Docker und Docker Compose', 'Introduction to Docker and Docker Compose'),
  blurb: e('Warum es Docker gibt, wie es grob funktioniert, und wie Docker Compose mehrere Container mit einer Datei startet.', 'Why Docker exists, roughly how it works, and how Docker Compose starts several containers with one file.'),
  strands: [{
    id: 'main',
    chapters: [{
      id: 'start', title: e('Was ist Docker und Docker Compose?', 'What are Docker and Docker Compose?'),
      blurb: e('Das Problem „Bei mir läuft’s“, Dockerfile, Image und Container, was ein Container ist, woher Images kommen und was beim Start dazukommt. Dann drei Container mit einer compose.yaml: wie sie einander finden, wer zuerst startet, wo Daten bleiben und wofür Compose gedacht ist.', 'The “works on my machine” problem, Dockerfile, image and container, what a container is, where images come from and what gets added at start. Then three containers with one compose.yaml: how they find each other, who starts first, where data stays and what Compose is meant for.'),
      pages: [
        { id: 'problem', part: e('Was ist Docker?', 'What is Docker?'), title: e('Warum Docker?', 'Why Docker?'), summary: e('Wer Docker nutzt, warum, und was ohne Docker alles zu pflegen ist.', 'Who uses Docker, why, and what there is to look after without it.'), slides: [
          { title: e('Agenda', 'Agenda'), view: <Route /> },
          { title: e('23:41 Uhr, Abgabe um Mitternacht', '11:41 pm, hand-in at midnight'), view: (
            <Chat step={9} head={e('Gruppenprojekt Mensa-App · Gruppenchat', 'Mensa-App group project · group chat')} msgs={[
              ['Lena', e('Die App ist fertig, ich hab sie gepusht!', 'The app is done, I pushed it!')],
              ['Tim', e('Bei mir startet sie nicht. Nur Fehlermeldungen.', 'It does not start for me. Only error messages.'), true],
              ['Lena', e('Komisch. Bei mir läuft alles.', 'Strange. Everything runs for me.')],
            ]} tail={<Familiar />} />
          ) },
          { title: e('Ohne Docker, mit Docker', 'Without Docker, with Docker'), view: <Stepper scenes={[
            { label: e('Ohne Docker', 'Without Docker'), view: <div className="dg-col"><Effort /><WorksForMe /></div> },
            { label: e('Mit Docker', 'With Docker'), view: <div className="dg-col"><Effort docker /><Recipe /></div> },
          ]} /> },
          { title: e('Wer Docker nutzt und warum', 'Who uses Docker and why'), view: <Stepper labels={[e('Entwicklung', 'Development'), e('Tests und CI', 'Tests and CI'), e('Betrieb', 'Operations'), e('Lehre und Abgabe', 'Teaching and hand-in')]} render={s => <Roles focus={s} />} /> },
          { title: e('Wie es zu Containern kam', 'How containers came about'), view: <Stepper labels={[e('1990er', '1990s'), e('2000er', '2000s'), '2013', '2014', e('Alle vier', 'All four')]} render={s => <Evolution step={s} />} /> },
        ] },
        { id: 'idee', title: e('Image', 'image'), summary: e('Wie aus dem Dockerfile ein Image wird und woher fertige Images kommen.', 'How the Dockerfile becomes an image and where ready images come from.'), slides: [
          { title: e('Dockerfile, Image, Container', 'Dockerfile, image, container'), view: <BuildRun /> },
          { title: e('Was passiert bei docker run?', 'What happens at docker run?'), view: <Stepper labels={['Client', 'Registry', 'Container']} render={s => <RunFlow step={s} />} /> },
        ] },
        { id: 'wie', title: e('Container', 'Container'), summary: e('Was einen Container abschottet, wie er sich von java -jar, Podman und VM unterscheidet, und die Befehle.', 'What walls a container in, how it differs from java -jar, Podman and a VM, and the commands.'), slides: [
          { title: e('Was ist ein Container?', 'What is a container?'), view: <Inside /> },
          { title: e('java -jar, Docker, Podman oder VM?', 'java -jar, Docker, Podman or VM?'), view: <JarVsContainer /> },
          { title: e('Befehle und kurzer Check', 'Commands and a quick check'), view: <Stepper labels={[e('Befehle', 'Commands'), e('Image oder Container?', 'Image or container?')]} render={s => s === 0 ? <DockerCommands /> : <ImageOrContainer />} /> },
        ] },
        { id: 'compose-problem', part: e('Was ist Docker Compose?', 'What is Docker Compose?'), title: e('Mehrere Container', 'Several containers'), summary: e('Drei Befehle statt einem, was von Hand schiefgeht, und was in der compose.yaml steht.', 'Three commands instead of one, what goes wrong by hand, and what is in the compose.yaml.'), slides: [
          { title: e('Von vielen Befehlen zu einem', 'From many commands to one'), view: <Stepper labels={[e('Drei Befehle', 'Three commands'), e('Was schiefgeht', 'What goes wrong'), e('Ein Befehl', 'One command')]} render={s => <Manual step={s} />} /> },
          { title: e('Die compose.yaml', 'The compose.yaml'), view: <Stepper labels={[e('Für alle', 'For everyone'), 'services', 'ports', 'environment', 'depends_on', 'volumes']} render={s => s === 0 ? <ComposeFile /> : <Anatomy focus={s - 1} />} /> },
        ] },
        { id: 'compose-netz', title: e('Zusammenspiel', 'Working together'), summary: e('Wie Container sich über Service-Namen finden und welche Ports von außen erreichbar sind.', 'How containers find each other by service name and which ports can be reached from outside.'), slides: [
          { title: e('Netzwerke und Ports', 'Networks and ports'), view: <Network /> },
        ] },
        { id: 'compose-start', title: e('Start, Daten, Grenzen', 'Start, data, limits'), summary: e('Gestartet ist nicht bereit, Daten bleiben im Volume, die Befehle und wann Docker passt.', 'Started is not ready, data stays in the volume, the commands and when Docker fits.'), slides: [
          { title: e('Start, Daten, Befehle', 'Start, data, commands'), view: <Stepper scenes={[{ label: e('Gestartet ist nicht bereit', 'Started is not ready'), view: <Order /> }, { label: e('Daten im Volume', 'data in the volume'), view: <Volumes /> }, { label: e('Befehle', 'Commands'), view: <ComposeCommands /> }]} /> },
          { title: e('Einordnung', 'Where it fits'), view: <Stepper labels={[e('Schätzfrage', 'Estimate'), e('Wann Docker passt', 'When Docker fits'), e('Zurück im Chat', 'Back in the chat')]} render={s => s === 0 ? <Estimate /> : s === 1 ? <Fit /> : (
            <Chat step={9} head={e('Zurück im Gruppenchat', 'Back in the group chat')} msgs={[
              ['Tim', e('Bei mir startet sie immer noch nicht.', 'It still does not start for me.')],
              ['Lena', e('Zieh dir den neuen Stand und tipp: docker compose up', 'Pull the new state and type: docker compose up'), true],
              ['Tim', e('Läuft.', 'Runs.')],
            ]} tail={<Summary />} />
          )} /> },
        ] },
      ],
    }],
  }],
}
export default topic
