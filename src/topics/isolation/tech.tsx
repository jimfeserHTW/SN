import { Svg, Box, Label, Zone, Tick, Take } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'

// Technical addition to Isolation ②: do not run the app as root.
export const NotRoot = () => (
  <div className="dg-split">
    <Code title="Dockerfile" kind="file" lines={[
      'FROM eclipse-temurin:21-jre',
      { t: 'RUN useradd -r -u 10001 mensa', chip: e('Benutzer anlegen', 'create a user') },
      'COPY --chown=mensa app.jar /app.jar',
      { t: 'USER mensa', chip: e('ab hier nicht root', 'not root from here'), mark: 'b' },
      'CMD ["java", "-jar", "/app.jar"]',
    ]} />
    <div className="dg-col">
      <Svg w={520} h={330} label={e('Ein Angreifer bricht in die api ein: als root mit vielen Rechten, als mensa mit wenigen', 'An attacker breaks into the api: as root with many rights, as mensa with few')}>
        <Zone x={0} y={0} w={250} h={260} t="bad" label={e('als root', 'as root')} />
        <Zone i={2} x={270} y={0} w={250} h={260} t="ok" label={e('als mensa', 'as mensa')} />
        {[e('Dateien im Container ändern', 'change files in the container'), e('Pakete nachinstallieren', 'install packages'), e('Fehler in Docker ausnutzen', 'exploit a bug in Docker')].map((l, k) => (
          <g key={l}>
            <Box i={1} x={14} y={44 + k * 70} w={222} h={56} t="app" label={l} size={13} />
            <Tick i={1} x={236} y={44 + k * 70} ok />
            <Box i={3} x={284} y={44 + k * 70} w={222} h={56} t="app" label={l} size={13} />
            <Tick i={3} x={506} y={44 + k * 70} bad={k > 0} ok={k === 0} />
          </g>
        ))}
        <Label i={4} x={260} y={300} size={13}>{e('mensa darf nur noch in die eigenen Dateien schreiben', 'mensa may only write to its own files')}</Label>
      </Svg>
      <Take i={5} label={e('Merke', 'Remember')} text={e('Root im Container ist weniger als root auf dem Rechner, aber immer noch zu viel. Eine Zeile USER genügt.', 'Root in the container is less than root on the machine, but still too much. One USER line is enough.')} />
    </div>
  </div>
)
