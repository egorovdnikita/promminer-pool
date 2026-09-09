/** Оси сценария — то, что попадает в ссылку. */
export interface Scenario {
  coin: string
  data: string
  health: string
  role: string
  tier: string
  verif: string
  notif: string
  acct: string
}

/** Эфемерное состояние интерфейса — в ссылку не попадает. */
export interface Ui {
  seg: Record<string, number>
  sort: Record<string, { k: string; d: number } | null>
  page: Record<string, number>
  sel: Set<number>
  q: string
  wfilter: string
  geo: string
  wk: any
  qfocus: boolean
  auth: string
  consent: Set<number>
  theme: 'light' | 'dark'
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
