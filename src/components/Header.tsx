import {
  ACCOUNTS, I, NOTIF_N, PROF, TITLES, acctSummary, nf, notifications, type Model,
} from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico, Raw } from './Raw'

/* Хедер по DS: белая панель, снизу radius-l 24, padding 20/8, ряд px16 gap16.
   Контролы h48, border 1px, radius-m 16, без тени. Заголовок H3 32/38 SemiBold. */
export function Header({ m }: { m: Model }) {
  const { S, route, pop } = useApp()
  const n = NOTIF_N[S.notif]
  const acct = S.acct === 'main' ? 'natarusso' : 'alfred'

  return (
    <header className="top">
      <div className="toprow">
        <h1 className="h3">{TITLES[route] || ''}</h1>
        <div className="hgroup">
          <span className="pop-wrap">
            <button className="hbtn" data-pop="bal">
              <Ico html={I.rub} />
              <span className="mono">{nf(m.pool)}</span>
            </button>
            {pop === 'bal' && <Raw html={acctSummary(m)} />}
          </span>

          <button className="hbtn sq" data-theme-toggle title="Светлая / тёмная тема">
            <Ico className="i3" html={I.moon} />
          </button>

          <span className="pop-wrap">
            <button className="hbtn sq" data-pop="notif">
              <Ico className="i3" html={I.bell} />
              {!!n && <span className="bdg">{n > 99 ? '99+' : n}</span>}
            </button>
            {pop === 'notif' && <Raw html={notifications()} />}
          </span>

          <span className="pop-wrap">
            <button className="hbtn" data-pop="acct">
              {route === 'monitor' ? 'Сводка по аккаунтам (46)' : acct}
              <Ico html={I.cd} />
            </button>
            {pop === 'acct' && (
              <div className="pop">
                <b className="ph">Аккаунты</b>
                {ACCOUNTS.map((a, i) => (
                  <button className={a === acct ? 'on' : ''} data-acct={i === 0 ? 'main' : 'sub'} key={a}>
                    {a}{i === 0 ? ' · основной' : ''}
                  </button>
                ))}
                <div className="hr" />
                <button data-go="subaccounts"><Ico html={I.pl} />Управление суб-аккаунтами</button>
                <button data-go="monitor"><Ico html={I.bars} />Сводка по аккаунтам</button>
              </div>
            )}
          </span>

          <span className="pop-wrap">
            <button className="hbtn tight" data-pop="user">
              <Ico className="i3" html={I.user} />
              <Ico html={I.cd} />
            </button>
            {pop === 'user' && (
              <div className="pop" style={{ minWidth: 280 }}>
                <div className="phead">
                  <span className="avat">{acct[0].toUpperCase()}</span>
                  <b style={{ fontSize: 18, fontWeight: 600 }}>{acct}</b>
                  <button className="spacer lnk" style={{ color: 'var(--accent)' }} data-copy={acct}>
                    <Ico html={I.cp} />
                  </button>
                </div>
                {PROF.map(([id, t, ic]) => (
                  <button data-go={id} key={id}><Ico className="i3" html={I[ic]} />{t}</button>
                ))}
                <div className="hr" />
                <button data-toast="Раздел настроек в работе"><Ico className="i3" html={I.gear} />Настройки</button>
                <div className="hr" />
                <button data-go="auth"><Ico className="i3" html={I.out} />Выйти</button>
              </div>
            )}
          </span>
        </div>
      </div>
    </header>
  )
}
