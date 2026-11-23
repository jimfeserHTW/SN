import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'bleibt-geht': [
    match(e('Welcher Ort passt?', 'Which place fits?'), [
      [e('Datenbank der Mensa-App', 'database of the Mensa-App'), 'Volume'],
      [e('Quellcode beim Entwickeln', 'source code while developing'), 'Bind Mount'],
      [e('Zwischenstände, die schnell weg sein dürfen', 'scratch data that may vanish'), 'tmpfs'],
    ], e('Was bleiben soll, liegt außerhalb des Containers. tmpfs ist absichtlich flüchtig.', 'Whatever should stay lives outside the container. tmpfs is short-lived on purpose.')),
    choice(e('Die api speichert Uploads in ihrem eigenen Dateisystem. Was passiert bei docker rm?', 'The api stores uploads in its own file system. What happens on docker rm?'), [
      e('Die Uploads landen automatisch in einem Volume', 'The uploads automatically end up in a volume'), e('Die Uploads sind weg', 'The uploads are gone'), e('Die Uploads wandern ins Image', 'The uploads move into the image'),
    ], 1, e('Was ein Container in sich selbst schreibt, wird mit ihm gelöscht.', 'Whatever a container writes into itself is deleted with it.')),
    choice(e('Ein Container mit tmpfs wird angehalten und wieder gestartet. Was liegt im tmpfs?', 'A container with a tmpfs is stopped and started again. What is in the tmpfs?'), [
      e('Dasselbe wie vorher', 'The same as before'), e('Nichts, er ist leer', 'Nothing, it is empty'), e('Der Inhalt des Images', 'The contents of the image'),
    ], 1, e('tmpfs liegt nur im Arbeitsspeicher und ist beim Anhalten leer.', 'tmpfs only lives in memory and is empty once the container stops.')),
  ],
  'volumes': [
    choice(e('Was bleibt nach `docker compose down` erhalten?', 'What is kept after `docker compose down`?'), [
    e('Die Container', 'The containers'), e('Das Projektnetz', 'The project network'), e('Benannte Volumes', 'Named volumes'), e('Nichts', 'Nothing'),
  ], 2, e('Erst `down -v` löscht auch die benannten Volumes.', 'Only `down -v` also deletes named volumes.')),
    match('Was passiert mit den Daten?', [['Schreibschicht', 'Weg nach docker rm'], ['Benanntes Volume', 'Bleibt nach docker rm, von Docker verwaltet'], ['Bind-Mount', 'Liegt in deinem Projektordner'], ['tmpfs', 'Liegt im RAM, weg nach dem Stopp']], 'Der Speicherort entscheidet, wie lange Daten leben.'),
    choice('Ein leeres benanntes Volume wird über einen Image-Ordner gemountet. Was passiert?', ['Docker kopiert die Dateien aus dem Image hinein', 'Der Ordner erscheint leer', 'Der Start schlägt fehl'], 0, 'Das gilt nur für leere Volumes. Ein Bind-Mount verdeckt den Image-Ordner dagegen immer.'),
    match('Was bewirkt der Befehl?', [['docker compose stop', 'Container halten an, nichts wird gelöscht'], ['docker compose down', 'Container und Netz werden gelöscht'], ['docker compose down -v', 'Zusätzlich werden Volumes gelöscht'], ['docker compose down --rmi local', 'Zusätzlich werden Images ohne eigenen Tag gelöscht']], 'Jede Stufe räumt ein Stück mehr weg.'),
  ],
}
export default quiz
