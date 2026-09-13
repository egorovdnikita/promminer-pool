/** Оси сценария — то, что попадает в ссылку. */
export interface Scenario {
  coin: string
  data: string
  health: string
  role: string
  perm: string
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
  sess: string
  del: string
  vdoc: string
  vacc: string
  verr: string
  saerr: string
  oerr: string
}

/** Эфемерное состояние интерфейса — в ссылку не попадает. */
export interface Ui {
  seg: Record<string, number>
  sort: Record<string, { k: string; d: number } | null>
  /** Индекс уведомления, открытого в модалке. */
  note?: number
  /** Выписка приложена в модалке «Добавить выписку». */
  vfile?: boolean
  /** Выбранный банк в модалке «Добавить счет». */
  vbank?: string
  /** Показывать в панели только изменённые оси. */
  scdirty?: boolean
  /** Свёрнутые группы осей в панели. */
  scgrp?: string[]
  /** Свои сохранённые сценарии (живут в localStorage). */
  saved?: { name: string; axes: Record<string, string> }[]
  /** Фильтр в панели сценариев. */
  scq?: string
  page: Record<string, number>
  /** Выбранный размер страницы в пагинации. */
  per: Record<string, number>
  sel: Set<number>
  /** Выбранные строки наблюдателей. */
  osel: Set<number>
  /** Отмеченные пункты в форме наблюдателя, ключ «группа:индекс». */
  ochk: Set<string>
  /** Скрытые промо-баннеры сводки. */
  phide: Set<number>
  /** Отличия от умолчания в таблице каналов уведомлений. */
  nch: Record<string, boolean>
  /** Форму наблюдателя уже пытались отправить — показываем ошибки. */
  oval: boolean
  /** Строка наблюдателя, с которой открыли меню или QR. */
  obs?: number
  /** Устройство, чью сессию завершают. */
  sess?: string
  q: string
  wfilter: string
  geo: string
  wk: any
  wtag: Set<number>
  wgrp: Set<number>
  /** Черновик шторки фильтров: выбранные теги и производители. */
  ftag: Set<string>
  fmod: Set<string>
  /** Поиск по моделям внутри шторки. */
  fq: string
  /** Применённая выборка: null, пока фильтры не нажимали. */
  fapp: { t: string[]; m: string[] } | null
  /** «Создать тег» открыли из шторки — вернуться в неё после. */
  fback: boolean
  /** Что выгружаем: 'hours' — часы работы, 'stat' — статистика воркеров. */
  exk: string
  /** Свои группы и теги: null — ещё не собраны из сценария. */
  grp: { n: string; c?: string }[] | null
  tg: { n: string; d?: string; c?: string }[] | null
  /** Выбор в списке групп и тегов — под массовое удаление. */
  gsel: Set<number>
  tsel: Set<number>
  /** Правим запись с этим индексом, иначе создаём новую. */
  ted: number | null
  tname: string
  tdesc: string
  tcol: string
  /** Снимок привязки на открытии — чтобы поймать «выбор не изменился». */
  tbase: string
  /** Правки привязок по id воркера — переживают перерисовку списка. */
  wov: Record<number, { grp?: number[]; tags?: string[] }> | null
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
