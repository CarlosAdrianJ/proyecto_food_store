import type { Category } from '../../types/category'

type StoreCategorySidebarProps = {
  categories: Category[]
  selectedCategoryId: number | null
  loading: boolean
  onSelectCategory: (categoryId: number | null) => void
}

export default function StoreCategorySidebar({
  categories,
  selectedCategoryId,
  loading,
  onSelectCategory,
}: StoreCategorySidebarProps) {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:w-72">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Categorías</h2>
        <p className="text-sm text-slate-500">
          Navega el store por categoría.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando categorías...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-slate-500">No hay categorías disponibles.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`rounded-xl px-4 py-2 text-left text-sm font-medium transition ${
              selectedCategoryId === null
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`rounded-xl px-4 py-2 text-left text-sm font-medium transition ${
                selectedCategoryId === category.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.denominacion}
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}