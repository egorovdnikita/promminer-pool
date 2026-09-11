import {
  createContext, useCallback, useContext, useEffect, useReducer, useRef,
  type ReactNode,
} from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { DEF, PRESETS, GROUP_OF, M, applyState, workersList, workersRows } from '@/legacy/prototype'
import type { AppSnapshot, Scenario, Ui } from './types'

const HOME = 'home'
export const pathOf = (route: string) => (route === HOME ? '/' : '/' + route)
export const routeOf = (pathname: string) => pathname.replace(/^\/+|\/+$/g, '') || HOME

const freshUi = (): Ui => ({
  seg: {}, sort: {}, page: {}, sel: new Set(), q: '', wfilter: 'all', geo: '',
  wk: null, qfocus: false, auth: 'login', consent: new Set(), arch: false, sub: '', theme: 'light', step: 0,
})

/** Сценарий из хэша ссылки, иначе из localStorage, иначе дефолт. */
function loadScenario(): Scenario {
  let s = location.hash.slice(1)
  if (!s) { try { s = localStorage.getItem('pm') || '' } catch { /* приватный режим */ } }
  const q = new URLSearchParams(s)
  const out = { ...DEF }
  for (const k of Object.keys(DEF) as (keyof Scenario)[]) {
    const v = q.get(k)
    if (v) out[k] = v
  }
  return out
}

interface Ctx {
  S: Scenario
  U: Ui
  route: string
  pop: string | null
  modal: string | null
  openGroups: Record<string, boolean>
  mini: boolean
  panel: boolean
  toasts: { id: number; msg: string }[]
  /** Делегированный обработчик: разбирает data-атрибуты, как в архивном прототипе. */
  onClick: (e: React.MouseEvent) => void
  onInput: (e: React.FormEvent) => void
  toast: (msg: string) => void
  go: (route: string) => void
  /** Копия состояния для движка прототипа. */
  snapshot: AppSnapshot
}

const AppCtx = createContext<Ctx | null>(null)

export function useApp(): Ctx {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp вне AppProvider')
  return ctx
}

/** Модель текущего сценария — движок читает состояние, отданное через applyState. */
export function useModel() {
  const { snapshot } = useApp()
  applyState(snapshot)
  return M()
}

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const route = routeOf(pathname)

  const [, bump] = useReducer((x: number) => x + 1, 0)
  const S = useRef<Scenario>(loadScenario())
  const U = useRef<Ui>(freshUi())
  const pop = useRef<string | null>(null)
  const modal = useRef<string | null>(null)
  const openGroups = useRef<Record<string, boolean>>({ fin: false, tools: false, ref: false })
  const mini = useRef(false)
  const panel = useRef(false)
  const toasts = useRef<{ id: number; msg: string }[]>([])
  const toastId = useRef(0)

  const go = useCallback((r: string) => {
    pop.current = null
    modal.current = null
    const g = GROUP_OF[r]
    if (g) openGroups.current[g] = true
    navigate({ to: pathOf(r) })
    scrollTo(0, 0)
  }, [navigate])

  const toast = useCallback((msg: string) => {
    if (!msg) return
    const id = ++toastId.current
    toasts.current = [...toasts.current, { id, msg }]
    bump()
    setTimeout(() => { toasts.current = toasts.current.filter((t) => t.id !== id); bump() }, 2600)
  }, [])

  /* Сценарий живёт в хэше — ссылку можно отправить команде. */
  useEffect(() => {
    const q = new URLSearchParams({ ...S.current })
    history.replaceState(null, '', location.pathname + '#' + q)
    try { localStorage.setItem('pm', q.toString()) } catch { /* приватный режим */ }
  })

  useEffect(() => { document.body.classList.toggle('mini', mini.current) })
  useEffect(() => {
    const t = U.current.theme
    const eff = t === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t
    document.documentElement.setAttribute('data-theme', eff)
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modal.current) { modal.current = null; bump() }
        else if (pop.current) { pop.current = null; bump() }
        else if (panel.current) { panel.current = false; bump() }
      }
      const tag = (e.target as HTMLElement)?.tagName || ''
      if ((e.key === 's' || e.key === 'ы') && !/input|textarea/i.test(tag)) {
        panel.current = !panel.current
        bump()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const onInput = useCallback((e: React.FormEvent) => {
    const q = (e.target as HTMLElement).closest('#q') as HTMLInputElement | null
    if (q) { U.current.q = q.value; U.current.page.workers = 1; U.current.qfocus = true; bump() }
    const sq = (e.target as HTMLElement).closest('#scq') as HTMLInputElement | null
    if (sq) { U.current.scq = sq.value; bump() }
  }, [])

  const snapshot = useCallback((): AppSnapshot => ({
    S: S.current, U: U.current, route,
    pop: pop.current, modal: modal.current,
    openGroups: openGroups.current, mini: mini.current,
  }), [route])

  const onClick = useCallback((e: React.MouseEvent) => {
    const t = e.target as HTMLElement
    const at = (sel: string) => t.closest(sel) as HTMLElement | null
    const u = U.current

    const au = at('[data-auth]')
    if (au) { u.auth = au.dataset.auth!; u.consent.clear(); return bump() }
    const ach = at('[data-acheck]')
    if (ach) { const i = +ach.dataset.acheck!; u.consent.has(i) ? u.consent.delete(i) : u.consent.add(i); return bump() }
    const a2 = at('[data-auth2]')
    if (a2 && a2.dataset.auth2) {
      const n = a2.dataset.auth2
      if (n === 'done') { u.auth = 'login'; go(HOME); toast('Готово') } else { u.auth = n }
      return bump()
    }
    const si = at('[data-subinfo]')
    if (si) { u.sub = si.dataset.subinfo!; modal.current = 'subinfo'; return bump() }
    const nt = at('[data-note]')
    if (nt) { u.note = Number(nt.dataset.note); modal.current = 'noteinfo'; pop.current = null; return bump() }
    const th = at('[data-theme-set]')
    if (th) {
      const v = th.dataset.themeSet!
      /* «Как в системе» — берём предпочтение ОС, но помним сам выбор */
      u.theme = v as Ui['theme']
      const eff = v === 'system'
        ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : v
      document.documentElement.setAttribute('data-theme', eff)
      return bump()
    }
    if (at('[data-arch]')) { u.arch = !u.arch; return bump() }
    const sg = at('[data-seg]')
    if (sg) { u.seg[sg.dataset.seg!] = +sg.dataset.i!; return bump() }
    const wf = at('[data-wf]')
    if (wf) { u.wfilter = wf.dataset.wf!; u.page.workers = 1; return bump() }
    const sk = at('[data-sortk]')
    if (sk) {
      const k = sk.dataset.sortk!, s = u.sort.workers
      u.sort.workers = s && s.k === k ? (s.d > 0 ? { k, d: -1 } : null) : { k, d: 1 }
      return bump()
    }
    const pg = at('[data-page]')
    if (pg && !(pg as HTMLButtonElement).disabled) { u.page[pg.dataset.page!] = +pg.dataset.p!; return bump() }
    const sl = at('[data-sel]')
    if (sl) { const id = +sl.dataset.sel!; u.sel.has(id) ? u.sel.delete(id) : u.sel.add(id); return bump() }
    if (at('[data-selall]')) {
      applyState(snapshot())
      const rows = workersRows(M()), per = 10
      const pages = Math.max(1, Math.ceil(rows.length / per))
      const cur = Math.min(u.page.workers || 1, pages)
      const page = rows.slice((cur - 1) * per, cur * per)
      const on = page.every((w: any) => u.sel.has(w.id))
      page.forEach((w: any) => (on ? u.sel.delete(w.id) : u.sel.add(w.id)))
      return bump()
    }
    if (at('[data-selclear]')) { u.sel.clear(); return bump() }
    const geo = at('[data-geo]')
    if (geo) { u.geo = geo.dataset.geo === 'Все' ? '' : geo.dataset.geo!; u.page.workers = 1; return bump() }
    const tf = at('[data-tilef]')
    if (tf) { u.wfilter = tf.dataset.tilef!; u.page.workers = 1; go('workers'); return bump() }
    const cp = at('[data-copy]')
    if (cp) { navigator.clipboard?.writeText(cp.dataset.copy!); return toast('Скопировано') }
    const wk = at('[data-wk]')
    if (wk) {
      applyState(snapshot())
      u.wk = workersList(M()).find((w: any) => w.id === +wk.dataset.wk!) || null
      go('worker')
      return bump()
    }
    if (at('[data-readall]')) { S.current.notif = 'none'; pop.current = null; bump(); return toast('Все уведомления отмечены как прочитанные') }
    const st = at('[data-step]')
    if (st) { u.step = +st.dataset.step!; return bump() }
    const md = at('[data-modal]')
    if (md) { modal.current = md.dataset.modal!; u.step = 0; u.vfile = false; u.vbank = undefined; pop.current = null; return bump() }
    const tst = at('[data-toast]')
    /* Ось сценария применяем до закрытия: кнопки модалок несут и data-axis,
       и data-close, а ветка закрытия выходит из обработчика. */
    const ax = at('[data-axis]')
    if (ax) {
      (S.current as any)[ax.dataset.axis!] = ax.dataset.val
      pop.current = null
      if (!ax.hasAttribute('data-close')) return bump()
    }
    const cl = at('[data-close]')
    /* Маска тоже помечена data-close, но закрывать по ней нужно только при клике
       мимо окна — иначе модалка схлопывается от клика по любому полю внутри. */
    if (cl && (!cl.classList.contains('mask') || t === cl)) {
      modal.current = null; bump(); if (tst) toast(tst.dataset.toast!); return
    }
    if (tst) return toast(tst.dataset.toast!)
    const gt = at('[data-go]')
    if (gt) { go(gt.dataset.go!); return bump() }
    const gp = at('[data-grp]')
    if (gp) { const g = gp.dataset.grp!; openGroups.current[g] = !openGroups.current[g]; return bump() }
    const ac = at('[data-acct]')
    if (ac) { S.current.acct = ac.dataset.acct!; pop.current = null; return bump() }
    const pp = at('[data-pop]')
    if (pp) { pop.current = pop.current === pp.dataset.pop ? null : pp.dataset.pop!; return bump() }
    const eye = at('[data-eye]')
    if (eye) {
      const inp = eye.closest('.inp, .afield')?.querySelector('input') as HTMLInputElement | null
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password'
      eye.classList.toggle('on')
      return
    }
    /* Крестик в поле анкеты — очищает значение */
    const clr = at('[data-clear]')
    if (clr) {
      const inp = clr.closest('.inp')?.querySelector('input') as HTMLInputElement | null
      if (inp) { inp.value = ''; inp.focus() }
      return
    }
    /* Выписка в модалке: зона загрузки прикладывает файл, «Удалить» убирает */
    const vf = at('[data-vfile]')
    if (vf) { U.current.vfile = vf.dataset.vfile !== 'off'; return bump() }
    const vb = at('[data-vbank]')
    if (vb) { U.current.vbank = vb.dataset.vbank!; pop.current = null; return bump() }
    const tg = at('[data-tog]')
    if (tg) { tg.classList.toggle('on'); return }
    if (at('[data-mini]')) { mini.current = !mini.current; document.body.classList.toggle('mini', mini.current); return bump() }
    if (at('[data-panel]')) { panel.current = !panel.current; return bump() }
    const pr = at('[data-preset]')
    if (pr) {
      const found = PRESETS.find(([n]) => n === pr.dataset.preset)
      if (found) { S.current = { ...DEF, ...found[2] }; modal.current = null; toast(`Сценарий «${found[0]}»`) }
      return bump()
    }
    if (at('[data-reset]')) { S.current = { ...DEF }; modal.current = null; go(HOME); return bump() }
    if (at('[data-copylink]')) { navigator.clipboard?.writeText(location.href); return toast('Ссылка скопирована') }
    if (pop.current && !at('.pop-wrap')) { pop.current = null; bump() }
  }, [go, toast, snapshot])

  const snap = snapshot()
  applyState(snap)
  const value: Ctx = {
    ...snap,
    panel: panel.current,
    toasts: toasts.current,
    onClick, onInput, toast, go,
    snapshot: snap,
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
