import { GROUP_OF, I, LINKS, LOGO, NAV } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Ico } from './Raw'

export function Sidebar() {
  const { route, openGroups } = useApp()

  return (
    <aside className="sb">
      <div className="logo" dangerouslySetInnerHTML={{ __html: LOGO }} />
      <nav className="nav">
        {NAV.map((o) => {
          if (o.kids) {
            const active = GROUP_OF[route] === o.g
            const open = openGroups[o.g!] || active
            return (
              <div className="slot" key={o.g}>
                <button className={`ni ${open ? 'open' : ''} ${active ? 'act' : ''}`} data-grp={o.g}>
                  <Ico className="nic" html={I[o.ic]} />
                  <span className="lbl">{o.t}</span>
                  <Ico className="chev lbl" html={I.cd} />
                </button>
                {open && (
                  <div className="kids">
                    {o.kids.map(([id, t]) => (
                      <button className={`kid ${route === id ? 'on' : ''}`} data-go={id} key={id}>{t}</button>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <button className={`ni ${route === o.id ? 'on' : ''}`} data-go={o.id} key={o.id}>
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
          <Ico className="spacer lbl nic" html={I.ext} />
        </a>
      </div>
      <button className="mini-btn" data-mini>
        <Ico className="nic" html={I.cl} />
        <span className="lbl">Свернуть</span>
      </button>
    </aside>
  )
}
