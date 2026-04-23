import { useEffect, useMemo, useState } from 'react'
import StoreCategorySidebar from '../../components/store/StoreCategorySidebar'
import { getAllCategories } from '../../services/categoryService'
import type { Category } from '../../types/category'

export default function StoreHomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  useEffect(() => {
    void loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoadingCategories(true)
      setError(null)
      const data = await getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las categorías.'
      )
    } finally {
      setLoadingCategories(false)
    }
  }

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === null) return null
    return categories.find((category) => category.id === selectedCategoryId) ?? null
  }, [categories, selectedCategoryId])

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Food Store</h1>
            <p className="mt-2 text-slate-500">
              Explora el catálogo navegando por categorías.
            </p>
          </div>

          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
            {selectedCategory
              ? `Categoría seleccionada: ${selectedCategory.denominacion}`
              : 'Mostrando todas las categorías'}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <StoreCategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          loading={loadingCategories}
          onSelectCategory={setSelectedCategoryId}
        />

        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedCategory
                ? selectedCategory.denominacion
                : 'Explorar todas las categorías'}
            </h2>

            <p className="mt-2 text-slate-500">
              {selectedCategory
                ? selectedCategory.descripcion || 'Esta categoría no tiene descripción.'
                : 'Selecciona una categoría desde la barra lateral para navegar el store.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              Navegación del store
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {(selectedCategory ? [selectedCategory] : categories).map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-medium text-sky-700">
                    Categoría #{category.id}
                  </p>

                  <h4 className="mt-2 text-lg font-bold text-slate-800">
                    {category.denominacion}
                  </h4>

                  <p className="mt-2 text-sm text-slate-500">
                    {category.descripcion || 'Sin descripción disponible.'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    Ver categoría
                  </button>
                </div>
              ))}
            </div>

            {!loadingCategories && categories.length === 0 && (
              <p className="mt-4 text-slate-500">
                Primero crea categorías desde el panel admin para poder mostrarlas en la tienda.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}