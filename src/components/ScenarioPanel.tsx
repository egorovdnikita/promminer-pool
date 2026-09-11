import { AXES, PRESETS, DEF, TITLES } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import type { Scenario } from '@/state/types'

type Key = keyof Scenario

/** Панель сценариев: состояние прототипа в ссылке. Клавиша S открывает и закрывает. */
export function ScenarioPanel() {
  const { S, U, route, panel } = useApp()
  const q = (U.scq || '').trim().toLowerCase()
  const hit = (s: string) => !q || s.toLowerCase().includes(q)

  const keys = Object.keys(AXES) as Key[]
  /* Оси, уведённые от значения по умолчанию — их подсвечиваем и считаем */
  const changed = keys.filter(k => S[k] !== DEF[k])
  const groups = [...new Set(keys.map(k => AXES[k].g))]
  const screens = Object.entries(TITLES).filter(([, t]) => hit(t))

  return (
    <>
      <button className="sct" data-panel>
        ⚙ Сценарии{changed.length > 0 && <span className="bdg">{changed.length}</span>}
      </button>
      <aside className={`sc ${panel ? 'open' : ''}`}>
        <div className="schead">
          <h3>Сценарии</h3>
          <button className="scx" data-panel aria-label="Закрыть">×</button>
        </div>
        <div className="hint">
          Состояние в ссылке — её можно отправить команде. <b>S</b> открывает панель, <b>Esc</b> закрывает.
        </div>

        <input className="scsearch" id="scq" placeholder="Найти состояние или экран" defaultValue={U.scq || ''} />

        {!q && (
          <div className="scg">
            <label>Готовые связки</label>
            <div className="scp">
              {PRESETS.map(([name, note]) => (
                <button data-preset={name} key={name}>
                  <b>{name}</b><i>{note}</i>
                </button>
              ))}
            </div>
          </div>
        )}

        {groups.map(g => {
          const inGroup = keys.filter(k => AXES[k].g === g)
            .filter(k => hit(AXES[k].label) || AXES[k].opts.some(([, t]) => hit(t)))
          if (!inGroup.length) return null
          return (
            <section className="scsec" key={g}>
              <div className="scsect">{g}</div>
              {inGroup.map(k => (
                <div className={`scg ${S[k] !== DEF[k] ? 'dirty' : ''}`} key={k}>
                  <label>{AXES[k].label}</label>
                  <div className="sco">
                    {AXES[k].opts.map(([v, t]) => (
                      <button data-axis={k} data-val={v} className={S[k] === v ? 'on' : ''} key={v}>{t}</button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )
        })}

        {(hit('Тема') || !!screens.length) && (
        <section className="scsec">
          <div className="scsect">Интерфейс</div>
          {hit('Тема') && (
          <div className="scg">
            <label>Тема</label>
            <div className="sco">
              <button data-theme-set="light" className={U.theme === 'light' ? 'on' : ''}>Светлая</button>
              <button data-theme-set="dark" className={U.theme === 'dark' ? 'on' : ''}>Тёмная</button>
              <button data-theme-set="system" className={U.theme === 'system' ? 'on' : ''}>Как в системе</button>
            </div>
          </div>
          )}
          {!!screens.length && (
            <div className="scg">
              <label>Экран</label>
              <div className="sco">
                {screens.map(([id, t]) => (
                  <button data-go={id} className={route === id ? 'on' : ''} key={id}>{t}</button>
                ))}
              </div>
            </div>
          )}
        </section>
        )}

        <div className="scf">
          <button data-reset disabled={!changed.length}>
            Сбросить{changed.length > 0 && ` (${changed.length})`}
          </button>
          <button data-copylink>Скопировать ссылку</button>
        </div>
      </aside>
    </>
  )
}
