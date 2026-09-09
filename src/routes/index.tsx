import { createFileRoute } from '@tanstack/react-router'
import { Screen } from '@/components/Screen'
import { useModel } from '@/state/store'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <Screen m={useModel()} />
}
