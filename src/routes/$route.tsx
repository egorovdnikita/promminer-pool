import { createFileRoute } from '@tanstack/react-router'
import { Screen } from '@/components/Screen'
import { useModel } from '@/state/store'

/** Один динамический маршрут на все разделы: /workers, /profile, /payouts и т.д. */
export const Route = createFileRoute('/$route')({ component: Section })

function Section() {
  return <Screen m={useModel()} />
}
