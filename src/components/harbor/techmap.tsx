import type { ReactNode } from 'react'
import { Svg, Box, Arrow, Zone } from '../Svg.tsx'
import { e } from '../quizModel.ts'

// The system map: closes the overview sub-chapter of a topic and later sub-chapters.
// Same rule: what is known so far is drawn solid, what is new is highlighted, the rest stays pale.
export type TPart = 'client' | 'compose' | 'daemon' | 'runtime' | 'container' | 'ns' | 'cgroups' | 'net' | 'overlay' | 'images' | 'layers' | 'volumes' | 'registry' | 'port'
const Q = ({ on, hot, children }: { on: boolean; hot: boolean; children: ReactNode }) =>
  <g opacity={on ? 1 : .18} style={hot ? { filter: 'drop-shadow(0 0 0 var(--blue)) drop-shadow(0 0 6px rgba(29, 99, 237, .55))' } : undefined}>{children}</g>

export function TechMap({ known, focus = [] }: { known: TPart[]; focus?: TPart[] }) {
  const on = (p: TPart) => known.includes(p) || focus.includes(p), hot = (p: TPart) => focus.includes(p)
  const P = (p: TPart, node: ReactNode) => <Q on={on(p)} hot={hot(p)}>{node}</Q>
  return (
    <Svg w={1000} h={470} label={e('Die Technikkarte: Userspace, Kernel und Festplatte eines Rechners mit Docker', 'The technical map: user space, kernel and disk of a machine with Docker')}>
      <Zone x={0} y={0} w={820} h={470} label={e('Host · ein Linux-Rechner', 'Host · a Linux machine')} />
      <Zone x={16} y={34} w={788} h={170} t="host" label="USERSPACE" />
      {P('client', <Box x={32} y={70} w={130} h={56} t="app" label="docker" sub="CLI" mono size={15} />)}
      {P('compose', <Box x={32} y={136} w={130} h={56} t="reg" label="compose.yaml" size={13} mono />)}
      {P('daemon', <Box x={196} y={70} w={140} h={56} t="engine" label="dockerd" sub="Daemon" />)}
      {P('runtime', <Box x={370} y={70} w={150} h={56} t="runtime" label="containerd" sub="+ runc" />)}
      {P('container', <>{(['frontend', 'api', 'db'] as const).map((s, k) => <Box key={s} x={554 + k * 82} y={70} w={76} h={56} t="container" label={s} size={13} />)}</>)}
      {P('daemon', <Arrow d="M166 98 H192" />)}
      {P('runtime', <Arrow d="M340 98 H366" />)}
      {P('container', <Arrow d="M524 98 H550" />)}
      <Zone x={16} y={216} w={788} h={112} t="kernel" label={e('KERNEL', 'KERNEL')} />
      {P('ns', <Box x={32} y={256} w={180} h={56} t="kchip" label="Namespaces" sub={e('was er sieht', 'what it sees')} />)}
      {P('cgroups', <Box x={224} y={256} w={180} h={56} t="kchip" label="cgroups" sub={e('wie viel er darf', 'how much it may use')} />)}
      {P('net', <Box x={608} y={256} w={180} h={56} t="kchip" label={e('Netz', 'Network')} sub="bridge · NAT" />)}
      {P('overlay', <Box x={416} y={256} w={180} h={56} t="kchip" label="OverlayFS" sub={e('Schichten zu einem', 'layers into one')} />)}
      <Zone x={16} y={340} w={788} h={116} t="reg" label={e('FESTPLATTE', 'DISK')} />
      {P('images', <Box x={32} y={380} w={244} h={56} t="app" label="Images" sub={e('nur lesbare Schichten', 'read-only layers')} />)}
      {P('layers', <Box x={288} y={380} w={244} h={56} t="app" label={e('Schreibschichten', 'Writable layers')} sub={e('eine pro Container', 'one per container')} />)}
      {P('volumes', <Box x={544} y={380} w={244} h={56} t="app" label="Volumes" sub={e('bleiben', 'stay')} />)}
      {P('registry', <><Box x={840} y={60} w={150} h={64} t="reg" label="Registry" sub="Docker Hub" /><Arrow d="M836 80 H830 V22 H266 V66" kind="back" /></>)}
      {P('port', <><Box x={840} y={256} w={150} h={56} t="ok" label=":8080" sub={e('Port am Host', 'port on the host')} mono /><Arrow d="M836 284 H792" /></>)}
    </Svg>
  )
}
