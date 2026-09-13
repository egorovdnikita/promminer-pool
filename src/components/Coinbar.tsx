import { Fragment } from 'react'
import { AXES, CHECK, COIN_ICON, I, coinsOf, type Model } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico } from './Raw'

/* у калькулятора доходности монета выбирается внутри панели (макет 5:3779) */
const WITH_COIN = ['home', 'workers', 'income', 'payouts', 'ref', 'summary', 'sumworkers', 'sumincome']

export function Coinbar({ m }: { m: Model }) {
  const { S, route, pop } = useApp()
  if (!WITH_COIN.includes(route)) return null

  return (
    <div className="subbar">
      <span className="pop-wrap">
        <button className="pill" data-pop="coin">
          <Ico html={COIN_ICON[m.bal[0].s]} />
          {m.c.label}
          <Ico html={I.cd} />
        </button>
        {pop === 'coin' && (
          <div className="pop left menu coinmenu">
            {/* у наблюдателя в списке только монеты его ссылки (28:44088) */}
            {AXES.coin.opts.filter(([v]) => !coinsOf() || coinsOf()!.has(v)).map(([v], i) => {
              /* в меню короткий символ монеты, как в макете (357:98871) */
              const sym = v === 'btc' ? 'BTC' : v === 'zec' ? 'ZEC' : 'LTC'
              return (
                <Fragment key={v}>
                  {i > 0 && <div className="mdiv" />}
                  <button className={S.coin === v ? 'on' : ''} data-axis="coin" data-val={v}>
                    <Ico html={COIN_ICON[sym]} />
                    {sym}
                    {S.coin === v && <Ico className="ck" html={CHECK} />}
                  </button>
                </Fragment>
              )
            })}
          </div>
        )}
      </span>

      {route === 'workers' && S.role === 'owner' && (
        <>
          <div className="spacer" />
          {/* На пустом парке остаётся только подключение (макет 1228:149263) */}
          {!m.empty && <button className="btn w" data-go="serials">Серийные номера<Ico html={I.cv} /></button>}
          <button className="btn" data-modal="connect"><Ico html={I.pl} />Подключить воркер</button>
        </>
      )}
      {route === 'home' && <span className="spacer rate mono">{m.c.rate}</span>}
    </div>
  )
}
