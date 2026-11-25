import { choice, e, gaps, match, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'sterben': [
    choice(e('Ein Container ist „Up (unhealthy)“ und hat restart: unless-stopped. Was macht Docker?', 'A container is “Up (unhealthy)” and has restart: unless-stopped. What does Docker do?'), [
      e('Es startet ihn sofort neu', 'It restarts it at once'), e('Nichts: Die Neustart-Regel greift erst, wenn der Prozess endet', 'Nothing: the restart policy only acts once the process ends'), e('Es löscht den Container', 'It deletes the container'),
    ], 1, e('unhealthy ist eine Meldung, kein Absturz. Neu gestartet wird erst, wenn der Prozess endet, oder ein Orchestrator reagiert.', 'unhealthy is a report, not a crash. A restart only happens once the process ends, or an orchestrator reacts.')),
    choice(e('Spring Boot braucht beim Start etwa 350 MB, der Container hat ein Limit von 250 MB. Was passiert sehr wahrscheinlich?', 'Spring Boot needs about 350 MB at start, the container has a limit of 250 MB. What most likely happens?'), [
      e('Die App startet langsamer, läuft dann aber', 'The app starts slower but then runs'), e('Der Kernel beendet den Prozess beim Start, Exit-Code 137', 'The kernel kills the process at start, exit code 137'), e('Docker verweigert den Start mit Exit-Code 125', 'Docker refuses to start with exit code 125'),
    ], 1, e('Das Limit ist kleiner als der Bedarf beim Hochfahren. Der OOM-Kill schickt SIGKILL, 128 + 9 = 137.', 'The limit is smaller than the need at start-up. The OOM kill sends SIGKILL, 128 + 9 = 137.')),
    match(e('Welcher Exit-Code passt zu welcher Ursache?', 'Which exit code fits which cause?'), [
      ['125', e('Port schon belegt, docker run scheitert', 'port already taken, docker run fails')],
      ['127', e('Befehl im CMD nicht gefunden', 'command in CMD not found')],
      ['1', e('App wirft beim Start eine Exception', 'app throws an exception at start')],
      ['143', e('SIGTERM, sauber gestoppt', 'SIGTERM, stopped cleanly')],
    ], e('125 bis 127 kommen von Docker oder dem Befehl, kleine Codes von der App, ab 128 von einem Signal.', '125 to 127 come from Docker or the command, small codes from the app, from 128 on from a signal.')),
    choice(e('docker stop dauert 10 Sekunden, danach Exit-Code 137. docker inspect zeigt OOMKilled: false. Was ist die Ursache?', 'docker stop takes 10 seconds, then exit code 137. docker inspect shows OOMKilled: false. What is the cause?'), [
      e('Das Speicher-Limit ist zu klein', 'The memory limit is too small'), e('Der Prozess hat SIGTERM nicht bekommen und wurde nach 10 s hart beendet', 'The process did not get SIGTERM and was killed hard after 10 s'), e('Das Image ist beschädigt', 'The image is broken'),
    ], 1, e('137 heißt nur SIGKILL. Ohne OOM war es der harte Stopp, z. B. weil eine Shell als PID 1 das Signal nicht weiterleitet.', '137 only means SIGKILL. Without OOM it was the hard stop, e.g. because a shell as PID 1 does not pass the signal on.')),
    gaps(e('Wie startet die api erst, wenn Postgres bereit ist?', 'How does the api start only once Postgres is ready?'), e('Die db bekommt einen [[healthcheck]], und die api wartet mit depends_on auf condition: [[service_healthy]].', 'The db gets a [[healthcheck]], and the api waits with depends_on for condition: [[service_healthy]].'), e('depends_on allein wartet nur auf den laufenden Container, nicht auf eine bereite Datenbank.', 'depends_on alone only waits for the running container, not for a ready database.')),
  ],
}
export default quiz
