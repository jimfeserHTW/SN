import { Svg, Box, Arrow, Label, Zone, Tick, Take } from '../../components/Svg.tsx'
import { e } from '../../components/quizModel.ts'

// Technical addition to Netzwerk ②: a server that only listens on localhost inside the container.
const row = (y: number, ok: boolean, listen: string, i: number) => (
  <g>
    <Zone i={i} x={330} y={y} w={640} h={130} t="container" label="Container frontend" sub={e('Vite-Dev-Server', 'Vite dev server')} />
    <Box i={i} x={350} y={y + 42} w={180} h={64} t="kchip" label="eth0" sub="172.18.0.2" mono />
    <Box i={i} x={560} y={y + 42} w={170} h={64} t="libs" label="lo" sub="127.0.0.1" mono />
    <Box i={i} x={760} y={y + 42} w={190} h={64} t={ok ? 'ok' : 'bad'} label={listen} sub={ok ? e('lauscht überall', 'listens everywhere') : e('lauscht nur auf lo', 'listens on lo only')} size={14} mono />
    <Arrow i={i + 1} d={`M200 ${y + 74} H346`} kind={ok ? 'ok' : 'bad'} label="-p 5173:5173" lx={272} ly={y + 62} />
    <Tick i={i + 1} x={540} y={y + 30} ok={ok} bad={!ok} />
  </g>
)
export const ListenAddress = () => (
  <div className="dg-col">
    <Svg w={1000} h={322} label={e('Oben lauscht der Dev-Server nur auf localhost und ist von außen nicht erreichbar, unten auf 0.0.0.0', 'Top: the dev server listens only on localhost and cannot be reached from outside, bottom: on 0.0.0.0')}>
      <Box x={20} y={42} w={170} h={64} t="host" label={e('Browser', 'Browser')} sub="localhost:5173" />
      <Box i={2} x={20} y={192} w={170} h={64} t="host" label={e('Browser', 'Browser')} sub="localhost:5173" />
      {row(10, false, 'vite', 0)}
      {row(160, true, 'vite --host', 2)}
      <Label i={4} x={20} y={314} anchor="start" size={13}>{e('Die Weiterleitung kommt über eth0 an. Wer nur auf lo lauscht, hört sie nicht.', 'Forwarding arrives via eth0. Whoever listens on lo only does not hear it.')}</Label>
    </Svg>
    <Take i={5} label={e('Typischer Fehler', 'Typical mistake')} text={e('Der Container läuft, der Port ist veröffentlicht, trotzdem keine Antwort: Die App lauscht nur auf localhost. Spring Boot lauscht schon überall, Vite braucht --host.', 'The container runs, the port is published, still no answer: the app only listens on localhost. Spring Boot already listens everywhere, Vite needs --host.')} />
  </div>
)
