import { AXES, TITLES } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import type { Scenario } from '@/state/types'

/** Панель сценариев: состояние прототипа в ссылке. Клавиша S открывает и закрывает. */
export function ScenarioPanel() {
  const { S, route, panel } = useApp()

  return (
    <>
      <button className="sct" data-panel>⚙ Сценарии</button>
      <aside className={`sc ${panel ? 'open' : ''}`}>
        <button className="scx" data-panel>×</button>
        <h3>Сценарии</h3>
        <div className="hint">Состояние в URL — ссылку можно отправить команде. Клавиша S открывает панель.</div>
        <div>
          {(Object.entries(AXES) as [keyof Scenario, (typeof AXES)[keyof Scenario]][]).map(([k, a]) => (
            <div className="scg" key={k}>
              <label>{a.label}</label>
              <div className="sco">
                {a.opts.map(([v, t]) => (
                  <button data-axis={k} data-val={v} className={S[k] === v ? 'on' : ''} key={v}>{t}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="scg">
            <label>Экран</label>
            <div className="sco">
              {Object.entries(TITLES).map(([id, t]) => (
                <button data-go={id} className={route === id ? 'on' : ''} key={id}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="scf">
          <button data-reset>Сбросить</button>
          <button data-copylink>Скопировать ссылку</button>
        </div>
      </aside>
    </>
  )
}
