import { useState } from 'react'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import StoreHomePage from './pages/store/StoreHomePage'

type ViewMode = 'store' | 'admin-categories'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('store')

  const categories = [
    { name: 'Pizzas', emoji: '🍕', color: 'from-yellow-400 to-orange-500' },
    { name: 'Hamburguesas', emoji: '🍔', color: 'from-red-400 to-orange-500' },
    { name: 'Sándwiches', emoji: '🥪', color: 'from-orange-400 to-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-orange-200 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-extrabold text-orange-600">
            🍔 FastFood Delivery
          </h1>

          <nav className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode('store')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                viewMode === 'store'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => setViewMode('store')}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-orange-100"
            >
              Menú
            </button>

            <button
              type="button"
              onClick={() => setViewMode('store')}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-orange-100"
            >
              Ofertas
            </button>

            <button
              type="button"
              onClick={() => setViewMode('admin-categories')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                viewMode === 'admin-categories'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              Admin categorías
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SOLO EN STORE */}
      {viewMode === 'store' && (
        <>
          <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 p-10 text-white shadow-xl">
              <h2 className="mb-3 text-4xl font-bold">
                Pedí lo que quieras, cuando quieras 🍕🍔🥪
              </h2>
              <p className="text-lg text-white/90">
                Las mejores pizzas, hamburguesas y sándwiches en minutos en tu casa.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('store')}
                  className="rounded-xl bg-white px-5 py-2 font-semibold text-orange-600 transition hover:bg-gray-100"
                >
                  Ver menú
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('store')}
                  className="rounded-xl bg-black/20 px-5 py-2 font-semibold transition hover:bg-black/30"
                >
                  Ofertas del día
                </button>
              </div>
            </div>
          </section>

          {/* CATEGORÍAS VISUALES SOLO EN STORE */}
          <section className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={'cursor-pointer rounded-2xl bg-gradient-to-r ' + cat.color + ' p-6 text-white shadow-lg transition-transform hover:scale-105'}
              >
                <div className="mb-2 text-4xl">{cat.emoji}</div>
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <p className="text-sm text-white/90">
                  Ver opciones deliciosas de {cat.name.toLowerCase()}
                </p>
              </div>
            ))}
          </section>
        </>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {viewMode === 'store' ? <StoreHomePage /> : <AdminCategoriesPage />}
      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-orange-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FastFood Delivery — Hecho con 🍕 en Rosario
        </div>
      </footer>
    </div>
  )
}

export default App