import { V, card, skeleton, type Model } from '@/legacy/prototype'
import { useApp } from '@/state/store'
import { Raw } from './Raw'

/** Мост до движка: экран, который ещё не переведён в TSX, приходит строкой. */
export function Screen({ m }: { m: Model }) {
  const { route, S } = useApp()
  if (S.load === 'yes') return <Raw html={skeleton()} />
  const render = V[route]
  const html = render ? render(m) : card('<div class="empty"><b>Экран в работе</b></div>')
  return <Raw html={html} />
}
