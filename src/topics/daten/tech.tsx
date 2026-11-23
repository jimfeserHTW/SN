import { Svg, Box, Arrow, Label, Zone, Tick, Take } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'

// Technical additions to Daten ②: backing up a volume, and file ownership with bind mounts.

/* ── backing up: a dump from the database, or a copy of the volume ── */
export const Backup = () => (
  <div className="dg-col">
    <Code title="Terminal" lines={[
      { t: e('# 1  besser für Datenbanken: ein Dump aus dem laufenden Postgres', '# 1  better for databases: a dump from the running Postgres'), k: 'note' },
      { t: 'docker compose exec db pg_dump -U mensa mensa > mensa.sql', k: 'cmd' },
      { t: e('# 2  ganzes Volume kopieren, mit einem Wegwerf-Container', '# 2  copy the whole volume, with a throwaway container'), k: 'note' },
      { t: 'docker compose stop db', k: 'cmd' },
      { t: 'docker run --rm -v mensa_dbdata:/data -v "$PWD":/backup \\', k: 'cmd' },
      { t: '    alpine tar czf /backup/dbdata.tgz -C /data .', k: 'cont' },
    ]} />
    <Take i={1} label={e('Merke', 'Remember')} text={e('Ein Dump ist auch im laufenden Betrieb stimmig und passt auf neuere Postgres-Versionen. Die Kopie des Volumes nur bei gestoppter Datenbank.', 'A dump is consistent even while running and works with newer Postgres versions. Copy the volume only while the database is stopped.')} />
  </div>
)

/* ── ownership: why the container may not write into your folder ── */
export const Owners = () => (
  <div className="dg-col">
    <Svg w={1000} h={320} label={e('Der Ordner gehört Nutzer 1000 auf dem Rechner, der Prozess im Container läuft als 10001 und darf nicht schreiben', 'The folder belongs to user 1000 on the machine, the process in the container runs as 10001 and may not write')}>
      <Zone x={0} y={0} w={420} h={260} t="host" label={e('Dein Rechner (Linux)', 'Your machine (Linux)')} />
      <Box i={0} x={30} y={60} w={360} h={70} t="reg" label="./uploads" sub={e('gehört UID 1000 (du)', 'owned by UID 1000 (you)')} mono />
      <Zone i={1} x={560} y={0} w={440} h={260} t="container" label="Container api" />
      <Box i={1} x={590} y={60} w={380} h={70} t="app" label="/data" sub={e('derselbe Ordner, durchgereicht', 'the same folder, passed through')} mono />
      <Box i={2} x={590} y={160} w={380} h={70} t="bad" label="java · UID 10001" sub="Permission denied" />
      <Arrow i={1} d="M394 95 H586" both />
      <Tick i={2} x={970} y={160} bad />
      <Label i={3} x={500} y={300} size={14}>{e('Rechte zählen nach Nummer, nicht nach Name. Lösung: gleiche UID nutzen (user: "1000:1000") oder ein Volume statt des Bind Mounts.', 'Permissions go by number, not by name. Fix: use the same UID (user: "1000:1000") or a volume instead of the bind mount.')}</Label>
    </Svg>
    <Take i={4} label={e('Gut zu wissen', 'Good to know')} text={e('Unter Docker Desktop auf macOS und Windows gleicht Docker die Rechte für Bind Mounts meist aus. Das Problem trifft vor allem Linux.', 'With Docker Desktop on macOS and Windows, Docker usually smooths over permissions for bind mounts. The problem mainly hits Linux.')} />
  </div>
)
