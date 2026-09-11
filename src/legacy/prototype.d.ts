/** Типы для движка прототипа (src/legacy/prototype.js). */
import type { AppSnapshot, Scenario, Ui } from '@/state/types'

export interface Axis { label: string; g: string; opts: [string, string][] }
export interface NavItem { id?: string; t: string; ic: string; g?: string; kids?: [string, string][] }
/** Модель текущего сценария: балансы, хэшрейт, здоровье парка, строки таблиц. */
export type Model = any

export declare const AXES: Record<keyof Scenario, Axis>
/** Готовые связки состояний для панели: имя, пояснение, набор осей. */
export declare const PRESETS: [string, string, Partial<Scenario>][]
export declare const DEF: Scenario
export declare const COINS: Record<string, any>
export declare const HEALTH: Record<string, { a: number; l: number; o: number; f: number }>
export declare const TIERS: { p: string; n: string; c: string }[]
export declare const NOTIF_N: Record<string, number>
export declare const ACCOUNTS: string[]
export declare function M(): Model

export declare function nf(v: number | string, d?: number): string
export declare function ni(v: number | string): string
/** Дробная сумма без хвостовых нулей, до `max` знаков. */
export declare function dec(v: number, max?: number): string
export declare function rng(seed: number): () => number
export declare function sv(path: string, w?: number): string

export declare const I: Record<string, string>
export declare const D: string
export declare const DOCS: Record<string, string>
export declare const LINKS: Record<string, any>
export declare const CONSENTS: any[]
export declare const LOGO: string
export declare const COIN_ICON: Record<string, string>
export declare const GOOGLE: string
export declare const USD_ICON: string

export declare const NAV: NavItem[]
export declare const TITLES: Record<string, string>
export declare const GROUP_OF: Record<string, string>

export declare function card(inner: string, cls?: string): string
export declare function emptyBox(title: string, text: string): string
export declare function seg(id: string, opts: string[], def?: number): string
export declare function segv(id: string, opts: string[], def?: number): string
export declare function segLine(id: string, opts: string[], def?: number, cls?: string): string
export declare function segi(id: string, def?: number): number
export declare function pageSlice(pid: string, total: number, per?: number): [number, number]
/** Checkbox дизайн-системы. cls: 'ind' (частично), 'err', 'dis'. */
export declare function cb(on: boolean, attr?: string, cls?: string): string
/** Radio дизайн-системы. cls: 'dis'. */
export declare function rd(on: boolean, attr?: string, cls?: string): string
/** Status дизайн-системы: точка + подпись. */
export declare function status(t: 'ok'|'err'|'warn'|'off', label: string): string
/** Инлайн-галка 12×12 для пунктов меню и чекбоксов. */
export declare const CHECK: string
export declare function pager(id: string, total: number, per?: number): string
export declare function chart(m: Model, opts?: any): string
/** Скелетон загрузки страницы. */
export declare function skeleton(): string
/** Календарь дизайн-системы; sel — подсвеченные числа. */
export declare function datePicker(sel?: number[]): string

export declare const V: Record<string, (m: Model) => string>
export declare const MODALS: Record<string, {
  t: string; s?: string; ok?: string; cta?: string; cancel?: string; acts?: false
  steps?: number | ((m: Model) => number)
  b: (m: Model, step: number) => string
  /** Прижатый футер модалки — рисуется вне прокручиваемого тела. */
  foot?: (m: Model, step: number) => string
  /** Иллюстрация в шапке (Modal HeaderA с картинкой). */
  img?: string
  /** Заголовок по центру — как в модалке выхода. */
  center?: boolean
  /** Узкое окно 500 — подтверждения. */
  size?: 'sm'
}>
/** Вкладки профиля — рисуются в шапке. */
export declare function profTabs(cur: string, m: Model): string
export declare function notifications(): string
export declare function acctSummary(m: Model): string
export declare function workersList(m: Model): any[]
export declare function workersRows(m: Model): any[]

export declare const PROF: [string, string, string][]
export declare const SUBS: any[]
export declare const OBSERVERS: any[]
export declare const SESSIONS: any[]
export declare const VERIF_FIELDS: any[]

export declare const S: Scenario
export declare const U: Ui
export declare const route: string
export declare const pop: string | null
export declare const modal: string | null
export declare const openGroups: Record<string, boolean>
export declare const mini: boolean

/** Отдаёт движку текущее состояние React перед рендером экрана. */
export declare function applyState(next: AppSnapshot): void
