import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'ladeplan': [
    choice(e('TAG steht in der .env auf 1.1, ihr startet mit TAG=1.2 docker compose up. Welche Version läuft?', 'TAG is 1.1 in the .env, you start with TAG=1.2 docker compose up. Which version runs?'), ['1.0', '1.1', '1.2'], 2,
      e('Die Variable in der Shell gewinnt vor der .env und dem Standard in der compose.yaml.', 'The variable in the shell wins over the .env and the default in compose.yaml.')),
    choice(e('Warum gehört ein Passwort besser in ein Secret als in eine Umgebungsvariable (environment)?', 'Why does a password belong in a secret rather than in an environment variable (environment)?'), [
      e('Weil Umgebungsvariablen für jeden mit Zugang lesbar sind', 'Because environment variables are readable by anyone with access'), e('Weil Secrets schneller sind', 'Because secrets are faster'), e('Weil environment keine Sonderzeichen erlaubt', 'Because environment allows no special characters'),
    ], 0, e('Variablen tauchen in docker inspect und manchmal in Logs auf. Ein Secret ist nur als Datei im Container zu sehen.', 'Variables show up in docker inspect and sometimes in logs. A secret is only visible as a file inside the container.')),
    match(e('Welche Zeile des Service bewirkt was?', 'Which line of the service does what?'), [
      ['image', e('welches Image', 'which image')], ['environment', e('Umgebungsvariablen', 'environment variables')], ['ports', e('Port nach außen', 'port to the outside')], ['depends_on', e('auf wen gewartet wird', 'whom it waits for')],
    ], e('Ein Service beschreibt genau einen Container mit allem, was ihm mitgegeben wird.', 'A service describes exactly one container with everything handed to it.')),
  ],
  'mannschaft': [
    choice(e('Ihr ändert nur die Version der api in der compose.yaml und ruft up auf. Was passiert?', 'You only change the api version in compose.yaml and run up. What happens?'), [
      e('Alle drei Container werden neu gestartet', 'All three containers are restarted'), e('Nur die api wird ersetzt, frontend und db bleiben', 'Only the api is replaced, frontend and db stay'), e('Nichts, up startet nur neue Projekte', 'Nothing, up only starts new projects'),
    ], 1, e('Compose vergleicht Soll und Ist und ersetzt nur, was sich geändert hat.', 'Compose compares desired and actual state and only replaces what has changed.')),
    choice(e('Woran erkennt Compose, welche Container zu eurem Projekt gehören?', 'How does Compose know which containers belong to your project?'), [
      e('Am Projektnamen, der als Label an jedem Container hängt', 'By the project name attached to every container as a label'), e('An der Reihenfolge, in der sie gestartet wurden', 'By the order they were started in'), e('An der IP-Adresse', 'By the IP address'),
    ], 0, e('Compose setzt den Projektnamen als Label an alles, was es anlegt, und findet so seine Container wieder.', 'Compose attaches the project name as a label to everything it creates and finds its containers that way.')),
    match(e('Welche Neustart-Regel passt?', 'Which restart rule fits?'), [
      [e('nie automatisch neu starten', 'never restart automatically'), 'no'], [e('immer neu starten, außer ihr habt gestoppt', 'always restart unless you stopped it'), 'unless-stopped'], [e('nur nach einem Fehler neu starten', 'restart only after an error'), 'on-failure'],
    ], e('Ohne Regel bleibt ein abgestürzter Container aus. Mit Regel startet Docker ihn neu.', 'Without a rule a crashed container stays down. With a rule Docker starts it again.')),
  ],
  'datei': [
    bugs(e('In dieser Datei stecken drei Fehler. Markiere die betroffenen Zeilen.', 'This file contains three errors. Mark the affected lines.'), 'compose.yaml', ['services:', '  api:', '!!    imgae: mensa-api:1.0', '    ports:', '      - "8080:8080"', '    environment:', '!!      DB_HOST: localhost', '!!    depends_on: [database]', '  db:', '    image: postgres:18', '    environment:', '      POSTGRES_PASSWORD: geheim'],
    e('`image` ist falsch geschrieben, `localhost` zeigt auf api selbst, und der Service heißt `db`, nicht `database`.', '`image` is misspelled, `localhost` points to api itself, and the service is called `db`, not `database`.')),
    gaps(e('Ergänze die fehlenden Schlüssel.', 'Fill in the missing keys.'), 'services:\n  api:\n    [[image]]: mensa-api:1.0\n    [[ports]]:\n      - "8080:8080"\n    [[depends_on]]: [db]\n  db:\n    image: postgres:18\n    [[environment]]:\n      POSTGRES_PASSWORD: geheim\n    [[volumes]]:\n      - dbdata:/var/lib/postgresql\nvolumes:\n  dbdata:\n',
    e('Benannte Volumes stehen beim Service und zusätzlich auf oberster Ebene.', 'Named volumes appear at the service and also at the top level.'), 'compose.yaml'),
    choice(e('`TAG` steht in der Shell und in `.env` mit verschiedenen Werten. Welcher gilt für `${TAG}`?', '`TAG` is set in the shell and in `.env` with different values. Which one applies to `${TAG}`?'), [
    e('Der Wert aus `.env`', 'The value from `.env`'), e('Der Wert aus der Shell', 'The value from the shell'), e('Compose bricht mit einem Fehler ab', 'Compose stops with an error'),
  ], 1, e('Die Shell gewinnt gegen `.env`.', 'The shell wins over `.env`.')),
    figure('Woraus entsteht der Startbefehl eines Containers?', flow(['[[ENTRYPOINT]]', '[[CMD]]', 'PID 1 im Container'], ['davor, danach die Argumente', 'ergibt']), 'Beide Teile werden aneinandergehängt und als Hauptprozess gestartet.'),
    choice('Was bewirkt `command:` in einem Service?', ['Es ersetzt nur CMD, der ENTRYPOINT bleibt', 'Es ersetzt ENTRYPOINT und CMD', 'Es läuft zusätzlich nach dem Start'], 0, 'Erst `entrypoint:` ersetzt den Einstieg und leert dabei auch CMD.'),
  ],
  'arbeiten': [
    choice(e('Das Image mensa-api hat einen HEALTHCHECK im Dockerfile. In der compose.yaml steht für api kein healthcheck. Was gilt?', 'The image mensa-api has a HEALTHCHECK in the Dockerfile. compose.yaml has no healthcheck for api. What applies?'), [
      e('Kein Healthcheck, weil Compose keinen hat', 'No healthcheck, because Compose has none'), e('Der HEALTHCHECK aus dem Image', 'The HEALTHCHECK from the image'), e('Compose bricht mit einem Fehler ab', 'Compose stops with an error'),
    ], 1, e('Der HEALTHCHECK reist mit dem Image. Die compose.yaml kann ihn ändern oder mit disable: true abschalten.', 'The HEALTHCHECK travels with the image. compose.yaml can change it or switch it off with disable: true.')),
    match(e('Was macht welcher Befehl? Alle beginnen mit `docker compose`.', 'What does each command do? All start with `docker compose`.'), [
    ['up -d', e('Alles im Hintergrund starten', 'Start everything in the background')],
    ['ps', e('Laufende Services und Ports zeigen', 'Show running services and ports')],
    ['logs -f api', e('Ausgabe eines Services live verfolgen', 'Follow the output of one service live')],
    ['exec api sh', e('Shell im laufenden Container öffnen', 'Open a shell in the running container')],
    ['config', e('Fertige Datei mit eingesetzten Variablen zeigen', 'Show the final file with variables filled in')],
    ['down', e('Container und Netz entfernen', 'Remove containers and network')],
  ], e('Diese sechs Befehle decken den Alltag mit Compose fast vollständig ab.', 'These six commands cover almost all everyday work with Compose.')),
    order(e('Sortiere einen typischen Arbeitsablauf.', 'Sort a typical workflow.'), ['docker compose config', 'docker compose up -d', 'docker compose ps', 'docker compose logs -f api', 'docker compose down'],
    e('Erst die Datei prüfen, dann starten, nachsehen und am Ende aufräumen. `ps` und `logs` dürfen tauschen.', 'First validate the file, then start, inspect, and finally clean up. `ps` and `logs` may swap.'), { code: true, swap: [[2, 3]] }),
    choice(e('Worauf wartet ein einfaches `depends_on: [db]`?', 'What does a plain `depends_on: [db]` wait for?'), [
    e('Bis db gestartet wurde', 'Until db has been started'), e('Bis db Verbindungen annimmt', 'Until db accepts connections'), e('Bis alle Tabellen angelegt sind', 'Until all tables exist'),
  ], 0, e('Gestartet ist nicht bereit. Dafür braucht es einen Healthcheck.', 'Started is not ready. That takes a healthcheck.')),
    gaps(e('api soll erst starten, wenn db gesund ist.', 'api should only start once db is healthy.'), 'services:\n  api:\n    depends_on:\n      db:\n        condition: [[service_healthy]]\n  db:\n    [[healthcheck]]:\n      test: pg_isready -U postgres\n      [[interval]]: 5s\n',
    e('Der Healthcheck läuft im Container, `service_healthy` wartet auf sein Ergebnis.', 'The healthcheck runs in the container, and `service_healthy` waits for its result.'), 'compose.yaml'),
    order(e('Ziehe die Teile in die richtige Reihenfolge: die letzten 50 Logzeilen von api.', 'Drag the parts into the right order: the last 50 log lines of api.'), ['docker', 'compose', 'logs', '--tail 50', 'api'],
    e('Optionen stehen hinter dem Unterbefehl, der Service als Argument am Ende.', 'Options follow the subcommand, and the service comes last as argument.'), { inline: true }),
    order('Was tut `docker compose up` der Reihe nach?', ['Konfiguration einlesen und Plan berechnen', 'Netz mensa_default anlegen', 'Volume mensa_dbdata anlegen', 'Container db starten und abwarten', 'Container api starten'], 'Compose ist ein Client von dockerd. Netz und Volume müssen vor den Containern existieren, ihre Reihenfolge ist egal.', { swap: [[1, 2]] }),
    gaps('Ergänze die Schlüssel des Healthchecks.', 'healthcheck:\n  [[test]]: ["CMD-SHELL", "pg_isready"]\n  [[interval]]: 5s\n  [[timeout]]: 3s\n  [[retries]]: 3\n  [[start_period]]: 30s\n', 'In der `start_period` zählen Fehler noch nicht. Danach machen `retries` Fehlschläge in Folge den Service ungesund.', 'compose.yaml'),
    match('Worauf wartet die Bedingung?', [['service_started', 'Der Container wurde gestartet'], ['service_healthy', 'Der Healthcheck meldet gesund'], ['service_completed_successfully', 'Der Container endete mit Code 0']], 'Die letzte Bedingung passt für einmalige Aufgaben wie Migrationen.'),
  ],
  'betreiben': [
    match('Welche Neustart-Regel passt?', [['no', 'Nie automatisch neu starten'], ['on-failure', 'Nur nach einem Exit-Code ungleich 0'], ['always', 'Immer, auch nach manuellem Stopp beim Daemon-Neustart'], ['unless-stopped', 'Immer, außer du hast ihn selbst gestoppt']], 'Der Unterschied zwischen den letzten beiden zeigt sich erst beim Neustart des Daemons.'),
    bugs('Hier stecken zwei ungültige Werte. Markiere die Zeilen.', 'compose.yaml', ['services:', '  api:', '    build: ./api', '!!    restart: sometimes', '    mem_limit: 512m', '    cap_drop: [ALL]', '    depends_on:', '      db:', '!!        condition: service_ready', '  db:', '    image: postgres:18'], '`restart` kennt no, always, on-failure und unless-stopped. Eine Bedingung `service_ready` gibt es nicht.'),
    match('Welcher Befehl hilft bei diesem Symptom?', [['Variable fehlt, YAML-Fehler', 'docker compose config'], ['Container zeigt Exited', 'docker compose logs api'], ['Connection refused', 'docker compose exec api getent hosts db'], ['Exit 137, sehr langsam', 'docker stats'], ['Tabellen sind leer', 'docker volume ls']], 'Jedes Symptom hat seine eigene erste Frage.'),
  ],
  'werte': [
    order('Welcher Wert gewinnt für eine Variable im Container? Stärkster zuerst.', ['docker compose run -e MODE=test', 'environment: in der Datei', 'env_file:', 'ENV im Image'], 'Je näher am Start, desto stärker.'),
    choice('Warum ist ein Secret sicherer als eine Umgebungsvariable?', ['Es wird als Datei eingebunden und taucht nicht in `docker inspect` auf', 'Es wird automatisch alle 24 Stunden geändert', 'Es ist nur auf Windows sichtbar'], 0, 'Variablen sehen `docker inspect`, `/proc/1/environ` und Kindprozesse. Viele Images lesen Secrets über `_FILE`-Variablen.'),
    order('Starte auch die Services des Profils debug, im Hintergrund.', ['docker', 'compose', '--profile debug', 'up', '-d'], '`--profile` gehört zu `docker compose`, `-d` zu `up`.', { inline: true }),
    match('Was bedeutet der Platzhalter?', [['${TAG:-latest}', 'latest, wenn TAG fehlt oder leer ist'], ['${TAG-latest}', 'latest nur, wenn TAG fehlt'], ['${TAG:?fehlt}', 'Abbruch, wenn TAG fehlt oder leer ist'], ['${TAG:+neu}', 'neu, wenn TAG gesetzt und nicht leer ist']], 'Der Doppelpunkt entscheidet, ob ein leerer Wert wie ein fehlender zählt.'),
    choice('`TAG=` ist gesetzt, aber leer. Was ergibt `mensa-api:${TAG-latest}`?', ['mensa-api:latest', 'mensa-api: (ungültig)', 'Compose bricht immer ab'], 1, 'Ohne Doppelpunkt zählt ein leerer Wert als gesetzt.'),
  ],
  'gross': [
    choice('Zwei Dateien setzen `ports: ["80:80"]` und `ports: ["443:443"]`. Was gilt nach dem Zusammenführen?', ['Nur 443:443', 'Nur 80:80', 'Beide Einträge'], 2, 'Listen wie ports werden zusammengeführt. Einzelwerte wie `image` ersetzt die spätere Datei.'),
    gaps('Ergänze die YAML-Tags für das Zusammenführen.', 'services:\n  api:\n    volumes: [[!reset]] []\n    dns: [[!override]] [8.8.8.8]\n', '`!reset` leert den geerbten Wert, `!override` ersetzt ihn vollständig.', 'compose.prod.yaml'),
    gaps('Vermeide Wiederholung mit einem Anker.', 'x-common: [[&common]]\n  restart: unless-stopped\nservices:\n  api:\n    [[<<]]: [[*common]]\n    image: mensa-api:1.0\n', 'Schlüssel mit `x-` ignoriert Compose, der Anker macht sie wiederverwendbar.', 'compose.yaml'),
    match('Welcher Weg passt?', [['-f a.yaml -f b.yaml', 'Umgebungen wie dev und prod überlagern'], ['extends', 'Einen einzelnen Service als Vorlage nutzen'], ['include', 'Fertige Teilprojekte einbinden']], 'Alle drei verbinden Dateien, aber auf verschiedenen Ebenen.'),
    order('Baue den Befehl für Produktion mit drei api-Instanzen.', ['docker', 'compose', '-f compose.yaml', '-f compose.prod.yaml', 'up', '-d', '--scale api=3'], 'Die spätere Datei überschreibt die frühere, die Optionen von `up` dürfen tauschen.', { inline: true, swap: [[5, 6]] }),
  ],
  'intern': [
    order('Welcher Projektname gewinnt? Stärkster zuerst.', ['-p mensa', 'COMPOSE_PROJECT_NAME', 'name: in der Datei', 'Name des Ordners'], 'Der Ordnername ist nur der letzte Rückfall.', { code: true }),
    gaps('Woran erkennt Compose seine Container?', 'Compose fragt dockerd nach Containern mit dem Etikett com.docker.compose.[[project]]. Änderungen erkennt es am Etikett com.docker.compose.[[config-hash]].', 'Compose führt keine eigene Datenbank, die Etiketten sind sein Gedächtnis.'),
    order('Wie entscheidet `up`, ob ein Container ersetzt wird?', ['Soll-Konfiguration aus den Dateien berechnen', 'Laufende Container über Etiketten finden', 'Hash und Image vergleichen', 'Bei Abweichung Container ersetzen'], 'Gleiche Werte bedeuten: Der Container läuft einfach weiter.'),
    choice('Was geht verloren, wenn `up` einen Container ersetzt?', ['Volumes', 'Die Schreibschicht', 'Das Image'], 1, 'Der neue Container startet mit leerer Schreibschicht, Volumes werden wieder eingebunden.'),
  ],
}
export default quiz
