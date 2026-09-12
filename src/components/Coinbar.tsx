import { AXES, CHECK, COIN_ICON, I, type Model } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico } from './Raw'

const WITH_COIN = ['home', 'workers', 'income', 'payouts', 'calc', 'monitor', 'ref']

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
          <div className="pop left" style={{ minWidth: 190 }}>
            {AXES.coin.opts.map(([v, t]) => (
              <button className={S.coin === v ? 'on' : ''} data-axis="coin" data-val={v} key={v}>
                <Ico html={COIN_ICON[v === 'btc' ? 'BTC' : v === 'zec' ? 'ZEC' : 'LTC']} />
                {t}
                {S.coin === v && <Ico className="ck" html={CHECK} />}
              </button>
            ))}
          </div>
        )}
      </span>

      {route === 'workers' && S.role === 'owner' && (
        <>
          <div className="spacer" />
          <button className="btn w sm">Серийные номера<Ico html={I.cv} /></button>
          <button className="btn sm" data-modal="connect"><Ico html={I.pl} />Подключить воркера</button>
        </>
      )}
      {route === 'home' && <span className="spacer rate mono">{m.c.rate}</span>}
    </div>
  )
}
