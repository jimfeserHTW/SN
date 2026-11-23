import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { PidNs, Cgroups, RunSummary, Limits, NsMap, CgroupFiles, Gates, ProofMap } from './diagrams.tsx'
import { Crowd, Privacy, Rations, Fuse, Rules, Walls } from './views.tsx'
import { NotRoot } from './tech.tsx'
import { TechMap } from '../../components/harbor/techmap.tsx'

// Isolation und Sicherheit: many containers share one machine. Ends with the whole picture of Docker.
const topic: Topic = {
  id: 'isolation',
  title: e('Isolation und Sicherheit', 'Isolation and security'),
  blurb: e('Wie sich viele Container einen Rechner teilen, ohne sich zu sehen oder zu stören.', 'How many containers share one machine without seeing or disturbing each other.'),
  strands: [{
    id: 'main',
    chapters: [
      {
        id: 'waende', title: e('Abschottung und Limits', 'Isolation and limits'),
        blurb: e('Warum Container auf einem Rechner getrennt werden müssen: Namespaces, Limits, der OOM-Kill, Rechte und wie stark die Trennung ist.', 'Why containers on one machine must be separated: namespaces, limits, the OOM kill, rights and how strong the separation is.'),
        pages: [
          { id: 'warum', title: e('Warum Trennung', 'Why separation'), summary: e('Viele Container, ein Rechner.', 'Many containers, one machine.'), slides: [
            { title: e('Viele Container, ein Rechner', 'Many containers, one machine'), view: <Crowd /> },
            { title: e('Namespaces: Jeder glaubt, er sei allein', 'Namespaces: each thinks it is alone'), view: <Privacy /> },
          ] },
          { id: 'grenzen', title: e('Grenzen', 'Limits'), summary: e('Limits, der OOM-Kill und die Rechte.', 'Limits, the OOM kill and the rights.'), slides: [
            { title: e('Limits: CPU und Speicher pro Container', 'Limits: CPU and memory per container'), view: <Rations /> },
            { title: e('Über dem Limit: der OOM-Kill', 'Over the limit: the OOM kill'), view: <Fuse /> },
            { title: e('Rechte: was ein Container darf', 'Rights: what a container may do'), view: <Rules /> },
          ] },
          { id: 'einordnung', title: e('Einordnung', 'Where it fits'), summary: e('Wie stark die Trennung ist, und das ganze Bild.', 'How strong the separation is, and the whole picture.'), slides: [
            { title: e('Schwächer getrennt als eine VM', 'Less separated than a VM'), view: <Walls /> },
            { title: e('Systemkarte: das ganze Bild', 'System map: the whole picture'), view: <TechMap known={['container', 'images', 'registry', 'client', 'daemon', 'port', 'compose', 'net', 'volumes']} focus={['ns', 'cgroups']} /> },
          ] },
        ],
      },
      {
        id: 'trennung', title: e('Wie Container getrennt werden', 'How containers are separated'),
        blurb: e('Was ein Prozess im Container sieht und wie viel er verbrauchen darf.', 'What a process in a container sees and how much it may use.'),
        pages: [
          { id: 'sicht', title: 'Isolation', summary: 'Was ein Prozess sieht und wie viel er verbrauchen darf.', slides: [
            { title: 'Ein Prozess, zwei Nummern', view: <PidNs /> },
            { title: 'cgroups: Wer wie viel verbrauchen darf', view: <Cgroups /> },
            { title: 'Grenzen auf einem geteilten Rechner', view: <Limits /> },
            { title: e('Nicht als root', 'Not as root'), view: <NotRoot /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry', 'volumes', 'net', 'port']} focus={['ns', 'cgroups']} /> },
            ] },
        ],
      },
      {
        id: 'kernel', title: 'Isolation im Kernel',
        blurb: e('Alle Namespaces, Limits als Dateien, die Schutzschichten und zum Schluss das ganze System.', 'All namespaces, limits as files, the protection layers and finally the whole system.'),
        pages: [
          { id: 'kernel', title: 'Isolation im Kernel', summary: 'Alle Namespaces, Limits als Dateien und die Schutzschichten.', slides: [
            { title: 'Namespaces: Ein Kernel, getrennte Sichten', view: <NsMap /> },
            { title: 'cgroups: Limits sind Dateien', view: <CgroupFiles /> },
            { title: 'Schutzschichten: Was ein Prozess darf', view: <Gates /> },
          ] },
          { id: 'gesamt', title: 'Alles zusammen', summary: e('Ein Befehl durch das ganze System, und wie man alles am echten Rechner nachprüft.', 'One command through the whole system, and how to check everything on a real machine.'), slides: [
            { title: 'Ein Befehl, das ganze System', view: <RunSummary /> },
            { title: 'Alles am echten System nachprüfen', view: <ProofMap /> },
          ] },
        ],
      },
    ],
  }],
}
export default topic
