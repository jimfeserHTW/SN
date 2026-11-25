import { useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import { deckOf, topics } from '../content.ts'
import { Visuals } from './Visuals.tsx'
import { StepCtx } from './Steps.tsx'

const W = 1920, H = 1080, PAD = 72 // 16:9 page, matches .pdf-host in present.css
const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
const safe = (s: string) => s.replace(/[\\/:*?"<>|]/g, '-').trim()
const nn = (i: number) => String(i + 1).padStart(2, '0')

/** Renders every slide offscreen, one PDF per slide deck, one folder per topic, all in one ZIP. */
export function DownloadSlides() {
  const { t } = useTranslation()
  const [done, setDone] = useState<[number, number] | null>(null)

  const run = async () => {
    const [{ jsPDF }, { default: JSZip }, { toJpeg }] = await Promise.all([import('jspdf'), import('jszip'), import('html-to-image')])
    const total = topics.reduce((a, tp) => a + tp.strands.reduce((b, s) => b + s.chapters.reduce((c, ch) => c + deckOf(ch).length, 0), 0), 0)
    const host = document.createElement('div')
    host.className = 'pdf-host pres' // .pres gives the slide canvas background
    document.body.append(host)
    const root = createRoot(host)
    const zip = new JSZip()
    let k = 0
    setDone([0, total])
    try {
      await document.fonts.ready
      for (const [ti, tp] of topics.entries()) {
        const dir = zip.folder(`${nn(ti)} ${safe(t(tp.title))}`)!
        const chapters = tp.strands.flatMap(s => s.chapters)
        for (const [ci, ch] of chapters.entries()) {
          let pdf: InstanceType<typeof jsPDF> | undefined
          for (const { slide } of deckOf(ch)) {
            // one PDF page per step (sub-slide); a slide without a Stepper has a single step
            let steps = 1
            for (let step = 0; step < steps; step++) {
              const ctx = { step, setStep: () => {}, register: (n: number) => { steps = n } }
              flushSync(() => root.render(
                <main className="stage">
                  <article className="slide">
                    <h1>{t(slide.title)}</h1>
                    <StepCtx.Provider value={ctx}>{slide.view ?? (slide.visual && <Visuals v={slide.visual} />)}</StepCtx.Provider>
                  </article>
                </main>,
              ))
              await frame()
              // same fit as Presentation: 76% of the width, or less if the height runs out
              const node = host.querySelector<HTMLElement>('.slide')!
              node.style.setProperty('--fit', String(Math.min(W * .76 / node.offsetWidth, (H - 2 * PAD) / node.offsetHeight)))
              // jump every build-in animation to its last frame: the same picture as waiting until all is shown, without the wait
              for (const an of host.getAnimations({ subtree: true })) if (an.effect?.getTiming().iterations !== Infinity) an.finish()
              await frame()
              // html-to-image loses SVG paint that comes from CSS variables (fill: var(--bg)), so bake it in for the capture
              const svg = [...host.querySelectorAll<SVGElement>('svg *')].map(el => ({ el, fill: el.style.fill, stroke: el.style.stroke }))
              for (const { el } of svg) { const c = getComputedStyle(el); el.style.fill = c.fill; el.style.stroke = c.stroke }
              const img = await toJpeg(host, { width: W, height: H, pixelRatio: 1, quality: .85, style: { position: 'static' } }) // the clone must not inherit the offscreen offset
              for (const { el, fill, stroke } of svg) { el.style.fill = fill; el.style.stroke = stroke } // React reuses these nodes for the next step
              if (pdf) pdf.addPage([W, H], 'landscape')
              else pdf = new jsPDF({ unit: 'px', format: [W, H], orientation: 'landscape', hotfixes: ['px_scaling'] })
              pdf.addImage(img, 'JPEG', 0, 0, W, H)
            }
            setDone([++k, total])
          }
          if (pdf) dir.file(`${nn(ci)} ${safe(t(ch.title))}.pdf`, pdf.output('blob'))
        }
      }
      const a = document.createElement('a')
      a.href = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }))
      a.download = 'StudyNothing-Folien.zip'
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } finally {
      root.unmount()
      host.remove()
      setDone(null)
    }
  }

  return (
    <button className="btn ghost" type="button" onClick={done ? undefined : run} aria-disabled={!!done} aria-live="polite">
      {done ? t('Creating PDFs… {{k}} / {{n}}', { k: done[0], n: done[1] }) : t('Download all slides (ZIP)')}
    </button>
  )
}
