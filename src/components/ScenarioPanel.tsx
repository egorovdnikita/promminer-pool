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
  const changed = keys.filter((k) => S[k] !== DEF[k])
  const groups = [...new Set(keys.map((k) => AXES[k].g))]
  const screens = Object.entries(TITLES).filter(([, t]) => hit(t))
  const onlyDirty = !!U.scdirty
  const saved = U.saved || []

  /* Ось попадает в список, если подходит под поиск и под фильтр «только изменённые» */
  const visible = (k: Key) =>
    (!onlyDirty || S[k] !== DEF[k]) &&
    (hit(AXES[k].label) || AXES[k].opts.some(([, t]) => hit(t)))

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

        <div className="scbar">
          <input className="scsearch" id="scq" placeholder="Найти состояние или экран" defaultValue={U.scq || ''} />
          <button className={`scchip ${onlyDirty ? 'on' : ''}`} data-onlydirty title="Показать только изменённые оси">
            Изменённые{changed.length > 0 && ` ${changed.length}`}
          </button>
          <button className="scchip" data-rand title="Случайные значения всех осей">Случайный</button>
        </div>

        {!q && !onlyDirty && (
          <>
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

            <div className="scg">
              <label>Мои сценарии</label>
              <div className="scsave">
                <input id="scname" placeholder="Название текущего набора" />
                <button data-save disabled={!changed.length}>Сохранить</button>
              </div>
              {saved.length > 0 ? (
                <div className="scp">
                  {saved.map((s) => (
                    <div className="scrow" key={s.name}>
                      <button data-apply={s.name}>
                        <b>{s.name}</b><i>{Object.keys(s.axes).length} осей</i>
                      </button>
                      <button className="scdel" data-delsave={s.name} aria-label="Удалить">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="scnote">Настройте оси и сохраните набор — он останется в этом браузере.</p>
              )}
            </div>

            <div className="scg">
              <label>Ссылка со сценарием</label>
              <div className="scsave">
                <input id="scimp" placeholder="Вставьте ссылку и нажмите «Открыть»" />
                <button data-scimport>Открыть</button>
              </div>
            </div>
          </>
        )}

        {groups.map((g) => {
          const inGroup = keys.filter((k) => AXES[k].g === g).filter(visible)
          if (!inGroup.length) return null
          const off = (U.scgrp || []).includes(g)
          const dirty = inGroup.filter((k) => S[k] !== DEF[k]).length
          return (
            <section className="scsec" key={g}>
              <button className={`scsect ${off ? 'off' : ''}`} data-scgrp={g}>
                {g}{dirty > 0 && <span className="scnum">{dirty}</span>}
                <span className="scarr">{off ? '+' : '−'}</span>
              </button>
              {!off && inGroup.map((k) => (
                <div className={`scg ${S[k] !== DEF[k] ? 'dirty' : ''}`} key={k}>
                  <label>
                    {AXES[k].label}
                    {S[k] !== DEF[k] && (
                      <button className="scundo" data-axreset={k} title="Вернуть значение по умолчанию">↺</button>
                    )}
                  </label>
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

        {!onlyDirty && (hit('Тема') || !!screens.length) && (
          <section className="scsec">
            <div className="scsect plain">Интерфейс</div>
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
