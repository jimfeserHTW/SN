import type { Topic } from '../../components/types.ts'
import { e } from '../../components/quizModel.ts'
import { Pull, Overlay, CopyOnWrite, SharedLayers, BuildFlow, DiskMap } from './diagrams.tsx'
import { Sealed, Layers, PackingList, Labels, Warehouses, Shared, Uses } from './views.tsx'
import { DockerfileLines, BuildCache, MultiStage, TagsDigests, LeanBase, ImageFiles, Prune } from './tech.tsx'
import { TechMap } from '../../components/harbor/techmap.tsx'

// Images und Build: what is shipped. From the read-only image (overview) to layers on disk.
const topic: Topic = {
  id: 'images',
  title: e('Images und Build', 'Images and builds'),
  blurb: e('Was ein Image ist, woher es kommt, wie man es baut und schlank hält.', 'What an image is, where it comes from, how to build it and keep it lean.'),
  strands: [{
    id: 'main',
    chapters: [
      {
        id: 'bauplan', title: e('Vom Dockerfile zum Image', 'From Dockerfile to image'),
        blurb: e('Was ein Image ist, woraus es besteht, wie es gebaut, getaggt und geteilt wird.', 'What an image is, what it is made of, how it is built, tagged and shared.'),
        pages: [
          { id: 'plan', title: e('Das Image', 'The image'), summary: e('Nur lesbar, aus Schichten gebaut, nach einem Dockerfile.', 'Read-only, made of layers, built from a Dockerfile.'), slides: [
            { title: e('Ein Image ändert sich nie', 'An image never changes'), view: <Sealed /> },
            { title: e('Schicht für Schicht', 'Layer by layer'), view: <Layers /> },
            { title: e('Aus dem Dockerfile wird ein Image', 'A Dockerfile becomes an image'), view: <PackingList /> },
          ] },
          { id: 'teilen', title: e('Taggen und teilen', 'Tagging and sharing'), summary: e('Tags, die Registry und warum Updates klein sind.', 'Tags, the registry and why updates are small.'), slides: [
            { title: e('Tags: Name und Version', 'Tags: name and version'), view: <Labels /> },
            { title: e('Registry und lokale Images', 'Registry and local images'), view: <Warehouses /> },
            { title: e('Gleiche Schichten nur einmal', 'The same layers only once'), view: <Shared /> },
          ] },
          { id: 'fertig', title: e('Fertige Images', 'Ready-made images'), summary: e('Was es alles schon gibt, und das Bild bis hierher.', 'What already exists, and the picture so far.'), slides: [
            { title: e('Wofür Docker genutzt wird', 'What Docker is used for'), view: <Uses /> },
            { title: e('Systemkarte: Images und Registry', 'System map: images and registry'), view: <TechMap known={['container', 'client', 'daemon', 'port', 'compose', 'net']} focus={['images', 'registry']} /> },
          ] },
        ],
      },
      {
        id: 'holen-bauen', title: e('Images holen und bauen', 'Pulling and building images'),
        blurb: e('Wie ein Image aus der Registry ankommt und wie aus einem Ordner ein eigenes Image wird.', 'How an image arrives from the registry and how a folder becomes an image of your own.'),
        pages: [
          { id: 'holen', title: e('Holen und bauen', 'Pulling and building'), summary: e('docker pull und docker build Schritt für Schritt.', 'docker pull and docker build step by step.'), slides: [
            { title: 'docker pull: Wie ein Image ankommt', view: <Pull /> },
            { title: e('Tags und Digests', 'Tags and digests'), view: <TagsDigests /> },
            { title: e('Das Dockerfile Zeile für Zeile', 'The Dockerfile line by line'), view: <DockerfileLines /> },
            { title: 'build: Vom Ordner zum Image', view: <BuildFlow /> },
            { title: e('Der Build-Cache: warum die Reihenfolge zählt', 'The build cache: why the order matters'), view: <BuildCache /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container']} focus={['images', 'registry']} /> },
            ] },
        ],
      },
      {
        id: 'schichten', title: e('Schichten und schlanke Images', 'Layers and lean images'),
        blurb: e('Wie aus Schichten ein Dateisystem wird und warum viele Container wenig Platz brauchen.', 'How layers become a file system and why many containers need little space.'),
        pages: [
          { id: 'schichten', title: 'Images und Layer', summary: 'Wie ein Image auf den Rechner kommt und wie aus Schichten ein Dateisystem wird.', slides: [
            { title: 'Aus Schichten wird ein Dateisystem', view: <Overlay /> },
            { title: 'Copy-on-Write: Lesen, Ändern, Löschen', view: <CopyOnWrite /> },
            { title: 'Warum viele Container wenig Platz brauchen', view: <SharedLayers /> },
            { title: e('Multi-Stage: bauen mit Maven, ausliefern mit JRE', 'Multi-stage: build with Maven, ship with a JRE'), view: <MultiStage /> },
            { title: e('Basis-Image und .dockerignore', 'Base image and .dockerignore'), view: <LeanBase /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'images', 'registry']} focus={['overlay', 'layers']} /> },
            ] },
        ],
      },
      {
        id: 'festplatte', title: e('Images auf der Festplatte', 'Images on disk'),
        blurb: e('Welche Ordner hinter Images, Containern und Volumes stehen.', 'Which folders stand behind images, containers and volumes.'),
        pages: [
          { id: 'platte', title: 'Docker auf der Platte', summary: 'Welche Ordner hinter Images, Containern und Volumes stehen.', slides: [
            { title: 'Was wo auf der Festplatte liegt', view: <DiskMap /> },
            { title: e('Ein Image als Dateien', 'An image as files'), view: <ImageFiles /> },
            { title: e('Aufräumen: was Platz frisst', 'Cleaning up: what eats space'), view: <Prune /> },
            { title: e('Technikkarte: das Bild bis hierher', 'Technical map: the picture so far'), view: <TechMap known={['client', 'daemon', 'container', 'registry', 'overlay', 'layers']} focus={['images', 'volumes']} /> },
            ] },
        ],
      },
    ],
  }],
}
export default topic
