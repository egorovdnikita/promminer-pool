import { I, MODALS, type Model } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico, Raw } from './Raw'

export function Modal({ m }: { m: Model }) {
  const { modal, U, pop } = useApp()
  if (!modal) return null
  const d = MODALS[modal]
  if (!d) return null

  const step = U.step || 0
  const steps = typeof d.steps === 'function' ? d.steps(m) : d.steps
  const foot = d.foot?.(m, step)
  const sub = typeof d.s === 'function' ? d.s(m) : d.s
  const title = typeof d.t === 'function' ? d.t(m) : d.t
  const hasFoot = !!foot || d.acts !== false
  const close = <button className="mx" data-close><Ico html={I.x} /></button>

  return (
    <div className={d.sheet ? 'mask sheet' : 'mask'} data-close>
      <div className={d.sheet ? 'modal sheet' : d.size ? 'modal ' + d.size : 'modal'}>
        {d.img ? (
          // Modal HeaderA с иллюстрацией: баннер, крестик поверх, заголовок под ним
          <div className="mhead img">
            <img src={d.img} alt="" />
            {close}
            {title && <h2 className={d.center ? 'c' : ''}>{title}</h2>}
          </div>
        ) : (
          <div className="mhead"><h2>{title}</h2>{close}</div>
        )}
        {/* Пока открыто меню контакта, тело не прокручивается: иначе
            выпадающий список обрезается краем прокручиваемой области. */}
        <div className={`mbody ${hasFoot ? '' : 'nofoot'} ${pop ? 'over' : ''} ${d.tall ? 'tall' + (d.tall > 1 ? d.tall : '') : ''}`}>
          {!!steps && (
            <div className="msteps">
              {Array.from({ length: steps }, (_, i) => <i className={i <= step ? 'on' : ''} key={i} />)}
            </div>
          )}
          {sub && <p className="s">{sub}</p>}
          <Raw html={d.b(m, step)} />
        </div>
        {foot && <div className="mfoot"><Raw html={foot} /></div>}
        {d.acts !== false && (
          <div className="mfoot">
            {steps && step < steps - 1
              ? <button className="btn" data-step={step + 1}>{d.cta || 'Подтвердить'}</button>
              : <button className="btn" data-close data-toast={d.ok || 'Готово'}>{d.cta || 'Подтвердить'}</button>}
            {!steps && <button className="btn g" data-close>{d.cancel || 'Отмена'}</button>}
          </div>
        )}
      </div>
    </div>
  )
}
