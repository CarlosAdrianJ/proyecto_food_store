import { useEffect, useMemo, useState } from 'react'
import CartBadge from '../../components/store/CartBadge'
import ProductCard from '../../components/store/ProductCard'
import StoreCategorySidebar from '../../components/store/StoreCategorySidebar'
import { getAllCategories } from '../../services/categoryService'
import {
  getCatalogProducts,
  getCatalogProductsByCategory,
} from '../../services/productService'
import type { Category } from '../../types/category'
import type { Product } from '../../types/product'
import {
  addProductToCart,
  getCartItemsCount,
  subscribeCartUpdates,
} from '../../utils/cartStorage'

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'

export default function StoreHomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setCartCount(getCartItemsCount())
    void loadCategories()

    const unsubscribe = subscribeCartUpdates(() => {
      setCartCount(getCartItemsCount())
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    void loadProducts(selectedCategoryId)
  }, [selectedCategoryId])

  async function loadCategories() {
    try {
      setLoadingCategories(true)
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

  async function loadProducts(categoryId: number | null) {
    try {
      setLoadingProducts(true)
      setError(null)

      const data =
        categoryId === null
          ? await getCatalogProducts()
          : await getCatalogProductsByCategory(categoryId)

      setProducts(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los productos del catálogo.'
      )
    } finally {
      setLoadingProducts(false)
    }
  }

  function handleAddToCart(product: Product) {
    addProductToCart(product)
    setCartCount(getCartItemsCount())
  }

  const visibleProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    let filtered = [...products]

    if (searchValue) {
      filtered = filtered.filter((product) => {
        const denominacion = product.denominacion.toLowerCase()
        const descripcion = (product.descripcion || '').toLowerCase()
        const categoria = product.categoriaDenominacion.toLowerCase()

        return (
          denominacion.includes(searchValue) ||
          descripcion.includes(searchValue) ||
          categoria.includes(searchValue)
        )
      })
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.denominacion.localeCompare(b.denominacion)
        case 'name-desc':
          return b.denominacion.localeCompare(a.denominacion)
        case 'price-asc':
          return a.precio - b.precio
        case 'price-desc':
          return b.precio - a.precio
        default:
          return 0
      }
    })

    return filtered
  }, [products, search, sortBy])

  return (
    <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <StoreCategorySidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        loading={loadingCategories}
        onSelectCategory={setSelectedCategoryId}
      />

      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Catálogo principal
              </h2>
              <p className="mt-1 text-slate-500">
                Busca, filtra y agrega productos al carrito.
              </p>
            </div>

            <CartBadge count={cartCount} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Buscar producto
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, descripción o categoría..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
              >
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
                <option value="price-asc">Precio menor a mayor</option>
                <option value="price-desc">Precio mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {loadingProducts
                ? 'Cargando productos...'
                : `${visibleProducts.length} producto(s) visible(s)`}
            </p>

            {selectedCategoryId && (
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Limpiar filtro de categoría
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loadingProducts ? (
          <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
            Cargando catálogo...
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-slate-500 shadow-sm">
            No se encontraron productos con los filtros actuales.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}