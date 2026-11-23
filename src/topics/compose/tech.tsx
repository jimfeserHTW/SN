import { Svg, Box, Arrow, Label, Zone, Take } from '../../components/Svg.tsx'
import { Code } from '../../components/Code.tsx'
import { e } from '../../components/quizModel.ts'

// Technical addition to Compose ② (configuration): how Spring Boot reads environment variables.
export const SpringEnv = () => (
  <div className="dg-col">
    <div className="dg-col">
      <Code title="compose.yaml" kind="file" lines={[
        '  api:',
        '    environment:',
        { t: '      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/mensa', n: 1 },
        { t: '      SPRING_DATASOURCE_USERNAME: mensa', n: 1 },
        { t: '      DB_HOST: db', n: 2 },
      ]} />
      <Code title="application.properties" kind="file" i={1} lines={[
        { t: e('# 1  ohne Eintrag: Spring setzt die Variable direkt ein', '# 1  no entry needed: Spring uses the variable directly'), k: 'note' },
        { t: e('# 2  oder ein eigener Platzhalter mit Standardwert:', '# 2  or a placeholder of your own with a default:'), k: 'note' },
        { t: 'spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:5432/mensa', n: 2 },
      ]} />
    </div>
    <Svg w={1000} h={150} label={e('Aus dem Variablennamen wird der Property-Name: Großbuchstaben und Unterstriche werden zu Punkten', 'The variable name becomes the property name: capitals and underscores become dots')}>
      <Box i={2} x={20} y={40} w={400} h={64} t="host" label="SPRING_DATASOURCE_URL" sub={e('Umgebungsvariable', 'environment variable')} mono size={15} />
      <Arrow i={2} d="M424 72 H576" label={e('Spring Boot übersetzt', 'Spring Boot translates')} lx={500} ly={60} />
      <Box i={3} x={580} y={40} w={400} h={64} t="ok" label="spring.datasource.url" sub="Property" mono size={15} />
      <Label i={4} x={500} y={140} size={13}>{e('Auf dem Laptop gilt der Standard localhost, im Container der Wert db aus dem Plan.', 'On the laptop the default localhost applies, in the container the value db from the plan.')}</Label>
    </Svg>
    <Take i={5} label={e('Merke', 'Remember')} text={e('Spring Boot liest Umgebungsvariablen von selbst. So bleibt das Image gleich, und nur die Umgebungsvariablen ändern sich.', 'Spring Boot reads environment variables by itself. The image stays the same, only the environment variables change.')} />
  </div>
)

/* ── from laptop to server: build, push, pull, up ── */
export const Deploy = () => (
  <div className="dg-col">
    <Svg w={1000} h={260} label={e('Auf dem Laptop bauen und pushen, auf dem Server pullen und starten', 'Build and push on the laptop, pull and start on the server')}>
      <Zone x={0} y={0} w={320} h={210} t="host" label={e('Laptop oder CI', 'Laptop or CI')} />
      <Box i={0} x={20} y={50} w={280} h={60} t="app" label="docker compose build" mono size={14} />
      <Box i={1} x={20} y={130} w={280} h={60} t="app" label="docker compose push" mono size={14} />
      <Box i={2} x={380} y={90} w={240} h={70} t="reg" label="Registry" sub="ghcr.io/team/mensa-api:1.1" size={15} />
      <Zone i={3} x={680} y={0} w={320} h={210} t="host" label="Server" />
      <Box i={3} x={700} y={50} w={280} h={60} t="app" label="docker compose pull" mono size={14} />
      <Box i={4} x={700} y={130} w={280} h={60} t="ok" label="docker compose up -d" mono size={14} />
      <Arrow i={1} d="M304 160 H376" /><Arrow i={3} d="M624 125 C660 100 660 80 696 80" />
      <Label i={5} x={500} y={245} size={13}>{e('Auf dem Server wird nichts gebaut: Er holt fertige Images mit fester Version.', 'Nothing is built on the server: it fetches ready images with a fixed version.')}</Label>
    </Svg>
  </div>
)

/* ── docker compose config: what Compose really reads ── */
export const ConfigView = () => (
  <div className="dg-split">
    <Code title="compose.yaml + .env" kind="file" lines={[
      'services:', '  api:', '    image: mensa-api:${TAG:-1.0}', '    environment:', '      DB_HOST: db',
      { t: '# .env: TAG=1.1', k: 'note' },
    ]} />
    <Code title="docker compose config" i={1} lines={[
      'name: mensa', 'services:', '  api:', { t: '    image: mensa-api:1.1', mark: 'b', chip: e('eingesetzt', 'filled in') },
      '    environment:', '      DB_HOST: db', { t: '    networks:', mark: 'b', chip: e('ergänzt', 'added') }, '      default: null',
    ]} />
  </div>
)
