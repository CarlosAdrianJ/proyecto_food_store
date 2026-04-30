import { useEffect, useState } from 'react'
import DeleteProductModal from '../../components/products/DeleteProductModal'
import ProductModal from '../../components/products/ProductModal'
import { getAllCategories } from '../../services/categoryService'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../../services/productService'
import type { Category } from '../../types/category'
import type { Product, ProductCreate, ProductEdit } from '../../types/product'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los productos.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function handleOpenCreate() {
    setSelectedProduct(null)
    setModalMode('create')
    setModalOpen(true)
  }

  function handleOpenEdit(product: Product) {
    setSelectedProduct(product)
    setModalMode('edit')
    setModalOpen(true)
  }

  function handleOpenDelete(product: Product) {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  async function handleSubmitProduct(payload: ProductCreate | ProductEdit) {
    try {
      setIsSubmitting(true)
      setError(null)

      if (modalMode === 'create') {
        await createProduct(payload)
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload)
      }

      setModalOpen(false)
      setSelectedProduct(null)
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el producto.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      setError(null)
      await deleteProduct(productToDelete.id)
      setDeleteModalOpen(false)
      setProductToDelete(null)
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el producto.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Administración de productos
            </h1>
            <p className="mt-1 text-slate-500">
              Alta, edición y eliminación lógica de productos.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-xl bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
            disabled={categories.length === 0}
          >
            Nuevo producto
          </button>
        </div>

        {categories.length === 0 && !loading && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
            Primero crea categorías antes de crear productos.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Tabla de productos
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-slate-500">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="px-6 py-8 text-slate-500">
              No hay productos registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Disponible
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800">
                          {product.denominacion}
                        </div>
                        <div className="text-sm text-slate-500">
                          {product.descripcion || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.categoriaDenominacion}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        ${product.precio.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.disponible
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {product.disponible ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleOpenDelete(product)}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductModal
          mode={modalMode}
          product={selectedProduct}
          categories={categories}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (isSubmitting) return
            setModalOpen(false)
            setSelectedProduct(null)
          }}
          onSubmit={handleSubmitProduct}
        />
      )}

      {deleteModalOpen && productToDelete && (
        <DeleteProductModal
          productName={productToDelete.denominacion}
          isDeleting={isDeleting}
          onClose={() => {
            if (isDeleting) return
            setDeleteModalOpen(false)
            setProductToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  )
}