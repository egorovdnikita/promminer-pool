import { useEffect } from 'react'
import {
  CHECK, I, NOTIF_N, PROF, TITLES, acctSummary, nf, notifications, profTabs, type Model,
} from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico, Raw } from './Raw'

/* Хедер по DS: белая панель, снизу radius-l 24, padding 20/8, ряд px16 gap16.
   Контролы h48, border 1px, radius-m 16, без тени. Заголовок H3 32/38 SemiBold. */
/* Вкладки профиля по макету — часть шапки, а не отдельный блок страницы. */
const PROFILE_ROUTES = [...PROF.map(([id]) => id), 'notifconfig']

export function Header({ m }: { m: Model }) {
  const { S, route, pop } = useApp()
  const n = NOTIF_N[S.notif]
  const acct = S.acct === 'main' ? 'natarusso' : 'alfred'
  /* На проде заголовок вкладки — «<Раздел> - Promminer» */
  useEffect(() => {
    document.title = TITLES[route] ? `${TITLES[route]} - Promminer` : 'Promminer Pool'
  }, [route])

  return (
    <header className="top">
      <div className="toprow">
        <h1 className="h3">{TITLES[route] || ''}</h1>
        <div className="hgroup">
          <button className="hbtn" data-go="assets">
            <Ico html={I.rub} />
            <span className="mono">{nf(m.pool)}</span>
          </button>

          <span className="pop-wrap">
            <button className="hbtn sq" data-pop="notif">
              <Ico className="i3" html={I.bell} />
              {!!n && <span className="bdg">{n > 99 ? '99+' : n}</span>}
            </button>
            {pop === 'notif' && <Raw html={notifications()} />}
          </span>

          <span className="pop-wrap">
            <button className={`hbtn ${pop === 'acct' ? 'open' : ''}`} data-pop="acct">
              {route === 'monitor' ? 'Сводка по аккаунтам (46)' : acct}
              <Ico html={I.cd} />
            </button>
            {pop === 'acct' && <Raw html={acctSummary(m)} />}
          </span>

          <span className="pop-wrap">
            <button className={`hbtn tight ${pop === 'user' ? 'open' : ''}`} data-pop="user">
              <Ico className="i3" html={I.user} />
              <Ico html={I.cd} />
            </button>
            {pop === 'user' && (
              <div className="pop" style={{ minWidth: 280 }}>
                <div className="phead">
                  <span className="avat">{acct[0].toUpperCase()}</span>
                  <span className="uname">
                    <b>{acct}<button className="lnk" style={{ color: 'var(--accent)' }} data-copy={acct}>
                      <Ico html={I.cp} /></button></b>
                    <i>Иванов Иван</i>
                  </span>
                </div>
                {PROF.map(([id, t, ic]) => (
                  <button data-go={id} key={id}><Ico className="i3" html={I[ic]} />{t}</button>
                ))}
                <div className="hr" />
                <button data-modal="settings"><Ico className="i3" html={I.gear} />Настройки</button>
                <div className="hr" />
                <button data-modal="logout"><Ico className="i3" html={I.out} />Выйти</button>
              </div>
            )}
          </span>
        </div>
      </div>
      {PROFILE_ROUTES.includes(route) && <Raw html={profTabs(route === 'notifconfig' ? 'notifsettings' : route, m)} />}
    </header>
  )
}
