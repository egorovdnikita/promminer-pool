import { AXES, AXCAT, PRESETS, DEF, SCREEN_NAMES, TITLES, MODALS } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import type { Scenario } from '@/state/types'

type Key = keyof Scenario

const TABS: [NonNullable<ReturnType<() => 'ax' | 'sets' | 'go'>>, string][] = [
  ['ax', 'Оси'], ['sets', 'Наборы'], ['go', 'Переходы'],
]
const WIDTHS = [380, 520, 720]

/** У пяти окон заголовок пустой или считается от строки таблицы — им нужны свои подписи. */
const MODAL_NAMES: Record<string, string> = {
  noteinfo: 'Уведомление', gdel: 'Удалить группу', tdel: 'Удалить тег',
  levels: 'Уровни комиссии', acctdel: 'Удаление аккаунта',
}
/** Все модалки прототипа списком: любую можно открыть поверх текущего экрана. */
const modalList = () => Object.keys(MODALS)
  .map((k) => {
    const t = MODALS[k].t
    return [k, MODAL_NAMES[k] || (typeof t === 'function' ? '' : t) || k] as [string, string]
  })
  .sort((a, b) => a[1].localeCompare(b[1], 'ru'))

/** Панель сценариев: состояние прототипа в ссылке. Клавиша S открывает и закрывает. */
export function ScenarioPanel() {
  const { S, U, route, panel } = useApp()
  const q = (U.scq || '').trim().toLowerCase()
  const hit = (s: string) => !q || s.toLowerCase().includes(q)

  const keys = Object.keys(AXES) as Key[]
  /* Оси, уведённые от значения по умолчанию — их подсвечиваем и считаем */
  const changed = keys.filter((k) => S[k] !== DEF[k])
  const pins = (U.scpin || []).filter((k) => k in AXES) as Key[]
  const tab = U.sctab || 'ax'
  const onlyDirty = !!U.scdirty
  const onlyPin = !!U.sconly
  const saved = U.saved || []
  const hist = U.schist || []
  const width = U.scw || 420
  const collapsed = U.scgrp || []

  /* Ось попадает в список, если подходит под поиск и под активные фильтры */
  const visible = (k: Key) =>
    (!onlyDirty || S[k] !== DEF[k]) &&
    (!onlyPin || pins.includes(k)) &&
    (hit(AXES[k].label) || hit(AXES[k].g) || hit(AXES[k].note || '') ||
      AXES[k].opts.some(([, t]) => hit(t)))

  const screens = Object.entries(TITLES)
    .map(([id, t]) => [id, SCREEN_NAMES[id] || t] as [string, string])
    .filter(([, t]) => hit(t))
  const modals = modalList().filter(([, t]) => hit(t))

  const valOf = (k: Key) => (AXES[k].opts.find(([v]) => v === S[k]) || ['', S[k]])[1]

  const axisRow = (k: Key) => (
    <div className={`scg ${S[k] !== DEF[k] ? 'dirty' : ''}`} key={k}>
      <label>
        <span className="scl">{AXES[k].label}</span>
        <button
          className={`scpin ${pins.includes(k) ? 'on' : ''}`}
          data-scpin={k}
          title={pins.includes(k) ? 'Открепить' : 'Закрепить наверху'}
        >★</button>
        {S[k] !== DEF[k] && (
          <button className="scundo" data-axreset={k} title="Вернуть значение по умолчанию">↺</button>
        )}
      </label>
      {AXES[k].note && <p className="scdesc">{AXES[k].note}</p>}
      <div className="sco">
        {AXES[k].opts.map(([v, t]) => (
          <button data-axis={k} data-val={v} className={S[k] === v ? 'on' : ''} key={v}>{t}</button>
        ))}
      </div>
    </div>
  )

  const groupSection = (g: string) => {
    const inGroup = keys.filter((k) => AXES[k].g === g).filter(visible)
    if (!inGroup.length) return null
    const off = collapsed.includes(g)
    const dirty = inGroup.filter((k) => S[k] !== DEF[k]).length
    return (
      <section className="scsec" key={g}>
        <div className="scshead">
          <button className={`scsect ${off ? 'off' : ''}`} data-scgrp={g}>
            <span className="scarr">{off ? '▸' : '▾'}</span>
            {g}
            <span className="scqty">{inGroup.length}</span>
            {dirty > 0 && <span className="scnum">{dirty}</span>}
          </button>
          <button className="scmini" data-grprand={g} title="Случайные значения в группе">⟳</button>
          <button className="scmini" data-grpreset={g} title="Сбросить группу" disabled={!dirty}>↺</button>
        </div>
        {!off && inGroup.map(axisRow)}
      </section>
    )
  }

  return (
    <>
      <button className="sct" data-panel>
        ⚙ Сценарии{changed.length > 0 && <span className="bdg">{changed.length}</span>}
      </button>
      <aside
        className={`sc ${panel ? 'open' : ''} ${U.scside === 'left' ? 'dockl' : ''}`}
        style={{ width }}
      >
        <div className="schead">
          <h3>Сценарии</h3>
          {changed.length > 0 && <span className="scbadge">{changed.length} из {keys.length}</span>}
          <button className="scx" data-scside title="Перенести панель на другую сторону">⇄</button>
          {WIDTHS.map((w) => (
            <button
              key={w}
              className={`scw ${width === w ? 'on' : ''}`}
              data-scw={w}
              title={`Ширина ${w}`}
            >{w === 380 ? 'S' : w === 520 ? 'M' : 'L'}</button>
          ))}
          <button className="scx" data-panel aria-label="Закрыть">×</button>
        </div>

        <div className="sctabs">
          {TABS.map(([id, t]) => (
            <button key={id} className={tab === id ? 'on' : ''} data-sctab={id}>{t}</button>
          ))}
        </div>

        <div className="scbar">
          <input className="scsearch" id="scq" placeholder="Найти ось, значение или экран" defaultValue={U.scq || ''} />
          {tab === 'ax' && (
            <>
              <button className={`scchip ${onlyDirty ? 'on' : ''}`} data-onlydirty title="Только изменённые оси">
                Изменённые{changed.length > 0 && ` ${changed.length}`}
              </button>
              <button className={`scchip ${onlyPin ? 'on' : ''}`} data-onlypin title="Только закреплённые оси">
                ★{pins.length > 0 && ` ${pins.length}`}
              </button>
              <button className="scchip" data-sccol="all" title="Свернуть все группы">Свернуть</button>
              <button className="scchip" data-sccol="none" title="Развернуть все группы">Развернуть</button>
              <button className="scchip" data-rand title="Случайные значения всех осей">Случайный</button>
            </>
          )}
        </div>

        <div className="scbody">
        {tab === 'ax' && (
          <>
            {!!pins.length && !onlyDirty && (
              <section className="scsec">
                <div className="scshead"><div className="scsect plain">Закреплённые</div></div>
                {pins.filter(visible).map(axisRow)}
              </section>
            )}
            {AXCAT.map(([cat, gs]) => {
              const body = gs.map(groupSection).filter(Boolean)
              if (!body.length) return null
              return (
                <div className="sccat" key={cat}>
                  <div className="sccath">{cat}</div>
                  {body}
                </div>
              )
            })}
            {!keys.filter(visible).length && (
              <p className="scnote">Ничего не нашлось. Сбросьте поиск или фильтры.</p>
            )}
          </>
        )}

        {tab === 'sets' && (
          <>
            <div className="scg">
              <label><span className="scl">Готовые связки</span></label>
              <p className="scdesc">Обычный клик заменяет весь сценарий, «+» — накладывает набор поверх текущего.</p>
            </div>
            {[...new Set(PRESETS.map((p) => p[3]))].map((cat) => {
              const list = PRESETS.filter((p) => p[3] === cat && (hit(p[0]) || hit(p[1])))
              if (!list.length) return null
              return (
                <section className="scsec" key={cat}>
                  <div className="scshead"><div className="scsect plain">{cat}</div></div>
                  <div className="scp">
                    {list.map(([name, note, axes]) => (
                      <div className="scrow" key={name}>
                        <button data-preset={name}>
                          <b>{name}</b><i>{note} · {Object.keys(axes).length} осей</i>
                        </button>
                        <button className="scadd" data-preset={name} data-over title="Наложить поверх текущего">+</button>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}

            <section className="scsec">
              <div className="scshead"><div className="scsect plain">Мои сценарии</div></div>
              <div className="scsave">
                <input id="scname" placeholder="Название текущего набора" />
                <button data-save disabled={!changed.length}>Сохранить</button>
              </div>
              {saved.length > 0 ? (
                <div className="scp">
                  {saved.map((s) => (
                    <div className="scrow" key={s.name}>
                      <button data-apply={s.name}>
                        <b>{s.name}</b>
                        <i>{Object.keys(s.axes).length} осей{s.at ? ` · ${new Date(s.at).toLocaleDateString('ru')}` : ''}</i>
                      </button>
                      <button className="scadd" data-apply={s.name} data-over title="Наложить поверх текущего">+</button>
                      <button className="scdel" data-delsave={s.name} aria-label="Удалить">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="scnote">Настройте оси и сохраните набор — он останется в этом браузере.</p>
              )}
            </section>

            <section className="scsec">
              <div className="scshead"><div className="scsect plain">Обмен</div></div>
              <div className="scsave">
                <input id="scimp" placeholder="Вставьте ссылку и нажмите «Открыть»" />
                <button data-scimport>Открыть</button>
              </div>
              <div className="scbar">
                <button className="scchip" data-copylink>Скопировать ссылку</button>
                <button className="scchip" data-copyjson>Скопировать JSON</button>
              </div>
            </section>

            {!!changed.length && (
              <section className="scsec">
                <div className="scshead"><div className="scsect plain">Что отличается от умолчаний</div></div>
                <div className="scdiff">
                  {changed.map((k) => (
                    <div key={k}>
                      <span className="dk">{AXES[k].label}</span>
                      <span className="dv">
                        {(AXES[k].opts.find(([v]) => v === DEF[k]) || ['', DEF[k]])[1]}
                        {' → '}<b>{valOf(k)}</b>
                      </span>
                      <button className="scundo" data-axreset={k} title="Вернуть значение по умолчанию">↺</button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {tab === 'go' && (
          <>
            <section className="scsec">
              <div className="scshead"><div className="scsect plain">Экраны<span className="scqty">{screens.length}</span></div></div>
              <div className="sco">
                {screens.map(([id, t]) => (
                  <button data-go={id} className={route === id ? 'on' : ''} key={id}>{t}</button>
                ))}
              </div>
            </section>
            <section className="scsec">
              <div className="scshead"><div className="scsect plain">Модальные окна<span className="scqty">{modals.length}</span></div></div>
              <p className="scdesc">Открываются поверх текущего экрана — удобно смотреть окно в нужном сценарии.</p>
              <div className="sco">
                {modals.map(([k, t]) => (
                  <button data-modal={k} key={k}>{t}</button>
                ))}
              </div>
            </section>
          </>
        )}

        </div>

        <div className="scf">
          <button data-scback disabled={!hist.length} title="Шаг назад по истории">
            ↩ Отменить{hist.length > 0 && ` (${hist.length})`}
          </button>
          <button data-reset disabled={!changed.length}>
            Сбросить{changed.length > 0 && ` (${changed.length})`}
          </button>
          <button data-copylink>Ссылка</button>
          <span className="schint"><b>S</b> — панель, <b>/</b> — поиск, <b>Esc</b> — закрыть</span>
        </div>
      </aside>
    </>
  )
}
