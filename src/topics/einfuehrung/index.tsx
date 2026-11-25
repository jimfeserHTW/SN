import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { WorksForMe, Recipe, BuildRun, JarVsContainer, RunOptions, Commands as DockerCommands } from './docker.tsx'
import { ComposeFile, DbNotLocalhost, HostPorts, ApiProxy, Order, Volumes, Commands as ComposeCommands } from './compose.tsx'
import { Route, Roles, Effort, Evolution, Ask, Walls, Manual, Quiz, Anatomy, Fit, Chat, RunFlow, ImageOrContainer, Estimate, Summary, Familiar, type Option } from './talk.tsx'
import { Stepper } from '../../components/Steps.tsx'

// Einführung in Docker und Docker Compose: at most 20 slides, Docker first, Compose with 8 of them.
// One topic per slide; anything that unfolds (timeline, quiz answers, compose keys) is a step inside the slide.
/** One quiz slide: per question two steps (question, answer). The question stays put when its answer lights up. */
const quiz = (qs: [string, Option[], number, string][]) => (
  <Stepper labels={qs.map((_, k) => e(`Frage ${k + 1}`, `Question ${k + 1}`))} render={s => {
    const [question, options, pick, why] = qs[s]
    return <Quiz key={s} n={s + 1} of={qs.length} question={question} options={options} pick={pick} why={why} />
  }} />
)
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
          { title: e('23:41 Uhr, Abgabe um Mitternacht', '11:41 pm, hand-in at midnight'), view: (
            <Chat step={9} head={e('Gruppenprojekt Mensa-App · Gruppenchat', 'Mensa-App group project · group chat')} msgs={[
              ['Lena', e('Die App ist fertig, ich hab sie gepusht!', 'The app is done, I pushed it!')],
              ['Tim', e('Bei mir startet sie nicht. Nur Fehlermeldungen.', 'It does not start for me. Only error messages.'), true],
              ['Lena', e('Komisch. Bei mir läuft alles.', 'Strange. Everything runs for me.')],
            ]} tail={<Familiar />} />
          ) },
          { title: e('Agenda', 'Agenda'), view: <Route /> },
          { title: e('Wer Docker nutzt und warum', 'Who uses Docker and why'), view: <Stepper labels={[e('Entwicklung', 'Development'), e('Tests und CI', 'Tests and CI'), e('Betrieb', 'Operations'), e('Lehre und Abgabe', 'Teaching and hand-in')]} render={s => <Roles focus={s} />} /> },
          { title: e('Ohne Docker, mit Docker', 'Without Docker, with Docker'), view: <Stepper scenes={[
            { label: e('Ohne Docker', 'Without Docker'), view: <div className="dg-col"><Effort /><WorksForMe /></div> },
            { label: e('Mit Docker', 'With Docker'), view: <div className="dg-col"><Effort docker /><Recipe /></div> },
          ]} /> },
          { title: e('Wie es zu Containern kam', 'How containers came about'), view: <Stepper labels={[e('1990er', '1990s'), e('2000er', '2000s'), '2013', '2014', e('Alle vier', 'All four')]} render={s => <Evolution step={s} />} /> },
        ] },
        { id: 'idee', title: e('Image', 'image'), summary: e('Wie aus dem Dockerfile ein Image wird und woher fertige Images kommen.', 'How the Dockerfile becomes an image and where ready images come from.'), slides: [
          { title: e('Dockerfile, Image, Container', 'Dockerfile, image, container'), view: <BuildRun /> },
          { title: e('Was passiert bei docker run?', 'What happens at docker run?'), view: <Stepper labels={['Client', 'Registry', 'Container']} render={s => <RunFlow step={s} />} /> },
        ] },
        { id: 'wie', title: e('Container', 'Container'), summary: e('Was einen Container abschottet, wie er sich von java -jar, Podman und VM unterscheidet, was beim Start dazukommt, und die Befehle.', 'What walls a container in, how it differs from java -jar, Podman and a VM, what gets added at start, and the commands.'), slides: [
          { title: e('Was ein Container ist', 'What a container is'), view: <Stepper labels={[e('Frage', 'Question'), e('Nur ein Prozess', 'Just a process'), 'Namespaces', 'cgroups', e('Dateien aus dem Image', 'Files from the image')]} render={s => s === 0
            ? <Ask cmd="docker run mensa-backend" lines={[e('Läuft da jetzt ein', 'Is a small computer'), e('eigener kleiner Computer?', 'of its own running now?')]} />
            : <Walls step={s - 1} />} /> },
          { title: e('java -jar, Docker, Podman oder VM?', 'java -jar, Docker, Podman or VM?'), view: <JarVsContainer /> },
          { title: e('Beim Start angehängt', 'Attached at start'), view: <RunOptions /> },
          { title: e('Befehle und kurzer Check', 'Commands and a quick check'), view: <Stepper labels={[e('Befehle', 'Commands'), e('Image oder Container?', 'Image or container?')]} render={s => s === 0 ? <DockerCommands /> : <ImageOrContainer />} /> },
        ] },
        { id: 'compose-problem', part: e('Was ist Docker Compose?', 'What is Docker Compose?'), title: e('Mehrere Container', 'Several containers'), summary: e('Drei Befehle statt einem, was von Hand schiefgeht, und was in der compose.yaml steht.', 'Three commands instead of one, what goes wrong by hand, and what is in the compose.yaml.'), slides: [
          { title: e('Von vielen Befehlen zu einem', 'From many commands to one'), view: <Stepper labels={[e('Drei Befehle', 'Three commands'), e('Was schiefgeht', 'What goes wrong'), e('Ein Befehl', 'One command')]} render={s => <Manual step={s} />} /> },
          { title: e('Die compose.yaml', 'The compose.yaml'), view: <Stepper labels={[e('Für alle', 'For everyone'), 'services', 'ports', 'environment', 'depends_on', 'volumes']} render={s => s === 0 ? <ComposeFile /> : <Anatomy focus={s - 1} />} /> },
        ] },
        { id: 'compose-netz', title: e('Zusammenspiel', 'Working together'), summary: e('Service-Namen statt localhost, Host- und Container-Ports, und wie Vue das Backend erreicht.', 'Service names instead of localhost, host and container ports, and how Vue reaches the backend.'), slides: [
          { title: e('db statt localhost', 'db instead of localhost'), view: <Stepper labels={[e('Frage', 'Question'), e('Antwort', 'Answer')]} render={s => s === 0
            ? <Ask cmd="jdbc:postgresql://localhost:5432" lines={[e('Das Backend läuft im', 'The backend runs in'), e('Container. Wo landet', 'a container. Where does'), e('diese Anfrage?', 'this request end up?')]} />
            : <DbNotLocalhost />} /> },
          { title: e('Ports und der Weg vom Browser', 'Ports and the way from the browser'), view: <Stepper scenes={[{ label: e('Host- und Container-Ports', 'Host and container ports'), view: <HostPorts /> }, { label: e('Vue ruft das Backend', 'Vue calls the backend'), view: <ApiProxy /> }]} /> },
        ] },
        { id: 'compose-start', title: e('Start, Daten, Grenzen', 'Start, data, limits'), summary: e('Gestartet ist nicht bereit, Daten bleiben im Volume, ein Test, wann Docker passt, und die Befehle.', 'Started is not ready, data stays in the volume, a test, when Docker fits, and the commands.'), slides: [
          { title: e('Start, Daten, Befehle', 'Start, data, commands'), view: <Stepper scenes={[{ label: e('Gestartet ist nicht bereit', 'Started is not ready'), view: <Order /> }, { label: e('Daten im Volume', 'data in the volume'), view: <Volumes /> }, { label: e('Befehle', 'Commands'), view: <ComposeCommands /> }]} /> },
          { title: e('Teste dich: Docker Compose', 'Test yourself: Docker Compose'), view: quiz([
            [e('Das Backend soll die Datenbank erreichen. Was gehört in DB_HOST?', 'The backend has to reach the database. What goes into DB_HOST?'), [{ label: 'localhost', code: true }, { label: 'db', code: true }, { label: '127.0.0.1', code: true }], 1, e('db: Im Docker-Netz ist der Service-Name die Adresse.', 'db: in the Docker network the service name is the address.')],
            [e('Du willst die Mensa-App im Browser öffnen. Welche Adresse?', 'You want to open the Mensa-App in the browser. Which address?'), [{ label: 'localhost:8080', code: true }, { label: 'frontend:80', code: true }, { label: 'backend:8080', code: true }], 0, e('localhost:8080: Der Browser kennt nur Host-Ports.', 'localhost:8080: the browser only knows host ports.')],
            [e('Nach docker compose down und up: Sind die Daten in dbdata noch da?', 'After docker compose down and up: is the data in dbdata still there?'), [{ label: e('Ja', 'Yes') }, { label: e('Nein', 'No') }, { label: e('Nur mit Healthcheck', 'Only with a healthcheck') }], 0, e('Ja: down löscht Container und Netz, das Volume bleibt. Erst down -v löscht es.', 'Yes: down removes containers and network, the volume stays. Only down -v deletes it.')],
          ]) },
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
