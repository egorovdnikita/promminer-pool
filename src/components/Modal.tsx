import { I, MODALS, type Model } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico, Raw } from './Raw'

export function Modal({ m }: { m: Model }) {
  const { modal, U } = useApp()
  if (!modal) return null
  const d = MODALS[modal]
  if (!d) return null

  const step = U.step || 0
  const steps = typeof d.steps === 'function' ? d.steps(m) : d.steps

  return (
    <div className="mask" data-close>
      <div className="modal">
        <div className="mhead">
          <h2>{d.t}</h2>
          <button className="mx" data-close><Ico html={I.x} /></button>
        </div>
        {!!steps && (
          <div className="msteps">
            {Array.from({ length: steps }, (_, i) => <i className={i <= step ? 'on' : ''} key={i} />)}
          </div>
        )}
        {d.s && <p className="s">{d.s}</p>}
        <Raw html={d.b(m, step)} />
        {d.acts !== false && (
          <div className="acts">
            {steps && step < steps - 1
              ? <button className="btn" data-step={step + 1}>{d.cta || 'Подтвердить'}</button>
              : <button className="btn" data-close data-toast={d.ok || 'Готово'}>{d.cta || 'Подтвердить'}</button>}
            {!steps && <button className="btn g" data-close>Отмена</button>}
          </div>
        )}
      </div>
    </div>
  )
}
