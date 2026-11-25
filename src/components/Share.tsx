import { useTranslation } from 'react-i18next'
import { qr } from './qr.ts'
import { SOURCE } from './Legal.tsx'
import { DownloadSlides } from './Download.tsx'

// #/me/share: two large QR codes, one for the repository, one for the GitHub Pages site.
export const PAGES = 'https://jimfeserhtw.github.io/SN/'

function Qr({ text }: { text: string }) {
  const m = qr(text), n = m.length
  const d = m.flatMap((row, y) => row.flatMap((dark, x) => dark ? [`M${x} ${y}h1v1h-1z`] : [])).join('')
  // 4 modules of white quiet zone around the code, as the standard asks
  return <svg className="qr" viewBox={`-4 -4 ${n + 8} ${n + 8}`} shapeRendering="crispEdges" role="img" aria-label={text}><rect x={-4} y={-4} width={n + 8} height={n + 8} fill="#fff" /><path d={d} fill="#000" /></svg>
}

export function Share() {
  const { t } = useTranslation()
  return (
    <>
    <div className="qr-grid">
      {[[t('Repository'), SOURCE], [t('Website (GitHub Pages)'), PAGES]].map(([label, url]) => (
        <figure key={url} className="me-tile qr-card">
          <Qr text={url} />
          <figcaption><strong>{label}</strong><a href={url}>{url.replace(/^https:\/\//, '')}</a></figcaption>
        </figure>
      ))}
    </div>
    <div className="actions"><DownloadSlides /></div>
    </>
  )
}
