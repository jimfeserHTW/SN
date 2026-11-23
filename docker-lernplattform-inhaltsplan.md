# StudyNothing: Inhaltsplan (v4, 2026-11-23)

## Zielgruppe
Studierende, die schon Software gebaut haben (Java/Spring Boot, Vue.js), Docker aber nur als „Ding, das man startet und aufruft“ kennen. Kernfrage der Einführung: Was unterscheidet `java -jar app.jar` von einem Container?

## Prinzipien
1. Chapter sind nach **Thema** sortiert. Zuerst eine Einführung in Docker und Docker Compose (ein Foliensatz in zwei Teilen, vor dem Compose-Teil erscheint der Lernpfad erneut), dann Themen mit Unterchaptern, die von abstrakt zu technisch tiefer werden.
2. **Keine Geschichte, keine Schiffsanalogie** (seit 2026-11-23): durchgehend technische Begriffe (Port, Netz, DNS-Name, Volume, Bind Mount, Namespace, cgroup …), aber mit derselben starken Abstraktion, gezeigt in abstrakten Grafiken (Rechner als Zone, Programme als Kästen, Kernel als Leiste).
3. **Jedes Thema beginnt im Überblick** (①): Teil A, Teil B, Zusammenspiel, dann erst die technische Tiefe.
4. **Systemkarte** (`TechMap`) am Ende der Unterchapter: dasselbe Bild wächst mit, Bekanntes kräftig, Neues hervorgehoben, Rest blass.
5. **Höchstens 10 Folien** pro Unterchapter.
6. **Ein Beispiel**: die Mensa-App eines Studi-Teams: `frontend` (Vue, ausgeliefert von nginx), `api` (Spring Boot), `db` (Postgres).
7. Einführungen: genau eine Befehlsfolie (Docker: build, run, stop, rm + Mini-Dockerfile; Compose: up, down, down -v + Mini-compose.yaml).
8. Grafiken: keine Überlappungen, keine falsch gerouteten Pfeile, klare Ränder. Beschriftungen nutzen die Namen, wie sie in Dateien stehen (`frontend:80`, `db:5432`, `DB_HOST=db`). Nie das echte Docker-Logo.
9. Kleine Kritik an einer Folie heißt kleine Änderung: Layout behalten, nur das bemängelte Detail ändern.

## Gliederung
Reihenfolge: Einführung Docker → Einführung Compose → Architektur → Images → Daten → Netzwerk → Isolation → Compose (Stränge Konfiguration und Betrieb).
Die Zuordnung jeder Folie steht im Code: `src/topics/<thema>/index.tsx`.

## Stand (2026-11-23)
- Einführungen: je ein Deck mit 10 Folien inkl. Lernpfad, genau eine Befehlsfolie.
- Jedes Thema beginnt mit einem Überblicks-Unterchapter (①) mit Systemkarte am Ende. Schiffsbilder, Hafenkarte und die Folien „Vom Bild zur Technik“ sind entfernt (2026-11-23).
- 26 Unterchapter, 175 Folien, jedes Unterchapter höchstens 10 Folien und mindestens 3 Quizaufgaben.
- Technikkarte am Ende jedes technischen Unterchapters, alle geplanten Lückenfolien umgesetzt, alte Links leiten auf Themen um. 26 Unterchapter, 196 Folien.
- Fakten online geprüft (2026-11-21): Postgres-18-Volume unter /var/lib/postgresql, Vite-Standard-Host localhost, Compose: Shell vor .env, host.docker.internal mit host-gateway unter Linux, Ideal-X 1956, Compose-Watch-Aktionen.

## Phasen
1. Struktur, Routing, Navbar, Lernpfad, Quiz-Zuordnung
2. Mensa-App als Beispiel in allen Theoriefolien und Quizzen (Labs bleiben)
3. Bildwelt (ab 2026-11-23: technische Grafiken statt Schiffsanalogie, Systemkarte)
4. Einführung Docker · 5. Einführung Compose · 6. alle ① · 7. Übersetzungsfolien und Lücken in ②–④
