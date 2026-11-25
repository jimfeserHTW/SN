import { createContext, useContext, useLayoutEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/** Steps inside one slide: the arrow keys walk through them before the deck moves on. -1 means "the last step". */
export const StepCtx = createContext<{ step: number; setStep: (s: number) => void; register: (n: number) => void }>({ step: 0, setStep: () => {}, register: () => {} })

/** One slide, several steps: clickable step tabs on top, below either
 *  - `render(step)`: ONE scene that stays mounted and animates from step to step (shared elements are never rebuilt), or
 *  - `scenes`: separate scenes, each built in fresh (for steps that share nothing). */
export function Stepper({ labels, render, scenes }: { labels?: string[]; render?: (step: number) => ReactNode; scenes?: { label: string; view: ReactNode }[] }) {
  const { t } = useTranslation()
  const { step, setStep, register } = useContext(StepCtx)
  const names = scenes ? scenes.map(sc => sc.label) : labels ?? []
  const n = names.length
  useLayoutEffect(() => register(n), [n, register])
  const s = step < 0 ? n - 1 : Math.min(step, n - 1)
  return (
    <div className="stepper">
      <nav className="steps" aria-label={t('Steps')}>
        {names.map((label, k) => (
          <button key={k} type="button" aria-current={k === s ? 'step' : undefined} data-done={k < s || undefined} onClick={() => setStep(k)}>
            <b>{k + 1}</b>{t(label)}
          </button>
        ))}
      </nav>
      {/* every step is laid out invisibly in the same cell, so the slide keeps the height of its tallest step and never jumps */}
      <div className="stepper-stack">
        {names.map((_, k) => <div key={k} className="stepper-ghost" aria-hidden>{scenes ? scenes[k].view : render?.(k)}</div>)}
        {scenes ? <div className="stepper-scene" key={s}>{scenes[s].view}</div> : <div className="stepper-scene">{render?.(s)}</div>}
      </div>
    </div>
  )
}
