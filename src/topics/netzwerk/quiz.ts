import { bugs, choice, e, figure, flow, gaps, match, order, stacks, type Task } from '../../components/quizModel.ts'

// Tasks per sub-chapter, keyed by its id. Each sub-chapter's tasks only ask what its slides teach.
const quiz: Record<string, Task[]> = {
  'erreichen': [
    choice(e('Zwei Container sollen beide außen Port 8080 bekommen. Was passiert?', 'Two containers should both get port 8080 outside. What happens?'), [
      e('Beide laufen, Docker verteilt die Anfragen', 'Both run, Docker shares out the requests'), e('Der zweite startet nicht: port is already allocated', 'The second does not start: port is already allocated'), e('Docker wählt für den zweiten 8081', 'Docker picks 8081 for the second'),
    ], 1, e('Jeden Port außen gibt es pro Rechner nur einmal. Drinnen dürfen beide 80 benutzen.', 'Each outside port exists only once per machine. Inside, both may use 80.')),
    figure(e('Wie findet die api die Datenbank?', 'How does the api find the database?'), flow([e('api fragt nach [[db]]', 'api asks for [[db]]'), e('der [[DNS]] von Docker antwortet', 'Docker’s [[DNS]] answers'), e('api verbindet sich direkt mit der [[IP|IP-Adresse]]', 'api connects directly to the [[IP|IP address]]')], [e('Name', 'name'), 'IP']),
      e('Container finden sich über Namen. Der DNS von Docker übersetzt den Namen in die aktuelle IP.', 'Containers find each other by name. Docker’s DNS translates the name into the current IP.')),
    choice(e('frontend hängt nur im Netz web, db nur im Netz backend. Kann frontend die db erreichen?', 'frontend is only in network web, db only in network backend. Can frontend reach db?'), [
      e('Ja, alle Container eines Rechners sehen sich', 'Yes, all containers on a machine see each other'), e('Nein, sie haben kein gemeinsames Netz', 'No, they share no network'),
    ], 1, e('Nur Container im selben Netz erreichen sich. Die api hängt in beiden und vermittelt.', 'Only containers in the same network reach each other. The api is in both and connects them.')),
    gaps(e('Ergänze: Spring Boot im Container soll eine Datenbank erreichen, die direkt auf deinem Laptop läuft.', 'Complete: Spring Boot in a container should reach a database running directly on your laptop.'), 'DB_HOST=[[host.docker.internal]]\n',
      e('localhost wäre der Container selbst. host.docker.internal zeigt auf den eigenen Rechner.', 'localhost would be the container itself. host.docker.internal points to your own machine.'), '.env'),
  ],
  'ports-netze': [
    choice(e('Zwei Container wurden mit docker run ohne --network gestartet. Warum findet der eine den anderen nicht über den Namen?', 'Two containers were started with docker run without --network. Why does one not find the other by name?'), [
      e('Im Standard-Netz bridge gibt es keinen DNS für Container-Namen', 'The default network bridge has no DNS for container names'), e('Container haben nie Namen', 'Containers never have names'), e('Der Port fehlt', 'The port is missing'),
    ], 0, e('Namen löst Docker nur in eigenen Netzen auf: docker network create, oder Compose, das selbst ein Netz anlegt.', 'Docker only resolves names in your own networks: docker network create, or Compose, which creates a network itself.')),
    figure(e('Der Service hat `ports: "8080:80"`. Trage beide Portnummern ein.', 'The service has `ports: "8080:80"`. Enter both port numbers.'), flow(
    [e('Browser', 'Browser'), e('Host-Port [[8080]]', 'Host port [[8080]]'), e('Container-Port [[80]]', 'Container port [[80]]')],
    [e('ruft auf', 'requests'), e('leitet weiter', 'forwards')],
  ), e('Links steht immer der Port am Host, rechts der Port im Container.', 'The left side is always the host port, the right side the container port.')),
    choice(e('Wie erreicht der Service api die Datenbank im selben Compose-Netz?', 'How does the service api reach the database on the same Compose network?'), [
    e('Über `localhost:5432`', 'Via `localhost:5432`'), e('Über den Service-Namen `db:5432`', 'Via the service name `db:5432`'), e('Nur über einen veröffentlichten Host-Port', 'Only via a published host port'),
  ], 1, e('Der eingebaute DNS löst Service-Namen auf. `localhost` wäre der Container api selbst.', 'The built-in DNS resolves service names. `localhost` would be the api container itself.')),
    figure(e('Wer beantwortet die Frage nach dem Namen `db`?', 'Who answers the question for the name `db`?'), flow(
    [e('Container api', 'Container api'), e('Eingebauter [[DNS]] der Engine', 'Built-in [[DNS]] of the engine'), e('Container [[db]]', 'Container [[db]]')],
    [e('fragt: wer ist db?', 'asks: who is db?'), e('liefert die IP', 'returns the IP')],
  ), e('Im selben Netz gilt: Name gleich Adresse.', 'On the same network, the name is the address.')),
    choice('Was gilt für `--network host`?', ['Der Container nutzt den Netzwerk-Stack des Hosts, -p ist nicht nötig', 'Der Container bekommt gar kein Netz', 'Der Container hängt an der Standard-Bridge'], 0, 'Ein Dienst auf Port 80 belegt dann direkt Port 80 des Hosts.'),
    choice('Wer erreicht einen Service mit `ports: ["127.0.0.1:8081:80"]`?', ['Jeder im Netzwerk', 'Nur Programme auf diesem Rechner', 'Nur andere Container'], 1, 'Die IP vor dem Host-Port legt fest, an welcher Adresse Docker lauscht.'),
  ],
  'kernel': [
    figure('Wie ist ein Container mit dem Host verkabelt?', flow(['eth0 im Container', '[[veth|veth-Paar|veth pair]]-Kabel', 'Bridge [[docker0]]', 'Host-Netz'], ['Ende im Container', 'Ende an der Bridge', 'NAT']), 'Ein veth-Paar ist ein virtuelles Kabel mit einem Ende in jedem Namespace.'),
    gaps('Ergänze die Prüfung der Portweiterleitung.', 'iptables -t [[nat]] -L [[DOCKER]]\n', 'Für `-p 8080:80` trägt Docker dort eine DNAT-Regel auf die Container-Adresse ein.', 'terminal'),
    order('Baue den Befehl: NAT-Regeln der Docker-Kette anzeigen.', ['iptables', '-t nat', '-L DOCKER'], 'Beide Optionen dürfen tauschen.', { inline: true, swap: [[1, 2]] }),
    choice('Was bewirkt `internal: true` an einem Netz?', ['Container darin haben keinen Weg nach außen', 'Das Netz ist nur für root sichtbar', 'Container können sich nicht mehr gegenseitig erreichen'], 0, 'Untereinander bleiben sie erreichbar, nur der Weg hinaus fehlt.'),
    bugs('api soll mit `--scale api=3` laufen. Welche Zeilen verhindern das?', 'compose.yaml', ['services:', '  api:', '    image: mensa-api:2', '!!    container_name: api', '    ports:', '!!      - "8080:80"', '    networks: [web]'], 'Ein fester Name und ein fester Host-Port können nur einmal vergeben werden.'),
    figure('api läuft mit `--scale api=3`. Wie verteilt sich der Name?', flow(['Anfrage an api', 'Eingebauter [[DNS]]', 'IPs von [[3]] Containern'], ['fragt', 'liefert']), 'Alle Instanzen teilen sich den Service-Namen.'),
  ],
}
export default quiz
