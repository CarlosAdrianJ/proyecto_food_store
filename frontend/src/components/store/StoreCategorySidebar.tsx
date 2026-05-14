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
    <aside className="w-full rounded-3xl bg-gradient-to-b from-yellow-100 via-orange-100 to-red-100 p-5 shadow-lg lg:w-72">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-orange-900">Categorías</h2>
        <p className="text-sm text-orange-700">
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
            className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-shadow shadow-sm ${
              selectedCategoryId === null
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                : 'bg-white/90 text-orange-800 hover:bg-orange-100 hover:text-orange-900'
            }`}
          >
            Todas
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-shadow shadow-sm ${
                selectedCategoryId === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                  : 'bg-white/90 text-orange-800 hover:bg-orange-100 hover:text-orange-900'
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
