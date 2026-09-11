/** Оси сценария — то, что попадает в ссылку. */
export interface Scenario {
  coin: string
  data: string
  health: string
  role: string
  tier: string
  verif: string
  notif: string
  subs: string
  obs: string
  name: string
  load: string
  acct: string
  phone: string
  mail: string
  tg: string
  cerr: string
  fa: string
}

/** Эфемерное состояние интерфейса — в ссылку не попадает. */
export interface Ui {
  seg: Record<string, number>
  sort: Record<string, { k: string; d: number } | null>
  /** Индекс уведомления, открытого в модалке. */
  note?: number
  /** Фильтр в панели сценариев. */
  scq?: string
  page: Record<string, number>
  sel: Set<number>
  q: string
  wfilter: string
  geo: string
  wk: any
  qfocus: boolean
  auth: string
  consent: Set<number>
  /** Показывать ли архивные суб-аккаунты. */
  arch: boolean
  /** Имя аккаунта, открытого в карточке. */
  sub: string
  theme: 'light' | 'dark' | 'system'
  step: number
}

export interface AppSnapshot {
  S: Scenario
  U: Ui
  route: string
  pop: string | null
  modal: string | null
  openGroups: Record<string, boolean>
  mini: boolean
}
