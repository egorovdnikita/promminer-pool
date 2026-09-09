import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AppProvider, useApp, useModel } from '@/state/store'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Coinbar } from '@/components/Coinbar'
import { Footer } from '@/components/Footer'
import { Modal } from '@/components/Modal'
import { ScenarioPanel } from '@/components/ScenarioPanel'
import { Toasts } from '@/components/Toasts'
import { Screen } from '@/components/Screen'

export const Route = createRootRoute({ component: RootLayout })

function RootLayout() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}

function Layout() {
  const { route, onClick, onInput } = useApp()
  const m = useModel()

  /* Клики и ввод ловим на корне: экраны и попоуверы размечены data-атрибутами. */
  return (
    <div onClick={onClick} onInput={onInput}>
      {route === 'auth' ? (
        <Screen m={m} />
      ) : (
        <div className="app">
          <Sidebar />
          <main className="main">
            <Header m={m} />
            <div className="page">
              <Coinbar m={m} />
              <Outlet />
              <Footer />
            </div>
          </main>
        </div>
      )}
      <Modal m={m} />
      <ScenarioPanel />
      <Toasts />
    </div>
  )
}
