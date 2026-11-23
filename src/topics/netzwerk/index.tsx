import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Ports, Networks, NetModes, Doors, NetBridge, PortPath, NetKernel, Scale } from './diagrams.tsx'
import { OwnLine, Numbers, PhoneBook, Zones, HostCall } from './views.tsx'
import { ListenAddress } from './tech.tsx'
import { TechMap } from '../../components/harbor/techmap.tsx'

// Netzwerk: how containers are reached and find each other. From ports and DNS down to veth, bridge and NAT.
const topic: Topic = {
  id: 'netzwerk',
  title: e('Netzwerk', 'Networking'),
  blurb: e('Wie Container erreichbar sind und sich gegenseitig finden.', 'How containers are reached and how they find each other.'),
  strands: [{
    id: 'main',
    chapters: [
      {
        id: 'erreichen', title: e('Wie Container sich erreichen', 'How containers reach each other'),
        blurb: e('Eigene IPs, Ports, der DNS von Docker, getrennte Netze und der Weg zum eigenen Rechner.', 'IPs of their own, ports, Docker’s DNS, separate networks and the way to your own machine.'),
        pages: [
          { id: 'aussen', title: e('Von außen', 'From outside'), summary: e('Eigene IPs und veröffentlichte Ports.', 'IPs of their own and published ports.'), slides: [
            { title: e('Jeder Container hat seine eigene IP', 'Every container has its own IP'), view: <OwnLine /> },
            { title: e('Ports: außen frei wählbar, aber nur einmal', 'Ports: free to choose outside, but only once'), view: <Numbers /> },
          ] },
          { id: 'innen', title: e('Untereinander', 'Among each other'), summary: e('Namen statt IPs, getrennte Netze, der eigene Rechner.', 'Names instead of IPs, separate networks, your own machine.'), slides: [
            { title: e('DNS: Namen statt IPs', 'DNS: names instead of IPs'), view: <PhoneBook /> },
            { title: e('Getrennte Netze', 'Separate networks'), view: <Zones /> },
            { title: e('Vom Container zum eigenen Rechner', 'From the container to your own machine'), view: <HostCall /> },
            { title: e('Systemkarte: Netz und Ports', 'System map: network and ports'), view: <TechMap known={['container', 'images', 'registry', 'client', 'daemon', 'compose', 'volumes']} focus={['net', 'port']} /> },
          ] },
        ],
      },
      {
        id: 'ports-netze', title: e('Ports und Netze im Einsatz', 'Ports and networks in practice'),
        blurb: e('Ports veröffentlichen, Services über Namen finden, die Netzwerk-Modi und wer von wo hineinkommt.', 'Publishing ports, finding services by name, the network modes and who gets in from where.'),
        pages: [
          { id: 'zugang', title: e('Von außen hinein', 'Getting in from outside'), summary: e('Ports und die vier Wege in einen Container.', 'Ports and the four ways into a container.'), slides: [
            { title: 'Ports: von außen in den Container', view: <Ports /> },
            { title: 'Vier Türen in einen Container', view: <Doors /> },
            { title: e('Läuft, aber nicht erreichbar: localhost gegen 0.0.0.0', 'Running but unreachable: localhost versus 0.0.0.0'), view: <ListenAddress /> },
          ] },
          { id: 'netze', title: e('Zwischen Containern', 'Between containers'), summary: e('Namen statt Adressen und die drei Netzwerk-Modi.', 'Names instead of addresses and the three network modes.'), slides: [
            { title: 'Netzwerke: Services finden sich über Namen', view: <Networks /> },
            { title: 'Drei Netzwerk-Modi', view: <NetModes /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'volumes']} focus={['net', 'port']} /> },
            ] },
        ],
      },
      {
        id: 'kernel', title: 'Netzwerk im Kernel',
        blurb: e('Wie Container im Host verkabelt sind, wie ein Paket seinen Weg findet und was ein Compose-Netz wirklich ist.', 'How containers are wired in the host, how a packet finds its way and what a Compose network really is.'),
        pages: [
          { id: 'kabel', title: 'Netzwerk im Kernel', summary: 'Wie Container verkabelt sind und wie ein Paket seinen Weg findet.', slides: [
            { title: 'Die Verkabelung im Host', view: <NetBridge /> },
            { title: 'Ein Paket durch -p 8080:80', view: <PortPath /> },
          ] },
          { id: 'compose', title: 'Netze und Skalierung', summary: 'Was Compose im Host anlegt und wie mehrere Container einen Namen teilen.', slides: [
            { title: 'Was ein Compose-Netz wirklich ist', view: <NetKernel /> },
            { title: 'Einen Service skalieren', view: <Scale /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'volumes', 'port']} focus={['net']} /> },
            ] },
        ],
      },
    ],
  }],
}
export default topic
