import { allowed, GROUP_OF, I, LINKS, LOGO, NAV } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico } from './Raw'

export function Sidebar() {
  const { route, openGroups, mini } = useApp()
  /* У наблюдателя в сайдбаре только разрешённые разделы (макеты 189:154154…) */
  const ok = allowed()
  /* «Серийные номера» и деталка живут внутри «Воркеров» — подсвечиваем их */
  const act = route === 'serials' || route === 'worker' ? 'workers' : route
  const nav = ok
    ? NAV.map((o) =>
        o.kids ? { ...o, kids: o.kids.filter(([id]) => ok.has(id)) } : o,
      ).filter((o) => (o.kids ? o.kids.length > 0 : ok.has(o.id!)))
    : NAV

  return (
    <aside className="sb">
      <div className="logo" dangerouslySetInnerHTML={{ __html: LOGO }} />
      <nav className="nav">
        {nav.map((o) => {
          if (o.kids) {
            const active = GROUP_OF[route] === o.g
            const open = openGroups[o.g!] || active
            return (
              <div className="ngroup" key={o.g}>
                <button className={`ni ${open ? 'open' : ''} ${active ? 'act' : ''}`} data-grp={o.g}>
                  <Ico className="nic" html={I[o.ic]} />
                  <span className="lbl">{o.t}</span>
                  <Ico className="chev lbl" html={I.cd} />
                </button>
                {(open || mini) && (
                  <div className="kids">
                    {o.kids.map(([id, t]) => (
                      <button className={`kid ${act === id ? 'on' : ''}`} data-go={id} key={id}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <button className={`ni ${act === o.id ? 'on' : ''}`} data-go={o.id} key={o.id}>
              <Ico className="nic" html={I[o.ic]} />
              <span className="lbl">{o.t}</span>
            </button>
          )
        })}
      </nav>
      <div className="sep" />
      <div style={{ padding: '0 12px' }}>
        <a className="ni" href={LINKS.kb} target="_blank" rel="noopener">
          <Ico className="nic" html={I.book} />
          <span className="lbl">База знаний</span>
          <Ico className="spacer lbl ico" html={I.ext} />
        </a>
      </div>
      <button className="mini-btn" data-mini>
        <Ico className="nic" html={mini ? I.cv : I.cl} />
        <span className="lbl">Свернуть</span>
      </button>
    </aside>
  )
}
