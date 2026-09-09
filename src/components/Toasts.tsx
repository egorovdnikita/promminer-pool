import { useApp } from '@/state/store'

export function Toasts() {
  const { toasts } = useApp()
  return (
    <div id="toasts">
      {toasts.map((t) => <div className="toast in" key={t.id}>{t.msg}</div>)}
    </div>
  )
}
