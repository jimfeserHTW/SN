import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'start': [
    choice(e('Welches Problem löst Docker Compose vor allem?', 'Which problem does Docker Compose mainly solve?'), [
    e('Es ersetzt den Linux-Kernel', 'It replaces the Linux kernel'),
    e('Es beschreibt mehrere Container, Netze und Volumes in einer Datei', 'It describes several containers, networks and volumes in one file'),
    e('Es macht Images kleiner', 'It makes images smaller'),
  ], 1, e('Statt vieler langer Befehle startet ein einziger Befehl die ganze Umgebung, und die Datei liegt im Git.', 'Instead of many long commands, one command starts the whole environment, and the file lives in Git.')),
    match(e('Was macht welcher Teil?', 'What does each part do?'), [
      ['compose.yaml', e('beschreibt alle Container der App', 'describes all containers of the app')],
      [e('Service-Name db', 'service name db'), e('Adresse der Datenbank im gemeinsamen Netz', 'address of the database in the shared network')],
      ['ports', e('der Weg von außen hinein', 'the way in from outside')],
      ['Volume', e('Daten, die bleiben', 'data that stays')],
    ], e('Die compose.yaml beschreibt alles, was zur App gehört. Compose setzt sie auf einem Rechner um.', 'compose.yaml describes everything that belongs to the app. Compose carries it out on one machine.')),
    choice(e('Spring Boot im Container api soll die Datenbank erreichen. Welcher Wert passt für DB_HOST?', 'Spring Boot in the container api has to reach the database. Which value fits DB_HOST?'), ['localhost', 'db', '127.0.0.1'], 1,
      e('localhost ist im Container die api selbst. Die Datenbank erreicht man über ihren Service-Namen db.', 'Inside the container localhost is the api itself. The database is reached by its service name db.')),
    choice(e('Ihr macht docker compose down und danach wieder up. Was passiert mit den Daten im Volume?', 'You run docker compose down and then up again. What happens to the data in the volume?'), [
      e('Sie sind weg', 'They are gone'), e('Sie sind noch da, die neue db findet sie wieder', 'They are still there, the new db finds them again'), e('Sie liegen jetzt im Image', 'They are now in the image'),
    ], 1, e('down entfernt Container und Netz, das Volume bleibt. Erst down -v löscht es.', 'down removes containers and network, the volume stays. Only down -v deletes it.')),
    figure(e('In welcher Reihenfolge startet Compose, wenn die api auf die Datenbank wartet?', 'In which order does Compose start when the api waits for the database?'), flow([e('db startet', 'db starts'), e('db meldet [[bereit|healthy|ready]]', 'db reports [[ready|healthy|bereit]]'), e('[[api]] startet', '[[api]] starts')], [e('Healthcheck', 'healthcheck'), e('dann', 'then')]),
      e('Gestartet ist nicht bereit. Die api startet erst, wenn der Healthcheck der Datenbank „healthy“ meldet.', 'Started is not ready. The api only starts once the database’s healthcheck reports “healthy”.')),
    order(e('Bringe die Befehle in eine sinnvolle Reihenfolge: starten, aufräumen, alles samt Daten löschen.', 'Put the commands in a sensible order: start, clean up, delete everything including data.'), ['docker compose up -d', 'docker compose down', 'docker compose down -v'],
      e('up startet alles laut compose.yaml, down entfernt Container und Netz, down -v zusätzlich die Volumes.', 'up starts everything as compose.yaml says, down removes containers and network, down -v the volumes as well.'), { code: true }),
  ],
}
export default quiz
